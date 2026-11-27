# CLAUDE.md — Distribuidora Belle

> Este archivo se carga automáticamente en cada sesión. Contiene las reglas, el sistema y las
> convenciones del proyecto. La historia detallada del trabajo de marketing/Instagram está en
> `docs/contexto-marketing.md`. **Leé ambos al empezar.**

## Quién es el usuario
- **Ger** (Gerzini). Dueño y **único admin** de **Distribuidora Belle**, distribuidora de perfumes (Argentina).
- Hablá **siempre en español argentino, informal y cercano** (vos, dale, che). Es cálido y directo; da
  feedback sin filtro ("esto está horrible", "lo hizo una señora de 70 años"). No te pongas a la
  defensiva: iterá rápido. **Odia lo genérico/amateur**; quiere cosas **pro, de calidad superior**.
- Email: `gerzini@hotmail.com` — **privado**, solo para identificarlo. Nunca compartirlo con servicios externos.

## Reglas de marketing / UX cara al cliente (IMPORTANTE)
- **NUNCA** mostrar al cliente señales negativas o internas: "nunca se vendió", "sin vender hace X días",
  y similares. Espanta al cliente. Son datos internos, no van en el catálogo ni en campañas.
- **NO** usar escasez por unidades ("últimas 3 u.", "quedan pocas"). Ger lo rechazó.
- Todo lo cara al cliente va **responsive de verdad**: modo PC (ancho, grilla multi-columna) y mobile,
  nunca un mobile estirado en PC.

## Reglas de trabajo — git / deploy (IMPORTANTE)
- Se **desarrolla en `main`**. El sitio público se publica desde `main` por **GitHub Pages →
  distribuidorabelle.com** (tarda **~10 min** por el CDN).
- **Ger autorizó commitear y pushear directo cuando pide un cambio** (su frase: *"cuando te pido un
  cambio comitealo de una"*). No le preguntes cada vez. Igual, confirmá antes de acciones externas
  irreversibles o que no pidió.
- Push con reintentos: `for i in 1 2 3 4 5; do git push -u origin main && break || sleep $((2**i)); done`.
- Si el push falla por conflicto (otra sesión pushea a main en paralelo): `git pull --rebase` y reintentar.
- Las **skills** (`.agents/skills/`) y docs NO afectan el sitio publicado; igual van a `main`.
- El deploy de Pages a veces se cuelga (~10 min): cancelar el run colgado y pushear un commit vacío para reintentar.
- Verificá JS de `belle.html` con `node --check` sobre el `<script>` inline antes de pushear.

## Arquitectura
- SPA **estática multi-archivo, ES5**, servida por GitHub Pages. PostgREST contra Supabase.
- `belle.html` (~3.9MB) — **panel admin** (inventario, ventas, pedidos, rendiciones, notificaciones…). Edición directa.
- `index.html` + `js/catalogo-1..4.js` — **catálogo público / app del cliente**. La **campanita de
  notificaciones del cliente** vive en `js/catalogo-2.js`.
- `ventas.html` — **app del vendedor**.
- `app-android/` y `app-android-vendedor/` — wrappers Android, se compilan con GitHub Actions (`.github/workflows/apk-*.yml`).
- Backend: **Supabase**, proyecto id **`syylbuvjuekkanxynpps`** ("Distribuidora Belle"). Auth, Storage, RLS,
  Edge Functions (`send-push`, `avisar-equipo`, `respaldo-diario`, `admin-usuarios`).

## Supabase — datos útiles
- Tabla **`productos`**: `nombre`, `precio_min_ars` (venta x1 / lista), `precio_med_ars` (x3),
  `precio_may_ars` (x10 / mayorista), `combo_precio`, `precio_decan`, `precio_pestana`, `precio_ml`,
  `stock_actual`, `stock_orig`, `imagen_url`.
- Imágenes de producto: `https://syylbuvjuekkanxynpps.supabase.co/storage/v1/object/public/productos/productos_<id>_<hash>.jpg`
  (ese host está permitido en la red del entorno).
- **Notificaciones**: tabla `push_subscriptions` + edge function `send-push`. Al confirmar que un
  "pedido en viaje" llegó (control de pedido → estado `recibido`), se dispara "📦 ¡Llegó mercadería
  nueva!" **solo a clientes con cuenta** (`auth_user_id` no nulo). Por eso avisa a ~461 de ~700: los
  otros son contactos cargados sin cuenta y no tienen dónde recibir el push. **Es correcto, no un bug.**

## Entorno / herramientas
- **Playwright/Chromium** preinstalado. Para render HTML→PNG: escribir el HTML a un archivo y
  `page.goto('file://'+ruta)` — `setContent` con imágenes `file://` **falla** (Chromium bloquea
  subrecursos). Fuentes de Google con `<link>` + esperar `document.fonts.ready` + `networkidle`.
- **ffmpeg** e **imagemagick** (`convert`) disponibles. **NO hay `rsync`** (usar `cp -r` + `find`).
- El **scratchpad de la sesión es efímero** (`/tmp/claude-0/.../scratchpad`) — se borra entre sesiones.
  Lo que se quiera conservar va commiteado al repo.
- MCP conectados: Supabase, GitHub, **Higgsfield** (0 créditos en plan free), Adobe, Canva, Higgsfield GPU.

## Skills de motion / video / diseño IA instaladas (2026-11-14)
Se vetearon (sin hooks ocultos ni exfiltración) e instalaron en `.agents/skills/`:
- **Motion LOCAL (gratis, render con Remotion/GSAP/ffmpeg):** `remotion-motion-graphics`,
  `motion-video-director`, `motion-architect` (ES), `claude-video-studio`, `guizang-product-video`.
- **Generación IA (requieren API key/créditos):** `higgsfield-*` (9, se integran con el MCP de
  Higgsfield), `ca-*` (creative-architect, 8: dirección de arte, clonar-anuncio, producto, ugc, animar,
  avatar, proveedores), `nano-banana` + `cc-nano-banana` (Gemini).
- Ya existían y hay que **aprovecharlas**: `remotion`, `video-hyperframes`, `motion-framer`,
  `emilkowalski-motion`, `frame-*` (glitch-title, light-leak-cinema, liquid-bg-hero, logo-outro),
  `high-end-visual-design`, `imagegen`, `imagen`, `sora`, `fal-*`, `replicate`, `venice-*`.
- Para "calidad cine" real (footage foto-real) hace falta **generación con IA** → conseguir créditos de
  Higgsfield o una `GEMINI_API_KEY`. Sin eso, solo motion-graphics por código.

## Proyectos
- **Pedidos en viaje** (hecho): tablas que se cruzaban arregladas con clase `.tblw`; control de pedido
  cuenta "llegó todo" en el primer control.
- **Campanita del cliente** (hecho, 2026-11-11): antes se "borraban" las notis al abrir (filtraba solo
  no leídas y las marcaba leídas). Ahora muestra **todas** (`js/catalogo-2.js`, `_catRenderNotifList`).
- **Auditoría económica** (2026-11-21): Reportes y cierre de período corregidos.
  - **Cierre de período**: corre entero en el servidor, función `cerrar_periodo(p_nuevo, p_vendedores, p_dry, p_origen)`
    (una transacción: todo o nada; `p_dry=true` = vista previa). El panel solo la llama. El automático es
    `cerrar_periodo_auto()` (pg_cron), respeta `periodo_auto_close` / `periodo_pausado` / día / hora de `configuracion`.
    `historial_periodos` guarda los ids tocados (snapshots) para poder auditar o revertir un cierre.
    `configuracion.periodo_cierre_manual` = nombre de un período que el automático NO toca (Ger lo cierra a mano);
    cron `belle-cierre-periodo-auto` cada 5 min (actúa solo dentro de las 6 hs posteriores al día/hora configurados).
  - **Reportes**: usar siempre `_repProdsCosto()` (no el global `prods`, que puede no tener costos) y `_repGastos()`
    (devuelve solo gastos operativos; el `CAPITAL *` de socios y las `DEVOLUCION` van aparte, ver `_repAparte`).
    **Criterio de Ger:** el capital de socios es el sueldo fijo semanal del equipo → ES gasto y resta de la ganancia neta,
    pero se muestra en su propio renglón, separado de los gastos operativos. Las devoluciones restan de lo cobrado.
    Toda consulta de ventas que pase por `_repCaja` tiene que traer `id,nro_orden,combo_id` (si no, duplica los pagos de CC).
  - **Costo por venta**: `ventas.costo_unit` / `cotiz` / `costo_origen` los graba la base al insertar (trigger
    `trg_ventas_costo` → `_venta_costo_unit`, misma fórmula que `_repCostoFactory`). `venta` = exacto; `estimado` = ventas
    anteriores al 2026-11-21 (costo USD actual × dólar de la fecha, sacado de `rendiciones.cotiz_pagada`). Reportes usa el
    costo guardado si existe → las consultas de ventas que costean tienen que traer `costo_unit`.
  - **Historial de stock**: tabla `stock_historial`, la escribe la BASE (trigger `_trg_stock_historial` sobre
    `productos_priv`) en cada cambio de disponible / reserva / en_viaje / deposito_m, venga de donde venga. Guarda
    antes→después, `clase` (reserva, liberacion, entrega, salida, ingreso, ingreso_proveedor…), `origen` (función que
    lo hizo; `directo` = edición directa), `motivo` (lo manda la app en `ajustar_stock(…, p_motivo)`), `detalle` (se
    engancha solo con la fila descriptiva de `movimientos_stock`) y `usuario`. Es la fuente de verdad desde el
    2026-11-21; `movimientos_stock` (lo anota la app, con huecos) queda solo para lo anterior y como texto descriptivo.
  - **Reglas de plata/stock (2026-11-22)**: la ficha de producto NO manda campos de stock salvo los que el admin cambió,
    y como ajuste (+/−) por `patchStockFresco`. Un cobro PARCIAL (admin o vendedor) no genera ventas ni mueve stock: se
    anota como `cc_pagos` + aplicación; las ventas (`_pedSaldarItems`) se crean recién cuando el pedido queda saldado.
  - **Venta directa del vendedor (2026-11-24)**: `ventas.html › executeVenta` arma un lote (ventas + ajustes + movs) y lo
    manda en UNA llamada a `venta_directa_atomica(p_token, p_ventas, p_ajustes, p_movs)`: todo o nada, y con token de
    idempotencia (tabla `ventas_lotes`; el mismo carrito reintentado reusa token y nro de orden → no duplica).
    Ajuste `{pid, desde_reserva:N}` = sale primero de lo apartado y el resto del disponible (lo calcula el servidor).
    Para probar sin dejar rastro: correr la función como David dentro de un `DO $$ … raise exception` (rollback).
  - **Chequeo diario (2026-11-24)**: `belle_chequeo_diario(p_avisar)` por pg_cron (`belle-chequeo-diario`, 11:10 UTC = 08:10 AR).
    Revisa 14 cosas (cobrados vs ventas, sobrecobros, parciales sin registrar, pagos que no cierran, stock negativo, stock vs
    historial, reservas corregidas por el autoheal, ventas sin costo / con período viejo, posibles duplicados, crons caídos,
    período abierto de más, respaldo). Guarda el resultado en `chequeos_diarios` y avisa al admin SOLO si hay problemas.
  - **Seguridad (2026-11-24, aplicado)**: `reservar_stock_web` y `belle_vigilar_salud` ya no son ejecutables por anon/authenticated,
    `belle_salud` con RLS, y las funciones de trigger sin EXECUTE público (los triggers disparan igual). SQL en `docs/sql/`.
  - **Respaldo diario por tandas (2026-11-26)**: `respaldo-diario` se quedaba sin CPU (2 s por pedido) y la fila quedaba
    `en_curso`. Ahora cada llamada hace una tanda, anota el avance en `respaldos_log.progreso` / `turno` y la base la vuelve a
    llamar (`fn_respaldo_continuar`); si se corta, `fn_respaldo_vigia` (cron `belle-respaldo-vigia`, cada 5 min) la retoma.
    Para probar que un respaldo se LEE: llamar a la función con `{"verificar":"AAAA-MM-DD","tablas":[…]}`.
  - **Autoheal de reservas (2026-11-26)**: `belle_autoheal_reservas` ya NO corrige una diferencia la primera vez que la ve: la
    anota en `autoheal_vistos` y solo la corrige si en la pasada siguiente sigue idéntica. Motivo: el 24/11 corrió justo en el
    medio de un cobro CC FIFO (el pedido ya "cobrado", las reservas todavía sin soltar) y se soltaron reservas dos veces.
    Los cobros siguen siendo de varios pasos en el cliente: pendiente pasarlos a una función atómica como la venta directa.
  - **Período cerrado**: el trigger `belle_set_periodo_actual` (ventas, gastos, rendiciones) pasa al período abierto todo
    lo que una app desactualizada mande etiquetado con un período ya cerrado. Una venta `confirmada` = abierta = del período en curso.
- **Black Friday 2026** (campaña creada 2026-11-26; **se activa sola el 27/11 00:00 AR** por el cron `belle-bf2026-activar` →
  `bf2026_activar()`, que actúa una sola vez y se borra; termina sola el 29/11 00:00 por `fn_campanias_mantenimiento`): campaña `blackfriday`
  (`ofertas_campanias` id `91668d44-06be-472e-82a1-341ebeac5004`, pestaña id 13, oferta `precio_unico` del 27/11 00:00 al
  29/11 00:00 AR, **180 productos** con `precio_unico` en `ofertas_campania_productos`: se cargaron 210 y Ger sacó 30 desde el panel
  —Shirley May, Tubbees, Lattafa Kids, body lotion VS—; fuera desde antes: 2114, 2219, 2151). Los precios se pasaron del dólar 1650
  al de 1750 (×1750/1650, redondeo a 500; los de 1650 quedaron en la tabla `_bf2026_precios_1650`).
  El diseño rojo vive en `index.html` (`#bfEdCss` + `#bfEdJs`): es **inerte** si la campaña no está activa; lee productos,
  precios y fechas de la base. Se activa desde el panel (Ofertas → "Campaña activa"); si se activa antes de la hora, el inicio
  muestra la cuenta regresiva y la pestaña/precios arrancan solos. Vista previa: `index.html?vista=blackfriday`.
  `black-friday-prueba.html` es la maqueta vieja (datos inyectados a mano), no la toca nadie.
- **Instagram / marketing** (EN CURSO): ver `docs/contexto-marketing.md`. Etapa 1 (32 destacadas)
  entregada; Etapa 2 (historias/videos) en iteración — **leé el doc para saber qué estilos rechazó Ger
  y por qué, así no repetís errores.**
