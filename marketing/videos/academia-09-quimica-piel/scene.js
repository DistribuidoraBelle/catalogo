// ═══════════ ACADEMIA 09 · LA QUÍMICA DE LA PIEL ═══════════
var C=window.CUES;
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var REST={hL:[60,610],hR:[436,410]};
function ch(G,x,y,sc,t,ex){ex=ex||{};var st={hL:ex.hL||REST.hL,hR:ex.hR||REST.hR,ang:ex.ang==null?6:ex.ang,bob:Math.sin(t*2+(G==='h'?1:0))*5,blink:((t+(G==='h'?1.3:0))%3.4)<0.12,dizzy:ex.dizzy,back:false,prop:ex.prop};
  var s='<g transform="translate('+x+','+y+') scale('+sc+') translate(0,-120)">'+(ex.flip?'<g transform="translate(500,0) scale(-1,1)">':'<g>')+pera2(G,G==='m'?MO:HO,G==='m'?GV:GT,st);
  if(ex.wink)s+='<ellipse cx="282" cy="'+(272+st.bob)+'" rx="19" ry="23" fill="'+(G==='m'?MO.skin:HO.skin)+'"/><path d="M266 '+(276+st.bob)+' C 274 '+(266+st.bob)+' 290 '+(266+st.bob)+' 298 '+(276+st.bob)+'" fill="none" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';
  if(ex.meh)s+='<rect x="220" y="'+(314+st.bob)+'" width="60" height="22" fill="'+(G==='m'?MO.skin:HO.skin)+'"/><path d="M228 '+(326+st.bob)+' L 272 '+(326+st.bob)+'" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';
  if(ex.hearts){for(var i=0;i<4;i++){var ph=((t*0.8+i/4)%1);s+='<text x="'+(170+i*55)+'" y="'+(150-ph*90+st.bob)+'" font-size="50" opacity="'+(1-ph)+'" text-anchor="middle">'+(['😍','❤️','✨','💕'][i])+'</text>';}}
  if(ex.cloud){for(var i=0;i<5;i++){var ph=((t*0.5+i/5)%1);s+='<circle cx="'+(200+i*30+Math.sin(t+i)*10)+'" cy="'+(120-ph*60)+'" r="'+(30+ph*20)+'" fill="#9AA3AD" opacity="'+(0.7*(1-ph))+'"/>';}}
  return s+'</g></g>';}
function chip(txt,x,y,k,col,fs,rot){fs=fs||40;var w=txt.length*fs*0.56+64;return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+back(cl(k))+')"><rect x="'+(-w/2+6)+'" y="'+(-fs*0.95+7)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="rgba(0,0,0,.25)"/><rect x="'+(-w/2)+'" y="'+(-fs*0.95)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="6"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
function title(txt,y,k,col,fs){fs=fs||110;return '<text x="540" y="'+y+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="'+(fs*0.14)+'" paint-order="stroke" transform="translate(540,'+y+') scale('+back(cl(k))+') translate(-540,'+(-y)+')" opacity="'+cl(k*3)+'">'+txt+'</text>';}
function burstTxt(txt,x,y,k,col,fs){if(k<=0)return '';fs=fs||64;var b=back(cl(k));var s='<g transform="translate('+x+','+y+') rotate(-8) scale('+b+')"><path d="';for(var i=0;i<16;i++){var a=i*Math.PI/8,r=i%2?110:150;s+=(i?'L':'M')+(Math.cos(a)*r*1.7)+' '+(Math.sin(a)*r*0.8)+' ';}return s+'Z" fill="'+(col||'#FFD23F')+'" stroke="#1a1a1a" stroke-width="7"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
var MCOL=['#FF4F8B','#3DB8F5','#FFD23F','#22C3B0','#8E6CF5','#FF8A3D'];
function mol(x,y,s,i,rot){var c=MCOL[i%MCOL.length],c2=MCOL[(i+2)%MCOL.length];var t_=i%3;var o='<g transform="translate('+x+','+y+') rotate('+rot+') scale('+s+')">';
  if(t_===0){o+='<path d="M-40 0 L 40 0" stroke="#1a1a1a" stroke-width="9"/><circle cx="-40" cy="0" r="24" fill="'+c+'" stroke="#1a1a1a" stroke-width="5"/><circle cx="40" cy="0" r="24" fill="'+c2+'" stroke="#1a1a1a" stroke-width="5"/><circle cx="0" cy="-34" r="14" fill="#fff" stroke="#1a1a1a" stroke-width="4"/><path d="M0 -20 L 0 0" stroke="#1a1a1a" stroke-width="6"/>';}
  else if(t_===1){var p='';for(var k=0;k<6;k++){var a=k*Math.PI/3;p+=(k?'L':'M')+(Math.cos(a)*34)+' '+(Math.sin(a)*34)+' ';}o+='<path d="'+p+'Z" fill="none" stroke="#1a1a1a" stroke-width="8"/>';for(var k=0;k<6;k++){var a=k*Math.PI/3;o+='<circle cx="'+(Math.cos(a)*34)+'" cy="'+(Math.sin(a)*34)+'" r="12" fill="'+(k%2?c:c2)+'" stroke="#1a1a1a" stroke-width="4"/>';}}
  else{o+='<path d="M-36 20 L 0 -20 L 36 20" fill="none" stroke="#1a1a1a" stroke-width="9"/><circle cx="0" cy="-20" r="26" fill="'+c+'" stroke="#1a1a1a" stroke-width="5"/><circle cx="-36" cy="20" r="17" fill="#fff" stroke="#1a1a1a" stroke-width="4"/><circle cx="36" cy="20" r="17" fill="#fff" stroke="#1a1a1a" stroke-width="4"/>';}
  o+='<circle cx="-8" cy="-8" r="5" fill="#fff" opacity=".6"/></g>';return o;}
function flask(x,y,s,liq,t,bub){var o='<g transform="translate('+x+','+y+') scale('+s+')"><path d="M-36 -170 L 36 -170 L 36 -60 L 130 100 C 146 128 128 150 100 150 L -100 150 C -128 150 -146 128 -130 100 L -36 -60 Z" fill="#EAF6FF" stroke="#1a1a1a" stroke-width="9" stroke-linejoin="round"/><path d="M-80 40 L 80 40 L 124 112 C 132 130 120 140 100 140 L -100 140 C -120 140 -132 130 -124 112 Z" fill="'+liq+'"/><rect x="-46" y="-190" width="92" height="26" rx="8" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><path d="M-70 60 C -66 50 -58 44 -50 42" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>';
  if(bub)for(var i=0;i<7;i++){var ph=((t*1.1+i/7)%1);o+='<circle cx="'+(-60+hsh(i)*120)+'" cy="'+(130-ph*300)+'" r="'+(8+ph*10)+'" fill="'+liq+'" stroke="#1a1a1a" stroke-width="3" opacity="'+(1-ph)+'"/>';}
  return o+'</g>';}
function tube(x,y,s,liq,lab){return '<g transform="translate('+x+','+y+') scale('+s+')"><path d="M-34 -180 L 34 -180 L 34 120 C 34 160 -34 160 -34 120 Z" fill="#EAF6FF" stroke="#1a1a1a" stroke-width="8"/><path d="M-30 0 L 30 0 L 30 120 C 30 152 -30 152 -30 120 Z" fill="'+liq+'"/><rect x="-44" y="-196" width="88" height="22" rx="8" fill="#fff" stroke="#1a1a1a" stroke-width="6"/>'+(lab?'<text y="230" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40" fill="#fff" stroke="#1a1a1a" stroke-width="8" paint-order="stroke">'+lab+'</text>':'')+'</g>';}
function bacteria(x,y,s,i,t,eat){var c=['#7BC043','#B49BF2','#FF8FBF','#5FD0C0'][i%4];var w=Math.sin(t*6+i);var o='<g transform="translate('+x+','+y+') rotate('+(Math.sin(t*2+i)*15)+') scale('+s+')">';
  o+='<path d="M-60 0 C -80 '+(10*w)+' -96 '+(-10*w)+' -116 '+(6*w)+'" fill="none" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/><rect x="-62" y="-34" width="124" height="68" rx="34" fill="'+c+'" stroke="#1a1a1a" stroke-width="6"/>';
  o+='<circle cx="18" cy="-8" r="9" fill="#fff" stroke="#1a1a1a" stroke-width="3"/><circle cx="40" cy="-8" r="9" fill="#fff" stroke="#1a1a1a" stroke-width="3"/><circle cx="20" cy="-7" r="4" fill="#1a1a1a"/><circle cx="42" cy="-7" r="4" fill="#1a1a1a"/>';
  o+=eat?'<ellipse cx="30" cy="16" rx="12" ry="'+(6+6*Math.abs(Math.sin(t*12)))+'" fill="#7A2633" stroke="#1a1a1a" stroke-width="3"/>':'<path d="M20 14 C 26 22 36 22 42 14" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>';
  return o+'</g>';}
function hookSubs(t){var fr=t<C.h2-0.05?0:(t<C.h3-0.05?1:2);var t0=[0,C.h2,C.h3][fr]-0.05,t1=[C.h2,C.h3,C.lab][fr];
  var W=[];SUBS.forEach(function(L_){L_.w.forEach(function(w){if(w.t>=t0-0.05&&w.t<t1-0.05)W.push(w);});});if(!W.length)return '';
  var lines=[],ln=[],len=0;W.forEach(function(w){if(len+w.s.length>12&&ln.length){lines.push(ln);ln=[];len=0;}ln.push(w);len+=w.s.length+1;});if(ln.length)lines.push(ln);
  var PAL2=['#FF4F8B','#3DB8F5','#F0A21A','#22C3B0','#8E6CF5','#FF5A4E'];var STY=[{lab:'#fff',txt:null},{lab:'#FF4F8B',txt:'#fff'},{lab:'#1a1a1a',txt:'#7CF5D0'}][fr];
  var fs=112,lh=fs*1.16,y0=430-(lines.length-1)*lh/2+(lines.length>2?60:0),s='';var pk=cl((t-t0)/0.1);var pop=pk<1?(0.6+0.55*pk):1;
  lines.forEach(function(L_,li){var y=y0+li*lh;var lk=cl((t-L_[0].t+0.04)/0.1);if(lk<=0)return;var lp=lk<1?(0.6+0.55*lk):1;var rot=[[-3,2.5,-2],[2.5,-3,2],[-2,3,-2.5]][fr][li%3];var tr='translate(540,'+y+') rotate('+rot+') scale('+(pop*lp)+') translate(-540,'+(-y)+')';
    var nch=L_.map(function(w){return w.s;}).join(' ').length,bw=nch*fs*0.56+70;
    s+='<g transform="'+tr+'"><rect x="'+(540-bw/2+10)+'" y="'+(y-fs*0.82+12)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="rgba(0,0,0,.3)"/><rect x="'+(540-bw/2)+'" y="'+(y-fs*0.82)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="'+STY.lab+'" stroke="#1a1a1a" stroke-width="8"/></g>';
    var o='<text x="540" y="'+y+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" transform="'+tr+'">';
    L_.forEach(function(w,j){var on=t>=w.t-0.02;var col=STY.txt||PAL2[(li*3+j)%PAL2.length];o+='<tspan fill="'+col+'" fill-opacity="'+(on?1:0)+'">'+(j?' ':'')+w.s.toUpperCase()+'</tspan>';});s+=o+'</text>';});
  return s;}
function render(t){
  var out='',bg='#22C3B0';var ent=function(t0){return eio(cl((t-t0)/0.5));};
  // burbujas de laboratorio de fondo
  for(var i=0;i<18;i++){var ph=((t*0.06+hsh(i))%1);out+='<circle cx="'+(hsh(i*3)*1080+Math.sin(t+i)*20)+'" cy="'+(1980-ph*2100)+'" r="'+(8+hsh(i*7)*22)+'" fill="#fff" opacity="'+(0.12+0.12*Math.sin(ph*Math.PI))+'"/>';}
  // ── GANCHO
  if(t<C.lab){bg='#22C3B0';
    if(t<C.h4){var spray=t>0.3&&t<1.4;out+=ch('m',10,1120,1.05,t,{hR:spray?[420,300]:REST.hR,ang:spray?-25:6,hearts:t>0.9,wink:t>1.6});
      if(t>=C.h2){var ks=ent(C.h2);var spray2=t>C.h2+0.2&&t<C.h2+1.3;out+='<g opacity="'+ks+'">'+ch('h',540,1120,1.05,t,{hR:spray2?[420,300]:REST.hR,ang:spray2?-25:6,meh:t>C.h2+1.0,cloud:t>C.h2+1.0})+'</g>';
        out+=chip('🧴 = 🧴 MISMO PERFUME',540,1620,(t-C.h2-1.4)/0.35,'#fff',42);}}
    else{var k=t-C.h4;out+=flask(540,1180,1.6*back(cl(k/0.4)),'#FF4F8B',t,true);for(var i=0;i<14;i++){var a=i*0.45;var r=cl(k/0.8)*480;out+=mol(540+Math.cos(a)*r,1050+Math.sin(a)*r*0.8,0.9,i,t*90+i*30);}out+=burstTxt('¡QUÍMICA! ⚗️',540,1640,(k-0.2)/0.35,'#FFD23F',62);}
    out+=hookSubs(t);
  }
  // ── LA PIEL ES UN LABORATORIO
  if(t>=C.lab&&t<C.ph){bg='#3DB8F5';
    out+='<path d="M0 1450 C 200 1420 380 1480 540 1450 C 700 1420 880 1480 1080 1450 L 1080 1920 L 0 1920 Z" fill="#F2C29A" stroke="#1a1a1a" stroke-width="8"/>';for(var i=0;i<12;i++)out+='<circle cx="'+(60+i*90)+'" cy="'+(1500+(i%3)*30)+'" r="4" fill="#C98A5E"/>';
    out+=title('TU PIEL 🔬',330,(t-C.lab)/0.4,'#fff',110);
    if(t<C.lab2){for(var i=0;i<8;i++){var ph=((t-C.lab)*0.8+i/8)%1;out+='<path d="M'+(160+i*110)+' '+(500+ph*900)+' c 12 16 12 28 0 30 c -12 -2 -12 -14 0 -30 Z" fill="#B49BF2" stroke="#1a1a1a" stroke-width="4"/>';}}
    else if(t<C.lab4){var k=ent(C.lab2);var cx=540,cy=980,R=360*back(cl((t-C.lab2)/0.5));
      out+='<clipPath id="lupa"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/></clipPath><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#FFE4D0"/><g clip-path="url(#lupa)">';
      var P=[];for(var i=0;i<14;i++){var px=cx+Math.sin(t*(0.7+hsh(i))+i*2)*R*0.7,py=cy+Math.cos(t*(0.6+hsh(i*3))+i*1.3)*R*0.7;P.push([px,py]);}
      for(var i=0;i<P.length;i++)for(var j=i+1;j<P.length;j++){var d=Math.hypot(P[i][0]-P[j][0],P[i][1]-P[j][1]);if(d<170)out+='<path d="M'+P[i][0]+' '+P[i][1]+' L '+P[j][0]+' '+P[j][1]+'" stroke="#1a1a1a" stroke-width="4" stroke-dasharray="8 8" opacity="'+(1-d/170)+'"/>';}
      P.forEach(function(p,i){out+=mol(p[0],p[1],0.85,i,t*60+i*40);});out+='</g>';
      out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="#1a1a1a" stroke-width="22"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(R-14)+'" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/><path d="M'+(cx+R*0.72)+' '+(cy+R*0.72)+' L '+(cx+R*1.05)+' '+(cy+R*1.05)+'" stroke="#1a1a1a" stroke-width="56" stroke-linecap="round"/><path d="M'+(cx+R*0.72)+' '+(cy+R*0.72)+' L '+(cx+R*1.05)+' '+(cy+R*1.05)+'" stroke="#8E6CF5" stroke-width="36" stroke-linecap="round"/>';
      out+=chip('⚡ ¡REACCIONA!',540,560,(t-C.lab2)/0.35,'#FFD23F',48);
      if(t>=C.lab3){out+=chip('🧪 TU PIEL = LABORATORIO',540,1390,(t-C.lab3)/0.35,'#fff',44);}}
    else{var k=t-C.lab4;out+=tube(320,1050,1.5,'#FF8FBF','PIEL A')+tube(760,1050,1.5,'#7BC043','PIEL B');
      var kd=cl(k/0.8);[[320,'#FF8FBF'],[760,'#7BC043']].forEach(function(p,i){out+='<path d="M'+p[0]+' '+L(620,880,kd)+' c 14 18 14 32 0 34 c -14 -2 -14 -16 0 -34 Z" fill="#B49BF2" stroke="#1a1a1a" stroke-width="4" opacity="'+(1-kd)+'"/>';});
      out+=chip('MISMO PERFUME 🧴',540,560,(k)/0.35,'#fff',44);out+=burstTxt('¡OTRO RESULTADO!',540,1400,(k-1)/0.35,'#FFD23F',50);}
  }
  // ── 1. pH
  if(t>=C.ph&&t<C.gr){bg='#8E6CF5';
    out+=title('1️⃣ EL pH',330,(t-C.ph)/0.4,'#FFD23F',130);
    var sx=110,sw=860,sy=700;var cols=['#E5322B','#F05A2B','#F5822B','#F9A825','#FDD835','#C0CA33','#7CB342','#43A047','#26A69A','#26C6DA','#29B6F6','#5C6BC0','#7E57C2','#8E24AA'];
    if(t<C.ph4){var ks=ent(C.ph+0.4);out+='<g opacity="'+ks+'">';cols.forEach(function(c,i){out+='<rect x="'+(sx+i*sw/14)+'" y="'+sy+'" width="'+(sw/14)+'" height="110" fill="'+c+'" stroke="#1a1a1a" stroke-width="3"/><text x="'+(sx+(i+0.5)*sw/14)+'" y="'+(sy+150)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="30" fill="#fff">'+(i+1)+'</text>';});
      out+='<rect x="'+sx+'" y="'+sy+'" width="'+sw+'" height="110" fill="none" stroke="#1a1a1a" stroke-width="8"/><text x="'+sx+'" y="'+(sy-20)+'" font-family="Baloo 2" font-weight="800" font-size="36" fill="#fff">ÁCIDO 🍋</text><text x="'+(sx+sw)+'" y="'+(sy-20)+'" text-anchor="end" font-family="Baloo 2" font-weight="800" font-size="36" fill="#fff">ALCALINO 🧼</text>';
      var zk=cl((t-C.ph2)/0.5);out+='<rect x="'+(sx+3.5*sw/14)+'" y="'+(sy-10)+'" width="'+(2*sw/14)+'" height="130" rx="10" fill="none" stroke="#fff" stroke-width="'+(10*zk)+'"/>'+(zk>0?'<text x="'+(sx+4.5*sw/14)+'" y="'+(sy+210)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40" fill="#FFD23F" stroke="#1a1a1a" stroke-width="7" paint-order="stroke">TU PIEL ≈ 4,5–6</text>':'')+'</g>';
      if(t>=C.ph3){[['😊',4.6,'#FFB6D9'],['🙂',5.3,'#F2C29A'],['😎',5.9,'#C99A6A']].forEach(function(p,i){var k=cl((t-C.ph3-i*0.3)/0.4);if(k<=0)return;var x=230+i*310,y=1250;var nx=sx+(p[1]-0.5)*sw/14;
        out+='<path d="M'+x+' '+(y-100)+' L '+nx+' '+(sy+120)+'" stroke="#fff" stroke-width="4" stroke-dasharray="8 8" opacity="'+k+'"/><g transform="translate('+x+','+y+') scale('+back(k)+')"><circle r="100" fill="'+p[2]+'" stroke="#1a1a1a" stroke-width="7"/><text y="34" text-anchor="middle" font-size="100">'+p[0]+'</text><rect x="-70" y="110" width="140" height="56" rx="28" fill="#fff" stroke="#1a1a1a" stroke-width="5"/><text y="150" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="38">pH '+String(p[1]).replace('.',',')+'</text></g>';});}}
    else{var R=[['🍬','MÁS DULCE','#FF8FBF',C.ph4+0.3],['🍋','MÁS ÁCIDO','#FDD835',C.ph4+1.8],['☁️','MÁS APAGADO','#B0BAC4',C.ph5]];
      R.forEach(function(r,i){var x=200+i*340,k=cl((t-r[3])/0.5);out+=flask(x,1050,0.95,k>0?r[2]:'#EAF6FF',t,k>0);if(k>0){out+='<text x="'+x+'" y="830" text-anchor="middle" font-size="'+(90*back(k))+'">'+r[0]+'</text>';out+=chip(r[1],x,1290,k,r[2],34);}
        var kd=cl((t-r[3]+0.5)/0.5);if(kd>0&&kd<1)out+='<path d="M'+x+' '+L(560,900,kd)+' c 14 18 14 32 0 34 c -14 -2 -14 -16 0 -34 Z" fill="#B49BF2" stroke="#1a1a1a" stroke-width="4"/>';});
      out+=chip('🧴 EL MISMO PERFUME…',540,600,(t-C.ph4)/0.35,'#fff',44);}
  }
  // ── 2. piel grasa vs seca
  if(t>=C.gr&&t<C.te){bg='#FF8A3D';
    out+=title('2️⃣ GRASA VS SECA',330,(t-C.gr)/0.4,'#fff',100);
    var kL=ent(C.gr+0.3),kR=ent(C.gr+0.5);
    out+='<g opacity="'+kL+'"><rect x="40" y="480" width="480" height="1000" rx="40" fill="#FFF4CC" stroke="#1a1a1a" stroke-width="8"/><text x="280" y="560" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="56">💧 GRASA</text></g>';
    out+='<g opacity="'+kR+'"><rect x="560" y="480" width="480" height="1000" rx="40" fill="#F5E1C8" stroke="#1a1a1a" stroke-width="8"/><text x="800" y="560" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="56">🏜️ SECA</text></g>';
    for(var i=0;i<5;i++){var x=100+i*90,y=1300+(i%2)*40;out+='<ellipse cx="'+x+'" cy="'+y+'" rx="40" ry="26" fill="#FFD27A" stroke="#1a1a1a" stroke-width="5" opacity="'+kL+'"/><ellipse cx="'+(x-12)+'" cy="'+(y-8)+'" rx="10" ry="5" fill="#fff" opacity="'+(0.8*kL)+'"/>';}
    for(var i=0;i<4;i++){var x=600+i*110;out+='<path d="M'+x+' 1320 l 20 -14 l 16 18 l 22 -12 l 14 16" fill="none" stroke="#A0522D" stroke-width="5" opacity="'+kR+'"/>';}
    if(t>=C.gr2){for(var i=0;i<6;i++){var x=100+(i%5)*90,y=1260+(i%2)*40-20;out+=mol(x+Math.sin(t*3+i)*6,y+Math.cos(t*3+i)*4,0.6,i,Math.sin(t*2+i)*20);}
      out+=chip('🧲 ATRAPA · DURA MÁS ⏳',280,900,(t-C.gr2)/0.35,'#fff',30);for(var i=0;i<4;i++)out+='<path d="M'+(160+i*80)+' 1180 q 10 -30 0 -60" stroke="#F0A21A" stroke-width="5" fill="none" stroke-dasharray="6 6"/>';}
    if(t>=C.gr3){for(var i=0;i<8;i++){var ph=((t-C.gr3)*1.2+i/8)%1;out+=mol(640+hsh(i)*320+ph*80*(i%2?1:-1),1260-ph*700,0.6,i+2,t*200+i*40);}
      out+=chip('💨 SE ESCAPA RÁPIDO',800,900,(t-C.gr3)/0.35,'#fff',32);}
  }
  // ── 3. temperatura
  if(t>=C.te&&t<C.co){bg='#FF5A4E';
    out+=title('3️⃣ TEMPERATURA',330,(t-C.te)/0.4,'#fff',104);
    var kt=cl((t-C.te2)/1.2);var lv=L(0.2,0.95,kt);out+='<g transform="translate(200,1000)"><rect x="-50" y="-380" width="100" height="660" rx="50" fill="#fff" stroke="#1a1a1a" stroke-width="9"/><rect x="-26" y="'+(240-560*lv)+'" width="52" height="'+(560*lv)+'" rx="26" fill="'+(kt<0.5?'#3DB8F5':'#E5322B')+'"/><circle cy="300" r="80" fill="'+(kt<0.5?'#3DB8F5':'#E5322B')+'" stroke="#1a1a1a" stroke-width="9"/><text x="110" y="'+(260-560*lv)+'" font-family="Baloo 2" font-weight="800" font-size="70" fill="#fff" stroke="#1a1a1a" stroke-width="10" paint-order="stroke">'+Math.round(L(30,37.5,kt))+'°</text></g>';
    var cx=680,cy=1050;var sp=L(0.5,2.4,kt);out+='<circle cx="'+cx+'" cy="'+cy+'" r="180" fill="#F2C29A" stroke="#1a1a1a" stroke-width="8"/><text x="'+cx+'" y="'+(cy+34)+'" text-anchor="middle" font-size="110">'+(kt>0.5?'🥵':'🙂')+'</text>';
    for(var i=0;i<10;i++){var ph=((t*0.4*sp+i/10)%1);var a=i*0.628;var r=200+ph*(t>=C.te3?420:160);out+=mol(cx+Math.cos(a)*r,cy+Math.sin(a)*r*0.9,0.55,i,t*100*sp);}
    if(t>=C.te3){for(var i=0;i<3;i++){var ph=((t-C.te3)*0.8+i/3)%1;out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(200+ph*420)+'" fill="none" stroke="#fff" stroke-width="10" opacity="'+(1-ph)+'"/>';}
      out+=chip('🔥 SE EVAPORA MÁS RÁPIDO',540,560,(t-C.te3)/0.35,'#FFD23F',40);out+=chip('📡 PROYECTA MÁS',680,1560,(t-C.te3-1.2)/0.35,'#fff',44);}
  }
  // ── 4. lo que comés
  if(t>=C.co&&t<C.ba){bg='#22C3B0';
    out+=title('4️⃣ LO QUE COMÉS',330,(t-C.co)/0.4,'#fff',104);
    var ing=[['🌶️',C.co2],['🧄',C.co2+0.9],['🍷',C.co2+1.8],['🚬',C.co2+2.7]];var liq='#B49BF2';var nIn=0;ing.forEach(function(g){if(t>=g[1]+0.6)nIn++;});liq=['#B49BF2','#E57373','#E0C060','#9C4A6A','#8A8A8A'][nIn];
    out+=flask(540,1150,1.7,liq,t,true);
    ing.forEach(function(g,i){var k=cl((t-g[1])/0.6);if(k<=0)return;var sx=[200,420,660,880][i];var x=L(sx,540,k*k),y=L(620,1100,k*k);if(k<1)out+='<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="110">'+g[0]+'</text>';else out+='<text x="'+sx+'" y="680" text-anchor="middle" font-size="80" opacity=".5">'+g[0]+'</text>';
      if(k>=1&&t<g[1]+1)out+='<circle cx="540" cy="1150" r="'+(60+(t-g[1]-0.6)*300)+'" fill="none" stroke="#fff" stroke-width="8" opacity="'+(1-(t-g[1]-0.6)/0.4)+'"/>';});
    if(t>=C.co3&&t<C.co4)out+=chip('👃 CAMBIA TU OLOR NATURAL',540,1580,(t-C.co3)/0.35,'#fff',42);
    if(t>=C.co4){out+=burstTxt('⚡ HORMONAS',260,820,(t-C.co4-0.6)/0.35,'#FFD23F',44);out+=burstTxt('💊 REMEDIOS',820,820,(t-C.co4-1.6)/0.35,'#FF8FBF',44);}
  }
  // ── 5. bacterias
  if(t>=C.ba&&t<C.tip){bg='#7BC043';
    out+=title('5️⃣ TUS BACTERIAS',330,(t-C.ba)/0.4,'#fff',100);
    var cx=540,cy=1020,R=420;out+='<clipPath id="mic"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/></clipPath><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#F4FFE8"/><g clip-path="url(#mic)">';
    var n=t<C.ba2?3:Math.min(16,3+Math.floor((t-C.ba2)*8));
    var M=[];for(var i=0;i<7;i++)M.push([cx+Math.sin(t*0.5+i*2)*R*0.6,cy+Math.cos(t*0.45+i*1.6)*R*0.6]);
    var eating=t>=C.ba3;
    M.forEach(function(p,i){var gone=eating&&((t-C.ba3)>i*0.4+0.6);if(!gone)out+=mol(p[0],p[1],0.7,i,t*50+i*40);else out+='<text x="'+p[0]+'" y="'+p[1]+'" text-anchor="middle" font-size="48" opacity="'+cl(1-((t-C.ba3)-i*0.4-0.6)/1.2)+'">✨</text>';});
    for(var i=0;i<n;i++){var bx,by;if(eating&&i<7){var tg=M[i];bx=L(cx+Math.cos(i)*R*0.8,tg[0],cl((t-C.ba3)/(i*0.4+0.6)))-60;by=L(cy+Math.sin(i)*R*0.8,tg[1],cl((t-C.ba3)/(i*0.4+0.6)));}else{bx=cx+Math.sin(t*0.8+i*2.3)*R*0.75;by=cy+Math.cos(t*0.7+i*1.7)*R*0.75;}out+=bacteria(bx,by,0.8,i,t,eating&&i<7);}
    out+='</g><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="#1a1a1a" stroke-width="24"/>';
    if(t>=C.ba2){var cnt=Math.min(1000000,Math.floor(Math.pow(10,cl((t-C.ba2)/1.4)*6)));out+=chip('🦠 '+cnt.toLocaleString('es-AR')+'',540,560,(t-C.ba2)/0.35,'#fff',48);}
    if(eating)out+=burstTxt('¡ÑAM ÑAM!',800,1500,(t-C.ba3-0.4)/0.35,'#FFD23F',56);
  }
  // ── TIP BELLE
  if(t>=C.tip&&t<C.end){bg='#4CC38A';
    out+=title('💡 TIP BELLE',330,(t-C.tip)/0.4,'#fff',120);
    if(t<C.tip2){out+=ch('m',60,1080,0.9,t,{hearts:true})+ch('h',580,1080,0.9,t,{meh:true});
      var k=cl((t-C.tip-0.8)/0.35);out+='<g transform="translate(540,1000) rotate(-8) scale('+back(k)+')"><path d="M-300 -300 L 300 300 M300 -300 L -300 300" stroke="#1a1a1a" stroke-width="80" stroke-linecap="round"/><path d="M-300 -300 L 300 300 M300 -300 L -300 300" stroke="#E5322B" stroke-width="56" stroke-linecap="round"/></g>';
      out+=chip('❌ NO COMPRES POR CÓMO LE QUEDA A OTRO',540,600,(t-C.tip-1.2)/0.35,'#fff',32);}
    else if(t<C.cta){var spray=t<C.tip3;var ok=t>=C.tip4;out+=ch('h',300,1100,1.0,t,{hL:[150,420],hR:spray?[430,320]:REST.hR,ang:spray?-20:6,hearts:ok,wink:ok});
      if(spray)out+=chip('🖐️ EN TU PIEL',540,600,(t-C.tip2)/0.35,'#fff',46);
      if(t>=C.tip3){var a=(t-C.tip3)*4;var kc=cl((t-C.tip3)/0.35);out+='<g transform="translate(830,780) scale('+back(kc)+')"><circle r="110" fill="#fff" stroke="#1a1a1a" stroke-width="9"/>'+[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){return '<path d="M'+(Math.cos(i*0.5236)*86)+' '+(Math.sin(i*0.5236)*86)+' L '+(Math.cos(i*0.5236)*98)+' '+(Math.sin(i*0.5236)*98)+'" stroke="#1a1a1a" stroke-width="5"/>';}).join('')+'<path d="M0 0 L '+(Math.cos(a-1.57)*76)+' '+(Math.sin(a-1.57)*76)+'" stroke="#E5322B" stroke-width="9" stroke-linecap="round"/><text y="170" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="52" fill="#fff" stroke="#1a1a1a" stroke-width="9" paint-order="stroke">'+Math.min(30,Math.round((t-C.tip3)*18))+' MIN</text></g>';}
      if(ok)out+=chip('✅ ¡AHÍ DECIDÍ!',540,600,(t-C.tip4)/0.35,'#FFD23F',52);}
    else{out+=flask(540,1100,1.8,'#FF8FBF',t,true);for(var i=0;i<6;i++){var ph=((t*0.7+i/6)%1);out+='<text x="'+(420+i*48)+'" y="'+(820-ph*300)+'" font-size="60" opacity="'+(1-ph)+'">💕</text>';}out+=chip('🧪 EL QUE VA CON TU QUÍMICA',540,600,(t-C.cta)/0.35,'#fff',42);}
  }
  document.getElementById('bgc').style.background=bg;
  document.getElementById('sv').innerHTML=out;
  renderSubs2(t);
  var E=document.getElementById('end');var eOn=t>=C.end;E.style.display=eOn?'block':'none';
  if(eOn){var k=eio(cl((t-C.end)/0.4));E.style.opacity=k;['eA','eB','eC','eD'].forEach(function(id,i){var kk=cl((t-C.end-0.2-i*0.3)/0.4);document.getElementById(id).style.transform='translateY('+((1-eio(kk))*60)+'px) scale('+L(.85,1,cl(back(kk)))+')';document.getElementById(id).style.opacity=cl(kk*2.5);});}
  hkRender(t);
}
var subLine=-1;
function renderSubs2(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t>=C.end||t<C.lab){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(química|laboratorio|ph|ácida|dulce|ácido|apagado|grasa|seca|temperatura|calentita|comés|picantes|ajo|alcohol|cigarrillo|hormonas|bacterias|millones|piel|treinta|belle)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:;…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
