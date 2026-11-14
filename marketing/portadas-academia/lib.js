var $=function(id){return document.getElementById(id)};
function el(tag,cls,html,parent,style){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(style)e.setAttribute('style',style);(parent||document.body).appendChild(e);return e}
var CONC={
  edc:{n:'EDC',full:'Eau de Cologne',pct:5,rng:'2–5%',h:'1–2 h',ess:['#FFE7A8','#F6C860'],cap:'#D9DDE2',capHi:'#ffffff'},
  edt:{n:'EDT',full:'Eau de Toilette',pct:15,rng:'5–15%',h:'3–5 h',ess:['#FFD06B','#EFA43A'],cap:'#D9DDE2',capHi:'#ffffff'},
  edp:{n:'EDP',full:'Eau de Parfum',pct:20,rng:'15–20%',h:'5–8 h',ess:['#F7B04A','#D97A1C'],cap:'#E6B04E',capHi:'#FFE3A3'},
  par:{n:'PARFUM',full:'Extrait',pct:30,rng:'20–30%',h:'8–12 h',ess:['#E8863A','#B2521A'],cap:'#E6B04E',capHi:'#FFE3A3'},
  eli:{n:'ELIXIR',full:'Versión reforzada',pct:30,rng:'+ intenso',h:'8–14 h',ess:['#A8452B','#5E1E16'],cap:'#2a2a2a',capHi:'#777'}
};

var BID=0;
function bottle(parent,c,x,y,scale){
  var id='b'+(BID++);
  var W=300,H=560;
  var LT=176, LB=486, LH=LB-LT;                 // columna de líquido (y top / bottom)
  var k=scale||1;var svg='<svg width="'+(W*k)+'" height="'+(H*k)+'" viewBox="0 0 '+W+' '+H+'" style="overflow:visible">'+
  '<defs>'+
   '<linearGradient id="'+id+'g" x1="0" x2="1"><stop offset="0" stop-color="#EEF3F6"/><stop offset=".45" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3EAEF"/></linearGradient>'+
   '<linearGradient id="'+id+'e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c.ess[0]+'"/><stop offset="1" stop-color="'+c.ess[1]+'"/></linearGradient>'+
   '<linearGradient id="'+id+'a" x1="0" x2="1"><stop offset="0" stop-color="#DDEFF8"/><stop offset=".5" stop-color="#F1F9FD"/><stop offset="1" stop-color="#D6EBF6"/></linearGradient>'+
   '<linearGradient id="'+id+'c" x1="0" x2="1"><stop offset="0" stop-color="'+c.cap+'"/><stop offset=".35" stop-color="'+c.capHi+'"/><stop offset="1" stop-color="'+c.cap+'"/></linearGradient>'+
   '<clipPath id="'+id+'k"><rect x="46" y="150" width="208" height="'+(LB-150)+'" rx="30"/></clipPath>'+
  '</defs>'+
  // sombra dura
  '<rect x="40" y="140" width="240" height="410" rx="48" fill="#1a1a1a"/>'+
  // cuerpo de vidrio
  '<rect x="28" y="128" width="244" height="410" rx="48" fill="url(#'+id+'g)" stroke="#1a1a1a" stroke-width="6"/>'+
  '<rect x="42" y="144" width="216" height="386" rx="34" fill="none" stroke="#C9D5DC" stroke-width="3"/>'+
  // líquido
  '<g clip-path="url(#'+id+'k)">'+
    '<rect id="'+id+'alc" x="40" y="'+LB+'" width="220" height="0" fill="url(#'+id+'a)"/>'+
    '<ellipse id="'+id+'alcTop" cx="150" cy="'+LB+'" rx="104" ry="9" fill="#F7FCFF" opacity="0"/>'+
    '<rect id="'+id+'ess" x="40" y="'+LB+'" width="220" height="0" fill="url(#'+id+'e)"/>'+
    '<ellipse id="'+id+'essTop" cx="150" cy="'+LB+'" rx="104" ry="9" fill="'+c.ess[0]+'" opacity="0"/>'+
    '<g id="'+id+'bub"></g>'+
  '</g>'+
  '<line id="'+id+'mk" x1="20" x2="280" y1="0" y2="0" stroke="#1a1a1a" stroke-width="4" stroke-dasharray="12 8" opacity="0"/>'+
  // fondo grueso del frasco
  '<rect x="40" y="'+(LB)+'" width="220" height="40" rx="18" fill="#DCE5EA" opacity=".9"/>'+
  '<line x1="58" y1="'+(LB+2)+'" x2="242" y2="'+(LB+2)+'" stroke="#1a1a1a" stroke-width="3" opacity=".25"/>'+
  // escala grabada (0–30%)
  '<g id="'+id+'scale" opacity="0" font-family="DM Sans" font-weight="700" font-size="17" fill="#1a1a1a">'+
   [10,20,30].map(function(p){var yy=LB-LH*p/100;return '<line x1="226" y1="'+yy+'" x2="248" y2="'+yy+'" stroke="#1a1a1a" stroke-width="3" opacity=".55"/>'}).join('')+
   [5,15,25].map(function(p){var yy=LB-LH*p/100;return '<line x1="236" y1="'+yy+'" x2="248" y2="'+yy+'" stroke="#1a1a1a" stroke-width="2.5" opacity=".4"/>'}).join('')+
  '</g>'+
  // brillos del vidrio
  '<rect x="54" y="168" width="16" height="300" rx="8" fill="#ffffff" opacity=".85"/>'+
  '<rect x="78" y="168" width="6" height="200" rx="3" fill="#ffffff" opacity=".6"/>'+
  '<rect x="236" y="190" width="8" height="120" rx="4" fill="#ffffff" opacity=".5"/>'+
  // cuello + tapa
  '<rect x="118" y="98" width="64" height="34" rx="6" fill="#E9EEF1" stroke="#1a1a1a" stroke-width="6"/>'+
  '<rect x="96" y="8" width="108" height="94" rx="14" fill="url(#'+id+'c)" stroke="#1a1a1a" stroke-width="6"/>'+
  '<rect x="110" y="20" width="12" height="70" rx="6" fill="#ffffff" opacity=".55"/>'+
  '</svg>';
  var wrap=el('div','btl',svg,parent);
  wrap.style.left=x+'px';wrap.style.top=y+'px';wrap.style.width=(W*k)+'px';wrap.style.height=(H*k)+'px';
  wrap.style.transformOrigin='50% 100%';
  var o={wrap:wrap,id:id,c:c,LT:LT,LB:LB,LH:LH,k:k,x:x,y:y};
  // gotitas de esencia (posiciones fijas = render determinístico)
  var g=wrap.querySelector('#'+id+'bub');
  o.bub=[];for(var i=0;i<7;i++){var cc=document.createElementNS('http://www.w3.org/2000/svg','circle');cc.setAttribute('r',3+((i*7)%5));cc.setAttribute('fill','#ffffff');cc.setAttribute('opacity','0');g.appendChild(cc);o.bub.push({e:cc,x:70+((i*53)%160),sp:.35+((i*17)%10)/20,ph:i*.37});}
  return o;
}
// alc: 0..1 nivel de alcohol (1 = lleno), ess: % de esencia mostrado, t: tiempo (para el vaivén)
function fillBottle(o,alc,ess,t,showScale){
  var q=function(s){return o.wrap.querySelector('#'+o.id+s)};
  var full=o.LH*0.94;                         // lleno al 94%
  var ah=full*alc, eh=o.LH*ess/100;
  var wob=Math.sin(t*3.1)*2.2;
  q('alc').setAttribute('y',o.LB-ah);q('alc').setAttribute('height',ah);
  q('alcTop').setAttribute('cy',o.LB-ah+wob*.3);q('alcTop').setAttribute('opacity',ah>8?.95:0);
  q('ess').setAttribute('y',o.LB-eh);q('ess').setAttribute('height',eh);
  q('essTop').setAttribute('cy',o.LB-eh+wob*.2);q('essTop').setAttribute('opacity',eh>4?1:0);
  q('scale').setAttribute('opacity',showScale==null?1:showScale);
  q('mk').setAttribute('y1',o.LB-eh);q('mk').setAttribute('y2',o.LB-eh);q('mk').setAttribute('opacity',(eh>3&&showScale!==0)?.9:0);
  o.bub.forEach(function(b){var top=o.LB-ah+10,span=Math.max(0,ah-20);if(span<30){b.e.setAttribute('opacity',0);return;}
    var k=((t*b.sp+b.ph)%1);b.e.setAttribute('cx',b.x+Math.sin((t+b.ph)*2)*4);b.e.setAttribute('cy',o.LB-6-k*span);b.e.setAttribute('opacity',(1-k)*.55*Math.min(1,alc*1.5));});
  return o.LB-eh;                              // y de la línea de esencia (coords del svg)
}

function placeTag(tg,o,pct){var cx=o.x+150*o.k;var y=o.y+(o.LB-o.LH*pct/100)*o.k;tg.style.left=(cx-tg.offsetWidth/2)+'px';tg.style.top=(y-tg.offsetHeight-10)+'px';}
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
ICON.naranja=ICON.limon.replace(/#FFE14D/g,'#FF9A2E').replace(/#FFF3A6/g,'#FFC27A').replace(/#E8C21F/g,'#E07A12');
ICON.bergamota=ICON.limon.replace(/#FFE14D/g,'#A8D84E').replace(/#FFF3A6/g,'#E2F5A8').replace(/#E8C21F/g,'#7DAE2C');
ICON.cedro='<path d="M60 10 L96 70 L74 70 L100 100 L20 100 L46 70 L24 70 Z" fill="#3E9A5A" '+IK+'/><rect x="52" y="100" width="16" height="16" fill="#8A5A33" '+IK+'/>';
ICON.vetiver='<path d="M30 108 C 30 70 22 40 14 20 M48 108 C 48 64 46 34 42 10 M66 108 C 66 66 72 36 80 14 M84 108 C 86 74 96 50 108 34" fill="none" stroke="#1a1a1a" stroke-width="12" stroke-linecap="round"/><path d="M30 108 C 30 70 22 40 14 20 M48 108 C 48 64 46 34 42 10 M66 108 C 66 66 72 36 80 14 M84 108 C 86 74 96 50 108 34" fill="none" stroke="#B8C24A" stroke-width="6" stroke-linecap="round"/>';
ICON.oud='<rect x="50" y="40" width="20" height="70" rx="4" fill="#5A3A22" '+IK+'/><circle cx="60" cy="38" r="7" fill="#FF7A2E" stroke="#1a1a1a" stroke-width="4"/><path d="M60 30 C 48 20 72 14 60 4 M66 26 C 80 18 70 10 80 2" fill="none" stroke="#9A9AA6" stroke-width="5" stroke-linecap="round"/>';
ICON.flor=ICON.jazmin.replace(/#FFFFFF/g,'#FFF1F5');
function icon(k,size){return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 120 120" style="overflow:visible;display:block">'+ICON[k]+'</svg>';}
// ─────────────────────── pirámide ───────────────────────
// 3 pisos: salida (arriba), corazón (medio), fondo (abajo)
function pyramid(parent,x,y,W,H,small){
  var ax=W/2, by=H, cuts=[0,0.30,0.63,1];
  function xAt(f){return [ax-(W/2)*f, ax+(W/2)*f];}      // f = 0 (punta) … 1 (base)
  var cols=[['#FFE680','#FFD23F'],['#FF9BB5','#FF5A7E'],['#B97A4A','#7A4524']];
  var names=['SALIDA','CORAZÓN','FONDO'];
  var svg='<svg width="'+(W+20)+'" height="'+(H+20)+'" viewBox="0 0 '+(W+20)+' '+(H+20)+'" style="overflow:visible">';
  svg+='<polygon points="'+(ax+12)+','+12+' '+(W+12)+','+(H+12)+' '+12+','+(H+12)+'" fill="#1a1a1a"/>';
  svg+='<polygon points="'+ax+',0 '+W+','+H+' 0,'+H+'" fill="#F3EEE6"/>';
  for(var i=0;i<3;i++){var f0=cuts[i],f1=cuts[i+1],a=xAt(f0),b=xAt(f1);
    var pts=(i==0?(ax+','+0):(a[0]+','+(H*f0)+' '+a[1]+','+(H*f0)))+' '+b[1]+','+(H*f1)+' '+b[0]+','+(H*f1);
    svg+='<defs><linearGradient id="pg'+i+(small?'s':'')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+cols[i][0]+'"/><stop offset="1" stop-color="'+cols[i][1]+'"/></linearGradient></defs>';
    svg+='<polygon class="tier" data-i="'+i+'" points="'+pts+'" fill="url(#pg'+i+(small?'s':'')+')" stroke="#1a1a1a" stroke-width="6" stroke-linejoin="round"/>';
    if(!small){var ty=i==0?H*0.27:H*(f0+f1)/2+18;svg+='<text class="tlab" data-i="'+i+'" x="'+ax+'" y="'+ty+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(i==0?34:i==1?50:58)+'" fill="'+(i==2?'#fff':'#1a1a1a')+'">'+names[i]+'</text>';}
  }
  svg+='<path d="M'+(ax-W*0.12)+' '+(H*0.18)+' L'+(ax-W*0.03)+' '+(H*0.05)+'" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>';
  svg+='</svg>';
  var w=el('div','abs',svg,parent,'left:'+x+'px;top:'+y+'px');
  return {el:w,tiers:w.querySelectorAll('.tier'),labs:w.querySelectorAll('.tlab'),W:W,H:H,cuts:cuts};
}
function lightTiers(p,act,t){ // act: índice activo (-1 = todos)
  for(var i=0;i<3;i++){var on=act<0||act===i;p.tiers[i].style.opacity=on?1:0.3;if(p.labs[i])p.labs[i].style.opacity=on?1:0.25;}
}

