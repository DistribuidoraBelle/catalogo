var P=[
{k:'p1',title:'Majestic',cut:'h140390hd.png',scene:'esc_majestic.jpg',ped:1266,N:[['azafran','Azafrán'],['jazmin','Jazmín'],['ambar','Madera de ámbar'],['ambargris','Ámbar gris'],['cedro','Cedro'],['pino','Abeto']],
 ins:{img:'h33519.png',n:'Baccarat Rouge 540',mt:'MAISON FRANCIS KURKDJIAN'},emo:'Para el que entra como un rey.',quote:'“Lujo puro, en cada gota.”',mk:'LUJO PURO'},
{k:'p2',title:'Highness',cut:'h134749hd.png',scene:'esc_highness.jpg',ped:1166,N:[['bergamota','Cítricos'],['pimienta','Especias'],['jazmin','Jazmín'],['rosa','Rosa'],['violeta','Violeta'],['vetiver','Vetiver']],
 ins:{img:'h75930.png',n:'Vibrato',mt:'SOSPIRO'},emo:'Elegancia que se nota, sin decir una palabra.',quote:'“Nobleza en estado puro.”',mk:'NOBLEZA EN ESTADO PURO'},
{k:'p3',title:'London',cut:'h123217hd.png',scene:'esc_london.jpg',ped:1033,N:[['pimientarosa','Pimienta rosa'],['azafran','Azafrán'],['pera','Pera'],['rosa','Rosa'],['incienso','Incienso'],['vainilla','Vainilla']],
 ins:{img:'h83534.png',n:'Brompton Immortals',mt:'EX NIHILO · EXTRAIT'},emo:'Sofisticado, moderno, y con mucha clase.',quote:'“El estilo de Londres, en tu piel.”',mk:'EL ESTILO DE LONDRES'},
{k:'p4',title:'Chrome',cut:'h136922hd.png',scene:'esc_chrome.jpg',ped:1063,N:[['durazno','Durazno'],['naranja','Naranja'],['mango','Mango'],['maracuya','Maracuyá'],['ambar','Ámbar'],['vainilla','Vainilla']],
 ins:{img:'h76683.png',n:'Erba Gold',mt:'XERJOFF'},emo:'Brilla tanto como su botella.',quote:'“Frutal, luminoso y adictivo.”',mk:'BRILLA COMO SU BOTELLA'},
{k:'p5',title:'Private Luceo',cut:'h140000hd.png',scene:'esc_luceo.jpg',ped:1240,N:[['bergamota','Bergamota'],['limon','Limón'],['jengibre','Jengibre'],['cardamomo','Cardamomo'],['vetiver','Vetiver'],['pachuli','Pachulí']],
 ins:{img:'h41222.png',img2:'h75930.png',lbl:'INSPIRADO ENTRE',n:'Tygar',n2:'Vibrato',mt:'BVLGARI · SOSPIRO'},emo:'Para los que no se conforman con lo común.',quote:'“Luz y frescura, de la colección privada.”',mk:'COLECCIÓN PRIVADA'},
{k:'p6',title:'Private Terra',cut:'h139999hd.png',scene:'esc_terra.jpg',ped:1103,N:[['azafran','Azafrán'],['cardamomo','Cardamomo'],['jazmin','Jazmín'],['palosanto','Madera flotante'],['cedro','Cedro'],['iris','Iris']],
 ins:{lbl:'COLECCIÓN PRIVADA',n:'Hawas Private',mt:'EXTRAIT DE PARFUM · EXCLUSIVO DE RASASI'},emo:'El aroma de un hombre con raíces, y con carácter.',quote:'“La fuerza de la tierra, hecha perfume.”',mk:'COLECCIÓN PRIVADA'},
{k:'p7',title:'Crystelle',cut:'h143465hd.png',scene:'esc_crystelle.jpg',ped:1226,N:[['pomelo','Pomelo'],['bergamota','Bergamota'],['lavanda','Lavanda'],['azafran','Azafrán'],['pimienta','Pimienta'],['vainilla','Vainilla']],
 ins:{img:'h104991.png',img2:'h104937.png',lbl:'INSPIRADO ENTRE',n:'Castley',n2:'Spicebomb Metallic Musk',mt:'PARFUMS DE MARLY · VIKTOR & ROLF'},emo:'Brillante, exclusivo, y difícil de olvidar.',quote:'“Puro como el cristal.”',mk:'PURO COMO EL CRISTAL'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'05',t:'LUJO Y NICHO'};
