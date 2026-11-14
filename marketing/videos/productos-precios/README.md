# Videos de producto con precios (12,5 s, 1080×1920, música original)
- `*_n.mp4` = versión normal: **precio x10 grande** ("c/u llevando 10 unidades") + x3 + precio de lista.
- `*_p.mp4` = versión promo: lista y x3 **tachados** + **precio promo grande resaltado** (promo de EJEMPLO −20%:
  no había ofertas cargadas en `ofertas_vigentes`; cambiar `promo`/`promoPct` en el data_*.js).
- Estilos: Go Mango = A póster pop (`theme_pop.js`), Asad Black = B suizo (`theme_swiss.js`),
  Fakhar Platin Silver = C collage (`theme_collage.js`). Motor común: `engine.html` + `data.js`.
- Música: `beat.py` (house 120 BPM sintetizado desde cero, sin samples → libre de derechos), `beat.wav` normalizado -14 LUFS.
- Para otro producto: copiar engine.html→index.html, theme_X.js→theme.js, data.js con nombre/notas/precios,
  prod.png (recorte con herramientas/recorte_limpio.py) y logo.png; render con render.js y mux con beat.wav.
