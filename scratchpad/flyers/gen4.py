# -*- coding: utf-8 -*-
import re
src=open('gen.py',encoding='utf-8').read()
BASE=re.search(r"BASE='''(.*?)'''",src,re.S).group(1)
TAPE=re.search(r"TAPE='(.*?)'\n",src).group(1)
BASE=BASE.replace('html,body{width:1080px;height:1920px;overflow:hidden}','html,body{width:1080px;height:1350px;overflow:hidden}')
EXTRA='''
.grad{background:linear-gradient(90deg,#22d3ee,#8b5cf6 50%,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent}
.halo{position:absolute;border-radius:50%;filter:blur(70px);opacity:.7}
.X{position:absolute;left:50%;transform:translateX(-50%) rotate(-6deg);background:#ffc53d;color:#0b1020;border:8px solid #0b1020;border-radius:56px;padding:20px 64px;font:900 400px/1 'Unbounded';letter-spacing:-.07em;box-shadow:26px 26px 0 #0b1020}
.gridD{background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)}
.c{position:absolute;left:0;right:0;text-align:center}
.url{font:800 34px/1 'Unbounded';letter-spacing:.06em}
</style>'''
BASE=BASE.replace('</style>',EXTRA)
LOGO='<div style="position:absolute;left:80px;top:90px" class="logo">Distribuidora <span>Belle</span></div>'
LOGOW='<div style="position:absolute;left:80px;top:90px;color:#fff" class="logo">Distribuidora <span style="background:linear-gradient(90deg,#fde68a,#fff,#fde68a);-webkit-background-clip:text;background-clip:text">Belle</span></div>'
F={}
# 16 x10 oscuro
F['feed-1-x10-oscuro']='''<div class="st" style="background:#070b1c;color:#fff">
 <div class="grid gridD"></div>
 <div class="halo" style="width:900px;height:900px;left:90px;top:300px;background:#8b5cf6;opacity:.45"></div>
 <div class="halo" style="width:600px;height:600px;left:-200px;top:-150px;background:#22d3ee;opacity:.35"></div>
 <div class="halo" style="width:600px;height:600px;right:-200px;bottom:-150px;background:#ff3d8d;opacity:.35"></div>
 '''+LOGOW+'''
 <div style="position:absolute;left:80px;top:200px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #22d3ee" class="kicker"><i></i>CyberMonday</div>
 <div class="X" style="top:330px;box-shadow:26px 26px 0 #ff3d8d;border-color:#fff">x10</div>
 <div class="c" style="top:870px;font:900 64px/1.05 'Unbounded';letter-spacing:-.02em">PRECIO X10<br><span class="grad">DESDE 1 UNIDAD</span></div>
 <div class="c" style="top:1040px;font:600 36px/1.3 'DM Sans';color:#c7d2fe">Todo el catálogo, sin mínimo de compra.<br>Hasta el 4 de noviembre a las 23:59.</div>
 <div class="tape" style="top:1180px;transform:rotate(-2deg)">__TAPE__</div>
 <div class="c url" style="top:1290px;color:#fff">distribuidorabelle.com</div>
</div>'''
# 17 x10 claro
F['feed-2-x10-claro']='''<div class="st" style="background:#fff">
 <div class="grid"></div>
 <div class="halo" style="width:900px;height:900px;left:90px;top:250px;background:#ddd6fe"></div>
 <div class="halo" style="width:700px;height:700px;left:-250px;top:-200px;background:#a5f3fc"></div>
 <div class="halo" style="width:700px;height:700px;right:-250px;bottom:-200px;background:#fbcfe8"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:200px" class="kicker"><i></i>CyberMonday</div>
 <div class="X" style="top:330px">x10</div>
 <div class="c" style="top:870px;font:900 64px/1.05 'Unbounded';letter-spacing:-.02em;color:#0b1020">PRECIO X10<br><span class="grad">DESDE 1 UNIDAD</span></div>
 <div class="c" style="top:1040px;font:600 36px/1.3 'DM Sans';color:#2b3350">Todo el catálogo, sin mínimo de compra.<br>Hasta el 4 de noviembre a las 23:59.</div>
 <div class="tape" style="top:1180px;transform:rotate(2deg)">__TAPE__</div>
 <div class="c url" style="top:1290px;color:#0b1020">distribuidorabelle.com</div>
</div>'''
# 18 CYBER MONDAY gigante claro
F['feed-3-cybermonday-grande']='''<div class="st" style="background:#fff">
 <div class="grid"></div>
 <div class="halo" style="width:900px;height:900px;left:-300px;top:-250px;background:#a5f3fc"></div>
 <div class="halo" style="width:800px;height:800px;right:-300px;top:300px;background:#ddd6fe"></div>
 <div class="halo" style="width:900px;height:700px;left:100px;bottom:-250px;background:#fbcfe8"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:230px" class="kicker"><i></i>2 · 3 · 4 de noviembre</div>
 <div style="position:absolute;left:66px;top:360px;font:900 164px/.9 'Unbounded';letter-spacing:-.05em;color:#0b1020">CYBER<br><span class="grad">MONDAY</span></div>
 <div style="position:absolute;left:80px;top:830px;font:600 42px/1.3 'DM Sans';color:#2b3350;max-width:900px">Todo el catálogo a <b style="color:#0b1020">precio x10</b>. Sin mínimo de compra: <b style="color:#0b1020">llevás 1 y pagás como si llevaras 10.</b></div>
 <div class="tape" style="top:1060px;transform:rotate(-3deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1190px;padding:24px 48px;font-size:36px">distribuidorabelle.com</div>
</div>'''
# 19 CYBER MONDAY gigante oscuro
F['feed-4-cybermonday-noche']='''<div class="st" style="background:#070b1c;color:#fff">
 <div class="grid gridD"></div>
 <div class="halo" style="width:900px;height:900px;left:-300px;top:-250px;background:#22d3ee;opacity:.35"></div>
 <div class="halo" style="width:800px;height:800px;right:-300px;top:300px;background:#8b5cf6;opacity:.45"></div>
 <div class="halo" style="width:900px;height:700px;left:100px;bottom:-250px;background:#ff3d8d;opacity:.35"></div>
 '''+LOGOW+'''
 <div style="position:absolute;left:80px;top:230px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #22d3ee" class="kicker"><i></i>Empezó el CyberMonday</div>
 <div style="position:absolute;left:66px;top:360px;font:900 164px/.9 'Unbounded';letter-spacing:-.05em;color:#fff">CYBER<br><span class="grad">MONDAY</span></div>
 <div style="position:absolute;left:80px;top:830px;font:600 42px/1.3 'DM Sans';color:#c7d2fe;max-width:900px"><b style="color:#fff">Todo el catálogo a precio x10</b>, sin mínimo de compra. Solo 3 días.</div>
 <div class="tape" style="top:1060px;transform:rotate(3deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1190px;padding:24px 48px;font-size:36px;border-color:#fff;box-shadow:10px 10px 0 #fff">distribuidorabelle.com</div>
</div>'''
# 20 Llevás 1 pagás como 10 (claro, ámbar)
F['feed-5-llevas-1']='''<div class="st" style="background:#fff">
 <div class="grid"></div>
 <div class="halo" style="width:1000px;height:800px;left:-200px;top:200px;background:#fde68a;opacity:.6"></div>
 <div class="halo" style="width:900px;height:900px;right:-350px;top:-200px;background:#a5f3fc"></div>
 <div class="halo" style="width:900px;height:700px;left:200px;bottom:-250px;background:#ddd6fe"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:230px" class="kicker"><i style="background:#ff3d8d;box-shadow:0 0 0 6px rgba(255,61,141,.25)"></i>CyberMonday · 2, 3 y 4 de nov</div>
 <div style="position:absolute;left:76px;top:370px;font:900 150px/.95 'Unbounded';letter-spacing:-.04em;color:#0b1020">Llevás <span style="background:linear-gradient(90deg,#22d3ee,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent">1</span><br>pagás<br>como <span style="background:linear-gradient(90deg,#8b5cf6,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent">10</span>.</div>
 <div style="position:absolute;right:70px;top:505px;background:#ffc53d;border:4px solid #0b1020;border-radius:20px;font:900 88px/1 'Unbounded';letter-spacing:-.05em;padding:12px 28px;box-shadow:8px 8px 0 #0b1020;transform:rotate(-8deg)">x10</div>
 <div style="position:absolute;left:80px;top:880px;font:600 38px/1.3 'DM Sans';color:#2b3350;max-width:900px">En todo el catálogo, sin mínimo de compra. Hasta el 4 de noviembre a las 23:59.</div>
 <div class="tape" style="top:1060px;transform:rotate(-2.5deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1190px;padding:24px 48px;font-size:36px">distribuidorabelle.com</div>
</div>'''
# 21 Último día / Solo hasta el 4 (oscuro, urgencia)
F['feed-6-hasta-el-4']='''<div class="st" style="background:#070b1c;color:#fff">
 <div class="grid gridD"></div>
 <div class="halo" style="width:900px;height:900px;left:90px;top:200px;background:#ff3d8d;opacity:.4"></div>
 <div class="halo" style="width:700px;height:700px;left:-250px;bottom:-200px;background:#8b5cf6;opacity:.45"></div>
 '''+LOGOW+'''
 <div style="position:absolute;left:80px;top:230px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #ff3d8d" class="kicker"><i style="background:#ff3d8d"></i>CyberMonday Belle</div>
 <div style="position:absolute;left:76px;top:370px;font:900 150px/.95 'Unbounded';letter-spacing:-.04em;color:#fff">Solo<br>hasta el<br><span class="grad">4 de nov</span></div>
 <div style="position:absolute;left:80px;top:850px;font:600 40px/1.3 'DM Sans';color:#c7d2fe;max-width:900px">A las 23:59 se termina el <b style="color:#fff">precio x10 sin mínimo</b>. Después vuelve el precio de siempre.</div>
 <div class="tape" style="top:1060px;transform:rotate(2.5deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1190px;padding:24px 48px;font-size:36px;border-color:#fff;box-shadow:10px 10px 0 #fff">Pedí ahora → distribuidorabelle.com</div>
</div>'''
for k,v in F.items():
    open(k+'.html','w',encoding='utf-8').write(BASE.replace('__BODY__',v.replace('__TAPE__',TAPE)))
print('ok',list(F))
