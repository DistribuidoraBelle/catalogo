import sys,re,os
S=os.path.dirname(os.path.abspath(__file__)); REPO='/home/user/catalogo'
real='--real' in sys.argv; suave='--suave' in sys.argv; belle='--belle' in sys.argv; p4='--p4' in sys.argv; p5='--p5' in sys.argv
src=open(REPO+'/index.html',encoding='utf-8').read()
MARK='<!-- BELLE NUEVO 2026-10-25 -->'
HMARK='<!-- BELLE NUEVO head -->'; HEND='<!-- /BELLE NUEVO head -->'
if MARK in src: src=src[:src.index(MARK)]+'</body>\n</html>\n'
if HMARK in src: src=src[:src.index(HMARK)]+src[src.index(HEND)+len(HEND):]
css=open(S+'/nuevo.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_menus.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_ficha.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_vistas.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_paneles.css',encoding='utf-8').read(); js=open(S+'/nuevo.js',encoding='utf-8').read()
js=js.replace('__NV_SUAVE__','true' if suave else 'false')
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
if belle: css=bellizar_css(css)+'\n'+open(S+'/nuevo_belle.css',encoding='utf-8').read()+'\n'+open(S+'/nuevo_regaleria.css',encoding='utf-8').read(); js=bellizar_js(js)
# (la prueba 4 ya forma parte de nuevo_belle.css; --p4 solo cambia el archivo de salida)
# (la prueba 5 ya forma parte de nuevo_belle.css; --p5 solo cambia el archivo de salida)
# 2026-11-05: el CSS del tema y la decisión de encenderlo van en <head>, así el PRIMER cuadro ya sale con el tema
# (antes estaban al final de un archivo de 2 MB y el navegador pintaba la versión clásica un instante). El JS queda al final.
gate=('<script>window.__NV_REAL='+('true' if real else 'false')+';(function(){try{var q=new URLSearchParams(location.search).get("nuevo");if(q==="0")return;'
      'var REAL='+('true' if real else 'false')+',DESDE=Date.UTC(2026,10,5,3,0,0);if(REAL&&q!=="1"&&Date.now()<DESDE)return;'
      'var h=document.documentElement,cl=false;try{cl=localStorage.getItem("nv_clasica")==="1";}catch(e){}'
      'if(cl&&q!=="1"){h.classList.add("nv-clasica");return;}h.classList.add("nv");'
      'var v="";try{v=localStorage.getItem("nv_vista")||"";}catch(e){}if(v==="renglones"&&window.innerWidth>680)h.classList.add("nv-v-ren");else if(v==="recuadros")h.classList.add("nv-v-rec");'
      'var l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap";document.head.appendChild(l);'
      '}catch(e){}})();</script>')
cabeza=HMARK+'\n<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'+gate+'\n<style id="nuevoCss">\n'+css+'\n</style>\n'+HEND
assert src.count('</head>')==1
src=src.replace('</head>',cabeza+'\n</head>',1)
bloque=MARK+'\n<script id="nuevoJs">\n'+js+'\n</script>\n'
i=src.rindex('</body>')
out=src[:i]+bloque+src[i:]
dst=REPO+('/index.html' if real else ('/index-nuevo-prueba-5.html' if p5 else '/index-nuevo-prueba-4.html' if p4 else '/index-nuevo-prueba-3.html' if belle else ('/index-nuevo-prueba-2.html' if suave else '/index-nuevo-prueba.html')))
open(dst,'w',encoding='utf-8').write(out)
sys.path.insert(0,S); import externalizar; externalizar.procesar(dst); externalizar.limpiar(); print('ok ->',dst,os.path.getsize(dst))
