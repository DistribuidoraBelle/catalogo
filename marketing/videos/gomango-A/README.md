# Go Mango · estilo A (Póster pop) · 1080×1920 · 10,5 s · 30 fps · sin audio (la música se pone en IG)
Re-render: `node render.js "$PWD" video` (frames a ./frames) y
`ffmpeg -framerate 30 -i frames/f%04d.jpg -c:v libx264 -crf 17 -pix_fmt yuv420p -movflags +faststart gomango_A.mp4`.
Cuadros sueltos: `node render.js "$PWD" stills 1.0,3.3,7.7`. Todo el movimiento sale de `render(t)` en index.html.
Recorte del producto: `herramientas/recorte_limpio.py --upscale 2.2` (revisado sobre magenta/negro).
