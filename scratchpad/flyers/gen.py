# -*- coding: utf-8 -*-
BASE='''<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=DM+Sans:wght@500;600;700;800&family=Cormorant+Garamond:wght@700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:'DM Sans',sans-serif;color:#0b1020;position:relative;background:#fff}
.st{position:absolute;inset:0;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(11,16,32,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(11,16,32,.07) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:linear-gradient(180deg,#000 55%,transparent 100%);mask-image:linear-gradient(180deg,#000 55%,transparent 100%)}
.glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.75}
.logo{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:64px;letter-spacing:.06em}.logo span{background:linear-gradient(90deg,#c4965a,#e6c98e,#b07f2a);-webkit-background-clip:text;background-clip:text;color:transparent}
.kicker{display:inline-flex;align-items:center;gap:18px;border:3px solid #0b1020;border-radius:999px;padding:16px 34px;font:800 30px/1 'Unbounded';letter-spacing:.22em;text-transform:uppercase;background:#fff;box-shadow:8px 8px 0 #0b1020}
.kicker i{width:18px;height:18px;border-radius:50%;background:#22d3ee;box-shadow:0 0 0 6px rgba(34,211,238,.25)}
.t1{font:900 168px/.9 'Unbounded';letter-spacing:-.03em;color:#0b1020}
.t2{font:900 168px/.9 'Unbounded';letter-spacing:-.03em;background:linear-gradient(90deg,#22d3ee,#8b5cf6 50%,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{font:600 44px/1.3 'DM Sans';color:#2b3350;max-width:880px}.lead b{color:#0b1020;font-weight:800}
.stamp{display:inline-flex;align-items:center;gap:30px;background:#fff;border:4px solid #0b1020;border-radius:36px;padding:30px 40px;box-shadow:14px 14px 0 #0b1020}
.stamp .x{background:#ffc53d;border:4px solid #0b1020;border-radius:24px;font:900 110px/1 'Unbounded';letter-spacing:-.04em;padding:14px 30px;box-shadow:8px 8px 0 #0b1020;transform:rotate(-4deg)}
.stamp .k{font:800 26px/1 'Unbounded';letter-spacing:.2em;text-transform:uppercase;color:#0891b2}.stamp .d{font:700 40px/1.15 'DM Sans';margin-top:14px}
.tape{position:absolute;left:-10%;width:120%;padding:22px 0;background:#ffc53d;border-top:5px solid #0b1020;border-bottom:5px solid #0b1020;color:#0b1020;font:800 34px/1 'Unbounded';letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;overflow:hidden;box-shadow:0 12px 0 rgba(11,16,32,.12)}
.tape span{display:inline-block;padding:0 30px}
.proof{display:flex;flex-wrap:wrap;gap:18px 40px;font:700 32px/1 'DM Sans';color:#2b3350}.proof li{list-style:none;display:flex;align-items:center;gap:14px}.proof li::before{content:"✓";color:#16a34a;font-weight:900;font-size:36px}
.cta{display:inline-flex;align-items:center;gap:22px;background:linear-gradient(135deg,#22d3ee,#8b5cf6 55%,#ff3d8d);color:#fff;border:4px solid #0b1020;border-radius:999px;padding:30px 54px;font:800 40px/1 'DM Sans';box-shadow:10px 10px 0 #0b1020}
.url{font:800 34px/1 'Unbounded';letter-spacing:.06em;color:#0b1020}
.cells{display:flex;gap:22px}.cell{width:200px;background:#fff;border:4px solid #0b1020;border-radius:28px;padding:26px 0 22px;text-align:center;box-shadow:10px 10px 0 #0b1020}.cell b{display:block;font:900 86px/1 'Unbounded';letter-spacing:-.04em}.cell span{display:block;margin-top:12px;font:800 24px/1 'DM Sans';letter-spacing:.24em;text-transform:uppercase;color:#4b5578}
</style></head><body>__BODY__</body></html>'''

TAPE='<span>CYBERMONDAY</span>·<span>PRECIO X10 SIN MÍNIMO</span>·<span>2, 3 Y 4 DE NOVIEMBRE</span>·<span>CYBERMONDAY</span>·<span>PRECIO X10 SIN MÍNIMO</span>·<span>2, 3 Y 4 DE NOVIEMBRE</span>'
F={}
# 1 · Hero claro (la portada del sitio)
F['story-1-cyber-claro']='''<div class="st">
 <div class="grid"></div>
 <div class="glow" style="width:900px;height:900px;left:-300px;top:-250px;background:#a5f3fc"></div>
 <div class="glow" style="width:800px;height:800px;right:-300px;top:500px;background:#ddd6fe"></div>
 <div class="glow" style="width:900px;height:700px;left:100px;bottom:-250px;background:#fbcfe8"></div>
 <div style="position:absolute;left:80px;top:110px" class="logo">Distribuidora <span>Belle</span></div>
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i></i>2 · 3 · 4 de noviembre</div>
 <div style="position:absolute;left:76px;top:440px"><div class="t1">CYBER</div><div class="t2">MONDAY</div></div>
 <div class="lead" style="position:absolute;left:80px;top:880px">Todo el catálogo a <b>precio mayorista</b>. Sin mínimo de compra: <b>llevás 1 y pagás como si llevaras 10.</b></div>
 <div class="stamp" style="position:absolute;left:80px;top:1130px"><div class="x">x10</div><div><div class="k">Precio x10</div><div class="d">desde 1 unidad,<br>en todo el catálogo</div></div></div>
 <div class="tape" style="top:1480px;transform:rotate(-3deg)">__TAPE__</div>
 <ul class="proof" style="position:absolute;left:80px;top:1640px;width:920px"><li>Envío gratis en Córdoba</li><li>100% originales</li><li>Pagás al recibir</li><li>Precio x10 sin mínimo</li></ul>
 <div class="url" style="position:absolute;left:80px;bottom:80px">distribuidorabelle.com</div>
</div>'''
# 2 · Noche con cuenta regresiva
F['story-2-cyber-noche']='''<div class="st" style="background:#070b1c;color:#fff">
 <div class="grid" style="background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)"></div>
 <div class="glow" style="width:900px;height:900px;left:-350px;top:-200px;background:#22d3ee;opacity:.35"></div>
 <div class="glow" style="width:900px;height:900px;right:-350px;top:700px;background:#8b5cf6;opacity:.4"></div>
 <div class="glow" style="width:800px;height:700px;left:200px;bottom:-300px;background:#ff3d8d;opacity:.35"></div>
 <div style="position:absolute;left:80px;top:110px;color:#fff" class="logo">Distribuidora <span style="background:linear-gradient(90deg,#fde68a,#fff,#fde68a);-webkit-background-clip:text;background-clip:text">Belle</span></div>
 <div style="position:absolute;left:80px;top:290px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #22d3ee" class="kicker"><i></i>Empezó el CyberMonday</div>
 <div style="position:absolute;left:76px;top:440px"><div class="t1" style="color:#fff">CYBER</div><div class="t2">MONDAY</div></div>
 <div class="lead" style="position:absolute;left:80px;top:880px;color:#c7d2fe"><b style="color:#fff">Todo el catálogo a precio x10</b>, sin mínimo de compra. Solo 3 días.</div>
 <div style="position:absolute;left:80px;top:1070px;font:800 26px/1 'Unbounded';letter-spacing:.24em;text-transform:uppercase;color:#9fe9f7">Termina en</div>
 <div class="cells" style="position:absolute;left:80px;top:1130px">
  <div class="cell" style="background:#0f1629;border-color:#fff;box-shadow:10px 10px 0 #22d3ee;color:#fff"><b>2</b><span style="color:#9fe9f7">días</span></div>
  <div class="cell" style="background:#0f1629;border-color:#fff;box-shadow:10px 10px 0 #8b5cf6;color:#fff"><b>14</b><span style="color:#c4b5fd">horas</span></div>
  <div class="cell" style="background:#0f1629;border-color:#fff;box-shadow:10px 10px 0 #ff3d8d;color:#fff"><b>36</b><span style="color:#fbcfe8">min</span></div>
  <div class="cell" style="background:#ffc53d;border-color:#fff;box-shadow:10px 10px 0 #fff;color:#0b1020"><b>x10</b><span style="color:#0b1020">precio</span></div>
 </div>
 <div class="tape" style="top:1490px;transform:rotate(3deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1660px;border-color:#fff;box-shadow:10px 10px 0 #fff">Entrá y pedí → distribuidorabelle.com</div>
</div>'''
# 3 · Ejemplo de precio: antes / ahora
F['story-3-cyber-precio']='''<div class="st" style="background:#fff">
 <div class="grid"></div>
 <div class="glow" style="width:1000px;height:800px;left:-200px;top:300px;background:#fde68a;opacity:.55"></div>
 <div class="glow" style="width:900px;height:900px;right:-350px;top:-200px;background:#a5f3fc"></div>
 <div class="glow" style="width:900px;height:700px;left:200px;bottom:-250px;background:#ddd6fe"></div>
 <div style="position:absolute;left:80px;top:110px" class="logo">Distribuidora <span>Belle</span></div>
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i style="background:#ff3d8d;box-shadow:0 0 0 6px rgba(255,61,141,.25)"></i>CyberMonday · 2, 3 y 4 de nov</div>
 <div style="position:absolute;left:76px;top:430px;font:900 120px/1 'Unbounded';letter-spacing:-.03em">Llevás <span style="background:linear-gradient(90deg,#22d3ee,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent">1</span><br>pagás<br>como <span style="background:linear-gradient(90deg,#8b5cf6,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent">10</span>.</div>
 <div style="position:absolute;left:80px;top:960px;width:920px;background:#fff;border:4px solid #0b1020;border-radius:40px;padding:44px 48px;box-shadow:16px 16px 0 #0b1020">
  <div style="font:800 24px/1 'Unbounded';letter-spacing:.22em;text-transform:uppercase;color:#7c3aed">Ejemplo · Khamrah Qahwa 100 ml</div>
  <div style="display:flex;align-items:flex-end;gap:24px;margin-top:26px;flex-wrap:nowrap">
   <div><div style="font:700 28px/1 'DM Sans';color:#8891b0;letter-spacing:.14em;text-transform:uppercase">Precio de lista</div><div style="font:800 52px/1 'Unbounded';color:#8891b0;text-decoration:line-through;text-decoration-color:#ff3d8d;text-decoration-thickness:6px;margin-top:10px">$54.400</div></div>
   <div style="margin-left:auto;text-align:right"><div style="display:inline-block;background:#ffc53d;border:3px solid #0b1020;border-radius:999px;padding:12px 22px;font:900 24px/1 'Unbounded';letter-spacing:.08em;box-shadow:5px 5px 0 #0b1020">⚡ PRECIO X10</div><div style="font:900 84px/1 'Unbounded';letter-spacing:-.04em;margin-top:14px;background:linear-gradient(90deg,#22d3ee,#8b5cf6 50%,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent">$45.400</div></div>
  </div>
  <div style="margin-top:26px;border-top:3px dashed #0b1020;padding-top:22px;font:700 30px/1.3 'DM Sans';color:#2b3350">Ahorrás <b style="color:#e11d74">$9.000</b> en una sola unidad. Y así con todo el catálogo.</div>
 </div>
 <div class="tape" style="top:1520px;transform:rotate(-2.5deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1690px">Ver el catálogo → distribuidorabelle.com</div>
</div>'''
for k,v in F.items():
    open(k+'.html','w',encoding='utf-8').write(BASE.replace('__BODY__',v.replace('__TAPE__',TAPE)))
print('ok',list(F))
