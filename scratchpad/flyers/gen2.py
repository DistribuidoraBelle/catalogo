# -*- coding: utf-8 -*-
import re
src=open('gen.py',encoding='utf-8').read()
BASE=re.search(r"BASE='''(.*?)'''",src,re.S).group(1)
TAPE=re.search(r"TAPE='(.*?)'\n",src).group(1)
EXTRA='''
.big{font:900 150px/.92 'Unbounded';letter-spacing:-.03em}
.grad{background:linear-gradient(90deg,#22d3ee,#8b5cf6 50%,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent}
.card{background:#fff;border:4px solid #0b1020;border-radius:40px;box-shadow:16px 16px 0 #0b1020}
.paso{display:flex;align-items:center;gap:30px;background:#fff;border:4px solid #0b1020;border-radius:32px;padding:30px 36px;box-shadow:12px 12px 0 #0b1020}
.paso .n{width:96px;height:96px;flex:none;border-radius:50%;border:4px solid #0b1020;display:flex;align-items:center;justify-content:center;font:900 48px/1 'Unbounded';color:#0b1020}
.paso .t{font:800 40px/1.15 'DM Sans'}.paso .s{font:600 28px/1.3 'DM Sans';color:#4b5578;margin-top:8px}
.chip{display:inline-block;border:3px solid #0b1020;border-radius:999px;padding:14px 28px;font:800 28px/1 'Unbounded';letter-spacing:.06em;text-transform:uppercase;background:#fff;box-shadow:6px 6px 0 #0b1020;margin:0 14px 18px 0}
.cal{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.cal div{background:#fff;border:4px solid #0b1020;border-radius:28px;padding:30px 0 24px;text-align:center;box-shadow:10px 10px 0 #0b1020}
.cal div b{display:block;font:900 92px/1 'Unbounded';letter-spacing:-.04em}.cal div span{display:block;margin-top:10px;font:800 22px/1 'DM Sans';letter-spacing:.2em;text-transform:uppercase;color:#4b5578}
.cal div.on{background:linear-gradient(135deg,#22d3ee,#8b5cf6 55%,#ff3d8d);color:#fff}.cal div.on span{color:#fff}
.cal div.off{background:#f3f4fa;color:#8891b0;border-style:dashed;box-shadow:none}
</style>'''
BASE=BASE.replace('</style>',EXTRA)
F={}
LOGO='<div style="position:absolute;left:80px;top:110px" class="logo">Distribuidora <span>Belle</span></div>'
LOGOW='<div style="position:absolute;left:80px;top:110px;color:#fff" class="logo">Distribuidora <span style="background:linear-gradient(90deg,#fde68a,#fff,#fde68a);-webkit-background-clip:text;background-clip:text">Belle</span></div>'
# 4 · Hasta el 4 a las 23:59
F['story-4-hasta-el-4']='''<div class="st">
 <div class="grid"></div>
 <div class="glow" style="width:900px;height:900px;left:-300px;top:-250px;background:#fbcfe8"></div>
 <div class="glow" style="width:900px;height:800px;right:-300px;top:600px;background:#a5f3fc"></div>
 <div class="glow" style="width:800px;height:700px;left:100px;bottom:-250px;background:#ddd6fe"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i style="background:#ff3d8d;box-shadow:0 0 0 6px rgba(255,61,141,.25)"></i>CyberMonday Belle</div>
 <div style="position:absolute;left:76px;top:440px" class="big">Solo<br>hasta el<br><span class="grad">4 de nov</span><br>a las <span class="grad">23:59</span></div>
 <div class="lead" style="position:absolute;left:80px;top:1130px">Todo el catálogo a <b>precio x10 sin mínimo</b>. Después vuelve el precio de siempre.</div>
 <div class="tape" style="top:1420px;transform:rotate(-3deg)">__TAPE__</div>
 <ul class="proof" style="position:absolute;left:80px;top:1590px;width:920px"><li>Envío gratis en Córdoba</li><li>100% originales</li><li>Pagás al recibir</li></ul>
 <div class="cta" style="position:absolute;left:80px;top:1720px">Pedí ahora → distribuidorabelle.com</div>
</div>'''
# 5 · Tres pasos
F['story-5-tres-pasos']='''<div class="st">
 <div class="grid"></div>
 <div class="glow" style="width:900px;height:900px;left:-300px;top:-250px;background:#a5f3fc"></div>
 <div class="glow" style="width:900px;height:800px;right:-300px;top:700px;background:#fbcfe8"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i></i>Así de simple</div>
 <div style="position:absolute;left:76px;top:430px" class="big">CYBER<br><span class="grad">MONDAY</span></div>
 <div class="lead" style="position:absolute;left:80px;top:760px">Llevás 1 y pagás como si llevaras 10. En todo el catálogo.</div>
 <div style="position:absolute;left:80px;top:920px;width:920px;display:flex;flex-direction:column;gap:26px">
  <div class="paso"><div class="n" style="background:#a5f3fc">1</div><div><div class="t">Elegí tus perfumes</div><div class="s">Árabes, internacionales, kits y decants</div></div></div>
  <div class="paso"><div class="n" style="background:#ddd6fe">2</div><div><div class="t">Pagás el precio x10</div><div class="s">Desde 1 unidad, sin mínimo de compra</div></div></div>
  <div class="paso"><div class="n" style="background:#fbcfe8">3</div><div><div class="t">Lo recibís en el día</div><div class="s">Envío gratis en Córdoba · pagás al recibir</div></div></div>
 </div>
 <div class="tape" style="top:1560px;transform:rotate(2.5deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1720px">distribuidorabelle.com</div>
</div>'''
# 6 · Árabes + Internacionales
F['story-6-arabes-internacionales']='''<div class="st" style="background:#fff">
 <div class="grid"></div>
 <div style="position:absolute;left:0;right:0;top:640px;height:560px;background:linear-gradient(135deg,#22d3ee,#8b5cf6);transform:skewY(-6deg);transform-origin:left"></div>
 <div style="position:absolute;left:0;right:0;top:1170px;height:420px;background:linear-gradient(135deg,#ff3d8d,#ffc53d);transform:skewY(-6deg);transform-origin:left"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i></i>2 · 3 · 4 de noviembre</div>
 <div style="position:absolute;left:76px;top:420px;font-size:118px" class="big">Todo el<br>catálogo<br><span class="grad">a precio x10</span></div>
 <div style="position:absolute;left:80px;top:830px;color:#fff"><div style="font:800 26px/1 'Unbounded';letter-spacing:.24em;text-transform:uppercase;opacity:.9">Perfumes árabes</div><div style="margin-top:22px;max-width:920px;line-height:1.1">'''+''.join('<span class="chip" style="background:rgba(255,255,255,.12);color:#fff;border-color:#fff;box-shadow:6px 6px 0 rgba(11,16,32,.35)">%s</span>'%m for m in ['Lattafa','Armaf','Maison Alhambra','Afnan','French Avenue','Rasasi','Al Haramain','Bharara'])+'''</div></div>
 <div style="position:absolute;left:80px;top:1300px;color:#0b1020"><div style="font:800 26px/1 'Unbounded';letter-spacing:.24em;text-transform:uppercase">Internacionales</div><div style="margin-top:22px;max-width:920px;line-height:1.1">'''+''.join('<span class="chip">%s</span>'%m for m in ['Calvin Klein','Carolina Herrera','Dior','Versace','Paco Rabanne','Jean Paul Gaultier','Montblanc'])+'''</div></div>
 <div class="cta" style="position:absolute;left:80px;top:1720px">Sin mínimo → distribuidorabelle.com</div>
</div>'''
# 7 · Sello x10 gigante, noche
F['story-7-sello-noche']='''<div class="st" style="background:#070b1c;color:#fff">
 <div class="grid" style="background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)"></div>
 <div class="glow" style="width:1000px;height:1000px;left:40px;top:380px;background:#8b5cf6;opacity:.45"></div>
 <div class="glow" style="width:700px;height:700px;left:-250px;top:-150px;background:#22d3ee;opacity:.35"></div>
 <div class="glow" style="width:700px;height:700px;right:-250px;bottom:-150px;background:#ff3d8d;opacity:.35"></div>
 '''+LOGOW+'''
 <div style="position:absolute;left:80px;top:290px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #22d3ee" class="kicker"><i></i>CyberMonday</div>
 <div style="position:absolute;left:50%;top:560px;transform:translateX(-50%) rotate(-6deg);background:#ffc53d;color:#0b1020;border:8px solid #fff;border-radius:60px;padding:30px 70px;font:900 360px/1 'Unbounded';letter-spacing:-.06em;box-shadow:24px 24px 0 #ff3d8d">x10</div>
 <div style="position:absolute;left:0;right:0;top:1130px;text-align:center;font:900 72px/1.05 'Unbounded';letter-spacing:-.02em">PRECIO X10<br><span class="grad">DESDE 1 UNIDAD</span></div>
 <div style="position:absolute;left:0;right:0;top:1330px;text-align:center;font:600 40px/1.3 'DM Sans';color:#c7d2fe">Hasta el 4 de noviembre a las 23:59.<br>En todo el catálogo, sin mínimo de compra.</div>
 <div class="tape" style="top:1520px;transform:rotate(-2deg)">__TAPE__</div>
 <div style="position:absolute;left:0;right:0;top:1700px;text-align:center" class="url"><span style="color:#fff">distribuidorabelle.com</span></div>
</div>'''
# 8 · Calendario
F['story-8-calendario']='''<div class="st">
 <div class="grid"></div>
 <div class="glow" style="width:900px;height:900px;left:-300px;top:-250px;background:#ddd6fe"></div>
 <div class="glow" style="width:900px;height:800px;right:-300px;top:900px;background:#a5f3fc"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i style="background:#8b5cf6;box-shadow:0 0 0 6px rgba(139,92,246,.25)"></i>Agendalo</div>
 <div style="position:absolute;left:76px;top:430px;font-size:116px" class="big">Tres días<br>de <span class="grad">precio x10</span></div>
 <div class="lead" style="position:absolute;left:80px;top:760px">Noviembre. Lunes, martes y miércoles. El jueves a las 0 h vuelve todo a la normalidad.</div>
 <div class="cal" style="position:absolute;left:80px;top:1000px;width:920px">
  <div class="on"><b>2</b><span>Lun</span></div><div class="on"><b>3</b><span>Mar</span></div><div class="on"><b>4</b><span>Mié</span></div><div class="off"><b>5</b><span>Jue</span></div>
 </div>
 <div style="position:absolute;left:80px;top:1280px;display:flex;align-items:center;gap:22px"><div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#22d3ee,#ff3d8d)"></div><div style="font:700 32px/1 'DM Sans';color:#2b3350">Días con precio x10 sin mínimo</div></div>
 <div class="tape" style="top:1440px;transform:rotate(3deg)">__TAPE__</div>
 <ul class="proof" style="position:absolute;left:80px;top:1630px;width:920px"><li>Envío gratis en Córdoba</li><li>100% originales</li><li>Pagás al recibir</li></ul>
 <div class="cta" style="position:absolute;left:80px;top:1740px">distribuidorabelle.com</div>
</div>'''
# 9 · Kits y decants
F['story-9-kits-decants']='''<div class="st" style="background:#fff">
 <div class="grid"></div>
 <div class="glow" style="width:900px;height:900px;right:-350px;top:-250px;background:#fde68a;opacity:.7"></div>
 <div class="glow" style="width:900px;height:800px;left:-300px;top:800px;background:#fbcfe8"></div>
 <div class="glow" style="width:800px;height:700px;right:-200px;bottom:-250px;background:#a5f3fc"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i style="background:#ffc53d;box-shadow:0 0 0 6px rgba(255,197,61,.35)"></i>También en el Cyber</div>
 <div style="position:absolute;left:76px;top:430px;font-size:122px" class="big">Kits,<br>decants y<br><span class="grad">packaging</span></div>
 <div class="lead" style="position:absolute;left:80px;top:830px">Armá tu emprendimiento con todo: <b>kits de regalo, decants de 5 ml</b> para que tus clientes prueben, y <b>bolsas y tarjetas</b> para entregar como se debe.</div>
 <div style="position:absolute;left:80px;top:1180px;width:920px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px">
  <div class="card" style="padding:34px 24px;text-align:center;border-radius:32px;box-shadow:10px 10px 0 #0b1020"><div style="font-size:72px">🎁</div><div style="font:800 30px/1.1 'Unbounded';margin-top:14px">Kits</div></div>
  <div class="card" style="padding:34px 24px;text-align:center;border-radius:32px;box-shadow:10px 10px 0 #8b5cf6"><div style="font-size:72px">🧪</div><div style="font:800 30px/1.1 'Unbounded';margin-top:14px">Decants</div></div>
  <div class="card" style="padding:34px 24px;text-align:center;border-radius:32px;box-shadow:10px 10px 0 #ff3d8d"><div style="font-size:72px">🛍️</div><div style="font:800 30px/1.1 'Unbounded';margin-top:14px">Packaging</div></div>
 </div>
 <div class="tape" style="top:1540px;transform:rotate(-2.5deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1720px">Hasta el 4/11 → distribuidorabelle.com</div>
</div>'''
for k,v in F.items():
    open(k+'.html','w',encoding='utf-8').write(BASE.replace('__BODY__',v.replace('__TAPE__',TAPE)))
print('ok',list(F))
