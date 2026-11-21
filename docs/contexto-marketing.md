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


## CIERRE DE LOS VIDEOS (regla nueva de Ger, 2026-11-17)
- De ahora en más los videos NO terminan con "escribinos BELLE por DM". Terminan mandando a la web:
  voz: "…lo encontrás en distribuidorabelle.com" + pantalla final "LOS ENCONTRÁS EN / logo B. / distribuidorabelle.com".
- Fotos de perfumes en videos: SOLO LA BOTELLA, sin caja, fondo transparente (Fragrantica thumbs `fimgs.net/mdimg/perfume-thumbs/dark-375x500.<id>.2x.avif` vienen con alfa). Nada de recortes con pedazos blancos.
- Voz de las series y publicidades: Dante.

## Series — ajustes Odyssey P1 v4 (2026-11-17)
- Intro de cada serie: **dorado, claro y llamativo** (fondo champagne/dorado con rayos y destellos, logo de la marca como "planeta" dorado con los frascos orbitando). Ger rechazó el fondo oscuro tipo espacio.
- En la transición "Parte X" los frascos **siguen orbitando igual** (nada de giro/flip 2D, a Ger no le gustó).
- Cada perfume lleva, además de la frase poética, una **línea marketinera** en voz + **sticker estallido** amarillo (ej. "🔥 ROMPECUELLOS / EL MÁS VENDIDO", "💖 GUSTA A TODAS", "🎁 IDEAL PARA REGALAR").
- Pronunciación: en el texto del TTS escribir **"distribuidora Bel, punto com"** (si no, Dante dice "beye").
- Audio: `alimiter` SIEMPRE con `level=disabled` (si no, aplica auto-ganancia y clipea a 0 dB).
- Tiempos de frase: transcribir la voz con ElevenLabs Scribe (timestamps por palabra) es más confiable que adivinar con silencedetect.

## Series de perfumes — regla de contenido (2026-11-17)
- Las series hablan de **TODOS los perfumes de la línea**, estén o no en catálogo y tengan o no stock (pedido de Ger). No filtrar por stock.
- Agrupar por estilo, ~7-8 por video (si son más, no hay drama).
- Inspiraciones: usar la ficha (`fichas_perfume`); si no hay dato confiable, preguntar a Ger antes de grabar. Si es "composición propia que va para el lado de X", mostrar las botellitas de referencia en fila con el cartel dorado.
- **Armaf Odyssey (33 perfumes, 4 partes):**
  1. Dulces (9): Mandarin Sky, MS Elixir, MS Vintage, Black Forest, Dubai Chocolat, Candee, Marshmallow, Toffee Coffee (Amore Caffè), Soda Pop (Tonka Cola).
  2. Intensos (8): Homme, Homme White, Spectra, Spectra Blue (Ultra Male), Artisto, Revolution, Aoud (Initio Oud for Greatness), Eau de Montagne.
  3. Frescos (7): Aqua, Tyrant, Limoni Fresh, Bahamas (Le Sel d'Issey), Mega Man (YSL Y EDP), Wild One (Sauvage), Nexus (Acqua di Giò Profumo).
  4. Frutales, florales y Spicy Collection (9): Li'chi Lush (Harrods Ruby Naga), Pink Pop (Kurky MFK), French Kiss (Vanilla Powder + toque Delina), Go Mango, Femme White (→ Gucci Bloom / Valentino Donna / Coco Mademoiselle), Femme Black (→ Good Girl / My Burberry Black), Bloody Hot (propia, trago Bloody Mary), Jalapeach-O (propia), Ring My Bell (propia → Santal 33).

## Club de Nuit — ESTILO F aprobado (2026-11-18) ❤️ "lo amé"
- Cada serie tiene estilo propio. Club de Nuit = **estilo F**: palabra gigante (Anton) DETRÁS del frasco + **explosión congelada de notas REALES recortadas** (una por una, distintos tamaños, sin fondo) + fondo de color por perfume + cámara que avanza lento. Código: `marketing/videos/series/clubdenuit-parte1/estilo_F/` (scene.js genérico + cfg.js por parte + guiones en scratchpad `guiones.py`).
- Rechazados antes: Odyssey-like, lux v1-v3, editorial (A), estudio claro (B), tráiler (C), cómic (D), neón (E), sumergido (G).
- **Notas reales:** banco de recortes en `marketing/notas-recortes/` (~59 notas, índice `indice.js`). Se generan con ElevenLabs (seedream-5-pro, 2 notas por imagen sobre fondo blanco, "spread apart") + rembg isnet + componentes conexas. NADA de fotos de pilas de frutas: siempre objetos individuales.
- **Intro:** logo Armaf como medallón dorado con brillo que sube desde abajo y pisa ~1/4 de los frascos. **SIN "¡Arrancamos!"** (ni voz ni efecto): del intro pasa directo al primer perfume.
- **Logo Belle + www.distribuidorabelle.com SIEMPRE en pantalla** (marca de agua abajo, todo el video).
- **Voz por perfume:** arranca con una **frase emocional dirigida a la gente** ("Si buscás elegancia, es este", "Nadie se resiste a este aroma", "Te van a preguntar qué tenés puesto"…) y después nombre, notas, frase y "inspirado en". La frase emocional también va escrita a mano (Caveat) arriba del frasco.
- **Cierre:** "¿Con cuál te quedás? Comentalo." + "Y si querés ver las otras partes de la serie, o más series de perfumes, están todas en nuestro perfil: ¡seguinos!" + placa web.
- Foto del Man Improved: armada desde la del Man (jugo ámbar más oscuro + tapa gunmetal) porque la original tenía bordes rotos. Ger nota al instante cualquier borde roto.
- **SINCRONÍA (lección 2026-11-18):** NO alinear con silencios (`align.py` + silencedetect): con voces sin pausas se corre hasta 2-3 s y Ger lo nota. Usar SIEMPRE la transcripción de ElevenLabs Scribe con tiempos por palabra (`_taller/align_stt.py`, `build_part.py n stt`; API `POST /v1/speech-to-text` model_id=scribe_v1, timestamps_granularity=word).
- ElevenLabs por API: la key de Ger está guardada en el entorno (header xi-api-key, la inyecta el proxy). TTS: `POST /v1/text-to-speech/DzZyY3xqjLUXGaT9wykC` con model_id eleven_v4. Sirve cuando el conector MCP se cae.

### Música de las series (2026-11-19)
- **Ahora la música se genera con la API de música de ElevenLabs** (`POST /v1/music`, `{prompt, music_length_ms}`). La calidad es muy superior a la sintetizada por código; Ger no quiere volver a la sintética ("deprimente").
- El flujo: se generan 5-6 previews de 30 s sobre el video con voz, Ger elige y después se genera el tema completo.
- **Hawas Parte 1:** quedó la **1 Tropical house**.
- **Nu-disco funk (opción 3):** a Ger le gustó para **otra parte de la serie Hawas**. Usarla en una próxima parte.
- Los prompts están en `marketing/videos/series/_taller/musica_hawas/prompts.txt`.

### Hashtags (2026-11-19)
- Ger confirmó que **en su cuenta Instagram le deja poner muchos hashtags** (no lo bloquea al límite de 5). Usar **~30 hashtags** por texto (marca + categoría + nicho + virales).

### Fondos animados (2026-11-21)
- Los escenarios se pueden **animar con IA**: ElevenLabs connector, video `veo-3.1-fast-generate-001`, 9:16 1080p 8 s, sin audio, ~4850 créditos c/u. Usar la **imagen del escenario como start_frame** (se sube por URL pública de raw.githubusercontent del repo) y prompt "locked-off static camera… pedestal perfectly still… only the background animates…". Así el pedestal queda en el mismo lugar y el `ped` medido sigue sirviendo.
- En el motor: escena `vid_<nombre>` → frames en `fotos/vid_<nombre>/f%04d.jpg` (ffmpeg), reproducidos en cámara lenta 0.5x con ida y vuelta (función `SH()` en scene.js; render espera la carga de cada frame).
- Ger pidió esto para la Parte 4 (fuego que se mueve, rayos que explotan, etc.) y para los Apex (Parte 8: circuito, F1 híbrido, Gran Turismo).
