// ═══════════ ACADEMIA 08 · EL OUD ═══════════
var C=window.CUES;
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var GOLD='#F4C542',DARK='#1E140E';
var REST={hL:[60,610],hR:[436,410]};
function ch(G,x,y,sc,t,ex){ex=ex||{};var st={hL:ex.hL||REST.hL,hR:ex.hR||REST.hR,ang:ex.ang==null?6:ex.ang,bob:Math.sin(t*2+(G==='h'?1:0))*5,blink:((t+(G==='h'?1.3:0))%3.4)<0.12,dizzy:ex.dizzy,back:false,prop:ex.prop};
  var s='<g transform="translate('+x+','+y+') scale('+sc+') translate(0,-120)">'+(ex.flip?'<g transform="translate(500,0) scale(-1,1)">':'<g>')+pera2(G,G==='m'?MO:HO,G==='m'?GV:GT,st);
  if(ex.wink)s+='<ellipse cx="282" cy="'+(272+st.bob)+'" rx="19" ry="23" fill="'+(G==='m'?MO.skin:HO.skin)+'"/><path d="M266 '+(276+st.bob)+' C 274 '+(266+st.bob)+' 290 '+(266+st.bob)+' 298 '+(276+st.bob)+'" fill="none" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';
  if(ex.meh)s+='<path d="M228 '+(326+st.bob)+' L 272 '+(326+st.bob)+'" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';
  return s+'</g></g>';}
function chip(txt,x,y,k,col,fs,rot){fs=fs||40;var w=txt.length*fs*0.56+64;return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+back(cl(k))+')"><rect x="'+(-w/2+6)+'" y="'+(-fs*0.95+7)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="rgba(0,0,0,.35)"/><rect x="'+(-w/2)+'" y="'+(-fs*0.95)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="6"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
function title(txt,y,k,col,fs){fs=fs||110;return '<text x="540" y="'+y+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="'+(fs*0.14)+'" paint-order="stroke" transform="translate(540,'+y+') scale('+back(cl(k))+') translate(-540,'+(-y)+')" opacity="'+cl(k*3)+'">'+txt+'</text>';}
function star(x,y,s,op,col){return '<path d="M'+x+' '+(y-s)+' L '+(x+s*0.28)+' '+y+' L '+x+' '+(y+s)+' L '+(x-s*0.28)+' '+y+' Z" fill="'+(col||'#FFE27A')+'" opacity="'+(op==null?1:op)+'"/>';}
function sparkles(cx,cy,R,t,n,col){var s='';for(var i=0;i<n;i++){var a=i*6.283/n+t*0.6;s+=star(cx+Math.cos(a)*R,cy+Math.sin(a)*R*0.8,10+7*Math.sin(t*5+i),1,col);}return s;}
// panel de foto estilo cómic
var PID=0;
function photo(href,cx,cy,w,h,rot,k,cap,capCol){if(k<=0)return '';var id='ph'+(PID++);var b=back(cl(k));
  var s='<g transform="translate('+cx+','+cy+') rotate('+rot+') scale('+b+')"><rect x="'+(-w/2+14)+'" y="'+(-h/2+16)+'" width="'+w+'" height="'+h+'" rx="18" fill="rgba(0,0,0,.45)"/><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="18" fill="#fff" stroke="#1a1a1a" stroke-width="10"/>';
  s+='<clipPath id="'+id+'"><rect x="'+(-w/2+16)+'" y="'+(-h/2+16)+'" width="'+(w-32)+'" height="'+(h-32)+'" rx="8"/></clipPath><image href="fotos/'+href+'.jpg" x="'+(-w/2+16)+'" y="'+(-h/2+16)+'" width="'+(w-32)+'" height="'+(h-32)+'" preserveAspectRatio="xMidYMid slice" clip-path="url(#'+id+')"/><rect x="'+(-w/2+16)+'" y="'+(-h/2+16)+'" width="'+(w-32)+'" height="'+(h-32)+'" rx="8" fill="none" stroke="#1a1a1a" stroke-width="5"/>';
  if(cap){var fs=38,cw=cap.length*fs*0.56+56;s+='<g transform="translate(0,'+(h/2-6)+') rotate('+(-rot*0.6-2)+')"><rect x="'+(-cw/2+5)+'" y="-30" width="'+cw+'" height="66" rx="16" fill="rgba(0,0,0,.35)"/><rect x="'+(-cw/2)+'" y="-36" width="'+cw+'" height="66" rx="16" fill="'+(capCol||GOLD)+'" stroke="#1a1a1a" stroke-width="6"/><text y="10" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+cap+'</text></g>';}
  return s+'</g>';}
function burstTxt(txt,x,y,k,col,fs){if(k<=0)return '';fs=fs||64;var b=back(cl(k));var s='<g transform="translate('+x+','+y+') rotate(-8) scale('+b+')"><path d="';for(var i=0;i<16;i++){var a=i*Math.PI/8,r=i%2?110:150;s+=(i?'L':'M')+(Math.cos(a)*r*1.6)+' '+(Math.sin(a)*r*0.8)+' ';}return s+'Z" fill="'+(col||'#FFD23F')+'" stroke="#1a1a1a" stroke-width="7"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
function ingot(x,y,s){return '<g transform="translate('+x+','+y+') scale('+s+')"><path d="M-80 26 L 80 26 L 60 -26 L -60 -26 Z" fill="url(#gIng)" stroke="#1a1a1a" stroke-width="6" stroke-linejoin="round"/><path d="M-60 -26 L 60 -26 L 52 -12 L -52 -12 Z" fill="#FFF1B0"/><path d="M-40 6 L -10 6" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/><text y="18" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="26" fill="#8A5A10">ORO</text></g>';}
function oudChunk(x,y,s){var id='chk';return '<g transform="translate('+x+','+y+') scale('+s+')"><clipPath id="'+id+'"><path d="M-120 30 L -96 -40 L -40 -66 L 30 -58 L 96 -70 L 124 -10 L 110 40 L 30 52 L -60 50 Z"/></clipPath><path d="M-120 30 L -96 -40 L -40 -66 L 30 -58 L 96 -70 L 124 -10 L 110 40 L 30 52 L -60 50 Z" fill="#3A2416" transform="translate(8,10)" opacity=".5"/><image href="fotos/kyara.jpg" x="-150" y="-110" width="300" height="225" preserveAspectRatio="xMidYMid slice" clip-path="url(#'+id+')"/><path d="M-120 30 L -96 -40 L -40 -66 L 30 -58 L 96 -70 L 124 -10 L 110 40 L 30 52 L -60 50 Z" fill="none" stroke="#1a1a1a" stroke-width="7" stroke-linejoin="round"/></g>';}
function tag(x,y,txt,col,rot){var w=txt.length*26+50;return '<g transform="translate('+x+','+y+') rotate('+rot+')"><path d="M0 -60 L 0 -20" stroke="#1a1a1a" stroke-width="4"/><rect x="'+(-w/2)+'" y="-22" width="'+w+'" height="58" rx="14" fill="'+col+'" stroke="#1a1a1a" stroke-width="6"/><circle cx="'+(-w/2+16)+'" cy="7" r="6" fill="#1a1a1a"/><text x="10" y="20" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40" fill="#1a1a1a">'+txt+'</text></g>';}
function balance(cx,cy,ang,t,rightItem){var a=ang*Math.PI/180,L_=330;var lx=cx-Math.cos(a)*L_,ly=cy-Math.sin(a)*L_,rx=cx+Math.cos(a)*L_,ry=cy+Math.sin(a)*L_;
  var s='<defs><linearGradient id="gGold" x1="0" x2="1"><stop offset="0" stop-color="#B8860B"/><stop offset=".45" stop-color="#FFE27A"/><stop offset="1" stop-color="#C9952A"/></linearGradient><linearGradient id="gIng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#D9A21A"/></linearGradient></defs>';
  // pedestal
  s+='<ellipse cx="'+cx+'" cy="'+(cy+470)+'" rx="220" ry="30" fill="rgba(0,0,0,.45)"/><rect x="'+(cx-200)+'" y="'+(cy+420)+'" width="400" height="44" rx="14" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="7"/><rect x="'+(cx-140)+'" y="'+(cy+380)+'" width="280" height="46" rx="14" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="7"/>';
  s+='<path d="M'+(cx-26)+' '+(cy+384)+' L '+(cx-18)+' '+(cy+20)+' L '+(cx+18)+' '+(cy+20)+' L '+(cx+26)+' '+(cy+384)+' Z" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="7"/><circle cx="'+cx+'" cy="'+(cy+200)+'" r="30" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="6"/><circle cx="'+cx+'" cy="'+(cy+200)+'" r="12" fill="#7A2E3E" stroke="#1a1a1a" stroke-width="4"/>';
  // cruz y fiel
  s+='<path d="M'+lx+' '+ly+' L '+rx+' '+ry+'" stroke="#1a1a1a" stroke-width="28" stroke-linecap="round"/><path d="M'+lx+' '+ly+' L '+rx+' '+ry+'" stroke="url(#gGold)" stroke-width="16" stroke-linecap="round"/>';
  s+='<g transform="translate('+cx+','+cy+') rotate('+ang+')"><path d="M0 -10 L -12 -90 L 0 -110 L 12 -90 Z" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="5"/></g><circle cx="'+cx+'" cy="'+cy+'" r="30" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="7"/><path d="M'+cx+' '+(cy-150)+' C '+(cx+16)+' '+(cy-130)+' '+(cx+16)+' '+(cy-110)+' '+cx+' '+(cy-100)+' C '+(cx-16)+' '+(cy-110)+' '+(cx-16)+' '+(cy-130)+' '+cx+' '+(cy-150)+' Z" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="5"/>';
  [[lx,ly],[rx,ry]].forEach(function(p,i){var px=p[0],py=p[1],pd=210;
    for(var j=-1;j<=1;j++)s+='<path d="M'+px+' '+py+' L '+(px+j*130)+' '+(py+pd)+'" stroke="#8A6A20" stroke-width="5" stroke-dasharray="10 5"/>';
    s+='<circle cx="'+px+'" cy="'+py+'" r="14" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="5"/><path d="M'+(px-160)+' '+(py+pd)+' Q '+px+' '+(py+pd+90)+' '+(px+160)+' '+(py+pd)+' Z" fill="url(#gGold)" stroke="#1a1a1a" stroke-width="7"/><path d="M'+(px-160)+' '+(py+pd)+' L '+(px+160)+' '+(py+pd)+'" stroke="#FFF1B0" stroke-width="5"/>';
    if(i===0){s+=ingot(px-60,py+pd-26,0.9)+ingot(px+60,py+pd-26,0.9)+ingot(px,py+pd-74,0.9)+tag(px,py-80,'ORO 💰','#FFE27A',-5);}
    else{s+=rightItem(px,py+pd-60)+tag(px,py-80,'OUD 💰💰💰','#F4C542',5);}});
  return s;}
// mapa simplificado del sur/sudeste de Asia (dibujo propio)
var MW=1400,MH=903;
function mapPanel(cx,cy,w,k,cap){var h=(w-32)*MH/MW+32;return photo('mapa',cx,cy,w,h,-1.5,k,cap||'','#9FE08A');}
function mapXY(cx,cy,w,px,py){var h=(w-32)*MH/MW+32,s=(w-32)/MW;return [cx-w/2+16+px*s, cy-h/2+16+py*s];}
function pin(x,y,k,col){if(k<=0)return '';var b=back(cl(k));return '<g transform="translate('+x+','+(y-(1-cl(k))*80)+') scale('+b+')"><ellipse cx="0" cy="6" rx="18" ry="6" fill="rgba(0,0,0,.35)"/><path d="M0 0 C -30 -40 -36 -60 -36 -78 C -36 -100 -20 -116 0 -116 C 20 -116 36 -100 36 -78 C 36 -60 30 -40 0 0 Z" fill="'+(col||'#FF4F8B')+'" stroke="#1a1a1a" stroke-width="6"/><circle cx="0" cy="-78" r="13" fill="#fff" stroke="#1a1a1a" stroke-width="4"/></g>';}
function tree(x,y,s,col,glow){return '<g transform="translate('+x+','+y+') scale('+s+')">'+(glow?'<circle cx="0" cy="-60" r="90" fill="#FFE27A" opacity=".35"/>':'')+'<rect x="-9" y="-40" width="18" height="50" fill="#8A5A3B" stroke="#1a1a1a" stroke-width="4"/><circle cx="0" cy="-70" r="44" fill="'+col+'" stroke="#1a1a1a" stroke-width="5"/><circle cx="-26" cy="-50" r="28" fill="'+col+'" stroke="#1a1a1a" stroke-width="5"/><circle cx="26" cy="-50" r="28" fill="'+col+'" stroke="#1a1a1a" stroke-width="5"/></g>';}
function arabBottle(x,y,s,col,t){return '<g transform="translate('+x+','+y+') scale('+s+')"><path d="M0 -150 C 20 -150 22 -130 14 -120 L 14 -96 C 60 -80 80 -40 80 0 C 80 50 46 80 0 80 C -46 80 -80 50 -80 0 C -80 -40 -60 -80 -14 -96 L -14 -120 C -22 -130 -20 -150 0 -150 Z" fill="'+col+'" stroke="#1a1a1a" stroke-width="7"/><path d="M-60 0 C -40 -20 40 -20 60 0 C 40 20 -40 20 -60 0 Z" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="4"/><path d="M0 -200 C 16 -180 16 -160 0 -150 C -16 -160 -16 -180 0 -200 Z" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="6"/><path d="M-50 -30 C -46 -50 -34 -60 -24 -64" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>';}
function smoke(x,y,t,n,col){var s='';for(var i=0;i<n;i++){var ph=((t*0.35+i/n)%1);s+='<circle cx="'+(x+Math.sin(ph*6+i)*40*ph)+'" cy="'+(y-ph*380)+'" r="'+(18+ph*50)+'" fill="'+(col||'#F4D27A')+'" opacity="'+(0.45*(1-ph))+'"/>';}return s;}
function hookSubs(t){var fr=t<C.h2-0.05?0:(t<C.h3-0.05?1:2);var t0=[0,C.h2,C.h3][fr]-0.05,t1=[C.h2,C.h3,C.ar][fr];
  var W=[];SUBS.forEach(function(L_){L_.w.forEach(function(w){if(w.t>=t0-0.05&&w.t<t1-0.05)W.push(w);});});if(!W.length)return '';
  var lines=[],ln=[],len=0;W.forEach(function(w){if(len+w.s.length>11&&ln.length){lines.push(ln);ln=[];len=0;}ln.push(w);len+=w.s.length+1;});if(ln.length)lines.push(ln);
  var PAL2=['#FF4F8B','#3DB8F5','#F0A21A','#22C3B0','#8E6CF5','#FF5A4E'];var STY=[{lab:'#fff',txt:null},{lab:GOLD,txt:'#1a1a1a'},{lab:'#1a1a1a',txt:GOLD}][fr];
  var fs=fr===2?190:120,lh=fs*1.15,y0=(fr===2?560:470)-(lines.length-1)*lh/2,s='';var pk=cl((t-t0)/0.1);var pop=pk<1?(0.6+0.55*pk):1;
  lines.forEach(function(L_,li){var y=y0+li*lh;var lk=cl((t-L_[0].t+0.04)/0.1);if(lk<=0)return;var lp=lk<1?(0.6+0.55*lk):1;var rot=[[-3,2.5,-2],[2.5,-3,2],[-2,3,-2.5]][fr][li%3];var tr='translate(540,'+y+') rotate('+rot+') scale('+(pop*lp)+') translate(-540,'+(-y)+')';
    var nch=L_.map(function(w){return w.s;}).join(' ').length,bw=nch*fs*0.56+70;
    s+='<g transform="'+tr+'"><rect x="'+(540-bw/2+10)+'" y="'+(y-fs*0.82+12)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="rgba(0,0,0,.4)"/><rect x="'+(540-bw/2)+'" y="'+(y-fs*0.82)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="'+STY.lab+'" stroke="'+(fr===2?GOLD:'#1a1a1a')+'" stroke-width="8"/></g>';
    var o='<text x="540" y="'+y+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" transform="'+tr+'">';
    L_.forEach(function(w,j){var on=t>=w.t-0.02;var col=STY.txt||PAL2[(li*3+j)%PAL2.length];o+='<tspan fill="'+col+'" fill-opacity="'+(on?1:0)+'">'+(j?' ':'')+w.s.toUpperCase()+'</tspan>';});s+=o+'</text>';});
  return s;}
function render(t){
  PID=0;var out='<defs><radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient><radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F4C542" stop-opacity=".35"/><stop offset="1" stop-color="#F4C542" stop-opacity="0"/></radialGradient></defs>';
  var bg=DARK;var ent=function(t0){return eio(cl((t-t0)/0.5));};
  out+='<circle cx="540" cy="1000" r="900" fill="url(#glow)"/>';
  // dorado flotando de fondo (polvo de oro)
  for(var i=0;i<26;i++){var ph=((t*0.05+hsh(i))%1);out+='<circle cx="'+(hsh(i*3)*1080+Math.sin(t*0.6+i)*30)+'" cy="'+(1950-ph*2000)+'" r="'+(2+hsh(i*7)*4)+'" fill="'+GOLD+'" opacity="'+(0.25+0.4*Math.sin(ph*Math.PI))+'"/>';}
  // ── GANCHO: balanza oro vs oud
  if(t<C.ar){
    if(t<C.h3){var tilt=L(0,16,eio(cl((t-0.9)/0.8)))+Math.sin(t*3)*1.2;
      out+='<g transform="translate(540,1120) scale(1.05) translate(-540,-1050)">'+balance(540,1050,tilt,t,function(x,y){return oudChunk(x,y,1.0);})+'</g>';
      if(t>1.2){out+=sparkles(900,1420,200,t,10);out+=burstTxt('¡GANA EL OUD!',760,1620,(t-1.7)/0.35,'#FFD23F',50);}
      if(t>=C.h2){var kb=cl((t-C.h2-0.3)/0.4);out+='<g transform="translate(880,880) rotate(10) scale('+back(kb)+')">'+arabBottle(0,0,0.9,'#7A2E3E',t)+'</g>';out+=chip('🧴 ¡EN TU PERFUME!',300,880,(t-C.h2-0.6)/0.35,'#fff',38,-4);}
    }else{var k=ent(C.h3);out+=photo('kyara',540,1150,820,620,-3,cl((t-C.h3)/0.35),'🪵 MADERA DE OUD');out+=sparkles(540,1150,480,t,12);}
    out+=hookSubs(t);
  }
  // ── EL ÁRBOL
  if(t>=C.ar&&t<C.he){bg='#163A2A';
    if(t<C.ar2){var k=cl((t-C.ar)/0.4);out+=mapPanel(540,1050,1000,k,'🌏 SUDESTE ASIÁTICO');var zone=[[622,451],[684,358],[700,498],[653,653],[902,669],[622,716]];zone.forEach(function(z,i){var p=mapXY(540,1050,1000,z[0],z[1]);var kz=cl((t-C.ar-0.6-i*0.12)/0.3);if(kz>0)out+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(26+10*Math.sin(t*5+i))*back(kz)+'" fill="#3E9E52" opacity=".55" stroke="#fff" stroke-width="4"/>'+tree(p[0],p[1]+20,0.38*back(kz),'#2E7D4F',false);});out+=pin(mapXY(540,1050,1000,650,500)[0],mapXY(540,1050,1000,650,500)[1]-30,cl((t-C.ar-1.4)/0.4),'#FF4F8B');}
    else{out+=photo('arbol1',360,1040,560,820,-4,cl((t-C.ar2)/0.35),'🌳 AQUILARIA');
      out+=photo('arbol2',800,720,420,300,6,cl((t-C.ar2-0.4)/0.35),'SUS HOJAS','#9FE08A');
      if(t>=C.ar3){out+='<g opacity="'+ent(C.ar3)+'">'+ch('h',600,1080,0.85,t,{meh:true,hL:[60,610],hR:[436,410]})+'</g>';
        var kz=cl((t-C.ar4)/0.4);out+='<g transform="translate(830,1540) scale('+back(kz)+')"><rect x="-200" y="-70" width="400" height="140" rx="30" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><text x="-170" y="18" font-family="Baloo 2" font-weight="800" font-size="46">OLOR:</text><rect x="-20" y="-20" width="190" height="40" rx="20" fill="#E6E6E6" stroke="#1a1a1a" stroke-width="5"/><text x="80" y="64" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="34">0 😐</text></g>';
        out+=chip('SANO = NO HUELE',540,470,(t-C.ar4-0.3)/0.35,'#fff',46);}}
  }
  // ── LA HERIDA → RESINA → OUD
  if(t>=C.he&&t<C.ex){bg='#2A1A12';
    if(t<C.he5){var cx=540,cy=1000,R=330;var k=ent(C.he);
      out+='<g transform="translate('+cx+','+cy+') scale('+back(cl((t-C.he)/0.5))+')"><circle r="'+(R+30)+'" fill="#6E4428" stroke="#1a1a1a" stroke-width="9"/><circle r="'+R+'" fill="#F2D3A0" stroke="#1a1a1a" stroke-width="6"/>';
      for(var r=60;r<R;r+=50)out+='<circle r="'+r+'" fill="none" stroke="#D9B07A" stroke-width="5"/>';
      // grieta
      var kc=cl((t-C.he-0.6)/0.3);if(kc>0)out+='<path d="M'+(R+30)+' -40 L 200 -10 L 240 30 L 120 20 L 150 70 L 60 50" fill="none" stroke="#1a1a1a" stroke-width="'+(14*kc)+'" stroke-linecap="round" stroke-linejoin="round"/>';
      // hongo
      if(t>=C.he2){for(var i=0;i<14;i++){var kk=cl((t-C.he2-i*0.08)/0.5);if(kk<=0)continue;var a=-0.6+hsh(i)*1.4,rr=L(R+200,90+hsh(i*3)*160,eio(kk));var px=Math.cos(a)*rr,py=Math.sin(a)*rr*0.9;out+='<circle cx="'+px+'" cy="'+py+'" r="'+(10+5*Math.sin(t*6+i))+'" fill="#7BC043" stroke="#1a1a1a" stroke-width="4"/><circle cx="'+(px-3)+'" cy="'+(py-3)+'" r="2.5" fill="#1a1a1a"/><circle cx="'+(px+4)+'" cy="'+(py-3)+'" r="2.5" fill="#1a1a1a"/>';}}
      // resina oscura que se expande en vetas
      if(t>=C.he3){var kr=cl((t-C.he3)/(C.he5-C.he3));for(var i=0;i<11;i++){var a=-1.2+i*0.42+Math.sin(i)*0.2;var len=R*0.95*cl(kr*1.4-i*0.04);if(len<=0)continue;var d='M120 30';for(var s_=1;s_<=6;s_++){var q=s_/6*len;var ax=120+Math.cos(a+Math.PI)*q*0.9+Math.sin(s_*1.7+i)*18,ay=30+Math.sin(a+Math.PI)*q*0.9+Math.cos(s_*1.3+i)*18;d+=' L '+ax+' '+ay;}out+='<path d="'+d+'" fill="none" stroke="#2A160C" stroke-width="'+(16-i%3*3)+'" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>';}
        out+='<circle cx="120" cy="30" r="'+(40+120*kr)+'" fill="#3A1E10" opacity="'+(0.55*kr)+'"/>';}
      out+='</g>';
      if(t>=C.he3)out+=smoke(540,800,t,10,'#F4D27A');
      out+=chip('🩹 EL SECRETO: UNA HERIDA',540,470,(t-C.he)/0.35,'#fff',44);
      if(t>=C.he2&&t<C.he3)out+=burstTxt('¡HONGO! 🍄',820,1440,(t-C.he2)/0.35,'#9FE08A',58);
      if(t>=C.he3&&t<C.he4)out+=burstTxt('🛡️ SE DEFIENDE',300,1460,(t-C.he3)/0.35,GOLD,52);
      if(t>=C.he4)out+=photo('infectada',800,1400,380,560,7,cl((t-C.he4)/0.35),'📸 ¡ASÍ ES REAL!');}
    else if(t<C.he6){out+=photo('kyara',540,1030,860,640,-3,cl((t-C.he5)/0.3),'✨ ESO ES EL OUD ✨');out+=sparkles(540,1030,500,t,14);out+=burstTxt('¡OUD!',820,560,(t-C.he5-0.2)/0.35,GOLD,90);}
    else{var k=ent(C.he6);for(var r=0;r<5;r++)for(var c=0;c<5;c++){var i=r*5+c;var gl=(i===12);var kk=cl((t-C.he6-i*0.03)/0.4);if(kk<=0)continue;out+=tree(160+c*190,800+r*180,back(kk)*(gl?1.25:1),gl?'#F4C542':'#5E7A5A',gl&&t>C.he6+1);}
      out+=sparkles(540,1100,120,t,8);out+=chip('🌳✨ MUY POCOS ÁRBOLES',540,500,(t-C.he6-0.8)/0.35,GOLD,46);}
  }
  // ── EXTRACCIÓN
  if(t>=C.ex&&t<C.ti){bg='#2E1C10';
    var steps=[['🪓','CORTE','ex'],['✋','A MANO','ex2'],['💧','REMOJO','ex3'],['🔥','DESTILAR','ex4']];
    steps.forEach(function(s_,i){var on=t>=C[s_[2]];var x=170+i*247;out+='<g transform="translate('+x+',470) scale('+(on?1:0.85)+')" opacity="'+(on?1:0.4)+'"><circle r="66" fill="'+(on?GOLD:'#5a4a3a')+'" stroke="#1a1a1a" stroke-width="6"/><text y="24" text-anchor="middle" font-size="62">'+s_[0]+'</text><text y="112" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="32" fill="#fff">'+s_[1]+'</text></g>';if(i<3)out+='<path d="M'+(x+80)+' 470 L '+(x+165)+' 470" stroke="'+(t>=C[steps[i+1][2]]?GOLD:'#5a4a3a')+'" stroke-width="8" stroke-dasharray="14 10"/>';});
    if(t<C.ex2){var k=t-C.ex;var hit=(k*1.6)%1;var ang=hit<0.3?L(-60,10,hit/0.3):L(10,-60,(hit-0.3)/0.7);
      out+='<g transform="translate(540,1200)"><rect x="-320" y="-80" width="640" height="160" rx="70" fill="#8A5A3B" stroke="#1a1a1a" stroke-width="8"/><ellipse cx="320" cy="0" rx="50" ry="80" fill="#E2B07A" stroke="#1a1a1a" stroke-width="7"/><circle cx="320" cy="0" r="26" fill="none" stroke="#B07A45" stroke-width="5"/></g>';
      out+='<g transform="translate(560,1060) rotate('+ang+')"><rect x="-12" y="-300" width="24" height="300" rx="10" fill="#B5622B" stroke="#1a1a1a" stroke-width="6"/><path d="M-12 -300 L -110 -330 L -100 -230 L -12 -250 Z" fill="#C0C7CF" stroke="#1a1a1a" stroke-width="6"/></g>';
      if(hit<0.45&&hit>0.25){out+=burstTxt('¡TOC!',300,960,1,'#fff',56);for(var i=0;i<6;i++){var a=-1.6+i*0.5;out+='<rect x="'+(540+Math.cos(a)*120*hit*3)+'" y="'+(1120+Math.sin(a)*90*hit*3)+'" width="22" height="12" fill="#E2B07A" stroke="#1a1a1a" stroke-width="3"/>';}}}
    else if(t<C.ex3){out+=photo('topgrade',540,1080,820,560,-3,cl((t-C.ex2)/0.35),'✋ VETAS SEPARADAS A MANO');
      var kx=(t*1.4)%1;out+='<g transform="translate('+(380+kx*320)+',1340) rotate(-30)"><rect x="-10" y="-120" width="20" height="90" rx="8" fill="#5A3420" stroke="#1a1a1a" stroke-width="5"/><path d="M-10 -30 L 10 -30 L 6 60 L 0 80 L -6 60 Z" fill="#C0C7CF" stroke="#1a1a1a" stroke-width="5"/></g>';}
    else if(t<C.ex4){out+='<g transform="translate(540,1180)"><path d="M-330 -120 L 330 -120 L 280 200 L -280 200 Z" fill="#6E8AA8" stroke="#1a1a1a" stroke-width="9" stroke-linejoin="round"/><path d="M-320 -80 L 320 -80 L 278 190 L -278 190 Z" fill="#7EC8FF" opacity=".85"/>';
      for(var i=0;i<9;i++){var x=-240+i*60,y=-40+Math.sin(t*2.4+i)*14;out+='<rect x="'+x+'" y="'+y+'" width="70" height="22" rx="6" fill="#5A3A26" stroke="#1a1a1a" stroke-width="4" transform="rotate('+(Math.sin(i+t)*12)+' '+(x+35)+' '+(y+11)+')"/>';}
      for(var i=0;i<8;i++){var ph=((t*0.8+i/8)%1);out+='<circle cx="'+(-220+hsh(i)*440)+'" cy="'+(170-ph*240)+'" r="'+(6+ph*8)+'" fill="#fff" opacity="'+(0.8*(1-ph))+'" stroke="#1a1a1a" stroke-width="2"/>';}out+='</g>';
      out+=chip('💧 EN REMOJO',540,820,(t-C.ex3)/0.35,'#7EC8FF',48);}
    else if(t<C.ex5){var cx=430,cy=1180;
      out+='<g><path d="M'+(cx-200)+' '+(cy+220)+' Q '+cx+' '+(cy+260)+' '+(cx+200)+' '+(cy+220)+'" fill="none" stroke="#FF6A2E" stroke-width="0"/>';
      for(var i=0;i<7;i++){var ph=((t*1.5+i/7)%1);out+='<path d="M'+(cx-150+i*50)+' '+(cy+300)+' q 14 -'+(40+30*ph)+' 0 -'+(80+40*ph)+'" fill="none" stroke="'+(i%2?'#FFD23F':'#FF6A2E')+'" stroke-width="16" stroke-linecap="round" opacity="'+(1-ph*0.5)+'"/>';}
      out+='<path d="M'+(cx-170)+' '+(cy+200)+' C '+(cx-200)+' '+(cy-20)+' '+(cx-120)+' '+(cy-120)+' '+cx+' '+(cy-120)+' C '+(cx+120)+' '+(cy-120)+' '+(cx+200)+' '+(cy-20)+' '+(cx+170)+' '+(cy+200)+' Z" fill="#C98A3A" stroke="#1a1a1a" stroke-width="9"/><path d="M'+(cx-30)+' '+(cy-120)+' L '+(cx-20)+' '+(cy-240)+' L '+(cx+20)+' '+(cy-240)+' L '+(cx+30)+' '+(cy-120)+' Z" fill="#B07A2A" stroke="#1a1a1a" stroke-width="7"/>';
      out+='<path d="M'+cx+' '+(cy-240)+' C '+(cx+100)+' '+(cy-320)+' '+(cx+300)+' '+(cy-260)+' '+(cx+330)+' '+(cy-120)+'" fill="none" stroke="#1a1a1a" stroke-width="22"/><path d="M'+cx+' '+(cy-240)+' C '+(cx+100)+' '+(cy-320)+' '+(cx+300)+' '+(cy-260)+' '+(cx+330)+' '+(cy-120)+'" fill="none" stroke="#C0C7CF" stroke-width="12"/>';
      out+='<rect x="'+(cx+280)+'" y="'+(cy-130)+'" width="100" height="220" rx="20" fill="#9FD8FF" stroke="#1a1a1a" stroke-width="7"/>';
      var dp=((t*0.9)%1);out+='<path d="M'+(cx+330)+' '+(cy+100+dp*120)+' c 10 14 10 24 0 26 c -10 -2 -10 -12 0 -26 Z" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="3"/><path d="M'+(cx+290)+' '+(cy+250)+' L '+(cx+370)+' '+(cy+250)+' L '+(cx+360)+' '+(cy+330)+' L '+(cx+300)+' '+(cy+330)+' Z" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><rect x="'+(cx+304)+'" y="'+(cy+300)+'" width="52" height="26" fill="'+GOLD+'"/>';
      out+=smoke(cx,cy-260,t,6,'#fff');out+='</g>';
      var day=1+Math.floor((t-C.ex4)*2.2);var a=(t-C.ex4)*2.2*6.283;out+='<g transform="translate(860,820)"><circle r="80" fill="#1a1a1a" stroke="'+GOLD+'" stroke-width="6"/><text x="'+(Math.cos(a)*44)+'" y="'+(Math.sin(a)*44+18)+'" text-anchor="middle" font-size="50">'+(Math.sin(a)>0?'🌙':'☀️')+'</text><text y="150" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="48" fill="#fff" stroke="#1a1a1a" stroke-width="8" paint-order="stroke">DÍA '+Math.min(day,9)+'</text></g>';}
    else{var k=ent(C.ex5);
      for(var i=0;i<15;i++){var r=Math.floor(i/5),c=i%5;var kk=cl((t-C.ex5-i*0.06)/0.4);if(kk<=0)continue;out+='<g transform="translate('+(110+c*60+r*30)+','+(1300-r*60)+') scale('+back(kk)+')"><rect x="-56" y="-26" width="112" height="52" rx="24" fill="#8A5A3B" stroke="#1a1a1a" stroke-width="5"/><ellipse cx="56" cy="0" rx="16" ry="26" fill="#E2B07A" stroke="#1a1a1a" stroke-width="4"/></g>';}
      out+=chip('🪵 DECENAS DE KG',260,1460,(t-C.ex5-0.6)/0.35,'#E2B07A',40);
      var ka=cl((t-C.ex5-1.4)/0.5);out+='<path d="M480 1180 L '+L(480,640,ka)+' 1180" stroke="#fff" stroke-width="14" stroke-linecap="round"/>'+(ka>=1?'<path d="M620 1150 L 660 1180 L 620 1210" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>':'');
      var kv=cl((t-C.ex5-2)/0.4);out+='<g transform="translate(840,1200) scale('+back(kv)+')"><rect x="-30" y="-110" width="60" height="30" rx="6" fill="#1a1a1a"/><path d="M-40 -84 L 40 -84 L 46 40 C 46 60 -46 60 -46 40 Z" fill="#EAF6FF" stroke="#1a1a1a" stroke-width="6"/><path d="M-42 10 L 42 10 L 44 40 C 44 56 -44 56 -44 40 Z" fill="'+GOLD+'"/></g>'+(kv>0?sparkles(840,1180,110,t,6):'');
      out+=chip('💧 POCOS ml',840,1460,(t-C.ex5-2.3)/0.35,GOLD,40);}
  }
  // ── TIPOS DE OUD (mapa)
  if(t>=C.ti&&t<C.pr){bg='#163A2A';var MC=[540,880,1000];out+=mapPanel(MC[0],MC[1],MC[2],cl((t-C.ti)/0.4));
    out+=chip('🌏 NO HAY UN SOLO OUD',540,450,(t-C.ti)/0.35,GOLD,46);
    var T=[['ti1',171,311,'🇮🇳 INDIA','INTENSO Y ANIMAL 🐾','#FF8A3D',-1],['ti2',700,498,'🇰🇭 CAMBOYA','DULCE Y FRUTAL 🍯','#FF4F8B',1],['ti3',640,400,'🇹🇭🇱🇦 TAILANDIA Y LAOS','AHUMADO 💨','#9AA3AD',1],['ti4',780,680,'🇲🇾🇮🇩 MALASIA E INDONESIA','SUAVE Y AMADERADO 🌿','#5FCB7A',-1]];
    T.forEach(function(p,i){if(t<C[p[0]])return;var k=cl((t-C[p[0]])/0.4);var pp=mapXY(MC[0],MC[1],MC[2],p[1],p[2]);var px=pp[0],py=pp[1];out+=pin(px,py,k,p[5]);
      var cy=1380+(i%2)*0;var bx=p[6]<0?290:790,by=[1450,1450,1640,1640][i];if(i<2)by=1330;else by=1475;bx=(i%2===0)?285:795;
      var kc=cl((t-C[p[0]]-0.2)/0.35);out+='<path d="M'+px+' '+(py-60)+' L '+bx+' '+(by-60)+'" stroke="#fff" stroke-width="4" stroke-dasharray="8 8" opacity="'+kc+'"/>';
      out+='<g transform="translate('+bx+','+by+') scale('+back(kc)+')"><rect x="-250" y="-66" width="500" height="128" rx="24" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><rect x="-250" y="-66" width="500" height="54" rx="24" fill="'+p[5]+'" stroke="#1a1a1a" stroke-width="7"/><text y="-28" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(p[3].length>16?26:32)+'">'+p[3]+'</text><text y="38" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(p[4].length>18?32:38)+'">'+p[4]+'</text></g>';});
  }
  // ── POR QUÉ ES TAN CARO
  if(t>=C.pr&&t<C.im){bg='#2A1A12';
    if(t<C.pr4){var B=[['pr','🔍','ESCASO','#FF8A3D'],['pr2','⏳','TARDA AÑOS','#3DB8F5'],['pr3','🛡️','PROTEGIDO','#5FCB7A']];
      out+=title('¿POR QUÉ TAN CARO? 💰',560,(t-C.pr)/0.4,GOLD,92);
      B.forEach(function(b,i){var k=cl((t-C[b[0]])/0.4);if(k<=0)return;var y=820+i*300;out+='<g transform="translate(540,'+y+') rotate('+(i%2?3:-3)+') scale('+back(k)+')"><rect x="-380" y="-110" width="760" height="220" rx="40" fill="'+b[3]+'" stroke="#1a1a1a" stroke-width="9"/><circle cx="-270" cy="0" r="80" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><text x="-270" y="34" text-anchor="middle" font-size="90">'+b[1]+'</text><text x="60" y="30" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="86" fill="#fff" stroke="#1a1a1a" stroke-width="12" paint-order="stroke">'+b[2]+'</text></g>';
        if(b[0]==='pr2'&&t<C.pr3+0.5){var yr=2000+Math.floor((t-C.pr2)*14);out+='<text x="900" y="'+(y-120)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="48" fill="#fff" stroke="#1a1a1a" stroke-width="8" paint-order="stroke">'+yr+'…</text>';}
        if(b[0]==='pr3'){var lk=cl((t-C.pr3-0.3)/0.3);out+='<g transform="translate(900,'+(y-110)+') scale('+back(lk)+')"><path d="M-26 -10 L -26 -40 C -26 -70 26 -70 26 -40 L 26 '+(-10-20*(1-lk))+'" fill="none" stroke="#1a1a1a" stroke-width="12"/><rect x="-44" y="-12" width="88" height="70" rx="12" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="7"/></g>';}});}
    else if(t<C.ac){var tilt=L(-10,16,eio(cl((t-C.pr5-0.2)/0.8)));out+='<g transform="translate(540,1060) scale(1.05) translate(-540,-1000)">'+balance(540,1000,tilt,t,function(x,y){return oudChunk(x,y,1.0);})+'</g>';
      if(t<C.pr5){var v=Math.floor((t-C.pr4)*997)%1000;out+=chip('💲 $$$ '+String(1000+v).slice(1)+' …',540,520,(t-C.pr4)/0.35,'#fff',56);}
      else{out+=chip('GRAMO X GRAMO > ORO 💰',540,520,(t-C.pr5)/0.35,GOLD,52);out+=sparkles(930,1330,200,t,8);}}
    else{var k=ent(C.ac);var cx=540,cy=1120;
      out+='<g transform="translate('+cx+','+cy+') scale('+back(cl((t-C.ac)/0.5))+')"><path d="M-50 -280 L 50 -280 L 50 -120 L 200 140 C 220 190 190 220 150 220 L -150 220 C -190 220 -220 190 -200 140 L -50 -120 Z" fill="#EAF6FF" stroke="#1a1a1a" stroke-width="9" stroke-linejoin="round"/><path d="M-110 30 L 110 30 L 190 160 C 200 190 180 205 150 205 L -150 205 C -180 205 -200 190 -190 160 Z" fill="#8E6CF5"/>';
      for(var i=0;i<8;i++){var ph=((t*0.9+i/8)%1);out+='<circle cx="'+(-120+hsh(i)*240)+'" cy="'+(190-ph*400)+'" r="'+(10+ph*10)+'" fill="#C9B8FF" stroke="#1a1a1a" stroke-width="3" opacity="'+(1-ph)+'"/>';}out+='</g>';
      out+=smoke(cx,cy-300,t,7,'#C9B8FF');
      out+=chip('🧪 ACORDE DE OUD',540,520,(t-C.ac)/0.35,'#C9B8FF',52);
      if(t>=C.ac2){out+=chip('= RECREACIÓN',300,1480,(t-C.ac2)/0.35,'#fff',44,-4);out+=chip('MÁS ACCESIBLE ✅',780,1480,(t-C.ac2-1)/0.35,'#9FE08A',44,4);}}
  }
  // ── IMPORTANCIA y alma árabe
  if(t>=C.im&&t<C.end){bg='#2A1A12';
    if(t<C.im3){var B=[['im','🌊','PROFUNDIDAD','#3DB8F5'],['im2','🌙','MISTERIO','#8E6CF5'],['im2b','⏳','DURACIÓN','#F0A21A']];
      out+=title('EL OUD LE DA…',560,(t-C.im)/0.4,'#fff',100);
      B.forEach(function(b,i){var t0=b[0]==='im2b'?C.im2+1.1:C[b[0]];var k=cl((t-t0)/0.4);if(k<=0)return;var y=830+i*290;out+='<g transform="translate(540,'+y+') rotate('+(i%2?3:-3)+') scale('+back(k)+')"><rect x="-360" y="-105" width="720" height="210" rx="40" fill="'+b[3]+'" stroke="#1a1a1a" stroke-width="9"/><circle cx="-250" cy="0" r="76" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><text x="-250" y="32" text-anchor="middle" font-size="84">'+b[1]+'</text><text x="70" y="28" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="78" fill="#fff" stroke="#1a1a1a" stroke-width="12" paint-order="stroke">'+b[2]+'</text></g>';});}
    else if(t<C.cta){var k=ent(C.im3);
      out+='<path d="M780 640 A 90 90 0 1 0 860 760 A 70 70 0 1 1 780 640 Z" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="6" opacity="'+k+'"/>';
      [[270,1300,'#7A2E3E',1.35],[540,1220,'#1E5E5A',1.65],[810,1300,'#4A2E7A',1.35]].forEach(function(b,i){var kk=cl((t-C.im3-i*0.2)/0.4);if(kk<=0)return;out+=smoke(b[0],b[1]-200*b[3],t+i,6,'#F4D27A');out+='<g transform="translate('+b[0]+','+b[1]+') scale('+back(kk)+')">'+arabBottle(0,0,b[3],b[2],t)+'</g>';});
      out+=sparkles(540,1120,360,t,10);
      out+=chip('✨ EL ALMA DE LOS PERFUMES ÁRABES',540,520,(t-C.im3)/0.35,GOLD,42);}
    else{out+=photo('topgrade',540,1050,780,560,-3,cl((t-C.cta)/0.3),'¿PROBÁS UNO CON OUD? 🤎');out+=sparkles(540,1050,460,t,12);}
  }
  out+='<rect width="1080" height="1920" fill="url(#vig)"/>';
  document.getElementById('bgc').style.background=bg;
  document.getElementById('sv').innerHTML=out;
  renderSubs2(t);
  var E=document.getElementById('end');var eOn=t>=C.end;E.style.display=eOn?'block':'none';
  if(eOn){var k=eio(cl((t-C.end)/0.4));E.style.opacity=k;['eA','eB','eC','eD'].forEach(function(id,i){var kk=cl((t-C.end-0.2-i*0.3)/0.4);document.getElementById(id).style.transform='translateY('+((1-eio(kk))*60)+'px) scale('+L(.85,1,cl(back(kk)))+')';document.getElementById(id).style.opacity=cl(kk*2.5);});}
  hkRender(t);
}
var subLine=-1;
function renderSubs2(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t>=C.end||t<C.ar){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(oud|aquilaria|herida|hongo|resina|vetas|remojo|destilan|mililitros|india|camboya|tailandia|laos|malasia|indonesia|escaso|protegido|oro|acorde|profundidad|misterio|duración|árabes|belle)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:;…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
