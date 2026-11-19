// HAWAS · MODELO ESCENARIOS (fondos reales por perfume + botella en pedestal + notas flotando)
var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#000" flood-opacity=".55"/></filter><filter id="dso" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000" flood-opacity=".45"/></filter>'+
 '<filter id="dof"><feGaussianBlur stdDeviation="9"/></filter><filter id="b20"><feGaussianBlur stdDeviation="20"/></filter><filter id="b6"><feGaussianBlur stdDeviation="6"/></filter>'+
 '<linearGradient id="topfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient></defs>';
function scene(f,t,op){if(op<=0)return '';var z=1.04+0.05*Math.sin(t*0.12);return '<image href="fotos/'+f+'" x="'+(540-540*z)+'" y="'+(960-960*z)+'" width="'+(1080*z)+'" height="'+(1920*z)+'" preserveAspectRatio="xMidYMid slice" opacity="'+op+'"/><rect width="1080" height="1920" fill="url(#topfade)" opacity="'+op+'"/>';}
function bottleOn(f,cx,baseY,h,op,sc){if(op<=0)return '';var cy=baseY-h/2;return '<g opacity="'+op+'" transform="translate('+cx+' '+baseY+') scale('+sc+') translate('+(-cx)+' '+(-baseY)+')"><ellipse cx="'+cx+'" cy="'+(baseY-4)+'" rx="'+(h*0.3)+'" ry="'+(h*0.035)+'" fill="#000" opacity=".55" filter="url(#b6)"/><ellipse cx="'+cx+'" cy="'+(baseY-6)+'" rx="'+(h*0.42)+'" ry="'+(h*0.06)+'" fill="#000" opacity=".25" filter="url(#b20)"/>'+img(f,cx,cy,h,1,0,'')+'</g>';}
function floatNotes(lt,p,cx,cy,k,front){var s='',n=p.N.length;for(var j=0;j<n;j++){var side=j%2?1:-1;var row=Math.floor(j/2);var x=cx+side*(300+row*40)+Math.sin(lt*0.6+j)*24,y=cy-280+row*260+Math.cos(lt*0.8+j*1.7)*22;var sz=(200+hsh(j*5)*60)*k;
  if(!front)s+=oimg(OB(p.N[j][0],j),x,y,sz,Math.sin(lt*0.5+j)*14,k,'filter="url(#dso)"');}
 if(front){for(var j=0;j<2;j++){var o=OB(p.N[(j*3+1)%n][0],j+5);var x=j?960:110,y=j?1580:1650;s+=oimg(o,x+Math.sin(lt*0.4+j)*16,y,420*k,j?-20:25,k*0.95,'filter="url(#dof)"');}}
 return s;}
function serif(txt,x,y,s,o){o=o||{};return T(txt,x,y,{f:'Playfair Display',w:o.w||900,it:o.it,s:s,c:o.c||'#fff',ls:o.ls||0,op:o.op,a:o.a});}
function sans(txt,x,y,s,o){o=o||{};return T(txt,x,y,{f:'Montserrat',w:o.w||700,s:s,c:o.c||'#fff',ls:o.ls==null?6:o.ls,op:o.op,a:o.a});}
function cta(txt,y,op){if(op<=0)return '';var w=txt.length*17+80;return '<g opacity="'+op+'"><rect x="'+(540-w/2)+'" y="'+(y-40)+'" width="'+w+'" height="60" rx="30" fill="none" stroke="#fff" stroke-width="2.5"/>'+sans(txt,540,y-1,24,{w:800,ls:3})+'</g>';}
function render(t){var out=DEFS;
 if(t<C.p1){var k=e5(cl(t/0.6));out+=scene(INTRO_BG,t,1);
  out+=T('HAWAS',540,330,{f:'Anton',s:300,c:'#D7263D',ls:6,op:k});out+=sans('RASASI · LA SERIE COMPLETA',540,400,30,{c:'#111',ls:8,op:e5(cl((t-0.4)/0.5))});
  var bk=eb(cl((t-0.6)/0.7));for(var i=0;i<3;i++){var f=['h46890hd.png','h89050hd.png','h96817hd.png'][i];var x=540+(i-1)*230;out+=bottleOn(f,x,1330+(i==1?0:-20),i==1?700:560,cl(bk*2),bk*(i==1?1:0.92));}
  for(var j=0;j<10;j++){var a=hsh(j)*6.28,r=200+bk*500*hsh(j*3);out+='<rect x="'+(540+Math.cos(a)*r)+'" y="'+(1000+Math.sin(a)*r*0.8)+'" width="'+(20+hsh(j*7)*30)+'" height="'+(14+hsh(j*9)*20)+'" fill="#F2EEE4" opacity="'+bk*0.9+'" transform="rotate('+(j*37+t*40)+' '+(540+Math.cos(a)*r)+' '+(1000+Math.sin(a)*r*0.8)+')"/>';}}
 var c=curP(t);
 if(c){var p=c.p,lt=c.lt;var iT=C[p.i]-C[p.k],qT=C[p.q]-C[p.k],nT=C[p.n]-C[p.k],eT=C[p.e]-C[p.k];var ik=e5(cl((lt-iT)/0.5));var prev=c.i>0?P[c.i-1].scene:INTRO_BG;var tk=e5(cl(lt/0.7));
  if(tk<1)out+=scene(prev,t,1);out+=scene(p.scene,t,tk);
  var nk=e5(cl((lt-nT+0.3)/0.6));out+=floatNotes(lt,p,540,1000,nk*L(1,0.6,ik),false);
  var bx=L(540,330,ik),sc=L(1,0.86,ik),bk=eb(cl((lt-0.15)/0.6));out+=bottleOn(p.cut,bx,p.py,880,cl(bk*1.5),sc*(0.85+0.15*bk));
  if(ik>0)out+=bottleOn(p.ins.img,L(1400,790,ik),p.py,800,1,1);
  out+=floatNotes(lt,p,540,1000,nk*(1-ik),true);
  // textos estilo afiche
  var hk=e5(cl((lt-0.2)/0.6))*(1-ik);out+=sans('HAWAS · RASASI',540,200,26,{ls:12,op:hk})+serif(p.title,540,330,150,{op:hk});
  out+=sans(p.emo,540,400,30,{w:600,ls:1,op:e5(cl((lt-eT)/0.5))*(1-ik)});
  if(lt>=qT){var q=e5(cl((lt-qT)/0.5))*(1-ik);out+=serif(p.quote,540,1500,46,{w:500,it:1,op:q});out+=cta(p.mk,1590,e5(cl((lt-qT-0.6)/0.4))*(1-ik));}
  if(ik>0){out+=sans('INSPIRADO EN',540,210,30,{ls:12,op:ik})+serif(p.ins.n,540,330,Math.min(130,1500/p.ins.n.length),{op:ik})+sans(p.ins.mt||'',540,395,26,{ls:10,op:ik});}}
 if(t>=C.out){var lt=t-C.out,k=e5(cl(lt/0.6));out+=scene(OUTRO_BG,t,1);out+=serif('¿Con cuál',540,420,130,{op:k})+serif('te quedás?',540,560,130,{it:1,w:500,op:k});
  for(var i=0;i<3;i++){var f=['h46890hd.png','h89050hd.png','h96817hd.png'][i];var x=540+(i-1)*260;out+=bottleOn(f,x,1360,i==1?640:540,e5(cl((lt-0.2-i*0.12)/0.5)),1);}
  out+=cta('SEGUINOS PARA VER TODOS',1520,e5(cl((lt-0.8)/0.5)));}
 document.getElementById('sv').innerHTML=out;}
