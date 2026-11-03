import sys,re,os
S=os.path.dirname(os.path.abspath(__file__)); REPO='/home/user/catalogo'
real='--real' in sys.argv; suave='--suave' in sys.argv; belle='--belle' in sys.argv
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
BELLE={
  '0b1020':'241a0c','06080f':'15100a',                                   # tinta
  '22d3ee':'c4965a','bdf0f8':'f3e8d3','164753':'5a4616','0e7490':'a06a2a','0891b2':'a9763f','0f766e':'7a5a1e',   # celeste → dorado
  '8b5cf6':'b8863a','7c3aed':'a06a2a','6d28d9':'8a5a22','ddd6fe':'eadbbd','3b2d6e':'4a3614','5a8fc4':'c4965a',    # violeta → dorado oscuro
  'ff3d8d':'b9652f','fbd0e4':'f5dfcf','5b2342':'4a2a14','be185d':'9c4f1f','e11d74':'9c4f1f','c45a8f':'b9652f',    # rosa → cobre
  'ffc53d':'e8b86d','ffe9a8':'f6e6c4','fde68a':'f0d9a6','fff6d6':'fbf3e2',                                        # amarillo → dorado claro
  '0f1629':'17120a','131c33':'1d160d','182341':'2a2214',                                                          # fondos oscuros
  'e1e6f2':'e4d6ba','cfd5e6':'dccbaa','f3f4fa':'f6efe1','eef0f7':'f3ebdc','5b6480':'6b583a','4b5578':'6b583a','7f89a8':'a08b67','8a93b2':'a08b67','aab3cf':'d8c6a6',  # grises azulados → arena
}
def bellizar(t):
    for a,b in BELLE.items():
        t=re.sub('#'+a+r'\b',' #'+b,t,flags=re.I).replace(' #'+b,'#'+b)
        t=re.sub('%23'+a+r'\b','%23'+b,t,flags=re.I)
        ra=','.join(str(int(a[i:i+2],16)) for i in (0,2,4)); rb=','.join(str(int(b[i:i+2],16)) for i in (0,2,4))
        t=re.sub(r'rgba?\(\s*'+ra.replace(',',r'\s*,\s*')+r'\s*([,)])',lambda m:'rgba('+rb+m.group(1) if m.group(1)==',' else 'rgb('+rb+')',t)
    return t
if belle: css=bellizar(css); js=bellizar(js)
bloque=MARK+'\n<style id="nuevoCss">\n'+css+'\n</style>\n<script id="nuevoJs">\n'+js+'\n</script>\n'
i=src.rindex('</body>')
out=src[:i]+bloque+src[i:]
if not real: out=out.replace("'card.html?id='","'card-nuevo-prueba.html?id='")
dst=REPO+('/index.html' if real else ('/index-nuevo-prueba-3.html' if belle else ('/index-nuevo-prueba-2.html' if suave else '/index-nuevo-prueba.html')))
open(dst,'w',encoding='utf-8').write(out); print('ok ->',dst,len(out))
