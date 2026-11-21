var P=[
{k:'p1',title:'For Her',cut:'h67146hd.png',scene:'esc_forher.jpg',ped:1196,N:[['mora','Grosella'],['pera','Pera'],['iris','Iris'],['jazmin','Jazmín'],['praline','Praliné'],['vainilla','Vainilla']],
 ins:{img:'h14982.png',n:'La Vie Est Belle',mt:'LANCÔME'},emo:'Para la mujer que sabe lo que quiere.',quote:'“La vida es bella, y huele así.”',mk:'SABE LO QUE QUIERE'},
{k:'p2',title:'Rouge',cut:'h137443hd.png',scene:'esc_rouge.jpg',ped:1173,N:[['mandarina','Mandarina'],['frambuesa','Frambuesa'],['cacao','Chocolate'],['jazmin','Jazmín'],['rosa','Rosa'],['vainilla','Vainilla']],
 ins:{img:'h48002.png',n:'Sì Passione',mt:'GIORGIO ARMANI'},emo:'Pasión pura, en cada paso.',quote:'“Rojo, intenso, irresistible.”',mk:'PASIÓN PURA'},
{k:'p3',title:'Diva',cut:'h113190hd.png',scene:'esc_diva.jpg',ped:1190,N:[['jazmin','Jazmín'],['rosa','Rosa'],['ambar','Ámbar'],['almizcle','Almizcle'],['vainilla','Vainilla bourbon'],['pimientarosa','Pimienta rosa']],
 ins:{img:'h78739.png',n:'Born in Roma Intense',mt:'VALENTINO'},emo:'Para la que entra, y se roba el show.',quote:'“Una diva no pasa desapercibida.”',mk:'SE ROBA EL SHOW'},
{k:'p4',title:'Reina',cut:'h136241hd.png',scene:'esc_reina.jpg',ped:1173,N:[['durazno','Damasco'],['pera','Pera'],['canela','Canela'],['jazmin','Jazmín'],['coco','Coco'],['vainilla','Vainilla']],
 ins:{img:'h103469.png',n:'Olympéa Absolu',mt:'RABANNE'},emo:'Porque vos naciste para reinar.',quote:'“Cremosa, frutal y adictiva.”',mk:'NACISTE PARA REINAR'},
{k:'p5',title:'Blanche',cut:'h143464hd.png',scene:'esc_blanche.jpg',ped:1193,N:[['manzana','Manzana'],['mandarina','Mandarina'],['mora','Grosella negra'],['pachuli','Pachulí'],['sandalo','Sándalo'],['almizcle','Almizcle']],
 ins:{img:'h6686.png',img2:'h23271.png',lbl:'MUCHOS LO COMPARAN CON',n:'Blanche',n2:'Galloway',mt:'BYREDO · PARFUMS DE MARLY'},emo:'Elegancia limpia, que enamora de cerca.',quote:'“Pureza con carácter.”',mk:'ELEGANCIA LIMPIA'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'07',t:'FEMENINOS FLORALES'};
