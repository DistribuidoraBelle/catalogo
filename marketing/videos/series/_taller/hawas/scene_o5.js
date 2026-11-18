var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="30" stdDeviation="26" flood-color="#000" flood-opacity=".55"/></filter><filter id="gw" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="30"/></filter><filter id="mb"><feGaussianBlur stdDeviation="6 0"/></filter></defs>';
function tunnel(t,c1,c2,sp){var s='<radialGradient id="tg" cx="50%" cy="48%" r="70%"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></radialGradient><rect width="1080" height="1920" fill="url(#tg)"/>';
 for(var i=0;i<70;i++){var a=hsh(i*1.7)*6.283,ph=((t*sp*(0.6+hsh(i)*0.8))+hsh(i*3))%1;var r0=60+ph*1400,r1=r0+60+ph*260;s+='<line x1="'+(540+Math.cos(a)*r0)+'" y1="'+(930+Math.sin(a)*r0)+'" x2="'+(540+Math.cos(a)*r1)+'" y2="'+(930+Math.sin(a)*r1)+'" stroke="#fff" stroke-width="'+(1+ph*4)+'" opacity="'+(ph*0.6)+'"/>';}return s;}
function fly(t,notes,seed,n,sp){var it=[];for(var j=0;j<n;j++){var a=hsh(seed+j*2.1)*6.283;var ph=((t*sp*0.35+hsh(seed+j*5.3)))%1;var z=Math.pow(ph,2.2);var r=120+z*900;var x=540+Math.cos(a)*r,y=930+Math.sin(a)*r*1.3;var sz=40+z*420;
  it.push({z:z,s:oimg(OB(notes[j%notes.length],j+seed),x,y,sz,a*57+t*40,cl(ph*4)*cl((1-ph)*6),z<0.15?'filter="url(#mb)"':'')});}it.sort(function(a,b){return a.z-b.z});return it.map(function(o){return o.s}).join('');}
function streak(w,y,s,op,col){if(op<=0)return '';var r='';for(var i=4;i>=1;i--)r+='<text x="'+(540+i*26)+'" y="'+y+'" text-anchor="middle" font-family="Archivo Black" font-size="'+s+'" fill="'+(col||'#fff')+'" opacity="'+(op*0.12)+'">'+esc(w)+'</text>';return r+'<text x="540" y="'+y+'" text-anchor="middle" font-family="Archivo Black" font-size="'+s+'" fill="'+(col||'#fff')+'" opacity="'+op+'">'+esc(w)+'</text>';}
function render(t){var out=DEFS;
 if(t<C.p1){out+=tunnel(t,'#3A2A8A','#05030F',0.9)+fly(t,allNotes(),3,30,1.2);var k=e5(cl(t/0.4));out+=streak('HAWAS',420,250,k);
  ALLB.forEach(function(f,i){var u=(i-2.5)/2.5;var kk=e5(cl((t-0.3-i*0.06)/0.35));out+=img(f,540+u*410,1180+Math.abs(u)*60,(Math.abs(u)<0.3?440:360)*(0.3+0.7*kk),kk,u*8,'filter="url(#ds)"');});
  if(t>=C.h2)out+=T('LA SERIE MÁS POTENTE DE RASASI',540,1560,{f:'Montserrat',w:800,s:36,c:'#fff',ls:4,op:e5(cl((t-C.h2)/0.3))});
  if(t>=C.h4)out+=streak('PARTE 01',1700,90,e5(cl((t-C.h4)/0.3)),'#B7A8FF');}
 var c=seg(t);if(c){var p=c.p,lt=c.lt,ik=c.ik;out+=tunnel(t,ik>0?mix(p.pal[0],'#C9A24A',ik):p.pal[0],p.pal[1],0.7);
  out+=fly(lt+3,c.notes,c.i*13+1,22,1);
  out+=streak(p.word,1130,fit(p.word,520,1500),(1-ik)*e5(cl(lt/0.4)));
  if(ik>0){var w=insWords(p);out+=streak(w[0],820,fit(w[0],400,1400),ik)+streak(w[1]||'',1180,fit(w[1]||'',320,1300),ik,'#111');}
  var bx=L(540,330,ik),bs=L(1,0.74,ik),zk=e5(cl(lt/0.45));
  out+='<circle cx="'+bx+'" cy="1000" r="'+(330*bs)+'" fill="#fff" opacity=".18" filter="url(#gw)"/>';
  out+='<g transform="translate('+bx+' 1010) scale('+(bs*L(0.2,1,zk))+') translate(-540 -1010)">'+img(p.cut,540,1010,860,zk,Math.sin(lt*1.5)*1.2,'filter="url(#ds)"')+'</g>';
  if(ik>0)out+=img(p.ins.img,L(1400,800,ik),1060,700,1,4,'filter="url(#ds)"');
  out+=texts(c,{hf:'Archivo Black',hs:58,acc:'#B7A8FF'});
  if(lt<0.2)out+='<rect width="1080" height="1920" fill="#fff" opacity="'+(1-lt/0.2)+'"/>';}
 if(t>=C.out){out+=tunnel(t,'#3A2A8A','#05030F',0.9)+outro(t,{f:'Archivo Black',c:'#B7A8FF'});}
 finish(out,t,'OPCIÓN 5');}
