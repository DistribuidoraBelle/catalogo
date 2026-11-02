# -*- coding: utf-8 -*-
import re
src=open('gen.py',encoding='utf-8').read()
BASE=re.search(r"BASE='''(.*?)'''",src,re.S).group(1)
TAPE=re.search(r"TAPE='(.*?)'\n",src).group(1)
EXTRA='''
.big{font:900 150px/.92 'Unbounded';letter-spacing:-.03em}
.grad{background:linear-gradient(90deg,#22d3ee,#8b5cf6 50%,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent}
.foto{position:absolute;filter:drop-shadow(0 50px 50px rgba(11,16,32,.45)) drop-shadow(0 0 2px rgba(0,0,0,.15))}
.halo{position:absolute;border-radius:50%;filter:blur(70px);opacity:.7}
.marca{display:inline-block;font:800 26px/1 'Unbounded';letter-spacing:.3em;text-transform:uppercase;padding:14px 26px;border:3px solid currentColor;border-radius:999px}
.nom{font:900 96px/1 'Unbounded';letter-spacing:-.03em}
.sub{font:700 34px/1.3 'DM Sans'}
.x10{display:inline-block;background:#ffc53d;border:4px solid #0b1020;border-radius:24px;font:900 92px/1 'Unbounded';letter-spacing:-.04em;padding:10px 28px;box-shadow:8px 8px 0 #0b1020;transform:rotate(-5deg)}
</style>'''
BASE=BASE.replace('</style>',EXTRA)
LOGO='<div style="position:absolute;left:80px;top:110px" class="logo">Distribuidora <span>Belle</span></div>'
LOGOW='<div style="position:absolute;left:80px;top:110px;color:#fff" class="logo">Distribuidora <span style="background:linear-gradient(90deg,#fde68a,#fff,#fde68a);-webkit-background-clip:text;background-clip:text">Belle</span></div>'
F={}
# 10 · Khamrah Qahwa · noche cálida, foto gigante centrada abajo
F['story-10-khamrah-qahwa']='''<div class="st" style="background:radial-gradient(900px 700px at 50% 115%,#5b2a0f,#1a0d05 60%,#070b1c 100%)">
 <div class="grid" style="background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)"></div>
 <div class="halo" style="width:900px;height:900px;left:90px;top:760px;background:#c2410c;opacity:.5"></div>
 '''+LOGOW+'''
 <div style="position:absolute;left:80px;top:290px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #ffc53d" class="kicker"><i style="background:#ffc53d"></i>CyberMonday · 2, 3 y 4 de nov</div>
 <div style="position:absolute;left:80px;top:440px;color:#fff"><div class="marca" style="color:#fde68a">Lattafa</div><div class="nom" style="margin-top:26px">Khamrah<br><span style="color:#fde68a">Qahwa</span></div><div class="sub" style="margin-top:22px;color:#e9d5ff;max-width:900px">Café, canela y vainilla. Un best seller, a <b style="color:#fff">precio x10 desde 1 unidad</b>.</div></div>
 <img class="foto" src="../fotos/cut_khamrah_qahwa.png" style="left:50%;top:860px;width:920px;transform:translateX(-50%)">
 <div class="tape" style="top:1700px;transform:rotate(-2.5deg)">__TAPE__</div>
 <div style="position:absolute;left:0;right:0;top:1810px;text-align:center;font:800 34px/1 'Unbounded';color:#fff;letter-spacing:.06em">distribuidorabelle.com</div>
</div>'''
# 11 · Club de Nuit · negro, foto a la derecha sangrando, texto a la izquierda
F['story-11-club-de-nuit']='''<div class="st" style="background:linear-gradient(180deg,#0b1020,#1c2742 60%,#0b1020)">
 <div class="grid" style="background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)"></div>
 <div class="halo" style="width:800px;height:800px;right:-200px;top:700px;background:#22d3ee;opacity:.35"></div>
 <div class="halo" style="width:600px;height:600px;left:-200px;top:1200px;background:#8b5cf6;opacity:.4"></div>
 <img class="foto" src="../fotos/cut_club_de_nuit.png" style="right:-180px;top:700px;width:1100px;transform:rotate(6deg)">
 '''+LOGOW+'''
 <div style="position:absolute;left:80px;top:290px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #22d3ee" class="kicker"><i></i>CyberMonday</div>
 <div style="position:absolute;left:80px;top:430px;color:#fff;width:620px"><div class="marca" style="color:#9fe9f7">Armaf</div><div class="nom" style="margin-top:26px;font-size:88px">Club<br>de Nuit<br><span class="grad">Intense</span></div></div>
 <div style="position:absolute;left:80px;top:1270px" class="x10">x10</div>
 <div style="position:absolute;left:80px;top:1440px;color:#c7d2fe" class="sub">Precio x10 desde 1 unidad.<br>Hasta el 4 de noviembre a las 23:59.</div>
 <div class="tape" style="top:1640px;transform:rotate(3deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1770px;border-color:#fff;box-shadow:10px 10px 0 #fff;padding:24px 44px;font-size:34px">distribuidorabelle.com</div>
</div>'''
# 12 · Yara Tous · claro, naranja-rosa, foto gigante centrada, texto encima
F['story-12-yara-tous']='''<div class="st" style="background:linear-gradient(180deg,#fff7ed,#ffe4e6 50%,#fdf2f8)">
 <div class="grid"></div>
 <div class="halo" style="width:1000px;height:1000px;left:40px;top:700px;background:#fdba74;opacity:.6"></div>
 <div class="halo" style="width:700px;height:700px;right:-200px;top:200px;background:#f9a8d4;opacity:.6"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i style="background:#ff3d8d;box-shadow:0 0 0 6px rgba(255,61,141,.25)"></i>CyberMonday · 2, 3 y 4 de nov</div>
 <div style="position:absolute;left:80px;top:430px"><div class="marca" style="color:#ea580c">Lattafa</div><div class="nom" style="margin-top:26px">Yara <span style="background:linear-gradient(90deg,#f97316,#ff3d8d);-webkit-background-clip:text;background-clip:text;color:transparent">Tous</span></div><div class="sub" style="margin-top:20px;color:#2b3350;max-width:900px">El favorito de todas, a <b>precio x10 desde 1 unidad</b>.</div></div>
 <img class="foto" src="../fotos/cut_yara_tous.png" style="left:50%;top:790px;width:900px;transform:translateX(-50%) rotate(-3deg)">
 <div class="tape" style="top:1690px;transform:rotate(-2deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:50%;top:1790px;transform:translateX(-50%);padding:22px 44px;font-size:32px;white-space:nowrap">distribuidorabelle.com</div>
</div>'''
# 13 · Asad Bourbon · marrón profundo + ámbar, foto a la izquierda, texto derecha
F['story-13-asad-bourbon']='''<div class="st" style="background:radial-gradient(800px 600px at 20% 110%,#7c2d12,#2a1208 55%,#0b1020)">
 <div class="grid" style="background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)"></div>
 <div class="halo" style="width:800px;height:800px;left:-150px;top:800px;background:#f59e0b;opacity:.35"></div>
 <img class="foto" src="../fotos/cut_asad_bourbon.png" style="left:-160px;top:780px;width:1000px;transform:rotate(-7deg)">
 '''+LOGOW+'''
 <div style="position:absolute;right:80px;top:290px;background:#0f1629;color:#fff;border-color:#fff;box-shadow:8px 8px 0 #f59e0b" class="kicker"><i style="background:#f59e0b"></i>CyberMonday</div>
 <div style="position:absolute;right:80px;top:430px;color:#fff;text-align:right;width:640px"><div class="marca" style="color:#fde68a">Lattafa</div><div class="nom" style="margin-top:26px;font-size:92px">Asad<br><span style="color:#fde68a">Bourbon</span></div><div class="sub" style="margin-top:20px;color:#fed7aa">Intenso, dulce, nocturno.<br><b style="color:#fff">Precio x10 desde 1 unidad.</b></div></div>
 <div style="position:absolute;right:80px;top:1080px" class="x10">x10</div>
 <div class="tape" style="top:1660px;transform:rotate(-3deg)">__TAPE__</div>
 <div style="position:absolute;left:0;right:0;top:1800px;text-align:center;font:800 34px/1 'Unbounded';color:#fff;letter-spacing:.06em">distribuidorabelle.com</div>
</div>'''
# 14 · Hawas For Her · celeste-violeta claro, foto gigante centrada con el x10 encima
F['story-14-hawas-for-her']='''<div class="st" style="background:linear-gradient(180deg,#ecfeff,#ede9fe 55%,#fdf2f8)">
 <div class="grid"></div>
 <div class="halo" style="width:1000px;height:900px;left:40px;top:760px;background:#c4b5fd;opacity:.7"></div>
 <div class="halo" style="width:700px;height:700px;left:-200px;top:100px;background:#a5f3fc;opacity:.7"></div>
 '''+LOGO+'''
 <div style="position:absolute;left:80px;top:290px" class="kicker"><i style="background:#8b5cf6;box-shadow:0 0 0 6px rgba(139,92,246,.25)"></i>CyberMonday · hasta el 4/11</div>
 <div style="position:absolute;left:80px;top:430px"><div class="marca" style="color:#7c3aed">Rasasi</div><div class="nom" style="margin-top:26px">Hawas<br><span class="grad">For Her</span></div></div>
 <img class="foto" src="../fotos/cut_hawas_her.png" style="left:50%;top:900px;width:940px;transform:translateX(-50%)">
 <div style="position:absolute;right:90px;top:720px" class="x10">x10</div>
 <div class="sub" style="position:absolute;left:80px;top:760px;color:#2b3350;width:620px">Fresco, floral y elegante. <b>Precio x10 desde 1 unidad</b>, sin mínimo.</div>
 <div class="tape" style="top:1700px;transform:rotate(2.5deg)">__TAPE__</div>
 <div class="cta" style="position:absolute;left:80px;top:1800px;padding:22px 44px;font-size:32px">distribuidorabelle.com</div>
</div>'''
# 15 · Amber Oud Gold · negro y oro, foto centrada grande, muy premium
F['story-15-amber-oud-gold']='''<div class="st" style="background:radial-gradient(900px 700px at 50% 100%,#3b2a0e,#120d05 60%,#070707)">
 <div class="grid" style="background-image:linear-gradient(rgba(255,215,130,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,130,.08) 1px,transparent 1px)"></div>
 <div class="halo" style="width:900px;height:900px;left:90px;top:800px;background:#c4965a;opacity:.45"></div>
 '''+LOGOW+'''
 <div style="position:absolute;left:80px;top:290px;background:#120d05;color:#fde68a;border-color:#fde68a;box-shadow:8px 8px 0 #c4965a" class="kicker"><i style="background:#fde68a;box-shadow:0 0 0 6px rgba(253,230,138,.25)"></i>CyberMonday</div>
 <div style="position:absolute;left:80px;top:430px;color:#fff"><div class="marca" style="color:#fde68a">Al Haramain</div><div class="nom" style="margin-top:26px">Amber Oud<br><span style="background:linear-gradient(90deg,#c4965a,#fff2c2,#b07f2a);-webkit-background-clip:text;background-clip:text;color:transparent">Gold Edition</span></div><div class="sub" style="margin-top:20px;color:#e7d3a8;max-width:900px">Lujo árabe a <b style="color:#fff">precio x10 desde 1 unidad</b>.</div></div>
 <img class="foto" src="../fotos/cut_amber_oud_gold.png" style="left:50%;top:880px;width:1020px;transform:translateX(-50%)">
 <div class="tape" style="top:1700px;transform:rotate(-2.5deg);background:linear-gradient(90deg,#e6c98e,#c4965a);border-color:#fde68a">__TAPE__</div>
 <div style="position:absolute;left:0;right:0;top:1810px;text-align:center;font:800 34px/1 'Unbounded';color:#fde68a;letter-spacing:.06em">distribuidorabelle.com</div>
</div>'''
for k,v in F.items():
    open(k+'.html','w',encoding='utf-8').write(BASE.replace('__BODY__',v.replace('__TAPE__',TAPE)))
print('ok',list(F))
