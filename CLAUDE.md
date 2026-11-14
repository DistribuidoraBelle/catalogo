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
- **Instagram / marketing** (EN CURSO): ver `docs/contexto-marketing.md`. Etapa 1 (32 destacadas)
  entregada; Etapa 2 (historias/videos) en iteración — **leé el doc para saber qué estilos rechazó Ger
  y por qué, así no repetís errores.**
