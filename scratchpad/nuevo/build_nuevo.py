import sys,re,os
S=os.path.dirname(os.path.abspath(__file__)); REPO='/home/user/catalogo'
real='--real' in sys.argv; suave='--suave' in sys.argv; belle='--belle' in sys.argv; p4='--p4' in sys.argv
src=open(REPO+'/index.html',encoding='utf-8').read()
MARK='<!-- BELLE NUEVO 2026-10-25 -->'
if MARK in src: src=src[:src.index(MARK)]+'</body>\n</html>\n'
css=open(S+'/nuevo.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_menus.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_ficha.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_vistas.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_paneles.css',encoding='utf-8').read(); js=open(S+'/nuevo.js',encoding='utf-8').read()
js=js.replace('__NV_REAL__','true' if real else 'false').replace('__NV_SUAVE__','true' if suave else 'false')
def suavizar(t):
    # variante "prueba 2": contornos más delicados. Bordes de tinta de 2px/1.5px → 1px, sombras duras a la mitad,
    # y el negro de bordes y sombras un poco menos cerrado.
    LINEA='#2b3350'
    def borde(m):
        w=float(m.group(1)); nw='1' if w>=1.5 else m.group(1)
        return nw+'px '+m.group(2)+' '+LINEA
    t=re.sub(r'(\d+(?:\.\d+)?)px (solid|dashed|dotted) (?:var\(--nv-ink(?:,[^)]*)?\)|#0b1020)',borde,t)
    def sombra(m):
        def h(v):
            v=float(v); s=-1 if v<0 else 1; v=abs(v); nv=max(1,round(v/2)) if v>=2 else v
            return str(int(nv) if float(nv).is_integer() else nv)
        col=m.group(3); col=LINEA if ('nv-ink' in col or col=='#0b1020') else col
        return h(m.group(1))+'px '+h(m.group(2))+'px 0 '+col
    t=re.sub(r'(-?\d+(?:\.\d+)?)px (-?\d+(?:\.\d+)?)px 0 (var\(--nv-ink(?:,[^)]*)?\)|#0b1020|#22d3ee|var\(--nv-viol(?:,[^)]*)?\)|#8b5cf6|#ff3d8d|#a78bfa)',sombra,t)
    return t
if suave: css=suavizar(css)+'\n'+open(S+'/nuevo_suave.css',encoding='utf-8').read(); js=suavizar(js)
# variante "prueba 3": la misma prueba 2 pero en la paleta de Belle (dorados, mostazas, cobre y tinta marrón) en vez de la del Cyber.
from belle_paleta import BELLE,bellizar
# El Inicio (portada, cartel, recuadros, cinta) conserva los colores de la prueba 2: sus reglas y su JS no pasan por el mapeo.
HOME_SEL=re.compile(r'#homePage|\bhb-|#hbRects|#hbFoto|nv-cartel|nv-f-|mc-scroll|cinta',re.I)
def bellizar_css(t):
    return re.sub(r'([^{}]+)\{([^{}]*)\}',lambda m: m.group(0) if HOME_SEL.search(m.group(1)) else m.group(1)+'{'+bellizar(m.group(2))+'}',t)
def bellizar_js(t):
    a=t.index('  function cinta(){'); b=t.index('  function selectorFondos()')
    return bellizar(t[:a])+t[a:b]+bellizar(t[b:])
if belle: css=bellizar_css(css)+'\n'+open(S+'/nuevo_belle.css',encoding='utf-8').read(); js=bellizar_js(js)
# (la prueba 4 ya forma parte de nuevo_belle.css; --p4 solo cambia el archivo de salida)
bloque=MARK+'\n<style id="nuevoCss">\n'+css+'\n</style>\n<script id="nuevoJs">\n'+js+'\n</script>\n'
i=src.rindex('</body>')
out=src[:i]+bloque+src[i:]
if not real: out=out.replace("'card.html?id='","'card-nuevo-prueba.html?id='")
dst=REPO+('/index.html' if real else ('/index-nuevo-prueba-4.html' if p4 else '/index-nuevo-prueba-3.html' if belle else ('/index-nuevo-prueba-2.html' if suave else '/index-nuevo-prueba.html')))
open(dst,'w',encoding='utf-8').write(out); print('ok ->',dst,len(out))
