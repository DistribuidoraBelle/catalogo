// ═══════════ SERIE · ARMAF CLUB DE NUIT · estilo "NOCHE DE LUJO" v2 (cinemático, fotos reales de notas) ═══════════
var C=window.CUES;
var PARTE={num:'I',titulo:'LA FAMILIA INTENSE',nxt:'PARTE II · LOS FRESCOS'};
var HERO=['mandarina','canela','abedul','mora','vainilla','cuero','ciruela','caramelo'];
function cl(x){return x<0?0:x>1?1:x}
function L(a,b,k){return a+(b-a)*k}
function eio(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function eo(x){return 1-Math.pow(1-x,3)}
function eb(x){var c1=1.2,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)}
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function mix(h1,h2,k){var a=parseInt(h1.slice(1),16),b=parseInt(h2.slice(1),16);var r=Math.round(L(a>>16,b>>16,k)),g=Math.round(L((a>>8)&255,(b>>8)&255,k)),bl=Math.round(L(a&255,b&255,k));return '#'+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1);}
var GOLD='#D9A84E',IVORY='#F5EBD7',GL='#E8C77A';
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function noEmoji(s){return s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu,'').trim();}
function T(txt,x,y,o){o=o||{};return '<text x="'+x+'" y="'+y+'" text-anchor="'+(o.a||'middle')+'" font-family="'+(o.f||'Playfair Display')+'" font-weight="'+(o.w||400)+'"'+(o.it?' font-style="italic"':'')+' font-size="'+(o.s||40)+'" letter-spacing="'+(o.ls||0)+'" fill="'+(o.c||IVORY)+'" opacity="'+(o.op==null?1:o.op)+'"'+(o.tr?' transform="'+o.tr+'"':'')+(o.fl?' filter="'+o.fl+'"':'')+'>'+esc(txt)+'</text>';}
function fitSize(txt,maxW,maxS,ls){var w=0;for(var i=0;i<txt.length;i++){var ch=txt[i];w+=ch===' '?0.3:/[MW]/.test(ch)?0.92:/[IJ1]/.test(ch)?0.36:0.7;}return Math.min(maxS,maxW/(w+txt.length*(ls||0)/100));}
function img(href,cx,cy,h,op,rot,extra){if(op<=0)return '';return '<image href="fotos/'+href+'" x="'+(cx-h*0.6)+'" y="'+(cy-h/2)+'" width="'+(h*1.2)+'" height="'+h+'" preserveAspectRatio="xMidYMid meet" opacity="'+op+'" transform="rotate('+(rot||0)+' '+cx+' '+cy+')" '+(extra||'')+'/>';}
var UID=0;
// frasco: halo + reflejo en piso + barrido de luz
function bottle(href,cx,cy,h,op,rot,sweepT,halo){if(op<=0)return '';var id='m'+(UID++);var s='';var floor=cy+h/2;
  if(halo)s+='<ellipse cx="'+cx+'" cy="'+(cy-h*0.05)+'" rx="'+(h*0.62)+'" ry="'+(h*0.62)+'" fill="url(#halo)" opacity="'+(op*halo)+'"/>';
  s+='<g opacity="'+(0.3*op)+'" mask="url(#fadeR)"><g transform="translate(0,'+(2*floor)+') scale(1,-1)">'+img(href,cx,cy,h,1,-(rot||0))+'</g></g>';
  s+=img(href,cx,cy,h,op,rot,'filter="url(#soft)"');
  if(sweepT!=null&&sweepT>=0&&sweepT<=1){var sx=L(cx-h*0.9,cx+h*0.9,eio(sweepT));
    s+='<mask id="'+id+'" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><g filter="url(#wht)">'+img(href,cx,cy,h,1,rot)+'</g></mask><g mask="url(#'+id+')" style="mix-blend-mode:screen"><rect x="'+(sx-h*0.14)+'" y="'+(cy-h)+'" width="'+(h*0.28)+'" height="'+(h*2)+'" fill="url(#sweep)" transform="skewX(-18)" opacity="'+op+'"/></g>';}
  return s;}
function rule(x1,x2,y,op){return '<line x1="'+x1+'" x2="'+x2+'" y1="'+y+'" y2="'+y+'" stroke="url(#goldH)" stroke-width="2" opacity="'+op+'"/>';}
function diamond(x,y,r,op,c){return '<path d="M'+x+' '+(y-r)+' L '+(x+r)+' '+y+' L '+x+' '+(y+r)+' L '+(x-r)+' '+y+' Z" fill="'+(c||GOLD)+'" opacity="'+op+'"/>';}
// palabras que suben y aparecen
function words(txt,x,y,s,t,t0,dur,o){o=o||{};var W=txt.split(' ');var k0=eo(cl((t-t0)/0.6));var out='<text x="'+x+'" y="'+(y+(1-k0)*20)+'" text-anchor="middle" font-family="Playfair Display" font-style="italic" font-weight="400" font-size="'+s+'" fill="'+(o.c||IVORY)+'">';
  W.forEach(function(ww,i){var k=eo(cl((t-t0-i*dur/W.length)/0.5));out+='<tspan opacity="'+k+'">'+esc(ww)+(i<W.length-1?' ':'')+'</tspan>';});return out+'</text>';}
function wrap(txt,maxc){var W=txt.split(' '),lines=[''];W.forEach(function(w){if((lines[lines.length-1]+' '+w).trim().length>maxc)lines.push(w);else lines[lines.length-1]=(lines[lines.length-1]+' '+w).trim();});return lines;}
// título con revelado por máscara + brillo que lo recorre
function titleReveal(txt,x,y,fs,ls,t,t0,id){var k=eio(cl((t-t0)/0.9));var sh=((t-t0-0.6)*0.55)%2.2;
  var s='<clipPath id="tc'+id+'"><rect x="0" y="'+(y-fs)+'" width="'+(1080*k)+'" height="'+(fs*1.4)+'"/></clipPath>';
  s+='<g clip-path="url(#tc'+id+')"><text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Playfair Display" font-weight="500" font-size="'+fs+'" letter-spacing="'+ls+'" fill="url(#goldT)">'+esc(txt)+'</text>';
  s+='<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Playfair Display" font-weight="500" font-size="'+fs+'" letter-spacing="'+ls+'" fill="url(#shine)" style="mix-blend-mode:screen"><animate/></text></g>';
  // línea de luz que acompaña el revelado
  if(k<1)s+='<rect x="'+(1080*k-3)+'" y="'+(y-fs)+'" width="6" height="'+(fs*1.3)+'" fill="#FFF3CF" opacity="'+(1-k)+'" filter="url(#glow)"/>';
  return s.replace('fill="url(#shine)"','fill="url(#shine)" transform="translate(0,0)"').replace('<animate/>','')+shineDef(id,sh);}
function shineDef(id,sh){return '';}
// fondo cinemático: foto real desenfocada (Ken Burns) + gradación de color + haces de luz + bokeh + polvo dorado
function cine(bgImg,col,t,lt,amt){var s='<rect width="1080" height="1920" fill="#050505"/>';
  if(bgImg){var z=1+0.06*lt/12;s+='<image href="fotos/bg/'+bgImg+'.jpg" x="'+(540-650*z)+'" y="'+(960-1150*z)+'" width="'+(1300*z)+'" height="'+(2300*z)+'" preserveAspectRatio="xMidYMid slice" opacity="'+(0.55*amt)+'"/>';}
  s+='<rect width="1080" height="1920" fill="'+col+'" opacity=".42" style="mix-blend-mode:multiply"/>';
  s+='<rect width="1080" height="1920" fill="url(#vigD)"/>';
  // haces de luz que barren lento
  for(var i=0;i<4;i++){var a=-28+i*18+Math.sin(t*0.25+i*1.7)*7;s+='<g transform="rotate('+a+' 540 -120)"><rect x="'+(510-40*i)+'" y="-120" width="'+(70+i*30)+'" height="2400" fill="url(#beam)" opacity="'+(0.10+0.06*Math.sin(t*0.6+i))+'"/></g>';}
  for(var i=0;i<14;i++){var x=(hsh(i*3)*1180-50+Math.sin(t*0.15+i)*40),y=hsh(i*7)*1920+Math.cos(t*0.12+i)*50,r=30+hsh(i*5)*90;var c=i%3?GOLD:mix(col,'#ffffff',0.4);
    s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" opacity="'+(0.07+0.06*Math.sin(t*0.7+i))+'" filter="url(#blur)"/>';}
  for(var i=0;i<60;i++){var ph=((t*0.035*(0.5+hsh(i))+hsh(i*9))%1);var x=hsh(i*13)*1080+Math.sin(t*0.8+i)*12,y=1920-ph*1920;var tw=0.25+0.75*Math.abs(Math.sin(t*1.7+i*2.1));var r=1.2+hsh(i)*2.6;
    s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+GL+'" opacity="'+(0.8*tw)+'"'+(r>3?' filter="url(#glow2)"':'')+'/>';}
  return s;}
function spot(cx,top,bot,w,op){return '<path d="M'+(cx-60)+' '+top+' L '+(cx+60)+' '+top+' L '+(cx+w)+' '+bot+' L '+(cx-w)+' '+bot+' Z" fill="url(#cone)" opacity="'+op+'"/><ellipse cx="'+cx+'" cy="'+bot+'" rx="'+(w*0.95)+'" ry="'+(w*0.13)+'" fill="url(#pool)" opacity="'+op+'"/>';}
// destello anamórfico
function flare(x,y,k,w){if(k<=0)return '';return '<g opacity="'+k+'" style="mix-blend-mode:screen"><ellipse cx="'+x+'" cy="'+y+'" rx="'+(w||420)+'" ry="5" fill="url(#flareH)"/><circle cx="'+x+'" cy="'+y+'" r="26" fill="url(#halo)"/><circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff"/></g>';}
function frame(op){return '<g opacity="'+op+'"><rect x="34" y="34" width="1012" height="1852" fill="none" stroke="'+GOLD+'" stroke-width="1.5" opacity=".55"/><rect x="46" y="46" width="988" height="1828" fill="none" stroke="'+GOLD+'" stroke-width="1" opacity=".25"/>'+
  [[34,34,1,1],[1046,34,-1,1],[34,1886,1,-1],[1046,1886,-1,-1]].map(function(c){return '<path d="M'+c[0]+' '+(c[1]+c[3]*60)+' L '+c[0]+' '+c[1]+' L '+(c[0]+c[2]*60)+' '+c[1]+'" stroke="'+GL+'" stroke-width="3" fill="none"/>';}).join('')+'</g>';}
function header(op){return '<g opacity="'+op+'">'+rule(330,450,110,0.8)+rule(630,750,110,0.8)+T('CLUB DE NUIT',540,118,{f:'DM Sans',w:500,s:22,ls:9,c:GL})+'</g>';}
// nota con foto real en medallón dorado
function medal(note,label,x,y,r,k,dim){if(k<=0)return '';var id='n'+(UID++);var sc=eb(k);var ring=2*Math.PI*(r+6);
  var s='<g transform="translate('+x+','+y+') scale('+sc+')" opacity="'+(cl(k*1.6)*(dim||1))+'">';
  s+='<circle r="'+(r+16)+'" fill="url(#halo)" opacity=".5"/><clipPath id="'+id+'"><circle r="'+r+'"/></clipPath>';
  s+='<image href="fotos/notas/'+note+'.jpg" x="'+(-r)+'" y="'+(-r)+'" width="'+(2*r)+'" height="'+(2*r)+'" clip-path="url(#'+id+')" preserveAspectRatio="xMidYMid slice"/>';
  s+='<circle r="'+r+'" fill="url(#medShade)"/><circle r="'+(r+6)+'" fill="none" stroke="url(#goldT)" stroke-width="4" stroke-dasharray="'+ring+'" stroke-dashoffset="'+(ring*(1-cl(k*1.2)))+'"/>';
  s+='<text y="'+(r+44)+'" text-anchor="middle" font-family="DM Sans" font-weight="500" font-size="25" letter-spacing="3" fill="'+IVORY+'">'+esc(label.toUpperCase())+'</text></g>';return s;}
function lineup(t,cy,op,big){var arr=[];var spin=t*0.32;P.forEach(function(p,i){var a=spin+i*6.2832/P.length;var z=Math.cos(a);arr.push({p:p,x:540+Math.sin(a)*400,z:z,i:i});});arr.sort(function(a,b){return a.z-b.z;});
  var s='';arr.forEach(function(o){var sc=0.62+0.38*(o.z+1)/2;var h=(big||420)*sc;var y=cy+(1-sc)*-90;var d=0.35+0.65*(o.z+1)/2;s+='<g opacity="'+(op*d)+'">'+bottle(o.p.orb||o.p.cut,o.x,y,h,1,0,null,0)+'</g>';});return s;}
// barrido de luz dorado entre escenas
function wipe(k){if(k<=0||k>=1)return '';var x=L(-700,1780,k);return '<g style="mix-blend-mode:screen"><rect x="'+(x-260)+'" y="-200" width="520" height="2400" fill="url(#wipeG)" transform="skewX(-20)"/></g><rect width="1080" height="1920" fill="#FFF3D6" opacity="'+(0.18*Math.sin(k*Math.PI))+'"/>';}
var DEFS='<defs><linearGradient id="goldT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6D2"/><stop offset=".45" stop-color="#E9C26C"/><stop offset="1" stop-color="#A9772B"/></linearGradient>'+
 '<linearGradient id="goldH" x1="0" x2="1"><stop offset="0" stop-color="'+GOLD+'" stop-opacity="0"/><stop offset=".5" stop-color="#F3D58C"/><stop offset="1" stop-color="'+GOLD+'" stop-opacity="0"/></linearGradient>'+
 '<radialGradient id="vigD" cx=".5" cy=".45" r=".75"><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".9"/></radialGradient>'+
 '<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1CC" stop-opacity=".9"/><stop offset=".7" stop-color="#FFF1CC" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D6" stop-opacity=".28"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0.03"/></linearGradient>'+
 '<radialGradient id="pool"><stop offset="0" stop-color="#FFE9B8" stop-opacity=".45"/><stop offset="1" stop-color="#FFE9B8" stop-opacity="0"/></radialGradient>'+
 '<radialGradient id="halo"><stop offset="0" stop-color="#FFE7A8" stop-opacity=".55"/><stop offset=".5" stop-color="#E2B860" stop-opacity=".15"/><stop offset="1" stop-color="#E2B860" stop-opacity="0"/></radialGradient>'+
 '<radialGradient id="medShade" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>'+
 '<linearGradient id="flareH" x1="0" x2="1"><stop offset="0" stop-color="#FFD98A" stop-opacity="0"/><stop offset=".5" stop-color="#FFF6DD" stop-opacity=".95"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="sweep" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="wipeG" x1="0" x2="1"><stop offset="0" stop-color="#E9C26C" stop-opacity="0"/><stop offset=".5" stop-color="#FFF3CF" stop-opacity=".85"/><stop offset="1" stop-color="#E9C26C" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="fadeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#000"/></linearGradient>'+
 '<linearGradient id="shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
 '<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26"/></filter>'+
 '<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#000" flood-opacity=".6"/></filter>'+
 '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
 '<filter id="glow2" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
 '<filter id="wht"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>'+
 '<filter id="toGold"><feColorMatrix type="matrix" values="0 0 0 0 0.93  0 0 0 0 0.76  0 0 0 0 0.42  0 0 0 1 0"/></filter>'+
 '</defs>';
function fadeMask(y,h){return '<mask id="fadeR" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><rect x="0" y="'+y+'" width="1080" height="'+h+'" fill="url(#fadeG)"/></mask>';}
// texto con brillo que lo cruza (máscara del propio texto)
function shinyText(txt,x,y,fs,ls,w,op,t,speed,id){var s='<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Playfair Display" font-weight="'+(w||500)+'" font-size="'+fs+'" letter-spacing="'+ls+'" fill="url(#goldT)" opacity="'+op+'">'+esc(txt)+'</text>';
  var ph=((t*(speed||0.35))%1.6);var sx=L(-300,1380,ph/1.2);
  s+='<mask id="st'+id+'" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Playfair Display" font-weight="'+(w||500)+'" font-size="'+fs+'" letter-spacing="'+ls+'" fill="#fff">'+esc(txt)+'</text></mask><g mask="url(#st'+id+')" opacity="'+op+'"><rect x="'+(sx-60)+'" y="'+(y-fs)+'" width="120" height="'+(fs*1.4)+'" fill="url(#sweep)" transform="skewX(-20)"/></g>';return s;}
function render(t){UID=0;var out=DEFS;var floorY=1300;
  // ── INTRO
  if(t<C.p1){var k=cl(t/0.8);var sweet=C.h4?cl((t-C.h4)/0.8):0;
    out+=cine(sweet>0?'cuero':'ambar','#5A3A0A',t,t,1);
    out+=fadeMask(1190,260)+spot(540,0,1190,520,0.9*k);
    var lk=eo(cl((t-0.2)/1.4));var lsx=L(-200,1280,cl((t-1.2)/1.6));
    out+='<g opacity="'+lk+'"><ellipse cx="540" cy="700" rx="300" ry="300" fill="url(#halo)"/><image href="fotos/logo_armaf_hd.png" x="330" y="490" width="420" height="420" filter="url(#toGold)"/>'+
      '<mask id="lgm" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><image href="fotos/logo_armaf_hd.png" x="330" y="490" width="420" height="420" filter="url(#wht)"/></mask><g mask="url(#lgm)"><rect x="'+(lsx-50)+'" y="460" width="100" height="480" fill="url(#sweep)" transform="skewX(-20)"/></g></g>';
    out+=flare(540,700,cl((t-1.4)/0.4)*(1-cl((t-2.2)/0.8)),520);
    out+=lineup(t,1000,eo(cl((t-0.4)/1.2)),400)+'<line x1="80" x2="1000" y1="1190" y2="1190" stroke="url(#goldH)" stroke-width="1.5" opacity=".7"/>';
    var tk=eo(cl((t-0.1)/1.6));
    out+=shinyText('CLUB DE NUIT',540,330,118,L(40,14,tk),500,tk,t,0.4,'t');
    out+=rule(L(540,300,tk),L(540,780,tk),380,tk)+T('BY ARMAF',540,430,{f:'DM Sans',w:400,s:24,ls:12,c:GL,op:tk});
    var yB=1420;
    if(t>=C.h2&&t<C.h3){out+=T('LA SERIE QUE HIZO FAMOSA',540,yB,{f:'DM Sans',w:300,s:40,ls:8,op:eo(cl((t-C.h2)/0.6))})+words('a Armaf en todo el mundo',540,yB+80,64,t,C.h2+0.5,1.2,{c:GL});}
    if(t>=C.h3&&t<C.h4){out+=T('TE LA EXPLICO',540,yB,{f:'DM Sans',w:300,s:40,ls:8,op:eo(cl((t-C.h3)/0.6))})+words('perfume por perfume',540,yB+80,64,t,C.h3+0.4,1.0,{c:GL});}
    if(t>=C.h4){var a=eo(cl((t-C.h4)/0.7));out+=rule(L(540,240,a),L(540,840,a),yB-70,a)+T('PARTE '+PARTE.num,540,yB,{f:'DM Sans',w:500,s:34,ls:14,c:GL,op:a})+shinyText(PARTE.titulo,540,yB+92,fitSize(PARTE.titulo,900,74,6),6,500,eo(cl((t-C.h4-0.3)/0.7)),t,0.5,'p')+rule(L(540,240,a),L(540,840,a),yB+140,a);out+=wipe(cl((t-C.h4)/0.9));}
    out+=frame(k);
  }
  // ── PERFUMES
  P.forEach(function(p,idx){var t0=C[p.k],t1=C[p.end];if(t<t0-0.05||t>=t1)return;var lt=t-t0;
    var col=mix(p.bg,'#000000',0.05);var hero=HERO[idx]||p.N[0][0];
    out+=cine(hero,col,t,lt,1)+fadeMask(floorY,330);
    var fin=eo(cl(lt/0.6));var insT=p.i?C[p.i]:1e9;var inK=p.ins?eio(cl((t-insT)/0.8)):0;
    var bx=L(540,320,inK),bh=L(700,560,inK);var by=floorY-bh/2+Math.sin(t*1.1)*6;
    out+=spot(bx,0,floorY,L(330,260,inK),fin);if(inK>0)out+=spot(L(1200,770,inK),0,floorY,260,inK*0.9);
    out+='<line x1="70" x2="1010" y1="'+floorY+'" y2="'+floorY+'" stroke="url(#goldH)" stroke-width="1.5" opacity="'+(0.6*fin)+'"/>';
    out+=header(fin);
    out+=T('N° '+('0'+(idx+1)).slice(-2)+' / '+('0'+P.length).slice(-2),540,205,{f:'DM Sans',w:400,s:22,ls:8,c:GL,op:eo(cl((lt-0.1)/0.5))});
    var nk=cl((lt-0.15)/0.9);var nfs=fitSize(p.name,940,92,4);
    out+='<clipPath id="nmc"><rect x="0" y="200" width="'+(1080*eio(nk))+'" height="160"/></clipPath><g clip-path="url(#nmc)">'+shinyText(p.name,540,312,nfs,4,500,1,t,0.3,'n')+'</g>';
    if(nk<1)out+='<rect x="'+(1080*eio(nk)-3)+'" y="220" width="6" height="120" fill="#FFF3CF" opacity="'+(1-nk)+'" filter="url(#glow)"/>';
    var sk=eo(cl((lt-0.5)/0.6));out+=rule(L(540,250,sk),390,364,sk)+rule(690,L(540,830,sk),364,sk)+T(p.sub,540,372,{f:'DM Sans',w:400,s:20,ls:6,c:GL,op:sk});
    // frase poética
    if(C[p.q]!=null&&t>=C[p.q]){wrap(p.quote,30).forEach(function(l,j){out+=words(l,540,470+j*62,48,t,C[p.q]+j*0.7,1.3,{});});}
    // notas: medallones con foto real orbitando (las de atrás, detrás del frasco)
    var nk2=C[p.n]!=null?(t-C[p.n]):-1;var fade=1-inK;var back='',front='';
    if(nk2>0&&fade>0.01){p.N.forEach(function(n_,j){var kj=eo(cl((nk2-j*0.25)/0.8));if(kj<=0)return;var a=-Math.PI/2+j*6.2832/p.N.length+t*0.18;var R=L(0.3,1,kj);
        var x=540+Math.cos(a)*410*R,y=930+Math.sin(a)*290*R;var z=Math.sin(a);var dim=0.5+0.5*(z+1)/2;var r=L(60,76,(z+1)/2);
        var m=medal(n_[0],n_[1],x,y,r,kj,dim*fade);if(z<0)back+=m;else front+=m;});}
    out+=back;
    var ek=eo(cl((lt-0.05)/0.9));out+=bottle(p.cut,bx,by+(1-ek)*70,bh*L(0.9,1,ek),ek,Math.sin(t*0.9)*1.2,(lt-0.9)/1.1,0.9);
    out+=flare(bx+bh*0.22,by-bh*0.36,cl((lt-1.6)/0.3)*(1-cl((lt-2.1)/0.6)),360);
    out+=front;
    // acordes: barras con brillo que corre
    var ak=C[p.n]!=null?(t-C[p.n]-1.6):-1;
    if(ak>0&&fade>0.01){p.A.forEach(function(a,j){var kk=eo(cl((ak-j*0.2)/0.8));if(kk<=0)return;var x=110+j*225,y=1410,w=190;var fw=w*a[1]/100*kk;var shx=x+((t*0.6+j*0.3)%1.4)/1.4*fw;
        out+='<g opacity="'+(kk*fade)+'">'+T(a[0].toUpperCase(),x,y,{a:'start',f:'DM Sans',w:500,s:a[0].length>12?19:23,ls:2,c:'rgba(245,235,215,.9)'})+'<rect x="'+x+'" y="'+(y+16)+'" width="'+w+'" height="4" fill="rgba(245,235,215,.14)"/><rect x="'+x+'" y="'+(y+16)+'" width="'+fw+'" height="4" fill="url(#goldT)"/><rect x="'+(shx-14)+'" y="'+(y+12)+'" width="28" height="12" fill="url(#sweep)" opacity=".9"/>'+T(Math.round(a[1]*kk)+'%',x,y+72,{a:'start',s:46,c:GL})+'</g>';});}
    // etiqueta marketinera: marco dorado que se dibuja
    if(p.mc&&C[p.mc]!=null&&t>=C[p.mc]){var mk=cl((t-C[p.mc])/0.8);var txt=noEmoji(p.mk[0]+' '+p.mk[1]).toUpperCase();var wdt=txt.length*20+110;var my=604;var per=2*(wdt+62);
      out+='<g><rect x="'+(540-wdt/2)+'" y="'+(my-36)+'" width="'+wdt+'" height="62" fill="rgba(8,6,4,'+(0.6*mk)+')" stroke="url(#goldT)" stroke-width="2" stroke-dasharray="'+per+'" stroke-dashoffset="'+(per*(1-eo(mk)))+'"/>'+diamond(540-wdt/2,my-5,8,mk)+diamond(540+wdt/2,my-5,8,mk)+T(txt,540,my+6,{f:'DM Sans',w:500,s:30,ls:L(14,5,eo(mk)),c:GL,op:cl((mk-0.3)/0.5)})+'</g>';}
    // inspiración
    if(inK>0){var ox=L(1200,770,inK);var ik=t-insT;
      if(p.ins)out+=bottle(p.ins.img,ox,floorY-230+Math.sin(t*1.1+1)*6,460,inK,Math.sin(t*0.8+1)*1.2,(ik-0.7)/1.1,0.7);
      var vk=eo(cl((ik-0.4)/0.5));out+='<g opacity="'+vk+'" transform="translate(545,'+(floorY-270)+') scale('+L(1.6,1,vk)+')">'+T('vs',0,22,{it:1,s:84,c:GL,fl:'url(#glow)'})+'</g>'+flare(545,floorY-292,cl((ik-0.4)/0.25)*(1-cl((ik-0.8)/0.6)),300);
      var bk=eo(cl((ik-0.5)/0.7));
      out+='<g opacity="'+bk+'">'+rule(L(540,160,bk),L(540,920,bk),1352,1)+T('INSPIRADO EN',540,1405,{f:'DM Sans',w:400,s:22,ls:10,c:GL})+T(p.ins.n,540,1478,{w:500,s:p.ins.n.length>18?50:62,c:IVORY});
      var brand=p.ins.mt?p.ins.mt.replace('|',' '):'';
      if(p.ins.m)out+='<image href="fotos/'+p.ins.m+'" x="390" y="1500" width="300" height="70" preserveAspectRatio="xMidYMid meet" style="filter:invert(1) sepia(1) saturate(1.6) brightness(1.05)"/>';
      else out+=T(brand,540,1542,{f:'DM Sans',w:400,s:26,ls:10,c:'rgba(245,235,215,.8)'});
      out+=rule(L(540,160,bk),L(540,920,bk),1580,1)+'</g>';}
    else if(!p.ins&&p.i&&t>=C[p.i]){var sk2=eo(cl((t-C[p.i])/0.7));out+='<g opacity="'+sk2+'">'+rule(160,920,1352,1)+shinyText('COMPOSICIÓN PROPIA',540,1430,56,2,500,1,t,0.5,'cp')+T('ADN 100% ARMAF',540,1490,{f:'DM Sans',w:400,s:24,ls:10,c:GL})+rule(160,920,1540,1)+'</g>';}
    out+=wipe(cl(lt/0.9));
    out+=frame(fin);
  });
  // ── OUTRO
  if(t>=C.out&&t<C.end){var ok=eo(cl((t-C.out)/0.8));out+=cine('ambar','#5A3A0A',t,t-C.out,1);
    out+=fadeMask(1230,260)+spot(540,0,1240,520,ok)+lineup(t,1040,ok,440)+'<line x1="80" x2="1000" y1="1240" y2="1240" stroke="url(#goldH)" stroke-width="1.5" opacity=".7"/>';
    out+=words('¿Cuál es tu',540,360,70,t,C.out,0.5,{})+shinyText('CLUB DE NUIT?',540,480,104,L(30,8,ok),500,eo(cl((t-C.out-0.3)/0.8)),t,0.4,'o');
    var pill=function(txt,k){var w=txt.length*18+120;var per=2*(w+70);return '<g><rect x="'+(540-w/2)+'" y="1376" width="'+w+'" height="70" fill="rgba(8,6,4,'+(0.6*k)+')" stroke="url(#goldT)" stroke-width="2" stroke-dasharray="'+per+'" stroke-dashoffset="'+(per*(1-k))+'"/>'+T(txt,540,1422,{f:'DM Sans',w:500,s:28,ls:6,c:GL,op:cl((k-0.3)/0.5)})+'</g>';};
    if(C.fol!=null&&t>=C.fol)out+=pill('SEGUINOS · SE VIENEN MÁS SERIES',eo(cl((t-C.fol)/0.8)));
    else if(PARTE.nxt&&C.out2!=null&&t>=C.out2)out+=pill(PARTE.nxt,eo(cl((t-C.out2)/0.8)));
    out+=wipe(cl((t-C.out)/0.9))+frame(ok);
  }
  document.getElementById('sv').innerHTML=out;
  renderSubs(t);
  var E=document.getElementById('end');var eOn=t>=C.end;E.style.display=eOn?'block':'none';
  if(eOn){var k=eo(cl((t-C.end)/0.6));E.style.opacity=k;['eA','eB','eC','eD'].forEach(function(id,i){var kk=eo(cl((t-C.end-0.2-i*0.3)/0.7));var e=document.getElementById(id);e.style.transform='translateY('+((1-kk)*30)+'px)';e.style.opacity=kk;});}
}
var subLine=-1;
function renderSubs(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t>=C.end||t<C.p1){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(club|nuit|intense|aventus|creed|million|armaf|extrait|overdose|précieux|parfum|man)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:;…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
