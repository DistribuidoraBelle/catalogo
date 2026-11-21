var P=[
{k:'p1',title:'Apex',cut:'hapexhd.png',scene:'vid_apex',ped:1400,N:[['menta','Menta'],['mandarina','Mandarina'],['bergamota','Bergamota'],['mora','Grosella negra'],['cedro','Maderas'],['ambar','Ámbar']],
 ins:{img:'h81423.png',n:'Pacific Chill',mt:'LOUIS VUITTON'},emo:'Para los que siempre toman la curva perfecta.',quote:'“Apex: el punto exacto de la curva perfecta.”',mk:'LA CURVA PERFECTA'},
{k:'p2',title:'Apex Hybrid',cut:'hapexhybridhd.png',scene:'vid_hybrid',ped:1360,N:[['menta','Menta'],['limon','Limón'],['mora','Grosella'],['lavanda','Lavanda'],['jazmin','Jazmín'],['almizcle','Almizcle']],
 ins:{img:'h70424.png',n:'Torino21',mt:'XERJOFF'},emo:'Potencia y frescura, en un solo perfume.',quote:'“Con el alma de los motores híbridos de la F1.”',mk:'POTENCIA HÍBRIDA'},
{k:'p3',title:'Apex GT',cut:'hapexgthd.png',scene:'vid_gt',ped:1440,N:[['bergamota','Bergamota'],['anana','Ananá'],['pomelo','Pomelo'],['pachuli','Pachulí'],['cedro','Cedro'],['jazmin','Jazmín']],
 ins:{img:'h44174hd.png',n:'Hacivat',mt:'NISHANE'},emo:'Lujo y velocidad, para los que viajan a lo grande.',quote:'“El espíritu del Gran Turismo.”',mk:'GRAN TURISMO'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'08',t:'LO MÁS NUEVO'};
