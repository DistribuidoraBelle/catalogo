// Pera con 12 tipos de brazos + vestido que cubre de lado a lado
var BODY='M250 150 C 330 150 350 220 345 300 C 340 360 420 450 420 560 C 420 650 340 690 250 690 C 160 690 80 650 80 560 C 80 450 160 360 155 300 C 150 220 170 150 250 150 Z';
function hand(x,y,o,r){return c(x,y,r||22,o.skin);}
function bot(x,y,sc,rot){return frasco(x,y,sc||0.9,rot||6);}
var ARMS=[
 ['Fideo curvo',function(o){return {b:noodle('M132 478 C 86 500 58 540 54 600',o.skin,30)+noodle('M368 478 C 420 476 444 448 434 416',o.skin,30),f:hand(54,612,o)+bot(434,362)+hand(432,410,o)};}],
 ['Palito fino',function(o){return {b:p('M140 480 L 70 590',null,8)+p('M360 480 L 440 410',null,8),f:c(66,598,16,o.skin,6)+bot(444,356,0.85)+c(442,402,16,o.skin,6)};}],
 ['Aletita gordita',function(o){return {b:p('M128 470 C 70 474 30 520 40 560 C 50 590 96 572 124 530 Z',o.skin)+p('M370 470 C 420 460 452 420 440 390 C 430 372 396 390 360 430 Z',o.skin),f:bot(440,340,0.85)};}],
 ['Mitón grande',function(o){return {b:noodle('M132 480 C 96 510 80 550 80 590',o.skin,26)+noodle('M368 480 C 410 470 430 440 428 410',o.skin,26),f:p('M50 590 C 50 560 110 560 110 590 C 110 640 50 640 50 590 Z',o.skin)+p('M50 596 C 38 590 34 576 44 570',null,6)+bot(430,350)+p('M398 396 C 398 368 458 368 458 396 C 458 440 398 440 398 396 Z',o.skin)};}],
 ['Guante retro',function(o){return {b:noodle('M132 480 C 86 500 62 540 60 590',o.skin,22)+noodle('M368 480 C 416 478 440 450 432 418',o.skin,22),f:c(60,606,30,'#fff',7)+p('M44 598 L 76 598 M44 612 L 76 612',null,4)+bot(434,356)+c(432,410,30,'#fff',7)+p('M418 404 L 446 404 M418 418 L 446 418',null,4)};}],
 ['Con codo',function(o){return {b:noodle('M132 480 L 86 540 L 92 610',o.skin,28)+noodle('M368 480 L 440 470 L 438 412',o.skin,28),f:hand(92,620,o)+bot(438,356)+hand(438,410,o)};}],
 ['Manga larga',function(o){return {b:noodle('M132 478 C 86 500 60 540 56 590',o.top,40)+noodle('M368 478 C 420 476 446 448 436 410',o.top,40),f:p('M34 588 L 78 594',null,7)+hand(56,616,o)+bot(436,350)+p('M414 418 L 458 412',null,7)+hand(436,398,o)};}],
 ['Mano en la cintura',function(o){return {b:noodle('M132 478 C 70 500 62 560 110 580',o.skin,30)+noodle('M368 478 C 420 476 444 448 434 416',o.skin,30),f:hand(116,580,o)+bot(434,362)+hand(432,410,o)};}],
 ['Manos flotantes',function(o){return {b:'',f:hand(52,560,o,26)+p('M36 552 C 38 540 48 536 56 542',null,4)+bot(450,370)+hand(448,420,o,26)};}],
 ['Fideo largo',function(o){return {b:noodle('M132 478 C 60 520 40 600 50 680',o.skin,22)+noodle('M368 478 C 460 470 470 380 440 330',o.skin,22),f:c(50,692,18,o.skin,6)+bot(440,276)+c(440,320,18,o.skin,6)};}],
 ['Manito 3 dedos',function(o){var h3=function(x,y){return p('M'+(x-16)+' '+(y-8)+' C '+(x-30)+' '+(y+10)+' '+(x-20)+' '+(y+30)+' '+(x-6)+' '+(y+26)+' C '+(x-4)+' '+(y+38)+' '+(x+14)+' '+(y+38)+' '+(x+14)+' '+(y+26)+' C '+(x+28)+' '+(y+30)+' '+(x+32)+' '+(y+10)+' '+(x+18)+' '+(y-8)+' Z',o.skin,6);};
   return {b:noodle('M132 478 C 86 500 62 540 60 590',o.skin,28)+noodle('M368 478 C 420 476 444 448 434 416',o.skin,28),f:h3(60,590)+bot(434,362)+hand(432,410,o)};}],
 ['Manga farol',function(o){return {b:noodle('M110 500 C 90 530 80 570 80 610',o.skin,20)+noodle('M392 500 C 420 486 434 456 428 420',o.skin,20),f:c(112,486,38,o.top)+c(388,486,38,o.top)+p('M84 504 C 98 514 118 516 134 508',null,5)+p('M366 508 C 382 516 402 514 416 504',null,5)+c(80,620,17,o.skin,6)+bot(430,368,0.85)+c(428,412,17,o.skin,6)};}]
];
function peraArms(G,o,k){var M=G==='m',s='';var A=ARMS[k][1](o);
  s+=e(180,690,52,22,K,0)+e(320,690,52,22,K,0);
  if(M)s+=p('M148 220 C 108 300 118 384 150 424 L 350 424 C 382 384 392 300 352 220 Z',o.hair);
  s+=A.b;
  s+=p(BODY,o.skin)+shadeR(BODY,K,320);
  // vestido: ocupa todo el ancho del cuerpo (recortado a la silueta)
  s+=clipG(BODY,'<rect x="0" y="462" width="500" height="300" fill="'+o.top+'"/><rect x="320" y="462" width="300" height="300" fill="#000" opacity=".2"/><path d="M60 462 C 160 500 340 500 440 462" fill="none"/>')+clipG(BODY,'<path d="M40 456 C 160 498 340 498 460 456" fill="none" stroke="'+K+'" stroke-width="7"/>')+p(BODY,'none');
  s+=p('M206 484 C 226 506 274 506 294 484',null,5);
  s+=eyes2(218,282,272,13,16,o.iris)+p('M200 248 C 210 242 224 242 232 246 M268 246 C 276 242 290 242 300 248',null,5);
  s+=p('M246 296 C 248 302 254 302 256 298',null,4)+p('M228 318 C 240 334 260 334 272 318 C 260 324 240 324 228 318 Z','#7A2633',5)+e(192,302,15,9,'#FF8FA0',0,null,' opacity=".7"')+e(308,302,15,9,'#FF8FA0',0,null,' opacity=".7"');
  s+=M?p('M148 262 C 144 170 198 128 250 128 C 302 128 356 170 352 262 C 332 212 292 196 250 200 C 208 196 168 212 148 262 Z',o.hair)+hiL('M200 148 C 230 136 270 136 300 148',o.hairLt):p('M188 162 C 208 120 250 110 270 130 C 290 110 322 130 312 162 C 292 152 270 152 250 158 C 230 152 204 154 188 162 Z',o.hair);
  s+=A.f;
  return s;}
