// ═══════════ ESPECIAL 01 · LO QUE HACÉS vs LO QUE FUNCIONA ═══════════
var C=window.CUES;
var REST={hL:[60,610],hR:[436,410],ang:6};
function ch(G,x,y,sc,t,ex){ex=ex||{};var st={hL:ex.hL||REST.hL,hR:ex.hR||REST.hR,ang:ex.ang==null?6:ex.ang,bob:ex.bob==null?Math.sin(t*2+(G==='h'?1:0))*5:ex.bob,blink:((t+(G==='h'?1.3:0))%3.4)<0.12,dizzy:ex.dizzy,back:false,prop:ex.prop};
  var s='<g transform="translate('+x+','+y+') scale('+sc+') translate(0,-120)">'+(ex.flip?'<g transform="translate(500,0) scale(-1,1)">':'<g>')+pera2(G,G==='m'?MO:HO,G==='m'?GV:GT,st);
  if(ex.wink){s+='<ellipse cx="282" cy="'+(272+st.bob)+'" rx="19" ry="23" fill="'+(G==='m'?MO.skin:HO.skin)+'"/><path d="M266 '+(276+st.bob)+' C 274 '+(266+st.bob)+' 290 '+(266+st.bob)+' 298 '+(276+st.bob)+'" fill="none" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';}
  if(ex.sad){s+='<path d="M228 '+(332+st.bob)+' C 240 '+(318+st.bob)+' 260 '+(318+st.bob)+' 272 '+(332+st.bob)+'" fill="none" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';}
  if(ex.q){s+='<g transform="translate(410,110)"><circle r="54" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><text y="24" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="70" fill="#FF5A4E">?</text></g>';}
  if(ex.hearts){for(var i=0;i<3;i++){var ph=((t*0.8+i/3)%1);s+='<text x="'+(200+i*50)+'" y="'+(150-ph*80+st.bob)+'" font-size="46" opacity="'+(1-ph)+'" text-anchor="middle">'+(i===1?'😍':'✨')+'</text>';}}
  s+='</g></g>';return s;}
// coordenadas de pantalla de un punto local del personaje
function sp(x,y,sc,lx,ly){return [x+lx*sc,y+(ly-120)*sc];}
function chip(txt,x,y,k,col,fs){fs=fs||34;var w=txt.length*fs*0.56+60;return '<g transform="translate('+x+','+y+') scale('+back(cl(k))+')"><rect x="'+(-w/2+5)+'" y="'+(-fs*0.95+6)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="rgba(0,0,0,.22)"/><rect x="'+(-w/2)+'" y="'+(-fs*0.95)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="5"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
// esfera de aroma
function orb(x,y,r,op){if(r<=0.5||op<=0.01)return '';return '<g opacity="'+op+'"><circle cx="'+x+'" cy="'+y+'" r="'+(r*1.9)+'" fill="url(#oglow)"/><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="url(#og)" stroke="#C98A12" stroke-width="'+Math.max(1.5,r*0.08)+'"/><ellipse cx="'+(x-r*0.32)+'" cy="'+(y-r*0.36)+'" rx="'+(r*0.3)+'" ry="'+(r*0.2)+'" fill="#fff" opacity=".85"/></g>';}
function pop(x,y,r,k){if(k<=0||k>=1)return '';var s='<g opacity="'+(1-k)+'">';for(var i=0;i<8;i++){var a=i*Math.PI/4;var r0=r*(0.6+k*1.2),r1=r*(1+k*1.9);s+='<path d="M'+(x+Math.cos(a)*r0)+' '+(y+Math.sin(a)*r0)+' L '+(x+Math.cos(a)*r1)+' '+(y+Math.sin(a)*r1)+'" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>';}
  return s+'<circle cx="'+x+'" cy="'+y+'" r="'+(r*(1+k))+'" fill="none" stroke="#FFD23F" stroke-width="5"/></g>';}
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function sparks(x,y,t,n,sp_){var s='';for(var i=0;i<n;i++){var ph=((t*1.3+i/n)%1);var a=hsh(i)*6.28;var r=ph*sp_;s+='<path d="M'+(x+Math.cos(a)*r)+' '+(y+Math.sin(a)*r)+' l '+(Math.cos(a)*14)+' '+(Math.sin(a)*14)+'" stroke="#FF8A00" stroke-width="5" stroke-linecap="round" opacity="'+(1-ph)+'"/>';}return s;}
function glints(x,y,t,n,spread){var s='';for(var i=0;i<n;i++){var ph=((t*0.6+i/n)%1);var a=i*2.4+t*0.4;var r=spread*(0.5+0.5*hsh(i+3));var sz=10+12*Math.sin(ph*Math.PI);s+='<path d="M'+(x+Math.cos(a)*r)+' '+(y+Math.sin(a)*r-sz)+' L '+(x+Math.cos(a)*r+sz*0.3)+' '+(y+Math.sin(a)*r)+' L '+(x+Math.cos(a)*r)+' '+(y+Math.sin(a)*r+sz)+' L '+(x+Math.cos(a)*r-sz*0.3)+' '+(y+Math.sin(a)*r)+' Z" fill="#fff" opacity="'+Math.sin(ph*Math.PI)+'"/>';}return s;}
function mistTo(x0,y0,x1,y1,k,t){var s='';for(var i=0;i<16;i++){var ph=((t*2.2+i/16)%1);if(k<=0)break;var q=ph;var px=L(x0,x1,q)+Math.sin(i*3+t*5)*16*q,py=L(y0,y1,q)+Math.cos(i*2+t*4)*16*q;s+='<circle cx="'+px+'" cy="'+py+'" r="'+(4+q*10)+'" fill="#fff" opacity="'+(0.7*(1-q)*k)+'"/>';}return s;}
// tarjetas partidas
var CL={x:30,w:500},CR={x:550,w:500},CY=330,CH=1210;
function cards(t,t0,tr){var s='';var kL=cl((t-t0)/0.35),kR=cl((t-t0-0.15)/0.35);var on=t>=tr;
  s+='<g transform="translate(0,'+((1-eio(kL))*60)+')" opacity="'+kL+'"><rect x="'+(CL.x+6)+'" y="'+(CY+8)+'" width="'+CL.w+'" height="'+CH+'" rx="40" fill="rgba(0,0,0,.2)"/><rect x="'+CL.x+'" y="'+CY+'" width="'+CL.w+'" height="'+CH+'" rx="40" fill="#FFE4E1" stroke="#1a1a1a" stroke-width="7"/></g>';
  s+='<g transform="translate(0,'+((1-eio(kR))*60)+')" opacity="'+kR+'"><rect x="'+(CR.x+6)+'" y="'+(CY+8)+'" width="'+CR.w+'" height="'+CH+'" rx="40" fill="rgba(0,0,0,.2)"/><rect x="'+CR.x+'" y="'+CY+'" width="'+CR.w+'" height="'+CH+'" rx="40" fill="'+(on?'#DDF7E6':'#E9ECEA')+'" stroke="#1a1a1a" stroke-width="7"/></g>';
  return s;}
function labels(t,t0,tr){var s='';
  s+=chip('❌ LO QUE HACÉS',CL.x+CL.w/2,CY,(t-t0-0.2)/0.35,'#FF7A6E',32);
  s+=chip('✅ LO QUE FUNCIONA',CR.x+CR.w/2,CY,(t-t0-0.35)/0.35,t>=tr?'#5BD68A':'#C9CFCB',32);
  if(t<tr){var k=cl((t-t0-0.4)/0.4);s+='<g opacity="'+k+'" transform="translate('+(CR.x+CR.w/2)+',930) scale('+(1+0.05*Math.sin(t*5))+')"><circle r="110" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><text y="52" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="160" fill="#C9CFCB">?</text></g>';}
  return s;}
function clipCards(){return '<clipPath id="cpL"><rect x="'+CL.x+'" y="'+CY+'" width="'+CL.w+'" height="'+CH+'" rx="40"/></clipPath><clipPath id="cpR"><rect x="'+CR.x+'" y="'+CY+'" width="'+CR.w+'" height="'+CH+'" rx="40"/></clipPath>';}
var DEFS='<defs><radialGradient id="og" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#FFF6CC"/><stop offset=".45" stop-color="#FFD23F"/><stop offset="1" stop-color="#F0A21A"/></radialGradient><radialGradient id="oglow"><stop offset="0" stop-color="#FFE27A" stop-opacity=".55"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>'+clipCards()+'</defs>';
var PARTS=[['r','👐','NO FROTES','#FF8A5B'],['s','🧴','CREMA PRIMERO','#3DB8F5'],['n','☁️','LA NUBE','#8E6CF5'],['b','🚿','EL BAÑO','#22C3B0'],['c','✨','USALO BIEN','#FF4F8B']];
function partAt(t){var p=null;PARTS.forEach(function(q){if(t>=C[q[0]])p=q;});if(t>=C.end)p=null;return p;}
var SC=1.08,FEET=1575;function cx0(card){return card.x+card.w/2-250*SC;}var CHY=FEET-570*SC;
function cream(){return '<g transform="translate(0,-40)"><rect x="-34" y="-30" width="68" height="60" rx="12" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><rect x="-38" y="-46" width="76" height="22" rx="8" fill="#9FD8FF" stroke="#1a1a1a" stroke-width="6"/><text y="14" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="22" fill="#3DB8F5">CREMA</text></g>';}
function render(t){
  var part=partAt(t),out=DEFS,bg=part?part[3]:'#F4B63A';document.getElementById('bgc').style.background=bg;
  if(part){var t0=C[part[0]],kh=cl((t-t0)/0.45);
    out+='<g transform="translate(130,170) scale('+back(kh)+')"><circle r="78" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><text y="30" text-anchor="middle" font-size="82">'+part[1]+'</text></g>';
    out+='<text x="'+(235+(1-eio(cl((t-t0-0.12)/0.4)))*400)+'" y="200" font-family="Baloo 2" font-weight="800" font-size="'+(part[2].length>11?84:96)+'" fill="#fff" stroke="#1a1a1a" stroke-width="13" paint-order="stroke" opacity="'+cl((t-t0-0.12)/0.2)+'">'+part[2]+'</text>';}
  var ent=function(t0){return eio(cl((t-t0)/0.5));};
  var xL=cx0(CL),xR=cx0(CR);
  // ── 1 · FROTAR
  if(t>=C.r&&t<C.s){out+=cards(t,C.r,C.r3);
    var rub=t>=C.r+1.0,o=rub?Math.sin(t*16)*26:0;
    var hL=rub?[205+o,520]:[150,420],hR=rub?[300-o,505]:[420,330];
    out+='<g clip-path="url(#cpL)">'+ch('h',xL,CHY,SC,t,{hL:hL,hR:hR,ang:rub?-70:-20,q:t>=C.r2+1.2,bob:rub?0:null});
    var w=sp(xL,CHY,SC,250,515);
    if(!rub){out+=mistTo(sp(xL,CHY,SC,420,280)[0],sp(xL,CHY,SC,420,280)[1],sp(xL,CHY,SC,150,420)[0],sp(xL,CHY,SC,150,420)[1],1,t);}
    for(var i=0;i<9;i++){var b=C.r+0.4+i*0.25,pt=C.r+1.4+i*0.32;var a=i*0.7+t*0.8,rr=70+hsh(i)*60;var px=w[0]+Math.cos(a)*rr,py=w[1]-60+Math.sin(a)*rr*0.7;
      if(t>=b&&t<pt)out+=orb(px,py,L(6,24,cl((t-b)/0.4)),1);else if(t>=pt)out+=pop(px,py,24,(t-pt)/0.45);}
    if(rub)out+=sparks(w[0],w[1]-20,t,10,70);
    out+='</g>';
    if(t>=C.r2)out+=chip('💥 ROMPÉS LAS NOTAS',CL.x+CL.w/2,450,(t-C.r2)/0.35,'#fff',30);
    // derecha
    if(t>=C.r3){var k=t-C.r3;var spr=k<1.6;
      out+='<g clip-path="url(#cpR)">'+ch('m',xR,CHY,SC,t,{hL:[150,420],hR:spr?[420,330]:REST.hR,ang:spr?-20:6,wink:k>3.2});
      var w2=sp(xR,CHY,SC,150,400);
      if(spr)out+=mistTo(sp(xR,CHY,SC,420,280)[0],sp(xR,CHY,SC,420,280)[1],w2[0],w2[1],1,t);
      for(var i=0;i<8;i++){var b=C.r3+0.3+i*0.15;if(t<b)continue;var a=i*0.8+t*0.6,rr=55+hsh(i+9)*50;out+=orb(w2[0]+Math.cos(a)*rr,w2[1]-40+Math.sin(a)*rr*0.8+Math.sin(t*2+i)*8,L(6,22,cl((t-b)/0.5)),1);}
      out+=glints(w2[0],w2[1]-40,t,6,110)+'</g>';
      out+=chip('⏳ DEJALO SECAR',CR.x+CR.w/2,450,(t-C.r3-0.6)/0.35,'#fff',30);}
    else out+='<g clip-path="url(#cpR)" opacity=".35">'+ch('m',xR,CHY,SC,t)+'</g>';
    out+=labels(t,C.r,C.r3);
  }
  // ── 2 · PIEL SECA vs CREMA
  if(t>=C.s&&t<C.n){out+=cards(t,C.s,C.s2);
    out+='<g clip-path="url(#cpL)">'+ch('h',xL,CHY,SC,t,{hL:[150,430],sad:t>C.s+2.2});
    var w=sp(xL,CHY,SC,150,430);
    for(var j=0;j<5;j++){var cx=w[0]-30+j*14,cy=w[1]+20+(j%2)*12;out+='<path d="M'+cx+' '+cy+' l 8 10 l -6 8 l 9 10" stroke="#8A5636" stroke-width="4" fill="none" opacity=".8"/>';}
    out+='<text x="'+(w[0]-40)+'" y="'+(w[1]+110)+'" font-size="56">🏜️</text>';
    for(var i=0;i<10;i++){var b=C.s+0.4+i*0.35;var k=(t-b)/1.3;if(k<0||k>1)continue;var hit=0.45;var px,py;
      if(k<hit){var q=k/hit;px=w[0]+(hsh(i)-0.5)*40;py=L(w[1]-420,w[1]-20,q*q);}
      else{var q=(k-hit)/(1-hit);var dir=hsh(i+4)>0.5?1:-1;px=w[0]+(hsh(i)-0.5)*40+dir*q*260;py=w[1]-20-Math.sin(q*Math.PI)*180-q*200;}
      out+=orb(px,py,18,k<hit?1:1-(k-hit)/(1-hit));}
    out+='</g>';
    out+=chip('🏜️ PIEL SECA',CL.x+CL.w/2,450,(t-C.s-0.8)/0.35,'#fff',30);
    if(t>=C.s2){var k=t-C.s2;var rubbing=k<2.2;var o=Math.sin(t*12)*30;
      out+='<g clip-path="url(#cpR)">'+ch('m',xR,CHY,SC,t,{hL:[150,450],hR:rubbing?[200+o,440]:REST.hR,ang:rubbing?-30:6,prop:rubbing?cream():null,wink:t>=C.s3+1.5});
      var w2=sp(xR,CHY,SC,150,450);
      var gl=cl(k/1.2);out+='<ellipse cx="'+w2[0]+'" cy="'+(w2[1]-18)+'" rx="44" ry="16" fill="#fff" opacity="'+(0.55*gl)+'"/>'+(gl>0?glints(w2[0],w2[1]-20,t,3,50):'');
      if(t>=C.s3-0.6){for(var i=0;i<9;i++){var b=C.s3-0.6+i*0.22,kk=cl((t-b)/0.55);if(t<b)continue;var a=-Math.PI/2+(i-4)*0.32;var fx=w2[0]+Math.cos(a)*420,fy=w2[1]+Math.sin(a)*420;var tx=w2[0]+(i-4)*9,ty=w2[1]-26-(i%3)*12;var e=kk*kk;
          var px=L(fx,tx,e),py=L(fy,ty,e);
          if(kk<1)out+='<path d="M'+px+' '+py+' Q '+((px+tx)/2+20)+' '+((py+ty)/2)+' '+tx+' '+ty+'" stroke="#E5322B" stroke-width="3" stroke-dasharray="6 8" fill="none" opacity=".5"/>';
          out+=orb(px,py,kk<1?18:14+Math.sin(t*4+i)*1.5,1);
          if(kk>=1&&t<b+0.8)out+='<text x="'+(tx+20)+'" y="'+(ty-30-(t-b-0.55)*60)+'" font-family="Baloo 2" font-weight="800" font-size="34" fill="#E5322B" opacity="'+(1-(t-b-0.55)/0.3)+'">¡CLAC!</text>';}
        out+='<text x="'+(w2[0]+60)+'" y="'+(w2[1]+100)+'" font-size="60">🧲</text>';}
      out+='</g>';
      out+=chip('🧲 CREMA PRIMERO',CR.x+CR.w/2,450,(t-C.s2-0.4)/0.35,'#fff',30);}
    else out+='<g clip-path="url(#cpR)" opacity=".35">'+ch('m',xR,CHY,SC,t)+'</g>';
    out+=labels(t,C.s,C.s2);
  }
  // ── 3 · LA NUBE
  if(t>=C.n&&t<C.b){out+=cards(t,C.n,C.n3);
    var k=t-C.n;var up=k<2.0;
    out+='<g clip-path="url(#cpL)">';
    var cX=CL.x+CL.w/2,cY=560,cs=cl((k-0.3)/0.8);
    // nube
    if(cs>0){out+='<g transform="translate('+cX+','+cY+') scale('+back(cs)+')" opacity=".95"><circle cx="-90" cy="10" r="60" fill="#fff"/><circle cx="-20" cy="-30" r="80" fill="#fff"/><circle cx="70" cy="0" r="66" fill="#fff"/><rect x="-140" y="0" width="270" height="62" rx="31" fill="#fff"/></g>';
      for(var i=0;i<6;i++)out+=orb(cX-110+i*44,cY+(i%2)*20,14,cl(cs*2)*(t>=C.n2?0.6:1));}
    // lluvia de esferas al piso
    if(t>=C.n+1.4){for(var i=0;i<14;i++){var ph=((t-C.n-1.4)*0.9+i/14)%1;var px=cX-130+hsh(i)*260;out+=orb(px,L(cY+60,1495,ph*ph),12,1-ph*0.3);}
      var pud=cl((t-C.n-1.6)/3);out+='<ellipse cx="'+(cX+120)+'" cy="1505" rx="'+(30+pud*110)+'" ry="'+(8+pud*14)+'" fill="#FFD23F" opacity=".75" stroke="#C98A12" stroke-width="4"/>';}
    out+=ch('h',xL-30,CHY,SC,t,{hL:REST.hL,hR:up?[400,180]:REST.hR,ang:up?-50:6,sad:t>=C.n2});
    out+='</g>';
    if(t>=C.n2)out+=chip('💸 LA MITAD AL PISO',CL.x+CL.w/2,450,(t-C.n2)/0.35,'#fff',30);
    if(t>=C.n3){var k2=t-C.n3;var spr=k2<2.4;
      out+='<g clip-path="url(#cpR)">'+ch('m',xR-50,CHY,SC,t,{flip:false,hR:spr?[450,290]:REST.hR,ang:spr?-80:6,wink:k2>3});
      var neck=sp(xR-50,CHY,SC,330,410),bt=sp(xR-50,CHY,SC,450,230);
      if(spr){out+=mistTo(bt[0]-10,bt[1],neck[0]+20,neck[1]-10,1,t);
        var rk=cl((k2-0.3)/0.4);var my=Math.min(neck[1],bt[1])-130,mx=(neck[0]+bt[0])/2;out+='<g opacity="'+rk+'"><path d="M'+(neck[0]+10)+' '+(my+40)+' L '+(neck[0]+10)+' '+(my+60)+' M'+(neck[0]+10)+' '+(my+50)+' L '+(bt[0]-10)+' '+(my+50)+' M'+(bt[0]-10)+' '+(my+40)+' L '+(bt[0]-10)+' '+(my+60)+'" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/>'+chip('✋ 1 PALMO',mx,my,rk,'#fff',26)+'</g>';}
      for(var i=0;i<6;i++){var b=C.n3+0.5+i*0.18;if(t<b)continue;var kk=cl((t-b)/0.5);out+=orb(L(bt[0],neck[0]+(i-2.5)*12,kk),L(bt[1],neck[1]-10+(i%2)*14,kk),L(8,15,kk),1);}
      if(k2>1.4)out+=glints(neck[0],neck[1]-10,t,5,70);
      out+='</g>';
      out+=chip('✋ A UN PALMO',CR.x+CR.w/2,450,(t-C.n3-0.5)/0.35,'#fff',30);}
    else out+='<g clip-path="url(#cpR)" opacity=".35">'+ch('m',xR,CHY,SC,t)+'</g>';
    out+=labels(t,C.n,C.n3);
  }
  // ── 4 · EL BAÑO
  if(t>=C.b&&t<C.c){out+=cards(t,C.b,C.b3);
    out+='<g clip-path="url(#cpL)">';
    for(var gx=CL.x;gx<CL.x+CL.w;gx+=70)out+='<path d="M'+gx+' '+CY+' L '+gx+' '+(CY+CH)+'" stroke="#fff" stroke-width="4" opacity=".7"/>';
    for(var gy=CY;gy<CY+CH;gy+=70)out+='<path d="M'+CL.x+' '+gy+' L '+(CL.x+CL.w)+' '+gy+'" stroke="#fff" stroke-width="4" opacity=".7"/>';
    // ventana con sol
    out+='<rect x="'+(CL.x+290)+'" y="560" width="170" height="190" rx="14" fill="#BFE8FF" stroke="#1a1a1a" stroke-width="6"/><circle cx="'+(CL.x+375)+'" cy="640" r="'+(40+3*Math.sin(t*4))+'" fill="#FFD23F" stroke="#1a1a1a" stroke-width="5"/><path d="M'+(CL.x+375)+' 560 L '+(CL.x+375)+' 750 M'+(CL.x+290)+' 655 L '+(CL.x+460)+' 655" stroke="#1a1a1a" stroke-width="5"/>';
    for(var i=0;i<4;i++){var ph=((t*0.8+i/4)%1);out+='<path d="M'+(CL.x+300)+' '+(740+i*30)+' L '+(CL.x+180)+' '+(1000+i*30)+'" stroke="#FFD23F" stroke-width="18" opacity="'+(0.25+0.15*Math.sin(ph*6.28))+'" stroke-linecap="round"/>';}
    // ducha + vapor
    out+='<path d="M'+(CL.x+60)+' 560 L '+(CL.x+60)+' 620 L '+(CL.x+130)+' 620" stroke="#8A9AA8" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="'+(CL.x+120)+'" y="608" width="70" height="28" rx="10" fill="#A9B8C4" stroke="#1a1a1a" stroke-width="5"/>';
    for(var i=0;i<7;i++){var ph=((t*0.35+i/7)%1);out+='<circle cx="'+(CL.x+150+Math.sin(i*2+t)*60)+'" cy="'+(1300-ph*700)+'" r="'+(40+ph*50)+'" fill="#fff" opacity="'+(0.45*Math.sin(ph*Math.PI))+'"/>';}
    // estante y frasco que se arruina
    var bad=cl((t-C.b-0.8)/(C.b2+2-C.b-0.8));
    out+='<rect x="'+(CL.x+120)+'" y="1200" width="260" height="22" rx="8" fill="#8A5636" stroke="#1a1a1a" stroke-width="6"/>';
    var liq=bad<0.5?'#FFD23F':'#B8A060';var bx=CL.x+250;
    out+='<g transform="translate('+bx+',1200) rotate('+(Math.sin(t*20)*2*bad)+')"><rect x="-55" y="-190" width="110" height="180" rx="30" fill="#EAF4FF" stroke="#1a1a1a" stroke-width="7"/><rect x="-44" y="-'+(130-bad*30)+'" width="88" height="'+(118-bad*30)+'" rx="20" fill="'+liq+'" opacity="'+(1-bad*0.3)+'"/><rect x="-22" y="-224" width="44" height="40" rx="8" fill="#1a1a1a"/><text y="-50" text-anchor="middle" font-size="44" opacity="'+bad+'">😵</text></g>';
    for(var i=0;i<5;i++){var a=i*1.25+t*0.5;out+=orb(bx+Math.cos(a)*120,1030+Math.sin(a)*60,14*(1-bad),1-bad);}
    out+='</g>';
    if(t>=C.b2)out+=chip('🚿 CALOR + LUZ',CL.x+CL.w/2,450,(t-C.b2)/0.35,'#fff',30);
    if(t>=C.b3){var k=t-C.b3;var open=k<0.8?L(1,0,cl(k/0.5)):k<1.6?0:cl((k-1.6)/0.5);
      out+='<g clip-path="url(#cpR)">';
      var dx=CR.x+60,dy=900;
      out+='<rect x="'+dx+'" y="'+dy+'" width="380" height="560" rx="20" fill="#B9794B" stroke="#1a1a1a" stroke-width="7"/><rect x="'+(dx+30)+'" y="'+(dy+330)+'" width="320" height="190" rx="14" fill="#9C6238" stroke="#1a1a1a" stroke-width="6"/><circle cx="'+(dx+190)+'" cy="'+(dy+425)+'" r="14" fill="#F4C542" stroke="#1a1a1a" stroke-width="4"/>';
      var dr=open*150;
      out+='<rect x="'+(dx+30)+'" y="'+(dy+40)+'" width="320" height="250" rx="14" fill="#5A3A22" stroke="#1a1a1a" stroke-width="6"/>';
      out+='<g transform="translate(0,'+(-dr*0.0)+')"><rect x="'+(dx+10-dr*0.15)+'" y="'+(dy+30+dr)+'" width="'+(360+dr*0.3)+'" height="'+(170)+'" rx="14" fill="#A86A3E" stroke="#1a1a1a" stroke-width="6"/>';
      if(open>0.05){var fy=dy+30+dr+10;out+='<g transform="translate('+(dx+190)+','+fy+')"><rect x="-45" y="-150" width="90" height="140" rx="26" fill="#EAF4FF" stroke="#1a1a1a" stroke-width="6"/><rect x="-35" y="-110" width="70" height="92" rx="18" fill="#FFD23F"/><rect x="-18" y="-178" width="36" height="32" rx="7" fill="#1a1a1a"/></g>';
        if(open>0.6){out+=glints(dx+190,fy-90,t,7,120);for(var i=0;i<5;i++){var a=i*1.25+t*0.6;out+=orb(dx+190+Math.cos(a)*130,fy-100+Math.sin(a)*50,14,1);}}}
      out+='<circle cx="'+(dx+190)+'" cy="'+(dy+115+dr)+'" r="14" fill="#F4C542" stroke="#1a1a1a" stroke-width="4"/></g>';
      out+='<text x="'+(dx+300)+'" y="'+(dy-60)+'" font-size="80">🌙</text>';
      out+='</g>';
      out+=chip('🗄️ FRESCO Y OSCURO',CR.x+CR.w/2,450,(t-C.b3-0.4)/0.35,'#fff',30);}
    out+=labels(t,C.b,C.b3);
  }
  // ── CIERRE
  if(t>=C.c&&t<C.end){var k=ent(C.c);
    for(var i=0;i<12;i++){var a=i*0.5236+t*0.7;out+=orb(540+Math.cos(a)*440,980+Math.sin(a)*330,L(0,18+6*Math.sin(t*3+i),k),1);}
    out+=glints(540,980,t,10,380);
    out+=ch('h',540-460*0.85,1000,0.85,t,{hearts:t>C.c+1})+ch('m',540+40,1000,0.85,t,{wink:t>C.c+1.4});
    out+=chip('✨ USALO BIEN',540,1500,(t-C.c-0.4)/0.35,'#FFD23F',46);}
  document.getElementById('sv').innerHTML=out;
  renderSubs2(t);
  var E=document.getElementById('end');var eOn=t>=C.end;E.style.display=eOn?'block':'none';
  if(eOn){var k=eio(cl((t-C.end)/0.4));E.style.opacity=k;['eA','eB','eC','eD'].forEach(function(id,i){var kk=cl((t-C.end-0.2-i*0.3)/0.4);document.getElementById(id).style.transform='translateY('+((1-eio(kk))*60)+'px) scale('+L(.85,1,cl(back(kk)))+')';document.getElementById(id).style.opacity=cl(kk*2.5);});}
  hkRender(t);
}
var subLine=-1;
function renderSubs2(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t>=C.end){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(error|frotás|roce|crema|seca|horas|nube|piso|palmo|baño|calor|vapor|luz|oscuro|bien|belle|perfume)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
