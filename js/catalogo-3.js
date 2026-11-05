

// ═══════════════════════════════════════════════════════════════════
// 💐 PLANTILLA DE CAMPAÑA "DÍA DE LA MADRE" (2026-09-25) — PLANTILLA_MADRE_INTEGRADA
// Una campaña con plantilla='madre' dibuja su pestaña así: portada animada, cinta de mensajes,
// cinta rosa en zigzag con los productos de la campaña a los costados y viñetas animadas.
// Usa lo mismo que el resto del catálogo: getTabProds() (productos de la pestaña + campaña),
// calcP() (precios con ofertas), logos de marcas y el carrito real. Textos: plantilla_textos.
// ═══════════════════════════════════════════════════════════════════
var CORAZON="M0 8 C-14 -6 -14 -20 0 -14 C14 -20 14 -6 0 8Z";
var VINETAS=[
  // 1) mamá y nena de la mano, corazones
  function(){ return '<svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">'+
    '<g transform="translate(110 186)"><g class="cuerpo"><path d="M-34 0 L-20 -98 L20 -98 L34 0 Z" fill="#765BA7"/><path d="M-34 0 L-20 -98 L20 -98 L34 0 Z" fill="url(#tramaV)"/><path d="M20 -92 Q46 -90 56 -70" fill="none" stroke="#F2C9A8" stroke-width="11" stroke-linecap="round"/><rect x="-6" y="-108" width="12" height="14" fill="#F2C9A8"/><g class="cabeza"><circle cx="0" cy="-124" r="22" fill="#F2C9A8"/><path d="M-24 -128 Q-18 -156 0 -154 Q18 -156 24 -128 Q12 -140 0 -140 Q-12 -140 -24 -128Z" fill="#FF6C2F"/><circle cx="0" cy="-152" r="9" fill="#FF6C2F"/><g class="ojos" style="transform-box:fill-box;transform-origin:50% 50%"><circle cx="-8" cy="-124" r="2.4" fill="#3A2B63"/><circle cx="8" cy="-124" r="2.4" fill="#3A2B63"/></g><path d="M-7 -114 Q0 -108 7 -114" fill="none" stroke="#3A2B63" stroke-width="2" stroke-linecap="round"/></g></g></g>'+
    '<g transform="translate(176 188)"><g class="nena"><path d="M-16 0 L-10 -44 L10 -44 L16 0 Z" fill="#FFE800"/><path d="M-10 -40 Q-22 -46 -30 -60" fill="none" stroke="#F2C9A8" stroke-width="7" stroke-linecap="round"/><rect x="-4" y="-52" width="8" height="10" fill="#F2C9A8"/><g class="cabeza"><circle cx="0" cy="-64" r="14" fill="#F2C9A8"/><path d="M-15 -66 Q-10 -84 0 -82 Q10 -84 15 -66 Q7 -74 0 -74 Q-7 -74 -15 -66Z" fill="#3A2B63"/><circle cx="-17" cy="-68" r="5" fill="#3A2B63"/><circle cx="17" cy="-68" r="5" fill="#3A2B63"/><circle cx="-5" cy="-64" r="1.8" fill="#3A2B63"/><circle cx="5" cy="-64" r="1.8" fill="#3A2B63"/><path d="M-4 -58 Q0 -54 4 -58" fill="none" stroke="#3A2B63" stroke-width="1.6" stroke-linecap="round"/></g></g></g>'+
    '<g transform="translate(120 70)"><path class="corazon" d="'+CORAZON+'" fill="#FF48B0"/><g transform="translate(34 -10) scale(.7)"><path class="corazon c2" d="'+CORAZON+'" fill="#FFE800"/></g><g transform="translate(-30 -4) scale(.8)"><path class="corazon c3" d="'+CORAZON+'" fill="#FF6C2F"/></g></g>'+
    '</svg>'; },
  // 2) dos gatitos jugando con un ovillo
  function(){ return '<svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">'+
    '<g transform="translate(70 160)"><g class="cola"><path d="M-22 -10 Q-52 -14 -50 -46" fill="none" stroke="#765BA7" stroke-width="7" stroke-linecap="round"/></g><ellipse cx="0" cy="-14" rx="30" ry="16" fill="#765BA7"/><g transform="translate(22 -30)"><g class="gato-cabeza"><circle r="15" fill="#765BA7"/><path d="M-13 -8 L-10 -24 L-1 -12Z" fill="#765BA7"/><path d="M13 -8 L10 -24 L1 -12Z" fill="#765BA7"/><g class="ojos" style="transform-box:fill-box;transform-origin:50% 50%"><ellipse cx="-5" cy="-2" rx="2.6" ry="3.4" fill="#FFE800"/><ellipse cx="5" cy="-2" rx="2.6" ry="3.4" fill="#FFE800"/></g><path d="M-2 3 l2 2 2 -2z" fill="#FF48B0"/></g></g></g>'+
    '<g transform="translate(200 164) scale(-1 1)"><g class="cola" style="animation-delay:.5s"><path d="M-22 -10 Q-52 -14 -50 -46" fill="none" stroke="#FF6C2F" stroke-width="7" stroke-linecap="round"/></g><ellipse cx="0" cy="-14" rx="28" ry="15" fill="#FF6C2F"/><g transform="translate(20 -28)"><g class="gato-cabeza" style="animation-delay:.7s"><circle r="14" fill="#FF6C2F"/><path d="M-12 -8 L-9 -22 L-1 -11Z" fill="#FF6C2F"/><path d="M12 -8 L9 -22 L1 -11Z" fill="#FF6C2F"/><g class="ojos" style="transform-box:fill-box;transform-origin:50% 50%;animation-delay:1.7s"><ellipse cx="-5" cy="-2" rx="2.4" ry="3.2" fill="#3A2B63"/><ellipse cx="5" cy="-2" rx="2.4" ry="3.2" fill="#3A2B63"/></g><path d="M-2 3 l2 2 2 -2z" fill="#3A2B63"/></g></g></g>'+
    '<g transform="translate(134 150)"><g class="lat"><circle r="16" fill="#FFE800"/><path d="M-12 -6 Q0 4 12 -6 M-12 6 Q0 -4 12 6 M-6 -14 Q4 0 -6 14" fill="none" stroke="#FF6C2F" stroke-width="2"/></g></g>'+
    '<g transform="translate(134 90)"><path class="corazon" d="'+CORAZON+'" fill="#FF48B0"/><g transform="translate(28 -12) scale(.6)"><path class="corazon c3" d="'+CORAZON+'" fill="#765BA7"/></g></g>'+
    '</svg>'; },
  // 3) nene con un ramo y un regalo
  function(){ return '<svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">'+
    '<g transform="translate(100 186)"><g class="nene"><path d="M-22 0 L-15 -66 L15 -66 L22 0 Z" fill="#0078BF"/><path d="M-22 0 L-15 -66 L15 -66 L22 0 Z" fill="url(#tramaV)"/><path d="M15 -60 Q40 -66 52 -90" fill="none" stroke="#F2C9A8" stroke-width="9" stroke-linecap="round"/><rect x="-5" y="-76" width="10" height="12" fill="#F2C9A8"/><g class="cabeza"><circle cx="0" cy="-92" r="20" fill="#F2C9A8"/><path d="M-21 -96 Q-12 -120 6 -116 Q20 -116 21 -96 Q8 -108 -4 -106 Q-14 -104 -21 -96Z" fill="#3A2B63"/><g class="ojos" style="transform-box:fill-box;transform-origin:50% 50%"><circle cx="-7" cy="-92" r="2.4" fill="#3A2B63"/><circle cx="7" cy="-92" r="2.4" fill="#3A2B63"/></g><path d="M-6 -82 Q0 -76 6 -82" fill="none" stroke="#3A2B63" stroke-width="2" stroke-linecap="round"/></g>'+
    '<g transform="translate(56 -92)"><g class="flor"><line x1="0" y1="0" x2="0" y2="-6" stroke="#00A95C" stroke-width="3"/><g transform="translate(0 -16)"><circle r="6" cx="0" cy="-8" fill="#FF48B0"/><circle r="6" cx="8" cy="0" fill="#FF48B0"/><circle r="6" cx="0" cy="8" fill="#FF48B0"/><circle r="6" cx="-8" cy="0" fill="#FF48B0"/><circle r="4" fill="#FFE800"/></g><g transform="translate(-12 -8)"><circle r="5" cx="0" cy="-6" fill="#765BA7"/><circle r="5" cx="6" cy="0" fill="#765BA7"/><circle r="5" cx="0" cy="6" fill="#765BA7"/><circle r="5" cx="-6" cy="0" fill="#765BA7"/><circle r="3" fill="#FFE800"/></g></g></g></g></g>'+
    '<g transform="translate(180 150)"><g class="globo"><rect x="-26" y="-26" width="52" height="46" fill="#FF6C2F"/><rect x="-26" y="-26" width="52" height="46" fill="url(#tramaV)"/><rect x="-30" y="-36" width="60" height="14" fill="#FF6C2F"/><rect x="-5" y="-36" width="10" height="56" fill="#FFE800"/><path d="M-14 -44 Q0 -30 0 -36 Q0 -30 14 -44 Q6 -46 0 -40 Q-6 -46 -14 -44Z" fill="#FFE800" stroke="#3A2B63" stroke-width="1.2"/></g></g>'+
    '<g transform="translate(60 60)"><path class="corazon c2" d="'+CORAZON+'" fill="#FF48B0"/><g transform="translate(40 8) scale(.65)"><path class="corazon c4" d="'+CORAZON+'" fill="#FF6C2F"/></g></g>'+
    '</svg>'; },
  // 4) corazón grande latiendo con mariposa
  function(){ return '<svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">'+
    '<g transform="translate(130 110)"><g transform="scale(4.4)"><path class="lat" d="'+CORAZON+'" fill="#FF48B0"/></g><path transform="translate(4 4) scale(4.4)" d="'+CORAZON+'" fill="#765BA7" opacity=".28"/><path transform="scale(4.4)" d="'+CORAZON+'" fill="url(#tramaV)"/></g>'+
    '<g transform="translate(220 60)"><g class="mariposa"><g class="ala"><ellipse cx="-8" cy="-4" rx="9" ry="6" fill="#FFE800" stroke="#3A2B63" stroke-width="1"/><ellipse cx="-7" cy="5" rx="6" ry="4.5" fill="#FF6C2F" stroke="#3A2B63" stroke-width="1"/></g><g class="ala d"><ellipse cx="8" cy="-4" rx="9" ry="6" fill="#FFE800" stroke="#3A2B63" stroke-width="1"/><ellipse cx="7" cy="5" rx="6" ry="4.5" fill="#FF6C2F" stroke="#3A2B63" stroke-width="1"/></g><ellipse rx="2" ry="8" fill="#3A2B63"/></g></g>'+
    '<g transform="translate(130 70)"><g transform="scale(.7)"><path class="corazon" d="'+CORAZON+'" fill="#FFE800"/></g><g transform="translate(-40 10) scale(.6)"><path class="corazon c2" d="'+CORAZON+'" fill="#FF6C2F"/></g><g transform="translate(44 6) scale(.6)"><path class="corazon c3" d="'+CORAZON+'" fill="#765BA7"/></g></g>'+
    '<text x="130" y="186" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="30" font-weight="700" fill="#3A2B63" font-style="italic">para mamá</text>'+
    '</svg>'; }
];

var MADRE_TEXTOS_DEF={kicker:'Especial · 18 de octubre',titulo1:'Día de la',titulo2:'Madre',lead:'Un perfume es un abrazo que se queda todo el día. Las mejores promociones para mamá, con envío gratis en Córdoba.',fecha:'Regalos con envío hasta el sábado 17',boton:'Ver los regalos ♥',tapa:'Tu regalo\npara *mamá*',msjs:['Envío gratis en Córdoba','Pagás cuando lo recibís','100% originales','Precio VIP llevando 10 o más','Regalos con envío hasta el sábado 17','Precio x3 desde 1 unidad'],whatsapp:'5493515121193',wa_texto:'Hola! Quiero un perfume para mamá',cierre_titulo:'¿No sabés cuál elegir?',cierre_texto:'Contanos cómo es ella (dulce, fresca, elegante, intensa) y te armamos una terna en el momento. Envío gratis en Córdoba, pagás cuando lo recibís.',cierre_boton:'Hablar por WhatsApp',boton_ayuda:'Que me ayuden a elegir'};
var _madreCampId=null;
function _campConPlantilla(slug){
  var t=(pestanasCatalogo||[]).find(function(x){ return x.slug===slug; }); if(!t) return null;
  var c=(window._ofertaCampanias||[]).find(function(x){ return x.pestana_id===t.id; });
  // 2026-10-08: sin oferta vigente la plantilla no aplica (la pestaña se oculta y, si estaba abierta, se vuelve al inicio)
  if(c && c.plantilla==='madre' && !window._catVistaPrevia && !_campVigente(c)) return null;
  return (c && c.plantilla==='madre')?c:null;
}
function _mEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function _mPartes(nombre){
  var s=String(nombre||''); var marca='', resto=s;
  var i=s.indexOf(' - '); if(i>0){ marca=s.slice(0,i).trim(); resto=s.slice(i+3); }
  var tr=resto.split('|').map(function(x){return x.trim();}).filter(Boolean);
  return {marca:marca, nombre:tr[0]||resto, chips:tr.slice(1)};
}
function _madreTextos(camp){
  var t={}; for(var k in MADRE_TEXTOS_DEF) t[k]=MADRE_TEXTOS_DEF[k];
  var pt=camp&&camp.plantilla_textos; if(typeof pt==='string'){ try{ pt=JSON.parse(pt); }catch(e){ pt=null; } }
  if(pt&&typeof pt==='object'){ for(var k2 in pt){ if(pt[k2]!=null && pt[k2]!=='' && !(Array.isArray(pt[k2])&&!pt[k2].length)) t[k2]=pt[k2]; } }
  if(typeof t.msjs==='string') t.msjs=t.msjs.split('\n').map(function(x){return x.trim();}).filter(Boolean);
  return t;
}
function _madreProductos(){
  var lista=(typeof getTabProds==='function'?getTabProds():[])||[];
  lista=lista.filter(function(p){ return p.activo!==false && !p.oculto && (p.stock_actual||0)>0 && /^http/.test(p.imagen_url||''); });
  // 2026-10-08: los productos con orden manual en la campaña van primero (debajo de los combos)
  try{ if(typeof _pxOrdenarArriba==='function') lista=_pxOrdenarArriba(lista); }catch(e){}
  return lista;
}
// 2026-10-08: ¿la campaña está vigente? (activa y con al menos una oferta en fecha)
// 2026-10-09: id de la campaña vigente a la que pertenece algún ítem del carrito (producto de la campaña o combo de la campaña)
function _campAtribuirPedido(items){
  var camps=(window._ofertaCampanias||[]).filter(function(c){ return _campVigente(c); });
  if(!camps.length) return null;
  var hit=null;
  (items||[]).forEach(function(it){
    if(hit) return;
    if(it.isCombo){
      var co=(window.combosPublicos||[]).find(function(x){ return x.id===it.comboId; });
      if(co&&co.campania_id&&camps.some(function(c){ return c.id===co.campania_id; })) hit=co.campania_id;
      return;
    }
    if(it.isRegalo||it.isBonificado) return;
    var pid=Number((it.isDecan||it.isCosm)?it.prodId:it.id); if(!pid) return;
    camps.forEach(function(c){
      if(hit) return;
      var ids=(window._ofertaCampaniaProductos||{})[c.id]||[];
      if(ids.some(function(x){ return Number(x)===pid; })) hit=c.id;
    });
  });
  return hit;
}
function _campVigente(c){
  if(!c||!c.activa) return false;
  var ahora=Date.now();
  return (window._ofertas||[]).some(function(o){
    if(o.campania_id!==c.id||!o.activa) return false;
    if(o.fecha_desde&&new Date(o.fecha_desde).getTime()>ahora) return false;
    if(o.fecha_hasta&&new Date(o.fecha_hasta).getTime()<=ahora) return false;
    return true;
  });
}
// 2026-10-08: re-dibuja la plantilla si está abierta (cambios de stock, login VIP, fin de oferta)
function _madreRefrescar(){
  try{
    if(!_campConPlantilla(curTab)) return;
    var pg=document.getElementById('madrePage'); if(!pg) return;
    _madreCargar();
  }catch(e){}
}
function _madreQty(id,d){ var st=cstate[id]||{qty:0}; st.qty=Math.max(0,(st.qty||0)+d); cstate[id]=st; var s=document.getElementById('mq_'+id); if(s)s.textContent=st.qty; }
function _madreAgregar(id){ addCart(id); var st=cstate[id]||{qty:0}; var s=document.getElementById('mq_'+id); if(s)s.textContent=st.qty||0; }
function _madreDecanQty(id,d){ if(typeof decanState==='undefined') window.decanState={}; decanState[id]=Math.max(0,(decanState[id]||0)+d); var s=document.getElementById('mdq_'+id); if(s)s.textContent=decanState[id]; }
var _madreTxAct=null;
// cartelito sobre la foto ("Tu regalo" / "para mamá"): cada línea del texto va en un renglón
function _madreTapaHTML(){
  var tx=String((_madreTxAct&&_madreTxAct.tapa)||MADRE_TEXTOS_DEF.tapa||'').split('\n').map(function(x){return x.trim();}).filter(Boolean);
  if(!tx.length) return '';
  // *palabra* → resaltada (negrita y blanca)
  return '<span class="md-tapa'+(tx.length>1?' md-tapa2':'')+'">'+tx.map(function(l){return '<em>'+_mEsc(l).replace(/\*([^*]+)\*/g,'<b>$1</b>')+'</em>';}).join('')+'</span>';
}
// Cuenta VIP / cuenta corriente logueada en el catálogo (ve el precio x10 siempre)
function _madreEsVip(){ return !!(typeof _catCliente!=='undefined' && _catCliente && (_catCliente.cuenta_corriente_habilitada || _catCliente.precio_mayorista)); }
// Qué precio va grande y cuáles chicos, según la oferta que tenga la campaña.
// Antes iba siempre el x10 como "Precio VIP", aunque la oferta fuera "x3 sin mínimo" y no hubiera cuenta logueada.
function _madrePrecios(r){
  var t=r.oferta_tipo||'', vip=_madreEsVip();
  var o1={n:'Precio de lista',v:r.pi}, o3={n:'3 o más',v:r.pe}, o10={n:'10 o más',v:r.pm};
  if(vip) return {titulo:'Precio VIP', precio:Math.min(r.pm, r.pe||r.pm, r.pi||r.pm), otros:[]};
  if(t==='precio_unico') return {titulo:'Precio promo', precio:r.precio_unico||r.pi, otros:[{n:'Antes',v:r.pi_orig||r.pi,tachado:true}]};
  if(t==='descuento_pct') return {titulo:(r.descuento_pct?Math.round(r.descuento_pct)+'% off':'Precio promo'), precio:r.pi, otros:[{n:'Antes',v:r.pi_orig||r.pi,tachado:true},o3,o10]};
  if(t==='x3_sin_minimo') return {titulo:'Precio x3 · desde 1 u.', precio:r.pe, otros:[{n:'Antes precio de lista',v:r.pi,tachado:true},o10]};
  if(t==='x10_sin_minimo') return {titulo:'Precio x10 · desde 1 u.', precio:r.pm, otros:[{n:'Antes precio de lista',v:r.pi,tachado:true}]};
  if(t==='multixmenos') return {titulo:(r.multi_lleva&&r.multi_paga?('Llevá '+r.multi_lleva+' pagá '+r.multi_paga):'Promo'), precio:r.pi, otros:[o3,o10]};
  return {titulo:'Precio de lista', precio:r.pi, otros:[o3,{n:'10 o más (VIP)',v:r.pm}]};
}
function _madreTarjeta(p){
  var r=calcP(p), pt=_mPartes(p.nombre);
  var marca=(pt.marca||p.empresa||'');
  var chips=pt.chips.slice();
  if(p.ml && !chips.some(function(c){return /ml/i.test(c);})) chips.push(p.ml+' ml');
  var chipsHtml=chips.map(function(c,i){ return '<span class="md-chip'+(i===0?' md-violeta':'')+'">'+_mEsc(c)+'</span>'; }).join('')+'<span class="md-chip md-rosa">Para ella</span>';
  var marcaHtml=_madreMarcaHTML(marca);
  var q=(cstate[p.id]&&cstate[p.id].qty)||0, dq=(typeof decanState!=='undefined'&&decanState[p.id])||0;
  var px=_madrePrecios(r);
  return '<article class="md-card">'+
    '<div class="md-foto"><img src="'+_mEsc(p.imagen_url)+'" alt="'+_mEsc(pt.nombre)+'" loading="lazy">'+_madreTapaHTML()+'</div>'+
    '<div class="md-marca" data-marca="'+_mEsc(marca)+'">'+marcaHtml+'</div>'+
    '<div class="md-nombre">'+_mEsc(pt.nombre)+'</div>'+
    '<div class="md-chips">'+chipsHtml+'</div>'+
    '<div class="md-precios"><div class="md-pvip"><small>'+_mEsc(px.titulo)+'</small><b>'+fmt(px.precio)+'</b></div>'+
      '<div class="md-pmas">'+px.otros.map(function(o){ return '<div><small>'+_mEsc(o.n)+'</small><b>'+(o.tachado?'<s>':'')+fmt(o.v)+(o.tachado?'</s>':'')+'</b></div>'; }).join('')+'</div></div>'+
    ((parseFloat(p.precio_decan)<0||!(r.decan>0))?'':'<div class="md-decan">Decan 5 ml <b>'+fmt(r.decan)+'</b> <span class="md-qty md-qty-d"><button type="button" onclick="_madreDecanQty('+p.id+',-1)">−</button><span id="mdq_'+p.id+'">'+dq+'</span><button type="button" onclick="_madreDecanQty('+p.id+',1)">+</button></span><button type="button" class="md-mini" onclick="addDecan('+p.id+')">+ carrito</button></div>')+
    '<div class="md-acc"><div class="md-qty"><button type="button" onclick="_madreQty('+p.id+',-1)">−</button><span id="mq_'+p.id+'">'+q+'</span><button type="button" onclick="_madreQty('+p.id+',1)">+</button></div>'+
      '<button type="button" class="md-agregar" onclick="_madreAgregar('+p.id+')">Agregar</button></div>'+
  '</article>';
}
function _madreRender(prods, combos){
  var cont=document.getElementById('madreFilas'); if(!cont) return;
  combos=combos||[]; window._madreCombosCache=combos;
  // Si a algún producto del combo no le alcanza el stock, el combo no se muestra
  // (en la vista previa del admin sí, marcado "Sin stock", para que lo vea).
  var enPreview=!!window._catVistaPrevia;
  combos=combos.filter(function(c){ try{ return enPreview || !_madreComboInfo(c).sinStock; }catch(e){ return true; } });
  if(!prods.length && !combos.length){ cont.innerHTML='<div class="md-cargando">Todavía no hay productos en esta campaña</div>'; _madreZig(); return; }
  // los combos de la campaña van primero, en su orden; después los productos
  var tarjetas=combos.map(function(c){ return _madreComboTarjeta(c); }).concat(prods.map(function(p){ return _madreTarjeta(p); }));
  // 2026-10-08: cliente VIP → cartel aparte: toda la campaña a sus precios, siempre el más bajo
  var _vipBanner=(typeof _madreEsVip==='function'&&_madreEsVip())?'<div class="md-vip-aviso">✨ <b>Precio VIP activo.</b> Por ser cliente VIP ves toda la campaña con tu precio especial: siempre el más bajo entre tu precio x10 y la promo, también en los combos.</div>':'';
  try{ var _sec=document.getElementById('madreRegalos'), _vb=document.getElementById('madreVipAviso');
       if(!_vb && _sec){ _vb=document.createElement('div'); _vb.id='madreVipAviso'; _sec.parentNode.insertBefore(_vb,_sec); }
       if(_vb) _vb.innerHTML=_vipBanner; }catch(e){}   // va ARRIBA de la sección (fuera de la cinta en zigzag)
  cont.innerHTML=tarjetas.map(function(t,i){
    return '<div class="md-fila '+(i%2?'md-der':'md-izq')+'">'+t+'<div class="md-vin md-anim" aria-hidden="true">'+VINETAS[i%VINETAS.length]()+'</div></div>';
  }).join('');
  setTimeout(_madreZig,60); setTimeout(_madreZig,600);
}
function _madreZig(){
  var rio=document.getElementById('madreRegalos'), svg=document.getElementById('madreZig'); if(!rio||!svg) return;
  var filas=[].slice.call(rio.querySelectorAll('.md-fila')); if(!filas.length){ svg.innerHTML=''; return; }
  var W=rio.clientWidth, H=rio.clientHeight; var r0=rio.getBoundingClientRect();
  var movil=W<760;
  var ancho=movil?W*.46:W*.40;
  var xI=movil?W*.24:W*.70, xD=movil?W*.76:W*.30;
  var centros=filas.map(function(f,i){ var b=f.getBoundingClientRect(); return {x:(i%2===0)?xI:xD, y:b.top-r0.top+b.height/2}; });
  var pts=[{x:centros[0].x,y:-40}].concat(centros).concat([{x:centros[centros.length-1].x,y:H+40}]);
  function lado(sign){ return pts.map(function(p){ return (p.x+sign*ancho/2).toFixed(1)+','+p.y.toFixed(1); }); }
  function pathDe(puntos){ var d='M'+puntos[0]; for(var i=1;i<puntos.length;i++){ var a=puntos[i-1].split(','), b=puntos[i].split(','); var ax=+a[0],ay=+a[1],bx=+b[0],by=+b[1]; var my=(ay+by)/2; d+=' C'+ax+','+my+' '+bx+','+my+' '+bx+','+by; } return d; }
  var izq=lado(-1), der=lado(1).reverse();
  var dIzq=pathDe(izq), dDer=pathDe(der), k=dDer.indexOf(' C');
  var d=dIzq+' L'+der[0]+(k>=0?dDer.slice(k):'')+' Z';
  svg.setAttribute('viewBox','0 0 '+W+' '+H);
  svg.innerHTML='<defs><pattern id="puntosM" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.2" fill="#FF6C2F" opacity=".45"/></pattern></defs>'+
    '<path d="'+d+'" fill="#FF6C2F" opacity=".5" transform="translate(7 6)"/><path d="'+d+'" fill="#FF48B0"/><path d="'+d+'" fill="url(#puntosM)"/>';
}
window.addEventListener('resize',function(){ if(document.body.classList.contains('madre-on')){ clearTimeout(window._mrz); window._mrz=setTimeout(_madreZig,120); } });
function _madreCargar(){
  var prods=_madreProductos();
  var sinMl=prods.filter(function(p){ return p.ml==null; }).map(function(p){ return p.id; });
  var pMl=sinMl.length?apiGet('productos','select=id,ml&id=in.('+sinMl.join(',')+')').catch(function(){ return []; }):Promise.resolve([]);
  var pCombos=_madreCampId?apiGet('combos','select=*,combo_items(producto_id,cantidad,producto_nombre,es_decan,precio_ref)&campania_id=eq.'+_madreCampId+'&activo=is.true&order=orden.asc.nullslast,created_at.desc').catch(function(){ return []; }):Promise.resolve([]);
  Promise.all([pMl,pCombos]).then(function(rr){ var rows=rr[0], combos=Array.isArray(rr[1])?rr[1]:[]; var m={}; (rows||[]).forEach(function(r){ m[r.id]=r.ml; }); prods.forEach(function(p){ if(p.ml==null && m[p.id]!=null) p.ml=m[p.id]; }); _madreRender(prods, combos); });
}
// ── combos de la campaña: fotos de los productos en abanico, nombres, precio único ──
function _madreComboInfo(c){
  var todos=(c.combo_items||[]), items=todos.filter(function(i){ return !i.es_decan; });
  var fotos=[], porSep=0, sinStock=false, nombres=[], lista=[], bolsa=null;
  var vip=(typeof _madreEsVip==='function')&&_madreEsVip();
  todos.forEach(function(i){
    var p=(allProds||[]).find(function(x){ return Number(x.id)===Number(i.producto_id); }); var cant=parseInt(i.cantidad)||1;
    // 2026-10-09: el packaging del combo (bolsa de regalo) va aparte: no entra al abanico ni a "por separado",
    // se lista como regalo y su foto rota por los colores disponibles abajo de los perfumes
    if(p && p.tipo==='regaleria' && !i.es_decan){
      var _nb=String(p.nombre||'').replace(/\s*\(.*?\)\s*$/,'').trim();
      if(p.grupo_id&&p.color){ _nb=_nb.replace(new RegExp('\\s*'+String(p.color).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*$','i'),'').trim()||_nb; }   // sin el color: va el que haya
      lista.push({cant:cant, nombre:'🎁 '+_nb+' de regalo', marca:'', chips:[(p.grupo_id?'color a disponibilidad':(p.color||''))].filter(Boolean)});
      if((p.stock_actual||0)<cant) sinStock=true;
      var _cols=(allProds||[]).filter(function(x){ return x.tipo==='regaleria' && (x.stock_actual||0)>0 && /^http/.test(x.imagen_url||'') && (p.grupo_id?(x.grupo_id===p.grupo_id):(x.id===p.id)); });
      if(!_cols.length && /^http/.test(p.imagen_url||'')) _cols=[p];
      bolsa={fotos:_cols.map(function(x){ return x.imagen_url; }), nombre:_nb};
      return;
    }
    var _pt=_mPartes(p?p.nombre:(i.producto_nombre||''));
    // 2026-09-29: los decants del combo también se listan (marcados) y suman en "por separado"; el stock lo miran solo los frascos
    lista.push({cant:cant, nombre:_pt.nombre+(i.es_decan?' · decant 5 ml':''), marca:_pt.marca||(p&&p.empresa)||'', chips:i.es_decan?[]:_pt.chips.concat(p&&p.ml&&!_pt.chips.some(function(c){return /ml/i.test(c);})?[p.ml+' ml']:[])});
    var pu=0;
    if(i.es_decan){ pu=parseFloat(i.precio_ref)||0; if(!pu&&p){ try{ pu=calcP(p).decan||0; }catch(e){} } }
    else {
      if(p && /^http/.test(p.imagen_url||'')) fotos.push(p.imagen_url);
      // "por separado" con el precio que pagaría este cliente: VIP/CC paga el x10, el resto el de 1 unidad
      if(p&&parseFloat(p.precio_pestana)>0){ pu=parseFloat(p.precio_pestana); }   // precio único
      else if(p){ try{ var _r=calcP(p); pu=(vip?(_r.pm||_r.pi):_r.pi)||0; }catch(e){ pu=p.precio_min_ars||0; } } else pu=parseFloat(i.precio_ref)||0;
      if(!p || (p.stock_actual||0)<cant) sinStock=true;
      nombres.push((cant>1?cant+'× ':'')+_pt.nombre);
    }
    porSep+=pu*cant;
  });
  var precioBase=(c.precio_oferta&&parseFloat(c.precio_oferta)>0&&parseFloat(c.precio_oferta)<parseFloat(c.precio))?parseFloat(c.precio_oferta):parseFloat(c.precio)||0;
  var precio=_comboPrecioVigente(c);
  return {items:items,fotos:fotos.slice(0,4),porSep:porSep,sinStock:sinStock,nombres:nombres,lista:lista,precio:precio,precioBase:precioBase,vip:vip,vipAjustado:false,bolsa:bolsa};
}
// logos de las marcas del combo (una vez cada marca; más chicos cuantas más marcas; sin logo no va nada)
// dirección del logo de una marca (si ya llegaron los logos de belle); '' si no hay
function _madreLogoSrc(marca){
  var h=(marca&&typeof window._marcaLogoHTML==='function')?window._marcaLogoHTML(marca,''):'';
  var s=h&&h.match(/src=["']([^"']+)["']/); return s?s[1]:'';
}
function _madreMarcaHTML(marca){
  var logo=_madreLogoSrc(marca);
  return logo?('<i class="md-logo" role="img" aria-label="'+_mEsc(marca)+'" style="--logo:url(\''+logo+'\')"></i>'):('<span>'+_mEsc(String(marca||'').toUpperCase())+'</span>');
}
function _madreComboLogosDe(marcas){
  var logos=[]; marcas.forEach(function(m){ var src=_madreLogoSrc(m); if(src) logos.push({m:m,src:src}); });
  var attr=' data-marcas="'+_mEsc(marcas.join('|'))+'"';
  if(!logos.length) return '<div class="md-marca md-marca-vacia"'+attr+'></div>';
  return '<div class="md-marca md-marcas-n'+Math.min(logos.length,4)+'"'+attr+'>'+logos.map(function(l){ return '<i class="md-logo" role="img" aria-label="'+_mEsc(l.m)+'" style="--logo:url(\''+l.src+'\')"></i>'; }).join('')+'</div>';
}
function _madreComboLogos(inf){
  var marcas=[]; (inf.items||[]).forEach(function(i){ var p=(allProds||[]).find(function(x){ return Number(x.id)===Number(i.producto_id); }); if(p&&p.tipo==='regaleria') return; var m=p?(_mPartes(p.nombre).marca||p.empresa||''):''; if(m && marcas.indexOf(m)<0) marcas.push(m); });
  return _madreComboLogosDe(marcas);
}
// Los logos de las marcas llegan aparte (y en el celular suelen llegar después de dibujar la pestaña):
// cuando llegan, se actualizan las marcas de las tarjetas ya dibujadas sin volver a armar todo.
window._madreRefrescarLogos=function(){
  var pg=document.getElementById('madrePage'); if(!pg) return;
  var els=pg.querySelectorAll('.md-marca[data-marca]');
  for(var i=0;i<els.length;i++){ var m=els[i].getAttribute('data-marca')||''; if(_madreLogoSrc(m)&&!els[i].querySelector('.md-logo')) els[i].innerHTML=_madreMarcaHTML(m); }
  var cs=pg.querySelectorAll('.md-marca[data-marcas]');
  for(var j=0;j<cs.length;j++){ var ms=(cs[j].getAttribute('data-marcas')||'').split('|').filter(Boolean); var nuevo=_madreComboLogosDe(ms); var tmp=document.createElement('div'); tmp.innerHTML=nuevo; if(tmp.firstChild&&tmp.firstChild.className!==cs[j].className) cs[j].parentNode.replaceChild(tmp.firstChild,cs[j]); }
};
var _madreFocoT=null;
function _madreFotoFoco(img){
  var fan=img.parentNode; if(!fan||!fan.classList) return;
  var viejos=document.querySelectorAll('#madrePage .md-fan-i.md-foco, #madrePage .md-fan.md-pausa');
  for(var i=0;i<viejos.length;i++){ if(viejos[i]!==img&&viejos[i]!==fan){ viejos[i].classList.remove('md-foco'); viejos[i].classList.remove('md-pausa'); } }
  img.classList.add('md-foco'); fan.classList.add('md-pausa');
  clearTimeout(_madreFocoT);
  _madreFocoT=setTimeout(function(){ img.classList.remove('md-foco'); fan.classList.remove('md-pausa'); },5000);
}
document.addEventListener('pointerdown',function(ev){
  var t=ev.target; if(!t||!t.classList||!t.classList.contains('md-fan-i')) return;
  var pg=document.getElementById('madrePage'); if(!pg||!pg.contains(t)) return;
  _madreFotoFoco(t);
},true);
function _madreComboTarjeta(c){
  var inf=_madreComboInfo(c), n=inf.fotos.length||1, ef=(c.efecto&&c.efecto!=='giro')?c.efecto:'abanico';
  var q=(window._madreComboQty&&window._madreComboQty[c.id])||0;
  // collage: 1 sola grande · 2 en fila · 3 dos y una · 4 dos y dos · 5 o más de a tres, todas con aire entre sí
  var w=n<=1?78:(n<=4?55:37);
  var imgs=inf.fotos.map(function(u,i){ return '<img src="'+_mEsc(u)+'" alt="" class="md-fan-i" style="--i:'+i+';--n:'+n+';--w:'+w+'%" loading="lazy">'; }).join('');
  var fotos=inf.fotos.length?imgs:'<span class="md-fan-vacio">🎁</span>';
  // 2026-10-09: bolsa de regalo del combo, más chica, abajo al medio; si hay varios colores la foto va rotando
  var bolsa=(inf.bolsa&&inf.bolsa.fotos.length)?('<div class="md-bolsa rg-gal-th" data-seg="2.5" title="'+_mEsc(inf.bolsa.nombre)+' de regalo">'+inf.bolsa.fotos.map(function(u,i){ return '<img src="'+_mEsc(u)+'" alt="" loading="lazy" class="'+(i===0?'act':'')+'">'; }).join('')+'<span>🎁 de regalo</span></div>'):'';
  return '<article class="md-card md-combo md-ef-'+_mEsc(ef)+(bolsa?' md-con-bolsa':'')+'">'+
    '<div class="md-foto md-fan" data-n="'+n+'">'+fotos+bolsa+'<span class="md-tapa">'+(c.etiqueta?_mEsc(c.etiqueta):'Combo')+'</span></div>'+
    _madreComboLogos(inf)+
    '<div class="md-nombre">'+_mEsc(c.nombre||inf.nombres.join(' + '))+'</div>'+
    '<ul class="md-lista">'+inf.lista.map(function(l){ return '<li><b>'+(l.cant>1?l.cant+'× ':'')+_mEsc(l.nombre)+'</b>'+(l.marca?'<em>'+_mEsc(l.marca)+'</em>':'')+(l.chips.length?'<small>'+_mEsc(l.chips.join(' · '))+'</small>':'')+'</li>'; }).join('')+'</ul>'+
    '<div class="md-precios"><div class="md-pvip"><small>Precio del combo</small><b>'+fmt(inf.precio)+'</b></div>'+
      // 2026-10-17: "por separado" tachado solo cuando de verdad es más caro que el combo (al VIP, con sus precios, a veces no lo es)
      '<div class="md-pmas">'+(inf.porSep>inf.precio?'<div><small>Por separado</small><b><s>'+fmt(inf.porSep)+'</s></b></div><div><small>Ahorrás</small><b>'+fmt(inf.porSep-inf.precio)+'</b></div>':'')+'</div></div>'+
    '<div class="md-decan">'+(inf.sinStock?'<b style="color:#a8156f">Sin stock por ahora</b>':'Lo llevás armado, listo para regalar')+'</div>'+
    '<div class="md-acc">'+(inf.sinStock?'':'<div class="md-qty"><button type="button" onclick="_madreComboQty('+c.id+',-1)">−</button><span id="mcq_'+c.id+'">'+q+'</span><button type="button" onclick="_madreComboQty('+c.id+',1)">+</button></div><button type="button" class="md-agregar" onclick="_madreAgregarCombo('+c.id+')">Agregar</button>')+'</div>'+
  '</article>';
}
function _madreComboQty(id,d){ window._madreComboQty=window._madreComboQty||{}; var v=Math.max(0,(window._madreComboQty[id]||0)+d); window._madreComboQty[id]=v; var s=document.getElementById('mcq_'+id); if(s) s.textContent=v; }
function _madreAgregarCombo(id){
  var q=(window._madreComboQty&&window._madreComboQty[id])||0; if(!q){ showToast('Elegí la cantidad con + primero'); return; }
  var c=(window._madreCombosCache||[]).find(function(x){ return x.id===id; });
  if(c && !(combosPublicos||[]).some(function(x){ return x.id===id; })) combosPublicos.push(c);
  agregarComboCarrito(id, q);
  window._madreComboQty[id]=0; var s=document.getElementById('mcq_'+id); if(s) s.textContent='0';
}
function renderMadre(camp){
  var el=document.getElementById('madrePage'); if(!el) return;
  var id=camp?camp.id:null;
  if(_madreCampId!==id || !el.firstChild){
    _madreCampId=id;
    var t=_madreTextos(camp); _madreTxAct=t;
    var html=MADRE_HTML;
    // 2026-10-09: todos los textos de la plantilla (incluido el cierre y el WhatsApp) se editan desde Belle
    ['kicker','titulo1','titulo2','lead','fecha','boton','boton_ayuda','cierre_titulo','cierre_texto','cierre_boton'].forEach(function(k){ html=html.split('{{'+k+'}}').join(_mEsc(t[k]||'')); });
    var _waN=String(t.whatsapp||'').replace(/\D/g,'')||'5493515121193';
    html=html.split('{{wa_link}}').join('https://wa.me/'+_waN+'?text='+encodeURIComponent(t.wa_texto||''));
    el.innerHTML=html;
    var ct=document.getElementById('madreCinta'); if(ct){ var h=(t.msjs||[]).map(function(m){return '<span>'+_mEsc(m)+'</span>';}).join(''); ct.innerHTML=h+h; }
    if(window._catVistaPrevia && camp && _campEsVistaPrevia(camp)){
      var of=(window._ofertas||[]).find(function(o){ return o.campania_id===camp.id; });
      var fd=of&&of.fecha_desde?new Date(of.fecha_desde):null, fh=of&&of.fecha_hasta?new Date(of.fecha_hasta):null, hoy=new Date();
      var fmtF=function(d){ return d.toLocaleDateString('es-AR',{day:'numeric',month:'numeric'}); };
      var cuando=!of?'esta campaña no tiene oferta cargada':(fd&&hoy<fd?('la promo arranca el '+fmtF(fd)+', acá ya se ve aplicada'):(fh&&hoy>=fh?('la promo terminó el '+fmtF(fh)+', acá se ve aplicada igual'):'la promo está vigente'));
      var av=document.createElement('div'); av.className='md-preview-aviso';
      av.innerHTML='👁 <b>Vista previa</b> · '+(camp.activa===false?'campaña oculta para los clientes':'campaña visible')+' · '+_mEsc(cuando);
      el.insertBefore(av, el.firstChild);
    }
  }
  _madreCargar();
}
var MADRE_HTML="<section class=\"md-hero\">\n  <div class=\"md-txt\">\n    <span class=\"md-kicker\"><i></i> {{kicker}}</span>\n    <h1 class=\"md-tit\"><span class=\"md-riso\">{{titulo1}}</span><br><em class=\"md-riso\">{{titulo2}}</em></h1>\n    <p class=\"md-lead\">{{lead}}</p>\n    <div class=\"md-fecha\">{{fecha}}</div><br>\n    <a class=\"md-btn\" href=\"#madreRegalos\">{{boton}}</a>\n    <a class=\"md-btn md-sec\" href=\"{{wa_link}}\" target=\"_blank\" rel=\"noopener\" style=\"margin-left:.5rem\">{{boton_ayuda}}</a>\n  </div>\n\n  <!-- Escena principal: mamá con los dos hijitos, el gatito y corazones -->\n  <div class=\"md-escena md-anim\" aria-hidden=\"true\">\n    <svg viewBox=\"0 0 520 420\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <pattern id=\"trama\" width=\"6\" height=\"6\" patternUnits=\"userSpaceOnUse\" patternTransform=\"rotate(30)\"><circle cx=\"3\" cy=\"3\" r=\"1.4\" fill=\"#765BA7\" opacity=\".35\"/></pattern>\n        <pattern id=\"tramaV\" width=\"7\" height=\"7\" patternUnits=\"userSpaceOnUse\" patternTransform=\"rotate(30)\"><circle cx=\"3.5\" cy=\"3.5\" r=\"1.6\" fill=\"#765BA7\" opacity=\".35\"/></pattern>\n        <pattern id=\"tramaRosa\" width=\"7\" height=\"7\" patternUnits=\"userSpaceOnUse\" patternTransform=\"rotate(60)\"><circle cx=\"3.5\" cy=\"3.5\" r=\"1.7\" fill=\"#FF48B0\" opacity=\".55\"/></pattern>\n        <clipPath id=\"capaMama\"><rect width=\"520\" height=\"420\"/></clipPath>\n      </defs>\n\n      <!-- sol (amarillo, girando despacio) -->\n      <g transform=\"translate(430 80)\"><g class=\"sol\">\n        <circle r=\"46\" fill=\"#FFE800\"/>\n        <g fill=\"none\" stroke=\"#FF6C2F\" stroke-width=\"5\" stroke-linecap=\"round\">\n          <line x1=\"0\" y1=\"-60\" x2=\"0\" y2=\"-74\"/><line x1=\"0\" y1=\"60\" x2=\"0\" y2=\"74\"/><line x1=\"-60\" y1=\"0\" x2=\"-74\" y2=\"0\"/><line x1=\"60\" y1=\"0\" x2=\"74\" y2=\"0\"/>\n          <line x1=\"42\" y1=\"-42\" x2=\"52\" y2=\"-52\"/><line x1=\"-42\" y1=\"42\" x2=\"-52\" y2=\"52\"/><line x1=\"42\" y1=\"42\" x2=\"52\" y2=\"52\"/><line x1=\"-42\" y1=\"-42\" x2=\"-52\" y2=\"-52\"/>\n        </g>\n      </g></g>\n      <!-- piso: una loma rosa con trama -->\n      <path d=\"M0 330 Q130 290 260 322 T520 318 L520 420 L0 420 Z\" fill=\"#FF48B0\"/>\n      <path d=\"M0 330 Q130 290 260 322 T520 318 L520 420 L0 420 Z\" fill=\"url(#trama)\"/>\n      <path d=\"M3 333 Q133 293 263 325 T523 321 L523 423 L3 423 Z\" fill=\"#FF6C2F\" opacity=\".35\"/>\n\n      <!-- flores -->\n      <g transform=\"translate(60 330)\"><g class=\"flor\">\n        <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-40\" stroke=\"#00A95C\" stroke-width=\"4\"/>\n        <g transform=\"translate(0 -46)\"><circle r=\"7\" cx=\"0\" cy=\"-9\" fill=\"#FFE800\"/><circle r=\"7\" cx=\"9\" cy=\"0\" fill=\"#FFE800\"/><circle r=\"7\" cx=\"0\" cy=\"9\" fill=\"#FFE800\"/><circle r=\"7\" cx=\"-9\" cy=\"0\" fill=\"#FFE800\"/><circle r=\"5\" fill=\"#FF6C2F\"/></g>\n      </g></g>\n      <g transform=\"translate(475 322)\"><g class=\"flor\" style=\"animation-delay:.6s\">\n        <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"-34\" stroke=\"#00A95C\" stroke-width=\"4\"/>\n        <g transform=\"translate(0 -40)\"><circle r=\"6\" cx=\"0\" cy=\"-8\" fill=\"#765BA7\"/><circle r=\"6\" cx=\"8\" cy=\"0\" fill=\"#765BA7\"/><circle r=\"6\" cx=\"0\" cy=\"8\" fill=\"#765BA7\"/><circle r=\"6\" cx=\"-8\" cy=\"0\" fill=\"#765BA7\"/><circle r=\"4\" fill=\"#FFE800\"/></g>\n      </g></g>\n\n      <!-- ─── MAMÁ ─── -->\n      <g transform=\"translate(250 322)\">\n        <g class=\"cuerpo\">\n          <!-- vestido coral con trama violeta (desregistro leve) -->\n          <path d=\"M-52 0 L-30 -150 L30 -150 L52 0 Z\" fill=\"#765BA7\" opacity=\".55\" transform=\"translate(3 3)\"/>\n          <path d=\"M-52 0 L-30 -150 L30 -150 L52 0 Z\" fill=\"#FF6C2F\"/>\n          <path d=\"M-52 0 L-30 -150 L30 -150 L52 0 Z\" fill=\"url(#trama)\"/>\n          <path d=\"M-44 -30 Q0 -12 44 -30\" fill=\"none\" stroke=\"#FFE800\" stroke-width=\"5\"/>\n          <!-- brazo izquierdo (agarra al nene) -->\n          <path d=\"M-30 -140 Q-70 -110 -78 -60\" fill=\"none\" stroke=\"#F2C9A8\" stroke-width=\"15\" stroke-linecap=\"round\"/>\n          <!-- brazo derecho que saluda -->\n          <g class=\"brazo-saluda\">\n            <path d=\"M30 -140 Q68 -150 82 -196\" fill=\"none\" stroke=\"#F2C9A8\" stroke-width=\"15\" stroke-linecap=\"round\"/>\n            <circle cx=\"84\" cy=\"-200\" r=\"10\" fill=\"#F2C9A8\"/>\n          </g>\n          <!-- cuello + cabeza -->\n          <rect x=\"-9\" y=\"-166\" width=\"18\" height=\"22\" fill=\"#F2C9A8\"/>\n          <g class=\"cabeza\">\n            <circle cx=\"0\" cy=\"-190\" r=\"34\" fill=\"#F2C9A8\"/>\n            <!-- pelo violeta con rodete -->\n            <path d=\"M-36 -196 Q-30 -238 0 -236 Q30 -238 36 -196 Q20 -212 0 -212 Q-20 -212 -36 -196 Z\" fill=\"#765BA7\"/>\n            <circle cx=\"0\" cy=\"-232\" r=\"14\" fill=\"#765BA7\"/>\n            <circle cx=\"0\" cy=\"-232\" r=\"14\" fill=\"url(#trama)\"/>\n            <path d=\"M-36 -196 Q-40 -170 -30 -164 Q-34 -186 -22 -198Z\" fill=\"#765BA7\"/>\n            <path d=\"M36 -196 Q40 -170 30 -164 Q34 -186 22 -198Z\" fill=\"#765BA7\"/>\n            <!-- ojos y sonrisa -->\n            <g class=\"ojos\" style=\"transform-box:fill-box;transform-origin:50% 50%\">\n              <ellipse cx=\"-12\" cy=\"-190\" rx=\"3.2\" ry=\"4\" fill=\"#3A2B63\"/><ellipse cx=\"12\" cy=\"-190\" rx=\"3.2\" ry=\"4\" fill=\"#3A2B63\"/>\n            </g>\n            <path d=\"M-11 -176 Q0 -166 11 -176\" fill=\"none\" stroke=\"#3A2B63\" stroke-width=\"2.6\" stroke-linecap=\"round\"/>\n            <circle cx=\"-20\" cy=\"-178\" r=\"5\" fill=\"#FF48B0\" opacity=\".6\"/><circle cx=\"20\" cy=\"-178\" r=\"5\" fill=\"#FF48B0\" opacity=\".6\"/>\n            <!-- aro -->\n            <circle cx=\"34\" cy=\"-176\" r=\"4\" fill=\"#FFE800\" stroke=\"#3A2B63\" stroke-width=\"1\"/>\n          </g>\n        </g>\n      </g>\n\n      <!-- ─── NENE (a la izquierda, de la mano) ─── -->\n      <g transform=\"translate(160 326)\">\n        <g class=\"nene\">\n          <path d=\"M-24 0 L-16 -70 L16 -70 L24 0 Z\" fill=\"#0078BF\"/>\n          <path d=\"M-24 0 L-16 -70 L16 -70 L24 0 Z\" fill=\"url(#trama)\"/>\n          <path d=\"M16 -64 Q34 -56 40 -40\" fill=\"none\" stroke=\"#F2C9A8\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n          <rect x=\"-6\" y=\"-80\" width=\"12\" height=\"12\" fill=\"#F2C9A8\"/>\n          <g class=\"cabeza\" style=\"animation-delay:.4s\">\n            <circle cx=\"0\" cy=\"-96\" r=\"22\" fill=\"#F2C9A8\"/>\n            <path d=\"M-23 -100 Q-14 -126 6 -122 Q22 -122 23 -100 Q10 -112 -4 -110 Q-16 -108 -23 -100Z\" fill=\"#FF6C2F\"/>\n            <g class=\"ojos\" style=\"transform-box:fill-box;transform-origin:50% 50%;animation-delay:1.3s\"><circle cx=\"-8\" cy=\"-96\" r=\"2.6\" fill=\"#3A2B63\"/><circle cx=\"8\" cy=\"-96\" r=\"2.6\" fill=\"#3A2B63\"/></g>\n            <path d=\"M-7 -86 Q0 -79 7 -86\" fill=\"none\" stroke=\"#3A2B63\" stroke-width=\"2.2\" stroke-linecap=\"round\"/>\n          </g>\n          <!-- globo en la otra mano -->\n          <g class=\"globo\"><line x1=\"-20\" y1=\"-52\" x2=\"-42\" y2=\"-118\" stroke=\"#3A2B63\" stroke-width=\"1.4\"/><ellipse cx=\"-44\" cy=\"-132\" rx=\"15\" ry=\"18\" fill=\"#FFE800\"/><ellipse cx=\"-44\" cy=\"-132\" rx=\"15\" ry=\"18\" fill=\"url(#tramaRosa)\" opacity=\".5\"/><path d=\"M-44 -114 l-3 4 6 0z\" fill=\"#FFE800\"/></g>\n        </g>\n      </g>\n\n      <!-- ─── NENA (a la derecha, abrazando la pollera) ─── -->\n      <g transform=\"translate(330 326)\">\n        <g class=\"nena\">\n          <path d=\"M-22 0 L-14 -64 L14 -64 L22 0 Z\" fill=\"#FF48B0\"/>\n          <path d=\"M-22 0 L-14 -64 L14 -64 L22 0 Z\" fill=\"url(#trama)\"/>\n          <path d=\"M-14 -58 Q-36 -60 -46 -78\" fill=\"none\" stroke=\"#F2C9A8\" stroke-width=\"9\" stroke-linecap=\"round\"/>\n          <rect x=\"-5\" y=\"-74\" width=\"10\" height=\"12\" fill=\"#F2C9A8\"/>\n          <g class=\"cabeza\" style=\"animation-delay:.9s\">\n            <circle cx=\"0\" cy=\"-90\" r=\"20\" fill=\"#F2C9A8\"/>\n            <path d=\"M-21 -92 Q-16 -118 0 -116 Q16 -118 21 -92 Q10 -104 0 -104 Q-10 -104 -21 -92Z\" fill=\"#765BA7\"/>\n            <!-- colitas -->\n            <circle cx=\"-24\" cy=\"-96\" r=\"7\" fill=\"#765BA7\"/><circle cx=\"24\" cy=\"-96\" r=\"7\" fill=\"#765BA7\"/>\n            <circle cx=\"-24\" cy=\"-104\" r=\"3.5\" fill=\"#FFE800\"/><circle cx=\"24\" cy=\"-104\" r=\"3.5\" fill=\"#FFE800\"/>\n            <g class=\"ojos\" style=\"transform-box:fill-box;transform-origin:50% 50%;animation-delay:2.2s\"><circle cx=\"-7\" cy=\"-90\" r=\"2.4\" fill=\"#3A2B63\"/><circle cx=\"7\" cy=\"-90\" r=\"2.4\" fill=\"#3A2B63\"/></g>\n            <path d=\"M-6 -81 Q0 -75 6 -81\" fill=\"none\" stroke=\"#3A2B63\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n          </g>\n        </g>\n      </g>\n\n      <!-- ─── GATITO (adelante, a la derecha) ─── -->\n      <g transform=\"translate(410 334)\">\n        <g class=\"cola\"><path d=\"M-22 -10 Q-52 -14 -50 -46\" fill=\"none\" stroke=\"#3A2B63\" stroke-width=\"7\" stroke-linecap=\"round\"/></g>\n        <ellipse cx=\"0\" cy=\"-14\" rx=\"30\" ry=\"16\" fill=\"#3A2B63\"/>\n        <g transform=\"translate(22 -30)\"><g class=\"gato-cabeza\">\n          <circle r=\"15\" fill=\"#3A2B63\"/>\n          <path d=\"M-13 -8 L-10 -24 L-1 -12Z\" fill=\"#3A2B63\"/><path d=\"M13 -8 L10 -24 L1 -12Z\" fill=\"#3A2B63\"/>\n          <path d=\"M-11 -10 L-9 -19 L-4 -12Z\" fill=\"#FF48B0\"/><path d=\"M11 -10 L9 -19 L4 -12Z\" fill=\"#FF48B0\"/>\n          <g class=\"ojos\" style=\"transform-box:fill-box;transform-origin:50% 50%;animation-delay:.6s\"><ellipse cx=\"-5\" cy=\"-2\" rx=\"2.6\" ry=\"3.4\" fill=\"#FFE800\"/><ellipse cx=\"5\" cy=\"-2\" rx=\"2.6\" ry=\"3.4\" fill=\"#FFE800\"/></g>\n          <path d=\"M-2 3 l2 2 2 -2z\" fill=\"#FF48B0\"/>\n          <g stroke=\"#F4EDE1\" stroke-width=\"1.2\"><line x1=\"6\" y1=\"3\" x2=\"18\" y2=\"1\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"8\"/><line x1=\"-6\" y1=\"3\" x2=\"-18\" y2=\"1\"/><line x1=\"-6\" y1=\"6\" x2=\"-18\" y2=\"8\"/></g>\n        </g></g>\n        <ellipse cx=\"-14\" cy=\"0\" rx=\"6\" ry=\"3\" fill=\"#3A2B63\"/><ellipse cx=\"10\" cy=\"0\" rx=\"6\" ry=\"3\" fill=\"#3A2B63\"/>\n      </g>\n\n      <!-- corazones que suben desde la mamá -->\n      <g transform=\"translate(250 150)\">\n        <path class=\"corazon\" d=\"M0 8 C-14 -6 -14 -20 0 -14 C14 -20 14 -6 0 8Z\" fill=\"#FF48B0\"/>\n        <g transform=\"translate(40 -20) scale(.8)\"><path class=\"corazon c2\" d=\"M0 8 C-14 -6 -14 -20 0 -14 C14 -20 14 -6 0 8Z\" fill=\"#FF6C2F\"/></g>\n        <g transform=\"translate(-44 -6) scale(.7)\"><path class=\"corazon c3\" d=\"M0 8 C-14 -6 -14 -20 0 -14 C14 -20 14 -6 0 8Z\" fill=\"#765BA7\"/></g>\n        <g transform=\"translate(16 -40) scale(.55)\"><path class=\"corazon c4\" d=\"M0 8 C-14 -6 -14 -20 0 -14 C14 -20 14 -6 0 8Z\" fill=\"#FF48B0\"/></g>\n      </g>\n      <!-- mariposa -->\n      <g transform=\"translate(470 200)\"><g class=\"mariposa\">\n        <g class=\"ala\"><ellipse cx=\"-8\" cy=\"-4\" rx=\"9\" ry=\"6\" fill=\"#FFE800\" stroke=\"#3A2B63\" stroke-width=\"1\"/><ellipse cx=\"-7\" cy=\"5\" rx=\"6\" ry=\"4.5\" fill=\"#FF6C2F\" stroke=\"#3A2B63\" stroke-width=\"1\"/></g>\n        <g class=\"ala d\"><ellipse cx=\"8\" cy=\"-4\" rx=\"9\" ry=\"6\" fill=\"#FFE800\" stroke=\"#3A2B63\" stroke-width=\"1\"/><ellipse cx=\"7\" cy=\"5\" rx=\"6\" ry=\"4.5\" fill=\"#FF6C2F\" stroke=\"#3A2B63\" stroke-width=\"1\"/></g>\n        <ellipse rx=\"2\" ry=\"8\" fill=\"#3A2B63\"/>\n      </g></g>\n      <!-- pétalos que caen -->\n      <g fill=\"#FF48B0\">\n        <ellipse class=\"petalo\" cx=\"90\" cy=\"60\" rx=\"6\" ry=\"3.5\"/>\n        <ellipse class=\"petalo p2\" cx=\"180\" cy=\"40\" rx=\"6\" ry=\"3.5\" fill=\"#FF6C2F\"/>\n        <ellipse class=\"petalo p3\" cx=\"330\" cy=\"50\" rx=\"6\" ry=\"3.5\"/>\n        <ellipse class=\"petalo p4\" cx=\"140\" cy=\"90\" rx=\"6\" ry=\"3.5\" fill=\"#765BA7\"/>\n      </g>\n    </svg>\n  </div>\n</section>\n\n<div class=\"md-cinta-msj\" aria-hidden=\"true\"><div class=\"md-track\" id=\"madreCinta\"></div></div>\n<section class=\"md-rio\" id=\"madreRegalos\"><div class=\"md-fondo\" aria-hidden=\"true\"><svg id=\"madreZig\" preserveAspectRatio=\"none\"></svg></div><div id=\"madreFilas\"><div class=\"md-cargando\">Buscando los regalos…</div></div></section>\n<section class=\"md-cierre\">\n  <div class=\"md-caja\">\n    <h2>{{cierre_titulo}}</h2>\n    <p>{{cierre_texto}}</p>\n    <a class=\"md-btn\" href=\"{{wa_link}}\" target=\"_blank\" rel=\"noopener\">{{cierre_boton}}</a>\n  </div>\n  \n</section>\n<div class=\"md-grano\" aria-hidden=\"true\"></div>";
