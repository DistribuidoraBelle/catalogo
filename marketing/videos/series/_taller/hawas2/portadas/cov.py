import sys,json
cfg=json.loads(sys.argv[1])
B=cfg['bottles'];n=len(B);c=(n-1)/2
items=[]
for i,b in enumerate(B):
    d=abs(i-c); h=cfg['h0']-d*cfg['dh']; x=540+(i-c)*cfg['dx']; y=cfg['base']-d*cfg['dy']
    items.append((d,b,x,y,h))
items.sort(key=lambda t:-t[0])
svg=''
for d,b,x,y,h in items:
    w=h*0.62
    svg+=f'<ellipse cx="{x}" cy="{y-4}" rx="{h*0.28}" ry="{h*0.035}" fill="#000" opacity=".55" filter="url(#b6)"/>'
    svg+=f'<image href="fotos/{b}" x="{x-w/2}" y="{y-h}" width="{w}" height="{h}" preserveAspectRatio="xMidYMax meet" filter="url(#ds)"/>'
notes=''
for nm,x,y,s,r,bl in cfg['notes']:
    notes+=f'<image href="fotos/obj/{nm}" x="{x-s/2}" y="{y-s/2}" width="{s}" height="{s}" transform="rotate({r} {x} {y})" {"filter=\"url(#b8)\"" if bl else "filter=\"url(#ds)\""}/>'
html=f'''<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@500;700;800&display=swap" rel="stylesheet">
<style>body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}}#c{{position:relative;width:1080px;height:1920px}}
.t{{position:absolute;left:0;width:1080px;text-align:center;color:#fff}}</style></head><body><div id="c">
<svg width="1080" height="1920" style="position:absolute;left:0;top:0">
<defs><filter id="b6"><feGaussianBlur stdDeviation="6"/></filter><filter id="b8"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="ds"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-opacity=".45"/></filter>
<linearGradient id="tf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></linearGradient></defs>
<image href="fotos/{cfg['bg']}" x="{540-540*cfg['z']}" y="{cfg['base']-cfg['ped']*cfg['z']}" width="{1080*cfg['z']}" height="{1920*cfg['z']}" preserveAspectRatio="xMidYMid slice"/>
<rect width="1080" height="1920" fill="url(#tf)"/>{svg}{notes}</svg>
<div class="t" style="top:92px"><div style="display:inline-block;padding:14px 46px;border-radius:60px;background:rgba(255,255,255,.16);border:1.5px solid rgba(255,255,255,.55);backdrop-filter:blur(8px)"><img src="fotos/logo_rasasi_hd_w.png" style="height:62px;display:block"></div></div>
<div class="t" style="top:205px;font:900 250px/1 'Playfair Display';letter-spacing:6px;text-shadow:0 8px 40px rgba(0,0,0,.45)">HAWAS</div>
<div class="t" style="top:470px;font:700 30px 'Montserrat';letter-spacing:9px;text-shadow:0 2px 10px rgba(0,0,0,.6)">LA SERIE MÁS FAMOSA DE RASASI</div>
<div class="t" style="top:1560px"><span style="display:inline-block;background:#fff;color:#0b1220;font:800 40px 'Montserrat';letter-spacing:6px;padding:12px 44px;border-radius:50px">PARTE {cfg['parte']}</span></div>
<div class="t" style="top:1638px;font:900 {min(104,int(1500/len(cfg['titulo'])))}px/1.05 'Playfair Display';white-space:nowrap;text-shadow:0 6px 30px rgba(0,0,0,.6)">{cfg['titulo']}</div>
<div class="t" style="top:1770px;font:700 27px 'Montserrat';letter-spacing:5px;opacity:.95">{cfg['sub']}</div>
<div class="t" style="top:1838px"><img src="logo.png" style="height:40px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))"></div>
</div><script>document.fonts.ready.then(()=>{{window.__ok=1}})</script></body></html>'''
open(cfg['out'],'w').write(html)
