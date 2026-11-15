// ═══════════ ACADEMIA 07 · NOTAS OLFATIVAS ═══════════
var C=window.CUES;
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var ALL=['bergamota','limon','naranja','manzana','coco','rosa','jazmin','lavanda','vainilla','caramelo','cafe','pimienta','canela','cardamomo','jengibre','cedro','sandalo','pachuli','oud','ambar','almizcle','tonka','menta','incienso','cuero','labdano','benjui'];
var REST={hL:[60,610],hR:[436,410]};
function ch(G,x,y,sc,t,ex){ex=ex||{};var st={hL:ex.hL||REST.hL,hR:ex.hR||REST.hR,ang:ex.ang==null?6:ex.ang,bob:Math.sin(t*2+(G==='h'?1:0))*5,blink:((t+(G==='h'?1.3:0))%3.4)<0.12,back:false};
  var s='<g transform="translate('+x+','+y+') scale('+sc+') translate(0,-120)">'+(ex.flip?'<g transform="translate(500,0) scale(-1,1)">':'<g>')+pera2(G,G==='m'?MO:HO,G==='m'?GV:GT,st);
  if(ex.wink)s+='<ellipse cx="282" cy="'+(272+st.bob)+'" rx="19" ry="23" fill="'+(G==='m'?MO.skin:HO.skin)+'"/><path d="M266 '+(276+st.bob)+' C 274 '+(266+st.bob)+' 290 '+(266+st.bob)+' 298 '+(276+st.bob)+'" fill="none" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';
  if(ex.hearts){for(var i=0;i<3;i++){var ph=((t*0.8+i/3)%1);s+='<text x="'+(200+i*50)+'" y="'+(150-ph*80+st.bob)+'" font-size="46" opacity="'+(1-ph)+'" text-anchor="middle">'+(i===1?'😍':'❤️')+'</text>';}}
  return s+'</g></g>';}
function chip(txt,x,y,k,col,fs){fs=fs||40;var w=txt.length*fs*0.56+64;return '<g transform="translate('+x+','+y+') scale('+back(cl(k))+')"><rect x="'+(-w/2+6)+'" y="'+(-fs*0.95+7)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="rgba(0,0,0,.22)"/><rect x="'+(-w/2)+'" y="'+(-fs*0.95)+'" width="'+w+'" height="'+(fs*1.9)+'" rx="'+(fs*0.95)+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="6"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
function title(txt,y,k,col,fs){fs=fs||120;return '<text x="540" y="'+y+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="'+(fs*0.13)+'" paint-order="stroke" transform="translate(540,'+y+') scale('+back(cl(k))+') translate(-540,'+(-y)+')" opacity="'+cl(k*3)+'">'+txt+'</text>';}
function star(x,y,s,op){return '<path d="M'+x+' '+(y-s)+' L '+(x+s*0.28)+' '+y+' L '+x+' '+(y+s)+' L '+(x-s*0.28)+' '+y+' Z" fill="#fff" opacity="'+(op==null?1:op)+'"/>';}
// lluvia/confeti de notas por toda la pantalla
function confetti(ids,t,t0,n,seed,op){var s='',k=cl((t-t0)/0.6);if(k<=0)return '';for(var i=0;i<n;i++){var id=ids[i%ids.length];var r=hsh(i+seed);var x=40+hsh(i*3+seed)*1000;var sp=60+r*70;var y=((hsh(i*7+seed)*2200+(t-t0)*sp)%2200)-140;var rot=(t*(30+r*60)*(i%2?1:-1))+i*40;var sc=0.6+hsh(i*5+seed)*0.6;
  s+='<g opacity="'+((op||0.95)*k)+'">'+nota(id,x+Math.sin(t*1.2+i)*20,y,sc,rot)+'</g>';}return s;}
// estallido desde un punto
function burst(ids,cx,cy,t,t0,n,R,seed){var s='';if(t<t0)return '';for(var i=0;i<n;i++){var a=i/n*6.283+hsh(i+seed)*0.6;var k=eio(cl((t-t0)/0.9));var rr=R*(0.45+hsh(i*3+seed)*0.55)*k;var wob=Math.sin(t*1.6+i)*18*k;var x=cx+Math.cos(a)*rr+wob,y=cy+Math.sin(a)*rr*1.25+Math.cos(t*1.3+i)*18*k;
  s+=nota(ids[i%ids.length],x,y,(0.5+hsh(i*9+seed)*0.5)*(0.3+0.7*back(cl((t-t0)/0.6))),t*40*(i%2?1:-1)+i*30);}return s;}
function hero(id,x,y,t,t0,sc){var k=cl((t-t0)/0.5);if(k<=0)return '';var b=back(k);var bob=Math.sin((t-t0)*2.4)*10;
  var s='<g transform="translate('+x+','+(y+bob)+')"><circle r="'+(118*b)+'" fill="#fff" opacity=".9" stroke="#1a1a1a" stroke-width="7"/>';
  for(var i=0;i<8;i++){var a=i*0.785+t*0.8;s+=star(Math.cos(a)*150*b,Math.sin(a)*150*b,10+6*Math.sin(t*4+i),0.9*b);}
  s+='</g>'+nota(id,x,y+bob,(sc||1.6)*b,Math.sin((t-t0)*2)*8);
  s+='<g transform="translate('+x+','+(y+bob+150)+') scale('+b+')"><rect x="-'+(NOTAS[id].n.length*15+30)+'" y="-30" width="'+(NOTAS[id].n.length*30+60)+'" height="60" rx="30" fill="#1a1a1a"/><text y="13" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="36" fill="#fff">'+NOTAS[id].n+'</text></g>';return s;}
// ── Mona Lisa estilizada (dibujo propio), centrada en (cx,cy) con alto ~700
function monaLisa(cx,cy,t,wink){var s='<g transform="translate('+(cx-250)+','+(cy-350)+')">';
  s+='<defs><linearGradient id="mlsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FB59A"/><stop offset=".55" stop-color="#C9C79A"/><stop offset="1" stop-color="#8A8A5E"/></linearGradient><radialGradient id="mlface" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#F2D29A"/><stop offset="1" stop-color="#C99A5E"/></radialGradient></defs>';
  s+='<rect x="0" y="0" width="500" height="700" fill="url(#mlsky)"/>';
  s+='<path d="M0 300 C 60 250 110 280 150 240 C 180 210 210 260 250 250 L 250 420 L 0 420 Z" fill="#6E8A78" opacity=".8"/><path d="M500 280 C 440 240 400 270 360 230 C 330 205 300 250 260 250 L 260 420 L 500 420 Z" fill="#6E8A78" opacity=".8"/>';
  s+='<path d="M0 380 C 60 350 100 370 140 340 L 140 460 L 0 460 Z M500 360 C 440 330 410 350 370 320 L 370 460 L 500 460 Z" fill="#7A6A42" opacity=".85"/><path d="M40 420 C 70 400 90 430 120 400" fill="none" stroke="#C9B27A" stroke-width="6"/><path d="M380 400 C 410 380 440 410 470 390" fill="none" stroke="#C9B27A" stroke-width="6"/>';
  // cuerpo / vestido
  s+='<path d="M60 700 C 70 560 120 470 250 450 C 380 470 430 560 440 700 Z" fill="#3A2E1E" stroke="#1a1a1a" stroke-width="5"/>';
  s+='<path d="M175 470 C 210 520 290 520 325 470 C 300 500 200 500 175 470 Z" fill="#E8C48A"/><path d="M180 478 C 215 530 285 530 320 478" fill="none" stroke="#7A5A2A" stroke-width="4" stroke-dasharray="4 5"/>';
  s+='<path d="M90 640 C 120 590 170 580 230 600 L 230 700 L 70 700 Z" fill="#8A5A2E" stroke="#1a1a1a" stroke-width="4"/><path d="M410 640 C 380 590 330 580 270 600 L 270 700 L 430 700 Z" fill="#8A5A2E" stroke="#1a1a1a" stroke-width="4"/>';
  // manos cruzadas
  s+='<path d="M170 640 C 200 610 250 612 280 632 C 260 650 210 656 170 640 Z" fill="url(#mlface)" stroke="#1a1a1a" stroke-width="4"/><path d="M230 630 C 260 600 320 604 340 626 C 320 648 270 652 230 630 Z" fill="url(#mlface)" stroke="#1a1a1a" stroke-width="4"/>';
  // pelo (detrás), cara, velo
  s+='<path d="M150 470 C 120 360 140 200 250 180 C 360 200 380 360 350 470 C 330 420 320 330 250 320 C 180 330 170 420 150 470 Z" fill="#2A1E12" stroke="#1a1a1a" stroke-width="5"/>';
  s+='<path d="M190 250 C 190 200 220 186 250 186 C 280 186 310 200 310 250 C 312 310 286 350 250 352 C 214 350 188 310 190 250 Z" fill="url(#mlface)" stroke="#1a1a1a" stroke-width="5"/>';
  s+='<path d="M196 236 C 200 196 236 184 250 184 C 264 184 300 196 304 236 C 290 214 270 206 250 206 C 230 206 210 214 196 236 Z" fill="#2A1E12"/>';
  s+='<path d="M186 230 C 200 180 300 180 314 230" fill="none" stroke="#1a1a1a" stroke-width="2" opacity=".5"/>';
  // ojos, nariz y LA sonrisa
  var ey=268;s+='<path d="M212 '+ey+' C 220 260 236 260 242 '+ey+'" fill="none" stroke="#3A2414" stroke-width="5" stroke-linecap="round"/>';
  s+=wink?'<path d="M258 '+(ey+2)+' C 266 '+(ey-8)+' 282 '+(ey-8)+' 290 '+(ey+2)+'" fill="none" stroke="#3A2414" stroke-width="5" stroke-linecap="round"/>':'<path d="M258 '+ey+' C 264 260 280 260 288 '+ey+'" fill="none" stroke="#3A2414" stroke-width="5" stroke-linecap="round"/>';
  s+='<circle cx="228" cy="'+(ey+1)+'" r="5" fill="#3A2414"/>'+(wink?'':'<circle cx="273" cy="'+(ey+1)+'" r="5" fill="#3A2414"/>');
  s+='<path d="M250 276 C 248 296 244 304 252 306" fill="none" stroke="#9A6E3E" stroke-width="4" stroke-linecap="round"/>';
  s+='<path d="M232 322 C 242 328 258 328 270 320" fill="none" stroke="#7A3E2A" stroke-width="5" stroke-linecap="round"/>';
  s+='</g>';
  return s;}
function mlFrame(cx,cy){var s='';
  // marco dorado
  s+='<rect x="'+(cx-270)+'" y="'+(cy-370)+'" width="540" height="740" rx="10" fill="none" stroke="#C9A040" stroke-width="40"/><rect x="'+(cx-290)+'" y="'+(cy-390)+'" width="580" height="780" rx="14" fill="none" stroke="#1a1a1a" stroke-width="6"/><rect x="'+(cx-250)+'" y="'+(cy-350)+'" width="500" height="700" fill="none" stroke="#1a1a1a" stroke-width="5"/>';
  for(var i=0;i<16;i++){var a=i/16;var px=cx-270+a*540;s+='<circle cx="'+px+'" cy="'+(cy-370)+'" r="5" fill="#F4D27A"/><circle cx="'+px+'" cy="'+(cy+370)+'" r="5" fill="#F4D27A"/>';}
  return s;}
function paisaje(x,y,W,H,t){var s='<defs><linearGradient id="pzsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC8FF"/><stop offset=".7" stop-color="#FFD9A8"/></linearGradient><linearGradient id="pzlake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FB8F0"/><stop offset="1" stop-color="#3A8ED0"/></linearGradient></defs>';
  s+='<rect x="'+x+'" y="'+y+'" width="'+W+'" height="'+H+'" fill="url(#pzsky)"/>';
  var sx=x+W*0.68,sy=y+H*0.36;s+='<circle cx="'+sx+'" cy="'+sy+'" r="70" fill="#FFE27A" opacity=".45"/><circle cx="'+sx+'" cy="'+sy+'" r="46" fill="#FFD23F" stroke="#1a1a1a" stroke-width="5"/>';
  [[0.18,0.18,1],[0.52,0.12,0.8]].forEach(function(c,i){var cx=x+((c[0]*W+t*14*(i?1:0.7))%(W+120))-40,cy=y+c[1]*H;s+='<g transform="translate('+cx+','+cy+') scale('+c[2]+')"><circle cx="-30" cy="6" r="22" fill="#fff"/><circle cx="0" cy="-6" r="30" fill="#fff"/><circle cx="32" cy="6" r="22" fill="#fff"/><rect x="-52" y="6" width="106" height="22" rx="11" fill="#fff"/></g>';});
  s+='<path d="M'+x+' '+(y+H*0.62)+' L '+(x+W*0.18)+' '+(y+H*0.32)+' L '+(x+W*0.34)+' '+(y+H*0.5)+' L '+(x+W*0.5)+' '+(y+H*0.26)+' L '+(x+W*0.72)+' '+(y+H*0.56)+' L '+(x+W*0.86)+' '+(y+H*0.4)+' L '+(x+W)+' '+(y+H*0.58)+' L '+(x+W)+' '+(y+H)+' L '+x+' '+(y+H)+' Z" fill="#8E7BD8" stroke="#1a1a1a" stroke-width="5" stroke-linejoin="round"/>';
  s+='<path d="M'+(x+W*0.5)+' '+(y+H*0.26)+' L '+(x+W*0.44)+' '+(y+H*0.34)+' L '+(x+W*0.5)+' '+(y+H*0.32)+' L '+(x+W*0.56)+' '+(y+H*0.35)+' Z M'+(x+W*0.18)+' '+(y+H*0.32)+' L '+(x+W*0.13)+' '+(y+H*0.39)+' L '+(x+W*0.2)+' '+(y+H*0.37)+' Z" fill="#fff"/>';
  s+='<path d="M'+x+' '+(y+H*0.7)+' C '+(x+W*0.2)+' '+(y+H*0.56)+' '+(x+W*0.4)+' '+(y+H*0.64)+' '+(x+W*0.55)+' '+(y+H*0.62)+' C '+(x+W*0.75)+' '+(y+H*0.6)+' '+(x+W*0.9)+' '+(y+H*0.54)+' '+(x+W)+' '+(y+H*0.62)+' L '+(x+W)+' '+(y+H)+' L '+x+' '+(y+H)+' Z" fill="#5FCB7A" stroke="#1a1a1a" stroke-width="5"/>';
  s+='<path d="M'+(x+W*0.22)+' '+(y+H*0.76)+' C '+(x+W*0.4)+' '+(y+H*0.72)+' '+(x+W*0.7)+' '+(y+H*0.72)+' '+(x+W*0.86)+' '+(y+H*0.78)+' C '+(x+W*0.7)+' '+(y+H*0.86)+' '+(x+W*0.36)+' '+(y+H*0.86)+' '+(x+W*0.22)+' '+(y+H*0.76)+' Z" fill="url(#pzlake)" stroke="#1a1a1a" stroke-width="5"/><path d="M'+(x+W*0.42)+' '+(y+H*0.79)+' L '+(x+W*0.6)+' '+(y+H*0.79)+'" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>';
  [[0.08,0.74,1],[0.14,0.8,0.8],[0.9,0.72,1.1],[0.96,0.8,0.8]].forEach(function(p){var px=x+p[0]*W,py=y+p[1]*H,k=p[2];s+='<path d="M'+px+' '+(py-70*k)+' L '+(px+26*k)+' '+py+' L '+(px-26*k)+' '+py+' Z" fill="#2E7D4F" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/><rect x="'+(px-5*k)+'" y="'+py+'" width="'+(10*k)+'" height="'+(14*k)+'" fill="#8A5A3B"/>';});
  s+='<path d="M'+x+' '+(y+H*0.9)+' C '+(x+W*0.3)+' '+(y+H*0.86)+' '+(x+W*0.7)+' '+(y+H*0.86)+' '+(x+W)+' '+(y+H*0.9)+' L '+(x+W)+' '+(y+H)+' L '+x+' '+(y+H)+' Z" fill="#3FAE5A"/>';
  for(var i=0;i<14;i++){var px=x+20+i*(W-40)/13,py=y+H*0.94+Math.sin(i*1.7)*8;s+='<circle cx="'+px+'" cy="'+py+'" r="7" fill="'+['#FF4F8B','#FFD23F','#fff','#B49BF2'][i%4]+'" stroke="#1a1a1a" stroke-width="2.5"/>';}
  for(var i=0;i<3;i++){var bx=x+W*(0.3+i*0.07)+Math.sin(t*2+i)*6,by=y+H*(0.18+i*0.03);s+='<path d="M'+(bx-12)+' '+by+' Q '+(bx-6)+' '+(by-8)+' '+bx+' '+by+' Q '+(bx+6)+' '+(by-8)+' '+(bx+12)+' '+by+'" fill="none" stroke="#1a1a1a" stroke-width="3.5" stroke-linecap="round"/>';}
  return s;}
function brush(x,y,t){return '<g transform="translate('+x+','+y+') rotate(-35)"><rect x="-10" y="-200" width="20" height="150" rx="9" fill="#C9733A" stroke="#1a1a1a" stroke-width="5"/><rect x="-14" y="-60" width="28" height="26" rx="4" fill="#C0C7CF" stroke="#1a1a1a" stroke-width="5"/><path d="M-14 -36 C -16 -10 -6 6 0 10 C 6 6 16 -10 14 -36 Z" fill="#3DB8F5" stroke="#1a1a1a" stroke-width="5"/></g>';}
function hookSubs(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(SUBS[i].t0<C.p&&t>=SUBS[i].t0-0.05&&t<SUBS[i].t1+0.3)cur=i;if(cur===null)return '';
  var W=SUBS[cur].w,PAL=['#FF4F8B','#3DB8F5','#F0A21A','#22C3B0','#8E6CF5','#FF5A4E'];var lines=[],ln=[],len=0;
  W.forEach(function(w){if(len+w.s.length>11&&ln.length){lines.push(ln);ln=[];len=0;}ln.push(w);len+=w.s.length+1;});if(ln.length)lines.push(ln);
  var ST=window.TSTYLE||'A';var fs=140,lh=162,y0=960-(lines.length-1)*lh/2+48,s='';var SH=['#FF4F8B','#3DB8F5','#8E6CF5','#FF8A3D'];var PAL2=['#FF4F8B','#3DB8F5','#F0A21A','#22C3B0','#8E6CF5','#FF5A4E'];var wi=0;
  lines.forEach(function(L_,li){var y=y0+li*lh;var rot=(li%2?2.5:-2.5);var lk=cl((t-L_[0].t)/0.22);var tr='translate(540,'+y+') rotate('+(ST==='C'?0:rot)+') scale('+(0.5+0.5*back(lk))+') translate(-540,'+(-y)+')';
    var spans=function(colfn){var o='';L_.forEach(function(w,j){var on=t>=w.t-0.02;o+='<tspan fill="'+colfn(j)+'" fill-opacity="'+(on?1:0)+'" stroke-opacity="'+(on?1:0)+'">'+(j?' ':'')+w.s.toUpperCase()+'</tspan>';});return o;};
    var txt=function(colfn,dx,dy,sw,sc){return '<text x="'+(540+dx)+'" y="'+(y+dy)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" stroke="'+(sc||'#1a1a1a')+'" stroke-width="'+sw+'" paint-order="stroke" transform="'+tr+'">'+spans(colfn)+'</text>';};
    var nch=L_.map(function(w){return w.s;}).join(' ').length,bw=nch*fs*0.6+80;
    if(ST==='A'){s+='<g transform="'+tr+'"><rect x="'+(540-bw/2)+'" y="'+(y-fs*0.82)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="#1a1a1a"/></g>'+txt(function(){return '#fff';},0,0,0);}
    else if(ST==='B'){s+='<g transform="'+tr+'"><rect x="'+(540-bw/2+10)+'" y="'+(y-fs*0.82+12)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="rgba(0,0,0,.35)"/><rect x="'+(540-bw/2)+'" y="'+(y-fs*0.82)+'" width="'+bw+'" height="'+(fs*1.08)+'" rx="30" fill="#fff" stroke="#1a1a1a" stroke-width="8"/></g>'+txt(function(j){return PAL2[(cur*2+li*3+j)%PAL2.length];},0,0,0);}
    else if(ST==='C'){for(var d=14;d>0;d-=2)s+=txt(function(){return '#1a1a1a';},d,d,20);s+=txt(function(){return '#FFD23F';},0,0,20);}
    else{s+=txt(function(){return SH[(cur+li)%SH.length];},10,12,22)+txt(function(){return '#FFFFFF';},0,0,20);}});
  if(ST==='D'){s='<rect x="0" y="'+(y0-fs*0.95)+'" width="1080" height="'+(lines.length*lh+40)+'" fill="#1a1a1a" opacity=".55"/>'+s;}
  return s;}
function render(t){
  var out='',bg='#8E6CF5';var ent=function(t0){return eio(cl((t-t0)/0.5));};
  // ── GANCHO: frasco que explota en notas
  if(t<C.p){bg='#FF4F8B';
    var IDS=Object.keys(NOTAS);var SPL=['#FF4F8B','#FFD23F','#3DB8F5','#22C3B0','#8E6CF5','#FF8A3D','#5FCB7A','#FF5A4E'];
    // manchas de color de base (cubren todo)
    var kb=cl((t-0.3)/0.5);
    for(var i=0;i<26;i++){var gx=(i%4)*300+((Math.floor(i/4))%2)*150,gy=Math.floor(i/4)*330;var r=230*back(cl((t-0.3-hsh(i)*0.3)/0.5));if(r<=0)continue;var cx=gx+Math.sin(t*0.7+i)*20,cy=gy+Math.cos(t*0.6+i)*20;
      out+='<path d="M'+(cx-r)+' '+cy+' C '+(cx-r)+' '+(cy-r*1.05)+' '+(cx+r*0.95)+' '+(cy-r)+' '+(cx+r)+' '+(cy-r*0.05)+' C '+(cx+r*1.05)+' '+(cy+r*0.95)+' '+(cx-r*0.7)+' '+(cy+r*1.1)+' '+(cx-r)+' '+cy+' Z" fill="'+SPL[i%SPL.length]+'"/>';}
    // collage de stickers de notas
    var P=[];for(var i=0;i<150;i++){var c=i%10,r=Math.floor(i/10);var x=c*118+(r%2)*59-20+(hsh(i*3)-0.5)*90,y=r*135-20+(hsh(i*7)-0.5)*90;var sc=0.9+hsh(i*11)*1.3;P.push({i:i,x:x,y:y,sc:sc,id:IDS[(i*37)%IDS.length],rot:(hsh(i*5)-0.5)*70,t0:0.32+hsh(i*13)*1.1});}
    P.sort(function(p,q){return p.sc-q.sc;});
    P.forEach(function(p){var k=cl((t-p.t0)/0.3);if(k<=0)return;var b=back(k);var dx=Math.sin(t*(0.8+p.sc*0.3)+p.i)*8*p.sc,dy=Math.cos(t*(0.7+p.sc*0.25)+p.i*1.3)*8*p.sc+(t-p.t0)*(-6)*p.sc;var rot=p.rot+Math.sin(t*1.6+p.i)*6;
      out+='<g transform="translate('+(p.x+dx)+','+(p.y+dy)+') rotate('+rot+') scale('+(p.sc*b)+')"><circle r="66" fill="'+SPL[(p.i*3)%SPL.length]+'" stroke="#fff" stroke-width="8"/><circle r="70" fill="none" stroke="#1a1a1a" stroke-width="5"/></g>'+nota(p.id,p.x+dx,p.y+dy,p.sc*b*0.92,rot);});
    var sh=t<0.35?Math.sin(t*90)*8:0;var bk=t<0.35?1:cl(1-(t-0.35)/0.25);
    if(bk>0){out+='<g transform="translate('+(540+sh)+',960) scale('+(1+0.4*(1-bk))+')" opacity="'+bk+'"><rect x="-110" y="-180" width="220" height="300" rx="60" fill="#FFE27A" stroke="#1a1a1a" stroke-width="9"/><rect x="-45" y="-250" width="90" height="80" rx="16" fill="#1a1a1a"/><text y="20" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="90">B.</text></g>';}
    if(t>=0.35&&t<0.9){var k=(t-0.35)/0.55;out+='<circle cx="540" cy="960" r="'+(80+k*900)+'" fill="none" stroke="#fff" stroke-width="'+(40*(1-k))+'" opacity="'+(1-k)+'"/>';}
    out+=hookSubs(t);
  }
  // ── QUÉ ES UNA NOTA: paleta → notas → atril con lienzo → paisaje
  if(t>=C.p&&t<C.ci){bg='#FFD23F';
    var kp=ent(C.p);
    var PAL=[['limon',-170,-60,'#FFE14D'],['rosa',-60,-130,'#FF4F8B'],['lavanda',70,-130,'#9B7BEA'],['menta',170,-50,'#5FCB7A'],['vainilla',150,80,'#F6E7B8'],['canela',-150,80,'#B5622B']];
    var mv=eio(cl((t-C.ml)/0.8));var pcx=L(540,215,mv),pcy=L(1000,1470,mv),psc=L(1,0.5,mv)*back(kp);
    // atril + lienzo (entra desde abajo)
    var CX=540,CY=L(1500,880,mv),W=620,H=460,x0=CX-W/2,y0=CY-H/2;
    if(mv>0){out+='<g opacity="'+cl(mv*1.5)+'"><path d="M'+(CX-180)+' '+(y0+H-10)+' L '+(CX-260)+' '+(CY+640)+' M'+(CX+180)+' '+(y0+H-10)+' L '+(CX+260)+' '+(CY+640)+' M'+CX+' '+(y0-60)+' L '+CX+' '+(CY+600)+'" stroke="#1a1a1a" stroke-width="30" stroke-linecap="round"/><path d="M'+(CX-180)+' '+(y0+H-10)+' L '+(CX-260)+' '+(CY+640)+' M'+(CX+180)+' '+(y0+H-10)+' L '+(CX+260)+' '+(CY+640)+' M'+CX+' '+(y0-60)+' L '+CX+' '+(CY+600)+'" stroke="#B9794B" stroke-width="18" stroke-linecap="round"/><rect x="'+(CX-W/2-30)+'" y="'+(y0+H+4)+'" width="'+(W+60)+'" height="30" rx="8" fill="#9C6238" stroke="#1a1a1a" stroke-width="6"/>';
      out+='<rect x="'+(x0+10)+'" y="'+(y0+14)+'" width="'+W+'" height="'+H+'" fill="rgba(0,0,0,.2)"/><rect x="'+x0+'" y="'+y0+'" width="'+W+'" height="'+H+'" fill="#FFFDF7" stroke="#1a1a1a" stroke-width="8"/></g>';}
    // manchas de pintura (notas que vuelan al lienzo: "solas son simples")
    var DAB=[[0.18,0.3,'#FFE14D','limon'],[0.42,0.22,'#FF4F8B','rosa'],[0.7,0.28,'#9B7BEA','lavanda'],[0.85,0.6,'#5FCB7A','menta'],[0.25,0.7,'#B5622B','canela'],[0.55,0.62,'#F6E7B8','vainilla'],[0.62,0.42,'#3DB8F5','marino'],[0.35,0.48,'#FF8A1E','naranja']];
    var reveal=cl((t-C.ml2)/1.1);
    if(t>=C.ml+0.7){DAB.forEach(function(d,i){var ts=C.ml+0.8+i*0.32,k=cl((t-ts)/0.55);if(k<=0)return;var tx=x0+d[0]*W,ty=y0+d[1]*H;var fx=pcx+(i%3-1)*60,fy=pcy-40;var e=eio(k);
      if(k<1){out+=nota(d[3],L(fx,tx,e),L(fy,ty,e)-Math.sin(k*Math.PI)*260,0.9*(1-0.4*e),k*300);}
      else{var r=46+6*Math.sin(i*2);var op=1-reveal;out+='<g opacity="'+op+'"><path d="M'+(tx-r)+' '+ty+' C '+(tx-r)+' '+(ty-r*1.1)+' '+(tx+r*0.9)+' '+(ty-r)+' '+(tx+r)+' '+(ty-r*0.1)+' C '+(tx+r*1.1)+' '+(ty+r)+' '+(tx-r*0.6)+' '+(ty+r*1.1)+' '+(tx-r)+' '+ty+' Z" fill="'+d[2]+'" stroke="#1a1a1a" stroke-width="4"/><circle cx="'+(tx+r*1.1)+'" cy="'+(ty-r*0.6)+'" r="8" fill="'+d[2]+'" stroke="#1a1a1a" stroke-width="3"/></g>';}});}
    // pincel que pinta el paisaje en 4 pasadas
    if(reveal>0){var bands=4,bh=H/bands,clip='';var bx=0,by=0;
      for(var j=0;j<bands;j++){var kk=cl(reveal*bands-j);var w=W*kk;var ltr=j%2===0;var rx=ltr?x0:x0+W-w;clip+='<rect x="'+(rx-4)+'" y="'+(y0+j*bh-3)+'" width="'+(w+8)+'" height="'+(bh+6)+'" rx="'+(kk<1?bh/2:0)+'"/>';if(kk>0&&kk<1){bx=ltr?x0+w:x0+W-w;by=y0+j*bh+bh/2;}}
      out+='<clipPath id="pz">'+clip+'</clipPath><g clip-path="url(#pz)">'+paisaje(x0,y0,W,H,t)+'</g><rect x="'+x0+'" y="'+y0+'" width="'+W+'" height="'+H+'" fill="none" stroke="#1a1a1a" stroke-width="8"/>';
      if(reveal<1&&bx)out+=brush(bx,by,t);}
    // paleta (encima)
    out+='<g transform="translate('+pcx+','+pcy+') scale('+psc+')"><path d="M-300 -40 C -300 -230 260 -260 300 -60 C 330 90 200 120 150 90 C 110 66 60 120 90 170 C 120 220 40 250 -40 240 C -230 220 -300 120 -300 -40 Z" fill="#E8C48A" stroke="#1a1a1a" stroke-width="9"/><ellipse cx="40" cy="140" rx="40" ry="32" fill="#FFD23F" stroke="#1a1a1a" stroke-width="7"/>';
    PAL.forEach(function(q,i){var ts=C.p+0.6+i*0.4,km=cl((t-ts)/0.5);out+='<circle cx="'+q[1]+'" cy="'+q[2]+'" r="'+(46*(1-km))+'" fill="'+q[3]+'" stroke="#1a1a1a" stroke-width="5"/>';if(km>0)out+=nota(q[0],q[1],q[2],0.85*back(km),0);});
    out+='</g>';
    if(t<C.ml)out+=chip('🎨 NOTAS = INGREDIENTES',540,560,(t-C.p-0.8)/0.35,'#fff',44);
    else if(t<C.ml2)out+=chip('SOLAS = SIMPLES',540,430,(t-C.ml-1.2)/0.35,'#fff',44);
    if(t>=C.ml3){for(var i=0;i<12;i++){var a=i*0.52+t;out+=star(CX+Math.cos(a)*400,CY+Math.sin(a)*300,14+8*Math.sin(t*5+i));}
      out+=chip('✨ JUNTAS = UNA OBRA ✨',540,430,(t-C.ml3)/0.35,'#fff',50);}
  }
  // ── FAMILIAS
  var FAM=[['ci','ci2',null,'🍋 CÍTRICOS','#C9E34A',['bergamota','limon','naranja'],['bergamota','limon','naranja','menta'],'⚡ FRESCURA · DURAN POCO','#FFF'],
           ['fl','fl2','fl1','🌸 FLORES','#FF8FBF',['rosa','jazmin','lavanda'],['rosa','jazmin','lavanda'],'💕 ALMA ROMÁNTICA','#FFF'],
           ['du','du2','du1','🍮 LO DULCE','#F4B63A',['vainilla','caramelo','cafe','tonka'],['vainilla','caramelo','cafe','tonka','coco'],'🧲 ADICTIVO','#FFF'],
           ['es','es2','es1','🌶️ ESPECIAS','#E8713A',['pimienta','canela','cardamomo'],['pimienta','canela','cardamomo','jengibre'],'🔥 CALOR Y CARÁCTER','#FFF'],
           ['ma','ma2','ma1','🌲 MADERAS','#8A5A3B',['cedro','sandalo','pachuli'],['cedro','sandalo','pachuli','oud'],'👔 BASE ELEGANTE','#FFF']];
  var nexts={ci:'fl',fl:'du',du:'es',es:'ma',ma:'tr'};
  FAM.forEach(function(F,fi){var k0=C[F[0]],k1=C[nexts[F[0]]];if(t<k0||t>=k1)return;bg=F[4];
    out+=confetti(F[6],t,k0,34,fi*31+5,0.6);
    out+=burst(F[6],540,1000,t,k0,10,520,fi*13);
    out+=title(F[3],300,(t-k0)/0.4,'#fff',F[3].length>12?104:120);
    var names=F[5],tn=F[2]?C[F[2]]:k0+0.75,span=F[2]?1.9:2.6;var pos=names.length===3?[[540,690],[300,1060],[780,1060]]:[[300,700],[780,700],[300,1110],[780,1110]];
    if(F[0]==='du'&&t>=C.du3){ // "¿qué tenés puesto?"
      out+='<g opacity="'+ent(C.du3)+'">'+ch('m',120,1030,0.95,t,{wink:t>C.du4+0.3})+ch('h',560,1030,0.95,t,{hearts:t>=C.du4,flip:true})+'</g>';
      if(t>=C.du4){var kb=cl((t-C.du4)/0.35);out+='<g transform="translate(680,760) scale('+back(kb)+')"><rect x="-310" y="-80" width="620" height="140" rx="40" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><path d="M-60 58 L -110 120 L 0 58 Z" fill="#fff" stroke="#1a1a1a" stroke-width="7" stroke-linejoin="round"/><rect x="-62" y="50" width="70" height="14" fill="#fff"/><text y="18" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="48">¿qué tenés puesto? 😍</text></g>';}
      for(var i=0;i<10;i++){var ph=((t*0.6+i/10)%1);out+=nota(F[6][i%5],260+Math.sin(i*2+t)*60+ph*360,1000-ph*420,0.55,t*60+i*30);}
    }else{names.forEach(function(id,i){var p=pos[i];out+=hero(id,p[0],p[1],t,tn+i*span/names.length,names.length===4?1.35:1.55);});}
    if(t>=C[F[1]]&&!(F[0]==='du'&&t>=C.du3))out+=chip(F[7],540,1440,(t-C[F[1]])/0.35,F[8],46);
    if(F[0]==='ma'&&t>=C.ma2+1){var kc=cl((t-C.ma2-1)/0.4);var a=(t-C.ma2-1)*2.2;out+='<g transform="translate(900,560) scale('+back(kc)+')"><circle r="70" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><path d="M0 0 L '+(Math.cos(a-1.57)*46)+' '+(Math.sin(a-1.57)*46)+' M0 0 L '+(Math.cos(a*0.25-1.57)*30)+' '+(Math.sin(a*0.25-1.57)*30)+'" stroke="#1a1a1a" stroke-width="7" stroke-linecap="round"/><text x="-140" y="20" font-size="56">'+(a%6.28<3.14?'☀️':'🌙')+'</text></g>';}
  });
  // ── LAS 3 QUE NADIE ENTIENDE: cartas coleccionables
  if(t>=C.tr&&t<C.ac){bg='#2B1D4E';
    out+=confetti(['oud','ambar','almizcle'],t,C.tr,14,77,0.25);
    out+=title('LAS 3 QUE',300,(t-C.tr)/0.4,'#fff',110)+title('NADIE ENTIENDE 🤯',430,(t-C.tr-0.4)/0.4,'#FFD23F',100);
    var CARDS=[['oud','OUD','#3B2418','Madera oscura y misteriosa','De las más caras del mundo 💰','★★★★★'],['amb','ÁMBAR','#F0A21A','❌ No es la piedra','Resinas + vainilla = abrazo 🤗','★★★★'],['alm','ALMIZCLE','#C9B8EA','Olor a piel limpia ✨','Hace que el perfume sea TUYO','★★★★']];
    var cur=-1;CARDS.forEach(function(c,i){if(t>=C[c[0]])cur=i;});
    CARDS.forEach(function(c,i){if(cur<i)return;var big=i===cur;var tc=C[c[0]];var flip=cl((t-tc)/0.45);var sx=big?Math.abs(Math.cos((1-flip)*Math.PI/2*2)):1;var showFront=!big||flip>0.5;
      var x=big?540:160+i*150,y=big?990:600,sc=big?0.9:0.22;if(!big){x=120+i*140;y=1440;}
      var w=560,h=760;var id=c[0]==='amb'?'ambar':c[0]==='alm'?'almizcle':'oud';
      var g='<g transform="translate('+x+','+y+') scale('+(sc*sx)+','+sc+')">';
      if(showFront){var hol=((t*0.4)%1);
        g+='<rect x="'+(-w/2+12)+'" y="'+(-h/2+14)+'" width="'+w+'" height="'+h+'" rx="40" fill="rgba(0,0,0,.35)"/><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="40" fill="#FFF8E6" stroke="#1a1a1a" stroke-width="10"/><rect x="'+(-w/2+30)+'" y="'+(-h/2+30)+'" width="'+(w-60)+'" height="400" rx="26" fill="'+c[2]+'" stroke="#1a1a1a" stroke-width="7"/>';
        g+='<defs><linearGradient id="holo'+i+'" x1="0" y1="0" x2="1" y2="1"><stop offset="'+Math.max(0,hol-0.2)+'" stop-color="#fff" stop-opacity="0"/><stop offset="'+hol+'" stop-color="#fff" stop-opacity=".55"/><stop offset="'+Math.min(1,hol+0.2)+'" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
        g+=nota(id,0,-h/2+230,2.6,Math.sin(t*1.5)*6)+'<rect x="'+(-w/2+30)+'" y="'+(-h/2+30)+'" width="'+(w-60)+'" height="400" rx="26" fill="url(#holo'+i+')"/>';
        g+='<text y="'+(-h/2+500)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="84" fill="#1a1a1a">'+c[1]+'</text><text y="'+(-h/2+550)+'" text-anchor="middle" font-size="36" fill="#F0A21A">'+c[5]+'</text>';
        g+='<text y="'+(-h/2+620)+'" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="32" fill="#1a1a1a">'+c[3]+'</text><text y="'+(-h/2+670)+'" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="30" fill="#5a5a5a">'+c[4]+'</text>';}
      else{g+='<rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="40" fill="#8E6CF5" stroke="#1a1a1a" stroke-width="10"/><text y="40" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="200" fill="#fff">B.</text>';}
      out+=g+'</g>';
      if(big&&flip>=1)for(var j=0;j<8;j++){var a=j*0.785+t;out+=star(x+Math.cos(a)*310,y+Math.sin(a)*400,12+6*Math.sin(t*5+j));}});
  }
  // ── ACORDES: 1+1=3, teclado y caldero
  if(t>=C.ac&&t<C.cj){bg='#22C3B0';
    out+=title('✨ LA MAGIA ✨',300,(t-C.ac)/0.4,'#fff',110);
    if(t<C.ac5){var k=ent(C.ac+0.8);
      out+='<g opacity="'+k+'">'+nota('limon',260,760,1.3,0)+'<text x="410" y="800" font-family="Baloo 2" font-weight="800" font-size="110" fill="#fff" stroke="#1a1a1a" stroke-width="12" paint-order="stroke">+</text>'+nota('rosa',560,760,1.3,0)+'<text x="690" y="800" font-family="Baloo 2" font-weight="800" font-size="110" fill="#fff" stroke="#1a1a1a" stroke-width="12" paint-order="stroke">=</text>';
      var kn=cl((t-C.ac-2.2)/0.5);out+='<g transform="translate(870,760) scale('+back(kn)+')"><circle r="90" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><text y="30" text-anchor="middle" font-size="90">✨</text></g>'+(kn>0?'<text x="870" y="920" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40" fill="#1a1a1a">¡OLOR NUEVO!</text>':'')+'</g>';
      if(t>=C.ac2){out+=chip('🎹 ACORDE',540,560,(t-C.ac2)/0.35,'#FFD23F',48);
        var kk=ent(C.ac2);var kx=140,ky=1150,kw=800;out+='<g opacity="'+kk+'"><rect x="'+kx+'" y="'+ky+'" width="'+kw+'" height="300" rx="20" fill="#1a1a1a"/>';
        var lit=[2,4,6];for(var i=0;i<10;i++){var on=false;lit.forEach(function(li,j){if(i===li&&t>=C.ac3+j*0.25)on=true;});out+='<rect x="'+(kx+14+i*78)+'" y="'+(ky+14)+'" width="70" height="272" rx="10" fill="'+(on?'#FFD23F':'#fff')+'"/>';}
        [1,2,4,5,7,8].forEach(function(i){out+='<rect x="'+(kx+14+i*78-22)+'" y="'+(ky+14)+'" width="44" height="160" rx="8" fill="#1a1a1a"/>';});out+='</g>';
        if(t>=C.ac3){for(var i=0;i<6;i++){var ph=((t-C.ac3)*0.7+i/6)%1;out+='<text x="'+(300+i*100+Math.sin(ph*6+i)*30)+'" y="'+(1130-ph*300)+'" font-size="60" opacity="'+(1-ph)+'">'+(i%2?'♪':'♫')+'</text>';}}
        if(t>=C.ac4)out+=chip('🎵 UNA CANCIÓN',540,1530,(t-C.ac4)/0.35,'#fff',42);}
    }else{ // caldero
      var cx=540,cy=1180;out+='<g><ellipse cx="'+cx+'" cy="'+(cy+190)+'" rx="260" ry="34" fill="rgba(0,0,0,.25)"/><path d="M'+(cx-250)+' '+(cy-60)+' C '+(cx-260)+' '+(cy+200)+' '+(cx+260)+' '+(cy+200)+' '+(cx+250)+' '+(cy-60)+' Z" fill="#3A2E3E" stroke="#1a1a1a" stroke-width="9"/><ellipse cx="'+cx+'" cy="'+(cy-60)+'" rx="250" ry="56" fill="#F0A21A" stroke="#1a1a1a" stroke-width="9"/>';
      for(var i=0;i<8;i++){var ph=((t*0.9+i/8)%1);out+='<circle cx="'+(cx-180+hsh(i)*360)+'" cy="'+(cy-70-ph*160)+'" r="'+(10+ph*16)+'" fill="#FFD27A" stroke="#1a1a1a" stroke-width="3" opacity="'+(1-ph)+'"/>';}out+='</g>';
      [['labdano',C.ac5],['vainilla',C.ac5+0.75],['benjui',C.ac5+1.45]].forEach(function(q,i){var k=cl((t-q[1])/0.7);if(k<=0)return;var sx=[220,540,860][i],sy=640;var e=k*k;
        if(k<1)out+=nota(q[0],L(sx,cx,e),L(sy,cy-80,e)-Math.sin(k*Math.PI)*120,1.3*(1-0.6*e),k*360);
        out+='<text x="'+sx+'" y="'+(sy+130)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="40" fill="#fff" stroke="#1a1a1a" stroke-width="8" paint-order="stroke" opacity="'+(k<1?1:0.5)+'">'+NOTAS[q[0]].n+'</text>';});
      if(t>=C.ac6){var k=(t-C.ac6);var pk=cl(k/0.5);out+='<g opacity="'+cl(1-k/1.2)+'">';for(var i=0;i<9;i++){var a=i*0.7;out+='<circle cx="'+(cx+Math.cos(a)*200*pk)+'" cy="'+(cy-200+Math.sin(a)*120*pk)+'" r="'+(90*pk)+'" fill="#fff"/>';}out+='</g><text x="'+(cx+170)+'" y="'+(cy-260)+'" font-family="Baloo 2" font-weight="800" font-size="90" fill="#1a1a1a" opacity="'+cl(1-k/1.2)+'">¡PUF!</text>';
        var kc=cl((k-0.4)/0.5);if(kc>0){out+='<g transform="translate('+cx+','+(cy-330)+') scale('+back(kc)+')"><rect x="-230" y="-200" width="460" height="330" rx="34" fill="#FFF8E6" stroke="#1a1a1a" stroke-width="9"/>'+nota('ambar',0,-70,1.5,0)+'<text y="90" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="54">ACORDE ÁMBAR</text></g>';for(var j=0;j<8;j++){var a=j*0.785+t;out+=star(cx+Math.cos(a)*300,cy-330+Math.sin(a)*220,14);}}}
    }
  }
  // ── LA CAJA
  if(t>=C.cj&&t<C.cm){bg='#3DB8F5';
    out+=title('DÁ VUELTA LA CAJA 📦',300,(t-C.cj)/0.4,'#fff',96);
    var flip=cl((t-C.cj-0.8)/0.6);var sx=Math.abs(Math.cos(flip*Math.PI));var back_=flip>0.5;var bx=540,by=1000;
    out+='<g transform="translate('+bx+','+by+') scale('+sx+',1)"><rect x="-290" y="-400" width="580" height="800" rx="20" fill="rgba(0,0,0,.25)" transform="translate(14,16)"/><rect x="-290" y="-400" width="580" height="800" rx="20" fill="'+(back_?'#FFF8E6':'#1a1a1a')+'" stroke="#1a1a1a" stroke-width="9"/>';
    if(!back_)out+='<text y="-20" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="200" fill="#F4B63A">B.</text><text y="80" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="40" fill="#fff" letter-spacing="8">EAU DE PARFUM</text>';
    else{out+='<text y="-320" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="40" fill="#1a1a1a" letter-spacing="4">NOTAS</text>';
      var rows=[['bergamota','Bergamota, limón',1],['rosa','Rosa, jazmín',0],['vainilla','Vainilla',2],['cedro','Cedro, sándalo',2]];
      rows.forEach(function(r,i){var y=-210+i*150;var hi=(r[2]===1&&t>=C.cj2)||(r[2]===2&&t>=C.cj3);var hk=r[2]===1?cl((t-C.cj2)/0.4):cl((t-C.cj3-i*0.15+2*0.15)/0.4);
        if(hi)out+='<rect x="-250" y="'+(y-38)+'" width="'+(500*hk)+'" height="76" rx="12" fill="'+(r[2]===1?'#BFF0FF':'#FFD9A8')+'"/>';
        out+=nota(r[0],-190,y,0.6,0)+'<text x="-120" y="'+(y+14)+'" font-family="Baloo 2" font-weight="800" font-size="46" fill="#1a1a1a">'+r[1]+'</text>';});}
    out+='</g>';
    if(t>=C.cj2&&t<C.cj3)out+=chip('❄️ FRESCO',540,1490,(t-C.cj2-0.3)/0.35,'#BFF0FF',50);
    if(t>=C.cj3)out+=chip('🔥 CÁLIDO Y DURADERO',540,1490,(t-C.cj3-0.6)/0.35,'#FFD9A8',46);
  }
  // ── COMENTARIOS
  if(t>=C.cm&&t<C.end){bg='#FF4F8B';
    out+=confetti(ALL,t,C.cm,24,91,0.55);
    out+=title('¿CUÁL ES TU',330,(t-C.cm)/0.4,'#fff',120)+title('NOTA FAVORITA? 👇',470,(t-C.cm-0.4)/0.4,'#FFD23F',110);
    var CM=[['vainilla','vainilla siempre 🤤'],['rosa','rosa, soy romántica 🌹'],['oud','oud, obvio 🔥'],['cafe','café ☕ me muero']];
    CM.forEach(function(c,i){var k=cl((t-C.cm-0.5-i*0.45)/0.35);if(k<=0)return;var y=720+i*190;out+='<g transform="translate(540,'+y+') scale('+back(k)+')"><rect x="-400" y="-70" width="800" height="140" rx="40" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><circle cx="-320" cy="0" r="46" fill="'+NOTAS[c[0]].c+'" stroke="#1a1a1a" stroke-width="5"/>'+nota(c[0],-320,0,0.6,0)+'<text x="-250" y="16" font-family="DM Sans" font-weight="700" font-size="44" fill="#1a1a1a">'+c[1]+'</text><text x="330" y="16" font-size="44">❤️</text></g>';});
  }
  document.getElementById('bgc').style.background=bg;
  document.getElementById('sv').innerHTML=out;
  renderSubs2(t);
  var E=document.getElementById('end');var eOn=t>=C.end;E.style.display=eOn?'block':'none';
  if(eOn){var k=eio(cl((t-C.end)/0.4));E.style.opacity=k;['eA','eB','eC','eD'].forEach(function(id,i){var kk=cl((t-C.end-0.2-i*0.3)/0.4);document.getElementById(id).style.transform='translateY('+((1-eio(kk))*60)+'px) scale('+L(.85,1,cl(back(kk)))+')';document.getElementById(id).style.opacity=cl(kk*2.5);});}
  hkRender(t);
}
var subLine=-1;
function renderSubs2(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t>=C.end||t<C.p){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(notas|cuadro|obra|cítricos|flores|dulce|especias|maderas|oud|ámbar|almizcle|acorde|magia|caja|fresco|cálido|favorita|belle|perfume)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:…"—]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
