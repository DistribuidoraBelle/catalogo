// ═══════════ SERIE · ARMAF ODYSSEY · PARTE 1 (LOS DULCES) — v2 ═══════════
var C=window.CUES;
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var PAL=['#FF4F8B','#3DB8F5','#F0A21A','#22C3B0','#8E6CF5','#FF5A4E'];
var GOLD='#F4C542';
var P=[
 {k:'p1',q:'q1',n:'n1',i:'i1',end:'p2',cut:'b2046.png',name:'MANDARIN SKY',sub:'FOR MEN · EDP',bg:'#FF8A3D',bg2:'#FFB347',theme:'naranja',
  quote:'Un atardecer naranja que se derrite en caramelo.',
  N:[['mandarina','Mandarina'],['naranja','Naranja'],['caramelo','Caramelo'],['tonka','Haba tonka'],['cedro','Cedro'],['ambargris','Ambroxan']],
  A:[['Cítrico',100,'#E8C430'],['Caramelo',90,'#D48C30'],['Dulce',80,'#E87AAA'],['Ámbar',70,'#D4A020']],
  ins:{img:'f68074.png',n:'Scandal Pour Homme',m:'logo_jpg.png'}},
 {k:'p2',q:'q2',n:'n2',i:'i2',end:'p3',cut:'b2047.png',name:'MANDARIN SKY',sub:'ELIXIR',bg:'#1E3A8A',bg2:'#3B6FE0',theme:'noche',
  quote:'El mismo cielo… pero de noche.',
  N:[['vainilla','Vainilla'],['incienso','Incienso'],['pimienta','Pimienta negra'],['mandarina','Mandarina'],['caramelo','Caramelo'],['vetiver','Vetiver']],
  A:[['Cítrico',100,'#E8C430'],['Avainillado',90,'#D4A830'],['Dulce',80,'#E87AAA'],['Caramelo',70,'#D48C30']],
  ins:{img:'b_scandal_lp.png',n:'Scandal Le Parfum',m:'logo_jpg.png'}},
 {k:'p3',q:'q3',n:'n3',i:null,end:'p4',cut:'b2481.png',name:'MANDARIN SKY',sub:'VINTAGE EDITION',bg:'#B07A3E',bg2:'#E3B77A',theme:'vintage',
  quote:'Una foto vieja que todavía huele a verano.',
  N:[['mandarina','Mandarina'],['naranja','Naranja'],['salvia','Salvia'],['caramelo','Caramelo'],['tonka','Haba tonka'],['vetiver','Vetiver']],
  A:[['Cítrico',100,'#E8C430'],['Caramelo',90,'#D48C30'],['Dulce',80,'#E87AAA'],['Ámbar',70,'#D4A020']],
  ins:{img:'f68074.png',n:'Scandal Pour Homme',m:'logo_jpg.png',misma:true}},
 {k:'p4',q:'q4',n:'n4',i:'i4',end:'p5',cut:'b2380.png',name:'BLACK FOREST',sub:'GOURMAND · EDP',bg:'#4A1622',bg2:'#8E2A3E',theme:'cereza',
  quote:'Un postre prohibido que se lleva en la piel.',
  N:[['cereza','Cereza'],['miel','Miel'],['praline','Praliné'],['caramelo','Caramelo'],['vainilla','Vainilla'],['canela','Canela']],
  A:[['Dulce',100,'#E87AAA'],['Avainillado',90,'#D4A830'],['Caramelo',80,'#D48C30'],['Acerezado',70,'#B03A60']],
  ins:null},
 {k:'p5',q:'q5',n:'n5',i:'q5',end:'p6',cut:'b2038.png',name:'DUBAI CHOCOLAT',sub:'GOURMAND · EDP',bg:'#5E8A2E',bg2:'#9CCB5A',theme:'choco',
  quote:'El capricho más viral del mundo, hecho perfume.',
  N:[['pistacho','Pistacho'],['chocolate','Chocolate'],['galleta','Knafeh'],['cafe','Café'],['avellana','Avellana'],['caramelo','Caramelo']],
  A:[['Cálido especiado',100,'#C45A1A'],['Dulce',90,'#E87AAA'],['Amaderado',80,'#8B5E3C'],['Café',60,'#5C3420']],
  ins:{choco:true,n:'Chocolate de Dubái'}},
 {k:'p6',q:'q6',n:'n6',i:'i6',end:'p7',cut:'b2037.png',name:'CANDEE',sub:'FEMME · EDP',bg:'#FF5C9A',bg2:'#FF9CC2',theme:'feria',
  quote:'Una tarde de feria, dulce y coqueta.',
  N:[['frutilla','Frutilla'],['frambuesa','Frambuesa'],['caramelo','Caramelo'],['durazno','Durazno'],['jazmin','Jazmín'],['maracuya','Maracuyá']],
  A:[['Afrutado',100,'#E8703A'],['Dulce',90,'#E87AAA'],['Pachulí',80,'#7A5A3A'],['Caramelo',70,'#D48C30']],
  ins:{img:'f75968.png',n:'Burberry Her Elixir',m:'logo_burberry.png'}},
 {k:'p7',q:'q7',n:'n7',i:'i7',end:'out',cut:'b2638.png',name:'MARSHMALLOW',sub:'FEMME · EDP',bg:'#4FB3D9',bg2:'#A8E2F5',theme:'nube',
  quote:'Suave como una nube de azúcar.',
  N:[['malvavisco','Malvavisco'],['vainilla','Vainilla'],['praline','Praliné'],['coco','Coco'],['frutilla','Frutilla'],['almizcle','Almizcle']],
  A:[['Dulce',100,'#E87AAA'],['Afrutado',80,'#E8703A'],['Atalcado',60,'#D4B0C4'],['Avainillado',50,'#D4A830']],
  ins:{img:'f99254.png',n:'Yum Boujee Marshmallow',mt:'KAYALI'}}
];
function star(x,y,s,op,col){return '<path d="M'+x+' '+(y-s)+' L '+(x+s*0.28)+' '+y+' L '+x+' '+(y+s)+' L '+(x-s*0.28)+' '+y+' Z" fill="'+(col||'#fff')+'" opacity="'+(op==null?1:op)+'"/>';}
function chip(txt,x,y,k,col,fs,rot,tc){fs=fs||40;var w=txt.length*fs*0.56+64;return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+back(cl(k))+')"><rect x="'+(-w/2+6)+'" y="'+(-fs*0.95+7)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="rgba(0,0,0,.3)"/><rect x="'+(-w/2)+'" y="'+(-fs*0.95)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="6"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="'+(tc||'#1a1a1a')+'">'+txt+'</text></g>';}
function img(href,cx,cy,h,k,rot,extra){if(k<=0)return '';var b=back(cl(k));return '<image href="fotos/'+href+'" x="'+(cx-h*0.6)+'" y="'+(cy-h/2)+'" width="'+(h*1.2)+'" height="'+h+'" preserveAspectRatio="xMidYMid meet" transform="rotate('+(rot||0)+' '+cx+' '+cy+') translate('+cx+','+cy+') scale('+b+') translate('+(-cx)+','+(-cy)+')" '+(extra||'')+'/>';}
function rays(cx,cy,R,t,col,n,op){var s='';n=n||16;for(var i=0;i<n;i++){var a=i*6.283/n+t*0.25;s+='<path d="M'+cx+' '+cy+' L '+(cx+Math.cos(a)*R)+' '+(cy+Math.sin(a)*R)+' L '+(cx+Math.cos(a+0.12)*R)+' '+(cy+Math.sin(a+0.12)*R)+' Z" fill="'+col+'" opacity="'+(op||0.18)+'"/>';}return s;}
// letras que saltan una por una
function cw(ch){return /[IJ1Í]/.test(ch)?0.34:/[ ]/.test(ch)?0.32:/[MW]/.test(ch)?0.82:/[¿?]/.test(ch)?0.5:0.64;}
function popWord(txt,x,y,fs,t,t0,fill,shadow,stroke){var s='',w=0;for(var i=0;i<txt.length;i++)w+=cw(txt[i])*fs;var xx=x-w/2;for(var i=0;i<txt.length;i++){var ch=txt[i],cwi=cw(ch)*fs;var cx=xx+cwi/2;xx+=cwi;if(ch===' ')continue;var k=cl((t-t0-i*0.045)/0.3);if(k<=0)continue;var b=back(k);var bob=Math.sin(t*3+i*0.6)*4;
  s+='<g transform="translate('+cx+','+(y+bob)+') scale('+b+') rotate('+((1-k)*30)+')"><text x="10" y="12" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="'+(shadow||'#1a1a1a')+'">'+ch+'</text><text text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="'+(fill||'#fff')+'" stroke="'+(stroke||'#1a1a1a')+'" stroke-width="'+(fs*0.12)+'" paint-order="stroke">'+ch+'</text></g>';}return s;}
function typewriter(txt,x,y,fs,t,t0,dur,col){var n=Math.floor(cl((t-t0)/dur)*txt.length);if(n<=0)return '';var s=txt.slice(0,n);var cur=(Math.floor(t*3)%2&&n<txt.length)?'|':'';return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Playfair Display" font-style="italic" font-weight="800" font-size="'+fs+'" fill="'+(col||'#1a1a1a')+'">'+s+cur+'</text>';}
function chocoBar(cx,cy,s,rot){var o='<g transform="translate('+cx+','+cy+') rotate('+(rot||-8)+') scale('+s+')"><rect x="-130" y="-70" width="260" height="140" rx="14" fill="#4A2614" stroke="#1a1a1a" stroke-width="7"/>';for(var i=0;i<4;i++)o+='<path d="M'+(-130+i*65)+' -70 L '+(-130+i*65)+' 70" stroke="#2E160A" stroke-width="4"/>';
  o+='<path d="M-130 0 L 130 0" stroke="#2E160A" stroke-width="4"/><path d="M40 -70 L 130 -70 L 130 70 L 70 70 Q 50 30 90 0 Q 50 -30 40 -70 Z" fill="#9CCB5A" stroke="#1a1a1a" stroke-width="5"/>'+[[100,-40],[110,20],[80,40],[95,-10]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="#6E9A30"/>';}).join('')+'</g>';return o;}
// partículas temáticas
function theme(th,t,lt,idx){var s='';
  if(th==='naranja'){for(var i=0;i<14;i++){var ph=((t*0.12+hsh(i+idx))%1);s+=nota(i%2?'naranja':'mandarina',hsh(i*3)*1080,-100+ph*2100,0.7+hsh(i)*0.5,t*60*(i%2?1:-1)+i*40);}}
  if(th==='noche'){for(var i=0;i<50;i++){var tw=0.4+0.6*Math.abs(Math.sin(t*2+i));s+=star(hsh(i*3)*1080,hsh(i*7)*1900,4+hsh(i)*10,tw);}s+='<circle cx="880" cy="230" r="70" fill="#FFF3C4" opacity=".9"/><circle cx="910" cy="210" r="62" fill="'+'#1E3A8A'+'"/>';for(var i=0;i<6;i++){var ph=((t*0.15+i/6)%1);s+='<circle cx="'+(200+i*140+Math.sin(ph*6+i)*40)+'" cy="'+(1900-ph*1700)+'" r="'+(30+ph*60)+'" fill="#C9D4FF" opacity="'+(0.12*(1-ph))+'"/>';}}
  if(th==='vintage'){for(var i=0;i<8;i++){var x=hsh(i*3+Math.floor(t*8))*1080;s+='<path d="M'+x+' 0 L '+(x+4)+' 1920" stroke="#3A2414" stroke-width="2" opacity=".15"/>';}for(var i=0;i<10;i++){var ph=((t*0.1+hsh(i))%1);s+=nota('naranja',hsh(i*5)*1080,-100+ph*2100,0.6,t*40+i*30).replace('<g ','<g opacity=".6" ');}}
  if(th==='cereza'){for(var i=0;i<16;i++){var ph=((t*0.14+hsh(i+3))%1);s+=nota('cereza',hsh(i*3)*1080,-100+ph*2100,0.8+hsh(i)*0.5,Math.sin(t*2+i)*20);}}
  if(th==='choco'){s+='<path d="M0 0 L 1080 0 L 1080 60 '+[0,1,2,3,4,5,6,7,8].map(function(i){var x=1080-i*135,d=80+60*Math.abs(Math.sin(t*0.8+i));return 'Q '+(x-30)+' 60 '+(x-40)+' '+d+' Q '+(x-67)+' '+(d+50)+' '+(x-95)+' '+d+' Q '+(x-105)+' 60 '+(x-135)+' 60';}).join(' ')+' L 0 0 Z" fill="#4A2614" stroke="#1a1a1a" stroke-width="6"/>';for(var i=0;i<12;i++){var ph=((t*0.13+hsh(i))%1);s+=nota(i%3?'pistacho':'avellana',hsh(i*3)*1080,-100+ph*2100,0.7,t*50+i*30);}}
  if(th==='feria'){for(var i=0;i<16;i++){var ph=((t*0.12+hsh(i+5))%1);var x=hsh(i*3)*1080;s+=i%2?nota('frutilla',x,-100+ph*2100,0.7,t*40+i*30):'<text x="'+x+'" y="'+(-100+ph*2100)+'" font-size="70">'+['🍭','🍬','💖'][i%3]+'</text>';}}
  if(th==='nube'){for(var i=0;i<8;i++){var x=((t*30*(0.5+hsh(i))+hsh(i*3)*1400)%1500)-200,y=150+hsh(i*7)*1600,r=60+hsh(i)*50;s+='<g opacity=".85"><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff"/><circle cx="'+(x+r*0.9)+'" cy="'+(y+10)+'" r="'+(r*0.75)+'" fill="#fff"/><circle cx="'+(x-r*0.9)+'" cy="'+(y+14)+'" r="'+(r*0.7)+'" fill="#fff"/></g>';}for(var i=0;i<10;i++){var ph=((t*0.1+hsh(i+9))%1);s+=nota('malvavisco',hsh(i*5)*1080,-100+ph*2100,0.7,t*30+i*30);}}
  return s;}
function render(t){
  var out='',bg='#2B1D4E';var ent=function(t0){return eio(cl((t-t0)/0.5));};
  out+='<defs><linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset=".5" stop-color="#F4C542"/><stop offset="1" stop-color="#C98A12"/></linearGradient><radialGradient id="halo"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="spot"><stop offset="0" stop-color="#FFF6CC" stop-opacity=".8"/><stop offset="1" stop-color="#FFF6CC" stop-opacity="0"/></radialGradient><linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="rm"><rect x="0" y="0" width="1080" height="1920" fill="url(#refl)"/></mask></defs>';
  // ── INTRO CINEMÁTICO
  if(t<C.p1){bg='#170F2E';
    out+=rays(540,820,1500,t,'#8E6CF5',24,0.14)+rays(540,820,1500,-t*0.7,'#F4C542',12,0.08);
    // ODYSSEY: letras doradas que vuelan desde el espacio
    var L_='ODYSSEY',fs=210,w=L_.length*fs*0.62,x0=540-w/2,yT=t<C.h4?560:420;
    for(var i=0;i<L_.length;i++){var k=eio(cl((t-0.05-i*0.07)/0.6));var sx=540+(hsh(i)-0.5)*1600,sy=-300+hsh(i*3)*400;var cx=L(sx,x0+(i+0.5)*fs*0.62,k),cy=L(sy,yT,k);var sc=L(4,1,k),rot=(1-k)*(hsh(i*5)-0.5)*720;
      out+='<g transform="translate('+cx+','+cy+') rotate('+rot+') scale('+sc+')" opacity="'+cl(k*2)+'"><text x="10" y="14" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#000" opacity=".5">'+L_[i]+'</text><text text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="url(#gGold)" stroke="#5A3A00" stroke-width="6">'+L_[i]+'</text></g>';}
    var sw=((t-0.9)*0.7)%1.6;if(t>0.9){out+='<clipPath id="ttl"><text x="540" y="'+yT+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" letter-spacing="'+(fs*0.02)+'">ODYSSEY</text></clipPath><rect x="'+(-200+sw*900)+'" y="'+(yT-200)+'" width="90" height="260" fill="#fff" opacity=".7" transform="skewX(-20)" clip-path="url(#ttl)"/>';}
    out+='<image href="fotos/logo_armaf.png" x="440" y="'+(yT-470)+'" width="200" height="200" opacity="'+cl((t-0.6)/0.4)+'" style="filter:invert(1)"/>';
    // carrusel 3D de los 7 frascos
    var kc=ent(0.5);var spin=t*0.5+(t>C.h3?(t-C.h3)*1.2:0);var arr=[];
    P.forEach(function(p,i){var a=spin+i*6.283/7;var z=Math.sin(a);arr.push({p:p,x:540+Math.cos(a)*400*kc,y:1220+z*110,s:0.75+z*0.3,z:z});});
    arr.sort(function(a,b){return a.z-b.z;});
    arr.forEach(function(o){out+='<ellipse cx="'+o.x+'" cy="'+(o.y+o.s*190)+'" rx="'+(o.s*120)+'" ry="'+(o.s*20)+'" fill="#000" opacity=".35"/>'+img(o.p.cut,o.x,o.y,380*o.s,kc,0,'opacity="'+(0.55+0.45*(o.z+1)/2)+'"');});
    // textos cinéticos
    if(t>=C.h2&&t<C.h3){var k1=ent(C.h2);out+='<text x="540" y="'+(yT+110)+'" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="46" fill="#fff" letter-spacing="6" opacity="'+k1+'">LA SERIE DE ARMAF QUE</text>'+popWord('CONQUISTÓ EL MUNDO',540,yT+220,86,t,C.h2+0.6,GOLD,'#5A3A00');
      var ga=t*1.5;out+='<g transform="translate(910,'+(yT+150)+') scale('+back(cl((t-C.h2-1)/0.4))+')"><circle r="56" fill="#3DB8F5" stroke="#1a1a1a" stroke-width="6"/><path d="M'+(-30+Math.sin(ga)*20)+' -30 q 20 10 30 40 q -20 10 -30 -10 Z M'+(10+Math.sin(ga)*20)+' 10 q 20 0 20 25 q -15 0 -20 -25 Z" fill="#5FCB7A"/></g>';}
    if(t>=C.h3&&t<C.h4){out+='<text x="540" y="'+(yT+120)+'" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="52" fill="#fff" letter-spacing="4">'+'TE LA EXPLICO'.slice(0,Math.floor(cl((t-C.h3)/0.6)*13))+'</text>'+popWord('PERFUME X PERFUME',540,yT+230,84,t,C.h3+0.6,'#fff','#FF4F8B');}
    if(t>=C.h4){var fl=(t-C.h4)<0.5?(Math.sin((t-C.h4)*60)>0?1:0.3):1;out+='<g opacity="'+fl+'"><rect x="140" y="'+(yT+90)+'" width="800" height="230" rx="40" fill="none" stroke="#FF4F8B" stroke-width="14" style="filter:drop-shadow(0 0 18px #FF4F8B)"/><text x="540" y="'+(yT+185)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="70" fill="#FFD6E8" style="filter:drop-shadow(0 0 14px #FF4F8B)">PARTE 1</text><text x="540" y="'+(yT+280)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="92" fill="#fff" style="filter:drop-shadow(0 0 16px #FF4F8B)">LOS DULCES 🍬</text></g>';
      for(var i=0;i<14;i++){var ph=((t-C.h4)*0.7+hsh(i))%1;out+='<text x="'+(hsh(i*3)*1080)+'" y="'+(-80+ph*2000)+'" font-size="70">'+['🍬','🍭','🍫','🍒'][i%4]+'</text>';}}
  }
  // ── PERFUMES
  P.forEach(function(p,idx){var t0=C[p.k],t1=C[p.end];if(t<t0-0.05||t>=t1)return;var lt=t-t0;bg=p.bg;
    out+='<rect width="1080" height="1920" fill="'+p.bg2+'" opacity=".0"/>';
    out+='<circle cx="540" cy="900" r="1400" fill="'+p.bg2+'" opacity=".55"/>';
    out+=theme(p.theme,t,lt,idx);
    // iris de entrada
    var ik=cl(lt/0.45);if(ik<1)out+='<circle cx="540" cy="900" r="'+(1500*(1-eio(ik)))+'" fill="none" stroke="'+p.bg2+'" stroke-width="'+(3000*(1-ik))+'" opacity=".9"/>';
    var insT=p.i?C[p.i]:(p.ins&&p.ins.misma?C[p.q]+1.2:1e9);var inK=p.ins?eio(cl((t-insT)/0.6)):0;
    // índice
    out+='<g transform="translate(120,170) rotate('+(Math.sin(t*2)*6)+') scale('+back(cl(lt/0.35))+')"><circle r="62" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="6"/><text y="-6" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40">'+(idx+1)+'/7</text><text y="28" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="16">ODYSSEY</text></g>';
    // nombre
    out+=popWord(p.name,540,310,p.name.length>12?96:116,t,t0+0.05,'#fff',p.bg2==='#A8E2F5'?'#2E6E8A':'#1a1a1a');
    out+=chip(p.sub,540,400,(lt-0.5)/0.35,'#1a1a1a',30,-2,'#fff');
    // frasco
    var bx=L(540,290,inK),bs=L(1,0.72,inK),by=930+Math.sin(t*2)*12;var dk=cl((lt-0.15)/0.55);var drop=(1-eio(dk))*-900;
    out+=rays(bx,by,700,t,'#fff',18,0.2)+'<circle cx="'+bx+'" cy="'+by+'" r="'+(360*bs)+'" fill="url(#halo)"/>';
    out+='<ellipse cx="'+bx+'" cy="'+(by+310*bs)+'" rx="'+(230*bs)+'" ry="'+(30*bs)+'" fill="#000" opacity=".3"/>';
    out+='<g transform="translate(0,'+drop+')">'+img(p.cut,bx,by,620*bs,dk,Math.sin(t*1.5)*3)+'</g>';
    if(dk>0.85&&dk<1)out+='<circle cx="'+bx+'" cy="'+(by+300)+'" r="'+(200+(dk-0.85)*2000)+'" fill="none" stroke="#fff" stroke-width="10" opacity="'+((1-dk)*6)+'"/>';
    // notas que salen del frasco y orbitan
    var nk=cl((t-C[p.n])/0.8);var fade=1-inK;if(nk>0&&fade>0.02){p.N.forEach(function(n_,j){var kj=cl((t-C[p.n]-j*0.12)/0.7);if(kj<=0)return;var a=-Math.PI/2+j*6.283/6+t*0.25;var R=L(0,1,eio(kj));var x=bx+Math.cos(a)*400*R,y=by+Math.sin(a)*285*R;
        out+='<g opacity="'+fade+'" transform="translate('+x+','+y+') scale('+back(kj)+')"><circle r="74" fill="#fff" stroke="#1a1a1a" stroke-width="6"/></g>'+'<g opacity="'+fade+'">'+nota(n_[0],x,y-6,0.8*back(kj),Math.sin(t*2+j)*8)+'<g transform="translate('+x+','+(y+80)+') scale('+back(kj)+')"><rect x="'+(-n_[1].length*11-16)+'" y="-22" width="'+(n_[1].length*22+32)+'" height="40" rx="20" fill="#1a1a1a"/><text y="8" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="26" fill="#fff">'+n_[1]+'</text></g></g>';});}
    // frase poética
    var qk=cl((t-C[p.q])/0.35);if(qk>0){var qy=505;out+='<g transform="translate(540,'+qy+') rotate(-2) scale('+back(qk)+')"><path d="M-500 -60 L 500 -60 L 470 0 L 500 60 L -500 60 L -470 0 Z" fill="#FFF8E6" stroke="#1a1a1a" stroke-width="7"/><text x="-470" y="-12" font-family="Playfair Display" font-size="90" fill="'+p.bg+'">“</text><text x="470" y="62" text-anchor="end" font-family="Playfair Display" font-size="90" fill="'+p.bg+'">”</text></g>'+typewriter(p.quote,540,qy+16,p.quote.length>40?34:42,t,C[p.q]+0.2,1.6,'#1a1a1a');}
    // acordes en burbujas
    var ak=cl((t-C[p.n]-1.2)/0.4);if(ak>0){p.A.forEach(function(a,j){var kk=cl((t-C[p.n]-1.2-j*0.15)/0.4);if(kk<=0)return;var x=150+j*260,y=1385;var r=40+a[1]*0.26;var pulse=1+0.05*Math.sin(t*4+j);
        out+='<g opacity="'+(1-inK)+'" transform="translate('+x+','+y+') scale('+(back(kk)*pulse)+')"><circle r="'+r+'" fill="'+a[2]+'" stroke="#1a1a1a" stroke-width="6"/><text y="10" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="34" fill="#fff" stroke="#1a1a1a" stroke-width="6" paint-order="stroke">'+Math.round(a[1]*cl(kk*1.5))+'%</text><text y="'+(r+34)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(a[0].length>10?22:28)+'" fill="#fff" stroke="#1a1a1a" stroke-width="6" paint-order="stroke">'+a[0]+'</text></g>';});}
    // inspiración: VS
    if(inK>0){var ox=L(1300,800,inK);out+='<circle cx="'+ox+'" cy="'+by+'" r="330" fill="url(#spot)"/>'+rays(ox,by,500,-t,GOLD,14,0.22);
      if(p.ins.choco)out+=chocoBar(ox,by,1.4*inK,Math.sin(t*2)*6);else out+=img(p.ins.img,ox,by,560,inK,Math.sin(t*1.7)*3);
      var vk=cl((t-insT-0.3)/0.35);out+='<g transform="translate(560,'+(by-40)+') rotate(-10) scale('+back(vk)+')"><circle r="70" fill="#E5322B" stroke="#1a1a1a" stroke-width="7"/><text y="22" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="62" fill="#fff">VS</text></g>';
      var bk=cl((t-insT-0.5)/0.4);out+='<g transform="translate(540,1470) scale('+back(bk)+')"><rect x="-480" y="-90" width="960" height="180" rx="34" fill="#1a1a1a" stroke="'+GOLD+'" stroke-width="7"/><text x="-440" y="-28" font-family="Baloo 2" font-weight="800" font-size="32" fill="'+GOLD+'">'+(p.ins.misma?'⚡ MISMA INSPIRACIÓN':'⚡ SE INSPIRA EN')+'</text><text x="-440" y="40" font-family="Baloo 2" font-weight="800" font-size="'+(p.ins.n.length>20?44:54)+'" fill="#fff">'+p.ins.n+'</text>'+(p.ins.m?'<image href="fotos/'+p.ins.m+'" x="200" y="-60" width="250" height="120" preserveAspectRatio="xMidYMid meet" style="filter:invert(1)"/>':p.ins.mt?'<text x="330" y="22" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="46" letter-spacing="12" fill="#fff">'+p.ins.mt+'</text>':'<text x="330" y="22" text-anchor="middle" font-size="80">🍫</text>')+'</g>';}
    else if(!p.ins&&p.i&&t>=C[p.i]){var sk=cl((t-C[p.i])/0.4);out+='<g transform="translate(540,1470) rotate(-4) scale('+back(sk)+')"><rect x="-440" y="-90" width="880" height="180" rx="90" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="8"/><text y="-6" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="62">✨ COMPOSICIÓN PROPIA</text><text y="52" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="32">ADN 100% ARMAF</text></g>';for(var j=0;j<10;j++){var a=j*0.628+t;out+=star(540+Math.cos(a)*520,1470+Math.sin(a)*140,14+6*Math.sin(t*5+j),1,GOLD);}}
  });
  // ── CIERRE
  if(t>=C.out&&t<C.end){bg='#170F2E';out+=rays(540,1100,1500,t,'#8E6CF5',24,0.14);
    out+=popWord('¿CUÁL ES TU',540,420,104,t,C.out,'#fff')+popWord('ODYSSEY?',540,560,150,t,C.out+0.4,GOLD,'#5A3A00');
    var spin=t*0.8;var arr=[];P.forEach(function(p,i){var a=spin+i*6.283/7;var z=Math.sin(a);arr.push({p:p,x:540+Math.cos(a)*400,y:1100+z*110,s:0.75+z*0.3,z:z});});arr.sort(function(a,b){return a.z-b.z;});
    arr.forEach(function(o){out+=img(o.p.cut,o.x,o.y,380*o.s,ent(C.out+0.2),0);});
    if(t>=C.out2){out+=chip('🔥 PARTE 2: LOS INTENSOS',540,1450,(t-C.out2)/0.35,'#E5322B',48,-3,'#fff');for(var i=0;i<6;i++){var ph=((t*1.2+i/6)%1);out+='<text x="'+(260+i*110)+'" y="'+(1530-ph*120)+'" font-size="56" opacity="'+(1-ph)+'">🔥</text>';}}
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
  if(cur===null||t>=C.end||t<C.p1){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(odyssey|scandal|elixir|vintage|composición|propia|chocolate|candee|marshmallow|belle|caramelo|mandarina|cielo|noche|postre|feria|nube)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:;…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
