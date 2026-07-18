# Marketing Audit: Distribuidora Belle
**URL:** https://distribuidorabelle.com
**Fecha:** 2026-07-18
**Tipo de negocio:** E-commerce / Distribuidora local (perfumería árabe e internacional) — venta minorista y mayorista, checkout por WhatsApp
**Marketing Score global: 68/100 (Grado: C)**

> Alcance del análisis: auditado directamente sobre el **código fuente desplegado** del sitio (repo `catalogo`, GitHub Pages), porque el dominio devuelve 403 a fetchers automáticos. Cubre la home/catálogo (`index.html` / `catalogo_index.html`), manifest PWA y assets. No incluye datos de tráfico real (Analytics), por lo que los impactos de ingresos se expresan como % condicionados a tu tráfico, no en pesos inventados.

---

## Resumen Ejecutivo

Distribuidora Belle tiene un sitio **muy por encima del promedio de una distribuidora de perfumería**: es una PWA instalable, con un catálogo de ~276 marcas/productos, buscador inteligente (por nombre, por acordes y por notas olfativas como "bergamota, rosa, vetiver"), identidad visual elegante (serif Cormorant Garamond, dorado #c4965a) y checkout por WhatsApp con mensaje pre-armado. El fuerte del proyecto es el **producto y la experiencia de compra**, no el marketing de captación.

La mayor fortaleza es la **UX de catálogo + conversión por WhatsApp**: para un negocio de 276 SKUs vendido por chat, el buscador por notas y el mensaje pre-armado reducen fricción de forma notable. También hay señales de una estrategia de crecimiento inteligente (habilitar revendedoras con tarjetas personalizables — "Hecho para que vendas más" — y "Academia Belle" próximamente).

La mayor brecha es el **SEO técnico y las señales de confianza**. El sitio tiene buenos `<title>`/meta description y Open Graph, pero le falta lo que hace que Google lo muestre y le crea: **no hay datos estructurados (JSON-LD), ni sitemap.xml, ni robots.txt, ni etiqueta canonical**, la mitad de las imágenes no tienen `alt`, y hay páginas casi duplicadas indexables (`index.html`, `catalogo_index.html`, `index_prueba.html`). Para una perfumería que vende "100% originales", **no hay reseñas, testimonios ni prueba de autenticidad visibles** — el claim más importante del negocio no está respaldado.

**Las 3 acciones que más mueven la aguja:**
1. Agregar **JSON-LD `LocalBusiness` + `Product`** (schema) → elegibilidad para resultados enriquecidos y Google local en Córdoba.
2. Publicar **sitemap.xml + robots.txt** y definir **canonical** (elegir UNA home; bloquear/eliminar `index_prueba.html`).
3. Sumar **prueba social y de autenticidad** (reseñas, capturas de clientas, garantía de originalidad) cerca del CTA.

Impacto estimado si se implementan las recomendaciones: **+15% a +35% de conversión** del tráfico actual + mejora de indexación/tráfico orgánico local (magnitud depende de tu volumen — ver sección de impacto).

---

## Score Breakdown

| Categoría | Score | Peso | Ponderado | Hallazgo clave |
|----------|-------|------|-----------|----------------|
| Contenido & Mensaje | 72/100 | 25% | 18.0 | Marca clara y elegante; hero funcional pero sin propuesta de valor persuasiva |
| Optimización de Conversión | 74/100 | 20% | 14.8 | Checkout WhatsApp pre-armado + buscador por notas = baja fricción |
| SEO & Descubribilidad | 58/100 | 20% | 11.6 | Buen meta/OG, pero sin schema, sitemap, robots ni canonical; alts a medias |
| Posicionamiento Competitivo | 65/100 | 15% | 9.75 | Diferenciación "árabes 100% originales" + revendedoras, sin páginas de prueba |
| Marca & Confianza | 70/100 | 10% | 7.0 | Identidad fuerte, equipo/IG/ubicación; falta prueba de autenticidad |
| Crecimiento & Estrategia | 68/100 | 10% | 6.8 | Loops buenos (revendedoras, Academia, PWA) pero varios "muy pronto" |
| **TOTAL** | | **100%** | **68/100** | Grado C — buena base, brechas claras y accionables |

---

## Quick Wins (Esta Semana)

1. **Agregar `<link rel="canonical">` a cada página** apuntando a la home elegida (ej. `https://distribuidorabelle.com/`). Hoy conviven `index.html`, `catalogo_index.html` e `index_prueba.html` con contenido casi idéntico → Google reparte autoridad y puede indexar la de "prueba". *Impacto: evita canibalización SEO. Esfuerzo: 15 min.*
2. **Sacar de índice `index_prueba.html`** (borrarla, o `<meta name="robots" content="noindex">`). Una página "prueba" pública transmite descuido y compite con la real. *Esfuerzo: 5 min.*
3. **Crear `robots.txt` + `sitemap.xml`** listando las URLs reales. Sin esto, Google descubre el sitio más lento y de forma incompleta. *Esfuerzo: 30 min.*
4. **Completar `alt` en las imágenes** (hoy 25 de 51 lo tienen, ~49%). Usar `alt="[Marca] [Nombre] perfume árabe original"`. Mejora SEO de imágenes y accesibilidad. *Esfuerzo: 1-2 h.*
5. **Sumar prueba social al hero/CTA**: 2-3 reseñas reales de clientas, o "+X clientas en Córdoba", o captura de WhatsApp con un testimonio. El claim "100% originales" necesita respaldo visible. *Impacto: alto en conversión. Esfuerzo: 1 h.*
6. **Reforzar el H1 con propuesta de valor.** Hoy el hero es "¿Qué perfume buscás?" (funcional). Probar algo que combine beneficio + confianza: *"Perfumes árabes e internacionales 100% originales, con entrega en Córdoba"* visible arriba del buscador. *Esfuerzo: 20 min.*

## Recomendaciones Estratégicas (Este Mes)

1. **Datos estructurados JSON-LD.** Agregar `LocalBusiness` (nombre, dirección de Córdoba, teléfono WhatsApp, horario, geo) y `Product` por ítem (nombre, marca, precio, disponibilidad). Es la palanca #1 de SEO local + resultados enriquecidos para una perfumería física. *Resultado esperado: aparición en Google local/Maps y rich snippets.*
2. **Página/sección de autenticidad y garantía.** "Cómo sabés que son originales" — origen, importación, garantía de devolución. Convierte tu principal objeción (¿son truchos?) en ventaja. Enlazar desde cada producto.
3. **Reseñas sistematizadas.** Pedir reseña por WhatsApp post-venta (link a Google Business + captura para el sitio). Meta: 20-30 reseñas en 30 días. Alimenta schema `AggregateRating` y confianza.
4. **Transparencia de precios.** Si hoy el precio se ve recién al abrir WhatsApp, mostrar rango o precio en el catálogo reduce fricción y descarta curiosos, mejorando la calidad del lead.

## Iniciativas de Largo Plazo (Este Trimestre)

1. **Programa de revendedoras formalizado.** Ya hay señales ("Hecho para que vendas más", tarjetas personalizables). Convertirlo en un canal: catálogo mayorista, material listo para compartir, niveles de descuento. Es tu loop de crecimiento más fuerte (cada revendedora te trae clientas).
2. **Academia Belle (contenido/educación).** Está "muy pronto" — lanzarla como motor de SEO y autoridad: guías de perfumería árabe, notas olfativas, "cómo elegir". Captura tráfico informativo que hoy no tenés.
3. **SEO de contenido por marca/nota.** Páginas indexables tipo "Perfumes árabes en Córdoba", "[Marca] original", "perfumes amaderados" — aprovechando que ya tenés buscador por acordes y 276 productos como base de datos.

---

## Análisis Detallado por Categoría

### Contenido & Mensaje — 72/100
- ✅ Propuesta clara en meta/OG: "árabes e internacionales 100% originales", "entrega en Córdoba", "mayoristas y minoristas".
- ✅ Identidad de marca coherente y premium (tipografía serif, paleta dorada, secciones "Nuestro equipo / Seguinos / Encontranos").
- ⚠️ El hero visible es funcional ("¿Qué perfume buscás?") — no comunica valor ni confianza arriba del pliegue.
- ⚠️ No hay narrativa de marca visible (por qué Belle, historia, diferencial de originalidad) en la primera pantalla.

### Optimización de Conversión — 74/100
- ✅ Checkout por WhatsApp con **mensaje pre-armado** (nombre + producto) — ideal para este mercado.
- ✅ Buscador multi-modo (nombre, acordes, notas) sobre 276 productos = descubrimiento de baja fricción.
- ✅ PWA instalable → recompra fácil.
- ⚠️ Sin prueba social cerca del CTA; sin urgencia/escasez (stock, ofertas destacadas visibles).
- ⚠️ Precio aparentemente recién en WhatsApp → fricción y leads menos calificados.

### SEO & Descubribilidad — 58/100
- ✅ `<title>` y `meta description` optimizados con keywords locales; OG e Twitter Card completos (imagen 1200×630); `robots: index, follow`.
- ❌ **Sin JSON-LD / schema** (0 en ambas páginas) — sin `LocalBusiness` ni `Product`.
- ❌ **Sin sitemap.xml ni robots.txt.**
- ❌ **Sin `canonical`** + páginas casi duplicadas (`index`, `catalogo_index`, `index_prueba`) → riesgo de canibalización.
- ⚠️ ~51% de imágenes sin `alt`.

### Posicionamiento Competitivo — 65/100
- ✅ Nicho claro: perfumería **árabe** + internacional, originalidad, foco Córdoba.
- ✅ Ángulo de habilitación de revendedoras = diferencial vs. tiendas puras.
- ⚠️ Sin páginas comparativas ni de prueba de autenticidad que capitalicen el diferencial.
- ⚠️ Sin presencia visible de reputación de terceros (Google reviews, etc.).

### Marca & Confianza — 70/100
- ✅ Identidad visual fuerte; secciones de equipo, Instagram embebido y ubicación física ("Encontranos").
- ✅ Canales de contacto directos (WhatsApp +54 9 351, IG).
- ❌ El claim central "100% originales" no tiene respaldo (certificados, reseñas, UGC).
- ⚠️ Sin testimonios/reseñas en el sitio.

### Crecimiento & Estrategia — 68/100
- ✅ Loops en marcha: revendedoras ("vendé más" + tarjetas), Academia Belle, PWA (retención).
- ✅ Modelo dual minorista/mayorista.
- ⚠️ Varias piezas en "muy pronto" — potencial sin ejecutar.
- ⚠️ Sin captura de email/lead nurture; dependencia total de WhatsApp e IG.

---

## Comparación Competitiva

No se auditaron competidores específicos en esta corrida (requiere URLs). Sugerido para `/market competitors`: comparar contra otras distribuidoras de perfumería árabe en Argentina (ej. tiendas de Mercado Libre + sitios propios) en: prueba de originalidad, transparencia de precio, reseñas y SEO local.

---

## Resumen de Impacto en Ingresos

> Sin datos de Analytics no se puede calcular en pesos. Fórmula: `visitas/mes × mejora de conversión × ticket promedio`. Completá tus visitas y ticket para cuantificar.

| Recomendación | Impacto estimado | Confianza | Plazo |
|---------------|------------------|-----------|-------|
| Prueba social + autenticidad cerca del CTA | +8–15% conversión | Alta | 1 sem |
| Transparencia de precio en catálogo | +5–10% conversión (leads mejores) | Media | 1 sem |
| Schema LocalBusiness + Product | +tráfico orgánico local (Maps/rich results) | Alta | 2–3 sem |
| Sitemap/robots/canonical + noindex prueba | Mejor indexación, menos canibalización | Alta | 1 sem |
| Reseñas sistematizadas (20–30) | +confianza, +CTR orgánico | Alta | 30 días |
| Programa de revendedoras | Canal de adquisición compuesto | Media | Trimestre |
| **Efecto combinado** | **+15% a +35% conversión + orgánico local** | | |

---

## Próximos Pasos

1. **Esta semana:** canonical + `noindex`/borrar `index_prueba.html` + robots.txt/sitemap.xml + completar `alt` + sumar 2-3 reseñas al hero.
2. **Este mes:** JSON-LD (`LocalBusiness` + `Product`), sección de autenticidad/garantía, pedir reseñas por WhatsApp.
3. **Este trimestre:** formalizar revendedoras, lanzar Academia Belle, páginas SEO por marca/nota.

**Comandos de seguimiento sugeridos:**
- `/market seo distribuidorabelle.com` — plan de SEO detallado (schema, sitemap).
- `/market copy distribuidorabelle.com` — reescribir hero y propuesta de valor.
- `/market competitors <url>` — inteligencia competitiva vs. otras distribuidoras.
- `/market brand distribuidorabelle.com` — sistematizar voz y confianza de marca.

*Generado por AI Marketing Suite — `/market audit`*
