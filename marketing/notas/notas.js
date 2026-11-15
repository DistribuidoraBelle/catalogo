// ═══════════ Biblioteca de NOTAS OLFATIVAS ilustradas (SVG, viewBox 0 0 120 120) ═══════════
// Estilo Belle: contorno negro grueso, color plano + sombra a la derecha + brillo blanco.
var K='#1a1a1a',SW='stroke="#1a1a1a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
function hl(d){return '<path d="'+d+'" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/>';}
function shd(d,op){return '<path d="'+d+'" fill="#000" opacity="'+(op||.14)+'"/>';}
function petal(cx,cy,rx,ry,a,fill){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" transform="rotate('+a+' 60 60)" fill="'+fill+'" '+SW+'/>';}
var NOTAS={
 bergamota:{n:'BERGAMOTA',g:'cítrico',c:'#C9E34A',svg:
  '<path d="M60 16 C 88 16 106 38 104 64 C 102 92 82 106 60 106 C 36 106 16 90 16 62 C 16 36 34 16 60 16 Z" fill="#B7D93A" '+SW+'/>'+shd('M84 26 C 104 44 106 84 76 102 C 92 82 94 50 84 26 Z')+
  '<path d="M60 16 C 58 8 64 4 70 6" fill="none" '+SW+'/><path d="M66 10 C 78 2 92 6 96 14 C 84 18 74 16 66 10 Z" fill="#4FB45E" '+SW+'/>'+[[40,46],[54,70],[72,52],[44,82],[78,80]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.4" fill="#7FA21E"/>';}).join('')+hl('M34 44 C 38 34 46 28 54 26')},
 limon:{n:'LIMÓN',g:'cítrico',c:'#FFE14D',svg:
  '<circle cx="60" cy="60" r="46" fill="#FFE14D" '+SW+'/><circle cx="60" cy="60" r="35" fill="#FFF6B8" stroke="#E8C21F" stroke-width="4"/>'+[0,60,120,180,240,300].map(function(a){var r=a*Math.PI/180;return '<path d="M60 60 L '+(60+31*Math.cos(r-0.42))+' '+(60+31*Math.sin(r-0.42))+' A 31 31 0 0 1 '+(60+31*Math.cos(r+0.42))+' '+(60+31*Math.sin(r+0.42))+' Z" fill="#FFE77A" stroke="#E8C21F" stroke-width="2.5"/>';}).join('')+'<circle cx="60" cy="60" r="5" fill="#fff" stroke="#E8C21F" stroke-width="3"/>'+hl('M30 40 C 36 30 46 22 58 20')},
 naranja:{n:'NARANJA',g:'cítrico',c:'#FF9A2E',svg:
  '<circle cx="60" cy="64" r="44" fill="#FF9A2E" '+SW+'/>'+shd('M92 40 C 110 70 96 104 64 108 C 88 96 100 70 92 40 Z')+'<path d="M60 20 C 56 12 60 6 66 6" fill="none" '+SW+'/><path d="M64 14 C 76 4 90 10 92 18 C 80 22 70 20 64 14 Z" fill="#4FB45E" '+SW+'/>'+[[42,50],[70,46],[52,80],[80,74],[36,72]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.4" fill="#E0761A"/>';}).join('')+hl('M32 52 C 34 40 42 30 54 26')},
 manzana:{n:'MANZANA',g:'frutal',c:'#FF5A4E',svg:
  '<path d="M60 34 C 46 22 18 26 18 58 C 18 88 40 108 56 102 C 58 101 62 101 64 102 C 80 108 102 88 102 58 C 102 26 74 22 60 34 Z" fill="#FF5A4E" '+SW+'/>'+shd('M88 34 C 104 50 102 86 72 102 C 92 84 96 56 88 34 Z')+'<path d="M60 34 C 60 24 62 16 68 10" fill="none" '+SW+'/><path d="M64 22 C 70 10 86 10 90 16 C 82 24 72 26 64 22 Z" fill="#4FB45E" '+SW+'/>'+hl('M30 50 C 32 40 40 34 48 32')},
 coco:{n:'COCO',g:'gourmand',c:'#8A5A3B',svg:
  '<circle cx="60" cy="60" r="44" fill="#8A5A3B" '+SW+'/><path d="M30 46 C 40 30 80 30 90 46 C 96 58 92 84 60 96 C 28 84 24 58 30 46 Z" fill="#FFFDF5" '+SW+'/><path d="M40 52 C 48 42 72 42 80 52" fill="none" stroke="#E8E0CC" stroke-width="5" stroke-linecap="round"/>'+[[46,26],[60,22],[74,26]].map(function(p){return '<path d="M'+p[0]+' '+p[1]+' l 3 6" stroke="#5E3A22" stroke-width="3" stroke-linecap="round"/>';}).join('')},
 rosa:{n:'ROSA',g:'floral',c:'#FF4F8B',svg:
  '<path d="M60 112 L60 78" '+SW+' fill="none"/><path d="M60 96 C 40 86 30 94 28 102 C 40 106 52 104 60 96 Z" fill="#4FB45E" '+SW+'/>'+
  '<path d="M60 84 C 26 84 18 56 30 36 C 40 50 50 54 60 54 C 70 54 80 50 90 36 C 102 56 94 84 60 84 Z" fill="#E63E78" '+SW+'/>'+
  '<path d="M60 70 C 38 70 34 46 44 26 C 52 36 56 38 60 38 C 64 38 68 36 76 26 C 86 46 82 70 60 70 Z" fill="#FF6FA0" '+SW+'/>'+
  '<path d="M60 56 C 46 56 44 34 60 22 C 76 34 74 56 60 56 Z" fill="#FF9AC0" '+SW+'/><path d="M54 40 C 56 34 62 32 66 36" fill="none" '+SW+'/>'},
 jazmin:{n:'JAZMÍN',g:'floral',c:'#FFF6E0',svg:
  [0,72,144,216,288].map(function(a){return '<path d="M60 60 C 50 44 50 22 60 14 C 70 22 70 44 60 60 Z" transform="rotate('+a+' 60 60)" fill="#FFFDF6" '+SW+'/>';}).join('')+'<circle cx="60" cy="60" r="10" fill="#FFD23F" '+SW+'/><circle cx="57" cy="57" r="3" fill="#fff"/>'},
 lavanda:{n:'LAVANDA',g:'aromático',c:'#9B7BEA',svg:
  '<path d="M60 112 L60 30" stroke="#3F9E52" stroke-width="7" stroke-linecap="round"/><path d="M60 112 L60 30" fill="none" stroke="#1a1a1a" stroke-width="2" opacity=".0"/>'+[0,1,2,3,4,5,6].map(function(i){var y=24+i*10,w=14-i*0.6;return '<ellipse cx="'+(60-w*0.7)+'" cy="'+y+'" rx="'+(w*0.55)+'" ry="7" fill="#9B7BEA" '+SW+'/><ellipse cx="'+(60+w*0.7)+'" cy="'+(y+4)+'" rx="'+(w*0.55)+'" ry="7" fill="#B49BF2" '+SW+'/>';}).join('')+'<path d="M60 90 C 44 82 38 86 34 94 C 46 98 54 96 60 90 Z M60 98 C 76 90 82 94 86 102 C 74 106 66 104 60 98 Z" fill="#5FCB7A" '+SW+'/>'},
 vainilla:{n:'VAINILLA',g:'gourmand',c:'#F6E7B8',svg:
  '<path d="M22 98 C 40 70 66 44 98 22" stroke="#1a1a1a" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M22 98 C 40 70 66 44 98 22" stroke="#5A3420" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M34 104 C 52 76 76 52 104 34" stroke="#1a1a1a" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M34 104 C 52 76 76 52 104 34" stroke="#6E4128" stroke-width="7" stroke-linecap="round" fill="none"/>'+
  [0,72,144,216,288].map(function(a){return '<path d="M44 44 C 38 34 40 22 44 18 C 50 24 52 34 44 44 Z" transform="rotate('+a+' 44 44)" fill="#FFF3C4" '+SW+'/>';}).join('')+'<circle cx="44" cy="44" r="7" fill="#FFD23F" '+SW+'/>'},
 caramelo:{n:'CARAMELO',g:'gourmand',c:'#E89A3C',svg:
  '<path d="M30 60 L10 44 L12 76 Z M90 60 L110 44 L108 76 Z" fill="#FFB24A" '+SW+'/><ellipse cx="60" cy="60" rx="34" ry="26" fill="#E8862A" '+SW+'/><path d="M40 50 C 52 64 66 44 80 58" fill="none" stroke="#FFD08A" stroke-width="6" stroke-linecap="round"/>'+hl('M38 46 C 44 40 52 38 58 38')},
 cafe:{n:'CAFÉ',g:'gourmand',c:'#6E4128',svg:
  '<ellipse cx="44" cy="62" rx="24" ry="32" transform="rotate(-20 44 62)" fill="#6E4128" '+SW+'/><path d="M50 34 C 36 52 52 72 38 92" fill="none" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/><ellipse cx="80" cy="58" rx="24" ry="32" transform="rotate(18 80 58)" fill="#7E4D30" '+SW+'/><path d="M74 30 C 90 48 72 68 88 88" fill="none" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/>'+hl('M32 44 C 34 38 38 34 42 32')},
 pimienta:{n:'PIMIENTA',g:'especiado',c:'#3A2A22',svg:
  [[40,44,16],[70,40,15],[54,72,17],[84,70,14],[30,78,13]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+p[2]+'" fill="#3A2A22" '+SW+'/><path d="M'+(p[0]-p[2]*0.4)+' '+(p[1]-p[2]*0.2)+' q 5 -6 10 0 M'+(p[0]-p[2]*0.2)+' '+(p[1]+p[2]*0.35)+' q 5 -5 9 1" fill="none" stroke="#6B544A" stroke-width="2.5"/><circle cx="'+(p[0]-p[2]*0.4)+'" cy="'+(p[1]-p[2]*0.45)+'" r="3" fill="#fff" opacity=".6"/>';}).join('')},
 canela:{n:'CANELA',g:'especiado',c:'#B5622B',svg:
  [[-22,30],[-4,56],[16,82]].map(function(q,i){return '<g transform="rotate('+q[0]+' 60 60) translate('+(q[1]-56)+',0)"><rect x="46" y="14" width="28" height="92" rx="12" fill="'+['#B5622B','#C9733A','#A9552A'][i]+'" '+SW+'/><path d="M60 14 C 50 18 50 28 60 30 C 70 28 70 18 60 14" fill="#8A4420" '+SW+'/></g>';}).join('')},
 cardamomo:{n:'CARDAMOMO',g:'especiado',c:'#9BC56A',svg:
  [[40,60,-25],[64,52,5],[84,66,30]].map(function(p){return '<g transform="rotate('+p[2]+' '+p[0]+' '+p[1]+')"><path d="M'+p[0]+' '+(p[1]-30)+' C '+(p[0]+18)+' '+(p[1]-20)+' '+(p[0]+18)+' '+(p[1]+20)+' '+p[0]+' '+(p[1]+30)+' C '+(p[0]-18)+' '+(p[1]+20)+' '+(p[0]-18)+' '+(p[1]-20)+' '+p[0]+' '+(p[1]-30)+' Z" fill="#9BC56A" '+SW+'/><path d="M'+p[0]+' '+(p[1]-24)+' L '+p[0]+' '+(p[1]+24)+'" stroke="#6E9A40" stroke-width="3"/></g>';}).join('')},
 jengibre:{n:'JENGIBRE',g:'especiado',c:'#E8C27A',svg:
  '<path d="M20 70 C 18 54 34 48 44 54 C 46 38 62 34 70 44 C 78 30 98 34 98 50 C 110 56 106 76 92 78 C 84 92 64 92 58 82 C 46 92 22 86 20 70 Z" fill="#E8C27A" '+SW+'/><path d="M36 64 l 8 2 M64 58 l 6 -4 M80 64 l 8 0 M54 74 l 6 2" stroke="#B08A46" stroke-width="4" stroke-linecap="round"/>'+hl('M30 58 C 34 54 40 54 44 56')},
 cedro:{n:'CEDRO',g:'amaderado',c:'#C98A55',svg:
  '<ellipse cx="60" cy="60" rx="46" ry="46" fill="#E2B07A" '+SW+'/>'+[34,24,14].map(function(r,i){return '<circle cx="60" cy="60" r="'+r+'" fill="none" stroke="#B07A45" stroke-width="'+(4-i*0.5)+'"/>';}).join('')+'<circle cx="60" cy="60" r="5" fill="#8A5A30"/><path d="M60 14 L64 36 M106 60 L84 62" stroke="#8A5A30" stroke-width="4" stroke-linecap="round"/>'},
 sandalo:{n:'SÁNDALO',g:'amaderado',c:'#E8B98A',svg:
  [[0,70],[1,52],[2,34]].map(function(q){var i=q[0];return '<rect x="'+(18+i*6)+'" y="'+q[1]+'" width="'+(84-i*12)+'" height="20" rx="6" fill="'+['#D9A06E','#E8B98A','#F0C9A0'][i]+'" '+SW+'/><path d="M'+(28+i*6)+' '+(q[1]+10)+' L '+(92-i*6)+' '+(q[1]+10)+'" stroke="#B57E4E" stroke-width="2.5" stroke-dasharray="10 6"/>';}).join('')},
 pachuli:{n:'PACHULÍ',g:'amaderado',c:'#4E8A3E',svg:
  '<path d="M60 108 L60 50" '+SW+' fill="none"/>'+[[-1,0],[1,14],[-1,28]].map(function(q){var s=q[0],y=q[1];return '<path d="M60 '+(80-y)+' C '+(60+s*40)+' '+(70-y)+' '+(60+s*46)+' '+(44-y)+' '+(60+s*20)+' '+(36-y)+' C '+(60+s*10)+' '+(50-y)+' '+(60+s*4)+' '+(64-y)+' 60 '+(80-y)+' Z" fill="'+(s>0?'#5E9E4A':'#4E8A3E')+'" '+SW+'/>';}).join('')+'<path d="M60 52 C 46 40 50 20 60 12 C 70 20 74 40 60 52 Z" fill="#6DB257" '+SW+'/>'},
 oud:{n:'OUD',g:'amaderado',c:'#3B2418',svg:
  '<path d="M18 46 L 70 22 L 104 44 L 98 82 L 46 102 L 16 80 Z" fill="#5A3A26" '+SW+'/><path d="M18 46 L 70 22 L 104 44 L 52 66 Z" fill="#7A5236" '+SW+'/><path d="M52 66 L 46 102" '+SW+'/>'+
  '<path d="M30 52 C 44 46 52 54 66 46 C 76 40 86 46 96 42" fill="none" stroke="#1E120C" stroke-width="6" stroke-linecap="round"/><path d="M24 74 C 34 70 40 80 46 76 M60 84 C 72 78 80 86 92 76" fill="none" stroke="#1E120C" stroke-width="6" stroke-linecap="round"/><circle cx="86" cy="30" r="4" fill="#FFD23F"/><circle cx="96" cy="22" r="2.5" fill="#FFD23F"/>'},
 ambar:{n:'ÁMBAR',g:'oriental',c:'#F0A21A',svg:
  '<path d="M60 12 C 76 36 96 54 96 76 C 96 96 80 108 60 108 C 40 108 24 96 24 76 C 24 54 44 36 60 12 Z" fill="#F0A21A" '+SW+'/>'+shd('M78 40 C 98 62 98 96 70 106 C 86 92 90 66 78 40 Z',.18)+'<path d="M60 26 C 70 42 82 56 82 74" fill="none" stroke="#FFD27A" stroke-width="6" stroke-linecap="round"/>'+hl('M38 70 C 38 60 42 52 48 46')},
 almizcle:{n:'ALMIZCLE',g:'almizclado',c:'#F3E9FF',svg:
  '<path d="M24 76 C 10 76 10 54 26 52 C 26 34 50 28 58 42 C 66 26 92 30 92 50 C 108 50 110 76 94 78 Z" fill="#FFFFFF" '+SW+'/><path d="M34 66 C 40 60 46 60 52 64 M64 62 C 70 56 78 56 84 62" fill="none" stroke="#C9B8EA" stroke-width="5" stroke-linecap="round"/>'+[[36,96],[60,100],[84,94]].map(function(p){return '<path d="M'+p[0]+' '+(p[1]-8)+' L '+(p[0]+3)+' '+p[1]+' L '+p[0]+' '+(p[1]+8)+' L '+(p[0]-3)+' '+p[1]+' Z" fill="#C9B8EA"/>';}).join('')},
 tonka:{n:'HABA TONKA',g:'gourmand',c:'#4A2E22',svg:
  [[40,58,-30],[72,48,10],[66,82,-10]].map(function(p){return '<g transform="rotate('+p[2]+' '+p[0]+' '+p[1]+')"><ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="26" ry="11" fill="#4A2E22" '+SW+'/><path d="M'+(p[0]-16)+' '+(p[1]-2)+' q 8 -5 16 0 q 8 5 14 0" fill="none" stroke="#7A5040" stroke-width="2.5"/></g>';}).join('')},
 menta:{n:'MENTA',g:'aromático',c:'#5FCB7A',svg:
  '<path d="M60 108 C 22 92 16 48 60 14 C 104 48 98 92 60 108 Z" fill="#5FCB7A" '+SW+'/>'+shd('M60 14 C 96 44 100 88 60 108 C 84 84 84 48 60 14 Z',.12)+'<path d="M60 102 L60 30" '+SW+' fill="none"/><path d="M60 58 L42 44 M60 74 L80 60 M60 88 L44 78 M60 46 L74 36" '+SW+' fill="none"/>'},
 incienso:{n:'INCIENSO',g:'oriental',c:'#B9A8A0',svg:
  '<rect x="54" y="56" width="12" height="54" rx="4" fill="#8A5A3B" '+SW+'/><circle cx="60" cy="54" r="5" fill="#FF6A2E" '+SW+'/><path d="M60 46 C 48 36 72 26 58 14 M60 46 C 72 38 52 28 66 18" fill="none" stroke="#9AA3AD" stroke-width="5" stroke-linecap="round"/>'},
 cuero:{n:'CUERO',g:'cuero',c:'#7A4A2A',svg:
  '<path d="M22 30 C 40 20 80 20 98 30 C 104 52 104 72 98 92 C 80 102 40 102 22 92 C 16 72 16 52 22 30 Z" fill="#8A5230" '+SW+'/><path d="M30 38 C 46 30 74 30 90 38 C 94 54 94 70 90 84 C 74 92 46 92 30 84 C 26 70 26 54 30 38 Z" fill="none" stroke="#C98A55" stroke-width="3" stroke-dasharray="7 6"/>'+hl('M34 44 C 44 38 56 36 66 36')},
};
function nota(id,x,y,s,rot,extra){var N=NOTAS[id];return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+(s||1)+') translate(-60,-60)" '+(extra||'')+'>'+N.svg+'</g>';}
if(typeof module!=='undefined')module.exports={NOTAS:NOTAS,nota:nota};
