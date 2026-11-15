// Pera con manga larga + 12 prendas. El color de la ropa queda SIEMPRE debajo de la línea del escote.
var NECK='M0 452 C 160 500 340 500 500 452 L 500 800 L 0 800 Z';
function inCloth(inner){return clipG(BODY,clipG(NECK,inner));}
function stripes(col,y0,step,h){var s='';for(var y=y0;y<760;y+=step)s+='<rect x="0" y="'+y+'" width="500" height="'+h+'" fill="'+col+'"/>';return s;}
function dots(col){var s='';for(var y=480;y<720;y+=46)for(var x=(y/46%2?60:83);x<460;x+=46)s+='<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+col+'"/>';return s;}
// cada prenda: base (color), detalles dentro del cuerpo, y color de manga
var ROPA=[
 ['Remera lisa',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/>',ov:''};}],
 ['Rayada',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/>'+stripes(o.c2,500,52,24),ov:''};}],
 ['Vestido con cinturón',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/><rect x="0" y="560" width="500" height="30" fill="'+o.c2+'"/><rect x="230" y="556" width="40" height="38" rx="6" fill="#FFD23F" stroke="#1a1a1a" stroke-width="5"/>',ov:'<path d="M0 560 L 500 560 M0 590 L 500 590" stroke="#1a1a1a" stroke-width="5"/>'};}],
 ['Camisa con botones',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/><path d="M212 470 L 250 520 L 288 470 L 270 462 L 250 490 L 230 462 Z" fill="#fff" stroke="#1a1a1a" stroke-width="5"/>'+[540,590,640].map(function(y){return '<circle cx="250" cy="'+y+'" r="7" fill="#fff" stroke="#1a1a1a" stroke-width="3"/>';}).join('')+'<path d="M250 520 L 250 700" stroke="#1a1a1a" stroke-width="4"/>',ov:''};}],
 ['Jardinero',function(o){return {sl:o.c2,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c2+'"/><path d="M170 520 L 330 520 L 340 800 L 160 800 Z" fill="'+o.c1+'" stroke="#1a1a1a" stroke-width="5"/><rect x="0" y="600" width="500" height="200" fill="'+o.c1+'"/><path d="M0 600 L 500 600" stroke="#1a1a1a" stroke-width="5"/><path d="M180 520 L 150 460 M320 520 L 350 460" stroke="'+o.c1+'" stroke-width="22"/><circle cx="186" cy="534" r="8" fill="#FFD23F" stroke="#1a1a1a" stroke-width="3"/><circle cx="314" cy="534" r="8" fill="#FFD23F" stroke="#1a1a1a" stroke-width="3"/><rect x="220" y="540" width="60" height="40" rx="6" fill="none" stroke="#1a1a1a" stroke-width="4"/>',ov:''};}],
 ['Buzo con capucha',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/><path d="M200 470 L 196 560 M300 470 L 304 560" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="196" cy="566" r="8" fill="#fff"/><circle cx="304" cy="566" r="8" fill="#fff"/><path d="M170 620 L 330 620 L 340 690 L 160 690 Z" fill="'+o.c2+'" stroke="#1a1a1a" stroke-width="5"/>',ov:'<path d="M0 452 C 160 500 340 500 500 452 L 500 478 C 340 528 160 528 0 478 Z" fill="'+o.c2+'" stroke="#1a1a1a" stroke-width="5"/>'};}],
 ['Campera abierta',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/><path d="M200 460 L 300 460 L 290 800 L 210 800 Z" fill="'+o.c2+'"/><path d="M200 460 L 210 800 M300 460 L 290 800" stroke="#1a1a1a" stroke-width="5"/><path d="M200 460 L 170 530 L 210 560 M300 460 L 330 530 L 290 560" fill="none" stroke="#1a1a1a" stroke-width="5"/>',ov:''};}],
 ['Lunares',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/>'+dots(o.c2),ov:''};}],
 ['Suéter con guarda',function(o){var z='';for(var x=0;x<500;x+=40)z+='<path d="M'+x+' 560 L '+(x+20)+' 540 L '+(x+40)+' 560 L '+(x+20)+' 580 Z" fill="'+o.c2+'"/>';return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/><rect x="0" y="530" width="500" height="60" fill="#fff"/>'+z+'<rect x="0" y="640" width="500" height="200" fill="'+o.c1+'"/>'+stripes('rgba(0,0,0,.08)',620,14,5),ov:''};}],
 ['Blusa con volado',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/>',ov:'<path d="M150 470 C 170 500 190 500 200 480 C 210 504 230 504 240 484 C 250 506 270 506 280 484 C 290 504 310 504 320 480 C 330 500 350 500 360 470" fill="'+o.c2+'" stroke="#1a1a1a" stroke-width="5"/>'};}],
 ['Chaleco sobre camisa',function(o){return {sl:'#FFFFFF',in:'<rect x="0" y="0" width="500" height="800" fill="#fff"/><path d="M0 460 L 220 460 L 250 600 L 220 800 L 0 800 Z M500 460 L 280 460 L 250 600 L 280 800 L 500 800 Z" fill="'+o.c1+'" stroke="#1a1a1a" stroke-width="5"/><circle cx="236" cy="640" r="6" fill="#1a1a1a"/><circle cx="236" cy="690" r="6" fill="#1a1a1a"/><path d="M234 468 L 250 500 L 266 468" fill="none" stroke="'+o.c2+'" stroke-width="10"/>',ov:''};}],
 ['Deportiva',function(o){return {sl:o.c1,in:'<rect x="0" y="0" width="500" height="800" fill="'+o.c1+'"/><rect x="130" y="440" width="24" height="400" fill="#fff"/><rect x="346" y="440" width="24" height="400" fill="#fff"/><rect x="0" y="0" width="500" height="800" fill="none"/><text x="250" y="610" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="70" fill="#fff" stroke="#1a1a1a" stroke-width="4">B</text>',ov:''};}]
];
function peraRopa(G,o,k){var M=G==='m',s='';var R=ROPA[k][1](o);var sl=R.sl;
  s+=e(180,690,52,22,K,0)+e(320,690,52,22,K,0);
  if(M)s+=p('M148 220 C 108 300 118 384 150 424 L 350 424 C 382 384 392 300 352 220 Z',o.hair);
  s+=noodle('M132 478 C 86 500 60 540 56 590',sl,40)+noodle('M368 478 C 420 476 446 448 436 410',sl,40);
  s+=p(BODY,o.skin)+shadeR(BODY,K,320);
  s+=inCloth(R.in+'<rect x="320" y="0" width="300" height="800" fill="#000" opacity=".18"/>');
  s+=clipG(BODY,'<path d="M0 452 C 160 500 340 500 500 452" fill="none" stroke="'+K+'" stroke-width="7"/>')+p(BODY,'none');
  s+=clipG(BODY,R.ov);
  s+=eyes2(218,282,272,13,16,o.iris)+p('M200 248 C 210 242 224 242 232 246 M268 246 C 276 242 290 242 300 248',null,5);
  s+=p('M246 296 C 248 302 254 302 256 298',null,4)+p('M228 318 C 240 334 260 334 272 318 C 260 324 240 324 228 318 Z','#7A2633',5)+e(192,302,15,9,'#FF8FA0',0,null,' opacity=".7"')+e(308,302,15,9,'#FF8FA0',0,null,' opacity=".7"');
  s+=M?p('M148 262 C 144 170 198 128 250 128 C 302 128 356 170 352 262 C 332 212 292 196 250 200 C 208 196 168 212 148 262 Z',o.hair)+hiL('M200 148 C 230 136 270 136 300 148',o.hairLt):p('M188 162 C 208 120 250 110 270 130 C 290 110 322 130 312 162 C 292 152 270 152 250 158 C 230 152 204 154 188 162 Z',o.hair);
  s+=p('M34 588 L 78 594',null,7)+c(56,616,22,o.skin)+frasco(436,350)+p('M414 418 L 458 412',null,7)+c(436,398,22,o.skin);
  return s;}
