var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="24" dy="36" stdDeviation="20" flood-color="#000" flood-opacity=".35"/></filter><filter id="dso" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000" flood-opacity=".3"/></filter></defs>';
function poster(c1,c2,t){var s='<rect width="1080" height="1920" fill="'+c1+'"/>';for(var i=0;i<22;i++)s+='<line x1="'+(i*52)+'" y1="0" x2="'+(i*52)+'" y2="1920" stroke="#fff" stroke-width="1" opacity=".07"/>';
 s+='<rect x="40" y="40" width="1000" height="1840" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>';return s;}
function vword(w,s,op,col,x){if(op<=0)return '';return '<text transform="translate('+(x||250)+' 1500) rotate(-90)" font-family="Anton" font-size="'+s+'" fill="'+(col||'#fff')+'" opacity="'+op+'" letter-spacing="-6">'+esc(w)+'</text>';}
function tiles(lt,notes,t0,op){var s='';if(lt<t0||op<=0)return '';for(var j=0;j<6;j++){var k=eb(cl((lt-t0-j*0.12)/0.4));var col=j%3,row=Math.floor(j/3);var x=560+col*165,y=1265+row*175;
  s+='<g opacity="'+op+'" transform="translate('+x+' '+y+') scale('+k+') translate('+(-x)+' '+(-y)+')"><rect x="'+(x-72)+'" y="'+(y-72)+'" width="144" height="144" rx="22" fill="#fff" opacity=".95"/>'+oimg(OB(notes[j%notes.length],j),x,y-6,108,0,1,'filter="url(#dso)"')+T(('0'+(j+1)).slice(-2),x-52,y-48,{f:'Space Mono',w:700,s:16,c:'#111',a:'start'})+'</g>';}return s;}
function corner(lt,notes,seed){var s='';for(var j=0;j<5;j++){var a=hsh(seed+j);var x=[860,980,120,950,700][j],y=[420,1080,1650,1500,300][j];s+=oimg(OB(notes[j%notes.length],j+3),x+Math.sin(lt+j)*10,y+Math.cos(lt*0.8+j)*10,150+a*80,a*360+lt*10,cl(lt*2),'filter="url(#dso)"');}return s;}
function render(t){var out=DEFS;
 if(t<C.p1){out+=poster('#16233F','#0A1224',t);var k=e5(cl(t/0.6));out+=vword('HAWAS',430,k*0.95,'#fff',330);
  out+=T('RASASI',80,140,{f:'Montserrat',w:800,s:34,c:'#fff',ls:12,a:'start',op:k})+T('Nº 01',1000,140,{f:'Space Mono',w:700,s:30,c:'#fff',a:'end',op:k});
  ALLB.forEach(function(f,i){var kk=eb(cl((t-0.3-i*0.1)/0.4));var col=i%2,row=Math.floor(i/2);var x=560+col*260,y=420+row*420;if(kk>0)out+='<g transform="translate('+x+' '+y+') scale('+kk+') translate('+(-x)+' '+(-y)+')">'+img(f,x,y,380,1,0,'filter="url(#ds)"')+'</g>';});
  if(t>=C.h2)out+=T('LA COLECCIÓN',80,1700,{f:'Montserrat',w:300,s:40,c:'#fff',a:'start',op:e5(cl((t-C.h2)/0.4))})+T('COMPLETA',80,1760,{f:'Montserrat',w:900,s:56,c:'#fff',a:'start',op:e5(cl((t-C.h2)/0.4))});
  if(t>=C.h4)out+=T('PARTE 01 — LOS FRESCOS',1000,1760,{f:'Space Mono',w:700,s:24,c:'#9FC0FF',a:'end',op:e5(cl((t-C.h4)/0.4))});}
 var c=seg(t);if(c){var p=c.p,lt=c.lt,ik=c.ik;var k=e5(cl(lt/0.5));out+=poster(ik>0?mix(p.pal[0],'#B8923C',ik):p.pal[0],p.pal[1],t);
  out+=vword(p.word,fit(p.word,520,2600),(1-ik)*k,'#fff',L(-300,330,k));
  if(ik>0){var w=insWords(p);out+=vword(w[0],fit(w[0],330,2400),ik,'#fff',230)+vword(w[1]||'',fit(w[1]||'',260,2000),ik,'#111',480);}
  out+=T('Nº 0'+(c.i+1),1000,140,{f:'Space Mono',w:700,s:30,c:'#fff',a:'end'})+T('RASASI · HAWAS COLLECTION',80,140,{f:'Space Mono',w:700,s:22,c:'#fff',a:'start',ls:2});
  out+=corner(lt,c.notes,c.i*4);
  var bx=L(720,520,ik),bs=L(1,0.62,ik),dk=e5(cl(lt/0.5));out+='<g transform="translate('+L(1400,bx,dk)+' 820) scale('+bs+') translate(-720 -820)">'+img(p.cut,720,820,820,1,0,'filter="url(#ds)"')+'</g>';
  out+=tiles(lt,c.notes,c.nT,1-ik);
  if(ik>0)out+=img(p.ins.img,L(1400,860,ik),900,640,1,0,'filter="url(#ds)"');
  // textos editoriales a la izquierda abajo
  out+=emoTxt(p.emo,lt,0.12,1-ik,'#FFE29A',1700);
  if(lt>=c.qT){var q=e5(cl((lt-c.qT)/0.4))*(1-ik);out+=T(p.quote,540,1600,{f:'Playfair Display',it:1,w:500,s:46,c:'#fff',op:q});var m=eb(cl((lt-c.qT-0.8)/0.4))*(1-ik);if(m>0)out+=pill(p.mk,540,1780,30,'#fff',p.pal[1],m);}
  out+=T(p.name,1000,240,{f:'Montserrat',w:900,s:54,c:'#fff',a:'end',op:(1-ik)*e5(cl((lt-0.15)/0.4))});
  if(ik>0)out+=T('INSPIRADO EN',1000,240,{f:'Montserrat',w:900,s:54,c:'#fff',a:'end',op:ik});
  if(lt<0.25)out+='<rect x="'+(1080*e5(lt/0.25))+'" width="1080" height="1920" fill="#fff"/>';}
 if(t>=C.out){out+=poster('#16233F','#0A1224',t)+outro(t,{c:'#9FC0FF'});}
 finish(out,t,'OPCIÓN 4');}
