# Sistema Distribuidora Belle — Mapa completo

> Documentación del sistema entero (lo que sabemos y dónde está cada cosa). Leer con `CLAUDE.md` y
> `docs/contexto-marketing.md`. Si falta un detalle, está en el código — este doc dice dónde buscar.

## Qué es
Catálogo de perfumes + sistema de gestión para Distribuidora Belle. Todo **front-end estático (ES5)**
servido por **GitHub Pages** (distribuidorabelle.com), con **Supabase** como backend (PostgREST, Auth,
Storage, RLS, Edge Functions). Hay además **apps Android** (admin y vendedor) que envuelven las webs.

## Archivos en la raíz
### Productivos (los que importan)
- **`index.html`** (~700KB) + **`js/catalogo-1.js … catalogo-4.js`** — **catálogo público / app del cliente**.
  Carrito, fichas, favoritos, cuenta del cliente, **campanita de notificaciones** (en `catalogo-2.js`).
- **`belle.html`** (~3.9MB) — **panel admin** (un solo archivo con todo el sistema de gestión).
- **`ventas.html`** (~1.5MB) — **app del vendedor** (ventas en la calle, rendiciones, gastos, cobros).
- **`js/cyberJs.js`, `js/nuevoJs.js`** — variantes de tema del catálogo (CyberMonday, "nuevo").
- **`fichas-belle.json`, `fichas-perfume`** — fichas descriptivas de perfumes.
- `manifest.json`, `belle-manifest.json`, `ventas-manifest.json` — PWA manifests.
- `sw.js` — service worker (cachés + Web Push del lado cliente).
- `favicon.svg`, `MARKETING-AUDIT.md`.

### Pruebas / variantes (NO productivas — experimentos)
`index-nuevo-prueba*.html`, `index-cyber-prueba.html`, `barras-*.html`, `botones-prueba.html`,
`card*.html`, `card-nuevo-prueba.html`, `belle-sistema-prueba.html`, `belle-registro-prueba.html`,
`marcela.html`, `dia-de-la-madre.html`, `fichas-belle.html`. Son bancos de prueba de UI; no tocar salvo
pedido explícito.

### Carpetas
- `js/` — lógica del catálogo público y temas.
- `supabase/functions/` — Edge Functions (deno/TS).
- `app-android/`, `app-android-vendedor/` — wrappers Android (Kotlin/Java), build por GitHub Actions.
- `herramientas/` — scripts utilitarios (ej. `plantilla_madre_integrar.py`).
- `flyers/`, `fotos/` — imágenes.
- `.agents/skills/` — **skills de Claude** (motion/video/diseño/IA, etc.). Trackeadas en git.
- `.github/workflows/` — `apk-belle-admin.yml`, `apk-belle-vendedor.yml` (compilan los APK).
- `docs/` — esta documentación.
- `scratchpad/` (en el repo) — material de pruebas commiteado (NO confundir con el scratchpad efímero de la sesión).

## Panel admin (`belle.html`) — secciones (de `navTo(...)`)
dashboard · inicio-config · stock · fichas · pestañas · combos · decans · ofertas · carrusel ·
clientes · cuentas · cobranzas · cobros · cotizaciones · pedidos · pedidos-web · **pedidos-proveedor
("Pedidos en viaje")** · reservas · deposito · deposito-marcela · movimientos · auditoria-stock ·
avisos-stock (Avisos y Notificaciones) · vendedores · rendicion · reportes · historial-ventas ·
periodos · reclamos · registros · actividad · respaldos · diagnostico · compras-ia · chatbot ·
catalogos-pdf · contacto-admin.
- Edición directa en el archivo. Verificar sintaxis: extraer el `<script>` inline y `node --check`.
- Helpers de datos: `apiGet/apiPost/apiPatch/apiDelete("<tabla>", "<filtro PostgREST>")` (ej.
  `apiPatch("productos",{...},"id=eq.123")`). RPC vía `apiGet("rpc/...")`.

## Base de datos (Supabase, proyecto `syylbuvjuekkanxynpps`)
Tablas reales usadas (agrupadas):
- **Catálogo:** `productos`, `combos`, `combo_items`, `marcas`, `fichas_perfume`, `pestanas_catalogo`,
  `catalogos_config`, `home_sections`, `banner_slides`, `paneles_destacados`, `popup_config`.
- **Clientes:** `clientes`, `clientes_direcciones`, `clientes_favoritos`, `cuentas`.
- **Ventas / stock / pedidos:** `ventas`, `ventas_transferidas`, `pedidos_catalogo` (pedidos de la web),
  `pedidos_proveedor`, `pedidos_proveedor_items`, `reservas`, `movimientos_stock`, `avisos_stock`.
- **Cuenta corriente / cobros / vendedores:** `cc_pagos`, `cc_pagos_aplicaciones`, `cc_cuotas`,
  `financiacion_cuotas`, `rendiciones`, `gastos_vendedor`, `vendedores`, `staff_perfiles`,
  `contacto_vendedores`.
- **Notificaciones:** `notificaciones_cliente`, `notif_campanias`, `push_subscriptions`,
  `notificaciones_staff`.
- **Config / contacto:** `configuracion`, `contacto_redes`, `contacto_locales`, `reclamos`.

### Tabla `productos` (campos clave)
`nombre`, `precio_min_ars` (venta x1 / lista), `precio_med_ars` (x3), `precio_may_ars` (x10 / mayorista),
`combo_precio`, `precio_decan`, `precio_pestana`, `precio_ml`, `stock_actual`, `stock_orig`, `imagen_url`.
Imágenes: `https://syylbuvjuekkanxynpps.supabase.co/storage/v1/object/public/productos/productos_<id>_<hash>.jpg`.

## Edge Functions
- **`send-push`** — envía Web Push. Acepta `cliente_ids`, `vendedor_ids`. Devuelve `sent` (dispositivos).
- **`avisar-equipo`** — avisa al staff.
- **`admin-usuarios`** — gestión de usuarios/cuentas.
- **`belle-whatsapp`** — integración WhatsApp.
- **`respaldo-diario`** (en `supabase/functions/`) — backup diario.

## Sistema de notificaciones (detalle)
- **Cliente:** tabla `notificaciones_cliente` (campanita en el catálogo, `js/catalogo-2.js`) + Web Push
  vía `push_subscriptions` + `send-push`. La campanita muestra **todas** las notis (leídas y no leídas);
  al abrir marca como leídas (apaga el punto rojo) pero no las borra. Función clave:
  `_catRenderNotifList` (modo `bellMode`).
- **Campañas / avisos masivos:** tabla `notif_campanias` + `notificaciones_cliente`. El aviso de "llegó
  mercadería" (`_avisarIngresoStockMasivo` en `belle.html`) va **solo a clientes con cuenta**
  (`clientes.auth_user_id` no nulo) — por eso avisa a ~461 de ~700.
- **Admin/vendedor:** `notificaciones_staff` + push al celular (`_avisarVendedor`).
- VAPID / suscripción admin: funciones `_pushAsegurarSubA`, `_pushRepararAdmin` en `belle.html`.

## Deploy / Git
- Rama de trabajo: **`main`**. Pages publica desde `main` (~10 min CDN). Ger autorizó commitear/pushear
  directo. Push con reintentos y rebase ante conflicto (ver `CLAUDE.md`).
- Android: se compilan los APK con los workflows de `.github/workflows/`.

## Cambios recientes hechos por Claude
- **Pedidos en viaje**: tablas que se cruzaban → clase CSS `.tblw` (word-break con especificidad sobre
  el `white-space:nowrap` global). Control de pedido: primer control pre-llena "llegó todo".
- **Campanita del cliente** (2026-11-11): ya no "borra" las notis al abrir (muestra todas).
- **Skills IA** (2026-11-14): 24 skills de motion/video/diseño instaladas en `.agents/skills/`.

## Dónde seguir
- Marketing/Instagram y aprendizajes de estilo de video: `docs/contexto-marketing.md`.
- Reglas, usuario, convenciones: `CLAUDE.md`.
