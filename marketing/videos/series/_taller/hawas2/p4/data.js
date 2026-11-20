var P=[
{k:'p1',title:'Black',cut:'h96817hd.png',scene:'esc_black.jpg',ped:1440,N:[['bergamota','Bergamota'],['anana','Ananá'],['pomelo','Pomelo'],['jazmin','Jazmín'],['pachuli','Pachulí'],['cedro','Maderas']],
 ins:{img:'h44174hd.png',n:'Hacivat',mt:'NISHANE'},emo:'Entrás, y te llevás todas las miradas.',quote:'“El misterio hecho perfume.”',mk:'EL MISTERIO HECHO PERFUME'},
{k:'p2',title:'Fire',cut:'h101665hd.png',scene:'esc_fire.jpg',ped:1187,N:[['marino','Notas marinas'],['jazmin','Jazmín'],['ambar','Ámbar'],['ambargris','Ámbar gris']],
 ins:{img:'h80051.png',lbl:'CREACIÓN PROPIA · MUCHOS DICEN',n:'Imperial Valley',mt:'GISSAH'},emo:'Para el que enciende cualquier lugar al que llega.',quote:'“Fresco por fuera, fuego por dentro.”',mk:'FUEGO POR DENTRO'},
{k:'p3',title:'Viper',cut:'h113594hd.png',scene:'esc_viper.jpg',ped:1223,N:[['azafran','Azafrán'],['tabaco','Tabaco'],['canela','Canela'],['frambuesa','Frambuesa'],['violeta','Violeta'],['tonka','Tonka']],
 ins:{img:'h6472.png',n:'Black Afgano',mt:'NASOMATTO'},emo:'Peligrosamente irresistible.',quote:'“El más ahumado de toda la serie.”',mk:'PELIGROSAMENTE IRRESISTIBLE'},
{k:'p4',title:'Venom',cut:'h138569hd.png',scene:'esc_venom.jpg',ped:1150,N:[['incienso','Incienso'],['ambar','Ládano'],['cuero','Cuero'],['pachuli','Pachulí'],['vainilla','Vainilla']],
 ins:{img:'h72618.png',img2:'h1826.png',lbl:'MUCHOS LO ASOCIAN A',n:'Le Gemme Orom',n2:'Oud Wood',mt:'BVLGARI · TOM FORD'},emo:'Un veneno del que nadie se quiere curar.',quote:'“El lado más oscuro de Hawas.”',mk:'EL LADO MÁS OSCURO'},
{k:'p5',title:'Lava Gold',cut:'h130939hd.png',scene:'esc_lavagold.jpg',ped:1060,N:[['anana','Ananá'],['pomelo','Pomelo'],['cuero','Cuero'],['oud','Oud'],['azafran','Azafrán'],['caramelo','Caramelo']],
 ins:{lbl:'INSPIRADO EN',n:'La lava dorada',mt:'CREACIÓN PROPIA DE HAWAS'},emo:'Cuando llegás, la temperatura sube.',quote:'“Oro fundido sobre tu piel.”',mk:'ORO FUNDIDO'},
{k:'p6',title:'Thunder',cut:'h130938hd.png',scene:'esc_thunder.jpg',ped:1246,N:[['bergamota','Bergamota'],['jengibre','Jengibre'],['manzana','Manzana'],['pimienta','Especias'],['cedro','Maderas'],['ambar','Ámbar']],
 ins:{img:'h107428.png',n:'MYSLF L’Absolu',mt:'YVES SAINT LAURENT'},emo:'Llega como una tormenta, y deja huella.',quote:'“La fuerza de la tormenta, en un frasco.”',mk:'LA FUERZA DE LA TORMENTA'},
{k:'p7',title:'Alpha',cut:'h140182hd.png',scene:'esc_alpha2.jpg',ped:1080,N:[['pomelo','Pomelo rosado'],['jengibre','Jengibre'],['cuero','Cuero'],['jazmin','Jazmín'],['pachuli','Pachulí'],['ambargris','Ámbar gris']],
 ins:{img:'h102882.png',n:'Forever Wanted Elixir',mt:'AZZARO'},emo:'Para el que nació para liderar.',quote:'“La nueva era de Hawas.”',mk:'NACIDO PARA LIDERAR'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'04',t:'OSCUROS E INTENSOS'};
