// CLUB DE NUIT · ESTILO F (texto gigante detrás del frasco + explosión congelada de notas reales)
var WORD={p1:'MAN',p2:'IMPROVED',p3:'INTENSE',p4:'LIMITED',p5:'EXTRAIT',p6:'EXTREME',p7:'OVERDOSE',p8:'PRÉCIEUX'};
var QT={p1:'“El clásico dorado que arrancó la leyenda.”',p2:'“Mismo ADN, con más fuego en la piel.”',p3:'“Humo de abedul sobre fruta encendida.”',p4:'“El Intense, vestido de gala.”',
 p5:'“El ahumado se vuelve terciopelo.”',p6:'“Humo, cuero y fruta, sin frenos.”',p7:'“Una tentación dulce que no se olvida.”',p8:'“La joya de la familia, en extracto.”'};
var MK={p1:'EL QUE EMPEZÓ TODO',p2:'MÁS PRESENCIA · MÁS DURACIÓN',p3:'EL CLON MÁS FAMOSO DEL MUNDO',p4:'EDICIÓN LIMITADA',p5:'SUAVE · REDONDO · CARÍSIMO',p6:'SE SIENTE A UNA CUADRA',p7:'YA ES FUROR',p8:'LA MÁS REFINADA'};
var EMO={p1:'Si buscás elegancia, es este.',p2:'El más seductor de la serie.',p3:'Entrás y todos se dan vuelta.',p4:'Nadie se resiste a este aroma.',
 p5:'Te van a preguntar qué tenés puesto.',p6:'El que te hace inolvidable.',p7:'Imposible no volver a olerlo.',p8:'Para los que nacieron para brillar.'};
function emo(txt,lt,t0,op,col){if(lt<t0||op<=0)return '';var k=cl((lt-t0)/0.7);var w=1000*eo(k);var s=Math.min(96,2000/txt.length);
 return '<g opacity="'+op+'" transform="rotate(-3 540 480)"><clipPath id="ec"><rect x="'+(540-500)+'" y="380" width="'+w+'" height="180"/></clipPath><g clip-path="url(#ec)">'+
 '<text x="540" y="492" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="'+s+'" fill="#000" opacity=".25" transform="translate(3 4)">'+esc(txt)+'</text>'+
 '<text x="540" y="492" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="'+s+'" fill="#fff">'+esc(txt)+'</text>'+
 '<path d="M'+(540-txt.length*s*0.21)+' 520 Q 540 '+(536)+' '+(540+txt.length*s*0.21)+' 514" fill="none" stroke="'+col+'" stroke-width="7" stroke-linecap="round"/></g></g>';}
var PAL={p1:['#F2A51A','#B8560B'],p2:['#E8562A','#8E1F12'],p3:['#C21F3A','#4A0814'],p4:['#7B3FD0','#2A1260'],p5:['#2F6FD6','#0E2456'],p6:['#D23C1E','#3A0A04'],p7:['#E0306A','#4A0A24'],p8:['#C9A24A','#4A3410']};
var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="40" stdDeviation="30" flood-color="#000" flood-opacity=".45"/></filter>'+
 '<filter id="dso" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="22" stdDeviation="16" flood-color="#000" flood-opacity=".35"/></filter><filter id="bo"><feGaussianBlur stdDeviation="5"/></filter>'+
 '<radialGradient id="lt" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
 '<radialGradient id="med" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFF6D2"/><stop offset=".45" stop-color="#F1C860"/><stop offset=".8" stop-color="#C08A1E"/><stop offset="1" stop-color="#7A5208"/></radialGradient>'+
 '<clipPath id="mc"><circle cx="540" cy="0" r="180"/></clipPath><linearGradient id="shn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
function bgF(c1,c2){return '<rect width="1080" height="1920" fill="'+c2+'"/><rect width="1080" height="1920" fill="'+c1+'" opacity=".85"/><rect width="1080" height="1920" fill="url(#lt)"/><radialGradient id="vg2" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="'+c2+'" stop-opacity="0"/><stop offset="1" stop-color="'+c2+'" stop-opacity=".9"/></radialGradient><rect width="1080" height="1920" fill="url(#vg2)"/>';}
function big(txt,y,s,op,dx,col){if(op<=0)return '';return '<text x="'+(540+(dx||0))+'" y="'+y+'" text-anchor="middle" font-family="Anton" font-size="'+s+'" fill="'+(col||'#fff')+'" opacity="'+op+'" letter-spacing="-4">'+esc(txt)+'</text>';}
function fit(txt,max){return Math.min(max,1900/Math.max(3,txt.length));}
function explode(t0,lt,notes,cx,cy,n,seed,front,ymin){ymin=ymin||470;var s='';var k=e5(cl((lt-t0)/0.9));if(lt<t0)return '';
 for(var j=0;j<n;j++){var r1=hsh(seed+j*2.3),r2=hsh(seed+j*4.1),r3=hsh(seed+j*6.7);var isF=r3>0.78;if(isF!=front)continue;
  var a=r1*6.283;var R=280+r2*420;var side=false;if(cy+Math.sin(a)*R*1.25-40<ymin){if(ymin<500)side=true;else continue;}var dr=(lt-t0)*14;var dx0=Math.cos(a)*(R*k+dr);if(side){var sg=Math.cos(a)<0?-1:1;dx0=sg*Math.max(Math.abs(dx0),(410+r2*80)*k);}var x=cx+dx0,y=cy+Math.sin(a)*(R*k+dr)*1.25-40;var sz=(isF?110:130)+r2*170;var rot=r3*360+(lt-t0)*25*(r1-0.5);
  s+=oimg(OB(notes[j%notes.length],j+seed),x,y,sz*(0.4+0.6*k),rot,cl(k*3),isF?'filter="url(#bo)"':'filter="url(#dso)"');}
 return s;}
function pill(txt,x,y,s,bg,fg,op){if(op<=0)return '';var w=txt.length*s*0.66+s*1.6;return '<g opacity="'+op+'"><rect x="'+(x-w/2)+'" y="'+(y-s*1.15)+'" width="'+w+'" height="'+(s*1.7)+'" rx="'+(s*0.85)+'" fill="'+bg+'"/>'+T(txt,x,y,{f:'Montserrat',w:800,s:s,c:fg,ls:2})+'</g>';}
function medal(cy,sc,tt){if(sc<=0)return '';var sx=-260+((tt*0.55)%1.6)*560;
 return '<g transform="translate(540 '+cy+') scale('+sc+') translate(-540 0)"><circle cx="540" cy="14" r="184" fill="#000" opacity=".35" filter="url(#bo)"/><circle cx="540" cy="0" r="180" fill="url(#med)"/><circle cx="540" cy="0" r="171" fill="none" stroke="#FFF1C2" stroke-width="2" opacity=".7"/>'+
  '<image href="fotos/logo_armaf_hd.png" x="390" y="-150" width="300" height="300" opacity=".92"/>'+
  '<g clip-path="url(#mc)"><rect x="'+(540+sx)+'" y="-220" width="120" height="440" fill="url(#shn)" transform="skewX(-22)"/></g></g>';}
function render(t){var out=DEFS;var cam=1;var showSub=true;
 if(t<C.p1){out+=bgF('#2A1A10','#000');
  var z=t>=C.go?Math.pow(cl((t-C.go)/1.2),2):0;cam=1+z*2.2;
  out+='<g transform="translate(540 1100) scale('+cam+') translate(-540 -1100)">';
  var k1=e5(cl(t/0.6)),k2=e5(cl((t-0.2)/0.6));
  out+=big('CLUB DE',560+(1-k1)*300,250,k1*0.95)+big('NUIT',1040+(1-k2)*300,560,k2,0,'#F2A51A');
  out+=explode(0.5,t,allNotes(),540,1100,30,7,false,640);
  for(var i=0;i<8;i++){var p=P[i];var u=(i-3.5)/3.5;var kk=eb(cl((t-0.6-Math.abs(u)*0.4)/0.5));var x=540+u*420,y=1180+u*u*120;if(kk>0)out+='<g transform="translate('+x+' '+(y+180)+') scale('+kk+') rotate('+(u*10)+') translate('+(-x)+' '+(-y-180)+')">'+img(p.cut,x,y,i==3||i==4?520:420,1,0,'filter="url(#ds)"')+'</g>';}
  out+=explode(0.5,t,allNotes(),540,1100,30,7,true,640);
  // logo Armaf: sube desde abajo y pisa el cuarto inferior de los frascos
  var mk=eb(cl((t-1.25)/0.6));out+=medal(L(2200,1492,mk),0.9+0.1*mk,t);
  out+='</g>';
  if(t>=C.h2&&t<C.h4){var k=e5(cl((t-C.h2)/0.5))*cl((C.h4-t)/0.2);out+=T('LA SERIE QUE HIZO FAMOSA A ARMAF',540,1775,{f:'Montserrat',w:700,s:36,c:'#fff',ls:7,op:k})+'<rect x="'+(540-200*k)+'" y="1805" width="'+(400*k)+'" height="3" fill="#F2A51A"/>';}
  if(t>=C.h4&&t<C.go){var k=e5(cl((t-C.h4)/0.4));out+=T('PARTE 01',540,1740,{f:'Montserrat',w:800,s:36,c:'#F2A51A',ls:12,op:k})+T('LA FAMILIA INTENSE',540,1835,{f:'Anton',s:88,c:'#fff',ls:2,op:k,tr:'translate(0 '+(1-k)*40+')'});}
  if(t>=C.go){var g=t-C.go;out+=T('¡ARRANCAMOS!',540,980,{f:'Anton',s:150,c:'#fff',op:cl(g/0.15)*cl((1.3-g)/0.2),tr:'translate(540 930) scale('+(0.8+g*0.3)+') translate(-540 -930)'});out+='<rect width="1080" height="1920" fill="#fff" opacity="'+cl((g-1.15)/0.3)+'"/>';}
 }
 var c=curP(t);
 if(c){var p=c.p,i=c.i,lt=c.lt,pl=PAL[p.k]||['#F2A51A','#B8560B'],notes=notesOf(p);var iT=C[p.i]-C[p.k],qT=C[p.q]-C[p.k],nT=C[p.n]-C[p.k];var ik=e5(cl((lt-iT)/0.5));
  var col=ik>0?mix(pl[0],'#C9A24A',ik):pl[0];out+=bgF(col,pl[1]);
  cam=1+lt*0.012;out+='<g transform="translate(540 1000) scale('+cam+') translate(-540 -1000)">';
  var w=WORD[p.k]||p.name.split(' ').pop();var wk=e5(cl((lt-0.05)/0.6));
  out+=big(w,1130+(1-wk)*500,fit(w,720),0.95*(1-ik),0);
  if(ik>0){var w2=p.ins.n.toUpperCase().split(' ');if(w2.length==1&&p.ins.mt)w2.push(p.ins.mt);out+=big(w2[0],820+(1-ik)*400,fit(w2[0],560),ik)+(w2[1]?big(w2[1],1240+(1-ik)*400,fit(w2[1],440),ik,0,'#111'):'');}
  var bx=L(540,330,ik),bs=L(1,0.74,ik);
  out+='<g transform="translate('+(-ik*200)+' 0)">'+explode(0.35,lt,notes,540,1000,18,i*13+3,false)+'</g>';
  var dk=eb(cl(lt/0.5));var by=L(-600,1010,dk);
  out+='<ellipse cx="'+bx+'" cy="1440" rx="'+(260*bs*dk)+'" ry="34" fill="#000" opacity=".25" filter="url(#bo)"/>';
  out+='<g transform="translate('+bx+' '+by+') scale('+bs+') translate(-540 -1010)">'+img(p.cut,540,1010,860,1,Math.sin(lt*1.4)*1.5,'filter="url(#ds)"')+'</g>';
  if(ik>0){var x2=L(1400,800,ik);out+='<ellipse cx="'+x2+'" cy="1440" rx="200" ry="30" fill="#000" opacity=".25" filter="url(#bo)"/>'+img(p.ins.img,x2,1060,700,1,4,'filter="url(#ds)"');}
  out+='<g transform="translate('+(-ik*200)+' 0)">'+explode(0.35,lt,notes,540,1000,18,i*13+3,true)+'</g>';
  out+='</g>';
  var hk=e5(cl((lt-0.15)/0.5));var nm=p.name;var sub=nm.indexOf('CLUB DE NUIT')==0?'CLUB DE NUIT':'CLUB DE NUIT';
  out+='<g opacity="'+(1-ik)+'">'+T(sub,540,190,{f:'Montserrat',w:600,s:30,c:'#fff',ls:14,op:hk})+T(nm.replace('CLUB DE NUIT ',''),540,262,{f:'Montserrat',w:900,s:62,c:'#fff',ls:4,op:hk})+'</g>';
  out+=emo(EMO[p.k]||'',lt,0.8,1-ik,'#FFE29A');
  if(ik>0)out+=T('INSPIRADO EN',540,210,{f:'Montserrat',w:800,s:44,c:'#fff',ls:14,op:ik});
  if(lt>=nT){p.N.slice(0,3).forEach(function(n,j){var k=e5(cl((lt-nT-j*0.4)/0.35))*(1-ik);out+=pill(n[1].toUpperCase(),[250,540,830][j],350,30,'rgba(0,0,0,.28)','#fff',k);});}
  if(lt>=qT){var k=e5(cl((lt-qT)/0.4))*(1-ik);out+=T(QT[p.k]||p.quote,540,1500,{f:'Playfair Display',it:1,w:500,s:46,c:'#fff',op:k,tr:'translate(0 '+(1-k)*30+')'});
   var k2=eb(cl((lt-qT-1.0)/0.4))*(1-ik);if(k2>0)out+='<g transform="translate(540 1590) scale('+k2+') translate(-540 -1590)">'+pill(MK[p.k]||p.mk[1],540,1600,34,'#fff',pl[1],1)+'</g>';}
  if(lt<0.35){var k=e5(cl(lt/0.35));out+='<circle cx="540" cy="1000" r="'+(k*1400)+'" fill="none" stroke="#fff" stroke-width="'+((1-k)*2800)+'"/>';}
 }
 if(t>=C.out&&t<C.end){var lt=t-C.out;out+=bgF('#2A1A10','#000');var k1=e5(cl(lt/0.6));
  out+=big('¿CON CUÁL',520+(1-k1)*300,190,k1)+big('TE QUEDÁS?',760+(1-k1)*300,190,k1,0,'#F2A51A');
  out+=explode(0.2,lt,allNotes(),540,1150,40,21,false,840);
  for(var i=0;i<8;i++){var p=P[i];var u=(i-3.5)/3.5;var kk=eb(cl((lt-0.1-Math.abs(u)*0.3)/0.5));var x=540+u*420,y=1200+u*u*120;if(kk>0)out+='<g transform="translate('+x+' '+(y+180)+') scale('+kk+') rotate('+(u*10)+') translate('+(-x)+' '+(-y-180)+')">'+img(p.cut,x,y,i==3||i==4?500:400,1,0,'filter="url(#ds)"')+'</g>';}
  out+=explode(0.2,lt,allNotes(),540,1150,40,21,true,840);
  if(t>=C.out2){var k=eb(cl((t-C.out2)/0.4));out+='<g transform="translate(540 1500) scale('+k+') translate(-540 -1500)">'+pill('MIRÁ LAS OTRAS PARTES DE LA SERIE',540,1510,32,'#F2A51A','#111',1)+'</g>';}
  if(t>=C.fol){var k=eb(cl((t-C.fol)/0.4));out+='<g transform="translate(540 1590) scale('+k+') translate(-540 -1590)">'+pill('+ MÁS SERIES EN NUESTRO PERFIL · SEGUINOS',540,1600,30,'#fff','#2A1A10',1)+'</g>';}
  if(lt<0.3){var k=e5(cl(lt/0.3));out+='<circle cx="540" cy="1000" r="'+(k*1400)+'" fill="none" stroke="#fff" stroke-width="'+((1-k)*2800)+'"/>';}
 }
 if(t>=C.end){showSub=false;var lt=t-C.end;out+=bgF('#3A2410','#000');var k=e5(cl(lt/0.6));
  out+=big('BELLE',1060,420,0.10*k,0,'#F2A51A');
  out+=T('LOS ENCONTRÁS EN',540,560,{f:'Montserrat',w:700,s:40,c:'#F2A51A',ls:14,op:k});
  out+='<image href="fotos/logoB_ink.png" x="390" y="'+(640+(1-k)*40)+'" width="300" height="330" preserveAspectRatio="xMidYMid meet" opacity="'+k+'" style="filter:invert(1)"/>';
  var k2=eb(cl((lt-0.35)/0.5));out+='<g transform="translate(540 1110) scale('+k2+') translate(-540 -1110)">'+pill('distribuidorabelle.com',540,1130,52,'#fff','#2A1A10',1)+'</g>';
  out+=T('ELEGÍ EL TUYO · PEDILO ONLINE',540,1290,{f:'Montserrat',w:600,s:32,c:'#fff',ls:6,op:e5(cl((lt-0.7)/0.5))});}
 document.getElementById('sv').innerHTML=out;if(showSub)subs(t,/^(Mandarina|canela|cuero|One|Million|Intense|ADN|presencia|duración|leyenda|Aventus|Creed|Limón|ananá|abedul|ciruela|vainilla|Caramelo|Absolu|terciopelo|furor)$/i);else document.getElementById('sub').innerHTML='';}
