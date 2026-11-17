// ═══════════ SERIE · ARMAF ODYSSEY · PARTE 1 (LOS DULCES) ═══════════
var C=window.CUES;
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var PAL=['#FF4F8B','#3DB8F5','#F0A21A','#22C3B0','#8E6CF5','#FF5A4E'];
var P=[
 {k:'p1',ki:'p1i',img:'2046.jpg',n:'MANDARIN SKY',sub:'FOR MEN · EDP',g:'♂',bg:'#FF8A3D',
  S:[['mandarina','Mandarina'],['naranja','Naranja'],['azafran','Azafrán']],H:[['caramelo','Caramelo'],['tonka','Haba tonka'],['girasol','Cempasúchil']],B:[['ambargris','Ambroxan'],['cedro','Cedro'],['vetiver','Vetiver']],
  A:[['Cítrico',100,'#E8C430'],['Caramelo',90,'#D48C30'],['Dulce',80,'#E87AAA'],['Ámbar',70,'#D4A020'],['Aromático',60,'#6AB87A']],
  ins:{img:'f68074.png',n:'Scandal Pour Homme',m:'logo_jpg.png'}},
 {k:'p2',ki:'p2i',img:'2047.jpg',n:'MANDARIN SKY',sub:'ELIXIR',g:'♂',bg:'#2E6FD8',
  S:[['mandarina','Mandarina'],['lavanda','Lavanda'],['pimienta','Pimienta negra']],H:[['caramelo','Caramelo'],['incienso','Incienso'],['pachuli','Pachulí']],B:[['vainilla','Vainilla'],['vetiver','Vetiver'],['tonka','Haba tonka']],
  A:[['Cítrico',100,'#E8C430'],['Avainillado',90,'#D4A830'],['Dulce',80,'#E87AAA'],['Caramelo',70,'#D48C30'],['Aromático',60,'#6AB87A']],
  ins:{img:'orig_scandal.jpg',n:'Scandal Le Parfum',m:'logo_jpg.png'}},
 {k:'p3',ki:'p3i',img:'2481.jpg',n:'MANDARIN SKY',sub:'VINTAGE EDITION',g:'U',bg:'#D99A4E',
  S:[['mandarina','Mandarina'],['naranja','Naranja'],['salvia','Salvia']],H:[['caramelo','Caramelo'],['tonka','Haba tonka'],['girasol','Cempasúchil']],B:[['ambargris','Ambroxan'],['cedro','Cedro'],['vetiver','Vetiver']],
  A:[['Cítrico',100,'#E8C430'],['Caramelo',90,'#D48C30'],['Dulce',80,'#E87AAA'],['Ámbar',70,'#D4A020'],['Aromático',60,'#6AB87A']],
  ins:{img:'f68074.png',n:'Scandal Pour Homme',m:'logo_jpg.png'},edicion:true},
 {k:'p4',ki:'p4i',img:'2380.jpg',n:'BLACK FOREST',sub:'GOURMAND · EDP',g:'U',bg:'#6A2E3A',
  S:[['cereza','Cereza'],['caramelo','Caramelo'],['canela','Canela']],H:[['higo','Dátiles'],['miel','Miel'],['nuez','Nuez moscada']],B:[['praline','Praliné'],['vainilla','Vainilla'],['tonka','Haba tonka']],
  A:[['Dulce',100,'#E87AAA'],['Avainillado',90,'#D4A830'],['Caramelo',80,'#D48C30'],['Acerezado',70,'#8A3EB0'],['Amielado',50,'#F4B63A']],
  ins:null},
 {k:'p5',ki:'p5i',img:'2038.jpg',n:'DUBAI CHOCOLAT',sub:'GOURMAND · EDP',g:'U',bg:'#8CC34A',
  S:[['cafe','Café'],['pistacho','Pistacho'],['galleta','Knafeh']],H:[['chocolate','Chocolate'],['vainilla','Vainilla'],['cardamomo','Cardamomo']],B:[['caramelo','Caramelo'],['ambar','Amberwood'],['tonka','Haba tonka']],
  A:[['Cálido especiado',100,'#C45A1A'],['Dulce',90,'#E87AAA'],['Amaderado',80,'#8B5E3C'],['Nueces',70,'#C9A06A'],['Café',60,'#5C3420']],
  ins:{choco:true,n:'Chocolate de Dubái (el viral)'}},
 {k:'p6',ki:'p6i',img:'2037.jpg',n:'CANDEE',sub:'FEMME · EDP',g:'♀',bg:'#FF7FB0',
  S:[['frutilla','Frutilla'],['frambuesa','Frambuesa'],['durazno','Durazno']],H:[['caramelo','Caramelo'],['jazmin','Jazmín'],['maracuya','Maracuyá']],B:[['almizcle','Almizcle'],['pachuli','Pachulí'],['ambar','Ámbar']],
  A:[['Afrutado',100,'#E8703A'],['Dulce',90,'#E87AAA'],['Pachulí',80,'#7A5A3A'],['Caramelo',70,'#D48C30'],['Amaderado',60,'#8B5E3C']],
  ins:{img:'f75968.png',n:'Burberry Her Elixir',m:'logo_burberry.png'}},
 {k:'p7',ki:'p7i',img:'2638.jpg',n:'MARSHMALLOW',sub:'FEMME · EDP',g:'♀',bg:'#6FC8E0',
  S:[['coco','Coco'],['manzana','Manzana'],['limon','Limón']],H:[['malvavisco','Malvavisco'],['frutilla','Frutilla'],['durazno','Durazno']],B:[['vainilla','Vainilla'],['praline','Praliné'],['almizcle','Almizcle']],
  A:[['Dulce',100,'#E87AAA'],['Afrutado',80,'#E8703A'],['Atalcado',60,'#D4B0C4'],['Avainillado',50,'#D4A830'],['Lactónico',40,'#E3D5B8']],
  ins:{img:'f99254.png',n:'Yum Boujee Marshmallow 81',mt:'KAYALI'}}
];
var ENDS=['p2','p3','p4','p5','p6','p7','out'];
function title(txt,y,k,col,fs){fs=fs||110;return '<text x="540" y="'+y+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="'+(fs*0.14)+'" paint-order="stroke" transform="translate(540,'+y+') scale('+back(cl(k))+') translate(-540,'+(-y)+')" opacity="'+cl(k*3)+'">'+txt+'</text>';}
function chip(txt,x,y,k,col,fs,rot){fs=fs||40;var w=txt.length*fs*0.56+64;return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+back(cl(k))+')"><rect x="'+(-w/2+6)+'" y="'+(-fs*0.95+7)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="rgba(0,0,0,.3)"/><rect x="'+(-w/2)+'" y="'+(-fs*0.95)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="6"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
function star(x,y,s,op){return '<path d="M'+x+' '+(y-s)+' L '+(x+s*0.28)+' '+y+' L '+x+' '+(y+s)+' L '+(x-s*0.28)+' '+y+' Z" fill="#fff" opacity="'+(op==null?1:op)+'"/>';}
var PID=0;
function card(href,cx,cy,w,h,rot,k,bgc){if(k<=0)return '';var id='cd'+(PID++);var b=back(cl(k));
  return '<g transform="translate('+cx+','+cy+') rotate('+rot+') scale('+b+')"><rect x="'+(-w/2+12)+'" y="'+(-h/2+14)+'" width="'+w+'" height="'+h+'" rx="28" fill="rgba(0,0,0,.35)"/><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="28" fill="'+(bgc||'#fff')+'" stroke="#1a1a1a" stroke-width="9"/><clipPath id="'+id+'"><rect x="'+(-w/2+12)+'" y="'+(-h/2+12)+'" width="'+(w-24)+'" height="'+(h-24)+'" rx="18"/></clipPath><image href="fotos/'+href+'" x="'+(-w/2+12)+'" y="'+(-h/2+12)+'" width="'+(w-24)+'" height="'+(h-24)+'" preserveAspectRatio="xMidYMid meet" clip-path="url(#'+id+')"/></g>';}
function chocoBar(cx,cy,s){var o='<g transform="translate('+cx+','+cy+') rotate(-8) scale('+s+')"><rect x="-130" y="-70" width="260" height="140" rx="14" fill="#4A2614" stroke="#1a1a1a" stroke-width="7"/>';for(var i=0;i<4;i++)o+='<path d="M'+(-130+i*65)+' -70 L '+(-130+i*65)+' 70" stroke="#2E160A" stroke-width="4"/>';
  o+='<path d="M-130 0 L 130 0" stroke="#2E160A" stroke-width="4"/><path d="M40 -70 L 130 -70 L 130 70 L 70 70 Q 50 30 90 0 Q 50 -30 40 -70 Z" fill="#9CCB5A" stroke="#1a1a1a" stroke-width="5"/>'+[[100,-40],[110,20],[80,40],[95,-10]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="#6E9A30"/>';}).join('')+'</g>';return o;}
// títulos del gancho en 4 cuadros
function hookSubs(t){var T=[0,C.h2,C.h3,C.h4,C.p1];var fr=0;for(var i=1;i<4;i++)if(t>=T[i]-0.05)fr=i;var t0=T[fr]-0.05,t1=T[fr+1];
  var W=[];SUBS.forEach(function(L_){L_.w.forEach(function(w){if(w.t>=t0-0.05&&w.t<t1-0.05)W.push(w);});});if(!W.length)return '';
  var lines=[],ln=[],len=0;W.forEach(function(w){if(len+w.s.length>12&&ln.length){lines.push(ln);ln=[];len=0;}ln.push(w);len+=w.s.length+1;});if(ln.length)lines.push(ln);
  var STY=[{lab:'#1a1a1a',txt:'#F4C542',fs:230},{lab:'#fff',txt:null,fs:112},{lab:'#FF4F8B',txt:'#fff',fs:112},{lab:'#F4C542',txt:'#1a1a1a',fs:140}][fr];
  var fs=STY.fs,lh=fs*1.15,y0=(fr===0?560:470)-(lines.length-1)*lh/2+(lines.length>2?50:0),s='';var pk=cl((t-t0)/0.1);var pop=pk<1?(0.6+0.55*pk):1;
  lines.forEach(function(L_,li){var y=y0+li*lh;var lk=cl((t-L_[0].t+0.04)/0.1);if(lk<=0)return;var lp=lk<1?(0.6+0.55*lk):1;var rot=[[-3,2.5,-2],[2.5,-3,2],[-2,3,-2.5],[3,-2,2]][fr][li%3];var tr='translate(540,'+y+') rotate('+rot+') scale('+(pop*lp)+') translate(-540,'+(-y)+')';
    var nch=L_.map(function(w){return w.s;}).join(' ').length,bw=nch*fs*0.56+70;
    s+='<g transform="'+tr+'"><rect x="'+(540-bw/2+10)+'" y="'+(y-fs*0.82+12)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="rgba(0,0,0,.35)"/><rect x="'+(540-bw/2)+'" y="'+(y-fs*0.82)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="'+STY.lab+'" stroke="'+(fr===0?'#F4C542':'#1a1a1a')+'" stroke-width="8"/></g>';
    var o='<text x="540" y="'+y+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" transform="'+tr+'">';
    L_.forEach(function(w,j){var on=t>=w.t-0.02;var col=STY.txt||PAL[(li*3+j)%PAL.length];o+='<tspan fill="'+col+'" fill-opacity="'+(on?1:0)+'">'+(j?' ':'')+w.s.toUpperCase().replace(/[.:]$/,'')+(fr===3&&j===L_.length-1&&li===lines.length-1?' 🍬':'')+'</tspan>';});s+=o+'</text>';});
  return s;}
function render(t){
  PID=0;var out='',bg='#FF4F8B';var ent=function(t0){return eio(cl((t-t0)/0.5));};
  // ── GANCHO: la "tapa" con los 7 frascos
  if(t<C.p1){bg='#1a1a1a';
    for(var i=0;i<40;i++){var a=i*0.785+t*0.3;out+='<path d="M540 960 L '+(540+Math.cos(a)*1600)+' '+(960+Math.sin(a)*1600)+' L '+(540+Math.cos(a+0.08)*1600)+' '+(960+Math.sin(a+0.08)*1600)+' Z" fill="'+PAL[i%6]+'" opacity=".22"/>';}
    var pos=[[540,1200,1.15,0],[230,1050,0.85,-8],[850,1050,0.85,8],[200,1450,0.8,6],[880,1450,0.8,-6],[400,1640,0.72,-4],[690,1640,0.72,4]];
    var order=[0,1,2,3,4,5,6];
    order.slice().reverse().forEach(function(i){var p=pos[i];var k=cl((t-0.15-i*0.14)/0.4);var bob=Math.sin(t*2+i)*10;out+=card(P[i].img,p[0],p[1]+bob,380*p[2],380*p[2],p[3]+Math.sin(t*1.5+i)*2,k,'#fff');});
    if(t<C.h2)out+='<image href="fotos/logo_armaf.png" x="840" y="250" width="170" height="170" opacity="'+cl(t/0.4)+'"/>';
    out+=hookSubs(t);
  }
  // ── CARTAS DE CADA PERFUME
  P.forEach(function(p,idx){var t0=C[p.k],t1=C[ENDS[idx]];if(t<t0-0.05||t>=t1)return;bg=p.bg;var lt=t-t0;
    // fondo: notas flotando
    var ids=p.S.concat(p.H,p.B).map(function(x){return x[0];});
    for(var i=0;i<16;i++){var ph=((t*0.05+hsh(i+idx*7))%1);out+='<g opacity=".22">'+nota(ids[i%ids.length],hsh(i*3+idx)*1080,1980-ph*2100,0.7+hsh(i)*0.5,t*30*(i%2?1:-1)+i*40)+'</g>';}
    // whoosh de entrada
    var wk=cl(lt/0.35);if(wk<1)out+='<rect x="'+(-1080+wk*2160)+'" y="0" width="1080" height="1920" fill="#fff" opacity="'+(0.5*(1-wk))+'"/>';
    // encabezado
    out+=chip('ODYSSEY · PARTE 1 · '+(idx+1)+'/7',540,170,lt/0.3,'#1a1a1a',30).replace('fill="#1a1a1a">ODYSSEY','fill="#F4C542">ODYSSEY');
    out+=title(p.n,320,(lt-0.05)/0.35,'#fff',p.n.length>12?96:112);
    out+=chip(p.sub+'  '+(p.g==='♂'?'♂':p.g==='♀'?'♀':'⚥'),540,410,(lt-0.2)/0.35,'#fff',32);
    // foto del producto
    var bob=Math.sin(t*2)*8;out+=card(p.img,300,700+bob,480,480,-4,(lt-0.15)/0.45,'#fff');
    // notas
    var rows=[['SALIDA',p.S,'#FFE14D'],['CORAZÓN',p.H,'#FF8FBF'],['FONDO',p.B,'#C9A06A']];
    rows.forEach(function(r,ri){var k=cl((lt-0.5-ri*0.35)/0.4);if(k<=0)return;var y=500+ri*165;var b=back(k);
      out+='<g transform="translate(800,'+y+') scale('+b+')"><rect x="-235" y="-70" width="470" height="150" rx="26" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><rect x="-235" y="-70" width="150" height="40" rx="14" fill="'+r[2]+'" stroke="#1a1a1a" stroke-width="5"/><text x="-160" y="-41" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="24">'+r[0]+'</text>';
      r[1].forEach(function(n_,j){var x=-150+j*150;out+=nota(n_[0],x,4,0.62,Math.sin(t*2+j)*5)+'<text x="'+x+'" y="64" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(n_[1].length>9?18:22)+'">'+n_[1]+'</text>';});out+='</g>';});
    // acordes
    var ka=cl((lt-1.4)/0.4);if(ka>0){out+='<g opacity="'+ka+'"><rect x="50" y="990" width="980" height="300" rx="28" fill="rgba(255,255,255,.92)" stroke="#1a1a1a" stroke-width="6"/><text x="80" y="1035" font-family="Baloo 2" font-weight="800" font-size="32">🎨 ACORDES</text>';
      p.A.forEach(function(a,i){var y=1065+i*45;var w=cl((lt-1.5-i*0.12)/0.6);out+='<text x="80" y="'+(y+24)+'" font-family="Baloo 2" font-weight="800" font-size="26">'+a[0]+'</text><rect x="330" y="'+y+'" width="660" height="32" rx="16" fill="#EEE" stroke="#1a1a1a" stroke-width="3"/><rect x="330" y="'+y+'" width="'+(660*a[1]/100*eio(w))+'" height="32" rx="16" fill="'+a[2]+'" stroke="#1a1a1a" stroke-width="3"/>';});out+='</g>';}
    // se inspira en
    var ti=C[p.ki];var ki=cl((t-ti)/0.4);if(ki>0){var b=back(ki);
      if(p.ins){out+='<g transform="translate(540,1430) scale('+b+')"><rect x="-490" y="-120" width="980" height="230" rx="30" fill="#1a1a1a" stroke="#fff" stroke-width="6"/><text x="-200" y="-56" font-family="Baloo 2" font-weight="800" font-size="34" fill="#F4C542">'+(p.edicion?'MISMA INSPIRACIÓN ↓':'SE INSPIRA EN ↓')+'</text><text x="-200" y="2" font-family="Baloo 2" font-weight="800" font-size="'+(p.ins.n.length>20?36:46)+'" fill="#fff">'+p.ins.n+'</text>';
        if(p.ins.m)out+='<image href="fotos/'+p.ins.m+'" x="-200" y="20" width="260" height="76" preserveAspectRatio="xMinYMid meet" style="filter:invert(1)"/>';else if(p.ins.mt)out+='<text x="-200" y="78" font-family="DM Sans" font-weight="700" font-size="44" letter-spacing="12" fill="#fff">'+p.ins.mt+'</text>';
        out+='</g>';
        if(p.ins.choco)out+=chocoBar(185,1425,0.72*b);else out+=card(p.ins.img,330,1400,250,300,6,ki,'#fff').replace(/translate\(330,1400\)/,'translate('+(540-355*b)+',1400)');
        for(var j=0;j<6;j++){var a=j*1.05+t;out+=star(540+Math.cos(a)*520,1430+Math.sin(a)*150,12+5*Math.sin(t*5+j));}}
      else{out+='<g transform="translate(540,1430) rotate(-4) scale('+b+')"><rect x="-430" y="-95" width="860" height="190" rx="95" fill="#F4C542" stroke="#1a1a1a" stroke-width="8"/><text y="-12" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="64">✨ COMPOSICIÓN PROPIA</text><text y="52" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="34">ADN 100% ARMAF</text></g>';}}
  });
  // ── CIERRE
  if(t>=C.out&&t<C.end){bg='#8E6CF5';
    out+=title('¿CUÁL ES TU',380,(t-C.out)/0.35,'#fff',120)+title('ODYSSEY? 👇',520,(t-C.out-0.3)/0.35,'#F4C542',130);
    P.forEach(function(p,i){var c=i%4,r=Math.floor(i/4);var x=r===0?150+c*260:280+c*260,y=r===0?800:1110;var k=cl((t-C.out-0.3-i*0.1)/0.35);out+=card(p.img,x,y+Math.sin(t*2+i)*8,230,230,(i%2?5:-5),k,'#fff');});
    if(t>=C.out2)out+=chip('➡️ PARTE 2: LOS INTENSOS 🔥',540,1420,(t-C.out2)/0.35,'#FFD23F',44);
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
  var KEY=/^(odyssey|scandal|elixir|vintage|composición|propia|chocolate|candee|marshmallow|belle|caramelo|mandarina)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:;…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
