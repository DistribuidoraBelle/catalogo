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

## Usos de historia pedidos (para cuando se defina el estilo)
Producto/Novedad · Oferta (precio tachado + %) · Combo (2 productos) · Llegó stock · Reseña de cliente.
Más adelante: campañas por fecha (Black Friday/Cyber, Navidad, Día de la Madre), reels, prueba social.
