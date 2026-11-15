# Contexto — Marketing / Instagram de Distribuidora Belle

> Historia y aprendizajes del trabajo de contenido para @distribuidora.belle. Leer junto con `CLAUDE.md`.
> Objetivo general: embellecer el Instagram y producir contenido que venda, "de la mejor forma marketinera posible".

## Identidad visual de la WEB (referencia de marca)
- Paleta: crema `#faf8f4`, dorado/acento `#c4965a` (en dark `#e8b86d`), charcoal `#1a1a1a`, borde `#e8e3db`.
- Tipografías: **DM Sans** (sans) + **Cormorant Garamond** (serif itálica, para títulos y precios).
- Motivos: líneas finas doradas, luz cálida radial detrás del producto, mayúsculas chicas con letter-spacing.
- El favicon/amarillo de la empresa es mostaza-dorado.
- OJO: este estilo elegante/boutique es el de la WEB, pero **Ger NO lo quiere para los videos** (ver abajo).

## Etapa 1 — Portadas de Historias Destacadas ✅ ENTREGADO
32 portadas 1080×1080 ("Opción A"):
- Fondo vistoso = color dominante del perfume; recorte del producto; banda blanca con el **título grande**
  (Baloo 2) + ícono de color de la sección; anillo negro (preview en círculo de IG).
- 20 categorías (Perfumes, Ellas, Ellos, Unisex, Árabes, Importados, Novedades, Más vendidos, Combos,
  Regalos, Decants, Ofertas, Catálogo, Servicios, Cómo comprar, Envíos, Mayorista, Asesoría, Reseñas,
  Contacto) + 12 meses de "Clientes felices".
- Entregado: `board_SETA.png` (tablero de las 32 en círculo) + `Belle_destacadas_A.zip` (las 32) + 3
  tableros divididos (`board_1_categorias`, `board_2_secciones`, `board_3_meses`) en alta resolución.

### Aprendizajes técnicos de las portadas (reproducible)
- **Recorte de fondo (cutout) que funciona** para frascos translúcidos/ámbar (evita "pelos" blancos):
  flood-fill desde el borde (mantiene el frasco sólido en vez de agujerearlo) + quitar islas de alfa chicas:
  ```
  convert p<id>.jpg -bordercolor white -border 2 -fuzz 13% -fill magenta -draw "color 0,0 floodfill" \
    -fuzz 0 -transparent magenta -shave 2x2 -channel A -morphology Erode Octagon:1 +channel \
    \( +clone -channel A -separate +channel -threshold 40% -define connected-components:area-threshold=800 \
       -define connected-components:mean-color=true -connected-components 4 -threshold 40% \) \
    -alpha off -compose CopyOpacity -composite -trim +repage cut<id>.png
  ```
  Verificar siempre el recorte sobre fondo magenta (delata halos/agujeros). Si un frasco de **vidrio
  transparente** se rompe igual (reflejo pegado a la base), **usar otro producto opaco** (fue la decisión
  final de Ger). Productos opacos (CK One Shock, Asad Black, D&G The One negro, 212 VIP Black, Scandal,
  latas JPG, Phantom, Yara, Bade'e, Fakhar) recortan limpio.
- **Color de fondo** = color dominante del producto, extraído del histograma (imagemagick `-colors 8`),
  pasado a HSL y normalizado a vivo (S≈0.62–0.9, L≈0.58), excluyendo casi-blanco/negro/gris.
- Títulos de las portadas: grandes (hasta ~138px) y un poco arriba, para que se lean en el círculo chico de IG.
- Los generadores (`genA.js`, `boardA.js`, `board3.js`, `popById.json`) vivían en el scratchpad (efímero):
  si hay que retocar portadas, se regeneran con el método de arriba.

## Etapa 2 — Historias / Videos  ⚠️ EN ITERACIÓN (Ger rechazó varias tandas)
**Importantísimo: no repetir estos errores.** Orden cronológico de lo rechazado:

1. **Plantillas planas** (3 estilos estáticos "Pop/Comic", "Premium/Editorial", "Moderno/Clean" + 3
   animadas con un solo efecto de entrada). → *"re simplón", "poco profesional"*.
2. **Cine elegante / boutique** (3 videos: fondo oscuro dorado con rayos y polvo de oro; crema con
   guirnalda botánica dibujándose + pétalos; editorial charcoal con serif grande; todo con Cormorant
   itálica, líneas doradas, grano, letterbox). → **"mucho peores", "parece que los hizo una señora de
   70 años", "todo lo contrario a esto quiero".** El estilo elegante/serif/dorado = NO para videos.
3. **Hype / Urbano** (3 videos: oscuro, neón verde ácido / cyan-magenta cyberpunk con grilla synthwave /
   rosa eléctrico; tipografía gigante Bebas+Anton, glitch/RGB-split, sparks, speed lines, tickers,
   cortes al ritmo). Ger **eligió esta dirección** en una pregunta, pero **rechazó la ejecución**:
   *"no me gusta absolutamente nada, es un tema de tus capacidades"*.

### Conclusión de Ger y plan acordado
- Atribuyó la baja calidad a **mis capacidades/herramientas**, no solo al estilo.
- Pidió **instalar skills de diseño/video IA** (hecho: 24 skills vetadas e instaladas, ver CLAUDE.md) y
  **arrancar una sesión nueva** (las skills cargan al iniciar sesión).
- **Próximo paso al retomar:**
  1. Usar de verdad las skills de motion instaladas (remotion-motion-graphics, motion-video-director,
     guizang-product-video, video-hyperframes, frame-*) — tienen reglas anti-"video genérico de IA".
  2. Para calidad cine real (footage foto-real), evaluar **conseguir créditos de Higgsfield** (MCP
     conectado, 0 créditos) o una **`GEMINI_API_KEY`** para Nano Banana — ahí está el salto grande.
  3. Antes de producir, **mostrar referencia/estilo y confirmar con Ger** (ya rechazó 3 direcciones; no
     quemar otra tanda a ciegas). Pedirle una cuenta/video de referencia que le guste para clonar el look.
- Datos reales para las piezas (precios de muestra usados): CK One Shock $71.900, Asad Black $64.700,
  Yara Rosa $61.900, Odyssey Mandarin Elixir $88.000, Fakhar Men Black $60.800, Oud Mood Elixir $40.200,
  Yara Tous $52.700. Precio de venta = `precio_min_ars`.

### Etapa 2 — dirección que SÍ gustó (2026-11-14)
- Ger quiere **todo gratis, hecho por código** (nada de IA paga: ni Higgsfield ni Gemini).
- Le gustaron **los 3 estilos** de muestra (cuadros 1080×1920 con foto real del producto):
  **A · Póster pop** (color plano del perfume, League Gothic gigante cortada en los bordes, precio en tarjeta blanca),
  **B · Suizo/grilla** (fondo #F1EEE6 con grilla, Inter Tight 800, un punto rojo #E63022),
  **C · Collage/sticker** (fondo lila, papel rasgado, frasco como sticker con borde blanco, Permanent Marker, sello "-15%").
  *"Mucho mejor ahora, va mejorando rotundamente."*
- **Recortes: NUNCA puede quedar nada del fondo blanco** (huecos de manijas, línea del piso, halos).
  Usar `herramientas/recorte_limpio.py` (saca huecos encerrados, banda de piso, halo) y revisar SIEMPRE el
  `--check` (magenta + negro) antes de usar un recorte.
- **Segunda línea de contenido: videos INFORMATIVOS** del mundo del perfume (tipos de perfume, notas,
  concentraciones, familias olfativas, etc.), con estética propia. Después se suman a la **Academia Belle**
  (pestaña Academia de `index.html`, código en `js/catalogo-1.js` → `_acRender`, datos `_AC_CONC`).
  Referencia que pasó Ger (reel subido como archivo; Instagram está bloqueado en el entorno): explainer de
  86 s de otra tienda, "¿perfume de día o de noche?". Lo que lo hace bueno:
  - **Gancho con intriga**: "Si usás este perfume a la mañana…" + frasco con "?" + "al final te digo".
  - **Un solo mundo continuo** (sin cortes): cielo naranja/violeta en diagonal que pasa de día a noche, sol y
    luna que se mueven, **reloj** arriba que avanza (06:44 → 21:00) = la metáfora es el hilo del video.
  - **Capítulos** con barra de progreso ("Capítulo 1/4 · Las capas", El calor, La noche, El veredicto).
  - Ciencia visual simple: moléculas como bolitas que se evaporan de la "piel", fórmulas (limoneno,
    vainillina), termómetro, "10.000 veces más volátil", tarjetas de íconos (cítricos/verdes/acuáticos).
  - **Voz en off + subtítulos tipo karaoke** abajo; titular grande arriba con la palabra clave en amarillo.
  - **Cierre que vende**: revela 2 productos reales (9AM Dive de día / 9PM Black de noche) con sus notas y
    CTA "Escribinos NOCHE por mensaje directo".
  Ger quiere esa ESTRUCTURA con **otra estética** propia de Belle.

### Marca en los videos
- **Logo de Belle = "B."** (B serif + punto cuadrado redondeado). Archivos: `marketing/marca/logoB_{ink,white,yellow}.png`
  (transparentes, sacados del favicon). Debajo, "DISTRIBUIDORA BELLE" chico, DM Sans con mucho letter-spacing.
  **Usarlo con delicadeza**: chico, en el cierre; no gigante ni en todas las escenas.
- Bordes de recortes: en el estilo póster pop **cero borde blanco/claro** — `recorte_limpio.py` ya suaviza el
  contorno y "sangra" el color del interior al borde. La foto del Go Mango es chica (845 px): no agrandarla de más.

### Voz
- Ger grabó su voz y no le gustó → **voz con ElevenLabs** (conector MCP, plan free 10.000 caracteres/mes).
  Primera prueba: voz "Julieta - Argentine Warm & Friendly" (id YLtqUTaEXb7a9MAYuJu4), modelo eleven_v4.
  Los MP3 se bajan de `elevenlabsusercontent.com` (permitido en el entorno "catalogo").

### Reglas fijas de los videos (Ger, 2026-11-14)
- **Marca de agua**: logo "B." blanco + "DISTRIBUIDORA BELLE" chiquito, **abajo y centrado, en TODO el video**
  (anti-robo), tamaño delicado (~52 px de alto en 1080×1920, top 1786).
- **Palabra clave del CTA = "BELLE"** ("Escribinos BELLE por mensaje directo"), no otra.
- Videos guardados en `marketing/videos/<nombre>/` (fuente HTML + render.js + MP4).
- ElevenLabs gratis **bloqueó la cuenta** ("unusual activity… proxy or VPN") al generar desde el entorno cloud:
  Ger genera los bloques desde su navegador y me pasa los MP3. Bloque 1 (Dante) ya está.

### Bot de Instagram (pendiente, idea)
- El bot de WhatsApp es la edge function `belle-whatsapp` (repo aparte "belle-whatsapp", deploy por GitHub
  Actions; NO está en este repo). Está separado en canal (`whatsapp.ts`) y cerebro (`cerebro.ts`, `prompt.ts`,
  `catalogo.ts`, `precios.ts`, `pedido.ts`…). Para Instagram se agrega un canal `instagram.ts` + rama del webhook
  para `object: "instagram"` (DMs) y `comments` (responder comentarios y mandar el privado por "private reply"),
  reutilizando el mismo cerebro. Requiere: IG profesional vinculada a una Página de FB, la app de Meta con el
  producto Instagram y permisos `instagram_manage_messages` / `instagram_manage_comments` (+ App Review).

### ✅ APROBADO: Academia 01 · Concentraciones (2026-11-14) — "me encantó"
- Archivo: `marketing/videos/academia-01-concentraciones/` (index.html + frases.py/timing.js + MP3 de Dante + MP4).
- **Fórmula que funcionó (repetir en los próximos de la Academia):**
  1. **Gancho 0–15 s = tipografía cinética GIGANTE** a pantalla completa (Baloo 2 800, 300–620 px, auto-ajuste al
     ancho), **un corte de color por frase** (mostaza #F4B63A / negro / blanco / coral #FF5A4E), efectos variados
     (golpe con rebote, caída, letras que saltan, temblor, recuadro que se dibuja, letra hueca, tachado en vivo) y
     **emojis chicos** (84 px) que rebotan. Al final del gancho la capa sube y aparece la maqueta normal.
     (El primer gancho, con frasco "?" en tarjeta, NO enganchaba.)
  2. Cuerpo: fondo mostaza con puntitos, barra de capítulos 1/4…4/4, titular Baloo con palabra en recuadro blanco,
     tarjeta blanca con borde negro y sombra dura, **ilustraciones de producto reales (botellas SVG de vidrio con
     la cantidad marcada adentro)** — nada de gráficos simples —, subtítulos karaoke con palabra clave resaltada.
  3. Cierre: fondo negro, "Escribinos **BELLE**", marca de agua B. fija.
- **Voz: Dante** (ElevenLabs, id DzZyY3xqjLUXGaT9wykC, eleven_v4), generada por bloques (~400–550 caracteres) —
  el texto entero de una vez daba "busy". Tiempos de cada frase con `ffmpeg silencedetect` → `frases.py` → `timing.js`.

## Usos de historia pedidos (para cuando se defina el estilo)
Producto/Novedad · Oferta (precio tachado + %) · Combo (2 productos) · Llegó stock · Reseña de cliente.
Más adelante: campañas por fecha (Black Friday/Cyber, Navidad, Día de la Madre), reels, prueba social.


## Voces ElevenLabs (plan Starter desde 2026-11-15, uso comercial incluido)
- **Dante** (masculina) — voice_id `DzZyY3xqjLUXGaT9wykC`. Voz de la Academia 01–06 y del Especial 01.
- **Belle Femenina (AR)** (diseñada, rioplatense con voseo) — voice_id `7hwWxK75z20rN4syVI8W`. Elegida por Ger (opción B) para los próximos videos.
- Modelo `eleven_v4`, flow `W8ZOFVuCySGeyTjKmjMC`, 1 toma por bloque.

## Música — REGLA DE GER: NUNCA repetir música entre videos (cada video lleva una pista nueva y distinta)
- SIN percusión hecha con ruido blanco (hats/palmas/shaker suenan a "estática" en el celu): usar percusión tonal + lowpass 6 kHz a la pista. Mezcla final con limitador, NO loudnorm (hace "respirar" el fondo).
- VOZ: NO usar loudnorm dinámico (la voz de ElevenLabs viene a ~-28 LUFS y al subirla 13 dB de golpe suena "saturada, como que satura el micrófono"). Cadena: highpass 70 + treble -2 dB a 7 kHz + acompressor suave (thr -24, ratio 2.5) + ganancia lineal a -17 LUFS + alimiter 0.8.
- Toda nota con fundido de entrada/salida (si no, chasquidos: el especial 01 sonaba "roto" por eso). Verificar saltos de muestra antes de mezclar.
- Ducking suave (ratio ~2, release ~900 ms), nada de bombeo. Nivel: música a ~-29 dB de media (Ger la quiere bajita; -26 le pareció un pelín alto) (medir con volumedetect; cada pista tiene distinto volumen, no usar un % fijo).
- Usadas: Academia 05 = house 120 BPM (beat.py) · Academia 06 = nu-disco (power.py v2) · Especial 01 = sunny funk-pop 112 BPM (musica_especial01.py).

## Música aprobada (histórico)
- Videos con ritmo: **nu-disco** (`marketing/videos/academia-06-proyeccion-estela/musica_power.py`, variante 2), siempre bajita (volume 0.13 + sidechain para que la voz sea protagonista).
- Suaves para otros videos: `marketing/musica/favoritas-suaves/` (le encantaron, guardadas para más adelante).
