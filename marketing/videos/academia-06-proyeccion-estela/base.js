var C=window.CUES;
var MO={skin:'#F4C3A0',hair:'#5A3422',hairLt:'#8A5636',iris:'#6B4A2E',c1:'#FF8FBF',c2:'#fff'};
var HO={skin:'#D9A07A',hair:'#211A16',hairLt:'#4A3D35',iris:'#3B2A1F',c1:'#BFD8EE',c2:'#C7B28A'};
var GV=VEST[3][1];
var GT=function(o){var P=o.c2;return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/>'+
  '<path d="M250 496 L 250 560" stroke="rgba(0,0,0,.22)" stroke-width="4"/><circle cx="262" cy="520" r="6" fill="#fff" stroke="#7d9cbb" stroke-width="2"/><circle cx="262" cy="546" r="6" fill="#fff" stroke="#7d9cbb" stroke-width="2"/>'+
  '<path d="M150 512 L 200 512 L 200 545 Q 175 552 150 545 Z" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="4"/>'+
  '<rect x="0" y="575" width="500" height="240" fill="'+P+'"/><path d="M0 575 L 500 575" stroke="#1a1a1a" stroke-width="5"/>'+
  '<rect x="0" y="556" width="500" height="22" fill="#5A3A22"/><path d="M0 556 L 500 556 M0 578 L 500 578" stroke="#1a1a1a" stroke-width="5"/><rect x="232" y="552" width="36" height="30" rx="5" fill="none" stroke="#D8B45A" stroke-width="5"/>'+
  '<path d="M250 582 L 250 800" stroke="rgba(0,0,0,.2)" stroke-width="4"/><path d="M120 590 C 140 620 170 630 190 640 M380 590 C 360 620 330 630 310 640" stroke="rgba(0,0,0,.2)" stroke-width="4" fill="none"/>',
  ov:'<path d="M176 474 Q 214 492 250 496 L 214 552 Z M324 474 Q 286 492 250 496 L 286 552 Z" fill="'+o.c1+'" stroke="#1a1a1a" stroke-width="5" stroke-linejoin="round"/><path d="M0 452 C 160 500 340 500 500 452" fill="none" stroke="#1a1a1a" stroke-width="5"/>'};};
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

