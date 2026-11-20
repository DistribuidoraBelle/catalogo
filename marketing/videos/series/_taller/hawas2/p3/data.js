var P=[
{k:'p1',title:'Elixir',cut:'h110808hd.png',scene:'esc_elixir.jpg',ped:1279,N:[['lavanda','Lavanda'],['menta','Menta'],['cacao','Chocolate'],['vainilla','Vainilla'],['miel','Miel'],['tonka','Tonka']],
 ins:{img:'h81642.png',n:'Le Male Elixir',mt:'JEAN PAUL GAULTIER'},emo:'El que se acerca, no se quiere ir más.',quote:'“Dulce, intenso y seductor.”',mk:'ORO LÍQUIDO'},
{k:'p2',title:'Overdose',cut:'h134748hd.png',scene:'esc_overdose.jpg',ped:1177,N:[['canela','Especias'],['neroli','Azahar'],['ambar','Ámbar'],['vainilla','Vainilla'],['praline','Praliné'],['cacao','Chocolate']],
 ins:{img:'h84109.png',n:'Althaïr',mt:'PARFUMS DE MARLY'},emo:'Una sobredosis de seducción.',quote:'“Cálido, cremoso y adictivo.”',mk:'SOBREDOSIS DE SEDUCCIÓN'},
{k:'p3',title:'Addiction',cut:'h137303hd.png',scene:'esc_addiction.jpg',ped:1140,N:[['caramelo','Caramelo'],['coco','Coco'],['leche','Leche'],['vainilla','Vainilla'],['ambar','Ámbar'],['cedro','Maderas']],
 ins:{lbl:'CREACIÓN ORIGINAL',n:'100% Hawas',mt:'EXCLUSIVO DE RASASI'},emo:'Probalo una vez, y no vas a poder dejarlo.',quote:'“Un postre hecho perfume.”',mk:'UN POSTRE HECHO PERFUME'},
{k:'p4',title:'Private Dulce',cut:'h139998hd.png',scene:'esc_dulce.jpg',ped:1105,N:[['avellana','Avellana'],['pimientarosa','Pimienta rosa'],['maracuya','Maracuyá'],['cacao','Cacao'],['coco','Coco'],['caramelo','Caramelo']],
 ins:{lbl:'COLECCIÓN PRIVADA',n:'Hawas Private',mt:'CREACIÓN EXCLUSIVA DE RASASI'},emo:'Para los que quieren oler distinto al resto.',quote:'“De la colección privada de Hawas.”',mk:'COLECCIÓN PRIVADA'},
{k:'p5',title:'Exotic',cut:'h130940hd.png',scene:'esc_exotic.jpg',ped:1237,N:[['lavanda','Lavanda'],['cardamomo','Cardamomo'],['coco','Coco'],['iris','Iris'],['canela','Canela'],['pachuli','Pachulí']],
 ins:{img:'h101529.png',n:'Le Male Elixir Absolu',mt:'JEAN PAUL GAULTIER'},emo:'Misterioso, magnético e imposible de ignorar.',quote:'“Un viaje a lo exótico.”',mk:'MISTERIOSO Y MAGNÉTICO'},
{k:'p6',title:'Gold Digger',cut:'h139499hd.png',scene:'esc_golddigger.jpg',ped:1173,N:[['pera','Pera'],['lavanda','Lavanda'],['menta','Menta'],['canela','Canela'],['vainilla','Vainilla'],['ambar','Ámbar']],
 ins:{img:'h30947.png',n:'Ultra Male',mt:'JEAN PAUL GAULTIER'},emo:'Huele a éxito, a ambición y a dinero.',quote:'“Para los que van por todo.”',mk:'HUELE A ÉXITO'}];
P.forEach(function(p,i){p.n='n'+(i+1);p.q='q'+(i+1);p.i='i'+(i+1);p.e='e'+(i+1);p.end=i<P.length-1?'p'+(i+2):'out';});
var INTRO_BG='esc_seda.jpg',OUTRO_BG='esc_seda.jpg',PARTE={n:'03',t:'DULCES Y ADICTIVOS'};
