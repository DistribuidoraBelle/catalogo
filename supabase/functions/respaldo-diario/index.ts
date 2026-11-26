// ═══════════════════════════════════════════════════════════════════════
// RESPALDO DIARIO — Distribuidora Belle
// Vuelca todas las tablas de la base a archivos .json.gz dentro del bucket
// privado "respaldos", en una carpeta por fecha. Lo dispara pg_cron todas
// las madrugadas, y también se puede correr a mano desde el panel.
//
// La lista de tablas NO está escrita acá: se pide a la base
// (fn_tablas_para_respaldo). Así, si mañana se crea una tabla nueva, entra
// al respaldo sola, sin que nadie se tenga que acordar.
//
// POR TANDAS (2026-11-26). Una función de Supabase tiene 2 segundos de CPU
// por pedido. El respaldo entero (170.000 filas) quedaba justo en el borde:
// algunas noches entraba y otras se moría a la mitad ("CPU Time exceeded")
// y la fila quedaba colgada "en_curso" (18, 19, 25 y 26 de noviembre).
// Ahora cada llamada hace una TANDA chica, anota por dónde va en
// respaldos_log.progreso y le pide a la base que la vuelva a llamar para
// seguir (fn_respaldo_continuar). Si una tanda igual se cae, el vigía de la
// base (fn_respaldo_vigia, cada 5 min) la retoma desde el último punto
// anotado. Además ya no se arma y desarma el JSON de cada página: los bytes
// que devuelve la base se comprimen tal cual, que era lo que más CPU gastaba.
// ═══════════════════════════════════════════════════════════════════════
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const URL_SB  = Deno.env.get("SUPABASE_URL")!;
const KEY_SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Misma puerta que usa el resto del sistema: el secreto del cron, no la
// llave de servicio. Si se filtrara, lo peor que habilita es disparar un
// respaldo de más; con la service_role habilitaría todo.
const SECRETO = Deno.env.get("CRON_SECRET") || "";
const BUCKET  = "respaldos";
const DIAS_QUE_SE_GUARDAN = 30;
const PAGINA = 1000;
const FILAS_POR_PARTE = 5000;            // techo de memoria por archivo
const BYTES_POR_PARTE = 8 * 1024 * 1024; // idem, para tablas de filas gordas
const BYTES_POR_TANDA = 12 * 1024 * 1024; // cuánto lee una llamada antes de pasar la posta
const MS_POR_TANDA    = 40000;

const cab = {
  apikey: KEY_SRV,
  Authorization: `Bearer ${KEY_SRV}`,
  "Content-Type": "application/json",
};
const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

function hoyArg(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

type Progreso = {
  tablas: string[];   // lista fija de tablas de ESTE respaldo
  i: number;          // tabla por la que va
  desde: number;      // filas de esa tabla ya subidas
  parte: number;      // archivos ya subidos de esa tabla
  tb: number;         // bytes comprimidos ya subidos de esa tabla
  pos?: string;       // dónde arrancó la tanda anterior (para detectar atascos)
  veces?: number;     // cuántas tandas seguidas arrancaron en el mismo lugar
};
type Fila = {
  id: number; fecha: string; carpeta: string | null; estado: string; turno: number;
  progreso: Progreso | null; detalle: Array<Record<string, unknown>> | null;
  created_at: string; disparado_por: string | null;
};
class PerdioElTurno extends Error {}

// ── una página de una tabla, como bytes crudos (sin armar el JSON) ──
async function pagina(tabla: string, desde: number): Promise<{ filas: number; cuerpo: Uint8Array; bytes: number }> {
  const r = await fetch(
    `${URL_SB}/rest/v1/${encodeURIComponent(tabla)}?select=*&limit=${PAGINA}&offset=${desde}`,
    { headers: cab },
  );
  if (!r.ok) throw new Error(`${tabla}: HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
  const b = new Uint8Array(await r.arrayBuffer());
  let fin = b.length;
  while (fin > 0 && (b[fin - 1] === 10 || b[fin - 1] === 13 || b[fin - 1] === 32)) fin--;
  // La base siempre contesta una lista: [ ... ]
  if (fin < 2 || b[0] !== 0x5B || b[fin - 1] !== 0x5D) throw new Error(`${tabla}: respuesta inesperada de la base`);
  const cuerpo = b.subarray(1, fin - 1);
  if (cuerpo.length === 0) return { filas: 0, cuerpo, bytes: b.length };
  // Cuántas filas vinieron lo dice la cabecera Content-Range ("0-999/*")
  const m = (r.headers.get("content-range") || "").match(/^(\d+)-(\d+)\//);
  const filas = m
    ? Number(m[2]) - Number(m[1]) + 1
    : (JSON.parse(new TextDecoder().decode(b.subarray(0, fin))) as unknown[]).length;
  return { filas, cuerpo, bytes: b.length };
}

// Junta varias páginas en una sola lista JSON y la comprime
async function gzipTrozos(trozos: Uint8Array[]): Promise<Uint8Array> {
  const piezas: BlobPart[] = ["["];
  trozos.forEach((t, k) => { if (k) piezas.push(","); piezas.push(t); });
  piezas.push("]");
  const flujo = new Blob(piezas).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(flujo).arrayBuffer());
}

async function subir(ruta: string, datos: Uint8Array, tipo: string) {
  const r = await fetch(`${URL_SB}/storage/v1/object/${BUCKET}/${ruta}`, {
    method: "POST",
    headers: {
      apikey: KEY_SRV,
      Authorization: `Bearer ${KEY_SRV}`,
      "Content-Type": tipo,
      "x-upsert": "true",
    },
    body: datos,
  });
  if (!r.ok) throw new Error(`subir ${ruta}: HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
}

// Borra las carpetas viejas: no tiene sentido guardar todo para siempre
async function limpiarViejos(): Promise<number> {
  const r = await fetch(`${URL_SB}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: cab,
    body: JSON.stringify({ prefix: "", limit: 1000, sortBy: { column: "name", order: "asc" } }),
  });
  if (!r.ok) return 0;
  const items = await r.json();
  if (!Array.isArray(items)) return 0;
  const corte = new Date(Date.now() - DIAS_QUE_SE_GUARDAN * 86400000)
    .toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  let borrados = 0;
  for (const it of items) {
    const nom = String(it?.name || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nom) || nom >= corte) continue;
    const lr = await fetch(`${URL_SB}/storage/v1/object/list/${BUCKET}`, {
      method: "POST", headers: cab,
      body: JSON.stringify({ prefix: nom, limit: 1000 }),
    });
    if (!lr.ok) continue;
    const hijos = await lr.json();
    const rutas = (Array.isArray(hijos) ? hijos : []).map((h: any) => `${nom}/${h.name}`);
    if (!rutas.length) continue;
    const dr = await fetch(`${URL_SB}/storage/v1/object/${BUCKET}`, {
      method: "DELETE", headers: cab, body: JSON.stringify({ prefixes: rutas }),
    });
    if (dr.ok) borrados += rutas.length;
  }
  return borrados;
}

// ── anotar el avance. Sólo escribe si el turno sigue siendo el nuestro: si
// otra llamada retomó este respaldo, ésta se baja sola y no pisa nada. ──
async function anotar(id: number, turno: number, datos: Record<string, unknown>) {
  const r = await fetch(`${URL_SB}/rest/v1/respaldos_log?id=eq.${id}&turno=eq.${turno}&select=id`, {
    method: "PATCH",
    headers: { ...cab, Prefer: "return=representation" },
    body: JSON.stringify({ ...datos, actualizado_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`anotar avance: HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
  const f = await r.json();
  if (!Array.isArray(f) || !f.length) throw new PerdioElTurno("otra llamada retomó este respaldo");
}

// ── probar que un respaldo se puede LEER: baja los archivos de las tablas
// pedidas, los descomprime, los abre y compara las filas con el manifiesto ──
async function verificar(carpeta: string, tablas: string[]) {
  const bajar = async (ruta: string) => {
    const r = await fetch(`${URL_SB}/storage/v1/object/${BUCKET}/${ruta}`, { headers: cab });
    if (!r.ok) throw new Error(`${ruta}: HTTP ${r.status}`);
    return r;
  };
  const man = await (await bajar(`${carpeta}/_manifiesto.json`)).json();
  const salida: Array<Record<string, unknown>> = [];
  for (const tabla of tablas.slice(0, 12)) {
    try {
      const d = (man.detalle || []).find((x: any) => x.tabla === tabla);
      if (!d) throw new Error("no está en el manifiesto");
      const n = Number(d.partes) > 1 ? Number(d.partes) : 1;
      let filas = 0;
      for (let k = 1; k <= n; k++) {
        const nombre = n > 1 ? `${tabla}.parte${String(k).padStart(3, "0")}.json.gz` : `${tabla}.json.gz`;
        const r = await bajar(`${carpeta}/${nombre}`);
        const texto = await new Response(r.body!.pipeThrough(new DecompressionStream("gzip"))).text();
        const lista = JSON.parse(texto);
        if (!Array.isArray(lista)) throw new Error(`${nombre}: no es una lista`);
        filas += lista.length;
      }
      salida.push({ tabla, archivos: n, filas_leidas: filas, filas_manifiesto: d.filas, coincide: filas === Number(d.filas) });
    } catch (e) {
      salida.push({ tabla, error: String(e).slice(0, 200) });
    }
  }
  return { carpeta, manifiesto: { tablas: man.tablas, filas: man.filas, con_error: man.con_error }, tablas: salida };
}

Deno.serve(async (req: Request) => {
  // Sólo entra quien trae el secreto del cron o la llave de servicio
  const auth = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!auth || (auth !== SECRETO && auth !== KEY_SRV)) return json({ error: "no autorizado" }, 401);

  const arranque = Date.now();
  let cuerpo: any = {};
  try { cuerpo = (await req.json()) || {}; } catch { /* body vacío */ }

  if (cuerpo.verificar) {
    try {
      return json({ ok: true, ...(await verificar(String(cuerpo.verificar), Array.isArray(cuerpo.tablas) ? cuerpo.tablas.map(String) : [])) });
    } catch (e) {
      return json({ ok: false, error: String(e).slice(0, 300) }, 500);
    }
  }

  let fila: Fila | null = null;
  let turno = 0;
  try {
    if (cuerpo.continuar) {
      // ── retomar un respaldo que ya arrancó ──
      const id = Number(cuerpo.continuar);
      const rg = await fetch(`${URL_SB}/rest/v1/respaldos_log?id=eq.${id}&select=id,fecha,carpeta,estado,turno,progreso,detalle,created_at,disparado_por`, { headers: cab });
      const fs = rg.ok ? await rg.json() : [];
      if (!Array.isArray(fs) || !fs[0]) return json({ ok: false, error: "no existe ese respaldo" }, 404);
      if (fs[0].estado !== "en_curso") return json({ ok: true, nada: "ese respaldo ya terminó" });
      // tomar el turno: si dos llamadas llegan juntas, sólo una lo consigue
      const rt = await fetch(`${URL_SB}/rest/v1/respaldos_log?id=eq.${id}&estado=eq.en_curso&turno=eq.${fs[0].turno}`, {
        method: "PATCH", headers: { ...cab, Prefer: "return=representation" },
        body: JSON.stringify({ turno: Number(fs[0].turno) + 1, actualizado_at: new Date().toISOString() }),
      });
      const tomada = rt.ok ? await rt.json() : [];
      if (!Array.isArray(tomada) || !tomada[0]) return json({ ok: true, nada: "otra llamada ya lo está siguiendo" });
      fila = tomada[0] as Fila;
      turno = fila.turno;
    } else {
      // ── respaldo nuevo ──
      const quien = cuerpo.origen ? String(cuerpo.origen).slice(0, 40) : "cron";
      const fecha = hoyArg();
      const rl = await fetch(`${URL_SB}/rest/v1/rpc/fn_tablas_para_respaldo`, { method: "POST", headers: cab, body: "{}" });
      if (!rl.ok) throw new Error(`lista de tablas: HTTP ${rl.status}`);
      const lista = (await rl.json() as Array<{ tabla: string }>).map((t) => t.tabla);
      const progreso: Progreso = { tablas: lista, i: 0, desde: 0, parte: 0, tb: 0 };
      // Se anota el arranque ANTES de empezar: un respaldo cortado tiene que
      // dejar rastro (y de ese rastro lo retoma el vigía).
      const ri = await fetch(`${URL_SB}/rest/v1/respaldos_log`, {
        method: "POST", headers: { ...cab, Prefer: "return=representation" },
        body: JSON.stringify({ fecha, carpeta: fecha, estado: "en_curso", disparado_por: quien, turno: 1, progreso, detalle: [] }),
      });
      if (!ri.ok) throw new Error(`anotar arranque: HTTP ${ri.status} ${(await ri.text()).slice(0, 160)}`);
      fila = (await ri.json())[0] as Fila;
      turno = 1;
    }

    const id = fila.id;
    const carpeta = fila.carpeta || String(fila.fecha).slice(0, 10);
    const detalle = Array.isArray(fila.detalle) ? fila.detalle : [];
    let p = fila.progreso;
    if (!p || !Array.isArray(p.tablas)) {
      // fila de antes de este sistema: se empieza de cero
      const rl = await fetch(`${URL_SB}/rest/v1/rpc/fn_tablas_para_respaldo`, { method: "POST", headers: cab, body: "{}" });
      if (!rl.ok) throw new Error(`lista de tablas: HTTP ${rl.status}`);
      p = { tablas: (await rl.json() as Array<{ tabla: string }>).map((t) => t.tabla), i: 0, desde: 0, parte: 0, tb: 0 };
      detalle.length = 0;
    }
    const guardar = () => anotar(id, turno, { progreso: p, detalle });
    const siguienteTabla = () => { p!.i++; p!.desde = 0; p!.parte = 0; p!.tb = 0; };

    // Anti-atasco: si tres tandas seguidas murieron arrancando en el mismo
    // lugar, esa tabla se anota como fallida y se sigue con las demás. Mejor
    // un respaldo "parcial" que ninguno.
    const pos = `${p.i}:${p.desde}`;
    if (p.pos === pos) p.veces = (p.veces || 1) + 1; else { p.pos = pos; p.veces = 1; }
    if ((p.veces || 1) >= 4 && p.i < p.tablas.length) {
      detalle.push({ tabla: p.tablas[p.i], error: "se cortó 3 veces en esta tabla; se salteó" });
      siguienteTabla();
      p.pos = `${p.i}:0`; p.veces = 1;
    }
    await guardar();

    let leidos = 0;
    const seAcabo = () => leidos >= BYTES_POR_TANDA || Date.now() - arranque > MS_POR_TANDA;

    while (p.i < p.tablas.length) {
      const tabla = p.tablas[p.i];
      let cortar = false;
      try {
        let trozos: Uint8Array[] = [], nBuf = 0, bBuf = 0, fin = false;
        while (!fin) {
          const pg = await pagina(tabla, p.desde + nBuf);
          leidos += pg.bytes;
          if (pg.filas > 0) { trozos.push(pg.cuerpo); nBuf += pg.filas; bBuf += pg.cuerpo.length; }
          if (pg.filas < PAGINA || p.desde + nBuf > 500000) fin = true;   // 500.000 = freno de seguridad
          if (fin || nBuf >= FILAS_POR_PARTE || bBuf >= BYTES_POR_PARTE) {
            if (nBuf > 0 || (fin && p.parte === 0)) {
              p.parte++;
              // Si entra en un solo archivo se mantiene el nombre de siempre,
              // para que los respaldos viejos y los nuevos se lean igual.
              const nombre = (fin && p.parte === 1) ? `${tabla}.json.gz` : `${tabla}.parte${String(p.parte).padStart(3, "0")}.json.gz`;
              const gz = await gzipTrozos(trozos);
              await subir(`${carpeta}/${nombre}`, gz, "application/gzip");
              p.tb += gz.length;
            }
            p.desde += nBuf;
            trozos = []; nBuf = 0; bBuf = 0;
            if (!fin) {
              await guardar();
              if (seAcabo()) { cortar = true; break; }
            }
          }
        }
        if (cortar) break;
        detalle.push({ tabla, filas: p.desde, bytes: p.tb, partes: p.parte > 1 ? p.parte : undefined });
      } catch (e) {
        if (e instanceof PerdioElTurno) throw e;
        detalle.push({ tabla, error: String(e).slice(0, 200) });
      }
      siguienteTabla();
      await guardar();
      if (seAcabo()) break;
    }

    if (p.i < p.tablas.length) {
      // Queda trabajo: la base nos vuelve a llamar (pedido nuevo = CPU nueva).
      // Si este aviso fallara, el vigía lo retoma solo a los pocos minutos.
      const rc = await fetch(`${URL_SB}/rest/v1/rpc/fn_respaldo_continuar`, {
        method: "POST", headers: cab, body: JSON.stringify({ p_id: id }),
      }).catch(() => null);
      return json({ ok: true, sigue: true, id, tabla: p.i, de: p.tablas.length, relevo: !!(rc && rc.ok), ms: Date.now() - arranque });
    }

    // ── terminó: manifiesto, limpieza y cierre ──
    let filasTotal = 0, bytesTotal = 0, fallaron = 0;
    for (const d of detalle) {
      if (d.error) fallaron++;
      else { filasTotal += Number(d.filas) || 0; bytesTotal += Number(d.bytes) || 0; }
    }
    const quien = fila.disparado_por || "cron";
    const manifiesto = {
      fecha: carpeta, generado: new Date().toISOString(), origen: quien,
      tablas: detalle.length, con_error: fallaron,
      filas: filasTotal, bytes: bytesTotal, detalle,
    };
    await subir(`${carpeta}/_manifiesto.json`,
      new TextEncoder().encode(JSON.stringify(manifiesto, null, 2)), "application/json");
    const borrados = await limpiarViejos();
    const estado = fallaron === 0 ? "ok" : (fallaron < detalle.length ? "parcial" : "error");
    await anotar(id, turno, {
      estado, progreso: null,
      tablas: detalle.length - fallaron, filas: filasTotal, bytes: bytesTotal,
      duracion_ms: Date.now() - Date.parse(fila.created_at), detalle,
      error: fallaron ? `${fallaron} tabla(s) fallaron` : null,
    });
    return json({
      ok: true, estado, fecha: carpeta, tablas: detalle.length - fallaron,
      filas: filasTotal, bytes: bytesTotal, fallaron, tandas: turno,
      archivos_viejos_borrados: borrados, ms: Date.now() - arranque,
    });

  } catch (e) {
    if (e instanceof PerdioElTurno) return json({ ok: true, nada: String(e.message) });
    // Un error acá NO cierra la fila: queda "en_curso" con el avance anotado
    // y el vigía la retoma. Si no hay fila, no hay nada que retomar.
    console.error("[respaldo]", e);
    return json({ ok: false, error: String(e).slice(0, 300), id: fila?.id ?? null }, 500);
  }
});
