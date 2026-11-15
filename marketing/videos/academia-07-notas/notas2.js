// ═══════════ NOTAS EXTRA (≈80 más) — mismo estilo que notas.js. Requiere notas.js (SW, hl, shd) ═══════════
(function(){
var S='stroke="#1a1a1a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
function leaf(x,y,a,c,s){s=s||1;return '<path d="M0 0 C 8 -10 22 -10 30 0 C 22 10 8 10 0 0 Z" transform="translate('+x+','+y+') rotate('+a+') scale('+s+')" fill="'+(c||'#4FB45E')+'" '+S+'/>';}
function round(c,r,cx,cy){return '<circle cx="'+(cx||60)+'" cy="'+(cy||62)+'" r="'+(r||42)+'" fill="'+c+'" '+S+'/>';}
function shine(x,y,r){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+r+'" ry="'+(r*0.6)+'" fill="#fff" opacity=".7" transform="rotate(-30 '+x+' '+y+')"/>';}
function dots(c,pts,r){return pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(r||2.6)+'" fill="'+c+'"/>';}).join('');}
// fruta redonda genérica con hojita
function fruit(c,c2,leafC){return round(c,42,60,64)+'<path d="M92 40 C 108 66 98 100 66 106 C 88 94 98 68 92 40 Z" fill="#000" opacity=".13"/><path d="M60 22 C 58 14 62 8 68 8" fill="none" '+S+'/>'+leaf(64,16,-20,leafC)+shine(42,46,9);}
// rodaja de cítrico
function slice(c,c2,c3){var s='<circle cx="60" cy="60" r="46" fill="'+c+'" '+S+'/><circle cx="60" cy="60" r="35" fill="'+c2+'" stroke="'+c3+'" stroke-width="4"/>';for(var i=0;i<8;i++){var a=i*Math.PI/4;s+='<path d="M60 60 L '+(60+31*Math.cos(a-0.32))+' '+(60+31*Math.sin(a-0.32))+' A 31 31 0 0 1 '+(60+31*Math.cos(a+0.32))+' '+(60+31*Math.sin(a+0.32))+' Z" fill="'+c3+'" opacity=".55"/>';}return s+'<circle cx="60" cy="60" r="4" fill="#fff"/>';}
// flor de n pétalos
function flower(n,pc,cc,pl,pw,sc2){var s='';for(var i=0;i<n;i++){s+='<ellipse cx="60" cy="'+(60-pl*0.62)+'" rx="'+pw+'" ry="'+(pl*0.62)+'" transform="rotate('+(i*360/n)+' 60 60)" fill="'+pc+'" '+S+'/>';}if(sc2){for(var i=0;i<n;i++){s+='<ellipse cx="60" cy="'+(60-pl*0.36)+'" rx="'+(pw*0.6)+'" ry="'+(pl*0.36)+'" transform="rotate('+(i*360/n+180/n)+' 60 60)" fill="'+sc2+'" '+S+'/>';}}return s+'<circle cx="60" cy="60" r="'+(pw*0.75)+'" fill="'+cc+'" '+S+'/>';}
// ramita aromática
function sprig(c,n,lw,ll){var s='<path d="M60 112 C 58 80 62 44 60 12" fill="none" stroke="#3F7A3A" stroke-width="6" stroke-linecap="round"/>';for(var i=0;i<n;i++){var y=100-i*(84/n);s+=leaf(60,y,-150+ (i%2)*0,c,ll)+leaf(60,y-5,-30,c,ll);}return s;}
function bunch(c,c2,pts,r){return pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'" fill="'+c+'" '+S+'/><circle cx="'+(p[0]-r*0.35)+'" cy="'+(p[1]-r*0.35)+'" r="'+(r*0.25)+'" fill="'+(c2||'#fff')+'" opacity=".7"/>';}).join('');}
function glass(liq,ice){return '<path d="M30 30 L 90 30 L 84 104 L 36 104 Z" fill="#EAF6FF" '+S+'/><path d="M34 60 L 86 60 L 84 104 L 36 104 Z" fill="'+liq+'" opacity=".9"/>'+(ice?'<rect x="44" y="52" width="18" height="18" rx="4" fill="#fff" opacity=".85" stroke="#1a1a1a" stroke-width="3" transform="rotate(12 53 61)"/><rect x="62" y="64" width="16" height="16" rx="4" fill="#fff" opacity=".85" stroke="#1a1a1a" stroke-width="3" transform="rotate(-10 70 72)"/>':'')+'<path d="M30 30 L 90 30 L 84 104 L 36 104 Z" fill="none" '+S+'/>';}
var X={
 frutilla:{n:'FRUTILLA',svg:'<path d="M60 108 C 30 90 18 60 26 40 C 36 26 84 26 94 40 C 102 60 90 90 60 108 Z" fill="#FF3B4E" '+S+'/>'+dots('#FFE14D',[[44,52],[60,46],[76,52],[50,68],[70,68],[60,84],[42,80],[78,80]],3)+'<path d="M36 34 L 48 22 L 54 32 L 60 18 L 66 32 L 72 22 L 84 34 Z" fill="#4FB45E" '+S+'/>'},
 cereza:{n:'CEREZA',svg:'<path d="M42 72 C 50 40 60 20 76 12 M80 76 C 78 46 78 28 76 12" fill="none" stroke="#3F7A3A" stroke-width="5" stroke-linecap="round"/>'+leaf(76,14,10,'#4FB45E',1.2)+round('#D7263D',20,40,84)+round('#E63946',20,80,86)+shine(34,78,5)+shine(74,80,5)},
 durazno:{n:'DURAZNO',svg:fruit('#FFB37A','#F28F5C','#4FB45E')+'<path d="M60 26 C 52 50 52 80 60 104" fill="none" stroke="#E8784A" stroke-width="4"/>'},
 pera:{n:'PERA',svg:'<path d="M60 22 C 72 22 74 40 76 50 C 96 62 98 100 60 106 C 22 100 24 62 44 50 C 46 40 48 22 60 22 Z" fill="#C9E34A" '+S+'/><path d="M60 22 L 62 10" '+S+'/>'+leaf(62,12,-30)+shine(46,64,8)},
 uva:{n:'UVA',svg:bunch('#8E44AD','#fff',[[44,40],[64,40],[84,42],[54,58],[74,58],[44,74],[64,76],[84,72],[54,92],[72,92],[62,106]],11).replace(/#8E44AD/g,'#8E44AD')+'<path d="M64 30 L 66 14" '+S+'/>'+leaf(66,16,-10)},
 frambuesa:{n:'FRAMBUESA',svg:bunch('#E8476F','#fff',[[48,50],[62,46],[76,52],[44,66],[58,64],[72,66],[82,68],[50,82],[64,82],[76,84],[60,98]],9)+'<path d="M46 40 L 60 30 L 74 40 Z" fill="#4FB45E" '+S+'/>'},
 mora:{n:'MORA',svg:bunch('#3A1F4E','#9b7bea',[[48,50],[62,46],[76,52],[44,66],[58,64],[72,66],[82,68],[50,82],[64,82],[76,84],[60,98]],9)+'<path d="M46 40 L 60 30 L 74 40 Z" fill="#4FB45E" '+S+'/>'},
 arandano:{n:'ARÁNDANO',svg:bunch('#3A5BA0','#BFD4FF',[[40,58],[70,48],[56,84],[86,80]],18)},
 anana:{n:'ANANÁ',svg:'<ellipse cx="60" cy="76" rx="30" ry="38" fill="#F4B63A" '+S+'/><path d="M36 60 L 84 96 M84 60 L 36 96 M34 78 L 72 106 M86 78 L 48 106 M44 44 L 84 74 M76 44 L 36 74" stroke="#C98A12" stroke-width="3"/><path d="M60 40 L 44 8 L 56 26 L 60 4 L 64 26 L 76 8 Z" fill="#4FB45E" '+S+'/>'},
 mango:{n:'MANGO',svg:'<path d="M24 66 C 20 34 60 18 86 30 C 108 42 104 86 74 100 C 48 112 28 94 24 66 Z" fill="#FFB020" '+S+'/><path d="M86 30 C 98 50 96 80 74 100 C 92 76 92 52 86 30 Z" fill="#FF6A2E" opacity=".7"/>'+leaf(80,26,-40,'#4FB45E',1.2)+shine(42,50,9)},
 banana:{n:'BANANA',svg:'<path d="M20 40 C 30 90 80 110 104 76 C 84 88 46 80 34 36 Z" fill="#FFE14D" '+S+'/><path d="M20 40 L 26 28 L 36 34" fill="#6E4128" '+S+'/><path d="M34 52 C 46 80 72 92 92 84" fill="none" stroke="#E8C21F" stroke-width="4"/>'},
 kiwi:{n:'KIWI',svg:'<circle cx="60" cy="60" r="46" fill="#8A6A3A" '+S+'/><circle cx="60" cy="60" r="38" fill="#8CC63F"/><circle cx="60" cy="60" r="14" fill="#E8F5C8"/>'+(function(){var s='';for(var i=0;i<14;i++){var a=i*Math.PI/7;s+='<ellipse cx="'+(60+22*Math.cos(a))+'" cy="'+(60+22*Math.sin(a))+'" rx="2.5" ry="4" transform="rotate('+(a*57.3+90)+' '+(60+22*Math.cos(a))+' '+(60+22*Math.sin(a))+')" fill="#1a1a1a"/>';}return s;})()},
 sandia:{n:'SANDÍA',svg:'<path d="M12 46 L 108 46 C 104 84 84 104 60 104 C 36 104 16 84 12 46 Z" fill="#2E9E4F" '+S+'/><path d="M22 46 L 98 46 C 94 76 80 94 60 94 C 40 94 26 76 22 46 Z" fill="#FF4F6E"/>'+dots('#1a1a1a',[[42,60],[60,66],[78,60],[50,78],[70,78]],3.5)},
 melon:{n:'MELÓN',svg:'<path d="M12 46 L 108 46 C 104 84 84 104 60 104 C 36 104 16 84 12 46 Z" fill="#D9E88A" '+S+'/><path d="M22 46 L 98 46 C 94 76 80 94 60 94 C 40 94 26 76 22 46 Z" fill="#FFB37A"/>'},
 higo:{n:'HIGO',svg:'<path d="M60 18 C 70 30 98 52 96 78 C 94 100 76 108 60 108 C 44 108 26 100 24 78 C 22 52 50 30 60 18 Z" fill="#7A3E6E" '+S+'/><path d="M60 18 L 62 8" '+S+'/>'+shine(44,62,8)},
 ciruela:{n:'CIRUELA',svg:fruit('#6A3FA0','#4A2A80','#4FB45E')},
 granada:{n:'GRANADA',svg:round('#C2253A',42,60,66)+'<path d="M48 26 L 52 16 L 56 24 L 60 14 L 64 24 L 68 16 L 72 26 Z" fill="#C2253A" '+S+'/>'+shine(44,50,9)},
 pomelo:{n:'POMELO',svg:slice('#FF8A5B','#FFB8A0','#FF5A6E')},
 mandarina:{n:'MANDARINA',svg:fruit('#FF8A1E','#E06A10','#3F9E52')},
 lima:{n:'LIMA',svg:slice('#4CAF50','#C8EFA0','#7CC24A')},
 maracuya:{n:'MARACUYÁ',svg:'<circle cx="60" cy="60" r="46" fill="#6A2A5A" '+S+'/><circle cx="60" cy="60" r="36" fill="#FFC93A"/>'+dots('#1a1a1a',[[50,50],[66,48],[58,62],[72,64],[46,68],[62,76],[52,82],[74,78]],4)},
 coco2:{n:'LECHE DE COCO',svg:glass('#FFFDF5',false)+'<circle cx="86" cy="30" r="14" fill="#8A5A3B" '+S+'/>'},
 // flores
 peonia:{n:'PEONÍA',svg:flower(8,'#FF9AC0','#FFD23F',56,18,'#FFB8D2')},
 tuberosa:{n:'TUBEROSA',svg:flower(6,'#FFFDF6','#FFE9A8',54,13)},
 gardenia:{n:'GARDENIA',svg:flower(6,'#FFFBEA','#F4E29A',52,17,'#FFFFFF')},
 violeta:{n:'VIOLETA',svg:flower(5,'#7B4FD6','#FFD23F',50,16)},
 iris:{n:'IRIS',svg:'<path d="M60 112 L60 64" '+S+' fill="none"/>'+flower(3,'#6C7CE0','#FFD23F',56,16,'#9AA6F0')},
 lirio:{n:'LIRIO',svg:flower(6,'#FF8A5B','#8A3A2A',58,12)},
 magnolia:{n:'MAGNOLIA',svg:flower(6,'#FFF0F5','#E8A0C0',56,20)},
 azahar:{n:'AZAHAR',svg:flower(5,'#FFFFFF','#FFC93A',44,14)+leaf(16,96,-30,'#3F9E52',1.3)},
 orquidea:{n:'ORQUÍDEA',svg:flower(5,'#D58BE8','#FFE14D',54,18,'#B65AD0')},
 girasol:{n:'GIRASOL',svg:flower(14,'#FFC93A','#6E4128',50,9)},
 fresia:{n:'FRESIA',svg:flower(6,'#FFE14D','#FF8A1E',46,15)},
 lila:{n:'LILA',svg:bunch('#B49BF2','#fff',[[60,24],[48,36],[72,36],[40,50],[60,48],[80,50],[48,64],[72,64],[60,76],[60,92]],11)},
 ylang:{n:'YLANG-YLANG',svg:flower(6,'#F2E05A','#8A7A2A',60,9)},
 sakura:{n:'FLOR DE CEREZO',svg:flower(5,'#FFC4D8','#FF6F9A',48,18)},
 camelia:{n:'CAMELIA',svg:flower(7,'#E8364F','#FFD23F',54,18,'#FF5A70')},
 geranio:{n:'GERANIO',svg:bunch('#FF4F6E','#fff',[[60,40],[42,52],[78,52],[50,70],[70,70],[60,86]],14)},
 clavel:{n:'CLAVEL',svg:flower(12,'#FF5A8A','#C2253A',50,12,'#FF8AB0')},
 loto:{n:'LOTO',svg:'<path d="M60 96 C 30 96 14 80 14 70 C 34 74 46 80 60 96 Z M60 96 C 90 96 106 80 106 70 C 86 74 74 80 60 96 Z" fill="#FF9AC0" '+S+'/><path d="M60 96 C 40 80 36 52 60 22 C 84 52 80 80 60 96 Z" fill="#FFB8D2" '+S+'/><path d="M60 96 C 44 84 30 66 32 46 C 50 58 58 76 60 96 Z M60 96 C 76 84 90 66 88 46 C 70 58 62 76 60 96 Z" fill="#FF9AC0" '+S+'/>'},
 neroli:{n:'NEROLI',svg:flower(5,'#FFFDF0','#F4B63A',46,15)+leaf(90,90,30,'#3F9E52',1.2)},
 // aromáticas
 romero:{n:'ROMERO',svg:sprig('#4E8A5E',8,0,0.6)},
 albahaca:{n:'ALBAHACA',svg:sprig('#5FCB7A',3,0,1.4)},
 salvia:{n:'SALVIA',svg:sprig('#9DB89A',4,0,1.2)},
 tomillo:{n:'TOMILLO',svg:sprig('#6E9A5A',10,0,0.45)},
 eucalipto:{n:'EUCALIPTO',svg:'<path d="M60 112 C 58 80 62 44 60 12" fill="none" stroke="#7A8A7A" stroke-width="6" stroke-linecap="round"/>'+[[96,0],[76,1],[56,0],[36,1],[18,0]].map(function(q){return '<circle cx="'+(q[1]?74:46)+'" cy="'+q[0]+'" r="14" fill="#9CC2B0" '+S+'/>';}).join('')},
 teverde:{n:'TÉ VERDE',svg:'<path d="M22 50 L 90 50 C 90 84 76 100 56 100 C 36 100 22 84 22 50 Z" fill="#fff" '+S+'/><path d="M90 58 C 108 58 108 82 88 82" fill="none" '+S+'/><ellipse cx="56" cy="50" rx="34" ry="8" fill="#8CC63F" '+S+'/><path d="M46 38 C 40 30 52 24 46 16 M64 38 C 58 30 70 24 64 16" fill="none" stroke="#9AA3AD" stroke-width="4" stroke-linecap="round"/>'},
 bambu:{n:'BAMBÚ',svg:'<rect x="34" y="10" width="20" height="100" rx="6" fill="#8CC63F" '+S+'/><rect x="66" y="22" width="20" height="88" rx="6" fill="#7CB342" '+S+'/><path d="M34 44 L 54 44 M34 78 L 54 78 M66 54 L 86 54 M66 86 L 86 86" '+S+'/>'+leaf(54,30,-20,'#5FCB7A',1.2)},
 hierba:{n:'HIERBA',svg:'<path d="M30 108 C 30 70 22 40 14 22 C 34 46 42 76 44 108 Z M52 108 C 54 64 58 34 60 10 C 66 40 66 74 64 108 Z M76 108 C 78 72 90 44 104 26 C 98 52 92 80 88 108 Z" fill="#5FCB7A" '+S+'/>'},
 laurel:{n:'LAUREL',svg:'<path d="M20 100 C 50 80 80 50 100 18" fill="none" stroke="#3F7A3A" stroke-width="5" stroke-linecap="round"/>'+[[30,92,-60],[44,80,-20],[52,72,-70],[66,58,-25],[72,48,-75],[86,34,-30]].map(function(p){return leaf(p[0],p[1],p[2],'#4E8A3E',1.2);}).join('')},
 // gourmand
 chocolate:{n:'CHOCOLATE',svg:'<rect x="20" y="24" width="80" height="76" rx="8" fill="#6E3B22" '+S+'/>'+[0,1,2].map(function(i){return '<path d="M'+(20+i*26.6)+' 24 L '+(20+i*26.6)+' 100" stroke="#4A2614" stroke-width="4"/>';}).join('')+'<path d="M20 62 L 100 62" stroke="#4A2614" stroke-width="4"/><path d="M58 24 L 100 24 L 100 50 L 80 40 Z" fill="#E8C48A" '+S+'/>'},
 miel:{n:'MIEL',svg:'<path d="M28 44 C 28 36 92 36 92 44 L 88 104 L 32 104 Z" fill="#F4B63A" '+S+'/><rect x="30" y="30" width="60" height="16" rx="6" fill="#E8C48A" '+S+'/><path d="M78 20 L 104 4" stroke="#B5622B" stroke-width="7" stroke-linecap="round"/><path d="M40 62 C 52 70 68 70 80 62" fill="none" stroke="#FFD27A" stroke-width="5"/>'},
 almendra:{n:'ALMENDRA',svg:'<path d="M60 12 C 86 30 92 70 76 98 C 68 110 52 110 44 98 C 28 70 34 30 60 12 Z" fill="#D9A06E" '+S+'/><path d="M60 22 C 52 46 52 76 58 100" fill="none" stroke="#B57E4E" stroke-width="3"/>'},
 avellana:{n:'AVELLANA',svg:'<path d="M60 30 C 92 30 100 64 94 80 C 86 102 34 102 26 80 C 20 64 28 30 60 30 Z" fill="#B5622B" '+S+'/><path d="M32 44 C 44 24 76 24 88 44 C 74 50 46 50 32 44 Z" fill="#E8C48A" '+S+'/>'},
 pistacho:{n:'PISTACHO',svg:'<path d="M60 16 C 92 28 96 80 66 104 C 32 96 24 40 60 16 Z" fill="#E8D8B0" '+S+'/><path d="M58 34 C 74 44 74 76 62 90 C 48 78 46 46 58 34 Z" fill="#8CC63F" '+S+'/>'},
 galleta:{n:'GALLETA',svg:round('#D9A06E',44,60,60)+dots('#4A2614',[[44,44],[72,40],[60,62],[40,74],[78,72],[56,86]],5)},
 malvavisco:{n:'MALVAVISCO',svg:'<rect x="24" y="36" width="44" height="50" rx="14" fill="#FFE4EC" '+S+'/><rect x="56" y="48" width="44" height="50" rx="14" fill="#FFFFFF" '+S+'/>'},
 azucar:{n:'AZÚCAR',svg:'<rect x="22" y="50" width="40" height="40" rx="6" fill="#fff" '+S+'/><rect x="58" y="40" width="40" height="40" rx="6" fill="#fff" '+S+'/><rect x="40" y="20" width="36" height="36" rx="6" fill="#fff" '+S+'/>'},
 leche:{n:'LECHE',svg:glass('#FFFFFF',false)},
 ron:{n:'RON',svg:glass('#C9782A',true)},
 whisky:{n:'WHISKY',svg:glass('#E0A040',true)},
 champagne:{n:'CHAMPAGNE',svg:'<path d="M40 14 L 80 14 C 80 50 70 64 60 64 C 50 64 40 50 40 14 Z" fill="#FFE9A8" '+S+'/><path d="M60 64 L 60 100 M42 104 L 78 104" '+S+'/>'+dots('#fff',[[54,30],[64,40],[58,50]],3)},
 cacao:{n:'CACAO',svg:'<path d="M60 10 C 92 24 98 92 60 110 C 22 92 28 24 60 10 Z" fill="#B5622B" '+S+'/><path d="M60 14 L 60 106 M44 22 C 38 50 40 84 48 100 M76 22 C 82 50 80 84 72 100" fill="none" stroke="#7A3E1A" stroke-width="3"/>'},
 praline:{n:'PRALINÉ',svg:'<path d="M20 60 C 20 34 100 34 100 60 L 96 84 C 80 100 40 100 24 84 Z" fill="#8A4A22" '+S+'/><path d="M30 52 C 50 40 70 40 90 52" fill="none" stroke="#E8C48A" stroke-width="6" stroke-linecap="round"/>'+dots('#E8C48A',[[46,66],[60,70],[74,66]],4)},
 // especias
 clavo:{n:'CLAVO DE OLOR',svg:[[40,-20],[64,10],[84,-10]].map(function(q){return '<g transform="rotate('+q[1]+' '+q[0]+' 60)"><rect x="'+(q[0]-4)+'" y="40" width="8" height="64" rx="3" fill="#6E3B22" '+S+'/><circle cx="'+q[0]+'" cy="36" r="10" fill="#8A4A22" '+S+'/></g>';}).join('')},
 anis:{n:'ANÍS ESTRELLADO',svg:(function(){var s='';for(var i=0;i<8;i++){s+='<path d="M60 60 C 54 48 54 26 60 18 C 66 26 66 48 60 60 Z" transform="rotate('+(i*45)+' 60 60)" fill="#8A4A22" '+S+'/><circle cx="'+(60+Math.cos(i*0.785-1.57)*26)+'" cy="'+(60+Math.sin(i*0.785-1.57)*26)+'" r="4" fill="#E8C48A"/>';}return s+'<circle cx="60" cy="60" r="6" fill="#6E3B22" '+S+'/>';})()},
 nuez:{n:'NUEZ MOSCADA',svg:'<ellipse cx="60" cy="62" rx="36" ry="42" fill="#A0602E" '+S+'/><path d="M40 40 C 56 50 50 70 66 80 M70 34 C 62 52 80 62 72 86" fill="none" stroke="#6E3B22" stroke-width="4" stroke-linecap="round"/>'},
 azafran:{n:'AZAFRÁN',svg:[[30,-30],[46,-12],[62,4],[78,20],[92,36]].map(function(q){return '<path d="M'+q[0]+' 104 C '+(q[0]+4)+' 70 '+(q[0]+12)+' 40 '+(q[0]+16)+' 16" fill="none" stroke="#1a1a1a" stroke-width="9" stroke-linecap="round"/><path d="M'+q[0]+' 104 C '+(q[0]+4)+' 70 '+(q[0]+12)+' 40 '+(q[0]+16)+' 16" fill="none" stroke="#E8342A" stroke-width="5" stroke-linecap="round"/>';}).join('')},
 pimientarosa:{n:'PIMIENTA ROSA',svg:bunch('#F06A8A','#fff',[[40,44],[64,40],[84,56],[48,68],[72,72],[56,92],[80,90]],12)},
 comino:{n:'COMINO',svg:[[30,40,-30],[60,30,10],[86,48,40],[40,74,20],[70,70,-20],[56,98,0]].map(function(p){return '<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="12" ry="5" transform="rotate('+p[2]+' '+p[0]+' '+p[1]+')" fill="#B08A46" '+S+'/>';}).join('')},
 enebro:{n:'ENEBRO',svg:bunch('#4A6AA8','#C9D8FF',[[40,50],[66,42],[86,62],[52,78],[78,86]],14)+leaf(20,30,20,'#3F7A5A',0.9)},
 // maderas y otros
 vetiver:{n:'VETIVER',svg:'<path d="M60 52 C 40 70 30 90 26 110 M60 52 C 56 76 54 94 56 112 M60 52 C 76 72 86 92 92 110" fill="none" stroke="#8A6A3A" stroke-width="5" stroke-linecap="round"/><path d="M60 54 C 56 34 46 18 34 8 M60 54 C 62 30 64 16 62 4 M60 54 C 68 32 80 18 92 10" fill="none" stroke="#5E9E4A" stroke-width="6" stroke-linecap="round"/>'},
 pino:{n:'PINO',svg:'<path d="M60 10 L 96 92 L 24 92 Z" fill="#2E7D4F" '+S+'/><path d="M60 30 L 84 82 L 36 82 Z" fill="#3E9E62"/><rect x="52" y="92" width="16" height="20" fill="#8A5A3B" '+S+'/>'},
 pina:{n:'PIÑA DE PINO',svg:'<ellipse cx="60" cy="62" rx="30" ry="44" fill="#9A6A3E" '+S+'/>'+[30,46,62,78].map(function(y){return '<path d="M34 '+y+' Q 47 '+(y+12)+' 60 '+y+' Q 73 '+(y+12)+' 86 '+y+'" fill="none" stroke="#6E4520" stroke-width="4"/>';}).join('')},
 musgo:{n:'MUSGO DE ROBLE',svg:bunch('#7FA05A','#C9E3A0',[[30,80],[50,70],[70,74],[90,82],[40,92],[64,94],[84,98]],14)+'<path d="M14 100 L 106 100" '+S+'/>'},
 abedul:{n:'ABEDUL',svg:'<rect x="38" y="8" width="44" height="104" rx="8" fill="#F4F1EA" '+S+'/><path d="M44 30 L 58 30 M62 52 L 78 52 M42 74 L 56 74 M64 92 L 76 92" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/>'},
 palosanto:{n:'PALO SANTO',svg:'<rect x="20" y="52" width="84" height="18" rx="6" fill="#D9B07A" '+S+' transform="rotate(-20 60 60)"/><rect x="16" y="70" width="84" height="18" rx="6" fill="#C99A5E" '+S+' transform="rotate(-20 60 80)"/><path d="M96 36 C 90 26 100 20 94 10" fill="none" stroke="#9AA3AD" stroke-width="4" stroke-linecap="round"/>'},
 tabaco:{n:'TABACO',svg:'<path d="M60 112 C 18 92 14 42 60 8 C 106 42 102 92 60 112 Z" fill="#9A6A3A" '+S+'/><path d="M60 106 L60 20 M60 50 L40 38 M60 66 L82 54 M60 84 L42 74" '+S+' fill="none"/>'},
 sal:{n:'SAL MARINA',svg:'<path d="M20 100 C 30 80 90 80 100 100 Z" fill="#9FD8FF" '+S+'/>'+[[40,70],[60,60],[80,72],[52,84],[70,86]].map(function(p){return '<rect x="'+(p[0]-8)+'" y="'+(p[1]-8)+'" width="16" height="16" rx="3" fill="#fff" '+S+' transform="rotate(20 '+p[0]+' '+p[1]+')"/>';}).join('')},
 marino:{n:'BRISA MARINA',svg:'<path d="M10 70 C 30 50 50 50 60 70 C 70 90 92 90 110 70 L 110 110 L 10 110 Z" fill="#3DB8F5" '+S+'/><path d="M10 50 C 30 30 50 30 60 50 C 70 70 92 70 110 50" fill="none" stroke="#9FE0FF" stroke-width="8" stroke-linecap="round"/>'},
 ozono:{n:'OZONO',svg:'<path d="M24 66 C 10 66 10 44 26 42 C 26 24 50 18 58 32 C 66 16 92 20 92 40 C 108 40 110 66 94 68 Z" fill="#DDF3FF" '+S+'/>'+dots('#3DB8F5',[[36,84],[56,94],[76,86],[46,104],[70,106]],4)},
 algodon:{n:'ALGODÓN',svg:bunch('#FFFFFF','#E0E8F0',[[44,46],[72,44],[58,64],[38,72],[80,70]],18)+'<path d="M58 88 L 58 112" stroke="#8A6A3A" stroke-width="6" stroke-linecap="round"/>'},
 jabon:{n:'JABÓN',svg:'<rect x="20" y="50" width="80" height="44" rx="16" fill="#BFE8FF" '+S+'/>'+[[40,36,10],[64,26,14],[86,40,8]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+p[2]+'" fill="#fff" opacity=".8" stroke="#3DB8F5" stroke-width="3"/>';}).join('')},
 cashmere:{n:'CASHMERE',svg:round('#E8C9D8',40,60,60)+'<path d="M28 50 C 50 40 80 44 96 62 M24 70 C 46 58 80 64 92 84 M40 30 C 50 50 50 80 40 96" fill="none" stroke="#C99AB0" stroke-width="4"/>'},
 gamuza:{n:'GAMUZA',svg:'<path d="M22 30 C 40 20 80 20 98 30 C 104 52 104 72 98 92 C 80 102 40 102 22 92 C 16 72 16 52 22 30 Z" fill="#C99A6A" '+S+'/>'+dots('#A87A4A',[[40,46],[60,56],[80,48],[50,76],[74,78]],3)},
 ambargris:{n:'ÁMBAR GRIS',svg:'<path d="M20 70 C 16 44 44 30 66 34 C 92 38 106 58 98 80 C 90 100 40 104 20 70 Z" fill="#A8A096" '+S+'/>'+dots('#7A7268',[[44,56],[66,50],[56,74],[80,70]],5)},
 humo:{n:'HUMO',svg:'<path d="M40 110 C 20 90 60 80 40 60 C 20 40 60 30 50 10" fill="none" stroke="#9AA3AD" stroke-width="10" stroke-linecap="round"/><path d="M76 110 C 56 90 96 80 76 60 C 56 40 96 30 86 14" fill="none" stroke="#C0C7CF" stroke-width="8" stroke-linecap="round"/>'},
 nieve:{n:'MENTA HELADA',svg:(function(){var s='';for(var i=0;i<6;i++){s+='<g transform="rotate('+(i*60)+' 60 60)"><path d="M60 60 L 60 12 M60 28 L 50 18 M60 28 L 70 18 M60 44 L 50 34 M60 44 L 70 34" stroke="#3DB8F5" stroke-width="6" stroke-linecap="round"/></g>';}return s+'<circle cx="60" cy="60" r="8" fill="#fff" '+S+'/>';})()},
 te:{n:'TÉ NEGRO',svg:'<path d="M22 50 L 90 50 C 90 84 76 100 56 100 C 36 100 22 84 22 50 Z" fill="#fff" '+S+'/><path d="M90 58 C 108 58 108 82 88 82" fill="none" '+S+'/><ellipse cx="56" cy="50" rx="34" ry="8" fill="#8A4A22" '+S+'/>'},
 papiro:{n:'PAPIRO',svg:'<path d="M60 112 L 60 40" stroke="#3F7A3A" stroke-width="6"/>'+(function(){var s='';for(var i=0;i<12;i++){var a=-150+i*10;s+='<path d="M60 40 L '+(60+Math.cos(a*Math.PI/180)*50)+' '+(40+Math.sin(a*Math.PI/180)*50)+'" stroke="#5FCB7A" stroke-width="4" stroke-linecap="round"/>';}return s;})()},
 seda:{n:'SEDA',svg:'<path d="M14 40 C 40 20 60 60 106 30 L 106 80 C 60 110 40 70 14 90 Z" fill="#F4E6FF" '+S+'/><path d="M20 60 C 44 44 62 80 100 54" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>'},
 piedra:{n:'MINERAL',svg:'<path d="M20 80 L 40 34 L 76 24 L 100 56 L 88 96 L 44 100 Z" fill="#B0BAC4" '+S+'/><path d="M40 34 L 58 64 L 100 56 M58 64 L 44 100" fill="none" '+S+'/>'}
};
for(var k in X){NOTAS[k]={n:X[k].n,g:'extra',c:'#fff',svg:X[k].svg};}
})();
