var P=[
{k:'p1',title:'Pink',cut:'h119907hd.png',scene:'vid_pink',ped:1236,N:[['pimientarosa','Pimienta rosa'],['pomelo','Pomelo'],['frambuesa','Frutos rojos'],['peonia','Peonía'],['rosa','Rosa'],['almizcle','Almizcle']],
 ins:{img:'h69117.png',n:'Oriana',mt:'PARFUMS DE MARLY'},emo:'Dulce, divertida, e imposible de ignorar.',quote:'“El rosa nunca olió tan bien.”',mk:'DULCE Y DIVERTIDA'},
{k:'p2',title:'Love',cut:'h140080hd.png',scene:'vid_love',ped:1160,N:[['mandarina','Mandarina'],['cardamomo','Cardamomo'],['pimientarosa','Pimienta rosa'],['neroli','Azahar'],['jazmin','Jazmín'],['praline','Praliné']],
 ins:{img:'h4322.png',n:'Love, Don’t Be Shy',mt:'BY KILIAN'},emo:'Para enamorar, desde el primer segundo.',quote:'“Un perfume que sabe a amor.”',mk:'PARA ENAMORAR'},
{k:'p3',title:'Glitz',cut:'h134816hd.png',scene:'vid_glitz',ped:1118,N:[['pera','Pera'],['avellana','Avellana'],['rosa','Rosa'],['iris','Iris'],['vainilla','Vainilla'],['caramelo','Caramelo']],
 ins:{img:'h78656.png',n:'Guidance',mt:'AMOUAGE'},emo:'Brillás, aunque no digas nada.',quote:'“Glamour en cada gota.”',mk:'GLAMOUR EN CADA GOTA'},
{k:'p4',title:'Dreams',cut:'h140081hd.png',scene:'vid_dreams',ped:1350,N:[['naranja','Naranja sanguina'],['pomelo','Pomelo'],['almizcle','Almizcle blanco'],['jazmin','Jazmín'],['iris','Iris'],['cedro','Cedro']],
 ins:{img:'h30796.png',n:'Chance Eau Vive',mt:'CHANEL'},emo:'El perfume de las que van por sus sueños.',quote:'“Fresco, suave y soñado.”',mk:'VAN POR SUS SUEÑOS'},
{k:'p5',title:'Éclat',cut:'h112708hd.png',scene:'vid_eclat',ped:1193,N:[['pera','Pera'],['bergamota','Bergamota'],['rosa','Rosa turca'],['peonia','Peonía'],['incienso','Incienso'],['vainilla','Vainilla']],
 ins:{img:'h50370.png',n:'Delina Exclusif',mt:'PARFUMS DE MARLY'},emo:'Delicada, chic, y difícil de olvidar.',quote:'“Elegancia francesa, con alma árabe.”',mk:'DELICADA Y CHIC'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'06',t:'FEMENINOS DULCES'};
