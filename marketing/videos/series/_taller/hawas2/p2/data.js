var P=[
{k:'p1',title:'Nautilus',cut:'h138571hd.png',scene:'esc_nautilus.jpg',ped:1230,N:[['marino','Agua de mar'],['ambargris','Ámbar gris'],['bergamota','Bergamota'],['pino','Ciprés'],['cedro','Cedro'],['palosanto','Madera flotante']],
 ins:{img:'h16445.png',n:'40 Knots',mt:'XERJOFF'},emo:'El perfume del hombre que no le teme a nada.',quote:'“El espíritu del océano, en un frasco.”',mk:'EL ESPÍRITU DEL OCÉANO'},
{k:'p2',title:'La Mer',cut:'h139506hd.png',scene:'esc_lamer.jpg',ped:1135,N:[['menta','Menta'],['limon','Cítricos'],['mora','Grosella negra'],['jazmin','Jazmín'],['ambar','Ámbar'],['cedro','Maderas']],
 ins:{img:'h81423.png',n:'Pacific Chill',mt:'LOUIS VUITTON'},emo:'Fresco desde que te lo ponés, irresistible hasta la noche.',quote:'“El Mediterráneo, en tu piel.”',mk:'FRESCURA MEDITERRÁNEA'},
{k:'p3',title:'Malibu',cut:'h112707hd.png',scene:'esc_malibu.jpg',ped:1032,N:[['anana','Ananá'],['naranja','Naranja'],['pomelo','Pomelo'],['iris','Iris'],['lavanda','Lavanda'],['tonka','Tonka']],
 ins:{img:'h72158.png',n:'Le Beau Le Parfum',mt:'JEAN PAUL GAULTIER'},emo:'Olés a vacaciones, y todos lo van a notar.',quote:'“Atardecer en la costa de California.”',mk:'ATARDECER EN LA COSTA'},
{k:'p4',title:'Tropical',cut:'h108054hd.png',scene:'esc_tropical.jpg',ped:1250,N:[['coco','Agua de coco'],['jengibre','Jengibre'],['menta','Menta'],['sandalo','Sándalo'],['tonka','Tonka'],['almizcle','Almizcle']],
 ins:{img:'h88836.png',n:'Paradise Garden',mt:'JEAN PAUL GAULTIER'},emo:'Un perfume que no pasa desapercibido.',quote:'“Un paraíso tropical, todo el año.”',mk:'PARAÍSO TROPICAL'},
{k:'p5',title:'Boa',cut:'h143690hd.png',scene:'esc_boa.jpg',ped:1257,N:[['pomelo','Pomelo'],['manzana','Manzana verde'],['neroli','Azahar'],['incienso','Olíbano'],['tonka','Tonka'],['vainilla','Vainilla']],
 ins:{lbl:'EDICIÓN ANIVERSARIO',n:'10 años de Hawas',mt:'CREACIÓN EXCLUSIVA DE RASASI'},emo:'Exótico, hipnótico y difícil de olvidar.',quote:'“La edición especial por los diez años de Hawas.”',mk:'EDICIÓN ANIVERSARIO'},
{k:'p6',title:'Verde',cut:'hverde2hd.png',scene:'esc_verde.jpg',ped:1218,N:[['limon','Lima'],['manzana','Manzana verde'],['bergamota','Bergamota'],['pachuli','Pachulí'],['ambar','Ámbar'],['almizcle','Almizcle']],
 ins:{img:'h70424.png',n:'Torino21',mt:'XERJOFF'},emo:'Energía pura, de la mañana a la noche.',quote:'“Frescura mediterránea, llena de vida.”',mk:'ENERGÍA PURA'},
{k:'p7',title:'Kobra',cut:'h112706hd.png',scene:'esc_kobra.jpg',ped:1185,N:[['jengibre','Jengibre'],['bergamota','Bergamota'],['mandarina','Mandarina'],['te','Té negro'],['neroli','Azahar'],['canela','Canela']],
 ins:{img:'h67370.png',n:'Imagination',mt:'LOUIS VUITTON'},emo:'Elegancia oscura que no se olvida.',quote:'“Lujo fresco, con alma oscura.”',mk:'ELEGANCIA OSCURA'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'02',t:'FRESCOS Y DEL MAR'};
