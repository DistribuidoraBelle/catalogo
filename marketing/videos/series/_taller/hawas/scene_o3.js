var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="30" stdDeviation="26" flood-color="#000" flood-opacity=".6"/></filter><filter id="bo"><feGaussianBlur stdDeviation="5"/></filter><filter id="b20"><feGaussianBlur stdDeviation="20"/></filter>'+
 '<linearGradient id="chr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#B9C2CC"/><stop offset=".5" stop-color="#6E7884"/><stop offset=".75" stop-color="#E6ECF2"/><stop offset="1" stop-color="#8D97A3"/></linearGradient>'+
 '<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="ped" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1a1a"/><stop offset=".5" stop-color="#5a5a5a"/><stop offset="1" stop-color="#111"/></linearGradient></defs>';
function stage(c1,t){return '<rect width="1080" height="1920" fill="#050507"/><circle cx="540" cy="900" r="700" fill="'+c1+'" opacity=".35" filter="url(#b20)"/><path d="M460 0 L620 0 L860 1480 L220 1480Z" fill="url(#cone)" opacity=".5"/>'+
 '<ellipse cx="540" cy="1480" rx="330" ry="60" fill="url(#ped)"/><rect x="210" y="1480" width="660" height="180" fill="url(#ped)"/><ellipse cx="540" cy="1660" rx="330" ry="60" fill="#0c0c0c"/><ellipse cx="540" cy="1480" rx="330" ry="60" fill="none" stroke="'+c1+'" stroke-width="3" opacity=".8"/>'+
 '<rect x="'+(230+((t*200)%600))+'" y="1490" width="40" height="160" fill="#fff" opacity=".08" transform="skewX(-20)"/>';}
function chrome(w,y,s,op){if(op<=0)return '';return '<text x="540" y="'+y+'" text-anchor="middle" font-family="Syne" font-weight="800" font-size="'+s+'" fill="url(#chr)" opacity="'+op+'" letter-spacing="-2">'+esc(w)+'</text>';}
function helix(lt,notes,cx,front,seed,k){var s='',n=12;for(var j=0;j<n;j++){var a=lt*1.1+j*1.3;var z=Math.sin(a);if((z>=0)!=front)continue;var y=1440-((j/n*1.0+lt*0.06)%1)*1050;var r=260+(1440-y)*0.12;var x=cx+Math.cos(a)*r;var sz=(110+hsh(seed+j)*80)*(0.8+z*0.25);
  s+=oimg(OB(notes[j%notes.length],j+seed),x,y,sz*k,a*30,1,front?'':'filter="url(#bo)" opacity=".8"');}
 for(var i=0;i<30;i++){var y=1450-((lt*90+hsh(i)*1000)%1100);s+='<circle cx="'+(cx+Math.sin(i*2.1+lt)*(200+hsh(i*3)*200))+'" cy="'+y+'" r="'+(1.5+hsh(i*5)*3)+'" fill="#fff" opacity="'+(front?0.8:0.4)+'"/>';}return s;}
function render(t){var out=DEFS;
 if(t<C.p1){out+=stage('#3E6FD8',t);var k=e5(cl(t/0.8));out+=chrome('HAWAS',620,230,k)+T('BY RASASI',540,700,{f:'Montserrat',w:600,s:34,c:'#C9D2DC',ls:16,op:k});
  ALLB.forEach(function(f,i){var u=(i-2.5)/2.5;var kk=e5(cl((t-0.4-i*0.1)/0.5));out+=img(f,540+u*250,L(1700,1250,kk)+Math.abs(u)*40,Math.abs(u)<0.3?440:340,kk,0,'filter="url(#ds)"');});
  if(t>=C.h2)out+=T('LA SERIE QUE CONQUISTÓ EL MUNDO ÁRABE',540,1760,{f:'Montserrat',w:600,s:30,c:'#fff',ls:4,op:e5(cl((t-C.h2)/0.4))*cl((C.h4-t)/0.2)});
  if(t>=C.h4)out+=T('PARTE 01 · LOS FRESCOS',540,1760,{f:'Montserrat',w:700,s:32,c:'#C9D2DC',ls:10,op:e5(cl((t-C.h4)/0.4))});}
 var c=seg(t);if(c){var p=c.p,lt=c.lt,ik=c.ik;out+=stage(ik>0?mix(p.pal[0],'#C9A24A',ik):p.pal[0],t);
  out+=chrome(p.word,1100,fit(p.word,600,1150),(1-ik)*e5(cl(lt/0.7)));
  if(ik>0){var w=insWords(p);out+=chrome(w[0],820,fit(w[0],420,1100),ik)+chrome(w[1]||'',1130,fit(w[1]||'',340,1100),ik);}
  var bx=L(540,330,ik),bs=L(1,0.72,ik),rk=e5(cl(lt/0.8));
  out+=helix(lt,c.notes,bx,false,c.i*5,rk*bs);
  out+='<g transform="translate('+bx+' 1470) scale('+bs+') translate(-540 -1470)">'+img(p.cut,540,L(1300,1040,rk),860,rk,0,'filter="url(#ds)"')+'</g>';
  out+=helix(lt,c.notes,bx,true,c.i*5,rk*bs);
  if(ik>0)out+=img(p.ins.img,L(1400,800,ik),1080,700,ik,0,'filter="url(#ds)"');
  out+=texts(c,{hf:'Syne',acc:'#C9D2DC',qy:1580,mb:'#C9D2DC',mf:'#111',pb:'rgba(255,255,255,.12)'}).replace(/RASASI<\/text>/,'RASASI</text>');}
 if(t>=C.out){out+=stage('#3E6FD8',t)+outro(t,{f:'Syne',c:'#C9D2DC'});}
 finish(out,t,'OPCIÓN 3');}
