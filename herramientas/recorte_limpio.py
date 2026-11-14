#!/usr/bin/env python3
"""Recorte limpio de fotos de producto con fondo blanco (para historias / videos).

Uso:  python3 herramientas/recorte_limpio.py entrada.jpg salida.png [--check check.png]

Qué hace (pensado para que NO quede nada del fondo blanco):
  1. Detecta píxeles casi blancos y sin color (fondo).
  2. Saca el fondo conectado al borde de la foto.
  3. Saca también los HUECOS blancos encerrados (ej. el agujero de una manija/tapa),
     si son planos y bien blancos (no confunde un frasco blanco con sombras).
  4. Abre la máscara para borrar líneas finas (piso/reflejo de la foto) y se queda
     solo con las piezas grandes (el producto).
  5. Come 2 px del borde (mata el halo blanco) y suaviza 1 px (borde limpio, sin serrucho).
  6. Recorta al contenido.
--check genera una prueba sobre magenta y sobre negro: si se ve blanco ahí, está mal.
Requiere: pip install pillow numpy scipy
"""
import argparse
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--check')
ap.add_argument('--tol', type=int, default=24, help='cuán blanco cuenta como fondo (0-255)')
ap.add_argument('--erode', type=int, default=3)
ap.add_argument('--open', dest='open_px', type=int, default=4, help='grosor de líneas finas a borrar')
ap.add_argument('--upscale', type=float, default=1.0, help='agrandar (Lanczos) antes de recortar')
a = ap.parse_args()

im = Image.open(a.src).convert('RGB')
if a.upscale != 1.0:
    im = im.resize((round(im.width * a.upscale), round(im.height * a.upscale)), Image.LANCZOS)
rgb = np.asarray(im).astype(np.int16)
h, w, _ = rgb.shape
mn, mx = rgb.min(2), rgb.max(2)
white = (mn >= 255 - a.tol) & ((mx - mn) <= 18)

lab, n = ndi.label(white)
remove = np.zeros_like(white)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
area_min = 0.0015 * h * w
gray = rgb.mean(2)
for i, sl in enumerate(ndi.find_objects(lab), start=1):
    if sl is None:
        continue
    m = lab[sl] == i
    if i in border:
        remove[sl] |= m
        continue
    area = m.sum()
    if area >= area_min:
        vals = gray[sl][m]
        if vals.mean() >= 251 and vals.std() <= 3:   # hueco blanco plano = fondo
            remove[sl] |= m

# piso / banda de reflejo: filas gris claro y planas que cruzan TODA la foto de lado a lado
light = (mn >= 190) & ((mx - mn) <= 18)
grey = light & (mn < 245)          # gris claro, no blanco de fondo
for y in range(h):
    row = light[y]
    if row[0] and row[-1] and grey[y].mean() > 0.85 and gray[y].std() < 4:
        remove[y] |= row

fg = ~remove
# borrar líneas finas (piso, reflejos) y basura chica
if a.open_px > 0:
    st = np.ones((a.open_px * 2 + 1, a.open_px * 2 + 1), bool)
    yy, xx = np.ogrid[-a.open_px:a.open_px + 1, -a.open_px:a.open_px + 1]
    st = (xx * xx + yy * yy) <= a.open_px * a.open_px
    fg = ndi.binary_opening(fg, structure=st)
lab2, n2 = ndi.label(fg)
if n2:
    sizes = ndi.sum(fg, lab2, range(1, n2 + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s >= 0.02 * sizes.max()]
    fg = np.isin(lab2, keep)
if a.erode > 0:
    fg = ndi.binary_erosion(fg, iterations=a.erode)

alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
out = im.copy(); out.putalpha(alpha)
bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
out = out.crop(bbox)
out.save(a.dst)

if a.check:
    s = 700 / out.height
    o = out.resize((max(1, round(out.width * s)), 700), Image.LANCZOS)
    sheet = Image.new('RGB', (o.width * 2 + 30, 700), (40, 40, 40))
    for k, col in enumerate([(255, 0, 255), (10, 10, 10)]):
        bg = Image.new('RGB', o.size, col); bg.paste(o, (0, 0), o)
        sheet.paste(bg, (k * (o.width + 30), 0))
    sheet.save(a.check)
print(a.dst, out.size)
