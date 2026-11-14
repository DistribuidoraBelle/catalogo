// ─────────────────────── familias ───────────────────────
var FAM=[
 {k:'c1',n:'CÍTRICOS',col:'#FFD23F',ink:'#1a1a1a',emo:'🍋',ic:[['limon','limón'],['bergamota','bergamota'],['naranja','naranja']],adj:['frescos','livianos','☀️ verano'],img:'ck.png',pn:'CK ONE',ps:'Calvin Klein · EDT',ph:400},
 {k:'c2',n:'FLORALES',col:'#FF7FA5',ink:'#1a1a1a',emo:'🌸',ic:[['jazmin','jazmín'],['rosa','rosa'],['flor','flores blancas']],adj:['delicados','románticos','💕'],img:'yara.png',pn:'YARA ROSA',ps:'Lattafa · EDP',ph:330},
 {k:'c3',n:'AMADERADOS',col:'#3E9A5A',ink:'#ffffff',emo:'🌲',ic:[['madera','sándalo'],['cedro','cedro'],['vetiver','vetiver']],adj:['elegantes','seguros','🕴️'],img:'cdni.png',pn:'CLUB DE NUIT INTENSE',ps:'Armaf · EDT',ph:340},
 {k:'c4',n:'ORIENTALES',col:'#B5462A',ink:'#ffffff',emo:'🔥',ic:[['ambar','ámbar'],['canela','especias'],['oud','oud']],adj:['intensos','sensuales','🌙 noche'],img:'amber.png',pn:'AMBER OUD GOLD',ps:'Al Haramain · EDP',ph:340},
 {k:'c5',n:'GOURMAND',col:'#7A4524',ink:'#ffffff',emo:'🍮',ic:[['vainilla','vainilla'],['dulce','caramelo'],['cafe','café']],adj:['dulces','adictivos','😋'],img:'khamrah.png',pn:'KHAMRAH QAHWA',ps:'Lattafa · EDP',ph:330}
];
var ST=$('stage');
FAM.forEach(function(f,i){
  var S=el('div','abs','',ST,'left:0;top:0;width:940px;height:888px');f.S=S;
  f.band=el('div','abs','<div style="display:flex;align-items:center;gap:20px;height:100%;padding-left:46px"><span style="font-size:76px">'+f.emo+'</span><span style="font-family:\'Baloo 2\';font-weight:800;font-size:'+(f.n.length>9?88:104)+'px;color:'+f.ink+';letter-spacing:-.02em;line-height:1">'+f.n+'</span></div>',S,'left:0;top:0;width:940px;height:170px;background:'+f.col+';border-bottom:6px solid #1a1a1a');
  f.icons=f.ic.map(function(c,ci){return el('div','abs','<div style="display:flex;flex-direction:column;align-items:center;gap:6px">'+icon(c[0],116)+'<div style="font-family:DM Sans;font-weight:700;font-size:28px;white-space:nowrap">'+c[1]+'</div></div>',S,'left:'+(40+ci*150)+'px;top:215px;width:150px;display:flex;justify-content:center');});
  f.adj=f.adj.map(function(a,ai){return el('div','pill',a,S,'left:'+(50+ai*0)+'px;top:'+(440+ai*86)+'px;font-size:34px;background:'+(ai==0?'#1a1a1a':'#fff')+';color:'+(ai==0?'#F4B63A':'#1a1a1a')+';border:4px solid #1a1a1a');});
  f.prod=el('img','abs','',S,'right:40px;top:'+(250+(400-f.ph)/2)+'px;height:'+f.ph+'px;max-width:440px;object-fit:contain');f.prod.src=f.img;
  f.pl=el('div','abs','<div class="nm" style="position:static;font-size:'+(f.pn.length>14?38:48)+'px">'+f.pn+'<small>'+f.ps+'</small></div>',S,'right:30px;top:690px;width:460px');
  f.como=el('div','abs','COMO EL…',S,'right:40px;top:200px;font-family:DM Sans;font-weight:700;font-size:26px;letter-spacing:.12em;opacity:.5');
});
// cierre
var END=$('endWrap');
END.innerHTML='<div class="abs" id="endBg" style="inset:0;background:#1a1a1a"></div>'+
 '<div class="abs" id="endA" style="left:64px;top:360px;font-family:DM Sans;font-weight:700;font-size:40px;color:#F4B63A;letter-spacing:.06em">¿NO SABÉS CUÁL ES TU FAMILIA?</div>'+
 '<div class="abs" id="endB" style="left:64px;top:450px;font-weight:800;font-size:150px;line-height:.9;color:#fff">Escribinos</div>'+
 '<div class="abs" id="endC" style="left:64px;top:600px;font-weight:800;font-size:270px;line-height:.85;color:#1a1a1a;background:#F4B63A;padding:30px 50px 0;border-radius:40px;transform-origin:0 50%">BELLE</div>'+
 '<div class="abs" id="endD" style="left:64px;top:960px;font-family:DM Sans;font-weight:700;font-size:44px;color:#fff;opacity:.85">por mensaje directo y te la encontramos</div>';
