var TY=1340;
function SH(f,t){if(f.indexOf('vid_')!==0)return 'fotos/'+f;var n=VF[f]||192,k=Math.floor(t*24*0.5)%(2*n-2);if(k>=n)k=2*n-2-k;return 'fotos/'+f+'/f'+('000'+(k+1)).slice(-4)+'.jpg';}
var VF={};
// HAWAS · MODELO ESCENARIOS (fondos reales por perfume + botella en pedestal + notas flotando)
var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#000" flood-opacity=".55"/></filter><filter id="dso" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000" flood-opacity=".45"/></filter>'+
 '<filter id="dof"><feGaussianBlur stdDeviation="9"/></filter><filter id="b20"><feGaussianBlur stdDeviation="20"/></filter><filter id="b6"><feGaussianBlur stdDeviation="6"/></filter>'+
 '<linearGradient id="topfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient></defs>';
function scene(f,t,op,ped){if(op<=0)return '';ped=ped||1340;var zm=Math.max(1,TY/ped,(1920-TY)/(1920-ped));var z=zm*(1+0.035*(0.5+0.5*Math.sin(t*0.12)));return '<image href="'+SH(f,t)+'" x="'+(540-540*z)+'" y="'+(TY-ped*z)+'" width="'+(1080*z)+'" height="'+(1920*z)+'" preserveAspectRatio="xMidYMid slice" opacity="'+op+'"/><rect width="1080" height="1920" fill="url(#topfade)" opacity="'+op+'"/>';}
function bottleOn(f,cx,baseY,h,op,sc){if(op<=0)return '';var cy=baseY-h/2;return '<g opacity="'+op+'" transform="translate('+cx+' '+baseY+') scale('+sc+') translate('+(-cx)+' '+(-baseY)+')"><ellipse cx="'+cx+'" cy="'+(baseY-4)+'" rx="'+(h*0.3)+'" ry="'+(h*0.035)+'" fill="#000" opacity=".55" filter="url(#b6)"/><ellipse cx="'+cx+'" cy="'+(baseY-6)+'" rx="'+(h*0.42)+'" ry="'+(h*0.06)+'" fill="#000" opacity=".25" filter="url(#b20)"/>'+img(f,cx,cy,h,1,0,'')+'</g>';}
function floatNotes(lt,p,cx,cy,k,front){var s='',n=p.N.length;for(var j=0;j<n;j++){var side=j%2?1:-1;var row=Math.floor(j/2);var x=cx+side*(300+row*40)+Math.sin(lt*0.6+j)*24,y=cy-280+row*260+Math.cos(lt*0.8+j*1.7)*22;var sz=(200+hsh(j*5)*60)*k;
  if(!front)s+=oimg(OB(p.N[j][0],j),x,y,sz,Math.sin(lt*0.5+j)*14,k,'filter="url(#dso)"');}
 if(front){for(var j=0;j<2;j++){var o=OB(p.N[(j*3+1)%n][0],j+5);var x=j?960:110,y=j?1580:1650;s+=oimg(o,x+Math.sin(lt*0.4+j)*16,y,420*k,j?-20:25,k*0.95,'filter="url(#dof)"');}}
 return s;}
function medalR(cy,sc,tt){if(sc<=0)return '';var sx=-300+((tt*0.5)%1.8)*600;
 return '<defs><radialGradient id="medr" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFF6D2"/><stop offset=".45" stop-color="#F1C860"/><stop offset=".8" stop-color="#C08A1E"/><stop offset="1" stop-color="#7A5208"/></radialGradient><clipPath id="mcr"><circle cx="540" cy="0" r="175"/></clipPath><linearGradient id="shr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'+
 '<g transform="translate(540 '+cy+') scale('+sc+') translate(-540 0)"><circle cx="540" cy="16" r="180" fill="#000" opacity=".4" filter="url(#b20)"/><circle cx="540" cy="0" r="175" fill="url(#medr)"/><circle cx="540" cy="0" r="160" fill="none" stroke="#FFF1C2" stroke-width="2" opacity=".8"/><circle cx="540" cy="0" r="150" fill="none" stroke="#7A5208" stroke-width="1.5" opacity=".6"/>'+
 '<image href="fotos/logo_rasasi_hd_k.png" x="410" y="-44" width="260" height="84" preserveAspectRatio="xMidYMid meet" opacity=".9"/>'+T('PERFUMES · DUBAI',540,78,{f:'Montserrat',w:700,s:16,c:'#5A3A06',ls:5,op:.85})+
 '<g clip-path="url(#mcr)"><rect x="'+(540+sx)+'" y="-220" width="120" height="440" fill="url(#shr)" transform="skewX(-22)"/></g></g>';}
function glassLogo(cy,op,tt){if(op<=0)return '';var sx=-260+((tt*0.45)%1.8)*560;return '<g opacity="'+op+'"><defs><clipPath id="glc"><rect x="290" y="'+(cy-70)+'" width="500" height="140" rx="70"/></clipPath><linearGradient id="gsh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'+
 '<rect x="290" y="'+(cy-70)+'" width="500" height="140" rx="70" fill="#fff" opacity=".14"/><rect x="290" y="'+(cy-70)+'" width="500" height="140" rx="70" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>'+
 '<image href="fotos/logo_rasasi_hd_w.png" x="350" y="'+(cy-48)+'" width="380" height="96" preserveAspectRatio="xMidYMid meet"/>'+
 '<g clip-path="url(#glc)"><rect x="'+(540+sx)+'" y="'+(cy-100)+'" width="90" height="200" fill="url(#gsh)" transform="skewX(-22)"/></g></g>';}
function tilt(svg,deg,cx,cy){return '<g transform="rotate('+deg+' '+cx+' '+cy+')">'+svg+'</g>';}
function serif(txt,x,y,s,o){o=o||{};return T(txt,x,y,{f:'Playfair Display',w:o.w||900,it:o.it,s:s,c:o.c||'#fff',ls:o.ls||0,op:o.op,a:o.a});}
function sans(txt,x,y,s,o){o=o||{};return T(txt,x,y,{f:'Montserrat',w:o.w||700,s:s,c:o.c||'#fff',ls:o.ls==null?6:o.ls,op:o.op,a:o.a});}
function cta(txt,y,op){if(op<=0)return '';var w=txt.length*17+80;return '<g opacity="'+op+'"><rect x="'+(540-w/2)+'" y="'+(y-40)+'" width="'+w+'" height="60" rx="30" fill="none" stroke="#fff" stroke-width="2.5"/>'+sans(txt,540,y-1,24,{w:800,ls:3})+'</g>';}
function render(t){var out=DEFS;
 if(t<C.p1){var n=P.length,w=1080/n;for(var i=0;i<n;i++){var p=P[i];var x0=i*w;var kk=e5(cl((t-i*0.14)/0.6));
   out+='<clipPath id="ip'+i+'"><rect x="'+x0+'" y="'+(1920*(1-kk))+'" width="'+w+'" height="1920"/></clipPath><g clip-path="url(#ip'+i+')"><image href="'+SH(p.scene,t)+'" x="'+(x0+w/2-540)+'" y="0" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>'+bottleOn(p.cut,x0+w/2,p.ped,Math.min(560,w*1.45),1,eb(cl((t-0.4-i*0.14)/0.5)))+'</g>';
   if(i)out+='<rect x="'+(x0-2)+'" y="'+(1920*(1-kk))+'" width="4" height="1920" fill="#fff" opacity=".85"/>';}
  out+='<rect width="1080" height="1920" fill="url(#topfade)"/>';var k=e5(cl((t-0.7)/0.6));
  out+=glassLogo(250,k,t)+serif('HAWAS',540,560+(1-k)*40,230,{op:k,ls:6});
  if(t>=C.h2)out+=sans('LA SERIE MÁS FAMOSA DE RASASI',540,1530,30,{ls:6,op:e5(cl((t-C.h2)/0.5))});if(t>=C.h4){var pk=e5(cl((t-C.h4)/0.5));out+=sans('PARTE '+PARTE.n,540,1610,30,{ls:12,op:pk})+serif(PARTE.t,540,1700,80,{op:pk});}}
 var c=curP(t);
 if(c){var p=c.p,lt=c.lt;var iT=C[p.i]-C[p.k],qT=C[p.q]-C[p.k],nT=C[p.n]-C[p.k],eT=C[p.e]-C[p.k];var ik=e5(cl((lt-iT)/0.5));var prev=c.i>0?P[c.i-1].scene:p.scene;var tk=e5(cl(lt/0.7));
  var pp=c.i>0?P[c.i-1]:p;if(tk<1)out+=scene(pp.scene,t,1,pp.ped);out+=scene(p.scene,t,tk,p.ped);
  var nk=e5(cl((lt-nT+0.3)/0.6))*(1-cl(ik*1.6));out+=floatNotes(lt,p,540,1000,nk,false);
  var two=!!p.ins.img2,none=!p.ins.img;
  if(ik>0&&!none){if(two){var i1=L(1400,560,ik),i2=L(1500,850,ik);out+=tilt(bottleOn(p.ins.img2,i2,TY,720,1,1),-8*ik,i2,TY)+tilt(bottleOn(p.ins.img,i1,TY,700,1,1),-2*ik,i1,TY);}
   else{var ix=L(1400,765,ik);out+=tilt(bottleOn(p.ins.img,ix,TY,790,1,1),-6*ik,ix,TY);}}
  var bx=none?540:L(540,two?250:330,ik),sc=L(1,none?1:(two?0.8:0.88),ik),bk=eb(cl((lt-0.15)/0.6));out+=tilt(bottleOn(p.cut,bx,TY,880,cl(bk*1.5),sc*(0.85+0.15*bk)),(none?0:6)*ik,bx,TY);
  
  out+=floatNotes(lt,p,540,1000,nk,true);
  // textos estilo afiche
  var hk=e5(cl((lt-0.2)/0.6))*(1-ik);out+=sans('HAWAS · RASASI',540,200,26,{ls:12,op:hk})+serif(p.title,540,330,150,{op:hk});
  out+=sans(p.emo,540,400,30,{w:600,ls:1,op:e5(cl((lt-eT)/0.5))*(1-ik)});
  if(lt>=qT){var q=e5(cl((lt-qT)/0.5))*(1-ik);out+=serif(p.quote,540,1500,46,{w:500,it:1,op:q});out+=cta(p.mk,1590,e5(cl((lt-qT-0.6)/0.4))*(1-ik));}
  if(ik>0){var nn=p.ins.n2?p.ins.n+' · '+p.ins.n2:p.ins.n;out+=sans(p.ins.lbl||'INSPIRADO EN',540,210,30,{ls:10,op:ik})+serif(nn,540,330,Math.min(130,1700/nn.length),{op:ik})+sans(p.ins.mt||'',540,395,26,{ls:8,op:ik});}}
 if(t>=C.out){var lt=t-C.out,k=e5(cl(lt/0.6));var n=P.length,wd=1080/n;for(var i=0;i<n;i++){var p=P[i];var x0=i*wd;var kk=e5(cl((lt-i*0.12)/0.5));
   out+='<clipPath id="pn'+i+'"><rect x="'+x0+'" y="'+(1920*(1-kk))+'" width="'+wd+'" height="1920"/></clipPath><g clip-path="url(#pn'+i+')"><image href="'+SH(p.scene,t)+'" x="'+(x0+wd/2-540)+'" y="0" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>'+bottleOn(p.cut,x0+wd/2,p.ped,Math.min(520,wd*1.45),1,1)+'</g>';
   if(i)out+='<rect x="'+(x0-2)+'" y="0" width="4" height="1920" fill="#fff" opacity=".8"/>';}
  var s1=t>=C.s1?e5(cl((t-C.s1)/0.5)):0,fq=t>=C.fq?e5(cl((t-C.fq)/0.5)):0,dim=s1*(1-fq);
  out+='<rect width="1080" height="1920" fill="url(#topfade)"/>';
  if(dim>0)out+='<rect width="1080" height="1920" fill="#050a14" opacity="'+(0.72*dim)+'"/>';
  var k1=k*(1-s1);out+=serif('¿Con cuál',540,330,130,{op:k1})+serif('te quedás?',540,470,130,{it:1,w:500,op:k1});
  P.forEach(function(p,i){out+=sans(p.title.toUpperCase(),i*wd+wd/2,1420,Math.min(30,wd/p.title.length*1.3),{ls:2,op:e5(cl((lt-0.5)/0.4))*(1-dim)});});
  if(dim>0){var a1=dim;out+=sans('ESTA FUE LA',540,520,34,{ls:12,op:a1})+serif('Parte '+PARTE.n,540,660,150,{op:a1})+sans('NO TE PIERDAS LAS OTRAS PARTES DE LA SERIE',540,760,27,{ls:4,op:a1});
   var s2=t>=C.s2?eb(cl((t-C.s2)/0.6)):0;if(s2>0){var pu=1+0.035*Math.sin((t-C.s2)*5.5)*cl((t-C.s2-0.6)/0.3),op2=s2*(1-fq);
    out+='<g opacity="'+op2+'" transform="translate(540 1000) scale('+(pu*(0.7+0.3*s2))+') translate(-540 -1000)"><rect x="150" y="915" width="780" height="170" rx="85" fill="#fff"/>'+sans('SEGUINOS',540,1035,104,{w:800,ls:6,c:'#0b1220'})+'</g>'+sans('EN NUESTRO PERFIL',540,1170,46,{w:800,ls:8,op:op2});}
   var w2=t>=C.web?e5(cl((t-C.web)/0.5))*(1-fq):0;if(w2>0)out+=sans('WWW.DISTRIBUIDORABELLE.COM',540,1330,34,{w:700,ls:4,op:w2});}
  if(fq>0)out+=serif('¿Y a vos',540,330,128,{op:fq})+serif('cuál te gusta más?',540,470,96,{it:1,w:500,op:fq});}
 document.getElementById('sv').innerHTML=out;}
