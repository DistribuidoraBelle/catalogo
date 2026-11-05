
// ════════════════════════════════════════════════════════════════════
// 🎁 REGALERÍA (2026-09-30) — bolsas, moños y tarjetas
// Los ítems son productos comunes (tipo 'regaleria', precio único). En el carrito viajan
// con la forma de los cosméticos (isCosm, cajaCant 1) más la marca isRegalo, así stock,
// reserva, pedidos y edición en ventas/belle funcionan sin lógica nueva.
// ════════════════════════════════════════════════════════════════════
window._rgMin=(window._rgMin!=null)?window._rgMin:15000;
window._rgTitulo=window._rgTitulo||'🎁 ¿Es para regalar?';
window._rgSub=window._rgSub||'Elegí la presentación y llega listo para entregar';
window._rgPestTit=window._rgPestTit||'Packaging para tu emprendimiento';
window._rgPestSub=window._rgPestSub||'Bolsas y tarjetas para que tus productos lleguen con la mejor presentación. Comprá por pack.';
window._rgTierSel={};
window._rgSel={};
var _RG_GRUPOS=[['bolsa','Bolsas','🛍️'],['mono','Moños','🎀'],['tarjeta','Tarjetas','💌'],['otro','Más detalles','✨']];

function _rgEsReg(p){ return !!(p && p.tipo==='regaleria'); }
function _rgPestanaVisible(){ return (pestanasCatalogo||[]).some(function(t){ return t.slug==='regaleria'; }); }
// ¿Este producto de regalería se esconde del catálogo (búsqueda/pestaña)? Sólo se ofrece al pagar.
function _rgOcultoCat(p){
  if(!_rgEsReg(p)) return false;
  if(!_rgPestanaVisible()) return true;
  if(p.oculto && window._catVistaPrevia!=='regaleria') return true;
  return false;
}
function _rgPoolCatalogo(){ return (allProds||[]).filter(function(p){ return !_rgOcultoCat(p) && (!_rgEsReg(p) || (p.stock_actual||0)>0 || _rgEnCarrito(p.id)>0); }); }
function _rgProd(pid){ return (allProds||[]).find(function(x){ return x.id===pid; }); }
// 2026-10-08: UNA línea por producto (clave sin tramo). El precio por unidad es el del pack más grande que
// alcanzan las unidades totales: 6 u. con packs 5/10 → las 6 al precio del pack x5; 15 u. → todas al pack x10.
function _rgKey(pid,cant){ return 'rg_'+pid; }
function _rgTramo(p,u){ var ts=_rgTiers(p), t=ts[0]; ts.forEach(function(x){ if(x.cant<=u) t=x; }); return {cant:t.cant,precio:t.precio,unit:Math.round(t.precio/t.cant),label:(t.cant>1?'pack x'+t.cant:'Precio lista')}; }
function _rgPrecio(p){ return (p.precio_pestana>0?p.precio_pestana:(p.precio_min_ars||0)); }
function _rgNombreCorto(p){ return p.nombre||''; }
function _rgEnCarrito(pid,cant){ var it=cart[_rgKey(pid)]; return it?(it.qty||0)*(it.cajaCant||1):0; }
// unidades totales de un producto en el carrito (sumando packs)
function _rgUnidades(pid){ return _rgItems().reduce(function(s,i){ return s+(Number(i.prodId)===Number(pid)?(i.qty||0)*(i.cajaCant||1):0); },0); }
// tramos de venta: individual + packs configurados en Belle (escala_unidades)
function _rgTiers(p){
  var t=[{cant:1,precio:_rgPrecio(p)}];
  (Array.isArray(p.escala_unidades)?p.escala_unidades:[]).forEach(function(k){ var c=parseInt(k.cant)||0, pr=Number(k.precio)||0; if(c>1&&pr>0) t.push({cant:c,precio:pr}); });
  t.sort(function(a,b){ return a.cant-b.cant; }); return t;
}
function _rgTierDef(p){ var d=parseInt(p.regaleria_pack_def)||1; return _rgTiers(p).some(function(t){ return t.cant===d; })?d:1; }
function _rgTierActual(p){ var c=window._rgTierSel[p.id]; return _rgTiers(p).some(function(t){ return t.cant===c; })?c:_rgTierDef(p); }
function _rgTierPrecio(p,cant){ var t=_rgTiers(p).find(function(x){ return x.cant===cant; }); return t?t.precio:_rgPrecio(p); }
function _rgKits(){ return (window.combosPublicos||[]).filter(function(c){ return c&&c.es_kit&&c.activo!==false&&!c.pausado_por_stock; }); }
function _rgKitDe(i){ if(!i||!i.isCombo) return null; var k=(window.combosPublicos||[]).find(function(c){ return c.id===i.comboId; }); return (k&&k.es_kit)?k:null; }
function _rgItems(){ return Object.values(cart||{}).filter(function(i){ return i&&i.isRegalo; }); }
function _rgKitItems(){ return Object.values(cart||{}).filter(function(i){ return !!_rgKitDe(i); }); }
function _rgHayRegalo(){ return _rgItems().length>0 || _rgKitItems().length>0; }
function _rgOrdenarItems(items){
  var a=[],b=[]; (items||[]).forEach(function(i){ ((i&&i.isRegalo)||_rgKitDe(i)?b:a).push(i); }); return a.concat(b);
}
function _rgSubtotal(){ return _rgItems().concat(_rgKitItems()).reduce(function(s,i){ return s+(i.precio||0)*(i.qty||0); },0); }
// Foto del producto o, si no tiene, la primera foto de su familia
function _rgFoto(p){
  if(p.imagen_url) return p.imagen_url;
  var fam=(allProds||[]).find(function(x){ return _rgEsReg(x)&&x.familia&&x.familia===p.familia&&x.imagen_url; });
  return fam?fam.imagen_url:'';
}
function _rgDot(p){ return p.color_hex?"<span class='rg-dot' style='background:"+_catEsc(p.color_hex)+"'></span>":''; }

// Mínimo: si hay regalería, la parte de perfumes/combos tiene que llegar al mínimo configurado
function _rgChequearMinimo(){
  var min=parseInt(window._rgMin)||0;
  if(!_rgHayRegalo() || min<=0) return {ok:true};
  if(typeof _madreEsVip==='function' && _madreEsVip()) return {ok:true};   // cuentas VIP / corrientes compran packaging solo
  var base=_catCobCalcSubtotal()-_rgSubtotal();
  if(base>=min) return {ok:true};
  var falta=min-base;
  return {ok:false, min:min, falta:falta, base:base,
    msg:'La regalería acompaña tu pedido: sumá '+fmt(falta)+' más en productos para llegar a '+fmt(min)+', o sacá el regalo.'};
}
function _rgSetQty(pid,qty,origen){
  var p=_rgProd(pid); if(!p) return;
  qty=Math.max(0,parseInt(qty)||0);   // unidades
  var stock=p.stock_actual||0, key=_rgKey(pid);
  // 2026-10-09: se recuerda desde dónde lo eligió el cliente (pestaña Packaging o modal del carrito):
  // si eligió desde la pestaña, en el carrito ya no se le ofrece "¿Es para regalar?"
  var _orig=origen||(cart[key]&&cart[key].origen)||'modal';
  if(qty>stock){ qty=stock; showToast(stock?('No quedan más unidades de '+_rgNombreCorto(p)):('Sin stock de '+_rgNombreCorto(p))); }
  if(qty<=0){ delete cart[key]; }
  else{
    var tr=_rgTramo(p,qty);
    var mix=(tr.cant>1&&p.regaleria_pack_mix==='surtido');
    cart[key]={id:key,prodId:pid,nombre:p.nombre+(p.medidas?' '+String(p.medidas).trim():''),qty:qty,cajaCant:1,cajaLabel:tr.label+(mix?' surtido':''),precio:tr.unit,isCosm:true,isRegalo:true,origen:_orig,pData:{pm:tr.unit,pe:tr.unit,pi:tr.unit}};
  }
  updateCartCount();
  _rgRefrescarUI();
}
function _rgMas(pid,d,cant,origen){ cant=parseInt(cant)||1; _rgSetQty(pid,_rgEnCarrito(pid)+d*cant,origen); }   // cant = paso (1, 5, 10 unidades)
function _rgElegidoDesdePestana(){ return Object.values(cart||{}).some(function(i){ return i&&i.isRegalo&&i.origen==='pestana'; }); }
function _rgRefrescarUI(){
  try{ if(typeof renderDrawer==='function') renderDrawer(); }catch(e){}
  try{ var mb=document.getElementById('_rgModalBody'); if(mb){ mb.innerHTML=_rgModalBodyHTML(); var mf=document.getElementById('_rgModalTot'); if(mf) mf.innerHTML=_rgModalTotHTML(); } }catch(e){}
  try{ var cb=document.getElementById('_rgCobBloque'); if(cb){ cb.innerHTML=_rgBloqueCobroHTML(); if(typeof _catCobActState==='function') _catCobActState(); } }catch(e){}
  try{ if(curTab==='regaleria'){ var lc=document.getElementById('listContainer'); if(lc && lc.querySelector('.rg-wrap')) _rgRenderPestana(lc); }
       else { var lc2=document.getElementById('listContainer'); if(lc2 && lc2.querySelector('.rg-busq') && typeof applyFilters==='function') applyFilters(); } }catch(e){}
}
function _rgQtyHTML(p,cls,cant,origen){
  cant=parseInt(cant)||1;   // paso: 1 suelto, 5 o 10 por pack
  var n=_rgEnCarrito(p.id), stock=p.stock_actual||0, og=JSON.stringify(origen||'pestana');
  if(stock<=0 && n<=0) return "<span class='rg-stk low'>Sin stock</span>";
  return "<div class='rg-qty"+(cls?' '+cls:'')+"'>"+
    "<button type='button' onclick='_rgMas("+p.id+",-1,"+cant+","+og+")' "+(n<=0?'disabled':'')+">&minus;</button>"+
    "<span>"+n+(cant>1?"<small> u.</small>":"")+"</span>"+
    "<button type='button' onclick='_rgMas("+p.id+",1,"+cant+","+og+")' "+(n>=stock?'disabled':'')+">+</button>"+
  "</div>";
}
function _rgTier(pid,cant,idx){ window._rgTierSel[pid]=parseInt(cant)||1; var el=document.getElementById('rgc_'+idx), f=window._rgFamCache&&window._rgFamCache[idx]; if(el&&f) el.outerHTML=_rgCardHTML(f,idx); }
function _rgTiersHTML(p,idx){
  var tiers=_rgTiers(p); if(tiers.length<2) return '';
  var sel=_rgTierActual(p), uni=_rgPrecio(p);
  return "<div class='rg-tiers'>"+tiers.map(function(t){
    var pu=t.precio/t.cant;   // 2026-10-08: sin porcentaje de ahorro en los packs (pedido de Ger)
    return "<button type='button' class='rg-tier"+(t.cant===sel?' act':'')+"' onclick='_rgTier("+p.id+","+t.cant+","+idx+")'><b>"+(t.cant>1?'Pack x'+t.cant:'Precio de lista')+"</b><span>"+fmt(t.precio)+"</span>"+(t.cant>1?"<small>"+fmt(Math.round(pu))+" c/u</small>":"<small>por unidad</small>")+"</button>";
  }).join('')+"</div>";
}
// fotos del producto: principal (o la de la familia) + fotos extra cargadas en Belle
function _rgFotosDe(p){
  var out=[]; var f=_rgFoto(p); if(f) out.push(f);
  (Array.isArray(p.fotos)?p.fotos:[]).forEach(function(u){ if(u&&out.indexOf(u)<0) out.push(u); });
  return out;
}
function _rgGalPaso(btn,d){
  var g=btn.closest('.rg-gal'); if(!g) return;
  var imgs=g.querySelectorAll('img'), dots=g.querySelectorAll('.rg-dots i'); if(imgs.length<2) return;
  var cur=0; imgs.forEach(function(im,i){ if(im.classList.contains('act')) cur=i; });
  var nx=(cur+d+imgs.length)%imgs.length;
  imgs.forEach(function(im,i){ im.classList.toggle('act',i===nx); }); dots.forEach(function(dt,i){ dt.classList.toggle('act',i===nx); });
  g._rgPausa=Date.now();
}
// pasan solas según data-seg (se frenan 8 s después de un toque); el reloj mira cada 250 ms
setInterval(function(){
  // 2026-10-08: cada galería pasa según sus segundos (data-seg): modal 3 s, tarjeta = fotos_seg del producto
  var ahora=Date.now();
  document.querySelectorAll('.rg-gal-th').forEach(function(t){
    var imgs=t.querySelectorAll('img'); if(imgs.length<2) return;
    var seg=(parseFloat(t.getAttribute('data-seg'))||3)*1000; if(t._rgNext&&ahora<t._rgNext) return; t._rgNext=ahora+seg;
    var cur=0; imgs.forEach(function(im,i){ if(im.classList.contains('act')) cur=i; });
    var nx=(cur+1)%imgs.length; imgs.forEach(function(im,i){ im.classList.toggle('act',i===nx); });
  });
  document.querySelectorAll('.rg-gal').forEach(function(g){
    if(g.classList.contains('ef-manual')) return;   // 2026-10-09: "sin pasar solas": solo con la flechita
    if(g._rgPausa && Date.now()-g._rgPausa<8000) return;
    var seg=(parseFloat(g.getAttribute('data-seg'))||3.5)*1000; if(g._rgNext&&ahora<g._rgNext) return; g._rgNext=ahora+seg;
    var b=g.querySelector('.rg-gal-n'); if(b){ _rgGalPaso(b,1); g._rgPausa=0; }
  });
},250);
// ── Pestaña Regalería: una tarjeta por familia, chips por color ──
function _rgFamilias(filtro){
  var lista=(allProds||[]).filter(function(p){ return _rgEsReg(p) && filtro(p); });
  var fams={}, orden=[];
  lista.forEach(function(p){
    // 2026-10-04: el grupo es explícito (grupo_id, armado en Belle); sin grupo, cada producto va solo
    var k=p.grupo_id?('g'+p.grupo_id):('#'+p.id);
    if(!fams[k]){ fams[k]={key:k,nombre:(p.familia||p.nombre||'').trim()||('#'+p.id),grupo:p.regaleria_grupo||'otro',prods:[],orden:p.regaleria_orden||0}; orden.push(k); }
    fams[k].prods.push(p);
    if((p.regaleria_orden||0)<fams[k].orden) fams[k].orden=p.regaleria_orden||0;
  });
  return orden.map(function(k){ var f=fams[k]; f.prods.sort(function(a,b){ return (a.regaleria_orden||0)-(b.regaleria_orden||0)||a.id-b.id; }); var _rep=_rgFamSel(f); if(_rep&&_rep.nombre) f.nombre=_rep.nombre; return f; })
    .sort(function(a,b){ return a.orden-b.orden; });
}
function _rgFamSel(f){
  var sel=window._rgSel[f.key];
  var p=f.prods.find(function(x){ return x.id===sel; });
  // primero el marcado ⭐ en Belle; si no, el de más stock
  if(!p) p=f.prods.find(function(x){ return x.grupo_principal && (x.stock_actual||0)>0; });   // ⭐ solo si tiene stock
  if(!p) p=f.prods.slice().sort(function(a,b){ return (b.stock_actual||0)-(a.stock_actual||0) || a.id-b.id; })[0]||f.prods[0];
  return p;
}
function _rgElegir(key,pid,idx){
  window._rgSel[key]=pid;
  var el=document.getElementById('rgc_'+idx); if(!el) return;
  var f=window._rgFamCache&&window._rgFamCache[idx]; if(!f) return;
  el.outerHTML=_rgCardHTML(f,idx);
}
function _rgCardHTML(f,idx){
  var p=_rgFamSel(f); if(!p) return '';
  var foto=_rgFoto(p), stock=p.stock_actual||0, tier=_rgTierActual(p), uni=_rgUnidades(p.id);
  var surtido=(tier>1&&p.regaleria_pack_mix==='surtido');
  var chips=surtido?"<div class='rg-colors'><span class='rg-chip act'>🎨 Colores variados</span><small style='font-size:.6rem;color:var(--mid);align-self:center'>el pack viene surtido</small></div>":f.prods.length>1?("<div class='rg-colors'>"+f.prods.map(function(x){
      var act=x.id===p.id, off=(x.stock_actual||0)<=0;
      return "<button type='button' class='rg-chip"+(act?' act':'')+(off?' off':'')+"' onclick='_rgElegir("+JSON.stringify(f.key)+","+x.id+","+idx+")' title='"+_catEsc(x.color||x.nombre)+(off?' (sin stock)':'')+"'>"+_rgDot(x)+"<span>"+_catEsc(x.color||x.nombre)+"</span></button>";
    }).join('')+"</div>"):(p.color?"<div class='rg-colors'><span class='rg-chip act'>"+_rgDot(p)+"<span>"+_catEsc(p.color)+"</span></span></div>":'');
  var stk=stock<=0?"<span class='rg-stk low'>Sin stock por ahora</span>":"";
  var gl=_RG_GRUPOS.find(function(g){ return g[0]===f.grupo; });
  var fotos=_rgFotosDe(p);
  return "<div class='rg-card' id='rgc_"+idx+"'>"+
    "<div class='rg-img"+(fotos.length>1?" rg-gal ef-"+_catEsc(p.fotos_efecto||'fundido'):"")+"' data-pid='"+p.id+"' data-seg='"+(parseFloat(p.fotos_seg)||3.5)+"'>"+(fotos.length?fotos.map(function(u,i){ return "<img src='"+_catEsc(u)+"' alt='"+_catEsc(f.nombre)+"' loading='lazy' class='"+(i===0?'act':'')+"'>"; }).join('')+(fotos.length>1?"<span class='rg-dots'>"+fotos.map(function(_,i){ return "<i class='"+(i===0?'act':'')+"'></i>"; }).join('')+"</span><button type='button' class='rg-gal-n' onclick='_rgGalPaso(this,1)' aria-label='Siguiente foto'>›</button>":""):"<span class='rg-ph'>"+(gl?gl[2]:'🎁')+"</span>")+
      (gl?"<span class='rg-tag'>"+gl[1].replace(/s$/,'')+"</span>":'')+"</div>"+
    "<div class='rg-body'>"+
      "<div class='rg-name'>"+_catEsc(f.nombre)+"</div>"+
      (p.medidas?"<span class='rg-tam' title='Tamaño'><i>📐</i>"+_catEsc(p.medidas)+"</span>":'')+
      chips+
      _rgTiersHTML(p,idx)+
      "<div class='rg-row'><div class='rg-price'>"+fmt(_rgTierPrecio(p,tier))+"<small>"+(tier>1?"pack x"+tier+" · "+fmt(Math.round(_rgTierPrecio(p,tier)/tier))+" c/u":"c/u")+"</small></div>"+stk+"</div>"+
      (uni>0?"<div class='rg-enped'>En tu pedido: <b>"+uni+" u.</b> a "+fmt(_rgTramo(p,uni).unit)+" c/u ("+_rgTramo(p,uni).label+") = <b>"+fmt(_rgTramo(p,uni).unit*uni)+"</b></div>":"")+
      "<div class='rg-row'>"+_rgQtyHTML(p,'',tier)+
        (stock>0?"<button type='button' class='rg-add"+(uni>0?' ok':'')+"' onclick='"+(uni>0?"toggleCart()":"_rgMas("+p.id+",1,"+tier+",\"pestana\")")+"'>"+(uni>0?"Ver pedido":(tier>1?"Agregar pack x"+tier:"Agregar"))+"</button>":'')+
      "</div>"+
    "</div>"+
  "</div>";
}
// 2026-10-08: grilla de packaging para los resultados de búsqueda (misma tarjeta que la pestaña)
function _rgGridHTML(lista){
  var ids={}; (lista||[]).forEach(function(p){ ids[p.id]=1; });
  var fams=_rgFamilias(function(p){ return ids[p.id] && ((p.stock_actual||0)>0 || _rgEnCarrito(p.id)>0); });
  window._rgFamCache=fams;
  if(!fams.length) return '';
  return "<div class='rg-wrap rg-busq' style='grid-column:1/-1'><div class='rg-sec-t'><b>🛍️</b> Packaging</div><div class='rg-grid'>"+fams.map(function(f){ return _rgCardHTML(f,fams.indexOf(f)); }).join('')+"</div></div>";
}
function _rgRenderPestana(cont){
  cont=cont||document.getElementById('listContainer'); if(!cont) return;
  // 2026-10-08: sin stock no se muestra (ni el color ni la tarjeta), salvo que ya esté en el pedido
  var fams=_rgFamilias(function(p){ return !_rgOcultoCat(p) && ((p.stock_actual||0)>0 || _rgEnCarrito(p.id)>0); });
  window._rgFamCache=fams;
  if(!fams.length){ cont.innerHTML="<p class='empty'>Todavía no hay regalería cargada.</p>"; return; }
  var html="<div class='rg-page'>"+_rgConfetiHTML(22)+
    "<div class='rg-lado izq' aria-hidden='true'>"+_rgEscenaLadoIzq()+"</div>"+
    "<div class='rg-lado der' aria-hidden='true'>"+_rgEscenaLadoDer()+"</div>"+
    "<div class='rg-wrap'>";
  html+="<div class='rg-hero'><div class='rg-hero-txt'><span class='rg-kicker'><i></i> Para tu emprendimiento</span>"+
    "<h2 class='rg-h'><span>"+_catEsc(window._rgPestTit)+"</span></h2>"+
    "<p>"+_catEsc(window._rgPestSub)+"</p>"+
    "<div class='rg-benef'><span>📦 Packs con descuento</span>"+((allProds||[]).some(function(x){ return _rgEsReg(x)&&x.regaleria_grupo==='tarjeta'&&(x.stock_actual||0)>0&&!x.oculto; })?"<span>💌 Tarjetas de dedicatoria</span>":"")+"<span>🚚 Viaja con tu pedido</span>"+(((parseInt(window._rgMin)||0)>0&&!(typeof _madreEsVip==='function'&&_madreEsVip()))?"<span>🧴 Con pedidos desde "+fmt(parseInt(window._rgMin))+"</span>":"")+"</div></div>"+
    "<div class='rg-hero-esc' aria-hidden='true'>"+_rgEscenaHero()+"</div></div>";
  html+=_rgKitsHTML();
  _RG_GRUPOS.forEach(function(g){
    var fs=fams.filter(function(f){ return (f.grupo||'otro')===g[0]; });
    if(!fs.length) return;
    html+="<div><div class='rg-sec-t'><b>"+g[2]+"</b> "+g[1]+"</div><div class='rg-grid'>"+
      fs.map(function(f){ return _rgCardHTML(f,fams.indexOf(f)); }).join('')+"</div></div>";
  });
  html+="</div></div>";
  cont.innerHTML=html;
}
// ── Kits de presentación (combos es_kit): fotos de todo lo que incluyen, precio cerrado ──
function _rgKitCollage(k){
  var fotos=[]; (k.combo_items||[]).forEach(function(it){ var p=_rgProd(it.producto_id); var f=p?_rgFoto(p):''; if(f&&fotos.indexOf(f)<0) fotos.push(f); });
  fotos=fotos.slice(0,4);
  if(!fotos.length) return "<div class='rg-kit-img'><span class='rg-ph'>🎁</span></div>";
  return "<div class='rg-kit-img n"+fotos.length+"'>"+fotos.map(function(f,i){ return "<img src='"+_catEsc(f)+"' alt='' loading='lazy' style='--i:"+i+"'>"; }).join('')+"</div>";
}
function _rgKitSuelto(k){ return (k.combo_items||[]).reduce(function(s,it){ var p=_rgProd(it.producto_id); return s+((p?_rgPrecio(p):0)*(parseInt(it.cantidad)||1)); },0); }
function _rgKitCard(k, compacto){
  var qty=cart['combo_'+k.id]?(cart['combo_'+k.id].qty||0):0, max=_comboMaxAgregable(k), precio=_comboPrecioVigente(k), suelto=_rgKitSuelto(k), ah=suelto>precio?Math.round((1-precio/suelto)*100):0;
  var lista=(k.combo_items||[]).map(function(it){ var p=_rgProd(it.producto_id); return "<li>"+it.cantidad+"× "+_catEsc(p?_rgNombreCorto(p):(it.producto_nombre||''))+"</li>"; }).join('');
  var step="<div class='rg-qty'><button type='button' onclick='_rgKitQty("+k.id+",-1)' "+(qty<=0?'disabled':'')+">&minus;</button><span>"+qty+"</span><button type='button' onclick='_rgKitQty("+k.id+",1)' "+(qty>=max?'disabled':'')+">+</button></div>";
  if(compacto){
    return "<div class='rg-it"+(qty>0?' en':'')+"'><div class='rg-it-fila'>"+_rgKitCollage(k).replace('rg-kit-img','rg-kit-img th')+"<div class='in'><div class='n'>🎁 "+_catEsc(k.nombre)+"</div><div class='m'>"+(k.combo_items||[]).map(function(it){ var p=_rgProd(it.producto_id); return it.cantidad+'× '+_catEsc(p?_rgNombreCorto(p):(it.producto_nombre||'')); }).join(' · ')+"</div><div class='p'>"+fmt(precio)+(ah>0?" <span style='font-size:.6rem;color:#2e7d4f;font-weight:600'>· ahorrás "+ah+"%</span>":'')+"</div></div>"+step+"</div></div>";
  }
  return "<div class='rg-card rg-kit' id='rgk_"+k.id+"'>"+_rgKitCollage(k)+(k.etiqueta?"<span class='rg-tag rg-tag-k'>"+_catEsc(k.etiqueta)+"</span>":"<span class='rg-tag rg-tag-k'>"+((k.precio_oferta>0)?'Oferta':'Novedad')+"</span>")+
    "<div class='rg-body'><div class='rg-name'>🎁 "+_catEsc(k.nombre)+"</div>"+(k.descripcion?"<div class='rg-med'>"+_catEsc(k.descripcion)+"</div>":'')+
    "<ul class='rg-kit-lista'>"+lista+"</ul>"+
    "<div class='rg-row'><div class='rg-price'>"+fmt(precio)+(suelto>precio?"<small><s>"+fmt(suelto)+"</s>"+(ah>0?" · −"+ah+"%":"")+"</small>":"")+"</div>"+(max>0?(max<=5?"<span class='rg-stk low'>¡Quedan "+max+"!</span>":"<span class='rg-stk'>"+max+" disponibles</span>"):"<span class='rg-stk low'>Sin stock</span>")+"</div>"+
    "<div class='rg-row'>"+step+(max>0?"<button type='button' class='rg-add"+(qty>0?' ok':'')+"' onclick='"+(qty>0?"toggleCart()":"_rgKitQty("+k.id+",1)")+"'>"+(qty>0?"✓ "+qty+" en tu pedido":"Agregar kit")+"</button>":'')+"</div>"+
  "</div></div>";
}
function _rgKitsHTML(){
  var ks=_rgKits().filter(function(k){ return _comboMaxAgregable(k)>0 || cart['combo_'+k.id]; });
  if(!ks.length) return '';
  return "<div><div class='rg-sec-t'><b>🎁</b> Kits de presentación <small>armados con todo lo que necesitás, a precio cerrado</small></div><div class='rg-grid'>"+ks.map(function(k){ return _rgKitCard(k,false); }).join('')+"</div></div>";
}
function _rgKitQty(id,d){
  var key='combo_'+id;
  if(d>0){ agregarComboCarrito(id,1); }
  else if(cart[key]){ cart[key].qty-=1; if(cart[key].qty<=0) delete cart[key]; updateCartCount(); }
  _rgRefrescarUI();
}
// ── Escenas animadas estilo riso (misma paleta que Día de la Madre, otros dibujos) ──
var _RG_TRAMA="<defs><pattern id='rgTr' width='6' height='6' patternUnits='userSpaceOnUse' patternTransform='rotate(30)'><circle cx='3' cy='3' r='1.3' fill='#765BA7' opacity='.35'/></pattern><pattern id='rgTrR' width='7' height='7' patternUnits='userSpaceOnUse' patternTransform='rotate(60)'><circle cx='3.5' cy='3.5' r='1.6' fill='#FF48B0' opacity='.5'/></pattern></defs>";
function _rgCaja(x,y,w,h,col,cinta,cls,delay){
  // caja de regalo: cuerpo con trama, cinta en cruz, tapa y moño
  return "<g transform='translate("+x+" "+y+")' class='"+(cls||'')+"' style='"+(delay?"animation-delay:"+delay+"s":"")+"'>"+
    "<rect x='"+(-w/2+3)+"' y='"+(-h+3)+"' width='"+w+"' height='"+h+"' fill='#765BA7' opacity='.45'/>"+
    "<rect x='"+(-w/2)+"' y='"+(-h)+"' width='"+w+"' height='"+h+"' fill='"+col+"'/>"+
    "<rect x='"+(-w/2)+"' y='"+(-h)+"' width='"+w+"' height='"+h+"' fill='url(#rgTr)'/>"+
    "<rect x='-5' y='"+(-h)+"' width='10' height='"+h+"' fill='"+cinta+"'/>"+
    "<rect x='"+(-w/2)+"' y='"+(-h/2-5)+"' width='"+w+"' height='10' fill='"+cinta+"'/>"+
    "<g class='rg-tapa'><rect x='"+(-w/2-5)+"' y='"+(-h-14)+"' width='"+(w+10)+"' height='16' rx='2' fill='"+col+"' stroke='#3A2B63' stroke-width='1.2'/>"+
    "<rect x='-5' y='"+(-h-14)+"' width='10' height='16' fill='"+cinta+"'/>"+
    "<g transform='translate(0 "+(-h-16)+")'><path d='M0 0 C-14 -14 -22 -4 -6 2 Z' fill='"+cinta+"' stroke='#3A2B63' stroke-width='1'/><path d='M0 0 C14 -14 22 -4 6 2 Z' fill='"+cinta+"' stroke='#3A2B63' stroke-width='1'/><circle r='3' fill='#FFE800' stroke='#3A2B63' stroke-width='1'/></g></g>"+
  "</g>";
}
function _rgGlobo(x,y,col,cls,delay){
  return "<g transform='translate("+x+" "+y+")' class='"+cls+"' style='"+(delay?"animation-delay:"+delay+"s":"")+"'><path d='M0 22 q-4 26 0 46' fill='none' stroke='#3A2B63' stroke-width='1.3'/><ellipse rx='16' ry='20' fill='"+col+"'/><ellipse rx='16' ry='20' fill='url(#rgTrR)' opacity='.45'/><path d='M0 20 l-4 5 8 0z' fill='"+col+"'/><ellipse cx='-6' cy='-8' rx='3' ry='5' fill='#fff' opacity='.55'/></g>";
}
function _rgEstrella(x,y,sz,col,delay){
  return "<path transform='translate("+x+" "+y+") scale("+sz+")' class='rg-brillo' style='animation-delay:"+delay+"s' d='M0 -10 L2.6 -2.6 L10 0 L2.6 2.6 L0 10 L-2.6 2.6 L-10 0 L-2.6 -2.6 Z' fill='"+col+"'/>";
}
function _rgCorazon(x,y,sz,col,delay){
  return "<path transform='translate("+x+" "+y+") scale("+sz+")' class='rg-late' style='animation-delay:"+delay+"s' d='M0 8 C-14 -6 -14 -20 0 -14 C14 -20 14 -6 0 8Z' fill='"+col+"'/>";
}
function _rgEscenaLadoIzq(){
  return "<svg viewBox='0 0 150 320' xmlns='http://www.w3.org/2000/svg' class='rg-lado-top'>"+_RG_TRAMA+
    _rgGlobo(40,70,'#FF48B0','rg-globo',0)+_rgGlobo(95,110,'#FFE800','rg-globo',1.4)+
    _rgEstrella(120,40,.8,'#FF6C2F',.3)+_rgEstrella(20,170,.6,'#765BA7',1.1)+_rgEstrella(130,220,.7,'#FFE800',2)+
    _rgCorazon(30,260,.9,'#FF48B0',.5)+_rgCorazon(115,300,.7,'#FF6C2F',1.6)+
  "</svg>"+
  "<svg viewBox='0 0 150 200' xmlns='http://www.w3.org/2000/svg' class='rg-lado-bot'>"+_RG_TRAMA+
    _rgEstrella(30,40,.7,'#0078BF',.9)+_rgCorazon(120,60,.8,'#765BA7',1.3)+
    "<path d='M0 110 Q75 80 150 110 L150 200 L0 200 Z' fill='#FF48B0'/><path d='M0 110 Q75 80 150 110 L150 200 L0 200 Z' fill='url(#rgTr)'/>"+
    _rgCaja(75,102,70,54,'#FF6C2F','#FFE800','rg-rebote',0)+_rgCaja(28,110,40,34,'#765BA7','#FF48B0','rg-rebote',.5)+_rgCaja(126,108,36,28,'#0078BF','#FFE800','rg-rebote',.9)+
  "</svg>";
}
function _rgEscenaLadoDer(){
  return "<svg viewBox='0 0 150 320' xmlns='http://www.w3.org/2000/svg' class='rg-lado-top'>"+_RG_TRAMA+
    "<g class='rg-cinta' transform='translate(70 60)'><path d='M-40 0 C-20 -30 20 30 40 0' fill='none' stroke='#FF48B0' stroke-width='6' stroke-linecap='round'/><path d='M-40 14 C-20 -16 20 44 40 14' fill='none' stroke='#FFE800' stroke-width='6' stroke-linecap='round'/></g>"+
    _rgEstrella(25,130,.7,'#FFE800',.8)+_rgEstrella(120,150,.9,'#FF48B0',1.7)+_rgEstrella(70,200,.5,'#0078BF',.2)+
    _rgCorazon(40,250,.8,'#765BA7',1.2)+_rgCorazon(120,290,.9,'#FF48B0',.4)+_rgGlobo(100,230,'#FF6C2F','rg-globo',.9)+
  "</svg>"+
  "<svg viewBox='0 0 150 200' xmlns='http://www.w3.org/2000/svg' class='rg-lado-bot'>"+_RG_TRAMA+
    _rgEstrella(120,30,.8,'#FFE800',.4)+_rgCorazon(25,50,.7,'#FF48B0',1.9)+
    "<path d='M0 110 Q75 80 150 110 L150 200 L0 200 Z' fill='#765BA7'/><path d='M0 110 Q75 80 150 110 L150 200 L0 200 Z' fill='url(#rgTr)'/>"+
    "<g transform='translate(75 104)' class='rg-tambalea'>"+
      "<path d='M-40 -100 L40 -100 L48 0 L-48 0 Z' fill='#765BA7' opacity='.45' transform='translate(3 3)'/>"+
      "<path d='M-40 -100 L40 -100 L48 0 L-48 0 Z' fill='#FF48B0'/><path d='M-40 -100 L40 -100 L48 0 L-48 0 Z' fill='url(#rgTr)'/>"+
      "<path d='M-22 -100 C-24 -128 -6 -128 -4 -100' fill='none' stroke='#3A2B63' stroke-width='3'/><path d='M4 -100 C6 -128 24 -128 22 -100' fill='none' stroke='#3A2B63' stroke-width='3'/>"+
      "<g class='rg-seda'><path d='M-30 -100 L-22 -130 L-12 -104 L-2 -134 L8 -104 L18 -128 L28 -100 Z' fill='#FFE800'/><path d='M-24 -100 L-16 -122 L-6 -102 L4 -124 L14 -102 L24 -100 Z' fill='#FF6C2F' opacity='.85'/></g>"+
      "<path d='M-12 -60 C-26 -74 -26 -88 -12 -82 C2 -88 2 -74 -12 -60Z' fill='#FFE800'/><text x='4' y='-48' font-family=\"'DM Sans',sans-serif\" font-weight='800' font-size='13' fill='#FFE800'>Belle</text>"+
    "</g>"+
    _rgCaja(22,110,34,26,'#FFE800','#FF6C2F','rg-rebote',1.2)+
  "</svg>";
}
function _rgEscenaHero(){
  return "<svg viewBox='0 0 360 250' xmlns='http://www.w3.org/2000/svg'>"+_RG_TRAMA+
    "<path d='M10 215 Q180 180 350 215 L350 250 L10 250 Z' fill='#FF48B0'/><path d='M10 215 Q180 180 350 215 L350 250 L10 250 Z' fill='url(#rgTr)'/>"+
    _rgEstrella(50,40,1,'#FFE800',0)+_rgEstrella(300,30,1.2,'#FF6C2F',.7)+_rgEstrella(330,120,.7,'#765BA7',1.4)+_rgEstrella(30,120,.8,'#0078BF',2.1)+
    _rgCorazon(120,50,1,'#FF48B0',.9)+_rgCorazon(250,70,.8,'#765BA7',1.8)+
    _rgGlobo(310,70,'#FFE800','rg-globo',.6)+
    "<g class='rg-salta' transform='translate(180 208)'>"+
      "<rect x='-57' y='-73' width='114' height='80' fill='#765BA7' opacity='.45'/><rect x='-60' y='-76' width='114' height='80' fill='#FF6C2F'/><rect x='-60' y='-76' width='114' height='80' fill='url(#rgTr)'/>"+
      "<rect x='-8' y='-76' width='16' height='80' fill='#FFE800'/><rect x='-60' y='-44' width='114' height='16' fill='#FFE800'/>"+
      "<g class='rg-tapa-pop'><rect x='-68' y='-96' width='130' height='24' rx='3' fill='#FF6C2F' stroke='#3A2B63' stroke-width='1.5'/><rect x='-8' y='-96' width='16' height='24' fill='#FFE800'/>"+
      "<g transform='translate(0 -98)' class='rg-vaiven'><path d='M0 0 C-22 -22 -34 -6 -10 4 Z' fill='#FF48B0' stroke='#3A2B63' stroke-width='1.2'/><path d='M0 0 C22 -22 34 -6 10 4 Z' fill='#FF48B0' stroke='#3A2B63' stroke-width='1.2'/><path d='M-4 2 l-10 22 6 -2 4 -18z' fill='#FF48B0'/><path d='M4 2 l10 22 -6 -2 -4 -18z' fill='#FF48B0'/><circle r='5' fill='#FFE800' stroke='#3A2B63' stroke-width='1.2'/></g></g>"+
      "<g class='rg-chispas'><circle cx='-40' cy='-120' r='4' fill='#FFE800'/><circle cx='30' cy='-130' r='3' fill='#FF48B0'/><rect x='-10' y='-140' width='6' height='6' fill='#0078BF' transform='rotate(20)'/><circle cx='50' cy='-108' r='3.5' fill='#765BA7'/><rect x='-55' y='-135' width='5' height='5' fill='#FF6C2F'/></g>"+
    "</g>"+
    _rgCaja(70,214,44,36,'#0078BF','#FF48B0','rg-rebote',.4)+_rgCaja(290,216,50,40,'#765BA7','#FFE800','rg-rebote',1)+
  "</svg>";
}
function _rgConfetiHTML(n){
  var cols=['#FF48B0','#FF6C2F','#FFE800','#765BA7','#0078BF','#00A95C'], h="<div class='rg-confeti' aria-hidden='true'>";
  for(var i=0;i<n;i++){
    var c=cols[i%cols.length], left=(i*37+13)%100, del=((i*7)%20)/2, dur=9+((i*5)%8), sz=6+((i*3)%6);
    h+="<i style='left:"+left+"%;background:"+c+";animation-delay:-"+del+"s;animation-duration:"+dur+"s;width:"+sz+"px;height:"+(sz*(i%3?1:.5))+"px;border-radius:"+(i%2?'50%':'2px')+"'></i>";
  }
  return h+"</div>";
}
// ── Bloque en el carrito ──
function _rgResumenTxt(){
  var its=_rgItems(); if(!its.length && !_rgKitItems().length) return '';
  var ks=_rgKitItems().map(function(i){ var k=_rgKitDe(i); return i.qty+' × 🎁 '+_catEsc(k?k.nombre:i.nombre); });
  return ks.concat(its.map(function(i){ var p=_rgProd(i.prodId); return i.qty+' u. '+_catEsc(p?_rgNombreCorto(p):i.nombre)+((i.cajaLabel||'').indexOf('pack')===0?' ('+_catEsc(i.cajaLabel)+')':''); })).join(' · ');
}
function _rgSeparadorHTML(){ return "<div class='rg-sep'>🎁 Para regalar</div>"; }
function _rgMinHTML(){
  var c=_rgChequearMinimo();
  var vip=(typeof _madreEsVip==='function'&&_madreEsVip());
  if(c.ok){ var min=parseInt(window._rgMin)||0; if(!vip && min>0 && !_rgHayRegalo() && (_catCobCalcSubtotal()<min)) return "<div class='rg-min'>Con pedidos desde "+fmt(min)+".</div>"; return ''; }
  // 2026-10-08: si el pedido es SOLO packaging, el cartel lo dice sin vueltas
  var soloPack=(c.base||0)<=0;
  return "<div class='rg-min"+(soloPack?' solo':'')+"'>"+(soloPack?"🧴 El packaging se vende junto con tus productos: sumá "+fmt(c.min)+" en productos para poder enviarlo.":"⚠️ "+_catEsc(c.msg))+"</div>";
}
function _rgBloqueCarritoHTML(){
  if(!Object.keys(cart||{}).length) return '';
  var hay=(allProds||[]).some(function(p){ return _rgEsReg(p)&&p.en_regaleria&&(p.stock_actual||0)>0; });
  if(!hay && !_rgHayRegalo()) return '';
  var tiene=_rgHayRegalo();
  // 2026-10-09: si eligió el packaging desde la pestaña, el carrito no le vuelve a preguntar si es para regalar
  if(_rgElegidoDesdePestana()){ var _m=_rgMinHTML(); return _m?"<div class='rg-bloque'>"+_m+"</div>":''; }
  var h="<div class='rg-bloque'>";
  h+="<div class='rg-bt'>"+_catEsc(window._rgTitulo)+"</div>";
  if(!tiene){
    h+="<div class='rg-bs'>"+_catEsc(window._rgSub)+"</div>";
    h+=_rgMinHTML();
    h+="<button type='button' class='rg-bbtn' onclick='_rgAbrirModal()'>Elegir presentación</button>";
  }else{
    h+="<div class='rg-res'><div>"+_rgResumenTxt()+"</div><div><b>"+fmt(_rgSubtotal())+"</b> en regalería</div></div>";
    h+=_rgMinHTML();
    h+="<button type='button' class='rg-bbtn lleno' onclick='_rgAbrirModal()'>Cambiar o agregar</button>";
  }
  h+="</div>";
  return h;
}
// ── Bloque en el modal de cobro ──
function _rgBloqueCobroHTML(){
  var hay=(allProds||[]).some(function(p){ return _rgEsReg(p)&&p.en_regaleria&&(p.stock_actual||0)>0; });
  if(!hay && !_rgHayRegalo()) return '';
  var tiene=_rgHayRegalo();
  if(_rgElegidoDesdePestana()){ var _m2=_rgMinHTML(); return _m2?"<div class='rg-bloque' style='margin:0'>"+_m2+"</div>":''; }
  var h="<div class='rg-bloque' style='margin:0'>";
  h+="<div class='rg-bt'>"+_catEsc(window._rgTitulo)+"</div>";
  if(!tiene){
    h+="<div class='rg-bs'>"+_catEsc(window._rgSub)+"</div>"+_rgMinHTML();
    h+="<button type='button' class='rg-bbtn' onclick='_rgAbrirModal()'>Agregar presentación</button>";
  }else{
    h+="<div class='rg-res'><div>"+_rgResumenTxt()+"</div><div><b>"+fmt(_rgSubtotal())+"</b> en regalería</div></div>"+_rgMinHTML();
    h+="<button type='button' class='rg-bbtn lleno' onclick='_rgAbrirModal()'>Cambiar</button>";
  }
  h+="</div>";
  return h;
}
// ── Modal ──
function _rgElegirM(key,pid,idx){
  window._rgSel[key]=pid;
  var el=document.getElementById('rgm_'+idx); var f=window._rgFamCacheM&&window._rgFamCacheM[idx];
  if(el&&f) el.outerHTML=_rgMRowHTML(f,idx);
}
function _rgMRowHTML(f,idx){
  var p=_rgFamSel(f); if(!p) return '';
  var foto=_rgFoto(p), n=_rgEnCarrito(p.id,1), stock=p.stock_actual||0;
  var fotos=_rgFotosDe(p);   // 2026-10-08: varias fotos → la miniatura del modal las va pasando (como la tarjeta)
  var gl=_RG_GRUPOS.find(function(g){ return g[0]===f.grupo; });
  var chips=f.prods.length>1?("<div class='rg-colors'>"+f.prods.map(function(x){
      var act=x.id===p.id, off=(x.stock_actual||0)<=0;
      return "<button type='button' class='rg-chip"+(act?' act':'')+(off?' off':'')+"' onclick='_rgElegirM("+JSON.stringify(f.key)+","+x.id+","+idx+")' title='"+_catEsc(x.color||x.nombre)+(off?' (sin stock)':'')+"'>"+_rgDot(x)+"<span>"+_catEsc(x.color||x.nombre)+"</span></button>";
    }).join('')+"</div>"):(p.color?"<div class='rg-colors'><span class='rg-chip act'>"+_rgDot(p)+"<span>"+_catEsc(p.color)+"</span></span></div>":'');
  var esTarjeta=(f.grupo||'')==='tarjeta';
  return "<div class='rg-it"+(n>0?' en':'')+"' id='rgm_"+idx+"'>"+
    "<div class='rg-it-fila'>"+
      (fotos.length>1
        ?"<div class='th rg-gal-th' data-seg='3'>"+fotos.map(function(u,i){ return "<img src='"+_catEsc(u)+"' alt='' loading='lazy' class='"+(i===0?'act':'')+"'>"; }).join('')+"</div>"
        :"<div class='th'>"+(foto?"<img src='"+_catEsc(foto)+"' alt='' loading='lazy'>":(gl?gl[2]:'🎁'))+"</div>")+
      "<div class='in'><div class='n'>"+_catEsc(f.nombre)+"</div>"+
        (p.medidas?"<span class='rg-tam' title='Tamaño'><i>📐</i>"+_catEsc(p.medidas)+"</span>":'')+
        "<div class='p'>"+(n>0?fmt(_rgTramo(p,n).unit)+" c/u <span style='font-size:.6rem;color:var(--mid);font-weight:500'>· "+_rgTramo(p,n).label+" · "+fmt(_rgTramo(p,n).unit*n)+"</span>":fmt(_rgPrecio(p)))+"</div>"+
        chips+
      "</div>"+
      "<div class='rg-qty-col'>"+_rgQtyHTML(p,'',1,'modal')+
        (stock>0&&!esTarjeta?"<div class='rg-pk'><button type='button' onclick='_rgMas("+p.id+",1,5,\"modal\")' "+(n+5>stock?'disabled':'')+">+5</button><button type='button' onclick='_rgMas("+p.id+",1,10,\"modal\")' "+(n+10>stock?'disabled':'')+">+10</button></div>":"")+
      "</div>"+
    "</div>"+
  "</div>";
}
function _rgModalBodyHTML(){
  var fams=_rgFamilias(function(p){ return p.en_regaleria && ((p.stock_actual||0)>0 || _rgEnCarrito(p.id)>0); });
  window._rgFamCacheM=fams;
  var kits=_rgKits().filter(function(k){ return k.kit_en_carrito && (_comboMaxAgregable(k)>0 || cart['combo_'+k.id]); });
  if(!fams.length && !kits.length) return "<p class='empty'>Por ahora no hay regalería disponible.</p>";
  var h='';
  if(kits.length) h+="<div class='rg-mg'><div class='g'>🎁 Kits</div>"+kits.map(function(k){ return _rgKitCard(k,true); }).join('')+"</div>";
  _RG_GRUPOS.forEach(function(g){
    var fs=fams.filter(function(f){ return (f.grupo||'otro')===g[0]; });
    if(!fs.length) return;
    h+="<div class='rg-mg'><div class='g'>"+g[2]+" "+g[1]+"</div>"+fs.map(function(f){ return _rgMRowHTML(f,fams.indexOf(f)); }).join('')+"</div>";
  });
  return h;
}
function _rgModalTotHTML(){
  var its=_rgItems(), u=its.reduce(function(s,i){ return s+i.qty; },0);
  return u?("<span>"+u+" artículo"+(u>1?'s':'')+" · <b>"+fmt(_rgSubtotal())+"</b></span>"):"<span>Elegí lo que quieras sumar</span>";
}
function _rgAbrirModal(){
  _rgCerrarModal();
  var mo=document.createElement('div'); mo.id='_rgModal';
  mo.innerHTML="<div class='rg-mo'>"+
    "<div class='rg-mh'><div><div class='t'>"+_catEsc(window._rgTitulo)+"</div><div class='st'>"+_catEsc(window._rgSub)+"</div></div><button type='button' onclick='_rgCerrarModal()' aria-label='Cerrar'>&times;</button></div>"+
    "<div class='rg-mb' id='_rgModalBody'>"+_rgModalBodyHTML()+"</div>"+
    "<div class='rg-mf'><div class='tot' id='_rgModalTot'>"+_rgModalTotHTML()+"</div><button type='button' class='ok' onclick='_rgCerrarModal()'>Listo</button></div>"+
  "</div>";
  mo.addEventListener('click',function(e){ if(e.target===mo) _rgCerrarModal(); });
  document.body.appendChild(mo);
  try{ if(typeof _catModalBackRegistrar==='function') _catModalBackRegistrar('_rgModal',_rgCerrarModal); }catch(e){}
}
function _rgCerrarModal(){
  var mo=document.getElementById('_rgModal'); if(!mo) return;
  mo.remove();
  try{ if(typeof _catModalBackDesregistrar==='function') _catModalBackDesregistrar('_rgModal'); }catch(e){}
  _rgRefrescarUI();
}
