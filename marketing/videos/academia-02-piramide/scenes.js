// ─────────────────────── íconos de ingredientes (SVG dibujados) ───────────────────────
var IK='stroke="#1a1a1a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
var ICON={
 limon:'<circle cx="60" cy="60" r="46" fill="#FFE14D" '+IK+'/><circle cx="60" cy="60" r="34" fill="#FFF3A6" stroke="#E8C21F" stroke-width="4"/>'+[0,60,120,180,240,300].map(function(a){var r=a*Math.PI/180;return '<line x1="60" y1="60" x2="'+(60+32*Math.cos(r))+'" y2="'+(60+32*Math.sin(r))+'" stroke="#E8C21F" stroke-width="4"/>'}).join('')+'<circle cx="60" cy="60" r="5" fill="#E8C21F"/>',
 canela:'<rect x="24" y="30" width="20" height="70" rx="9" transform="rotate(-18 34 65)" fill="#B5622B" '+IK+'/><rect x="50" y="22" width="20" height="74" rx="9" transform="rotate(-6 60 59)" fill="#C9733A" '+IK+'/><rect x="76" y="30" width="20" height="70" rx="9" transform="rotate(12 86 65)" fill="#A9552A" '+IK+'/>',
 menta:'<path d="M60 104 C 20 90 14 46 60 14 C 106 46 100 90 60 104 Z" fill="#5FCB7A" '+IK+'/><path d="M60 100 L60 28" '+IK+' fill="none"/><path d="M60 58 L42 44 M60 74 L80 60 M60 88 L44 78" stroke="#1a1a1a" stroke-width="4" fill="none" stroke-linecap="round"/>',
 jazmin:[0,72,144,216,288].map(function(a){return '<ellipse cx="60" cy="32" rx="17" ry="27" fill="#FFFFFF" '+IK+' transform="rotate('+a+' 60 60)"/>'}).join('')+'<circle cx="60" cy="60" r="12" fill="#FFD23F" '+IK+'/>',
 rosa:'<circle cx="60" cy="60" r="44" fill="#FF7FA5" '+IK+'/><path d="M60 34 C 82 34 86 60 66 66 C 48 70 44 50 58 48 C 68 47 70 58 62 59" fill="none" '+IK+'/><path d="M30 70 C 40 92 82 94 92 66" fill="none" '+IK+'/>',
 fruta:'<path d="M60 20 C 58 40 46 52 38 62 M60 20 C 66 40 78 50 84 60" fill="none" '+IK+'/><path d="M60 20 C 70 12 84 14 90 22 C 80 26 70 26 60 20 Z" fill="#5FCB7A" '+IK+'/><circle cx="38" cy="78" r="22" fill="#E8344E" '+IK+'/><circle cx="84" cy="76" r="22" fill="#E8344E" '+IK+'/><circle cx="31" cy="71" r="5" fill="#fff"/><circle cx="77" cy="69" r="5" fill="#fff"/>',
 dulce:'<path d="M14 40 L34 52 L34 68 L14 80 Z M106 40 L86 52 L86 68 L106 80 Z" fill="#FF9EC2" '+IK+'/><ellipse cx="60" cy="60" rx="30" ry="24" fill="#FF5A8A" '+IK+'/><path d="M44 50 C 54 58 66 56 76 50" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>',
 vainilla:'<path d="M26 98 C 40 70 70 40 98 18" stroke="#1a1a1a" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M26 98 C 40 70 70 40 98 18" stroke="#5A3A22" stroke-width="10" fill="none" stroke-linecap="round"/>'+[0,72,144,216,288].map(function(a){return '<ellipse cx="34" cy="28" rx="9" ry="15" fill="#FFF3C4" stroke="#1a1a1a" stroke-width="4" transform="rotate('+a+' 34 40)"/>'}).join('')+'<circle cx="34" cy="40" r="6" fill="#FFD23F" stroke="#1a1a1a" stroke-width="3"/>',
 madera:'<ellipse cx="60" cy="60" rx="46" ry="44" fill="#C98A4E" '+IK+'/><ellipse cx="60" cy="60" rx="34" ry="32" fill="none" stroke="#9A6234" stroke-width="4"/><ellipse cx="60" cy="60" rx="22" ry="20" fill="none" stroke="#9A6234" stroke-width="4"/><ellipse cx="60" cy="60" rx="9" ry="8" fill="#9A6234"/>',
 ambar:'<path d="M60 12 L98 40 L86 98 L34 98 L22 40 Z" fill="#FFA62B" '+IK+'/><path d="M22 40 L60 52 L98 40 M60 52 L60 98 M34 98 L60 52 L86 98" fill="none" stroke="#C26B12" stroke-width="4"/><path d="M40 30 L52 24" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
 almizcle:'<path d="M30 86 C 10 86 10 58 30 58 C 30 36 62 30 70 50 C 84 38 106 50 98 68 C 112 72 108 92 92 90 Z" fill="#E6DAFF" '+IK+'/><circle cx="48" cy="72" r="5" fill="#B9A3F5"/><circle cx="72" cy="66" r="4" fill="#B9A3F5"/>',
 cardamomo:'<path d="M60 14 C 92 34 92 86 60 106 C 28 86 28 34 60 14 Z" fill="#9BD16B" '+IK+'/><path d="M60 20 L60 100 M44 40 C 52 60 52 80 46 92 M76 40 C 68 60 68 80 74 92" stroke="#5E9A38" stroke-width="4" fill="none"/>',
 praline:'<path d="M60 16 C 90 16 100 52 92 78 C 84 102 36 102 28 78 C 20 52 30 16 60 16 Z" fill="#B87A3E" '+IK+'/><path d="M30 46 C 50 54 72 54 92 46" stroke="#1a1a1a" stroke-width="5" fill="none"/><path d="M34 34 C 50 40 70 40 86 34" stroke="#7E4E22" stroke-width="4" fill="none"/>',
 cafe:'<ellipse cx="60" cy="60" rx="34" ry="46" transform="rotate(25 60 60)" fill="#6B3E22" '+IK+'/><path d="M48 22 C 70 44 50 76 72 98" stroke="#2E170A" stroke-width="6" fill="none" stroke-linecap="round"/>'
};
function icon(k,size){return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 120 120" style="overflow:visible;display:block">'+ICON[k]+'</svg>';}
function chip(parent,k,label,x,y){var e=el('div','abs','<div style="display:flex;flex-direction:column;align-items:center;gap:6px">'+icon(k,120)+'<div style="font-family:DM Sans;font-weight:700;font-size:30px;white-space:nowrap">'+label+'</div></div>',parent,'left:'+x+'px;top:'+y+'px;width:200px;display:flex;justify-content:center');return e;}

// ─────────────────────── pirámide ───────────────────────
// 3 pisos: salida (arriba), corazón (medio), fondo (abajo)
function pyramid(parent,x,y,W,H,small){
  var ax=W/2, by=H, cuts=[0,0.30,0.63,1];
  function xAt(f){return [ax-(W/2)*f, ax+(W/2)*f];}      // f = 0 (punta) … 1 (base)
  var cols=[['#FFE680','#FFD23F'],['#FF9BB5','#FF5A7E'],['#B97A4A','#7A4524']];
  var names=['SALIDA','CORAZÓN','FONDO'];
  var svg='<svg width="'+(W+20)+'" height="'+(H+20)+'" viewBox="0 0 '+(W+20)+' '+(H+20)+'" style="overflow:visible">';
  svg+='<polygon points="'+(ax+12)+','+12+' '+(W+12)+','+(H+12)+' '+12+','+(H+12)+'" fill="#1a1a1a"/>';
  for(var i=0;i<3;i++){var f0=cuts[i],f1=cuts[i+1],a=xAt(f0),b=xAt(f1);
    var pts=(i==0?(ax+','+0):(a[0]+','+(H*f0)+' '+a[1]+','+(H*f0)))+' '+b[1]+','+(H*f1)+' '+b[0]+','+(H*f1);
    svg+='<defs><linearGradient id="pg'+i+(small?'s':'')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+cols[i][0]+'"/><stop offset="1" stop-color="'+cols[i][1]+'"/></linearGradient></defs>';
    svg+='<polygon class="tier" data-i="'+i+'" points="'+pts+'" fill="url(#pg'+i+(small?'s':'')+')" stroke="#1a1a1a" stroke-width="6" stroke-linejoin="round"/>';
    if(!small){var ty=H*(f0+f1)/2+ (i==0?40:16);svg+='<text class="tlab" data-i="'+i+'" x="'+ax+'" y="'+ty+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(i==0?44:58)+'" fill="'+(i==2?'#fff':'#1a1a1a')+'">'+names[i]+'</text>';}
  }
  svg+='<path d="M'+(ax-W*0.12)+' '+(H*0.18)+' L'+(ax-W*0.03)+' '+(H*0.05)+'" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>';
  svg+='</svg>';
  var w=el('div','abs',svg,parent,'left:'+x+'px;top:'+y+'px');
  return {el:w,tiers:w.querySelectorAll('.tier'),labs:w.querySelectorAll('.tlab'),W:W,H:H,cuts:cuts};
}
function lightTiers(p,act,t){ // act: índice activo (-1 = todos)
  for(var i=0;i<3;i++){var on=act<0||act===i;p.tiers[i].style.opacity=on?1:0.22;if(p.labs[i])p.labs[i].style.opacity=on?1:0.25;}
}

var ST=$('stage');
function scene(){return el('div','abs','',ST,'left:0;top:0;width:940px;height:888px')}

// ESCENAS 1-3 · la pirámide grande, se ilumina piso por piso
var SP=scene();
var PY=pyramid(SP,150,40,640,560,false);
var durs=[
  el('div','pill','<span class="clock"><i></i></span>15 min',SP,'left:640px;top:120px;font-size:32px'),
  el('div','pill','<span class="clock"><i></i></span>~4 horas',SP,'left:690px;top:300px;font-size:32px'),
  el('div','pill','🌙 hasta el otro día',SP,'left:560px;top:520px;font-size:30px')];
var GROUPS=[
  [['limon','cítricos'],['canela','especias'],['menta','frescura']],
  [['jazmin','flores'],['fruta','frutas'],['dulce','lo dulce']],
  [['vainilla','vainilla'],['madera','maderas'],['ambar','ámbar'],['almizcle','almizcle']]];
var chipEls=GROUPS.map(function(g,gi){return g.map(function(c,ci){var n=g.length,wid=n==4?210:260;var x=470-(n*wid)/2+ci*wid+(wid-200)/2;return chip(SP,c[0],c[1],x,650);});});
// partículas que se evaporan desde la punta (salida)
var evap=[];for(var i=0;i<10;i++){evap.push(el('div','abs','',SP,'left:0;top:0;width:14px;height:14px;border-radius:50%;background:#FFD23F;border:3px solid #1a1a1a'));}

// ESCENA 4 · en la vida real: Khamrah Qahwa
var SK=scene();
var kq=el('img','abs','',SK,'left:40px;top:120px;height:600px');kq.src='khamrah.png';
var kqT=el('div','abs','<div class="nm" style="position:static;font-size:50px">KHAMRAH QAHWA<small>Lattafa · EDP</small></div>',SK,'left:10px;top:740px;width:440px');
var PK=pyramid(SK,470,90,420,380,true);
var KROWS=[[['canela','canela'],['cardamomo','cardamomo']],[['praline','praliné'],['fruta','frutas conf.']],[['vainilla','vainilla'],['cafe','café']]];
var kChips=KROWS.map(function(r,ri){return r.map(function(c,ci){var e=el('div','abs','<div style="display:flex;align-items:center;gap:8px;background:#fff;border:4px solid #1a1a1a;border-radius:40px;padding:4px 16px 4px 6px;box-shadow:5px 5px 0 #1a1a1a">'+icon(c[0],52)+'<span style="font-family:DM Sans;font-weight:700;font-size:24px;white-space:nowrap">'+c[1]+'</span></div>',SK,'left:'+(470+ci*215)+'px;top:'+(500+ri*82)+'px');return e;});});
var kLbl=['SALIDA','CORAZÓN','FONDO'].map(function(n,i){return el('div','abs',n,SK,'left:'+(380)+'px;top:'+(512+i*82)+'px;font-family:DM Sans;font-weight:700;font-size:18px;letter-spacing:.08em;opacity:.55;width:80px;text-align:right')});
var tipK=el('div','abs','<div style="background:#FFF7E8;border:6px solid #1a1a1a;border-radius:40px;box-shadow:12px 12px 0 #1a1a1a;padding:44px 50px;width:800px"><div style="font-family:DM Sans;font-weight:700;font-size:32px;letter-spacing:.1em;opacity:.6">TIP BELLE ⏳</div><div style="font-weight:800;font-size:72px;line-height:1">Nunca compres<br>por los primeros<br><span style="background:#F4B63A;padding:0 14px;border-radius:16px">5 minutos</span></div><div style="font-family:DM Sans;font-weight:700;font-size:34px;margin-top:20px">Esperá a que llegue el fondo.</div></div>',SK,'left:70px;top:190px');

// cierre (pantalla completa)
var END=$('endWrap');
END.innerHTML='<div class="abs" id="endBg" style="inset:0;background:#1a1a1a"></div>'+
 '<div class="abs" id="endA" style="left:64px;top:360px;font-family:DM Sans;font-weight:700;font-size:40px;color:#F4B63A;letter-spacing:.06em">¿TE AYUDAMOS A ELEGIR EL TUYO?</div>'+
 '<div class="abs" id="endB" style="left:64px;top:450px;font-weight:800;font-size:150px;line-height:.9;color:#fff">Escribinos</div>'+
 '<div class="abs" id="endC" style="left:64px;top:600px;font-weight:800;font-size:270px;line-height:.85;color:#1a1a1a;background:#F4B63A;padding:30px 50px 0;border-radius:40px;transform-origin:0 50%">BELLE</div>'+
 '<div class="abs" id="endD" style="left:64px;top:960px;font-family:DM Sans;font-weight:700;font-size:44px;color:#fff;opacity:.85">por mensaje directo</div>';
