var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="40" stdDeviation="30" flood-color="#000" flood-opacity=".45"/></filter><filter id="b8"><feGaussianBlur stdDeviation="8"/></filter><filter id="b4"><feGaussianBlur stdDeviation="4"/></filter>'+
 '<filter id="gl" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#9FE6FF" flood-opacity=".7"/></filter></defs>';
function ocean(t,c1,c2){var s='<linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient><rect width="1080" height="1920" fill="url(#og)"/>';
 for(var i=0;i<9;i++){var y=150+i*200,ph=t*0.8+i*1.3;var d='M-40 '+y;for(var x=0;x<=1120;x+=40)d+=' L'+x+' '+(y+Math.sin(x*0.009+ph)*40+Math.sin(x*0.03-ph*1.4)*14).toFixed(1);s+='<path d="'+d+'" fill="none" stroke="#fff" stroke-width="'+(8+i%3*6)+'" opacity=".07" filter="url(#b8)"/>';}
 for(var i=0;i<40;i++){var r1=hsh(i*3.1),r2=hsh(i*7.3),r=3+r2*12;var y=1980-((t*(60+r2*120)+r1*2200)%2100);s+='<circle cx="'+(r1*1080+Math.sin(t*2+i)*14)+'" cy="'+y+'" r="'+r+'" fill="#fff" fill-opacity=".06" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>';}
 return s;}
function waveWord(w,y,s,t,op,col){if(op<=0)return '';var d='M0 '+(y-s*0.35);for(var x=0;x<=1080;x+=30)d+=' L'+x+' '+(y-s*0.35+Math.sin(x*0.012+t*2.4)*18).toFixed(1);d+=' L1080 2000 L0 2000Z';
 return '<g opacity="'+op+'"><text x="540" y="'+y+'" text-anchor="middle" font-family="Anton" font-size="'+s+'" fill="#fff" opacity=".22" letter-spacing="-4">'+esc(w)+'</text><clipPath id="wc"><path d="'+d+'"/></clipPath><text clip-path="url(#wc)" x="540" y="'+y+'" text-anchor="middle" font-family="Anton" font-size="'+s+'" fill="'+(col||'#fff')+'" letter-spacing="-4">'+esc(w)+'</text></g>';}
function crown(cx,cy,k,t){if(k<=0)return '';var s='';for(var i=0;i<26;i++){var a=Math.PI+i/25*Math.PI;var r=170+hsh(i)*60;var h=(60+hsh(i*3)*140)*k;var x=cx+Math.cos(a)*r*1.3,y=cy+Math.sin(a)*24;
 s+='<path d="M'+(x-8)+' '+y+' Q '+x+' '+(y-h)+' '+(x+8)+' '+y+'Z" fill="#DFF7FF" opacity=".55"/><circle cx="'+(x+Math.sin(i)*6)+'" cy="'+(y-h-14-hsh(i*5)*30*k)+'" r="'+(4+hsh(i*2)*7)+'" fill="#EFFFFF" opacity=".8" filter="url(#gl)"/>';}
 return s+'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+(260*k)+'" ry="30" fill="#BFF0FF" opacity=".35" filter="url(#b4)"/>';}
function floaters(lt,notes,seed,n,cx){var s='';for(var j=0;j<n;j++){var r1=hsh(seed+j*2.3),r2=hsh(seed+j*4.7);var x=(j%2?cx+200+r1*260:cx-200-r1*260);var y=1700-((lt*(40+r2*40)+r2*1400)%1500);var sz=120+r2*170;
 s+=oimg(OB(notes[j%notes.length],j+seed),x,y,sz,Math.sin(lt+j)*15,cl(lt*2),'filter="url(#gl)"');for(var b=0;b<3;b++)s+='<circle cx="'+(x+(b-1)*sz*0.35)+'" cy="'+(y-sz*0.5-b*16-((lt*50)%40))+'" r="'+(4+b*2)+'" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>';}return s;}
function render(t){var out=DEFS;
 if(t<C.p1){out+=ocean(t,'#2C7BD6','#061A3E');var k=e5(cl(t/0.6));out+=waveWord('HAWAS',820,380,t,k);
  out+=floaters(t+1,allNotes(),5,10,540);
  ALLB.forEach(function(f,i){var u=(i-2.5)/2.5;var kk=eb(cl((t-0.4-Math.abs(u)*0.3)/0.5));if(kk>0)out+='<g transform="translate('+(540+u*400)+' '+(1400)+') scale('+kk+') translate('+(-540-u*400)+' -1400)">'+img(f,540+u*400,1230,Math.abs(u)<0.3?420:340,1,u*8,'filter="url(#ds)"')+'</g>';});
  out+=crown(540,1420,e5(cl((t-0.6)/0.6)),t);
  if(t>=C.h2)out+=T('LA SERIE MÁS FRESCA DE RASASI',540,1580,{f:'Montserrat',w:700,s:36,c:'#fff',ls:6,op:e5(cl((t-C.h2)/0.4))});
  if(t>=C.h4)out+=T('PARTE 01 · LOS FRESCOS',540,1660,{f:'Montserrat',w:800,s:34,c:'#9FE6FF',ls:10,op:e5(cl((t-C.h4)/0.4))});}
 var c=seg(t);if(c){var p=c.p,lt=c.lt,ik=c.ik;out+=ocean(t,p.pal[0],p.pal[1]);
  out+=waveWord(p.word,1130,fit(p.word,720),t,(1-ik)*e5(cl(lt/0.6)),'#fff');
  if(ik>0){var w=insWords(p);out+=waveWord(w[0],820,fit(w[0],520),t,ik)+(w[1]?waveWord(w[1],1220,fit(w[1],400),t,ik,'#0B2A4A'):'');}
  out+=floaters(lt,c.notes,c.i*9+3,10,L(540,330,ik));
  var bx=L(540,330,ik),bs=L(1,0.74,ik),rk=e5(cl(lt/0.7));var by=L(1900,1010,rk);
  out+='<g transform="translate('+bx+' '+by+') scale('+bs+') translate(-540 -1010)">'+img(p.cut,540,1010,860,1,Math.sin(lt*1.3)*1.5,'filter="url(#ds)"')+'</g>';
  out+=crown(bx,1440,e5(cl((lt-0.3)/0.5))*bs,t);
  if(ik>0){var x2=L(1400,790,ik);out+=img(p.ins.img,x2,L(1900,1060,ik),720,1,0,'filter="url(#ds)"')+crown(x2,1440,ik*0.7,t);}
  out+=texts(c,{acc:'#9FE6FF'});
  if(lt<0.3){var k=e5(cl(lt/0.3));out+='<rect width="1080" height="'+(1920*(1-k))+'" y="'+(1920*k)+'" fill="#DFF7FF" opacity=".9"/>';}}
 if(t>=C.out){out+=ocean(t,'#2C7BD6','#061A3E')+outro(t,{c:'#9FE6FF'});}
 finish(out,t,'OPCIÓN 1');}
