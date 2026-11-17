// ═══════════ SERIE · ARMAF ODYSSEY · PARTE 2 (LOS INTENSOS) ═══════════
var C=window.CUES;
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var PAL=['#FF4F8B','#3DB8F5','#F0A21A','#22C3B0','#8E6CF5','#FF5A4E'];
var GOLD='#F4C542';
var P=[
 {k:'p1',mk:['👔 TU PERFUME','FIRMA'],mc:'m1',q:'q1',n:'n1',i:'i1',end:'p2',cut:'b64464.png',name:'HOMME',sub:'ODYSSEY · EDP',bg:'#A8740F',bg2:'#E0AC34',theme:'lujo',
  quote:'Como un traje a medida que huele a lujo.',
  N:[['cardamomo','Cardamomo'],['neroli','Neroli'],['vainilla','Vainilla'],['azahar','Azahar'],['sandalo','Sándalo'],['ambar','Ámbar']],
  A:[['Ámbar',100,'#D4A020'],['Cálido especiado',90,'#C45A1A'],['Avainillado',80,'#D4A830'],['Atalcado',70,'#D4B0C4']],
  ins:{img:'f29675.png',n:'Tom Ford Noir Extreme',mt:'TOM FORD'}},
 {k:'p2',mk:['💘 IMÁN DE','ELOGIOS'],mc:'m2',q:'q2',n:'n2',i:'i2',end:'p3',cut:'b64466.png',name:'HOMME WHITE',sub:'WHITE EDITION · EDP',bg:'#2F6FDB',bg2:'#6FA6FF',theme:'elogio',
  quote:'Dulce, limpio y seductor, como una camisa blanca.',
  N:[['mandarina','Mandarina'],['vainilla','Vainilla'],['cardamomo','Cardamomo'],['iris','Iris'],['cuero','Cuero'],['sandalo','Sándalo']],
  A:[['Ámbar',100,'#D4A020'],['Amaderado',90,'#8B5E3C'],['Cítrico',80,'#E8C430'],['Especiado suave',70,'#C44A1A']],
  ins:{img:'f45258.png',n:'Stronger With You',m:'logo_ea.png'}},
 {k:'p3',mk:['🚀 PROYECCIÓN','BESTIAL'],mc:'m3',q:'q3',n:'n3',i:'i3',end:'p8',cut:'b98692.png',name:'SPECTRA',sub:'ODYSSEY · EDP',bg:'#6A2FD6',bg2:'#A57CFF',theme:'neon',
  quote:'Dulce, potente, imposible de ignorar.',
  N:[['canela','Canela'],['manzana','Manzana'],['lavanda','Lavanda'],['vainilla','Vainilla'],['tabaco','Tabaco'],['tonka','Haba tonka']],
  A:[['Avainillado',100,'#D4A830'],['Cálido especiado',90,'#C45A1A'],['Canela',80,'#C46830'],['Ámbar',70,'#D4A020']],
  ins:{img:'f30947.png',n:'Ultra Male',m:'logo_jpg.png'}},
 {k:'p8',mk:['💙 PARA','COLECCIONISTAS'],mc:'m8',q:'q8',n:'n8',i:'i8',end:'p4',cut:'b115140.png',name:'SPECTRA BLUE',sub:'BLUE EDITION · EDP',bg:'#1749A8',bg2:'#4F86E8',theme:'neon',
  quote:'El mismo fuego del Spectra… vestido de azul.',
  N:[['canela','Canela'],['manzana','Manzana'],['lavanda','Lavanda'],['tabaco','Tabaco'],['vainilla','Vainilla'],['tonka','Haba tonka']],
  A:[['Avainillado',100,'#D4A830'],['Cálido especiado',90,'#C45A1A'],['Canela',80,'#C46830'],['Ámbar',70,'#D4A020']],
  ins:{img:'f30947.png',n:'Ultra Male',m:'logo_jpg.png'}},
 {k:'p4',mk:['🌴 VERANO','TODO EL AÑO'],mc:'m4',q:'q4',n:'n4',i:'i4',end:'p5',cut:'b106710.png',name:'ARTISTO',sub:'ODYSSEY · EDP',bg:'#0FA394',bg2:'#5FD8C6',theme:'tropical',
  quote:'Un verano en la piel… pero en versión noche.',
  N:[['coco','Coco'],['tonka','Haba tonka'],['mango','Frutas tropicales'],['vainilla','Vainilla'],['canela','Canela'],['bergamota','Bergamota']],
  A:[['Avainillado',100,'#D4A830'],['Ámbar',90,'#D4A020'],['Coco',80,'#E9DFC8'],['Tropical',60,'#F8C346']],
  ins:{img:'f55785.png',n:'Le Beau Le Parfum',m:'logo_jpg.png'}},
 {k:'p5',mk:['⚡ ÚNICO','CON ACTITUD'],mc:'m5',q:'q5',n:'n5',i:'i5',end:'p6',cut:'b109770.png',name:'REVOLUTION',sub:'ULTRA EDITION · EDP',bg:'#D7262E',bg2:'#FF6A5E',theme:'rayo',
  quote:'Frutal, dulce y con actitud.',
  N:[['anana','Ananá'],['mora','Grosella'],['praline','Praliné'],['vainilla','Vainilla'],['ciruela','Ciruela'],['pachuli','Pachulí']],
  A:[['Dulce',100,'#E87AAA'],['Afrutado',90,'#E8703A'],['Avainillado',80,'#D4A830'],['Aromático',70,'#6AB87A']],
  ins:null},
 {k:'p6',mk:['👑 LUJO','DE NICHO'],mc:'m6',q:'q6',n:'n6',i:'i6',end:'p7',cut:'b83136.png',name:'AOUD',sub:'ODYSSEY · EDP',bg:'#5A1F6B',bg2:'#9A45B0',theme:'palacio',
  quote:'Madera oscura y especias: un palacio árabe.',
  N:[['azafran','Azafrán'],['lavanda','Lavanda'],['oud','Oud'],['nuez','Nuez moscada'],['ambargris','Ambroxan'],['almizcle','Almizcle']],
  A:[['Amaderado',100,'#8B5E3C'],['Oud',90,'#6B3A1A'],['Almizclado',80,'#B09A8A'],['Cálido especiado',70,'#C45A1A']],
  ins:{img:'f53641.png',n:'Oud for Greatness',mt:'INITIO'}},
 {k:'p7',mk:['🤫 JOYITA','ESCONDIDA'],mc:'m7',q:'q7',n:'n7',i:'i7',end:'out',cut:'b109769.png',name:'EAU DE MONTAGNE',sub:'MOUNTAIN EDITION · EDP',bg:'#2D74B5',bg2:'#6AAEE0',theme:'nieve',
  quote:'Suave y cremoso, como una nevada dulce.',
  N:[['almendra','Almendra'],['leche','Leche'],['vainilla','Vainilla'],['cacao','Cacao'],['sandalo','Sándalo'],['almizcle','Almizcle']],
  A:[['Almendrado',100,'#C4945A'],['Atalcado',90,'#D4B0C4'],['Avainillado',80,'#D4A830'],['Cálido especiado',70,'#C45A1A']],
  ins:{img:'f70189.png',n:'Blanche Bête',mt:'LIQUIDES|IMAGINAIRES'}}
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
  if(th==='lujo'){for(var i=0;i<36;i++){var tw=0.3+0.7*Math.abs(Math.sin(t*2.4+i));s+=star(hsh(i*3)*1080,hsh(i*7)*1920,8+hsh(i)*18,tw,'#FFF6D0');}for(var i=0;i<10;i++){var ph=((t*0.1+hsh(i+2))%1);s+=nota(i%2?'cardamomo':'vainilla',hsh(i*5)*1080,-100+ph*2100,0.6,t*40+i*30);}}
  if(th==='elogio'){for(var i=0;i<14;i++){var ph=((t*0.11+hsh(i+4))%1);var x=hsh(i*3)*1080+Math.sin(t+i)*30;s+='<text x="'+x+'" y="'+(2000-ph*2200)+'" font-size="'+(50+hsh(i)*40)+'" opacity="'+(0.8-ph*0.5)+'">'+['💙','🤍','💘','✨'][i%4]+'</text>';}for(var i=0;i<8;i++){var ph=((t*0.09+hsh(i))%1);s+=nota('mandarina',hsh(i*7)*1080,-100+ph*2100,0.55,t*30+i*40);}}
  if(th==='neon'){var RB=['#FF4F4F','#FF9F1C','#FFE14D','#3DDC84','#3DB8F5','#B57BFF'];for(var i=0;i<12;i++){var y=((hsh(i)*1920+t*(120+hsh(i*3)*160))%2200)-140;s+='<rect x="'+(hsh(i*5)*900-100)+'" y="'+y+'" width="'+(220+hsh(i*2)*260)+'" height="18" rx="9" fill="'+RB[i%6]+'" opacity=".55" transform="rotate(-20 540 960)"/>';}for(var i=0;i<8;i++){var ph=((t*0.1+hsh(i+8))%1);s+=nota(i%2?'canela':'manzana',hsh(i*3)*1080,-100+ph*2100,0.6,t*50+i*30);}}
  if(th==='tropical'){for(var i=0;i<6;i++){var sw=Math.sin(t*1.2+i)*6;s+='<text x="'+(i%2?960:-30)+'" y="'+(260+i*300)+'" font-size="190" transform="rotate('+sw+' '+(i%2?1040:50)+' '+(260+i*300)+')" opacity=".9">🌴</text>';}for(var i=0;i<12;i++){var ph=((t*0.12+hsh(i+6))%1);s+=nota(['coco','mango','anana'][i%3],hsh(i*3)*1080,-100+ph*2100,0.65,t*45+i*30);}}
  if(th==='rayo'){for(var i=0;i<5;i++){var f=Math.sin(t*9+i*2)>0.85?1:0.25;var x=120+i*210,y=200+hsh(i)*1400;s+='<path d="M'+x+' '+y+' l 40 -110 l -10 80 l 50 -10 l -60 140 l 10 -80 z" fill="#FFE14D" stroke="#1a1a1a" stroke-width="5" opacity="'+f+'"/>';}for(var i=0;i<12;i++){var ph=((t*0.13+hsh(i+1))%1);s+=nota(i%2?'anana':'mora',hsh(i*5)*1080,-100+ph*2100,0.65,t*55+i*30);}}
  if(th==='palacio'){for(var i=0;i<8;i++){var x=(i%4)*300+90,y=Math.floor(i/4)*1500+260,r=t*15*(i%2?1:-1);s+='<g transform="translate('+x+','+y+') rotate('+r+')" opacity=".22"><rect x="-90" y="-90" width="180" height="180" fill="none" stroke="'+GOLD+'" stroke-width="8"/><rect x="-90" y="-90" width="180" height="180" fill="none" stroke="'+GOLD+'" stroke-width="8" transform="rotate(45)"/><circle r="40" fill="none" stroke="'+GOLD+'" stroke-width="6"/></g>';}for(var i=0;i<26;i++){var tw=0.3+0.7*Math.abs(Math.sin(t*2+i));s+=star(hsh(i*3)*1080,hsh(i*11)*1920,6+hsh(i)*12,tw,GOLD);}for(var i=0;i<8;i++){var ph=((t*0.09+hsh(i+5))%1);s+=nota(i%2?'oud':'azafran',hsh(i*7)*1080,-100+ph*2100,0.6,t*35+i*40);}}
  if(th==='nieve'){s+='<path d="M0 1920 L 0 1500 L 220 1250 L 380 1420 L 600 1150 L 820 1400 L 1080 1200 L 1080 1920 Z" fill="#E8F4FF" opacity=".55"/><path d="M220 1250 L 170 1310 L 270 1310 Z M600 1150 L 540 1220 L 660 1220 Z M1080 1200 L 1010 1270 L 1080 1270 Z" fill="#fff"/>';for(var i=0;i<60;i++){var ph=((t*(0.06+hsh(i)*0.06)+hsh(i*3))%1);s+='<circle cx="'+(hsh(i*5)*1080+Math.sin(t*1.5+i)*25)+'" cy="'+(-20+ph*1960)+'" r="'+(4+hsh(i*2)*7)+'" fill="#fff" opacity=".9"/>';}for(var i=0;i<6;i++){var ph=((t*0.08+hsh(i+9))%1);s+=nota('almendra',hsh(i*7)*1080,-100+ph*2100,0.55,t*30+i*40);}}
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
  out+='<defs><linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset=".5" stop-color="#F4C542"/><stop offset="1" stop-color="#C98A12"/></linearGradient><radialGradient id="halo"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="spot"><stop offset="0" stop-color="#FFF6CC" stop-opacity=".8"/><stop offset="1" stop-color="#FFF6CC" stop-opacity="0"/></radialGradient><linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><radialGradient id="planet" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#FFFBEA"/><stop offset=".45" stop-color="#FFE27A"/><stop offset=".8" stop-color="#E0A21A"/><stop offset="1" stop-color="#9A6A08"/></radialGradient><linearGradient id="rimG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4C2"/><stop offset=".35" stop-color="#F2C230"/><stop offset=".7" stop-color="#C98A12"/><stop offset="1" stop-color="#8A5A00"/></linearGradient><radialGradient id="hotbg" cx=".5" cy=".5" r=".8"><stop offset="0" stop-color="#FF5A36"/><stop offset=".55" stop-color="#C8102E"/><stop offset="1" stop-color="#5E0716"/></radialGradient><radialGradient id="goldbg" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#FFF7D6"/><stop offset=".55" stop-color="#FFD966"/><stop offset="1" stop-color="#E8A817"/></radialGradient><mask id="rm"><rect x="0" y="0" width="1080" height="1920" fill="url(#refl)"/></mask></defs>';
  // ── INTRO: planeta Armaf con los Odyssey en órbita
  if(t<C.p1){var sweet=cl((t-C.h4)/0.6);bg=sweet>0.5?'#B3122A':'#F4C542';
    if(sweet<1){out+='<g opacity="'+(1-sweet)+'"><rect width="1080" height="1920" fill="url(#goldbg)"/>'+rays(540,1060,1700,t,'#FFFFFF',28,0.28)+rays(540,1060,1700,-t*0.6,'#FFE9A0',14,0.35);for(var i=0;i<40;i++){var tw=0.4+0.6*Math.abs(Math.sin(t*2+i));out+=star(hsh(i*3)*1080,hsh(i*7)*1920,6+hsh(i)*14,tw,'#FFFFFF');}out+='</g>';}
    if(sweet>0){out+='<g opacity="'+sweet+'"><rect width="1080" height="1920" fill="url(#hotbg)"/>'+rays(540,980,1700,t*0.8,'#FF6A3D',22,0.22);
      for(var i=0;i<50;i++){var ph=((t*(0.1+hsh(i)*0.12)+hsh(i*3))%1);var x=hsh(i*5)*1080+Math.sin(t*2+i)*30;out+='<circle cx="'+x+'" cy="'+(1960-ph*2000)+'" r="'+(3+hsh(i*2)*8)+'" fill="'+(i%3?'#FFB347':'#FFE14D')+'" opacity="'+(1-ph)+'"/>';}
      for(var i=0;i<8;i++){var ph=((t*0.1+hsh(i+20))%1);out+='<text x="'+(hsh(i*7)*1000)+'" y="'+(2050-ph*2200)+'" font-size="'+(80+hsh(i)*50)+'" opacity="'+(1-ph*0.6)+'">'+['🔥','⚡','🖤','🔥'][i%4]+'</text>';}out+='</g>';}
    // planeta = logo Armaf
    var PX=540,PY=980,PR=360*(1-0.15*sweet);var kp=1;
    var orb=function(front){var s_='';var spin=t*0.55+(t>C.h4?(t-C.h4)*0.9:0);var arr=[];P.forEach(function(p,i){var a=spin+i*6.283/P.length;var z=Math.sin(a);if((z>0.15)!==front)return;var rx=470,ry=330;arr.push({p:p,x:PX+Math.cos(a)*rx,y:PY+z*ry*(sweet>0?1:1)-(sweet>0?0:0),s:0.85+z*0.32,z:z,i:i});});arr.sort(function(a,b){return a.z-b.z;});
      arr.forEach(function(o){var kk=1;var sx=1;s_+='<ellipse cx="'+o.x+'" cy="'+(o.y+o.s*260)+'" rx="'+(o.s*125)+'" ry="'+(o.s*18)+'" fill="#000" opacity=".25"/><g transform="translate('+o.x+','+o.y+') scale('+sx+',1) rotate(0) translate('+(-o.x)+','+(-o.y)+')">'+img(o.p.cut,o.x,o.y,(P.length>7?380:410)*o.s,kk,0)+'</g>';});return s_;};
    out+=orb(false);
    var gl=((t*0.35)%1.6)-0.3;
    out+='<g transform="translate('+PX+','+PY+')">'+
      '<circle r="'+(PR+40)+'" fill="'+GOLD+'" opacity=".15"/><circle r="'+PR+'" fill="url(#planet)" stroke="#1a1a1a" stroke-width="8"/>'+
      '<image href="fotos/logo_armaf_hd.png" x="'+(-PR*0.86)+'" y="'+(-PR*0.86)+'" width="'+(PR*1.72)+'" height="'+(PR*1.72)+'" style="filter:drop-shadow(0 4px 0 rgba(0,0,0,.25))"/>'+
      '<clipPath id="coinC"><circle r="'+PR+'"/></clipPath><g clip-path="url(#coinC)"><rect x="'+(-PR*2+gl*PR*2.6)+'" y="'+(-PR*1.3)+'" width="'+(PR*0.35)+'" height="'+(PR*2.6)+'" fill="#fff" opacity=".35" transform="skewX(-22)"/></g>'+
      '<ellipse cx="'+(-PR*0.35)+'" cy="'+(-PR*0.4)+'" rx="'+(PR*0.38)+'" ry="'+(PR*0.22)+'" fill="#fff" opacity=".18" transform="rotate(-30)"/>';
    for(var j=0;j<4;j++){var aa=j*1.57+0.6,tw=Math.max(0,Math.sin(t*2.2+j*1.7));out+=star(Math.cos(aa)*PR*0.97,Math.sin(aa)*PR*0.97,10+26*tw,tw,'#FFFFFF');}
    out+='</g>';
    out+=orb(true);
    // título ODYSSEY
    var L_='ODYSSEY',fs=228,yT=340,yB=1610;var w=0;for(var i=0;i<L_.length;i++)w+=cw(L_[i])*fs;var xx=540-w/2;
    for(var i=0;i<L_.length;i++){var cwi=cw(L_[i])*fs,tx=xx+cwi/2;xx+=cwi;var k=eio(cl((t-0.05-i*0.07)/0.6));var sx=540+(hsh(i)-0.5)*1600,sy=-300+hsh(i*3)*400;var cx=L(sx,tx,k),cy=L(sy,yT,k)+Math.sin(t*2+i)*6;var sc=L(4,1,k),rot=(1-k)*(hsh(i*5)-0.5)*720;
      out+='<g transform="translate('+cx+','+cy+') rotate('+rot+') scale('+sc+')" opacity="'+cl(k*2)+'"><text x="10" y="14" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#000" opacity=".45">'+L_[i]+'</text><text text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#FFFFFF" stroke="#7A4A00" stroke-width="16" paint-order="stroke">'+L_[i]+'</text></g>';}
    if(t>0.9){var sw=((t-0.9)*0.7)%1.6;out+='<clipPath id="ttl"><text x="540" y="'+yT+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'">ODYSSEY</text></clipPath><rect x="'+(-200+sw*900)+'" y="'+(yT-240)+'" width="80" height="320" fill="#fff" opacity=".3" transform="skewX(-20)" clip-path="url(#ttl)"/>';}
    if(t>=C.h2&&t<C.h3){out+='<text x="540" y="'+yB+'" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="50" fill="#5A3A00" letter-spacing="6" opacity="'+ent(C.h2)+'">LA SERIE DE ARMAF QUE</text>'+popWord('CONQUISTÓ EL MUNDO',540,yB+100,92,t,C.h2+0.6,'#fff','#7A4A00','#7A4A00');}
    if(t>=C.h3&&t<C.h4){out+='<text x="540" y="'+yB+'" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="54" fill="#5A3A00" letter-spacing="4">'+'TE LA EXPLICO'.slice(0,Math.floor(cl((t-C.h3)/0.6)*13))+'</text>'+popWord('PERFUME X PERFUME',540,yB+100,90,t,C.h3+0.6,'#fff','#FF4F8B');}
    if(t>=C.h4){var k4=back(cl((t-C.h4-0.2)/0.4));out+='<g transform="translate(540,'+(yB+60)+') rotate(-4) scale('+k4+')"><rect x="-400" y="-110" width="800" height="220" rx="50" fill="#fff" stroke="#1a1a1a" stroke-width="9"/><text y="-22" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="62" fill="#E5322B">PARTE 2</text><text y="68" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="96" fill="#1a1a1a">LOS INTENSOS 🔥</text></g>';}
  }
  // ── PERFUMES
  P.forEach(function(p,idx){var t0=C[p.k],t1=C[p.end];if(t<t0-0.05||t>=t1)return;var lt=t-t0;bg=p.bg;
    out+='<rect width="1080" height="1920" fill="'+p.bg2+'" opacity=".0"/>';
    out+='<circle cx="540" cy="900" r="1400" fill="'+p.bg2+'" opacity=".55"/>';
    out+=theme(p.theme,t,lt,idx);
    // iris de entrada
    var ik=cl(lt/0.35);if(ik<1)out+='<rect width="1080" height="1920" fill="'+p.bg2+'" opacity="'+(0.85*(1-eio(ik)))+'"/>';
    var insT=p.i?C[p.i]:(p.ins&&p.ins.misma?C[p.q]+1.2:1e9);var inK=p.ins?eio(cl((t-insT)/0.6)):0;
    // índice
    out+='<g transform="translate(120,170) rotate('+(Math.sin(t*2)*6)+') scale('+back(cl(lt/0.35))+')"><circle r="62" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="6"/><text y="-6" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40">'+(idx+1)+'/'+P.length+'</text><text y="28" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="16">ODYSSEY</text></g>';
    // nombre
    out+=popWord(p.name,540,310,p.name.length>12?96:116,t,t0+0.05,'#fff',p.bg2==='#A8E2F5'?'#2E6E8A':'#1a1a1a');
    out+=chip(p.sub,540,400,(lt-0.5)/0.35,'#1a1a1a',30,-2,'#fff');
    // frasco
    var bx=L(540,290,inK),bs=L(1,0.72,inK),by=930+Math.sin(t*2)*12;var dk=cl((lt-0.1)/0.55);var drop=(1-eio(dk))*-160;var ek=eio(dk);
    out+=rays(bx,by,700,t,'#fff',18,0.2*ek)+'<circle cx="'+bx+'" cy="'+by+'" r="'+(360*bs*(0.6+0.4*ek))+'" fill="url(#halo)" opacity="'+ek+'"/>';
    out+='<ellipse cx="'+bx+'" cy="'+(by+310*bs)+'" rx="'+(230*bs*ek)+'" ry="'+(30*bs*ek)+'" fill="#000" opacity="'+(0.3*ek)+'"/>';
    out+='<g transform="translate(0,'+drop+')">'+img(p.cut,bx,by,620*bs,dk,Math.sin(t*1.5)*3)+'</g>';
    
    // notas que salen del frasco y orbitan
    var nk=cl((t-C[p.n])/0.8);var fade=1-inK;if(nk>0&&fade>0.02){p.N.forEach(function(n_,j){var kj=cl((t-C[p.n]-j*0.12)/0.7);if(kj<=0)return;var a=-Math.PI/2+j*6.283/6+t*0.25;var R=L(0,1,eio(kj));var x=bx+Math.cos(a)*400*R,y=by+Math.sin(a)*285*R;
        out+='<g opacity="'+fade+'" transform="translate('+x+','+y+') scale('+back(kj)+')"><circle r="74" fill="#fff" stroke="#1a1a1a" stroke-width="6"/></g>'+'<g opacity="'+fade+'">'+nota(n_[0],x,y-6,0.8*back(kj),Math.sin(t*2+j)*8)+'<g transform="translate('+x+','+(y+80)+') scale('+back(kj)+')"><rect x="'+(-n_[1].length*11-16)+'" y="-22" width="'+(n_[1].length*22+32)+'" height="40" rx="20" fill="#1a1a1a"/><text y="8" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="26" fill="#fff">'+n_[1]+'</text></g></g>';});}
    // sticker marketinero
    if(p.mc&&C[p.mc]!=null&&t>=C[p.mc]){var mk=cl((t-C[p.mc])/0.35);var wig=Math.sin(t*6)*3;var mx=L(830,540,inK),my=L(640,690,inK);out+='<g transform="translate('+mx+','+my+') rotate('+(L(8,-3,inK)+wig)+') scale('+(back(mk)*L(0.9,0.68,inK))+')"><path d="';for(var j=0;j<20;j++){var a=j*Math.PI/10,r=j%2?150:185;out+=(j?'L':'M')+(Math.cos(a)*r*1.25)+' '+(Math.sin(a)*r*0.82)+' ';}out+='Z" fill="#FFD23F" stroke="#1a1a1a" stroke-width="8"/><text y="-8" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(p.mk[0].length>11?36:42)+'">'+p.mk[0]+'</text><text y="44" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="38" fill="#E5322B">'+p.mk[1]+'</text></g>';}
    // frase poética
    var qk=cl((t-C[p.q])/0.35);if(qk>0){var qy=505;out+='<g transform="translate(540,'+qy+') rotate(-2) scale('+back(qk)+')"><path d="M-500 -60 L 500 -60 L 470 0 L 500 60 L -500 60 L -470 0 Z" fill="#FFF8E6" stroke="#1a1a1a" stroke-width="7"/><text x="-470" y="-12" font-family="Playfair Display" font-size="90" fill="'+p.bg+'">“</text><text x="470" y="62" text-anchor="end" font-family="Playfair Display" font-size="90" fill="'+p.bg+'">”</text></g>'+'<g transform="rotate(-2 540 '+qy+')">'+typewriter(p.quote,540,qy+14,p.quote.length>40?34:42,t,C[p.q]+0.2,1.6,'#1a1a1a')+'</g>';}
    // acordes en burbujas
    var ak=cl((t-C[p.n]-1.2)/0.4);if(ak>0){p.A.forEach(function(a,j){var kk=cl((t-C[p.n]-1.2-j*0.15)/0.4);if(kk<=0)return;var x=150+j*260,y=1385;var r=40+a[1]*0.26;var pulse=1+0.05*Math.sin(t*4+j);
        out+='<g opacity="'+(1-inK)+'" transform="translate('+x+','+y+') scale('+(back(kk)*pulse)+')"><circle r="'+r+'" fill="'+a[2]+'" stroke="#1a1a1a" stroke-width="6"/><text y="10" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="34" fill="#fff" stroke="#1a1a1a" stroke-width="6" paint-order="stroke">'+Math.round(a[1]*cl(kk*1.5))+'%</text><text y="'+(r+34)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(a[0].length>10?22:28)+'" fill="#fff" stroke="#1a1a1a" stroke-width="6" paint-order="stroke">'+a[0]+'</text></g>';});}
    // inspiración: VS
    if(inK>0){var ox=L(1300,800,inK);out+='<circle cx="'+ox+'" cy="'+by+'" r="330" fill="url(#spot)"/>'+rays(ox,by,500,-t,GOLD,14,0.22);
      if(p.ins.choco)out+=chocoBar(ox,by,1.4*inK,Math.sin(t*2)*6);else out+=img(p.ins.img,ox,by,560,inK,Math.sin(t*1.7)*3);
      var vk=cl((t-insT-0.3)/0.35);out+='<g transform="translate(560,'+(by-40)+') rotate(-10) scale('+back(vk)+')"><circle r="70" fill="#E5322B" stroke="#1a1a1a" stroke-width="7"/><text y="22" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="62" fill="#fff">VS</text></g>';
      var bk=cl((t-insT-0.5)/0.4);out+='<g transform="translate(540,1470) scale('+back(bk)+')"><rect x="-480" y="-90" width="960" height="180" rx="34" fill="#1a1a1a" stroke="'+GOLD+'" stroke-width="7"/><text x="-440" y="-28" font-family="Baloo 2" font-weight="800" font-size="32" fill="'+GOLD+'">'+(p.ins.misma?'⚡ MISMA INSPIRACIÓN':'⚡ SE INSPIRA EN')+'</text><text x="-440" y="40" font-family="Baloo 2" font-weight="800" font-size="'+(p.ins.n.length>20?44:54)+'" fill="#fff">'+p.ins.n+'</text>'+(p.ins.m?'<image href="fotos/'+p.ins.m+'" x="200" y="-60" width="250" height="120" preserveAspectRatio="xMidYMid meet" style="filter:invert(1)"/>':p.ins.mt?(p.ins.mt.indexOf('|')>=0?'<text x="320" y="-6" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="32" letter-spacing="5" fill="#fff">'+p.ins.mt.split('|')[0]+'</text><text x="320" y="36" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="32" letter-spacing="5" fill="#fff">'+p.ins.mt.split('|')[1]+'</text>':'<text x="325" y="20" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="'+(p.ins.mt.length>6?38:46)+'" letter-spacing="'+(p.ins.mt.length>6?4:10)+'" fill="#fff">'+p.ins.mt+'</text>'):'<text x="330" y="22" text-anchor="middle" font-size="80">🍫</text>')+'</g>';}
    else if(!p.ins&&p.i&&t>=C[p.i]){var sk=cl((t-C[p.i])/0.4);out+='<g transform="translate(540,1470) rotate(-4) scale('+back(sk)+')"><rect x="-440" y="-90" width="880" height="180" rx="90" fill="'+GOLD+'" stroke="#1a1a1a" stroke-width="8"/><text y="-6" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="62">✨ COMPOSICIÓN PROPIA</text><text y="52" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="32">ADN 100% ARMAF</text></g>';for(var j=0;j<10;j++){var a=j*0.628+t;out+=star(540+Math.cos(a)*520,1470+Math.sin(a)*140,14+6*Math.sin(t*5+j),1,GOLD);}}
  });
  // ── CIERRE
  if(t>=C.out&&t<C.end){bg='#170F2E';out+=rays(540,1100,1500,t,'#8E6CF5',24,0.14);
    out+=popWord('¿CUÁL ES TU',540,420,104,t,C.out,'#fff')+popWord('ODYSSEY?',540,560,150,t,C.out+0.4,GOLD,'#5A3A00');
    var spin=t*0.8;var arr=[];P.forEach(function(p,i){var a=spin+i*6.283/P.length;var z=Math.sin(a);arr.push({p:p,x:540+Math.cos(a)*400,y:1100+z*110,s:0.75+z*0.3,z:z});});arr.sort(function(a,b){return a.z-b.z;});
    arr.forEach(function(o){out+=img(o.p.cut,o.x,o.y,380*o.s,ent(C.out+0.2),0);});
    if(t>=C.out2){out+=(C.fol!=null&&t>=C.fol)?chip('📲 SEGUINOS: SE VIENEN MÁS SERIES',540,1450,(t-C.fol)/0.35,'#FF4F8B',42,-3,'#fff'):chip('🍋 PARTE 3: FRESCOS Y FRUTALES',540,1450,(t-C.out2)/0.35,'#22C3B0',44,-3,'#fff');for(var i=0;i<6;i++){var ph=((t*1.2+i/6)%1);out+='<text x="'+(260+i*110)+'" y="'+(1530-ph*120)+'" font-size="56" opacity="'+(1-ph)+'">'+['🍋','🥭','🍍'][i%3]+'</text>';}}
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
