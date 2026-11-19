var P=[
{k:'p1',title:'For Him',cut:'h46890hd.png',scene:'esc_him.jpg',ped:1205,N:[['manzana','Manzana'],['bergamota','Bergamota'],['canela','Canela'],['ambargris','Ámbar gris'],['marino','Marino'],['cedro','Madera']],
 ins:{img:'h34506hd.png',n:'Invictus Aqua',mt:'RABANNE · 2016'},emo:'Con este perfume, no se te resiste nadie.',quote:'“Fresco, dulce y magnético.”',mk:'EL MÁS VENDIDO DE RASASI'},
{k:'p2',title:'Ice',cut:'h89050hd.png',scene:'esc_ice.jpg',ped:1265,N:[['manzana','Manzana'],['limon','Limón'],['anis','Anís'],['almizcle','Almizcle'],['ambar','Ámbar'],['cedro','Madera']],
 ins:{img:'h48760hd.png',n:'Invictus Aqua',mt:'RABANNE · 2018'},emo:'El olor de un hombre elegante y decidido.',quote:'“Un golpe de frescura que dura todo el día.”',mk:'EL MÁS FRESCO'},
{k:'p3',title:'Ice Freeze',cut:'h144189hd.png',scene:'esc_freeze.jpg',ped:1145,N:[['mandarina','Mandarina'],['naranja','Naranja'],['menta','Menta'],['jengibre','Jengibre'],['bergamota','Bergamota'],['sandalo','Sándalo']],
 ins:{img:'h53947.png',img2:'h120529.png',n:'Afternoon Swim',n2:'Y Iced Cologne',mt:'LOUIS VUITTON · YVES SAINT LAURENT',lbl:'¿EN QUIÉN SE INSPIRA?'},emo:'Tan fresco que te van a pedir que te acerques.',quote:'“Cítrico, helado y adictivo.”',mk:'LO NUEVO DE LOS ICE'},
{k:'p4',title:'Ice Ultradose',cut:'hultradosehd.png',scene:'esc_ultra.jpg',ped:1252,N:[['manzana','Manzana'],['limon','Limón'],['menta','Menta'],['canela','Canela'],['cardamomo','Cardamomo'],['tonka','Tonka']],
 ins:{img:'h89050hd.png',n:'Hawas Ice',mt:'',lbl:'LA VERSIÓN MÁS INTENSA DE'},emo:'Para el que quiere que lo recuerden toda la noche.',quote:'“El Ice, llevado al máximo.”',mk:'MÁS INTENSO · MÁS DURADERO'},
{k:'p5',title:'Atlantis',cut:'hatl2hd.png',scene:'esc_atlantis.jpg',ped:1350,N:[['manzana','Manzana'],['limon','Limón'],['ciruela','Ciruela'],['canela','Canela'],['ambargris','Ámbar gris'],['marino','Marino']],
 ins:{img:'h54323.png',n:'Invictus Legend',mt:'RABANNE'},emo:'Una leyenda que se siente a metros.',quote:'“El misterio del océano profundo.”',mk:'EDICIÓN LEYENDA'},
{k:'p6',title:'Sapphire',cut:'h136382hd.png',scene:'esc_sapphire.jpg',ped:1274,N:[['mora','Grosella'],['bergamota','Bergamota'],['neroli','Azahar'],['sandalo','Sándalo'],['tonka','Tonka'],['ambargris','Ámbar gris']],
 ins:{lbl:'CREACIÓN ORIGINAL',n:'100% Hawas',mt:'EXCLUSIVO DE RASASI'},emo:'Nadie va a tener tu mismo perfume.',quote:'“Una joya azul, única.”',mk:'CREACIÓN ORIGINAL'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'01',t:'LOS ÍCONOS'};
