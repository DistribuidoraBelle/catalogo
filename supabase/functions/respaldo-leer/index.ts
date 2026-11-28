// respaldo-leer — devuelve las filas de UNA tabla tal como quedaron en el respaldo
// diario de una fecha (bucket privado "respaldos", archivos .json.gz que escribe
// `respaldo-diario`). Sirve para recuperar algo que se borró por error.
//
// Uso (desde la base, con el secreto del cron que está en el Vault):
//   POST { "fecha": "AAAA-MM-DD", "tabla": "pedidos_proveedor_items" }
//
// Sólo lee, y sólo las tablas de la lista de abajo: el secreto del cron no tiene
// que servir para sacar cualquier tabla. Para recuperar otra, se agrega acá.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const URL_SB  = Deno.env.get("SUPABASE_URL")!;
const KEY_SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SECRETO = Deno.env.get("CRON_SECRET") || "";
const BUCKET  = "respaldos";
const TABLAS_PERMITIDAS = ["pedidos_proveedor", "pedidos_proveedor_items"];
const TOPE_BYTES = 4_000_000;

const cab = { apikey: KEY_SRV, Authorization: `Bearer ${KEY_SRV}` };
const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

async function bajar(ruta: string) {
  const r = await fetch(`${URL_SB}/storage/v1/object/${BUCKET}/${ruta}`, { headers: cab });
  if (!r.ok) throw new Error(`${ruta}: HTTP ${r.status}`);
  return r;
}

Deno.serve(async (req: Request) => {
  const auth = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!auth || (auth !== SECRETO && auth !== KEY_SRV)) return json({ error: "no autorizado" }, 401);

  let cuerpo: any = {};
  try { cuerpo = (await req.json()) || {}; } catch { /* body vacío */ }
  const fecha = String(cuerpo.fecha || ""), tabla = String(cuerpo.tabla || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return json({ ok: false, error: "fecha inválida (AAAA-MM-DD)" }, 400);
  if (TABLAS_PERMITIDAS.indexOf(tabla) < 0) return json({ ok: false, error: "tabla no habilitada para leer" }, 400);

  try {
    const man = await (await bajar(`${fecha}/_manifiesto.json`)).json();
    const d = (man.detalle || []).find((x: any) => x.tabla === tabla);
    if (!d) throw new Error("la tabla no está en el manifiesto de ese día");
    const n = Number(d.partes) > 1 ? Number(d.partes) : 1;
    let filas: unknown[] = [];
    let peso = 0;
    for (let k = 1; k <= n; k++) {
      const nombre = n > 1 ? `${tabla}.parte${String(k).padStart(3, "0")}.json.gz` : `${tabla}.json.gz`;
      const r = await bajar(`${fecha}/${nombre}`);
      const texto = await new Response(r.body!.pipeThrough(new DecompressionStream("gzip"))).text();
      peso += texto.length;
      if (peso > TOPE_BYTES) throw new Error("la tabla es demasiado grande para leerla de una vez");
      const lista = JSON.parse(texto);
      if (!Array.isArray(lista)) throw new Error(`${nombre}: no es una lista`);
      filas = filas.concat(lista);
    }
    return json({ ok: true, fecha, tabla, filas_manifiesto: d.filas, filas_leidas: filas.length, filas });
  } catch (e) {
    return json({ ok: false, error: String(e).slice(0, 300) }, 500);
  }
});
