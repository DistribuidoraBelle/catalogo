// HAWAS · FORMATO PERFUME X PERFUME (nombre cortado abajo + HAWAS vertical + notas orbitando)
var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="34" stdDeviation="26" flood-color="#000" flood-opacity=".5"/></filter><filter id="dso" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#000" flood-opacity=".4"/></filter><filter id="bo"><feGaussianBlur stdDeviation="6"/></filter><filter id="b40"><feGaussianBlur stdDeviation="40"/></filter><filter id="b160" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="150"/></filter></defs>';
function mesh(B,t){var c=B.c,s='<rect width="1080" height="1920" fill="'+B.base+'"/>';var P=[[200,420],[880,620],[260,1320],[860,1560]];
 for(var i=0;i<4;i++){var x=P[i][0]+Math.sin(t*0.5+i*1.7)*140,y=P[i][1]+Math.cos(t*0.4+i*1.3)*160;s+='<circle cx="'+x+'" cy="'+y+'" r="560" fill="'+c[i]+'" opacity=".85" filter="url(#b160)"/>';}
 if(B.pat=='waves')for(var j=0;j<14;j++){var y=j*150+((t*40)%150),d='M-20 '+y;for(var x=0;x<=1100;x+=40)d+=' L'+x+' '+(y+Math.sin(x*0.012+t+j)*26).toFixed(1);s+='<path d="'+d+'" fill="none" stroke="#fff" stroke-width="3" opacity=".16"/>';}
 if(B.pat=='dots'){for(var yy=0;yy<1920;yy+=54)for(var xx=0;xx<1080;xx+=54){var r=4+3*Math.sin(xx*0.01+yy*0.008+t*1.5);s+='<circle cx="'+(xx+(yy/54%2)*27)+'" cy="'+yy+'" r="'+Math.max(1,r)+'" fill="#fff" opacity=".22"/>';}}
 if(B.pat=='stripes')for(var j=-10;j<30;j++){var x=j*110+((t*50)%110);s+='<path d="M'+x+' 0 L'+(x+60)+' 0 L'+(x-940)+' 1920 L'+(x-1000)+' 1920Z" fill="#fff" opacity=".07"/>';}
 return s+'<radialGradient id="vg" cx="50%" cy="45%" r="80%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient><rect width="1080" height="1920" fill="url(#vg)"/>';}
function studio(S,t,cy){cy=cy||900;var s='<linearGradient id="sg'+S.a.slice(1)+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+S.a+'"/><stop offset="1" stop-color="'+S.b+'"/></linearGradient><rect width="1080" height="1920" fill="url(#sg'+S.a.slice(1)+')"/>';
 s+='<circle cx="540" cy="'+cy+'" r="520" fill="'+S.d+'" opacity=".55"/><circle cx="540" cy="'+cy+'" r="520" fill="#fff" opacity=".12" filter="url(#b40)"/>';
 for(var i=0;i<3;i++){var r=600+i*90;s+='<circle cx="540" cy="'+cy+'" r="'+r+'" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="'+(6+i*4)+' '+(18+i*8)+'" opacity="'+(0.28-i*0.07)+'" transform="rotate('+(t*(8+i*5)*(i%2?-1:1))+' 540 '+cy+')"/>';}
 s+='<ellipse cx="540" cy="1330" rx="420" ry="60" fill="#000" opacity=".22" filter="url(#b40)"/>';return s;}
var RAINBOW={a:'#3B2C8F',b:'#120A33',d:'#7E6BFF'};
function bg(c1,c2,t){return '<radialGradient id="rg" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></radialGradient><rect width="1080" height="1920" fill="url(#rg)"/><circle cx="540" cy="880" r="430" fill="#fff" opacity=".10" filter="url(#b40)"/>';}
// HAWAS vertical que corre
function vhawas(t,op,col){var s='',step=820,off=(t*60)%step;for(var i=-1;i<4;i++){var y=i*step+off;s+='<text transform="translate(92 '+y+') rotate(90)" font-family="Big Shoulders Display" font-weight="900" font-size="160" fill="none" stroke="'+(col||'#fff')+'" stroke-width="2.5" letter-spacing="8" opacity="'+op+'">HAWAS · </text>';}
 for(var i=-1;i<4;i++){var y=i*step-off+400;s+='<text transform="translate(1040 '+y+') rotate(90)" font-family="Big Shoulders Display" font-weight="900" font-size="160" fill="'+(col||'#fff')+'" letter-spacing="8" opacity="'+(op*0.14)+'">HAWAS · </text>';}return s;}
// nombre gigante abajo cortado a la mitad, sube desde abajo
function bigName(txt,k,col){if(k<=0)return '';var s=Math.min(600,1000/(txt.length*0.52));var base=1920+s*0.17+(1-k)*s*0.9;
 return '<text x="540" y="'+base+'" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="'+s+'" fill="'+(col||'#fff')+'" letter-spacing="2">'+esc(txt)+'</text>';}
// notas orbitando (grandes) — devuelve [atrás, adelante]
function orbit(lt,p,cx,cy,k,labels){var back='',front='',notes=p.N;var n=notes.length;var it=[];
 for(var j=0;j<n;j++){var a=lt*0.75+j*6.283/n;var z=Math.sin(a);var x=cx+Math.cos(a)*460,y=cy+70+z*210-Math.cos(a)*60;var sz=(280+hsh(j*3)*80)*(0.72+z*0.32)*k;
  var o=OB(notes[j][0],j);var g=oimg(o,x,y,sz,Math.sin(lt*0.8+j)*18,k,z<0?'filter="url(#bo)" opacity=".8"':'filter="url(#dso)"');
  if(z>=0&&labels>0)g+='<g opacity="'+labels+'"><rect x="'+(x-notes[j][1].length*9-18)+'" y="'+(y+sz*0.42)+'" width="'+(notes[j][1].length*18+36)+'" height="40" rx="20" fill="rgba(0,0,0,.35)"/>'+T(notes[j][1].toUpperCase(),x,y+sz*0.42+28,{f:'Montserrat',w:800,s:22,c:'#fff',ls:2})+'</g>';
  it.push({z:z,g:g});}
 it.sort(function(a,b){return a.z-b.z});it.forEach(function(q){if(q.z<0)back+=q.g;else front+=q.g;});return [back,front];}
function emoTxt(txt,lt,t0,op,y){if(lt<t0||op<=0)return '';var k=cl((lt-t0)/0.7);var w=1000*eo(k);var s=Math.min(70,1500/txt.length);
 return '<g opacity="'+op+'" transform="rotate(-3 540 '+y+')"><clipPath id="ec"><rect x="40" y="'+(y-100)+'" width="'+w+'" height="180"/></clipPath><g clip-path="url(#ec)"><text x="540" y="'+(y+12)+'" text-anchor="middle" font-family="Permanent Marker" font-weight="400" font-size="'+s+'" fill="#000" opacity=".25" transform="translate(3 4)">'+esc(txt)+'</text><text x="540" y="'+(y+12)+'" text-anchor="middle" font-family="Permanent Marker" font-weight="400" font-size="'+s+'" fill="#fff">'+esc(txt)+'</text><path d="M'+(540-txt.length*s*0.21)+' '+(y+40)+' Q 540 '+(y+56)+' '+(540+txt.length*s*0.21)+' '+(y+34)+'" fill="none" stroke="#FFE29A" stroke-width="7" stroke-linecap="round"/></g></g>';}
function pill(txt,x,y,s,bg,fg,op){if(op<=0)return '';var w=txt.length*s*0.66+s*1.6;return '<g opacity="'+op+'"><rect x="'+(x-w/2)+'" y="'+(y-s*1.15)+'" width="'+w+'" height="'+(s*1.7)+'" rx="'+(s*0.85)+'" fill="'+bg+'"/>'+T(txt,x,y,{f:'Unbounded',w:800,s:s*0.9,c:fg,ls:1})+'</g>';}
function render(t){var out=DEFS;
 if(t<C.p1){out+=studio(RAINBOW,t,1000)+vhawas(t,0.3);var k=e5(cl(t/0.6));
  out+=T('RASASI',540,300,{f:'Unbounded',w:600,s:32,c:'#fff',ls:14,op:k})+T('LA SERIE',540,370,{f:'Unbounded',w:900,s:44,c:'#FFE34D',ls:10,op:e5(cl((t-0.3)/0.5))});
  ALLB.forEach(function(f,i){var u=(i-3)/3;var kk=eb(cl((t-0.4-Math.abs(u)*0.4)/0.5));if(kk>0)out+='<g transform="translate('+(540+u*400)+' 1300) scale('+kk+') translate('+(-540-u*400)+' -1300)">'+img(f,540+u*400,1000+Math.abs(u)*70,Math.abs(u)<0.2?560:430,1,u*9,'filter="url(#ds)"')+'</g>';});
  out+=bigName('HAWAS',e5(cl((t-0.2)/0.8)));}
 var c=curP(t);
 if(c){var p=c.p,lt=c.lt;var iT=C[p.i]-C[p.k],qT=C[p.q]-C[p.k],nT=C[p.n]-C[p.k],eT=C[p.e]-C[p.k];var ik=e5(cl((lt-iT)/0.5));var tEnd=(C[p.end]||C.out)-C[p.k];var xk=e5(cl((lt-(tEnd-0.45))/0.45));
  var prev=c.i>0?P[c.i-1].st:RAINBOW;var tk=e5(cl(lt/0.6));if(tk<1){out+=studio(prev,t);out+='<clipPath id="tc"><circle cx="540" cy="900" r="'+(tk*1500)+'"/></clipPath><g clip-path="url(#tc)">'+studio(p.st,t)+'</g>';}else out+=studio(p.st,t);
  if(ik>0)out+='<rect width="1080" height="1920" fill="#E8C46A" opacity="'+ik*0.22+'"/>';out+=vhawas(t,0.3);
  var bk=eb(cl(lt/0.5));var bx=L(540,300,ik),bs=L(1,0.84,ik);var ok=e5(cl((lt-0.2)/0.6))*(1-xk);
  var ob=orbit(lt,p,540,900,ok*L(1,0.55,ik),0);
  out+=ob[0];
  out+='<g transform="translate('+bx+' 1250) scale('+(bs*bk*(1-xk*0.3))+') translate(-540 -1250)">'+img(p.cut,540,860,900,1-xk,Math.sin(lt*1.2)*1.5,'filter="url(#ds)"')+'</g>';
  if(ik>0)out+=img(p.ins.img,L(1400,790,ik),930,780,1-xk,2,'filter="url(#ds)"');
  out+=ob[1];
  // textos
  var hk=e5(cl((lt-0.1)/0.5))*(1-ik)*(1-xk);out+=T('HAWAS',540,190,{f:'Unbounded',w:900,s:34,c:'#fff',ls:16,op:hk});
  out+=emoTxt(p.emo,lt,eT,(1-ik)*(1-xk),290);
  if(lt>=qT){var k=e5(cl((lt-qT)/0.4))*(1-ik)*(1-xk);out+=T(p.quote,540,1430,{f:'Unbounded',w:600,s:38,c:'#fff',op:k});var m=eb(cl((lt-qT-0.7)/0.4))*(1-ik)*(1-xk);if(m>0)out+='<g transform="translate(540 1520) scale('+m+') translate(-540 -1520)">'+pill(p.mk,540,1530,32,'#fff',p.pal[1],1)+'</g>';}
  if(ik>0){var w=p.ins.n.toUpperCase();out+=T('INSPIRADO EN',540,230,{f:'Unbounded',w:800,s:36,c:'#fff',ls:10,op:ik*(1-xk)})+T(w,540,350,{f:'Big Shoulders Display',w:900,s:Math.min(150,1500/w.length),c:'#fff',op:ik*(1-xk)})+T(p.ins.mt||'',540,410,{f:'Unbounded',w:600,s:28,c:'#fff',ls:8,op:ik*(1-xk)});}
  out+=bigName(p.name,e5(cl((lt-0.1)/0.6))*(1-xk));}
 if(t>=C.out){var lt=t-C.out;out+=studio(RAINBOW,t,880)+vhawas(t,0.3);var k=e5(cl(lt/0.5));out+=T('¿CON CUÁL',540,800,{f:'Big Shoulders Display',w:900,s:210,c:'#fff',op:k})+T('TE QUEDÁS?',540,1000,{f:'Big Shoulders Display',w:900,s:210,c:'#FFE34D',op:k});out+=bigName('HAWAS',k);}
 
 document.getElementById('sv').innerHTML=out;}
