// 6 estilos de dibujo animado, construcciones distintas. Cada función devuelve SVG en una caja 500×720.
var K='#1a1a1a';
function p(d,f,sw,st){return '<path d="'+d+'" fill="'+(f||'none')+'" stroke="'+(st||K)+'" stroke-width="'+(sw==null?7:sw)+'" stroke-linecap="round" stroke-linejoin="round"/>';}
function c(x,y,r,f,sw,st){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(f||'none')+'" stroke="'+(st||K)+'" stroke-width="'+(sw==null?7:sw)+'"/>';}
function e(x,y,rx,ry,f,sw,st,ex){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+(f||'none')+'" stroke="'+(st||K)+'" stroke-width="'+(sw==null?7:sw)+'"'+(ex||'')+'/>';}
// brazo "fideo" (manguera): contorno negro + relleno, curva suave
function noodle(d,col,w){return p(d,'none',w+12,K)+p(d,'none',w,col);}

// ── 1 · FRIJOLITO: cuerpo y cabeza en una sola forma de poroto, ojos altos, brazos fideo, manos mitón
function frijol(G,o){var s='';var M=G==='m';
  if(M)s+=p('M120 250 C 90 360 100 470 140 520 L 360 520 C 400 470 410 360 380 250 Z',o.hair,7); // pelo largo atrás
  s+=noodle('M150 470 C 90 520 80 600 120 640',o.skin,34)+c(122,650,28,o.skin);
  s+=noodle('M350 470 C 410 520 420 600 380 640',o.skin,34)+c(378,650,28,o.skin);
  s+=p('M250 120 C 360 120 400 220 400 330 C 400 470 380 640 250 660 C 120 640 100 470 100 330 C 100 220 140 120 250 120 Z',o.skin);   // poroto
  s+=p('M106 450 C 160 480 340 480 394 450 C 392 560 370 650 250 660 C 130 650 108 560 106 450 Z',o.top);  // ropa = parte de abajo del poroto
  s+=e(205,290,24,34,'#fff',6)+e(295,290,24,34,'#fff',6)+e(210,298,13,20,K,0)+e(290,298,13,20,K,0)+c(205,288,5,'#fff',0)+c(285,288,5,'#fff',0);
  if(M)s+=p('M178 256 L 168 244 M190 250 L 184 236 M322 256 L 332 244 M310 250 L 316 236',null,5);
  s+=p('M215 360 C 230 384 270 384 285 360',null,7)+e(170,345,20,12,'#FF8FA0',0,null,' opacity=".7"')+e(330,345,20,12,'#FF8FA0',0,null,' opacity=".7"');
  if(M)s+=p('M110 300 C 100 170 170 100 250 100 C 340 100 400 170 392 300 C 360 230 300 200 250 210 C 200 200 140 230 110 300 Z',o.hair);
  else s+=p('M150 190 C 170 120 230 96 250 112 C 260 80 300 80 320 104 C 360 110 370 160 352 196 C 320 170 280 168 250 176 C 220 168 180 172 150 190 Z',o.hair);
  return s;}

// ── 2 · CABEZÓN: cabeza gigante, cuerpito chico, extremidades finitas
function cabezon(G,o){var s='';var M=G==='m';
  s+=noodle('M210 560 C 170 580 150 620 160 660',o.skin,18)+c(160,668,16,o.skin,6);
  s+=noodle('M290 560 C 330 580 350 620 340 660',o.skin,18)+c(340,668,16,o.skin,6);
  s+=p('M200 530 L 300 530 L 320 690 L 180 690 Z',o.top);
  s+=p('M236 500 L 264 500 L 264 540 L 236 540 Z',o.skin,6);
  if(M)s+=p('M80 300 C 60 440 80 520 130 560 L 370 560 C 420 520 440 440 420 300 Z',o.hair);
  s+=c(250,320,190,o.skin);
  s+=c(180,330,14,K,0)+c(320,330,14,K,0)+c(175,325,4,'#fff',0)+c(315,325,4,'#fff',0);
  s+=p('M200 400 C 230 440 270 440 300 400 Z','#fff',7)+e(150,385,26,14,'#FF8FA0',0,null,' opacity=".6"')+e(350,385,26,14,'#FF8FA0',0,null,' opacity=".6"');
  s+=p('M246 352 C 250 362 256 362 258 356',null,5);
  if(M)s+=p('M64 320 C 50 160 150 110 250 110 C 360 110 452 170 436 320 C 420 260 380 220 330 210 C 300 250 200 250 150 220 C 100 240 76 280 64 320 Z',o.hair);
  else s+=p('M78 290 C 70 170 160 120 250 120 C 350 120 430 170 422 290 C 400 240 360 210 320 206 C 290 180 240 180 200 196 C 150 196 100 230 78 290 Z',o.hair);
  return s;}

// ── 3 · PLANO MODERNO SIN CONTORNO (formas suaves, caras mínimas)
function plano(G,o){var s='';var M=G==='m';function f(d,col){return '<path d="'+d+'" fill="'+col+'"/>';}
  if(M)s+=f('M150 220 C 130 320 140 440 170 500 L 330 500 C 360 440 370 320 350 220 Z',o.hair);
  s+=f('M110 720 C 110 560 170 470 250 470 C 330 470 390 560 390 720 Z',o.top);
  s+=f('M228 400 L 272 400 L 272 480 C 260 490 240 490 228 480 Z',o.skinDk);
  s+=f('M250 160 C 330 160 360 230 356 300 C 352 380 310 430 250 430 C 190 430 148 380 144 300 C 140 230 170 160 250 160 Z',o.skin);
  s+='<path d="M200 300 C 210 290 222 290 232 300 M268 300 C 278 290 290 290 300 300" stroke="'+K+'" stroke-width="7" fill="none" stroke-linecap="round"/>';
  s+='<path d="M222 352 C 236 368 264 368 278 352" stroke="'+K+'" stroke-width="7" fill="none" stroke-linecap="round"/>';
  s+=f('M180 340 a 18 11 0 1 0 0.1 0 Z','#FF8FA0')+f('M320 340 a 18 11 0 1 0 0.1 0 Z','#FF8FA0');
  if(M)s+=f('M140 290 C 130 180 190 140 260 140 C 340 140 380 200 360 290 C 340 220 300 200 260 196 C 220 230 170 240 140 290 Z',o.hair);
  else s+=f('M150 260 C 146 180 200 140 260 144 C 320 148 362 190 350 262 C 330 220 296 204 256 204 C 210 204 174 222 150 260 Z',o.hair);
  s+=f('M150 720 C 150 640 160 590 180 560 L 210 580 C 196 620 192 670 196 720 Z',o.topDk)+f('M350 720 C 350 640 340 590 320 560 L 290 580 C 304 620 308 670 304 720 Z',o.topDk);
  return s;}

// ── 4 · RETRO "MANGUERA" (años 30): ojos de pastel, guantes blancos, contorno grueso
function retro(G,o){var s='';var M=G==='m';
  s+=noodle('M170 470 C 100 470 80 540 110 590',o.skin,26)+'<g>'+c(110,610,34,'#fff',8)+p('M90 600 L 130 600 M90 615 L 130 615',null,5)+'</g>';
  s+=noodle('M330 470 C 400 470 420 540 390 590',o.skin,26)+c(390,610,34,'#fff',8)+p('M370 600 L 410 600 M370 615 L 410 615',null,5);
  s+=p('M170 440 C 160 520 170 620 200 690 L 300 690 C 330 620 340 520 330 440 Z',o.top,8);
  s+=p('M180 690 L 320 690',null,8);
  if(M){s+=c(150,190,48,o.hair,8)+c(350,190,48,o.hair,8);}
  s+=c(250,290,150,o.skin,8);
  // ojos de pastel
  [205,295].forEach(function(x){s+=e(x,270,28,44,'#fff',7)+e(x+4,282,16,28,K,0)+'<path d="M'+(x+4)+' 282 L '+(x+18)+' 268 L '+(x+20)+' 288 Z" fill="#fff"/>';});
  s+=e(250,330,16,12,K,0)+p('M170 360 C 200 420 300 420 330 360 C 300 380 200 380 170 360 Z','#7A2633',7)+e(250,394,30,10,'#E8737E',0);
  s+=c(160,350,18,'#FF8FA0',0)+c(340,350,18,'#FF8FA0',0);
  if(M)s+=p('M110 250 C 110 150 180 120 250 120 C 320 120 390 150 390 250 C 360 200 320 180 290 180 L 250 210 L 210 180 C 180 180 140 200 110 250 Z',o.hair,8);
  else s+=p('M150 180 C 180 120 230 112 250 120 C 270 112 320 120 350 180 C 320 170 290 172 270 180 L 250 160 L 230 180 C 210 172 180 170 150 180 Z',o.hair,8);
  return s;}

// ── 5 · ANIME CHIBI: ojos enormes con brillos, boca chiquita, mechones en punta
function anime(G,o){var s='';var M=G==='m';
  if(M)s+=p('M90 260 C 70 400 90 520 130 600 L 200 560 L 250 610 L 300 560 L 370 600 C 410 520 430 400 410 260 Z',o.hair,6);
  s+=noodle('M200 560 C 170 600 160 640 170 680',o.skin,22)+c(170,688,18,o.skin,6);
  s+=noodle('M300 560 C 330 600 340 640 330 680',o.skin,22)+c(330,688,18,o.skin,6);
  s+=p('M190 530 C 180 600 180 660 196 720 L 304 720 C 320 660 320 600 310 530 Z',o.top,6)+p('M220 530 L 250 580 L 280 530',o.top2||'#fff',5);
  s+=p('M236 500 L 264 500 L 264 540 L 236 540 Z',o.skin,5);
  s+=p('M250 140 C 360 140 410 220 410 320 C 410 420 340 510 250 520 C 160 510 90 420 90 320 C 90 220 140 140 250 140 Z',o.skin,6);
  [190,310].forEach(function(x,i){s+=e(x,350,40,52,'#fff',6)+e(x,358,32,44,o.iris||'#6B4A2E',0)+e(x,368,20,30,K,0)+e(x-12,336,12,16,'#fff',0)+c(x+14,380,6,'#fff',0)+p('M'+(x-44)+' 316 C '+(x-20)+' 290 '+(x+20)+' 290 '+(x+44)+' 316',null,9);
    if(M)s+=p('M'+(i?x+40:x-40)+' 318 L '+(i?x+56:x-56)+' 300',null,6);});
  s+=p('M238 440 C 244 448 256 448 262 440',null,6)+e(130,420,24,12,'#FF8FA0',0,null,' opacity=".7"')+e(370,420,24,12,'#FF8FA0',0,null,' opacity=".7"');
  if(M)s+=p('M84 330 C 70 180 160 110 260 116 C 360 120 432 190 416 330 L 380 260 L 360 310 L 330 240 L 300 300 L 260 230 L 220 300 L 190 240 L 160 310 L 140 260 Z',o.hair,6);
  else s+=p('M92 300 C 80 180 170 110 260 110 C 360 110 426 180 410 300 L 370 236 L 350 290 L 310 220 L 280 280 L 250 210 L 220 280 L 190 222 L 150 290 L 130 240 Z',o.hair,6);
  return s;}

// ── 6 · GARABATO MARCADOR: trazo grueso irregular, relleno blanco y manchas de color corridas
function garabato(G,o){var s='';var M=G==='m';function w(d,fill){return '<path d="'+d+'" fill="'+(fill||'none')+'" stroke="'+K+'" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" filter="url(#wob)"/>';}
  s+='<path d="M140 520 C 200 500 300 500 360 520 L 380 720 L 120 720 Z" fill="'+o.top+'" transform="translate(14,-10)" opacity=".9"/>';
  s+=w('M140 520 C 200 500 300 500 360 520 L 380 720 M120 720 L 140 520');
  s+=w('M150 540 C 110 600 110 650 130 700')+w('M350 540 C 390 600 390 650 370 700');
  s+='<circle cx="262" cy="300" r="150" fill="'+o.skin+'" opacity=".85"/>'+w('M250 140 C 350 136 400 210 402 300 C 404 400 340 460 250 462 C 160 460 98 400 98 300 C 100 210 150 144 250 140 Z','#fff');
  s+='<circle cx="262" cy="300" r="150" fill="'+o.skin+'" opacity=".55"/>';
  s+=w('M200 290 L 200 310 M300 290 L 300 310')+w('M200 370 C 230 400 270 400 300 370')+'<ellipse cx="160" cy="350" rx="22" ry="12" fill="#FF6F8A" opacity=".6"/><ellipse cx="340" cy="350" rx="22" ry="12" fill="#FF6F8A" opacity=".6"/>';
  if(M)s+='<path d="M100 300 C 80 180 160 110 260 120 C 360 130 420 200 400 300 C 390 400 410 470 420 520 C 390 500 360 480 350 420 C 360 330 340 250 300 220 C 240 260 160 270 110 300 Z" fill="'+o.hair+'" transform="translate(10,6)" opacity=".9"/>'+w('M100 300 C 80 180 160 110 260 120 C 360 130 420 200 400 300 C 390 400 410 470 420 520');
  else s+='<path d="M120 230 C 150 140 260 110 340 150 C 380 170 400 210 396 250 C 340 210 260 200 200 214 C 160 222 130 236 120 230 Z" fill="'+o.hair+'" transform="translate(10,6)" opacity=".9"/>'+w('M120 230 C 150 140 260 110 340 150 C 380 170 400 210 396 250');
  return s;}
var ESTILOS=[['Frijolito',frijol],['Cabezón',cabezon],['Plano moderno',plano],['Retro manguera',retro],['Anime chibi',anime],['Garabato marcador',garabato]];
