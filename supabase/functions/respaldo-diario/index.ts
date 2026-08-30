// ═══════════════════════════════════════════════════════════════════════
// RESPALDO DIARIO — Distribuidora Belle
// Vuelca todas las tablas de la base a archivos .json.gz dentro del bucket
// privado "respaldos", en una carpeta por fecha. Lo dispara pg_cron todas
// las madrugadas, y también se puede correr a mano desde el panel.
//
// La lista de tablas NO está escrita acá: se pide a la base
// (fn_tablas_para_respaldo). Así, si mañana se crea una tabla nueva, entra
// al respaldo sola, sin que nadie se tenga que acordar.
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

const cab = {
  apikey: KEY_SRV,
  Authorization: `Bearer ${KEY_SRV}`,
  "Content-Type": "application/json",
};

function hoyArg(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

async function gzip(texto: string): Promise<Uint8Array> {
  const cs = new CompressionStream("gzip");
  const flujo = new Blob([texto]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(flujo).arrayBuffer());
}

// Trae una tabla entera, de a 1000 filas
async function traerTabla(tabla: string): Promise<unknown[]> {
  const filas: unknown[] = [];
  for (let desde = 0; ; desde += PAGINA) {
    const r = await fetch(
      `${URL_SB}/rest/v1/${encodeURIComponent(tabla)}?select=*&limit=${PAGINA}&offset=${desde}`,
      { headers: cab },
    );
    if (!r.ok) throw new Error(`${tabla}: HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
    const tanda = await r.json();
    if (!Array.isArray(tanda) || tanda.length === 0) break;
    filas.push(...tanda);
    if (tanda.length < PAGINA) break;
    if (filas.length > 500000) break;   // freno de seguridad
  }
  return filas;
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

Deno.serve(async (req: Request) => {
  // Sólo entra quien trae el secreto del cron o la llave de servicio
  const auth = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!auth || (auth !== SECRETO && auth !== KEY_SRV)) {
    return new Response(JSON.stringify({ error: "no autorizado" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  const arranque = Date.now();
  const fecha = hoyArg();
  let quien = "cron";
  try { const b = await req.json(); if (b?.origen) quien = String(b.origen).slice(0, 40); } catch { /* body vacío */ }

  const detalle: Array<Record<string, unknown>> = [];
  let filasTotal = 0, bytesTotal = 0, fallaron = 0;

  try {
    const rt = await fetch(`${URL_SB}/rest/v1/rpc/fn_tablas_para_respaldo`, {
      method: "POST", headers: cab, body: "{}",
    });
    if (!rt.ok) throw new Error(`lista de tablas: HTTP ${rt.status}`);
    const tablas = await rt.json() as Array<{ tabla: string; filas: number }>;

    for (const t of tablas) {
      try {
        const filas = await traerTabla(t.tabla);
        const gz = await gzip(JSON.stringify(filas));
        await subir(`${fecha}/${t.tabla}.json.gz`, gz, "application/gzip");
        filasTotal += filas.length;
        bytesTotal += gz.length;
        detalle.push({ tabla: t.tabla, filas: filas.length, bytes: gz.length });
      } catch (e) {
        fallaron++;
        detalle.push({ tabla: t.tabla, error: String(e).slice(0, 200) });
      }
    }

    const manifiesto = {
      fecha, generado: new Date().toISOString(), origen: quien,
      tablas: detalle.length, con_error: fallaron,
      filas: filasTotal, bytes: bytesTotal, detalle,
    };
    await subir(`${fecha}/_manifiesto.json`,
      new TextEncoder().encode(JSON.stringify(manifiesto, null, 2)), "application/json");

    const borrados = await limpiarViejos();

    const estado = fallaron === 0 ? "ok" : (fallaron < detalle.length ? "parcial" : "error");
    await fetch(`${URL_SB}/rest/v1/respaldos_log`, {
      method: "POST", headers: cab,
      body: JSON.stringify({
        fecha, carpeta: fecha, estado,
        tablas: detalle.length - fallaron, filas: filasTotal, bytes: bytesTotal,
        duracion_ms: Date.now() - arranque, detalle,
        error: fallaron ? `${fallaron} tabla(s) fallaron` : null,
        disparado_por: quien,
      }),
    });

    return new Response(JSON.stringify({
      ok: true, estado, fecha, tablas: detalle.length - fallaron,
      filas: filasTotal, bytes: bytesTotal, fallaron,
      archivos_viejos_borrados: borrados, ms: Date.now() - arranque,
    }), { headers: { "Content-Type": "application/json" } });

  } catch (e) {
    await fetch(`${URL_SB}/rest/v1/respaldos_log`, {
      method: "POST", headers: cab,
      body: JSON.stringify({
        fecha, carpeta: fecha, estado: "error",
        tablas: 0, filas: filasTotal, bytes: bytesTotal,
        duracion_ms: Date.now() - arranque, detalle,
        error: String(e).slice(0, 500), disparado_por: quien,
      }),
    }).catch(() => {});
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});
