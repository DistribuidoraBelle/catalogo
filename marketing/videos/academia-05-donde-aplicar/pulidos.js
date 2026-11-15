// Versiones pulidas de los 7 estilos elegidos. Caja 500×720. Usa p,c,e,noodle,K de estilos.js
var UIDp=0;
function clipG(d,inner){var id='cl'+(UIDp++);return '<clipPath id="'+id+'"><path d="'+d+'"/></clipPath><g clip-path="url(#'+id+')">'+inner+'</g>';}
function shadeR(d,col,x0){return clipG(d,'<rect x="'+x0+'" y="0" width="600" height="800" fill="'+col+'" opacity=".22"/>');}
function hiL(d,col){return '<path d="'+d+'" fill="none" stroke="'+(col||'#fff')+'" stroke-width="9" stroke-linecap="round" opacity=".5"/>';}
// frasquito Belle (se dibuja centrado en x,y, alto ~110)
function frasco(x,y,sc,rot){sc=sc||1;return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+sc+')">'+
  '<rect x="-30" y="-40" width="60" height="78" rx="14" fill="#FFD23F" stroke="'+K+'" stroke-width="6"/><rect x="-22" y="-32" width="10" height="56" rx="5" fill="#fff" opacity=".7"/>'+
  '<rect x="-16" y="-14" width="32" height="22" rx="4" fill="#fff" stroke="'+K+'" stroke-width="3"/><text x="0" y="3" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="16" fill="'+K+'">B.</text>'+
  '<rect x="-9" y="-54" width="18" height="16" fill="#ddd" stroke="'+K+'" stroke-width="5"/><rect x="-18" y="-80" width="36" height="28" rx="8" fill="'+K+'"/></g>';}
function eyes2(x1,x2,y,r,ry,iris){return [x1,x2].map(function(x){return e(x,y,r,ry,'#fff',6)+e(x+2,y+4,r*0.62,ry*0.66,iris||K,0)+e(x+2,y+6,r*0.36,ry*0.4,K,0)+c(x-r*0.25,y-ry*0.25,r*0.28,'#fff',0)+c(x+r*0.3,y+ry*0.3,r*0.12,'#fff',0);}).join('');}

// 1 · FRIJOLITO pulido
function P_frijol(G,o){var M=G==='m',s='';var bean='M250 120 C 362 120 402 222 402 334 C 402 474 380 642 250 662 C 120 642 98 474 98 334 C 98 222 138 120 250 120 Z';
  if(M)s+=p('M116 250 C 84 360 94 480 136 530 L 364 530 C 406 480 416 360 384 250 Z',o.hair)+hiL('M130 320 C 122 380 124 440 140 490',o.hairLt);
  s+=noodle('M152 470 C 92 520 80 600 120 640',o.skin,34)+c(122,650,28,o.skin)+shadeR('M94 622 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0',K,120);
  s+=p(bean,o.skin)+shadeR(bean,K,330);
  var shirt='M104 448 C 160 482 340 482 396 448 C 394 560 372 652 250 662 C 128 652 106 560 104 448 Z';
  s+=p(shirt,o.top)+shadeR(shirt,K,320)+p('M190 470 C 210 500 290 500 310 470',null,6);
  s+=eyes2(205,295,292,26,34,o.iris);
  if(M)s+=p('M176 254 L 166 240 M188 248 L 182 232 M324 254 L 334 240 M312 248 L 318 232',null,5);
  s+=p('M180 248 C 192 240 212 240 222 246 M278 246 C 288 240 308 240 320 248',null,6);
  s+=p('M244 330 C 248 338 256 338 258 332',null,5)+p('M212 360 C 230 392 270 392 288 360 C 270 368 230 368 212 360 Z','#7A2633',6)+'<ellipse cx="250" cy="378" rx="14" ry="6" fill="#E8737E"/>';
  s+=e(165,345,22,13,'#FF8FA0',0,null,' opacity=".75"')+e(335,345,22,13,'#FF8FA0',0,null,' opacity=".75"');
  s+=M?p('M108 300 C 98 168 168 98 250 98 C 342 98 404 168 394 300 C 362 228 300 196 250 206 C 200 196 140 228 108 300 Z',o.hair)+hiL('M200 128 C 240 112 290 114 330 132',o.hairLt):p('M148 192 C 168 120 228 94 250 112 C 262 78 302 78 322 104 C 362 112 372 162 354 198 C 322 170 282 168 250 176 C 220 168 180 172 148 192 Z',o.hair)+hiL('M200 140 C 220 124 246 120 262 124',o.hairLt);
  s+=noodle('M348 470 C 410 480 430 420 400 380',o.skin,34)+frasco(396,330,1,10)+c(398,370,28,o.skin);
  return s;}
// 2 · CABEZÓN pulido
function P_cabezon(G,o){var M=G==='m',s='';
  s+=noodle('M212 560 C 172 580 152 620 162 660',o.skin,18)+c(162,668,16,o.skin,6);
  var tor='M198 528 L 302 528 L 324 700 L 176 700 Z';s+=p(tor,o.top)+shadeR(tor,K,262)+p('M226 528 C 236 548 264 548 274 528',null,5);
  s+=p('M236 500 L 264 500 L 264 540 L 236 540 Z',o.skin,6);
  if(M)s+=p('M78 300 C 58 440 78 530 130 566 L 370 566 C 422 530 442 440 422 300 Z',o.hair)+hiL('M96 360 C 92 420 100 480 120 520',o.hairLt);
  var hd='M250 130 C 360 130 440 210 440 320 C 440 430 360 510 250 510 C 140 510 60 430 60 320 C 60 210 140 130 250 130 Z';
  s+=p(hd,o.skin)+shadeR(hd,K,370)+e(62,330,22,30,o.skin,6)+e(438,330,22,30,o.skin,6);
  s+=eyes2(182,318,330,22,26,o.iris)+p('M156 300 C 170 290 196 290 208 298 M292 298 C 304 290 330 290 344 300',null,7);
  s+=p('M244 360 C 250 372 258 372 262 364',null,5)+p('M196 400 C 220 450 280 450 304 400 Z','#7A2633',7)+p('M206 404 L 294 404 L 290 418 C 270 422 230 422 210 418 Z','#fff')+'<ellipse cx="250" cy="434" rx="22" ry="8" fill="#E8737E"/>';
  s+=e(140,390,30,16,'#FF8FA0',0,null,' opacity=".6"')+e(360,390,30,16,'#FF8FA0',0,null,' opacity=".6"');
  s+=M?p('M62 322 C 48 160 150 108 250 108 C 362 108 454 168 438 322 C 422 262 382 222 332 210 C 302 250 202 252 150 222 C 100 242 74 282 62 322 Z',o.hair)+hiL('M180 140 C 230 122 290 122 340 140',o.hairLt):p('M76 290 C 68 170 160 118 250 118 C 352 118 432 168 424 290 C 402 240 362 210 322 206 C 292 180 242 180 202 196 C 152 196 100 230 76 290 Z',o.hair)+hiL('M170 150 C 220 132 290 132 330 148',o.hairLt);
  s+=noodle('M288 560 C 330 560 352 530 350 500',o.skin,18)+frasco(352,450,0.8,8)+c(350,494,16,o.skin,6);
  return s;}
// 3 · PLANO MODERNO pulido (sin contornos)
function P_plano(G,o){var M=G==='m',s='';function f(d,col,ex){return '<path d="'+d+'" fill="'+col+'"'+(ex||'')+'/>';}
  if(M)s+=f('M146 218 C 124 320 134 444 168 506 L 332 506 C 366 444 376 320 354 218 Z',o.hair)+f('M300 230 C 330 300 340 400 330 500 L 332 506 C 366 444 376 320 354 218 Z',o.hairDk||'#00000022');
  var tor='M104 720 C 104 556 168 466 250 466 C 332 466 396 556 396 720 Z';s+=f(tor,o.top)+clipG(tor,'<rect x="270" y="400" width="300" height="400" fill="#000" opacity=".12"/>');
  s+=f('M200 470 C 220 520 280 520 300 470 Z',o.skinDk);
  s+=f('M226 396 L 274 396 L 274 480 C 262 492 238 492 226 480 Z',o.skinDk);
  var hd='M250 156 C 332 156 362 228 358 300 C 354 382 312 434 250 434 C 188 434 146 382 142 300 C 138 228 168 156 250 156 Z';
  s+=f(hd,o.skin)+clipG(hd,'<rect x="300" y="100" width="200" height="400" fill="#000" opacity=".08"/>');
  s+='<circle cx="144" cy="304" r="20" fill="'+o.skin+'"/><circle cx="356" cy="304" r="20" fill="'+o.skinDk+'"/>';
  s+='<path d="M198 300 C 208 288 222 288 232 300 M268 300 C 278 288 292 288 302 300" stroke="'+K+'" stroke-width="7" fill="none" stroke-linecap="round"/>';
  s+='<path d="M244 322 C 246 336 254 340 258 334" stroke="'+(o.skinDk)+'" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M220 356 C 236 374 264 374 280 356" stroke="'+K+'" stroke-width="7" fill="none" stroke-linecap="round"/>';
  s+='<ellipse cx="185" cy="342" rx="18" ry="11" fill="#FF8FA0"/><ellipse cx="315" cy="342" rx="18" ry="11" fill="#FF8FA0"/>';
  s+=M?f('M138 292 C 128 180 190 136 262 136 C 342 136 384 198 362 292 C 342 222 302 200 262 196 C 222 232 170 242 138 292 Z',o.hair)+'<path d="M200 160 C 240 146 290 146 330 166" stroke="#fff" stroke-width="8" fill="none" opacity=".25" stroke-linecap="round"/>':f('M146 262 C 142 178 198 136 262 140 C 322 144 366 188 352 264 C 332 222 296 204 256 204 C 210 204 172 222 146 262 Z',o.hair)+'<path d="M210 158 C 240 148 280 148 310 160" stroke="#fff" stroke-width="8" fill="none" opacity=".25" stroke-linecap="round"/>';
  // brazo con frasco
  s+=f('M320 540 C 360 560 370 600 360 640 L 330 640 C 334 610 326 580 300 566 Z',o.top)+'<path d="M346 640 C 360 600 380 560 370 520" stroke="'+o.skin+'" stroke-width="34" fill="none" stroke-linecap="round"/>'+frasco(372,474,0.85,6).replace(/stroke="#1a1a1a" stroke-width="[0-9]+"/g,'').replace(/stroke="#1a1a1a"/g,'')+'<circle cx="370" cy="516" r="22" fill="'+o.skin+'"/>';
  return s;}
// 6 · GARABATO pulido
function P_garabato(G,o){var M=G==='m',s='';function w(d,fill,sw){return '<path d="'+d+'" fill="'+(fill||'none')+'" stroke="'+K+'" stroke-width="'+(sw||9)+'" stroke-linecap="round" stroke-linejoin="round" filter="url(#wob)"/>';}
  function blob(d,col,dx,dy){return '<path d="'+d+'" fill="'+col+'" transform="translate('+(dx||12)+','+(dy||-8)+')" opacity=".9"/>';}
  var tor='M140 520 C 200 498 300 498 360 520 L 382 720 L 118 720 Z';s+=blob(tor,o.top,14,-8)+w('M140 520 C 200 498 300 498 360 520 L 382 720 M118 720 L 140 520')+w('M200 520 C 220 548 280 548 300 520',null,6);
  s+=w('M150 540 C 110 600 110 650 130 700');
  var hd='M250 140 C 350 136 400 210 402 300 C 404 400 340 460 250 462 C 160 460 98 400 98 300 C 100 210 150 144 250 140 Z';
  s+=blob(hd,o.skin,10,6)+w(hd);
  if(M)s+=blob('M100 300 C 80 180 160 110 260 120 C 360 130 420 200 400 300 C 390 400 410 470 420 530 C 390 510 360 480 350 420 C 360 330 340 250 300 220 C 240 260 160 270 110 300 Z',o.hair,10,6)+w('M100 300 C 80 180 160 110 260 120 C 360 130 420 200 400 300 C 390 400 410 470 420 530')+w('M110 300 C 160 270 240 260 300 220',null,6);
  else s+=blob('M118 236 C 148 140 258 108 340 150 C 382 172 402 212 398 252 C 340 212 262 202 202 216 C 162 224 132 238 118 236 Z',o.hair,10,6)+w('M118 236 C 148 140 258 108 340 150 C 382 172 402 212 398 252')+w('M150 210 L 170 180 M200 196 L 214 162 M250 190 L 260 154',null,6);
  s+=w('M196 286 C 198 296 198 306 196 314 M302 286 C 300 296 300 306 302 314',null,10)+w('M248 330 C 244 344 250 352 258 350',null,6)+w('M196 372 C 226 404 274 404 304 372')+'<ellipse cx="160" cy="350" rx="24" ry="13" fill="#FF6F8A" opacity=".6"/><ellipse cx="340" cy="350" rx="24" ry="13" fill="#FF6F8A" opacity=".6"/>';
  s+=w('M350 540 C 390 520 400 470 380 430')+frasco(384,380,0.95,8)+w('M364 420 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0','#fff');
  return s;}
// 7 · HUEVITO pulido
function P_huevo(G,o){var M=G==='m',s='';
  s+=noodle('M215 600 L 205 690',o.skin,20)+noodle('M285 600 L 295 690',o.skin,20)+e(198,698,30,13,o.shoe||K,0)+e(302,698,30,13,o.shoe||K,0);
  var tor='M180 520 C 180 466 320 466 320 520 L 332 612 L 168 612 Z';s+=p(tor,o.top)+shadeR(tor,K,270)+p('M222 476 C 232 494 268 494 278 476',null,5);
  s+=noodle('M182 520 C 140 540 130 580 140 610',o.skin,16);
  if(M)s+=p('M118 300 C 98 400 118 470 160 500 L 340 500 C 382 470 402 400 382 300 Z',o.hair)+hiL('M132 340 C 128 400 136 450 152 480',o.hairLt);
  var hd='M250 100 C 350 100 390 230 390 330 C 390 430 330 490 250 490 C 170 490 110 430 110 330 C 110 230 150 100 250 100 Z';
  s+=p(hd,o.skin)+shadeR(hd,K,322);
  s+=eyes2(205,295,336,16,20,o.iris)+p('M186 304 C 198 296 214 296 222 302 M278 302 C 286 296 302 296 314 304',null,6);
  s+=p('M244 370 C 248 378 256 378 258 372',null,5)+p('M222 400 C 236 420 264 420 278 400 C 264 406 236 406 222 400 Z','#7A2633',5)+e(162,382,20,11,'#FF8FA0',0,null,' opacity=".7"')+e(338,382,20,11,'#FF8FA0',0,null,' opacity=".7"');
  s+=M?p('M118 292 C 108 170 180 108 250 108 C 322 108 392 170 382 292 C 362 230 322 200 300 196 C 280 240 220 250 180 236 C 150 250 130 268 118 292 Z',o.hair)+hiL('M190 132 C 230 116 280 118 320 136',o.hairLt):p('M206 122 C 216 80 258 70 280 90 C 302 70 344 92 322 132 C 302 122 272 120 250 128 C 236 118 220 118 206 122 Z',o.hair)+p('M250 100 C 248 80 256 60 270 52',null,6)+hiL('M228 98 C 240 90 256 88 268 92',o.hairLt);
  s+=noodle('M318 520 C 360 520 376 490 370 460',o.skin,16)+frasco(372,412,0.8,8)+c(370,456,15,o.skin,6);
  return s;}
// 9 · MOCHI pulido
function P_mochi(G,o){var M=G==='m',s='';var body='M250 200 C 380 200 430 300 430 430 C 430 570 360 650 250 650 C 140 650 70 570 70 430 C 70 300 120 200 250 200 Z';
  s+='<path d="'+body+'" fill="#fff" stroke="#fff" stroke-width="44" stroke-linejoin="round"/>';
  if(M)s+='<path d="M80 330 C 60 230 140 150 250 150 C 360 150 440 230 420 330 Z" fill="#fff" stroke="#fff" stroke-width="44"/>';else s+='<circle cx="250" cy="170" r="40" fill="#fff"/>';
  s+=p(body,o.skin,7)+shadeR(body,K,350);
  var sh='M74 470 C 140 520 360 520 426 470 C 420 590 350 650 250 650 C 150 650 80 590 74 470 Z';s+=p(sh,o.top,7)+shadeR(sh,K,340)+p('M200 506 C 220 530 280 530 300 506',null,5);
  s+=e(108,520,26,40,o.skin,7);
  s+=c(190,360,24,K,0)+c(310,360,24,K,0)+c(181,349,9,'#fff',0)+c(301,349,9,'#fff',0)+c(197,371,4,'#fff',0)+c(317,371,4,'#fff',0);
  if(M)s+=p('M168 330 L 156 318 M178 326 L 172 310 M332 330 L 344 318 M322 326 L 328 310',null,5);
  s+=p('M228 408 C 238 422 250 422 250 410 C 250 422 262 422 272 408',null,6)+e(140,410,38,24,'#FF8FA0',0)+e(360,410,38,24,'#FF8FA0',0)+'<ellipse cx="128" cy="402" rx="10" ry="5" fill="#fff" opacity=".6"/><ellipse cx="348" cy="402" rx="10" ry="5" fill="#fff" opacity=".6"/>';
  s+=M?p('M84 340 C 70 240 150 170 250 170 C 350 170 430 240 416 340 C 380 280 330 250 290 246 C 280 270 260 280 250 270 C 220 290 160 290 120 300 C 100 310 90 324 84 340 Z',o.hair,7)+c(250,150,30,o.hair,7)+hiL('M170 200 C 210 184 270 184 320 198',o.hairLt):p('M118 282 C 138 202 198 182 250 186 C 310 182 370 212 380 282 C 340 252 300 246 270 254 C 250 238 200 242 170 258 C 150 264 130 272 118 282 Z',o.hair,7)+hiL('M170 214 C 210 198 270 198 310 210',o.hairLt);
  s+=frasco(398,470,0.9,10)+e(392,520,26,40,o.skin,7);
  return s;}
// 13 · PERA pulida
function P_pera(G,o){var M=G==='m',s='';
  s+=e(180,690,52,22,o.shoe||K,0)+e(320,690,52,22,o.shoe||K,0);
  if(M)s+=p('M148 220 C 108 300 118 384 150 424 L 350 424 C 382 384 392 300 352 220 Z',o.hair)+hiL('M160 270 C 150 320 152 370 164 404',o.hairLt);
  // brazos detrás del cuerpo: nacen en el costado, a la altura de la remera
  s+=noodle('M132 478 C 86 500 58 540 54 600',o.skin,30)+c(54,612,22,o.skin)+p('M40 610 C 44 622 56 628 66 624',null,4);
  s+=noodle('M132 478 C 112 486 96 498 84 514',o.top,40);
  s+=noodle('M368 478 C 420 476 444 448 434 416',o.skin,30)+noodle('M368 478 C 388 482 404 480 416 472',o.top,40);
  var b='M250 150 C 330 150 350 220 345 300 C 340 360 420 450 420 560 C 420 650 340 690 250 690 C 160 690 80 650 80 560 C 80 450 160 360 155 300 C 150 220 170 150 250 150 Z';
  s+=p(b,o.skin)+shadeR(b,K,320);
  var t='M120 470 C 180 500 320 500 380 470 C 410 520 420 560 420 580 C 420 660 340 690 250 690 C 160 690 80 660 80 580 C 80 560 90 520 120 470 Z';s+=p(t,o.top)+shadeR(t,K,310)+p('M200 488 C 220 512 280 512 300 488',null,5);
  s+=eyes2(218,282,272,13,16,o.iris)+p('M200 248 C 210 242 224 242 232 246 M268 246 C 276 242 290 242 300 248',null,5);
  s+=p('M246 296 C 248 302 254 302 256 298',null,4)+p('M228 318 C 240 334 260 334 272 318 C 260 324 240 324 228 318 Z','#7A2633',5)+e(192,302,15,9,'#FF8FA0',0,null,' opacity=".7"')+e(308,302,15,9,'#FF8FA0',0,null,' opacity=".7"');
  s+=M?p('M148 262 C 144 170 198 128 250 128 C 302 128 356 170 352 262 C 332 212 292 196 250 200 C 208 196 168 212 148 262 Z',o.hair)+hiL('M200 148 C 230 136 270 136 300 148',o.hairLt):p('M188 162 C 208 120 250 110 270 130 C 290 110 322 130 312 162 C 292 152 270 152 250 158 C 230 152 204 154 188 162 Z',o.hair)+hiL('M214 132 C 228 124 244 122 256 124',o.hairLt);
  s+=frasco(434,360,0.95,6)+c(432,408,22,o.skin)+p('M416 400 C 424 392 440 392 448 400',null,4);
  return s;}
var PULIDOS=[['1 · Frijolito',P_frijol],['2 · Cabezón',P_cabezon],['3 · Plano moderno',P_plano],['6 · Garabato marcador',P_garabato],['7 · Huevito',P_huevo],['9 · Mochi sticker',P_mochi],['13 · Pera',P_pera]];
