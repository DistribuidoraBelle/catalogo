var DEFS='<defs><filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="40" stdDeviation="30" flood-color="#000" flood-opacity=".45"/></filter><filter id="bo"><feGaussianBlur stdDeviation="6"/></filter><filter id="dso" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000" flood-opacity=".35"/></filter></defs>';
function diag(t,c1,c2,k){var y1=L(2400,700,k),y2=L(2400,1300,k);return '<rect width="1080" height="1920" fill="'+c2+'"/><path d="M0 0 L1080 0 L1080 '+(y1-200+Math.sin(t)*20)+' L0 '+(y2+200)+' Z" fill="'+c1+'"/><path d="M0 '+(y2+200)+' L1080 '+(y1-200+Math.sin(t)*20)+'" stroke="#fff" stroke-width="10"/>';}
function marquee(w,y,s,t,dir,col,op){if(op<=0)return '';var tw=w.length*s*0.5+80;var off=((t*120*dir)%tw+tw)%tw;var r='';for(var i=-1;i<4;i++)r+='<text x="'+(i*tw-off)+'" y="'+y+'" font-family="Unbounded" font-weight="900" font-size="'+s+'" fill="none" stroke="'+col+'" stroke-width="3" opacity="'+op+'">'+esc(w)+'</text>';return r;}
function ring(lt,notes,cx,cy,front,seed,k){var s='',it=[];var n=10;for(var j=0;j<n;j++){var a=lt*0.9+j*6.283/n;var z=Math.sin(a);if((z>=0)!=front)continue;var x=cx+Math.cos(a)*430,y=cy+z*120-Math.cos(a)*90;var sz=(130+hsh(seed+j)*80)*(0.75+z*0.3);
  it.push({z:z,s:oimg(OB(notes[j%notes.length],j+seed),x,y,sz*k,a*40,1,front?'filter="url(#dso)"':'filter="url(#bo)" opacity=".85"')});}it.sort(function(a,b){return a.z-b.z});it.forEach(function(o){s+=o.s;});
 return s+(front?'':'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+430*k+'" ry="120" fill="none" stroke="#fff" stroke-width="3" opacity=".35" transform="rotate(-8 '+cx+' '+cy+')"/>');}
function render(t){var out=DEFS;
 if(t<C.p1){var k=e5(cl(t/0.5));out+=diag(t,'#1A1A2E','#0A0A14',k)+marquee('HAWAS · HAWAS · ',520,200,t,1,'#fff',.25)+marquee('RASASI · RASASI · ',760,200,t,-1,'#3E6FD8',.35);
  out+=T('HAWAS',540,420,{f:'Unbounded',w:900,s:190,c:'#fff',op:k});
  ALLB.forEach(function(f,i){var u=(i-2.5)/2.5;var kk=eb(cl((t-0.3-i*0.08)/0.4));if(kk>0)out+='<g transform="translate('+(540+u*420)+' 1200) scale('+kk+') translate('+(-540-u*420)+' -1200)">'+img(f,540+u*420,1100+Math.abs(u)*60,Math.abs(u)<0.3?440:360,1,u*10,'filter="url(#ds)"')+'</g>';});
  if(t>=C.h2)out+=pill('LA SERIE ESTRELLA DE RASASI',540,1560,34,'#fff','#0A0A14',e5(cl((t-C.h2)/0.3)));
  if(t>=C.h4)out+=T('PARTE 01',540,1700,{f:'Unbounded',w:800,s:60,c:'#3E6FD8',op:e5(cl((t-C.h4)/0.3))});}
 var c=seg(t);if(c){var p=c.p,lt=c.lt,ik=c.ik;var dk=e5(cl(lt/0.5));out+=diag(t,ik>0?mix(p.pal[0],'#C9A24A',ik):p.pal[0],p.pal[1],dk);
  out+=marquee(p.word+' · ',700,230,lt,1,'#fff',.35*(1-ik))+marquee(p.word+' · ',960,230,lt,-1,'#fff',.2*(1-ik))+marquee(p.word+' · ',1220,230,lt,1,'#fff',.35*(1-ik));
  if(ik>0){var w=insWords(p);out+=marquee(w.join(' ')+' · ',820,200,lt,1,'#fff',.4*ik)+marquee(w.join(' ')+' · ',1100,200,lt,-1,'#111',.4*ik);}
  var bx=L(540,330,ik),bs=L(1,0.74,ik),rk=e5(cl((lt-0.3)/0.6));
  out+=ring(lt,c.notes,bx,1020,false,c.i*7,rk*bs);
  var sk=eb(cl(lt/0.45));out+='<g transform="translate('+bx+' 1450) scale('+(bs*sk)+') rotate('+((1-sk)*-25)+') translate(-540 -1450)">'+img(p.cut,540,1010,860,1,0,'filter="url(#ds)"')+'</g>';
  out+=ring(lt,c.notes,bx,1020,true,c.i*7,rk*bs);
  if(ik>0)out+=img(p.ins.img,L(1400,800,ik),1060,700,1,6,'filter="url(#ds)"');
  out+=texts(c,{hf:'Unbounded',hs:56,acc:'#fff'});}
 if(t>=C.out){out+=diag(t,'#1A1A2E','#0A0A14',1)+outro(t,{f:'Unbounded',c:'#3E6FD8'});}
 finish(out,t,'OPCIÓN 2');}
