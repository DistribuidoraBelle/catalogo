// ═══════════ ACADEMIA 05 · DÓNDE APLICAR — escenas con personajes Pera ═══════════
var C=window.CUES;
var MO={skin:'#F4C3A0',hair:'#5A3422',hairLt:'#8A5636',iris:'#6B4A2E',c1:'#4A2C6E',c2:'#fff'};
var HO={skin:'#D9A07A',hair:'#211A16',hairLt:'#4A3D35',iris:'#3B2A1F',c1:'#7A7F8C',c2:'#7B1E3A'};
var GV=VEST[8][1], GT=TRAJE[8][1];
function L(a,b,k){return a+(b-a)*k}
function cl(x){return x<0?0:x>1?1:x}
// ── personaje Pera parametrizable ──
function pera2(G,o,gen,st){var M=G==='m',s='';var R=gen(o);var sl=R.sl;var b=st.bob||0;
  s+=e(180,690,52,22,K,0)+e(320,690,52,22,K,0);
  s+='<g transform="translate(0,'+b+')">';
  if(M&&!st.back)s+=p('M148 220 C 108 300 118 384 150 424 L 350 424 C 382 384 392 300 352 220 Z',o.hair);
  s+=p(BODY,o.skin)+shadeR(BODY,K,320);
  s+=inCloth((st.back?'<rect x="0" y="0" width="500" height="800" fill="'+sl+'"/><path d="M250 470 L 250 800" stroke="rgba(0,0,0,.25)" stroke-width="5"/>'+(M?'':'<path d="M150 600 C 200 620 300 620 350 600" stroke="rgba(0,0,0,.2)" stroke-width="5" fill="none"/>'):R.in)+'<rect x="320" y="0" width="300" height="800" fill="#000" opacity=".18"/>');
  s+=clipG(BODY,'<path d="M0 452 C 160 500 340 500 500 452" fill="none" stroke="'+K+'" stroke-width="7"/>')+p(BODY,'none');
  if(!st.back){s+=clipG(BODY,R.ov);
    if(st.dizzy){[218,282].forEach(function(x){s+=p('M'+(x-12)+' 260 L '+(x+12)+' 284 M'+(x+12)+' 260 L '+(x-12)+' 284',null,6);});
      s+=p('M226 326 C 236 316 244 334 252 322 C 260 312 268 330 276 320',null,5)+e(192,302,15,9,'#9BE38F',0,null,' opacity=".8"')+e(308,302,15,9,'#9BE38F',0,null,' opacity=".8"');}
    else{var by=st.blink?0.1:1;
      s+='<g transform="translate(0,'+(272*(1-by))+') scale(1,'+by+')">'+eyes2(218,282,272,13,16,o.iris)+'</g>';
      s+=p('M246 296 C 248 302 254 302 256 298',null,4)+p('M228 318 C 240 334 260 334 272 318 C 260 324 240 324 228 318 Z','#7A2633',5)+e(192,302,15,9,'#FF8FA0',0,null,' opacity=".7"')+e(308,302,15,9,'#FF8FA0',0,null,' opacity=".7"');}
    s+=p('M200 248 C 210 242 224 242 232 246 M268 246 C 276 242 290 242 300 248',null,5);
    s+=M?p('M148 262 C 144 170 198 128 250 128 C 302 128 356 170 352 262 C 332 212 292 196 250 200 C 208 196 168 212 148 262 Z',o.hair)+hiL('M200 148 C 230 136 270 136 300 148',o.hairLt)
        :p('M178 206 C 172 156 200 124 234 118 C 254 92 296 92 318 112 C 346 118 360 146 350 178 C 352 192 348 204 340 212 C 328 192 308 182 284 180 C 262 190 236 192 214 186 C 198 190 186 196 178 206 Z',o.hair)+hiL('M214 128 C 240 112 280 110 310 124',o.hairLt);
  }else{ // de espaldas: pelo recogido (ella) / pelo corto (él), se ve la nuca
    s+=M?p('M156 300 C 146 186 196 132 250 132 C 304 132 354 186 344 300 C 330 270 300 256 250 256 C 200 256 170 270 156 300 Z',o.hair)+c(250,122,34,o.hair)+hiL('M214 150 C 240 140 270 140 292 150',o.hairLt)
        :p('M168 250 C 162 170 204 128 250 128 C 300 128 340 170 334 250 C 318 236 290 230 250 230 C 210 230 184 236 168 250 Z',o.hair)+hiL('M214 148 C 240 138 270 138 292 148',o.hairLt);
  }
  var hL=st.hL,hR=st.hR;
  s+=noodle('M132 478 Q '+L(80,hL[0],0.3)+' '+L(478,hL[1],0.6)+' '+hL[0]+' '+(hL[1]-22),sl,40);
  s+=noodle('M368 478 Q '+(hR[0]+30)+' '+L(478,hR[1],0.5)+' '+hR[0]+' '+(hR[1]+22),sl,40);
  s+=c(hL[0],hL[1],22,o.skin);
  s+='<g transform="translate('+hR[0]+','+hR[1]+') rotate('+(st.ang||0)+')">'+frasco(0,-48,0.9,0)+'</g>'+c(hR[0],hR[1],22,o.skin);
  s+='</g>';return s;}

// ── marcas ──
function ring(x,y,t,k,lab,side,danger){var col=danger?'#E5322B':'#FF4F8B',r=28*back(k)*(1+0.12*Math.sin(t*10)),r2=28+((t*1.4)%1)*30,s='';
  s+='<circle cx="'+x+'" cy="'+y+'" r="'+r2+'" fill="none" stroke="#fff" stroke-width="4" opacity="'+(1-((t*1.4)%1))+'"/>';
  s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="rgba(255,255,255,.35)" stroke="'+(danger?'#fff':'#fff')+'" stroke-width="7"/>';
  s+=danger?'<path d="M'+(x-10)+' '+(y-10)+' L '+(x+10)+' '+(y+10)+' M'+(x+10)+' '+(y-10)+' L '+(x-10)+' '+(y+10)+'" stroke="'+col+'" stroke-width="6" stroke-linecap="round"/>':'<circle cx="'+x+'" cy="'+y+'" r="8" fill="'+col+'" stroke="#fff" stroke-width="4"/>';
  if(lab){var lk=k,tw=lab.length*17+70,dir=side==='r'?1:-1,lx=dir>0?x+46:x-46-tw,ly=y-26,ax=dir>0?x+48:x-48;
    s+='<g transform="translate('+(x+dir*40)+','+y+') scale('+back(cl(lk))+') translate('+(-(x+dir*40))+','+(-y)+')"><rect x="'+(lx+3)+'" y="'+(ly+6)+'" width="'+tw+'" height="52" rx="26" fill="rgba(80,0,40,.25)"/><path d="M'+ax+' '+(y-12)+' L '+(x+dir*32)+' '+y+' L '+ax+' '+(y+12)+' Z" fill="#fff"/><rect x="'+lx+'" y="'+ly+'" width="'+tw+'" height="52" rx="26" fill="#fff"/><circle cx="'+(lx+26)+'" cy="'+(ly+26)+'" r="11" fill="'+col+'"/><text x="'+(lx+44+(tw-44)/2-4)+'" y="'+(ly+36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="29" fill="'+(danger?'#C81E1E':'#E8366F')+'">'+lab+'</text></g>';}
  return s;}
function waves(x,y,t,dir,col){var s='';for(var i=0;i<3;i++){var ph=((t*0.9+i/3)%1);var r=30+ph*130;s+='<path d="M '+(x+Math.cos(dir-0.7)*r)+' '+(y+Math.sin(dir-0.7)*r)+' A '+r+' '+r+' 0 0 1 '+(x+Math.cos(dir+0.7)*r)+' '+(y+Math.sin(dir+0.7)*r)+'" fill="none" stroke="'+(col||'#fff')+'" stroke-width="8" stroke-linecap="round" opacity="'+(1-ph)+'"/>';}return s;}
function sparkles(x,y,t,n,spread){var s='';for(var i=0;i<n;i++){var ph=((t*0.7+i/n)%1);var a=i*2.4;var r=ph*spread;s+='<text x="'+(x+Math.cos(a)*r)+'" y="'+(y+Math.sin(a)*r-ph*40)+'" font-size="'+(26+ (i%3)*8)+'" opacity="'+(1-ph)+'" text-anchor="middle">'+(['✨','🌸','✨'][i%3])+'</text>';}return s;}
function mist(nx,ny,tx,ty,tt){var s='';for(var n=0;n<18;n++){var ph=(tt*1.8-n*0.05);if(ph<=0||ph>=1)continue;var sx=((n*37)%11-5)*5*ph,sy=((n*53)%9-4)*5*ph;s+='<circle cx="'+(L(nx,tx,ph)+sx)+'" cy="'+(L(ny,ty,ph)+sy)+'" r="'+(4+ph*8)+'" fill="#fff" opacity="'+(1-ph)*0.9+'"/>';}return s;}

// ── guion de movimiento (keyframes por personaje) ──
var REST={hL:[60,610],hR:[436,410],ang:6};
function KF(d){return [
  [0,REST],
  [C.m+0.3+d,{hL:[200,560],hR:[350,470],ang:-70,spray:[214,540],mk:[[214,540,'MUÑECA','l']]}],
  [C.m2+d,{hL:[170,560],hR:[436,410],ang:6,wave:'L',mk:[[0,0,'MUÑECA','l','handL']],fx:'wristWaves'}],
  [C.c+0.2+d,{hL:[60,610],hR:[420,380],ang:-62,spray:[300,402],mk:[[300,402,null,'l'],[200,402,'CUELLO','l']]}],
  [C.c3+d,{hL:[60,610],hR:[436,410],ang:6,mk:[[300,402,null,'l'],[200,402,'CUELLO','l']],fx:'proj'}],
  [C.n-0.3+d,{hL:[60,610],hR:[436,410],ang:6,back:true}],
  [C.n+0.3+d,{hL:[60,610],hR:[420,270],ang:-70,spray:[250,340],back:true,mk:[[250,340,'NUCA','l']]}],
  [C.n2+d,{hL:[60,610],hR:[436,410],ang:6,back:true,walk:true,mk:[[250,340,'NUCA','l']]}],
  [C.n3+d,{hL:[60,610],hR:[436,410],ang:6}],
  [C.b1+d,{hL:[60,610],hR:[270,430],ang:-118,spray:[108,520],mk:[[108,520,'BRAZO','r']]}],
  [C.b2+d,{hL:[60,610],hR:[436,410],ang:6,mk:[[108,520,'BRAZO','r']]}],
  [C.b3+d,{hL:[60,610],hR:[436,410],ang:6,swing:true,mk:[[0,0,'BRAZO','r','uarmL']],fx:'armWaves'}],
  [C.x+d,{hL:[60,610],hR:[436,410],ang:6,mk:[[250,368,null,'r',null,1],[250,520,'NUNCA','r',null,1]]}],
  [C.x2+d,{hL:[60,610],hR:[436,410],ang:6,mk:[[250,368,null,'r',null,1],[250,520,'NUNCA','r',null,1]],fx:'toNose'}],
  [C.x4+d,{hL:[60,610],hR:[436,410],ang:6,fx:'brain'}],
  [C.x6+d,{hL:[60,610],hR:[436,410],ang:6,dizzy:true,fx:'dizzy'}],
  [C.r,{hL:[60,610],hR:[436,410],ang:6,happy:true}]
];}
function poseAt(t,d){var S=KF(d),i=0;for(var j=0;j<S.length;j++)if(t>=S[j][0])i=j;var cur=S[i][1],prev=S[Math.max(0,i-1)][1],t0=S[i][0];var k=eio(cl((t-t0)/0.55));
  var st={hL:[L(prev.hL[0],cur.hL[0],k),L(prev.hL[1],cur.hL[1],k)],hR:[L(prev.hR[0],cur.hR[0],k),L(prev.hR[1],cur.hR[1],k)],ang:L(prev.ang,cur.ang,k),since:t-t0,cur:cur,t0:t0};
  st.back=cur.back&&(t-t0>0.25||prev.back);if(cur.back&&!prev.back)st.turn=cl((t-t0)/0.5);if(!cur.back&&prev.back)st.turn=cl((t-t0)/0.5);
  if(cur.wave){var w=Math.sin(t*9);st.hL=[st.hL[0]+w*50,st.hL[1]+Math.cos(t*9)*18];}
  if(cur.swing){st.hL=[st.hL[0]+Math.sin(t*6)*20,st.hL[1]-Math.abs(Math.sin(t*6))*90];st.hR=[st.hR[0]+Math.sin(t*6+Math.PI)*16,st.hR[1]-Math.abs(Math.sin(t*6+1.5))*40];}
  if(cur.spray&&st.since>0.6&&st.since<1.8){st.spray=cur.spray;st.ang+=Math.sin(st.since*18)*-2;}
  st.dizzy=cur.dizzy;return st;}

// ── cabecera de cada parte ──
var PARTS=[['m','1','MUÑECAS','#22C3B0'],['c','2','CUELLO','#FF6FB5'],['n','3','NUCA','#8E6CF5'],['b','⭐','ARRIBA DEL BRAZO','#4CC38A'],['x','✕','NUNCA ACÁ','#FF5A4E'],['r','✓','RESUMEN','#F4B63A']];
function partAt(t){var p=null;PARTS.forEach(function(q){if(t>=C[q[0]])p=q;});if(t>=C.e)p=null;return p;}

var Y=760,SC=1.0,XS=[40,540];
function render(t){
  var part=partAt(t),out='',bg=part?part[3]:'#F4B63A';
  document.getElementById('bgc').style.background=bg;
  if(part){var t0=C[part[0]],kh=cl((t-t0)/0.45);
    out+='<g transform="translate(150,215) scale('+back(kh)+') rotate('+L(-90,0,eio(kh))+')"><circle r="92" fill="#fff" stroke="#1a1a1a" stroke-width="8"/><text y="'+(part[1].length>1?22:36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+(part[1].length>1?80:110)+'" fill="'+(part[0]==='x'?'#E5322B':'#1a1a1a')+'">'+part[1]+'</text></g>';
    out+='<text x="'+(270+(1-eio(cl((t-t0-0.12)/0.4)))*400)+'" y="'+(part[2].length>12?235:250)+'" font-family="Baloo 2" font-weight="800" font-size="'+(part[2].length>12?78:104)+'" fill="#fff" stroke="#1a1a1a" stroke-width="14" paint-order="stroke" opacity="'+cl((t-t0-0.12)/0.2)+'">'+part[2]+'</text>';}
  var showChars=t>=C.m-0.3&&t<C.e;
  if(showChars){
    [[ 'm',MO,GV,0],['h',HO,GT,0.35]].forEach(function(cfg,ci){var G=cfg[0],o=cfg[1],gen=cfg[2],d=cfg[3];var st=poseAt(t,d);st.bob=Math.sin(t*2+ci)*5;st.blink=((t+ci*1.3)%3.4)<0.12;
      var x=XS[ci],ent=eio(cl((t-(C.m-0.3)-ci*0.15)/0.5));var yy=Y+(1-ent)*600;
      if(st.cur.walk){var wk=cl((t-st.t0)/3.2);x-=Math.sin(wk*Math.PI)*160;st.bob=-Math.abs(Math.sin(t*7))*16;}
      if(st.cur.happy){st.bob=-Math.abs(Math.sin(t*5+ci))*30;}
      var sx=st.turn!=null?Math.max(0.05,Math.abs(Math.cos(st.turn*Math.PI))):1;
      var g='<g transform="translate('+x+','+yy+') scale('+SC+') translate(0,-120)">';
      // estela detrás (antes del personaje)
      if(st.cur.walk){for(var i=0;i<16;i++){var ts=st.t0+i*0.18;if(ts>t)break;var age=t-ts;if(age>1.8)continue;var wk2=cl((ts-st.t0)/3.2);var px=250+(Math.sin(wk2*Math.PI)*160-Math.sin(cl((t-st.t0)/3.2)*Math.PI)*160)/SC;g+='<text x="'+(px+((i*37)%30-15))+'" y="'+(340-age*60)+'" font-size="'+(30+(i%3)*10)+'" text-anchor="middle" opacity="'+(1-age/1.8)+'">'+(['✨','🌸','💫'][i%3])+'</text>';}}
      g+='<g transform="translate(250,0) scale('+sx+',1) translate(-250,0)">'+pera2(G,o,gen,st)+'</g>';
      // efectos
      var fx=st.cur.fx,ks=cl(st.since/0.4);
      if(fx==='wristWaves')g+=waves(st.hL[0],st.hL[1]+st.bob,t,Math.PI,'#fff')+sparkles(st.hL[0],st.hL[1]+st.bob,t,5,110);
      if(fx==='proj'){g+=waves(310,402+st.bob,t,0)+waves(190,402+st.bob,t,Math.PI);}
      if(fx==='armWaves'){var ua=[L(132,st.hL[0],0.35),L(478,st.hL[1],0.35)+st.bob];g+=waves(ua[0],ua[1],t,Math.PI)+sparkles(ua[0],ua[1],t,4,100);}
      if(fx==='toNose'){for(var j=0;j<3;j++){var ph=((t*0.8+j/3)%1);var yy2=L(500,330,ph);g+='<path d="M'+(232+j*18)+' '+(yy2+st.bob)+' c -10 -14 10 -24 0 -38" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="'+(Math.sin(ph*Math.PI))+'"/>';}
        g+='<path d="M250 500 L 250 338" stroke="#fff" stroke-width="5" stroke-dasharray="12 10" opacity=".7"/><path d="M236 352 L 250 330 L 264 352" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>';}
      if(fx==='brain'){var kb=cl(st.since/0.4),off=st.since>1.4;g+='<g transform="translate(420,150) scale('+back(kb)+')"><circle r="62" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><text y="24" text-anchor="middle" font-size="64">🧠</text><rect x="-44" y="70" width="88" height="40" rx="20" fill="'+(off?'#E5322B':'#4CC38A')+'"/><text y="98" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="26" fill="#fff">'+(off?'OFF':'ON')+'</text></g><path d="M370 196 C 340 230 320 250 300 268" stroke="#fff" stroke-width="5" stroke-dasharray="8 8" fill="none"/>';}
      if(fx==='dizzy'){for(var j=0;j<3;j++){var a=t*3+j*2.1;g+='<text x="'+(250+Math.cos(a)*120)+'" y="'+(150+Math.sin(a)*24)+'" font-size="40" text-anchor="middle">'+(['💫','🤢','💫'][j])+'</text>';}}
      // spray
      if(st.spray){var a=st.ang*Math.PI/180;var nx=st.hR[0]+Math.sin(a)*118*1,ny=st.hR[1]+st.bob-Math.cos(a)*118;g+=mist(nx,ny,st.spray[0],st.spray[1]+st.bob,st.since-0.6);}
      // marcas
      (st.cur.mk||[]).forEach(function(m,mi){var mx=m[0],my=m[1]+st.bob;if(m[4]==='handL'){mx=st.hL[0];my=st.hL[1]+st.bob-26;}if(m[4]==='uarmL'){mx=L(132,st.hL[0],0.35);my=L(478,st.hL[1],0.35)+st.bob;}
        var kk=cl((st.since-0.1-mi*0.15)/0.4);if(kk<=0)return;g+=ring(mx,my,t,kk,ci===0||G==='h'?m[2]:null,m[3],m[5]);});
      g+='</g>';out+=g;});
  }
  // tarjetas de apoyo
  function card(txt,t0,t1,y,col){if(t<t0||t>t1)return '';var k=cl((t-t0)/0.4),ko=cl((t1-t)/0.3);var w=txt.length*30+90;return '<g opacity="'+ko+'" transform="translate(540,'+y+') scale('+back(k)+')"><rect x="'+(-w/2+8)+'" y="-40" width="'+w+'" height="92" rx="46" fill="rgba(0,0,0,.25)"/><rect x="'+(-w/2)+'" y="-48" width="'+w+'" height="92" rx="46" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="6"/><text y="14" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="50" fill="#1a1a1a">'+txt+'</text></g>';}
  out+=card('🔊 PROYECCIÓN',C.c3+0.2,C.n-0.2,520);
  out+=card('💫 ESTELA',C.n2+0.3,C.n3-0.1,520);
  out+=card('📌 Próximo video: estela y proyección',C.n3+0.2,C.b-0.2,520,'#FFF4D6');
  out+=card('🙌 SIN ROCE = DURA MÁS',C.b2+0.2,C.b3+0.1,520);
  out+=card('😵 FATIGA OLFATIVA',C.x3+0.6,C.x6-0.1,520,'#FFE1E1');
  out+=card('🤢 EMPALAGA',C.x6+0.2,C.r-0.2,520,'#E8FFE1');
  // resumen
  if(t>=C.r&&t<C.e){var items=[['MUÑECAS',C.r],['CUELLO',C.r+0.6],['NUCA',C.r+1.2],['+ BRAZOS',C.r2+0.6]];items.forEach(function(it,i){var k=cl((t-it[1])/0.4);if(k<=0)return;var xx=[270,810,270,810][i],yy=[430,430,560,560][i];out+='<g transform="translate('+xx+','+yy+') scale('+back(k)+')"><rect x="-220" y="-48" width="440" height="96" rx="48" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><text y="16" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="54" fill="#1a1a1a">✅ '+it[0]+'</text></g>';});}
  document.getElementById('sv').innerHTML=out;
  renderSubs2(t);
  // cierre
  var E=document.getElementById('end');var eOn=t>=C.e;E.style.display=eOn?'block':'none';
  if(eOn){var k=eio(cl((t-C.e)/0.4));E.style.opacity=k;['eA','eB','eC','eD'].forEach(function(id,i){var kk=cl((t-C.e-0.2-i*0.3)/0.4);document.getElementById(id).style.transform='translateY('+((1-eio(kk))*60)+'px) scale('+L(.85,1,cl(back(kk)))+')';document.getElementById(id).style.opacity=cl(kk*2.5);});}
  hkRender(t);
}
// subtítulos karaoke
var subLine=-1;
function renderSubs2(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t>=C.e){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(muñecas|cuello|nuca|estela|proyecte|proyección|brazos|nunca|mentón|pecho|nariz|fatiga|olfativa|cerebro|anula|empalagado|belle|perfume|siempre|nadie)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
