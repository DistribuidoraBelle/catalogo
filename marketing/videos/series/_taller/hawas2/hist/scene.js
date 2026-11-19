// HAWAS · LA HISTORIA DE LA FAMILIA (sin voz: tiempos en CH)
var GOLD='#D9B25E',GL='#F3DC9A';
var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="26" stdDeviation="20" flood-color="#000" flood-opacity=".6"/></filter><filter id="b30"><feGaussianBlur stdDeviation="30"/></filter><filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>'+
 '<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1C2"/><stop offset=".5" stop-color="#E2B95A"/><stop offset="1" stop-color="#A67A22"/></linearGradient>'+
 '<radialGradient id="bgr" cx="50%" cy="35%" r="80%"><stop offset="0" stop-color="#1B2236"/><stop offset=".6" stop-color="#0A0D17"/><stop offset="1" stop-color="#030408"/></radialGradient></defs>';
function bg(t,col){var s='<rect width="1080" height="1920" fill="url(#bgr)"/>';if(col)s+='<circle cx="540" cy="760" r="620" fill="'+col+'" opacity=".22" filter="url(#b30)"/>';
 for(var i=0;i<40;i++){var x=hsh(i*3.3)*1080,y=(hsh(i*7.1)*1920-t*12*(0.3+hsh(i)))%1920;if(y<0)y+=1920;s+='<circle cx="'+x+'" cy="'+y+'" r="'+(1+hsh(i*5)*2)+'" fill="'+GL+'" opacity="'+(0.15+hsh(i*9)*0.35)+'"/>';}
 return s+'<rect x="34" y="34" width="1012" height="1852" fill="none" stroke="'+GOLD+'" stroke-width="1.5" opacity=".35"/>';}
function g(txt,x,y,s,o){o=o||{};return T(txt,x,y,{f:o.f||'Cinzel',w:o.w||700,s:s,c:o.c||'url(#gold)',ls:o.ls==null?4:o.ls,op:o.op,a:o.a,tr:o.tr,it:o.it});}
function card(x,y,w,h,col,op,glow){if(op<=0)return '';return '<g opacity="'+op+'"><rect x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="18" fill="#0E1322" stroke="'+(col||GOLD)+'" stroke-width="'+(glow?4:2)+'"/>'+(glow?'<rect x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="18" fill="'+col+'" opacity=".18"/>':'')+'</g>';}
function line(x1,y1,x2,y2,k,col,op){if(k<=0)return '';return '<line x1="'+x1+'" y1="'+y1+'" x2="'+L(x1,x2,k)+'" y2="'+L(y1,y2,k)+'" stroke="'+(col||GOLD)+'" stroke-width="3" opacity="'+(op==null?0.8:op)+'"/>';}
function bottle(b,cx,cy,h,k,col,gx){gx=gx||300;if(k<=0)return '';var s='<g transform="translate('+cx+' '+(cy+h/2)+') scale('+k+') translate('+(-cx)+' '+(-cy-h/2)+')">';
 if(b[0])s+=img(b[0],cx,cy,h,1,0,'filter="url(#ds)"');else{var w=h*0.62;s+='<rect x="'+(cx-w*0.18)+'" y="'+(cy-h/2)+'" width="'+(w*0.36)+'" height="'+(h*0.16)+'" rx="6" fill="#2A3045" stroke="'+GOLD+'" stroke-width="2"/><rect x="'+(cx-w/2)+'" y="'+(cy-h/2+h*0.16)+'" width="'+w+'" height="'+(h*0.84)+'" rx="'+(w*0.18)+'" fill="'+(col||'#334')+'" opacity=".55" stroke="'+GOLD+'" stroke-width="2"/>'+T('HAWAS',cx,cy+h*0.1,{f:'Cinzel',w:700,s:h*0.1,c:'#fff',ls:2});}
 s+=T(b[1],cx,cy+h/2+38,{f:'Montserrat',w:800,s:Math.min(28,h*0.11,(gx-24)/b[1].length/0.74),c:'#fff',ls:1});return s+'</g>';}
function grid(B,y0,k0,t,col){var n=B.length,cols=n<=4?n:(n<=6?3:5),rows=Math.ceil(n/cols);var h=rows==1?380:(rows==2?(cols==5?300:340):280);var gx=cols==5?196:(cols==4?240:300),gy=h+90;var s='';
 B.forEach(function(b,i){var r=Math.floor(i/cols),c=i%cols;var inRow=Math.min(cols,n-r*cols);var x=540+(c-(inRow-1)/2)*gx,y=y0+r*gy;var k=eb(cl((t-k0-i*0.12)/0.45));s+=bottle(b,x,y,h,k,col,gx);});return s;}
function render(t){var out=DEFS,o;
 // A · GANCHO
 if(t<CH.founder){out+=bg(t);var all=[];FOUNDER.b.forEach(function(b){all.push(b[0])});BR.forEach(function(r){r.b.forEach(function(b){if(b[0])all.push(b[0])})});
  var sc=t*40;for(var i=0;i<42;i++){var c=i%6,r=Math.floor(i/6);var y=(r*300-sc+2100)%2100-150;out+=img(all[i%all.length],90+c*180,y,240,0.35,0,'');}
  out+='<rect width="1080" height="1920" fill="#05070E" opacity=".55"/>';var k=e5(cl(t/0.6)),k2=e5(cl((t-0.8)/0.6)),k3=e5(cl((t-1.8)/0.6));
  out+=g('HAWAS',540,860,250,{op:k,ls:10})+T('¿POR QUÉ HAY TANTOS?',540,980,{f:'Montserrat',w:900,s:66,c:'#fff',op:k2,ls:2})+g('LA HISTORIA DE UNA FAMILIA',540,1080,40,{op:k3,ls:10,c:GL});}
 // B · FUNDADOR + primeros Hawas
 else if(t<CH.sons){var lt=t-CH.founder;out+=bg(t,GOLD);var k=e5(cl(lt/0.7));
  out+=g('EL ORIGEN',540,250,36,{op:k,ls:14,c:GL});
  out+=card(540,420,900,230,GOLD,k,true)+g(FOUNDER.n,540,415,52,{op:k,ls:2})+T(FOUNDER.s,540,475,{f:'Montserrat',w:700,s:30,c:'#fff',op:k,ls:4});
  if(t>=CH.first){var l2=t-CH.first;out+=line(540,535,540,700,e5(cl(l2/0.5)))+g('LOS PRIMEROS HAWAS',540,770,46,{op:e5(cl((l2-0.2)/0.5)),ls:6})+grid(FOUNDER.b,1150,CH.first+0.4,t,GOLD);}
  else out+=T('Creó Rasasi en Dubái y le dio vida a Hawas,',540,700,{f:'Cormorant Garamond',it:1,w:500,s:52,c:'#fff',op:e5(cl((lt-1)/0.6))})+T('la línea más famosa de la casa.',540,770,{f:'Cormorant Garamond',it:1,w:500,s:52,c:'#fff',op:e5(cl((lt-1.4)/0.6))});}
 // C · SEIS HIJOS
 else if(t<CH.br){var lt=t-CH.sons;out+=bg(t,GOLD);var k=e5(cl(lt/0.6));
  out+=card(540,300,820,150,GOLD,1,true)+g('ABDUL RAZZAK KALSEKAR',540,318,46,{ls:2});
  out+=line(540,375,540,520,e5(cl(lt/0.5)))+line(140,520,940,520,e5(cl((lt-0.3)/0.6)));
  out+=g('SEIS HIJOS · SEIS LÍNEAS HAWAS',540,470,34,{op:e5(cl((lt-0.4)/0.5)),ls:6,c:GL});
  BR.forEach(function(r,i){var c=i%3,row=Math.floor(i/3);var x=220+c*320,y=760+row*420;var kk=eb(cl((lt-0.8-i*0.18)/0.45));
   out+=line(x,520,x,y-130,e5(cl((lt-0.6-i*0.1)/0.4)),r.c)+'<g transform="translate('+x+' '+y+') scale('+kk+') translate('+(-x)+' '+(-y)+')">'+card(x,y,280,230,r.c,1,true)+g(r.n,x,y-10,54,{c:'#fff',ls:4})+T('KALSEKAR',x,y+40,{f:'Montserrat',w:700,s:22,c:r.c,ls:6})+'</g>';});
  out+=T('Cada hijo maneja su propia línea de Hawas',540,1650,{f:'Cormorant Garamond',it:1,w:500,s:48,c:'#fff',op:e5(cl((lt-2.4)/0.6))});}
 // D · CADA RAMA
 else if(t<CH.recap){var bi=Math.min(5,Math.floor((t-CH.br)/CH.brDur)),lt=t-CH.br-bi*CH.brDur,r=BR[bi];out+=bg(t,r.c);var k=e5(cl(lt/0.5));
  // mini barra de los 6 hijos arriba
  BR.forEach(function(q,i){var x=140+i*160;out+='<rect x="'+(x-70)+'" y="90" width="140" height="44" rx="22" fill="'+(i==bi?q.c:'#0E1322')+'" stroke="'+q.c+'" stroke-width="2" opacity="'+(i<=bi?1:0.45)+'"/>'+T(q.n,x,120,{f:'Montserrat',w:800,s:20,c:'#fff',ls:2,op:i<=bi?1:0.5});});
  out+=T('LÍNEA DE',540,230,{f:'Montserrat',w:700,s:30,c:r.c,ls:12,op:k})+'<g transform="translate(0 '+(1-k)*40+')">'+g(r.n+' KALSEKAR',540,330,88,{op:k,c:'#fff',ls:4})+'</g>';
  out+=T('HEREDEROS: '+r.h.toUpperCase(),540,400,{f:'Montserrat',w:700,s:28,c:GL,ls:4,op:e5(cl((lt-0.4)/0.5))});
  var kb=eb(cl((lt-0.8)/0.5));out+='<g transform="translate(540 500) scale('+kb+') translate(-540 -500)"><rect x="240" y="455" width="600" height="96" rx="48" fill="none" stroke="'+r.c+'" stroke-width="3"/>'+g(r.brand[0],540,497,30,{c:'#fff',ls:8})+g(r.brand[1],540,535,30,{c:r.c,ls:8})+'</g>';
  var n=r.b.length;out+=grid(r.b,n<=5?(n<=4?1000:900):780,CH.br+bi*CH.brDur+1.2,t,r.c);
  out+=T(n+' HAWAS',540,1690,{f:'Anton',s:90,c:r.c,op:e5(cl((lt-2.6)/0.5)),ls:4});
  if(lt<0.35)out+='<rect width="1080" height="1920" fill="'+r.c+'" opacity="'+(1-lt/0.35)*0.6+'"/>';}
 // E · RECAP
 else if(t<CH.out){var lt=t-CH.recap;out+=bg(t,GOLD);out+=g('MÁS DE 45 HAWAS',540,240,72,{op:e5(cl(lt/0.5)),ls:4});
  BR.forEach(function(r,i){var x=140+i*160;var kk=e5(cl((lt-0.3-i*0.1)/0.5));out+='<g opacity="'+kk+'">'+T(r.n,x,360,{f:'Montserrat',w:800,s:22,c:r.c,ls:2});
   r.b.forEach(function(b,j){var y=430+j*112;out+=b[0]?img(b[0],x,y,100,1,0,''):'<rect x="'+(x-24)+'" y="'+(y-40)+'" width="48" height="80" rx="10" fill="'+r.c+'" opacity=".5"/>';});out+='</g>';});
  var ke=e5(cl((lt-2)/0.6));out+=T('Y SIGUEN SALIENDO:',540,1580,{f:'Montserrat',w:800,s:34,c:GL,ls:6,op:ke})+T(['ICE FREEZE'].concat(EXTRA.t).join(' · '),540,1640,{f:'Montserrat',w:700,s:30,c:'#fff',op:ke,ls:1});}
 // F · CIERRE
 else {var lt=t-CH.out;out+=bg(t,GOLD);var k=e5(cl(lt/0.6));out+=g('PRÓXIMAMENTE',540,620,40,{op:k,ls:14,c:GL})+g('TODOS LOS HAWAS',540,760,80,{op:k,ls:3})+g('UNO POR UNO',540,870,80,{op:k,ls:3})+T('SEGUINOS PARA NO PERDERTE NINGUNO',540,1020,{f:'Montserrat',w:800,s:34,c:'#fff',op:e5(cl((lt-0.6)/0.5)),ls:3});
  out+=T('LOS ENCONTRÁS EN',540,1300,{f:'Montserrat',w:700,s:34,c:GL,ls:12,op:e5(cl((lt-1.2)/0.5))})+T('distribuidorabelle.com',540,1390,{f:'Montserrat',w:800,s:60,c:'#fff',op:e5(cl((lt-1.4)/0.5))});}
 document.getElementById('sv').innerHTML=out;}
