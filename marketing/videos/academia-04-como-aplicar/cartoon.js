// ═══════════ ACADEMIA 04 · CÓMO PONERTE EL PERFUME — escenas animadas tipo dibujo ═══════════
var SKIN='#F6C7A1',SKIN2='#E9A87E',INK='#1a1a1a',SHIRT='#FFFFFF',HAIR='#3B2A20';
var IKs='stroke="#1a1a1a" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"';
var TIPS=[
 {k:'t1',n:1,bg:'#22C3B0',title:'HIDRATÁ<br>LA PIEL',emo:'🧴'},
 {k:'t2',n:2,bg:'#FF6FB5',title:'PUNTOS<br>DE PULSO',emo:'💓'},
 {k:'t3',n:3,bg:'#8E6CF5',title:'NUNCA<br>FROTES',emo:'🙅'},
 {k:'t4',n:4,bg:'#7ED957',title:'A 15<br>CENTÍMETROS',emo:'📏'},
 {k:'t5',n:5,bg:'#3DB8F5',title:'ROPA<br>Y PELO',emo:'💇'}
];
var NS='http://www.w3.org/2000/svg';
function svgEl(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function mkSvg(parent,w,h,style){var s=document.createElementNS(NS,'svg');s.setAttribute('width',w);s.setAttribute('height',h);s.setAttribute('viewBox','0 0 '+w+' '+h);s.setAttribute('style','position:absolute;overflow:visible;'+(style||''));parent.appendChild(s);return s;}

// ── fondo de color que cambia + patrón ──
var BG=el('div','abs','',document.body,'inset:0;z-index:0');
var PAT=el('div','abs','',document.body,'inset:0;z-index:0;background-image:radial-gradient(rgba(255,255,255,.18) 3px,transparent 3.5px);background-size:52px 52px');
// confeti de formas que flotan (da vida al fondo)
var CONF=[];for(var i=0;i<14;i++){var sh=['●','▲','■','✚','◆'][i%5];CONF.push(el('div','abs',sh,document.body,'z-index:0;font-size:'+(26+(i*7)%30)+'px;color:rgba(255,255,255,.35);left:'+((i*137)%1000)+'px;top:'+((i*331)%1800)+'px'));}

// ── cabecera de cada truco: número gigante en círculo + título ──
var HD=el('div','abs','',document.body,'left:0;top:0;width:1080px;height:400px;z-index:5');
var HDnum=el('div','abs','',HD,'left:64px;top:110px;width:210px;height:210px;border-radius:50%;background:#fff;border:8px solid #1a1a1a;box-shadow:10px 10px 0 #1a1a1a;display:flex;align-items:center;justify-content:center;font-family:"Baloo 2";font-weight:800;font-size:150px;line-height:1;padding-top:14px');
var HDtit=el('div','abs','',HD,'left:310px;top:118px;font-family:"Baloo 2";font-weight:800;font-size:96px;line-height:.92;color:#fff;letter-spacing:-.02em;-webkit-text-stroke:0;text-shadow:6px 6px 0 #1a1a1a');
var HDemo=el('div','abs','',HD,'left:225px;top:80px;font-size:80px');
var HDtag=el('div','abs','TRUCO',HD,'left:96px;top:70px;font-family:"DM Sans";font-weight:700;font-size:28px;letter-spacing:.2em;color:#1a1a1a;background:#fff;padding:4px 14px;border-radius:10px;border:4px solid #1a1a1a');

// ── escena: contenedor de dibujo (y 380 … 1540) ──
var SC=el('div','abs','',document.body,'left:0;top:380px;width:1080px;height:1160px;z-index:4');
function layer(){return el('div','abs','',SC,'left:0;top:0;width:1080px;height:1160px')}

// ── piezas reutilizables ──
function sprayBottle(parent){ // frasco con atomizador (apunta a la izquierda)
  var s=mkSvg(parent,200,260,'left:0;top:0;transform-origin:100px 130px');
  s.innerHTML='<rect x="62" y="96" width="120" height="150" rx="26" fill="#FFD23F" '+IKs+'/><rect x="78" y="112" width="16" height="110" rx="8" fill="#fff" opacity=".7"/><rect x="100" y="58" width="44" height="40" rx="6" fill="#ddd" '+IKs+'/><rect x="92" y="22" width="60" height="40" rx="10" fill="#1a1a1a"/><rect x="60" y="34" width="36" height="14" rx="6" fill="#1a1a1a"/><text x="122" y="190" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40" fill="#1a1a1a">B.</text>';
  return s;
}
function mist(parent,n,color){var arr=[];for(var i=0;i<n;i++){arr.push(el('div','abs','',parent,'left:0;top:0;width:'+(14+(i%4)*6)+'px;height:'+(14+(i%4)*6)+'px;border-radius:50%;background:'+(color||'rgba(255,255,255,.95)')+';border:3px solid rgba(26,26,26,.35);visibility:hidden'));}return arr;}
// rociado: partículas que salen de (x0,y0) hacia (x1,y1) en abanico
function sprayFx(arr,t,ts,x0,y0,x1,y1,dur){dur=dur||0.9;arr.forEach(function(p,i){var ph=((t-ts)/dur)-i*0.045;var on=t>=ts&&ph>0&&ph<1;p.style.visibility=on?'visible':'hidden';if(!on)return;var spread=((i*37)%11-5)*9;var x=lerp(x0,x1,ph)+spread*ph,y=lerp(y0,y1,ph)+((i*53)%9-4)*10*ph;p.style.transform='translate('+x+'px,'+y+'px) scale('+lerp(.4,1.2,ph)+')';p.style.opacity=1-ph*0.6;});}
function stamp(parent,html,x,y,col){return el('div','abs',html,parent,'left:'+x+'px;top:'+y+'px;font-family:"Baloo 2";font-weight:800;font-size:90px;color:'+(col||'#E5322B')+';border:12px solid '+(col||'#E5322B')+';border-radius:24px;padding:0 30px;background:rgba(255,255,255,.92);transform-origin:50% 50%;white-space:nowrap');}
function stampIn(e,t,s,r){var k=seg(t,s,0.3);e.style.visibility=t>=s?'visible':'hidden';e.style.transform='rotate('+(r||-8)+'deg) scale('+lerp(2.4,1,e4(k))+')';e.style.opacity=clamp(k*3);}
function forearm(parent,x,y,w,rot,flip){ // antebrazo horizontal con mano redonda
  var s=mkSvg(parent,w+120,200,'left:'+x+'px;top:'+y+'px;transform-origin:'+(flip?(w+60):60)+'px 100px;transform:rotate('+rot+'deg)'+(flip?' scaleX(-1)':''));
  s.innerHTML='<rect x="0" y="40" width="'+w+'" height="120" rx="60" fill="'+SKIN+'" '+IKs+'/><circle cx="'+(w+20)+'" cy="100" r="78" fill="'+SKIN+'" '+IKs+'/><path d="M'+(w+20)+' 40 L'+(w+20)+' 20 M'+(w+50)+' 44 L'+(w+62)+' 26 M'+(w+74)+' 62 L'+(w+92)+' 50" '+IKs+' fill="none"/><line x1="'+(w-70)+'" y1="70" x2="'+(w-70)+'" y2="130" stroke="'+SKIN2+'" stroke-width="5" stroke-linecap="round"/>';
  return s;
}

// ═════════ T1 · HIDRATÁ LA PIEL ═════════
var L1=layer();
var arm1=el('div','abs','',L1,'left:0;top:0;width:1080px;height:1160px');
var a1svg=mkSvg(arm1,1080,500,'left:0;top:300px');
a1svg.innerHTML='<rect x="-40" y="120" width="900" height="200" rx="100" fill="'+SKIN+'" '+IKs+'/><circle cx="900" cy="220" r="120" fill="'+SKIN+'" '+IKs+'/>';
var cream=svgEl('rect',{x:120,y:150,width:0,height:140,rx:70,fill:'#FFFFFF',stroke:'#1a1a1a','stroke-width':5,opacity:.95},a1svg);
var creamGloss=svgEl('rect',{x:150,y:168,width:0,height:20,rx:10,fill:'#CFF7FF'},a1svg);
var tube=el('div','abs','<svg width="300" height="180" viewBox="0 0 300 180" style="overflow:visible"><path d="M20 50 L210 30 L210 150 L20 130 Z" fill="#7FE3FF" '+IKs+'/><rect x="210" y="60" width="50" height="60" rx="8" fill="#fff" '+IKs+'/><rect x="258" y="74" width="30" height="32" rx="6" fill="#1a1a1a"/><text x="110" y="102" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="34" fill="#1a1a1a">CREMA</text></svg>',L1,'left:0;top:0;transform-origin:150px 90px');
var mol1=[];for(var i=0;i<12;i++){mol1.push(el('div','abs','',L1,'left:0;top:0;width:34px;height:34px;border-radius:50%;border:5px solid #1a1a1a;background:'+['#FFD23F','#FF6FB5','#8E6CF5','#FF8A3D'][i%4]));}
var cage=[];for(var i=0;i<12;i++){cage.push(el('div','abs','✨',L1,'left:0;top:0;font-size:34px'));}
var meter=el('div','abs','<div style="font-family:Baloo 2;font-weight:800;font-size:56px;color:#fff;text-shadow:4px 4px 0 #1a1a1a">⏳ DURA MÁS</div><div style="margin-top:14px;width:820px;height:70px;background:#fff;border:7px solid #1a1a1a;border-radius:40px;overflow:hidden;box-shadow:8px 8px 0 #1a1a1a"><div id="mfill" style="height:100%;width:0;background:repeating-linear-gradient(45deg,#FFD23F 0 30px,#FFB800 30px 60px)"></div></div>',L1,'left:130px;top:820px');
var dry=el('div','abs','<div style="background:#fff;border:6px solid #1a1a1a;border-radius:22px;padding:6px 18px;font-family:DM Sans;font-weight:700;font-size:30px">piel seca = se evapora 💨</div>',L1,'left:540px;top:150px');

// ═════════ PERSONAJE (T2 y T5) ═════════
function character(parent,withScarf){
  var w=el('div','abs','',parent,'left:0;top:0;width:1080px;height:1160px');
  var s=mkSvg(w,1080,1160,'left:0;top:0');
  var g='';
  g+='<path d="M220 1160 C 230 930 330 860 540 860 C 750 860 850 930 860 1160 Z" fill="'+SHIRT+'" '+IKs+'/>';
  g+='<rect x="480" y="700" width="120" height="190" rx="40" fill="'+SKIN+'" '+IKs+'/>';
  if(withScarf)g+='<path d="M380 860 C 450 930 630 930 700 860 L 720 920 C 640 990 440 990 360 920 Z" fill="#FF6FB5" '+IKs+'/><path d="M600 930 L 640 1080 L 580 1080 L 560 950 Z" fill="#FF6FB5" '+IKs+'/>';
  g+='<g id="head"><circle cx="365" cy="470" r="40" fill="'+SKIN+'" '+IKs+'/><circle cx="715" cy="470" r="40" fill="'+SKIN+'" '+IKs+'/>';
  g+='<ellipse cx="540" cy="450" rx="180" ry="205" fill="'+SKIN+'" '+IKs+'/>';
  g+='<path d="M360 430 C 340 260 460 200 560 210 C 690 220 750 320 720 440 C 680 360 600 330 520 340 C 470 345 420 380 360 430 Z" fill="'+HAIR+'" '+IKs+'/>';
  g+='<g id="eyes"><ellipse cx="475" cy="470" rx="16" ry="22" fill="#1a1a1a"/><ellipse cx="605" cy="470" rx="16" ry="22" fill="#1a1a1a"/><circle cx="481" cy="462" r="5" fill="#fff"/><circle cx="611" cy="462" r="5" fill="#fff"/></g>';
  g+='<circle cx="440" cy="540" r="24" fill="#FF9AA8" opacity=".7"/><circle cx="640" cy="540" r="24" fill="#FF9AA8" opacity=".7"/>';
  g+='<path id="mouth" d="M495 560 C 515 595 565 595 585 560" fill="none" '+IKs+'/></g>';
  // antebrazos levantados mostrando las muñecas
  g+='<g id="armL"><path d="M250 1160 L 290 900" stroke="#1a1a1a" stroke-width="118" stroke-linecap="round"/><path d="M250 1160 L 290 900" stroke="'+SKIN+'" stroke-width="104" stroke-linecap="round"/><circle cx="296" cy="840" r="66" fill="'+SKIN+'" '+IKs+'/></g>';
  g+='<g id="armR"><path d="M830 1160 L 790 900" stroke="#1a1a1a" stroke-width="118" stroke-linecap="round"/><path d="M830 1160 L 790 900" stroke="'+SKIN+'" stroke-width="104" stroke-linecap="round"/><circle cx="784" cy="840" r="66" fill="'+SKIN+'" '+IKs+'/></g>';
  s.innerHTML=g;
  return {w:w,s:s,eyes:s.querySelector('#eyes'),head:s.querySelector('#head')};
}
var L2=layer();
var CH=character(L2,false);
var PULSE=[[492,760,'cuello'],[588,760,''],[338,470,'orejas'],[742,470,''],[292,930,'muñecas'],[788,930,'']];
var pulses=PULSE.map(function(p){return el('div','abs','<div style="width:70px;height:70px;border-radius:50%;background:rgba(255,40,80,.85);border:5px solid #fff;box-shadow:0 0 0 6px rgba(255,40,80,.35)"></div>',L2,'left:'+(p[0]-35)+'px;top:'+(p[1]-35)+'px')});
var plabs=PULSE.map(function(p){return p[2]?el('div','abs',p[2],L2,'left:'+(p[0]+(p[0]<540?-250:40))+'px;top:'+(p[1]-30)+'px;font-family:DM Sans;font-weight:700;font-size:34px;background:#fff;border:5px solid #1a1a1a;border-radius:16px;padding:2px 16px'):null;});
var heart=el('div','abs','💓',L2,'left:880px;top:120px;font-size:110px');
var sb2=el('div','abs','',L2,'left:0;top:0');var SB2=sprayBottle(sb2);var M2=mist(L2,14);
var heat=[0,1,2].map(function(i){return el('div','abs','<svg width="60" height="160"><path d="M30 150 C 0 120 60 90 30 60 C 0 30 60 10 30 0" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/></svg>',L2,'left:'+(420+i*90)+'px;top:560px')});
var thermo=el('div','abs','🌡️',L2,'left:90px;top:120px;font-size:110px');
var aroma=[0,1,2,3,4].map(function(i){return el('div','abs',['🌸','✨','🍋','✨','🌸'][i],L2,'left:0;top:0;font-size:64px')});

// ═════════ T3 · NUNCA FROTES ═════════
var L3=layer();
var armA=forearm(L3,-60,420,420,0,false), armB=forearm(L3,600,420,420,0,true);
var mol3=[];for(var i=0;i<8;i++){mol3.push(el('div','abs','',L3,'left:0;top:0;width:44px;height:44px;border-radius:50%;border:5px solid #1a1a1a;background:'+['#FFD23F','#FF6FB5','#7ED957','#FF8A3D'][i%4]));}
var frag=[];for(var i=0;i<16;i++){frag.push(el('div','abs','',L3,'left:0;top:0;width:16px;height:16px;border-radius:3px;background:'+['#FFD23F','#FF6FB5','#7ED957','#FF8A3D'][i%4]+';border:3px solid #1a1a1a'));}
var crack=el('div','abs','💥',L3,'left:470px;top:380px;font-size:140px');
var st3=stamp(L3,'❌ NO FROTES',150,800);
var ok3=el('div','abs','<div style="background:#fff;border:6px solid #1a1a1a;border-radius:24px;padding:10px 26px;font-family:Baloo 2;font-weight:800;font-size:56px;box-shadow:8px 8px 0 #1a1a1a">✅ dejá que se seque solo</div>',L3,'left:150px;top:820px');

// ═════════ T4 · 15 CM ═════════
var L4=layer();
var armV=mkSvg(L4,300,700,'left:760px;top:180px');armV.innerHTML='<rect x="80" y="60" width="140" height="640" rx="70" fill="'+SKIN+'" '+IKs+'/><circle cx="150" cy="80" r="86" fill="'+SKIN+'" '+IKs+'/><circle cx="150" cy="420" r="34" fill="rgba(255,40,80,.85)" stroke="#fff" stroke-width="5"/>';
var sb4=el('div','abs','',L4,'left:0;top:0');var SB4=sprayBottle(sb4);var M4=mist(L4,18);
var tape=el('div','abs','<div style="position:relative;height:90px;background:#FFD23F;border:6px solid #1a1a1a;border-radius:12px;overflow:hidden;background-image:repeating-linear-gradient(90deg,#1a1a1a 0 4px,transparent 4px 34px)"></div>',L4,'left:330px;top:780px;width:0px');
var tapeLbl=el('div','abs','15 cm',L4,'left:420px;top:880px;font-family:Baloo 2;font-weight:800;font-size:110px;color:#fff;text-shadow:6px 6px 0 #1a1a1a');
var mini=[['muy cerca','❌','🫗'],['muy lejos','❌','💨'],['15 cm','✅','👌']].map(function(m,i){return el('div','abs','<div style="font-size:70px">'+m[2]+'</div><div style="font-family:DM Sans;font-weight:700;font-size:30px">'+m[0]+' '+m[1]+'</div>',L4,'left:'+(80+i*320)+'px;top:1010px;width:280px;text-align:center;background:#fff;border:6px solid #1a1a1a;border-radius:26px;padding:10px 0;box-shadow:8px 8px 0 #1a1a1a')});

// ═════════ T5 · ROPA Y PELO ═════════
var L5=layer();
var CH5=character(L5,true);
var sb5=el('div','abs','',L5,'left:0;top:0');var SB5=sprayBottle(sb5);var M5=mist(L5,14);
var spark5=[];for(var i=0;i<10;i++)spark5.push(el('div','abs','✨',L5,'left:0;top:0;font-size:48px'));
var clock5=el('div','abs','<div style="width:180px;height:180px;border-radius:50%;background:#fff;border:8px solid #1a1a1a;position:relative;box-shadow:8px 8px 0 #1a1a1a"><i id="ch5" style="position:absolute;left:84px;top:22px;width:12px;height:70px;background:#1a1a1a;border-radius:6px;transform-origin:6px 68px"></i><i id="cm5" style="position:absolute;left:85px;top:40px;width:10px;height:52px;background:#E5322B;border-radius:5px;transform-origin:5px 50px"></i></div><div style="font-family:Baloo 2;font-weight:800;font-size:54px;color:#fff;text-shadow:4px 4px 0 #1a1a1a;text-align:center;margin-top:6px">+ horas</div>',L5,'left:830px;top:40px');

// cierre
var END=el('div','abs','',document.body,'inset:0;z-index:30;visibility:hidden');
END.innerHTML='<div class="abs" id="endBg" style="inset:0;background:#F4B63A"></div><div class="abs" style="inset:0;background-image:radial-gradient(rgba(26,26,26,.10) 2.2px,transparent 2.6px);background-size:44px 44px"></div>'+
 '<div class="abs" id="endA" style="left:64px;top:330px;font-family:DM Sans;font-weight:700;font-size:42px;color:#1a1a1a;letter-spacing:.04em">¿QUERÉS UN PERFUME QUE TE DURE TODO EL DÍA?</div>'+
 '<div class="abs" id="endB" style="left:64px;top:430px;font-family:Baloo 2;font-weight:800;font-size:150px;line-height:.9;color:#1a1a1a">Escribinos</div>'+
 '<div class="abs" id="endC" style="left:64px;top:580px;font-family:Baloo 2;font-weight:800;font-size:270px;line-height:.85;color:#F4B63A;background:#1a1a1a;padding:30px 50px 0;border-radius:40px;transform-origin:0 50%">BELLE</div>'+
 '<div class="abs" id="endD" style="left:64px;top:940px;font-family:DM Sans;font-weight:700;font-size:44px;color:#1a1a1a">por mensaje directo 💬</div>';
var endCh=el('div','abs','',END,'left:0;top:0;width:1080px;height:1920px');var ECH=character(endCh,false);ECH.w.style.transform='translate(420px,1040px) scale(.5)';ECH.w.style.transformOrigin='0 0';
