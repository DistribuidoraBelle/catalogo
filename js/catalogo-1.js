
function toggleTheme(){var isDark=document.documentElement.getAttribute('data-theme')=='dark';var t=isDark?'light':'dark';document.documentElement.setAttribute('data-theme',t);localStorage.setItem('belle_cat_theme',t);_applyThemeBtn(t);if(typeof _dkFondoBarrer==='function')_dkFondoBarrer();}
// ═══ 🌙 FOTOS SIN FONDO EN MODO OSCURO (2026-09-17) ═══════════════════════════════
// En claro, mix-blend-mode:multiply "borra" el fondo blanco de las fotos. En oscuro eso no
// sirve (multiply sobre fondo oscuro oscurece todo), así que se recorta de verdad: se pinta la
// foto en un canvas, se detecta el fondo blanco conectado a los bordes (flood fill) y se lo
// vuelve transparente con borde suave. Los brillos blancos DENTRO de la botella no se tocan
// porque no están conectados al borde. Resultado en caché (blob) por URL. Si la foto no tiene
// fondo claro o el canvas queda "tainted" por CORS, se deja como está.
var _dkFondoBarrer;
// 2026-11-05: el fondo es solo el blanco NEUTRO (antes bastaba con que los tres canales superaran 214 y se comía los frascos
// crema o rosados, p. ej. 9am White); el contorno se funde en dos bandas para que no quede el filete blanco sobre el fondo oscuro.
// Recorte de fondo blanco para modo oscuro (versión nueva). px = ImageData.data, devuelve true si recortó.
window._dkRecortar=function(px,w,h){
  var i,n=0,lum=0;
  for(var x=0;x<w;x+=3){ i=x*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; i=((h-1)*w+x)*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; n+=2; }
  for(var y=0;y<h;y+=3){ i=(y*w)*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; i=(y*w+w-1)*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; n+=2; }
  if(lum/n<222) return false;
  // fondo = blanco NEUTRO (los tres canales altos y parecidos). Un frasco crema o rosado pálido no es fondo.
  var MINC=226, DIF=16, seen=new Uint8Array(w*h), st=new Int32Array(w*h), sp=0;
  function fondo(k){ var j=k*4, r=px[j],g=px[j+1],b=px[j+2]; var mn=r<g?(r<b?r:b):(g<b?g:b), mx=r>g?(r>b?r:b):(g>b?g:b); return mn>=MINC&&(mx-mn)<=DIF; }
  for(var x2=0;x2<w;x2++){ st[sp++]=x2; st[sp++]=(h-1)*w+x2; } for(var y2=0;y2<h;y2++){ st[sp++]=y2*w; st[sp++]=y2*w+w-1; }
  while(sp>0){ var k=st[--sp]; if(seen[k]||!fondo(k)) continue; seen[k]=1; var xx=k%w; if(xx>0)st[sp++]=k-1; if(xx<w-1)st[sp++]=k+1; if(k>=w)st[sp++]=k-w; if(k<w*(h-1))st[sp++]=k+w; }
  // bandas de borde (1 y 2 px hacia adentro del objeto): los píxeles claros del contorno se funden en vez de quedar como filete blanco
  var band=new Uint8Array(w*h);
  for(var k1=0;k1<w*h;k1++){ if(seen[k1]) continue; var xa=k1%w; if((xa>0&&seen[k1-1])||(xa<w-1&&seen[k1+1])||(k1>=w&&seen[k1-w])||(k1<w*(h-1)&&seen[k1+w])) band[k1]=1; }
  for(var k3=0;k3<w*h;k3++){ if(seen[k3]||band[k3]) continue; var xb=k3%w; if((xb>0&&band[k3-1]===1)||(xb<w-1&&band[k3+1]===1)||(k3>=w&&band[k3-w]===1)||(k3<w*(h-1)&&band[k3+w]===1)) band[k3]=2; }
  for(var k2=0;k2<w*h;k2++){
    var j=k2*4, l=px[j]*.299+px[j+1]*.587+px[j+2]*.114, a;
    if(seen[k2]){ a=(255-l)/(255-MINC); a=a<0?0:(a>1?1:a); px[j+3]=Math.round(px[j+3]*a*a); }
    else if(band[k2]===1){ a=(255-l)/(255-150); a=a<0?0:(a>1?1:a); px[j+3]=Math.round(px[j+3]*a); }
    else if(band[k2]===2){ a=(255-l)/(255-215); a=a<0?0:(a>1?1:a); px[j+3]=Math.round(px[j+3]*(0.55+0.45*a)); }
  }
  return true;
};
(function(){
  var cache={}, pend={}, cola=[], activos=0, MAXC=2;
  function isDark(){ return document.documentElement.getAttribute('data-theme')==='dark'; }
  function srcDe(img){ return img.getAttribute('data-orig')||img.getAttribute('src')||''; }
  function esProd(src){ return /supabase\.co\/storage\/v1\/object\/public\//.test(src); }
  function procesar(src){
    if(cache[src]!==undefined) return Promise.resolve(cache[src]==='x'?null:cache[src]);
    if(pend[src]) return pend[src];
    pend[src]=new Promise(function(res){
      var im=new Image(); im.crossOrigin='anonymous';
      im.onload=function(){
        try{
          var W=im.naturalWidth,H=im.naturalHeight; if(!W||!H){cache[src]='x';res(null);return;}
          var sc=Math.min(1,720/Math.max(W,H)); var w=Math.round(W*sc),h=Math.round(H*sc);
          var c=document.createElement('canvas'); c.width=w;c.height=h; var ctx=c.getContext('2d',{willReadFrequently:true}); ctx.drawImage(im,0,0,w,h);
          var d=ctx.getImageData(0,0,w,h), px=d.data;
          if(!window._dkRecortar(px,w,h)){ cache[src]='x'; res(null); return; }
          ctx.putImageData(d,0,0);
          c.toBlob(function(b){ if(!b){cache[src]='x';res(null);return;} var u=URL.createObjectURL(b); cache[src]=u; res(u); },'image/png');
        }catch(e){ cache[src]='x'; res(null); }
      };
      im.onerror=function(){ cache[src]='x'; res(null); };
      im.src=src;
    }).then(function(u){ delete pend[src]; return u; });
    return pend[src];
  }
  function siguiente(){
    while(activos<MAXC&&cola.length){ var img=cola.shift(); if(!document.contains(img)||!isDark()||img.classList.contains('dk-cut')){ delete img.dataset.dkBusy; continue; }
      activos++; (function(img){ var src=srcDe(img); procesar(src).then(function(u){ activos--; delete img.dataset.dkBusy; if(u&&isDark()&&document.contains(img)&&srcDe(img)===src){ if(!img.getAttribute('data-orig')) img.setAttribute('data-orig',src); img.src=u; img.classList.add('dk-cut'); if(img.parentElement) img.parentElement.classList.add('dk-plate'); } siguiente(); }); })(img); }
  }
  function aplicar(img){
    if(!isDark()||img.classList.contains('dk-cut')||img.dataset.dkBusy) return;
    var src=srcDe(img); if(!esProd(src)) return;
    img.dataset.dkBusy='1'; cola.push(img); siguiente();
  }
  function restaurar(img){ var o=img.getAttribute('data-orig'); if(o) img.src=o; img.classList.remove('dk-cut'); img.removeAttribute('data-orig'); delete img.dataset.dkBusy; if(img.parentElement) img.parentElement.classList.remove('dk-plate'); }
  _dkFondoBarrer=function(){ var imgs=document.querySelectorAll('img'); for(var i=0;i<imgs.length;i++){ if(isDark()) aplicar(imgs[i]); else if(imgs[i].classList.contains('dk-cut')) restaurar(imgs[i]); } };
  try{
    var mo=new MutationObserver(function(ms){
      if(!isDark()) return;
      for(var i=0;i<ms.length;i++){ var m=ms[i];
        if(m.type==='childList'){ for(var j=0;j<m.addedNodes.length;j++){ var nd=m.addedNodes[j]; if(nd.nodeType!==1) continue; if(nd.tagName==='IMG') aplicar(nd); else if(nd.querySelectorAll){ var ims=nd.querySelectorAll('img'); for(var k=0;k<ims.length;k++) aplicar(ims[k]); } } }
        else if(m.type==='attributes'&&m.target.tagName==='IMG'){ var t=m.target, sv=t.getAttribute('src')||''; if(sv.indexOf('blob:')===0) continue; if(t.classList.contains('dk-cut')){ t.classList.remove('dk-cut'); t.removeAttribute('data-orig'); } aplicar(t); }
      }
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  }catch(e){}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ _dkFondoBarrer(); }); else _dkFondoBarrer();
})();function _applyThemeBtn(t){var icon=document.getElementById('themeIcon');var label=document.getElementById('themeLabel');var btn=document.getElementById('themeBtn');if(t==='dark'){if(icon)icon.innerHTML='&#9728;';if(label)label.textContent='Modo claro';if(btn)btn.style.borderColor='rgba(232,184,109,.5)';}else{if(icon)icon.innerHTML='&#127769;';if(label)label.textContent='Modo oscuro';if(btn)btn.style.borderColor='';}}function initTheme(){var saved=localStorage.getItem('belle_cat_theme');if(!saved){saved='light';}if(saved==='dark')document.documentElement.setAttribute('data-theme','dark');_applyThemeBtn(saved);}
function fixImgUrl(url){
  if(!url) return '';
  url = url.trim();
  // Google Drive /file/d/ID/view → uc?export=view&id=ID
  var m = url.match(/drive\.google\.com\/file\/d\/([^\/\?]+)/);
  if(m) return 'https://lh3.googleusercontent.com/d/'+m[1];
  // Google Drive open?id=ID
  var m2 = url.match(/drive\.google\.com\/open\?id=([^&\s]+)/);
  if(m2) return 'https://lh3.googleusercontent.com/d/'+m2[1];
  // Google Drive uc?export=view&id=ID (already converted but wrong domain)
  var m3 = url.match(/drive\.google\.com\/uc\?export=view&id=([^&\s]+)/);
  if(m3) return 'https://lh3.googleusercontent.com/d/'+m3[1];
  // Dropbox dl=0 → raw=1
  if(url.indexOf('dropbox.com')>=0 && url.indexOf('dl=0')>=0)
    return url.replace('dl=0','raw=1');
  return url;
}

function norm(s){
  return (s||'').toLowerCase()
    .replace(/[áàäâ]/g,'a').replace(/[éèëê]/g,'e')
    .replace(/[íìïî]/g,'i').replace(/[óòöô]/g,'o')
    .replace(/[úùüû]/g,'u').replace(/ñ/g,'n');
}

// ── ACORDES Y NOTAS — variables globales ─────────────────────────────
var _acordesFiltro = [];
var _notasFiltro   = [];
var _acordesPanelKeys = [];
var _acordesTagKeys   = [];


var SB_URL="https://syylbuvjuekkanxynpps.supabase.co";
var SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eWxidXZqdWVra2FueHlucHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTkwNjQsImV4cCI6MjA4OTA5NTA2NH0.59CUCsLcwVkR-f6KSbQ3RUmZl7-FK8haNW6kw_AkeJA";
var SB_ANON="sb_publishable_DQUI1egWtjw_8hs0iUyE4Q_zhDpJo52";
var WA_NUMBER="5493515121193";

// FIX SEGURIDAD (RLS): si hay sesión Auth activa, usar el JWT del usuario.
// Sino, fallback a anon key (para catálogo público).
// 2026-10-19: un token de sesión vencido (la web quedó abierta o se reabre al otro día) hacía fallar TODAS las
// consultas con 401 hasta que supabase-js lo renovaba: la página quedaba en blanco. Si venció, se sale como anónimo.
function _tokVigente(tok){
  try{ var p=JSON.parse(atob(String(tok).split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); if(p&&p.exp&&p.exp*1000<Date.now()+30000) return false; }catch(e){}
  return true;
}
function _sbToken(){ var t=_sbTokenRaw(); return (t&&_tokVigente(t))?t:null; }
function _sbTokenRaw(){
  // FIX (RLS): usar el token de la sesión ACTIVA del catálogo. Antes esta función
  // buscaba una clave de localStorage que no existe ('sb-...-auth-token'), por eso
  // las consultas del cliente salían como anónimas. La sesión real vive en
  // _catSession (el cliente Auth usa storageKey 'belle_cat_auth').
  try {
    if(_catSession && _catSession.access_token) return _catSession.access_token;
  } catch(e){}
  try {
    if(_sbAuth && _sbAuth.auth){
      var keys = Object.keys(localStorage).filter(function(k){return (k.indexOf('sb-')===0 && k.indexOf('-auth-token')>0) || k==='belle_cat_auth';});
      for(var i=0;i<keys.length;i++){
        try {
          var raw = localStorage.getItem(keys[i]);
          if(!raw) continue;
          var obj = JSON.parse(raw);
          if(obj && obj.access_token) return obj.access_token;
          if(obj && obj.currentSession && obj.currentSession.access_token) return obj.currentSession.access_token;
          if(obj && obj.session && obj.session.access_token) return obj.session.access_token;
        } catch(e){}
      }
    }
  } catch(e){}
  return null;
}

function apiGet(t,f,_anon){
  var tok = _anon ? null : _sbToken();
  var auth = tok ? "Bearer "+tok : "Bearer "+SB_KEY;
  return fetch(SB_URL+"/rest/v1/"+t+(f?"?"+f:""),{headers:{"apikey":SB_KEY,"Authorization":auth,"Accept":"application/json"}}).then(function(r){
    // 2026-10-19: sesión rechazada (401) → la misma lectura como anónimo, una sola vez
    if(r.status===401 && tok && !_anon) return apiGet(t,f,true);
    if(!r.ok){return r.text().then(function(txt){throw new Error("HTTP "+r.status+": "+txt.slice(0,100));});}return r.json();});
}
function apiPost(t,d){
  var tok = _sbToken();
  var auth = tok ? "Bearer "+tok : "Bearer "+SB_KEY;
  // FIX 2026-09-23: un 4xx/5xx con cuerpo JSON resolvía como si fuera éxito (se reservaba stock, se abría
  // WhatsApp y se vaciaba el carrito sin pedido en la base). Ahora un error HTTP rechaza la promesa.
  return fetch(SB_URL+"/rest/v1/"+t,{method:"POST",headers:{"Content-Type":"application/json","apikey":SB_KEY,"Authorization":auth,"Prefer":"return=representation"},body:JSON.stringify(d)}).then(function(r){
    if(!r.ok){ return r.text().then(function(txt){ throw new Error("HTTP "+r.status+": "+txt.slice(0,160)); }); }
    return r.json();
  });
}
// POST sin representacion (Prefer: return=minimal). Necesario cuando el cliente no tiene
// permiso SELECT por RLS (ej: avisos_stock es solo-staff para leer): pedir RETURNING haria
// fallar el INSERT con 42501. Ademas chequea r.ok para no tragarse errores.
function apiPostMin(t,d){
  var tok = _sbToken();
  var auth = tok ? "Bearer "+tok : "Bearer "+SB_KEY;
  return fetch(SB_URL+"/rest/v1/"+t,{method:"POST",headers:{"Content-Type":"application/json","apikey":SB_KEY,"Authorization":auth,"Prefer":"return=minimal"},body:JSON.stringify(d)}).then(function(r){
    if(!r.ok){return r.text().then(function(txt){throw new Error("HTTP "+r.status+": "+txt.slice(0,120));});}
    return r;
  });
}

// PATCH y DELETE con token de sesión (no anon key) — para operaciones de un cliente sobre sus propios datos.
// Cuando se active RLS, usar siempre estos en lugar de fetch() directo con SB_KEY.
function apiPatch(t,d,f){
  var tok = _sbToken();
  var auth = tok ? "Bearer "+tok : "Bearer "+SB_KEY;
  return fetch(SB_URL+"/rest/v1/"+t+(f?"?"+f:""),{method:"PATCH",headers:{"Content-Type":"application/json","apikey":SB_KEY,"Authorization":auth,"Prefer":"return=minimal"},body:JSON.stringify(d)}).then(function(r){
    if(!r.ok){return r.text().then(function(txt){throw new Error("HTTP "+r.status+": "+txt.slice(0,100));});}
    return r;
  });
}
function apiDelete(t,f){
  var tok = _sbToken();
  var auth = tok ? "Bearer "+tok : "Bearer "+SB_KEY;
  return fetch(SB_URL+"/rest/v1/"+t+(f?"?"+f:""),{method:"DELETE",headers:{"apikey":SB_KEY,"Authorization":auth}}).then(function(r){
    if(!r.ok){return r.text().then(function(txt){throw new Error("HTTP "+r.status+": "+txt.slice(0,100));});}
    return r;
  });
}

// ════════════════════════════════════════════════════════════════════
// _lockBtn — guard global contra doble-click en botones críticos.
// Mismo helper que belle/ventas/marcela. En el catálogo público es
// especialmente importante: si el cliente toca 2x "Confirmar pedido"
// se generan 2 pedidos en BD, doble reserva, doble WhatsApp.
// ════════════════════════════════════════════════════════════════════
function _lockBtn(btn, fn, opts){
  opts = opts || {};
  var timeout = opts.timeout || 8000;
  var textoProcesando = opts.texto || "Procesando...";
  if(!btn || !btn.tagName){
    try { return Promise.resolve(fn()); } catch(e){ return Promise.reject(e); }
  }
  if(btn.disabled) return Promise.resolve();
  // Se guarda el HTML y no el texto: botones como el de WhatsApp traen un ícono SVG adentro.
  var htmlOriginal = btn.innerHTML;
  btn.disabled = true;
  btn.style.opacity = "0.6";
  btn.textContent = textoProcesando;
  var timer = setTimeout(function(){
    btn.disabled = false;
    btn.style.opacity = "";
    btn.innerHTML = htmlOriginal;
    console.warn("[catalogo] _lockBtn timeout");
  }, timeout);
  function _restore(){
    clearTimeout(timer);
    btn.disabled = false;
    btn.style.opacity = "";
    btn.innerHTML = htmlOriginal;
  }
  try {
    var res = fn();
    if(res && typeof res.then === 'function'){
      return res.then(function(v){ _restore(); return v; },
                      function(e){ _restore(); throw e; });
    } else {
      setTimeout(_restore, 250);
      return Promise.resolve(res);
    }
  } catch(e){
    _restore();
    throw e;
  }
}

function _lockClick(btn, fn, opts){
  return _lockBtn(btn, fn, opts);
}

// ════════════════════════════════════════════════════════════════════
// _logAct — Log persistente de acciones críticas en tabla actividad_log
// En el catálogo público, el "usuario" es 'cliente_web' o el email del cliente
// si está logueado. Útil para reconstruir flujos de pedidos web problemáticos.
// ════════════════════════════════════════════════════════════════════
function _logAct(accion, detalle, opts){
  opts = opts || {};
  detalle = detalle || {};
  var usuarioStr = 'cliente_web';
  try {
    if(_catCliente && _catCliente.email) usuarioStr = 'cliente:'+_catCliente.email;
    else if(_catCliente && _catCliente.nombre) usuarioStr = 'cliente:'+_catCliente.nombre;
  } catch(e) {}
  var record = {
    usuario: usuarioStr,
    vendedor_id: null,
    accion: accion,
    detalle: detalle,
    pedido_id: detalle.pedido_id || opts.pedido_id || null,
    cliente_id: detalle.cliente_id || opts.cliente_id || (_catCliente && _catCliente.id) || null,
    producto_id: detalle.producto_id || opts.producto_id || null,
    monto: (typeof detalle.monto === 'number' ? detalle.monto : null) || opts.monto || null,
    nro_orden: detalle.nro_orden || opts.nro_orden || null,
    exito: opts.exito !== false,
    error_msg: opts.error_msg || null
  };
  try {
    apiPost('actividad_log', record).catch(function(e){
      console.error('[catalogo] _logAct fallo silencioso:', e, record);
    });
  } catch(e) {
    console.error('[catalogo] _logAct exception:', e);
  }
}

// ════════════════════════════════════════════════════════════════════
// Errores JS no capturados (throw suelto o promesa rechazada sin catch):
// se loguean en actividad_log como 'error_js' para poder reconstruir qué le
// pasó al cliente. Tope de 5 por carga de página para no inundar la tabla
// si algo entra en loop.
// ════════════════════════════════════════════════════════════════════
window._errJsLogueados = 0;
function _logErrorJs(msg, src, line, stack){
  try {
    if(window._errJsLogueados >= 5) return;
    window._errJsLogueados++;
    msg = String(msg || '').slice(0, 300);
    _logAct('error_js', {
      msg: msg,
      src: String(src || '').slice(0, 200),
      line: line || null,
      stack: String(stack || '').slice(0, 300),
      url: String(location.href || '').slice(0, 200)
    }, {exito: false, error_msg: msg});
  } catch(e) {}
}
window.addEventListener('error', function(ev){
  var err = ev && ev.error;
  console.error('[catalogo] error JS:', ev && ev.message, err || '');
  _logErrorJs(ev && ev.message, ev && ev.filename, ev && ev.lineno, err && err.stack);
});
window.addEventListener('unhandledrejection', function(ev){
  var r = ev && ev.reason;
  var msg = (r && r.message) ? r.message : String(r);
  console.error('[catalogo] promesa rechazada sin catch:', r);
  _logErrorJs(msg, '', null, r && r.stack);
});


var allProds=[],curTab="inicio",genF="",kitF=false,hideSS=false,_ordenActual="",famF="",precioF="";
var pestanasCatalogo=[];
var combosPublicos=[];
// cart items: {id, nombre, qty, seg, precio, pData, isDecan, decanQty}
var cart={},cstate={},decanState={};
var cotizActual=1520,periodoActual="",waNumber=WA_NUMBER;
var slides=[],carIdx=0,carTimer;

// ═══════════════════════════════════════════════════════
// MI CUENTA — variables globales (módulo cliente público)
// ═══════════════════════════════════════════════════════
var _sbAuth = null;        // cliente Supabase para Auth (se inicializa cuando carga el SDK)
var _catCliente = null;    // datos del cliente logueado (fila de tabla `clientes`)
var _catSession = null;    // sesión activa de Supabase Auth
var _catFavs = [];         // array de IDs de productos favoritos del cliente
var _catAuthReady = false; // flag de inicialización del módulo

window.addEventListener("DOMContentLoaded",function(){
  // FIX (2026-05-11): leer si este navegador es admin/vendedor (seteado por belle.html/ventas.html).
  // Si lo es, habilita features privilegiadas como editor de fotos de notas olfativas.
  try{ window._catAdminMode = localStorage.getItem('belle_admin_mode')==='1'; }catch(e){ window._catAdminMode=false; }
  initTheme();loadConfig();loadSlides();loadProds();
});

function loadConfig(){
  apiGet("configuracion","select=clave,valor").then(function(rows){
    if(!Array.isArray(rows))return;
    rows.forEach(function(r){
      if(r.clave==="cotizacion_usd")cotizActual=parseFloat(r.valor)||1520;
      if(r.clave==="periodo_actual")periodoActual=r.valor;
      if(r.clave==="whatsapp_admin")waNumber=r.valor||WA_NUMBER;
      if(r.clave==="regaleria_min_catalogo") window._rgMin=parseInt(r.valor)||0;
      if(r.clave==="regaleria_titulo"&&r.valor) window._rgTitulo=r.valor;
      if(r.clave==="regaleria_subtitulo"&&r.valor) window._rgSub=r.valor;
      if(r.clave==="regaleria_pestana_titulo"&&r.valor) window._rgPestTit=r.valor;
      if(r.clave==="regaleria_pestana_sub"&&r.valor) window._rgPestSub=r.valor;
      if(r.clave==="home_recuadros"){ try{ window._homeRecuadros=JSON.parse(r.valor||"{}"); }catch(e){ window._homeRecuadros=null; } }
    });
    // Si el inicio ya se renderizó con defaults, refrescarlo con la config recién cargada.
    try{
      if(window._homeCache && typeof renderHomePage==='function'){
        var _hp=document.getElementById('homePage');
        if(_hp && _hp.querySelector && _hp.querySelector('.hb-rect')){ renderHomePage(window._homeCache.sections, window._homeCache.combos); }
      }
    }catch(e){}
  }).catch(function(e){
    // Sin configuración (cotización, WhatsApp, períodos) el pedido saldría con datos viejos:
    // se marca la falla y sendWA la bloquea hasta que recargue.
    console.error('[catalogo] loadConfig fallo:', e);
    window._configFallo=true;
    _catToast('No se pudo cargar la configuración, recargá la página','terr');
  });
  // FEAT (2026-05-11): cargar configuración de decans
  _loadConfigDecans();
}

// === CONFIGURACIÓN DECANS (cargada de la tabla configuracion_decans) ===
// Defaults seguros que replican el comportamiento hardcoded actual.
window._configDecans = {
  min_unidades_sin_perfume: 5,
  min_monto_sin_perfume: 0,
  modo: 'unidades',
  mensaje_warning: 'Si lleva únicamente Decans, el mínimo de compra es de 5 unidades. En caso de comprar un perfume, los decans no tienen mínimo.',
  precio_decan_pct: 0.10,
  precio_decan_fijo: 3000,
  activo: true
};
function _loadConfigDecans(){
  apiGet('configuracion_decans','select=*&id=eq.1&limit=1').then(function(rows){
    if(Array.isArray(rows) && rows[0]){
      var c = rows[0];
      window._configDecans = {
        min_unidades_sin_perfume: parseInt(c.min_unidades_sin_perfume)||5,
        min_monto_sin_perfume: parseInt(c.min_monto_sin_perfume)||0,
        modo: c.modo || 'unidades',
        mensaje_warning: c.mensaje_warning || window._configDecans.mensaje_warning,
        precio_decan_pct: parseFloat(c.precio_decan_pct)||0.10,
        precio_decan_fijo: parseInt(c.precio_decan_fijo)||3000,
        activo: c.activo !== false
      };
    }
  }).catch(function(e){
    console.warn('[decans] config no cargada, usando defaults:',e);
  });
}

// Evalúa si el carrito de SOLO decans cumple el mínimo configurado.
// Devuelve {cumple:bool, motivo:string}
function _decansCumpleMinimo(totalDecans, montoDecans){
  var c = window._configDecans || {};
  if(!c.activo) return {cumple:true, motivo:''};
  var u = parseInt(c.min_unidades_sin_perfume)||0;
  var m = parseInt(c.min_monto_sin_perfume)||0;
  var modo = c.modo || 'unidades';
  var cumpleU = (u<=0) || (totalDecans >= u);
  var cumpleM = (m<=0) || (montoDecans >= m);
  var cumple = true;
  if(modo === 'unidades') cumple = cumpleU;
  else if(modo === 'monto') cumple = cumpleM;
  else if(modo === 'ambos') cumple = cumpleU && cumpleM;
  else if(modo === 'cualquiera') cumple = cumpleU || cumpleM;
  return {cumple:cumple, modo:modo, min_u:u, min_m:m};
}

// 🎯 FEAT 2026-05-22: helper unificado de mensajes de mínimos
// Genera un mensaje HTML para cualquier tipo de mínimo (decans, grupos de productos, etc.).
// Cada criterio se muestra como "✓ Cumplido" o "⚠ Falta X".
// opts: {
//   prefijo: 'Si llevás solo decans' | 'Para Lattafa' | ...,
//   modo: 'unidades'|'monto'|'ambos'|'cualquiera',
//   minUnidades: 5, minMonto: 30000,           // los mínimos (0 = no aplica)
//   unidadesActuales: 2, montoActual: 9000,    // estado actual del carrito
//   compacto: true|false                       // versión card vs versión banner
// }
// Devuelve { html, cumple, faltaU, faltaM }
function _msgMinimo(opts){
  opts = opts || {};
  var modo = opts.modo || 'unidades';
  var minU = parseInt(opts.minUnidades)||0;
  var minM = parseInt(opts.minMonto)||0;
  var actU = parseInt(opts.unidadesActuales)||0;
  var actM = parseFloat(opts.montoActual)||0;
  var prefijo = opts.prefijo || 'Mínimo';
  var compacto = !!opts.compacto;

  // Calcular qué falta
  var cumpleU = (minU<=0) || (actU >= minU);
  var cumpleM = (minM<=0) || (actM >= minM);
  var faltaU = cumpleU ? 0 : (minU - actU);
  var faltaM = cumpleM ? 0 : (minM - actM);

  // Decisión global de cumple según modo
  var cumple = true;
  if(modo === 'unidades') cumple = cumpleU;
  else if(modo === 'monto') cumple = cumpleM;
  else if(modo === 'ambos') cumple = cumpleU && cumpleM;
  else if(modo === 'cualquiera') cumple = cumpleU || cumpleM;

  // Si ya cumple, devolver vacío (no mostrar warning)
  if(cumple) return {cumple:true, faltaU:0, faltaM:0, html:''};

  // Construir filas según qué criterios aplican
  var filas = [];
  var mostrarU = (modo === 'unidades' || modo === 'ambos' || modo === 'cualquiera') && minU > 0;
  var mostrarM = (modo === 'monto' || modo === 'ambos' || modo === 'cualquiera') && minM > 0;

  function fila(icono, color, texto){
    if(compacto){
      return "<span style='display:inline-flex;align-items:center;gap:.25rem;font-size:.7rem;color:"+color+";font-weight:600;white-space:nowrap'>"+icono+" "+texto+"</span>";
    }
    return "<div style='display:flex;align-items:center;gap:.4rem;font-size:.78rem;color:"+color+";line-height:1.35'><span style='font-size:.95rem;flex-shrink:0'>"+icono+"</span><span>"+texto+"</span></div>";
  }

  if(mostrarU){
    if(cumpleU){
      filas.push(fila('✓', '#3a8a4a', 'Mínimo de <b>'+minU+' '+(minU===1?'unidad':'unidades')+'</b> cumplido'));
    } else {
      var ft = 'Faltan <b>'+faltaU+'</b> '+(faltaU===1?'unidad':'unidades')+' (llevás '+actU+' de '+minU+')';
      filas.push(fila('⚠', '#c87a00', ft));
    }
  }
  if(mostrarM){
    if(cumpleM){
      filas.push(fila('✓', '#3a8a4a', 'Mínimo de <b>'+fmt(minM)+'</b> cumplido'));
    } else {
      var ftm = 'Falta <b>'+fmt(faltaM)+'</b> (llevás '+fmt(actM)+' de '+fmt(minM)+')';
      filas.push(fila('⚠', '#c87a00', ftm));
    }
  }

  // Si modo='cualquiera' y se cumple uno, ya estaría cumpliendo arriba. Acá no llega.
  // Si modo='cualquiera' y NO se cumple ninguno, mostrar la conexión "O"
  var sepHTML = '';
  if(modo === 'cualquiera' && filas.length === 2){
    sepHTML = compacto
      ? "<span style='font-size:.65rem;color:#888;font-weight:600;margin:0 .15rem'>o</span>"
      : "<div style='font-size:.65rem;color:#888;text-transform:uppercase;letter-spacing:.08em;font-weight:700;text-align:center;margin:.1rem 0'>— o —</div>";
  } else if(modo === 'ambos' && filas.length === 2){
    sepHTML = compacto
      ? "<span style='font-size:.65rem;color:#888;font-weight:600;margin:0 .15rem'>y</span>"
      : "";
  }

  var bodyHTML = compacto
    ? filas.join(sepHTML)
    : filas.join(sepHTML);

  var html;
  if(compacto){
    // Versión card: 1 línea, sin caja
    html = "<div style='font-size:.72rem;color:#b89e6e;display:flex;align-items:center;gap:.3rem;flex-wrap:wrap;justify-content:center;line-height:1.35'>"+
      "<span style='font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:#888;font-weight:700'>"+prefijo+":</span>"+
      bodyHTML+
      "</div>";
  } else {
    // Versión banner: caja con borde
    html = "<div style='background:rgba(232,160,40,.08);border:1px solid rgba(232,160,40,.35);border-radius:8px;padding:.55rem .75rem;display:flex;flex-direction:column;gap:.35rem'>"+
      "<div style='font-size:.66rem;font-weight:700;color:#a87f3a;text-transform:uppercase;letter-spacing:.08em'>"+prefijo+"</div>"+
      bodyHTML+
      "</div>";
  }

  return {cumple:false, faltaU:faltaU, faltaM:faltaM, html:html, minU:minU, minM:minM, actU:actU, actM:actM};
}

// 🎯 Helper para texto plano (toasts, alerts donde no se renderiza HTML)
function _msgMinimoTexto(opts){
  opts = opts || {};
  var modo = opts.modo || 'unidades';
  var minU = parseInt(opts.minUnidades)||0;
  var minM = parseInt(opts.minMonto)||0;
  var actU = parseInt(opts.unidadesActuales)||0;
  var actM = parseFloat(opts.montoActual)||0;
  var prefijo = opts.prefijo || '';

  var cumpleU = (minU<=0) || (actU >= minU);
  var cumpleM = (minM<=0) || (actM >= minM);
  var partes = [];
  var mostrarU = (modo === 'unidades' || modo === 'ambos' || modo === 'cualquiera') && minU > 0;
  var mostrarM = (modo === 'monto' || modo === 'ambos' || modo === 'cualquiera') && minM > 0;
  if(mostrarU){
    if(!cumpleU){
      var fU = minU - actU;
      partes.push('faltan '+fU+' '+(fU===1?'unidad':'unidades'));
    }
  }
  if(mostrarM){
    if(!cumpleM){
      partes.push('falta '+fmt(minM - actM));
    }
  }
  if(!partes.length) return '';
  var conector = modo === 'cualquiera' ? ' o ' : ' y ';
  return (prefijo?prefijo+': ':'') + partes.join(conector);
}

// Fotos de la portada (banner_slides). 2026-09-25: las fotos ya no viajan en base64
// dentro de la base (eran 5 MB por visita): son archivos livianos en fotos/banner/.
// Además: se recuerda la última lista en el celular para pintar al instante, se
// reintenta si la base no contesta y se precargan todas las fotos.
var _SLIDES_CACHE_KEY='belle_slides_v2';
function _slidesFallback(){
  return [
    {titulo:"Distribuidora Belle",subtitulo:"Perfumes arabes e internacionales 100% originales",imagen_url:""},
    {titulo:"Envio Gratis",subtitulo:"Dentro de Cordoba - Abonas cuando lo recibes",imagen_url:""},
    {titulo:"Combina Unidades",subtitulo:"Mezcla productos y accede al mejor precio",imagen_url:""},
    {titulo:"100% Originales",subtitulo:"Garantia de autenticidad en todos nuestros productos",imagen_url:""},
    {titulo:"Emprende con Nosotros",subtitulo:"Precios mayoristas para revendedores",imagen_url:""}
  ];
}
// En celular usa la versión chica de las fotos propias (fotos/banner/x-m.jpg) si existe.
function _slideImgUrl(u){
  u=String(u||'');
  if(!u) return u;
  if(window.innerWidth<=720 && /(^|\/)fotos\/banner\/[^\/?]+\.jpg(\?.*)?$/i.test(u) && !/-m\.jpg(\?.*)?$/i.test(u)) return u.replace(/\.jpg(\?|$)/i,'-m.jpg$1');
  return u;
}
function _slidesAplicar(data){
  slides=(data||[]).map(function(s){ var c={}; for(var k in s) c[k]=s[k]; if(c.imagen_url) c.imagen_url=_slideImgUrl(c.imagen_url); return c; });
  // precargar todas las fotos (son chicas): así la rotación nunca muestra el fondo oscuro
  try{ slides.forEach(function(s,i){ if(s.imagen_url){ var im=new Image(); if(i===0) im.fetchPriority='high'; im.src=s.imagen_url; } }); }catch(e){}
  renderCarousel();
}
(function(){
  // pintar al instante con lo último que se vio (si no es base64 pesado)
  try{ var c=localStorage.getItem(_SLIDES_CACHE_KEY); if(c){ var d=JSON.parse(c); if(Array.isArray(d)&&d.length){ _slidesAplicar(d); } } }catch(e){}
})();
function loadSlides(intento){
  intento=intento||0;
  function listo(data){
    if(!Array.isArray(data)){
      // la base no contestó (red lenta, error): reintentar antes de mostrar el relleno
      if(intento<3){ setTimeout(function(){ loadSlides(intento+1); }, 1500*(intento+1)); return; }
      if(!slides.length) _slidesAplicar(_slidesFallback());
      return;
    }
    var lista=data.length?data:_slidesFallback();
    try{ var j=JSON.stringify(lista); if(j.length<200000) localStorage.setItem(_SLIDES_CACHE_KEY,j); else localStorage.removeItem(_SLIDES_CACHE_KEY); }catch(e){}
    _slidesAplicar(lista);
  }
  apiGet("banner_slides","select=id,posicion,titulo,subtitulo,imagen_url,tiempo_seg&activo=is.true&order=posicion").then(listo).catch(function(){ listo(null); });
}

function renderCarousel(){
  var track=document.getElementById("carTrack");
  var dots=document.getElementById("carDots");
  track.innerHTML=slides.map(function(s,i){
    var inner=s.imagen_url?"<img src='"+_catEscAttr(s.imagen_url)+"' alt=''>":"<div class='cslide-ph'><div class='cslide-ph-num'>"+(i+1)+"</div></div>";
    var ov=(s.titulo||s.subtitulo)?"<div class='cslide-ov'><div class='cslide-txt'>"+(s.titulo?"<div class='cslide-title'>"+_catEsc(s.titulo)+"</div>":"")+(s.subtitulo?"<div class='cslide-sub'>"+_catEsc(s.subtitulo)+"</div>":"")+"</div></div>":"";
    return"<div class='cslide'>"+inner+ov+"</div>";
  }).join("");
  dots.innerHTML=slides.map(function(_,i){return"<button class='car-dot"+(i===0?" act":"")+"' onclick='carGo("+i+")'></button>";}).join("");
  carRender();clearInterval(carTimer);carTimer=setInterval(function(){carMove(1);},(slides[carIdx]&&slides[carIdx].tiempo_seg?slides[carIdx].tiempo_seg*1000:5000));
}
function carRender(){
  var track=document.getElementById("carTrack");
  var carousel=document.getElementById("carousel");
  if(!track||!carousel)return;
  var w=carousel.getBoundingClientRect().width||carousel.offsetWidth||window.innerWidth;
  if(w===0)w=window.innerWidth;
  // Forzar ancho de cada slide igual al contenedor
  var cslides=track.querySelectorAll('.cslide');
  cslides.forEach(function(s){s.style.minWidth=w+'px';});
  track.style.transform="translateX(-"+(carIdx*w)+"px)";
  document.querySelectorAll(".car-dot").forEach(function(d,i){d.classList.toggle("act",i===carIdx);});
}
function carMove(d){
  carIdx=(carIdx+d+slides.length)%slides.length;
  carRender();
  clearInterval(carTimer);
  carTimer=setInterval(function(){carMove(1);},(slides[carIdx]&&slides[carIdx].tiempo_seg?slides[carIdx].tiempo_seg*1000:5000));
}
function carGo(i){carIdx=i;carRender();}
window.addEventListener("resize",function(){if(slides.length)carRender();});
// Recalcular después de que el DOM esté completamente pintado
document.addEventListener("DOMContentLoaded",function(){
  setTimeout(function(){if(slides.length)carRender();},100);
  try{ if(curTab==="inicio") _homeEsqueleto(); }catch(e){}
});

// Si hay alguna campaña vigente con `abrir_pestana_al_entrar=true`, redirige curTab
// a la pestaña asociada. Solo se ejecuta una vez al cargar y solo si el cliente
// no tocó manualmente otra pestaña aún.
function abrirPestanaCampaniaSiCorresponde(){
  if(window._catTabManual)return; // si el usuario ya navegó, no forzar
  // 2026-10-08: solo cuando se entra a la web "a secas". Un link específico (?vista=, ?p=, #producto…)
  // tiene que abrir lo que el link dice, no la campaña.
  try{ if((location.search&&location.search.length>1)||(location.hash&&location.hash.length>1)) return; }catch(e){}
  var camps=window._ofertaCampanias||[];
  var ahora=Date.now();
  // 🐛 FIX 2026-08-12 (dos bugs juntos):
  //  1) Antes solo se cambiaba curTab "por atrás": el inicio seguía visible con el
  //     fondo/colores de la campaña pintados encima, y la pestaña nunca se abría de
  //     verdad. Ahora pasa por switchTab, que hace todo el trabajo (ocultar inicio,
  //     mostrar productos, marcar el botón, aplicar el tema solo ahí).
  //  2) Si la campaña marcada tenía su pestaña OCULTA, se trababa en esa y no probaba
  //     las demás. Ahora recorre todas las candidatas vigentes y abre la primera cuya
  //     pestaña realmente exista como botón; si ninguna, no toca nada.
  var candidatas=camps.filter(function(c){
    if(!c.abrir_pestana_al_entrar||!c.activa||!c.pestana_id)return false;
    // Vigente: tiene al menos una oferta activa de campaña en rango
    var ofs=(window._ofertas||[]).filter(function(o){return o.campania_id===c.id&&o.activa;});
    return ofs.some(function(o){
      if(o.fecha_desde&&new Date(o.fecha_desde).getTime()>ahora)return false;
      if(o.fecha_hasta&&new Date(o.fecha_hasta).getTime()<=ahora)return false;
      return true;
    });
  });
  for(var _ci=0;_ci<candidatas.length;_ci++){
    var pestana=(pestanasCatalogo||[]).find(function(t){return t.id===candidatas[_ci].pestana_id;});
    if(!pestana||!pestana.slug)continue;   // pestaña oculta/inexistente → probar la siguiente
    var _elCamp=null;
    (function(slug){
      document.querySelectorAll('.tab').forEach(function(x){
        var oc=x.getAttribute('onclick')||'';
        if(oc.indexOf("switchTab('"+slug+"'")>=0||oc.indexOf('switchTab("'+slug+'"')>=0)_elCamp=x;
      });
    })(pestana.slug);
    if(!_elCamp)continue;                  // sin botón visible (buildTabs la escondió) → siguiente
    // 2026-10-09: se abre sola como mucho 2 veces por día en cada dispositivo; después el cliente entra al inicio
    try{
      var _ak='belle_camp_auto_'+candidatas[_ci].id, _hoy=new Date().toLocaleDateString('en-CA',{timeZone:'America/Argentina/Cordoba'});
      var _ar=null; try{ _ar=JSON.parse(localStorage.getItem(_ak)||'null'); }catch(e2){}
      if(!_ar||_ar.d!==_hoy) _ar={d:_hoy,n:0};
      if(_ar.n>=2) continue;
      _ar.n++; localStorage.setItem(_ak,JSON.stringify(_ar));
    }catch(e){}
    if(typeof switchTab==='function'){
      switchTab(pestana.slug,_elCamp);
      window._catTabManual=false;          // la abrió el sistema, no el cliente
      return;
    }
  }
}

// ── Recargar ofertas y campañas desde Supabase y re-renderizar el catálogo ──
// [BUG #4 fix] Llamado desde realtime cuando admin cambia algo en ofertas/campañas.
// Mantiene la lógica de filtrado de campañas pausadas y refresca las pestañas.
function recargarOfertasYCampanias(){
  Promise.all([
    apiGet('ofertas','select=*&activa=is.true&limit=5000').catch(function(){return [];}),
    apiGet('ofertas_campanias','select=*&limit=5000').catch(function(){return [];}),
    apiGet('ofertas_campania_productos','select=*&limit=5000').catch(function(){return [];})
  ]).then(function(pr){
    var todasCamps = Array.isArray(pr[1])?pr[1]:[];
    window._ofertaCampaniasTodas = todasCamps;
    window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false || _campEsVistaPrevia(c);});
    var campAct = {};
    window._ofertaCampanias.forEach(function(c){campAct[c.id]=true;});
    var todasOfertas = Array.isArray(pr[0])?pr[0]:[];
    window._ofertas = todasOfertas.filter(function(o){
      if(!o.campania_id) return true;
      return !!campAct[o.campania_id];
    });
    window._ofertaCampaniaProductos = {};
    window._ofertaCampaniaProductosOv = {};
    if(Array.isArray(pr[2])){
      pr[2].forEach(function(rel){
        if(!campAct[rel.campania_id]) return;
        if(!window._ofertaCampaniaProductos[rel.campania_id])
          window._ofertaCampaniaProductos[rel.campania_id] = [];
        window._ofertaCampaniaProductos[rel.campania_id].push(rel.producto_id);
        // Sub-ola B: precio por producto (override de campaña)
        if(!window._ofertaCampaniaProductosOv[rel.campania_id])
          window._ofertaCampaniaProductosOv[rel.campania_id] = {};
        window._ofertaCampaniaProductosOv[rel.campania_id][rel.producto_id] =
          {precio_unico:rel.precio_unico,descuento_pct:rel.descuento_pct,
           tipo:rel.tipo||null,multi_paga:rel.multi_paga,multi_lleva:rel.multi_lleva,
           efecto:rel.efecto||null,etiqueta:rel.etiqueta||null,orden:rel.orden||null,
           estructura:rel.estructura||null,titulo:rel.titulo||null,fondo:rel.fondo||null,color:rel.color||null,extra:rel.extra||null};
      });
    }
    // Re-renderizar todo lo afectado
    if(typeof buildTabs === 'function') buildTabs();
    if(typeof applyFilters === 'function') applyFilters();
    if(typeof renderDestacados === 'function') renderDestacados(curTab);
    if(typeof _ofertasWatchdogInit === 'function') _ofertasWatchdogInit();
  }).catch(function(e){
    console.error('[ofertas] recarga realtime:', e);
  });
}

function iniciarWatchdogOfertas(){
  // ── Watchdog de ofertas ──
  // Cada 60 segundos evalúa si alguna oferta cambió de estado de vigencia.
  // Si cambió, dispara un re-render del catálogo. Si una oferta venció,
  // los items en el carrito que ya tenían snapshot conservan su precio (decisión de Ger).
  if(!window._ofertasWatchdog){
    window._ofertasWatchdogState='';
    window._ofertasWatchdog=setInterval(function(){
      if(!Array.isArray(window._ofertas)||!window._ofertas.length)return;
      // Calcular un "estado" simple: lista de IDs de ofertas que están vigentes ahora
      var ahora=Date.now();
      var vigentes=window._ofertas.filter(function(o){
        if(!o.activa)return false;
        if(o.fecha_desde&&new Date(o.fecha_desde).getTime()>ahora)return false;
        if(o.fecha_hasta&&new Date(o.fecha_hasta).getTime()<=ahora)return false;
        return true;
      }).map(function(o){return o.id;}).sort().join(',');
      if(vigentes!==window._ofertasWatchdogState){
        var _primera=(window._ofertasWatchdogState==='');
        window._ofertasWatchdogState=vigentes;
        if(_primera) return;   // primer tick: solo registra el estado
        // 2026-10-08: cambió el estado (terminó o empezó una oferta) → se rearman las pestañas y, si el cliente
        // estaba en una campaña que terminó, vuelve al inicio. Antes la pestaña y los precios x3 quedaban en pantalla.
        try{ if(typeof buildTabs==='function') buildTabs(); }catch(e){}
        try{
          var _tabAct=(pestanasCatalogo||[]).find(function(t){ return t.slug===curTab; });
          var _campAct=_tabAct&&(window._ofertaCampanias||[]).find(function(x){ return x.pestana_id===_tabAct.id; });
          if(_campAct && !_campVigente(_campAct)){
            var _elIni=null; document.querySelectorAll('.tab').forEach(function(x){ var oc=x.getAttribute('onclick')||''; if(oc.indexOf("switchTab('inicio'")>=0||oc.indexOf('switchTab("inicio"')>=0)_elIni=x; });
            if(typeof switchTab==='function') switchTab('inicio',_elIni);
          }
        }catch(e){}
        // Cambió el estado: re-renderizar catálogo y avisar si se agregó/quitó algo
        if(typeof applyFilters==='function')applyFilters();
        if(typeof renderDestacados==='function')renderDestacados(curTab);
        try{ _madreRefrescar(); }catch(e){}
      }
    },60000);
  }
}

// Llamado al primer fetch — inicializa el state inicial
function _ofertasWatchdogInit(){
  if(!Array.isArray(window._ofertas))return;
  var ahora=Date.now();
  window._ofertasWatchdogState=window._ofertas.filter(function(o){
    if(!o.activa)return false;
    if(o.fecha_desde&&new Date(o.fecha_desde).getTime()>ahora)return false;
    if(o.fecha_hasta&&new Date(o.fecha_hasta).getTime()<=ahora)return false;
    return true;
  }).map(function(o){return o.id;}).sort().join(',');
}

function loadProds(){
  // Load productos first (critical), then extras with fallback
  // Auditoría 2026-10-03: el catálogo ya no recibe costos ni ganancias (quedan privados en la base;
  // calcP usa precio_may/med/min_ars que la base mantiene con la misma fórmula).
  // NOTA: las columnas costo_ind, costo_log, gan_usd_may, gan_usd_med, cotiz_hist
  // SE USAN en calcP() para recalcular precios dinámicamente. NO QUITAR.
  apiGet("productos","select=id,grupo_id,grupo_principal,genero,empresa,nombre,stock_actual,reserva,cat_catalogo,precio_may_ars,precio_med_ars,precio_min_ars,precio_ml,precio_pestana,imagen_url,notas,activo,etiqueta,descripcion,precio_decan,destacado,pestana_id,pestanas_extra,orden_destacado,panel_destacado_id,paneles_extra,orden_en_panel,compra_minima,min_grupo,min_cantidad,kit_componentes,agregados,sugeridos_ids,no_aplica_ficha,tipo,ml,escala_unidades,unidades_vendidas,ultimo_ingreso_at,presentacion,familia,color,color_hex,medidas,oculto,en_regaleria,regaleria_grupo,regaleria_orden,regaleria_pack_def,regaleria_pack_mix,fotos,fotos_seg,fotos_efecto&activo=is.true&or=(oculto.is.false,and(tipo.eq.regaleria,en_regaleria.is.true))&order=empresa,nombre&limit=2000").then(function(data){
    allProds=Array.isArray(data)?data:[];
    // 2026-10-19: los acordes (299 KB de los 382 KB de productos) llegan en un segundo pedido, cuando la lista ya se ve.
    // Hasta que llegan, las tarjetas no muestran "+ Acordes" y el buscador no mira acordes; al llegar se re-dibuja
    // la lista que esté a la vista (son 24-72 tarjetas, es barato) y se arma el índice de familias.
    window._acordesListos=false;
    window._acordesPromesa=apiGet("productos","select=id,acordes&activo=is.true&acordes=not.is.null&limit=2000").then(function(rows){
      var m={}; (Array.isArray(rows)?rows:[]).forEach(function(r){ m[r.id]=r.acordes; });
      (allProds||[]).forEach(function(p){ if(m[p.id]!==undefined) p.acordes=m[p.id]; });
      window._acordesListos=true;
      try{ _buildFamByProd(); }catch(e){}
      try{ var lc=document.getElementById('listContainer'); if(lc && lc.style.display!=='none' && (_lv.prods||[]).length) applyFilters(); }catch(e){}
      return true;
    }).catch(function(e){ console.warn('[catalogo] acordes:',e); window._acordesListos=true; return false; });
    _mlIndexar(allProds);
    // 2026-11-03 arranque limpio: si ya están las pestañas recordadas, se espera a tener las campañas para re-armarlas
    if(!(window._tabsDesdeCache&&!window._ofertaCampanias)) buildTabs();
    // 2026-11-03 arranque limpio: con los productos ya en mano, el inicio se dibuja con las secciones recordadas
    // del último ingreso (los combos, que tienen precio propio, esperan a los datos frescos que llegan enseguida).
    try{ if(curTab==="inicio"&&!window._homeCache){ var _hc=JSON.parse(localStorage.getItem('belle_home_secs')||'null'); if(_hc&&Array.isArray(_hc.s)&&Date.now()-(_hc.t||0)<7*864e5){ renderHomePage(_hc.s,[]); } } }catch(e){}
    fillBrands();
    try{ fillPrecioChips(); }catch(e){ console.warn('[belle] fillPrecioChips',e); }
    // ✨ Llenamos el filtro "Inspirado en…" cuando las fichas estén cargadas
    if(window._fichasSBPromise){
      window._fichasSBPromise.then(function(){ try{fillInspirados();}catch(e){} try{_buildFamByProd();}catch(e){} });
    } else {
      try{fillInspirados();}catch(e){} try{_buildFamByProd();}catch(e){}
    }
    applyFilters();
    // 🎯 MEJORA #6 (2026-05-23): si la URL tiene ?ficha=PRODUCTO_ID, abrir esa ficha al cargar
    // Esto permite que el admin haga "vista previa" abriendo el catálogo con el producto específico.
    try {
      var urlParams=new URLSearchParams(window.location.search);
      var fichaPreview=parseInt(urlParams.get('ficha')||'0');
      if(fichaPreview && typeof verFichaBelle==='function'){
        // Esperar a que window._fichasSBPromise resuelva y luego abrir la ficha
        setTimeout(function(){
          if(window._fichasSBPromise && window._fichasSBPromise.then){
            window._fichasSBPromise.then(function(){
              verFichaBelle(fichaPreview);
            });
          } else {
            verFichaBelle(fichaPreview);
          }
        }, 200);
      }
      var _irDest=urlParams.get('ir');
      if(_irDest){ setTimeout(function(){ if(typeof _catDeepLinkIr==='function')_catDeepLinkIr(_irDest, urlParams.get('q'), urlParams.get('p')); }, 350); }
      // 🎯 ?producto=<id> — viene desde card.html ("Ir al producto"): lleva a la tarjeta del producto para comprarlo.
      var _prodDeep=parseInt(urlParams.get('producto')||'0');
      if(_prodDeep && typeof _catIrAProducto==='function'){ setTimeout(function(){ _catIrAProducto(_prodDeep); }, 300); }
    } catch(e){console.warn('[catalogo] error abriendo ficha preview:',e);}
    // Cargar pestañas y paneles juntos para que imagen_destacados esté disponible
    // 🐛 FIX 2026-05-21: ANTES había un setTimeout(3000) que retrasaba la carga de fichas
    // y causaba que el cliente viera "Sin ficha" si abría la ficha antes de los 3 segundos.
    // Ahora se carga inmediatamente. window._fichasSBPromise queda expuesto para que
    // verFichaBelle pueda esperar a que termine si el usuario abre la ficha muy rápido.
    window._fichasSBLoading = true;
    // 🐛 FIX 2026-05-23: cuando hay fichas duplicadas para un mismo producto_id, .find()
    // agarra la PRIMERA del array. Ordenamos por updated_at DESC para que la primera sea
    // la más recientemente actualizada (datos más completos/correctos).
    // nullslast por si alguna ficha vieja no tiene updated_at; en ese caso van al final.
    window._fichasSBPromise = apiGet('fichas_perfume','select=*&order=updated_at.desc.nullslast,id.desc&limit=2000').then(function(fdata){
      window._fichasSB = Array.isArray(fdata) ? fdata : [];
      window._fichasSBLoading = false;
      return window._fichasSB;
    }).catch(function(){
      window._fichasSB = [];
      window._fichasSBLoading = false;
      return [];
    });
    Promise.all([
      apiGet('paneles_destacados','select=*&order=orden'),
      apiGet('pestanas_catalogo','select=*&activa=is.true&order=orden'),
      // ── Cargar ofertas activas + TODAS las campañas (activas+inactivas) + asignaciones ──
      // Cargamos TODAS las campañas porque necesitamos saber cuáles están pausadas
      // para ocultar sus pestañas. Después filtramos las activas para uso normal.
      apiGet('ofertas','select=*&activa=is.true&limit=5000').catch(function(){return [];}),
      apiGet('ofertas_campanias','select=*&limit=5000').catch(function(){return [];}),
      apiGet('ofertas_campania_productos','select=*&limit=5000').catch(function(){return [];})
    ]).then(function(pr){
      window._catPaneles=Array.isArray(pr[0])?pr[0]:[];
      window._catPanelesTimestamp=Date.now();
      window._catPanelesLoading=false;
      if(Array.isArray(pr[1])&&pr[1].length){pestanasCatalogo=pr[1];}
      // 👁 vista previa de una pestaña oculta: el catálogo solo carga pestañas activas, así que si
      // ?vista= pide una que no vino (belle la apaga mientras la campaña está pausada), se trae aparte
      if(window._catVistaPrevia && !pestanasCatalogo.some(function(t){ return t.slug===window._catVistaPrevia; })){
        apiGet('pestanas_catalogo','select=*&slug=eq.'+encodeURIComponent(window._catVistaPrevia)).then(function(r){
          if(Array.isArray(r)&&r[0]&&!pestanasCatalogo.some(function(t){ return t.id===r[0].id; })){ pestanasCatalogo.push(r[0]); try{ recargarOfertasYCampanias(); }catch(e){ try{ buildTabs(); }catch(e2){} } }
        }).catch(function(){});
      }
      // Indexar ofertas y campañas — TODAS y ACTIVAS por separado
      var todasCamps = Array.isArray(pr[3])?pr[3]:[];
      window._ofertaCampaniasTodas = todasCamps;  // ← INCLUYE pausadas (para detectar y ocultar pestañas)
      window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false || _campEsVistaPrevia(c);});  // solo activas para lógica normal
      var campAct={};
      window._ofertaCampanias.forEach(function(c){campAct[c.id]=true;});
      var todasOfertas=Array.isArray(pr[2])?pr[2]:[];
      window._ofertas=todasOfertas.filter(function(o){
        if(!o.campania_id) return true;       // oferta individual: pasa
        return !!campAct[o.campania_id];       // oferta de campaña: solo si la campaña está activa
      });
      window._ofertaCampaniaProductos={};
      window._ofertaCampaniaProductosOv={};
      if(Array.isArray(pr[4])){
        pr[4].forEach(function(rel){
          if(!campAct[rel.campania_id]) return;  // ignorar productos de campañas inactivas
          if(!window._ofertaCampaniaProductos[rel.campania_id])
            window._ofertaCampaniaProductos[rel.campania_id]=[];
          window._ofertaCampaniaProductos[rel.campania_id].push(rel.producto_id);
          // Sub-ola B: precio por producto (override de campaña)
          if(!window._ofertaCampaniaProductosOv[rel.campania_id])
            window._ofertaCampaniaProductosOv[rel.campania_id]={};
          window._ofertaCampaniaProductosOv[rel.campania_id][rel.producto_id]=
            {precio_unico:rel.precio_unico,descuento_pct:rel.descuento_pct,
             tipo:rel.tipo||null,multi_paga:rel.multi_paga,multi_lleva:rel.multi_lleva,
             efecto:rel.efecto||null,etiqueta:rel.etiqueta||null,orden:rel.orden||null,
             estructura:rel.estructura||null,titulo:rel.titulo||null,fondo:rel.fondo||null,color:rel.color||null,extra:rel.extra||null};
        });
      }
      // ── AHORA SÍ buildTabs(), con _ofertaCampanias ya cargado ──
      // Esto permite que las pestañas con campaña asociada se rendericen con logo,
      // colores y posición destacada. Si se llama antes, no hay info de campañas.
      buildTabs();
      // Re-render adicional con pequeño delay para asegurar que todo esté disponible
      // (defensa contra race conditions con navegadores lentos o carga parcial)
      setTimeout(function(){
        if(window._ofertaCampanias && window._ofertaCampanias.length && pestanasCatalogo && pestanasCatalogo.length){
          buildTabs();
        }
      }, 100);
      // Si hay una campaña vigente con "abrir_pestana_al_entrar", redirigir a esa pestaña
      try{abrirPestanaCampaniaSiCorresponde();}catch(e){console.error('[ofertas] tab inicial:',e);}
      // Inicializar watchdog (re-render automático cuando una oferta vence/empieza)
      try{_ofertasWatchdogInit();iniciarWatchdogOfertas();}catch(e){console.error('[ofertas] watchdog:',e);}
      renderDestacados(curTab);
      applyFilters(); // re-render para que aparezcan precios con ofertas
    }).catch(function(){window._catPanelesLoading=false;try{buildTabs();}catch(e){}renderDestacados(curTab);});
    // Precargar combos y home_sections en paralelo al init
    Promise.all([
      apiGet("combos","select=*,combo_items(producto_id,cantidad,producto_nombre,es_decan,precio_ref)&activo=is.true&order=created_at.desc"),
      apiGet("home_sections","select=*&activo=is.true&slug_pestana=eq.inicio&order=orden")
    ]).then(function(r){
      if(Array.isArray(r[0])){combosPublicos=r[0];window._combosCargados=true;renderCombosEnCatalogo();}
      if(Array.isArray(r[1])){
        window._homeCache={sections:r[1],combos:combosPublicos};
        try{ localStorage.setItem('belle_home_secs',JSON.stringify({s:r[1],t:Date.now()})); }catch(e){}
        if(curTab==="inicio"){var hEl=document.getElementById("homePage");if(hEl)hEl.style.display="block";loadHomePage();_homeScrollInicial();}
      }
    }).catch(function(){
      // 2026-10-19: antes este error se tragaba y el inicio quedaba en blanco para siempre
      if(curTab==="inicio"){ var hEl2=document.getElementById("homePage"); if(hEl2){ hEl2.style.display="block"; loadHomePage(); } }
    });
    // ── ELIMINADA ──
    // Antes había una segunda llamada a productos para traer pestana_id y precio_pestana,
    // pero el SELECT principal de la línea 1024 YA incluye esos campos. La segunda llamada
    // era ~500 productos extra innecesarios que ralentizaba la carga inicial.
  }).catch(function(e){
    var lc=document.getElementById("listContainer");
    var msg=e&&e.message?e.message:"Error desconocido";
    console.error('Error cargando catálogo:', msg);
    if(lc){ lc.style.display=""; var _hpE=document.getElementById("homePage"); if(_hpE)_hpE.style.display="none"; }
    if(lc)lc.innerHTML="<div class='loading-screen' style='color:#c44'><div style='font-size:1.5rem;margin-bottom:.5rem'>😕</div>No pudimos cargar el catálogo.<br><small style='font-size:.75rem;color:#888;margin:.4rem 0;display:block'>Verificá tu conexión a internet e intentá de nuevo.</small><br><button onclick='loadProds()' style='padding:.4rem .8rem;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer'>Reintentar</button></div>";
  });
}

function buildTabs(){
  var container=document.getElementById("tabsContainer");
  if(!container)return;
  var base=["arabes","internacionales"];
  var act=curTab;
  var camps = window._ofertaCampanias || [];

  // Indexar campañas por pestana_id para acceso rápido
  var campPorPestId = {};
  camps.forEach(function(c){
    if(c.pestana_id) campPorPestId[c.pestana_id] = c;
  });

  // Helper: render del contenido de una pestaña (con logo si la campaña tiene)
  function renderTabContent(slug, nombre, camp){
    if(camp && camp.tab_logo_url){
      // Logo posicionado absolute para NO afectar el alto del tab.
      // 🖼 FIX 2026-08-12: tamaño por LÍMITES (max-height/max-width) y no altura fija —
      // así un logo apaisado no explota de ancho y uno cuadrado no queda gigante:
      // se adapta a la forma de la imagen. Los tamaños finales por pantalla los
      // ponen las reglas CSS de .tab-camp img (40px celu / 112px PC).
      return '<span style="opacity:0;font-size:.88rem">'+nombre+'</span>'+
        '<img loading=lazy decoding=async src="'+camp.tab_logo_url+'" alt="'+nombre+'" style="height:auto;width:auto;max-height:78px;max-width:150px;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))" onerror="this.outerHTML=\'<span style=&quot;color:#fff;font-weight:800;font-size:.92rem;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)&quot;>'+nombre+'</span>\'">';
    }
    return nombre;
  }

  // Helper: estilo CSS inline para una pestaña con tema
  function tabStyle(camp, isActive){
    if(!camp) return '';
    var fondo = camp.tab_color_fondo || '#ff5722';
    var acento = camp.tab_color_acento || '#e64a19';
    var styles = [];
    // Background con color de la campaña — sobreescribe el default del CSS (con !important)
    styles.push('background:linear-gradient(135deg,'+fondo+','+acento+') !important');
    // el texto se esconde solo cuando hay logo que lo tape; sin logo va en el color de texto de la campaña
    if(camp.tab_logo_url) styles.push('color:transparent !important');
    else styles.push('color:'+(camp.tab_color_texto||'#ffffff')+' !important;text-shadow:0 1px 2px rgba(0,0,0,.25)');
    if(isActive){
      styles.push('border-bottom:3px solid '+acento+' !important');
      styles.push('box-shadow:0 4px 14px '+_catHexToRgba(fondo, 0.5));
    } else {
      styles.push('border-bottom-color:transparent !important');
      styles.push('box-shadow:0 2px 8px '+_catHexToRgba(fondo, 0.35));
    }
    return styles.join(';');
  }

  // ── Construir pestañas en orden:
  //    1. Inicio (siempre primero)
  //    2. Campañas destacadas (a la izquierda, con animación pulse)
  // ── Construir pestañas en orden:
  //    1. Campañas destacadas (a la IZQUIERDA de TODO, primer lugar)
  //    2. Inicio
  //    3. Arabes, Internacionales (base)
  //    4. Resto de pestañas custom (no destacadas)
  //    5. Contacto (último)
  // ──────────────────────────────────────────────────────────────

  var html = '';

  // ── Indexar TODAS las campañas (activas e inactivas) por pestana_id ──
  // para saber si una pestaña debe ocultarse porque su campaña está pausada
  // u oculta. Esto requiere que carguemos TODAS las campañas, no solo activas.
  // Si no tenemos esa info, usamos solo las activas.
  var todasCamps = window._ofertaCampaniasTodas || window._ofertaCampanias || [];
  var campañaPorPestIdTodas = {};
  todasCamps.forEach(function(c){
    if(c.pestana_id) campañaPorPestIdTodas[c.pestana_id] = c;
  });

  // ── Helper: determinar si una pestaña debe ocultarse ──
  // Una pestaña asociada a una campaña debe ocultarse si:
  //   - La campaña está pausada (activa === false)
  //   - O tiene mostrar_pestana === false
  //   - O la oferta está PROGRAMADA (fecha_desde futura) o VENCIDA (fecha_hasta pasada)
  //     [BUG #5 fix: antes la pestaña aparecía en el catálogo aunque la oferta no
  //      estuviera vigente todavía, dando la sensación de "se activó de una"]
  // Las pestañas SIN campaña asociada se muestran siempre (no son pestañas de campaña)
  function pestanaDebeOcultarse(t){
    if(window._catVistaPrevia && t && t.slug===window._catVistaPrevia) return false;  // vista previa
    // 🆕 2026-08: una pestaña ACTIVA pero VACÍA (campaña que ya terminó y le sacaron
    // los productos, ej "Día del Padre") no se ofrece: no tiene nada para mostrar.
    if(typeof _tabTieneProductos==='function' && !_tabTieneProductos(t)) return true;
    var c = campañaPorPestIdTodas[t.id];
    if(!c) return false;  // sin campaña asociada → mostrar normal
    if(c.activa === false) return true;
    if(c.mostrar_pestana === false) return true;
    // Chequear vigencia de la oferta vinculada (programada o vencida → ocultar pestaña)
    var ofs = (window._ofertasTodas||window._ofertas||[]).filter(function(o){return o.campania_id === c.id;});
    if(ofs.length){
      // Hay oferta vinculada → debe estar vigente para mostrar la pestaña
      var ahora = Date.now();
      var algunaVigente = ofs.some(function(o){
        if(!o.activa) return false;
        if(o.fecha_desde && new Date(o.fecha_desde).getTime() > ahora) return false;
        if(o.fecha_hasta && new Date(o.fecha_hasta).getTime() <= ahora) return false;
        return true;
      });
      if(!algunaVigente) return true;
    }
    return false;
  }

  // ── Si el usuario está parado en una pestaña que ahora debe ocultarse,
  //    redirigir automáticamente a Inicio para no dejarlo en una vista vacía.
  var pestActual = pestanasCatalogo.find(function(t){return t.slug === act;});
  if(pestActual && pestanaDebeOcultarse(pestActual)){
    curTab = 'inicio';
    act = 'inicio';
    // si estaba en una pestaña con plantilla, esconderla (la campaña se pausó mientras la miraba)
    try{ var _mpO=document.getElementById('madrePage'); if(_mpO)_mpO.style.display='none'; document.body.classList.remove('madre-on'); }catch(e){}
    // Limpiar el tema de campaña que quedó aplicado (no, se hace en _catAplicarTemaCampania al final)
  }

  // Pestañas DESTACADAS (campañas con tab_destacada=true) — a la izquierda de todo
  pestanasCatalogo.forEach(function(t){
    if(pestanaDebeOcultarse(t)) return; // ocultar si la campaña está pausada
    var camp = campPorPestId[t.id];
    if(!camp || !camp.tab_destacada) return; // solo destacadas en este pase
    var isAct = (act === t.slug);
    var pulseClass = camp.tab_destacada ? 'catTabPulse' : '';
    html += '<div class="tab tab-camp '+pulseClass+(isAct?' act':'')+'" '+
            'data-camp-slug="'+t.slug+'" '+
            'style="'+tabStyle(camp, isAct)+'" '+
            'onclick=\'switchTab("'+t.slug+'",this)\'>'+
            renderTabContent(t.slug, t.nombre, camp)+
            '</div>';
  });

  // Inicio
  html += '<div class="tab'+(act==='inicio'?' act':'')+'" onclick=\'switchTab("inicio",this)\'>🏠 Inicio</div>';

  // Pestañas BASE (Arabes, Internacionales)
  base.forEach(function(slug){
    var nombre = (slug === 'arabes') ? 'Arabes' : 'Internacionales';
    html += '<div class="tab'+(act===slug?' act':'')+'" onclick=\'switchTab("'+slug+'",this)\'>'+nombre+'</div>';
  });

  // Pestañas custom NO destacadas (que no son base)
  pestanasCatalogo.forEach(function(t){
    if(base.indexOf(t.slug) >= 0) return;
    if(pestanaDebeOcultarse(t)) return; // ocultar si la campaña está pausada
    var camp = campPorPestId[t.id];
    if(camp && camp.tab_destacada) return; // ya renderizadas arriba
    var isAct = (act === t.slug);
    var styleAttr = camp ? tabStyle(camp, isAct) : '';
    var contenido = renderTabContent(t.slug, t.nombre, camp);
    html += '<div class="tab'+(isAct?' act':'')+'" '+
            (styleAttr ? 'style="'+styleAttr+'" ' : '')+
            'onclick=\'switchTab("'+t.slug+'",this)\'>'+contenido+'</div>';
  });

  // Notas (galería de notas olfativas)
  html += '<div class="tab'+(act==='notas'?' act':'')+'" onclick=\'switchTab("notas",this)\'>🌸 Notas</div>';
  html += '<div class="tab'+(act==='servicios'?' act':'')+'" onclick=\'abrirServicios()\'>✨ Servicios</div>';
  html += '<div class="tab" onclick=\'abrirAcademia()\'>📚 Academia</div>';

  // Contacto al final
  html += '<div class="tab'+(act==='contacto'?' act':'')+'" onclick=\'switchTab("contacto",this)\'>Contacto</div>';

  container.innerHTML = html;

  // Aplicar tema de campaña si la tab activa tiene una campaña asociada
  _catAplicarTemaCampania();
  // 📱 Logo grande flotante en el celu (rompe el molde sin agrandar la barra)
  try{ _campLogosMobileSync(); }catch(e){}
}

// ════════════════════════════════════════════════════════════════════
// 📱 LOGO DE CAMPAÑA EN EL CELU (2026-08-14, pedido de Ger)
// La barra de pestañas del celu scrollea horizontal → recorta cualquier
// cosa que sobresalga. Para que el logo "rompa el molde" SIN agrandar la
// barra, se dibuja en una capa fija por encima, clavada a la posición de
// su pestaña (se re-sincroniza al scrollear la página o las pestañas).
// El botón sigue midiendo lo mismo; tocarlo o tocar el logo abre la pestaña.
// ════════════════════════════════════════════════════════════════════
function _campLogosMobileSync(){
  var wrap=document.getElementById('campLogoFloatWrap');
  var tabs=document.querySelectorAll('.tab-camp');
  var esMobile=window.innerWidth<=680;
  if(!esMobile||!tabs.length){
    if(wrap){ wrap.innerHTML=''; wrap.style.display='none'; }
    document.querySelectorAll('.tab-camp img').forEach(function(i){ i.style.opacity=''; });
    return;
  }
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='campLogoFloatWrap';
    wrap.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1300;overflow:hidden';
    document.body.appendChild(wrap);
    var _sync=function(){
      if(window._campLogoRaf) return;
      window._campLogoRaf=requestAnimationFrame(function(){ window._campLogoRaf=null; _campLogosMobileSync(); });
    };
    window.addEventListener('scroll',_sync,{passive:true});
    window.addEventListener('resize',_sync,{passive:true});
    var tc=document.getElementById('tabsContainer');
    if(tc) tc.addEventListener('scroll',_sync,{passive:true});
  }
  wrap.style.display='block';
  var html='';
  tabs.forEach(function(tab,i){
    var img=tab.querySelector('img');
    if(!img||!img.getAttribute('src')) return;
    img.style.opacity='0';                       // el original sostiene el ancho del botón
    var r=tab.getBoundingClientRect();
    if(r.width===0||r.bottom<0||r.top>window.innerHeight) return;  // pestaña fuera de vista
    var anim=tab.className.indexOf('catTabPulse')>=0?'animation:catTabPulseAnim 2.4s ease-in-out infinite;':'';
    html+='<img loading=lazy decoding=async src="'+img.getAttribute('src')+'" alt="" onclick="var t=document.querySelectorAll(\'.tab-camp\')['+i+'];if(t)t.click();" '+
      'style="position:absolute;left:'+Math.round(r.left+r.width/2)+'px;top:'+Math.round(r.top+r.height/2)+'px;'+
      'transform:translate(-50%,-50%);height:auto;width:auto;max-height:76px;max-width:124px;'+
      'filter:drop-shadow(0 4px 9px rgba(0,0,0,.35));pointer-events:auto;cursor:pointer;'+anim+'">';
  });
  wrap.innerHTML=html;
}

// ═══════════════════════════════════════════════════════════════════
// [Mobile UX] Drawer lateral con todas las pestañas (botón hamburguesa)
// ═══════════════════════════════════════════════════════════════════
// Wrapper para llamar a switchTab desde el drawer pasando un elemento válido.
// switchTab espera un `el` con classList (línea 1754: el.classList.add("act")).
// Si pasamos null, tira error. Solución: buscar el elemento real en #tabsContainer
// o crear uno fake en memoria si la pestaña no está actualmente renderizada
// (ej: una pestaña destacada que está fuera del viewport scrolleable).
function catSwitchTabDesdeDrawer(slug){
  catCerrarTabsDrawer();
  // Buscar el elemento real de la pestaña
  var container = document.getElementById('tabsContainer');
  var tabEl = null;
  if(container){
    // Recorrer todos los .tab y encontrar el que coincida por su onclick (contiene el slug)
    var tabs = container.querySelectorAll('.tab');
    for(var i=0;i<tabs.length;i++){
      var onclickAttr = tabs[i].getAttribute('onclick') || '';
      if(onclickAttr.indexOf("'"+slug+"'") >= 0 || onclickAttr.indexOf('"'+slug+'"') >= 0){
        tabEl = tabs[i];
        break;
      }
    }
  }
  // Si no encontramos el elemento, creamos uno fake en memoria con classList funcional
  if(!tabEl){
    tabEl = document.createElement('div');
    tabEl.className = 'tab';
  }
  try {
    switchTab(slug, tabEl);
  } catch(e){
    console.error('[drawer] switchTab error:', e);
  }
  // Re-renderizar tabs para que la pestaña activa se marque correctamente
  // (importante cuando la pestaña no estaba visible y switchTab tocó un elemento fake)
  if(typeof buildTabs === 'function'){
    setTimeout(function(){ try{ buildTabs(); } catch(e){} }, 50);
  }
}

// 🆕 2026-08: ¿esta pestaña tiene productos para mostrar? (una campaña terminada
// queda "activa" pero vacía y no tiene sentido ofrecerla; ej: Día del Padre)
// 👁 2026-09-25: ?vista=<slug> muestra esa pestaña de campaña aunque la campaña esté pausada u oculta
window._catVistaPrevia=(function(){ try{ return (new URLSearchParams(location.search).get('vista')||'').trim(); }catch(e){ return ''; } })();
function _campEsVistaPrevia(c){
  if(!window._catVistaPrevia||!c) return false;
  var t=(pestanasCatalogo||[]).find(function(x){ return x.id===c.pestana_id; });
  return !!(t && t.slug===window._catVistaPrevia);
}
function _tabTieneProductos(t){
  try{
    if(!t) return false;
    if(t.slug==='arabes'||t.slug==='internacionales') return true;
    var hay=(allProds||[]).some(function(p){ return p.activo!==false && p.pestana_id===t.id; });
    if(hay) return true;
    var camp=(window._ofertaCampanias||[]).find(function(c){ return c.pestana_id===t.id; });
    if(camp && window._ofertaCampaniaProductos && (window._ofertaCampaniaProductos[camp.id]||[]).length) return true;
    return false;
  }catch(e){ return true; }
}
// 🆕 2026-08: MISMA regla que usan las pestañas de arriba, ahora compartida, para que
// el menú no muestre pestañas que la barra oculta (ej: campaña vencida "Día del Padre").
function _pestanaOcultaGlobal(t){
  try{
    if(window._catVistaPrevia && t && t.slug===window._catVistaPrevia) return false;
    if(typeof _tabTieneProductos==='function' && !_tabTieneProductos(t)) return true;
    var todas=window._ofertaCampaniasTodas||window._ofertaCampanias||[];
    var c=todas.find(function(x){ return x.pestana_id===t.id; });
    if(!c) return false;
    if(c.activa===false) return true;
    if(c.mostrar_pestana===false) return true;
    var ofs=(window._ofertasTodas||window._ofertas||[]).filter(function(o){ return o.campania_id===c.id; });
    if(ofs.length){
      var ahora=Date.now();
      var vig=ofs.some(function(o){
        if(!o.activa) return false;
        if(o.fecha_desde && new Date(o.fecha_desde).getTime()>ahora) return false;
        if(o.fecha_hasta && new Date(o.fecha_hasta).getTime()<=ahora) return false;
        return true;
      });
      if(!vig) return true;
    }
  }catch(e){}
  return false;
}
function catAbrirTabsDrawer(){
  // 1) Rellenar la lista de pestañas
  var cont = document.getElementById('catTabsDrawerLista');
  if(!cont) return;
  var act = (typeof curTab !== 'undefined') ? curTab : 'inicio';
  var base = ['arabes','internacionales'];
  var html = '';
  // Inicio
  html += '<button class="catTabsDrawerItem'+(act==='inicio'?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\'inicio\')">🏠 Inicio</button>';
  // Pestañas destacadas de campañas (al inicio para mantener prominencia)
  if(typeof pestanasCatalogo !== 'undefined' && Array.isArray(pestanasCatalogo)){
    var camps = window._ofertaCampanias || [];
    var campPorPestId = {};
    camps.forEach(function(c){if(c.pestana_id) campPorPestId[c.pestana_id] = c;});
    pestanasCatalogo.forEach(function(t){
      var camp = campPorPestId[t.id];
      if(!camp || !camp.tab_destacada) return;
      if(_pestanaOcultaGlobal(t)) return;   // campaña vencida / pausada / pestaña vacía
      // Verificar si la pestaña debe ocultarse (campaña pausada o oferta no vigente)
      var todasCamps = window._ofertaCampaniasTodas || camps;
      var cTodos = todasCamps.find(function(c){return c.pestana_id===t.id;});
      if(cTodos && (cTodos.activa===false || cTodos.mostrar_pestana===false)) return;
      html += '<button class="catTabsDrawerItem'+(act===t.slug?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\''+t.slug+'\')">🔥 '+escHtml(t.nombre)+'</button>';
    });
    // Pestañas base
    base.forEach(function(slug){
      var nombre = (slug === 'arabes') ? 'Arabes' : 'Internacionales';
      html += '<button class="catTabsDrawerItem'+(act===slug?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\''+slug+'\')">'+nombre+'</button>';
    });
    // Pestañas custom no destacadas
    pestanasCatalogo.forEach(function(t){
      if(base.indexOf(t.slug) >= 0) return;
      var camp = campPorPestId[t.id];
      if(camp && camp.tab_destacada) return;
      if(_pestanaOcultaGlobal(t)) return;   // campaña vencida / pausada / pestaña vacía
      var todasCamps = window._ofertaCampaniasTodas || camps;
      var cTodos = todasCamps.find(function(c){return c.pestana_id===t.id;});
      if(cTodos && (cTodos.activa===false || cTodos.mostrar_pestana===false)) return;
      html += '<button class="catTabsDrawerItem'+(act===t.slug?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\''+t.slug+'\')">'+escHtml(t.nombre)+'</button>';
    });
  } else {
    // Fallback si pestanasCatalogo aún no cargó
    html += '<button class="catTabsDrawerItem'+(act==='arabes'?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\'arabes\')">Arabes</button>';
    html += '<button class="catTabsDrawerItem'+(act==='internacionales'?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\'internacionales\')">Internacionales</button>';
  }
  html += '<button class="catTabsDrawerItem'+(act==='notas'?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\'notas\')">🌸 Notas</button>';
  html += '<button class="catTabsDrawerItem'+(act==='servicios'?' act':'')+'" onclick="catCerrarTabsDrawer();abrirServicios();">✨ Servicios</button>';
  html += '<button class="catTabsDrawerItem" onclick="catCerrarTabsDrawer();abrirAcademia();">📚 Academia</button>';
  html += '<button class="catTabsDrawerItem'+(act==='contacto'?' act':'')+'" onclick="catSwitchTabDesdeDrawer(\'contacto\')">Contacto</button>';
  cont.innerHTML = html;
  // Pintar colores y quitar emojis de los ítems del drawer (igual que las pestañas)
  try{ if(window._belleRepaintTabs) window._belleRepaintTabs(); }catch(e){}
  // 2) Abrir overlay + drawer
  var ov = document.getElementById('catTabsDrawerOverlay');
  var dr = document.getElementById('catTabsDrawer');
  if(ov) ov.classList.add('open');
  if(dr) dr.classList.add('open');
  document.body.style.overflow = 'hidden';
  // FIX 2026-05-15: registrar para botón atrás del celular
  if(typeof _catModalBackRegistrar === 'function'){
    _catModalBackRegistrar('catTabsDrawer', function(){
      var ov2 = document.getElementById('catTabsDrawerOverlay');
      var dr2 = document.getElementById('catTabsDrawer');
      if(ov2) ov2.classList.remove('open');
      if(dr2) dr2.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}
function catCerrarTabsDrawer(){
  var ov = document.getElementById('catTabsDrawerOverlay');
  var dr = document.getElementById('catTabsDrawer');
  if(ov) ov.classList.remove('open');
  if(dr) dr.classList.remove('open');
  document.body.style.overflow = '';
  // FIX 2026-05-15: desregistrar del back button
  if(typeof _catModalBackDesregistrar === 'function'){
    _catModalBackDesregistrar('catTabsDrawer');
  }
}

// Helper: convertir hex a rgba con alpha
function _catHexToRgba(hex, alpha){
  if(!hex) return 'rgba(255,107,53,'+alpha+')';
  hex = hex.replace('#','');
  if(hex.length===3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  var r = parseInt(hex.substring(0,2),16);
  var g = parseInt(hex.substring(2,4),16);
  var b = parseInt(hex.substring(4,6),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

// Aplicar tema completo de la campaña activa al body del catálogo
function _catAplicarTemaCampania(){
  try{ _catAplicarFondoImagen(); }catch(e){}
  var camps = window._ofertaCampanias || [];
  var pestActual = (pestanasCatalogo||[]).find(function(t){return t.slug === curTab;});
  var campActiva = null;
  if(pestActual){
    campActiva = camps.find(function(c){return c.pestana_id === pestActual.id;});
  }
  // [BUG #5 fix] Solo aplicar el tema si la oferta de la campaña está VIGENTE.
  // Si está programada o vencida, no aplicar colores/fondos (la pestaña ni siquiera
  // debería estar visible — esto es defensa adicional).
  if(campActiva){
    var ofs = (window._ofertas||[]).filter(function(o){return o.campania_id === campActiva.id;});
    if(ofs.length){
      var ahora = Date.now();
      var algunaVigente = ofs.some(function(o){
        if(!o.activa) return false;
        if(o.fecha_desde && new Date(o.fecha_desde).getTime() > ahora) return false;
        if(o.fecha_hasta && new Date(o.fecha_hasta).getTime() <= ahora) return false;
        return true;
      });
      if(!algunaVigente) campActiva = null; // no aplicar tema
    }
  }
  // 🔥 Banner de campaña (nombre + descripción + cuenta regresiva) bajo las pestañas
  try{ _catCampBanner(campActiva); }catch(e){}
  // Encontrar/crear el style override
  var styleEl = document.getElementById('_catCampTema');
  if(!styleEl){
    styleEl = document.createElement('style');
    styleEl.id = '_catCampTema';
    document.head.appendChild(styleEl);
  }
  var _hayFoto = document.body.classList.contains('catFondoActivo');
  if(!campActiva || !campActiva.tab_color_fondo){
    // Quitar tema → reset (si hay foto de fondo, dejar los fondos transparentes
    // para que la imagen se vea, con un velo blanco suave para leer bien).
    if(_hayFoto){
      styleEl.textContent =
        'body.catFondoActivo,body.catFondoActivo .lw,body.catFondoActivo main,body.catFondoActivo .container{background:transparent !important}';
      var _v0=document.getElementById('catFondoVelo');
      if(_v0) _v0.style.background='linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,.8))';
    } else {
      styleEl.textContent = '';
    }
    document.body.classList.remove('catCampTemaActivo');
    return;
  }
  // ── Aplicar tema con colores SÓLIDOS configurados desde el admin ──
  // Defaults: colores derivados pero SÓLIDOS (sin mezcla con blanco que daba salmón).
  // Si el admin no configuró un color específico, usa una variante muy suave.
  var fondoPestana = campActiva.tab_color_fondo;       // base
  var acento       = campActiva.tab_color_acento || fondoPestana;
  var textoBoton   = campActiva.tab_color_texto || '#ffffff';
  // Colores configurables (defaults SÓLIDOS, no mezclados con blanco)
  var fondoPagina  = campActiva.color_fondo_pagina  || '#ffffff';     // blanco puro por defecto
  var fondoFiltros = campActiva.color_fondo_filtros || '#fafafa';     // gris muy claro
  var fondoCards   = campActiva.color_fondo_cards   || '#ffffff';
  var bordeCards   = campActiva.color_borde_cards   || fondoPestana;  // borde con el color de la campaña
  var colorBotones = campActiva.color_botones       || fondoPestana;

  document.body.classList.add('catCampTemaActivo');
  // 🖼 Con foto de fondo: los fondos de página van TRANSPARENTES (antes el color
  // sólido tapaba la foto y la imagen de fondo directamente no se veía nunca);
  // el color de la campaña pasa a ser un velo suave arriba de la foto.
  var _bgPagina = _hayFoto ? 'transparent' : fondoPagina;
  if(_hayFoto){
    var _velo=document.getElementById('catFondoVelo');
    if(_velo) _velo.style.background='linear-gradient('+_catHexToRgba(fondoPagina,.5)+','+_catHexToRgba(fondoPagina,.78)+')';
  }
  styleEl.textContent =
    // Fondo de página y wrapper — color sólido configurado (o transparente si hay foto)
    'body.catCampTemaActivo{background:'+_bgPagina+' !important}'+
    'body.catCampTemaActivo .lw{background:'+_bgPagina+' !important}'+
    'body.catCampTemaActivo main,body.catCampTemaActivo .container{background:'+_bgPagina+' !important}'+
    // Cards: color sólido + borde
    'body.catCampTemaActivo .card{background:'+fondoCards+' !important;border:2px solid '+bordeCards+' !important;box-shadow:0 4px 12px '+_catHexToRgba(fondoPestana, 0.12)+';transition:all .2s}'+
    'body.catCampTemaActivo .card:hover{box-shadow:0 8px 24px '+_catHexToRgba(fondoPestana, 0.25)+';border-color:'+colorBotones+' !important}'+
    // Filtros — color sólido
    'body.catCampTemaActivo .filters{background:'+fondoFiltros+' !important;border-radius:8px;border-bottom:2px solid '+bordeCards+'}'+
    // Empty / sin resultados
    'body.catCampTemaActivo .empty{background:'+fondoCards+';border:2px dashed '+bordeCards+';padding:2rem;border-radius:8px;text-align:center;color:#666}'+
    // Botones agregar — color sólido (sin gradient)
    'body.catCampTemaActivo .qbtn-add{background:'+colorBotones+' !important;color:'+textoBoton+' !important;border-color:'+colorBotones+' !important;font-weight:700}'+
    'body.catCampTemaActivo .qbtn-add:hover{filter:brightness(1.1);box-shadow:0 4px 12px '+_catHexToRgba(colorBotones, 0.45)+'}'+
    // 👑 2026-08-14: los botones REALES de las cards — "Agregar" (.abtn) y el tramo de
    // precio resaltado (.popt.lit) — también van con el color de la campaña. La regla
    // .qbtn-add de arriba era de una clase vieja que las cards ya no usan.
    'body.catCampTemaActivo .abtn{background:'+colorBotones+' !important;color:'+textoBoton+' !important}'+
    'body.catCampTemaActivo .abtn:hover{filter:brightness(1.12)}'+
    'body.catCampTemaActivo .abtn:disabled{background:#ccc !important;color:#888 !important;filter:none}'+
    'body.catCampTemaActivo .popt.lit{border-color:'+colorBotones+' !important;box-shadow:0 0 0 2px '+_catHexToRgba(colorBotones,.18)+'}'+
    'body.catCampTemaActivo .popt.lit .pov{color:'+colorBotones+' !important}'+
    // Botón carrito flotante ("Mi pedido" arriba)
    'body.catCampTemaActivo .cart-btn{background:'+colorBotones+' !important;color:'+textoBoton+' !important}'+
    // 🛍 2026-08-14 (Ger): la barra flotante con el TOTAL del carrito también se
    // pinta con la campaña — solo acá adentro; al salir vuelve al dorado de siempre.
    'body.catCampTemaActivo #miniCart{background:linear-gradient(120deg,'+colorBotones+','+acento+') !important;color:'+textoBoton+' !important}'+
    // Footer
    'body.catCampTemaActivo footer{background:'+fondoFiltros+'}';
}

// ════════════════════════════════════════════════════════════════════
// 🔥 BANNER DE CAMPAÑA (2026-08-12) — vive bajo las pestañas mientras el
// cliente está parado en la pestaña de una campaña vigente. Muestra el
// nombre, la bajada, las condiciones y una CUENTA REGRESIVA en vivo que
// mete urgencia real ("Termina en 1d 4h 23m"); cuando quedan menos de
// 24 horas se pone roja y late.
// ════════════════════════════════════════════════════════════════════
function _catCampBanner(camp){
  var b=document.getElementById('campBannerCat');
  if(!camp){
    if(b) b.remove();
    window._campCdHasta=null;
    return;
  }
  var fondo=camp.tab_color_fondo||'#c4965a';
  var acento=camp.tab_color_acento||fondo;
  var texto=camp.tab_color_texto||'#ffffff';
  // Fecha de fin de la oferta vigente (para la cuenta regresiva)
  var hasta=null;
  (window._ofertas||[]).forEach(function(o){
    if(o.campania_id===camp.id&&o.activa&&o.fecha_hasta){
      var t=new Date(o.fecha_hasta).getTime();
      if(t>Date.now()&&(hasta==null||t<hasta)) hasta=t;
    }
  });
  window._campCdHasta=hasta;
  if(!b){
    b=document.createElement('div');
    b.id='campBannerCat';
    // Va ANTES de la barra de filtros, ancho completo — funciona igual en celu y PC
    // (colgarlo de las pestañas lo dejaba flotando al costado en la versión PC).
    var anc=document.getElementById('catFilters')||document.getElementById('listContainer');
    if(anc&&anc.parentNode) anc.parentNode.insertBefore(b,anc);
    else document.body.insertBefore(b,document.body.firstChild);
  }
  b.style.width='100%';
  // 2026-08-14 (Ger): el texto va a la DERECHA — el logo de la pestaña sobresale
  // hacia abajo por el lado izquierdo y le quedaba encima. Sin emoticones cargados.
  b.style.cssText='background:linear-gradient(120deg,'+fondo+','+acento+');padding:.55rem 1rem;display:flex;align-items:center;justify-content:flex-end;gap:.8rem;flex-wrap:wrap;box-shadow:0 3px 12px '+_catHexToRgba(fondo,.35)+';position:relative;overflow:hidden;min-height:52px';
  b.innerHTML=
    '<div class="campBannerShine"></div>'+
    (hasta?'<div id="campCdChip" style="background:rgba(0,0,0,.3);color:#fff;font-size:.72rem;font-weight:800;padding:.35rem .7rem;border-radius:20px;white-space:nowrap;position:relative;font-variant-numeric:tabular-nums"></div>':'')+
    '<div style="min-width:180px;position:relative;text-align:right">'+
      '<div style="color:'+texto+';font-weight:800;font-size:.92rem;letter-spacing:.02em">'+_catEsc(camp.nombre||'')+'</div>'+
      (camp.descripcion?'<div style="color:'+texto+';opacity:.92;font-size:.7rem;margin-top:.1rem;line-height:1.35">'+_catEsc(camp.descripcion)+'</div>':'')+
      (camp.condiciones_pago?'<div style="color:'+texto+';opacity:.72;font-size:.6rem;margin-top:.15rem;font-style:italic">'+_catEsc(camp.condiciones_pago)+'</div>':'')+
    '</div>';
  _catCampCdTick();
  if(!window._campCdTimer) window._campCdTimer=setInterval(_catCampCdTick,1000);
}
// Actualiza la cuenta regresiva cada segundo (y avisa cuando entra en las últimas 24h)
function _catCampCdTick(){
  var chip=document.getElementById('campCdChip');
  if(!chip||!window._campCdHasta) return;
  var ms=window._campCdHasta-Date.now();
  if(ms<=0){
    chip.textContent='Terminó';
    // El watchdog de ofertas se encarga de re-renderizar el catálogo al vencer.
    return;
  }
  var d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5), m=Math.floor(ms%36e5/6e4), s=Math.floor(ms%6e4/1e3);
  chip.textContent='⏳ Termina en '+(d>0?d+'d ':'')+h+'h '+m+'m'+(d===0?' '+s+'s':'');
  var urgente=ms<864e5; // menos de 24 horas
  chip.style.background=urgente?'#c5271c':'rgba(0,0,0,.3)';
  chip.style.animation=urgente?'campCdPulse 1.2s ease-in-out infinite':'';
}

// Imagen de fondo FIJA al scrollear (campaña o pestaña). Se muestra detrás del catálogo.
// Prioridad: imagen de la campaña de la pestaña activa > imagen propia de la pestaña.
function _catAplicarFondoImagen(){
  var img = null;
  var pestActual = (pestanasCatalogo||[]).find(function(t){return t.slug === curTab;});
  if(pestActual){
    var camp = (window._ofertaCampanias||[]).find(function(c){return c.pestana_id === pestActual.id;});
    img = (camp && camp.imagen_fondo) ? camp.imagen_fondo : (pestActual.imagen_fondo || null);
  }
  var layer = document.getElementById('catFondoFijo');
  if(!img){
    if(layer) layer.style.display='none';
    document.body.classList.remove('catFondoActivo');
    window._catFondoImg=null;
    return;
  }
  // 🖼 REHECHO 2026-08-12 (pedido de Ger): la imagen NO se recorta a un pedazo fijo.
  // La capa sigue fija en pantalla, pero la foto se desliza suave con el scroll para
  // que a lo largo de la página se termine viendo ENTERA: arriba del todo se ve su
  // parte de arriba, y al llegar al fondo se clava en su parte de abajo (no baja más).
  if(!layer){
    layer = document.createElement('div');
    layer.id = 'catFondoFijo';
    layer.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:-1;overflow:hidden;pointer-events:none';
    layer.innerHTML = '<img id="catFondoImg" alt="" style="position:absolute;left:50%;top:0;transform:translateX(-50%);min-width:100%;min-height:100%;width:auto;height:auto;object-fit:cover;will-change:transform">'+
      '<div id="catFondoVelo" style="position:absolute;inset:0"></div>';
    document.body.insertBefore(layer, document.body.firstChild);
    // Un solo listener para siempre (la capa se reusa entre pestañas)
    window.addEventListener('scroll', _catFondoParallax, {passive:true});
    window.addEventListener('resize', _catFondoParallax, {passive:true});
  }
  var el = document.getElementById('catFondoImg');
  var safe = String(img).replace(/["'<>\\]/g,'');
  if(el.getAttribute('src') !== safe){
    el.onload = function(){ _catFondoParallax(); };
    el.setAttribute('src', safe);
  }
  layer.style.display = 'block';
  document.body.classList.add('catFondoActivo');
  window._catFondoImg = el;
  _catFondoParallax();
}

// Desliza la foto de fondo según el avance del scroll, con tope arriba y abajo.
function _catFondoParallax(){
  var el = window._catFondoImg;
  if(!el || !document.body.classList.contains('catFondoActivo')) return;
  var vh = window.innerHeight || 1;
  // La imagen se escala para cubrir el ancho; su alto real renderizado:
  var ih = el.offsetHeight || 0;
  var extra = ih - vh;                        // cuánto de la foto no entra en pantalla
  if(extra <= 0){ el.style.top='0'; return; } // entra entera → quieta
  var doc = document.documentElement;
  var scrollable = Math.max(1,(doc.scrollHeight||1) - vh);
  var prog = Math.min(1, Math.max(0,(window.scrollY||doc.scrollTop||0) / scrollable));
  el.style.top = (-extra*prog)+'px';          // 0 → -extra: de la punta de arriba a la de abajo
}

function fmt(n){return n?("$"+Math.round(n).toLocaleString("es-AR")):"-";}

// ════════════════════════════════════════════════════════════════════
// SISTEMA DE OFERTAS — helpers compartidos
// ════════════════════════════════════════════════════════════════════
// window._ofertas = array de ofertas vigentes (cargadas al boot del catálogo)
// window._ofertaCampaniaProductos = { campania_id: [producto_id, ...] }
//
// Una oferta puede ser:
//   - Individual:  o.producto_id != null
//   - De campaña:  o.campania_id != null  (aplica a productos de _ofertaCampaniaProductos[campania_id])
// ════════════════════════════════════════════════════════════════════

// Devuelve la oferta vigente para un producto (objeto o null).
// Si hay más de una vigente (rara vez), prioriza la más específica:
//   1. Oferta individual del producto
//   2. Oferta de campaña que incluya el producto
function ofertaParaProducto(prodId){
  if(!window._ofertas||!window._ofertas.length)return null;
  var ahora=Date.now();
  function vigente(o){
    if(!o.activa)return false;
    // 👁 vista previa (?vista=slug): la oferta de esa campaña se aplica aunque todavía no haya
    // empezado o ya haya terminado, para ver la pestaña tal como va a quedar.
    if(o.campania_id && window._catVistaPrevia && _campEsVistaPrevia((window._ofertaCampaniasTodas||[]).find(function(c){ return c.id===o.campania_id; }))) return true;
    if(o.fecha_desde){var d=new Date(o.fecha_desde).getTime();if(ahora<d)return false;}
    if(o.fecha_hasta){var h=new Date(o.fecha_hasta).getTime();if(ahora>=h)return false;}
    return true;
  }
  // 1. Oferta individual
  var ind=window._ofertas.find(function(o){return o.producto_id===prodId&&vigente(o);});
  if(ind)return ind;
  // 2. Oferta de campaña
  // 📣 REGLA FINAL 2026-08-12 (Ger): campaña ACTIVA y vigente → su precio se ve en
  // TODO el catálogo (con un botón en la card que lleva a la campaña); campaña
  // pausada o vencida → ni rastro (eso lo garantiza vigente(): activa + fechas).
  // El susto de "Día del Niño" se ataja en el origen: fechas que ya no se borran
  // y aviso fuerte al crear campañas sin fechas.
  var camps=window._ofertaCampaniaProductos||{};
  var campOferta=window._ofertas.find(function(o){
    if(!o.campania_id||!vigente(o))return false;
    var prods=camps[o.campania_id]||[];
    return prods.indexOf(prodId)>=0;
  });
  return campOferta||null;
}

// ¿La pestaña actual del catálogo es la de esta campaña?
function _campEsTabActual(campId){
  try{
    var c=(window._ofertaCampanias||[]).find(function(x){return x.id===campId;});
    if(!c||!c.pestana_id)return false;
    var t=(pestanasCatalogo||[]).find(function(x){return x.id===c.pestana_id;});
    return !!(t&&t.slug&&t.slug===curTab);
  }catch(e){ return false; }
}
// Slug de la pestaña de una campaña, solo si el botón de esa pestaña existe.
function _campSlugVisible(campId){
  try{
    var c=(window._ofertaCampanias||[]).find(function(x){return x.id===campId;});
    if(!c||!c.pestana_id)return null;
    var t=(pestanasCatalogo||[]).find(function(x){return x.id===c.pestana_id;});
    if(!t||!t.slug)return null;
    var hay=false;
    document.querySelectorAll('.tab').forEach(function(x){
      var oc=x.getAttribute('onclick')||'';
      if(oc.indexOf("switchTab('"+t.slug+"'")>=0||oc.indexOf('switchTab("'+t.slug+'"')>=0)hay=true;
    });
    return hay?t.slug:null;
  }catch(e){ return null; }
}
// Botón "Ver la campaña" de las cards → abre la pestaña de la campaña.
function _irACampania(campId){
  var slug=_campSlugVisible(campId);
  if(!slug)return;
  var el=null;
  document.querySelectorAll('.tab').forEach(function(x){
    var oc=x.getAttribute('onclick')||'';
    if(oc.indexOf("switchTab('"+slug+"'")>=0||oc.indexOf('switchTab("'+slug+'"')>=0)el=x;
  });
  if(el&&typeof switchTab==='function'){
    switchTab(slug,el);
    try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){}
  }
}

// Sub-ola B: devuelve el precio por producto de una campaña {precio_unico,descuento_pct}
// o null si ese producto no tiene override propio (usa el de la campaña).
function _overrideProductoCampania(campId, prodId){
  var m=window._ofertaCampaniaProductosOv||{};
  var c=m[campId]; if(!c) return null;
  var ov=c[prodId]; if(!ov) return null;
  var pu=parseFloat(ov.precio_unico)||0, dp=parseFloat(ov.descuento_pct)||0;
  var tipo=ov.tipo||null;
  // Devolvemos el override si hay un tipo propio (x10/x3/multi no traen valor) o un valor (precio/%).
  if(tipo||pu>0||dp>0) return {tipo:tipo,precio_unico:pu,descuento_pct:dp,
                               multi_paga:parseInt(ov.multi_paga)||null,
                               multi_lleva:parseInt(ov.multi_lleva)||null};
  return null;
}

// Colores del indicador de oferta. Si la oferta pertenece a una campaña con
// colores configurados, se usan; si no, rojo por defecto.
// (etiqueta vacío = se usa el degradé rojo por defecto del pill)
function _ofertaColores(oferta){
  var d={texto:'#c45a3a',recuadro:'#c45a3a',etiqueta:''};
  if(oferta && oferta.campania_id && Array.isArray(window._ofertaCampanias)){
    var c=window._ofertaCampanias.find(function(x){return x.id===oferta.campania_id;});
    if(c){
      if(c.color_oferta_texto)    d.texto=c.color_oferta_texto;
      if(c.color_oferta_recuadro) d.recuadro=c.color_oferta_recuadro;
      if(c.color_oferta_etiqueta) d.etiqueta=c.color_oferta_etiqueta;
    }
  }
  return d;
}

// ════════════════════════════════════════════════════════════════════
// PRESENTACIONES DE OFERTA
// Se eligen producto por producto en el admin. Las claves tienen que
// coincidir con _PXADM en belle.html.
// ════════════════════════════════════════════════════════════════════
var _PX = {
  protagonista:{nombre:'Protagonista', cls:'px-protagonista'},
  cerca:       {nombre:'Acercamiento', cls:'px-cerca'},
  vitrina:     {nombre:'Vitrina',      cls:'px-vitrina'},
  editorial:   {nombre:'Editorial',    cls:'px-editorial'},
  reflejo:     {nombre:'Reflejo',      cls:'px-reflejo'},
  revelar:     {nombre:'Revelar',      cls:'px-revelar'},
  sello:       {nombre:'Sello',        cls:'px-sello'},
  contador:    {nombre:'Cuenta regresiva', cls:'px-contador'},
  luz:         {nombre:'Luz cálida',     cls:'px-luz'},
  tachado:     {nombre:'Antes y ahora',  cls:'px-tachado'},
  mono:        {nombre:'Monocromo',      cls:'px-mono'},
  marco:       {nombre:'Marco',          cls:'px-marco'},
  ancha:       {nombre:'Panorámica',     cls:'px-ancha'},
  respiro:     {nombre:'Respiro',        cls:'px-respiro'},
  oro:         {nombre:'Oro',            cls:'px-oro'}
};

// ════════════════════════════════════════════════════════════════════
// ESTRUCTURAS — cómo está armada la card (tamaño, franjas, fondo, lugar).
// Las claves tienen que coincidir con _ESADM en belle.html.
//   strip: franja arriba de la card · t: título por defecto
// ════════════════════════════════════════════════════════════════════
var _ES = {
  primero:     {},
  oferta_dia:  {strip:1, t:'Oferta del día'},
  nuevo:       {strip:1, t:'Nuevo ingreso'},
  mas_vendido: {strip:1, t:'Más vendido'},
  seleccion:   {strip:1, t:'Selección Belle'},
  limitada:    {strip:1, t:'Edición limitada'},
  ultimas:     {strip:1, t:'Últimas unidades'},
  alta:        {cls:'es-alta'},
  xl:          {cls:'es-xl'},
  compacta:    {cls:'es-compacta'},
  cuadrada:    {cls:'es-cuadrada'},
  fondo_imagen:{cls:'es-fondo'},
  fondo_color: {cls:'es-color'},
  separador:   {t:'Novedades'},
  frase:       {},
  lateral:     {cls:'es-lateral', t:'Destacado'}
};

// Qué no puede ir junto (se pisan en la card). Mismo mapa que en belle.html.
var _PRES_GRUPOS=[
  ['protagonista','ancha','alta','xl','compacta','cuadrada'],     // tamaño / armado de la card
  ['vitrina','editorial','luz'],                                   // fondo de la foto
  ['cerca','sello'],                                               // la esquina de la foto
  ['oferta_dia','nuevo','mas_vendido','seleccion','limitada','ultimas'],  // una sola franja
  ['fondo_imagen','fondo_color'],                                  // fondo de la card
  // respiro anima la foto todo el tiempo: no va con lo que la mueve al acercarse (de a pares, no entre ellos)
  ['respiro','cerca'],['respiro','protagonista'],['respiro','vitrina'],['respiro','editorial'],['respiro','mono'],['respiro','luz'],['respiro','ancha']
];
function _presChoca(a,b){ return a!==b && _PRES_GRUPOS.some(function(g){ return g.indexOf(a)>=0 && g.indexOf(b)>=0; }); }
// "cerca,oro" → ['cerca','oro'], válidas, sin choques (la primera que entra gana).
function _presLista(v, cat){
  var arr=Array.isArray(v)?v:String(v||'').split(',');
  var out=[];
  arr.forEach(function(k){ k=String(k||'').trim(); if(!k||!cat[k]||out.indexOf(k)>=0) return; if(out.some(function(o){return _presChoca(o,k);})) return; out.push(k); });
  return out;
}
// La presentación que le toca a un producto: la propia (productos.presentacion)
// y, si está en una campaña al aire, lo que la campaña diga por encima.
var _PRES_CAMPOS=['efecto','estructura','orden','titulo','fondo','color','etiqueta','frase','separador','lateral','fondo_card','hasta'];
function _presDe(p, oferta){
  var out={efecto:null,estructura:null,orden:null,titulo:null,fondo:null,color:null,etiqueta:null,frase:null,separador:null,lateral:null,fondo_card:null,hasta:null,_ordenCamp:false};
  try{
    var base=p&&p.presentacion;
    if(typeof base==='string'){ try{ base=JSON.parse(base); }catch(e){ base=null; } }
    if(base&&typeof base==='object') _PRES_CAMPOS.forEach(function(k){ if(base[k]!=null&&base[k]!=='') out[k]=base[k]; });
    if(oferta&&oferta.campania_id){
      var ov=(window._ofertaCampaniaProductosOv||{})[oferta.campania_id]; ov=ov&&ov[p.id];
      if(ov){
        var ex=ov.extra; if(typeof ex==='string'){ try{ ex=JSON.parse(ex); }catch(e){ ex=null; } }
        var src=Object.assign({}, ov, (ex&&typeof ex==='object')?ex:{});
        _PRES_CAMPOS.forEach(function(k){ if(src[k]!=null&&src[k]!=='') out[k]=src[k]; });
        if(parseInt(ov.orden,10)>0) out._ordenCamp=true;
      }
    } else if(oferta&&oferta.efecto&&!out.efecto){ out.efecto=oferta.efecto; }
    out.efectos=_presLista(out.efecto,_PX);
    // las estructuras chocan también con efectos de tamaño (protagonista / panorámica)
    out.estructuras=_presLista(out.estructura,_ES).filter(function(k){ return !out.efectos.some(function(e){ return _presChoca(e,k); }); });
    out.efecto=out.efectos[0]||null; out.estructura=out.estructuras[0]||null;
    out.orden=(parseInt(out.orden,10)>0)?parseInt(out.orden,10):null;
  }catch(e){ out.efectos=out.efectos||[]; out.estructuras=out.estructuras||[]; }
  return out;
}
function _esClases(k){ var d=_ES[k]; return (d&&d.cls)?(' '+d.cls):''; }
// Varias a la vez: se juntan las piezas de cada una.
function _pxPiezasTodas(keys, ctx){
  var out={cimg:'',info:'',right:'',card:''};
  (keys||[]).forEach(function(k){ var p=_pxPiezas(k,ctx); out.cimg+=p.cimg; out.info+=p.info; out.right+=p.right; out.card+=p.card; });
  return out;
}
function _esPiezasTodas(keys, pres, ctx){
  var out={antes:'',card:'',cimg:'',info:'',cls:'',style:''};
  (keys||[]).forEach(function(k){ var p=_esPiezas(k,pres,ctx); out.antes+=p.antes; out.card+=p.card; out.cimg+=p.cimg; out.info+=p.info; out.cls+=p.cls; out.style+=p.style; });
  return out;
}
// ¿Este color de fondo es oscuro? Para pasar el texto a blanco.
function _esOscuro(hex){
  try{ var h=String(hex||'').replace('#',''); if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    return (0.299*r+0.587*g+0.114*b) < 140; }catch(e){ return false; }
}
// Las piezas que la estructura agrega. ctx = {stock}
function _esPiezas(k, pres, ctx){
  var out={antes:'', card:'', cimg:'', info:'', cls:'', style:''};
  var d=_ES[k]; if(!d) return out;
  out.cls=_esClases(k);
  var tit=(pres.titulo||d.t||'').toString();
  if(d.strip){
    if(k==='ultimas'){ var st=parseInt(ctx.stock,10)||0; if(st>0&&st<=9) tit+=' · quedan '+st; }
    out.cls+=' es-strip';
    out.card="<div class='esStrip"+(pres.fondo?" conFondo":"")+"'"+(pres.fondo?" style=\"background-image:url('"+_catEsc(pres.fondo)+"')\"":"")+"><span>"+_catEsc(tit)+"</span></div>";
  } else if(k==='xl'){
    if(tit) out.info="<div class='pxTitulo'>"+_catEsc(tit)+"</div>";
  } else if(k==='fondo_imagen'){
    var fc=pres.fondo_card||pres.fondo;
    if(fc){ out.style="background-image:url('"+_catEsc(fc)+"');"; out.card="<div class='esVelo'></div>"; }
    else out.cls='';
  } else if(k==='fondo_color'){
    if(pres.color){ out.style="background:"+_catEsc(pres.color)+";border-color:"+_catEsc(pres.color)+";"; if(_esOscuro(pres.color)) out.cls+=' es-oscura'; }
    else out.cls='';
  } else if(k==='separador'){
    out.antes="<div class='esSep'><span>"+_catEsc(pres.separador||d.t)+"</span></div>";
  } else if(k==='frase'){
    var fr=pres.frase||''; if(fr) out.info="<div class='esFrase'>"+_catEsc(fr)+"</div>";
  } else if(k==='lateral'){
    out.card="<div class='esLateral'>"+_catEsc(pres.lateral||d.t)+"</div>";
  }
  return out;
}

// Etiqueta propia del producto dentro de la campaña (si le pusieron una).
function _ofertaEtiquetaProd(oferta, prodId){
  try{
    if(!oferta || !oferta.campania_id) return null;
    var ov=(window._ofertaCampaniaProductosOv||{})[oferta.campania_id];
    return (ov && ov[prodId] && ov[prodId].etiqueta) || null;
  }catch(e){ return null; }
}
function _pxClases(k){ var d=_PX[k]; return d ? (' '+d.cls) : ''; }

// Las piezas de HTML que cada presentación agrega a la card.
//   ctx = {marca, nombre, etiqueta, pct, hasta}
function _pxPiezas(k, ctx){
  var out={cimg:'', info:'', right:'', card:''};
  if(!k || !_PX[k]) return out;
  var etq=(ctx.etiqueta||'Oferta').toString();
  if(k==='protagonista'){
    out.info="<div class='pxTitulo'>"+_catEsc(etq.charAt(0).toUpperCase()+etq.slice(1).toLowerCase())+"</div>";
  } else if(k==='cerca'){
    out.cimg="<div class='pxPill'>"+_catEsc(etq)+(ctx.pct?"<b>&minus;"+Math.round(ctx.pct)+"%</b>":"")+"</div>";
  } else if(k==='editorial'){
    out.cimg="<div class='pxEd'>"+(ctx.marca?"<small>"+_catEsc(ctx.marca)+"</small>":"")+"<span>"+_catEsc(ctx.nombre||'')+"</span></div>";
  } else if(k==='revelar'){
    out.right="<div class='pxRevela'>Acercate para ver la oferta</div>";
  } else if(k==='sello'){
    out.cimg="<div class='pxSello'>"+_catEsc(etq.length>9?'Oferta':etq)+"<i>Belle</i></div>";
  } else if(k==='contador' && ctx.hasta && new Date(ctx.hasta).getTime()>Date.now()){
    out.info="<div class='pxCuenta' data-hasta='"+new Date(ctx.hasta).getTime()+"'>Termina en<b></b></div>";
  } else if(k==='tachado' && ctx.antes>0 && ctx.ahora>0 && ctx.antes>ctx.ahora){
    out.info="<div class='pxTachado'><s>"+fmt(ctx.antes)+"</s><b>"+fmt(ctx.ahora)+"</b></div>";
  } else if(k==='marco'){
    out.card="<div class='pxMarcoLbl'>"+_catEsc(etq)+"</div>";
  }
  return out;
}

// El reloj de los contadores: minutos, no segundos. Un número que salta cada
// segundo apura; uno que cambia cada tanto acompaña.
function _pxTick(){
  var els=document.querySelectorAll('.pxCuenta[data-hasta]');
  if(!els.length) return;
  var ahora=Date.now();
  for(var i=0;i<els.length;i++){
    var h=parseInt(els[i].getAttribute('data-hasta'),10);
    var b=els[i].querySelector('b'); if(!b) continue;
    var ms=h-ahora;
    if(ms<=0){ els[i].style.display='none'; continue; }
    var d=Math.floor(ms/86400000), hh=Math.floor(ms%86400000/3600000), mm=Math.floor(ms%3600000/60000);
    if(d>=1)      b.textContent=d+(d===1?' día ':' días ')+String(hh).padStart(2,'0')+' h';
    else if(hh>=1) b.textContent=hh+' h '+String(mm).padStart(2,'0')+' min';
    else           b.textContent=mm+' min';
  }
}
if(!window._pxReloj) window._pxReloj=setInterval(_pxTick,30000);

// En el celular no hay mouse: "acercarse" es que la card llegue al centro de
// la pantalla. Ahí se prende .px-on, y se apaga cuando se va.
function _pxObservar(){
  try{
    var quiere=document.querySelectorAll('.card.px-cerca,.card.px-revelar,.card.px-mono,.card.px-tachado,.card.px-luz');
    if(!quiere.length) return;
    if(!('IntersectionObserver' in window)) return;
    if(!window.matchMedia('(hover: none)').matches) return;   // con mouse alcanza el :hover
    if(!window._pxIO){
      window._pxIO=new IntersectionObserver(function(ents){
        ents.forEach(function(e){ e.target.classList.toggle('px-on', e.intersectionRatio>=0.85); });
      },{threshold:[0,0.85,1],rootMargin:'-12% 0px -12% 0px'});
    }
    for(var i=0;i<quiere.length;i++) window._pxIO.observe(quiere[i]);
  }catch(e){}
}


// Aplica una oferta a un cálculo de precios r={pm,pe,pi,decan} y devuelve
// un objeto modificado: { pm, pe, pi, decan, oferta_aplicada, etiqueta, ... }
//
// `forzarMejor` (default true) compara con CC: si el cliente CC ya pagaba menos
// que la oferta, no la aplicamos (el cliente CC ve siempre el precio más barato).
function aplicarOferta(r, oferta, esCC){
  if(!oferta||!r)return r;
  var out={pm:r.pm,pe:r.pe,pi:r.pi,decan:r.decan,
           pm_orig:r.pm,pe_orig:r.pe,pi_orig:r.pi,
           ct:r.ct,rM:r.rM,rE:r.rE,
           oferta:oferta,oferta_tipo:oferta.tipo,
           oferta_etiqueta:oferta.etiqueta||''};
  switch(oferta.tipo){
    case 'precio_unico':
      // Un solo precio plano. x10/x3/x1 todos al mismo valor (los tachados manejados por el render).
      out.precio_unico=parseFloat(oferta.precio_unico)||0;
      out.pm=out.precio_unico;out.pe=out.precio_unico;out.pi=out.precio_unico;
      break;
    case 'descuento_pct':
      var pct=parseFloat(oferta.descuento_pct)||0;
      var f=1-pct/100;
      out.pm=Math.round(r.pm*f);
      out.pe=Math.round(r.pe*f);
      out.pi=Math.round(r.pi*f);
      out.descuento_pct=pct;
      break;
    case 'x10_sin_minimo':
      // El precio aplicado siempre es el x10 (mayorista), sin importar la cantidad.
      // No tocamos los valores de pm/pe/pi (el render se encarga de mostrar pm como activo).
      out.precio_efectivo='pm';
      break;
    case 'x3_sin_minimo':
      out.precio_efectivo='pe';
      break;
    case 'multixmenos':
      out.multi_paga=parseInt(oferta.multi_paga)||1;
      out.multi_lleva=parseInt(oferta.multi_lleva)||2;
      // No modifica precios unitarios — la lógica del 2x1/3x2 se aplica al sumar al carrito
      break;
  }
  // 💰 2026-08-12 (Ger): en el carrito SIEMPRE el precio más bajo. Si algún tramo
  // normal (x10/x3/x1) es más barato que la oferta, ese tramo se conserva — la
  // oferta nunca puede salir MÁS cara que el precio de siempre.
  if(r.pm>0&&out.pm>r.pm)out.pm=r.pm;
  if(r.pe>0&&out.pe>r.pe)out.pe=r.pe;
  if(r.pi>0&&out.pi>r.pi)out.pi=r.pi;
  // Si es cliente CC y el precio CC normal (pm) sigue siendo más barato que la oferta,
  // dejamos el CC. Decisión de Ger: el cliente CC siempre ve el precio más barato.
  if(esCC&&r.pm){
    // 2026-10-17: antes se comparaba el VIP solo contra pm/precio único, y la oferta "x3 sin mínimo" (que cobra pe)
    // pasaba igual: el cliente VIP veía la promo x3 más cara que su precio x10. Ahora se compara contra el precio
    // efectivo de la oferta según su tipo; si el VIP ya paga igual o menos, la oferta no aplica para él.
    var precioConOferta=(oferta.tipo==='precio_unico')?out.precio_unico:(oferta.tipo==='x3_sin_minimo')?out.pe:(oferta.tipo==='multixmenos')?Infinity:out.pm;
    if(!(precioConOferta>0)) precioConOferta=Infinity;
    if(r.pm<=precioConOferta && oferta.tipo!=='multixmenos'){
      out.pm=r.pm;out.pe=r.pe;out.pi=r.pi;out.oferta_descartada_por_cc=true;
      delete out.precio_efectivo;   // la card y el carrito vuelven a los tramos normales (VIP → x10)
    }
  }
  return out;
}

function calcP(p){
  var ci=p.costo_ind||0, cl=p.costo_log||0;
  // MULTIPLO.SUPERIOR al entero (igual que Google Sheet)
  var ct=ci>0?Math.ceil(ci+cl):0;
  var gm=p.gan_usd_may||0, ge=p.gan_usd_med||0;
  // Usar cotización del producto si tiene, sino la del sistema
  var cotiz=cotizActual;
  // MULTIPLO.SUPERIOR a 100 ARS (igual que Google Sheet)
  var pm=ct>0||gm>0?Math.ceil((ct+gm)*cotiz/100)*100:(p.precio_may_ars||0);
  var pe=ct>0||ge>0?Math.ceil((ct+gm+ge)*cotiz/100)*100:(p.precio_med_ars||0);
  // precio_min = MULTIPLO.SUPERIOR( (precio_ml + precio_med) / 2, 100 )
  var ml=p.precio_ml||0;
  var pi=ml>0?Math.ceil((ml+pe)/2/100)*100:(p.precio_min_ars||pe);
  var rM=pm>0&&ct>0?((pm-ct*cotiz)/pm*100):0;
  var rE=pe>0&&ct>0?((pe-ct*cotiz)/pe*100):0;
  // FEAT (2026-05-11): precio_decan auto usa config dinámica si precio_decan<=0
  // Fórmula: ceil(pi * pct / 1000) * 1000 + fijo (configurable desde admin)
  var _cdc = window._configDecans || {precio_decan_pct:0.10, precio_decan_fijo:3000};
  var _pct = parseFloat(_cdc.precio_decan_pct)||0.10;
  var _fij = parseInt(_cdc.precio_decan_fijo)||3000;
  var decan=p.precio_decan>0?p.precio_decan:(pi>0?(Math.ceil(pi*_pct/1000)*1000+_fij):0);
  var r={ct:ct,pm:pm,pe:pe,pi:pi,rM:rM,rE:rE,decan:decan};
  // ── INTEGRACIÓN CON OFERTAS ──
  // Si el producto tiene una oferta vigente, aplicarla.
  // El cliente CC siempre ve el precio más barato (decisión de Ger).
  if(typeof ofertaParaProducto==='function'){
    var oferta=ofertaParaProducto(p.id);
    if(oferta){
      // Sub-ola B: si el producto tiene precio propio dentro de la campaña, usar ese
      // (precio único o % de descuento por producto). El render ya muestra el x1 tachado.
      if(oferta.campania_id && typeof _overrideProductoCampania==='function'){
        var _ov=_overrideProductoCampania(oferta.campania_id,p.id);
        if(_ov){
          oferta=Object.assign({},oferta);
          var _t=_ov.tipo;
          if(_t==='precio_unico'){oferta.tipo='precio_unico';oferta.precio_unico=_ov.precio_unico;oferta.descuento_pct=null;}
          else if(_t==='descuento_pct'){oferta.tipo='descuento_pct';oferta.descuento_pct=_ov.descuento_pct;oferta.precio_unico=null;}
          else if(_t==='x10_sin_minimo'){oferta.tipo='x10_sin_minimo';}
          else if(_t==='x3_sin_minimo'){oferta.tipo='x3_sin_minimo';}
          else if(_t==='multixmenos'){oferta.tipo='multixmenos';oferta.multi_paga=_ov.multi_paga||oferta.multi_paga;oferta.multi_lleva=_ov.multi_lleva||oferta.multi_lleva;}
          else {
            // Sin tipo propio: inferir del valor cargado (retrocompatible con campañas viejas).
            if(_ov.precio_unico>0){oferta.tipo='precio_unico';oferta.precio_unico=_ov.precio_unico;oferta.descuento_pct=null;}
            else if(_ov.descuento_pct>0){oferta.tipo='descuento_pct';oferta.descuento_pct=_ov.descuento_pct;oferta.precio_unico=null;}
          }
        }
      }
      // 🛡 2026-08-14: el precio/% de campaña se pone POR PRODUCTO. Si este producto
      // quedó sin su valor cargado (y la campaña tampoco trae uno), NO hay oferta
      // para él — antes aplicaba precio_unico vacío y el producto salía a $0/valor
      // fantasma (el "$100.000" residual que vio Ger).
      if(oferta && oferta.tipo==='precio_unico' && !(parseFloat(oferta.precio_unico)>0)) oferta=null;
      if(oferta && oferta.tipo==='descuento_pct' && !(parseFloat(oferta.descuento_pct)>0)) oferta=null;
      if(oferta){
        // 🎯 FEAT 2026-05-22: precio_mayorista hace lo mismo que CC para precios (pero no es CC)
        var esCC=_esVIPPrecio();
        r=aplicarOferta(r,oferta,esCC);
      }
    }
  }
  return r;
}

function getCartTotalUnits(){return Object.values(cart).filter(function(i){return !i.isDecan && !i.isBonificado && !i.isCombo;}).reduce(function(s,i){return s+i.qty;},0);}

// 🎯 FEAT 2026-05-22: Helper para detectar si el cliente debe ver "Precio VIP" (x10 fijo)
// Esto incluye tanto CC habilitada como precio_mayorista (un flag independiente que da
// el mismo beneficio de precio sin obligar a usar cuenta corriente).
// CC tiene precedencia: si el cliente tiene ambos flags, prevalece CC para el resto del flujo.
function _esVIPPrecio(){
  if(typeof _catCliente==='undefined' || !_catCliente) return false;
  return !!(_catCliente.cuenta_corriente_habilitada || _catCliente.precio_mayorista);
}

// 2026-10-08: rótulos de los tres precios de la tarjeta (un renglón; "Precio lista" porque
// "PRECIO DE LISTA" no entra en el recuadro en PC).
function _segRotulos(){ return ["10 o m\u00e1s","3 o m\u00e1s","Precio lista"]; }
function getBestSeg(total,r){
  // 2026-10-08 (regla de Ger, "que no falle nunca"): se elige el MÁS BARATO entre los tramos que el cliente
  // alcanza: VIP/CC → x10 siempre; 10 o más → x10; 3 o más → x3; oferta "x3/x10 sin mínimo" → ese tramo desde
  // 1 unidad. Antes la oferta x3 se aplicaba antes que la regla VIP y que la de 10 unidades, y el carrito
  // cobraba x3 donde la tarjeta mostraba x10.
  if(!r) return "pi";
  var cand=["pi"];
  if(r.pm && (_esVIPPrecio() || total>=10)) cand.push("pm");
  if(r.pe && total>=3) cand.push("pe");
  if(r.precio_efectivo==='pm' && r.pm) cand.push("pm");
  if(r.precio_efectivo==='pe' && r.pe) cand.push("pe");
  var best="pi";
  cand.forEach(function(sg){ if(r[sg]>0 && (!(r[best]>0) || r[sg]<r[best])) best=sg; });
  return best;
}

// Sort: in-stock alphabetical first, then no-stock alphabetical
// ── Filtros por chips: Familia olfativa + Precio (Tanda 2) ──
var _FAMILIAS=[
  {k:"floral",    re:/floral|rosa|jazmin|flor de azahar|azahar|peonia|nardo|tuberosa|iris|lirio|violeta|gardenia|ylang|magnolia/},
  {k:"amaderado", re:/amaderad|madera|sandalo|cedro|vetiver|\boud\b|gaiac|pachuli|cipres|abeto/},
  {k:"oriental",  re:/oriental|\bambar|ambarad|incienso|resin|balsam|benju|mirra|oud/},
  {k:"fresco",    re:/citric|fresc|acuatic|marino|aromatic|verde|bergamota|limon|menta|pomelo|yuzu|neroli|lavanda/},
  {k:"gourmand",  re:/gourmand|vainilla|dulce|caramelo|praline|chocolate|\bcafe|cacao|toffee|leche|miel|azucar|tonka/},
  {k:"especiado", re:/especiad|canela|cardamomo|azafran|pimienta|comino|clavo|nuez moscada|jengibre/},
  {k:"frutal",    re:/frutal|\bpina|mango|fresa|durazno|manzana|\bpera\b|cereza|coco|frambuesa|maracuya|lichi|grosella/},
  {k:"cuero",     re:/cuero|leather|tabaco/}
];
// Mapa producto_id -> texto de familia de la ficha (se arma una vez)
function _buildFamByProd(){
  window._famByProd={};
  if(Array.isArray(window._fichasSB)){
    window._fichasSB.forEach(function(f){
      if(f && f.producto_id!=null && f.familia_olfativa){
        if(!window._famByProd[f.producto_id]) window._famByProd[f.producto_id]=String(f.familia_olfativa);
      }
    });
  }
}
function _famText(p){
  var t=(p.nombre||"")+" "+(p.notas||"");
  try{var ac=Array.isArray(p.acordes)?p.acordes:(p.acordes?JSON.parse(p.acordes):[]);
    if(Array.isArray(ac))t+=" "+ac.map(function(a){return typeof a==="string"?a:(a&&a.nombre||"");}).join(" ");}catch(e){}
  var ff=window._famByProd&&window._famByProd[p.id];
  if(ff)t+=" "+ff;
  return norm(t);
}
function _prodEsFamilia(p,key){
  var fam=_FAMILIAS.find(function(f){return f.k===key;});
  if(!fam)return true;
  return fam.re.test(_famText(p));
}
// Rangos de precio automáticos según los precios reales del catálogo (terciles)
function fillPrecioChips(){
  var cont=document.getElementById("precioChips");
  if(!cont)return;
  var precios=[];
  (allProds||[]).forEach(function(p){
    if((p.stock_actual||0)<=0)return;
    try{var r=calcP(p);var v=r.pi||r.pe||r.pm||0;if(v>0)precios.push(v);}catch(e){}
  });
  if(precios.length<6){cont.innerHTML="";window._precioBuckets=null;return;}
  precios.sort(function(a,b){return a-b;});
  function pct(q){return precios[Math.floor(precios.length*q)];}
  // redondear a miles "lindos"
  function red(n){return Math.round(n/1000)*1000;}
  var t1=red(pct(0.34)), t2=red(pct(0.67));
  if(t2<=t1)t2=t1+1000;
  window._precioBuckets={t1:t1,t2:t2};
  function fmtK(n){return "$"+Math.round(n).toLocaleString("es-AR");}
  cont.innerHTML=
    "<div class='pill"+(precioF===""?" act":"")+"' onclick=\"setPrecio('',this)\">Todo precio</div>"+
    "<div class='pill"+(precioF==="bajo"?" act":"")+"' onclick=\"setPrecio('bajo',this)\">Hasta "+fmtK(t1)+"</div>"+
    "<div class='pill"+(precioF==="medio"?" act":"")+"' onclick=\"setPrecio('medio',this)\">"+fmtK(t1)+" – "+fmtK(t2)+"</div>"+
    "<div class='pill"+(precioF==="alto"?" act":"")+"' onclick=\"setPrecio('alto',this)\">Más de "+fmtK(t2)+"</div>";
}
function setPrecio(k,el){
  precioF=k||"";
  var cont=document.getElementById("precioChips");
  if(cont)cont.querySelectorAll(".pill").forEach(function(p){p.classList.remove("act");});
  if(el)el.classList.add("act");
  applyFilters();
}
function _prodEnRangoPrecio(p){
  // 🆕 2026-08: rango a medida escrito por la persona en el Buscador (mín / máx)
  if(precioF==="rango"){
    var vv=0;try{var rr=calcP(p);vv=rr.pi||rr.pe||rr.pm||0;}catch(e){}
    if(vv<=0)return false;
    var mn=window._bqMin||0, mx=window._bqMax||0;
    if(mn && vv<mn) return false;
    if(mx && vv>mx) return false;
    return true;
  }
  if(!precioF||!window._precioBuckets)return true;
  var v=0;try{var r=calcP(p);v=r.pi||r.pe||r.pm||0;}catch(e){}
  if(v<=0)return false;
  var b=window._precioBuckets;
  if(precioF==="bajo")return v<=b.t1;
  if(precioF==="medio")return v>b.t1&&v<=b.t2;
  if(precioF==="alto")return v>b.t2;
  return true;
}
function setOrden(v){ _ordenActual=v||""; applyFilters(); }
function sortedProds(arr){
  // Siempre: productos CON stock primero, SIN stock al final.
  var withStock=arr.filter(function(p){return(p.stock_actual||0)>0;});
  var noStock=arr.filter(function(p){return(p.stock_actual||0)===0;});
  function byName(a,b){
    var ba=getBrand(a.nombre).toLowerCase(),bb=getBrand(b.nombre).toLowerCase();
    if(ba<bb)return-1;if(ba>bb)return 1;
    return a.nombre.toLowerCase()<b.nombre.toLowerCase()?-1:1;
  }
  function precioDe(p){ try{var r=calcP(p);return r.pi||r.pe||r.pm||0;}catch(e){return 0;} }
  function fechaDe(p){ var d=p.ultimo_ingreso_at||p.reingreso_at||p.created_at||0; return d?new Date(d).getTime():0; }
  function cmp(a,b){
    switch(_ordenActual){
      case "precio_asc":  { var pa=precioDe(a)||1e12, pb=precioDe(b)||1e12; return pa-pb; }
      case "precio_desc": return precioDe(b)-precioDe(a);
      case "nuevo":       return fechaDe(b)-fechaDe(a);
      case "vendidos":    return (b.unidades_vendidas||0)-(a.unidades_vendidas||0);
      case "az":          return byName(a,b);
      default:            return byName(a,b);
    }
  }
  withStock.sort(cmp);noStock.sort(cmp);
  return withStock.concat(noStock);
}


function loadContacto(){
  var pg=document.getElementById("contactoPage");
  if(!pg)return;
  pg.innerHTML="<div style='display:flex;align-items:center;justify-content:center;padding:2rem'><div class='spin'></div></div>";
  Promise.all([
    apiGet("contacto_vendedores","select=*&activo=is.true&order=orden").catch(function(){return[];}),
    apiGet("contacto_redes","select=*&activo=is.true&order=orden").catch(function(){return[];}),
    apiGet("contacto_locales","select=*&activo=is.true&order=orden").catch(function(){return[];})
  ]).then(function(res){
    var vendedores=Array.isArray(res[0])?res[0]:[];
    var redes=Array.isArray(res[1])?res[1]:[];
    var locales=Array.isArray(res[2])?res[2]:[];
    var redIcons={"Instagram":"&#128247;","Facebook":"&#128100;","TikTok":"&#127926;","YouTube":"&#127909;","Twitter":"&#128038;","WhatsApp":"&#128241;"};
    pg.innerHTML=
      // Vendedores
      "<div style='margin-bottom:2rem'>"+
        "<h2 style='font-family:\"Cormorant Garamond\",serif;font-size:1.5rem;font-weight:600;margin-bottom:.3rem'>Nuestro equipo</h2>"+
        "<p style='font-size:.82rem;color:var(--mid);margin-bottom:1rem'>Contanos cuales son tus gustos y te asesoramos personalmente</p>"+
        "<div style='display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem'>"+
          vendedores.map(function(v){
            return"<div style='background:var(--white);border:1px solid var(--border);border-radius:12px;padding:1.2rem;text-align:center;transition:box-shadow .2s' onmouseover='this.style.boxShadow=\"0 4px 20px rgba(0,0,0,.08)\"' onmouseout='this.style.boxShadow=\"\"'>"+
              (v.foto_url?"<img src='"+_catEscAttr(v.foto_url)+"' loading='lazy' decoding='async' style='width:72px;height:72px;border-radius:50%;object-fit:cover;margin:0 auto .7rem;display:block;border:2px solid var(--accent)'>":
                "<div style='width:72px;height:72px;border-radius:50%;background:var(--accent-light);margin:0 auto .7rem;display:flex;align-items:center;justify-content:center;font-size:1.8rem;border:2px solid var(--accent)'>&#128100;</div>")+
              "<div style='font-family:\"Cormorant Garamond\",serif;font-size:1.1rem;font-weight:600;margin-bottom:.2rem'>"+_catEsc(v.nombre)+"</div>"+
              (v.descripcion?"<div style='font-size:.75rem;color:var(--mid);margin-bottom:.7rem;line-height:1.4'>"+_catEsc(v.descripcion)+"</div>":"")+
              (v.whatsapp?"<a href='https://wa.me/"+v.whatsapp.replace(/\D/g,"")+"' target='_blank' style='display:inline-flex;align-items:center;gap:.4rem;background:#25D366;color:#fff;padding:.4rem .9rem;border-radius:20px;font-size:.78rem;font-weight:500;text-decoration:none'>"+
                "<svg width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/></svg>"+
                "Consultar</a>":"")+
            "</div>";
          }).join("")+
        "</div>"+
      "</div>"+
      // Redes
      "<div style='margin-bottom:2rem'>"+
        "<h2 style='font-family:\"Cormorant Garamond\",serif;font-size:1.5rem;font-weight:600;margin-bottom:.3rem'>Seguinos</h2>"+
        "<div style='display:flex;flex-wrap:wrap;gap:.7rem'>"+
          redes.map(function(r){
            var icon=redIcons[r.red]||"&#127760;";
            var colors={"Instagram":"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)","Facebook":"#1877f2","TikTok":"#010101","YouTube":"#ff0000","Twitter":"#1da1f2","WhatsApp":"#25D366"};
            var bg=colors[r.red]||"#666";
            return"<a href='"+r.url+"' target='_blank' style='display:flex;align-items:center;gap:.6rem;background:"+bg+";color:#fff;padding:.55rem 1.1rem;border-radius:30px;text-decoration:none;font-size:.82rem;font-weight:500;transition:opacity .2s' onmouseover='this.style.opacity=\".85\"' onmouseout='this.style.opacity=\"1\"'>"+
              "<span style='font-size:1.1rem'>"+icon+"</span>"+
              "<span>"+r.red+(r.usuario?" &bull; "+r.usuario:"")+"</span>"+
            "</a>";
          }).join("")+
        "</div>"+
      "</div>"+
      // Locales
      "<div>"+
        "<h2 style='font-family:\"Cormorant Garamond\",serif;font-size:1.5rem;font-weight:600;margin-bottom:.3rem'>Encontranos</h2>"+
        "<div style='display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem'>"+
          locales.map(function(l){
            return"<div style='background:var(--white);border:1px solid var(--border);border-radius:12px;padding:1.2rem'>"+
              "<div style='font-size:1rem;font-weight:600;margin-bottom:.6rem;font-family:\"Cormorant Garamond\",serif'>&#128205; "+l.nombre+"</div>"+
              (l.direccion?"<div style='font-size:.8rem;color:var(--mid);margin-bottom:.3rem'>"+l.direccion+"</div>":"")+
              (l.telefono?"<div style='font-size:.8rem;color:var(--mid);margin-bottom:.3rem'>&#128222; "+l.telefono+"</div>":"")+
              (l.horario?"<div style='font-size:.78rem;color:var(--accent);margin-bottom:.5rem'>&#128336; "+l.horario+"</div>":"")+
              (l.telefono?"<a href='https://wa.me/"+l.telefono.replace(/\D/g,"")+"' target='_blank' style='font-size:.75rem;color:var(--accent);text-decoration:none'>Enviar WhatsApp &rarr;</a>":"")+
            "</div>";
          }).join("")+
        "</div>"+
      "</div>";
  }).catch(function(){
    pg.innerHTML="<div style='padding:2rem;text-align:center;color:var(--mid)'>Error cargando contacto</div>";
  }).catch(function(e){
    console.error("loadContacto error:", e);
    pg.innerHTML="<div style='text-align:center;padding:2rem;color:var(--tx-mid)'>"+"<div>Error al cargar contacto: "+(e&&e.message?e.message:"sin conexión")+"</div>"+"<button onclick='loadContacto()' style='margin-top:.8rem;padding:.4rem .9rem;border-radius:7px;border:1px solid var(--accent);color:var(--accent);background:transparent;cursor:pointer;font-size:.78rem'>Reintentar</button>"+"</div>";
  });
}


function catToggleFavsView(force){
  var turnOn = (typeof force==='boolean') ? force : !window._soloFavs;
  if(turnOn && (!_catCliente || !_catCliente.id)){
    // 🆕 2026-08: no alcanza con avisar — se abre directamente el panel de la cuenta
    // en modo "iniciar sesión / crear cuenta", igual que al marcar un corazón.
    if(typeof _catToast==='function') _catToast("Iniciá sesión para ver tus favoritos","twarn");
    else if(typeof toast==='function') toast("Iniciá sesión para ver tus favoritos");
    if(typeof catCerrarTabsDrawer==='function') catCerrarTabsDrawer();
    if(typeof bmCerrarSheet==='function'){ try{ bmCerrarSheet(); }catch(e){} }
    setTimeout(function(){
      try{
        _catDrawerView="login";
        var dw=document.getElementById("drawerCuenta");
        if(dw && !dw.classList.contains("open")){ if(typeof toggleMiCuenta==='function') toggleMiCuenta(); }
        else if(typeof catRenderDrawer==='function') catRenderDrawer();
      }catch(e){}
    }, 260);
    return;
  }
  window._soloFavs = turnOn;
  // 🚀 2026-08: si los favoritos todavía no terminaron de cargar, se piden AHORA y se
  // vuelve a aplicar al llegar (antes parecía que "no funcionaba": mostraba vacío).
  if(turnOn && (!_catFavs || !_catFavs.length) && !window._favsCargando){
    window._favsCargando = true;
    try{
      apiGet("clientes_favoritos","select=producto_id&cliente_id=eq."+_catCliente.id).then(function(rows){
        _catFavs=(Array.isArray(rows)?rows:[]).map(function(r){return r.producto_id;});
        window._favsCargando=false;
        if(typeof catActualizarCorazones==='function') catActualizarCorazones();
        if(window._soloFavs){
          if(typeof applyFilters==='function') applyFilters();
          var _fb2=document.getElementById("favsBanner");
          if(_fb2){ var _n2=_catFavs.length; var _sp=_fb2.querySelector("span"); if(_sp) _sp.innerHTML="❤️ Mis favoritos"+(_n2?" ("+_n2+")":""); }
        }
      }).catch(function(){ window._favsCargando=false; });
    }catch(e){ window._favsCargando=false; }
  }
  var lc=document.getElementById("listContainer");
  var b=document.getElementById("favsBanner");
  if(turnOn){
    if(!b){ b=document.createElement("div"); b.id="favsBanner"; if(lc&&lc.parentNode) lc.parentNode.insertBefore(b, lc); }
    b.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:.6rem;background:#fff0f3;border:1px solid #f3c9d4;border-radius:12px;padding:.6rem .9rem;margin:.2rem 0 .8rem";
    var n=(_catFavs||[]).length;
    b.innerHTML="<span style='font-weight:600;color:#c2415a;font-size:.85rem'>&#10084;&#65039; Mis favoritos"+(n?" ("+n+")":"")+"</span>"+
      "<button onclick=\"catToggleFavsView(false)\" style='background:transparent;border:1px solid #c4965a;color:#a9763f;border-radius:18px;padding:.25rem .8rem;font-size:.72rem;cursor:pointer;font-family:inherit;white-space:nowrap'>Ver todo el catálogo</button>";
    var hEl=document.getElementById("homePage"); if(hEl) hEl.style.display="none";
    var d=document.getElementById("destacadosContainer"); if(d){ d.style.display="none"; d.innerHTML=""; }
    // 🆕 2026-08: en favoritos NO se muestra nada más: ni banner, ni secciones de la
    // pestaña, ni combos, ni el carrusel de marcas. Solo los favoritos.
    document.body.classList.add('bmSoloFavs');
    ['pestanaSeccionesContainer','combosSecCat','carousel','mcWrapTab','mcWrap','annBar'].forEach(function(id){
      var e=document.getElementById(id); if(e) e.style.display='none';
    });
  } else {
    if(b) b.style.display="none";
    document.body.classList.remove('bmSoloFavs');
    ['pestanaSeccionesContainer','combosSecCat','carousel','annBar'].forEach(function(id){
      var e=document.getElementById(id); if(e) e.style.display='';
    });
    if(typeof renderDestacados==='function') renderDestacados(curTab);
    if(typeof _mcRender==='function'){ try{ _mcRender(); }catch(e){} }
  }
  if(typeof catCerrarTabsDrawer==='function') catCerrarTabsDrawer();
  if(typeof applyFilters==='function') applyFilters();
  // al salir de favoritos, la lista vuelve solo en pestañas de productos: en Inicio y en las
  // pestañas con plantilla applyFilters ya decidió qué mostrar (antes quedaban las dos cosas)
  var _esPl=(typeof _campConPlantilla==='function')&&!!_campConPlantilla(curTab);
  if(!turnOn && lc && curTab!=='inicio' && !_esPl) lc.style.display="";
  try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){}
}
function _logoHome(){
  var t=null;
  document.querySelectorAll('.tab').forEach(function(x){
    var oc=x.getAttribute('onclick')||'';
    if(oc.indexOf("switchTab('inicio'")>=0||oc.indexOf('switchTab("inicio"')>=0) t=x;
  });
  if(t) switchTab('inicio',t);
  else { curTab='inicio'; if(typeof applyFilters==='function')applyFilters(); }
  try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){ window.scrollTo(0,0); }
}
var _svRendered=false, _svScrollY=0;
function _svWA(){
  var tel="5493515736780";
  var msg="¡Hola Facu! Vi los servicios de Belle y quiero emprender con ustedes. ¿Me contás cómo arranco?";
  window.open("https://wa.me/"+tel+"?text="+encodeURIComponent(msg),"_blank");
}
function _svRender(){
  var ov=document.getElementById("serviciosOverlay");
  if(!ov)return;
  var ICB="<path d='M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0'/><path d='M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0'/><path d='M3 6v13M12 6v13M21 6v13'/>";
  var ICC="<rect x='3' y='5' width='18' height='14' rx='3'/><path d='M3 10h18M7 15h1.5M11.5 15h2'/>";
  var ICT="<path d='M8.5 8.5h.01'/><path d='M4 7v5.5l8.5 8.5 6.5-6.5-8.5-8.5z'/><path d='M14 4l6 6'/>";
  var ICG="<rect x='3' y='8' width='18' height='4' rx='1'/><path d='M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7'/><path d='M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 5 12 8M16.5 8a2.5 2.5 0 0 0 0-5C14 3 12 5 12 8'/>";
  var ICN="<rect x='5' y='3' width='14' height='18' rx='2'/><path d='M9 7h6M9 11h6M9 15h4'/>";
  function svg(p){return "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'>"+p+"</svg>";}

  var h="";
  h+="<button class='sv-back' onclick='cerrarServicios()'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M15 18l-6-6 6-6'/></svg> Volver al catálogo</button>";

  h+="<section class='sv-hero'>";
  h+="<div class='sv-hero-glow'></div>";
  h+="<div class='sv-parts'><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>";
  h+="<div class='sv-hero-inner'>";
  h+="<div class='sv-kicker'>Distribuidora Belle</div>";
  h+="<h1><span class='l'>Emprendé</span> <span class='l'>con nosotros</span></h1>";
  h+="<p>No te vendemos perfumes. Te damos todo lo que necesitás para construir tu propio negocio.</p>";
  h+="<button class='sv-cta' onclick=\"var e=document.getElementById('sv-servicios');if(e)e.scrollIntoView({behavior:'smooth'});\">Ver todo lo disponible para tu negocio <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round'><path d='M5 12h14M13 6l6 6-6 6'/></svg></button>";
  h+="</div><div class='sv-scroll'></div></section>";

  h+="<section class='sv-stats'><div class='sv-wrap sv-stats-grid'>";
  var stats=[
    {to:500,pre:"+",lbl:"Perfumes",off:33,rc:"#d4a830"},
    {to:50,pre:"+",lbl:"Marcas",off:59,rc:"#4aa3d4"},
    {to:100,suf:"%",lbl:"A tu medida",off:0,rc:"#5fa864"},
    {to:24,suf:"h",lbl:"Te respondemos",off:72,rc:"#e0798f"}
  ];
  stats.forEach(function(s){
    h+="<div class='sv-stat' style='--off:"+s.off+";--rc:"+s.rc+"'>"+
      "<div class='sv-ring'><svg viewBox='0 0 120 120'><circle class='track' cx='60' cy='60' r='52'/><circle class='prog' cx='60' cy='60' r='52'/></svg>"+
      "<div class='sv-ring-num'><span class='num' data-to='"+s.to+"'"+(s.pre?" data-pre='"+s.pre+"'":"")+(s.suf?" data-suf='"+s.suf+"'":"")+">"+(s.pre||"")+"0"+(s.suf||"")+"</span></div></div>"+
      "<div class='lbl'>"+s.lbl+"</div></div>";
  });
  h+="</div></section>";

  h+="<section class='sv-sec' id='sv-servicios'><div class='sv-wrap'>";
  h+="<div class='sv-head'><div class='eb'>Nuestros servicios</div><h2>Hecho para que vendas más</h2><p>Cada beneficio está pensado para un solo objetivo: que tu negocio crezca.</p></div>";
  h+="<div class='sv-bento'>";
  var cards=[
    {cls:"sv-c-tall",ic:ICB,t:"Tu catálogo personalizado",p:"Armá tu catálogo con tu marca y tus precios. Te lo damos en PDF, listo para mandar a tus clientes por WhatsApp.",acc:"#d4a830",bg:"#fdf3e2"},
    {cls:"sv-c-sm",ic:ICC,t:"Cuenta corriente",p:"Comprá ahora y pagá después. Te habilitamos crédito con cuotas a tu medida.",acc:"#5fa864",bg:"#edf6ec"},
    {cls:"sv-c-sm",ic:ICT,t:"Precios mayoristas",p:"Cuanto más llevás, menos pagás. El precio baja por cantidad y tu ganancia sube.",acc:"#e0a53f",bg:"#fdf3e2"},
    {cls:"sv-c-mid",ic:ICG,t:"Combos y ofertas",p:"Combos ya armados y ofertas exclusivas para revendedores. Más variedad para tu vidriera, mejor margen para vos.",acc:"#e0798f",bg:"#fdeef1"},
    {cls:"sv-c-mid",ic:ICN,t:"Fichas que venden",p:"Cada perfume con sus notas, su familia olfativa y a qué original se inspira. Vendé con información que convence.",acc:"#4aa3d4",bg:"#eaf5fb"}
  ];
  cards.forEach(function(c){
    h+="<div class='sv-card "+c.cls+"' data-rev style='--acc:"+c.acc+";--accbg:"+c.bg+"'><span class='sv-card-glow'></span><div class='ic'>"+svg(c.ic)+"</div><h3>"+c.t+"</h3><p>"+c.p+"</p></div>";
  });
  h+="</div></div></section>";

  h+="<section class='sv-wrap'><div class='sv-gen'><div class='sv-gen-inner'>";
  h+="<div class='sv-gen-txt'><div class='eb'>★ Nuevo · Exclusivo</div><h2>Personalizá tu tarjeta</h2><p>Generá tarjetas de tus productos con tu marca, tu precio y tu estilo. Elegí entre 10 formatos, colores y proporciones. Nadie va a saber que salen de acá — son tuyas.</p>";
  h+="<div class='sv-glabel'>Elegí el estilo</div><div class='sv-seg' id='svSegFmt'><button class='on' data-f='f-min'>Minimal</button><button data-f='f-lux'>Lujo</button><button data-f='f-mod'>Moderno</button></div>";
  h+="<div class='sv-glabel'>Proporción</div><div class='sv-seg' id='svSegProp'><button class='on' data-p='feed'>Feed / Muro</button><button data-p='story'>Story</button></div>";
  h+="<button class='sv-cta' style='margin-top:24px' onclick='cerrarServicios();abrirGenTarjeta();'>Crear mi tarjeta ahora <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round'><path d='M5 12h14M13 6l6 6-6 6'/></svg></button>";
  h+="</div>";
  h+="<div class='sv-gen-prev'><div class='sv-mini f-min' id='svMini'><div class='mimg'><svg width='52' height='52' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4'><path d='M9 3h6v3H9zM8 6h8l1 4v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z'/><path d='M9 13h6'/></svg></div><div class='mbody'><div class='mbrand'>Lattafa</div><div class='mname'>Asad Bourbon</div><div class='macc'><span>Lavanda</span><span>Cacao</span><span>Vainilla</span></div><div class='mfoot'><div class='mprice'>$50.200</div><div class='mtag'>Tu Negocio<br>11 5555-5555</div></div></div></div></div>";
  h+="</div></div></section>";

  h+="<section class='sv-final'><h2>¿Arrancamos?</h2><p>Sumate a Belle y empezá a vender con todo de tu lado.</p><button class='wa' onclick='_svWA()'><svg viewBox='0 0 24 24' fill='currentColor'><path d='M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.4-.1-.6.1-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.6-.9-2.2-.2-.6-.5-.5-.6-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.3A10 10 0 1 0 12 2z'/></svg> Quiero emprender</button></section>";

  ov.innerHTML=h;

  // demo generador
  var mini=document.getElementById("svMini"),curF="f-min",curP="feed";
  function rend(){mini.className="sv-mini "+curF+(curP==="story"?" story":"");}
  ov.querySelectorAll("#svSegFmt button").forEach(function(b){b.onclick=function(){ov.querySelectorAll("#svSegFmt button").forEach(function(x){x.classList.remove("on");});b.classList.add("on");curF=b.dataset.f;rend();};});
  ov.querySelectorAll("#svSegProp button").forEach(function(b){b.onclick=function(){ov.querySelectorAll("#svSegProp button").forEach(function(x){x.classList.remove("on");});b.classList.add("on");curP=b.dataset.p;rend();};});

  // reveal + contador + anillos (root = overlay porque scrollea adentro)
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("sv-in");io.unobserve(e.target);}});},{root:ov,threshold:.15});
  ov.querySelectorAll("[data-rev]").forEach(function(c,i){c.style.transitionDelay=(i*90)+"ms";io.observe(c);});
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("sv-in");var n=e.target.querySelector(".num");if(n)_svAnim(n);so.unobserve(e.target);}});},{root:ov,threshold:.4});
  ov.querySelectorAll(".sv-stat").forEach(function(st){so.observe(st);});
}
function _svAnim(el){
  var to=+el.dataset.to,suf=el.dataset.suf||"",pre=el.dataset.pre||"",d=1400,t0=null;
  function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/d,1);var val=Math.round((0.5-Math.cos(p*Math.PI)/2)*to);el.textContent=pre+(to>=1000?val.toLocaleString("es-AR"):val)+suf;if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
// ═══════════════ GENERADOR DE TARJETAS (cliente) ═══════════════
var _gtState={prod:null,fmt:"f-min",prop:"story",color:"auto",notas:true,fotos:true,acordes:true,negocio:"",tel:"",precio:"",
  nMode:"notas",nTexto:"",nFmt:{size:"m",align:"center"},
  aMode:"acordes",aTexto:"",aFmt:{size:"m",align:"center"}};
var _gtRendered=false, _gtScrollY=0;

function _gtEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function _gtFmtPrecio(v){
  var n=String(v==null?"":v).replace(/[^\d]/g,"");
  if(!n) return "";
  return "$"+Number(n).toLocaleString("es-AR");
}
function _gtProdNombre(p){
  var br=p.empresa?p.empresa+" - ":"";
  var n=String(p.nombre||"").replace(br,"");
  // quitar sufijos tipo | EDP | 100ml
  n=n.split("|")[0].trim();
  return n||String(p.nombre||"");
}
function _gtProdMarca(p){
  if(p.empresa) return p.empresa;
  var partes=String(p.nombre||"").split(" - ");
  return partes.length>1?partes[0]:"";
}
function _gtProdSubArr(p){
  var partes=String(p.nombre||"").split("|").map(function(x){return x.trim();});
  var out=partes.slice(1).filter(Boolean);
  if(p.ml && !out.join(" ").match(/\bml\b/i)) out.push(p.ml+" ml");
  return out;
}
function _gtAcordes(p){
  var a=[];
  try{a=Array.isArray(p.acordes)?p.acordes:(p.acordes?JSON.parse(p.acordes):[]);}catch(e){a=[];}
  return a.slice(0,6).map(function(x){
    var nom=(x&&x.nombre)?x.nombre:x;
    var pct=(x&&x.pct)?x.pct:50;
    var col=(typeof ACORDES_CAT!=="undefined"&&ACORDES_CAT[nom])?ACORDES_CAT[nom]:"#c4965a";
    return {nom:nom,pct:pct,col:col};
  });
}
function _gtNotas(p){
  var arr=[];
  try{
    if(typeof fichaMatchProd==="function" && typeof FICHAS_BELLE!=="undefined"){
      var f=fichaMatchProd(p.nombre, FICHAS_BELLE, p.id);
      if(f){["notas_salida","notas_corazon","notas_fondo"].forEach(function(k){
        var s=f[k]||""; if(s)String(s).split(",").forEach(function(n){n=n.trim();if(n)arr.push(n);});
      });}
    }
  }catch(e){}
  if(!arr.length && p.notas){ String(p.notas).split(",").forEach(function(n){n=n.trim();if(n)arr.push(n);}); }
  var seen={},out=[];
  arr.forEach(function(n){var k=n.toLowerCase();if(!seen[k]){seen[k]=1;out.push(n);}});
  return out.slice(0,6);
}

// ── Texto libre: estilo, editor y handlers ──
function _gtTxtStyle(f){
  f=f||{};
  var sz={s:"12px",m:"15px",l:"20px"}[f.size||"m"];
  var st="font-size:"+sz+";text-align:"+(f.align||"center")+";";
  if(f.bold) st+="font-weight:700;";
  if(f.italic) st+="font-style:italic;";
  if(f.color) st+="color:"+f.color+";";
  return st;
}
function _gtTxtEditor(pfx, val, fmt){
  fmt=fmt||{};
  var h="<textarea class='gt-txtarea' id='gtTxt_"+pfx+"' placeholder='Escribí acá tu frase, descripción, lo que quieras…' oninput='_gtSetTxt(&quot;"+pfx+"&quot;,this.value)'>"+_gtEsc(val||"")+"</textarea>";
  h+="<div class='gt-txtmenu' id='gtTM_"+pfx+"'>";
  ["s","m","l"].forEach(function(sz){
    h+="<button class='gt-tm-btn"+((fmt.size||"m")===sz?" on":"")+"' data-k='size' data-v='"+sz+"' onclick='_gtSetFmt(&quot;"+pfx+"&quot;,&quot;size&quot;,&quot;"+sz+"&quot;)'>"+sz.toUpperCase()+"</button>";
  });
  h+="<span class='gt-tm-sep'></span>";
  h+="<button class='gt-tm-btn"+(fmt.bold?" on":"")+"' data-k='bold' onclick='_gtSetFmt(&quot;"+pfx+"&quot;,&quot;bold&quot;)' style='font-weight:800'>B</button>";
  h+="<button class='gt-tm-btn"+(fmt.italic?" on":"")+"' data-k='italic' onclick='_gtSetFmt(&quot;"+pfx+"&quot;,&quot;italic&quot;)' style='font-style:italic;font-family:Georgia,serif'>I</button>";
  h+="<span class='gt-tm-sep'></span>";
  var al=[["left","M3 5h14M3 9h9M3 13h14M3 17h9"],["center","M3 5h14M5 9h10M3 13h14M5 17h10"],["right","M3 5h14M8 9h9M3 13h14M8 17h9"],["justify","M3 5h14M3 9h14M3 13h14M3 17h14"]];
  al.forEach(function(a){
    h+="<button class='gt-tm-btn"+((fmt.align||"center")===a[0]?" on":"")+"' data-k='align' data-v='"+a[0]+"' onclick='_gtSetFmt(&quot;"+pfx+"&quot;,&quot;align&quot;,&quot;"+a[0]+"&quot;)'><svg width='15' height='15' viewBox='0 0 20 22' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'><path d='"+a[1]+"'/></svg></button>";
  });
  h+="<span class='gt-tm-sep'></span>";
  ["","#c9a24b","#d4589a","#8a5ac4","#3a7bd4","#5a9e4a","#2a2a2a"].forEach(function(c){
    if(c===""){ h+="<button class='gt-tm-sw gt-tm-auto"+(!fmt.color?" on":"")+"' data-k='color' data-v='' title='Auto' onclick='_gtSetFmt(&quot;"+pfx+"&quot;,&quot;color&quot;,&quot;&quot;)'>A</button>"; }
    else { h+="<button class='gt-tm-sw"+(fmt.color===c?" on":"")+"' data-k='color' data-v='"+c+"' style='background:"+c+"' onclick='_gtSetFmt(&quot;"+pfx+"&quot;,&quot;color&quot;,&quot;"+c+"&quot;)'></button>"; }
  });
  h+="</div>";
  return h;
}
function _gtSetMode(pfx, v){ _gtState[pfx+"Mode"]=v; _gtRender(); }
function _gtSetTxt(pfx, v){ _gtState[pfx+"Texto"]=v; _gtRefreshCard(); }
function _gtSetFmt(pfx, k, v){
  var o=_gtState[pfx+"Fmt"]||{};
  if(k==="bold"||k==="italic"){ o[k]=!o[k]; } else { o[k]=v; }
  _gtState[pfx+"Fmt"]=o;
  _gtRefreshCard();
  _gtSyncTxtMenu(pfx);
}
function _gtSyncTxtMenu(pfx){
  var box=document.getElementById("gtTM_"+pfx); if(!box)return;
  var f=_gtState[pfx+"Fmt"]||{};
  box.querySelectorAll(".gt-tm-btn, .gt-tm-sw").forEach(function(b){
    var k=b.dataset.k;
    if(k==="size") b.classList.toggle("on",(f.size||"m")===b.dataset.v);
    else if(k==="align") b.classList.toggle("on",(f.align||"center")===b.dataset.v);
    else if(k==="bold") b.classList.toggle("on",!!f.bold);
    else if(k==="italic") b.classList.toggle("on",!!f.italic);
    else if(k==="color") b.classList.toggle("on",(f.color||"")===b.dataset.v);
  });
}

// ── HTML de la tarjeta según estado ──
function _gtCardHTML(){
  var s=_gtState, p=s.prod;
  if(!p) return "<div class='gt-empty'>Elegí un producto para ver tu tarjeta</div>";
  if(s.fmt && /^fmod\d+$/.test(s.fmt)){ return _gtFichaCardHTML(); }
  var nombre=_gtEsc(_gtProdNombre(p)), marca=_gtEsc(_gtProdMarca(p));
  var precio=s.precio?_gtEsc(_gtFmtPrecio(s.precio)):"$—";
  var neg=_gtEsc(s.negocio||"Tu Negocio"), tel=_gtEsc(s.tel||"");
  var img=p.imagen_url||"";
  var acs=_gtAcordes(p), nts=_gtNotas(p);

  // FOTO
  var fotoHTML="<div class='gt-photo'>"+
    (img?"<img class='gtf-pimg' src='"+_gtEsc(img)+"' alt=''>":"<div class='gt-noimg'><svg width='54' height='54' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.3'><path d='M9 3h6v3H9zM8 6h8l1 4v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z'/><path d='M9 13h6'/></svg></div>")+
    "</div>";

  // ACORDES o TEXTO LIBRE
  var accHTML="";
  if(s.aMode==="texto"){
    if(s.aTexto) accHTML="<div class='gt-freetext' style='"+_gtTxtStyle(s.aFmt)+"'>"+_gtEsc(s.aTexto).replace(/\n/g,"<br>")+"</div>";
  } else if(acs.length){
    var _accSt={"f-lux":"dots","f-noc":"dots","f-cla":"dots","f-mod":"pills","f-rose":"pills","f-neo":"pills","f-aur":"pills"}[s.fmt]||"bars";
    if(_accSt==="dots"){
      accHTML="<div class='gt-acc gt-acc-dots'>"+acs.map(function(a){
        var pv=Math.max(5,Math.min(100,Math.round(a.pct))), R=15.5, C=(2*Math.PI*R).toFixed(1), O=(2*Math.PI*R*(1-pv/100)).toFixed(1);
        return "<div class='gt-dot'><svg class='gt-dsvg' viewBox='0 0 40 40'>"+
          "<circle cx='20' cy='20' r='"+R+"' fill='none' stroke='rgba(140,140,140,.22)' stroke-width='3.6'/>"+
          "<circle cx='20' cy='20' r='"+R+"' fill='none' stroke='"+a.col+"' stroke-width='3.6' stroke-linecap='round' stroke-dasharray='"+C+"' stroke-dashoffset='"+O+"' transform='rotate(-90 20 20)'/>"+
          "<text x='20' y='24.5' text-anchor='middle' font-size='12' font-weight='700' fill='"+a.col+"'>"+Math.round(a.pct)+"</text>"+
        "</svg><span>"+_gtEsc(a.nom)+"</span></div>";
      }).join("")+"</div>";
    } else if(_accSt==="pills"){
      accHTML="<div class='gt-acc gt-acc-pills'>"+acs.map(function(a){
        return "<span class='gt-pill' style='background:"+a.col+"'>"+_gtEsc(a.nom)+" <b>"+Math.round(a.pct)+"%</b></span>";
      }).join("")+"</div>";
    } else {
      var mx=Math.max.apply(null,acs.map(function(a){return a.pct;}));
      accHTML="<div class='gt-acc gt-acc-bars'>"+acs.map(function(a){
        var w=Math.round(a.pct/mx*100);
        return "<div class='gt-bar'><span class='gt-bname'>"+_gtEsc(a.nom)+"</span><div class='gt-btrack'><div class='gt-bfill' style='width:"+w+"%;background:linear-gradient(90deg,"+a.col+"aa,"+a.col+")'></div></div><span class='gt-bpct'>"+Math.round(a.pct)+"%</span></div>";
      }).join("")+"</div>";
    }
  }

  // NOTAS o TEXTO LIBRE
  var notHTML="";
  if(s.nMode==="texto"){
    if(s.nTexto) notHTML="<div class='gt-freetext' style='"+_gtTxtStyle(s.nFmt)+"'>"+_gtEsc(s.nTexto).replace(/\n/g,"<br>")+"</div>";
  } else if(nts.length){
    if(s.fotos){
      notHTML="<div class='gt-notas gt-notas-foto'>"+nts.map(function(n){
        var _f=(typeof getNotaFoto==="function")?getNotaFoto(n):"";
        var _nk=String(n||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g," ").trim();
        var _ff=(typeof NOTAS_FOTOS_USER!=="undefined"&&NOTAS_FOTOS_USER[_nk])?NOTAS_FOTOS_USER[_nk]:_f;
        return "<div class='gt-nota'><img class='gt-nimg' src=\""+_ff+"\" alt=\""+_gtEsc(n)+"\" loading='lazy' onerror=\"this.src=NOTAS_FOTOS['_default']\"><span>"+_gtEsc(n)+"</span></div>";
      }).join("")+"</div>";
    } else {
      notHTML="<div class='gt-notas gt-notas-txt'>"+nts.map(function(n){
        return "<span class='gt-ntag'>"+_gtEsc(n)+"</span>";
      }).join("")+"</div>";
    }
  }

  var subArr=_gtProdSubArr(p);
  // 2026-10-26: el género va en la tarjeta (antes no aparecía)
  if(p.genero){ var _gg=String(p.genero), _gf=_gg.indexOf("\u2640")>=0||/fem/i.test(_gg), _gm=_gg.indexOf("\u2642")>=0||/masc/i.test(_gg); subArr=subArr.concat([(_gf&&!_gm)?"Femenino":(_gm&&!_gf)?"Masculino":"Unisex"]); }
  var badges=subArr.length?"<div class='gt-badges'>"+subArr.map(function(x,i){return "<span class='gt-badge gt-badge-"+(i%2)+"'>"+_gtEsc(x)+"</span>";}).join("")+"</div>":"";
  var body="<div class='gt-body'>"+
    (marca?"<div class='gt-brand'>"+marca+"</div>":"")+
    "<div class='gt-name'>"+nombre+"</div>"+
    badges+
    "<div class='gt-pricebox'><span class='gt-price'>"+precio+"</span></div>"+
    accHTML+notHTML+
    "<div class='gt-foot"+(s.fLogo?" gt-foot-logo":"")+"'>"+(s.fLogo?"<img class='gt-logoimg' src='"+_gtEsc(s.fLogo)+"' alt='logo'>":"<div class='gt-neg'>"+neg+(tel?"<br>"+tel:"")+"</div>")+"</div>"+
  "</div>";

  var _cc=(s.color&&s.color!=="auto");
  var _prop=(s.prop==="feed")?"gtf-feed":"gtf-story";
  setTimeout(_gtfAjustar,50);
  return "<div id='gtCard' class='gtf-frame "+_prop+"'><div class='gt-card "+s.fmt+" "+s.prop+(_cc?" gt-hascolor":"")+"'"+(_cc?" style='--gtacc:"+s.color+"'":"")+">"+fotoHTML+body+"</div></div>";
}

// ── Render del overlay completo ──
// ═══════════════════════════════════════════════════════════════
// GENERADOR · MODO "INFORMACIÓN DE PRODUCTO" (ficha sin precio)
// ═══════════════════════════════════════════════════════════════

// Normaliza texto para comparar (sin tildes, minúsculas)
function _gtNorm(t){ return String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
function _gtHas(txt, palabra){ return _gtNorm(txt).indexOf(palabra)>=0; }
function _gtNivel(txt){
  var t=_gtNorm(txt);
  if(/muy alta|excelente|larga|fuerte|potente|monstruo/.test(t)) return 88;
  if(/\balta\b|buena|notable|larga/.test(t)) return 78;
  if(/media|moderad|normal/.test(t)) return 55;
  if(/baja|leve|suave|corta|discreta|piel|intim/.test(t)) return 32;
  return 62;
}

// Extrae TODOS los datos de la ficha de un producto
function _gtFichaData(p){
  var f=null;
  try{ if(typeof fichaMatchProd==="function" && typeof FICHAS_BELLE!=="undefined") f=fichaMatchProd(p.nombre, FICHAS_BELLE, p.id); }catch(e){}
  f=f||{};
  function join(k){ var s=f[k]||""; return String(s).split(",").map(function(x){return x.trim();}).filter(Boolean).join(", "); }
  var insp = f.inspirado_en_nombre || f.inspirado_en || "";
  var esOriginal = _gtHas(insp,"creacion original") || _gtHas(insp,"original");
  var familia = (f.familia_olfativa||"").split(/[,\/]/).map(function(x){return x.trim();}).filter(Boolean);
  var mom = { "Día":_gtHas(f.momento_dia,"dia"), "Tarde":_gtHas(f.momento_dia,"tarde"), "Noche":_gtHas(f.momento_dia,"noche") };
  if(!mom["Día"] && !mom["Tarde"] && !mom["Noche"]){ mom["Día"]=mom["Noche"]=true; }
  var est = { "Invierno":_gtHas(f.estacion,"invierno"), "Primavera":_gtHas(f.estacion,"primavera"), "Verano":_gtHas(f.estacion,"verano"), "Otoño":_gtHas(f.estacion,"otono") };
  if(!est["Invierno"]&&!est["Primavera"]&&!est["Verano"]&&!est["Otoño"]){ est["Invierno"]=est["Primavera"]=est["Verano"]=est["Otoño"]=true; }
  var ocas = String(f.ocasion||"").split(/[,\/]/).map(function(x){return x.trim();}).filter(Boolean).slice(0,5);
  var edad="";
  if(f.rango_edad_min && f.rango_edad_max) edad=f.rango_edad_min+" a "+f.rango_edad_max+" años";
  else if(f.rango_edad_min) edad="desde "+f.rango_edad_min+" años";
  return {
    marca: _gtProdMarca(p) || (p.empresa||""),
    nombre: _gtProdNombre(p),
    ml: parseInt(p.ml,10)||0,
    inicial: (_gtProdNombre(p)||"?").trim().charAt(0).toUpperCase(),
    conc: f.concentracion || (_gtProdSubArr(p)[0]||"Eau de Parfum"),
    genero: f.genero || "",
    anno: f.anno || f["año"] || "",
    familia: familia,
    inspirado: esOriginal ? "" : insp,
    esOriginal: esOriginal,
    salida: join("notas_salida"),
    corazon: join("notas_corazon"),
    fondo: join("notas_fondo"),
    momento: mom,
    estaciones: est,
    ocasion: ocas,
    duracion: f.duracion || "—", durN: _gtNivel(f.duracion),
    estela: f.estela || "—", estN: _gtNivel(f.estela),
    proyeccion: f.proyeccion || "—", proyN: _gtNivel(f.proyeccion),
    color: f.color_liquido || "",
    perfilGenero: f.perfil_usuario || f.genero || "",
    edad: edad,
    estilo: f.estilo_descripcion || "",
    descripcion: f.descripcion || "",
    imagen: p.imagen_url || ""
  };
}

// Foto: la subida por el cliente tiene prioridad; si no, la del catálogo
function _gtFichaFoto(D){
  var src = D.imagen || "";  // SIEMPRE la foto del catálogo (nunca se reemplaza)
  if(src) return "<div class='gtf-photo'><img class='gtf-pimg' src='"+_gtEsc(src)+"' alt='' crossorigin='anonymous'></div>";
  return "<div class='gtf-photo gtf-photo-ph'><svg width='44' height='44' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.2'><path d='M12 3c3 4 6 7 6 10a6 6 0 0 1-12 0c0-3 3-6 6-10z'/></svg></div>";
}
// Quita SOLO el fondo (blancos conectados a los bordes), respetando los blancos internos del producto.
function _gtfProcesarFotoPerfume(){
  var imgs=Array.prototype.slice.call(document.querySelectorAll(".gtf-pimg"));
  imgs.forEach(function(img){
    if(img.getAttribute("data-bg")) return;
    _gtImgAB(img.src).then(function(b64){
      if(!b64) return; // CORS: no se puede procesar; queda el blend como fallback
      var tmp=new Image();
      tmp.onload=function(){
        try{
          var w=tmp.naturalWidth,h=tmp.naturalHeight; if(!w||!h) return;
          var cv=document.createElement("canvas"); cv.width=w; cv.height=h;
          var ctx=cv.getContext("2d"); ctx.drawImage(tmp,0,0);
          var dt=ctx.getImageData(0,0,w,h),d=dt.data;
          var vis=new Uint8Array(w*h), st=[];
          function blanco(ix){ return d[ix]>232&&d[ix+1]>232&&d[ix+2]>232; }
          for(var x=0;x<w;x++){ st.push(x); st.push((h-1)*w+x); }
          for(var y=0;y<h;y++){ st.push(y*w); st.push(y*w+(w-1)); }
          while(st.length){
            var p=st.pop(); if(p<0||p>=w*h||vis[p]) continue;
            var ix=p*4; if(!blanco(ix)) continue;
            vis[p]=1; d[ix+3]=0;
            var px=p%w, py=(p-px)/w;
            if(px+1<w)st.push(p+1); if(px-1>=0)st.push(p-1); if(py+1<h)st.push(p+w); if(py-1>=0)st.push(p-w);
          }
          ctx.putImageData(dt,0,0);
          img.src=cv.toDataURL("image/png"); img.style.mixBlendMode="normal"; img.setAttribute("data-bg","1");
          if(typeof _gtfAjustar==="function") _gtfAjustar();
        }catch(e){}
      };
      tmp.src=b64;
    }).catch(function(){});
  });
}
// Reparte las secciones en 2 columnas balanceadas por altura (que no quede una vacía)
function _gtfBalancear(){
  var frame=document.getElementById("gtCard"); if(!frame) return;
  var grid=frame.querySelector(".gtf-grid"); if(!grid||grid.classList.contains("gtf-grid1")) return;
  var colA=grid.querySelector(".gtf-cola"), colB=grid.querySelector(".gtf-colb");
  if(!colA||!colB) return;
  var secs=Array.prototype.slice.call(grid.querySelectorAll(".gtf-box"));
  var med=secs.map(function(s){ return {el:s,h:s.offsetHeight||1}; });
  colA.innerHTML=""; colB.innerHTML="";
  var hA=0,hB=0;
  med.forEach(function(o){ if(hA<=hB){ colA.appendChild(o.el); hA+=o.h+10; } else { colB.appendChild(o.el); hB+=o.h+10; } });
}
// Escala la ficha para que entre EXACTA en el marco (story 9:16 o feed 1:1), sin superponer nada.
function _gtfAjustar(){
  var frame=document.getElementById("gtCard"); if(!frame) return;
  var card=frame.querySelector(".gtf-card, .gt-card"); if(!card) return;
  if(card.classList.contains("gte")) return;
  var W=frame.clientWidth, H=frame.clientHeight, s=1;
  card.style.transformOrigin="top left"; card.style.minHeight="0";
  for(var i=0;i<6;i++){
    card.style.width=(W/s)+"px"; card.style.transform="none";
    var alto=card.offsetHeight;
    var ns=alto>0?Math.min(1,H/alto):1;
    if(Math.abs(ns-s)<0.004){ s=ns; break; }
    s=ns;
  }
  card.style.width=(W/s)+"px"; card.style.minHeight=(H/s)+"px"; card.style.transform="scale("+s+")";
}

// Piezas comunes
var _GTF_MOMEMO={"Día":"☀️","Tarde":"🌤️","Noche":"🌙"}, _GTF_ESTEMO={"Invierno":"❄️","Primavera":"🌸","Verano":"☀️","Otoño":"🍂"};
function _gtfNotas(D){
  var out="";
  if(D.salida) out+="<div class='gtf-fase'><div class='gtf-fi'>🍋</div><div><div class='gtf-ft'>Salida</div><div class='gtf-fn'>"+_gtEsc(D.salida)+"</div></div></div>";
  if(D.corazon) out+="<div class='gtf-fase'><div class='gtf-fi'>🌸</div><div><div class='gtf-ft'>Corazón</div><div class='gtf-fn'>"+_gtEsc(D.corazon)+"</div></div></div>";
  if(D.fondo) out+="<div class='gtf-fase'><div class='gtf-fi'>🌰</div><div><div class='gtf-ft'>Fondo</div><div class='gtf-fn'>"+_gtEsc(D.fondo)+"</div></div></div>";
  return out||"<div class='gtf-fn' style='opacity:.6'>Sin notas cargadas</div>";
}
function _gtfSeg(D){ return "<div class='gtf-seg'>"+Object.keys(D.momento).map(function(k){return "<div class='"+(D.momento[k]?'on':'dim')+"'><span class='gtf-em'>"+_GTF_MOMEMO[k]+"</span>"+k+"</div>";}).join("")+"</div>"; }
function _gtfEst(D){ return "<div class='gtf-est'>"+Object.keys(D.estaciones).map(function(k){return "<div class='"+(D.estaciones[k]?'on':'dim')+"'><span class='gtf-em'>"+_GTF_ESTEMO[k]+"</span>"+k+"</div>";}).join("")+"</div>"; }
function _gtfOcas(D){ if(!D.ocasion.length) return ""; return "<div class='gtf-chips'>"+D.ocasion.map(function(o){return "<span>🎯 "+_gtEsc(o)+"</span>";}).join("")+"</div>"; }
function _gtfFam(D){ if(!D.familia.length) return ""; return "<div class='gtf-chips gtf-cc'>"+D.familia.map(function(fa){return "<span>"+_gtEsc(fa)+"</span>";}).join("")+"</div>"; }
function _gtfBars(D){ return "<div class='gtf-bars'>"+
  "<div class='gtf-row'><div class='gtf-rl'><span>📡 Proyección</span><span>"+_gtEsc(D.proyeccion)+"</span></div><div class='gtf-bar'><div class='gtf-bf' style='width:"+D.proyN+"%'></div></div></div>"+
  "<div class='gtf-row'><div class='gtf-rl'><span>⏱️ Duración</span><span>"+_gtEsc(D.duracion)+"</span></div><div class='gtf-bar'><div class='gtf-bf' style='width:"+D.durN+"%'></div></div></div>"+
  "<div class='gtf-row'><div class='gtf-rl'><span>💨 Estela</span><span>"+_gtEsc(D.estela)+"</span></div><div class='gtf-bar'><div class='gtf-bf' style='width:"+D.estN+"%'></div></div></div></div>"; }
function _gtfUsuario(D){
  var l=[]; if(D.perfilGenero) l.push("👤 "+_gtEsc(D.perfilGenero)); if(D.edad) l.push("🎂 "+_gtEsc(D.edad));
  var linea=l.join(" &nbsp;·&nbsp; ");
  if(D.estilo) linea+=(linea?"<br>":"")+"✨ <i>"+_gtEsc(D.estilo)+"</i>";
  return linea?"<div class='gtf-usr'>"+linea+"</div>":"";
}
function _gtfInsp(D){ if(D.esOriginal) return "<div class='gtf-insp'>✦ Creación original</div>"; if(!D.inspirado) return ""; return "<div class='gtf-insp'>≈ Al estilo de <b>"+_gtEsc(D.inspirado)+"</b></div>"; }
function _gtfFoot(){
  if(_gtState.fLogo){ return "<div class='gtf-foot gtf-foot-logo'><img class='gtf-logoimg' src='"+_gtEsc(_gtState.fLogo)+"' alt='logo'></div>"; }
  var neg=_gtEsc(_gtState.negocio||"Tu Negocio"), tel=_gtEsc(_gtState.tel||"");
  return "<div class='gtf-foot'>⚜ "+neg+(tel?" · "+tel:"")+"</div>";
}

// Cuerpo común de secciones (todas las fichas comparten el contenido)
function _gtfBody(D, bc){
  bc=bc||["gtf-box","gtf-box","gtf-box","gtf-box","gtf-box","gtf-box"];
  var famH = D.familia.length?"<div class='gtf-famrow'>"+_gtfFam(D)+"</div>":"";
  var S=_gtState.fSecs||(_gtState.fSecs={familia:1,notas:1,momento:1,estaciones:1,ocasion:1,perfil:1,usuario:1,desc:1});
  var items=[];
  if(S.notas) items.push("<div class='"+bc[0]+"'><div class='gtf-bh'>🧴 Notas</div>"+_gtfNotas(D)+"</div>");
  if(S.momento) items.push("<div class='"+bc[1]+"'><div class='gtf-bh'>🕐 Momento</div>"+_gtfSeg(D)+"</div>");
  if(S.estaciones) items.push("<div class='"+bc[2]+"'><div class='gtf-bh'>🌦️ Estaciones</div>"+_gtfEst(D)+"</div>");
  if(S.perfil) items.push("<div class='"+bc[4]+"'><div class='gtf-bh'>📊 Perfil olfativo</div>"+_gtfBars(D)+"</div>");
  if(S.ocasion && D.ocasion.length) items.push("<div class='"+bc[3]+"'><div class='gtf-bh'>🎯 Ocasión</div>"+_gtfOcas(D)+"</div>");
  if(S.usuario && (D.perfilGenero||D.edad||D.estilo)) items.push("<div class='"+bc[5]+"'><div class='gtf-bh'>💫 Usuario</div>"+_gtfUsuario(D)+"</div>");
  if(!(S.familia && D.familia.length)) famH="";
  var descH = (S.desc && D.descripcion)?"<div class='gtf-desc'>“"+_gtEsc(D.descripcion)+"”</div>":"";
  var unaCol = items.length<=2;
  return famH+"<div class='gtf-grid"+(unaCol?" gtf-grid1":"")+"'><div class='gtf-cola'>"+items.join("")+"</div><div class='gtf-colb'></div></div>"+descH;
}

function _gtFichaHero(D){
  var precioH="";
  if(_gtState.tipo==="precio" && _gtState.precio){ precioH="<div class='gtf-precio'>"+_gtEsc(_gtFmtPrecio(_gtState.precio))+"</div>"; }
  return "<div class='gtf-hero'>"+_gtFichaFoto(D)+
    "<div class='gtf-htext'>"+
      (D.marca?"<div class='gtf-brand'>"+_gtEsc(D.marca)+"</div>":"")+
      "<div class='gtf-name'>"+_gtEsc(D.nombre)+"</div>"+
      "<div class='gtf-sub'>"+[D.conc,(D.ml?D.ml+" ml":""),D.genero,D.anno].filter(Boolean).map(_gtEsc).join(" · ")+"</div>"+
      _gtfInsp(D)+precioH+
    "</div></div>";
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS PREMIUM (impacto): 7=Vogue 8=Brutalist 9=Apothecary 10=Chromatic
// ═══════════════════════════════════════════════════════════════
function _gteNotasLinea(D, sep){
  sep=sep||" · ";
  var ns=[];
  [D.salida,D.corazon,D.fondo].forEach(function(s){ if(s){ ns.push(String(s).split(",")[0].trim()); } });
  return ns.filter(Boolean).join(sep);
}
function _gtePrecio(){
  if(_gtState.tipo==="precio" && _gtState.precio) return _gtEsc(_gtFmtPrecio(_gtState.precio));
  return "";
}
function _gteFotoImg(D, cls){
  if(!D.imagen) return "";
  return "<img class='gtf-pimg "+(cls||"")+"' src='"+_gtEsc(D.imagen)+"' alt=''>";
}
function _gteFootTexto(){
  if(_gtState.fLogo) return "<img class='gte-logo' src='"+_gtEsc(_gtState.fLogo)+"' alt='logo'>";
  var neg=_gtEsc(_gtState.negocio||"Distribuidora Belle"), tel=_gtEsc(_gtState.tel||"");
  return neg+(tel?" · "+tel:"");
}
function _gteInsp(D){ if(D.esOriginal) return "Creación original"; return D.inspirado?("Al estilo de "+D.inspirado):""; }

// 7 · VOGUE — foto a sangre completa
function _gteVogue(D){
  var p=_gtePrecio();
  return "<div class='gte-vphoto'>"+_gteFotoImg(D,"gte-vimg")+"</div>"+
    "<div class='gte-vgrad'></div>"+
    "<div class='gte-vc'>"+
      (D.marca?"<div class='gte-vmk'>"+_gtEsc(D.marca)+"</div>":"")+
      "<div class='gte-vnm'>"+_gtEsc(_prodMl(D.nombre,D.ml))+"</div>"+
      (p?"<div class='gte-vprice'>"+p+"</div>":"")+
      "<div class='gte-vnt'>"+_gtEsc(_gteNotasLinea(D))+"</div>"+
      "<div class='gte-vfoot'>"+_gteFootTexto()+"</div>"+
    "</div>";
}
// 8 · BRUTALIST — tipografía masiva
function _gteBrutalist(D){
  var p=_gtePrecio();
  return "<div class='gte-bhd'><span>"+_gtEsc(D.marca||"")+"</span><span>"+_gtEsc([D.conc,(D.ml?D.ml+" ml":""),D.anno].filter(Boolean).join(" · "))+"</span></div>"+
    "<div class='gte-bbig'>"+_gtEsc(D.nombre)+"</div>"+
    "<div class='gte-bmid'>"+_gteFotoImg(D,"gte-bimg")+(p?"<div class='gte-bprice'>"+p+"</div>":"")+"</div>"+
    "<div class='gte-bfoot'><div><b>Notas</b> "+_gtEsc(_gteNotasLinea(D," / "))+"</div>"+
      (_gteInsp(D)?"<div><b>Estilo</b> "+_gtEsc(_gteInsp(D))+"</div>":"")+
      "<div class='gte-bneg'>"+_gteFootTexto()+"</div></div>";
}
// 9 · APOTHECARY — botica de lujo, minimal
function _gteApothecary(D){
  var p=_gtePrecio();
  var notas=[D.salida,D.corazon,D.fondo].filter(Boolean).map(function(s){return _gtEsc(String(s).split(",").slice(0,2).join(", "));}).join("<br>");
  return "<div class='gte-abr'>"+_gtEsc(D.marca||"Distribuidora Belle")+"</div>"+
    "<div class='gte-arule'></div>"+
    "<div class='gte-anm'>"+_gtEsc(D.nombre)+"</div>"+
    "<div class='gte-asub'>"+_gtEsc([D.conc,(D.ml?D.ml+" ml":""),D.genero].filter(Boolean).join(" · "))+"</div>"+
    "<div class='gte-aphoto'>"+_gteFotoImg(D,"gte-aimg")+"</div>"+
    (notas?"<div class='gte-ant'>"+notas+"</div>":"")+
    (p?"<div class='gte-aprice'>"+p+"</div>":"")+
    "<div class='gte-afoot'>"+_gteFootTexto()+"</div>";
}
// 10 · CHROMATIC — bloque de color
function _gteChromatic(D){
  var p=_gtePrecio();
  return "<div class='gte-cblock'>"+
      "<span class='gte-cmk'>"+_gtEsc(D.marca||"")+"</span>"+
      (D.anno?"<span class='gte-cyr'>"+_gtEsc(D.anno)+"</span>":"<span></span>")+
      "<div class='gte-cphoto'>"+_gteFotoImg(D,"gte-cimg")+"</div>"+
    "</div>"+
    "<div class='gte-cbody'>"+
      "<div class='gte-cnm'>"+_gtEsc(_prodMl(D.nombre,D.ml))+"</div>"+
      "<div class='gte-csub'>"+_gtEsc(D.familia&&D.familia.length?D.familia.join(" · "):(D.conc||""))+"</div>"+
      (p?"<div class='gte-cprice'>"+p+"</div>":"")+
      "<div class='gte-cnt'>"+_gtEsc(_gteNotasLinea(D))+"</div>"+
      "<div class='gte-cfoot'>"+_gteFootTexto()+"</div>"+
    "</div>";
}
function _gtEstiloHTML(D, m){
  if(m===7) return _gteVogue(D);
  if(m===8) return _gteBrutalist(D);
  if(m===9) return _gteApothecary(D);
  if(m===10) return _gteChromatic(D);
  return "";
}

// Render de la ficha según el modelo (1..5)
function _gtFichaCardHTML(){
  var p=_gtState.prod;
  if(!p) return "<div class='gt-empty'>Elegí un producto para ver tu ficha</div>";
  var D=_gtFichaData(p);
  var m=_gtState.fModelo||1;
  if(_gtState.tipo==="precio" && _gtState.fmt && /^fmod\d+$/.test(_gtState.fmt)){ m=parseInt(_gtState.fmt.slice(4),10); }
  var bc=(m===2)?["gtf-box gtf-bpink","gtf-box gtf-bblue","gtf-box gtf-bgreen","gtf-box gtf-byellow","gtf-box gtf-bpurple","gtf-box gtf-bpink"]:null;
  var prop=(_gtState.prop==="feed")?"gtf-feed":"gtf-story";
  if(m>=7){
    var eL={7:"gte-v",8:"gte-b",9:"gte-a",10:"gte-c"}[m]||"gte-v";
    setTimeout(function(){ _gtfProcesarFotoPerfume(); },50);
    return "<div id='gtCard' class='gtf-frame "+prop+"'><div class='gte "+eL+"'>"+_gtEstiloHTML(D,m)+"</div></div>";
  }
  setTimeout(function(){ _gtfBalancear(); _gtfProcesarFotoPerfume(); _gtfAjustar(); },50);
  return "<div id='gtCard' class='gtf-frame "+prop+"'><div class='gtf-card gtf-m"+m+"'>"+_gtFichaHero(D)+_gtfBody(D,bc)+_gtfFoot()+"</div></div>";
}

// ── Pantalla de selección de tipo (2 recuadros) ──
function _gtRenderSelector(){
  var h="";
  h+="<button class='gt-back' onclick='cerrarGenTarjeta()'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M15 18l-6-6 6-6'/></svg> Volver</button>";
  h+="<div class='gt-wrap'>";
  h+="<div class='gt-head'><h2>¿Qué querés crear?</h2><p>Elegí el tipo de tarjeta que querés armar para tus redes.</p></div>";
  h+="<div class='gtf-tipos'>";
  h+="<button class='gtf-tipo' onclick='_gtSetTipo(\"precio\")'>"+
     "<div class='gtf-tipo-ic'>🏷️</div>"+
     "<div class='gtf-tipo-t'>Producto con precio</div>"+
     "<div class='gtf-tipo-d'>La tarjeta clásica para vender: foto, nombre, acordes o notas, y <b>tu precio</b> con tus datos de contacto. Ideal para publicar ofertas.</div>"+
     "<div class='gtf-tipo-go'>Crear tarjeta con precio →</div></button>";
  h+="<button class='gtf-tipo' onclick='_gtSetTipo(\"ficha\")'>"+
     "<div class='gtf-tipo-ic'>📋</div>"+
     "<div class='gtf-tipo-t'>Información de producto</div>"+
     "<div class='gtf-tipo-d'>La <b>ficha completa sin precio</b>: notas, familia, a qué se inspira, momento, estaciones, proyección y más. Perfecta para dar valor y asesorar.</div>"+
     "<div class='gtf-tipo-go'>Crear ficha informativa →</div></button>";
  h+="</div></div>";
  return h;
}

// ── Modo "Información de producto" ──
function _gtRenderFicha(){
  var s=_gtState;
  var h="";
  h+="<button class='gt-back' onclick='_gtSetTipo(null)'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M15 18l-6-6 6-6'/></svg> Volver</button>";
  h+="<div class='gt-wrap'>";
  var esPrecio=(s.tipo==="precio");
  h+="<div class='gt-head'><h2>"+(esPrecio?"Tarjeta con precio":"Ficha informativa")+"</h2><p>"+(esPrecio?"Elegí el perfume y el estilo, poné tu precio, y tus datos o tu logo.":"Elegí el perfume y el estilo, y completá tus datos o subí tu logo.")+" Después descargala para Instagram.</p></div>";

  // Paso 1: producto
  h+="<div class='gtf-step'><div class='gtf-steplbl'>1 · Elegí el perfume</div>";
  h+="<input id='gtSearch' class='gt-input' type='text' placeholder='Buscá tu perfume…' autocomplete='off' oninput='_gtBuscar(this.value)'>";
  h+="<div id='gtResults' class='gt-results'></div>";
  h+="<div id='gtSelName' class='gt-selname'>"+(s.prod?("✓ "+_gtEsc((s.prod.nombre||"")+(s.prod.ml?(" | "+s.prod.ml+"ml"):""))):"")+"</div>";
  h+="</div>";

  if(esPrecio){
    h+="<div class='gtf-step'><div class='gtf-steplbl'>💵 Tu precio</div>";
    h+="<input class='gt-input' type='text' inputmode='numeric' placeholder='50200' value='"+_gtEsc(s.precio||"")+"' oninput='_gtSet(\"precio\",this.value)'>";
    h+="</div>";
  }

  // Paso 2: modelo
  h+="<div class='gtf-step'><div class='gtf-steplbl'>2 · Elegí el estilo</div>";
  var modelos=[[7,"Vogue"],[8,"Brutalist"],[9,"Apothecary"],[10,"Chromatic"],[1,"Vibrante"],[2,"Pastel"],[3,"Dark"],[4,"Ámbar"],[5,"Fresco"],[6,"Editorial"]];
  h+="<div class='gtf-modelos'>"+modelos.map(function(m){
    return "<button class='gtf-mbtn"+(( s.fModelo||1)===m[0]?" on":"")+"' onclick='_gtSetModelo("+m[0]+")'><span class='gtf-mchip gtf-mc"+m[0]+"'></span>"+m[1]+"</button>";
  }).join("")+"</div>";
  h+="<label class='gt-lbl' style='margin-top:.6rem'>Proporción</label>";
  h+="<div class='gt-seg' id='gtProp'>"+[["story","Story"],["feed","Feed / Muro"]].map(function(o){return "<button data-v='"+o[0]+"' onclick='_gtSet(&quot;prop&quot;,&quot;"+o[0]+"&quot;)'"+(o[0]===s.prop?" class='on'":"")+">"+o[1]+"</button>";}).join("")+"</div>";
  h+="<label class='gt-lbl' style='margin-top:.7rem'>Qué información mostrar <span style='font-weight:400;color:#8a8175'>(menos info = todo más grande)</span></label>";
  h+="<div class='gtf-secsel'>";
  var _S=_gtState.fSecs||{};
  [["familia","Familia"],["notas","Notas"],["momento","Momento"],["estaciones","Estaciones"],["ocasion","Ocasión"],["perfil","Perfil"],["usuario","Usuario"],["desc","Descripción"]].forEach(function(sl){
    var on=(_S[sl[0]]===undefined)?true:(!!_S[sl[0]]);
    h+="<button class='gtf-secbtn"+(on?" on":"")+"' onclick='_gtToggleSec(&quot;"+sl[0]+"&quot;)'>"+(on?"✓ ":"")+sl[1]+"</button>";
  });
  h+="</div>";
  h+="</div>";

  // Paso 3: datos + imagen (lado a lado)
  h+="<div class='gtf-step'><div class='gtf-steplbl'>3 · Tus datos o tu logo (van abajo de la ficha)</div>";
  h+="<div class='gtf-lado'>";
  // columna datos
  h+="<div class='gtf-col'>";
  h+="<div class='gtf-colh'>✍️ Tus datos</div>";
  h+="<label class='gt-lbl'>Nombre de tu negocio</label><input class='gt-input' type='text' placeholder='Tu Negocio' value='"+_gtEsc(s.negocio)+"' oninput='_gtSet(\"negocio\",this.value)'>";
  h+="<label class='gt-lbl'>Tu teléfono / WhatsApp</label><input class='gt-input' type='text' placeholder='11 5555-5555' value='"+_gtEsc(s.tel)+"' oninput='_gtSet(\"tel\",this.value)'>";
  h+="</div>";
  // columna imagen
  h+="<div class='gtf-col'>";
  h+="<div class='gtf-colh'>🏷️ Tu logo (opcional)</div>";
  h+="<div class='gtf-drop'>";
  h+="<input id='gtfFile' type='file' accept='image/*' style='display:none' onchange='_gtSubirImg(this)'>";
  h+="<button class='gt-btn gt-btn-alt' style='width:100%' onclick='document.getElementById(\"gtfFile\").click()'>"+(s.fLogo?"Cambiar logo":"Subir logo")+"</button>";
  if(s.fLogo) h+="<button class='gtf-clear' onclick='_gtQuitarImg()'>Quitar logo y usar mis datos</button>";
  h+="<div class='gtf-reso'>📐 El logo va <b>abajo de la ficha</b>, en lugar de tus datos. Recomendado: <b>600×150 px</b> (horizontal), fondo transparente. La foto del perfume no cambia.</div>";
  h+="</div></div>";
  h+="</div></div>";

  h+="<div class='gt-actions'>";
  h+="<button class='gt-btn gt-btn-main' onclick='_gtDescargar()'>Descargar imagen</button>";
  h+="</div><div id='gtMsg' class='gt-msg'></div>";

  // Preview
  h+="<div class='gtf-previewwrap'><div class='gtf-previewlbl'>Vista previa</div><div id='gtCardWrap'>"+_gtFichaCardHTML()+"</div></div>";

  h+="</div>";
  return h;
}

// ── Handlers ──
function _gtSetTipo(t){
  _gtState.tipo=t;
  _gtRender();
}
function _gtSetModelo(m){
  _gtState.fModelo=m;
  var w=document.getElementById("gtCardWrap"); if(w) w.innerHTML=_gtFichaCardHTML();
  Array.prototype.slice.call(document.querySelectorAll(".gtf-mbtn")).forEach(function(b){ b.classList.remove("on"); });
  var ev=window.event&&window.event.currentTarget; if(ev) ev.classList.add("on");
}
function _gtSubirImg(input){
  var f=input.files&&input.files[0]; if(!f) return;
  var rd=new FileReader();
  rd.onload=function(e){ _gtState.fLogo=e.target.result; _gtRender(); };
  rd.readAsDataURL(f);
}
function _gtQuitarImg(){ _gtState.fLogo=null; _gtRender(); }
function _gtToggleSec(k){
  if(!_gtState.fSecs) _gtState.fSecs={familia:1,notas:1,momento:1,estaciones:1,ocasion:1,perfil:1,usuario:1,desc:1};
  _gtState.fSecs[k]=_gtState.fSecs[k]?0:1;
  _gtRender();
}

// fuentes que solo usa esta pantalla (antes se bajaban en cada visita al catálogo)
function _gtFuentes(){
  if(document.getElementById('gtFontsLink')) return;
  var l=document.createElement('link'); l.id='gtFontsLink'; l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@600;800;900&family=Space+Mono:wght@400;700&display=swap';
  document.head.appendChild(l);
}
function _gtRender(){
  try{ _gtFuentes(); }catch(e){}
  var ov=document.getElementById("genTarjetaOverlay");
  if(!ov) return;
  if(!_gtState.tipo){ ov.innerHTML=_gtRenderSelector(); return; }
  if(_gtState.tipo==="ficha"){ ov.innerHTML=_gtRenderFicha(); return; }
  var s=_gtState;
  function seg(id,opts,cur){
    var _k=id==="gtFmt"?"fmt":"prop";
    return "<div class='gt-seg' id='"+id+"'>"+opts.map(function(o){
      return "<button data-v='"+o.v+"' onclick='_gtSet(&quot;"+_k+"&quot;,&quot;"+o.v+"&quot;)'"+(o.v===cur?" class='on'":"")+">"+o.t+"</button>";
    }).join("")+"</div>";
  }
  function seg2(id,pfx,opts,cur){
    return "<div class='gt-seg' id='"+id+"'>"+opts.map(function(o){
      return "<button data-v='"+o.v+"' onclick='_gtSetMode(&quot;"+pfx+"&quot;,&quot;"+o.v+"&quot;)'"+(o.v===cur?" class='on'":"")+">"+o.t+"</button>";
    }).join("")+"</div>";
  }
  var h="";
  h+="<button class='gt-back' onclick='cerrarGenTarjeta()'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M15 18l-6-6 6-6'/></svg> Volver</button>";
  h+="<div class='gt-wrap'>";
  h+="<div class='gt-head'><h2>Personalizá tu tarjeta</h2><p>Buscá un producto, poné tu precio y tus datos, y elegí tu estilo. Después descargala y compartila.</p></div>";
  h+="<div class='gt-grid'>";

  // Panel de controles
  h+="<div class='gt-controls'>";
  h+="<label class='gt-lbl'>Producto</label>";
  h+="<input id='gtSearch' class='gt-input' type='text' placeholder='Buscá tu perfume…' autocomplete='off' oninput='_gtBuscar(this.value)'>";
  h+="<div id='gtResults' class='gt-results'></div>";
  h+="<div id='gtSelName' class='gt-selname'></div>";

  h+="<label class='gt-lbl'>Tu precio</label>";
  h+="<input id='gtPrecio' class='gt-input' type='text' inputmode='numeric' placeholder='50200' value='"+_gtEsc(s.precio)+"' oninput='_gtSet(\"precio\",this.value)'>";
  h+="<label class='gt-lbl'>Nombre de tu negocio</label>";
  h+="<input id='gtNeg' class='gt-input' type='text' placeholder='Tu Negocio' value='"+_gtEsc(s.negocio)+"' oninput='_gtSet(\"negocio\",this.value)'>";
  h+="<label class='gt-lbl'>Tu teléfono / WhatsApp</label>";
  h+="<input id='gtTel' class='gt-input' type='text' placeholder='11 5555-5555' value='"+_gtEsc(s.tel)+"' oninput='_gtSet(\"tel\",this.value)'>";
  h+="<label class='gt-lbl'>…o subí tu logo (reemplaza tus datos abajo)</label>";
  h+="<input id='gtfFileP' type='file' accept='image/*' style='display:none' onchange='_gtSubirImg(this)'>";
  h+="<button class='gt-btn gt-btn-alt' style='width:100%' onclick='document.getElementById(\"gtfFileP\").click()'>"+(s.fLogo?"Cambiar logo":"Subir logo")+"</button>";
  if(s.fLogo) h+="<button class='gtf-clear' onclick='_gtQuitarImg()'>Quitar logo y usar mis datos</button>";

  h+="<label class='gt-lbl'>Estilo</label>";
  var _fmts=[["f-min","Minimal"],["f-lux","Lujo"],["f-mod","Moderno"],["f-noc","Nocturno"],["f-nat","Natural"],["f-rose","Rosé"],["f-edi","Editorial"],["f-neo","Neón"],["f-aur","Aurora"],["f-cla","Clásico"],["fmod7","Vogue"],["fmod8","Brutalist"],["fmod9","Apothecary"],["fmod10","Chromatic"]];
  h+="<div class='gt-fmtgrid' id='gtFmt'>"+_fmts.map(function(f){return "<button data-v='"+f[0]+"' onclick='_gtSet(&quot;fmt&quot;,&quot;"+f[0]+"&quot;)'"+(f[0]===s.fmt?" class='on'":"")+">"+f[1]+"</button>";}).join("")+"</div>";
  if(s.fmt && /^fmod[1-6]$/.test(s.fmt)){
    h+="<label class='gt-lbl'>Qué info mostrar en la ficha <span style='font-weight:400;color:#8a8175'>(menos = más grande)</span></label>";
    h+="<div class='gtf-secsel'>";
    var _S=s.fSecs||{};
    [["familia","Familia"],["notas","Notas"],["momento","Momento"],["estaciones","Estaciones"],["ocasion","Ocasión"],["perfil","Perfil"],["usuario","Usuario"],["desc","Descripción"]].forEach(function(sl){
      var on=(_S[sl[0]]===undefined)?true:(!!_S[sl[0]]);
      h+="<button class='gtf-secbtn"+(on?" on":"")+"' onclick='_gtToggleSec(&quot;"+sl[0]+"&quot;)'>"+(on?"✓ ":"")+sl[1]+"</button>";
    });
    h+="</div>";
  }
  h+="<label class='gt-lbl'>Proporción</label>";
  h+=seg("gtProp",[{v:"story",t:"Story"},{v:"feed",t:"Feed / Muro"}],s.prop);
  h+="<label class='gt-lbl'>Color de acento</label>";
  var _cols=[["auto","Auto"],["#c9a24b","Dorado"],["#d4589a","Rosa"],["#e8703a","Coral"],["#8a5ac4","Violeta"],["#3a7bd4","Azul"],["#5a9e4a","Verde"],["#2a2a2a","Negro"]];
  h+="<div class='gt-swatches' id='gtColor'>"+_cols.map(function(c){
    var on=(s.color||"auto")===c[0];
    if(c[0]==="auto"){ return "<button class='gt-sw gt-sw-auto"+(on?" on":"")+"' data-c='auto' title='Auto' onclick='_gtSet(&quot;color&quot;,&quot;auto&quot;)'>A</button>"; }
    return "<button class='gt-sw"+(on?" on":"")+"' data-c='"+c[0]+"' style='background:"+c[0]+"' title='"+c[1]+"' onclick='_gtSet(&quot;color&quot;,&quot;"+c[0]+"&quot;)'></button>";
  }).join("")+"</div>";

  // Bloque NOTAS: Notas reales o Texto libre
  h+="<label class='gt-lbl'>Sección de notas</label>";
  h+=seg2("gtNMode","n",[{v:"notas",t:"Notas"},{v:"texto",t:"Texto libre"}],s.nMode);
  if(s.nMode==="texto"){ h+=_gtTxtEditor("n", s.nTexto, s.nFmt); }
  else { h+="<label class='gt-tog' style='margin-top:9px'><input type='checkbox' "+(s.fotos?"checked":"")+" onchange='_gtSet(\"fotos\",this.checked)'> Fotos de notas</label>"; }
  // Bloque ACORDES: Acordes reales o Texto libre
  h+="<label class='gt-lbl'>Sección de acordes</label>";
  h+=seg2("gtAMode","a",[{v:"acordes",t:"Acordes"},{v:"texto",t:"Texto libre"}],s.aMode);
  if(s.aMode==="texto"){ h+=_gtTxtEditor("a", s.aTexto, s.aFmt); }

  h+="<div class='gt-actions'>";
  h+="<button class='gt-btn gt-btn-main' onclick='_gtDescargar()'>Descargar imagen</button>";
  h+="<button class='gt-btn gt-btn-alt' onclick='_gtGuardarPrefs()'>Guardar mi formato</button>";
  h+="</div>";
  h+="<div id='gtMsg' class='gt-msg'></div>";
  h+="</div>";

  // Preview
  h+="<div class='gt-preview'><div id='gtCardWrap'>"+_gtCardHTML()+"</div></div>";

  h+="</div></div>";
  ov.innerHTML=h;
  _gtCargarFotosNotas();
}

// ── Estado + refresco ──
function _gtSet(k,v){
  _gtState[k]=v;
  _gtRefreshCard();
  if(k==="fmt"||k==="prop"){ _gtSyncSeg(); }
  if(k==="color"){ _gtSyncColor(); }
}
function _gtRefreshCard(){
  var w=document.getElementById("gtCardWrap");
  if(w) w.innerHTML=(_gtState.tipo==="ficha")?_gtFichaCardHTML():_gtCardHTML();
  _gtCargarFotosNotas();
  if(typeof _gtfProcesarFotoPerfume==="function") setTimeout(_gtfProcesarFotoPerfume,60);
}
// Descarga las fotos de notas y las incrusta como base64 en la vista previa.
// Resuelve mobile: si el navegador no carga la <img> de Unsplash directamente, igual la mostramos.
var _gtFotoCache={};
function _gtCargarFotosNotas(){
  var card=document.getElementById("gtCard"); if(!card||typeof _gtImgAB!=="function")return;
  var imgs=Array.prototype.slice.call(card.querySelectorAll(".gt-nimg"));
  imgs.forEach(function(img){
    var u=img.getAttribute("src");
    if(!u||u.indexOf("data:")===0)return;
    if(_gtFotoCache[u]){ img.src=_gtFotoCache[u]; return; }
    _gtImgAB(u).then(function(d){
      if(d){ _gtFotoCache[u]=d; if(img&&img.parentNode) img.src=d; return; }
      if(typeof _compFetchAsDataURL==="function"){
        _compFetchAsDataURL(u).then(function(d2){ if(d2){ _gtFotoCache[u]=d2; if(img&&img.parentNode) img.src=d2; } });
      }
    });
  });
}
function _gtSyncSeg(){
  ["gtFmt","gtProp"].forEach(function(id){
    var seg=document.getElementById(id); if(!seg)return;
    var key=(id==="gtFmt")?"fmt":"prop";
    seg.querySelectorAll("button").forEach(function(b){ b.classList.toggle("on", b.dataset.v===_gtState[key]); });
  });
}
function _gtSyncColor(){
  var box=document.getElementById("gtColor"); if(!box)return;
  box.querySelectorAll("button").forEach(function(b){ b.classList.toggle("on", b.dataset.c===(_gtState.color||"auto")); });
}

// ── Buscador ──
function _gtBuscar(q){
  var box=document.getElementById("gtResults"); if(!box)return;
  q=String(q||"").trim().toLowerCase();
  if(q.length<2){ box.innerHTML=""; box.style.display="none"; return; }
  var prods=(typeof allProds!=="undefined")?allProds:[];
  var res=prods.filter(function(p){
    if(p.oculto||p.activo===false) return false;
    return String(p.nombre||"").toLowerCase().indexOf(q)>=0 || String(p.empresa||"").toLowerCase().indexOf(q)>=0;
  }).slice(0,8);
  if(!res.length){ box.innerHTML="<div class='gt-nores'>Sin resultados</div>"; box.style.display="block"; return; }
  box.innerHTML=res.map(function(p){
    return "<div class='gt-res' onclick='_gtElegir("+p.id+")'>"+_gtEsc((p.nombre||"")+(p.ml?(" | "+p.ml+"ml"):""))+"</div>";
  }).join("");
  box.style.display="block";
}
function _gtElegir(id){
  var prods=(typeof allProds!=="undefined")?allProds:[];
  var p=prods.filter(function(x){return x.id==id;})[0];
  if(!p)return;
  _gtState.prod=p;
  var box=document.getElementById("gtResults"); if(box){box.innerHTML="";box.style.display="none";}
  var sn=document.getElementById("gtSelName"); if(sn) sn.textContent="✓ "+(p.nombre||"")+(p.ml?(" | "+p.ml+"ml"):"");
  var si=document.getElementById("gtSearch"); if(si) si.value="";
  _gtRefreshCard();
  if(typeof syncNotasFotosDesdeSupabase==="function"){ try{ syncNotasFotosDesdeSupabase(function(){ _gtRefreshCard(); }); }catch(e){} }
}

// ── Descargar PNG ──
// Convierte una URL de imagen a base64 vía Image+crossOrigin+canvas (bueno para Unsplash).
function _gtImgAB(url){
  return new Promise(function(resolve){
    if(!url||url.indexOf("data:")===0){resolve(url);return;}
    var im=new Image();
    try{ im.crossOrigin="anonymous"; }catch(e){}
    im.onload=function(){
      try{
        var cv=document.createElement("canvas"); cv.width=im.naturalWidth; cv.height=im.naturalHeight;
        if(!cv.width||!cv.height){resolve(null);return;}
        cv.getContext("2d").drawImage(im,0,0);
        resolve(cv.toDataURL("image/png"));
      }catch(e){ resolve(null); }
    };
    im.onerror=function(){ resolve(null); };
    im.src=url;
  });
}
// Precarga TODAS las <img> del elemento a base64. Doble método para máxima cobertura:
// primero Image+canvas; si falla, el fetch del catálogo; si ambos fallan, oculta esa img.
function _gtPrecargarImgs(card){
  var imgs=Array.prototype.slice.call(card.querySelectorAll("img"));
  return Promise.all(imgs.map(function(img){
    var src=img.src;
    if(!src||src.indexOf("data:")===0) return Promise.resolve();
    return _gtImgAB(src).then(function(d){
      if(d){ img.src=d; return; }
      if(typeof _compFetchAsDataURL==="function"){
        return _compFetchAsDataURL(src).then(function(d2){ if(d2){img.src=d2;} else {img.style.opacity="0";} });
      }
      img.style.opacity="0";
    });
  }));
}

// Hace transparentes los píxeles blancos de una <img> ya en base64 (sin taint),
// para replicar el mix-blend-mode que html2canvas no soporta en la descarga.
function _gtQuitarFondo(imgEl){
  return new Promise(function(resolve){
    var src=imgEl?imgEl.src:"";
    if(!src || src.indexOf("data:")!==0){ resolve(); return; } // solo base64 local (sin cross-origin taint)
    var im=new Image();
    im.onload=function(){
      try{
        var cv=document.createElement("canvas"); cv.width=im.naturalWidth; cv.height=im.naturalHeight;
        if(!cv.width||!cv.height){ resolve(); return; }
        var ctx=cv.getContext("2d"); ctx.drawImage(im,0,0);
        var dt=ctx.getImageData(0,0,cv.width,cv.height); var d=dt.data;
        for(var i=0;i<d.length;i+=4){ if(d[i]>236 && d[i+1]>236 && d[i+2]>236) d[i+3]=0; }
        ctx.putImageData(dt,0,0);
        imgEl.src=cv.toDataURL("image/png");
        imgEl.style.mixBlendMode="normal";
      }catch(e){}
      resolve();
    };
    im.onerror=function(){ resolve(); };
    im.src=src;
  });
}

function _gtDescargar(){
  var card=document.getElementById("gtCard");
  if(!_gtState.prod||!card){ _gtToastGt("Primero elegí un producto"); return; }
  if(typeof html2canvas==="undefined"){ _gtToastGt("Cargando… reintentá en un momento"); return; }
  _gtToastGt("Generando imagen…");
  // Guardar srcs originales para restaurar el preview luego de la captura
  var imgs=Array.prototype.slice.call(card.querySelectorAll("img"));
  var orig=imgs.map(function(im){ return {el:im, src:im.src, mbm:im.style.mixBlendMode}; });
  function restaurar(){ orig.forEach(function(o){ o.el.src=o.src; o.el.style.mixBlendMode=o.mbm||""; }); }
  // 1) Precargar TODAS las imágenes a base64 (notas + foto), como hace el catálogo para el PDF
  var precarga=_gtPrecargarImgs(card);
  precarga.then(function(){
    // 2) Quitar el fondo blanco de la foto del perfume (ahora ya es base64, sin taint)
    var foto=card.querySelector(".gt-photo img");
    return foto?_gtQuitarFondo(foto):Promise.resolve();
  }).then(function(){
    // 3) Capturar en alta resolución (~1080px para Instagram)
    var _gtSc=Math.max(2,1080/(card.offsetWidth||360));
    return _libsPdf().then(function(){ return html2canvas(card,{backgroundColor:null,scale:_gtSc,useCORS:true,allowTaint:false,logging:false}); });
  }).then(function(canvas){
    var url=canvas.toDataURL("image/png");
    var a=document.createElement("a");
    a.href=url;
    a.download="tarjeta_"+String(_gtProdNombre(_gtState.prod)).replace(/[^a-z0-9]+/gi,"_").toLowerCase()+".png";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    restaurar();
    _gtToastGt("¡Listo! Se descargó tu tarjeta");
  }).catch(function(e){ restaurar(); _gtToastGt("No se pudo generar. Reintentá."); });
}
function _gtToastGt(m){ var el=document.getElementById("gtMsg"); if(el){ el.textContent=m; } }

// ── Guardar / cargar prefs en Supabase ──
function _gtGuardarPrefs(){
  if(typeof _catCliente==="undefined"||!_catCliente||!_catCliente.id){ _gtToastGt("Iniciá sesión para guardar tu formato"); return; }
  var prefs={fmt:_gtState.fmt,prop:_gtState.prop,color:_gtState.color,fotos:_gtState.fotos,negocio:_gtState.negocio,tel:_gtState.tel,nMode:_gtState.nMode,nTexto:_gtState.nTexto,nFmt:_gtState.nFmt,aMode:_gtState.aMode,aTexto:_gtState.aTexto,aFmt:_gtState.aFmt};
  _gtToastGt("Guardando…");
  apiPatch("clientes",{card_prefs:prefs},"id=eq."+_catCliente.id).then(function(){
    if(_catCliente) _catCliente.card_prefs=prefs;
    _gtToastGt("✓ Guardado. La próxima vez ya vas a tener tu formato.");
  }).catch(function(){ _gtToastGt("No se pudo guardar. Reintentá."); });
}
function _gtCargarPrefs(){
  try{
    var p=(_catCliente&&_catCliente.card_prefs)?_catCliente.card_prefs:null;
    if(!p)return;
    if(typeof p==="string"){ try{p=JSON.parse(p);}catch(e){p=null;} }
    if(!p)return;
    ["fmt","prop","color","fotos","negocio","tel","nMode","nTexto","nFmt","aMode","aTexto","aFmt"].forEach(function(k){ if(p[k]!==undefined) _gtState[k]=p[k]; });
  }catch(e){}
}

// ── Abrir / cerrar ──
function abrirGenTarjeta(){
  var ov=document.getElementById("genTarjetaOverlay");
  if(!ov)return;
  _gtCargarPrefs();
  _gtRendered=true;
  _gtState.tipo=null;
  _gtRender();
  if(typeof syncNotasFotosDesdeSupabase==="function"){ try{ syncNotasFotosDesdeSupabase(function(){ _gtRefreshCard(); }); }catch(e){} }
  _gtScrollY=window.pageYOffset||document.documentElement.scrollTop||0;
  ov.scrollTop=0;
  ov.classList.add("gt-open");
  document.documentElement.style.overflow="hidden";
  document.body.style.overflow="hidden";
  if(typeof _catModalBackRegistrar==="function"){ try{ _catModalBackRegistrar("genTarjetaOverlay", cerrarGenTarjeta); }catch(e){} }
}
function cerrarGenTarjeta(){
  var ov=document.getElementById("genTarjetaOverlay");
  if(ov)ov.classList.remove("gt-open");
  document.documentElement.style.overflow="";
  document.body.style.overflow="";
  try{ window.scrollTo(0,_gtScrollY); }catch(e){}
}
// ═══════════════ ACADEMIA BELLE ═══════════════
var _acState={sec:"hub", prod:null};
var _acRendered=false, _acScrollY=0;

function _acEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

// Datos de concentraciones (información general de perfumería)
var _AC_CONC=[
  {id:"edc",nom:"Eau de Cologne",sigla:"EDC",pct:"2–5%",dur:"1–2 horas",niv:15,col:"#7ec8e0",desc:"La más ligera y fresca. Ideal para refrescarse en verano o después del gym. Se siente suave y se va rápido."},
  {id:"edt",nom:"Eau de Toilette",sigla:"EDT",pct:"5–15%",dur:"3–5 horas",niv:38,col:"#5aa9d4",desc:"Fresca y versátil, perfecta para el día y el trabajo. Es la concentración más común y fácil de llevar."},
  {id:"edp",nom:"Eau de Parfum",sigla:"EDP",pct:"15–20%",dur:"5–8 horas",niv:62,col:"#c4965a",desc:"Más intensa y duradera. El equilibrio ideal entre proyección y elegancia. La favorita de la mayoría."},
  {id:"parfum",nom:"Parfum / Extrait",sigla:"PARFUM",pct:"20–30%",dur:"8–12 horas",niv:85,col:"#a06a2a",desc:"La más concentrada y lujosa. Pocas gotas rinden todo el día. Muy elegante, íntima y de gran calidad."},
  {id:"elixir",nom:"Elixir",sigla:"ELIXIR",pct:"15–30%",dur:"8–14 horas",niv:96,col:"#7a3a5a",desc:"Versión reforzada y profunda de un perfume. Notas más ricas, oscuras y potentes. Ideal para la noche."}
];

// ── Notas de una fase, desde la ficha del producto ──
function _acFichaDe(p){
  try{
    if(typeof fichaMatchProd==="function" && typeof FICHAS_BELLE!=="undefined") return fichaMatchProd(p.nombre, FICHAS_BELLE, p.id);
  }catch(e){}
  return null;
}
function _acNotasFase(str){
  var out=[];
  String(str||"").split(",").forEach(function(n){ n=n.trim(); if(n) out.push(n); });
  return out.slice(0,6);
}
function _acNotaFotoTag(n){
  var url=(typeof getNotaFoto==="function")?getNotaFoto(n):"";
  return "<img loading=lazy decoding=async class='ac-nimg' src=\""+url+"\" alt='' onerror=\"this.onerror=null;this.src=NOTAS_FOTOS['_default']\">";
}

// ═══════════════ RENDER PRINCIPAL ═══════════════
function _acRender(){
  var ov=document.getElementById("academiaOverlay"); if(!ov) return;
  var h="<button class='ac-back' onclick='cerrarAcademia()'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M15 18l-6-6 6-6'/></svg> Volver al catálogo</button>";
  if(typeof _catCliente==="undefined" || !_catCliente){
    h+=_acGate();
  } else if(_acState.sec==="hub"){
    h+=_acHub();
  } else if(_acState.sec==="timeline"){
    h+=_acTimeline();
  } else if(_acState.sec==="conc"){
    h+=_acConc();
  } else if(_acState.sec==="notas"){
    h+=_acNotas();
  } else if(_acState.sec==="familias"){
    h+=_acFamilias();
  } else if(_acState.sec==="tips"){
    h+=_acTips();
  } else if(_acState.sec==="cursos"){
    h+=_acCursos();
  } else {
    h+=_acProximamente();
  }
  ov.innerHTML=h;
  _acAnimIn();
}

// ── Gate: pide iniciar sesión ──
function _acGate(){
  return "<div class='ac-gate'>"+
    "<div class='ac-gate-icon'>&#128274;</div>"+
    "<h2>Academia Belle</h2>"+
    "<p>Un museo y escuela del mundo de los perfumes, exclusivo para nuestra comunidad.</p>"+
    "<p class='ac-gate-sub'>Iniciá sesión para entrar.</p>"+
    "<button class='ac-btn' onclick='cerrarAcademia(); if(typeof toggleMiCuenta===\"function\") toggleMiCuenta();'>Iniciar sesión</button>"+
  "</div>";
}
function _acProximamente(){
  return "<div class='ac-wrap'><div class='ac-gate'><div class='ac-gate-icon'>&#10024;</div><h2>Muy pronto</h2><p>Esta sala de la Academia está en construcción. ¡Volvé pronto!</p><button class='ac-btn' onclick='_acIr(\"hub\")'>Volver al inicio</button></div></div>";
}

// ── HALL: portada + salas ──
function _acIcon(id){
  var p={
    timeline:"<circle cx='12' cy='12' r='9'/><path d='M12 7.5V12l3 2'/>",
    conc:"<path d='M12 3.5c3 3.8 5.5 6.6 5.5 9.5a5.5 5.5 0 0 1-11 0c0-2.9 2.5-5.7 5.5-9.5z'/>",
    notas:"<path d='M12 21V11'/><path d='M12 11c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z'/><path d='M12 13c0-2.7-2-4.5-4.8-4.5C7.2 11.2 9.2 13 12 13z'/>",
    familias:"<circle cx='12' cy='12' r='8.5'/><path d='M12 3.5v17M3.5 12h17M6 6l12 12M18 6L6 18'/>",
    tips:"<path d='M9.5 18.5h5M10.5 21.5h3'/><path d='M12 2.5a6 6 0 0 0-3.7 10.7c.7.6 1.2 1.4 1.2 2.3h5c0-.9.5-1.7 1.2-2.3A6 6 0 0 0 12 2.5z'/>",
    cursos:"<path d='M12 4L2.5 8.5 12 13l9.5-4.5L12 4z'/><path d='M6 10.5v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5'/>"
  }[id]||"";
  return "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'>"+p+"</svg>";
}
function _acTilt(e,el){
  if(el.classList.contains('ac-card-soon'))return;
  var r=el.getBoundingClientRect();
  var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
  el.style.transform="perspective(950px) rotateX("+((py-.5)*-7).toFixed(2)+"deg) rotateY("+((px-.5)*9).toFixed(2)+"deg) translateY(-6px)";
  el.style.setProperty("--mx",(px*100).toFixed(1)+"%");
  el.style.setProperty("--my",(py*100).toFixed(1)+"%");
}
function _acUntilt(el){ el.style.transform=""; el.style.removeProperty("--mx"); el.style.removeProperty("--my"); }
function _acHub(){
  var salas=[
    {id:"timeline",num:"I",t:"Cómo huele con las horas",d:"Viví la evolución de un perfume: salida, corazón y fondo.",acc:"#e0a53f",bg:"#fdf3e2",tx:"#a56f1e"},
    {id:"conc",num:"II",t:"Las concentraciones",d:"EDT, EDP, Parfum, Elixir: qué significan y cuál te conviene.",acc:"#4aa3d4",bg:"#eaf5fb",tx:"#2b6d97"},
    {id:"notas",num:"III",t:"Enciclopedia de notas",d:"Cada nota, su historia, a qué huele y en qué perfumes está.",acc:"#5fa864",bg:"#edf6ec",tx:"#3a7a3f"},
    {id:"familias",num:"IV",t:"Familias olfativas",d:"Amaderados, orientales, cítricos, florales: tu mapa del olfato.",acc:"#9b7ad4",bg:"#f2edfa",tx:"#6b4ba3"},
    {id:"tips",num:"V",t:"Tips de perfumería",d:"Cómo macerar, conservar y hacer que dure. Secretos que venden.",acc:"#e0798f",bg:"#fdeef1",tx:"#b24c62"},
    {id:"cursos",num:"VI",t:"Mini-cursos",d:"Cómo elegir tu perfume, cómo revender y mucho más.",acc:"#3fb0a3",bg:"#e9f7f4",tx:"#237a70"}
  ];
  var h="<div class='ac-wrap'>";
  h+="<div class='ac-hero'>";
  h+="<div class='ac-hero-glow'></div>";
  h+="<div class='ac-particles'><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>";
  h+="<div class='ac-eyebrow'><span class='ac-eyebrow-line'></span><span class='ac-eyebrow-txt'>MUSEO &amp; ESCUELA DE PERFUMERÍA</span><span class='ac-eyebrow-line'></span></div>";
  h+="<h1 class='ac-hero-title'>Academia Belle</h1>";
  h+="<p class='ac-hero-sub'>Todo lo que siempre quisiste saber sobre el mundo de los perfumes. Interactivo, simple y hecho para vos.</p>";
  h+="<div class='ac-ornament'><span></span><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.3'><path d='M12 4c2 3 4 5 4 8a4 4 0 0 1-8 0c0-3 2-5 4-8z'/></svg><span></span></div>";
  h+="</div>";
  h+="<div class='ac-grid'>";
  salas.forEach(function(s,i){
    var st="animation-delay:"+(i*0.06).toFixed(2)+"s;--acc:"+s.acc+";--accbg:"+s.bg+";--acctx:"+s.tx;
    h+="<button type='button' class='ac-card' style='"+st+"' onmousemove=\"_acTilt(event,this)\" onmouseleave=\"_acUntilt(this)\" onclick=\"_acIr('"+s.id+"')\">"+
      "<span class='ac-card-ghost'>"+s.num+"</span>"+
      "<span class='ac-card-glow'></span>"+
      "<div class='ac-card-in'>"+
        "<div class='ac-card-top'><span class='ac-card-num'>"+s.num+"</span></div>"+
        "<div class='ac-card-ic'>"+_acIcon(s.id)+"</div>"+
        "<div class='ac-card-t'>"+s.t+"</div>"+
        "<div class='ac-card-d'>"+s.d+"</div>"+
        "<div class='ac-card-go'>Entrar <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12h14M13 6l6 6-6 6'/></svg></div>"+
      "</div>"+
    "</button>";
  });
  h+="</div></div>";
  return h;
}

// ═══════════════ SALA 1: TIMELINE ═══════════════
function _acTimeline(){
  var h="<div class='ac-wrap'>";
  h+=_acHead("Cómo huele con las horas","Un perfume no huele igual todo el día: cambia. Elegí uno y viví su evolución en tres momentos.");
  h+="<div class='ac-search-box'><input id='acSearch' class='ac-input' type='text' placeholder='Buscá un perfume…' autocomplete='off' oninput='_acBuscar(this.value)'><div id='acResults' class='ac-results'></div></div>";
  h+="<div id='acTL'>"+_acTLContenido()+"</div>";
  h+="</div>";
  return h;
}
function _acTLContenido(){
  var p=_acState.prod;
  if(!p) return "<div class='ac-empty'>&#9757; Elegí un perfume arriba para ver su evolución</div>";
  var f=_acFichaDe(p);
  var fases=[
    {k:"salida",t:"Salida",tiempo:"Primeros minutos",ic:"&#9728;",col:"#e8b84a",txt:"Es la primera impresión: lo que sentís apenas te lo ponés. Suele ser fresca y vibrante, pero dura poco.",notas:_acNotasFase(f&&f.notas_salida)},
    {k:"corazon",t:"Corazón",tiempo:"De 15 min a 2 horas",ic:"&#10084;",col:"#d4589a",txt:"El alma del perfume. Aparece cuando la salida se calma y define su verdadero carácter.",notas:_acNotasFase(f&&f.notas_corazon)},
    {k:"fondo",t:"Fondo",tiempo:"De 2 horas en adelante",ic:"&#127807;",col:"#a06a2a",txt:"Lo que queda en tu piel y tu ropa por horas. Las notas más profundas y duraderas: la huella que dejás.",notas:_acNotasFase(f&&f.notas_fondo)}
  ];
  var hayNotas=fases.some(function(x){return x.notas.length;});
  var h="<div class='ac-tl-prod'>"+(p.imagen_url?"<img loading=lazy decoding=async src='"+_acEsc(p.imagen_url)+"' alt='' onerror=\"this.style.display='none'\">":"")+"<div><div class='ac-tl-prodname'>"+_acEsc(_prodMl(p.nombre||"",p.ml))+"</div>"+(f&&f.familia_olfativa?"<div class='ac-tl-fam'>"+_acEsc(f.familia_olfativa)+"</div>":"")+"</div></div>";
  if(!hayNotas){ h+="<div class='ac-empty'>Todavía no tenemos cargada la pirámide de notas de este perfume. Probá con otro.</div>"; return h; }
  // barra de progreso
  h+="<div class='ac-tl-bar'><div class='ac-tl-fill'></div><div class='ac-tl-dot' style='left:8%'></div><div class='ac-tl-dot' style='left:45%'></div><div class='ac-tl-dot' style='left:88%'></div></div>";
  h+="<div class='ac-tl-fases'>";
  fases.forEach(function(fa,i){
    h+="<div class='ac-fase' style='animation-delay:"+(i*0.15)+"s'>"+
      "<div class='ac-fase-head'><span class='ac-fase-ic' style='background:"+fa.col+"22;color:"+fa.col+"'>"+fa.ic+"</span><div><div class='ac-fase-t'>"+fa.t+"</div><div class='ac-fase-time'>"+fa.tiempo+"</div></div></div>"+
      "<div class='ac-fase-txt'>"+fa.txt+"</div>"+
      "<div class='ac-fase-notas'>"+(fa.notas.length?fa.notas.map(function(n){return "<div class='ac-nota'>"+_acNotaFotoTag(n)+"<span>"+_acEsc(n)+"</span></div>";}).join(""):"<span class='ac-fase-sinnotas'>—</span>")+"</div>"+
    "</div>";
    if(i<fases.length-1) h+="<div class='ac-fase-arrow'>&#8595;</div>";
  });
  h+="</div>";
  return h;
}
function _acBuscar(q){
  var box=document.getElementById("acResults"); if(!box)return;
  q=String(q||"").trim().toLowerCase();
  if(q.length<2){ box.innerHTML=""; box.style.display="none"; return; }
  var prods=(typeof allProds!=="undefined")?allProds:[];
  var res=prods.filter(function(p){
    if(p.oculto||p.activo===false) return false;
    return String(p.nombre||"").toLowerCase().indexOf(q)>=0 || String(p.empresa||"").toLowerCase().indexOf(q)>=0;
  }).slice(0,8);
  if(!res.length){ box.innerHTML="<div class='ac-nores'>Sin resultados</div>"; box.style.display="block"; return; }
  box.innerHTML=res.map(function(p){ return "<div class='ac-res' onclick='_acElegir("+p.id+")'>"+_acEsc(_prodMl(p.nombre||"",p.ml))+"</div>"; }).join("");
  box.style.display="block";
}
function _acElegir(id){
  var prods=(typeof allProds!=="undefined")?allProds:[];
  var p=prods.filter(function(x){return x.id==id;})[0]; if(!p)return;
  _acState.prod=p;
  var box=document.getElementById("acResults"); if(box){box.innerHTML="";box.style.display="none";}
  var si=document.getElementById("acSearch"); if(si) si.value="";
  var tl=document.getElementById("acTL"); if(tl){ tl.innerHTML=_acTLContenido(); _acAnimIn(); }
  if(typeof syncNotasFotosDesdeSupabase==="function"){ try{ syncNotasFotosDesdeSupabase(function(){ var t=document.getElementById("acTL"); if(t) t.innerHTML=_acTLContenido(); }); }catch(e){} }
}

// ═══════════════ SALA 2: CONCENTRACIONES ═══════════════
function _acConc(){
  var h="<div class='ac-wrap'>";
  h+=_acHead("Las concentraciones","¿Por qué el mismo perfume viene en EDT, EDP o Elixir? La diferencia es cuánta esencia lleva: más esencia = más intenso y más duradero. Tocá cada uno.");
  h+="<div class='ac-conc-graf'>";
  _AC_CONC.forEach(function(c,i){
    h+="<div class='ac-conc-col' onclick='_acConcSel(\""+c.id+"\")' data-c='"+c.id+"'>"+
      "<div class='ac-conc-bar'><div class='ac-conc-fill' style='height:"+c.niv+"%;background:"+c.col+"'></div></div>"+
      "<div class='ac-conc-sig'>"+c.sigla+"</div>"+
    "</div>";
  });
  h+="</div>";
  h+="<div id='acConcInfo' class='ac-conc-info'>"+_acConcInfoHTML(_AC_CONC[2])+"</div>";
  h+="</div>";
  return h;
}
function _acConcInfoHTML(c){
  return "<div class='ac-conc-card' style='border-color:"+c.col+"55'>"+
    "<div class='ac-conc-nom' style='color:"+c.col+"'>"+c.nom+"</div>"+
    "<div class='ac-conc-stats'>"+
      "<div class='ac-conc-stat'><span>Esencia</span><b>"+c.pct+"</b></div>"+
      "<div class='ac-conc-stat'><span>Dura</span><b>"+c.dur+"</b></div>"+
    "</div>"+
    "<div class='ac-conc-desc'>"+c.desc+"</div>"+
  "</div>";
}
function _acConcSel(id){
  var c=_AC_CONC.filter(function(x){return x.id===id;})[0]; if(!c)return;
  var box=document.getElementById("acConcInfo"); if(box){ box.innerHTML=_acConcInfoHTML(c); box.classList.remove("ac-pop"); void box.offsetWidth; box.classList.add("ac-pop"); }
  document.querySelectorAll(".ac-conc-col").forEach(function(el){ el.classList.toggle("sel", el.dataset.c===id); });
}

// ── Helpers de UI ──
function _acHead(t,sub){
  return "<div class='ac-head'><h2>"+t+"</h2><p>"+sub+"</p><button class='ac-mini-back' onclick='_acIr(\"hub\")'>&#8592; Todas las salas</button></div>";
}
function _acAnimIn(){
  try{
    var ov=document.getElementById("academiaOverlay");
    var els=ov.querySelectorAll(".ac-anim"); els.forEach(function(e){ e.classList.remove("ac-in"); void e.offsetWidth; e.classList.add("ac-in"); });
  }catch(e){}
}

// ── Navegación ──
function _acIr(sec){ _acState.sec=sec; if(sec!=="timeline"){} _acRender(); document.getElementById("academiaOverlay").scrollTop=0; }
function abrirAcademia(){
  var ov=document.getElementById("academiaOverlay"); if(!ov)return;
  _acState.sec="hub";
  _acRender();
  _acScrollY=window.pageYOffset||document.documentElement.scrollTop||0;
  ov.scrollTop=0;
  ov.classList.add("ac-open");
  document.documentElement.style.overflow="hidden";
  document.body.style.overflow="hidden";
  if(typeof syncNotasFotosDesdeSupabase==="function"){ try{ syncNotasFotosDesdeSupabase(function(){}); }catch(e){} }
  if(typeof _catModalBackRegistrar==="function"){ try{ _catModalBackRegistrar("academiaOverlay", cerrarAcademia); }catch(e){} }
}
function cerrarAcademia(){
  var ov=document.getElementById("academiaOverlay"); if(ov)ov.classList.remove("ac-open");
  document.documentElement.style.overflow="";
  document.body.style.overflow="";
  try{ window.scrollTo(0,_acScrollY); }catch(e){}
}
// ═══════════════ SALAS 3-6 ═══════════════
function _acNorm(s){return String(s==null?"":s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function _acCap(s){s=String(s||"");return s.charAt(0).toUpperCase()+s.slice(1);}
function _acVerProd(id){ cerrarAcademia(); try{ if(typeof verFichaBelle==="function") verFichaBelle(id); }catch(e){} }

// ── Datos: Enciclopedia de notas ──
var _AC_NOTA_INFO={
  "oud":{fam:"Amaderado oriental",desc:"Resina profunda del árbol de agar. Ahumada, animálica y lujosa: el oro de la perfumería árabe."},
  "ámbar":{fam:"Oriental cálido",desc:"Nota dulce, resinosa y envolvente. Da calidez y sensación de piel abrigada."},
  "vainilla":{fam:"Gourmand dulce",desc:"Cremosa, cálida y reconfortante. La nota dulce más querida del mundo."},
  "rosa":{fam:"Floral",desc:"La reina de las flores. Puede ser fresca y luminosa o profunda y aterciopelada."},
  "jazmín":{fam:"Floral blanco",desc:"Flor blanca intensa, sensual y algo narcótica. Da sofisticación y romance."},
  "bergamota":{fam:"Cítrico",desc:"Cítrico verde y elegante. La chispa fresca con la que abren miles de perfumes."},
  "sándalo":{fam:"Amaderado cremoso",desc:"Madera suave, lechosa y cálida. Base sedosa y muy elegante."},
  "pachulí":{fam:"Amaderado terroso",desc:"Terroso, húmedo y algo achocolatado. Da profundidad y carácter retro."},
  "almizcle":{fam:"Almizclado",desc:"Suave, limpio y sensual, como piel recién lavada. El pegamento invisible de un perfume."},
  "cardamomo":{fam:"Especiado",desc:"Especia fresca y aromática, un poco alcanforada. Da un toque exótico y elegante."},
  "canela":{fam:"Especiado cálido",desc:"Especia dulce y ardiente. Perfecta para perfumes de invierno."},
  "azafrán":{fam:"Especiado",desc:"Especia rojiza, entre cuero y flor. Marca registrada de los perfumes árabes."},
  "vetiver":{fam:"Amaderado terroso",desc:"Raíz verde, ahumada y terrosa. Fresca y elegante a la vez."},
  "cuero":{fam:"Cuero",desc:"Nota seca y animal que evoca cuero fino. Da fuerza y sofisticación."},
  "praliné":{fam:"Gourmand",desc:"Almendras caramelizadas: dulce, tostado y adictivo."},
  "haba tonka":{fam:"Gourmand",desc:"Entre vainilla, almendra y heno dulce. Cálida y envolvente."},
  "lavanda":{fam:"Aromático",desc:"Herbal, limpia y relajante. Clásico de la perfumería masculina."},
  "cedro":{fam:"Amaderado",desc:"Madera seca tipo lápiz. Aporta estructura y limpieza."},
  "piña":{fam:"Frutal",desc:"Fruta jugosa y solar. Alegre, tropical y muy usada en los frescos."},
  "manzana":{fam:"Frutal",desc:"Fruta crujiente y luminosa, verde o dulce según el perfume."},
  "frambuesa":{fam:"Frutal rojo",desc:"Fruta roja dulce y ácida. Coqueta y muy femenina."},
  "pimienta rosa":{fam:"Especiado suave",desc:"Especia chispeante y rosada. Da vida y frescura a la apertura."},
  "incienso":{fam:"Resinoso",desc:"Humo sagrado y resinoso. Místico, elegante y algo solemne."},
  "coco":{fam:"Tropical",desc:"Cremoso y playero. Evoca protector solar y vacaciones."},
  "café":{fam:"Gourmand",desc:"Tostado, amargo y adictivo. Muy de moda en los orientales dulces."},
  "mandarina":{fam:"Cítrico",desc:"Cítrico dulce y jugoso, más suave que la naranja. Alegre y fácil de llevar."},
  "limón":{fam:"Cítrico",desc:"Cítrico chispeante y limpio. Frescura instantánea."},
  "durazno":{fam:"Frutal",desc:"Fruta aterciopelada y jugosa. Suave, coqueta y luminosa."},
  "iris":{fam:"Floral empolvado",desc:"Elegante, empolvado y algo frío. La nota más chic y aristocrática."},
  "menta":{fam:"Aromático fresco",desc:"Herbal y refrescante. Da un golpe de frescura vibrante."}
};
function _acPerfumesConNota(nota,max){
  var out=[],nn=_acNorm(nota),prods=(typeof allProds!=="undefined")?allProds:[];
  for(var i=0;i<prods.length && out.length<(max||10);i++){
    var p=prods[i]; if(p.oculto||p.activo===false) continue;
    var f=_acFichaDe(p); if(!f) continue;
    var blob=_acNorm((f.notas_salida||"")+" "+(f.notas_corazon||"")+" "+(f.notas_fondo||""));
    if(blob.indexOf(nn)>=0) out.push({id:p.id,nombre:p.nombre});
  }
  return out;
}
var _acNotaActual=null;
function _acNotas(){
  var keys=Object.keys(_AC_NOTA_INFO);
  var h="<div class='ac-wrap'>";
  h+=_acHead("Enciclopedia de notas","Cada perfume es una mezcla de notas. Tocá cualquiera para descubrir a qué huele, de qué familia es y en qué perfumes tuyos la vas a encontrar.");
  h+="<div class='ac-search-box'><input id='acNotaSearch' class='ac-input' type='text' placeholder='Buscá una nota…' autocomplete='off' oninput='_acNotasFiltrar(this.value)'></div>";
  h+="<div id='acNotasGrid' class='ac-notas-grid'>"+_acNotasGridHTML(keys)+"</div>";
  h+="<div id='acNotaDetail' class='ac-nota-detail'></div>";
  h+="</div>";
  return h;
}
function _acNotasGridHTML(keys){
  return keys.map(function(k){
    var url=(typeof getNotaFoto==="function")?getNotaFoto(k):"";
    return "<button type='button' class='ac-nota-item"+(_acNotaActual===k?" sel":"")+"' onclick=\"_acNotaSel('"+k+"')\"><img class='ac-nota-thumb' src=\""+url+"\" alt='' onerror=\"this.onerror=null;this.src=NOTAS_FOTOS['_default']\"><span>"+_acCap(k)+"</span></button>";
  }).join("");
}
function _acNotasFiltrar(q){
  q=_acNorm(q);
  var keys=Object.keys(_AC_NOTA_INFO).filter(function(k){return _acNorm(k).indexOf(q)>=0 || _acNorm(_AC_NOTA_INFO[k].fam).indexOf(q)>=0;});
  var g=document.getElementById("acNotasGrid"); if(g) g.innerHTML=keys.length?_acNotasGridHTML(keys):"<div class='ac-empty'>Sin resultados</div>";
}
function _acNotaSel(k){
  _acNotaActual=k;
  var info=_AC_NOTA_INFO[k]||{fam:"",desc:""};
  var url=(typeof getNotaFoto==="function")?getNotaFoto(k):"";
  var perf=_acPerfumesConNota(k,10);
  var chips=perf.length?perf.map(function(p){return "<button type='button' class='ac-chip' onclick='_acVerProd("+p.id+")'>"+_acEsc(_prodMl(p.nombre,_mlDe(p.id)))+"</button>";}).join(""):"<span class='ac-fase-sinnotas'>No la encontramos en el catálogo por ahora.</span>";
  var d=document.getElementById("acNotaDetail");
  if(d){
    d.innerHTML="<div class='ac-nd-card'><img loading=lazy decoding=async class='ac-nd-img' src=\""+url+"\" alt='' onerror=\"this.onerror=null;this.src=NOTAS_FOTOS['_default']\"><div class='ac-nd-body'><div class='ac-nd-fam'>"+_acEsc(info.fam)+"</div><h3 class='ac-nd-nom'>"+_acCap(k)+"</h3><p class='ac-nd-desc'>"+_acEsc(info.desc)+"</p><div class='ac-nd-label'>Perfumes con esta nota</div><div class='ac-chips'>"+chips+"</div></div></div>";
    d.classList.remove("ac-pop"); void d.offsetWidth; d.classList.add("ac-pop");
    try{ d.scrollIntoView({behavior:"smooth",block:"nearest"}); }catch(e){}
  }
  document.querySelectorAll(".ac-nota-item").forEach(function(el){ el.classList.toggle("sel", el.querySelector("span") && _acNorm(el.querySelector("span").textContent)===_acNorm(k)); });
}

// ── Datos: Familias olfativas ──
var _AC_FAMILIAS=[
  {id:"citricos",nom:"Cítricos",col:"#e8c34a",desc:"Frescos, chispeantes y luminosos. Perfectos para el día y el calor. Son los más fáciles de llevar.",notas:"Bergamota, limón, naranja, pomelo, mandarina",match:["citric","cítric"]},
  {id:"florales",nom:"Florales",col:"#e88fb0",desc:"El corazón romántico de la perfumería. De un ramo alegre a una flor sensual y profunda.",notas:"Rosa, jazmín, azahar, peonía, nardos",match:["floral"]},
  {id:"amaderados",nom:"Amaderados",col:"#b5834a",desc:"Cálidos, secos y elegantes. Dan estructura y sofisticación. Muy versátiles y unisex.",notas:"Sándalo, cedro, vetiver, oud",match:["amaderad","madera","wood"]},
  {id:"orientales",nom:"Orientales / Ámbar",col:"#d68a3a",desc:"Ricos, especiados y envolventes. El sello de los perfumes árabes: cálidos y magnéticos.",notas:"Ámbar, incienso, especias, resinas",match:["oriental","ambar","ámbar","amber","especiad"]},
  {id:"frescos",nom:"Frescos / Acuáticos",col:"#5ab4d4",desc:"Limpios, marinos y aireados. Evocan brisa, mar y ropa recién lavada. Ideales para el verano.",notas:"Notas marinas, menta, acuáticas, verdes",match:["acuatic","acuátic","fresc","marin","aromatic","aromátic"]},
  {id:"gourmand",nom:"Gourmand / Dulces",col:"#c97a4a",desc:"Deliciosos y comestibles: vainilla, caramelo, café, chocolate. Golosos y adictivos.",notas:"Vainilla, praliné, caramelo, café",match:["gourmand","dulce","vainilla"]},
  {id:"frutales",nom:"Frutales",col:"#e07a6a",desc:"Jugosos y alegres. Frutas rojas, tropicales o de huerta que aportan diversión y color.",notas:"Piña, frambuesa, durazno, manzana",match:["frutal","frutas","tropical"]},
  {id:"cuero",nom:"Cuero & Chipre",col:"#8a7150",desc:"Secos, nobles y con carácter. Cuero, musgo y pachulí para una elegancia atemporal.",notas:"Cuero, musgo de roble, pachulí",match:["cuero","chipre","chypre"]}
];
function _acFamStats(fam){
  var fb=(typeof FICHAS_BELLE!=="undefined")?FICHAS_BELLE:[],cnt=0,ej=[];
  for(var i=0;i<fb.length;i++){
    var fo=_acNorm(fb[i].familia_olfativa); if(!fo) continue;
    var hit=fam.match.some(function(m){return fo.indexOf(_acNorm(m))>=0;});
    if(hit){ cnt++; if(ej.length<6 && fb[i].nombre_completo) ej.push(fb[i].nombre_completo.split("|")[0].trim()); }
  }
  return {cnt:cnt,ej:ej};
}
var _acFamActual=null;
function _acFamilias(){
  var h="<div class='ac-wrap'>";
  h+=_acHead("Familias olfativas","Todos los perfumes se agrupan en grandes familias según cómo huelen. Este es tu mapa: tocá una familia para conocerla.");
  h+="<div class='ac-fam-grid'>";
  _AC_FAMILIAS.forEach(function(f){
    h+="<button type='button' class='ac-fam-gem' data-f='"+f.id+"' style='--fc:"+f.col+"' onclick=\"_acFamSel('"+f.id+"')\"><span class='ac-fam-dot'></span><span class='ac-fam-nom'>"+f.nom+"</span></button>";
  });
  h+="</div>";
  h+="<div id='acFamDetail' class='ac-fam-detail'></div>";
  h+="</div>";
  return h;
}
function _acFamSel(id){
  var f=_AC_FAMILIAS.filter(function(x){return x.id===id;})[0]; if(!f)return;
  _acFamActual=id;
  var st=_acFamStats(f);
  var ejHTML=st.ej.length?("<div class='ac-nd-label'>Algunos ejemplos en Belle</div><div class='ac-chips'>"+st.ej.map(function(n){return "<span class='ac-chip ac-chip-plain'>"+_acEsc(n)+"</span>";}).join("")+"</div>"):"";
  var d=document.getElementById("acFamDetail");
  if(d){
    d.innerHTML="<div class='ac-fam-card' style='--fc:"+f.col+"'><div class='ac-fam-cardhead'><span class='ac-fam-bigdot'></span><h3>"+f.nom+"</h3></div><p class='ac-fam-desc'>"+_acEsc(f.desc)+"</p><div class='ac-fam-row'><div class='ac-fam-mini'><span>Notas típicas</span><b>"+_acEsc(f.notas)+"</b></div><div class='ac-fam-mini'><span>En el catálogo</span><b>"+st.cnt+" perfume"+(st.cnt===1?"":"s")+"</b></div></div>"+ejHTML+"</div>";
    d.classList.remove("ac-pop"); void d.offsetWidth; d.classList.add("ac-pop");
    try{ d.scrollIntoView({behavior:"smooth",block:"nearest"}); }catch(e){}
  }
  document.querySelectorAll(".ac-fam-gem").forEach(function(el){ el.classList.toggle("sel", el.dataset.f===id); });
}

// ── Datos: Tips de perfumería ──
var _AC_TIPS=[
  {t:"Cómo macerar un perfume",b:"Macerar es dejar reposar el perfume unas semanas antes de usarlo intensamente. Muchos árabes (Lattafa, Armaf, Rasasi) abren un poco \"ásperos\" y, con 3 a 8 semanas guardados en un lugar oscuro y fresco, se vuelven más redondos, dulces y duraderos. Consejo de venta: si un cliente dice que \"no le duró\", puede ser cuestión de maceración."},
  {t:"Cómo conservarlo",b:"El enemigo del perfume son la luz, el calor y los cambios de temperatura. Guardalos en su caja, lejos del sol y del baño (la humedad y el vapor los arruinan). Bien conservado, un perfume dura años. Nunca lo dejes en el auto."},
  {t:"Cómo hacer que dure más en la piel",b:"1) Aplicá sobre piel hidratada (una crema neutra antes ayuda a \"agarrar\" el aroma). 2) Rociá en puntos de pulso: cuello, detrás de las orejas, muñecas y pecho. 3) No lo frotes: apretar las muñecas rompe las notas. 4) Perfumá también la ropa y el pelo, donde dura muchísimo más."},
  {t:"Dónde aplicarlo",b:"Los puntos de calor proyectan mejor: cuello, nuca, escote, muñecas y el interior de los codos. Un truco elegante: rociar una nube en el aire y caminar a través de ella para un velo parejo."},
  {t:"Hacer capas (layering)",b:"Combinar dos perfumes crea algo único. Reglas simples: sumá un dulce (vainilla, ámbar) sobre un fresco para darle cuerpo, o una rosa sobre un oud para suavizarlo. Empezá con el más pesado en la piel y el más liviano encima."},
  {t:"Cómo explicar las notas para vender",b:"No recites ingredientes: contá una historia. En vez de \"tiene bergamota y ámbar\", decí \"abre fresco y termina cálido y abrazador, ideal para la noche\". Asociá el perfume a un momento (una cita, la oficina, el verano) y a un original conocido (\"es el estilo de…\"). Eso vende."}
];
var _acTipOpen=-1;
function _acTips(){
  var h="<div class='ac-wrap'>";
  h+=_acHead("Tips de perfumería","Los secretos que convierten a un vendedor en un experto. Tocá cada tip para desplegarlo.");
  h+="<div class='ac-tips-list'>";
  _AC_TIPS.forEach(function(tp,i){
    h+="<div class='ac-tip' id='acTip"+i+"'>"+
      "<button type='button' class='ac-tip-head' onclick='_acTipTog("+i+")'><span class='ac-tip-n'>"+(i+1)+"</span><span class='ac-tip-t'>"+tp.t+"</span><svg class='ac-tip-chev' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg></button>"+
      "<div class='ac-tip-body'><p>"+tp.b+"</p></div>"+
    "</div>";
  });
  h+="</div></div>";
  return h;
}
function _acTipTog(i){
  var el=document.getElementById("acTip"+i); if(!el)return;
  var open=el.classList.contains("open");
  document.querySelectorAll(".ac-tip.open").forEach(function(x){x.classList.remove("open");});
  if(!open) el.classList.add("open");
}

// ── Datos: Mini-cursos ──
var _AC_CURSOS=[
  {id:"elegir",t:"Cómo elegir tu perfume",sub:"Encontrá el aroma perfecto para vos",lecs:[
    {t:"Pensá en la ocasión",b:"No es lo mismo un perfume para la oficina que para una cita de noche. Los frescos y cítricos son para el día; los dulces, especiados y amaderados brillan de noche y en invierno."},
    {t:"Conocé tu familia favorita",b:"Fijate qué perfumes te gustaron siempre y buscá qué tienen en común. ¿Dulces? ¿Frescos? ¿Amaderados? Esa es tu familia, y es tu mejor guía para no equivocarte."},
    {t:"Probá en la piel, no en el papel",b:"El mismo perfume huele distinto en cada persona. Probalo en tu muñeca y esperá 15-30 minutos: recién ahí aparece el corazón y el fondo, que es lo que vas a oler la mayor parte del día."},
    {t:"Mirá proyección y duración",b:"Si querés que te huelan de lejos, buscá buena proyección. Si preferís algo íntimo, uno más suave. Los EDP y Elixir suelen durar más que los EDT."}
  ]},
  {id:"familias",t:"Entender las familias",sub:"El mapa del mundo de los aromas",lecs:[
    {t:"Las 4 grandes",b:"Casi todo perfume nace de cuatro grandes ramas: Cítricos/Frescos, Florales, Amaderados y Orientales/Dulces. Ubicar un perfume en una de ellas ya te dice mucho de cómo huele."},
    {t:"Cómo se combinan",b:"Las familias se mezclan: un \"floral amaderado\", un \"oriental gourmand\", un \"cítrico aromático\". Ese apellido doble te dice la personalidad exacta del perfume."},
    {t:"Familias por estación",b:"Cítricos y acuáticos para el calor; florales para la primavera; amaderados y orientales para el frío. Un buen vendedor recomienda según la época del año."},
    {t:"Usalo para recomendar",b:"Si a un cliente le gusta un perfume, ofrecele otro de la misma familia. Es la forma más segura de acertar y de sumar ventas."}
  ]},
  {id:"durar",t:"Cómo hacer que dure",sub:"Que no se vaya a los 10 minutos",lecs:[
    {t:"Hidratá la piel",b:"La piel seca \"se come\" el perfume. Aplicá una crema neutra antes: el aroma se agarra mejor y dura más horas."},
    {t:"Puntos de pulso",b:"Cuello, muñecas, detrás de las orejas y el pecho generan calor y difunden el aroma todo el día. Ahí es donde más rinde."},
    {t:"No frotes",b:"Frotar las muñecas rompe las moléculas y acorta la duración. Aplicá y dejá secar solo."},
    {t:"Perfumá la ropa",b:"En la tela el perfume puede durar días. Un toque en la bufanda o el saco (probando que no manche) es un truco infalible."}
  ]},
  {id:"revender",t:"Cómo revender perfumes",sub:"De cliente a negocio propio",lecs:[
    {t:"Conocé tu producto",b:"Aprendé de qué original se inspira cada perfume, cómo huele y para quién es. Un cliente confía en quien sabe explicar lo que vende."},
    {t:"Contá historias, no ingredientes",b:"\"Abre fresco y termina cálido, ideal para la noche\" vende más que una lista de notas. Asociá cada perfume a un momento y a una sensación."},
    {t:"Usá muestras y decants",b:"Ofrecé probar antes de comprar. Un decant de unos ml baja la barrera y engancha: el que prueba, vuelve."},
    {t:"Fidelizá",b:"Anotá qué le gusta a cada cliente y avisale cuando llega algo de su estilo. La recompra es donde está el verdadero negocio."}
  ]}
];
var _acCursoActual=null,_acLecIdx=0;
function _acCursos(){
  var h="<div class='ac-wrap'>";
  h+=_acHead("Mini-cursos","Clases cortas y simples para volverte un experto. Educarte es lo que te da confianza… y la confianza vende.");
  h+="<div id='acCursosBody'>"+_acCursosLista()+"</div>";
  h+="</div>";
  return h;
}
function _acCursosLista(){
  return "<div class='ac-curso-list'>"+_AC_CURSOS.map(function(c,i){
    return "<button type='button' class='ac-curso' style='--acc:"+["#e0a53f","#9b7ad4","#4aa3d4","#3fb0a3"][i%4]+"' onclick=\"_acCursoAbrir('"+c.id+"')\"><div class='ac-curso-badge'>"+(i+1)+"</div><div class='ac-curso-tx'><div class='ac-curso-t'>"+c.t+"</div><div class='ac-curso-sub'>"+c.sub+"</div><div class='ac-curso-meta'>"+c.lecs.length+" lecciones</div></div><svg class='ac-curso-go' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 6l6 6-6 6'/></svg></button>";
  }).join("")+"</div>";
}
function _acCursoAbrir(id){ _acCursoActual=id; _acLecIdx=0; var b=document.getElementById("acCursosBody"); if(b){ b.innerHTML=_acCursoView(); b.firstChild&&b.firstChild.classList&&b.firstChild.classList.add("ac-pop"); } }
function _acCursoCerrar(){ _acCursoActual=null; var b=document.getElementById("acCursosBody"); if(b) b.innerHTML=_acCursosLista(); }
function _acCursoView(){
  var c=_AC_CURSOS.filter(function(x){return x.id===_acCursoActual;})[0]; if(!c) return _acCursosLista();
  var n=c.lecs.length, lec=c.lecs[_acLecIdx];
  var dots=""; for(var i=0;i<n;i++){ dots+="<span class='ac-lec-dot"+(i===_acLecIdx?" on":"")+"'></span>"; }
  var h="<div class='ac-curso-view'>";
  h+="<button type='button' class='ac-mini-back' onclick='_acCursoCerrar()'>&#8592; Todos los cursos</button>";
  h+="<div class='ac-lec-card'><div class='ac-lec-top'><span class='ac-lec-count'>Lección "+(_acLecIdx+1)+" de "+n+"</span><div class='ac-lec-dots'>"+dots+"</div></div>";
  h+="<h3 class='ac-lec-t'>"+_acEsc(lec.t)+"</h3><p class='ac-lec-b'>"+_acEsc(lec.b)+"</p>";
  h+="<div class='ac-lec-nav'>";
  h+="<button type='button' class='ac-lec-btn ghost' "+(_acLecIdx===0?"disabled":"")+" onclick='_acLec(-1)'>Anterior</button>";
  if(_acLecIdx<n-1) h+="<button type='button' class='ac-lec-btn' onclick='_acLec(1)'>Siguiente</button>";
  else h+="<button type='button' class='ac-lec-btn' onclick='_acCursoCerrar()'>Terminar &#10003;</button>";
  h+="</div></div></div>";
  return h;
}
function _acLec(dir){
  var c=_AC_CURSOS.filter(function(x){return x.id===_acCursoActual;})[0]; if(!c)return;
  _acLecIdx=Math.max(0,Math.min(c.lecs.length-1,_acLecIdx+dir));
  var b=document.getElementById("acCursosBody"); if(b){ b.innerHTML=_acCursoView(); var card=b.querySelector(".ac-lec-card"); if(card){ card.classList.remove("ac-pop"); void card.offsetWidth; card.classList.add("ac-pop"); } }
}
function abrirServicios(){
  var ov=document.getElementById("serviciosOverlay");
  if(!ov)return;
  if(!_svRendered){ _svRender(); _svRendered=true; }
  _svScrollY=window.pageYOffset||document.documentElement.scrollTop||0;
  ov.scrollTop=0;
  ov.classList.add("sv-open");
  document.documentElement.style.overflow="hidden";
  document.body.style.overflow="hidden";
  if(typeof _catModalBackRegistrar==="function"){ try{ _catModalBackRegistrar("serviciosOverlay", cerrarServicios); }catch(e){} }
}
function cerrarServicios(){
  var ov=document.getElementById("serviciosOverlay");
  if(ov)ov.classList.remove("sv-open");
  document.documentElement.style.overflow="";
  document.body.style.overflow="";
  try{ window.scrollTo(0,_svScrollY); }catch(e){}
}
function switchTab(tab,el){
  // Marcar que el usuario navegó manualmente — no forzar pestaña de campaña al cargar
  window._catTabManual=true;
  if(!window._bqAplicando){ window._bqTodas=false; window._bqCol=''; }   // reglas del Buscador solo mientras dure su búsqueda
  // 🆕 2026-08: si venías mirando SOLO favoritos, al tocar una pestaña se sale de esa
  // vista (antes quedaba prendida y la pestaña "no volvía": seguía filtrando favoritos).
  if(window._soloFavs){
    window._soloFavs=false;
    var _fb=document.getElementById("favsBanner"); if(_fb) _fb.style.display="none";
    document.body.classList.remove('bmSoloFavs');
    var _lcF=document.getElementById("listContainer"); if(_lcF) _lcF.style.display="";
  }
  curTab=tab;
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("act");});
  el.classList.add("act");
  // FIX 2026-06-18: destacados SOLO en pestañas de producto. En inicio/notas/contacto
  // ocultar y limpiar el contenedor (antes quedaba mostrando los destacados de la pestaña anterior).
  var _destSw=document.getElementById("destacadosContainer");
  if(_destSw){
    if(tab==="inicio"||tab==="notas"||tab==="contacto"){_destSw.style.display="none";_destSw.innerHTML="";}
    else{_destSw.style.display="";}
  }
  var _secSw=document.getElementById("pestanaSeccionesContainer");
  if(_secSw && (tab==="inicio"||tab==="notas"||tab==="contacto")){_secSw.style.display="none";_secSw.innerHTML="";}
  // Carrusel (banner): visible en todas las pestañas, también en el inicio (queda arriba).
  var _carSw=document.getElementById("carousel");
  if(_carSw)_carSw.style.display="";
  // Aplicar tema visual de campaña si la pestaña actual tiene una asociada
  if(typeof _catAplicarTemaCampania === 'function'){
    try { _catAplicarTemaCampania(); } catch(e){}
  }
  // Toggle product list vs contacto page
  var listEl=document.getElementById("listContainer");
  var filtersEl=document.getElementById("catFilters");
  var contactoEl=document.getElementById("contactoPage");
  var homeEl=document.getElementById("homePage");
  var notasEl=document.getElementById("notasPage");
  var madreEl=document.getElementById("madrePage");
  if(madreEl)madreEl.style.display="none"; document.body.classList.remove('madre-on');
  if(tab==="inicio"){
    if(listEl)listEl.style.display="none";
    if(filtersEl)filtersEl.style.display="none";
    if(contactoEl)contactoEl.style.display="none";
    if(notasEl)notasEl.style.display="none";
    // Limpieza completa para que NO quede la campaña/combos de la pestaña anterior colgada bajo el inicio.
    var _csI=document.getElementById("combosSecCat"); if(_csI){_csI.style.display="none";_csI.innerHTML="";}
    document.body.classList.remove('catCampTemaActivo','catFondoActivo');
    var _ctmI=document.getElementById('_catCampTema'); if(_ctmI)_ctmI.textContent='';
    var _cffI=document.getElementById('catFondoFijo'); if(_cffI)_cffI.style.display='none';
    if(homeEl){homeEl.style.display="block";loadHomePage();_homeScrollInicial();}
    if(typeof window._hbArmar==='function'){ try{ window._hbArmar(); }catch(e){} }
    return;
  }
  if(homeEl)homeEl.style.display="none";
  if(tab==="notas"){
    if(listEl)listEl.style.display="none";
    if(filtersEl)filtersEl.style.display="none";
    if(contactoEl)contactoEl.style.display="none";
    // 2026-10-25 (auditoría): los combos de la pestaña anterior quedaban colgados abajo de Notas
    var _csN=document.getElementById("combosSecCat"); if(_csN){_csN.style.display="none";_csN.innerHTML="";}
    if(notasEl){notasEl.style.display="block";loadNotasPage();}
    return;
  }
  // 💐 Pestaña de campaña con plantilla propia (por ahora: 'madre' = cinta en zigzag con animaciones)
  var _campPl=_campConPlantilla(tab);
  if(_campPl){
    if(listEl)listEl.style.display="none";
    if(filtersEl)filtersEl.style.display="none";
    if(contactoEl)contactoEl.style.display="none";
    if(notasEl)notasEl.style.display="none";
    if(_destSw){_destSw.style.display="none";_destSw.innerHTML="";}
    if(_secSw){_secSw.style.display="none";_secSw.innerHTML="";}
    var _csM=document.getElementById("combosSecCat"); if(_csM){_csM.style.display="none";_csM.innerHTML="";}
    var _cbM=document.getElementById("campBannerCat"); if(_cbM)_cbM.style.display="none";
    try{
      var _sP=document.getElementById("srch"); if(_sP){ _sP.value=""; _sP.dispatchEvent(new Event('input',{bubbles:true})); }
      var _bfP=document.getElementById("brandFilter"); if(_bfP)_bfP.value="";
      var _ifP=document.getElementById("inspiradoFilter"); if(_ifP)_ifP.value="";
      genF=""; famF=""; precioF="";
      if(typeof _acordesFiltro!=='undefined') _acordesFiltro=[]; if(typeof _notasFiltro!=='undefined') _notasFiltro=[];
      document.querySelectorAll(".pills .pill").forEach(function(p,i){p.classList.toggle("act",i===0);});
    }catch(e){}
    if(madreEl){madreEl.style.display="block";document.body.classList.add('madre-on');renderMadre(_campPl);}
    try{ window.scrollTo({top:0,behavior:'auto'}); }catch(e){}
    return;
  }
  if(notasEl)notasEl.style.display="none";
  if(listEl)listEl.style.display="";
  if(tab==="contacto"){
    if(listEl)listEl.style.display="none";
    if(filtersEl)filtersEl.style.display="none";
    // 2026-10-25 (auditoría): los combos de la pestaña anterior quedaban colgados abajo de Contacto
    var _csC=document.getElementById("combosSecCat"); if(_csC){_csC.style.display="none";_csC.innerHTML="";}
    if(contactoEl){contactoEl.style.display="block";loadContacto();}
    return;
  } else {
    if(listEl)listEl.style.display="";
    if(filtersEl)filtersEl.style.display="";
    if(contactoEl)contactoEl.style.display="none";
  }
  document.getElementById("srch").value="";
  // FIX 2026-05-18: disparar input para que la X de limpieza se oculte
  try { document.getElementById("srch").dispatchEvent(new Event('input',{bubbles:true})); } catch(e){}
  document.getElementById("brandFilter").value="";
  // ✨ También limpiar y refrescar filtro "Inspirado en…"
  var inspSel=document.getElementById("inspiradoFilter");
  if(inspSel) inspSel.value="";
  genF="";
  document.querySelectorAll(".pills .pill").forEach(function(p,i){p.classList.toggle("act",i===0);});
  fillBrands();
  fillInspirados();
  // Cargar combos siempre (se filtran por pestaña en renderCombosEnCatalogo)
  // 2026-11-05 (rendimiento): los combos ya se cargan al arrancar y el realtime los mantiene al día; antes se volvían a
  // pedir en CADA cambio de pestaña y la lista se dibujaba dos veces (la segunda, medio segundo después, a lo tonto).
  if(window._combosCargados&&Array.isArray(combosPublicos)){ /* nada que pedir */ }
  else apiGet("combos","select=*,combo_items(producto_id,cantidad,producto_nombre,es_decan,precio_ref)&activo=is.true&order=created_at.desc").then(function(d){
    if(Array.isArray(d)){combosPublicos=d;window._combosCargados=true;}
    applyFilters();
  }).catch(function(){applyFilters();});
  renderDestacados(tab);
}
// ═══════════════════ 🔍 INICIO BUSCADOR (PRUEBA) ═══════════════════
// Navega a una pestaña del catálogo desde un recuadro del inicio.
function _bentoTab(slug){
  var el=null;
  document.querySelectorAll('.tab').forEach(function(x){
    var oc=x.getAttribute('onclick')||'';
    if(oc.indexOf("switchTab('"+slug+"'")>=0||oc.indexOf('switchTab("'+slug+'"')>=0) el=x;
  });
  if(!el){ document.querySelectorAll('.tab').forEach(function(x){ if((x.textContent||'').toLowerCase().indexOf(slug.toLowerCase())>=0) el=x; }); }
  if(el){ try{ switchTab(slug,el); }catch(e){ el.click(); } }
  _homeScrollADestacados();
}
// Deja la vista donde empiezan los paneles de destacados (no arriba del todo).
function _homeScrollADestacados(){
  function ir(){
    var dc=document.getElementById('destacadosContainer');
    var lc=document.getElementById('listContainer');
    var target=(dc && dc.offsetHeight>0)?dc:lc;
    if(!target){ try{window.scrollTo({top:0,behavior:'smooth'});}catch(e){} return; }
    var off=0;
    var hd=document.querySelector('header'); if(hd)off+=hd.offsetHeight;
    var tb=document.querySelector('.tabs'); if(tb)off+=tb.offsetHeight;
    var ft=document.getElementById('catFilters'); if(ft && getComputedStyle(ft).display!=='none')off+=ft.offsetHeight;
    var top=target.getBoundingClientRect().top+window.pageYOffset-off-6;
    try{ window.scrollTo({top:Math.max(0,top),behavior:'smooth'}); }catch(e){ window.scrollTo(0,Math.max(0,top)); }
  }
  setTimeout(ir,120); setTimeout(ir,450);
}
// En el inicio: deja la vista arrancando en las pestañas + la pregunta, con el carrusel
// arriba (fuera de la vista). Si el usuario sube, ve el carrusel como en las demás pestañas.
function _homeScrollInicial(){
  function ir(){
    if(curTab!=="inicio")return;
    var car=document.getElementById('carousel');
    // Con la portada con foto (sin carrusel) el inicio arranca arriba de todo. Antes acá no se hacía
    // nada y la página quedaba scrolleada donde estaba en la pestaña anterior: como el inicio es
    // más corto, se veía el final (o nada) y parecía "en blanco".
    if(!car || getComputedStyle(car).display==='none' || car.offsetHeight<=0){ try{ window.scrollTo({top:0,behavior:'auto'}); }catch(e){ window.scrollTo(0,0); } return; }
    var tabs=document.getElementById('tabsContainer');
    var hd=document.querySelector('header'); var hh=hd?hd.offsetHeight:64;
    var y = tabs ? (tabs.getBoundingClientRect().top+window.pageYOffset-hh) : car.offsetHeight;
    try{ window.scrollTo({top:Math.max(0,y),behavior:'auto'}); }catch(e){ window.scrollTo(0,Math.max(0,y)); }
  }
  ir(); setTimeout(ir,60); setTimeout(ir,260);
}
// Abre los filtros del catálogo (como en mobile).
function _homeAbrirFiltros(){
  _bentoTab('arabes');
  setTimeout(function(){
    var btn=document.getElementById('btnFiltrosMobile');
    var esMobile=btn && getComputedStyle(btn).display!=='none';
    var c=document.getElementById('filtrosColapsables');
    if(esMobile && c && !c.classList.contains('expandido') && typeof toggleFiltrosMobile==='function'){ toggleFiltrosMobile(); }
    try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){}
  },90);
}
// Búsqueda en vivo dentro del inicio: compacta y muestra los productos que coinciden.
function _homeBuscar(q){
  q=(q||'').trim();
  var buscando=q.length>0;
  ['hbTitle','hbRects','hbWa','homeDynamic'].forEach(function(id){var e=document.getElementById(id); if(e)e.style.display=buscando?'none':'';});
  var _sep=document.getElementById('hbSep');
  if(buscando){ if(_sep)_sep.style.display='none'; } else { _homeAjustarSep(); }
  var wrap=document.getElementById('hbWrap'); if(wrap){ if(buscando)wrap.classList.add('hb-compact'); else wrap.classList.remove('hb-compact'); }
  var res=document.getElementById('homeResults'); if(!res)return;
  if(!buscando){ res.style.display='none'; res.innerHTML=''; return; }
  var nq=norm(q);
  var matches=(window.allProds||[]).filter(function(p){ return _prodMatcheaTexto(p, nq); });
  try{ matches=_ordenarConRelevancia(matches, q); }catch(e){}
  res.style.display='';
  if(!matches.length){ res.innerHTML="<div style='text-align:center;padding:2.5rem 1rem;color:var(--tx-mid,#8c8071);font-size:.9rem'>Sin resultados para “"+q+"”</div>"; return; }
  var tu=(typeof getCartTotalUnits==='function')?getCartTotalUnits():0;
  res.innerHTML="<div style='padding:.2rem .7rem 1.6rem;display:flex;flex-direction:column;gap:.5rem'>"+matches.slice(0,80).map(function(p){return renderCard(p,tu);}).join("")+"</div>";
}
// Defaults de los 4 recuadros (si la BD no tiene config aún).
var _RECUADROS_DEFAULT={
  arabes:{titulo:"Árabes",subtitulo:"Lattafa · Armaf · Rayhaan",color:"#f3e3c2",imagen:"",grad:"radial-gradient(circle at 70% 30%,#5a4322,#1c150c)",overlay:"rgba(20,15,8,.28)"},
  internacionales:{titulo:"Internacionales",subtitulo:"Diseñadores originales",color:"#e8f0f5",imagen:"",grad:"radial-gradient(circle at 70% 30%,#37505e,#101820)",overlay:"rgba(8,14,20,.30)"},
  ofertas:{titulo:"Ofertas",subtitulo:"Productos con descuento",color:"#ffe2cf",imagen:"",grad:"radial-gradient(circle at 70% 30%,#a8392c,#5a140d)",overlay:"rgba(40,8,6,.22)"},
  // 2026-11-05: el tercer recuadro pasa a Packaging (bolsas, estuches y tarjetas de la pestaña 'regaleria')
  packaging:{titulo:"Packaging",subtitulo:"Bolsas · estuches · tarjetas",color:"#f6e8f2",imagen:"",grad:"radial-gradient(circle at 70% 30%,#6d3a5c,#2a1424)",overlay:"rgba(30,10,24,.24)"},
  combos:{titulo:"Combos",subtitulo:"Combos + kits",color:"#e6f0d8",imagen:"",grad:"radial-gradient(circle at 70% 30%,#4f5e38,#222c14)",overlay:"rgba(14,20,8,.28)"}
};
function _recuadroData(k){
  var d=_RECUADROS_DEFAULT[k]||{}; var c=(window._homeRecuadros&&window._homeRecuadros[k])||{};
  return {titulo:(c.titulo!=null&&c.titulo!=="")?c.titulo:d.titulo, subtitulo:(c.subtitulo!=null)?c.subtitulo:d.subtitulo, color:c.color||d.color, imagen:c.imagen||"", grad:c.grad||d.grad, overlay:c.overlay||d.overlay};
}
function _hbEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function _homeRectsHTML(){
  var acc={arabes:"_bentoTab('arabes')",internacionales:"_bentoTab('internacionales')",packaging:"_bentoTab('regaleria')",combos:"_homeVerCombos()"};
  return ['arabes','internacionales','packaging','combos'].map(function(k){
    var d=_recuadroData(k);
    var bg=d.imagen?("background:url('"+String(d.imagen).replace(/'/g,"%27")+"') center/cover no-repeat"):("background:"+d.grad);
    return '<div class="hb-rect" onclick="'+acc[k]+'"><div class="bg" style="'+bg+'"></div><div class="ov" style="background:'+d.overlay+'"></div><div class="ct" style="color:'+d.color+'"><div class="lb">'+_hbEsc(d.titulo)+'</div>'+(d.subtitulo?'<div class="sub">'+_hbEsc(d.subtitulo)+'</div>':'')+'</div></div>';
  }).join('');
}
// Ofertas: TODOS los productos con descuento activo Y con stock físico. Combos: combos + kits con stock.
function _homeVerOfertas(){
  var prods=(window.allProds||[]).filter(function(p){ if((p.stock_actual||0)<=0)return false; try{var r=(typeof calcP==='function')?calcP(p):null; return !!(r&&r.oferta&&!r.oferta_descartada_por_cc);}catch(e){return false;} });
  _homeMostrarLista('🔥 Ofertas', prods, '');
}
function _homeVerCombos(){
  // 2026-09-29: misma regla que el resto del inicio: los combos de campaña (exclusivos de su pestaña) no salen acá
  var combosHtml=(window.combosPublicos||[]).filter(function(c){ return !c.campania_id && (c.mostrar_en_inicio || (Array.isArray(c.pestanas_ids)&&c.pestanas_ids.length)); }).map(function(c){ try{return _homeComboCard(c);}catch(e){return"";} }).join('');
  // 2026-08-08: misma regla que el filtro "Solo kits" del buscador, para que no baile el número
  var kits=(window.allProds||[]).filter(function(p){ if((p.stock_actual||0)<=0)return false; try{ return _esKit(p); }catch(e){ return false; } });
  _homeMostrarLista('🎁 Combos y Kits', kits, combosHtml);
}
function _homeMostrarLista(titulo, prods, extraHtml){
  ['hbTitle','hbRects','hbWa','hbSep','homeDynamic'].forEach(function(id){var e=document.getElementById(id); if(e)e.style.display='none';});
  var wrap=document.getElementById('hbWrap'); if(wrap)wrap.classList.add('hb-compact');
  var inp=document.getElementById('hbInput'); if(inp)inp.value='';
  var res=document.getElementById('homeResults'); if(!res)return;
  res.style.display='';
  var tu=(typeof getCartTotalUnits==='function')?getCartTotalUnits():0;
  var cards=(prods||[]).map(function(p){return renderCard(p,tu);}).join('');
  var cuerpo=(extraHtml||'')+(cards||'');
  if(!String(cuerpo).trim()) cuerpo="<div style='text-align:center;padding:2.5rem 1rem;color:var(--tx-mid,#8c8071);font-size:.9rem'>No hay nada para mostrar acá por ahora.</div>";
  res.innerHTML="<div style='padding:.2rem .7rem 1.6rem'>"+
    "<div style='display:flex;align-items:center;justify-content:space-between;margin:.3rem 0 .9rem'>"+
      "<div style=\"font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;color:var(--tx-main,#2c2419)\">"+titulo+"</div>"+
      "<button onclick='_homeVolver()' style='background:transparent;border:1px solid var(--goldl,#e4d3b3);color:var(--gold,#c4965a);border-radius:20px;padding:.35rem .85rem;font-size:.74rem;cursor:pointer;font-family:inherit'>← Volver</button>"+
    "</div>"+
    "<div style='display:flex;flex-direction:column;gap:.5rem'>"+cuerpo+"</div>"+
  "</div>";
  try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){}
}
function _homeVolver(){ var inp=document.getElementById('hbInput'); if(inp)inp.value=''; _homeBuscar(''); }
// Tope del inicio: buscador grande + 4 botones + 4 recuadros + separación. Inyecta su CSS una sola vez.
function _homeBuscadorHTML(){
  if(!document.getElementById('homeBuscadorStyle')){
    var st=document.createElement('style'); st.id='homeBuscadorStyle';
    st.textContent=
      ".hb-wrap{max-width:880px;margin:0 auto;padding:1.6rem 1.1rem .4rem;transition:padding .2s}"+
      ".hb-wrap.hb-compact{padding-top:.9rem}"+
      ".hb-hero{text-align:center;margin-bottom:1.1rem}"+
      ".hb-hero h1{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;line-height:1.05;color:var(--tx-main,#2c2419)}"+
      ".hb-hero p{color:var(--tx-mid,#8c8071);font-size:.84rem;margin:.4rem 0 0}"+
      ".hb-input{display:block;width:100%;box-sizing:border-box;background:var(--bg-card,#fffdf9);border:2px solid var(--goldl,#e4d3b3);border-radius:50px;padding:.95rem 1.4rem;font-size:.98rem;font-family:inherit;color:var(--tx-main,#2c2419);box-shadow:0 10px 30px rgba(196,150,90,.12);outline:none;transition:padding .2s,font-size .2s}"+
      ".hb-input::placeholder{color:var(--tx-mid,#8c8071)}"+
      ".hb-compact .hb-input{padding:.7rem 1.1rem;font-size:.9rem;box-shadow:0 6px 18px rgba(196,150,90,.1)}"+
      ".hb-btns{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin-top:.85rem}"+
      ".hbb{border:none;border-radius:13px;padding:.62rem 1.05rem;font-family:inherit;font-size:.82rem;font-weight:600;cursor:pointer;color:#fff;display:flex;align-items:center;gap:.35rem;transition:transform .15s,box-shadow .15s}"+
      ".hbb:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(0,0,0,.16)}"+
      ".hb-compact .hbb{padding:.45rem .8rem;font-size:.74rem}"+
      ".hbb-filtros{background:#c4965a}.hbb-comparar{background:#5d7c8c}.hbb-acordes{background:#9a6f86}.hbb-notas{background:#7a8a5e}"+
      ".hb-rects{display:grid;grid-template-columns:1fr 1fr;gap:.85rem;margin-top:1.1rem}"+
      ".hb-rect{position:relative;height:150px;border-radius:18px;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;transition:transform .2s,box-shadow .2s;border:none}"+
      ".hb-rect:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(0,0,0,.22)}"+
      ".hb-rect .bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .35s}.hb-rect:hover .bg{transform:scale(1.06)}"+
      ".hb-rect .ov{position:absolute;inset:0}"+
      ".hb-rect .ct{position:relative;z-index:2;padding:1rem}"+
      ".hb-rect .lb{font-family:'Cormorant Garamond',serif;font-size:2.15rem;font-weight:700;line-height:1.02}"+
      ".hb-rect .sub{font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;margin-top:.35rem;opacity:.92}"+
      ".hb-sep{max-width:880px;margin:1.8rem auto .2rem;padding:0 1.1rem;display:flex;align-items:center;gap:.8rem;color:var(--gold,#c4965a)}"+
      ".hb-sep::before,.hb-sep::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--goldl,#e4d3b3),transparent)}"+
      ".hb-sep span{font-family:'Cormorant Garamond',serif;font-size:1.05rem;letter-spacing:.02em;white-space:nowrap}"+
      ".hb-wa{display:flex;align-items:center;justify-content:center;gap:.6rem;width:100%;margin-top:.95rem;background:#25D366;color:#fff;border-radius:16px;padding:.95rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.02rem;font-weight:700;text-decoration:none;box-shadow:0 8px 22px rgba(37,211,102,.32);transition:transform .15s,box-shadow .15s,background .15s}"+
      ".hb-wa:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(37,211,102,.42);background:#20bd5a}.hb-wa svg{flex-shrink:0}"+
      "@media(max-width:720px){.hb-hero h1{font-size:1.7rem}.hb-input{padding:1.15rem 1.4rem;font-size:1.05rem;border-radius:20px}.hb-compact .hb-input{padding:.8rem 1.2rem;font-size:.95rem}.hb-btns{flex-wrap:nowrap;gap:.35rem}.hbb{flex:1;justify-content:center;font-size:.66rem;padding:.5rem .25rem;gap:.2rem;border-radius:11px}.hb-rect{height:122px}.hb-rect .lb{font-size:1.45rem}.hb-wa{font-size:.92rem;padding:.85rem 1rem}}";
    document.head.appendChild(st);
  }
  var _wn=(typeof waNumber!=='undefined'&&waNumber)?waNumber:WA_NUMBER;
  var _waMsg=encodeURIComponent('¡Hola! Me comunico desde el catálogo de Distribuidora Belle. Me gustaría recibir asesoramiento personalizado. ¿Me pueden ayudar? 🌸');
  var _waSvg='<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.48-1.38-1.73-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>';
  return ''+
    '<div class="hb-wrap" id="hbWrap">'+
      '<div class="hb-hero" id="hbTitle">'+
        '<h1>¿Qué perfume buscás?</h1>'+
        '<p>Buscá por nombre, marca o el perfume al que se parece</p>'+
      '</div>'+
      '<input class="hb-input" id="hbInput" type="text" autocomplete="off" placeholder="🔍 Buscar perfume, marca o dupe…" oninput="_homeBuscar(this.value)">'+
      '<div class="hb-btns" id="hbBtns">'+
        '<button class="hbb hbb-filtros" onclick="_homeAbrirFiltros()">🔧 Filtros</button>'+
        '<button class="hbb hbb-comparar" onclick="if(typeof abrirModalComparador===\'function\')abrirModalComparador()">⚖ Comparar</button>'+
        '<button class="hbb hbb-acordes" onclick="(document.getElementById(\'btnAcordesPanel\')||{click:function(){}}).click()">🌸 Acordes</button>'+
        '<button class="hbb hbb-notas" onclick="_bentoTab(\'notas\')">📝 Notas</button>'+
      '</div>'+
      '<div class="hb-rects" id="hbRects">'+_homeRectsHTML()+'</div>'+
      '<a class="hb-wa" id="hbWa" href="https://wa.me/'+_wn+'?text='+_waMsg+'" target="_blank" rel="noopener noreferrer">'+_waSvg+'<span>Solicitar asesoramiento</span></a>'+
    '</div>'+
    '<div class="hb-sep" id="hbSep" style="display:none"><span>Te puede interesar</span></div>'+
    '<div id="homeResults" style="display:none"></div>';
}
// ═══════════════════════════════════════════════════════════════
function loadHomePage(_intento){
  var el=document.getElementById("homePage");
  if(!el)return;
  _intento=_intento||0;

  // [Mobile UX] Setup listener para re-renderizar al cruzar el breakpoint
  // mobile/desktop. Las secciones de categoría pueden tener imagen_mobile_url
  // distinta a imagen_url — si el usuario rota el dispositivo o redimensiona,
  // queremos que el cambio se vea reflejado.
  if(!window._homeResizeListenerAdded){
    window._homeResizeListenerAdded = true;
    window._homeWasMobile = (window.innerWidth <= 480);
    window.addEventListener('resize', function(){
      var nowMobile = (window.innerWidth <= 480);
      if(nowMobile !== window._homeWasMobile){
        window._homeWasMobile = nowMobile;
        // Solo re-renderizar si la home está actualmente visible
        var homeEl = document.getElementById("homePage");
        if(homeEl && homeEl.style.display !== 'none' && window._homeCache){
          renderHomePage(window._homeCache.sections, window._homeCache.combos);
        }
      }
    });
  }

  // Si ya tenemos datos cacheados, mostrar inmediato
  if(window._homeCache){
    renderHomePage(window._homeCache.sections, window._homeCache.combos);
    return;
  }

  _homeEsqueleto();

  Promise.all([
    apiGet("home_sections","select=*&activo=is.true&slug_pestana=eq.inicio&order=orden"),
    apiGet("combos","select=*,combo_items(producto_id,cantidad,producto_nombre,es_decan,precio_ref)&activo=is.true&order=created_at.desc")
  ]).then(function(res){
    var sections=Array.isArray(res[0])?res[0]:[];
    var combos=Array.isArray(res[1])?res[1]:[];
    combosPublicos=combos; window._combosCargados=true;
    // Cachear para la próxima vez
    window._homeCache={sections:sections,combos:combos};
    try{ localStorage.setItem('belle_home_secs',JSON.stringify({s:sections,t:Date.now()})); }catch(e){}
    renderHomePage(sections,combos);
  }).catch(function(e){
    // 2026-10-19: un corte de red momentáneo no tiene que dejar el inicio vacío: se reintenta solo una vez
    if(_intento<1){ setTimeout(function(){ loadHomePage(_intento+1); },1500); return; }
    var el2=document.getElementById("homePage");
    if(el2)el2.innerHTML="<div style='text-align:center;padding:2rem;color:var(--tx-mid)'>"+
      "<div style='font-size:2rem;margin-bottom:.5rem'>⚠️</div>"+
      "<div style='font-size:.8rem'>Error: "+(e&&e.message?e.message:"sin conexión")+"</div>"+
      "<button onclick='window._homeCache=null;loadHomePage()' style='margin-top:.8rem;padding:.4rem .9rem;border-radius:7px;border:1px solid var(--accent);color:var(--accent);background:transparent;cursor:pointer;font-size:.78rem'>Reintentar</button>"+
    "</div>";
  });
}

// ─── PESTAÑA NOTAS (galería de notas + perfumes que las tienen) ───
function loadNotasPage(){
  var el=document.getElementById("notasPage");
  if(!el)return;
  if(window._catNotasMaestras){ _renderNotasGrid(); return; }
  el.innerHTML="<div style='display:flex;justify-content:center;padding:2rem'><div class='spin'></div></div>";
  apiGet('notas_maestras','select=clave,nombre_display,foto_url&order=nombre_display').then(function(rows){
    window._catNotasMaestras=Array.isArray(rows)?rows:[];
    _renderNotasGrid();
  }).catch(function(){
    el.innerHTML="<div style='text-align:center;padding:2rem;color:var(--tx-mid)'>No se pudieron cargar las notas. <button onclick='window._catNotasMaestras=null;loadNotasPage()' style='margin-left:.4rem;border:1px solid var(--accent);color:var(--accent);background:transparent;border-radius:7px;padding:.3rem .7rem;cursor:pointer'>Reintentar</button></div>";
  });
}

function _normNota(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,' ').replace(/\s+/g,' ').trim();}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// \ud83c\udf38 RESOLVER \u00daNICO de fotos de notas (2026-08-08)
// Orden: notas_maestras (la tabla que se administra desde belle) \u2192
//        configuracion.notas_fotos (NOTAS_FOTOS_USER) \u2192 diccionario fijo.
// Antes la ficha p\u00fablica NUNCA miraba notas_maestras y encima normalizaba
// las claves distinto (sin colapsar espacios) \u2192 muchas fotos "no aparec\u00edan"
// aunque estaban cargadas en el admin.
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function _notaFotoMaestraMap(){
  if(window._catNotaFotoMap) return window._catNotaFotoMap;
  var m={};
  (window._catNotasMaestras||[]).forEach(function(n){
    if(n && n.foto_url){
      if(n.clave) m[_normNota(n.clave)]=n.foto_url;
      if(n.nombre_display) m[_normNota(n.nombre_display)]=n.foto_url;
    }
  });
  window._catNotaFotoMap=m;
  return m;
}
function notaFotoDe(nombre){
  var key=_normNota(nombre);
  var m=_notaFotoMaestraMap();
  if(m[key]) return m[key];
  if(typeof NOTAS_FOTOS_USER!=='undefined' && NOTAS_FOTOS_USER[key]) return NOTAS_FOTOS_USER[key];
  // búsqueda difusa avanzada (palabra por palabra) y recién después el diccionario fijo
  try{ if(typeof _notaFotoBusca==='function'){ var u2=_notaFotoBusca(nombre); if(u2) return u2; } }catch(e){}
  try{ var u=getNotaFoto(nombre); if(u) return u; }catch(e){}
  return (typeof NOTAS_FOTOS!=='undefined' && NOTAS_FOTOS['_default'])||'';
}
// Cargar notas_maestras apenas arranca el cat\u00e1logo (es chica y la usan las fichas)
setTimeout(function _cargarNotasMaestras(intento){
  intento=intento||0;
  if(window._catNotasMaestras) return;
  if(typeof apiGet!=='function'){ if(intento<20)setTimeout(function(){_cargarNotasMaestras(intento+1);},500); return; }
  apiGet('notas_maestras','select=clave,nombre_display,foto_url&limit=5000').then(function(rows){
    window._catNotasMaestras=Array.isArray(rows)?rows:[];
    window._catNotaFotoMap=null;   // regenerar el mapa
  }).catch(function(){});
},1200);

function _notaCellHtml(n){
  var nom=n.nombre_display||n.clave;
  var foto=n.foto_url||((typeof getNotaFoto==='function')?getNotaFoto(nom):'');
  var claveEsc=(n.clave||'').replace(/'/g,"\\'");
  var nomEsc=(nom||'').replace(/'/g,"\\'");
  return "<button onclick=\"verPerfumesDeNota('"+claveEsc+"','"+nomEsc+"')\" style='border:none;background:transparent;cursor:pointer;padding:0;display:flex;flex-direction:column;align-items:center;gap:.4rem'>"+
    "<div style='width:100%;aspect-ratio:1/1;border-radius:12px;overflow:hidden;background:var(--bg-card,#f4efe6);border:1px solid rgba(196,150,90,.25)'>"+
      (foto?"<img src='"+foto+"' alt='' loading='lazy' style='width:100%;height:100%;object-fit:cover' onerror=\"this.style.display='none';this.parentNode.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.6rem;opacity:.4\\'>🌸</div>'\">":"<div style='width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.6rem;opacity:.4'>🌸</div>")+
    "</div>"+
    "<div style='font-size:.72rem;color:var(--tx-main,var(--tx));text-align:center;line-height:1.2;font-weight:500'>"+nom+"</div>"+
  "</button>";
}

function _renderNotasGrid(){
  var el=document.getElementById("notasPage");
  if(!el)return;
  var prev=(window._notasSearchTerm||'').replace(/"/g,'&quot;');
  el.innerHTML=
    "<div style='padding:.4rem 0 1rem'>"+
      "<div style='max-width:440px;margin:0 auto .85rem'>"+
        "<input id='_notasSearch' type='text' oninput='_filtrarNotas()' value=\""+prev+"\" placeholder='🔍 Buscar nota… (ej: naranja)' "+
          "style='width:100%;padding:.6rem .9rem;border:1px solid rgba(196,150,90,.4);border-radius:10px;font-family:inherit;font-size:.9rem;background:var(--bg-card,#fff);color:var(--tx-main,var(--tx));outline:none'>"+
      "</div>"+
      "<div style='font-family:\"Cormorant Garamond\",var(--serif,serif);font-size:1.5rem;color:var(--accent);text-align:center;margin-bottom:.15rem'>Notas olfativas</div>"+
      "<div style='text-align:center;font-size:.72rem;color:var(--tx-mid);margin-bottom:1.1rem'>Tocá una nota para ver los perfumes que la tienen</div>"+
      "<div id='_notasGridCont' style='display:grid;grid-template-columns:repeat(4,1fr);gap:.9rem .6rem'></div>"+
    "</div>";
  _filtrarNotas();
}

function _filtrarNotas(){
  var cont=document.getElementById('_notasGridCont');
  if(!cont)return;
  var q=((document.getElementById('_notasSearch')||{value:''}).value||'');
  window._notasSearchTerm=q;
  var qn=_normNota(q);
  var notas=(window._catNotasMaestras||[]).filter(function(n){return (n.nombre_display||n.clave);});
  notas.sort(function(a,b){return (a.nombre_display||a.clave||'').localeCompare(b.nombre_display||b.clave||'','es');});
  if(qn){
    notas=notas.filter(function(n){
      return _normNota(n.nombre_display||n.clave).indexOf(qn)>=0; // coincide en cualquier parte
    });
  }
  cont.innerHTML = notas.length
    ? notas.map(_notaCellHtml).join("")
    : "<div style='grid-column:1/-1;text-align:center;color:var(--tx-mid);padding:2rem'>Sin notas que coincidan con \""+(q||'')+"\"</div>";
}

function verPerfumesDeNota(clave, nombre){
  var el=document.getElementById("notasPage");
  if(!el)return;
  // Recordar dónde estaba el cliente en la grilla, para volver al mismo lugar
  window._notasScrollY = window.scrollY || window.pageYOffset || 0;
  function _normN(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,' ').replace(/\s+/g,' ').trim();}
  var fichas=window._fichasSB||[];
  var ids={};
  fichas.forEach(function(f){
    var tiene=[f.notas_salida,f.notas_corazon,f.notas_fondo].some(function(v){
      if(!v)return false;
      return v.split(',').some(function(x){return _normN(x)===clave;});
    });
    if(tiene && f.producto_id!=null) ids[f.producto_id]=1;
  });
  var prods=(allProds||[]).filter(function(p){return ids[p.id];});
  if(typeof sortedProds==='function') prods=sortedProds(prods);
  var totalUnits=getCartTotalUnits();
  var lista=prods.length
    ? "<div style='display:flex;flex-direction:column;gap:.5rem'>"+prods.map(function(p){return renderCard(p,totalUnits);}).join("")+"</div>"
    : "<div style='text-align:center;padding:2rem;color:var(--tx-mid)'>No hay perfumes con esta nota.</div>";
  el.innerHTML=
    "<div style='padding:.4rem 0 1rem'>"+
      "<button onclick='volverANotas()' style='background:transparent;border:1px solid var(--accent);color:var(--accent);border-radius:8px;padding:.4rem .85rem;cursor:pointer;font-family:inherit;font-size:.78rem;margin-bottom:.9rem'>← Volver a notas</button>"+
      "<div style='font-family:\"Cormorant Garamond\",var(--serif,serif);font-size:1.4rem;color:var(--accent);margin-bottom:.15rem'>Perfumes con "+nombre+"</div>"+
      "<div style='font-size:.72rem;color:var(--tx-mid);margin-bottom:1rem'>"+prods.length+" perfume"+(prods.length===1?'':'s')+"</div>"+
      lista+
    "</div>";
  try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){ window.scrollTo(0,0); }
}

function volverANotas(){
  loadNotasPage();
  var y=window._notasScrollY||0;
  // Restaurar la posición tras re-renderizar la grilla (los cuadros tienen alto fijo,
  // así que la posición es estable aunque las fotos carguen después).
  requestAnimationFrame(function(){ window.scrollTo(0,y); });
  setTimeout(function(){ window.scrollTo(0,y); }, 60);
}

function _homeCategCard(sec){
  var cfg={};try{cfg=JSON.parse(sec.config||"{}");}catch(e){}
  var alto=cfg.alto||220;
  var dest=sec.link_destino||"arabes";
  // [Mobile UX] Si estamos en mobile (≤480px) y la sección tiene imagen_mobile_url,
  // usar esa; sino fallback a imagen_url (la de desktop). Esto evita el problema
  // de imágenes apaisadas que en mobile quedan cortadas/sin contexto.
  var esMobile = (typeof window!=='undefined') && window.innerWidth <= 480;
  var imgChoice = (esMobile && sec.imagen_mobile_url) ? sec.imagen_mobile_url : sec.imagen_url;
  var imgUrl=imgChoice?encodeURI(imgChoice):'';
  var bgStyle=imgUrl
    ?"background-image:url(\""+imgUrl+"\");background-size:cover;background-position:center;"
    :"background:"+sec.color_fondo+";";
  return "<div onclick='_homeGoTab(\""+dest+"\")' style='position:relative;width:100%;height:"+alto+"px;margin-bottom:.5rem;border-radius:14px;overflow:hidden;cursor:pointer;"+bgStyle+"display:flex;align-items:flex-end;padding:1.2rem 1rem'>"+
    "<div style='position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7) 0%,rgba(0,0,0,.15) 55%,transparent 100%)'></div>"+
    "<div style='position:relative;z-index:1'>"+
      "<div style='font-size:1.5rem;font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1'>"+_catEsc(sec.titulo)+"</div>"+
      (sec.subtitulo?"<div style='font-size:.72rem;color:rgba(255,255,255,.75);margin-top:.25rem'>"+sec.subtitulo+"</div>":"")+
      "<div style='margin-top:.55rem;display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.18);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.28);border-radius:20px;padding:.28rem .75rem'>"+
        "<span style='font-size:.68rem;color:#fff;font-weight:600;letter-spacing:.03em'>Ver colección</span>"+
        "<span style='color:#fff;font-size:.75rem'>→</span>"+
      "</div>"+
    "</div>"+
  "</div>";
}

function _homeGoTab(dest){
  var el=document.querySelector(".tab[onclick*='"+dest+"']");
  if(el){switchTab(dest,el);}
}

function _homeComboCard(co){
  var c=co;

      var inCart=cart["combo_"+c.id];
      // Verificar stock de todos los componentes
      var sinStock=(c.combo_items||[]).some(function(it){
        if(it.es_decan)return false;
        var p=allProds.find(function(x){return x.id===it.producto_id;});
        return !p||(p.stock_actual||0)<(parseInt(it.cantidad)||1);
      });
      if(sinStock)return""; // Ocultar combo si falta stock (para la cantidad que pide el combo)
      var itemsHtml="<div style='margin-top:.4rem;border-top:1px solid var(--border);padding-top:.4rem'>"+
        "<div style='font-size:.62rem;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem;font-weight:600'>Incluye:</div>"+
        (c.combo_items||[]).map(function(it){
          return"<div style='font-size:.7rem;color:var(--mid);display:flex;justify-content:space-between;padding:.1rem 0'>"+
            "<span>&#10003; x"+it.cantidad+" "+_catEsc(_nomMl(it.producto_nombre, it.producto_id))+(it.es_decan&&!/decan/i.test(it.producto_nombre||'')?" <i style='opacity:.75'>(decant 5 ml)</i>":"")+"</span>"+
          "</div>";
        }).join("")+
      "</div>";
      var isMobile=window.innerWidth<640;
      // FEAT 2026-05-18: combos con oferta y etiqueta
      var tieneOferta = c.precio_oferta && parseFloat(c.precio_oferta) > 0 && parseFloat(c.precio_oferta) < parseFloat(c.precio);
      var etiquetaHTML = c.etiqueta ?
        "<div style='position:absolute;top:.5rem;left:.5rem;z-index:2;background:#c0392b;color:#fff;font-size:.62rem;font-weight:800;padding:.25rem .55rem;border-radius:6px;text-transform:uppercase;letter-spacing:.06em;box-shadow:0 2px 8px rgba(0,0,0,.35)'>"+_catEsc(c.etiqueta)+"</div>" : "";
      var precioBoxMobile = tieneOferta ?
        "<div style='border:1.5px solid #c0392b;border-radius:8px;padding:.55rem .7rem;text-align:center;background:rgba(192,57,43,.06)'>"+
          "<div style='font-size:.85rem;color:var(--tx-mid,var(--mid));text-decoration:line-through;line-height:1'>"+fmt(c.precio)+"</div>"+
          "<div style='font-size:1.3rem;font-weight:800;color:#c0392b;line-height:1.2'>"+fmt(c.precio_oferta)+"</div>"+
          "<div style='font-size:.58rem;color:#c0392b;margin-top:.15rem;font-weight:600;letter-spacing:.04em'>EN OFERTA &middot; ahorr&aacute;s "+fmt(c.precio - c.precio_oferta)+"</div>"+
        "</div>" :
        "<div style='border:1px solid rgba(232,184,109,.5);border-radius:8px;padding:.5rem .7rem;text-align:center;background:rgba(232,184,109,.06)'>"+
          "<div style='font-size:1.2rem;font-weight:700;color:var(--accent)'>"+fmt(c.precio)+"</div>"+
          "<div style='font-size:.6rem;color:var(--tx-mid,var(--mid));margin-top:.1rem'>Precio único del combo</div>"+
        "</div>";
      var precioBoxDesktop = tieneOferta ?
        "<div style='border:1.5px solid #c0392b;border-radius:8px;padding:.55rem .7rem;text-align:center;background:rgba(192,57,43,.06)'>"+
          "<div style='font-size:.8rem;color:var(--tx-mid,var(--mid));text-decoration:line-through;line-height:1'>"+fmt(c.precio)+"</div>"+
          "<div style='font-size:1.25rem;font-weight:800;color:#c0392b;line-height:1.2'>"+fmt(c.precio_oferta)+"</div>"+
          "<div style='font-size:.55rem;color:#c0392b;margin-top:.15rem;font-weight:600;letter-spacing:.04em'>EN OFERTA &middot; ahorr&aacute;s "+fmt(c.precio - c.precio_oferta)+"</div>"+
        "</div>" :
        "<div style='border:1px solid rgba(232,184,109,.5);border-radius:8px;padding:.5rem .7rem;text-align:center;background:rgba(232,184,109,.06)'>"+
          "<div style='font-size:1.15rem;font-weight:700;color:var(--accent)'>"+fmt(c.precio)+"</div>"+
          "<div style='font-size:.6rem;color:var(--tx-mid,var(--mid));margin-top:.1rem;letter-spacing:.02em'>Precio único del combo</div>"+
        "</div>";
      if(isMobile){
        return"<div style='border:1px solid rgba(232,184,109,.35);border-radius:12px;background:linear-gradient(135deg,var(--bg-card,var(--bgCard)) 0%,rgba(232,184,109,.04) 100%);overflow:hidden;margin-bottom:.8rem;position:relative'>"+
          etiquetaHTML+
          (c.imagen_url&&c.imagen_url.indexOf('data:')<0?
            "<div style='width:100%;max-height:280px;overflow:hidden'><img src='"+c.imagen_url+"' alt='' loading='lazy' decoding='async' style='width:100%;height:100%;object-fit:cover;display:block'></div>":
            "<div style='width:100%;height:180px;display:flex;align-items:center;justify-content:center;font-size:3rem;background:rgba(232,184,109,.08)'>&#127873;</div>")+
          "<div style='padding:.85rem 1rem;display:flex;flex-direction:column;gap:.5rem'>"+
            "<div style='font-size:.62rem;color:var(--accent);font-weight:600;letter-spacing:.08em;text-transform:uppercase'>COMBO</div>"+
            "<div style='font-size:1.1rem;font-weight:700;color:var(--tx-main,var(--tx))'>"+_catEsc(c.nombre)+"</div>"+
            precioBoxMobile+
            (inCart?"<div style='font-size:.7rem;color:var(--accent);text-align:center'>"+inCart.qty+" en pedido</div>":"")+
            "<button onclick='agregarComboCarrito("+c.id+")' style='width:100%;padding:.6rem;background:transparent;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;cursor:pointer;font-family:inherit;font-size:.85rem;font-weight:500;transition:background .2s' onmouseover='this.style.background=\"rgba(232,184,109,.12)\"' onmouseout='this.style.background=\"transparent\"'>"+
              (inCart?"+ Agregar otro":"Agregar al pedido")+
            "</button>"+
            (c.descripcion?"<div style='font-size:.72rem;color:var(--tx-mid,var(--mid));line-height:1.5;border-top:1px solid rgba(232,184,109,.15);padding-top:.5rem'>"+_catEsc(c.descripcion)+"</div>":"")+
            itemsHtml+
          "</div>"+
        "</div>";
      }
      return"<div style='border:1px solid rgba(232,184,109,.35);border-radius:12px;background:linear-gradient(135deg,var(--bg-card,var(--bgCard)) 0%,rgba(232,184,109,.04) 100%);display:flex;overflow:hidden;margin-bottom:.5rem;position:relative'>"+
        etiquetaHTML+
        "<div style='width:260px;min-width:260px;flex-shrink:0;display:flex;flex-direction:column;border-right:1px solid rgba(232,184,109,.2)'>"+
          (c.imagen_url&&c.imagen_url.indexOf('data:')<0?
            "<div style='width:100%;aspect-ratio:1/1;overflow:hidden;flex-shrink:0'><img src='"+c.imagen_url+"' alt='' loading='lazy' decoding='async' style='width:100%;height:100%;object-fit:cover;display:block'></div>":
            "<div style='width:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;font-size:3rem;background:rgba(232,184,109,.08)'>&#127873;</div>")+
          "<div style='padding:.7rem .85rem;display:flex;flex-direction:column;gap:.4rem;flex:1;justify-content:center'>"+
            precioBoxDesktop+
            (inCart?"<div style='font-size:.7rem;color:var(--accent);text-align:center'>"+inCart.qty+" en pedido</div>":"")+
            "<button onclick='agregarComboCarrito("+c.id+")' style='width:100%;padding:.5rem .6rem;background:transparent;color:var(--accent);border:1.5px solid var(--accent);border-radius:7px;cursor:pointer;font-family:inherit;font-size:.8rem;font-weight:500;letter-spacing:.02em;transition:background .2s' onmouseover='this.style.background=\"rgba(232,184,109,.12)\"' onmouseout='this.style.background=\"transparent\"'>"+
              (inCart?"+ Agregar otro":"Agregar al pedido")+
            "</button>"+
          "</div>"+
        "</div>"+
        "<div style='flex:1;padding:.8rem 1rem;display:flex;flex-direction:column;gap:.2rem;min-width:0'>"+
          "<div style='font-size:.65rem;color:var(--accent);font-weight:600;letter-spacing:.08em;text-transform:uppercase'>COMBO</div>"+
          "<div style='font-size:1.05rem;font-weight:700;color:var(--tx-main,var(--tx));margin-bottom:.15rem'>"+_catEsc(c.nombre)+"</div>"+
          (c.descripcion?"<div style='font-size:.7rem;color:var(--tx-mid,var(--mid));line-height:1.45;margin-bottom:.3rem'>"+_catEsc(c.descripcion)+"</div>":"")+
          itemsHtml+
        "</div>"+
      "</div>";
    
}

// Ficha VERTICAL para el trío publicitario (estilo destacados pero más grande, con agregar).
function _homeTrioCard(p, grande){
  if(!p)return"";
  var id=p.id;
  var r=(typeof calcP==='function')?calcP(p):{pm:p.precio_may_ars||0,pe:p.precio_med_ars||0,pi:p.precio_min_ars||0};
  var pm=r.pm||0,pe=r.pe||0,pi=r.pi||0;
  var br=getBrand(p.nombre||'');
  var sn=br?(p.nombre||'').replace(br+" - ",""):(p.nombre||'');
  var snClean=sn.replace(/\s*\|[^|]*/g,'').replace(/\s*\d+\s*ml\s*/gi,' ').trim();
  var nostock=(p.stock_actual||0)===0;
  var st=cstate[id]||{qty:0};
  var ca='#c4965a';
  var _isCC=!!(typeof _catCliente!=="undefined" && _catCliente && (_catCliente.cuenta_corriente_habilitada || _catCliente.precio_mayorista) && pm);
  var _hasOf=!!(r.oferta && !r.oferta_descartada_por_cc);
  var _ofCol2=_ofertaColores(r.oferta);
  var _ofTxt2=_ofCol2.texto, _ofBox2=_ofCol2.recuadro;
  var imgH=grande?'340px':'215px';
  var nameSize=grande?'1.2rem':'.95rem';
  var valSize=grande?'.98rem':'.82rem';

  function box(lbl,val,o){
    o=o||{};
    var _r={'10 o más':0,'3 o más':1,'Precio de lista':2}[lbl]; if(_r!==undefined) lbl=_segRotulos()[_r];
    var valStyle=o.tach?'text-decoration:line-through;color:#c97a82;':'color:'+(o.hot?_ofTxt2:'#333')+';';
    var bd=o.hot?'2px solid '+_ofBox2:'1px solid '+ca+'55';
    var bg=o.hot?_ofBox2+'1f':ca+'12';
    return "<div style='border:"+bd+";background:"+bg+";border-radius:8px;padding:.4rem .3rem;text-align:center'>"+
      "<div style='font-size:.55rem;letter-spacing:.04em;color:"+(o.hot?_ofTxt2:ca)+";font-weight:700;text-transform:uppercase;white-space:nowrap'>"+lbl+"</div>"+
      "<div style='font-size:"+valSize+";font-weight:700;"+valStyle+"'>"+fmt(val)+"</div>"+
    "</div>";
  }

  var pricesHtml='';
  if(nostock){
    pricesHtml="<div style='text-align:center;color:#c5443a;font-size:.8rem;font-weight:600;padding:.4rem'>Sin stock</div>";
  } else if(_hasOf && r.oferta_tipo==='precio_unico'){
    pricesHtml="<div style='display:grid;grid-template-columns:1fr;gap:.35rem'>"+box((r.oferta&&r.oferta.etiqueta)?r.oferta.etiqueta:'OFERTA', r.precio_unico||pi, {hot:true})+"</div>";
  } else if(_isCC){
    pricesHtml="<div style='display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:.35rem'>"+
      box('Precio VIP',pm,{})+box('x3',pe,{tach:true})+box('Precio de lista',pi,{tach:true})+"</div>";
  } else {
    pricesHtml="<div style='display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:.35rem'>"+
      box('10 o más',pm,{})+box('3 o más',pe,{})+box('Precio de lista',pi,{})+"</div>";
  }

  var addHtml='';
  if(!nostock){
    addHtml="<div style='display:flex;align-items:center;gap:.4rem;margin-top:.5rem'>"+
      "<div style='display:flex;align-items:center;gap:.25rem;border:1px solid "+ca+"55;border-radius:8px;padding:.1rem .25rem'>"+
        "<button class='qb' onclick='chgQty("+id+",-1)'>-</button>"+
        "<span class='qn' id='qty_"+id+"'>"+(st.qty||0)+"</span>"+
        "<button class='qb' onclick='chgQty("+id+",1)'>+</button>"+
      "</div>"+
      "<button class='abtn' onclick='addCart("+id+")' "+(st.qty===0?"disabled":"")+" style='flex:1'>Agregar</button>"+
    "</div>";
  }

  var imgSrc=(typeof fixImgUrl==='function')?fixImgUrl(p.imagen_url||''):(p.imagen_url||'');
  return "<div style='border:1px solid "+ca+"33;border-radius:14px;background:var(--bg-card,#fff);overflow:hidden;display:flex;flex-direction:column;height:100%;box-shadow:0 2px 10px rgba(0,0,0,.05)'>"+
    "<div style='width:100%;height:"+imgH+";display:flex;align-items:center;justify-content:center;background:"+ca+"08'>"+
      (imgSrc?"<img src='"+imgSrc+"' alt='' loading='lazy' style='max-width:100%;max-height:100%;object-fit:contain;padding:12px;mix-blend-mode:multiply'>":"<div style='font-size:2.5rem;opacity:.3'>🌸</div>")+
    "</div>"+
    "<div style='padding:.8rem .85rem;display:flex;flex-direction:column;gap:.4rem;flex:1'>"+
      (br?"<div style='font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:"+ca+";font-weight:600'>"+br+"</div>":"")+
      "<div style='font-size:"+nameSize+";font-weight:700;color:var(--tx-main,var(--tx));line-height:1.2'>"+_prodMl(snClean, p.ml)+"</div>"+
      "<div style='margin-top:auto'>"+pricesHtml+addHtml+"</div>"+
    "</div>"+
  "</div>";
}

function _catRecomendados(max){
  max=max||12;
  var sem=[];
  try{ if(Array.isArray(_catFavs)) sem=sem.concat(_catFavs); }catch(e){}
  try{ sem=sem.concat(_getVistosParec()||[]); }catch(e){}
  var seen={}, seeds=[];
  sem.forEach(function(id){ id=parseInt(id); if(id && !seen[id]){seen[id]=1; seeds.push(id);} });
  if(!seeds.length) return [];
  var excl={}; seeds.forEach(function(id){excl[id]=1;});
  var scores={};
  seeds.slice(0,15).forEach(function(sid){
    var prod=(window.allProds||[]).find(function(x){return x.id===sid;});
    if(!prod)return;
    var f; try{ f=fichaMatchProd(prod.nombre, FICHAS_BELLE, prod.id); }catch(e){}
    if(!f)return;
    var par=perfumesParecidos(prod, f, 8)||[];
    par.forEach(function(x,i){ if(excl[x.id])return; scores[x.id]=(scores[x.id]||0)+(8-i); });
  });
  var ids=Object.keys(scores).sort(function(a,b){return scores[b]-scores[a];});
  var out=[];
  for(var i=0;i<ids.length && out.length<max;i++){
    var p=(window.allProds||[]).find(function(x){return x.id===parseInt(ids[i]);});
    if(p && (p.stock_actual||0)>0 && !(p.oculto)) out.push(p);
  }
  return out;
}
function _catRecomendadosHtml(){
  var recs=_catRecomendados(12);
  if(!recs.length) return "";
  var cards=recs.map(function(p){return _cardParec(p);}).join("");
  return _styleParec()+
    '<div class="fb-parecidos">'+
      '<div class="fb-parec-ttl">&#10024; Pensado para vos</div>'+
      '<div class="fb-parec-row">'+cards+'</div>'+
    '</div>';
}
// Render de UNA seccion (reutilizable: home Y pestañas). Devuelve HTML o '' si se omite.
function _homeSeccionHtml(sec, combos){
  var html="";
    var cfg={};try{cfg=JSON.parse(sec.config||"{}");}catch(e){}

    if(sec.tipo==="categoria"){
      html+=_homeCategCard(sec);

    } else if(sec.tipo==="combos"){
      var comboIds=cfg.combo_ids||[];
      var combosVis=combos.filter(function(co){
        // Si hay IDs específicos configurados, usar esos
        if(comboIds.length){
          if(!comboIds.some(function(id){return Number(id)===Number(co.id);}))return false;
        } else {
          // Sin selección específica: mostrar los marcados con mostrar_en_inicio
          if(!co.mostrar_en_inicio)return false;
        }
        return !(co.combo_items||[]).some(function(it){
          if(it.es_decan)return false;
          var p=allProds.find(function(x){return x.id===it.producto_id;});
          return !p||(p.stock_actual||0)<(parseInt(it.cantidad)||1);
        });
      }).slice(0,cfg.max||20);
      if(!combosVis.length)return html;
      html+="<div style='margin-bottom:.5rem'>"+
        "<div style='font-size:.62rem;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:.5rem'>"+
          _catEsc(sec.titulo||"Combos disponibles")+
        "</div>"+
        combosVis.map(function(co){return _homeComboCard(co);}).join("")+
      "</div>";

    } else if(sec.tipo==="combo"){
      // Combo INDIVIDUAL: un solo combo por bloque (cfg.combo_id)
      var _cid=cfg.combo_id;
      var _co=(combos||[]).find(function(c){return Number(c.id)===Number(_cid);});
      if(!_co)return html;
      var _coHtml=_homeComboCard(_co);
      if(!_coHtml)return html; // sin stock -> _homeComboCard devuelve ""
      html+="<div style='margin-bottom:.5rem'>"+
        (sec.titulo?"<div style='font-size:.62rem;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:.5rem'>"+_catEsc(sec.titulo)+"</div>":"")+
        _coHtml+
      "</div>";

    } else if(sec.tipo==="panel"){
      // Destacado INDIVIDUAL: un solo panel de destacados por bloque (cfg.panel_id)
      var _pid=cfg.panel_id;
      var _panel=(window._catPaneles||[]).find(function(p){return Number(p.id)===Number(_pid);});
      if(!_panel||_panel.activo===false)return html;
      var _esMobP=(window.innerWidth||document.documentElement.clientWidth||9999)<=480;
      var _bgP=(_esMobP&&_panel.imagen_url_mobile)?_panel.imagen_url_mobile:(_panel.imagen_url||"");
      var _pdP=allProds.filter(function(p){
        return (p.panel_destacado_id===_panel.id||String(p.panel_destacado_id)===String(_panel.id)||(Array.isArray(p.paneles_extra)&&p.paneles_extra.some(function(x){return x===_panel.id||String(x)===String(_panel.id);})))&&(p.stock_actual||0)>0; /* FIX 2026-06-18: destacados solo con stock disponible real */
      }).sort(function(a,b){return(a.orden_en_panel||0)-(b.orden_en_panel||0);});
      if(!_pdP.length && !_bgP && !_panel.texto1 && !_panel.texto2 && !_panel.texto3)return html;
      var _tmpP=document.createElement("div");
      _renderUnPanel(_tmpP,"home-"+_panel.id,_pdP,_bgP,
        _panel.color_accent||"#c4965a",_panel.color_nombre||"#1a1a1a",
        _panel.color_precio||"#333",_panel.color_fondo||"#f9f1e0",
        _panel.texto1||"",_panel.texto2||"",_panel.texto3||"",_panel.alto||760);
      html+=_tmpP.innerHTML;

    } else if(sec.tipo==="destacados"){
      var panelIds=cfg.panel_ids||[];
      var todosLPaneles=window._catPaneles||[];
      var panelesAMostrar=[];
      var incluirGen=false;
      if(panelIds.length){
        incluirGen=panelIds.indexOf("general")>=0;
        var idsNum=panelIds.filter(function(id){return id!=="general";});
        panelesAMostrar=todosLPaneles.filter(function(p){
          return p.activo!==false && idsNum.some(function(id){return Number(id)===Number(p.id);});
        });
      } else {
        panelesAMostrar=todosLPaneles.filter(function(p){return p.mostrar_en_inicio && p.activo!==false;});
        incluirGen=!!(cfg.incluir_generales);
      }
      // Usar _renderUnPanel — mismo formato con imagen de fondo que las otras pestañas
      // [Mobile UX] En mobile (≤480px) usar imagen_url_mobile si existe
      var _esMobileHome = (window.innerWidth || document.documentElement.clientWidth || 9999) <= 480;
      var tempDiv=document.createElement("div");
      panelesAMostrar.forEach(function(panel){
        var pd=allProds.filter(function(p){
          return (p.panel_destacado_id===panel.id||String(p.panel_destacado_id)===String(panel.id)||(Array.isArray(p.paneles_extra)&&p.paneles_extra.some(function(x){return x===panel.id||String(x)===String(panel.id);})))&&(p.stock_actual||0)>0; /* FIX 2026-06-18: destacados solo con stock disponible real */
        }).sort(function(a,b){return(a.orden_en_panel||0)-(b.orden_en_panel||0);});
        var _bgImgHome = (_esMobileHome && panel.imagen_url_mobile) ? panel.imagen_url_mobile : (panel.imagen_url||"");
        if(!pd.length && !_bgImgHome && !panel.texto1 && !panel.texto2 && !panel.texto3)return html;
        _renderUnPanel(tempDiv,"home-"+panel.id,pd,
          _bgImgHome,panel.color_accent||"#c4965a",
          panel.color_nombre||"#1a1a1a",panel.color_precio||"#333",
          panel.color_fondo||"#f9f1e0",
          panel.texto1||"",panel.texto2||"",panel.texto3||"",panel.alto||760);
      });
      if(incluirGen){
        var gd=allProds.filter(function(p){
          return p.destacado&&!p.panel_destacado_id&&(p.stock_actual||0)>0;
        }).sort(function(a,b){return(a.orden_destacado||99)-(b.orden_destacado||99);}).slice(0,cfg.max||6);
        if(gd.length)_renderUnPanel(tempDiv,"home-gen",gd,"","#c4965a","#1a1a1a","#333","#f9f1e0","","","",760);
      }
      if(!tempDiv.innerHTML)return html;
      html+=tempDiv.innerHTML;
      if(false){
      var totalU=getCartTotalUnits();
      html+="<div style='margin-bottom:.5rem'>"+
        "<div style='font-size:.62rem;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:.5rem'>"+
          _catEsc(sec.titulo||"Destacados")+
        "</div>"+
        "<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem'>"+
          dests.map(function(p){return renderCard(p,totalU);}).join("")+
        "</div>"+
      "</div>";

          }
    } else if(sec.tipo==="recuadro"){
      var bgR=sec.imagen_url
        ?"background-image:url('"+sec.imagen_url+"');background-size:cover;background-position:center;"
        :"background:"+sec.color_fondo+";";
      var destR=sec.link_destino||"";
      var clickR=destR?"onclick='_homeGoTab(\""+destR+"\")'":"";
      html+="<div "+clickR+" style='position:relative;width:100%;height:"+(cfg.alto||150)+"px;margin-bottom:.5rem;border-radius:12px;overflow:hidden;"+(destR?"cursor:pointer;":"")+bgR+"display:flex;align-items:center;justify-content:center'>"+
        "<div style='position:absolute;inset:0;background:rgba(0,0,0,"+(cfg.overlay||0.25)+")'></div>"+
        "<div style='position:relative;z-index:1;text-align:center;padding:1rem'>"+
          (sec.titulo?"<div style='font-size:"+(cfg.titulo_size||"1.1rem")+";font-weight:800;color:"+(cfg.color_titulo||"#fff")+";text-shadow:0 2px 8px rgba(0,0,0,.5)'>"+_catEsc(sec.titulo)+"</div>":"")+
          (sec.subtitulo?"<div style='font-size:.72rem;color:rgba(255,255,255,.8);margin-top:.25rem'>"+sec.subtitulo+"</div>":"")+
        "</div>"+
      "</div>";

    } else if(sec.tipo==="trio"){
      // TRÍO PUBLICITARIO: 3 fichas con 3 disposiciones (reusa renderCard → precios y agregar reales)
      var _tids=cfg.producto_ids||[];
      var _tprods=_tids.map(function(pid){return allProds.find(function(p){return Number(p.id)===Number(pid);});}).filter(function(p){return !!p;});
      if(!_tprods.length)return html;
      var _disp=cfg.disposicion||"lado";
      var _tit=sec.titulo?"<div style='font-size:.62rem;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:.5rem'>"+_catEsc(sec.titulo)+"</div>":"";
      var _isMobTrio=(window.innerWidth||document.documentElement.clientWidth||9999)<=560;
      var _inner;
      if(_isMobTrio){
        _inner="<div style='display:flex;flex-direction:column;gap:.7rem'>"+_tprods.map(function(p){return _homeTrioCard(p,false);}).join("")+"</div>";
      } else if(_disp==="fila"){
        _inner="<div style='display:grid;grid-template-columns:repeat("+Math.min(_tprods.length,3)+",1fr);gap:.7rem;align-items:stretch'>"+_tprods.map(function(p){return _homeTrioCard(p,false);}).join("")+"</div>";
      } else if(_disp==="arriba"){
        var _restA=_tprods.slice(1);
        _inner="<div style='display:flex;flex-direction:column;gap:.7rem'>"+
          "<div>"+_homeTrioCard(_tprods[0],true)+"</div>"+
          (_restA.length?"<div style='display:grid;grid-template-columns:repeat("+Math.min(_restA.length,2)+",1fr);gap:.7rem;align-items:stretch'>"+_restA.map(function(p){return _homeTrioCard(p,false);}).join("")+"</div>":"")+
        "</div>";
      } else { // lado: 1 grande a la izquierda + las demás apiladas a la derecha
        var _restL=_tprods.slice(1);
        _inner="<div style='display:grid;grid-template-columns:1.4fr 1fr;gap:.7rem;align-items:stretch'>"+
          "<div>"+_homeTrioCard(_tprods[0],true)+"</div>"+
          (_restL.length?"<div style='display:flex;flex-direction:column;gap:.7rem'>"+_restL.map(function(p){return _homeTrioCard(p,false);}).join("")+"</div>":"")+
        "</div>";
      }
      html+="<div style='margin-bottom:.6rem'>"+_tit+_inner+"</div>";

    } else if(sec.tipo==="instagram"){
      // FEED DE INSTAGRAM: hasta 4 publicaciones (links pegados a mano)
      var _iglinks=(cfg.links||[]).filter(function(u){return u&&/instagram\.com/.test(u);}).slice(0,4);
      if(!_iglinks.length)return html;
      var _igTit=sec.titulo?"<div style='font-size:.62rem;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:.5rem'>"+_catEsc(sec.titulo)+"</div>":"";
      var _igCells=_iglinks.map(function(u){
        return "<blockquote class='instagram-media' data-instgrm-permalink='"+u+"' data-instgrm-version='14' style='margin:0;width:100%;min-width:0;border:0'></blockquote>";
      }).join("");
      html+="<div style='margin-bottom:.6rem'>"+_igTit+
        "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.5rem;align-items:start'>"+_igCells+"</div>"+
      "</div>";
      window._homeTieneInstagram=true;

    } else if(sec.tipo==="rotativo"){
      // VITRINA ROTATIVA: fuente vendidos / ingresos / recomendados / manual
      var _rf=cfg.fuente||'vendidos';
      var _rcant=parseInt(cfg.cantidad)||24;
      var _resInicio=(sec.slug_pestana==='inicio'||!sec.slug_pestana);
      var _rbase;
      if(cfg.solo_pestana!==false && !_resInicio && typeof getTabProds==='function' && typeof curTab!=='undefined' && sec.slug_pestana===curTab){
        _rbase=getTabProds();
      } else {
        _rbase=(window.allProds||[]);
      }
      _rbase=(_rbase||[]).filter(function(p){return (p.stock_actual||0)>0 && !p.oculto;});
      if(cfg.marca){ var _rm=(''+cfg.marca).toLowerCase(); _rbase=_rbase.filter(function(p){return ((p.empresa||'')+'').toLowerCase().indexOf(_rm)>=0;}); }
      if(Array.isArray(cfg.excluir_ids)&&cfg.excluir_ids.length){ _rbase=_rbase.filter(function(p){return cfg.excluir_ids.indexOf(p.id)<0;}); }
      var _rprods=[];
      if(_rf==='ingresos'){
        _rprods=_rbase.filter(function(p){return !!p.ultimo_ingreso_at;})
          .sort(function(a,b){return new Date(b.ultimo_ingreso_at||0)-new Date(a.ultimo_ingreso_at||0);});
      } else if(_rf==='recomendados'){
        _rprods=_rbase.slice().sort(function(a,b){
          var d=(b.destacado?1:0)-(a.destacado?1:0); if(d)return d;
          return (b.unidades_vendidas||0)-(a.unidades_vendidas||0);
        });
      } else if(_rf==='manual'){
        var _rids=cfg.producto_ids||[];
        _rprods=_rids.map(function(id){return _rbase.find(function(p){return Number(p.id)===Number(id);});}).filter(Boolean);
      } else {
        _rprods=_rbase.filter(function(p){return (p.unidades_vendidas||0)>0;})
          .sort(function(a,b){return (b.unidades_vendidas||0)-(a.unidades_vendidas||0);});
      }
      _rprods=_rprods.slice(0,_rcant);
      if(!_rprods.length) return html;
      var _rtipo=(_rf==='ingresos')?'ingresos':(_rf==='recomendados'||_rf==='manual')?'recomendados':'vendidos';
      var _ropts={
        velocidad:cfg.velocidad, auto:cfg.auto!==false, indicador:cfg.indicador||'auto',
        lado:cfg.lado||'izq', chip:cfg.chip||'auto', chipTexto:cfg.chip_texto||'',
        precio:!!cfg.precio, alto:parseInt(cfg.alto)||350, ultimas:!!cfg.ultimas, umbral:parseInt(cfg.umbral)||3
      };
      html+=_panelRotativoHtml(_rtipo, sec.titulo||'', _rprods, _ropts);

    } else if(sec.tipo==="texto"){
      html+="<div style='margin-bottom:.6rem;padding:.7rem .9rem;background:rgba(196,150,90,.06);border-left:3px solid var(--accent);border-radius:0 8px 8px 0'>"+
        (sec.titulo?"<div style='font-size:.85rem;font-weight:700;color:var(--tx-main);margin-bottom:.2rem'>"+_catEsc(sec.titulo)+"</div>":"")+
        (sec.subtitulo?"<div style='font-size:.75rem;color:var(--tx-mid);line-height:1.5'>"+sec.subtitulo+"</div>":"")+
      "</div>";
    }
  return html;
}

// UNIFICADO: las secciones ahora se dibujan JUNTO a los banners dentro de renderDestacados.
// Esta funcion solo asegura el cache de secciones y dispara el render unificado.
function _ensureSeccionesCache(cb){
  var ahora=Date.now(), TTL=5*60*1000;
  if(window._seccionesPestanaCache && window._seccionesPestanaTs && (ahora-window._seccionesPestanaTs<TTL)){ if(cb)cb(); return; }
  if(window._seccionesPestanaLoading) return;
  window._seccionesPestanaLoading=true;
  apiGet('home_sections','select=*&activo=is.true&order=orden').then(function(rows){
    var by={};
    (Array.isArray(rows)?rows:[]).forEach(function(s){var k=s.slug_pestana||'inicio';(by[k]=by[k]||[]).push(s);});
    window._seccionesPestanaCache=by;
    window._seccionesPestanaTs=Date.now();
    window._seccionesPestanaLoading=false;
    if(cb)cb();
  }).catch(function(){window._seccionesPestanaLoading=false;});
}
function renderSeccionesPestana(tab){
  // El cajon separado ya no se usa; se deja vacio/oculto.
  var cont=document.getElementById('pestanaSeccionesContainer');
  if(cont){ cont.style.display='none'; cont.innerHTML=''; }
  _ensureSeccionesCache(function(){ if(typeof renderDestacados==='function') renderDestacados(tab); });
}

// 2026-11-03 arranque limpio: pone el HTML del inicio conservando la portada Cyber (si está) y sin re-dibujar
// cuando el contenido es idéntico (evita el parpadeo de imágenes al volver al inicio).
function _homePoner(el,html){
  var keep=[]; ['cyHero','cyMarquee'].forEach(function(id){ var e=document.getElementById(id); if(e&&el.contains(e)) keep.push(e); });
  if(el._htmlPuesto===html && el.querySelector('#homeDynamic,#homeDynamicWait')) return false;
  el.innerHTML=html; el._htmlPuesto=html;
  var ref=el.firstChild; keep.forEach(function(e){ el.insertBefore(e,ref); });
  return true;
}
function _homeEsqueleto(){
  var el=document.getElementById("homePage"); if(!el) return;
  if(el.querySelector('#homeDynamic,#homeDynamicWait')) return;
  _homePoner(el,(typeof _homeBuscadorHTML==='function'?_homeBuscadorHTML():"")+"<div id='homeDynamicWait' style='display:flex;align-items:center;justify-content:center;padding:2rem'><div class='spin'></div></div>");
  if(typeof window._hbArmar==='function'){ try{ window._hbArmar(); }catch(e){} }
}
function renderHomePage(sections,combos){
  var el=document.getElementById("homePage");
  if(!el)return;
  window._homeTieneInstagram=false;
  var html=(typeof _homeBuscadorHTML==='function'?_homeBuscadorHTML():"")+"<div id='homeDynamic' style='padding:.7rem'>";

  if(!sections.length){
    // Sin secciones configuradas: mostramos SOLO el buscador (hero + recuadros + WhatsApp).
    // Nada de carteles ni mensajes para el cliente.
    _homePoner(el,html+"</div>");
    _homeAjustarSep();
    return;
  }

  html += _catRecomendadosHtml();

  sections.forEach(function(sec){
    html += _homeSeccionHtml(sec, combos);
  });

  html+="</div>";
  if(!_homePoner(el,html)) return;
  _homeAjustarSep();
  if(window._homeTieneInstagram){_homeProcesarInstagram();}
}
// Muestra "Te puede interesar" SOLO si hay contenido dinámico debajo (si no, lo oculta).
function _homeAjustarSep(){
  var sep=document.getElementById('hbSep'); var dyn=document.getElementById('homeDynamic');
  var hay = !!(dyn && dyn.innerHTML && dyn.innerHTML.replace(/\s/g,'').length>0);
  if(sep)sep.style.display=hay?'':'none';
}

// Carga el script oficial de Instagram (una sola vez) y procesa los embeds del feed.
function _homeProcesarInstagram(){
  function _run(){ if(window.instgrm&&window.instgrm.Embeds){try{window.instgrm.Embeds.process();}catch(e){}} }
  if(window.instgrm&&window.instgrm.Embeds){_run();return;}
  if(document.getElementById("_igEmbedScript")){setTimeout(_run,900);return;}
  var s=document.createElement("script");
  s.id="_igEmbedScript";s.async=true;s.src="https://www.instagram.com/embed.js";
  s.onload=_run;
  document.body.appendChild(s);
  setTimeout(_run,1500);
}


function fillBrands(){
  var sel=document.getElementById("brandFilter");var cur=sel.value;
  var seen={},brands=[];
  getTabProds().forEach(function(p){var b=getBrand(p.nombre);if(b&&!seen[b]){seen[b]=1;brands.push(b);}});
  brands.sort();
  sel.innerHTML="<option value=''>Todas las marcas</option>"+brands.map(function(b){return"<option value='"+b+"'"+(b===cur?" selected":"")+">"+b+"</option>";}).join("");
}

// ✨ NUEVO 2026-05-25: poblar selector "Inspirado en…" con dupes únicos
function fillInspirados(){
  var sel=document.getElementById("inspiradoFilter");
  if(!sel) return;
  var cur=sel.value;
  // Set de productos activos de la pestaña actual (para filtrar fichas relevantes)
  var prodIds={};
  getTabProds().forEach(function(p){if(p && p.id) prodIds[p.id]=1;});
  // Recolectar nombres únicos de inspiradores entre las fichas de productos visibles
  var seen={}, nombres=[];
  if(Array.isArray(window._fichasSB)){
    window._fichasSB.forEach(function(f){
      if(!f || !f.producto_id) return;
      if(!prodIds[f.producto_id]) return;
      var n = f.inspirado_en_nombre && String(f.inspirado_en_nombre).trim();
      if(n && !seen[n]){seen[n]=1; nombres.push(n);}
    });
  }
  nombres.sort(function(a,b){return a.localeCompare(b,'es',{sensitivity:'base'});});
  sel.innerHTML = "<option value=''>Inspirado en…</option>" +
    nombres.map(function(n){return "<option value='"+n.replace(/'/g,"&#39;")+"'"+(n===cur?" selected":"")+">"+n+"</option>";}).join("");
}

function getTabProds(){
  if(curTab==="arabes")return allProds.filter(function(p){return p.cat_catalogo==="arabes"||(!p.cat_catalogo&&!p.pestana_id);});
  if(curTab==="internacionales")return allProds.filter(function(p){return p.cat_catalogo==="internacionales";});
  if(curTab==="ofertas"){
    return allProds.filter(function(p){
      var tab=pestanasCatalogo.find(function(t){return t.slug==="ofertas";});
      return tab&&p.pestana_id===tab.id;
    });
  }
  // Dynamic tab
  var tab=pestanasCatalogo.find(function(t){return t.slug===curTab;});
  if(!tab)return [];

  // 1) Productos con pestana_id directo a esta pestaña
  var directos = allProds.filter(function(p){return p.pestana_id===tab.id && !_rgOcultoCat(p);});

  // 2) Productos vía campaña asociada a esta pestaña (tabla ofertas_campania_productos)
  // Si la pestaña tiene una campaña, agregar también los productos asignados a esa campaña.
  var camp = (window._ofertaCampanias||[]).find(function(c){return c.pestana_id === tab.id;});
  if(camp && window._ofertaCampaniaProductos && window._ofertaCampaniaProductos[camp.id]){
    var prodIdsCamp = window._ofertaCampaniaProductos[camp.id];
    var yaIncluidos = {};
    directos.forEach(function(p){yaIncluidos[p.id] = true;});
    var viaCamp = allProds.filter(function(p){
      return prodIdsCamp.indexOf(p.id) >= 0 && !yaIncluidos[p.id];
    });
    return directos.concat(viaCamp);
  }

  return directos;
}

function setGen(g,el){
  genF=g;
  document.querySelectorAll(".pills .pill").forEach(function(p){p.classList.remove("act");});
  el.classList.add("act");applyFilters();
}

function setKit(el){
  kitF=!kitF;
  el.classList.toggle("act",kitF);
  applyFilters();
}


function renderCombosEnCatalogo(){
  // Show combos section only in ofertas tab or always at top
  var sec=document.getElementById("combosSecCat");
  if(!sec)return;
  // Filtrar combos asignados a esta pestaña
  var tabActual=pestanasCatalogo.find(function(t){return t.slug===curTab;});
  var combosTab=combosPublicos.filter(function(combo){
    // Normalizar pestanas_ids — puede llegar como array, string JSON, o null
    var raw=combo.pestanas_ids;
    var ids=[];
    if(Array.isArray(raw))ids=raw;
    else if(typeof raw==="string"){try{ids=JSON.parse(raw);}catch(e){ids=[];}}
    if(!ids.length)return false;
    if(!tabActual)return false;
    var tabId=String(tabActual.id);
    return ids.some(function(pid){return String(pid)===tabId;});
  });
  if(!combosTab.length){sec.style.display="none";return;}
  sec.style.display="block";
  sec.innerHTML="<div style='font-size:.7rem;color:var(--acc);text-transform:uppercase;letter-spacing:.07em;font-weight:600;margin-bottom:.6rem'>Combos disponibles</div>"+
    // 2026-09-29: misma ficha que el inicio (antes había una copia de 85 líneas con reglas distintas)
    combosTab.map(function(c){ try{ return _homeComboCard(c); }catch(e){ return ""; } }).join("");
}

// precio vigente del combo: la oferta si es válida (mayor que 0 y menor que el precio), si no el precio
function _comboPrecioVigente(c){
  var base=(c.precio_oferta && parseFloat(c.precio_oferta) > 0 && parseFloat(c.precio_oferta) < parseFloat(c.precio)) ? parseFloat(c.precio_oferta) : (parseFloat(c.precio)||0);
  // 2026-10-17 (Ger): el combo vale lo que dice el combo, también para el cliente VIP. La regla del 2026-10-08
  // (cobrarle al VIP la suma x10 si era menor) hacía que en la campaña el combo saliera tachado y más barato
  // que el precio de venta. Se saca.
  return base;
}
function _comboSumaVIP(c){
  var tot=0;
  (c.combo_items||[]).forEach(function(i){
    var p=(allProds||[]).find(function(x){ return Number(x.id)===Number(i.producto_id); }); var cant=parseInt(i.cantidad)||1; var pu=0;
    if(i.es_decan){ pu=parseFloat(i.precio_ref)||0; if(!pu&&p){ try{ pu=calcP(p).decan||0; }catch(e){} } }
    else if(p){ if(parseFloat(p.precio_pestana)>0) pu=parseFloat(p.precio_pestana); else { try{ var r=calcP(p); pu=Math.min.apply(null,[r.pm,r.pe,r.pi].filter(function(x){return x>0;}))||0; }catch(e){ pu=p.precio_may_ars||0; } } }
    else pu=parseFloat(i.precio_ref)||0;
    tot+=pu*cant;
  });
  return Math.round(tot);
}
// foto fija de qué trae el combo, para guardarla en el pedido (si después el combo cambia o se borra, el pedido no se descuadra)
function _comboSnapshot(c){ return ((c&&c.combo_items)||[]).map(function(ci){ return {producto_id:ci.producto_id, cantidad:parseInt(ci.cantidad)||1, producto_nombre:ci.producto_nombre||'', es_decan:!!ci.es_decan}; }); }
// unidades de cada producto ya comprometidas en el carrito (sueltos + cajas + componentes de combos), sin contar el combo `sinKey`
function _comboComprometido(sinKey){
  var req={};
  Object.keys(cart||{}).forEach(function(k){
    var it=cart[k]; if(!it||it.isBonificado||k===sinKey) return;
    if(it.isCombo){
      var cr=combosPublicos.find(function(x){return x.id===it.comboId;});
      ((cr&&cr.combo_items)||[]).forEach(function(ci){ if(ci.es_decan||!ci.producto_id) return; req[ci.producto_id]=(req[ci.producto_id]||0)+(parseInt(ci.cantidad)||1)*(it.qty||1); });
    } else if(it.isDecan){ return; }
    else { var pid=parseInt(it.prodId||it.id); if(pid) req[pid]=(req[pid]||0)+(it.qty||1)*(it.isCosm?(it.cajaCant||1):1); }
  });
  return req;
}
// cuántos combos más se pueden agregar con el stock que queda (mirando lo que ya hay en el carrito)
function _comboMaxAgregable(c){
  var key="combo_"+c.id, req=_comboComprometido(key), max=Infinity;
  (c.combo_items||[]).forEach(function(ci){
    if(ci.es_decan||!ci.producto_id) return;
    var p=allProds.find(function(x){return x.id===ci.producto_id;});
    var disp=(p?(p.stock_actual||0):0)-(req[ci.producto_id]||0);
    var cabe=Math.floor(Math.max(0,disp)/(parseInt(ci.cantidad)||1));
    if(cabe<max) max=cabe;
  });
  return max===Infinity?999:max;
}
function agregarComboCarrito(comboId, n){
  var c=combosPublicos.find(function(x){return x.id===comboId;});
  if(!c)return;
  n=Math.max(1,parseInt(n)||1);
  var key="combo_"+comboId;
  var precioFinal=_comboPrecioVigente(c);
  // 2026-09-29: tope de stock al agregar (antes se podía sumar de más y recién al confirmar se borraba el combo entero)
  var yaTengo=cart[key]?(cart[key].qty||0):0;
  var max=_comboMaxAgregable(c);
  if(max<=yaTengo){ showToast(max?"Solo hay stock para "+max+" de este combo":"No hay stock suficiente para este combo"); renderCombosEnCatalogo(); return; }
  var agrega=Math.min(n, max-yaTengo);
  if(cart[key])cart[key].qty+=agrega;
  else cart[key]={id:key,nombre:"Combo: "+c.nombre,qty:agrega,precio:precioFinal,isDecan:false,isCombo:true,comboId:comboId,pData:{pm:precioFinal,pe:precioFinal,pi:precioFinal}};
  updateCartCount();
  showToast(agrega<n?("Se agregaron "+agrega+" (no hay stock para más)"):(agrega>1?agrega+" combos agregados al pedido!":"Combo agregado al pedido!"));
  renderCombosEnCatalogo();
}


// ════════════════════════════════════════════════════════════════════
// 🎯 BUSCADOR "TU VERSIÓN ÁRABE" — 2026-06-17
// El cliente escribe un perfume de diseñador (Sauvage, Baccarat, Aventus…)
// y ve todos los árabes inspirados en él. Usa las fichas vivas (_fichasSB)
// y la canonización de dupes (_dupeCanonFromText).
// ════════════════════════════════════════════════════════════════════
var _dfIndexCache=null, _dfPopCache=null;
function _dfNorm(s){return String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();}
function _dfEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function _dfInspNames(f){
  var out=[];
  if(f && Array.isArray(f.inspiraciones)){
    f.inspiraciones.forEach(function(it){ if(it && it.nombre && String(it.nombre).trim()) out.push(String(it.nombre).trim()); });
  }
  if(f && f.inspirado_en_nombre && String(f.inspirado_en_nombre).trim() && out.indexOf(String(f.inspirado_en_nombre).trim())<0){
    out.push(String(f.inspirado_en_nombre).trim());
  }
  return out;
}
function _dfBuildIndex(){
  if(_dfIndexCache) return _dfIndexCache;
  var fichas=window._fichasSB||[];
  var prodById={}; (allProds||[]).forEach(function(p){prodById[p.id]=p;});
  var idx=[];
  fichas.forEach(function(f){
    if(!f || !f.producto_id) return;
    var p=prodById[f.producto_id]; if(!p) return; // solo productos activos/visibles del catálogo
    var names=_dfInspNames(f);
    if(!names.length) return;
    idx.push({
      id:p.id,
      nombre:(p.nombre||'').split('|')[0].trim(),
      img:p.imagen_url||'',
      empresa:p.empresa||'',
      inspNames:names,
      inspNorm:names.map(_dfNorm)
    });
  });
  _dfIndexCache=idx;
  return idx;
}
function _dfPopulares(){
  if(_dfPopCache) return _dfPopCache;
  var idx=_dfBuildIndex();
  var groups={};
  idx.forEach(function(it){
    it.inspNames.forEach(function(nm){
      var canon=(typeof _dupeCanonFromText==='function')?_dupeCanonFromText(nm):_dfNorm(nm);
      if(!canon) return; // descarta "composición propia", "creación original", etc.
      if(!groups[canon]) groups[canon]={display:nm, ids:{}};
      // preferir el nombre más corto y prolijo como display
      if(nm.length < groups[canon].display.length) groups[canon].display=nm;
      groups[canon].ids[it.id]=1;
    });
  });
  var arr=Object.keys(groups).map(function(k){return {display:groups[k].display, n:Object.keys(groups[k].ids).length};});
  arr.sort(function(a,b){return b.n-a.n;});
  _dfPopCache=arr.slice(0,14);
  return _dfPopCache;
}
function _dfBuild(){
  if(document.getElementById('dfOverlay')) return;
  var ov=document.createElement('div');
  ov.id='dfOverlay';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(40,30,20,.55);display:none;align-items:flex-start;justify-content:center;padding:6vh 1rem 1rem;backdrop-filter:blur(3px)';
  ov.innerHTML=
    '<div style="width:min(620px,96vw);max-height:86vh;display:flex;flex-direction:column;background:#faf8f4;border-radius:16px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.4)">'+
      '<div style="padding:1.1rem 1.2rem .8rem;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff">'+
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem">'+
          '<div>'+
            '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.45rem;font-weight:700;line-height:1.1">¿Te gusta un perfume?</div>'+
            '<div style="font-size:.78rem;opacity:.92;margin-top:.15rem">Escribí el de diseñador y te muestro su versión árabe</div>'+
          '</div>'+
          '<button onclick="cerrarDupeFinder()" style="background:rgba(255,255,255,.2);border:none;color:#fff;width:30px;height:30px;border-radius:50%;font-size:1.2rem;cursor:pointer;line-height:1;flex-shrink:0">&times;</button>'+
        '</div>'+
        '<div style="position:relative;margin-top:.8rem">'+
          '<span style="position:absolute;left:.7rem;top:50%;transform:translateY(-50%);font-size:.9rem">&#128269;</span>'+
          '<input id="dfInput" autocomplete="off" placeholder="Ej: Sauvage, Baccarat, Aventus, Le Male…" oninput="_dfBuscar(this.value)" style="width:100%;box-sizing:border-box;padding:.7rem .8rem .7rem 2.1rem;border:none;border-radius:10px;font-size:.92rem;color:#1a1a1a;outline:none">'+
        '</div>'+
      '</div>'+
      '<div id="dfChips" style="padding:.7rem 1.2rem 0;display:flex;flex-wrap:wrap;gap:.4rem"></div>'+
      '<div id="dfResultados" style="padding:.8rem 1.2rem 1.2rem;overflow-y:auto"></div>'+
    '</div>';
  ov.addEventListener('click',function(e){ if(e.target===ov)cerrarDupeFinder(); });
  document.body.appendChild(ov);
}
function abrirDupeFinder(){
  _dfBuild();
  var ov=document.getElementById('dfOverlay'); if(!ov) return;
  _dfIndexCache=null; _dfPopCache=null; // refrescar por si cargaron fichas nuevas
  ov.style.display='flex';
  document.body.style.overflow='hidden';
  var inp=document.getElementById('dfInput'); if(inp){inp.value='';setTimeout(function(){inp.focus();},50);}
  _dfRenderChips();
  _dfBuscar('');
}
function cerrarDupeFinder(){
  var ov=document.getElementById('dfOverlay'); if(ov)ov.style.display='none';
  document.body.style.overflow='';
}
function _dfRenderChips(){
  var cont=document.getElementById('dfChips'); if(!cont) return;
  var pop=_dfPopulares();
  if(!pop.length){cont.innerHTML='';return;}
  cont.innerHTML='<span style="font-size:.66rem;color:#9a8060;width:100%;margin-bottom:.1rem">Los más buscados:</span>'+
    pop.map(function(g){
      return '<button onclick="_dfChip(this.getAttribute(\'data-q\'))" data-q="'+_dfEsc(g.display)+'" style="background:#fff;border:1px solid #e8d9bf;color:#6b5a3e;border-radius:20px;padding:.25rem .7rem;font-size:.7rem;cursor:pointer">'+_dfEsc(g.display)+' <span style="color:#c4965a;font-weight:700">'+g.n+'</span></button>';
    }).join('');
}
function _dfChip(q){
  var inp=document.getElementById('dfInput'); if(inp)inp.value=q;
  _dfBuscar(q);
}
function _dfBuscar(q){
  var cont=document.getElementById('dfResultados'); if(!cont) return;
  var nq=_dfNorm(q);
  var chips=document.getElementById('dfChips');
  if(!nq){
    if(chips)chips.style.display='flex';
    cont.innerHTML='<div style="text-align:center;color:#9a8060;font-size:.8rem;padding:1.5rem 1rem">Escribí un perfume de diseñador arriba, o tocá uno de los populares.</div>';
    return;
  }
  if(chips)chips.style.display='none';
  var idx=_dfBuildIndex();
  var res=idx.filter(function(it){ return it.inspNorm.some(function(n){return n.indexOf(nq)>=0;}); });
  // ordenar: match al inicio del nombre primero, después alfabético
  res.sort(function(a,b){
    var am=a.inspNorm.some(function(n){return n.indexOf(nq)===0;})?0:1;
    var bm=b.inspNorm.some(function(n){return n.indexOf(nq)===0;})?0:1;
    if(am!==bm)return am-bm;
    return a.nombre.localeCompare(b.nombre);
  });
  if(!res.length){
    cont.innerHTML='<div style="text-align:center;color:#9a8060;font-size:.82rem;padding:1.5rem 1rem">No encontré árabes inspirados en <strong>"'+_dfEsc(q)+'"</strong>.<br><span style="font-size:.72rem">Probá con el nombre del perfume original (ej: Sauvage, Aventus, Baccarat).</span></div>';
    return;
  }
  res=res.slice(0,40);
  cont.innerHTML='<div style="font-size:.72rem;color:#9a8060;margin-bottom:.5rem">'+res.length+' perfume'+(res.length>1?'s':'')+' inspirado'+(res.length>1?'s':'')+' que tenemos:</div>'+
    res.map(function(it){
      var matchName=it.inspNames.find(function(nm){return _dfNorm(nm).indexOf(nq)>=0;})||it.inspNames[0];
      var img=it.img?('<img src="'+_dfEsc(it.img)+'" loading="lazy" style="width:52px;height:52px;object-fit:contain;border-radius:8px;background:#fff;border:1px solid #ece3d5;flex-shrink:0" onerror="this.style.visibility=\'hidden\'">'):'<div style="width:52px;height:52px;border-radius:8px;background:#f0e9dd;flex-shrink:0"></div>';
      return '<div onclick="_dfGo('+it.id+')" style="display:flex;gap:.7rem;align-items:center;padding:.55rem;border-radius:10px;cursor:pointer;border-bottom:1px solid #f0e9dd" onmouseover="this.style.background=\'#f3ece0\'" onmouseout="this.style.background=\'\'">'+
        img+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-weight:600;color:#3a2f22;font-size:.85rem;line-height:1.2">'+_dfEsc(_prodMl(it.nombre, _mlDe(it.id)))+'</div>'+
          '<div style="font-size:.7rem;color:#a9763f;margin-top:.15rem">≈ inspirado en '+_dfEsc(matchName)+'</div>'+
        '</div>'+
        '<span style="color:#c4965a;font-size:1.1rem;flex-shrink:0">›</span>'+
      '</div>';
    }).join('');
}
function _dfGo(prodId){
  cerrarDupeFinder();
  if(typeof verFichaBelle==='function') verFichaBelle(prodId);
}
// Cerrar con Escape
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){var ov=document.getElementById('dfOverlay'); if(ov&&ov.style.display==='flex')cerrarDupeFinder();}
});

// ════════════════════════════════════════════════════════════════════
// ✨ QUIZ "ENCONTRÁ TU PERFUME" — 2026-06-17
// 4 preguntas guiadas → recomienda perfumes del catálogo según
// familia/notas, momento, ocasión e intensidad (usa fichas vivas).
// ════════════════════════════════════════════════════════════════════
var _qzState={}, _qzStep=0;
var _QZ_PASOS=[
  {key:'genero', q:'¿Para quién es?', tipo:'iconos', opts:[
    {v:'mas', l:'Hombre', emoji:'👨'},
    {v:'fem', l:'Mujer', emoji:'👩'}
  ]},
  {key:'familia', q:'¿Qué tipo de aroma buscás?', opts:[
    {v:'dulce', l:'🍯 Dulce / Gourmand'},
    {v:'fresco', l:'💧 Fresco / Cítrico'},
    {v:'amaderado', l:'🌳 Amaderado / Especiado'},
    {v:'floral', l:'🌸 Floral'},
    {v:'oriental', l:'🔥 Oriental / Intenso'}
  ]},
  {key:'momento', q:'¿Para qué momento?', opts:[
    {v:'dia', l:'☀️ De día'},
    {v:'noche', l:'🌙 De noche'},
    {v:'todo', l:'🔄 Para todo'}
  ]},
  {key:'ocasion', q:'¿Para qué ocasión?', opts:[
    {v:'diario', l:'👕 Diario / Trabajo'},
    {v:'salidas', l:'💕 Salidas / Citas'},
    {v:'especial', l:'🎉 Eventos / Especial'}
  ]},
  {key:'rinde', q:'¿Cómo te gusta que rinda?', opts:[
    {v:'suave', l:'🤫 Suave y cercano'},
    {v:'medio', l:'⚖️ Equilibrado'},
    {v:'fuerte', l:'💥 Que se sienta a distancia'}
  ]}
];
function _qzBuild(){
  if(document.getElementById('qzOverlay')) return;
  var ov=document.createElement('div');
  ov.id='qzOverlay';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(40,30,20,.55);display:none;align-items:flex-start;justify-content:center;padding:6vh 1rem 1rem;backdrop-filter:blur(3px)';
  ov.innerHTML=
    '<div style="width:min(560px,96vw);max-height:86vh;display:flex;flex-direction:column;background:#faf8f4;border-radius:16px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.4)">'+
      '<div style="padding:1.1rem 1.2rem;background:linear-gradient(135deg,#3a2f22,#5a4632);color:#fff;display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem">'+
        '<div>'+
          '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.45rem;font-weight:700;line-height:1.1">Encontrá tu perfume</div>'+
          '<div id="qzProgreso" style="font-size:.72rem;opacity:.85;margin-top:.15rem"></div>'+
        '</div>'+
        '<button onclick="cerrarQuiz()" style="background:rgba(255,255,255,.18);border:none;color:#fff;width:30px;height:30px;border-radius:50%;font-size:1.2rem;cursor:pointer;line-height:1;flex-shrink:0">&times;</button>'+
      '</div>'+
      '<div id="qzCuerpo" style="padding:1.2rem;overflow-y:auto"></div>'+
    '</div>';
  ov.addEventListener('click',function(e){ if(e.target===ov)cerrarQuiz(); });
  document.body.appendChild(ov);
}
function abrirQuiz(){
  _qzBuild();
  var ov=document.getElementById('qzOverlay'); if(!ov) return;
  _qzState={}; _qzStep=0;
  ov.style.display='flex'; document.body.style.overflow='hidden';
  _qzRenderPaso();
}
function cerrarQuiz(){ var ov=document.getElementById('qzOverlay'); if(ov)ov.style.display='none'; document.body.style.overflow=''; }
function _qzRenderPaso(){
  var cuerpo=document.getElementById('qzCuerpo'); var prog=document.getElementById('qzProgreso');
  if(!cuerpo) return;
  if(_qzStep>=_QZ_PASOS.length){ _qzResultado(); return; }
  var paso=_QZ_PASOS[_qzStep];
  if(prog)prog.textContent='Paso '+(_qzStep+1)+' de '+_QZ_PASOS.length;
  var h='<div style="font-size:1.05rem;font-weight:700;color:#3a2f22;margin-bottom:1rem">'+paso.q+'</div>';
  if(paso.tipo==='iconos'){
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem">';
    paso.opts.forEach(function(o){
      h+='<button onclick="_qzResponder(\''+paso.key+'\',\''+o.v+'\')" style="display:flex;flex-direction:column;align-items:center;gap:.55rem;background:#fff;border:1.5px solid #e8d9bf;color:#3a2f22;border-radius:14px;padding:1.5rem .8rem;cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor=\'#c4965a\';this.style.background=\'#fdf8f0\'" onmouseout="this.style.borderColor=\'#e8d9bf\';this.style.background=\'#fff\'">'
        +'<span style="font-size:3rem;line-height:1">'+o.emoji+'</span>'
        +'<span style="font-weight:700;font-size:1rem">'+o.l+'</span>'
      +'</button>';
    });
    h+='</div>';
  } else {
    h+='<div style="display:flex;flex-direction:column;gap:.55rem">';
    paso.opts.forEach(function(o){
      h+='<button onclick="_qzResponder(\''+paso.key+'\',\''+o.v+'\')" style="text-align:left;background:#fff;border:1.5px solid #e8d9bf;color:#3a2f22;border-radius:12px;padding:.8rem 1rem;font-size:.9rem;cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor=\'#c4965a\';this.style.background=\'#fdf8f0\'" onmouseout="this.style.borderColor=\'#e8d9bf\';this.style.background=\'#fff\'">'+o.l+'</button>';
    });
    h+='</div>';
  }
  if(_qzStep>0){
    h+='<button onclick="_qzAtras()" style="margin-top:1rem;background:transparent;border:none;color:#9a8060;font-size:.78rem;cursor:pointer">← Volver</button>';
  }
  cuerpo.innerHTML=h;
}
function _qzResponder(key,val){ _qzState[key]=val; _qzStep++; _qzRenderPaso(); }
function _qzAtras(){ if(_qzStep>0){_qzStep--; _qzRenderPaso();} }
function _qzMapInt(val){
  if(!val) return 0; var v=String(val).toLowerCase();
  if(/nuclear|beast|bestial|extrem/.test(v)) return 5;
  if(/muy (alta|larga)|intens/.test(v)) return 4;
  if(/alta|larga/.test(v)) return 3;
  if(/moderada|media|notable/.test(v)) return 2;
  if(/baja|corta|discreta|leve/.test(v)) return 1;
  return 0;
}
function _qzGeneroOk(p, sel){
  if(!sel) return true;
  var g=p.genero||'';
  if(!g) return true;               // sin dato = unisex (igual que genLabel) → sale en ambos
  var fem=g.indexOf('\u2640')>=0;   // ♀
  var mas=g.indexOf('\u2642')>=0;   // ♂
  var uni=(g==='U')||(fem&&mas)||/unisex/i.test(g);
  if(sel==='fem') return fem||uni;
  if(sel==='mas') return mas||uni;
  return true;
}
function _qzResultado(){
  var cuerpo=document.getElementById('qzCuerpo'); var prog=document.getElementById('qzProgreso');
  if(prog)prog.textContent='Tus resultados';
  var famRx={
    dulce:/dulce|gourmand|vainilla|caramelo|pralin|chocolate|az[uú]car|candy|tonka|leche|toffee|miel/i,
    fresco:/fresco|c[ií]tric|acu[aá]tic|marin|arom[aá]tic|verde|agua|foug|bergamota|lim[oó]n/i,
    amaderado:/amaderad|mader|cedro|s[aá]ndalo|vetiver|especiad|cuero|oud|pach|gaiac/i,
    floral:/floral|rosa|jazm[ií]n|\bflor|peon[ií]a|nardo|azahar|iris|tuberosa|ylang/i,
    oriental:/oriental|[aá]mbar|incienso|oud|especiad|resin|balsam|cardamomo|azafr[aá]n/i
  };
  var ocRx={
    diario:/cotidiano|diario|trabajo|casual|oficina|deporte|gym/i,
    salidas:/salida|cita|seductor|noche/i,
    especial:/evento|gala|especial|fiesta|formal/i
  };
  var st=_qzState;
  var prodById={}; (allProds||[]).forEach(function(p){prodById[p.id]=p;});
  var resultados=[];
  (window._fichasSB||[]).forEach(function(f){
    if(!f||!f.producto_id) return;
    var p=prodById[f.producto_id]; if(!p) return;
    if(st.genero && !_qzGeneroOk(p, st.genero)) return;
    var blob=[(f.familia_olfativa||''),(f.notas_salida||''),(f.notas_corazon||''),(f.notas_fondo||''),(f.descripcion||'')].join(' ').toLowerCase();
    var score=0, motivos=[];
    // familia (peso fuerte)
    if(st.familia && famRx[st.familia] && famRx[st.familia].test(blob)){ score+=4; motivos.push('aroma '+st.familia); }
    // momento
    var md=(f.momento_dia||'').toLowerCase();
    if(st.momento==='dia' && /d[ií]a|ma[ñn]ana/.test(md)){ score+=2; }
    else if(st.momento==='noche' && /noche/.test(md)){ score+=2; }
    else if(st.momento==='todo'){ if(/todo|vers[aá]til/.test(md))score+=1.5; else score+=0.5; }
    // ocasión
    var oc=(f.ocasion||'').toLowerCase();
    if(st.ocasion && ocRx[st.ocasion] && ocRx[st.ocasion].test(oc)){ score+=2; }
    // intensidad / proyección
    var lvl=_qzMapInt(f.proyeccion);
    if(lvl>0){
      if(st.rinde==='suave' && lvl<=2) score+=2;
      else if(st.rinde==='medio' && (lvl===2||lvl===3)) score+=2;
      else if(st.rinde==='fuerte' && lvl>=4) score+=2;
      else score+=0.3;
    }
    if(score>0) resultados.push({p:p,f:f,score:score});
  });
  resultados.sort(function(a,b){ if(b.score!==a.score)return b.score-a.score; return (a.p.nombre||'').localeCompare(b.p.nombre||''); });
  var top=resultados.slice(0,8);
  var h='';
  if(!top.length){
    h='<div style="text-align:center;color:#9a8060;padding:2rem 1rem">No encontré una coincidencia clara. Probá con otras respuestas.</div>';
  } else {
    h+='<div style="font-size:.82rem;color:#6b5a3e;margin-bottom:.9rem">Según lo que elegiste, estos son para vos:</div>';
    top.forEach(function(it,idx){
      var p=it.p, f=it.f;
      var nombre=(p.nombre||'').split('|')[0].trim();
      var fam=(f.familia_olfativa||'').split('/')[0].trim();
      var precioHtml=_qzPrecioHtml(p);
      var img=p.imagen_url?('<img src="'+p.imagen_url+'" loading="lazy" style="width:54px;height:54px;object-fit:contain;border-radius:8px;background:#fff;border:1px solid #ece3d5;flex-shrink:0" onerror="this.style.visibility=\'hidden\'">'):'<div style="width:54px;height:54px;border-radius:8px;background:#f0e9dd;flex-shrink:0"></div>';
      var medalla=idx===0?'<span style="background:#c4965a;color:#fff;font-size:.55rem;font-weight:700;padding:.1rem .45rem;border-radius:10px;margin-left:.4rem">★ TOP</span>':'';
      h+='<div onclick="_qzGo('+p.id+')" style="display:flex;gap:.7rem;align-items:center;padding:.6rem;border-radius:11px;cursor:pointer;border:1px solid #f0e9dd;margin-bottom:.5rem;background:#fff" onmouseover="this.style.background=\'#f7f0e4\'" onmouseout="this.style.background=\'#fff\'">'+
        img+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-weight:600;color:#3a2f22;font-size:.86rem;line-height:1.2">'+_dfEsc(_prodMl(nombre, p.ml))+medalla+'</div>'+
          (fam?'<div style="font-size:.68rem;color:#a9763f;margin-top:.12rem;font-style:italic">'+_dfEsc(fam)+'</div>':'')+
        '</div>'+
        (precioHtml?'<div style="flex-shrink:0;margin-left:.3rem">'+precioHtml+'</div>':'')+
        '<span style="color:#c4965a;font-size:1.1rem;flex-shrink:0">›</span>'+
      '</div>';
    });
  }
  h+='<button onclick="abrirQuiz()" style="margin-top:.6rem;width:100%;background:#3a2f22;border:none;color:#fff;border-radius:10px;padding:.65rem;font-size:.8rem;cursor:pointer">↻ Hacer el quiz de nuevo</button>';
  document.getElementById('qzCuerpo').innerHTML=h;
}
function _qzPrecioHtml(p){
  var r; try{r=calcP(p);}catch(e){return '';}
  if(!r) return '';
  function f(v){return (typeof fmt==='function')?fmt(v):('$'+Math.round(v||0).toLocaleString('es-AR'));}
  // Precio único (precio_pestana) → individual
  if(p.precio_pestana>0){
    return '<div style="font-weight:800;color:#3a2f22;font-size:.82rem;white-space:nowrap;text-align:right">'+f(p.precio_pestana)+'</div>';
  }
  // Cosmético con escala → primer precio
  if(p.tipo==='cosmetico' && Array.isArray(p.escala_unidades) && p.escala_unidades.length){
    var t0=p.escala_unidades[0]; var pr=(t0&&t0.precio)||r.pi||0;
    return '<div style="font-weight:800;color:#3a2f22;font-size:.82rem;white-space:nowrap;text-align:right">'+f(pr)+'</div>';
  }
  // Dinámico x1/x3/x10
  var parts=[];
  if(r.pi>0) parts.push('<span style="white-space:nowrap">Lista '+f(r.pi)+'</span>');
  if(r.pe>0) parts.push('<span style="white-space:nowrap">x3 '+f(r.pe)+'</span>');
  if(r.pm>0) parts.push('<span style="white-space:nowrap">x10 '+f(r.pm)+'</span>');
  if(!parts.length) return '';
  return '<div style="font-size:.64rem;color:#3a2f22;font-weight:700;text-align:right;line-height:1.55">'+parts.join('<br>')+'</div>';
}
function _qzGo(prodId){ cerrarQuiz(); _irAlCatalogoBelle(prodId); }
function _irAlCatalogoBelle(prodId){
  var p=(allProds||[]).find(function(x){return x.id===prodId;});
  if(!p){ if(typeof verFichaBelle==='function')verFichaBelle(prodId); return; }
  try{
    var srch=document.getElementById('srch');
    if(srch){ srch.value=(p.nombre||'').split('|')[0].trim(); }
    if(typeof applyFilters==='function') applyFilters();
  }catch(e){}
  setTimeout(function(){
    try{ _lvAsegurar(prodId); }catch(e){}
    var card=document.getElementById('card_'+prodId);
    if(card){
      card.scrollIntoView({behavior:'smooth',block:'center'});
      var prev=card.style.boxShadow;
      card.style.transition='box-shadow .3s';
      card.style.boxShadow='0 0 0 3px #c4965a';
      setTimeout(function(){card.style.boxShadow=prev||'';},1800);
    } else {
      window.scrollTo({top:0,behavior:'smooth'});
    }
  },200);
}

// 2026-06-26: senal unica de "el usuario esta buscando/filtrando" (buscador de texto + filtros).
// La usan applyFilters y renderDestacados para ocultar TODO lo decorativo mientras se busca.
function _hayBusquedaActiva(){
  try{
    var q=(document.getElementById("srch")||{value:""}).value.trim();
    var inspF=(document.getElementById("inspiradoFilter")||{value:""}).value||"";
    var notasI=(document.getElementById("notasSearchInput")||{value:""}).value.trim();
    return !!(q || famF || precioF || inspF ||
      (_acordesFiltro && _acordesFiltro.length) ||
      (_notasFiltro && _notasFiltro.length) || notasI);
  }catch(e){ return false; }
}

// 2026-08-30: búsqueda tolerante a errores de tipeo. Dos pasadas: primero
// firme (lo escrito aparece igual, sin espacios, o con el mismo sonido) y
// solo si no aparece nada se afloja permitiendo letras cambiadas.
// ── Clave fonética castellana ─────────────────────────────────────────
// La gente escribe los perfumes como los escucha: "asaro" por AZZARO,
// "llara" por Yara, "lataffa" por LATTAFA, "mairh" por Maahir. Esta
// función lleva las dos palabras al mismo sonido para poder compararlas:
// la h no suena, ll suena como y, z/c(e,i) suenan como s, v como b, y las
// letras repetidas valen por una sola.
function _fonEs(s){
  s = norm(s||'').replace(/[^a-z0-9 ]+/g,' ');
  s = s.replace(/h/g,'');            // hombre = ombre
  s = s.replace(/ll/g,'y');          // llave = yave
  s = s.replace(/y/g,'i');           // yara = iara (y llara tambien)
  s = s.replace(/qu/g,'k');          // quiero = kiero
  s = s.replace(/c([ei])/g,'s$1');   // cielo = sielo
  s = s.replace(/[ck]/g,'k');        // casa = kasa
  s = s.replace(/z/g,'s');           // zapato = sapato
  s = s.replace(/g([ei])/g,'j$1');   // gente = jente
  s = s.replace(/[vw]/g,'b');        // vaca = baka
  s = s.replace(/x/g,'ks');
  s = s.replace(/(.)\1+/g,'$1');     // lattafa = latafa, maahir = mahir
  return s.replace(/\s+/g,' ').trim();
}
// Distancia con transposición: "mairh" y "mahir" quedan a 1, no a 2.
function _levTrans(a,b,max){
  if(a===b) return 0;
  if(Math.abs(a.length-b.length)>max) return max+1;
  var prev2=null, prev=[], cur=[], i, j;
  for(j=0;j<=b.length;j++) prev[j]=j;
  for(i=1;i<=a.length;i++){
    cur=[i]; var mejor=i;
    for(j=1;j<=b.length;j++){
      var costo=(a.charAt(i-1)===b.charAt(j-1))?0:1;
      var v=Math.min(cur[j-1]+1, prev[j]+1, prev[j-1]+costo);
      if(i>1 && j>1 && a.charAt(i-1)===b.charAt(j-2) && a.charAt(i-2)===b.charAt(j-1)){
        v=Math.min(v, prev2[j-2]+1);
      }
      cur[j]=v; if(v<mejor)mejor=v;
    }
    if(mejor>max) return max+1;   // ya no puede bajar: se corta acá
    prev2=prev; prev=cur;
  }
  return prev[b.length];
}
function _tolDe(n){ return n>=8?3:(n>=6?2:1); }

// ── ¿El texto "matchea" lo que escribió el cliente, con errores? ──────
function _matchTolerante(texto, q){
  if(!texto||!q||q.length<3) return false;
  texto=String(texto); q=String(q);
  if(texto.indexOf(q)>=0) return true;
  // sin espacios: "badboy" encuentra "Bad Boy"
  var tSin=texto.replace(/\s+/g,''), qSin=q.replace(/\s+/g,'');
  if(qSin.length>=4 && tSin.indexOf(qSin)>=0) return true;
  // por sonido: "asaro" encuentra "AZZARO"
  var tf=_fonEs(texto), qf=_fonEs(q);
  if(qf.length>=3 && tf.indexOf(qf)>=0) return true;
  var tfSin=tf.replace(/\s+/g,''), qfSin=qf.replace(/\s+/g,'');
  if(qfSin.length>=4 && tfSin.indexOf(qfSin)>=0) return true;
  // Hasta acá la búsqueda es "firme": lo escrito aparece igual, sin
  // espacios o con el mismo sonido. Lo de abajo (letras cambiadas) solo se
  // habilita cuando la búsqueda firme no encontró NADA en todo el catálogo:
  // si no, buscar "yara" traía toda la marca AL HARAMAIN por parecerse a
  // "ara", y "maahir" traía todo MAISON por parecerse a "mais".
  if(!window._bqFuzzy) return false;
  // palabra por palabra: cada palabra que escribió tiene que aparecer en
  // alguna palabra del producto (entera, como prefijo, o con un par de
  // letras cambiadas). Así "yean lowe" llega a "Jean Lowe".
  var pal=qf.split(' ').filter(function(w){ return w.length>=3; });
  if(!pal.length) return false;
  var tpal=tf.split(' ').filter(Boolean);
  if(!tpal.length) return false;
  for(var i=0;i<pal.length;i++){
    var w=pal[i], tol=_tolDe(w.length), hallada=false;
    for(var k=0;k<tpal.length && !hallada;k++){
      var t=tpal[k];
      if(t.indexOf(w)===0 || w.indexOf(t)===0){ hallada=true; break; }
      // se compara contra el arranque de la palabra, del largo de lo escrito
      // el pedazo comparado arranca del largo de lo escrito: si no, "yara"
      // (4) contra "ara" (3) daba distancia 1 y matcheaba cualquier cosa
      var lo=w.length, hi=Math.min(t.length,w.length+tol);
      for(var L=lo;L<=hi;L++){
        if(_levTrans(w, t.slice(0,L), tol)<=tol){ hallada=true; break; }
      }
    }
    if(!hallada) return false;
  }
  return true;
}

// 2026-06-26: helpers reutilizables para que TODOS los buscadores (pestanas e inicio) encuentren
// por nombre + marca + dupe (con tolerancia a errores de tipeo), usando la misma logica.
function _dupeBlobDe(p){
  if(!p) return p;
  var _fLen=(window._fichasSB&&window._fichasSB.length)||0;
  if(!window._fichaPorProd || window._fichaPorProdN!==_fLen){
    var _ixF={};
    if(Array.isArray(window._fichasSB)){ window._fichasSB.forEach(function(f){ if(f&&f.producto_id && !_ixF[f.producto_id]) _ixF[f.producto_id]=f; }); }
    window._fichaPorProd=_ixF; window._fichaPorProdN=_fLen;
  }
  if(p._dupeBlobN!==_fLen){
    var _fi=(window._fichaPorProd||{})[p.id]||null, _full=[], _corto=[];
    try{
      var _fx={}; if(_fi){ for(var _k in _fi) _fx[_k]=_fi[_k]; } _fx.nombre=p.nombre; _fx.nombre_completo=p.nombre;
      var _arr=(typeof _dupesParec==='function')?_dupesParec(_fx):[];
      if(!(_arr&&_arr.length)){ var _u=(typeof _dupeParec==='function')?_dupeParec(_fx):''; _arr=_u?[_u]:[]; }
      _arr.forEach(function(d){ _full.push(d); _corto.push(d); });
    }catch(e){}
    if(_fi){
      if(_fi.inspirado_en_nombre){ _full.push(String(_fi.inspirado_en_nombre)); _corto.push(String(_fi.inspirado_en_nombre)); }
      if(_fi.inspirado_en){ _full.push(String(_fi.inspirado_en)); }
    }
    p._dupeBlob=norm(_full.join(' '));
    p._dupeBlobCorto=norm(p.nombre+' '+_corto.join(' '));
    p._dupeBlobN=_fLen;
  }
  return p;
}
function _prodMatcheaTexto(p, nq){
  if(!nq) return true;
  if(norm(p.nombre||'').indexOf(nq)>=0) return true;
  if(norm(p.empresa||'').indexOf(nq)>=0) return true;
  _dupeBlobDe(p);
  if(p._dupeBlob && p._dupeBlob.indexOf(nq)>=0) return true;
  if(nq.length>=4 && (_matchTolerante(p._dupeBlobCorto||'', nq) || _matchTolerante(norm(p.nombre||''), nq))) return true;
  return false;
}

// 2026-06-26: relevancia de un producto para el texto buscado. Mayor = mas parecido a lo escrito.
// Orden: nombre-prefijo > palabra-prefijo > nombre-contiene > marca > dupe-exacto > nombre-aprox > dupe-aprox.
function _relevanciaTexto(p, nq){
  if(!nq) return 0;
  var nom=norm(p.nombre||'');
  if(nom.indexOf(nq)===0) return 100;
  var pal=nom.split(/[^a-z0-9]+/);
  for(var i=0;i<pal.length;i++){ if(pal[i] && pal[i].indexOf(nq)===0) return 90; }
  if(nom.indexOf(nq)>=0) return 80;
  if(norm(p.empresa||'').indexOf(nq)>=0) return 60;
  _dupeBlobDe(p);
  if(p._dupeBlob && p._dupeBlob.indexOf(nq)>=0) return 40;
  if(nq.length>=4 && _matchTolerante(norm(p.nombre||''),nq)) return 30;
  if(nq.length>=4 && _matchTolerante(p._dupeBlobCorto||'',nq)) return 20;
  return 0;
}
// Aplica primero el orden normal (sortedProds) y luego, si hay texto, reordena por relevancia (estable).
// Qué tan lejos está un producto de lo que se escribió, por sonido. Se usa
// solo cuando la búsqueda fue aproximada: ahí la relevancia normal no sirve
// (buscó "savage" y ninguno dice "savage"), y hay que poner adelante al que
// más se le parece.
function _bqDistAprox(p, qf){
  var t=_fonEs((p&&p.nombre)||'')+' '+_fonEs((p&&p.empresa)||'');
  var tpal=t.split(' ').filter(Boolean);
  var qpal=String(qf||'').split(' ').filter(function(w){return w.length>=3;});
  if(!qpal.length||!tpal.length) return 99;
  var total=0;
  for(var i=0;i<qpal.length;i++){
    var w=qpal[i], mejor=99;
    for(var k=0;k<tpal.length;k++){
      var d=_levTrans(w, tpal[k].slice(0, Math.min(tpal[k].length, w.length+2)), 4);
      if(tpal[k].indexOf(w)===0) d=0;
      if(d<mejor)mejor=d;
    }
    total+=mejor;
  }
  return total/qpal.length;
}
function _ordenarConRelevancia(prods, q){
  var base=(typeof sortedProds==='function')?sortedProds(prods):(prods||[]).slice();
  var nq=norm(q||'');
  if(nq){
    if(window._bqFueFuzzy){
      var qf=_fonEs(nq);
      base.forEach(function(p){ p._aproxTmp=_bqDistAprox(p,qf); });
      base.sort(function(a,b){ return (a._aproxTmp||0)-(b._aproxTmp||0); });
      return base;
    }
    base.forEach(function(p){ p._relevTmp=_relevanciaTexto(p,nq); });
    base.sort(function(a,b){ return (b._relevTmp||0)-(a._relevTmp||0); });
  }
  return base;
}

function applyFilters(){
  var q=norm(document.getElementById("srch").value||"");
  var brand=document.getElementById("brandFilter").value;
  // ✨ NUEVO 2026-05-25: filtro "Inspirado en X"
  var inspF = (document.getElementById("inspiradoFilter") || {value:""}).value || "";
  // Mapa producto_id → inspirado_en_nombre (para búsqueda y filtro)
  var inspMap = {};
  if(Array.isArray(window._fichasSB)){
    window._fichasSB.forEach(function(f){
      if(f && f.producto_id && f.inspirado_en_nombre && String(f.inspirado_en_nombre).trim()){
        inspMap[f.producto_id] = String(f.inspirado_en_nombre).trim();
      }
    });
  }
  // 2026-06-26: indice ficha->producto (robusto, cacheado por cantidad de fichas).
  //   El "blob" de dupe de cada producto se calcula on-demand y se cachea en el propio
  //   producto (p._dupeBlob / p._dupeBlobCorto), invalidado por _fLen. Evita el bug del
  //   mapa global que quedaba vacio si applyFilters corria antes de cargar los productos.
  var _fLen=(window._fichasSB&&window._fichasSB.length)||0;
  if(!window._fichaPorProd || window._fichaPorProdN!==_fLen){
    var _ixF={};
    if(Array.isArray(window._fichasSB)){ window._fichasSB.forEach(function(f){ if(f&&f.producto_id && !_ixF[f.producto_id]) _ixF[f.producto_id]=f; }); }
    window._fichaPorProd=_ixF; window._fichaPorProdN=_fLen;
  }
  // Si hay busqueda activa O vista de favoritos O filtro de familia/precio, buscar en TODAS las pestanas
  // 🆕 2026-08: si venís del Buscador, mandan sus reglas: 'Todas' busca en todo el
  // catálogo y una colección elegida NO se abandona aunque filtres por familia/precio.
  var poolProds;
  if(window._bqTodas) poolProds=_rgPoolCatalogo();
  else if(window._bqCol) poolProds=getTabProds();
  else poolProds=(q||window._soloFavs||famF||precioF)?_rgPoolCatalogo():getTabProds();
  // Primero se busca firme. Si no aparece NADA, se repite aflojando la
  // tolerancia a errores de tipeo (ver _matchTolerante).
  window._bqFuzzy=false; window._bqFueFuzzy=false;
  var _filtroProd=function(p){
    if(window._soloFavs && _catFavs.indexOf(p.id)<0) return false;
    if(genF){var g=p.genero||"";var _fem=g.indexOf("\u2640")>=0,_mas=g.indexOf("\u2642")>=0,_uni=(!g)||(g==="U")||(_fem&&_mas)||/unisex/i.test(g);if(genF==="fem"&&!(_fem||_uni))return false;if(genF==="mas"&&!(_mas||_uni))return false;if(genF==="U"&&g!=="U")return false;}
    if(kitF && !_esKit(p)) return false;   // 2026-08-08: usa la regla única (_esKit)
    // 🏷️ 2026-08-08: marca por comparación normalizada — antes era startsWith textual
    // y "MONT BLANC" no encontraba los "MONTBLANC - ..." (ni variantes de mayúsculas).
    if(brand && !_prodEsDeMarca(p,brand))return false;
    // 🌸 Filtro por familia olfativa (chips)
    if(famF && !_prodEsFamilia(p,famF))return false;
    // 💲 Filtro por rango de precio (chips)
    if(precioF && !_prodEnRangoPrecio(p))return false;
    // ✨ Filtro "Inspirado en X" (match exacto contra el inspirado_en_nombre de la ficha)
    if(inspF){
      if(inspMap[p.id] !== inspF) return false;
    }
    if(q){
      // blob de dupe cacheado en el propio producto (invalidado por _fLen)
      if(p._dupeBlobN!==_fLen){
        var _fi=(window._fichaPorProd||{})[p.id]||null, _full=[], _corto=[];
        try{
          var _fx={}; if(_fi){ for(var _k in _fi) _fx[_k]=_fi[_k]; } _fx.nombre=p.nombre; _fx.nombre_completo=p.nombre;
          var _arr=(typeof _dupesParec==='function')?_dupesParec(_fx):[];
          if(!(_arr&&_arr.length)){ var _u=(typeof _dupeParec==='function')?_dupeParec(_fx):''; _arr=_u?[_u]:[]; }
          _arr.forEach(function(d){ _full.push(d); _corto.push(d); });
        }catch(e){}
        if(_fi){
          if(_fi.inspirado_en_nombre){ _full.push(String(_fi.inspirado_en_nombre)); _corto.push(String(_fi.inspirado_en_nombre)); }
          if(_fi.inspirado_en){ _full.push(String(_fi.inspirado_en)); } // descripcion: solo para substring
        }
        p._dupeBlob=norm(_full.join(' '));
        p._dupeBlobCorto=norm(p.nombre+' '+_corto.join(' '));
        p._dupeBlobN=_fLen;
      }
      var enNombre=norm(p.nombre).indexOf(q)>=0;
      var enEmpresa=norm(p.empresa||"").indexOf(q)>=0;
      // 2026-10-10: varias palabras en cualquier orden ("club woman" encuentra "Club de Nuit Woman")
      if(!enNombre&&!enEmpresa&&q.indexOf(' ')>0){ var _qw=q.split(/\s+/).filter(Boolean); var _hayQ=norm(p.nombre)+' '+norm(p.empresa||''); if(_qw.length>1&&_qw.every(function(w){ return _hayQ.indexOf(w)>=0; })) enNombre=true; }
      var enInsp = !!(p._dupeBlob && p._dupeBlob.indexOf(q)>=0);
      // tolerancia a errores de tipeo / prefijos aproximados (ej "invit" -> "invictus")
      if(!enNombre && !enEmpresa && !enInsp && q.length>=4){
        if(_matchTolerante(p._dupeBlobCorto||"", q) || _matchTolerante(norm(p.nombre), q)) enInsp=true;
      }
      if(!enNombre&&!enEmpresa&&!enInsp)return false;
    }
    if(_acordesFiltro&&_acordesFiltro.length){
      var match=_acordesFiltro.every(function(ac){
        var lbl=ACORDES_LABELS[ac]||ac;
        var inAcordes=Array.isArray(p.acordes)&&p.acordes.some(function(a){var an=typeof a==="string"?a:(a.nombre||"");return an.toLowerCase().indexOf(lbl.toLowerCase())>=0;});
        var inNotas=norm(p.notas||"").indexOf(norm(lbl))>=0;
        return inAcordes||inNotas;
      });
      if(!match)return false;
    }
    var notasQ=(document.getElementById("notasSearchInput")||{value:""}).value.toLowerCase().trim();
    if(notasQ){
      var inN=norm(p.notas||"").indexOf(notasQ)>=0;
      var inNom=norm(p.nombre).indexOf(notasQ)>=0;
      if(!inN&&!inNom)return false;
    }
    if(_notasFiltro&&_notasFiltro.length){var mn=_notasFiltro.every(function(nota){return norm(p.notas||"").indexOf(norm(nota))>=0||norm(p.nombre||"").indexOf(norm(nota))>=0;});if(!mn)return false;}
    return true;
  };
  var filtered=poolProds.filter(_filtroProd);
  if(q && !filtered.length){
    window._bqFuzzy=true;
    filtered=poolProds.filter(_filtroProd);
    window._bqFuzzy=false;
    window._bqFueFuzzy=filtered.length>0;
  }
  // document.getElementById("rcount").textContent=filtered.length+" productos";
  renderCombosEnCatalogo();
  if(curTab==="inicio" && !window._soloFavs){
    var _q=document.getElementById("srch").value||"";
    var _lc=document.getElementById("listContainer");
    var _hEl=document.getElementById("homePage");
    var _dc=document.getElementById("destacadosContainer");
    var _cs=document.getElementById("combosSecCat");
    if(_dc){_dc.style.display="none";_dc.innerHTML="";}
    if(_cs)_cs.style.display="none";
    // Inicio limpio: sin barra de filtros, sin tema/fondo de campaña (el carrusel SÍ se muestra arriba)
    var _cf=document.getElementById("catFilters"); if(_cf)_cf.style.display="none";
    document.body.classList.remove('catCampTemaActivo','catFondoActivo');
    var _ctm=document.getElementById('_catCampTema'); if(_ctm)_ctm.textContent='';
    var _cff=document.getElementById('catFondoFijo'); if(_cff)_cff.style.display='none';
    if(_q.trim() || famF || precioF){
      // Hay búsqueda o filtro activo — mostrar resultados y ocultar home
      if(_hEl)_hEl.style.display="none";
      if(_lc)_lc.style.display="";
      renderList(_ordenarConRelevancia(filtered, q));
    } else {
      // Sin búsqueda — mostrar home
      if(_lc)_lc.style.display="none";
      if(_hEl){ _hEl.style.display="block"; if(!_hEl.querySelector('#homeDynamic') && !_hEl.querySelector('.spin') && !_hEl.querySelector('button')) loadHomePage(); }
    }
    return;
  }
  // 💐 2026-09-25: pestaña de campaña con plantilla propia. Igual que en Inicio: si hay una
  // búsqueda o un filtro, se muestra la lista de resultados (de TODO el catálogo) y se esconde
  // la plantilla; al limpiar, vuelve la plantilla. En "Solo favoritos" también se esconde.
  var _plCamp=(typeof _campConPlantilla==='function')?_campConPlantilla(curTab):null;
  if(_plCamp){
    var _qP=(document.getElementById("srch").value||"").trim();
    var _mp=document.getElementById("madrePage"), _lcP=document.getElementById("listContainer");
    ['destacadosContainer','combosSecCat','pestanaSeccionesContainer','catFilters','campBannerCat'].forEach(function(id){ var e=document.getElementById(id); if(e)e.style.display="none"; });
    if(window._soloFavs || _qP || famF || precioF || (typeof _acordesFiltro!=='undefined'&&_acordesFiltro&&_acordesFiltro.length) || (typeof _notasFiltro!=='undefined'&&_notasFiltro&&_notasFiltro.length)){
      if(_mp)_mp.style.display="none"; document.body.classList.remove('madre-on');
      if(_lcP)_lcP.style.display="";
      if(!window._soloFavs){ renderList(_ordenarConRelevancia(filtered, q)); return; }
    } else {
      if(_lcP)_lcP.style.display="none";
      if(_mp){ _mp.style.display="block"; document.body.classList.add('madre-on'); if(!_mp.firstChild) renderMadre(_plCamp); }
      return;
    }
  }
  // FIX 2026-06-26: en pestanas de producto, mientras se busca/filtra se oculta TODO lo
  // decorativo (destacados, "Ultimos ingresos", "Mas vendidos", paneles y combos). Al limpiar
  // la busqueda se reconstruyen los destacados.
  var _hayBusqueda = _hayBusquedaActiva();
  var _destProd=document.getElementById("destacadosContainer");
  var _combProd=document.getElementById("combosSecCat");
  var _secProd=document.getElementById("pestanaSeccionesContainer");
  if(_hayBusqueda){
    if(_destProd){ _destProd.style.display="none"; }
    if(_combProd){ _combProd.style.display="none"; }
    if(_secProd){ _secProd.style.display="none"; }
  } else if(curTab==="arabes"||curTab==="internacionales"||curTab==="ofertas"){
    if(typeof renderDestacados==="function") renderDestacados(curTab);
  } else {
    if(typeof renderSeccionesPestana==="function") renderSeccionesPestana(curTab);
  }
  var _lc2=document.getElementById("listContainer");if(_lc2)_lc2.style.display="";
  // 🎁 2026-09-30: la pestaña Regalería se arma por familias (colores en una misma tarjeta)
  if(curTab==="regaleria" && !_hayBusqueda && !window._soloFavs){ _rgRenderPestana(_lc2); return; }
  renderList(_ordenarConRelevancia(filtered, q));
}

function getBrand(n){return n.indexOf(" - ")>-1?n.split(" - ")[0]:"";}
// 🏷️ 2026-08-08: comparación de marcas NORMALIZADA (sin mayúsculas/acentos/espacios).
// "MONT BLANC" y "Montblanc" son la misma marca — antes el filtro comparaba texto
// crudo con startsWith y algunas marcas no encontraban sus productos.
function _marcaCmpN(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');}
function _marcaDeProd(p){return (getBrand(p.nombre||'')||p.empresa||'');}
function _prodEsDeMarca(p,marca){return !!marca && _marcaCmpN(_marcaDeProd(p))===_marcaCmpN(marca);}
function genLabel(g){if(!g)return"Unisex";if(g.indexOf("\u2640")>=0)return"Femenino";if(g.indexOf("\u2642")>=0)return"Masculino";return"Unisex";}

// ¿Este producto tiene lugar fijo arriba en una campaña al aire? Devuelve el
// número (1 = primero) o null.
function _ordenArribaProd(p){
  try{
    var pres=_presDe(p, ofertaParaProducto(p.id));
    var esPrimero=(pres.estructuras||[]).indexOf('primero')>=0;
    // El de la campaña manda siempre; el propio solo si eligió "Primero en la pestaña".
    if(!(pres._ordenCamp || esPrimero)) return null;
    // Sin número igual va arriba, después de los numerados
    return (parseInt(pres.orden,10)>0) ? parseInt(pres.orden,10) : 9999;
  }catch(e){ return null; }
}
// Los de arriba van primero, en su orden; el resto queda como venía.
function _pxOrdenarArriba(prods){
  if(!Array.isArray(prods)||!prods.length) return prods;
  var arriba=[], resto=[];
  prods.forEach(function(p){ var n=_ordenArribaProd(p); if(n) arriba.push({p:p,n:n}); else resto.push(p); });
  if(!arriba.length) return prods;
  arriba.sort(function(a,b){ return a.n-b.n; });
  return arriba.map(function(x){ return x.p; }).concat(resto);
}
// ══ 🔗 Variantes agrupadas (2026-10-04): varios productos (colores, ml) en una sola tarjeta ══
// El grupo lo arma el admin en Belle (productos.grupo_id). Qué variante se muestra primero:
// 1) la que el cliente tocó, 2) la marcada "mostrar primero" (grupo_principal),
// 3) la de mejor oferta vigente, 4) la que más stock tiene.
window._grpSel=window._grpSel||{};
function _grpMiembros(p){
  if(!p||!p.grupo_id) return [p];
  var m=(allProds||[]).filter(function(x){ return x.grupo_id===p.grupo_id && x.activo!==false && !x.oculto; });
  if(!m.length) return [p];
  m.sort(function(a,b){ return (parseInt(a.ml)||0)-(parseInt(b.ml)||0) || a.id-b.id; });
  return m;
}
function _grpRatioOferta(p){
  try{
    var o=(typeof ofertaParaProducto==='function')?ofertaParaProducto(p.id):null; if(!o) return null;
    var r=calcP(p); var base=p.precio_min_ars||0; if(!(base>0)||!(r&&r.pi>0)) return null;
    return r.pi/base;
  }catch(e){ return null; }
}
function _grpRepresentante(miembros, candidatos){
  var pool=(candidatos&&candidatos.length)?candidatos:miembros;
  var gid=miembros[0]&&miembros[0].grupo_id;
  var sel=gid&&window._grpSel[gid];
  if(sel){ var s=miembros.filter(function(x){ return x.id===sel; })[0]; if(s) return s; }
  var pri=pool.filter(function(x){ return x.grupo_principal; })[0]||miembros.filter(function(x){ return x.grupo_principal; })[0];
  if(pri) return pri;
  var mejor=null, mr=null;
  pool.forEach(function(x){ var r=_grpRatioOferta(x); if(r!=null && (mr==null || r<mr)){ mr=r; mejor=x; } });
  if(mejor) return mejor;
  var top=pool.slice().sort(function(a,b){ return (b.stock_actual||0)-(a.stock_actual||0) || a.id-b.id; })[0];
  return top||pool[0];
}
function _grpColapsar(lista){
  var vistos={}, out=[];
  lista.forEach(function(p){
    if(!p.grupo_id){ out.push(p); return; }
    if(vistos[p.grupo_id]) return;
    vistos[p.grupo_id]=true;
    var m=_grpMiembros(p);
    var enLista=lista.filter(function(x){ return x.grupo_id===p.grupo_id; });
    out.push(_grpRepresentante(m, enLista));
  });
  return out;
}
function _grpEtiqueta(x){
  if(x.tipo==='regaleria'&&x.color) return x.color;
  if(x.ml) return x.ml+' ml';
  var m=String(x.nombre||'').match(/(\d+)\s*ml/i); if(m) return m[1]+' ml';
  return String(x.color||x.nombre||'').slice(0,18);
}
function _grpChipsHTML(p){
  if(!p||!p.grupo_id) return '';
  var m=_grpMiembros(p); if(m.length<2) return '';
  return "<div class='vgrp'>"+m.map(function(x){
    var act=x.id===p.id, off=(x.stock_actual||0)<=0;
    return "<button type='button' class='vgrp-chip"+(act?' act':'')+(off?' off':'')+"' onclick='_grpSwap("+p.grupo_id+","+x.id+","+p.id+");event.stopPropagation();' title='"+_catEsc(x.nombre||'')+(off?' (sin stock)':'')+"'>"+_catEsc(_grpEtiqueta(x))+"</button>";
  }).join('')+"</div>";
}
function _grpSwap(gid, pid, actualId){
  window._grpSel[gid]=pid;
  var np=(allProds||[]).filter(function(x){ return x.id===pid; })[0]; if(!np) return;
  var card=document.getElementById('card_'+actualId);
  if(!card){ try{ applyFilters(); }catch(e){} return; }
  var tmp=document.createElement('div'); tmp.innerHTML=renderCard(np, getCartTotalUnits());
  var nuevo=tmp.querySelector('#card_'+pid)||tmp.firstElementChild; if(!nuevo) return;
  card.parentNode.replaceChild(nuevo, card);
  try{ _pxObservar(); }catch(e){}
}
function renderList(prods){
  var container=document.getElementById("listContainer");
  if(!container)return;
  // 2026-10-08: el packaging que cae en una búsqueda se muestra con SUS tarjetas (packs, colores, unidades),
  // nunca como perfume suelto (antes entraba al carrito como perfume: sin packs, sin mínimo, sumaba al x3/x10).
  var rgProds=[]; if(typeof _rgEsReg==='function'){ rgProds=prods.filter(function(p){ return _rgEsReg(p); }); prods=prods.filter(function(p){ return !_rgEsReg(p); }); }
  prods=_pxOrdenarArriba(prods);
  prods=_grpColapsar(prods);   // 🔗 variantes agrupadas: una tarjeta por grupo
  var totalUnits=getCartTotalUnits();
  // 2026-10-19 (velocidad en celulares): antes se armaban TODAS las tarjetas de la pestaña de una (520 en Árabes,
  // 67.000 nodos, 14 s congelado en un celular viejo). Ahora van 24 y las demás se agregan solas a medida que
  // el cliente baja (sin botón). Búsqueda y filtros siguen trabajando sobre todo el catálogo.
  var html="";
  // Si lo que se muestra salió de la búsqueda con tolerancia, se avisa: el
  // cliente tiene que saber que no es lo que escribió tal cual.
  if(window._bqFueFuzzy && prods.length){
    var _qEsc=String((document.getElementById("srch")||{value:""}).value||"").replace(/</g,"&lt;");
    html = "<div style='grid-column:1/-1;background:rgba(196,150,90,.12);border:1px solid var(--accent,#c4965a);border-radius:9px;padding:.6rem .8rem;margin-bottom:.7rem;font-size:.8rem;color:var(--tx-main,#1a1a1a)'>"+
           "No encontré <b>&ldquo;"+_qEsc+"&rdquo;</b> tal cual. Te muestro lo más parecido:</div>";
  }
  var rgHtml=(rgProds.length && typeof _rgGridHTML==='function')?_rgGridHTML(rgProds):"";
  if(!prods.length && !rgHtml) html+="<p class='empty'>Sin resultados</p>";
  // misma lista que la vez anterior (p. ej. se agregó algo al carrito): se vuelven a dibujar las que ya se veían,
  // así el cliente no pierde el lugar donde estaba
  var sig=[typeof curTab!=='undefined'?curTab:'',(document.getElementById("srch")||{value:""}).value||'',window._soloFavs?1:0,prods.length,prods.length?prods[0].id:'',prods.length?prods[prods.length-1].id:''].join('|');
  var hasta=(sig===_lv.sig)?Math.max(_LV_LOTE,Math.min(_lv.n,prods.length)):_LV_LOTE;
  _lv.sig=sig; _lv.prods=prods; _lv.n=0; _lv.rg=rgHtml; _lv.rgPuesto=false; _lv.cont=container;
  container.innerHTML=html;
  _lvRenderHasta(hasta);
  window._lastRenderProds=prods;
}
// ── Lista progresiva ──
var _LV_LOTE=24;
var _lv={sig:null,n:0,prods:[],rg:'',rgPuesto:false,cont:null,obs:null};
function _lvSentinela(){ return _lv.cont?_lv.cont.querySelector('.lv-sent'):null; }
// dibuja las tarjetas hasta la posición `hasta` (sin pasar el total) y deja el centinela al final si faltan más
function _lvRenderHasta(hasta){
  var c=_lv.cont; if(!c) return;
  var prods=_lv.prods||[]; hasta=Math.min(Math.max(hasta||0,0),prods.length);
  if(hasta>_lv.n){
    var units=getCartTotalUnits();
    var trozo=prods.slice(_lv.n,hasta).map(function(p){ try{ return renderCard(p,units); }catch(e){ return ""; } }).join("");
    var sent=_lvSentinela(); if(sent) sent.remove();
    c.insertAdjacentHTML('beforeend',trozo);
    _lv.n=hasta;
  }
  var faltan=_lv.n<prods.length;
  if(faltan){
    var s2=_lvSentinela();
    if(!s2){ s2=document.createElement('div'); s2.className='lv-sent'; s2.setAttribute('aria-hidden','true'); }
    c.appendChild(s2);
    _lvObservar(s2);
  } else {
    var s3=_lvSentinela(); if(s3) s3.remove();
    if(_lv.rg && !_lv.rgPuesto){ _lv.rgPuesto=true; c.insertAdjacentHTML('beforeend',_lv.rg); }
  }
  try{ _pxTick(); _pxObservar(); }catch(e){}
}
function _lvMas(){ if(_lv.n<(_lv.prods||[]).length) _lvRenderHasta(_lv.n+_LV_LOTE); }
function _lvObservar(sent){
  if('IntersectionObserver' in window){
    if(!_lv.obs) _lv.obs=new IntersectionObserver(function(es){ if(es.some(function(e){ return e.isIntersecting; })) _lvMas(); },{rootMargin:'1400px 0px'});
    _lv.obs.disconnect(); _lv.obs.observe(sent);
  } else if(!_lv.scrollL){
    _lv.scrollL=true;
    window.addEventListener('scroll',function(){ var se=_lvSentinela(); if(se && se.getBoundingClientRect().top<window.innerHeight+1400) _lvMas(); },{passive:true});
  }
}
// si un producto de la lista todavía no se dibujó (está más abajo), se dibuja hasta él: lo usan "ir al producto" y los links
function _lvAsegurar(id){
  var prods=_lv.prods||[]; if(!prods.length) return false;
  var pr=(allProds||[]).find(function(x){ return x.id===id; }); var gid=pr&&pr.grupo_id;
  var i=-1; for(var k=0;k<prods.length;k++){ var p=prods[k]; if(p.id===id || (gid&&p.grupo_id===gid)){ i=k; break; } }
  if(i<0) return false;
  if(i>=_lv.n) _lvRenderHasta(i+_LV_LOTE);
  return true;
}


function _notaFotoBusca(nom){
  if(typeof getNotaFoto!=='function') return '';
  var def=(typeof NOTAS_FOTOS!=='undefined')?NOTAS_FOTOS['_default']:null;
  var f=getNotaFoto(nom); if(f && f!==def) return f;
  var limpio=String(nom||'').replace(/\b(de|del|la|el|los|las|y|con|al|un|una)\b/gi,' ').replace(/\s+/g,' ').trim();
  if(limpio){ var f2=getNotaFoto(limpio); if(f2 && f2!==def) return f2; }
  var pals=limpio.split(' ').filter(function(w){return w.length>3;}).sort(function(a,b){return b.length-a.length;});
  for(var i=0;i<pals.length;i++){ var fp=getNotaFoto(pals[i]); if(fp && fp!==def) return fp; }
  return f||'';
}
function formatNotasFotos(raw){
  if(!raw||!raw.trim())return "";
  var txt=raw.replace(/\r/g,"");
  var keywords=["Notas de salida","Notas de coraz\u00f3n","Notas de corazon","Notas de fondo","Notas de cabeza","Notas de base","Notas de inicio"];
  keywords.forEach(function(kw){ try{ txt=txt.replace(new RegExp('(?<!^)(?='+kw+')','gi'),'\n'); }catch(e){} });
  var parts=txt.split(/\n/), out="", fase="", buf=[];
  function flush(){
    if(!buf.length) return;
    out+="<div class='cnf-fase'>"+(fase?"<div class='cnf-h'>"+fase+"</div>":"")+"<div class='cnf-grid'>"+
      buf.map(function(nom){
        // \uD83C\uDF38 FIX 2026-08-08: primero el resolver \u00FAnico (notas_maestras) y despu\u00E9s el difuso
        var foto=(typeof notaFotoDe==='function')?notaFotoDe(nom):'';
        if(!foto)foto=_notaFotoBusca(nom);
        var cell="<div class='cnf-img'>"+(foto?"<img src='"+foto+"' alt='' loading='lazy' onerror=\"this.parentNode.innerHTML='\uD83C\uDF38'\">":"\uD83C\uDF38")+"</div>";
        return "<div class='cnf-cell'>"+cell+"<div class='cnf-nom'>"+nom+"</div></div>";
      }).join("")+"</div></div>";
    buf=[];
  }
  parts.forEach(function(line){
    line=line.trim(); if(!line) return;
    var m=line.match(/^(Notas de [^:]+):?\s*(.*)$/i);
    if(m){ flush(); fase=m[1].replace(/^Notas de\s*/i,'').replace(/[:]+$/,'').trim(); (m[2]||'').split(/[,;]/).forEach(function(x){x=x.trim();if(x)buf.push(x);}); }
    else { line.split(/[,;]/).forEach(function(x){x=x.trim();if(x)buf.push(x);}); }
  });
  flush();
  return out || formatNotas(raw);
}
function formatNotas(raw){
  if(!raw||!raw.trim())return "";
  var txt=raw.replace(/\r/g,"");
  // Split on newlines OR on "Notas de X:" pattern within same line
  var keywords=["Notas de salida","Notas de coraz\u00f3n","Notas de corazon","Notas de fondo","Notas de cabeza","Notas de base","Notas de inicio","El set incluye"];
  // Insert newline before each keyword that appears mid-text
  keywords.forEach(function(kw){
    var re=new RegExp('(?<!^)(?='+kw+')','gi');
    txt=txt.replace(re,'\n');
  });
  var parts=txt.split(/\\n|\n/);
  var html="";
  parts.forEach(function(line){
    line=line.trim();
    if(!line)return;
    var low=line.toLowerCase();
    var isHeader=
      low.indexOf("notas de salida")===0||
      low.indexOf("notas de coraz")===0||
      low.indexOf("notas de fondo")===0||
      low.indexOf("notas de cabeza")===0||
      low.indexOf("notas de base")===0||
      low.indexOf("notas de inicio")===0||
      low.indexOf("el set incluye")===0;
    if(isHeader){
      var colonIdx=line.indexOf(":");
      var header=colonIdx>-1?line.slice(0,colonIdx).trim():line.trim();
      var rest=colonIdx>-1?line.slice(colonIdx+1).trim():"";
      html+="<div style='margin-top:.35rem'><strong style='color:var(--charcoal)'>"+escHtml(header)+":</strong>"+(rest?" "+escHtml(rest):"")+"</div>";
    } else {
      html+="<div style='margin-top:.15rem'>"+escHtml(line)+"</div>";
    }
  });
  return html;
}
function escHtml(str){
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function parseProductTags(nombre){
  var tipos=/\b(EDP|EDT|EDC|Extract|Extrait|Elixir|Parfum|Cologne)\b/i;
  var mls=/(\d+)\s*ml/i;
  var tipo=(nombre.match(tipos)||[])[0]||'';
  var ml=(nombre.match(mls)||[])[0]||'';
  return{tipo:tipo.toUpperCase(),ml:ml};
}

function _mkKey(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
// ── Helpers ML (2026-07): mostrar los mililitros en TODOS lados ──
var _ML_ID={}, _ML_NOM={};
function _mlNorm(s){ return String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim(); }
function _mlIndexar(lista){
  try{
    (Array.isArray(lista)?lista:[]).forEach(function(p){
      if(!p) return;
      var ml=parseInt(p.ml,10)||0;
      if(p.id!=null) _ML_ID[p.id]=ml;
      if(p.nombre){ var n=_mlNorm(p.nombre); _ML_NOM[n]=ml; _ML_NOM[n.replace(/\s*\u00b7\s*\d+\s*ml$/i,'')]=ml; }
    });
  }catch(e){}
}
function _mlDe(id){ if(id==null||id==='') return 0; var v=_ML_ID[id]; if(v) return v; try{ var a=(typeof allProds!=='undefined'&&allProds)?allProds:(typeof prods!=='undefined'&&prods?prods:[]); var p=a.find(function(x){return x.id==id;}); return p?(parseInt(p.ml,10)||0):0; }catch(e){ return 0; } }
function _mlNom(nombre){ if(!nombre) return 0; var n=_mlNorm(nombre); return _ML_NOM[n]||_ML_NOM[n.replace(/\s*\u00b7\s*\d+\s*ml$/i,'')]||0; }
function _prodMl(nombre, ml){ nombre=(nombre==null?'':String(nombre)); ml=parseInt(ml,10)||0; if(!ml) ml=_mlNom(nombre); return (ml>0 && !/\d+\s*ml\b/i.test(nombre)) ? (nombre+" \u00b7 "+ml+"ML") : nombre; }
function _nomMl(nombre,id){ nombre=(nombre==null?'':String(nombre)); var ml=id?_mlDe(id):0; if(!ml) ml=_mlNom(nombre); return (ml>0 && !/\d+\s*ml\b/i.test(nombre)) ? (nombre+" \u00b7 "+ml+"ML") : nombre; }
// ════════════════════════════════════════════════════════════════════
// ➕ "Incluye:" — qué trae el producto además del perfume (2026-08-08)
// ════════════════════════════════════════════════════════════════════
// Se arma con dos cosas que carga el editor:
//   1) kit_componentes → perfumes del catálogo linkeados (el 1º es el principal)
//   2) agregados       → textos libres (desodorante, gel de ducha, etc.)
// ════════════════════════════════════════════════════════════════════
function _jsonArr(v){
  try{ if(typeof v==='string'){ v=v.trim(); v=v?JSON.parse(v):[]; } }catch(e){ return []; }
  return Array.isArray(v)?v:[];
}
function _prodAgregados(p){
  return _jsonArr(p&&p.agregados).map(function(x){ return String(x==null?'':x).trim(); }).filter(Boolean);
}
// Nombre "de vitrina": sin la marca adelante y sin los | EDP | 100ml |
function _prodNombreCorto(p){
  var n=String((p&&p.nombre)||'');
  var br='';
  try{ br=(typeof getBrand==='function')?(getBrand(n)||''):''; }catch(e){}
  if(br && n.indexOf(br+' - ')===0) n=n.slice(br.length+3);
  n=n.replace(/\s*\|[^|]+\|?\s*/g,' ').replace(/\s{2,}/g,' ').trim();
  return n || String((p&&p.nombre)||'');
}
function _prodIncluye(p){
  var out=[];
  _jsonArr(p&&p.kit_componentes).forEach(function(id){
    var c=(allProds||[]).find(function(x){ return Number(x.id)===Number(id); });
    if(c) out.push(_prodNombreCorto(c));
  });
  _prodAgregados(p).forEach(function(t){ out.push(t); });
  return out;
}
// ¿Es un kit? Vale por lo cargado en el editor o porque el nombre lo dice.
function _esKit(p){
  if(!p) return false;
  if(_prodAgregados(p).length) return true;
  if(_jsonArr(p.kit_componentes).length) return true;
  try{ return /\bkits?\b/.test(norm(p.nombre||'')); }catch(e){ return false; }
}


// ════════════════════════════════════════════════════════════════════
// 🖼️ GALERÍA EN LA CARD (2026-10-03): si el producto tiene fotos extra (productos.fotos),
// pasan solas cada fotos_seg segundos con el efecto fotos_efecto (fundido / deslizar / zoom / manual).
// Un toque frena 8 s y pasa a la siguiente. Respeta "reducir movimiento".
// ════════════════════════════════════════════════════════════════════
function _galFotos(p){
  var out=[]; if(p.imagen_url) out.push(p.imagen_url);
  (Array.isArray(p.fotos)?p.fotos:[]).forEach(function(u){ if(u&&out.indexOf(u)<0) out.push(u); });
  return out;
}
function _galHTML(p){
  var fs=_galFotos(p); if(fs.length<2) return '';
  var ef=p.fotos_efecto||'fundido', seg=parseFloat(p.fotos_seg)||3.5;
  return "<div class='cgal ef-"+ef+"' data-seg='"+seg+"' data-pid='"+p.id+"'>"+
    fs.map(function(u,i){ return "<img src='"+String(u).replace(/'/g,'%27')+"' alt='' loading='lazy' decoding='async' class='"+(i===0?'act':'')+"' onerror='this.classList.add(\"rota\")'>"; }).join('')+
    "<span class='cgal-dots'>"+fs.map(function(_,i){ return "<i class='"+(i===0?'act':'')+"' onclick='_galIr(this,"+i+")'></i>"; }).join('')+"</span>"+
    "<button type='button' class='cgal-n' onclick='_galPaso(this,1)' aria-label='Siguiente foto'>›</button>"+
    "<button type='button' class='cgal-n cgal-p' onclick='_galPaso(this,-1)' aria-label='Foto anterior'>‹</button>"+
  "</div>";
}
function _galSet(g,nx){
  var imgs=g.querySelectorAll('img'), dots=g.querySelectorAll('.cgal-dots i'); if(!imgs.length) return;
  nx=(nx+imgs.length)%imgs.length;
  imgs.forEach(function(im,i){ im.classList.toggle('act',i===nx); im.classList.toggle('prev',false); }); dots.forEach(function(d,i){ d.classList.toggle('act',i===nx); });
}
function _galActual(g){ var c=0; g.querySelectorAll('img').forEach(function(im,i){ if(im.classList.contains('act')) c=i; }); return c; }
function _galPaso(el,d){ var g=el.closest('.cgal'); if(!g) return; _galSet(g,_galActual(g)+d); g._pausa=Date.now(); try{ event&&event.stopPropagation&&event.stopPropagation(); }catch(e){} }
function _galIr(el,i){ var g=el.closest('.cgal'); if(!g) return; _galSet(g,i); g._pausa=Date.now(); try{ event&&event.stopPropagation&&event.stopPropagation(); }catch(e){} }
(function(){
  var reduce=false; try{ reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  if(reduce) return;
  setInterval(function(){
    if(document.hidden) return;
    var ahora=Date.now();
    document.querySelectorAll('.cgal').forEach(function(g){
      if(g.classList.contains('ef-manual')) return;
      if(g._pausa && ahora-g._pausa<8000) return;
      var seg=(parseFloat(g.getAttribute('data-seg'))||3.5)*1000;
      if(!g._t) g._t=ahora;
      if(ahora-g._t<seg) return;
      g._t=ahora; _galSet(g,_galActual(g)+1);
    });
  },500);
})();

function renderCard(p,totalUnits){
  var id=p.id;var r=calcP(p);
  var br=getBrand(p.nombre);var sn=br?p.nombre.replace(br+" - ",""):p.nombre;var _mkLogo=(p.empresa&&String(p.empresa).trim())?String(p.empresa).trim():br;
  var st=cstate[id]||{qty:0};var ic=cart[id];
  var stockTotal=p.stock_actual||0;var nostock=stockTotal===0;var nid="n_"+id;
  // Mejora 9: stock libre real (descontar reservas)
  // El stock_actual ya descuenta reservas porque cuando se reserva se hace stock_actual-=qty.
  // Pero en algunas tablas reservadas se mantienen en .reserva separada. Mostramos siempre el más confiable.
  var stockLibre = stockTotal; // ya descontada reserva
  var stockReservado = (p.reserva||0);
  var stockTotalReal = stockLibre + stockReservado; // total físico
  // Indicador "queda 1" — SOLO para clientes CC, y SOLO cuando queda exactamente 1.
  // Razón: los clientes regulares y no-logueados no necesitan ver esta alerta;
  // y solo cuando es la última unidad genera urgencia genuina (no falsa).
  // No mostramos info de reservas/apartadas — eso es interno, no para el cliente.
  var _isCCStock = !!(typeof _catCliente !== "undefined" && _catCliente && _catCliente.cuenta_corriente_habilitada);
  var stockBajoHtml = "";
  if(_isCCStock && stockLibre === 1){
    stockBajoHtml = "<div style='font-size:.62rem;color:#c5443a;font-weight:600;margin-top:.15rem'>⚠️ ¡Queda solo 1!</div>";
  }
  // Acordes chart (2026-10-19: las barras se arman al abrir; antes cada tarjeta traía 7 barras escondidas)
  var acordesHtml="";
  try {
    var acList=Array.isArray(p.acordes)?p.acordes:(p.acordes?JSON.parse(p.acordes):[]);
    if(Array.isArray(acList)&&acList.length){
      acordesHtml="<div class='ac-tog' onclick='togAcordes(\""+nid+"_ac\",this)'>+ Acordes principales</div>"+
        "<div class='ac-wrap' id='"+nid+"_ac' data-lazy='1' style='display:none'></div>";
    }
  } catch(e){}
  var previewUnits=totalUnits+(st.qty||0)-(ic&&!ic.isDecan?ic.qty:0);
  var bestSeg=previewUnits>0?getBestSeg(previewUnits,r):"none";
  // Cliente con CC habilitada o precio_mayorista: forzar visualmente x10 destacado + x3/x1 tachados
  // 🎯 FEAT 2026-05-22: precio_mayorista activa la misma vista VIP que CC.
  var _isCC = !!(typeof _catCliente!=="undefined" && _catCliente && (_catCliente.cuenta_corriente_habilitada || _catCliente.precio_mayorista) && r.pm);
  var segs=["pm","pe","pi"];var segLabels=_segRotulos();
  // 🎯 FEAT 2026-05-22: banner de mínimo en card usa helper unificado con ✓/⚠ y cuánto falta
  var minGrupo=p.min_grupo||"";var minCant=parseInt(p.min_cantidad)||0;
  var minNoticeHtml="";
  if(minGrupo && minCant>0){
    // Calcular cuántas unidades del grupo lleva el cliente actualmente en el carrito.
    // Si el producto pertenece a un grupo, el mínimo se cumple sumando todos los productos
    // del mismo grupo + los perfumes "normales" (sin grupo) del carrito.
    var _grpUnidades = 0;
    var _perfsNormales = 0;
    Object.values(cart).forEach(function(ci){
      if(ci.isDecan||ci.isCombo) return;
      var cp = allProds.find(function(x){return x.id===ci.id;});
      if(!cp) return;
      if(cp.min_grupo === minGrupo) _grpUnidades += ci.qty;
      else if(!cp.min_grupo) _perfsNormales += ci.qty;
    });
    var _totalEfec = _grpUnidades + _perfsNormales;
    var _resMin = _msgMinimo({
      prefijo: 'Grupo "'+minGrupo+'"',
      modo: 'unidades',
      minUnidades: minCant,
      minMonto: 0,
      unidadesActuales: _totalEfec,
      montoActual: 0,
      compacto: true
    });
    if(_resMin.html){
      minNoticeHtml = "<div style='border:1px solid rgba(232,160,40,.35);border-radius:7px;padding:.4rem .55rem;background:rgba(232,160,40,.06)'>"+_resMin.html+"</div>";
    } else {
      // Cumple — mostrar tick verde discreto
      minNoticeHtml = "<div style='font-size:.7rem;color:#3a8a4a;text-align:center;padding:.2rem;font-weight:600'>✓ Mínimo del grupo "+minGrupo+" cumplido</div>";
    }
  }
  // Si tiene precio unico (precio_pestana), mostrar un solo recuadro
  var _pUnico=p.precio_pestana||0;
  // Detectar si hay oferta vigente (la oferta ya está aplicada en r — ver calcP)
  // 2026-10-25: con precio único no hay oferta que valga (misma regla que addCart y que Ventas)
  var _hasOferta=!!(r.oferta&&!r.oferta_descartada_por_cc)&&!(_pUnico>0);
  // r.oferta queda disponible también cuando el precio VIP la descartó (para poder
  // vestir la card de campaña dentro de su pestaña sin tocar el precio).
  var _oferta=r.oferta||null;
  var _ofCol=_ofertaColores(r.oferta);
  var _ofTxt=_ofCol.texto, _ofBox=_ofCol.recuadro;
  var popts;
  // Sin stock: no mostrar precios
  if(nostock){
    popts="";
  } else if(p.tipo==='cosmetico' && Array.isArray(p.escala_unidades) && p.escala_unidades.length){
    // Cosmético: cada opción de caja es un BOTÓN "+ Agregar" → addCosm (suma una caja y optimiza)
    popts=p.escala_unidades.map(function(t,i){
      var cant=t.cant||1; var precio=t.precio||0;
      var lbl=cant<=1?"1 unidad":("Caja x"+cant);
      return "<button type='button' class='popt cosm-opt' onclick='addCosm("+id+","+cant+","+precio+")' style='cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:.05rem;background:var(--bg-body)'>"+
        "<span class='pol'>"+lbl+"</span>"+
        "<span class='pov'>"+fmt(precio)+"</span>"+
        "<span style='font-size:.52rem;color:var(--accent);font-weight:800;letter-spacing:.04em'>+ AGREGAR</span>"+
        "</button>";
    }).join("");
  } else if(_hasOferta && r.oferta_tipo==='precio_unico'){
    // Oferta de precio único: mostrar un solo recuadro grande con el precio plano + tachado el original
    var precioOriginal=r.pi_orig||r.pe_orig||r.pm_orig||0;
    popts="<div class='popt lit' style='grid-column:1/-1;justify-content:center;border:2px solid "+_ofBox+";background:"+_ofBox+"1f'>"+
      "<span class='pol' style='color:"+_ofTxt+";font-weight:700;letter-spacing:.04em'>"+(_oferta.etiqueta||'OFERTA')+"</span>"+
      "<span class='pov' style='font-weight:700;color:"+_ofTxt+"'>"+fmt(r.precio_unico)+"</span>"+
      (precioOriginal>r.precio_unico?"<div style='font-size:.62rem;color:#999;text-decoration:line-through;margin-top:.15rem'>"+fmt(precioOriginal)+"</div>":"")+
    "</div>";
  } else if(_hasOferta && (r.oferta_tipo==='x10_sin_minimo'||r.oferta_tipo==='x3_sin_minimo')){
    // x10/x3 sin mínimo: muestra el precio efectivo destacado, los demás tachados (estilo CC)
    var efectivo=r.precio_efectivo||'pm';
    popts=segs.map(function(s,i){
      if(s==="pi"&&minGrupo&&minCant>=3)return"";
      if(s==="pe"&&minGrupo&&minCant>=10)return"";
      var v=r[s];
      if(!v)return"<div class='popt dis'><span class='pol'>"+segLabels[i]+"</span><span class='pov'>-</span></div>";
      if(s===efectivo){
        return "<div class='popt lit' style='border:2px solid "+_ofBox+";background:"+_ofBox+"1f'>"+
          "<span class='pol' style='color:"+_ofTxt+";font-weight:700;letter-spacing:.04em'>"+(_oferta.etiqueta||'OFERTA')+"</span>"+
          "<span class='pov' style='font-weight:700;color:"+_ofTxt+"'>"+fmt(v)+"</span>"+
        "</div>";
      } else {
        return "<div class='popt' style='opacity:.6'>"+
          "<span class='pol'>"+segLabels[i]+"</span>"+
          "<span class='pov' style='color:#c97a82;text-decoration:line-through;text-decoration-color:#c97a82;text-decoration-thickness:1px'>"+fmt(v)+"</span>"+
        "</div>";
      }
    }).join("");
  } else if(_hasOferta && r.oferta_tipo==='descuento_pct'){
    // Descuento %: mantiene los 3 tramos pero pinta cada uno con tachado del precio original
    popts=segs.map(function(s,i){
      if(s==="pi"&&minGrupo&&minCant>=3)return"";
      if(s==="pe"&&minGrupo&&minCant>=10)return"";
      var v=r[s];
      var vOrig=r[s+'_orig']||v;
      if(!v)return"<div class='popt dis'><span class='pol'>"+segLabels[i]+"</span><span class='pov'>-</span></div>";
      var lit=(bestSeg===s)?" lit":"";
      var litStyle=(bestSeg===s)?"border:2px solid "+_ofBox+";background:"+_ofBox+"15;":"";
      return "<div class='popt"+lit+"' style='"+litStyle+"'>"+
        "<span class='pol'>"+segLabels[i]+"</span>"+
        "<span class='pov' style='color:"+_ofTxt+";font-weight:700'>"+fmt(v)+"</span>"+
        (vOrig>v?"<div style='font-size:.55rem;color:#999;text-decoration:line-through'>"+fmt(vOrig)+"</div>":"")+
      "</div>";
    }).join("");
  } else if(_pUnico>0){
    popts="<div class='popt lit' style='grid-column:1/-1;justify-content:center'>"+"<span class='pol'>Precio único</span><span class='pov'>"+fmt(_pUnico)+"</span></div>";
  } else if(_isCC){
    // Modo CC: x10 destacado grande, x3/x1 tachados como referencia
    popts=segs.map(function(s,i){
      if(s==="pi"&&minGrupo&&minCant>=3)return"";
      if(s==="pe"&&minGrupo&&minCant>=10)return"";
      var v=r[s];
      if(!v)return"<div class='popt dis'><span class='pol'>"+segLabels[i]+"</span><span class='pov'>-</span></div>";
      if(s==="pm"){
        return "<div class='popt lit' style='border:2px solid #b89e6e;background:rgba(184,158,110,.18)'>"+
          "<span class='pol' style='color:#8a6f3a;font-weight:700;letter-spacing:.04em'>PRECIO VIP</span>"+
          "<span class='pov' style='font-weight:700'>"+fmt(v)+"</span>"+
          "</div>";
      } else {
        return "<div class='popt' style='opacity:.75'>"+
          "<span class='pol'>"+segLabels[i]+"</span>"+
          "<span class='pov' style='color:#c97a82;text-decoration:line-through;text-decoration-color:#c97a82;text-decoration-thickness:1px'>"+fmt(v)+"</span>"+
          "</div>";
      }
    }).join("");
  } else {
    popts=segs.map(function(s,i){
      if(s==="pi"&&minGrupo&&minCant>=3)return"";
      if(s==="pe"&&minGrupo&&minCant>=10)return"";
      var v=r[s];
      if(!v)return"<div class='popt dis'><span class='pol'>"+segLabels[i]+"</span><span class='pov'>-</span></div>";
      var isMin=(s==="pe"&&minCant>=3&&minCant<10)||(s==="pm"&&minCant>=10);
      var lit=(bestSeg===s||isMin)?" lit":"";
      return"<div class='popt"+lit+"'><span class='pol'>"+segLabels[i]+"</span><span class='pov'>"+fmt(v)+"</span></div>";
    }).join("");
  }
  var decanHtml="", kitDecHtml="";
  // precio_decan=-1 = sin decan (tilde destildado en admin)
// precio_decan=0/null = auto-calcular precio
// precio_decan>0 = precio manual
// 🆕 Decants habilitados aunque el perfume no tenga stock (decisión de negocio):
// se permite vender decant aunque el frasco completo no esté disponible.
if(_esKit(p)&&_jsonArr(p.kit_componentes).length){
    // 🧪 KIT (2026-08-27): el precio de decant único confundía (parecía el precio de TODOS los
    // decants del kit). Ahora: botón que abre un modal con el decant de CADA perfume del kit.
    // ⚠️ FIX: va en su PROPIA fila (kitDecHtml), NO dentro de .prices-row — ahí es flex nowrap
    // y un botón ancho aplastaba los precios x10/x3/x1.
    kitDecHtml="<button onclick='event.stopPropagation();_kitDecansModal("+id+")' style='display:block;width:100%;box-sizing:border-box;margin-top:.4rem;background:rgba(196,150,90,.07);border:1.5px solid rgba(196,150,90,.5);color:#a9763f;border-radius:9px;padding:.45rem .4rem;font-size:.72rem;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.2'>🧪 Comprar decants de este kit</button>";
  } else if(r.decan>0&&p.precio_decan!==-1){
    var dq=decanState[id]!==undefined?decanState[id]:0;
    var inCartDecan=cart["decan_"+id];
    // Decan box with inline qty controls to its right
    decanHtml="<div class='decan-sep'></div>"+
      "<div class='dc-wrap'>"+
      "<div class='dc-price'>"+
      "<span class='decan-lbl'>Decan 5ml</span>"+
      "<span class='decan-val'>"+fmt(r.decan)+"</span>"+
      (inCartDecan?"<div class='dc-tag'>"+inCartDecan.qty+" pedidos</div>":"<div class='dc-tag' style='opacity:0'>-</div>")+
      "</div>"+
      "<div class='dc-qty'>"+
      "<button class='dc-btn' onclick='chgDecan("+id+",-1)'>-</button>"+
      "<span class='dc-num' id='dq-"+id+"'>"+dq+"</span>"+
      "<button class='dc-btn' onclick='chgDecan("+id+",1)'>+</button>"+
      "<button class='dc-add' onclick='addDecan("+id+")'>+carrito</button>"+
      "</div>"+
      "</div>";
  }
  var appliedHtml="";
  if(st.qty>0&&bestSeg!=="none"){
    // Si hay oferta vigente, mostrar la etiqueta de la oferta en lugar del tramo de precio
    var segN;
    if(_hasOferta){
      segN="🔥 "+(_oferta.etiqueta||"Oferta");
    } else {
      segN=_isCC?"Precio VIP":(bestSeg==="pm"?"Precio x10":bestSeg==="pe"?"Precio x3":"Precio de lista");
    }
    appliedHtml="<div class='price-applied'>"+segN+(_hasOferta?" aplicada":" aplicado")+"</div>";
  }
  var decanQtyHtml="";
  var inCartDecan=cart["decan_"+id];
  // Etiqueta / badge automático
  var _etiq=p.etiqueta||"";
  // RE-INGRESO automático: si reingresó en los últimos 5 días
  if(!_etiq&&p.reingreso_at){
    var _diasReing=Math.floor((Date.now()-new Date(p.reingreso_at).getTime())/864e5);
    if(_diasReing<=5)_etiq="RE-INGRESO";
  }
  if(!_etiq&&p.created_at){
    var _dias=Math.floor((Date.now()-new Date(p.created_at).getTime())/864e5);
    if(_dias<=7)_etiq="NOVEDAD";
  }
  // ÚLTIMAS UNIDADES automático: stock libre bajo y sin otra etiqueta. (No pisa etiqueta manual / RE-INGRESO / NOVEDAD.)
  // Umbral configurable: cambiá el número de _STOCK_BAJO_BADGE por el que quieras.
  var _STOCK_BAJO_BADGE = 3;
  if(!_etiq && stockLibre > 0 && stockLibre <= _STOCK_BAJO_BADGE){ _etiq="ULTIMAS UNIDADES"; }
  var _etColors={"RE-INGRESO":"#e08c3c","NOVEDAD":"#c4965a","OFERTA":"#4caf82","ULTIMAS UNIDADES":"#e05c5c","LANZAMIENTO":"#5b8dee","EXCLUSIVO":"#9b59b6"};
  var _etBg=_etColors[_etiq]||"#5b8dee";
  var _etBadge=_etiq?"<div style='position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:5;background:"+_etBg+";color:#fff;font-size:.5rem;font-weight:700;letter-spacing:.1em;padding:.14rem .42rem;border-radius:0 0 5px 5px;text-transform:uppercase;white-space:nowrap;box-shadow:0 2px 5px rgba(0,0,0,.3)'>"+_etiq+"</div>":"";

  // Badge de oferta (arriba a la derecha) — más prominente que la etiqueta normal
  // Si no hay stock, NO mostrar oferta (sería confuso ofrecer algo que no se puede vender).
  // 👑 2026-08-14 (Ger): al cliente VIP/x10 la oferta se le descarta cuando su precio
  // es más barato (paga lo MÁS bajo siempre) — pero DENTRO de la pestaña de la
  // campaña el producto igual se viste de campaña (badge + tinte), para que no
  // parezca ajeno entre los demás. En las pestañas normales, aspecto normal.
  var _ofVIPenCamp=!!(r.oferta && r.oferta_descartada_por_cc && r.oferta.campania_id &&
    typeof _campEsTabActual==='function' && _campEsTabActual(r.oferta.campania_id));
  var _ofertaBadge="";
  var _cardOfertaStyle="";
  var _pxNom=null,_pxCls="",_px={cimg:"",info:"",right:"",card:""};
  if((_hasOferta||_ofVIPenCamp) && !nostock){
    var lblOferta=_ofertaEtiquetaProd(_oferta,id)||(_oferta&&_oferta.etiqueta)||"";
    if(_ofVIPenCamp && !_hasOferta && !lblOferta) lblOferta="PRECIO VIP";
    if(!lblOferta){
      // Generar etiqueta automática según tipo
      if(r.oferta_tipo==='descuento_pct'&&r.descuento_pct)lblOferta=Math.round(r.descuento_pct)+'% OFF';
      else if(r.oferta_tipo==='precio_unico')lblOferta='OFERTA';
      else if(r.oferta_tipo==='x10_sin_minimo')lblOferta='PRECIO MAYOR';
      else if(r.oferta_tipo==='x3_sin_minimo')lblOferta='PRECIO X3';
      else if(r.oferta_tipo==='multixmenos'&&r.multi_lleva&&r.multi_paga)lblOferta=r.multi_lleva+'x'+r.multi_paga;
      else if(r.oferta_tipo==='regalo')lblOferta='REGALO';
      else lblOferta='OFERTA';
    }
    var _esPromoNxM=(r.oferta_tipo==='multixmenos'&&r.multi_lleva&&r.multi_paga);
    var _ofEmo=(r.oferta_tipo==='regalo')?'🎁':(_esPromoNxM?'🎁':'🔥');
    var _ofGrad=(r.oferta_tipo==='regalo')?'linear-gradient(135deg,#9b59b6,#7a4fce)':(_esPromoNxM?'linear-gradient(135deg,#b45fd1,#8438a8)':'linear-gradient(135deg,#c45a3a,#a73a32)');
    var _badgeBg=_ofCol.etiqueta||_ofGrad; // color configurado de campaña, o degradé por defecto
    // 🎁 Las promos NxM (2x1, 3x2) van MÁS llamativas: badge grande que late.
    var _badgeAnim=_esPromoNxM?"animation:promoBadgePulse 1.6s ease-in-out infinite;font-size:.68rem;padding:.22rem .6rem;":"";
    _ofertaBadge="<div class='ofBadge' style='position:absolute;top:-1px;right:10px;z-index:5;background:"+_badgeBg+";color:#fff;font-size:.55rem;font-weight:800;letter-spacing:.08em;padding:.18rem .5rem;border-radius:0 0 5px 5px;text-transform:uppercase;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3);"+_badgeAnim+"'>"+_ofEmo+" "+lblOferta+"</div>";
    // Tinte y borde de la card según el color de recuadro (campaña o rojo por defecto)
    _cardOfertaStyle="background:"+_ofBox+"0f;border:1px solid "+_ofBox+"55;";
  }
  // 🎁 Motivadores de compra (ajuste 2026-08-12, pedido de Ger): SIN montos de
  // ahorro — un ahorro chico desmotiva. La promo NxM se anuncia con lo que se
  // lleva gratis; el "descuento" que ve el cliente es la ETIQUETA de la campaña
  // (configurable en el admin, independiente del descuento real).
  // 🎬 Presentación: propia del producto, o la que diga la campaña por encima.
  var _pres=_presDe(p,_oferta);
  var _esKeys=_pres.estructuras||[], _pxKeys=_pres.efectos||[], _es={antes:'',card:'',cimg:'',info:'',cls:'',style:''};
  _pxNom=_pxKeys[0]||null;
  if(_pxKeys.length||_esKeys.length){
    var _etqP=((_hasOferta||_ofVIPenCamp)&&typeof lblOferta!=='undefined'&&lblOferta)?lblOferta:(_pres.etiqueta||'Destacado');
    if(_pxKeys.length){
      _pxCls=_pxKeys.map(_pxClases).join('');
      _px=_pxPiezasTodas(_pxKeys,{marca:br, nombre:sn, etiqueta:_etqP,
                             pct:(_hasOferta&&r.oferta_tipo==='descuento_pct')?r.descuento_pct:0,
                             hasta:_pres.hasta||(_oferta&&_oferta.fecha_hasta),
                             antes:_hasOferta?(r.pi_orig||r.pe_orig||r.pm_orig||0):0, ahora:_hasOferta?(r.pi||r.precio_unico||0):0});
    }
    if(_esKeys.length) _es=_esPiezasTodas(_esKeys,_pres,{stock:p.stock_actual});
  }
  var _ahorroHtml=_px.info+_es.info;
  if(_hasOferta && !nostock && r.oferta_tipo==='multixmenos' && r.multi_lleva && r.multi_paga){
    var _gratisN=r.multi_lleva-r.multi_paga;
    _ahorroHtml="<div class='promoLinea' style='font-size:.68rem;color:#8438a8;font-weight:800;margin-top:.2rem;line-height:1.35;background:rgba(180,95,209,.10);border:1px solid rgba(180,95,209,.32);border-radius:6px;padding:.3rem .45rem'>🎁 Llevá "+r.multi_lleva+", pagá "+r.multi_paga+
      (_gratisN>0?" — ¡"+_gratisN+" de regalo!":"")+"</div>";
  }
  // 🔥 Botón "Ver la campaña" (2026-08-12): el producto muestra su precio de campaña
  // en cualquier pestaña, y este botoncito lleva a la pestaña de la campaña.
  if(_hasOferta && !nostock && _oferta.campania_id && !_campEsTabActual(_oferta.campania_id)){
    var _slugC=_campSlugVisible(_oferta.campania_id);
    if(_slugC){
      var _cCamp=(window._ofertaCampanias||[]).find(function(x){return x.id===_oferta.campania_id;})||{};
      var _cf=_cCamp.tab_color_fondo||'#c45a3a', _ca2=_cCamp.tab_color_acento||_cf, _ctx=_cCamp.tab_color_texto||'#fff';
      _ahorroHtml+="<button onclick='event.stopPropagation();_irACampania(\""+_oferta.campania_id+"\")' "+
        "style='margin-top:.25rem;background:linear-gradient(120deg,"+_cf+","+_ca2+");color:"+_ctx+";border:none;border-radius:14px;"+
        "font-size:.6rem;font-weight:800;padding:.24rem .6rem;cursor:pointer;letter-spacing:.04em;box-shadow:0 2px 6px rgba(0,0,0,.2)'>"+
        "Ver la campaña "+_catEsc(_cCamp.nombre||'')+" →</button>";
    }
  }
  // Nota de regalo por compra (informativa, debajo del nombre).
  var _regaloHtml="";
  if(_hasOferta && r.oferta_tipo==='regalo' && !nostock){
    var _of=r.oferta;
    var _gp=allProds.find(function(x){return Number(x.id)===Number(_of.regalo_producto_id);});
    var _gbr=_gp?getBrand(_gp.nombre):'';
    var _gn=_gp?_prodMl((_gbr?_gp.nombre.replace(_gbr+" - ",""):_gp.nombre), _gp.ml):'';
    var _gc=parseInt(_of.regalo_cantidad)||1;
    var _cond=(_of.regalo_min_monto>0)
      ? ('comprando $'+Math.round(_of.regalo_min_monto).toLocaleString('es-AR'))
      : ('llevando '+(parseInt(_of.regalo_min_cantidad)||1)+(((parseInt(_of.regalo_min_cantidad)||1)===1)?' unidad':' unidades'));
    var _txt=_of.regalo_texto ? _of.regalo_texto : (_cond+': te llevás '+_gc+'× '+(_gn||'un regalo')+' de regalo');
    _regaloHtml="<div style='font-size:.64rem;color:#7a4fce;font-weight:700;margin-top:.2rem;line-height:1.35;background:rgba(155,89,182,.10);border:1px solid rgba(155,89,182,.28);border-radius:6px;padding:.3rem .45rem'>🎁 "+_txt+"</div>";
  }

  var _imgSrc = fixImgUrl(p.imagen_url||'');
  var _promoCls=(_hasOferta&&!nostock&&r.oferta_tipo==='multixmenos'&&r.multi_lleva&&r.multi_paga)?" cardPromoNxM":"";
  return _es.antes+"<div class='card"+(nostock?" nostock":"")+(_hasOferta?" oferta":"")+_promoCls+_pxCls+_es.cls+"' style='position:relative;"+_cardOfertaStyle+_es.style+"' id='card_"+id+"'>"+_px.card+_es.card+_ofertaBadge+"<div class='cimg' style='position:relative'>"+_etBadge+_px.cimg+_es.cimg+
    (br?"<span class='card-mlogo bmi-"+_mkKey(_mkLogo)+"'></span>":"")+
    "<button onclick='compartirProducto("+id+")' title='Compartir' class='share-btn'>&#128257;</button>"+
    "<button onclick='catToggleFav("+id+")' title='Agregar a favoritos' class='fav-heart"+(_catFavs.indexOf(id)>=0?" activo":"")+"' data-pid='"+id+"' style='color:"+(_catFavs.indexOf(id)>=0?"#e63950":"#888")+"'>"+(_catFavs.indexOf(id)>=0?"&#10084;&#65039;":"&#9825;")+"</button>"+
    (nostock?"<div class='ssrib'>Sin stock</div>":"")+
    "<img id='img_"+id+"' src='"+_catEscAttr(_imgSrc)+"' alt='' loading='lazy' decoding='async' style='"+(_imgSrc?"display:block":"display:none")+"' onerror='this.style.display=\"none\";var _ph=document.getElementById(\"ph_"+id+"\");if(_ph)_ph.style.display=\"flex\";'>"+
    "<div class='ciph' id='ph_"+id+"' style='"+(_imgSrc?"display:none":"")+"'>&#128100;<span>...</span></div>"+
    _galHTML(p)+
    "</div>"+
    "<div class='cinfo'>"+
    (br?"<div class='cbrand cbrand-col'><span class='cbrand-mask bml-"+_mkKey(_mkLogo)+"'></span><span class='cbrand-txt'>"+_catEsc(br)+"</span></div>":"")+
    (function(){var _t=parseProductTags(sn);var _sn2=sn.replace(/\s*\|[^|]+\|?\s*/g," ").replace(/\s{2,}/g," ").trim();var _tags="";if(_t.tipo)_tags+="<span class='prod-tag prod-tag-tipo'>"+_catEsc(_t.tipo)+"</span>";if(p.ml)_tags+="<span class='prod-tag prod-tag-ml'>"+_catEsc(p.ml)+" ML</span>";else if(_t.ml && _sn2.toLowerCase().indexOf("ml")<0)_tags+="<span class='prod-tag prod-tag-ml'>"+_catEsc(_t.ml)+"</span>";var _gl=genLabel(p.genero);var _gc=(_gl==="Masculino")?"gen-m":((_gl==="Femenino")?"gen-f":"gen-u");_tags+="<span class='prod-tag prod-tag-gen "+_gc+"'>"+_gl+"</span>";return "<div class='cname' title='"+_catEscAttr(p.nombre)+"'>"+ _catEsc(_sn2)+"</div>"+(_tags?"<div class='ctagrow' style='margin:.18rem 0 .1rem;display:flex;gap:.25rem;flex-wrap:wrap'>"+_tags+"</div>":"");}())+_grpChipsHTML(p)+
    // ➕ "Incluye:" — lo que trae el kit además del perfume (2026-08-08)
    (function(){
      var inc=[]; try{ inc=_prodIncluye(p); }catch(e){ inc=[]; }
      if(!inc.length) return "";
      return "<div class='cinc'><b>Incluye:</b>"+inc.map(function(t){ return "<span>"+_hbEsc(t)+"</span>"; }).join("")+"</div>";
    }())+
    stockBajoHtml+
    _regaloHtml+
    _ahorroHtml+
    (p.descripcion?"<div style='font-size:.63rem;color:var(--tx3);margin-top:.15rem;line-height:1.4;font-style:italic'>"+_catEsc(p.descripcion)+"</div>":"")+
    (p.notas?"<span class='ntog' onclick='togNotas(\""+nid+"\",this)'>+ Notas olfativas</span><div class='ntext' id='"+nid+"' data-lazy='1'></div>":"")+
    (acordesHtml)+
    (((p.notas||_tieneSugeridos(p)) && !(p.kit_componentes&&p.kit_componentes.length))?("<div class='cpar-tog' onclick='event.stopPropagation();togParecCard(\""+nid+"_par\",this,"+p.id+")'>+ También te puede gustar</div><div class='cpar-wrap' id='"+nid+"_par' style='display:none'></div>"):"")+
    "</div>"+
    "<div class='cright'>"+_px.right+
    (nostock?((decanHtml?"<div class='prices-row' style='justify-content:flex-end'>"+decanHtml+"</div>":"")+kitDecHtml+"<button class='avisame-btn' onclick='event.stopPropagation();abrirAvisoStock("+id+")'>&#128276; Avisame cuando vuelva</button>")
            :(minNoticeHtml+"<div class='prices-row'>"+popts+decanHtml+"</div>"+kitDecHtml))+
    (nostock?"":appliedHtml)+
    (nostock||p.tipo==='cosmetico'?"":(
      "<div class='qrow'>"+
      "<div class='qctrl'>"+
      "<button class='qb' onclick='chgQty("+id+",-1)'>-</button>"+
      "<span class='qn' id='qty_"+id+"'>"+(st.qty||0)+"</span>"+
      "<button class='qb' onclick='chgQty("+id+",1)'>+</button>"+
      "</div>"+
      "<button class='abtn' onclick='addCart("+id+")' "+(st.qty===0?"disabled":"")+">"+
      (ic?"Actualizar":"Agregar")+
      "</button>"+
      "</div>"+
      (ic?"<div class='icb'>En pedido: "+ic.qty+" unid.</div>":"")+
      (inCartDecan?"<div class='icb' style='color:#c4965a'>Decans: "+inCartDecan.qty+"</div>":"")
    ))+
    (nostock?"<button data-dispid=\""+id+"\" onclick=\"consultarDisp(this)\" style=\"width:100%;display:flex;align-items:center;justify-content:center;gap:.3rem;margin-top:.4rem;padding:.55rem;background:#25D366;border:none;border-radius:6px;color:#fff;font-size:.72rem;cursor:pointer;font-weight:600\">&#128241; Consultar disponibilidad</button>":"")+
    "<div style='display:flex;gap:.3rem;margin-top:.4rem'>"+
    (p.no_aplica_ficha ? "" : "<button onclick='verFichaBelle("+id+",this)' style='flex:1;padding:.35rem .4rem;background:rgba(201,150,58,.08);border:1px solid rgba(201,150,58,.35);border-radius:7px;color:#c9963a;font-size:.62rem;cursor:pointer;font-weight:500;display:flex;align-items:center;justify-content:center;gap:.2rem;letter-spacing:.02em;transition:all .18s' onmouseover=\"this.style.background='rgba(201,150,58,.18)';this.style.borderColor='rgba(201,150,58,.7)'\" onmouseout=\"this.style.background='rgba(201,150,58,.08)';this.style.borderColor='rgba(201,150,58,.35)'\">✦ Ficha</button>")+
    "</div>"+
    "</div></div>";
}

function togNotas(id,el){var d=document.getElementById(id);if(!d)return;if(d.getAttribute('data-lazy')==='1'){ d.removeAttribute('data-lazy'); var _pp=_lazyProdDe(id); d.innerHTML=(_pp&&_pp.notas)?formatNotasFotos(_pp.notas):""; }d.classList.toggle("open");el.textContent=d.classList.contains("open")?"- Notas olfativas":"+ Notas olfativas";}

function chgDecan(id,delta){
  if(decanState[id]===undefined)decanState[id]=0;
  var nv=decanState[id]+delta;
  if(nv<0)nv=0;
  decanState[id]=nv;
  var el=document.getElementById("dq-"+id);
  if(el)el.textContent=nv;
}

function addDecan(id){
  var p=allProds.find(function(x){return x.id===id;});if(!p)return;
  var r=calcP(p);
  var dq=decanState[id]||0;
  if(dq<=0){showToast("Selecciona la cantidad de decans");return;}
  // No minimum validation here - validated only at checkout (sendWA)
  cart["decan_"+id]={id:"decan_"+id,nombre:p.nombre+" (Decan 5ml)",qty:dq,seg:"decan",precio:r.decan,pData:{pm:r.pm,pe:r.pe,pi:r.pi},isDecan:true,prodId:id};
  updateCartCount();showToast("Decan agregado");applyFilters();
}

// ════════════════════════════════════════════════════════════════════
// 🧪 DECANTS DE UN KIT (2026-08-27): modal con el decant de CADA perfume
// que trae el kit, con su precio individual y compra por separado.
// ════════════════════════════════════════════════════════════════════
function _kitDecansModal(kitId){
  var kit=allProds.find(function(x){return x.id===kitId;}); if(!kit)return;
  var comps=_jsonArr(kit.kit_componentes).map(function(cid){
    return (allProds||[]).find(function(x){ return Number(x.id)===Number(cid); });
  }).filter(Boolean);
  if(!comps.length){showToast("Este kit no tiene perfumes linkeados todavía");return;}
  var prev=document.getElementById('_kitDecMo'); if(prev)prev.remove();
  var filas=comps.map(function(c){
    var rc=calcP(c); var sinDecan=!(rc.decan>0)||c.precio_decan===-1;
    var dq=decanState[c.id]||0;
    var img=c.imagen_url?"<img src='"+_catEsc(c.imagen_url)+"' style='width:46px;height:46px;object-fit:contain;border-radius:9px;background:#faf8f4;flex-shrink:0' onerror=\"this.style.display='none'\">":"<div style='width:46px;height:46px;border-radius:9px;background:#faf6ee;display:flex;align-items:center;justify-content:center;flex-shrink:0'>🌸</div>";
    return "<div style='display:flex;align-items:center;gap:.6rem;padding:.6rem .1rem;border-bottom:1px solid var(--border-color,#f0e7d6)'>"+
      img+
      "<div style='flex:1;min-width:0'>"+
        "<div style='font-size:.8rem;font-weight:700;color:var(--tx-main,#3a3125);line-height:1.25'>"+_catEsc(_prodNombreCorto(c))+"</div>"+
        (sinDecan
          ?"<div style='font-size:.68rem;color:var(--tx-mid,#9a8870)'>Sin decant disponible</div>"
          :"<div style='font-size:.75rem;color:var(--accent,#a9763f);font-weight:800'>Decant 5ml · "+fmt(rc.decan)+"</div>")+
        "<div id='kd-tag-"+c.id+"' style='font-size:.62rem;color:#3fae74;font-weight:700;min-height:.8rem'>"+(cart['decan_'+c.id]?("✓ "+cart['decan_'+c.id].qty+" en tu pedido"):"")+"</div>"+
      "</div>"+
      (sinDecan?"":(
      // ➕/➖ agregan al carrito EN VIVO (sin botón aparte): 0 = lo saca del pedido
      "<div style='display:flex;align-items:center;gap:.35rem;flex-shrink:0'>"+
        "<button onclick='_kitDecQty("+c.id+",-1)' style='width:30px;height:30px;border-radius:50%;border:1.5px solid var(--border-color,#d4ba8a);background:transparent;color:var(--tx-main,#5a4a30);font-size:1.1rem;cursor:pointer;line-height:1;font-family:inherit'>−</button>"+
        "<span id='kdq-"+c.id+"' style='min-width:22px;text-align:center;font-weight:800;font-size:.95rem;color:"+(dq>0?"var(--accent,#a9763f)":"var(--tx-main,#3a3125)")+"'>"+dq+"</span>"+
        "<button onclick='_kitDecQty("+c.id+",1)' style='width:30px;height:30px;border-radius:50%;border:none;background:var(--accent,#c4965a);color:#fff;font-size:1.1rem;font-weight:700;cursor:pointer;line-height:1;font-family:inherit;box-shadow:0 2px 6px rgba(196,150,90,.3)'>+</button>"+
      "</div>"))+
    "</div>";
  }).join("");
  var mo=document.createElement('div'); mo.id='_kitDecMo';
  mo.style.cssText='position:fixed;inset:0;background:rgba(20,15,8,.65);z-index:1600;display:flex;align-items:center;justify-content:center;padding:1rem';
  mo.innerHTML=
    "<div style='background:var(--bg-card,#fff);border-radius:16px;max-width:450px;width:100%;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 14px 50px rgba(0,0,0,.3)'>"+
      "<div style='height:5px;background:linear-gradient(90deg,#e8b86d,#c4965a,#8a6d3b);flex-shrink:0'></div>"+
      "<div style='padding:.9rem 1.2rem .5rem;flex-shrink:0'>"+
        "<div style='display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem'>"+
          "<div style='min-width:0'>"+
            "<div style='font-size:1.05rem;font-weight:700;color:var(--tx-main,#1a1a1a);font-family:\"Cormorant Garamond\",serif'>🧪 Decants de este kit</div>"+
            "<div style='font-size:.72rem;color:var(--tx-mid,#8a7a60);margin-top:.1rem'>"+_catEsc(_prodNombreCorto(kit))+"</div>"+
          "</div>"+
          "<span onclick='_kitDecCerrar()' style='cursor:pointer;color:var(--tx-mid,#9a8870);font-size:1.3rem;line-height:1;padding:0 .2rem'>&times;</span>"+
        "</div>"+
        "<div style='font-size:.7rem;color:var(--tx-mid,#7a6a50);background:rgba(196,150,90,.08);border:1px solid rgba(196,150,90,.3);border-radius:8px;padding:.4rem .6rem;margin-top:.5rem;line-height:1.4'>Cada decant (5ml) se compra <b>por separado</b>, al precio de cada perfume. Elegí los que quieras 👇</div>"+
      "</div>"+
      "<div style='padding:0 1.2rem;overflow-y:auto;flex:1'>"+filas+"</div>"+
      "<div style='padding:.7rem 1.2rem .9rem;flex-shrink:0'>"+
        "<button onclick='_kitDecCerrar()' style='width:100%;background:var(--accent,#c4965a);color:#fff;border:none;padding:.65rem;border-radius:10px;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit'>Listo ✓</button>"+
      "</div>"+
    "</div>";
  document.body.appendChild(mo);
  mo.addEventListener('click',function(e){ if(e.target===mo)_kitDecCerrar(); });
}
function _kitDecCerrar(){
  var m=document.getElementById('_kitDecMo'); if(m)m.remove();
  try{ applyFilters(); }catch(e){}   // refresca las cards con los decants ya agregados
  try{ if(typeof showToast==='function'){ var n=Object.keys(cart).filter(function(k){return k.indexOf('decan_')===0;}).length; if(n) showToast('Decants agregados a tu pedido 🧪'); } }catch(e){}
}
// ➕/➖ del modal de kit: cambian la cantidad Y actualizan el carrito al instante
// (sin botón "agregar" aparte). Poner 0 saca el decant del pedido.
function _kitDecQty(id,delta){
  var v=(decanState[id]||0)+delta; if(v<0)v=0;
  decanState[id]=v;
  var p=allProds.find(function(x){return x.id===id;});
  if(p){
    if(v>0){
      var r=calcP(p);
      cart["decan_"+id]={id:"decan_"+id,nombre:p.nombre+" (Decan 5ml)",qty:v,seg:"decan",precio:r.decan,pData:{pm:r.pm,pe:r.pe,pi:r.pi},isDecan:true,prodId:id};
    } else {
      delete cart["decan_"+id];
    }
    try{ updateCartCount(); }catch(e){}   // refresca contador + guarda el carrito persistente
  }
  var el=document.getElementById('kdq-'+id);
  if(el){ el.textContent=v; el.style.color=v>0?'var(--accent,#a9763f)':'var(--tx-main,#3a3125)'; }
  var tag=document.getElementById('kd-tag-'+id);
  if(tag) tag.textContent=v>0?("✓ "+v+" en tu pedido"):"";
  var el2=document.getElementById('dq-'+id); if(el2)el2.textContent=v; // sync con la card del perfume
}

function chgQty(id,delta){
  if(!cstate[id])cstate[id]={qty:0};
  var nq=cstate[id].qty+delta;
  if(nq<0)return;
  var p=allProds.find(function(x){return x.id===id;});
  var stockDisp=p?(p.stock_actual||0):0;
  if(nq>stockDisp){
    showToast("Solo hay "+stockDisp+" unidades disponibles");
    nq=stockDisp;
    if(nq<=cstate[id].qty)return;
  }
  cstate[id].qty=nq;
  var el=document.getElementById("qty_"+id);if(el)el.textContent=nq;
  if(p){
    var r=calcP(p);var ic=cart[id];
    var totalUnits=getCartTotalUnits()+nq-(ic&&!ic.isDecan?ic.qty:0);
    var _puD=p?p.precio_pestana||0:0;var bestSeg=nq>0?(_puD>0?"pi":getBestSeg(totalUnits,r)):"none";
    ["pm","pe","pi"].forEach(function(sg,i){var el2=document.querySelector("#card_"+id+" .prices-row .popt:nth-child("+(i+1)+")");if(el2&&!el2.classList.contains("dis"))el2.classList.toggle("lit",sg===bestSeg);});
    var card=document.getElementById("card_"+id);
    if(card){
      var pt=card.querySelector(".price-applied");
      // Si el producto tiene oferta vigente, mostrar la etiqueta de la oferta
      var _hasOf=!!(r&&r.oferta&&!r.oferta_descartada_por_cc);
      var pn;
      if(_hasOf){
        pn="🔥 "+(r.oferta_etiqueta||"Oferta")+" aplicada";
      } else if(_puD>0){
        // 🐛 FIX BUG #33 (2026-05-20): label correcto para precio único
        pn="Precio único aplicado";
      } else {
        var pnBase=bestSeg==="pm"?"Precio x10":bestSeg==="pe"?"Precio x3":bestSeg==="pi"?"Precio de lista":"";
        pn=pnBase?pnBase+" aplicado":"";
      }
      if(nq>0&&pn){if(pt)pt.textContent=pn;}else{if(pt)pt.textContent="";}
      var btn=card.querySelector(".abtn");if(btn)btn.disabled=(stockDisp===0||nq===0);
    }
  }
}
function addCart(id){
  var st=cstate[id]||{qty:0};if(st.qty===0){showToast("Pone una cantidad primero");return;}
  var p=allProds.find(function(x){return x.id===id;});if(!p)return;
  var stockDisp=p.stock_actual||0;
  if(st.qty>stockDisp){
    showToast("Solo hay "+stockDisp+" unidades disponibles");
    cstate[id].qty=stockDisp;
    var el=document.getElementById("qty_"+id);if(el)el.textContent=stockDisp;
    return;
  }
  var r=calcP(p);
  var totalUnits=getCartTotalUnits()+st.qty-(cart[id]&&!cart[id].isDecan?cart[id].qty:0);
  var _puA=p.precio_pestana||0;
  // ── Prioridad: oferta > precio_pestana > precios normales ──
  // Si hay oferta vigente, IGNORAR precio_pestana (la oferta es más específica/temporal).
  // Sin oferta, si el producto tiene precio único (precio_pestana), usar ese.
  // Si no, usar el precio según tramo (x10/x3/x1).
  // 2026-10-25 (auditoría CyberMonday): un producto con PRECIO ÚNICO (precio_pestana) no entra en las ofertas
  // x10/x3/campaña: su precio es ese, igual que lo cobra Ventas (_calcLineaPrecio). Antes la tarjeta decía
  // "Precio único $4.000" y el carrito cobraba el x10 de la oferta ($1.600).
  var hayOferta = !!(r.oferta && !r.oferta_descartada_por_cc) && !(_puA>0);
  var seg, price;
  if(hayOferta){
    seg=getBestSeg(totalUnits,r);
    price=r[seg]||r.pi;
    // ── Multi x menos (ej: 2x1, 3x2) ──
    // El precio unitario "efectivo" se ajusta en función de cuántas unidades lleva el cliente.
    // Ejemplo 2x1: por cada 2 unidades, paga 1 → precio unitario efectivo = price * (paga/lleva).
    // Pero solo si lleva al menos `multi_lleva` unidades.
    if(r.oferta_tipo==='multixmenos' && r.multi_lleva && r.multi_paga && st.qty >= r.multi_lleva){
      // Calcular cuánto paga realmente
      var grupos = Math.floor(st.qty / r.multi_lleva);     // grupos completos (ej: 4 unidades en 2x1 = 2 grupos)
      var resto  = st.qty - (grupos * r.multi_lleva);      // unidades sueltas que pagan precio normal
      var totalPagar = (grupos * r.multi_paga * price) + (resto * price);
      // Promedio para guardar como precio unitario en el carrito
      price = Math.round(totalPagar / st.qty);
    }
  } else if(_puA>0){
    seg='pi';price=_puA;
  } else {
    seg=getBestSeg(totalUnits,r);
    price=r[seg]||r.pi;
  }
  // Snapshot del precio: si la oferta venciera mientras el cliente tiene el producto en
  // el carrito, queremos respetar el precio que vio al agregarlo (decisión de Ger).
  var ofertaSnapshot=null;
  // 2026-10-25: solo si la oferta se aplicó de verdad (con precio único no hay snapshot: si no, el carrito
  // volvía a elegir el tramo más barato de la promo y pisaba el precio único)
  if(hayOferta){
    ofertaSnapshot={
      id:r.oferta.id,
      tipo:r.oferta_tipo,
      etiqueta:r.oferta_etiqueta||'',
      precio_aplicado:price,
      seg:seg,   // 2026-10-15: tramo de la promo, para volver a él si el carrito cambia
      multi_paga:r.multi_paga||null,
      multi_lleva:r.multi_lleva||null,
      ts:Date.now()   // auditoría 2026-10-04: el precio de oferta guardado vence a las 48 h
    };
  }
  cart[id]={id:id,nombre:p.nombre,qty:st.qty,seg:seg,precio:price,
            pData:{pm:r.pm,pe:r.pe,pi:r.pi},
            oferta:ofertaSnapshot,
            isDecan:false};
  updateCartCount();
  showToast(ofertaSnapshot?"🔥 Oferta aplicada: "+fmt(price)+" x "+st.qty:"Agregado: "+fmt(price)+" x "+st.qty);
  applyFilters();
}

// ═══════════════════════════════════════════════════════════
// VENTA DE COSMÉTICOS — cajas + optimizador + modal de sugerencia
// Reglas (Ger): el auto-ajuste combina SOLO cajas enteras (cant>1).
// La sugerencia es UNA sola, la mejor jugada para el cliente.
// ═══════════════════════════════════════════════════════════
var _cosmDismiss={};
function _cosmCajas(escala){ return (escala||[]).filter(function(e){return (e.cant||1)>1;}); }
function _cosmFmtCombo(combo){
  return Object.keys(combo).sort(function(a,b){return b-a;})
    .map(function(k){ return combo[k]+"× caja de "+k; }).join(" + ");
}
// costo mínimo usando SOLO cajas enteras para EXACTAMENTE N unidades (o null)
function _cosmMinCajas(cajas,N){
  var dp=new Array(N+1).fill(null); dp[0]={costo:0,combo:{}};
  for(var u=1;u<=N;u++) for(var i=0;i<cajas.length;i++){
    var c=cajas[i].cant,p=cajas[i].precio;
    if(c<=u && dp[u-c]){ var cand=dp[u-c].costo+p;
      if(dp[u]===null||cand<dp[u].costo){ var cb=Object.assign({},dp[u-c].combo); cb[c]=(cb[c]||0)+1; dp[u]={costo:cand,combo:cb}; } }
  }
  return dp[N];
}
function _cosmOptimizar(escala,U,C){
  var cajas=_cosmCajas(escala); if(!cajas.length) return {auto:null,sugerencia:null};
  var maxCaja=Math.max.apply(null,cajas.map(function(e){return e.cant;}));
  var puActual=C/U; var out={auto:null,sugerencia:null};
  var exacto=_cosmMinCajas(cajas,U);
  if(exacto && exacto.costo<C) out.auto={costo:exacto.costo,combo:exacto.combo,ahorro:C-exacto.costo};
  var costoBase=out.auto?out.auto.costo:C;
  var masCant=null, mejorDesc=null;
  for(var M=U+1;M<=U+maxCaja;M++){
    var bm=_cosmMinCajas(cajas,M); if(!bm) continue;
    var puNew=bm.costo/M;
    if(bm.costo<=costoBase){ if(!masCant||M>masCant.unidades) masCant={unidades:M,costo:bm.costo,combo:bm.combo}; }
    if(puNew<puActual){ var pct=(puActual-puNew)/puActual; if(!mejorDesc||pct>mejorDesc.pct) mejorDesc={unidades:M,costo:bm.costo,combo:bm.combo,pu:puNew,pct:pct}; }
  }
  if(masCant){ out.sugerencia={tipo:'mas_cantidad',unidades:masCant.unidades,costo:masCant.costo,combo:masCant.combo,extraU:masCant.unidades-U,ahorro:costoBase-masCant.costo}; }
  else if(mejorDesc){ out.sugerencia={tipo:'mejor_unitario',unidades:mejorDesc.unidades,costo:mejorDesc.costo,combo:mejorDesc.combo,extraU:mejorDesc.unidades-U,extraCosto:mejorDesc.costo-costoBase,puNew:mejorDesc.pu,descPct:mejorDesc.pct}; }
  return out;
}
// Junta todas las líneas cosm_<prodId>_* del carrito → {unidades, costo}
function _cosmEstado(prodId){
  var U=0,C=0;
  Object.keys(cart).forEach(function(k){
    if(k.indexOf("cosm_"+prodId+"_")===0){ var it=cart[k]; U+=(it.cajaCant||1)*it.qty; C+=it.precio*it.qty; }
  });
  return {unidades:U,costo:C};
}
// Reescribe las líneas cosm de un producto según un combo {cant:nCajas}
function _cosmAplicarCombo(prodId,combo){
  var p=allProds.find(function(x){return x.id===prodId;}); if(!p) return;
  var esc=p.escala_unidades||[];
  Object.keys(cart).forEach(function(k){ if(k.indexOf("cosm_"+prodId+"_")===0) delete cart[k]; });
  Object.keys(combo).forEach(function(cantStr){
    var cant=parseInt(cantStr,10); var nCajas=combo[cantStr];
    var tier=esc.find(function(t){return (t.cant||1)===cant;});
    var precio=tier?(tier.precio||0):0;
    var key="cosm_"+prodId+"_"+cant;
    cart[key]={id:key,prodId:prodId,nombre:p.nombre+" (Caja x"+cant+")",qty:nCajas,cajaCant:cant,cajaLabel:(cant<=1?"1 unidad":"Caja x"+cant),precio:precio,isCosm:true,pData:{pm:precio,pe:precio,pi:precio}};
  });
}
function addCosm(prodId,cajaCant,cajaPrecio){
  var p=allProds.find(function(x){return x.id===prodId;}); if(!p) return;
  // FIX 2026-09-23: las cajas no tenían tope por stock (se podían pedir más unidades de las que hay)
  var _enCarr=0; Object.values(cart||{}).forEach(function(c){ if(c&&c.isCosm&&c.prodId===prodId) _enCarr+=(c.qty||0)*(c.cajaCant||1); });
  if(_enCarr+(cajaCant||1) > (p.stock_actual||0)){ showToast("Sin stock suficiente de "+(p.nombre||"").split(" - ").pop()); return; }
  var key="cosm_"+prodId+"_"+cajaCant;
  if(cart[key]) cart[key].qty++;
  else cart[key]={id:key,prodId:prodId,nombre:p.nombre+" (Caja x"+cajaCant+")",qty:1,cajaCant:cajaCant,cajaLabel:(cajaCant<=1?"1 unidad":"Caja x"+cajaCant),precio:cajaPrecio,isCosm:true,pData:{pm:cajaPrecio,pe:cajaPrecio,pi:cajaPrecio}};
  showToast((cajaCant<=1?"1 unidad":"Caja x"+cajaCant)+" agregada");
  cosmOptimizar(prodId);
  updateCartCount();
  if(typeof renderDrawer==='function') renderDrawer();
}
// Auto-ajuste (cajas enteras) + modal de mejor jugada
function cosmOptimizar(prodId){
  var p=allProds.find(function(x){return x.id===prodId;}); if(!p) return;
  var est=_cosmEstado(prodId); if(est.unidades<=0) return;
  var r=_cosmOptimizar(p.escala_unidades||[],est.unidades,est.costo);
  if(r.auto){ _cosmAplicarCombo(prodId,r.auto.combo); }
  if(r.sugerencia){ _cosmModalSugerencia(prodId,r.sugerencia,est); }
}
function _cosmModalSugerencia(prodId,s,est){
  var sig=prodId+":"+est.unidades;
  if(_cosmDismiss[sig]) return;
  var titulo,detalle;
  if(s.tipo==='mas_cantidad'){
    titulo="🎁 ¡Te conviene llevar más!";
    detalle="Llevando <b>"+s.unidades+" unidades</b> ("+_cosmFmtCombo(s.combo)+") pagás <b>"+fmt(s.costo)+"</b>"+
      (s.ahorro>0?" — son <b>"+s.extraU+" unidades más</b> y encima ahorrás "+fmt(s.ahorro)+".":" — son <b>"+s.extraU+" unidades más</b> por el mismo precio.");
  } else {
    titulo="💡 Mejorá el precio por unidad";
    detalle="Sumando un poco más llevás <b>"+s.unidades+" unidades</b> ("+_cosmFmtCombo(s.combo)+") a <b>"+fmt(s.puNew)+" c/u</b> "+
      "(<b>"+Math.round(s.descPct*100)+"% menos</b> por unidad). Son "+s.extraU+" unidades más por solo "+fmt(s.extraCosto)+".";
  }
  var ov=document.getElementById("cosmModalOv");
  if(!ov){ ov=document.createElement("div"); ov.id="cosmModalOv"; document.body.appendChild(ov); }
  ov.style.cssText="position:fixed;inset:0;background:rgba(60,40,20,.45);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1.2rem;backdrop-filter:blur(3px)";
  ov.innerHTML=
    "<div style='background:linear-gradient(160deg,#fffdf9,#faf3e6);border:1px solid #e6d2ad;border-radius:16px;max-width:380px;width:100%;padding:1.4rem 1.3rem;box-shadow:0 18px 50px rgba(120,80,30,.28)'>"+
      "<div style='font-family:\"Cormorant Garamond\",serif;font-size:1.5rem;font-weight:700;color:#9a6b2f;margin-bottom:.5rem;line-height:1.15'>"+titulo+"</div>"+
      "<div style='font-size:.9rem;color:#5a4a36;line-height:1.5;margin-bottom:1.15rem'>"+detalle+"</div>"+
      "<div style='display:flex;gap:.6rem'>"+
        "<button type='button' onclick='_cosmCerrarModal()' style='flex:1;padding:.7rem;border:1px solid #d8c39c;background:transparent;border-radius:10px;color:#8a7355;font-size:.85rem;font-weight:600;cursor:pointer'>No, gracias</button>"+
        "<button type='button' onclick='_cosmAprovechar("+prodId+")' style='flex:1.4;padding:.7rem;border:none;border-radius:10px;background:linear-gradient(135deg,#c4965a,#a9793f);color:#fff;font-size:.85rem;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(169,121,63,.35)'>✨ Aprovechar</button>"+
      "</div>"+
    "</div>";
  ov.style.display="flex";
  window._cosmSugActual={prodId:prodId,combo:s.combo,sig:sig};
}
function _cosmCerrarModal(){
  var ov=document.getElementById("cosmModalOv"); if(ov) ov.style.display="none";
  if(window._cosmSugActual) _cosmDismiss[window._cosmSugActual.sig]=true;
}
function _cosmAprovechar(prodId){
  var s=window._cosmSugActual; if(s&&s.combo) _cosmAplicarCombo(prodId,s.combo);
  var ov=document.getElementById("cosmModalOv"); if(ov) ov.style.display="none";
  updateCartCount(); showToast("¡Combo aplicado!");
  if(typeof renderDrawer==='function') renderDrawer();
}

function updateCartCount(){
  var total=Object.values(cart).reduce(function(s,i){return s+(i.isBonificado?0:i.qty);},0);
  document.getElementById("cartCount").textContent=total;
  if(typeof updateMiniCart==="function") updateMiniCart();
}
// ── Mini-carrito flotante (Tanda 3): barra fija con total en vivo + botón Ver pedido ──
var _miniCartBusy=false;
function updateMiniCart(){
  var bar=document.getElementById("miniCart");
  if(!bar)return;
  var units=Object.values(cart).reduce(function(s,i){return s+(i.isBonificado?0:i.qty);},0);
  if(units<=0){ bar.style.display="none"; return; }
  // Si el cajón del pedido está abierto, ocultamos la barra (ya se ve el total adentro).
  var dw=document.getElementById("drawer");
  if(dw && dw.classList.contains("open")){ bar.style.display="none"; return; }
  // Refrescar el total ($) reutilizando renderDrawer (que setea #ctotal) — guarda anti-recursión:
  // renderDrawer llama a updateCartCount → updateMiniCart; el flag evita el bucle infinito.
  if(!_miniCartBusy){
    _miniCartBusy=true;
    try{ if(typeof renderDrawer==="function") renderDrawer(); }catch(e){}
    _miniCartBusy=false;
  }
  var totalTxt=(document.getElementById("ctotal")||{}).textContent||"$0";
  var cEl=document.getElementById("miniCartCount");
  var tEl=document.getElementById("miniCartTotal");
  if(cEl)cEl.textContent=units+(units===1?" producto":" productos");
  if(tEl)tEl.textContent=totalTxt;
  bar.style.display="flex";
}

function showToast(msg){var t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(function(){t.classList.remove("show");},2000);}

// Toast "rico" — múltiples líneas, dura más, info para acciones críticas
// Útil cuando se confirma un pedido para que el cliente vea exactamente qué se procesó.
function showToastInfo(opts){
  if(typeof opts === 'string'){return showToast(opts);}
  opts = opts || {};
  var t = document.getElementById("toast");
  if(!t) return;
  var titulo = opts.titulo || '';
  var lineas = Array.isArray(opts.lineas) ? opts.lineas : [];
  var dur = opts.dur || 5000;
  var html = "";
  if(titulo) html += "<div style='font-weight:700;margin-bottom:.3rem'>"+String(titulo).replace(/[<>]/g,'')+"</div>";
  if(lineas.length){
    html += "<div style='font-size:.78em;line-height:1.4;opacity:.95'>";
    lineas.forEach(function(l){html += "<div>· "+String(l).replace(/[<>]/g,'')+"</div>";});
    html += "</div>";
  }
  t.innerHTML = html || (opts.titulo||'OK');
  t.classList.add("show");
  clearTimeout(t._catToastTimer);
  t._catToastTimer = setTimeout(function(){t.classList.remove("show");}, dur);
}

function toggleCart(){
  var dw = document.getElementById("drawer");
  var ov = document.getElementById("ov");
  if(!dw || !ov) return;
  var willOpen = !dw.classList.contains("open");
  dw.classList.toggle("open");
  ov.classList.toggle("open");
  renderDrawer();
  // FIX 2026-05-15: integrar al sistema back button del celular
  if(willOpen){
    _catModalBackRegistrar('drawer', function(){
      var dw2 = document.getElementById("drawer");
      var ov2 = document.getElementById("ov");
      if(dw2) dw2.classList.remove("open");
      if(ov2) ov2.classList.remove("open");
    });
  } else {
    _catModalBackDesregistrar('drawer');
  }
}

// ═══════════════════════════════════════════════════════
// MI CUENTA — toggle del drawer + actualización del botón
// ═══════════════════════════════════════════════════════
function toggleMiCuenta(){
  var dw = document.getElementById("drawerCuenta");
  var ov = document.getElementById("ovCuenta");
  if(!dw || !ov) return;
  var willOpen = !dw.classList.contains("open");
  dw.classList.toggle("open");
  ov.classList.toggle("open");
  if(willOpen){
    if(window._catForzarTab){ _catPanelTab=window._catForzarTab; window._catForzarTab=null; }
    else { _catPanelTab="pedidos"; }
    // FIX 2026-05-15: registrar drawer para que el botón "atrás" del celular lo cierre
    // (en lugar de salir de la web). Usamos el mismo sistema que los modales.
    _catModalBackRegistrar('drawerCuenta', function(){
      // Función de cierre cuando viene del botón atrás
      var dw2 = document.getElementById("drawerCuenta");
      var ov2 = document.getElementById("ovCuenta");
      if(dw2) dw2.classList.remove("open");
      if(ov2) ov2.classList.remove("open");
      // NO llamar _catModalBackDesregistrar acá — el listener popstate ya pop'eó la pila
    });
    // Render según haya o no sesión activa (las funciones reales se cargan en bloques 4-5)
    if(typeof catRenderDrawer === 'function'){
      catRenderDrawer();
    } else {
      // Fallback mientras no estén los bloques 4-5
      var body = document.getElementById("cuentaBody");
      if(body){
        body.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:var(--mid);font-size:.85rem'>"+
          "<div style='font-size:2rem;margin-bottom:.5rem'>&#128274;</div>"+
          "<div>Mi Cuenta &mdash; pr&oacute;ximamente</div>"+
        "</div>";
      }
    }
  } else {
    // FIX 2026-05-15: drawer cerrado manualmente (X / overlay click / toggle) → desregistrar
    _catModalBackDesregistrar('drawerCuenta');
  }
}

function catActualizarBoton(){
  var btn = document.getElementById("catCuentaBtn");
  var icon = document.getElementById("catCuentaIcon");
  var label = document.getElementById("catCuentaLabel");
  if(!btn || !icon || !label) return;
  if(_catCliente){
    btn.classList.add("logged");
    var nombre = _catCliente.nombre || _catCliente.email || "Mi Cuenta";
    // Mostrar solo primer nombre si es muy largo
    var nombreCorto = String(nombre).split(" ")[0];
    if(nombreCorto.length > 14) nombreCorto = nombreCorto.slice(0,12)+"…";
    icon.innerHTML = "&#128100;";
    label.textContent = nombreCorto;
  } else {
    btn.classList.remove("logged");
    icon.innerHTML = "&#128100;";
    label.textContent = "Mi Cuenta";
  }
}

// ── REGALO POR COMPRA (bonificado) ──
// Recalcula los ítems de regalo según lo que hay en el carrito. Cada bonificado es
// un ítem cart["bonif_"+ofertaId] a $0, no editable. Se llama en cada render/checkout.
// No suma al total ni cuenta para los tramos de precio; sí reserva stock del producto regalado.
function recomputarBonificados(){
  // 1. Limpiar bonificados previos (se recalculan de cero)
  Object.keys(cart).forEach(function(k){ if(k.indexOf('bonif_')===0) delete cart[k]; });
  var ofs = window._ofertas || [];
  if(!ofs.length) return;
  var ahora = Date.now();
  // Subtotal pagado (excluye bonificados) para condición por monto.
  var subtotalPagado = 0;
  Object.values(cart).forEach(function(i){ if(!i.isBonificado) subtotalPagado += (i.precio||0)*(i.qty||0); });
  // Cantidad de un producto entero en el carrito (excluye decan/bonif) para condición por cantidad.
  function qtyProductoEnCart(pid){
    var it = cart[pid];
    return (it && !it.isDecan && !it.isBonificado) ? (it.qty||0) : 0;
  }
  ofs.forEach(function(o){
    if(o.tipo!=='regalo' || !o.activa) return;
    if(o.fecha_desde && new Date(o.fecha_desde).getTime() > ahora) return;
    if(o.fecha_hasta && new Date(o.fecha_hasta).getTime() <= ahora) return;
    if(!o.regalo_producto_id || !(parseInt(o.regalo_cantidad)||0)) return;
    var porMonto = (parseFloat(o.regalo_min_monto)||0) > 0;
    var veces = 0;
    if(porMonto){
      var minM = parseFloat(o.regalo_min_monto)||0;
      if(subtotalPagado >= minM) veces = o.regalo_por_multiplo ? Math.floor(subtotalPagado/minM) : 1;
    } else {
      var minC = parseInt(o.regalo_min_cantidad)||1;
      var tq = qtyProductoEnCart(o.producto_id);
      if(tq >= minC) veces = o.regalo_por_multiplo ? Math.floor(tq/minC) : 1;
    }
    if(veces <= 0) return;
    var cantRegalo = (parseInt(o.regalo_cantidad)||1) * veces;
    // Tope por stock del producto de regalo
    var gp = allProds.find(function(x){ return Number(x.id)===Number(o.regalo_producto_id); });
    var stockGift = gp ? (gp.stock_actual||0) : 0;
    if(stockGift <= 0) return;
    if(cantRegalo > stockGift) cantRegalo = stockGift;
    if(cantRegalo <= 0) return;
    cart['bonif_'+o.id] = {
      id:'bonif_'+o.id, ofertaId:o.id, prodId:Number(o.regalo_producto_id),
      nombre:(gp ? gp.nombre : ('Producto #'+o.regalo_producto_id)),
      qty:cantRegalo, precio:0, seg:'bonif', isBonificado:true, isDecan:false
    };
  });
}

// Oferta guardada en el carrito: vale 48 h desde que se agregó (antes no vencía nunca).
function _ofertaSnapVigente(item){
  if(!item || !item.oferta || !item.oferta.precio_aplicado) return false;
  var ts=item.oferta.ts; if(!ts) return true; // carritos viejos sin sello: se respetan
  // 2026-10-09: el precio promo se respeta mientras la oferta esté vigente y hasta 3 h después de que termina
  // (mismo margen que valida la base al crear el pedido). Si no se encuentra la oferta, 3 h desde que se agregó.
  var of=item.oferta.oferta_id?(window._ofertas||[]).find(function(o){ return o.id===item.oferta.oferta_id; }):null;
  var lim;
  if(of){ var fh=of.fecha_hasta?new Date(of.fecha_hasta).getTime():0; lim=fh?(fh+3*3600*1000):Infinity; if(of.activa===false) lim=Math.min(lim,ts+3*3600*1000); }
  else lim=ts+3*3600*1000;
  return Date.now() < lim;
}
// 2026-10-15: con oferta guardada en el carrito, devuelve el tramo normal si hoy sale más barato que el precio promo
// (null si el precio promo sigue siendo el mejor). Mismo criterio que getBestSeg: siempre el más barato.
function _mejorTramoSnap(item,r,totalUnits,precioPromo){
  if(!r||!(precioPromo>0)) return null;
  var _mj=getBestSeg(totalUnits,r);
  if(!(r[_mj]>0)||r[_mj]>=precioPromo) return null;
  return {price:r[_mj],seg:_mj,label:({pm:"precio x10",pe:"precio x3",pi:"precio de lista"})[_mj]};
}
function renderDrawer(){
  recomputarBonificados();
  var items=Object.values(cart);var db=document.getElementById("db");
  if(!items.length){db.innerHTML="<div class='cemp'><div style='font-size:2rem;margin-bottom:.5rem'>🛍</div><div>Tu pedido está vacío.</div><div style='font-size:.78rem;margin-top:.4rem;color:var(--light)'>Sumá productos desde el catálogo</div></div>";document.getElementById("ctotal").textContent="$0";document.getElementById("decanWarn").innerHTML="";document.getElementById("upgBanner").innerHTML="";resetWA();return;}
  // 2026-09-29: los combos NO cuentan como unidades de perfume (tienen precio único): antes 1 perfume + 2 combos
  // destrababa el precio x3 del perfume suelto, y 9 combos el x10.
  items=_rgOrdenarItems(items);   // 🎁 la regalería va al final del pedido
  var _rgHdrPuesto=false;
  var perfs=items.filter(function(i){return !i.isDecan && !i.isCosm && !i.isBonificado && !i.isCombo;});
  var decans=items.filter(function(i){return i.isDecan;});
  var totalUnits=perfs.reduce(function(s,i){return s+i.qty;},0);
  var totalDecans=decans.reduce(function(s,i){return s+i.qty;},0);
  var total=0,upgrades=[];
  var html=items.map(function(item){
    var sub,segLabel;
    // ── Bonificado (regalo por compra): fila a $0, no editable ──
    if(item.isBonificado){
      var _bp=allProds.find(function(x){return x.id===item.prodId;});
      var _bimg=(_bp&&_bp.imagen_url)?_bp.imagen_url:'';
      var _bfb="<div style=\"width:48px;height:48px;border-radius:6px;background:#f3eafb;border:1px solid #d9c2ef;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.1rem\">🎁</div>";
      var _bih=_bimg?("<img loading=lazy decoding=async src='"+_bimg+"' alt='' style='width:48px;height:48px;border-radius:6px;object-fit:cover;flex-shrink:0;background:#f3eafb;border:1px solid #d9c2ef' onerror='this.outerHTML="+JSON.stringify(_bfb)+"'>"):_bfb;
      return "<div class='ci' style='display:flex;align-items:flex-start;gap:.55rem'>"+
        _bih+
        "<div style='flex:1;min-width:0'>"+
          "<div class='cin'>"+_prodMl(item.nombre, _mlDe(item.prodId||item.id))+" <span style='background:#7a4fce;color:#fff;font-size:.55rem;padding:.1rem .4rem;border-radius:3px;font-weight:800;margin-left:.2rem;vertical-align:middle;letter-spacing:.04em'>BONIFICADO</span></div>"+
          "<div class='cid'>"+item.qty+" &times; <b style='color:#7a4fce'>$0</b> · regalo por tu compra 🎁</div>"+
        "</div>"+
        "<div style='display:flex;align-items:center;gap:.3rem'>"+
          "<div class='cip' style='color:#7a4fce;font-weight:800'>$0</div>"+
        "</div></div>";
    }
    // Determinar foto del item (estilo MercadoLibre: foto pequeña a la izquierda)
    var imgUrl = '';
    if(item.isCombo){
      var comboFoto = combosPublicos.find(function(c){return c.id===item.comboId;});
      if(comboFoto && comboFoto.imagen_url) imgUrl = comboFoto.imagen_url;
    } else {
      var pImg = allProds.find(function(x){return x.id === ((item.isDecan||item.isCosm) ? item.prodId : item.id);});
      if(pImg && pImg.imagen_url) imgUrl = pImg.imagen_url;
    }
    var fallbackEmoji = item.isDecan?'💧':item.isCombo?'🎁':item.isRegalo?'🎀':item.isCosm?'🧴':'🌸';
    var fallbackHtml = "<div style=\"width:48px;height:48px;border-radius:6px;background:#faf6ee;border:1px solid #e8d9bf;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.1rem\">"+fallbackEmoji+"</div>";
    var imgHtml = imgUrl
      ? "<img loading=lazy decoding=async src='"+imgUrl+"' alt='' style='width:48px;height:48px;border-radius:6px;object-fit:cover;flex-shrink:0;background:#faf6ee;border:1px solid #e8d9bf' onerror='this.outerHTML="+JSON.stringify(fallbackHtml)+"'>"
      : fallbackHtml;

    if(item.isCombo){
      sub=item.precio*item.qty;total+=sub;segLabel="precio unico combo";
      var comboRef=combosPublicos.find(function(c){return c.id===item.comboId;});
      var contHtml="";
      if(comboRef&&comboRef.combo_items&&comboRef.combo_items.length){
        contHtml="<div style='margin:.3rem 0;padding:.3rem .5rem;background:#f8f5f0;border-radius:4px;border-left:2px solid var(--accent)'>";
        (comboRef.combo_items||[]).forEach(function(ci){
          contHtml+="<div style='font-size:.68rem;color:var(--mid)'>&check; x"+ci.cantidad+" "+_catEsc(_prodMl(ci.producto_nombre, _mlDe(ci.producto_id)))+(ci.es_decan&&!/decan/i.test(ci.producto_nombre||'')?" <i style='opacity:.75'>(decant 5 ml)</i>":"")+"</div>";
        });
        contHtml+="</div>";
      }
      // FEAT 2026-05-18: badge de oferta + precio original tachado si hay oferta vigente
      var comboTieneOferta = comboRef && comboRef.precio_oferta && parseFloat(comboRef.precio_oferta) > 0 && parseFloat(comboRef.precio_oferta) < parseFloat(comboRef.precio);
      var ofertaInfoHtml = "";
      if(comboTieneOferta){
        ofertaInfoHtml = "<div style='font-size:.6rem;color:#c0392b;font-weight:700;margin-top:.1rem'>"+
          "🏷️ EN OFERTA &middot; "+
          "<span style='text-decoration:line-through;color:var(--mid);font-weight:400'>"+fmt(comboRef.precio)+"</span> &rarr; "+
          "<span>"+fmt(comboRef.precio_oferta)+"</span>"+
          "</div>";
      }
      return"<div class='ci' style='display:flex;align-items:flex-start;gap:.55rem'>"+
        imgHtml+
        "<div style='flex:1;min-width:0'>"+
          "<div class='cin' style='color:var(--accent)'>"+_prodMl(item.nombre, _mlDe(item.prodId||item.id))+
            (comboRef && comboRef.etiqueta ? " <span style='background:#c0392b;color:#fff;font-size:.55rem;padding:.1rem .35rem;border-radius:3px;font-weight:700;margin-left:.3rem;vertical-align:middle'>"+_catEsc(comboRef.etiqueta)+"</span>" : "")+
          "</div>"+
          ofertaInfoHtml+
          contHtml+
          "<div class='cid'>"+item.qty+" combo &times; "+fmt(item.precio)+"</div>"+
        "</div>"+
        "<div style='display:flex;align-items:center;gap:.3rem'>"+
          "<div class='cip'>"+fmt(sub)+"</div>"+
          "<button class='crm' onclick='rmCart(\""+item.id+"\")'>X</button>"+
        "</div></div>";
    } else if(item.isCosm){
      sub=item.precio*item.qty;total+=sub;segLabel=item.cajaLabel||"Caja";
    } else if(item.isDecan){
      sub=item.precio*item.qty;total+=sub;segLabel="Decan 5ml";
    } else {
      var p=allProds.find(function(x){return x.id===item.id;});
      var r=p?calcP(p):{pm:item.pData.pm,pe:item.pData.pe,pi:item.pData.pi};
      var seg, price;
      // ── Snapshot de oferta ──
      // Si al agregar al carrito el cliente tenía una oferta vigente, respetamos
      // ese precio aunque la oferta haya vencido (decisión de Ger).
      if(_ofertaSnapVigente(item)){
        price = item.oferta.precio_aplicado;
        // el tramo propio de la promo (guardado al agregar; carritos viejos: el tramo cuyo precio coincide)
        seg   = item.oferta.seg || (['pm','pe','pi'].find(function(sg){ return r[sg]===price; })) || item.seg || 'pi';
        segLabel = '🔥 ' + (item.oferta.etiqueta || 'oferta');
        // 2026-10-15 (WEB-675217): el precio promo guardado al agregar NUNCA puede salir más caro que el tramo
        // que el cliente ya alcanza con el carrito de ahora (10 o más → x10, VIP → x10, 3 o más → x3).
        // Antes: Eclaire entró al carrito con 1 unidad a "x3 sin mínimo" ($70.000) y, aunque después el
        // pedido llegó a 16 unidades, quedó congelado en x3 mientras el resto cobraba x10 ($64.000).
        var _mj=_mejorTramoSnap(item,r,totalUnits,price);
        if(_mj){ price=_mj.price; seg=_mj.seg; segLabel=_mj.label; if(seg!==item.seg) upgrades.push(_nomMl(item.nombre, item.prodId||item.id)); }
        if(cart[item.id]&&(cart[item.id].seg!==seg||cart[item.id].precio!==price)){ cart[item.id].seg=seg; cart[item.id].precio=price; }
        sub = price * item.qty;
        total += sub;
      } else {
        // 🐛 FIX BUG #33 (2026-05-20): si el producto tiene precio único (precio_pestana>0),
        // SIEMPRE usar ese precio sin importar la cantidad. Antes, renderDrawer recalculaba
        // con getBestSeg y cambiaba a pm/pe cuando el cliente subía la cantidad a 3 o 10,
        // ignorando que era precio único.
        var _puR = p ? (p.precio_pestana||0) : 0;
        if(_puR > 0){
          seg = 'pi';
          price = _puR;
          sub = price * item.qty;
          total += sub;
          segLabel = 'precio único';
          // Mantener sincronizado el cart
          if(seg!==item.seg || price!==item.precio){
            if(cart[item.id]){cart[item.id].seg='pi';cart[item.id].precio=_puR;}
          }
        } else {
          seg=getBestSeg(totalUnits,r);price=r[seg]||item.precio;
          sub=price*item.qty;total+=sub;
          var segLabels={pm:"precio x10",pe:"precio x3",pi:"precio de lista"};segLabel=segLabels[seg];
          if(seg!==item.seg){upgrades.push(_nomMl(item.nombre, item.prodId||item.id));if(cart[item.id]){cart[item.id].seg=seg;cart[item.id].precio=price;}}
          // auditoría 2026-10-04: si cambió el precio (cotización, lista) sin cambiar el segmento, el carrito también se actualiza
          else if(cart[item.id] && price>0 && cart[item.id].precio!==price){ cart[item.id].precio=price; }
        }
      }
    }
    var _rgPre=''; if(item.isRegalo&&!_rgHdrPuesto){ _rgHdrPuesto=true; _rgPre=_rgSeparadorHTML(); }
    return _rgPre+"<div class='ci' style='display:flex;align-items:flex-start;gap:.55rem'>"+
      imgHtml+
      "<div style='flex:1;min-width:0'><div class='cin'>"+_prodMl(item.nombre, _mlDe(item.prodId||item.id))+"</div>"+
      "<div class='cid'>"+item.qty+" x "+fmt(item.isDecan?item.precio:sub/item.qty)+" ("+segLabel+")</div></div>"+
      "<div style='display:flex;align-items:center;gap:.3rem'><div class='cip'>"+fmt(sub)+"</div>"+
      "<button class='crm' onclick='rmCart(\""+item.id+"\")'>X</button></div></div>";
  }).join("");
  db.innerHTML=html+_rgBloqueCarritoHTML();
  document.getElementById("ctotal").textContent=fmt(total);
  // Decan warning (FEAT 2026-05-22: usa helper unificado _msgMinimo)
  var dw=document.getElementById("decanWarn");
  var montoDecans = decans.reduce(function(s,i){return s+(i.precio||0)*i.qty;},0);
  var _chkDec = _decansCumpleMinimo(totalDecans, montoDecans);
  if(totalDecans>0 && totalUnits===0 && !_chkDec.cumple){
    var _cfg = window._configDecans || {};
    var _resMsg = _msgMinimo({
      prefijo: 'Compra mínima de decans',
      modo: _cfg.modo || 'unidades',
      minUnidades: parseInt(_cfg.min_unidades_sin_perfume)||0,
      minMonto: parseInt(_cfg.min_monto_sin_perfume)||0,
      unidadesActuales: totalDecans,
      montoActual: montoDecans,
      compacto: false
    });
    dw.innerHTML = _resMsg.html;
    document.getElementById("waBtn").disabled=true;document.getElementById("waBtn").style.background="#bbb";
  } else {dw.innerHTML="";resetWA();}
  document.getElementById("upgBanner").innerHTML=upgrades.length?"<div class='upg-banner'>Precios actualizados segun cantidad del pedido</div>":"";
}

function resetWA(){var w=document.getElementById("waBtn");w.disabled=false;w.style.background="#25D366";}

function rmCart(id){
  // Guardar referencia para poder deshacer
  var itemBackup = cart[id];
  if(!itemBackup) return;
  var nombreCorto = _nomMl(itemBackup.nombre, itemBackup.prodId||itemBackup.id) || 'Producto';
  // Truncar para que no rompa el toast
  if(nombreCorto.length > 40) nombreCorto = nombreCorto.slice(0, 38)+'…';
  delete cart[id];
  updateCartCount();
  renderDrawer();
  applyFilters();
  // Toast con opción "Deshacer"
  _catToastDeshacer('Eliminado: '+nombreCorto, function(){
    cart[id] = itemBackup;
    updateCartCount();
    renderDrawer();
    applyFilters();
    _catToast('Restaurado','tok');
  });
}

// Toast con botón "Deshacer" — para eliminaciones que el cliente puede revertir.
// Estilo coherente con el catálogo (acento dorado, mismas tipografías).
function _catToastDeshacer(mensaje, onUndo){
  var prev = document.getElementById('_catToastUndo');
  if(prev) prev.remove();
  var t = document.createElement('div');
  t.id = '_catToastUndo';
  t.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:var(--bg-card,#fff);color:var(--tx-main,#1a1a1a);border:1px solid var(--border,#e8e3db);border-left:4px solid var(--accent,#c4965a);padding:.7rem 1rem;border-radius:9px;font-size:.82rem;z-index:99999;box-shadow:0 6px 20px rgba(0,0,0,.18);max-width:90%;display:flex;align-items:center;gap:.7rem;animation:_catMoSlideIn .25s ease-out;font-family:inherit';
  t.innerHTML =
    "<span style='line-height:1.3'>"+_catEsc(mensaje)+"</span>"+
    "<button id='_catToastUndoBtn' style='background:transparent;color:var(--accent,#c4965a);border:none;font-weight:700;font-size:.82rem;cursor:pointer;padding:.2rem .4rem;text-decoration:underline;font-family:inherit;flex-shrink:0'>Deshacer</button>";
  document.body.appendChild(t);
  var timeoutId = null;
  function quitar(){
    t.style.transition = 'opacity .3s, transform .3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(8px)';
    setTimeout(function(){if(t&&t.parentNode)t.remove();},310);
  }
  setTimeout(function(){
    var btn = document.getElementById('_catToastUndoBtn');
    if(btn){
      btn.onclick = function(){
        if(timeoutId) clearTimeout(timeoutId);
        quitar();
        if(typeof onUndo === 'function') onUndo();
      };
      btn.onmouseover = function(){this.style.color='#a07842';};
      btn.onmouseout = function(){this.style.color='var(--accent,#c4965a)';};
    }
  }, 30);
  timeoutId = setTimeout(quitar, 5000); // 5s para deshacer
}


function validarGruposMinimos(cartItems, allProds){
  // Perfumes normales (no decan, no combo, no min_grupo)
  var perfsNormales=0;
  cartItems.forEach(function(item){
    if(item.isDecan||item.isCombo) return;
    var p=allProds.find(function(x){return x.id===item.id;});
    if(p&&!p.min_grupo) perfsNormales+=item.qty;
  });

  var grupos={};
  cartItems.forEach(function(item){
    if(item.isDecan||item.isCombo)return;
    var p=allProds.find(function(x){return x.id===item.id;});
    if(!p||!p.min_grupo||!p.min_cantidad)return;
    var g=p.min_grupo;
    if(!grupos[g])grupos[g]={min:p.min_cantidad,total:0};
    grupos[g].total+=item.qty;
  });
  var errores=[];
  // 🎯 FEAT 2026-05-22: usar _msgMinimoTexto para consistencia
  Object.keys(grupos).forEach(function(g){
    var gd=grupos[g];
    var totalEfectivo=gd.total+perfsNormales;
    if(totalEfectivo<gd.min){
      var msg = _msgMinimoTexto({
        prefijo: 'Grupo "'+g+'"',
        modo: 'unidades',
        minUnidades: gd.min,
        minMonto: 0,
        unidadesActuales: totalEfectivo,
        montoActual: 0
      });
      // Agregar contexto extra (cuántos del grupo vs perfumes normales)
      var ctx = '';
      if(perfsNormales > 0){
        ctx = ' (llevás '+gd.total+' del grupo + '+perfsNormales+' perfumes = '+totalEfectivo+'/'+gd.min+')';
      } else {
        ctx = ' (llevás '+totalEfectivo+'/'+gd.min+')';
      }
      errores.push(msg + ctx + '. Pueden sumar otros perfumes.');
    }
  });
  return errores;
}



// Auditoría 2026-10-03: el aviso por WhatsApp a los vendedores lo manda la base
// (trigger de pedidos_catalogo → CallMeBot). Las keys ya no están en el catálogo.

// ── BARRA DE ANUNCIOS ─────────────────────────────────────────────────
function loadAnnBar(){
  apiGet('configuracion','select=valor&clave=eq.anuncios_barra&limit=1').then(function(r){
    var raw=r&&r[0]&&r[0].valor;
    var bar=document.getElementById('annBar');
    if(!raw||!bar){if(bar)bar.style.display='none';return;}
    var data={msgs:[],tema:'violeta'};
    try{
      var parsed=JSON.parse(raw);
      if(Array.isArray(parsed)){data.msgs=parsed;}
      else{data=Object.assign(data,parsed);}
    }catch(e){bar.style.display='none';return;}
    var msgs=data.msgs.filter(function(m){return m.activo!==false;});
    if(!msgs.length){bar.style.display='none';return;}
    // Aplicar tema
    var tema=data.tema||'violeta';
    bar.className='ann-'+tema;
    // Renderizar mensajes duplicados para loop continuo
    var buildMsgs=function(){
      return msgs.map(function(m){
        var html=(m.texto||'').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
        return '<span class="ann-msg">'+html+'</span><span class="ann-sep">✦</span>';
      }).join('');
    };
    var track=document.getElementById('annTrack');
    if(!track)return;
    track.innerHTML=buildMsgs()+buildMsgs();
    var totalChars=msgs.reduce(function(s,m){return s+(m.texto||'').length;},0);
    track.style.animationDuration=Math.max(20,Math.min(60,totalChars*0.8))+'s';
  }).catch(function(){var b=document.getElementById('annBar');if(b)b.style.display='none';});
}

loadAnnBar();

// FASE B Sub-bloque 5 — Wrapper de sendWA que pide cliente + dirección si está logueado.
// El sendWA "original" se renombra a _sendWAOriginal. La nueva sendWA decide el flujo.
function sendWA(){
  // Validaciones rápidas antes de involucrar al cliente
  var items=Object.values(cart);
  if(!items.length) return;
  // Si la configuración no cargó (cotización/WhatsApp), no se puede armar un pedido confiable.
  if(window._configFallo){ _catToast('No se pudo cargar la configuración, recargá la página para enviar el pedido','terr'); return; }
  // Doble toque: el botón queda bloqueado mientras arranca el flujo (si ya está
  // deshabilitado porque hay un pedido en vuelo, _lockBtn directamente no hace nada).
  var waBtnLock=document.getElementById('waBtn');
  return _lockBtn(waBtnLock, function(){ _sendWAFlujo(items); }, {texto:'Procesando...'}).then(function(){
    // Si mientras tanto arrancó el envío real, el botón tiene que seguir deshabilitado.
    if(window._sendingOrder && waBtnLock){ waBtnLock.disabled=true; waBtnLock.style.opacity='.5'; }
  }).catch(function(e){ console.error('[catalogo] sendWA:', e); });
}
function _sendWAFlujo(items){

  // Guard temprano contra doble click rápido (debounce corto).
  // Si el cliente toca el botón 2 veces en menos de 1.5s, ignorar el segundo.
  // Esto evita que se dispare el flujo dos veces antes de que se setee _sendingOrder.
  var ahora = Date.now();
  if(window._sendWALastClick && (ahora - window._sendWALastClick) < 1500){
    return; // doble click muy rápido, ignorar
  }
  window._sendWALastClick = ahora;

  // Sin sesión activa NO se permite comprar: pedir cuenta/login y cortar el flujo.
  // (También bloqueado a nivel base: la política de pedidos_catalogo no admite anon.)
  if(!_catSession || !_catCliente){
    _catSugerirRegistroAntesPedido();
    return;
  }

  // ─── Validación de bloqueo / cuota vencida ───
  // Si el cliente está bloqueado o tiene cuota vencida (pasó la fecha + días de gracia),
  // no se le permite hacer pedidos hasta regularizar.
  if(_catCliente.bloqueado){
    _catToast("Tu cuenta está bloqueada para nuevos pedidos. Contactá a tu vendedor.","twarn");
    return;
  }
  // Detectar cuota vencida
  if(_catCliente.cuota_proxima_monto && _catCliente.cuota_proxima_fecha){
    var cuotaG = parseInt(_catCliente.cuota_proxima_dias_gracia)||0;
    var hoy_v = new Date(); hoy_v.setHours(0,0,0,0);
    var fechaC = new Date(_catCliente.cuota_proxima_fecha+"T00:00:00");
    var fechaLim = new Date(fechaC); fechaLim.setDate(fechaLim.getDate() + cuotaG);
    if(hoy_v > fechaLim){
      _catToast("Tu cuota acordada venció. Abonala antes de hacer un nuevo pedido.","twarn");
      return;
    }
  }

  // ─── Validación de crédito disponible (solo CC) ───
  // Hago fetch FRESCO del cliente para usar el límite actualizado
  // (por si admin modificó el límite mientras el cliente navegaba)
  if(_catCliente.cuenta_corriente_habilitada){
    apiGet("clientes","select=cuenta_corriente_habilitada,limite_credito,bloqueado,cc_bloqueo_atraso,cc_mora_modo&id=eq."+_catCliente.id+"&limit=1").then(function(rowsCli){
      var cliFresh = (Array.isArray(rowsCli)&&rowsCli[0]) ? rowsCli[0] : null;
      if(!cliFresh){
        // No se pudo verificar: continuar (no bloquear)
        _sendWAContinuar();
        return;
      }
      // Refrescar bloqueo si cambió
      if(cliFresh.bloqueado){
        _catToast("Tu cuenta fue bloqueada. Contactá a tu vendedor.","twarn");
        return;
      }
      // Refrescar habilitación CC si cambió
      if(!cliFresh.cuenta_corriente_habilitada){
        // Ya no es CC: continuar como cliente normal
        _sendWAContinuar();
        return;
      }
      // FEAT 2026-05-16: bloqueo por atraso en pago (cuota o pedido vencido)
      var bloqMode = cliFresh.cc_bloqueo_atraso || 'ninguno';
      if(bloqMode !== 'ninguno'){
        // Chequear si tiene cuotas o pedidos vencidos sin pagar
        _catChequearAtraso(_catCliente.id, bloqMode).then(function(atrasoInfo){
          if(atrasoInfo && atrasoInfo.bloquear){
            _catModalAtrasoBloqueo(atrasoInfo);
            return;
          }
          // No hay atraso → seguir con el chequeo de crédito
          _catValidarCreditoYContinuar(cliFresh, items);
        }).catch(function(e){
          console.error("[CC] error chequeando atraso:", e);
          // Si falla, no bloquear (continuar con chequeo de crédito normal)
          _catValidarCreditoYContinuar(cliFresh, items);
        });
        return;
      }
      // No tiene bloqueo configurado → ir directo al chequeo de crédito
      _catValidarCreditoYContinuar(cliFresh, items);
    }).catch(function(e){
      console.error("[CC] error consultando cliente:", e);
      _sendWAContinuar();
    });
    return; // detener flujo aquí — _sendWAContinuar() lo retoma
  }
  // No tiene CC habilitada: flujo normal
  _sendWAContinuar();
}

// FEAT 2026-05-16: chequea si el cliente tiene cuotas o pedidos vencidos sin pagar
// Retorna {bloquear: bool, motivo: 'cuota'|'pedido', items: [...]}
function _catChequearAtraso(clienteId, bloqMode){
  var hoy = new Date(); hoy.setHours(0,0,0,0);
  var hoyISO = hoy.toISOString().slice(0,10);
  if(bloqMode === 'cuota'){
    // Buscar cuotas vencidas sin pagar (cc_cuotas con fecha_vencimiento < hoy y pagada=false)
    // FIX 2026-09-23: cc_cuotas no tiene cliente_id ni pagada (la consulta daba 400 y el catch dejaba comprar).
    // Se buscan los pedidos abiertos del cliente y las cuotas vencidas de esos pedidos.
    return apiGet("pedidos_catalogo","select=id&cliente_id=eq."+clienteId+"&estado=not.in.(cancelado,cobrado)&limit=200").then(function(peds){
      var ids=(Array.isArray(peds)?peds:[]).map(function(x){return x.id;}).filter(Boolean);
      if(!ids.length) return [];
      return apiGet("cc_cuotas",
        "select=id,nro_cuota,monto,monto_pagado,fecha_vencimiento,pedido_id&pedido_id=in.("+ids.join(",")+")"+
        "&estado=in.(pendiente,parcial,vencida)&fecha_vencimiento=lt."+hoyISO+"&limit=20");
    }).then(function(rows){
      if(!Array.isArray(rows) || !rows.length) return {bloquear:false};
      return {bloquear:true, motivo:'cuota', items:rows};
    });
  } else if(bloqMode === 'pedido'){
    // Buscar pedidos con fecha_vencimiento_pago < hoy y sin cobrar
    // FIX 2026-09-23: la columna es cc_fecha_vencimiento (fecha_vencimiento_pago no existe → 400 → no bloqueaba)
    return apiGet("pedidos_catalogo",
      "select=id,nro_orden,total,cobrado_total,cc_fecha_vencimiento&cliente_id=eq."+clienteId+
      "&estado=not.in.(cancelado,cobrado)&cc_fecha_vencimiento=lt."+hoyISO+"&limit=20"
    ).then(function(rows){
      if(!Array.isArray(rows) || !rows.length) return {bloquear:false};
      // Filtrar los que tienen saldo > 0
      var conSaldo = rows.filter(function(p){
        return (parseFloat(p.total)||0) > (parseFloat(p.cobrado_total)||0);
      });
      if(!conSaldo.length) return {bloquear:false};
      return {bloquear:true, motivo:'pedido', items:conSaldo};
    });
  }
  return Promise.resolve({bloquear:false});
}

// Helper: extrae el chequeo de crédito a una función reusable
function _catValidarCreditoYContinuar(cliFresh, items){
  var limiteCredito = parseFloat(cliFresh.limite_credito) || 0;
  if(limiteCredito <= 0){
    // Sin límite definido: continuar
    _sendWAContinuar();
    return;
  }
  // Calcular crédito ya usado
  apiGet("pedidos_catalogo",
    "select=total,cobrado_total,estado&cliente_id=eq."+_catCliente.id+
    "&estado=not.in.(cancelado,cobrado)"
  ).then(function(pedActivos){
    var totalActivos = 0, totalCobrado = 0;
    if(Array.isArray(pedActivos)){
      pedActivos.forEach(function(p){
        totalActivos += parseFloat(p.total) || 0;
        totalCobrado += parseFloat(p.cobrado_total) || 0;
      });
    }
    var creditoUsado = Math.max(0, totalActivos - totalCobrado);
    var creditoDisponible = limiteCredito - creditoUsado;
    var totalNuevoPedido = items.reduce(function(s, it){
      return s + (parseFloat(it.precio||0) * parseInt(it.qty||0));
    }, 0);
    if(totalNuevoPedido > creditoDisponible + 0.01){
      _catModalCreditoExcedido({
        credito_total: limiteCredito,
        credito_usado: creditoUsado,
        credito_disponible: Math.max(0, creditoDisponible),
        total_pedido: totalNuevoPedido,
        excede_por: totalNuevoPedido - creditoDisponible
      });
      return;
    }
    _sendWAContinuar();
  }).catch(function(e){
    console.error("[CC] error validando crédito:", e);
    _sendWAContinuar();
  });
}

// Modal que muestra el bloqueo por atraso de pago
function _catModalAtrasoBloqueo(info){
  var existing = document.getElementById('_catMoAtraso');
  if(existing) existing.remove();
  var mo = document.createElement('div');
  mo.id = '_catMoAtraso';
  mo.style.cssText = 'position:fixed;inset:0;background:rgba(20,15,8,.75);z-index:1300;display:flex;align-items:center;justify-content:center;padding:1rem';
  var fmt = function(n){ return '$' + (parseFloat(n)||0).toLocaleString('es-AR',{maximumFractionDigits:0}); };
  var cantPend = info.items.length;
  var totalPend = 0;
  info.items.forEach(function(it){
    if(info.motivo === 'cuota'){
      totalPend += (parseFloat(it.monto)||0) - (parseFloat(it.monto_pagado)||0);
    } else {
      totalPend += (parseFloat(it.total)||0) - (parseFloat(it.cobrado_total)||0);
    }
  });
  var titulo = info.motivo === 'cuota'
    ? 'Tenés ' + cantPend + ' cuota' + (cantPend>1?'s':'') + ' vencida' + (cantPend>1?'s':'') + ' sin pagar'
    : 'Tenés ' + cantPend + ' pedido' + (cantPend>1?'s':'') + ' vencido' + (cantPend>1?'s':'') + ' sin pagar';
  mo.innerHTML =
    '<div style="background:#fff;border-radius:14px;max-width:420px;width:100%;padding:1.4rem;box-shadow:0 8px 40px rgba(0,0,0,.3);text-align:center">' +
      '<div style="font-size:2.5rem;margin-bottom:.4rem">🚫</div>' +
      '<div style="font-size:1.1rem;font-weight:700;color:#c5443a;margin-bottom:.6rem">No podés hacer pedidos nuevos</div>' +
      '<div style="font-size:.92rem;color:#1a1a1a;margin-bottom:.8rem;line-height:1.5">' + titulo + '.</div>' +
      '<div style="background:#fdf0ee;border:1px solid #f5c0bb;border-radius:8px;padding:.7rem .8rem;margin-bottom:1rem">' +
        '<div style="font-size:.7rem;color:#888;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem">Saldo pendiente</div>' +
        '<div style="font-size:1.4rem;font-weight:700;color:#c5443a">' + fmt(totalPend) + '</div>' +
      '</div>' +
      '<div style="font-size:.82rem;color:#555;margin-bottom:1.1rem;line-height:1.55">Para poder hacer nuevos pedidos, primero regularizá los pagos pendientes. Hablá con tu vendedor o usá la sección <b>Mi cuenta</b> para ver el detalle.</div>' +
      '<div style="display:flex;gap:.5rem">' +
        '<button onclick="_catMoAtrasoCerrar()" style="flex:1;padding:.7rem;background:#eee;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:.85rem">Cerrar</button>' +
        '<button onclick="_catMoAtrasoCerrar();if(typeof toggleMiCuenta===\'function\')toggleMiCuenta()" style="flex:1;padding:.7rem;background:#c4965a;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:.85rem">Ver Mi cuenta</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(mo);
  _catModalBackRegistrar('_catMoAtraso', _catMoAtrasoCerrar);
}

function _catMoAtrasoCerrar(){
  var m = document.getElementById('_catMoAtraso');
  if(m) m.remove();
  _catModalBackDesregistrar('_catMoAtraso');
}

// ════════════════════════════════════════════════════════════════
// Cartel modal: crédito excedido (CC)
// Muestra al cliente cuánto crédito tiene disponible y por cuánto se excede
// ════════════════════════════════════════════════════════════════
function _catModalCreditoExcedido(info){
  var existing = document.getElementById('_catMoCredito');
  if(existing) existing.remove();
  var mo = document.createElement('div');
  mo.id = '_catMoCredito';
  mo.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem';
  mo.innerHTML =
    '<div style="background:#fff;border-radius:14px;padding:1.5rem;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">'+
      '<div style="text-align:center;margin-bottom:1rem">'+
        '<div style="font-size:2.5rem;margin-bottom:.4rem">⚠️</div>'+
        '<div style="font-size:1.05rem;font-weight:700;color:#c5443a;line-height:1.3">Tu pedido excede el crédito disponible</div>'+
      '</div>'+
      '<div style="background:#fef9e8;border:1px solid #d4a830;border-radius:10px;padding:.85rem 1rem;margin-bottom:1rem;font-size:.78rem;line-height:1.5">'+
        '<div style="display:flex;justify-content:space-between;margin-bottom:.3rem"><span style="color:#7a5a1a">👑 Tu crédito total:</span><b style="color:#7a5a1a">'+_catFmtMoney(info.credito_total)+'</b></div>'+
        '<div style="display:flex;justify-content:space-between;margin-bottom:.3rem"><span style="color:#7a5a1a">💳 Ya usado en pedidos activos:</span><b style="color:#7a5a1a">'+_catFmtMoney(info.credito_usado)+'</b></div>'+
        '<div style="display:flex;justify-content:space-between;margin-bottom:.3rem;padding-top:.3rem;border-top:1px solid #d4a83055"><span style="color:#5a8a4a;font-weight:700">✅ Crédito disponible ahora:</span><b style="color:#5a8a4a">'+_catFmtMoney(info.credito_disponible)+'</b></div>'+
        '<div style="display:flex;justify-content:space-between;margin-top:.4rem;padding-top:.3rem;border-top:1px solid #d4a83055"><span style="color:#444">🛒 Este pedido:</span><b style="color:#444">'+_catFmtMoney(info.total_pedido)+'</b></div>'+
        '<div style="display:flex;justify-content:space-between;margin-top:.3rem"><span style="color:#c5443a;font-weight:700">⚠️ Excede por:</span><b style="color:#c5443a">'+_catFmtMoney(info.excede_por)+'</b></div>'+
      '</div>'+
      '<div style="font-size:.78rem;color:#444;line-height:1.5;margin-bottom:1rem">Para hacer este pedido podés:</div>'+
      '<ul style="font-size:.75rem;color:#555;line-height:1.6;padding-left:1.2rem;margin:0 0 1rem">'+
        '<li>Pagar parte de tu deuda actual</li>'+
        '<li>Reducir el monto del pedido</li>'+
        '<li>Contactar a tu vendedor para revisar el límite</li>'+
      '</ul>'+
      '<div style="display:flex;gap:.5rem">'+
        '<button onclick="_catMoCreditoCerrar()" style="flex:1;padding:.7rem;background:#eee;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:.85rem">Entendido</button>'+
      '</div>'+
    '</div>';
  document.body.appendChild(mo);
  // FIX 2026-05-15: registrar para botón atrás del celular
  _catModalBackRegistrar('_catMoCredito', _catMoCreditoCerrar);
}

function _catMoCreditoCerrar(){
  var m = document.getElementById('_catMoCredito');
  if(m) m.remove();
  _catModalBackDesregistrar('_catMoCredito');
}

// FIX 2026-05-15: cerrar modal fallback de WhatsApp
function _catMoWaFallbackCerrar(){
  var m = document.getElementById('_catMoWaFallback');
  if(m) m.remove();
  _catModalBackDesregistrar('_catMoWaFallback');
}

// _sendWAContinuar: flujo después de validaciones (extraído de sendWA)
function _sendWAContinuar(){
  var items=Object.values(cart);
  if(!items.length) return;

  // Hay sesión: chequear que tenga al menos una dirección Y un teléfono
  apiGet("clientes_direcciones","select=*&cliente_id=eq."+_catCliente.id+"&order=es_principal.desc,created_at.desc").then(function(rows){
    var dirs = Array.isArray(rows) ? rows : [];
    var tieneTelefono = !!(_catCliente.telefono_principal && String(_catCliente.telefono_principal).trim());

    if(!dirs.length){
      // No tiene dirección: forzar a crearla. Si tampoco tiene teléfono, pedir ambos en el mismo modal.
      if(!tieneTelefono){
        _catToast("Necesitamos tu teléfono y dirección para procesar el pedido","twarn");
      } else {
        _catToast("Necesitás cargar tu dirección antes de hacer un pedido","twarn");
      }
      _catNuevaDir({
        titulo: !tieneTelefono ? "Completá tus datos" : "Agregar dirección",
        pedirTelefono: !tieneTelefono,
        onComplete: function(){
          // Después de guardar, reintenta el pedido
          setTimeout(function(){ sendWA(); }, 200);
        }
      });
      return;
    }

    if(!tieneTelefono){
      // Tiene dirección pero no teléfono: pedir solo el teléfono.
      // Reusamos el mismo modal de dirección con pedirTelefono=true; pero como ya tiene una dirección,
      // mejor pedirlo aparte de forma simple.
      _catPedirTelefono(function(){
        // Después de guardar el teléfono, reintenta el pedido
        setTimeout(function(){ sendWA(); }, 200);
      });
      return;
    }

    // ════════════════════════════════════════════════════════════════
    // FLUJO NUEVO: abrir modal de cobro completo (con dirección, pago, envío)
    // El modal toma dirs, las muestra, deja elegir, y al final llama a _continuarSendWA(direccion, ctxCobro).
    // ════════════════════════════════════════════════════════════════
    _catAbrirModalCobro(dirs);
  }).catch(function(e){
    console.error("[belle-cat] sendWA error cargando direcciones:",e);
    _catToast("Error al cargar tus direcciones","terr");
  });
}

// Modal SIMPLE solo para pedir teléfono (cuando ya tiene dirección)
function _catPedirTelefono(onSaved){
  var mo = document.createElement("div");
  mo.id = "_catMoTelefono";
  mo.style.cssText = "position:fixed;inset:0;background:rgba(20,15,8,.75);z-index:1400;display:flex;align-items:center;justify-content:center;padding:1rem";
  mo.innerHTML = "<div style='background:#fff;border-radius:14px;max-width:420px;width:100%;padding:1.4rem;box-shadow:0 8px 40px rgba(0,0,0,.3)'>"+
    "<div style='font-size:2rem;margin-bottom:.4rem;text-align:center'>&#128241;</div>"+
    "<div style='font-size:1rem;font-weight:700;color:var(--dark);margin-bottom:.4rem;text-align:center'>Necesitamos tu teléfono</div>"+
    "<div style='font-size:.82rem;color:var(--mid);margin-bottom:1rem;line-height:1.4;text-align:center'>Para contactarte sobre tu pedido. 10 dígitos, sin 0 ni 15.</div>"+
    "<input type='tel' id='_catTelInput' inputmode='numeric' placeholder='Ej: 3515121193' style='width:100%;padding:.7rem .8rem;border:2px solid #d4ba8a;border-radius:8px;font-size:1rem;background:#fff;color:var(--dark);box-sizing:border-box;font-family:inherit;outline:none;margin-bottom:.8rem'>"+
    "<div style='display:flex;gap:.5rem'>"+
    "<button onclick='_catMoTelefonoCerrar()' style='flex:1;background:transparent;color:var(--mid);border:1px solid #e8d9bf;padding:.65rem;border-radius:8px;font-size:.88rem;cursor:pointer'>Cancelar</button>"+
    "<button onclick='_catGuardarTelefono()' style='flex:1;background:var(--accent);color:#fff;border:none;padding:.65rem;border-radius:8px;font-size:.88rem;font-weight:600;cursor:pointer'>Guardar</button>"+
    "</div>"+
    "</div>";
  document.body.appendChild(mo);
  // FIX 2026-05-15: registrar para botón atrás del celular
  _catModalBackRegistrar('_catMoTelefono', _catMoTelefonoCerrar);
  // Guardar callback global (lo lee _catGuardarTelefono)
  window._catTelOnSaved = onSaved || null;
  setTimeout(function(){
    var inp = document.getElementById("_catTelInput");
    if(inp) inp.focus();
  }, 100);
}

function _catMoTelefonoCerrar(){
  var m = document.getElementById('_catMoTelefono');
  if(m) m.remove();
  _catModalBackDesregistrar('_catMoTelefono');
}

function _catGuardarTelefono(){
  var inp = document.getElementById("_catTelInput");
  if(!inp || !_catCliente) return;
  var raw = inp.value.trim();
  var d = raw.replace(/\D/g,"");
  // Sacar 0 y 15 si los puso
  if(d.length === 11 && d.charAt(0) === "0") d = d.substring(1);
  if(d.length === 12 && d.substring(3,5) === "15") d = d.substring(0,3) + d.substring(5);
  if(d.length === 11 && d.substring(2,4) === "15") d = d.substring(0,2) + d.substring(4);
  if(d.length !== 10){
    _catToast("El teléfono debe tener 10 dígitos (ej: 3515121193, sin 0 ni 15)","twarn"); return;
  }
  apiPatch("clientes", {telefono_principal: d, updated_at: new Date().toISOString()}, "id=eq."+_catCliente.id).then(function(){
    _catCliente.telefono_principal = d;
    _catToast("Teléfono guardado","tok");
    _catMoTelefonoCerrar();
    var cb = window._catTelOnSaved;
    window._catTelOnSaved = null;
    if(typeof cb === "function") cb();
  }).catch(function(e){
    console.error("[belle-cat] _catGuardarTelefono error:",e);
    _catToast("Error al guardar el teléfono","terr");
  });
}

// Modal: cliente sin sesión NO puede comprar — forzamos registro o login.
// Razón: sin cuenta no podemos guardar dirección, método de pago, ni hacer seguimiento.
// Genera pedidos incompletos que después complican operativamente.
function _catSugerirRegistroAntesPedido(){
  var mo = document.createElement("div");
  mo.id = "_catMoSugReg";
  mo.style.cssText = "position:fixed;inset:0;background:rgba(20,15,8,.7);z-index:1300;display:flex;align-items:center;justify-content:center;padding:1rem";
  mo.innerHTML = "<div style='background:#fff;border-radius:14px;max-width:420px;width:100%;padding:1.4rem;box-shadow:0 8px 40px rgba(0,0,0,.3);text-align:center;position:relative'>"+
    "<button id='_btnCerrarModal' style='position:absolute;top:.5rem;right:.7rem;background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--mid);line-height:1;padding:.2rem'>&times;</button>"+
    "<div style='font-size:2.5rem;margin-bottom:.4rem'>&#128100;</div>"+
    "<div style='font-size:1.05rem;font-weight:700;color:var(--dark);margin-bottom:.4rem'>Necesitás una cuenta</div>"+
    "<div style='font-size:.85rem;color:var(--mid);margin-bottom:1.1rem;line-height:1.45'>Para hacer un pedido tenés que estar registrado. Es rápido y gratis: te permite guardar tus direcciones, ver el estado de tus pedidos y comprar más rápido la próxima vez.</div>"+
    "<div style='display:flex;flex-direction:column;gap:.45rem'>"+
      "<button id='_btnAbrirReg' style='background:var(--accent);color:#fff;border:none;padding:.7rem;border-radius:8px;font-size:.9rem;font-weight:600;cursor:pointer'>Crear cuenta gratis</button>"+
      "<button id='_btnLoginExist' style='background:transparent;color:var(--accent);border:1px solid var(--accent);padding:.6rem;border-radius:8px;font-size:.85rem;font-weight:600;cursor:pointer'>Ya tengo cuenta · Iniciar sesión</button>"+
    "</div>"+
    "</div>";
  document.body.appendChild(mo);
  mo.addEventListener("click", function(e){if(e.target===mo)_catMoSugRegCerrar();});
  // FIX 2026-05-15: registrar para botón atrás del celular
  _catModalBackRegistrar('_catMoSugReg', _catMoSugRegCerrar);
  setTimeout(function(){
    var b1 = document.getElementById("_btnAbrirReg");
    if(b1) b1.onclick = function(){_catMoSugRegCerrar();_catDrawerView="registro";if(!document.getElementById("drawerCuenta").classList.contains("open"))toggleMiCuenta();else catRenderDrawer();};
    var b2 = document.getElementById("_btnLoginExist");
    if(b2) b2.onclick = function(){_catMoSugRegCerrar();_catDrawerView="login";if(!document.getElementById("drawerCuenta").classList.contains("open"))toggleMiCuenta();else catRenderDrawer();};
    var b3 = document.getElementById("_btnCerrarModal");
    if(b3) b3.onclick = function(){_catMoSugRegCerrar();};
  }, 50);
}

function _catMoSugRegCerrar(){
  var m = document.getElementById('_catMoSugReg');
  if(m) m.remove();
  _catModalBackDesregistrar('_catMoSugReg');
}

// (eliminado: el modal "Elegir dirección" viejo y _catSeleccionarDirPedido fueron reemplazados
// por el nuevo modal de cobro completo _catAbrirModalCobro)

// ════════════════════════════════════════════════════════════════════
// MODAL DE COBRO COMPLETO (pago + dirección + entrega + total)
// Este modal reemplaza el flujo anterior de "elegir dirección → WhatsApp"
// y agrega: método de pago, modo de entrega con cálculo de costo,
// total final con envío, y validaciones antes de habilitar el botón.
// ════════════════════════════════════════════════════════════════════
window._catCobConfig = null;     // se carga al abrir
window._catCobZonas = [];        // se carga al abrir
window._catCobState = {           // estado del formulario
  forma_pago: null,
  direccion_id: null,
  modo_entrega: null,
  costo_envio: 0,
  envio_a_confirmar: false,
  envio_zona_id: null,
  telefono: ''
};

// Helper: calcula subtotal real del carrito (replica lógica de renderDrawer).
// Importante: los items en el carrito tienen `precio`, no `price`/`unitPrice`.
// Para perfumes normales hay que recalcular según getBestSeg() y calcP().
// 🐛 FIX BUG #33 (2026-05-20): respeta precio_pestana (precio único) y oferta snapshot
// igual que renderDrawer. Si el producto tiene precio único, NUNCA se aplica x3/x10.
function _catCobCalcSubtotal(){
  var items = Object.values(cart);
  if(!items.length) return 0;
  var perfs = items.filter(function(i){return !i.isDecan && !i.isCosm && !i.isBonificado && !i.isCombo;});   // FIX 2026-09-23: igual que renderDrawer (el regalo no suma unidades; 2026-09-29: ni los combos)
  var totalUnits = perfs.reduce(function(s,i){return s+(i.qty||0);},0);
  var total = 0;
  items.forEach(function(item){
    if(item.isCombo){
      total += (item.precio||0) * (item.qty||1);
    } else if(item.isCosm){
      total += (item.precio||0) * (item.qty||1);
    } else if(item.isDecan){
      total += (item.precio||0) * (item.qty||1);
    } else if(_ofertaSnapVigente(item)){
      // Oferta snapshot: respetar el precio que vio el cliente al agregar, salvo que el tramo normal
      // que alcanza con el carrito de ahora sea más barato (2026-10-15, misma regla que renderDrawer)
      var _pS=allProds.find(function(x){return x.id===item.id;});
      var _rS=_pS?calcP(_pS):(item.pData?{pm:item.pData.pm,pe:item.pData.pe,pi:item.pData.pi}:null);
      var _mjS=_mejorTramoSnap(item,_rS,totalUnits,item.oferta.precio_aplicado||0);
      total += (_mjS?_mjS.price:(item.oferta.precio_aplicado||0)) * (item.qty||1);
    } else {
      var p = allProds.find(function(x){return x.id===item.id;});
      var _pU = p ? (p.precio_pestana||0) : 0;
      if(_pU > 0){
        // Precio único: ignorar x1/x3/x10
        total += _pU * (item.qty||1);
      } else {
        var r = p ? calcP(p) : {pm:item.pData?item.pData.pm:item.precio, pe:item.pData?item.pData.pe:item.precio, pi:item.pData?item.pData.pi:item.precio};
        var seg = getBestSeg(totalUnits, r);
        var price = r[seg] || item.precio || 0;
        total += price * (item.qty||1);
      }
    }
  });
  return total;
}

// Cierra el modal de cobro de manera limpia: remueve listener huérfano del evento
// 'belle:pedido-enviado' (si quedó pendiente), limpia el timeout de 30s, y elimina
// el DOM del modal. Usar SIEMPRE en lugar de hacer .remove() directamente sobre el modal.
// ════════════════════════════════════════════════════════════════════
// _catModalConfirm — Modal de confirmación elegante para reemplazar confirm() del navegador.
//
// Uso:
//   _catModalConfirm({
//     titulo: 'Cerrar sesión',
//     mensaje: '¿Estás seguro que querés cerrar sesión?',
//     confirmTxt: 'Sí, cerrar',     // opcional, default 'Confirmar'
//     cancelTxt: 'Cancelar',         // opcional, default 'Cancelar'
//     icono: '👋',                   // opcional
//     peligroso: true,               // opcional: si true, botón confirmar en rojo
//     onConfirm: function(){...},    // callback si elige confirmar
//     onCancel: function(){...}      // opcional, callback si cancela
//   });
// ════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════
// _catPreguntar — reemplazo en promesa de confirm()/prompt() del navegador,
// con el mismo estilo que _avisoSinStockModal.
//   _catPreguntar({titulo, texto, ok, cancelar}).then(function(si){...})
//       → resuelve true si aceptó, false si canceló / tocó afuera / tocó atrás.
//   _catPreguntar({titulo, texto, ok, cancelar, campo:{label, valor, tipo}}).then(function(v){...})
//       → resuelve con el texto tipeado, o null si canceló.
// Nunca rechaza: el que llama solo necesita el .then.
// ════════════════════════════════════════════════════════════════════
function _catPreguntar(opts){
  opts=opts||{};
  var conCampo=!!opts.campo;
  var negativo=conCampo?null:false;
  return new Promise(function(resolve){
    var prev=document.getElementById('_catMoPreguntar'); if(prev)prev.remove();
    var campoHtml='';
    if(conCampo){
      var c=opts.campo;
      campoHtml=
        (c.label?"<label for='_catMoPregInp' style='display:block;text-align:left;font-size:.72rem;color:#7a6a50;font-weight:600;margin:.2rem 0 .3rem'>"+_catEsc(c.label)+"</label>":"")+
        "<input id='_catMoPregInp' type='"+_catEscAttr(c.tipo||'text')+"' value='"+_catEscAttr(c.valor==null?'':c.valor)+"' style='width:100%;box-sizing:border-box;padding:.6rem .75rem;border:1px solid #e8d9bf;border-radius:9px;font-size:.88rem;color:#1a1a1a;background:#faf6ee;outline:none;font-family:inherit'>";
    }
    var mo=document.createElement('div');
    mo.id='_catMoPreguntar';
    mo.style.cssText='position:fixed;inset:0;background:rgba(20,15,8,.65);z-index:100000;display:flex;align-items:center;justify-content:center;padding:1rem';
    mo.innerHTML=
      "<div style='background:#fff;border:1px solid #e8d9bf;border-radius:14px;max-width:430px;width:100%;padding:1.4rem 1.3rem;box-shadow:0 10px 40px rgba(0,0,0,.25);text-align:center'>"+
        "<div style='font-size:1.05rem;font-weight:700;color:#1a1a1a;margin-bottom:.35rem;font-family:\"Cormorant Garamond\",serif'>"+_catEsc(opts.titulo||(conCampo?'Ingresá un dato':'Confirmar'))+"</div>"+
        (opts.texto?"<div style='font-size:.84rem;color:#555;margin-bottom:.8rem;line-height:1.45'>"+_catEsc(opts.texto)+"</div>":"")+
        campoHtml+
        "<div style='display:flex;gap:.5rem;justify-content:center;margin-top:1rem'>"+
          "<button type='button' id='_catMoPregCan' style='background:transparent;color:#555;border:1px solid #e8d9bf;padding:.65rem 1.3rem;border-radius:9px;font-size:.85rem;font-weight:500;cursor:pointer;font-family:inherit'>"+_catEsc(opts.cancelar||'Cancelar')+"</button>"+
          "<button type='button' id='_catMoPregOk' style='background:var(--accent,#c4965a);color:#fff;border:none;padding:.65rem 1.6rem;border-radius:9px;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit'>"+_catEsc(opts.ok||'Aceptar')+"</button>"+
        "</div>"+
      "</div>";
    document.body.appendChild(mo);
    var listo=false;
    // desdeAtras=true cuando lo cierra el botón atrás: el listener popstate ya sacó el modal de la pila.
    function terminar(valor, desdeAtras){
      if(listo) return; listo=true;
      mo.remove();
      if(!desdeAtras && typeof _catModalBackDesregistrar==='function') _catModalBackDesregistrar('_catMoPreguntar');
      resolve(valor);
    }
    var inp=document.getElementById('_catMoPregInp');
    document.getElementById('_catMoPregCan').onclick=function(){ terminar(negativo,false); };
    document.getElementById('_catMoPregOk').onclick=function(){ terminar(conCampo?String(inp?inp.value:''):true,false); };
    mo.addEventListener('click',function(e){ if(e.target===mo) terminar(negativo,false); });
    if(inp){
      inp.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); terminar(String(inp.value),false); } });
      setTimeout(function(){ try{ inp.focus(); inp.select(); }catch(e){} },30);
    }
    if(typeof _catModalBackRegistrar==='function') _catModalBackRegistrar('_catMoPreguntar', function(){ terminar(negativo,true); });
  });
}

// 🆕 2026-08: modal de FALTA DE STOCK al generar el pedido (en pantalla, mismo estilo del catálogo).
// fallas: [{nombre, qty, disp}] — disp null = "sin apartar" (no sabemos cuántas quedan).
function _avisoSinStockModal(fallas, opts){
  opts=opts||{};
  var prev=document.getElementById('_catMoSinStock'); if(prev)prev.remove();
  var lista=(fallas||[]).map(function(f){
    var nom=_nomMl(String(f.nombre||'').split(' - ').pop(), f.pid||f.id);
    var der = (f.disp==null) ? "<span style='color:#b3781e'>sin apartar</span>"
            : (f.disp>0 ? "<span style='color:#b3781e'>quedan "+f.disp+"</span>"
                        : "<span style='color:#c5443a'>agotado</span>");
    return "<div style='display:flex;justify-content:space-between;align-items:center;gap:.6rem;padding:.45rem .2rem;border-bottom:1px solid #f0e7d6;font-size:.84rem'>"+
      "<span style='color:#3a3125;font-weight:600;text-align:left;min-width:0'>"+_catEsc(nom)+(f.qty?" <span style='color:#9a8870;font-weight:400;white-space:nowrap'>(pediste "+f.qty+")</span>":"")+"</span>"+
      "<span style='white-space:nowrap;font-weight:700'>"+der+"</span></div>";
  }).join('');
  var mo=document.createElement('div');
  mo.id='_catMoSinStock';
  mo.style.cssText='position:fixed;inset:0;background:rgba(20,15,8,.65);z-index:1600;display:flex;align-items:center;justify-content:center;padding:1rem';
  mo.innerHTML=
    "<div style='background:#fff;border:1px solid #e8d9bf;border-radius:14px;max-width:430px;width:100%;padding:1.4rem 1.3rem;box-shadow:0 10px 40px rgba(0,0,0,.25);text-align:center'>"+
      "<div style='font-size:2.3rem;line-height:1;margin-bottom:.4rem'>"+(opts.icono||'⚠️')+"</div>"+
      "<div style='font-size:1.05rem;font-weight:700;color:#1a1a1a;margin-bottom:.35rem;font-family:\"Cormorant Garamond\",serif'>"+_catEsc(opts.titulo||'Sin stock disponible')+"</div>"+
      "<div style='font-size:.84rem;color:#555;margin-bottom:.8rem;line-height:1.45'>"+_catEsc(opts.intro||'Estos productos no tienen stock en este momento:')+"</div>"+
      "<div style='background:#faf6ee;border:1px solid #f0e7d6;border-radius:10px;padding:.3rem .7rem;margin-bottom:1rem;max-height:40vh;overflow-y:auto'>"+lista+"</div>"+
      (opts.nota?"<div style='font-size:.8rem;color:#7a6a50;margin-bottom:1rem;line-height:1.45'>"+_catEsc(opts.nota)+"</div>":"")+
      "<button onclick=\"var m=document.getElementById('_catMoSinStock');if(m)m.remove();\" style='background:var(--accent,#c4965a);color:#fff;border:none;padding:.65rem 1.6rem;border-radius:9px;font-size:.88rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 2px 8px rgba(196,150,90,.3)'>Entendido</button>"+
    "</div>";
  document.body.appendChild(mo);
}

// 🆕 2026-08: modal "tu carrito se ajustó solo" — se quedó sin stock algo justo al enviar.
// ajustes: [{tipo:'agotado'|'ajustado'|'combo'|'regalo', nombre, qtyAntes, qtyAhora}]
function _stockAjustadoModal(ajustes, opts){
  opts=opts||{};
  var prev=document.getElementById('_catMoStockAj'); if(prev)prev.remove();
  var filas=(ajustes||[]).map(function(a){
    var nom=String(a.nombre||'').split(' - ').pop();
    var ico, chip;
    if(a.tipo==='ajustado'){ ico='➖'; chip="<span style='background:#fdf3e3;color:#b3781e;border:1px solid #eed9b0;border-radius:20px;padding:.14rem .55rem;font-size:.68rem;font-weight:700;white-space:nowrap'>"+a.qtyAntes+" → "+a.qtyAhora+" u.</span>"; }
    else if(a.tipo==='combo'){ ico='📦'; chip="<span style='background:#f3effc;color:#7a5fbd;border:1px solid #ded3f2;border-radius:20px;padding:.14rem .55rem;font-size:.68rem;font-weight:700;white-space:nowrap'>combo quitado</span>"; }
    else if(a.tipo==='regalo'){ ico='🎁'; chip="<span style='background:#f3effc;color:#7a5fbd;border:1px solid #ded3f2;border-radius:20px;padding:.14rem .55rem;font-size:.68rem;font-weight:700;white-space:nowrap'>regalo quitado</span>"; }
    else { ico='🚫'; chip="<span style='background:#fbeceb;color:#c5443a;border:1px solid #f2cfcc;border-radius:20px;padding:.14rem .55rem;font-size:.68rem;font-weight:700;white-space:nowrap'>agotado · quitado</span>"; }
    return "<div style='display:flex;align-items:center;gap:.55rem;padding:.55rem .2rem;border-bottom:1px solid #f0e7d6'>"+
      "<span style='font-size:1rem;flex-shrink:0'>"+ico+"</span>"+
      "<span style='flex:1;min-width:0;text-align:left;font-size:.84rem;color:#3a3125;font-weight:600;line-height:1.3'>"+_catEsc(nom)+"</span>"+chip+
    "</div>";
  }).join('');
  var quedan=opts.quedanItems!==false;
  var botones = quedan
    ? "<button id='_stkAjSeguir' style='width:100%;background:linear-gradient(135deg,#c99a52,#b3813a);color:#fff;border:none;padding:.8rem 1rem;border-radius:11px;font-size:.92rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(196,150,90,.35)'>Continuar con mi pedido &#10003;</button>"+
      "<button id='_stkAjVolver' style='width:100%;background:transparent;color:#8a6d3b;border:1.5px solid #d4ba8a;padding:.7rem 1rem;border-radius:11px;font-size:.85rem;font-weight:600;cursor:pointer;font-family:inherit'>Volver al carrito y elegir un reemplazo</button>"
    : "<button id='_stkAjVolver' style='width:100%;background:linear-gradient(135deg,#c99a52,#b3813a);color:#fff;border:none;padding:.8rem 1rem;border-radius:11px;font-size:.92rem;font-weight:700;cursor:pointer;font-family:inherit'>Buscar otros productos</button>";
  var mo=document.createElement('div');
  mo.id='_catMoStockAj';
  mo.style.cssText='position:fixed;inset:0;background:rgba(20,15,8,.68);z-index:1600;display:flex;align-items:center;justify-content:center;padding:1rem;animation:_catMoFadeIn .18s ease-out';
  mo.innerHTML=
    "<div style='background:#fff;border-radius:16px;max-width:440px;width:100%;overflow:hidden;box-shadow:0 14px 50px rgba(0,0,0,.3);animation:_catMoSlideIn .22s ease-out'>"+
      "<div style='height:5px;background:linear-gradient(90deg,#e8b86d,#c4965a,#8a6d3b)'></div>"+
      "<div style='padding:1.35rem 1.3rem 1.25rem;text-align:center'>"+
        "<div style='font-size:2.2rem;line-height:1;margin-bottom:.4rem'>🛒</div>"+
        "<div style='font-size:1.12rem;font-weight:700;color:#1a1a1a;margin-bottom:.3rem;font-family:\"Cormorant Garamond\",serif'>Ajustamos tu carrito</div>"+
        "<div style='font-size:.84rem;color:#666;line-height:1.45;margin-bottom:.9rem'>Justo se quedó sin stock lo siguiente y "+(ajustes.length>1?"los descontamos":"lo descontamos")+" de tu pedido:</div>"+
        "<div style='background:#faf6ee;border:1px solid #f0e7d6;border-radius:12px;padding:.25rem .8rem;margin-bottom:1rem;max-height:38vh;overflow-y:auto'>"+filas+"</div>"+
        (quedan
          ? "<div style='font-size:.78rem;color:#7a6a50;line-height:1.45;margin-bottom:1rem'>El resto de tu pedido está intacto. Podés confirmarlo así, o volver al carrito para sumar un reemplazo.</div>"
          : "<div style='font-size:.78rem;color:#7a6a50;line-height:1.45;margin-bottom:1rem'>Tu carrito quedó vacío. ¡Seguro encontrás otro perfume que te encante!</div>")+
        "<div style='display:flex;flex-direction:column;gap:.5rem'>"+botones+"</div>"+
      "</div>"+
    "</div>";
  document.body.appendChild(mo);
  var _cerrar=function(){ var m=document.getElementById('_catMoStockAj'); if(m)m.remove(); };
  var bS=document.getElementById('_stkAjSeguir');
  if(bS)bS.onclick=function(){
    _cerrar();
    // re-disparar el envío con el carrito ya ajustado (revalida todo de nuevo)
    setTimeout(function(){ try{ _sendWAOriginal(); }catch(e){ console.error('[stock-ajuste reenvío]',e); } },80);
  };
  var bV=document.getElementById('_stkAjVolver');
  if(bV)bV.onclick=function(){
    _cerrar();
    try{
      var dw=document.getElementById('drawer');
      if(dw && !dw.classList.contains('open')) toggleCart(); else if(typeof renderDrawer==='function') renderDrawer();
    }catch(e){}
  };
}

function _catModalConfirm(opts){
  opts = opts || {};
  var titulo = opts.titulo || 'Confirmar';
  var mensaje = opts.mensaje || '¿Estás seguro?';
  var confirmTxt = opts.confirmTxt || 'Confirmar';
  var cancelTxt = opts.cancelTxt || 'Cancelar';
  var icono = opts.icono || '';
  var peligroso = !!opts.peligroso;
  var onConfirm = typeof opts.onConfirm === 'function' ? opts.onConfirm : function(){};
  var onCancel = typeof opts.onCancel === 'function' ? opts.onCancel : function(){};

  // Cerrar modal previo si existe (evitar superposición)
  var prev = document.getElementById('_catMoConfirm');
  if(prev) prev.remove();

  var mo = document.createElement('div');
  mo.id = '_catMoConfirm';
  mo.style.cssText = 'position:fixed;inset:0;background:rgba(20,15,8,.65);z-index:1500;display:flex;align-items:center;justify-content:center;padding:1rem;animation:_catMoFadeIn .18s ease-out';

  // Color del botón confirmar según si es acción destructiva
  var btnConfirmBg = peligroso ? '#c5443a' : 'var(--accent)';
  var btnConfirmHoverBg = peligroso ? '#a73a32' : '#b48749';

  mo.innerHTML =
    "<div style='background:var(--bg-card,#fff);border:1px solid var(--border,#e8e3db);border-radius:14px;max-width:380px;width:100%;padding:1.5rem 1.4rem;box-shadow:0 10px 40px rgba(0,0,0,.25);text-align:center;animation:_catMoSlideIn .22s ease-out'>"+
      (icono ? "<div style='font-size:2.5rem;margin-bottom:.4rem;line-height:1'>"+icono+"</div>" : "")+
      "<div style='font-size:1.05rem;font-weight:700;color:var(--tx-main,#1a1a1a);margin-bottom:.5rem;font-family:\"Cormorant Garamond\",serif'>"+_catEsc(titulo)+"</div>"+
      "<div style='font-size:.88rem;color:var(--tx-mid,#555);margin-bottom:1.3rem;line-height:1.5'>"+_catEsc(mensaje)+"</div>"+
      "<div style='display:flex;gap:.5rem;justify-content:center'>"+
        "<button id='_catMoConfirmCancel' style='background:transparent;color:var(--tx-mid,#555);border:1px solid var(--border,#e8e3db);padding:.65rem 1.3rem;border-radius:9px;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .15s;font-family:inherit'>"+_catEsc(cancelTxt)+"</button>"+
        "<button id='_catMoConfirmOk' style='background:"+btnConfirmBg+";color:#fff;border:none;padding:.65rem 1.3rem;border-radius:9px;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit;box-shadow:0 2px 8px rgba(196,150,90,.3)'>"+_catEsc(confirmTxt)+"</button>"+
      "</div>"+
    "</div>";

  // Inyectar animaciones si no existen
  if(!document.getElementById('_catMoConfirmStyle')){
    var st = document.createElement('style');
    st.id = '_catMoConfirmStyle';
    st.textContent =
      '@keyframes _catMoFadeIn{from{opacity:0}to{opacity:1}}'+
      '@keyframes _catMoSlideIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}';
    document.head.appendChild(st);
  }

  document.body.appendChild(mo);

  function cerrar(){
    mo.style.animation = '_catMoFadeIn .15s ease-out reverse';
    setTimeout(function(){mo.remove();}, 140);
    // FIX 2026-05-15: desregistrar del back button
    _catModalBackDesregistrar('_catMoConfirm');
  }

  // FIX 2026-05-15: registrar para botón atrás del celular (cancela)
  _catModalBackRegistrar('_catMoConfirm', function(){ cerrar(); onCancel(); });

  // Click fuera del modal cancela
  mo.addEventListener('click', function(e){
    if(e.target === mo){
      cerrar();
      onCancel();
    }
  });

  setTimeout(function(){
    var btnCancel = document.getElementById('_catMoConfirmCancel');
    var btnOk = document.getElementById('_catMoConfirmOk');
    if(btnCancel){
      btnCancel.onclick = function(){ cerrar(); onCancel(); };
      btnCancel.onmouseover = function(){this.style.background='rgba(0,0,0,.04)';};
      btnCancel.onmouseout = function(){this.style.background='transparent';};
    }
    if(btnOk){
      btnOk.onclick = function(){ cerrar(); onConfirm(); };
      btnOk.onmouseover = function(){this.style.background = peligroso ? '#a73a32' : '#b48749';};
      btnOk.onmouseout = function(){this.style.background = btnConfirmBg;};
      btnOk.focus();
    }
  }, 30);

  // Tecla Escape cancela
  var escHandler = function(e){
    if(e.key === 'Escape'){
      document.removeEventListener('keydown', escHandler);
      cerrar();
      onCancel();
    } else if(e.key === 'Enter'){
      document.removeEventListener('keydown', escHandler);
      cerrar();
      onConfirm();
    }
  };
  document.addEventListener('keydown', escHandler);
}

// ════════════════════════════════════════════════════════════════════
// SISTEMA "BOTÓN ATRÁS CIERRA MODAL" — diseño minimalista
// ════════════════════════════════════════════════════════════════════
// Cuando el cliente toca el botón "atrás" del celular (o Alt+← en PC),
// queremos cerrar el modal activo en lugar de salir de la web.
//
// PRINCIPIOS DE DISEÑO (para evitar el bug que cerraba la web):
// 1) JAMÁS llamamos history.back() programáticamente — eso era lo que
//    en combinación con window.open de WhatsApp cerraba toda la web.
// 2) Al abrir un modal hacemos UN history.pushState. La entrada queda
//    en el historial.
// 3) Si el user cierra con X (o por éxito de compra), NO tocamos el
//    historial. La entrada queda "fantasma" hasta que toque atrás
//    (entonces caerá ahí silenciosamente sin afectar nada).
// 4) Si el user toca atrás: dispara popstate, nuestro listener cierra
//    el modal del top. NO re-pusheamos nada.
//
// Trade-off aceptado: si abre y cierra modal varias veces sin tocar
// atrás, quedan entradas fantasma en el historial. Cuando finalmente
// toque atrás, va a "consumir" esas entradas (cada toque consume una)
// y eventualmente saldrá de la web. Es feo pero NO ROMPE NADA.
window._catModalStack = window._catModalStack || [];

function _catModalBackRegistrar(modalId, fnCerrar){
  // Agregar a la pila (LIFO)
  window._catModalStack.push({id: modalId, cerrar: fnCerrar});
  // SIEMPRE pushear una nueva entrada al abrir (sin esto, el botón atrás
  // saldría de la web inmediatamente)
  try { history.pushState({belleModal: modalId, t: Date.now()}, '', location.href); } catch(e){}
}

function _catModalBackDesregistrar(modalId){
  // Sacar de la pila el modal que se cerró
  var idx = -1;
  for(var i = window._catModalStack.length - 1; i >= 0; i--){
    if(window._catModalStack[i].id === modalId){ idx = i; break; }
  }
  if(idx >= 0) window._catModalStack.splice(idx, 1);
  // FIX: si la entrada actual del historial es NUESTRA (tiene belleModal en el state),
  // la "limpiamos" con replaceState — eso NO navega ni dispara popstate, solo reemplaza
  // el state actual por uno vacío. Así si el user toca atrás después de cerrar
  // el modal normalmente, NO consume nuestra entrada fantasma (ya la limpiamos)
  // sino que va a la entrada real anterior.
  try {
    if(history.state && history.state.belleModal){
      history.replaceState(null, '', location.href);
    }
  } catch(e){}
}

// Listener UNA SOLA VEZ
if(!window._catModalBackListenerInstalled){
  window._catModalBackListenerInstalled = true;
  window.addEventListener('popstate', function(){
    // Si hay modal abierto: cerrarlo en lugar de dejar que la página navegue atrás
    if(window._catModalStack.length > 0){
      var top = window._catModalStack[window._catModalStack.length - 1];
      // Sacar de la pila ANTES de llamar al cerrar (evita doble-llamada si el cerrar
      // intentara también desregistrar)
      window._catModalStack.pop();
      try { top.cerrar(); } catch(e){ console.error('[belle-cat] cerrar modal:', e); }
    }
    // Si no había modales, popstate continúa normal (sale al historial real)
  });
}

function _catCobCerrarModal(){
  // Limpiar listener si todavía está activo
  if(window._catCobOnPedidoListener){
    try { window.removeEventListener('belle:pedido-enviado', window._catCobOnPedidoListener); } catch(e){}
    window._catCobOnPedidoListener = null;
  }
  // Limpiar timeout pendiente
  if(window._catCobTimeoutId){
    clearTimeout(window._catCobTimeoutId);
    window._catCobTimeoutId = null;
  }
  var mo = document.getElementById('_catMoCobro');
  if(mo) mo.remove();
  // FIX 2026-05-15: desregistrar de la pila (botón atrás)
  _catModalBackDesregistrar('_catMoCobro');
}

function _catAbrirModalCobro(dirs){
  // Cerrar modal previo (con limpieza de listener)
  _catCobCerrarModal();

  // Resetear estado
  // FEAT CC v2 (2026-05-14): pre-seleccionar CC si cliente tiene CC habilitada
  var _formaPagoDefault = null;
  if(_catCliente && _catCliente.cuenta_corriente_habilitada && !_catCliente.bloqueado){
    _formaPagoDefault = 'cuenta_corriente';
  }
  window._catCobState = {
    forma_pago: _formaPagoDefault,
    direccion_id: null,
    modo_entrega: null,
    costo_envio: 0,
    envio_a_confirmar: false,
    envio_zona_id: null,
    telefono: (_catCliente && _catCliente.telefono_principal) || ''
  };
  // Limpiar plan elegido previo
  window._catCCPlanElegido = null;
  window._catCCDatosCC = null;

  // Cargar config + zonas + círculos en paralelo
  Promise.all([
    apiGet('config_pago','select=*&id=eq.1&limit=1').catch(function(){return [];}),
    apiGet('envios_zonas','select=*&activa=is.true').catch(function(){return [];}),
    apiGet('envios_zonas_circulos','select=*&activo=is.true').catch(function(){return [];})
  ]).then(function(data){
    window._catCobConfig = (data[0]||[])[0] || {
      // Defaults si no hay config en BD
      efectivo_habilitado:true, transferencia_habilitada:true,
      tarjeta_habilitada:false, mercadopago_habilitado:false,
      envio_domicilio_habilitado:true, envio_domicilio_radio_km:30,
      envio_domicilio_origen_lat:-31.4201, envio_domicilio_origen_lng:-64.1888,
      andreani_mensaje_default:'Cotización a confirmar por zona',
      banco_mostrar:false, banco_observacion:''
    };
    window._catCobZonas = Array.isArray(data[1]) ? data[1] : [];
    // Indexar círculos por zona_id para lookup rápido en _catMatchearZona
    var circulosMap = {};
    (Array.isArray(data[2]) ? data[2] : []).forEach(function(c){
      var zid = c.zona_id;
      if(!circulosMap[zid]) circulosMap[zid] = [];
      circulosMap[zid].push(c);
    });
    window._catCobZonasCirculos = circulosMap;
    window._catCobDirs = dirs;
    _catRenderModalCobro();
  }).catch(function(){
    _catToast('Error cargando configuración de pago','terr');
  });
}

function _catRenderModalCobro(){
  var dirs = window._catCobDirs || [];
  var cfg = window._catCobConfig || {};
  var st = window._catCobState;

  // Calcular subtotal del carrito (replica lógica de renderDrawer)
  var subtotal = _catCobCalcSubtotal();

  var mo = document.createElement('div');
  mo.id = '_catMoCobro';
  mo.style.cssText = 'position:fixed;inset:0;background:rgba(20,15,8,.75);z-index:1500;display:flex;align-items:flex-start;justify-content:center;padding:1rem;overflow-y:auto';

  var h = "<div style='background:#fff;border-radius:14px;max-width:520px;width:100%;max-height:96vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.3);margin:auto'>"+
    // HEADER
    "<div style='padding:1rem 1.1rem;border-bottom:1px solid #e8d9bf;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(to bottom,#fff,#faf6ee)'>"+
      "<div>"+
        "<div style='font-size:1rem;font-weight:700;color:var(--dark)'>Confirmá tu pedido</div>"+
        "<div style='font-size:.7rem;color:var(--mid);margin-top:.1rem'>Completá los datos para enviarlo</div>"+
      "</div>"+
      "<button onclick='_catCobCerrarModal()' style='background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--mid);padding:0;line-height:1'>&times;</button>"+
    "</div>"+

    "<div style='overflow-y:auto;padding:1rem 1.1rem;flex:1;display:grid;gap:.9rem'>";

    // ── SECCIÓN 1: DOMICILIO DE ENTREGA ─────────────────────────
    h += "<div>"+
      "<div style='font-size:.78rem;font-weight:700;color:var(--dark);margin-bottom:.45rem;display:flex;align-items:center;gap:.3rem'><span>📍</span><span>Dirección de entrega</span></div>"+
      "<div id='_catCobDirs' style='display:grid;gap:.4rem'>";
    if(!dirs.length){
      h += "<div style='font-size:.78rem;color:var(--mid);font-style:italic;padding:.5rem;background:#fef9e8;border-radius:6px;border:1px solid #f0d878'>No tenés direcciones cargadas. Agregá una para continuar.</div>";
    } else {
      dirs.forEach(function(d){
        var sel = st.direccion_id===d.id;
        var dirTxt = d.direccion_completa || ((d.calle||"")+" "+(d.numero||""));
        var locTxt = (d.localidad?d.localidad+', ':'')+(d.provincia||'')+(d.codigo_postal?' (CP '+d.codigo_postal+')':'');
        h += "<div onclick='_catCobSelDir("+d.id+")' style='border:2px solid "+(sel?'var(--accent)':'#e8d9bf')+";background:"+(sel?'rgba(196,150,90,.08)':'#fff')+";border-radius:8px;padding:.55rem .7rem;cursor:pointer;transition:all .15s'>"+
          "<div style='font-size:.78rem;font-weight:600;color:var(--dark)'>"+_catEsc(d.etiqueta||'Sin etiqueta')+(d.es_principal||d.principal?' <span style=\"font-size:.6rem;background:var(--accent);color:#fff;padding:.1rem .35rem;border-radius:8px;font-weight:600;margin-left:.2rem\">PRINCIPAL</span>':'')+"</div>"+
          "<div style='font-size:.72rem;color:var(--dark);margin-top:.15rem'>"+_catEsc(dirTxt)+"</div>"+
          "<div style='font-size:.65rem;color:var(--mid);margin-top:.1rem'>"+_catEsc(locTxt)+"</div>"+
        "</div>";
      });
    }
    h += "<button onclick='_catCobCerrarModal();_catNuevaDir()' style='width:100%;background:transparent;color:var(--accent);border:1px dashed var(--accent);padding:.5rem;border-radius:7px;font-size:.78rem;cursor:pointer'>+ Agregar nueva dirección</button>";
    h += "</div></div>";

    // ── SECCIÓN 2: TELÉFONO ─────────────────────────────────────
    h += "<div>"+
      "<div style='font-size:.78rem;font-weight:700;color:var(--dark);margin-bottom:.45rem;display:flex;align-items:center;gap:.3rem'><span>📱</span><span>Teléfono de contacto</span></div>"+
      "<input type='tel' id='_catCobTel' value='"+_catEsc(st.telefono||'')+"' placeholder='Ej: 351 123 4567' oninput='_catCobActState()' style='width:100%;padding:.55rem .7rem;background:#faf6ee;border:1px solid #e8d9bf;border-radius:7px;font-size:.85rem;color:var(--dark)'>"+
    "</div>";

    // ── SECCIÓN 3: MODO DE ENTREGA ──────────────────────────────
    h += "<div id='_catCobModoEntregaCont'>"+
      "<div style='font-size:.78rem;font-weight:700;color:var(--dark);margin-bottom:.45rem;display:flex;align-items:center;gap:.3rem'><span>🚚</span><span>Modo de entrega</span></div>"+
      "<div style='font-size:.7rem;color:var(--mid);font-style:italic'>Elegí una dirección para ver opciones de entrega</div>"+
    "</div>";

    // ── SECCIÓN 4: MÉTODO DE PAGO ───────────────────────────────
    h += "<div>"+
      "<div style='font-size:.78rem;font-weight:700;color:var(--dark);margin-bottom:.45rem;display:flex;align-items:center;gap:.3rem'><span>💳</span><span>Método de pago</span></div>"+
      "<div style='display:grid;grid-template-columns:1fr 1fr;gap:.4rem'>";
    // FEAT CC v2 (2026-05-14): si cliente tiene CC habilitada, ofrecer como primera opción
    var _catTieneCC = !!(typeof _catCliente!=='undefined' && _catCliente && _catCliente.cuenta_corriente_habilitada);
    var metodos = [];
    if(_catTieneCC){
      metodos.push({k:'cuenta_corriente', l:'💳 Cuenta corriente', hab:true, destacado:true});
    }
    metodos = metodos.concat([
      {k:'efectivo',  l:'💵 Efectivo',     hab: cfg.efectivo_habilitado!==false},
      {k:'transferencia', l:'🏦 Transferencia', hab: cfg.transferencia_habilitada!==false},
      {k:'tarjeta',   l:'💳 Tarjeta',      hab: !!cfg.tarjeta_habilitada,    soon: !cfg.tarjeta_habilitada},
      {k:'mercadopago', l:'💙 Mercado Pago', hab: !!cfg.mercadopago_habilitado, soon: !cfg.mercadopago_habilitado}
    ]);
    metodos.forEach(function(m){
      var sel = st.forma_pago === m.k;
      var disabled = !m.hab;
      var op = disabled ? ';opacity:.5;cursor:not-allowed' : ';cursor:pointer';
      var click = disabled ? "_catToast('"+(m.soon?'Próximamente':'No habilitado')+"','twarn')" : "_catCobSelPago('"+m.k+"')";
      // Si es CC y destacado, agregar badge dorado
      var bgExtra = (m.destacado && !sel) ? ';background:linear-gradient(135deg,rgba(196,150,90,.08),rgba(196,150,90,.02))' : '';
      var borderCol = sel ? 'var(--accent)' : (m.destacado ? 'rgba(196,150,90,.6)' : '#e8d9bf');
      h += "<div id='_catCobPago_"+m.k+"' onclick=\""+click+"\" style='border:2px solid "+borderCol+";background:"+(sel?'rgba(196,150,90,.08)':'#fff')+bgExtra+";border-radius:8px;padding:.55rem .55rem;text-align:center;font-size:.78rem;font-weight:600;color:"+(disabled?'var(--mid)':'var(--dark)')+";transition:all .15s"+op+"'>"+
        m.l+(m.soon?"<div style='font-size:.55rem;color:var(--mid);margin-top:.1rem'>Pronto</div>":'')+
        (m.destacado?"<div style='font-size:.55rem;color:var(--accent);margin-top:.1rem;font-weight:700'>★ Tu cuenta</div>":'')+
      "</div>";
    });
    h += "</div></div>";

    // ── SECCIÓN 4b: DATOS BANCARIOS (si elige transferencia) ────
    h += "<div id='_catCobBancoBox' style='display:none'></div>";

    // ── SECCIÓN 4c: PANEL CC (si elige cuenta corriente) ─────────
    h += "<div id='_catCobCCBox' style='display:none'></div>";

    // ── 🎁 SECCIÓN 4d: ¿ES PARA REGALAR? (2026-09-30) ─────────────
    h += "<div id='_rgCobBloque'>"+_rgBloqueCobroHTML()+"</div>";

    // ── SECCIÓN AVISOS DE RESTRICCIONES (campaña / compra mínima) ────
    h += "<div id='_catCobAvisosBox'></div>";

    // ── SECCIÓN 5: RESUMEN / TOTAL ──────────────────────────────
    h += "<div style='background:#faf6ee;border:1px solid #e8d9bf;border-radius:9px;padding:.7rem .85rem'>"+
      "<div style='display:flex;justify-content:space-between;font-size:.78rem;color:var(--dark);margin-bottom:.25rem'>"+
        "<span>Productos:</span><span id='_catCobSubtot'>"+fmt(subtotal)+"</span>"+
      "</div>"+
      "<div style='display:flex;justify-content:space-between;font-size:.78rem;color:var(--dark);margin-bottom:.4rem'>"+
        "<span>Envío:</span><span id='_catCobEnvio' style='color:var(--mid);font-style:italic'>Elegí entrega</span>"+
      "</div>"+
      "<div style='display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:var(--accent);padding-top:.4rem;border-top:1px solid #e8d9bf'>"+
        "<span>Total:</span><span id='_catCobTotal'>"+fmt(subtotal)+"</span>"+
      "</div>"+
    "</div>";

  h += "</div>";  // cierra body

    // ── FOOTER: BOTÓN ENVIAR ────────────────────────────────────
    h += "<div style='padding:.75rem 1.1rem;border-top:1px solid #e8d9bf;background:#fff'>"+
      "<button id='_catCobBtn' onclick='_lockClick(this,_catCobConfirmar,{texto:&quot;Procesando...&quot;,timeout:30000})' disabled style='width:100%;padding:.85rem;border:none;border-radius:9px;font-size:.95rem;font-weight:700;cursor:not-allowed;background:#ccc;color:#fff;transition:all .2s'>Completá los datos para continuar</button>"+
    "</div>";

  h += "</div>";  // cierra modal box
  mo.innerHTML = h;
  // FIX 2026-05-15: click afuera ya NO cierra el modal (evita cierres accidentales).
  // Solo se cierra con la X. Esto es seguro y simple — sin manejo de historial.
  document.body.appendChild(mo);

  // FIX 2026-05-15: registrar el modal para que el botón "atrás" del celular lo cierre
  // (en lugar de salir de la web). Pasamos una función que respeta el overlay procesando.
  _catModalBackRegistrar('_catMoCobro', function(){
    // Si hay overlay "Procesando" activo, no cerrar el modal
    if(document.getElementById('_catCobOverlay')) {
      // Pero al haber consumido la entrada del historial, agregar una nueva para mantener el buffer
      try { history.pushState({belleModal:'_catMoCobro', t:Date.now()}, '', location.href); } catch(e){}
      return;
    }
    _catCobCerrarModal();
  });

  // Pre-seleccionar dirección: principal si la hay, sino la única, sino la primera
  if(dirs.length){
    var dirPreseleccionada = dirs.find(function(d){return d.es_principal || d.principal;}) || dirs[0];
    if(dirPreseleccionada){
      _catCobSelDir(dirPreseleccionada.id);
    }
  }
  // FEAT CC v2 (2026-05-14): si la forma_pago default es CC, renderizar el panel CC ya
  // FIX 2026-05-15: además de renderizar, mostrar el div (que está con display:none por default)
  if(window._catCobState && window._catCobState.forma_pago === 'cuenta_corriente'){
    setTimeout(function(){
      var ccBox = document.getElementById('_catCobCCBox');
      if(ccBox) ccBox.style.display = 'block';
      _catRenderCCBox();
    }, 100);
  }
}

function _catCobSelDir(id){
  var dirs = window._catCobDirs || [];
  var d = dirs.find(function(x){return x.id===id;});
  if(!d) return;
  // Si cambió la dirección → resetear modo_entrega (porque cambian las opciones)
  if(window._catCobState.direccion_id !== id){
    window._catCobState.modo_entrega = null;
    window._catCobState.costo_envio = 0;
    window._catCobState.envio_a_confirmar = false;
    window._catCobState.envio_zona_id = null;
  }
  window._catCobState.direccion_id = id;
  // Re-renderizar todo (direcciones + opciones de entrega)
  _catRenderModalCobroDirs();
  _catCobRefrescarEntregas();
  _catCobActState();
}

// Renderiza/refresca las opciones de modo de entrega para la dirección seleccionada.
// IMPORTANTE: NO resetea state.modo_entrega — solo lee del state actual.
function _catCobRefrescarEntregas(){
  var dirs = window._catCobDirs || [];
  var d = dirs.find(function(x){return x.id===window._catCobState.direccion_id;});
  if(!d){
    var cont0 = document.getElementById('_catCobModoEntregaCont');
    if(cont0) cont0.innerHTML = "<div style='font-size:.78rem;font-weight:700;color:var(--dark);margin-bottom:.45rem;display:flex;align-items:center;gap:.3rem'><span>🚚</span><span>Modo de entrega</span></div><div style='font-size:.7rem;color:var(--mid);font-style:italic'>Elegí una dirección para ver opciones de entrega</div>";
    return;
  }
  var cfg = window._catCobConfig || {};
  var zonas = window._catCobZonas || [];
  var cont = document.getElementById('_catCobModoEntregaCont');
  if(!cont) return;

  var html = "<div style='font-size:.78rem;font-weight:700;color:var(--dark);margin-bottom:.45rem;display:flex;align-items:center;gap:.3rem'><span>🚚</span><span>Modo de entrega</span></div>"+
    "<div style='display:grid;gap:.4rem'>";

  // Opción 1: Envío a domicilio si está dentro del radio
  if(cfg.envio_domicilio_habilitado!==false && d.lat && d.lng){
    var distKm = _cobDistanciaKmCat(d.lat, d.lng, cfg.envio_domicilio_origen_lat||-31.4201, cfg.envio_domicilio_origen_lng||-64.1888);
    var radio = parseFloat(cfg.envio_domicilio_radio_km)||30;
    if(distKm <= radio){
      var sel = window._catCobState.modo_entrega==='domicilio';
      html += "<div onclick='_catCobSelEntrega(\"domicilio\",0,false,null)' style='border:2px solid "+(sel?'var(--accent)':'#e8d9bf')+";background:"+(sel?'rgba(196,150,90,.08)':'#fff')+";border-radius:8px;padding:.6rem .8rem;cursor:pointer;transition:all .15s'>"+
        "<div style='display:flex;justify-content:space-between;align-items:center'>"+
          "<div>"+
            "<div style='font-size:.85rem;font-weight:600;color:var(--dark)'>🚚 Envío a domicilio</div>"+
            "<div style='font-size:.65rem;color:var(--mid);margin-top:.1rem'>Aprox. "+distKm.toFixed(1)+" km del centro · gratis</div>"+
          "</div>"+
          "<div style='font-size:.95rem;font-weight:700;color:#3a6f2a'>GRATIS</div>"+
        "</div>"+
      "</div>";
    } else {
      html += "<div style='border:1px dashed #e8d9bf;background:#faf6ee;border-radius:8px;padding:.55rem .8rem;font-size:.7rem;color:var(--mid);font-style:italic'>🚚 Envío a domicilio no disponible: la dirección está a "+distKm.toFixed(1)+" km del centro (máx "+radio+" km)</div>";
    }
  } else if(cfg.envio_domicilio_habilitado!==false){
    html += "<div style='border:1px dashed #e8d9bf;background:#faf6ee;border-radius:8px;padding:.55rem .8rem;font-size:.7rem;color:var(--mid);font-style:italic'>🚚 Envío a domicilio: la dirección no tiene ubicación precisa. Editala desde tu panel.</div>";
  }

  // Opción 2: Andreani siempre (con tarifa de zona o "a confirmar")
  var match = _cobMatchZonaAndreaniCat(d.provincia, d.localidad, d.codigo_postal, zonas, cfg);
  var sel2 = window._catCobState.modo_entrega==='andreani';
  if(!match.a_confirmar){
    // Info útil para el cliente: su localidad/provincia (no el nombre interno de la zona admin)
    var infoEntrega = (d.localidad||'') + (d.localidad && d.provincia ? ', ' : '') + (d.provincia||'');
    html += "<div onclick='_catCobSelEntrega(\"andreani\","+match.tarifa+",false,"+match.zona_id+")' style='border:2px solid "+(sel2?'var(--accent)':'#e8d9bf')+";background:"+(sel2?'rgba(196,150,90,.08)':'#fff')+";border-radius:8px;padding:.6rem .8rem;cursor:pointer;transition:all .15s'>"+
      "<div style='display:flex;justify-content:space-between;align-items:center'>"+
        "<div>"+
          "<div style='font-size:.85rem;font-weight:600;color:var(--dark)'>📦 Andreani</div>"+
          (infoEntrega ? "<div style='font-size:.65rem;color:var(--mid);margin-top:.1rem'>Envío a "+_catEsc(infoEntrega)+"</div>" : "")+
        "</div>"+
        "<div style='font-size:.95rem;font-weight:700;color:var(--accent)'>"+fmt(match.tarifa)+"</div>"+
      "</div>"+
    "</div>";
  } else {
    html += "<div onclick='_catCobSelEntrega(\"andreani\",0,true,null)' style='border:2px solid "+(sel2?'var(--accent)':'#e8d9bf')+";background:"+(sel2?'rgba(196,150,90,.08)':'#fff')+";border-radius:8px;padding:.6rem .8rem;cursor:pointer;transition:all .15s'>"+
      "<div style='display:flex;justify-content:space-between;align-items:center;gap:.5rem'>"+
        "<div style='flex:1'>"+
          "<div style='font-size:.85rem;font-weight:600;color:var(--dark)'>📦 Andreani</div>"+
          "<div style='font-size:.65rem;color:var(--mid);margin-top:.1rem;font-style:italic'>"+_catEsc(match.mensaje||'Cotización a confirmar')+"</div>"+
        "</div>"+
        "<div style='font-size:.7rem;font-weight:600;color:var(--mid);white-space:nowrap'>A confirmar</div>"+
      "</div>"+
    "</div>";
  }

  html += "</div>";
  cont.innerHTML = html;
}

function _catRenderModalCobroDirs(){
  // Re-renderizar las direcciones para que la selección visual se actualice
  var dirs = window._catCobDirs || [];
  var st = window._catCobState;
  var cont = document.getElementById('_catCobDirs');
  if(!cont) return;
  var h = '';
  dirs.forEach(function(d){
    var sel = st.direccion_id===d.id;
    var dirTxt = d.direccion_completa || ((d.calle||"")+" "+(d.numero||""));
    var locTxt = (d.localidad?d.localidad+', ':'')+(d.provincia||'')+(d.codigo_postal?' (CP '+d.codigo_postal+')':'');
    h += "<div onclick='_catCobSelDir("+d.id+")' style='border:2px solid "+(sel?'var(--accent)':'#e8d9bf')+";background:"+(sel?'rgba(196,150,90,.08)':'#fff')+";border-radius:8px;padding:.55rem .7rem;cursor:pointer;transition:all .15s'>"+
      "<div style='font-size:.78rem;font-weight:600;color:var(--dark)'>"+_catEsc(d.etiqueta||'Sin etiqueta')+(d.es_principal||d.principal?' <span style=\"font-size:.6rem;background:var(--accent);color:#fff;padding:.1rem .35rem;border-radius:8px;font-weight:600;margin-left:.2rem\">PRINCIPAL</span>':'')+"</div>"+
      "<div style='font-size:.72rem;color:var(--dark);margin-top:.15rem'>"+_catEsc(dirTxt)+"</div>"+
      "<div style='font-size:.65rem;color:var(--mid);margin-top:.1rem'>"+_catEsc(locTxt)+"</div>"+
    "</div>";
  });
  h += "<button onclick='_catCobCerrarModal();_catNuevaDir()' style='width:100%;background:transparent;color:var(--accent);border:1px dashed var(--accent);padding:.5rem;border-radius:7px;font-size:.78rem;cursor:pointer'>+ Agregar nueva dirección</button>";
  cont.innerHTML = h;
}

function _catCobSelEntrega(modo, costo, aConfirmar, zonaId){
  window._catCobState.modo_entrega = modo;
  window._catCobState.costo_envio = costo || 0;
  window._catCobState.envio_a_confirmar = !!aConfirmar;
  window._catCobState.envio_zona_id = zonaId || null;
  // Refrescar SOLO las opciones de entrega (no resetea state) y el estado del botón/total
  _catCobRefrescarEntregas();
  _catCobActState();
}

// ════════════════════════════════════════════════════════════════════
// VALIDACIÓN: condición de pago de campañas en carrito
// ════════════════════════════════════════════════════════════════════
// Si en el carrito hay productos de una campaña con `condicion_pago` distinta
// de "cualquiera", validar que la forma de pago elegida sea compatible.
// Lógica especial para "solo_efectivo": clientes del interior con envío
// (Andreani/Correo/etc) pueden pagar por transferencia igual.
// ════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// VALIDACIONES DEL CARRITO PARA CHECKOUT
// ═══════════════════════════════════════════════════════════════════
// Devuelve un objeto con info de las restricciones detectadas:
// {
//   campañasSoloLocal: [{nombre, ...}, ...],  // campañas con solo_efectivo_local
//   prodsConMinimo: [{prod, falta}, ...],     // productos que requieren mínimo
//   esLocal: bool,                             // dirección actual cae en zona local
//   formaPagoOk: bool,                         // si la forma_pago elegida es válida
//   mensajePago: string,                       // mensaje si forma_pago no es válida
// }
// ═══════════════════════════════════════════════════════════════════
function _catEvaluarRestricciones(){
  var camps = window._ofertaCampanias || [];
  var prodsCampMap = window._ofertaCampaniaProductos || {};
  var st = window._catCobState || {};
  var formaPago = st.forma_pago;

  // [BUG #6 fix] Helper: verificar si una campaña tiene oferta vigente AHORA.
  // Si la oferta está programada (no empezó) o vencida, las restricciones
  // de la campaña (como solo_efectivo_local) NO deben aplicar.
  function _campTieneOfertaVigente(campId){
    var ofs = (window._ofertas||[]).filter(function(o){return o.campania_id === campId;});
    if(!ofs.length) return false; // sin oferta vinculada → la "campaña" no está activa
    var ahora = Date.now();
    return ofs.some(function(o){
      if(!o.activa) return false;
      if(o.fecha_desde && new Date(o.fecha_desde).getTime() > ahora) return false;
      if(o.fecha_hasta && new Date(o.fecha_hasta).getTime() <= ahora) return false;
      return true;
    });
  }

  // 1) Detectar campañas restrictivas en el carrito (solo_efectivo_local=true)
  var campañasSoloLocal = [];
  var campañasIds = {};
  Object.values(cart||{}).forEach(function(it){
    if(!it.id) return;
    camps.forEach(function(c){
      if(!c.solo_efectivo_local) return; // solo restrictivas
      if(campañasIds[c.id]) return;
      // [BUG #6 fix] No aplicar restricción si la oferta no está vigente todavía
      if(!_campTieneOfertaVigente(c.id)) return;
      var prodEnCamp = false;
      if(c.pestana_id){
        var p = (allProds||[]).find(function(pp){return pp.id === it.id;});
        if(p && p.pestana_id === c.pestana_id) prodEnCamp = true;
      }
      var prods = prodsCampMap[c.id];
      if(!prodEnCamp && prods && prods.indexOf(it.id) >= 0) prodEnCamp = true;
      if(prodEnCamp){
        campañasSoloLocal.push(c);
        campañasIds[c.id] = true;
      }
    });
  });

  // 2) Detectar productos con compra_minima activa
  var totalCarrito = _catTotalCarrito();
  var prodsConMinimo = [];
  Object.values(cart||{}).forEach(function(it){
    if(!it.id) return;
    var p = (allProds||[]).find(function(pp){return pp.id === it.id;});
    if(!p || !p.compra_minima) return;
    var min = parseFloat(p.compra_minima);
    if(!(min > 0)) return;
    if(totalCarrito < min){
      prodsConMinimo.push({
        prod: p,
        minimo: min,
        falta: min - totalCarrito
      });
    }
  });

  // 3) Determinar si el cliente es de zona LOCAL según la dirección elegida
  var esLocal = false;
  if(st.direccion_id){
    var dirs = window._catCobDirs || [];
    var d = dirs.find(function(x){return x.id === st.direccion_id;});
    if(d){
      var zonas = window._catCobZonas || [];
      var zona = _catMatchearZona(d, zonas);
      if(zona && zona.es_zona_local) esLocal = true;
    }
  }

  // 4) Validar forma_pago vs campañas restrictivas
  var formaPagoOk = true;
  var mensajePago = '';
  if(campañasSoloLocal.length && esLocal && formaPago && formaPago !== 'efectivo'){
    formaPagoOk = false;
    var nombres = campañasSoloLocal.map(function(c){return c.nombre;}).join(', ');
    mensajePago = '⚠️ Por la promo "'+nombres+'" en zona local solo se acepta pago en efectivo.';
  }

  return {
    campañasSoloLocal: campañasSoloLocal,
    prodsConMinimo: prodsConMinimo,
    esLocal: esLocal,
    totalCarrito: totalCarrito,
    formaPagoOk: formaPagoOk,
    mensajePago: mensajePago
  };
}

// Calcular total del carrito (productos + decants, sin envío)
function _catTotalCarrito(){
  var total = 0;
  Object.values(cart||{}).forEach(function(it){
    var precioU = parseFloat((it.precio!==undefined?it.precio:it.precio_u)||0);   // FIX 2026-09-23: precio_u no existe en el carrito (siempre daba 0)
    var qty = parseInt(it.qty||0);
    if(!isNaN(precioU) && !isNaN(qty)) total += precioU * qty;
  });
  return total;
}

// Matchear una dirección con una zona del admin (igual que el sistema de envíos)
function _catMatchearZona(dir, zonas){
  if(!dir || !Array.isArray(zonas) || !zonas.length) return null;
  var prov = (dir.provincia||'').trim().toLowerCase();
  var loc = (dir.localidad||'').trim().toLowerCase();
  var cp = parseInt((dir.codigo_postal||'').replace(/\D/g,'').substring(0,4)) || null;
  var dirLat = parseFloat(dir.lat || dir.latitud || 0);
  var dirLng = parseFloat(dir.lng || dir.longitud || 0);
  var tieneCoords = !!(dirLat && dirLng);

  // ── Primero: buscar match por círculos (zonas con cobertura geográfica) ──
  // Si la dirección tiene lat/lng y cae dentro de algún círculo activo de
  // alguna zona, esa zona gana automáticamente (es el método más preciso).
  // Los círculos pueden venir de:
  //   1) window._catCobZonasCirculos (tabla aparte, sistema legacy)
  //   2) z.circulos_mapa (JSONB en envios_zonas, sistema nuevo)
  var circulosMap = window._catCobZonasCirculos || {};
  if(tieneCoords){
    for(var i=0; i<zonas.length; i++){
      var z = zonas[i];
      if(z.activa === false) continue;
      // Combinar círculos de ambas fuentes
      var circulos = [];
      if(circulosMap[z.id]) circulos = circulos.concat(circulosMap[z.id]);
      // Sistema nuevo: JSONB en la propia zona
      if(z.circulos_mapa){
        var nuevos = z.circulos_mapa;
        if(typeof nuevos === 'string'){
          try { nuevos = JSON.parse(nuevos); } catch(e){ nuevos = []; }
        }
        if(Array.isArray(nuevos)){
          // Normalizar formato de los círculos JSONB para que sean compatibles
          nuevos.forEach(function(c){
            circulos.push({
              centro_lat: c.lat || c.centro_lat,
              centro_lng: c.lng || c.centro_lng,
              radio_m: c.radio_m || c.radio,
              activo: c.activo !== false
            });
          });
        }
      }
      for(var j=0; j<circulos.length; j++){
        var c = circulos[j];
        if(c.activo === false) continue;
        var dist = _catDistanciaMetros(dirLat, dirLng, parseFloat(c.centro_lat), parseFloat(c.centro_lng));
        if(dist <= parseFloat(c.radio_m)){
          return z;  // dirección dentro de este círculo → esta zona
        }
      }
    }
  }

  // ── Fallback: matching tradicional por provincia/localidad/CP ──
  var match = null, score = 0;
  zonas.forEach(function(z){
    if(z.activa === false) return;
    var s = 0;
    var zp = (z.provincia||'').trim().toLowerCase();
    var zl = (z.localidad||'').trim().toLowerCase();
    if(zp && zp !== prov) return; // si zona tiene provincia, debe matchear
    if(zp) s += 1;
    if(zl){
      if(zl !== loc) return;
      s += 2;
    }
    if(z.cp_desde && z.cp_hasta && cp){
      if(cp < parseInt(z.cp_desde) || cp > parseInt(z.cp_hasta)) return;
      s += 3;
    }
    if(s > score){match = z; score = s;}
  });
  return match;
}

// Distancia en metros entre dos puntos lat/lng (fórmula de Haversine)
function _catDistanciaMetros(lat1, lng1, lat2, lng2){
  var R = 6371000; // radio Tierra en metros
  var toRad = function(d){return d * Math.PI / 180;};
  var dLat = toRad(lat2 - lat1);
  var dLng = toRad(lng2 - lng1);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Pintar avisos en el modal de checkout y devolver si hay bloqueos
function _catCobRefreshAvisos(){
  var box = document.getElementById('_catCobAvisosBox');
  if(!box) return;
  var info = _catEvaluarRestricciones();
  var avisos = [];

  // Aviso campaña solo efectivo local
  if(info.campañasSoloLocal.length){
    info.campañasSoloLocal.forEach(function(c){
      var msg = '<div style="background:rgba(255,107,53,.08);border-left:4px solid #ff5722;border-radius:6px;padding:.55rem .75rem;font-size:.74rem;color:#7a3a14;line-height:1.5">'+
        '🔥 <b>'+_catEsc(c.nombre)+':</b> ';
      if(info.esLocal){
        msg += 'Como tu domicilio es en <b>zona local</b>, esta promo solo acepta pago en <b>efectivo</b>. Si elegís transferencia, el pedido no podrá confirmarse.';
      } else {
        msg += 'Como sos del <b>interior</b>, podés pagar por transferencia normalmente. ✅';
      }
      if(c.condiciones_pago){
        msg += '<div style="margin-top:.3rem;padding-top:.3rem;border-top:1px solid rgba(255,107,53,.2);font-style:italic;font-size:.68rem">'+_catEsc(c.condiciones_pago)+'</div>';
      }
      msg += '</div>';
      avisos.push(msg);
    });
  }

  // Aviso compra mínima
  if(info.prodsConMinimo.length){
    info.prodsConMinimo.forEach(function(item){
      var faltaFmt = '$' + Math.round(item.falta).toLocaleString('es-AR');
      var minFmt = '$' + Math.round(item.minimo).toLocaleString('es-AR');
      avisos.push(
        '<div style="background:rgba(232,160,40,.1);border-left:4px solid #e8a028;border-radius:6px;padding:.55rem .75rem;font-size:.74rem;color:#7a5a14;line-height:1.5">'+
          '💰 <b>'+_catEsc(_prodMl(item.prod.nombre,item.prod.ml))+'</b> requiere compra mínima de <b>'+minFmt+'</b>.<br>'+
          'Te falta agregar <b style="color:#c4965a">'+faltaFmt+'</b> al carrito para poder llevarlo.'+
        '</div>'
      );
    });
  }

  // Mensaje de incompatibilidad de pago elegido
  if(!info.formaPagoOk && info.mensajePago){
    avisos.push(
      '<div style="background:rgba(196,58,58,.1);border-left:4px solid #c43a3a;border-radius:6px;padding:.55rem .75rem;font-size:.74rem;color:#7a1a1a;line-height:1.5">'+
        info.mensajePago+
      '</div>'
    );
  }

  if(avisos.length){
    box.innerHTML = '<div style="display:flex;flex-direction:column;gap:.4rem;margin:.4rem 0">'+avisos.join('')+'</div>';
  } else {
    box.innerHTML = '';
  }

  return info;
}

// FUNCIÓN VIEJA — wrapper retrocompatible (mantengo por si la llaman desde otro lado)
function _catValidarCondicionPagoCampania(formaPago){
  var stOrig = window._catCobState || {};
  var stTmp = Object.assign({}, stOrig, {forma_pago: formaPago});
  window._catCobState = stTmp;
  var info = _catEvaluarRestricciones();
  window._catCobState = stOrig;
  if(!info.formaPagoOk){
    return { bloquear: true, mensaje: info.mensajePago };
  }
  return null;
}

function _catCobSelPago(forma){
  // ── Validar condición de pago de campañas en el carrito ──
  var resVal = _catValidarCondicionPagoCampania(forma);
  if(resVal && resVal.bloquear){
    _catToast(resVal.mensaje, 'twarn');
    return;
  }
  window._catCobState.forma_pago = forma;
  // FEAT CC v2 (2026-05-14): incluir 'cuenta_corriente' en el array de visualización
  ['efectivo','transferencia','tarjeta','mercadopago','cuenta_corriente'].forEach(function(k){
    var el = document.getElementById('_catCobPago_'+k);
    if(!el) return;
    var sel = (k === forma);
    el.style.border = '2px solid '+(sel?'var(--accent)':(k==='cuenta_corriente'?'rgba(196,150,90,.6)':'#e8d9bf'));
    el.style.background = sel ? 'rgba(196,150,90,.08)' : '#fff';
  });
  // Mostrar/ocultar caja de datos bancarios
  var box = document.getElementById('_catCobBancoBox');
  var cfg = window._catCobConfig || {};
  if(box){
    if(forma === 'transferencia'){
      if(cfg.banco_mostrar !== false && (cfg.banco_cbu || cfg.banco_alias)){
        var h = "<div style='background:#fef9e8;border:1px solid #f0d878;border-radius:8px;padding:.65rem .85rem;font-size:.75rem;color:var(--dark)'>"+
          "<div style='font-weight:700;margin-bottom:.35rem;color:#7a5a1a'>🏦 Datos para transferir</div>";
        if(cfg.banco_nombre) h += "<div style='margin-bottom:.2rem'><b>Banco:</b> "+_catEsc(cfg.banco_nombre)+"</div>";
        if(cfg.banco_titular) h += "<div style='margin-bottom:.2rem'><b>Titular:</b> "+_catEsc(cfg.banco_titular)+"</div>";
        if(cfg.banco_cuit) h += "<div style='margin-bottom:.2rem'><b>CUIT:</b> "+_catEsc(cfg.banco_cuit)+"</div>";
        if(cfg.banco_cbu) h += "<div style='margin-bottom:.25rem;display:flex;align-items:center;gap:.4rem'><b>CBU:</b> <span style='font-family:monospace;flex:1'>"+_catEsc(cfg.banco_cbu)+"</span><button onclick='_catCobCopiar(\""+_catEsc(cfg.banco_cbu)+"\",\"CBU\")' style='background:var(--accent);color:#fff;border:none;border-radius:4px;padding:.2rem .45rem;font-size:.62rem;cursor:pointer'>Copiar</button></div>";
        if(cfg.banco_alias) h += "<div style='margin-bottom:.3rem;display:flex;align-items:center;gap:.4rem'><b>Alias:</b> <span style='font-family:monospace;flex:1'>"+_catEsc(cfg.banco_alias)+"</span><button onclick='_catCobCopiar(\""+_catEsc(cfg.banco_alias)+"\",\"alias\")' style='background:var(--accent);color:#fff;border:none;border-radius:4px;padding:.2rem .45rem;font-size:.62rem;cursor:pointer'>Copiar</button></div>";
        if(cfg.banco_observacion) h += "<div style='margin-top:.4rem;padding-top:.4rem;border-top:1px solid #f0d878;color:#7a5a1a;font-size:.7rem;font-style:italic'>"+_catEsc(cfg.banco_observacion)+"</div>";
        h += "</div>";
        box.innerHTML = h;
        box.style.display = 'block';
      } else if(cfg.banco_observacion){
        box.innerHTML = "<div style='background:#fef9e8;border:1px solid #f0d878;border-radius:8px;padding:.55rem .8rem;font-size:.72rem;color:var(--dark);font-style:italic'>"+_catEsc(cfg.banco_observacion)+"</div>";
        box.style.display = 'block';
      } else {
        box.innerHTML = "<div style='background:#fef9e8;border:1px solid #f0d878;border-radius:8px;padding:.55rem .8rem;font-size:.72rem;color:var(--dark);font-style:italic'>Coordinaremos los datos por WhatsApp.</div>";
        box.style.display = 'block';
      }
    } else {
      box.style.display = 'none';
    }
  }
  // FEAT CC v2 (2026-05-14): mostrar/ocultar panel CC con plan de cuotas
  var ccBox = document.getElementById('_catCobCCBox');
  if(ccBox){
    if(forma === 'cuenta_corriente'){
      _catRenderCCBox();
      ccBox.style.display = 'block';
    } else {
      ccBox.style.display = 'none';
      // Limpiar selección de plan
      window._catCCPlanElegido = null;
    }
  }
  // Solo actualizar el estado del botón/total — los pagos no afectan dirección/entrega
  _catCobActState();
}

function _catCobCopiar(texto, label){
  if(navigator.clipboard){
    navigator.clipboard.writeText(texto).then(function(){
      _catToast(label+' copiado','tok');
    }).catch(function(){
      _catToast('No se pudo copiar','terr');
    });
  }
}

// ════════════════════════════════════════════════════════════════════════════
// CC v2 — Cliente paga con cuenta corriente (FEAT 2026-05-14)
// ════════════════════════════════════════════════════════════════════════════

// Helpers replicados desde admin/ventas (regla ORO)
function _catCcProximaFecha(cli, desdeFecha){
  var frec = (cli && cli.cc_frecuencia) || '';
  var d = desdeFecha ? new Date(desdeFecha) : new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 1);
  if(frec === 'semanal' || frec === 'quincenal'){
    var targetDow = parseInt(cli.cc_dia_semana);
    if(isNaN(targetDow)) targetDow = 5;
    var diff = (targetDow - d.getDay() + 7) % 7;
    if(diff === 0) diff = (frec === 'quincenal' ? 14 : 7);
    d.setDate(d.getDate() + diff);
    return d;
  } else if(frec === 'mensual'){
    var targetDay = parseInt(cli.cc_dia_mes) || 10;
    var year = d.getFullYear();
    var month = d.getMonth();
    var candidate = new Date(year, month, targetDay);
    if(candidate < d) candidate = new Date(year, month + 1, targetDay);
    return candidate;
  } else if(frec === 'cada_10'){ d.setDate(d.getDate() + 9); return d; }
  else if(frec === 'cada_15'){ d.setDate(d.getDate() + 14); return d; }
  else if(frec === 'cada_30'){ d.setDate(d.getDate() + 29); return d; }
  var plazo = parseInt(cli && cli.cc_plazo_dias) || 30;
  d.setDate(d.getDate() + plazo - 1);
  return d;
}

function _catCcSalto(cli){
  var frec = (cli && cli.cc_frecuencia) || '';
  if(frec === 'semanal') return 7;
  if(frec === 'quincenal') return 14;
  if(frec === 'mensual') return 30;
  if(frec === 'cada_10') return 10;
  if(frec === 'cada_15') return 15;
  if(frec === 'cada_30') return 30;
  return parseInt(cli && cli.cc_plazo_dias) || 30;
}

function _catCcFrecLabel(frec){
  return ({semanal:'Semanal',quincenal:'Quincenal',mensual:'Mensual',cada_10:'Cada 10 días',cada_15:'Cada 15 días',cada_30:'Cada 30 días'})[frec] || 'Sin frecuencia';
}

function _catCcDiaLabel(cli){
  var frec = cli.cc_frecuencia || '';
  if(frec === 'semanal' || frec === 'quincenal'){
    var dn = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    return dn[parseInt(cli.cc_dia_semana)||5];
  } else if(frec === 'mensual'){
    return 'día '+(cli.cc_dia_mes||10)+' del mes';
  }
  return '';
}

// Render del panel CC en el modal de checkout
function _catRenderCCBox(){
  var ccBox = document.getElementById('_catCobCCBox');
  if(!ccBox) return;
  if(!_catCliente || !_catCliente.cuenta_corriente_habilitada){
    ccBox.innerHTML = "<div style='background:#fde8e8;border:1px solid #f5a8a8;border-radius:8px;padding:.6rem .8rem;font-size:.72rem;color:#b53939'>Tu cuenta corriente no está habilitada. Pedí al admin que la active.</div>";
    return;
  }

  // Mostrar loading mientras se cargan datos frescos
  ccBox.innerHTML = "<div style='background:#faf6ee;border:1px solid #e8d9bf;border-radius:8px;padding:.6rem .8rem;font-size:.72rem;color:var(--mid);text-align:center'>⏳ Cargando tu cuenta...</div>";

  // Cargar datos frescos del cliente + planes + pedidos pendientes
  Promise.all([
    apiGet('clientes','select=*&id=eq.'+_catCliente.id+'&limit=1'),
    apiGet('cc_planes_cliente','select=*&cliente_id=eq.'+_catCliente.id+'&activo=eq.true&order=nro_cuotas.asc').catch(function(){return [];}),
    apiGet('pedidos_catalogo','select=id,total,cobrado_total&cliente_id=eq.'+_catCliente.id+'&estado=not.in.(cancelado,cobrado)&es_cc=eq.true').catch(function(){return [];})
  ]).then(function(res){
    var cli = (res[0] && res[0][0]) || _catCliente;
    var planes = Array.isArray(res[1]) ? res[1] : [];
    var pendientes = Array.isArray(res[2]) ? res[2] : [];

    // Calcular deuda acumulada
    var deudaActual = 0;
    pendientes.forEach(function(p){
      deudaActual += (parseFloat(p.total)||0) - (parseFloat(p.cobrado_total)||0);
    });

    var subtotal = _catCobCalcSubtotal();
    var costoEnvio = (window._catCobState && window._catCobState.costo_envio) || 0;
    var totalEstePedido = subtotal + costoEnvio;
    var limite = parseFloat(cli.limite_credito) || 0;
    var disponible = limite - deudaActual;
    var sobrepasaLimite = limite > 0 && (deudaActual + totalEstePedido) > limite;

    var modalidad = cli.cc_modalidad || 'cuotas';
    var frec = cli.cc_frecuencia || '';
    var frecLbl = _catCcFrecLabel(frec);
    var diaLbl = _catCcDiaLabel(cli);

    var h = "<div style='background:linear-gradient(135deg,#fef7e8 0%,#faf0d8 100%);border:2px solid rgba(196,150,90,.4);border-radius:10px;padding:.7rem .85rem'>";

    // Header con info de la cuenta
    h += "<div style='display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.5rem;padding-bottom:.5rem;border-bottom:1px solid rgba(196,150,90,.25)'>";
    h += "<div>";
    h += "<div style='font-weight:700;color:#7a5a1a;font-size:.85rem'>💳 Tu cuenta corriente</div>";
    h += "<div style='font-size:.65rem;color:#9a7a3a;margin-top:.15rem'>"+frecLbl+(diaLbl?' · pagás los '+diaLbl:'')+"</div>";
    h += "</div>";
    h += "<div style='text-align:right'>";
    if(limite > 0){
      h += "<div style='font-size:.6rem;color:#9a7a3a;text-transform:uppercase;font-weight:600'>Límite</div>";
      h += "<div style='font-size:.85rem;font-weight:700;color:"+(sobrepasaLimite?'#b53939':'#7a5a1a')+"'>"+fmt(limite)+"</div>";
    }
    h += "</div>";
    h += "</div>";

    // Estado actual
    h += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:.5rem'>";
    h += "<div style='background:#fff;border-radius:6px;padding:.4rem .5rem'>";
    h += "<div style='font-size:.58rem;color:#9a7a3a;text-transform:uppercase;font-weight:600'>Deuda actual</div>";
    h += "<div style='font-size:.85rem;font-weight:700;color:"+(deudaActual>0?'#7a5a1a':'#3a6f2a')+"'>"+fmt(deudaActual)+"</div>";
    h += "</div>";
    h += "<div style='background:#fff;border-radius:6px;padding:.4rem .5rem'>";
    h += "<div style='font-size:.58rem;color:#9a7a3a;text-transform:uppercase;font-weight:600'>Este pedido</div>";
    h += "<div style='font-size:.85rem;font-weight:700;color:var(--accent)'>"+fmt(totalEstePedido)+"</div>";
    h += "</div>";
    h += "</div>";

    // Aviso si bloqueado o sobrepasa límite
    if(cli.bloqueado){
      h += "<div style='background:#fde8e8;border:1px solid #f5a8a8;border-radius:6px;padding:.5rem .65rem;margin-bottom:.5rem;font-size:.72rem;color:#b53939;font-weight:600'>";
      h += "🚫 Tu cuenta está bloqueada. Contactá al admin para reactivarla.";
      h += "</div>";
    } else if(sobrepasaLimite){
      h += "<div style='background:#fef0e0;border:1px solid #f5c890;border-radius:6px;padding:.5rem .65rem;margin-bottom:.5rem;font-size:.72rem;color:#a06820'>";
      h += "⚠️ Este pedido supera tu límite disponible ("+fmt(disponible)+"). Confirmá igual y el admin lo revisará.";
      h += "</div>";
    }

    // ─── PLANES DE CUOTAS ─────
    if(modalidad === 'cuotas'){
      if(!planes.length){
        h += "<div style='background:#fff;border:1px dashed rgba(196,150,90,.4);border-radius:6px;padding:.55rem .7rem;margin-bottom:.4rem;font-size:.7rem;color:#7a5a1a'>";
        h += "📌 Sin planes de cuotas configurados — el pedido se cobrará en 1 pago según tu plazo habitual.";
        h += "</div>";
      } else {
        h += "<div style='font-size:.62rem;color:#7a5a1a;text-transform:uppercase;font-weight:700;margin-bottom:.35rem'>¿Cómo querés pagar este pedido?</div>";
        h += "<div id='_catCcPlanesLista' style='display:flex;flex-direction:column;gap:.3rem;margin-bottom:.45rem'>";

        // Pre-seleccionar el primero
        var planSel = window._catCCPlanElegido || planes[0].id;
        window._catCCPlanElegido = planSel;

        planes.forEach(function(p){
          var totalConRecargo = totalEstePedido * (1 + (p.recargo_pct||0)/100);
          var cuotaProm = Math.round(totalConRecargo / p.nro_cuotas);
          var selected = p.id === planSel;
          h += "<div onclick='_catCcSelectPlan("+p.id+")' style='cursor:pointer;border:2px solid "+(selected?'var(--accent)':'rgba(196,150,90,.3)')+";background:"+(selected?'rgba(196,150,90,.1)':'#fff')+";border-radius:7px;padding:.45rem .6rem;display:flex;justify-content:space-between;align-items:center;transition:all .15s'>";
          h += "<div>";
          h += "<div style='font-size:.78rem;font-weight:700;color:#5a4a1a'>"+p.nro_cuotas+" "+(p.nro_cuotas===1?'pago':'cuotas');
          if(p.recargo_pct > 0) h += " <span style='color:#a06820;font-size:.66rem'>+"+p.recargo_pct+"%</span>";
          h += "</div>";
          h += "<div style='font-size:.62rem;color:#9a7a3a;margin-top:.1rem'>"+p.nro_cuotas+" × "+fmt(cuotaProm)+"</div>";
          h += "</div>";
          h += "<div style='font-size:.65rem;color:"+(selected?'var(--accent)':'#9a7a3a')+";font-weight:700'>"+(selected?'✓ Elegido':'Elegir')+"</div>";
          h += "</div>";
        });
        h += "</div>";

        // Preview de las cuotas
        h += "<div id='_catCcCuotasPreview' style='background:#fff;border-radius:6px;padding:.45rem .6rem;font-size:.65rem;color:#5a4a1a'></div>";
      }
    } else if(modalidad === 'resumen'){
      // Modalidad resumen: muestra como tarjeta de crédito
      var diaCierre = parseInt(cli.cc_dia_cierre)||25;
      var diaVenc = parseInt(cli.cc_dia_vencimiento)||10;
      h += "<div style='background:#fff;border:1px solid rgba(196,150,90,.3);border-radius:6px;padding:.55rem .7rem;font-size:.7rem;color:#5a4a1a'>";
      h += "<div style='font-weight:700;margin-bottom:.2rem'>📅 Resumen mensual</div>";
      h += "Compras del 1 al "+diaCierre+" se cobran el "+diaVenc+" del mes siguiente. Este pedido se sumará a tu próximo resumen.";
      h += "</div>";
    }

    h += "</div>";
    ccBox.innerHTML = h;

    // Render preview de la cuota seleccionada
    if(modalidad === 'cuotas' && planes.length){
      window._catCCDatosCC = { cli: cli, planes: planes, totalPedido: totalEstePedido };
      _catCcRenderPreview(window._catCCPlanElegido);
    }
    // FIX tiempos: revalidar el botón ahora que los planes y el plan elegido ya cargaron
    try{ if(typeof _catCobActState === 'function') _catCobActState(); }catch(_e){}
  }).catch(function(e){
    console.error('[catalogo cc box]', e);
    ccBox.innerHTML = "<div style='background:#fde8e8;border:1px solid #f5a8a8;border-radius:8px;padding:.6rem .8rem;font-size:.72rem;color:#b53939'>Error al cargar tu cuenta. Probá de nuevo.</div>";
  });
}

window._catCcSelectPlan = function(planId){
  window._catCCPlanElegido = planId;
  // Refrescar el box (más simple que selectivo)
  _catRenderCCBox();
};

window._catCcRenderPreview = function(planId){
  var prev = document.getElementById('_catCcCuotasPreview');
  if(!prev) return;
  var datos = window._catCCDatosCC || {};
  var cli = datos.cli;
  var planes = datos.planes || [];
  var total = datos.totalPedido || 0;
  var plan = planes.find(function(p){return p.id === planId;});
  if(!cli || !plan){ prev.innerHTML = ''; return; }

  var nroCuotas = parseInt(plan.nro_cuotas);
  var recargoPct = parseFloat(plan.recargo_pct)||0;
  var totalConRecargo = total * (1 + recargoPct/100);
  var modo = cli.cc_modo_cuotas || 'iguales';
  var entregaPct = parseFloat(cli.cc_entrega_inicial_pct) || 0;

  // Calcular montos
  var montos = [];
  if(modo === 'entrega_inicial' && nroCuotas > 1 && entregaPct > 0){
    var primera = Math.round(totalConRecargo * (entregaPct/100) * 100) / 100;
    var restoTotal = totalConRecargo - primera;
    var resto = Math.floor((restoTotal / (nroCuotas - 1)) * 100) / 100;
    montos.push(primera);
    for(var i = 1; i < nroCuotas - 1; i++) montos.push(resto);
    if(nroCuotas > 1){
      var ultima = totalConRecargo - primera - (resto * (nroCuotas - 2));
      montos.push(Math.round(ultima*100)/100);
    }
  } else {
    var base = Math.floor((totalConRecargo / nroCuotas) * 100) / 100;
    for(var j = 0; j < nroCuotas - 1; j++) montos.push(base);
    montos.push(Math.round((totalConRecargo - base * (nroCuotas - 1)) * 100) / 100);
  }

  // Calcular fechas
  var fechas = [];
  var primeraFecha = _catCcProximaFecha(cli, new Date());
  var salto = _catCcSalto(cli);
  for(var k = 0; k < nroCuotas; k++){
    var f = new Date(primeraFecha);
    f.setDate(f.getDate() + (k * salto));
    fechas.push(f);
  }

  // Render
  var ph = "<div style='font-weight:700;color:#7a5a1a;margin-bottom:.25rem;font-size:.66rem;text-transform:uppercase'>📅 Tus cuotas:</div>";
  fechas.forEach(function(f, idx){
    var fStr = f.toLocaleDateString('es-AR',{weekday:'short',day:'2-digit',month:'2-digit'});
    ph += "<div style='display:flex;justify-content:space-between;padding:.15rem 0;border-bottom:1px solid #f0e4cf'>";
    ph += "<span>Cuota "+(idx+1)+"/"+nroCuotas+"</span>";
    ph += "<span><b style='color:#5a4a1a'>"+fmt(montos[idx])+"</b> <span style='color:#9a7a3a;font-size:.6rem;margin-left:.3rem'>"+fStr+"</span></span>";
    ph += "</div>";
  });
  if(recargoPct > 0){
    ph += "<div style='margin-top:.25rem;padding-top:.25rem;border-top:1px solid #e8d9bf;font-size:.6rem;color:#9a7a3a'>";
    ph += "Original "+fmt(total)+" → con +"+recargoPct+"% = <b>"+fmt(totalConRecargo)+"</b>";
    ph += "</div>";
  }
  prev.innerHTML = ph;
};

// ════════════════════════════════════════════════════════════════════════════
// FIN CC v2 cliente
// ════════════════════════════════════════════════════════════════════════════

// ── Renderizar las cuotas reales del cliente en el panel "Mi cuenta" ────
// Agrupa cuotas por fecha de vencimiento (calendario) y muestra próximos pagos
function _catRenderCuotasCliente(pedidosActivos){
  var cont = document.getElementById('_catCuotasContainer');
  if(!cont || !pedidosActivos || !pedidosActivos.length) return;
  var pedIds = pedidosActivos.map(function(p){return p.id;});
  if(!pedIds.length){ cont.innerHTML = ''; return; }

  apiGet('cc_cuotas','select=*&pedido_id=in.('+pedIds.join(',')+')&order=fecha_vencimiento.asc,nro_cuota.asc').then(function(cuotas){
    if(!Array.isArray(cuotas) || !cuotas.length){ cont.innerHTML = ''; return; }

    // Filtrar solo pendientes/parciales/vencidas (no mostrar pagadas en este resumen)
    var pendientes = cuotas.filter(function(cu){
      return cu.estado === 'pendiente' || cu.estado === 'parcial' || cu.estado === 'vencida';
    });
    if(!pendientes.length){ cont.innerHTML = ''; return; }

    // Agrupar por fecha de vencimiento (las cuotas del mismo día se suman)
    var porFecha = {};
    pendientes.forEach(function(cu){
      var f = cu.fecha_vencimiento;
      if(!porFecha[f]) porFecha[f] = { fecha: f, monto: 0, cuotas: [] };
      porFecha[f].monto += (parseFloat(cu.monto)||0) - (parseFloat(cu.monto_pagado)||0);
      porFecha[f].cuotas.push(cu);
    });

    var fechasOrdenadas = Object.values(porFecha).sort(function(a,b){return a.fecha.localeCompare(b.fecha);});
    var hoy = new Date(); hoy.setHours(0,0,0,0);

    var h = "<div style='background:linear-gradient(135deg,#fef7e8 0%,#faf0d8 100%);border:1px solid rgba(196,150,90,.35);border-radius:10px;padding:.7rem .85rem;margin-bottom:.6rem'>";
    h += "<div style='font-size:.62rem;color:#7a5a1a;text-transform:uppercase;font-weight:700;margin-bottom:.45rem;letter-spacing:.04em'>📅 Próximos pagos de cuotas</div>";

    // Mostrar máximo 5 fechas próximas
    var muestra = fechasOrdenadas.slice(0, 5);
    muestra.forEach(function(g, idx){
      var fechaCuota = new Date(g.fecha+'T00:00:00');
      var diasV = Math.floor((fechaCuota - hoy) / 86400000);
      var bg = '#fff', col = '#5a4a1a', lblExtra = '';
      if(diasV < 0){
        bg = '#fde8e8'; col = '#b53939';
        lblExtra = " <span style='color:#b53939;font-weight:700'>(vencida hace "+(-diasV)+"d)</span>";
      } else if(diasV === 0){
        bg = '#fef0e0'; col = '#a06820';
        lblExtra = " <span style='color:#a06820;font-weight:700'>(HOY)</span>";
      } else if(diasV <= 3){
        bg = '#fef9e8'; col = '#7a5a1a';
        lblExtra = " <span style='color:#a06820'>(en "+diasV+"d)</span>";
      } else {
        lblExtra = " <span style='color:#9a7a3a;font-size:.62rem'>(en "+diasV+"d)</span>";
      }
      var fStr = fechaCuota.toLocaleDateString('es-AR',{weekday:'short',day:'2-digit',month:'2-digit'});
      h += "<div style='background:"+bg+";border-radius:6px;padding:.4rem .55rem;margin-bottom:.25rem'>";
      h += "<div style='display:flex;justify-content:space-between;align-items:center;gap:.5rem'>";
      h += "<div style='flex:1;min-width:0'>";
      h += "<div style='font-size:.72rem;color:"+col+";font-weight:700'>"+fStr+lblExtra+"</div>";
      h += "<div style='font-size:.6rem;color:var(--mid);margin-top:.1rem'>"+g.cuotas.length+" cuota"+(g.cuotas.length===1?'':'s')+(g.cuotas.length>1?' (de varios pedidos)':'')+"</div>";
      h += "</div>";
      h += "<div style='font-size:.95rem;font-weight:800;color:"+col+";flex-shrink:0'>"+_catFmtMoney(g.monto)+"</div>";
      h += "</div></div>";
    });

    // Total de cuotas pendientes
    var totalPendiente = 0;
    pendientes.forEach(function(cu){
      totalPendiente += (parseFloat(cu.monto)||0) - (parseFloat(cu.monto_pagado)||0);
    });
    if(fechasOrdenadas.length > 5){
      h += "<div style='font-size:.62rem;color:#9a7a3a;text-align:center;margin-top:.3rem;font-style:italic'>+ "+(fechasOrdenadas.length - 5)+" pagos más programados</div>";
    }
    h += "<div style='display:flex;justify-content:space-between;padding-top:.45rem;margin-top:.3rem;border-top:1px solid rgba(196,150,90,.25);font-size:.72rem'>";
    h += "<span style='color:#7a5a1a;font-weight:700'>Total cuotas pendientes:</span>";
    h += "<span style='color:#7a5a1a;font-weight:800'>"+_catFmtMoney(totalPendiente)+"</span>";
    h += "</div>";

    h += "</div>";
    cont.innerHTML = h;
  }).catch(function(e){
    console.error('[catalogo cuotas]', e);
  });
}

// ── Generar cuotas para pedido CC del cliente ────────────────────────────
// Usado cuando el cliente envía un pedido con forma_pago='cuenta_corriente'
// Replica la lógica de admin/ventas pero en el catálogo (acceso público con anon key)
function _catGenerarCuotasCliente(pedidoId, clienteId, planId, totalPedido){
  // Auditoría 2026-10-04: las cuotas las arma la base (RPC cc_generar_cuotas_web) con el
  // total real del pedido y el plan del cliente, en una sola transacción e idempotente.
  // Antes el navegador calculaba montos y fechas e insertaba las cuotas una por una.
  if(!pedidoId || !planId){
    return Promise.reject(new Error('Datos incompletos para generar cuotas'));
  }
  return apiPost('rpc/cc_generar_cuotas_web',{p_pedido_id:pedidoId, p_plan_id:planId}).then(function(res){
    if(!res || !res.ok){ throw new Error((res && res.error) || 'No se pudieron generar las cuotas'); }
    if(res.ya_existian){ console.warn('[catalogo cc] cuotas ya existían para pedido '+pedidoId); return { cuotas:0, ya_existian:true }; }
    _dbg('[catalogo cc] '+res.cuotas+' cuotas generadas para pedido '+pedidoId);
    return { cuotas:res.cuotas, totalConRecargo:res.totalConRecargo };
  });
}

function _catCobActState(){
  // Actualizar el botón final + total con envío
  var st = window._catCobState;
  var telEl = document.getElementById('_catCobTel');
  if(telEl) st.telefono = telEl.value.trim();

  var subtotal = _catCobCalcSubtotal();
  var totalFinal = subtotal + (st.costo_envio||0);

  var subEl = document.getElementById('_catCobSubtot');
  if(subEl) subEl.textContent = fmt(subtotal);
  var envEl = document.getElementById('_catCobEnvio');
  if(envEl){
    if(!st.modo_entrega){
      envEl.textContent = 'Elegí entrega';
      envEl.style.color = 'var(--mid)';
      envEl.style.fontStyle = 'italic';
    } else if(st.envio_a_confirmar){
      envEl.textContent = 'A confirmar';
      envEl.style.color = '#7a5a1a';
      envEl.style.fontStyle = 'italic';
    } else if(st.costo_envio === 0){
      envEl.textContent = 'GRATIS';
      envEl.style.color = '#3a6f2a';
      envEl.style.fontStyle = 'normal';
    } else {
      envEl.textContent = fmt(st.costo_envio);
      envEl.style.color = 'var(--accent)';
      envEl.style.fontStyle = 'normal';
    }
  }
  var totEl = document.getElementById('_catCobTotal');
  if(totEl){
    if(st.envio_a_confirmar){
      totEl.innerHTML = fmt(totalFinal)+" <span style='font-size:.7rem;color:var(--mid);font-weight:500'>+ envío</span>";
    } else {
      totEl.textContent = fmt(totalFinal);
    }
  }

  // Validaciones del botón final
  var btn = document.getElementById('_catCobBtn');
  if(!btn) return;
  var falta = [];
  if(!st.direccion_id) falta.push('dirección');
  if(!st.modo_entrega) falta.push('entrega');
  if(!st.forma_pago) falta.push('pago');
  if(!st.telefono || st.telefono.length < 6) falta.push('teléfono');

  // Refrescar avisos visibles + obtener info de restricciones
  var info = (typeof _catCobRefreshAvisos === 'function') ? _catCobRefreshAvisos() : null;

  // Bloqueo por restricciones: forma de pago incompatible o productos sin mínimo cumplido
  var bloqueoRestriccion = '';
  if(info){
    if(!info.formaPagoOk){
      bloqueoRestriccion = 'Cambiá la forma de pago';
    } else if(info.prodsConMinimo && info.prodsConMinimo.length){
      var primero = info.prodsConMinimo[0];
      var faltaFmt = '$' + Math.round(primero.falta).toLocaleString('es-AR');
      bloqueoRestriccion = 'Falta '+faltaFmt+' para mínimo';
    }
  }

  // FEAT CC v2 (2026-05-14): bloqueos específicos de CC
  if(st.forma_pago === 'cuenta_corriente' && _catCliente){
    if(_catCliente.bloqueado){
      bloqueoRestriccion = 'Cuenta corriente bloqueada';
    } else if(!_catCliente.cuenta_corriente_habilitada){
      bloqueoRestriccion = 'CC no habilitada';
    }
    // Si la modalidad es 'cuotas' y hay planes, requerir selección
    var datosCC = window._catCCDatosCC;
    if(datosCC && datosCC.planes && datosCC.planes.length && !window._catCCPlanElegido){
      bloqueoRestriccion = 'Elegí cuántas cuotas';
    }
  }

  if(falta.length){
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
    btn.style.background = '#ccc';
    btn.textContent = 'Falta: '+falta.join(', ');
  } else if(bloqueoRestriccion){
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
    btn.style.background = '#c4965a';
    btn.style.color = '#fff';
    btn.textContent = '⚠️ '+bloqueoRestriccion;
  } else {
    btn.disabled = false;
    btn.style.cursor = 'pointer';
    btn.style.background = 'linear-gradient(to bottom,#3aaf3a,#2a8a2a)';
    btn.style.color = '#fff';
    btn.textContent = '🛒 COMPRAR';
  }
}

function _catCobConfirmar(){
  var st = window._catCobState;
  var _rgChk=_rgChequearMinimo();
  if(!_rgChk.ok){ _catToast(_rgChk.msg,'twarn'); return Promise.resolve(); }
  if(!st.direccion_id || !st.modo_entrega || !st.forma_pago){
    _catToast('Faltan datos','twarn');
    return Promise.resolve();
  }

  // Validación final: bloquear si hay restricciones no resueltas
  if(typeof _catEvaluarRestricciones === 'function'){
    var info = _catEvaluarRestricciones();
    if(!info.formaPagoOk){
      _catToast(info.mensajePago, 'twarn');
      return Promise.resolve();
    }
    if(info.prodsConMinimo && info.prodsConMinimo.length){
      var primero = info.prodsConMinimo[0];
      var faltaFmt = '$' + Math.round(primero.falta).toLocaleString('es-AR');
      _catToast('Te falta '+faltaFmt+' para llegar al mínimo de "'+_prodMl(primero.prod.nombre,primero.prod.ml)+'"', 'twarn');
      return Promise.resolve();
    }
  }
  var dirs = window._catCobDirs || [];
  var d = dirs.find(function(x){return x.id===st.direccion_id;});
  if(!d){_catToast('Dirección no encontrada','terr'); return Promise.resolve();}

  // Guard de re-entrancia: si ya hay un listener activo o un timeout pendiente,
  // limpiarlos antes de armar nuevos. Esto evita acumulación si el cliente reintenta
  // después de un error (botón "⚠️ Reintentar").
  if(window._catCobOnPedidoListener){
    try { window.removeEventListener('belle:pedido-enviado', window._catCobOnPedidoListener); } catch(e){}
    window._catCobOnPedidoListener = null;
  }
  if(window._catCobTimeoutId){
    clearTimeout(window._catCobTimeoutId);
    window._catCobTimeoutId = null;
  }

  // Mostrar overlay "Procesando..." DENTRO del modal (no cerrarlo todavía)
  var modal = document.getElementById('_catMoCobro');
  if(modal){
    var overlay = document.createElement('div');
    overlay.id = '_catCobOverlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(255,255,255,.92);z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:14px;padding:1.5rem;text-align:center';
    overlay.innerHTML =
      "<div style='width:48px;height:48px;border:4px solid #e8d9bf;border-top-color:var(--accent);border-radius:50%;animation:_catCobSpin 0.9s linear infinite;margin-bottom:1rem'></div>"+
      "<div style='font-size:1rem;font-weight:700;color:var(--dark);margin-bottom:.3rem'>Procesando tu pedido...</div>"+
      "<div style='font-size:.78rem;color:var(--mid);max-width:300px'>Estamos guardando el pedido y preparando WhatsApp. No cierres esta ventana.</div>";
    // Animación spinner (solo si no existe la regla ya)
    if(!document.getElementById('_catCobSpinStyle')){
      var st2 = document.createElement('style');
      st2.id = '_catCobSpinStyle';
      st2.textContent = '@keyframes _catCobSpin{to{transform:rotate(360deg)}}';
      document.head.appendChild(st2);
    }
    // Asegurar que el modal tiene position:relative para que el overlay absolute funcione
    var modalBox = modal.querySelector('div');
    if(modalBox){
      modalBox.style.position = 'relative';
      modalBox.appendChild(overlay);
    } else {
      modal.style.position = 'relative';
      modal.appendChild(overlay);
    }
  }

  // Listener UNA SOLA vez al evento de fin.
  // Lo guardamos en window._catCobOnPedidoListener para poder limpiarlo desde _catCobCerrarModal
  // en caso que el cliente cierre el modal manualmente antes que termine el flujo.
  function _onPedidoEnviado(e){
    window.removeEventListener('belle:pedido-enviado', _onPedidoEnviado);
    window._catCobOnPedidoListener = null;
    // Limpiar timeout ya que recibimos respuesta
    if(window._catCobTimeoutId){
      clearTimeout(window._catCobTimeoutId);
      window._catCobTimeoutId = null;
    }
    // Sacar overlay
    var ov = document.getElementById('_catCobOverlay');
    if(e && e.detail && e.detail.exito){
      // Éxito: cerrar el modal completo
      var moCerrar = document.getElementById('_catMoCobro');
      if(moCerrar) moCerrar.remove();
      // FIX 2026-05-15: desregistrar de la pila del botón atrás (modal ya no está)
      _catModalBackDesregistrar('_catMoCobro');
    } else {
      // Error: ocultar overlay y dejar el modal abierto para que el cliente reintente
      if(ov) ov.remove();
      // Mensaje en el botón
      var btn = document.getElementById('_catCobBtn');
      if(btn){
        btn.disabled = false;
        btn.style.cursor = 'pointer';
        btn.style.background = '#c5443a';
        btn.style.color = '#fff';
        btn.textContent = '⚠️ Reintentar';
      }
    }
  }
  window._catCobOnPedidoListener = _onPedidoEnviado;
  window.addEventListener('belle:pedido-enviado', _onPedidoEnviado);

  // Timeout de seguridad: si pasan 30s y no recibimos el evento, sacamos el overlay
  window._catCobTimeoutId = setTimeout(function(){
    window._catCobTimeoutId = null;
    var ov = document.getElementById('_catCobOverlay');
    if(ov){
      window.removeEventListener('belle:pedido-enviado', _onPedidoEnviado);
      window._catCobOnPedidoListener = null;
      ov.innerHTML = "<div style='font-size:1rem;font-weight:700;color:#c5443a;margin-bottom:.4rem'>⚠️ Tardó más de lo esperado</div>"+
        "<div style='font-size:.8rem;color:var(--mid);max-width:300px;line-height:1.5;margin-bottom:.9rem'>Verificá tu conexión. Si ya se abrió WhatsApp, tu pedido se envió.</div>"+
        "<button onclick='_catCobCerrarModal()' style='background:var(--accent);color:#fff;border:none;border-radius:7px;padding:.55rem 1.2rem;font-size:.82rem;cursor:pointer'>Cerrar</button>";
    }
  }, 30000);

  // Si el teléfono cambió, actualizarlo en el cliente
  var telActualizar = Promise.resolve();
  if(st.telefono && st.telefono !== _catCliente.telefono_principal){
    telActualizar = apiPatch('clientes',{telefono_principal: st.telefono},'id=eq.'+_catCliente.id).then(function(){
      _catCliente.telefono_principal = st.telefono;
    }).catch(function(e){console.error('[belle-cat] tel update silencioso:',e);});
  }

  // Arrancar el flujo SIN cerrar el modal — el evento 'belle:pedido-enviado' lo cerrará al terminar
  return telActualizar.then(function(){
    _continuarSendWA(d, {
      forma_pago: st.forma_pago,
      modo_entrega: st.modo_entrega,
      costo_envio: st.costo_envio,
      envio_a_confirmar: st.envio_a_confirmar,
      envio_zona_id: st.envio_zona_id
    });
  });
}

// Helpers locales (versión catálogo de las funciones admin)
function _cobDistanciaKmCat(lat1, lng1, lat2, lng2){
  var R = 6371;
  var toRad = function(d){return d*Math.PI/180;};
  var dLat = toRad(lat2-lat1);
  var dLng = toRad(lng2-lng1);
  var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(lat1))*Math.cos(toRad(lat2)) * Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Normalizador (mismo que admin) — quita acentos, lowercase, espacios extras.
function _cobNormStrCat(s){
  return String(s||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/\s+/g,' ')
    .trim();
}

// Extrae los 4 dígitos numéricos del CP (CPA argentino) — mismo helper que admin.
// "5000" → 5000, "X5000AAA" → 5000, "5000ABC" → 5000, null si no hay 4 dígitos.
function _cobExtraerCP4Cat(cp){
  if(!cp) return null;
  var m = String(cp).match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : null;
}

function _cobMatchZonaAndreaniCat(provincia, localidad, codigoPostal, zonas, configFallback){
  zonas = zonas || [];
  var prov = _cobNormStrCat(provincia);
  var loc = _cobNormStrCat(localidad);
  var cpNum = _cobExtraerCP4Cat(codigoPostal);
  function score(z){
    var s = 0;
    if(z.cp_desde || z.cp_hasta){
      var dDesde = _cobExtraerCP4Cat(z.cp_desde) || 0;
      var dHasta = _cobExtraerCP4Cat(z.cp_hasta) || 99999;
      if(cpNum !== null){
        if(cpNum>=dDesde && cpNum<=dHasta) s += 100;
        else return -1;
      } else { return -1; }
    }
    if(z.localidad){
      if(!loc) return -1;
      if(loc !== _cobNormStrCat(z.localidad)) return -1;
      s += 50;
    }
    if(z.provincia){
      if(!prov) return -1;
      if(prov !== _cobNormStrCat(z.provincia)) return -1;
      s += 10;
    } else if(!z.localidad && !z.cp_desde && !z.cp_hasta){
      s += 1;
    }
    return s;
  }
  var mejor = null; var mejorScore = -1;
  zonas.forEach(function(z){
    var s = score(z);
    if(s > mejorScore){ mejorScore = s; mejor = z; }
  });
  if(mejor && mejorScore > 0){
    return {a_confirmar:false, tarifa:parseFloat(mejor.tarifa||0), nombre:mejor.nombre, zona_id:mejor.id};
  }
  var msg = (configFallback && configFallback.andreani_mensaje_default) || 'Cotización a confirmar por zona';
  return {a_confirmar:true, tarifa:0, mensaje:msg};
}

// Continuar el envío del pedido con la dirección elegida (puede ser null si "sin cuenta")
function _continuarSendWA(direccion, ctxCobro){
  // ctxCobro = { forma_pago, modo_entrega, costo_envio, envio_a_confirmar, envio_zona_id }
  // Si viene del modal de cobro nuevo, todos los datos están ahí.
  // Si viene de un flujo legacy (cliente sin sesión), ctxCobro será undefined → usar defaults.
  ctxCobro = ctxCobro || {};

  // Forzar recálculo de precios x10/x3/x1 según el total actual del cart antes de procesar.
  // renderDrawer recorre todos los items y actualiza cart[id].precio al segmento correcto.
  // Esto cubre el edge case en que el cliente agregó items en distintos momentos
  // y los precios del cart quedaron desactualizados respecto del total actual.
  try { if(typeof renderDrawer === 'function') renderDrawer(); } catch(e){}

  var costoEnvio = ctxCobro.costo_envio || 0;
  // Default 'domicilio' si no viene del modal (caso edge: cliente con flujo legacy/sin sesión).
  // Nota: 'vendedor' era el valor viejo, ahora es 'domicilio' (mismo significado: entrega manual del vendedor).
  var modoEntrega = ctxCobro.modo_entrega || (direccion && direccion.modo_entrega) || 'domicilio';
  var formaPago = ctxCobro.forma_pago || null;
  var envioAConfirmar = !!ctxCobro.envio_a_confirmar;
  var envioZonaId = ctxCobro.envio_zona_id || null;

  // Llamar al sendWA original con los datos de cliente/dirección como contexto
  window._sendWAContext = {
    cliente_id: _catCliente ? _catCliente.id : null,
    direccion_entrega_id: direccion ? direccion.id : null,
    direccion_obj: direccion,
    modo_entrega: modoEntrega,
    distancia_km: direccion ? direccion.distancia_km : null,
    costo_envio: costoEnvio,
    forma_pago: formaPago,
    envio_a_confirmar: envioAConfirmar,
    envio_zona_id: envioZonaId
  };
  _sendWAOriginal();
}

function _sendWAOriginal(){
  if(window._configFallo){ _catToast('No se pudo cargar la configuración, recargá la página para enviar el pedido','terr'); return; }
  // Evitar doble envío
  if(window._sendingOrder){showToast('Pedido en proceso, esperá...');return;}
  window._sendingOrder=true;
  var waBtn=document.getElementById('waBtn');
  if(waBtn){waBtn.disabled=true;waBtn.style.opacity='.5';}
  recomputarBonificados();
  var items=Object.values(cart);if(!items.length){
    window._sendingOrder=false;
    if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
    return;
  }
  var minErrors=validarGruposMinimos(Object.values(cart),allProds);
  if(minErrors.length){
    showToast(minErrors[0]);
    window._sendingOrder=false;
    if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
    try{window.dispatchEvent(new CustomEvent('belle:pedido-enviado',{detail:{exito:false, error:minErrors[0]}}));}catch(e){}
    return;
  }
  var _rgChkWA=_rgChequearMinimo();
  if(!_rgChkWA.ok){
    showToast(_rgChkWA.msg);
    window._sendingOrder=false;
    if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
    try{window.dispatchEvent(new CustomEvent('belle:pedido-enviado',{detail:{exito:false, error:_rgChkWA.msg}}));}catch(e){}
    return;
  }
  items=_rgOrdenarItems(items);
  var _rgHdrWA=false;
  var perfs=items.filter(function(i){return !i.isDecan && !i.isCosm && !i.isCombo;});   // 2026-09-29: combos aparte (precio único)
  var decans=items.filter(function(i){return i.isDecan;});
  var totalUnits=perfs.reduce(function(s,i){return s+i.qty;},0);
  var totalDecans=decans.reduce(function(s,i){return s+i.qty;},0);
  var montoDecans=decans.reduce(function(s,i){return s+(i.precio||0)*i.qty;},0);
  // FEAT (2026-05-22): validar con helper unificado de mínimos
  var _chkD2 = _decansCumpleMinimo(totalDecans, montoDecans);
  if(totalDecans>0 && totalUnits===0 && !_chkD2.cumple){
    var _cfgD = window._configDecans || {};
    var _msgErr = _msgMinimoTexto({
      prefijo: 'Compra mínima de decans no cumplida',
      modo: _cfgD.modo || 'unidades',
      minUnidades: parseInt(_cfgD.min_unidades_sin_perfume)||0,
      minMonto: parseInt(_cfgD.min_monto_sin_perfume)||0,
      unidadesActuales: totalDecans,
      montoActual: montoDecans
    });
    showToast(_msgErr || 'No se cumple el mínimo de compra de decans');
    window._sendingOrder=false;
    if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
    try{window.dispatchEvent(new CustomEvent('belle:pedido-enviado',{detail:{exito:false, error:'Mínimo decans no cumplido'}}));}catch(e){}
    return;
  }
  // Validar stock disponible para cada producto individual
  // FIX stock 2026-06-18: disponible = stock_actual (NO sumar reserva; reserva ya está comprometida a otros pedidos)
  for(var xi=0;xi<perfs.length;xi++){
    var pcheck=allProds.find(function(x){return x.id===perfs[xi].id;});
    if(pcheck&&perfs[xi].qty>(pcheck.stock_actual||0)){
      var msgStock="Stock insuficiente: "+_prodMl(pcheck.nombre.split(" - ").pop(), pcheck.ml);
      showToast(msgStock);
      window._sendingOrder=false;
      if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
      try{window.dispatchEvent(new CustomEvent('belle:pedido-enviado',{detail:{exito:false, error:msgStock}}));}catch(e){}
      return;
    }
  }
  // Validar stock de productos dentro de combos
  var combosEnCart=items.filter(function(i){return i.isCombo;});
  for(var ci=0;ci<combosEnCart.length;ci++){
    var comboItem=combosEnCart[ci];
    var comboRef=combosPublicos.find(function(c){return c.id===comboItem.comboId;});
    if(comboRef&&comboRef.combo_items){
      for(var cj=0;cj<comboRef.combo_items.length;cj++){
        var ci2=comboRef.combo_items[cj];
        if(ci2.es_decan)continue;
        var pCombo=allProds.find(function(x){return x.id===ci2.producto_id;});
        var cantNecesaria=(ci2.cantidad||1)*(comboItem.qty||1);
        if(pCombo&&cantNecesaria>(pCombo.stock_actual||0)){
          var msgComboStock="Stock insuficiente para combo "+comboRef.nombre+": "+_nomMl(ci2.producto_nombre, ci2.producto_id);
          showToast(msgComboStock);
          window._sendingOrder=false;
          if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
          try{window.dispatchEvent(new CustomEvent('belle:pedido-enviado',{detail:{exito:false, error:msgComboStock}}));}catch(e){}
          return;
        }
      }
    }
  }
  var total=0;var pedidoItems=[];
  var msg="Pedido Web - Distribuidora Belle\n\n";
  // FIX 2026-09-23: 6 dígitos al azar chocaban con >50% de probabilidad al pasar los ~1.100 pedidos (no hay
  // UNIQUE en la base). Ahora el número sale del reloj (único por milisegundo, ventana de 15 min) + azar.
  var nroOrden="WEB-"+String(100000+((Date.now()*7+Math.floor(Math.random()*7))%900000));
  items.forEach(function(item){
    var price,sub,segL;
    if(item.isRegalo&&!_rgHdrWA){ _rgHdrWA=true; msg+="🎁 Para regalar:\n"; }
    if(item.isBonificado){
      // Regalo bonificado: $0, no suma al total.
      msg+="- 🎁 "+_prodMl(item.nombre, _mlDe(item.prodId||item.id))+" (BONIFICADO)\n  "+item.qty+" x $0 = $0\n\n";
      pedidoItems.push({producto_id:item.prodId,nombre:item.nombre,qty:item.qty,segmento:"BONIFICADO",precio:0,total:0,isDecan:false,isBonificado:true});
      return;
    }
    if(item.isDecan){price=item.precio;sub=price*item.qty;segL="decan";}
    else if(item.isCosm){price=item.precio;sub=price*item.qty;segL=item.cajaLabel||("Caja x"+item.cajaCant);}
    else if(item.isCombo){
      price=item.precio;sub=price*item.qty;segL="combo";
      var comboRef=combosPublicos.find(function(c){return c.id===item.comboId;});
      if(comboRef&&comboRef.combo_items)
        item._incluyeWA="  _Incluye: "+(comboRef.combo_items||[]).map(function(ci){return"x"+ci.cantidad+" "+_prodMl(ci.producto_nombre, _mlDe(ci.producto_id))+(ci.es_decan&&!/decan/i.test(ci.producto_nombre||'')?" (decant 5ml)":"");}).join(" + ")+"_\n";
    }
    else{
      // Usar item.precio guardado en el cart al momento de agregar — NO recalcular
      price=item.precio;
      sub=price*item.qty;
      // Handle precio unico (precio_pestana)
      if(item.seg==="pi"&&allProds.find(function(x){return x.id===item.id&&(x.precio_pestana||0)>0;})){
        segL="Precio unico";
      } else {
        segL=item.seg==="pm"?"x10":item.seg==="pe"?"x3":"x1";
      }
    }
    total+=sub;
    msg+="- "+_prodMl(item.nombre, _mlDe(item.prodId||item.id))+"\n  "+item.qty+" x "+fmt(price)+" ("+segL+") = "+fmt(sub)+"\n";
    if(item._incluyeWA){ msg+=item._incluyeWA; item._incluyeWA=null; }   // 2026-09-29: el "Incluye" va debajo del combo, no arriba
    msg+="\n";
    pedidoItems.push({producto_id:item.isCombo?null:((item.isDecan||item.isCosm)?item.prodId:item.id),combo_id:item.isCombo?(item.comboId||null):undefined,nombre:item.nombre,qty:item.qty,segmento:segL,precio:price,total:sub,isDecan:item.isDecan||false,isCombo:!!item.isCombo});
  });

  // FASE B Sub-bloque 5: agregar info de cliente y dirección al mensaje WA
  var ctx = window._sendWAContext || {};
  if(ctx.direccion_obj){
    var d = ctx.direccion_obj;
    msg += "_______________\n\n";
    msg += "📍 Dirección de entrega:\n";
    msg += d.direccion_completa || ((d.calle||"")+" "+(d.numero||""));
    if(d.piso_depto) msg += "\n   Piso/Depto: " + d.piso_depto;
    if(d.referencias) msg += "\n   Ref: " + d.referencias;
    msg += "\n";
    // Modo entrega (nuevo sistema de cobros)
    if(ctx.modo_entrega === "domicilio"){
      msg += "\n🚚 Envío a domicilio (GRATIS)";
      if(ctx.distancia_km) msg += " · "+ctx.distancia_km+" km";
    } else if(ctx.modo_entrega === "andreani"){
      if(ctx.envio_a_confirmar){
        msg += "\n📦 Andreani · costo a confirmar por zona";
      } else {
        msg += "\n📦 Andreani · "+fmt(ctx.costo_envio||0);
      }
    } else if(ctx.modo_entrega === "correo"){
      // Legacy: clientes con direcciones viejas marcadas como correo
      msg += "\n📦 Envío por correo";
    } else {
      msg += "\n🚚 Entrega a coordinar";
    }
    msg += "\n_______________\n";
  }

  // Forma de pago
  if(ctx.forma_pago){
    var formaLabel = {
      efectivo:'💵 Efectivo',
      transferencia:'🏦 Transferencia bancaria',
      tarjeta:'💳 Tarjeta',
      mercadopago:'💙 Mercado Pago',
      cuenta_corriente:'💳 Cuenta corriente'
    }[ctx.forma_pago] || ctx.forma_pago;
    msg += "\n💳 Forma de pago: "+formaLabel+"\n";
  }

  // Total con envío
  var totalConEnvio = total + (ctx.costo_envio || 0);
  msg+="\nOrden: "+nroOrden;
  msg+="\nProductos: "+fmt(total);
  if(ctx.costo_envio && ctx.costo_envio > 0){
    msg+="\nEnvío: "+fmt(ctx.costo_envio);
    msg+="\n*Total: "+fmt(totalConEnvio)+"*";
  } else if(ctx.envio_a_confirmar){
    msg+="\n*Total: "+fmt(total)+" + envío a confirmar*";
  } else {
    msg+="\n*Total: "+fmt(total)+"*";
  }
  msg+="\n\nHola! Me gustar\u00eda confirmar este pedido. Soy cliente web.";
  // Build full items list including combos for the pedido record
  // Construir fullPedidoItems directamente desde el carrito — fuente de verdad
  var allCartItems=Object.values(cart);
  var fullPedidoItems=[];
  allCartItems.forEach(function(item){
    if(item.isBonificado){
      fullPedidoItems.push({
        producto_id:item.prodId,nombre:item.nombre,qty:item.qty,
        segmento:"BONIFICADO",precio:0,total:0,isDecan:false,isCombo:false,isBonificado:true
      });
      return;
    }
    if(item.isCombo){
      var _crSnap=combosPublicos.find(function(c){return c.id===item.comboId;});
      fullPedidoItems.push({
        producto_id:null,combo_id:item.comboId,nombre:item.nombre,
        qty:item.qty,segmento:"combo",precio:item.precio,
        total:item.precio*item.qty,isDecan:false,isCombo:true,
        comboItems:_comboSnapshot(_crSnap)   // 2026-09-29: qué traía el combo al momento de pedirlo
      });
    } else if(item.isDecan){
      // Decan: siempre como item independiente, nunca fusionar con perfume entero
      fullPedidoItems.push({
        producto_id:item.prodId,
        nombre:item.nombre,
        qty:item.qty,
        segmento:"decan",
        precio:item.precio,
        total:item.precio*item.qty,
        isDecan:true,
        isCombo:false,
        decanQty:item.decanQty||5
      });
    } else if(item.isCosm){
      // Cosmético vendido por caja: registrar la línea de caja fielmente
      fullPedidoItems.push({
        producto_id:item.prodId,
        nombre:item.nombre,
        qty:item.qty,
        segmento:item.cajaLabel||("Caja x"+item.cajaCant),
        precio:item.precio,
        total:item.precio*item.qty,
        isDecan:false,
        isCombo:false,
        isCosm:true,
        isRegalo:!!item.isRegalo,
        cajaCant:item.cajaCant||1,
        unidades:(item.cajaCant||1)*item.qty
      });
    } else {
      // Perfume normal o precio único — mapear segmento correctamente
      var seg=item.seg==="pm"?"x10":item.seg==="pe"?"x3":item.seg==="pi"?"Precio unico":"x1";
      var itemPedido = {
        producto_id:item.id,
        nombre:item.nombre,
        qty:item.qty,
        segmento:seg,
        precio:item.precio,
        total:item.precio*item.qty,
        isDecan:false,
        isCombo:false
      };
      // [OBSERVACIÓN fix] Si el item tenía una oferta aplicada, guardar trazabilidad
      // (id de oferta, tipo, etiqueta) para auditoría/reportes futuros.
      if(item.oferta && item.oferta.id){
        itemPedido.oferta_id = item.oferta.id;
        itemPedido.oferta_tipo = item.oferta.tipo;
        itemPedido.oferta_etiqueta = item.oferta.etiqueta || null;
      }
      fullPedidoItems.push(itemPedido);
    }
  });

  // FASE B Sub-bloque 5: enriquecer pedido con cliente_id + dirección + modo
  var pedidoData = {items:fullPedidoItems,total:total,estado:"pendiente",confirmado_cobro:false,nro_orden:nroOrden};
  // 2026-10-09: si algún ítem pertenece a una campaña vigente, el pedido queda atribuido a ella (para medirla en Belle)
  try{ var _campAtr=_campAtribuirPedido(items); if(_campAtr) pedidoData.campania_id=_campAtr; }catch(e){}
  if(ctx.cliente_id) pedidoData.cliente_id = ctx.cliente_id;
  if(ctx.direccion_entrega_id){
    pedidoData.direccion_entrega_id = ctx.direccion_entrega_id;
    pedidoData.direccion_id = ctx.direccion_entrega_id; // alias para nuevas columnas
  }
  if(ctx.modo_entrega) pedidoData.modo_entrega = ctx.modo_entrega;
  if(ctx.distancia_km != null) pedidoData.distancia_km = ctx.distancia_km;
  if(ctx.costo_envio && ctx.costo_envio > 0) pedidoData.costo_envio = ctx.costo_envio;
  // Nuevas columnas de cobros/envíos
  if(ctx.forma_pago) pedidoData.forma_pago = ctx.forma_pago;
  if(ctx.envio_a_confirmar) pedidoData.envio_a_confirmar = true;
  if(ctx.envio_zona_id) pedidoData.envio_zona_id = ctx.envio_zona_id;
  pedidoData.total_con_envio = total + (ctx.costo_envio || 0);
  // FEAT CC v2 (2026-05-14): si cliente pagó con CC, marcar es_cc y guardar plan elegido
  var _esCCCheckout = (ctx.forma_pago === 'cuenta_corriente');
  if(_esCCCheckout){
    pedidoData.es_cc = true;
  }
  var _planElegido = _esCCCheckout ? (window._catCCPlanElegido || null) : null;

  // Guardar pedido con todos los items
  // Auditoría 2026-10-04: el pedido y la reserva de stock se hacen en UNA transacción en la base
  // (RPC crear_pedido_web). Si falta stock de algo no se crea nada y se avisa qué falta; antes el
  // pedido quedaba creado con reservas a medias. La base además rechaza perfumes por debajo del
  // precio mayorista sin oferta y totales que no cierran (los precios ya no se confían al navegador).
  var _crearPedidoBelle=function(){
  // Qué hay que apartar: perfumes, componentes de combos, cosméticos por unidades y regalos
  var todosIds=[];
  allCartItems.forEach(function(item){
    if(item.isDecan)return;
    if(item.isBonificado){
      // El regalo consume stock del producto regalado → reservarlo.
      if(item.prodId){
        var _grf=allProds.find(function(p){return p.id===item.prodId;});
        todosIds.push({id:item.prodId,qty:item.qty||1,nombre:(_grf&&_grf.nombre)||item.nombre||('Prod #'+item.prodId)});
      }
      return;
    }
    if(item.isCombo){
      var comboRef=combosPublicos.find(function(c){return c.id===item.comboId;});
      if(comboRef&&comboRef.combo_items){
        comboRef.combo_items.forEach(function(ci){
          if(ci.producto_id&&!ci.es_decan){
            // FIX 2 (2026-05-11): pasar nombre para logging del movimiento
            var prodRef2=allProds.find(function(p){return p.id===ci.producto_id;});
            todosIds.push({id:ci.producto_id,qty:(ci.cantidad||1)*(item.qty||1),nombre:(prodRef2&&prodRef2.nombre)||('Prod #'+ci.producto_id)+' (combo)'});
          }
        });
      }
    } else if(item.isCosm){
      // Cosmético por caja: reservar UNIDADES reales (caja × cantidad de cajas)
      var cpid=item.prodId;
      if(cpid){
        var cRef=allProds.find(function(p){return p.id===cpid;});
        todosIds.push({id:cpid,qty:(item.cajaCant||1)*(item.qty||1),nombre:(cRef&&cRef.nombre)||item.nombre||('Prod #'+cpid)});
      }
    } else {
      var pid=parseInt(item.id);
      if(pid){
        var prodRef=allProds.find(function(p){return p.id===pid;});
        todosIds.push({id:pid,qty:item.qty||1,nombre:(prodRef&&prodRef.nombre)||item.nombre||('Prod #'+pid)});
      }
    }
  });
  var qtxProd={};
  var qtxNombre={};
  todosIds.forEach(function(x){
    qtxProd[x.id]=(qtxProd[x.id]||0)+x.qty;
    if(x.nombre)qtxNombre[x.id]=x.nombre;
  });
  var _reservas=Object.keys(qtxProd).map(function(pid){ return {id:parseInt(pid), qty:qtxProd[pid], nombre:qtxNombre[pid]||('Prod #'+pid)}; });
  apiPost("rpc/crear_pedido_web",{p_pedido:pedidoData, p_reservas:_reservas}).then(function(res){
    if(!res || !res.ok){
      if(res && res.motivo==='sin_stock'){
        var _fallasM=(res.faltantes||[]).map(function(f){ return {pid:f.pid, nombre:f.nombre||('Prod #'+f.pid), qty:f.qty, disp:f.disp}; });
        try{
          _avisoSinStockModal(_fallasM,{
            icono:'📦',
            titulo:'Falta stock para tu pedido',
            intro:'Tu pedido '+nroOrden+' no se envió porque estos productos no tienen stock suficiente:',
            nota:'Ajustá las cantidades y volvé a intentar.'
          });
        }catch(eN){ console.warn('[belle-cat] aviso sin stock:',eN); }
        _logAct('pedido_web_sin_stock', {nro_orden:nroOrden, faltantes:_fallasM}, {exito:false, error_msg:'sin stock'});
        var eSS=new Error('__sin_stock__'); eSS.silencioso=true; throw eSS;
      }
      var eP=new Error((res && (res.error||res.message)) || 'Pedido no registrado'); eP.mensajeUsuario=(res && res.error) || null; throw eP;
    }
    var pedCreado = res.pedido;
    if(!pedCreado || !pedCreado.id){ throw new Error("Pedido no registrado: sin respuesta de la base"); }
    // FEAT CC v2 (2026-05-14): si es CC y hay plan, generar cuotas automáticamente
    if(_esCCCheckout && pedCreado && pedCreado.id && _planElegido){
      // Generar cuotas con el plan elegido por el cliente
      _catGenerarCuotasCliente(pedCreado.id, ctx.cliente_id, _planElegido, total + (ctx.costo_envio||0)).catch(function(e){
        console.error('[catalogo cc] error generar cuotas:', e);
      });
    }
    var waBtn=document.getElementById('waBtn');
    if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
    // (el stock ya quedó reservado dentro de la misma transacción que creó el pedido)
    // FIX: window.open y vaciado del carrito DENTRO del .then() — solo si el pedido se guardó
    var urlWA = "https://wa.me/"+waNumber+"?text="+encodeURIComponent(msg);
    // Intentar abrir WhatsApp. Si el navegador bloquea (mobile Safari especialmente lo hace
    // cuando pasa demasiado tiempo entre el click del usuario y la apertura), mostrar un
    // modal con un botón grande para que el cliente lo abra manualmente.
    var winWA = window.open(urlWA, "_blank");
    var bloqueado = !winWA || winWA.closed || typeof winWA.closed === 'undefined';
    if(bloqueado){
      // Mostrar modal con link manual
      try {
        var moBlock = document.createElement('div');
        moBlock.id = '_catMoWaFallback';
        moBlock.style.cssText = 'position:fixed;inset:0;background:rgba(20,15,8,.85);z-index:1600;display:flex;align-items:center;justify-content:center;padding:1rem';
        moBlock.innerHTML =
          "<div style='background:#fff;border-radius:14px;max-width:420px;width:100%;padding:1.5rem;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.4)'>"+
            "<div style='font-size:2.5rem;margin-bottom:.5rem'>✅</div>"+
            "<div style='font-size:1.05rem;font-weight:700;color:var(--dark);margin-bottom:.3rem'>Tu pedido se guardó</div>"+
            "<div style='font-size:.85rem;color:var(--mid);margin-bottom:1.1rem;line-height:1.4'>Ahora tocá el botón para terminar de enviarlo por WhatsApp:</div>"+
            "<a href='"+urlWA+"' target='_blank' rel='noopener' style='display:block;background:#25D366;color:#fff;text-decoration:none;padding:.85rem;border-radius:9px;font-size:1rem;font-weight:700;margin-bottom:.5rem'>🟢 Abrir WhatsApp</a>"+
            "<button onclick='_catMoWaFallbackCerrar()' style='background:transparent;color:var(--mid);border:none;padding:.4rem;font-size:.78rem;cursor:pointer'>Cerrar</button>"+
          "</div>";
        document.body.appendChild(moBlock);
        // FIX 2026-05-15: registrar para botón atrás del celular
        _catModalBackRegistrar('_catMoWaFallback', _catMoWaFallbackCerrar);
      } catch(e){
        console.error('[belle-cat] no pude armar fallback WA:', e);
      }
    }
    cart={};cstate={};decanState={};
    // Recién acá se libera el guard: con el carrito ya vacío un segundo toque no puede re-enviar.
    window._sendingOrder=false;
    updateCartCount();
    document.getElementById("drawer").classList.remove("open");
    document.getElementById("ov").classList.remove("open");
    // FIX 2026-05-15: desregistrar drawer carrito del sistema back button (cierre directo)
    _catModalBackDesregistrar('drawer');
    // Toast informativo con detalle
    var lineasTok = [pedidoItems.length+' producto'+(pedidoItems.length!==1?'s':'')+' por '+fmt(total)];
    if(_catCliente && _catCliente.nombre) lineasTok.push('Cliente: '+_catCliente.nombre);
    lineasTok.push(bloqueado ? 'Stock reservado · Tocá el botón verde' : 'Stock reservado · WhatsApp abierto');
    showToastInfo({titulo:'✅ Pedido enviado — '+nroOrden, lineas:lineasTok});
    // Log persistente
    _logAct('pedido_web', {
      nro_orden: nroOrden,
      monto: total,
      cant_items: pedidoItems.length,
      cliente_id: _catCliente && _catCliente.id || null,
      cliente_nombre: _catCliente && _catCliente.nombre || null,
      modo_entrega: ctx.modo_entrega || null,
      direccion_id: ctx.direccion_id || null,
      items: pedidoItems.map(function(it){return {producto_id:it.producto_id, qty:it.qty, total:it.total, isDecan:!!it.isDecan};})
    });
    // Limpiar contexto
    window._sendWAContext = null;
    // Notificar al modal de cobro (si está abierto) que el flujo terminó OK
    try { window.dispatchEvent(new CustomEvent('belle:pedido-enviado', {detail:{exito:true, nroOrden:nroOrden}})); } catch(e){}
  }).catch(function(e){
    window._sendingOrder=false;
    var waBtn=document.getElementById('waBtn');
    if(waBtn){waBtn.disabled=false;waBtn.style.opacity='';}
    if(e && e.silencioso){
      // sin stock: ya se mostró el modal con el detalle, el carrito queda como estaba
      try { window.dispatchEvent(new CustomEvent('belle:pedido-enviado', {detail:{exito:false, error:'sin stock'}})); } catch(ev){}
      return;
    }
    // Detectar si es error de columna inexistente (SQL no ejecutado)
    var errMsg = (e && e.message) || String(e);
    var msgUsuario;
    if(e && e.mensajeUsuario){
      msgUsuario = e.mensajeUsuario;
    } else if(/column\s|does not exist|undefined column/i.test(errMsg)){
      msgUsuario = 'Hay una actualización pendiente del sistema. Por favor coordiná tu pedido por WhatsApp directamente.';
      console.error('[belle-cat] Error de columna BD — admin debe ejecutar cobros_envios.sql:', errMsg);
    } else if(/network|fetch|failed/i.test(errMsg)){
      msgUsuario = 'Error de conexión. Revisá tu internet e intentá de nuevo.';
    } else {
      msgUsuario = 'Error al registrar pedido. Intentá de nuevo.';
    }
    showToast(msgUsuario);
    _logAct('pedido_web', {
      nro_orden: nroOrden, monto: total, cant_items: pedidoItems.length
    }, { exito:false, error_msg: errMsg });
    // Notificar al modal del error
    try { window.dispatchEvent(new CustomEvent('belle:pedido-enviado', {detail:{exito:false, error:msgUsuario}})); } catch(ev){}
  });
  }; // fin _crearPedidoBelle

  // ── FIX 2026-06-19 ANTI-SOBREVENTA ──────────────────────────────────────
  // Revalidar stock FRESCO de la BD justo antes de crear el pedido.
  // allProds puede estar desactualizado (otro cliente reservó/compró después de cargar
  // la página) y NO incluye productos ocultos. Si falta stock de algún ítem, se aborta
  // el pedido y se avisa al cliente cuál no está disponible.
  (function(){
    var _req={};
    perfs.forEach(function(it){ if(it.isCombo)return; var pid=parseInt(it.id); if(pid)_req[pid]=(_req[pid]||0)+(it.qty||1); });
    combosEnCart.forEach(function(comboItem){
      var cr=combosPublicos.find(function(c){return c.id===comboItem.comboId;});
      if(cr&&cr.combo_items)cr.combo_items.forEach(function(ci2){ if(ci2.es_decan)return; var pid=ci2.producto_id; if(pid)_req[pid]=(_req[pid]||0)+((ci2.cantidad||1)*(comboItem.qty||1)); });
    });
    items.forEach(function(it){ if(it.isBonificado&&it.prodId){var pid=parseInt(it.prodId);if(pid)_req[pid]=(_req[pid]||0)+(it.qty||1);} });
    // FIX 2026-09-23: cajas de cosmética también se revalidan (qty × unidades por caja)
    items.forEach(function(it){ if(it.isCosm&&it.prodId){var pid=parseInt(it.prodId);if(pid)_req[pid]=(_req[pid]||0)+((it.qty||1)*(it.cajaCant||1));} });
    var _ids=Object.keys(_req);
    if(!_ids.length){ _crearPedidoBelle(); return; }
    var _evaluar=function(_fr){
      _fr=Array.isArray(_fr)?_fr:[];
      var _m={}; _fr.forEach(function(p){_m[p.id]=p;});
      var _fallas=[];
      for(var _k in _req){ var _fp=_m[_k]; var _disp=_fp?(_fp.stock_actual||0):0; if(_req[_k]>_disp){ _fallas.push({pid:parseInt(_k), nombre:(_fp&&_prodMl(_fp.nombre,_fp.ml))||('Prod #'+_k), disp:_disp, qty:_req[_k]}); } }
      if(!_fallas.length){ _crearPedidoBelle(); return; }

      // 🆕 2026-08 AUTO-AJUSTE: en vez de mandar al cliente a arreglar el carrito a mano,
      // el carrito se ajusta SOLO (quita agotados / baja al disponible) y un modal le cuenta
      // qué pasó, con dos caminos: seguir con el pedido así, o volver al carrito a reemplazar.
      var _dispDe={}; _fallas.forEach(function(f){ _dispDe[f.pid]=f.disp; });
      var _ajustes=[];
      var _delCartEntry=function(entry){
        for(var k in cart){ if(cart[k]===entry){ delete cart[k]; return true; } }
        return false;
      };
      // 1) Combos que incluyen un producto con falta → se bajan al máximo que alcanza (2026-09-29: antes se quitaban enteros)
      combosEnCart.forEach(function(comboItem){
        var cr=combosPublicos.find(function(c){return c.id===comboItem.comboId;});
        var toca=cr&&cr.combo_items&&cr.combo_items.some(function(ci2){ return !ci2.es_decan && _dispDe[ci2.producto_id]!=null; });
        if(!toca) return;
        var _max=Infinity;
        cr.combo_items.forEach(function(ci2){ if(ci2.es_decan||_dispDe[ci2.producto_id]==null) return; var otros=(_req[ci2.producto_id]||0)-((ci2.cantidad||1)*(comboItem.qty||1)); var cabe=Math.floor(Math.max(0,_dispDe[ci2.producto_id]-otros)/(ci2.cantidad||1)); if(cabe<_max)_max=cabe; });
        if(_max<=0){ if(_delCartEntry(comboItem)) _ajustes.push({tipo:'combo', nombre:comboItem.nombre||'Combo', qtyAntes:comboItem.qty||1}); }
        else if(_max<(comboItem.qty||1)){ var _antes=comboItem.qty||1; comboItem.qty=_max; _ajustes.push({tipo:'combo', nombre:comboItem.nombre||'Combo', qtyAntes:_antes, qtyDespues:_max}); }
      });
      // 2) Regalos bonificados de un producto con falta → se quitan
      items.forEach(function(it){
        if(it.isBonificado && it.prodId && _dispDe[parseInt(it.prodId)]!=null){
          if(_delCartEntry(it)) _ajustes.push({tipo:'regalo', nombre:_nomMl(it.nombre, it.prodId||it.id)||'Regalo', qtyAntes:it.qty||1});
        }
      });
      // 3) Productos sueltos → bajar al disponible o quitar si está agotado
      _fallas.forEach(function(f){
        var e=cart[f.pid]||cart['rg_'+f.pid]; if(!e || e.isCombo || e.isBonificado) return;   // 2026-10-08: regalería (clave rg_<pid>)
        if(f.disp<=0){
          delete cart[e.id];
          if(cstate[f.pid])cstate[f.pid].qty=0;
          var q0=document.getElementById('qty_'+f.pid); if(q0)q0.textContent='0';
          _ajustes.push({tipo:'agotado', nombre:f.nombre, qtyAntes:e.qty});
        } else if((e.qty||0)>f.disp){
          var antes=e.qty; e.qty=f.disp;
          if(cstate[f.pid])cstate[f.pid].qty=f.disp;
          var q1=document.getElementById('qty_'+f.pid); if(q1)q1.textContent=f.disp;
          _ajustes.push({tipo:'ajustado', nombre:f.nombre, qtyAntes:antes, qtyAhora:f.disp});
        }
      });
      try{ recomputarBonificados(); }catch(eB){}
      try{ updateCartCount(); }catch(eU){}
      try{ renderDrawer(); }catch(eD){}
      var _quedanItems=Object.keys(cart).length>0;
      window._sendingOrder=false;
      var wb=document.getElementById('waBtn'); if(wb){wb.disabled=false;wb.style.opacity='';}
      try{window.dispatchEvent(new CustomEvent('belle:pedido-enviado',{detail:{exito:false,error:'Stock ajustado'}}));}catch(e){}
      if(!_ajustes.length){ // no se pudo mapear nada (raro): aviso simple
        _avisoSinStockModal(_fallas,{titulo:'No pudimos enviar tu pedido',intro:'Estos productos no tienen stock suficiente:',nota:'Ajustá el carrito y volvé a enviarlo.'});
        return;
      }
      _stockAjustadoModal(_ajustes,{quedanItems:_quedanItems});
    };
    // FIX 2026-08: si la verificación falla por red, REINTENTAR una vez antes de dejar pasar
    // (antes un fallo de red salteaba el control; la RPC igual impide reservar de más, pero
    // el pedido podía quedar creado con un renglón sin apartar y sin aviso al cliente).
    var _intento=function(n){
      apiGet("productos","select=id,nombre,stock_actual&id=in.("+_ids.join(",")+")").then(_evaluar)
      .catch(function(){
        if(n<1){ setTimeout(function(){_intento(n+1);},1200); }
        else { _crearPedidoBelle(); } // red caída persistente: no bloquear la venta
      });
    };
    _intento(0);
  })();
}


// barras de acordes de un producto (se usan al abrir "Acordes principales")
function _acordesRowsHTML(p){
  try{
    var acList=Array.isArray(p.acordes)?p.acordes:(p.acordes?JSON.parse(p.acordes):[]);
    if(!Array.isArray(acList)||!acList.length) return "";
    return acList.map(function(a){
      var color=a.color||"#888";
      var pct=a.pct||50;
      var lum=(parseInt(color.slice(1,3),16)*0.299+parseInt(color.slice(3,5),16)*0.587+parseInt(color.slice(5,7),16)*0.114)/255;
      var tc=lum>0.55?"#3a2f1c":"#ffffff";
      return "<div class='ac-row2'><div class='ac-bar2' onclick='event.stopPropagation();this.classList.toggle(\"ac-abierto\")' style='width:"+pct+"%;background:"+color+";color:"+tc+"'><span class='ac-n2'>"+a.nombre+"</span><span class='ac-p2'>"+pct+"%</span></div></div>";
    }).join("");
  }catch(e){ return ""; }
}
function _lazyProdDe(id){ var m=String(id||'').match(/^n_(\d+)/); var pid=m?parseInt(m[1]):NaN; return isNaN(pid)?null:(allProds||[]).find(function(x){ return x.id===pid; }); }
function togAcordes(id,btn){
  var el=document.getElementById(id);
  if(!el)return;
  if(el.getAttribute('data-lazy')==='1'){ el.removeAttribute('data-lazy'); var _pp=_lazyProdDe(id); el.innerHTML=_pp?_acordesRowsHTML(_pp):""; }
  var isOpen=el.style.display!=="none";
  el.style.display=isOpen?"none":"block";
  if(btn)btn.textContent=isOpen?"+ Acordes principales":"- Acordes principales";
  // Animate bars
  if(!isOpen){
    setTimeout(function(){
      el.querySelectorAll(".ac-bar").forEach(function(b){
        var w=b.style.width;b.style.width="0";
        setTimeout(function(){b.style.width=w;},50);
      });
    },20);
  }
}

var ACORDES_CAT={'Acuatico':'#3A9CC4','Afrutados':'#E8703A','Afrutados rojos':'#D4354A','Ahumado':'#6B6B6B','Almendrado':'#C4945A','Almizclado':'#B09A8A','Amaderado':'#8B5E3C','Animalico':'#7A5230','Anisado':'#8AC44A','Aromatico':'#6AB87A','Atalcado':'#D4B0C4','Avainillado':'#D4A830','Balsamico':'#8B7040','Cacao':'#6B3A2A','Cafe':'#5C3420','Canela':'#C46830','Caramelo':'#D48C30','Chipre':'#7A9E5C','Cuero':'#8B5C3A','Calido especiado':'#C45A1A','Citrico':'#E8C430','Dulce':'#E87AAA','Especiado':'#C44A1A','Especiado suave':'#D47A4A','Floral':'#E87AA0','Fresco':'#4AAEE0','Fresco especiado':'#5ABAC8','Gourmand':'#C47830','Herbal':'#5A9E4A','Iris':'#9A7AC4','Lavanda':'#8A70C4','Lirio':'#C4A0D4','Musgo':'#7A9E6A','Musgo de roble':'#5A7A4A','Oriental':'#C46A2A','Oud':'#6B3A1A','Pachuli':'#7A5A3A','Pina':'#D4C430','Pralinado':'#C48040','Resinoso':'#9A6A3A','Rosa':'#E890A8','Sandalo':'#C4A07A','Tabaco':'#8B6040','Terrosos':'#8B7050','Tropical':'#5AC470','Verde':'#5A9E3C','Ambar':'#D4A020','Ambar gris':'#B0A080'};
var ACORDES_LABELS={'Acuatico':'Acuatico','Afrutados':'Afrutados','Afrutados rojos':'Afrutados rojos','Ahumado':'Ahumado','Almendrado':'Almendrado','Almizclado':'Almizclado','Amaderado':'Amaderado','Animalico':'Animálico','Anisado':'Anisado','Aromatico':'Aromático','Atalcado':'Atalcado','Avainillado':'Avainillado','Balsamico':'Balsámico','Cacao':'Cacao','Cafe':'Café','Canela':'Canela','Caramelo':'Caramelo','Chipre':'Chipre','Cuero':'Cuero','Calido especiado':'Cálido especiado','Citrico':'Cítrico','Dulce':'Dulce','Especiado':'Especiado','Especiado suave':'Especiado suave','Floral':'Floral','Fresco':'Fresco','Fresco especiado':'Fresco especiado','Gourmand':'Gourmand','Herbal':'Herbal','Iris':'Iris','Lavanda':'Lavanda','Lirio':'Lirio','Musgo':'Musgo','Musgo de roble':'Musgo de roble','Oriental':'Oriental','Oud':'Oud','Pachuli':'Pachulí','Pina':'Piña','Pralinado':'Pralinado','Resinoso':'Resinoso','Rosa':'Rosa','Sandalo':'Sándalo','Tabaco':'Tabaco','Terrosos':'Terrosos','Tropical':'Tropical','Verde':'Verde','Ambar':'Ámbar','Ambar gris':'Ámbar gris'};

function _lumText(hex){var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(r*299+g*587+b*114)/1000>140?'#111':'#fff';}

// Toggle del panel de filtros en mobile (botón "🔧 Filtros")
function toggleFiltrosMobile(){
  var c = document.getElementById('filtrosColapsables');
  if(!c) return;
  c.classList.toggle('expandido');
  // Actualizar visual del botón si está abierto
  var btn = document.getElementById('btnFiltrosMobile');
  if(btn){
    var abierto = c.classList.contains('expandido');
    btn.style.background = abierto ? '#fdf5ea' : 'transparent';
    btn.innerHTML = abierto
      ? '🔧 Ocultar filtros<span id="filtrosBadge" style="display:none"></span>'
      : '🔧 Filtros<span id="filtrosBadge" style="display:none;background:var(--accent);color:#fff;border-radius:10px;padding:.05rem .35rem;font-size:.62rem;font-weight:700;min-width:16px;text-align:center"></span>';
  }
}

function toggleAcordesPanel(){
  var p=document.getElementById('acordesPanel');if(!p)return;
  var open=p.style.display!=='none';
  p.style.display=open?'none':'block';
  var btn=document.getElementById('btnAcordesPanel');
  if(btn){btn.style.background=open?'transparent':'#fdf5ea';}
  if(!open){
    renderAcordesPanel('');
    if(window._acordesListos===false && window._acordesPromesa){ window._acordesPromesa.then(function(){ try{ renderAcordesPanel((document.getElementById('acordesPanelSearch')||{value:''}).value||''); }catch(e){} }); }
    setTimeout(function(){
      // Only focus search on desktop (mobile would open keyboard)
      if(window.innerWidth>600){
        var i=document.getElementById('acordesPanelSearch');if(i)i.focus();
      }
    },150);
  }
}

function renderAcordesPanel(q){
  var grid=document.getElementById('acordesPanelGrid');if(!grid)return;
  var ql=(q||'').toLowerCase().trim();
  var keys=Object.keys(ACORDES_CAT).sort(function(a,b){return ACORDES_LABELS[a].localeCompare(ACORDES_LABELS[b]);});
  if(ql)keys=keys.filter(function(k){return ACORDES_LABELS[k].toLowerCase().indexOf(ql)>=0;});
  _acordesPanelKeys=keys;
  grid.innerHTML=keys.map(function(k,i){
    var c=ACORDES_CAT[k];var sel=_acordesFiltro.indexOf(k)>=0;var tc=_lumText(c);
    var tc2=sel?tc:'#444';var st='border:1.5px solid '+c+'88;border-radius:12px;padding:.2rem .55rem;font-size:.68rem;cursor:pointer;font-weight:'+(sel?'600':'400')+';background:'+(sel?c:'#fff')+';color:'+(sel?tc:tc2)+';transition:all .12s;letter-spacing:.01em'+(sel?';box-shadow:0 2px 8px '+c+'44':'');
    return '<button data-ai="'+i+'" onclick="acordePanelClick(this)" style="'+st+'">'+ACORDES_LABELS[k]+'</button>';
  }).join('');
}
function acordePanelClick(btn){var k=_acordesPanelKeys[parseInt(btn.getAttribute('data-ai'))];if(k)toggleAcorde(k);}

function toggleAcorde(k){
  var idx=_acordesFiltro.indexOf(k);
  if(idx>=0)_acordesFiltro.splice(idx,1);else _acordesFiltro.push(k);
  renderAcordesPanel((document.getElementById('acordesPanelSearch')||{value:''}).value);
  _renderAcordesTags();
  applyFilters();
}
function _renderAcordesTags(){
  var sec=document.getElementById('acordesSeleccionados');
  var tags=document.getElementById('acordesTagsSeleccionados');
  var badge=document.getElementById('acordesBadge');
  var btnL=document.getElementById('btnLimpiarAcordes');
  var n=_acordesFiltro.length;
  if(sec)sec.style.display=n?'block':'none';
  if(btnL)btnL.style.display=n?'block':'none';
  if(badge){badge.style.display=n?'inline':'none';badge.textContent=n;}
  _acordesTagKeys=_acordesFiltro.slice();
  if(tags)tags.innerHTML=_acordesFiltro.map(function(k,i){
    var c=ACORDES_CAT[k]||'#888';var tc=_lumText(c);
    return '<span data-ti="'+i+'" onclick="acordeTagClick(this)" style="cursor:pointer;background:'+c+';color:'+tc+';border-radius:10px;padding:.18rem .5rem;font-size:.67rem;font-weight:600;display:inline-flex;align-items:center;gap:.25rem">'+ACORDES_LABELS[k]+' <span style="opacity:.7">&#10005;</span></span>';
  }).join('');
}
function acordeTagClick(el){var k=_acordesTagKeys[parseInt(el.getAttribute('data-ti'))];if(k)toggleAcorde(k);}
function limpiarAcordes(){_acordesFiltro=[];_notasFiltro=[];var q=(document.getElementById('acordesPanelSearch')||{value:''}).value;renderAcordesPanel(q);_renderAcordesTags();_renderNotasTags();var inp=document.getElementById('notasSearchInput');if(inp)inp.value='';var box=document.getElementById('notasSugerencias');if(box)box.style.display='none';applyFilters();}

var NOTAS_LISTA=["Bergamota","Limon","Naranja","Pomelo","Mandarina","Lima","Rosa","Jazmin","Iris","Ylang ylang","Azahar","Magnolia","Fresia","Peonia","Lirio","Violeta","Gardenia","Sandalo","Cedro","Oud","Pachuli","Vetiver","Almizcle","Ambar","Benjui","Incienso","Mirra","Vainilla","Caramelo","Chocolate","Pralinado","Miel","Almendra","Coco","Canela","Pimienta negra","Cardamomo","Nuez moscada","Jengibre","Clavo","Azafran","Musgo de roble","Heno","Tabaco","Cuero","Resina","Manzana","Pera","Durazno","Ciruela","Frambuesa","Frutilla","Cereza","Mora","Melon","Acuatico","Marino","Sal marina","Lavanda","Romero","Tomillo","Menta","Albahaca","Salvia","Bambú","Almizcle blanco","Neroli","Petitgrain","Geranio","Heliotropo","Tonka","Pina","Mango","Papaya","Maracuya","Lychee","Te verde","Te negro","Citrico","Amaderado","Floral","Oriental","Especiado","Fresco"];
var NOTAS_TOP3=["Rosa","Oud","Vainilla"];


function notasAutoComplete(q){
  q=(q||'').trim();
  var ql=q.toLowerCase();
  var excl=_notasFiltro.map(function(n){return n.toLowerCase();});
  var matches=q.length===0
    ? NOTAS_TOP3.filter(function(n){return excl.indexOf(n.toLowerCase())<0;})
    : NOTAS_LISTA.filter(function(n){return n.toLowerCase().indexOf(ql)>=0&&excl.indexOf(n.toLowerCase())<0;}).slice(0,8);
  _showNotasSugerencias(matches, q.length===0);
}

function _showNotasSugerencias(items,isTop){
  var box=document.getElementById('notasSugerencias');
  if(!box)return;
  if(!items||!items.length){box.style.display='none';return;}
  box._items=items.slice();
  box.style.display='block';
  box.innerHTML=(isTop?'<div style="font-size:.62rem;color:#bbb;padding:.35rem .65rem .1rem;font-style:italic">Más buscadas</div>':'')+
    items.map(function(n,i){
      return '<div data-ni="'+i+'" onclick="notasSugClick(this)" style="padding:.4rem .7rem;cursor:pointer;font-size:.74rem;color:#1a1a1a;border-bottom:1px solid #f5f0ea;display:flex;align-items:center;gap:.35rem">'+
        '<span style="color:#c4965a;font-size:.68rem">&#127800;</span>'+n+'</div>';
    }).join('');
}

function notasSugClick(el){
  var box=document.getElementById('notasSugerencias');
  if(!box||!box._items)return;
  var n=box._items[parseInt(el.getAttribute('data-ni'))];
  if(n)agregarNota(n);
}

function agregarNota(nota){
  if(_notasFiltro.indexOf(nota)>=0)return;
  _notasFiltro.push(nota);
  var inp=document.getElementById('notasSearchInput');
  var box=document.getElementById('notasSugerencias');
  if(inp)inp.value='';
  if(box)box.style.display='none';
  _renderNotasTags();
  applyFilters();
}

function quitarNota(i){
  _notasFiltro.splice(i,1);
  _renderNotasTags();
  applyFilters();
}

function _renderNotasTags(){
  var wrap=document.getElementById('notasTagsWrap');
  if(!wrap)return;
  wrap.innerHTML=_notasFiltro.map(function(n,i){
    return '<span data-nti="'+i+'" onclick="notasTagClick(this)" style="display:inline-flex;align-items:center;gap:.22rem;background:#fdf5ea;border:1px solid #e8c97a;color:#8a6a2a;border-radius:10px;padding:.16rem .5rem;font-size:.68rem;font-weight:500;cursor:pointer">'+
      n+' <span style="opacity:.55;font-size:.6rem">&#10005;</span></span>';
  }).join('');
  wrap._keys=_notasFiltro.slice();
  var btnL=document.getElementById('btnLimpiarAcordes');
  if(btnL)btnL.style.display=(_acordesFiltro.length+_notasFiltro.length)?'block':'none';
}

function notasTagClick(el){
  var wrap=document.getElementById('notasTagsWrap');
  if(!wrap||!wrap._keys)return;
  quitarNota(parseInt(el.getAttribute('data-nti')));
}

// Hide sugerencias on outside click
document.addEventListener('click',function(e){
  var box=document.getElementById('notasSugerencias');
  var inp=document.getElementById('notasSearchInput');
  if(box&&inp&&!box.contains(e.target)&&e.target!==inp)box.style.display='none';
});

function notasShowTop(){
  _showNotasSugerencias(NOTAS_TOP3.filter(function(n){return _notasFiltro.indexOf(n)<0;}),true);
}

function consultarDisp(btn){
  var id=parseInt(btn.getAttribute('data-dispid'));
  var p=allProds.find(function(x){return x.id===id;});
  if(!p)return;
  var msg="Hola! Consulto disponibilidad de:\n"+_prodMl(p.nombre, p.ml)+"\n\nDistribuidora Belle";
  window.open("https://wa.me/"+(waNumber||WA_NUMBER)+"?text="+encodeURIComponent(msg),"_blank");
}



function abrirAvisoStock(prodId){
  var p=(allProds||[]).find(function(x){return x.id===prodId;});
  if(!p)return;
  // No logueado -> mandar a iniciar sesion / registrarse
  if(!_catCliente || !_catCliente.id){ _avisoStockModal(p,"login"); return; }
  var tel=(_catCliente.telefono_principal!=null)?String(_catCliente.telefono_principal).trim():"";
  // Logueado sin telefono -> registrar sus datos
  if(!tel){ _avisoStockModal(p,"sintel"); return; }
  // Logueado con telefono -> elegir cantidad y registrar
  _avisoStockModalPedir(p,tel);
}

function _avisoEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

// Marca como "ya avisado" los botones Avisame de un producto
function _avisoStockMarcarBtn(prodId){
  try{
    document.querySelectorAll(".avisame-btn").forEach(function(b){
      if((b.getAttribute('onclick')||'').indexOf("abrirAvisoStock("+prodId+")")>=0){
        b.classList.add('ok'); b.innerHTML="&#10003; Te avisamos"; b.onclick=null;
      }
    });
  }catch(e){}
}

// Registra el aviso (cliente logueado con telefono) y muestra confirmacion
function _avisoStockRegistrar(p, tel, cantidad){
  var c=parseInt(cantidad,10); if(!c||c<1)c=1;
  var payload={producto_id:p.id, producto_nombre:p.nombre, whatsapp:tel, cliente_id:_catCliente.id, cantidad:c};
  apiPostMin("avisos_stock", payload).then(function(){
    _avisoStockMarcarBtn(p.id);
    _avisoStockModal(p,"ok",tel,c);
  }).catch(function(e){
    console.error("[aviso-stock]",e);
    if(typeof _catToast==='function')_catToast("No se pudo guardar, proba de nuevo","twarn");
  });
}

// Modal con selector de cantidad (cliente logueado con telefono)
function _avisoStockModalPedir(p, tel){
  var old=document.getElementById('moAvisoStock'); if(old)old.remove();
  var t=String(tel||"").replace(/\D/g,"");
  var masked=t.length>=4?("&#8226;&#8226;&#8226;&#8226; "+t.slice(-4)):t;
  var mo=document.createElement('div');
  mo.id='moAvisoStock';
  mo.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:1rem';
  mo.onclick=function(e){if(e.target===mo)_avisoStockCerrar();};
  mo.innerHTML=
    "<div style='background:#fdfbf7;border-radius:18px;max-width:360px;width:92%;overflow:hidden;box-shadow:0 12px 48px rgba(184,158,110,.25)'>"+
      "<div style='padding:1.4rem 1.3rem .6rem;text-align:center'>"+
        "<div style='font-size:2.7rem;margin-bottom:.2rem'>&#128276;</div>"+
        "<div style='font-size:1.04rem;font-weight:700;color:#5a4a30'>Avisame cuando vuelva</div>"+
        "<div style='font-size:.74rem;color:#9a8870;margin-top:.25rem;font-style:italic'>"+_avisoEsc(_prodMl(p.nombre,p.ml))+"</div>"+
      "</div>"+
      "<div style='padding:0 1.3rem 1.3rem'>"+
        "<div style='font-size:.78rem;color:#7a6a50;text-align:center;margin-bottom:.65rem'>\u00bfCu\u00e1ntas unidades quer\u00e9s?</div>"+
        "<div style='display:flex;align-items:center;justify-content:center;gap:.8rem;margin-bottom:.9rem'>"+
          "<button type='button' onclick='_avisoQty(-1)' style='width:40px;height:40px;border-radius:50%;border:1px solid #d4ba8a;background:#fff;color:#a9763f;font-size:1.4rem;font-weight:700;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center'>&minus;</button>"+
          "<input id='_avisoCant' type='number' min='1' value='1' inputmode='numeric' style='width:64px;text-align:center;padding:.55rem;border:1px solid #d4ba8a;border-radius:10px;font-size:1.15rem;font-weight:700;color:#5a4a30;font-family:inherit;box-sizing:border-box'>"+
          "<button type='button' onclick='_avisoQty(1)' style='width:40px;height:40px;border-radius:50%;border:1px solid #d4ba8a;background:#fff;color:#a9763f;font-size:1.4rem;font-weight:700;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center'>+</button>"+
        "</div>"+
        "<div style='font-size:.7rem;color:#9a8870;text-align:center;margin-bottom:.9rem'>Te avisamos a tu WhatsApp "+masked+"</div>"+
        "<button id='_avisoConfirm' type='button' style='width:100%;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:10px;padding:.8rem;font-size:.85rem;font-weight:700;font-family:inherit;cursor:pointer'>Avisame &#128276;</button>"+
        "<button type='button' onclick='_avisoStockCerrar()' style='width:100%;background:transparent;border:none;color:#9a8870;font-size:.72rem;margin-top:.55rem;cursor:pointer;font-family:inherit'>Cancelar</button>"+
      "</div>"+
    "</div>";
  document.body.appendChild(mo);
  if(typeof _catModalBackRegistrar==='function')_catModalBackRegistrar('moAvisoStock',_avisoStockCerrar);
  var cf=document.getElementById('_avisoConfirm');
  if(cf)cf.onclick=function(){
    var c=parseInt((document.getElementById('_avisoCant')||{}).value,10); if(!c||c<1)c=1;
    this.disabled=true; this.textContent='Guardando...';
    _avisoStockRegistrar(p, tel, c);
  };
}
function _avisoQty(d){
  var i=document.getElementById('_avisoCant'); if(!i)return;
  var v=parseInt(i.value,10)||1; v+=d; if(v<1)v=1; if(v>999)v=999; i.value=v;
}

// Modal de aviso de stock -- modo: "login" | "sintel" | "ok"
function _avisoStockModal(p, modo, tel, cant){
  var old=document.getElementById('moAvisoStock'); if(old)old.remove();
  var icono, titulo, texto, btnTxt, btnAccion;
  if(modo==="ok"){
    var t=String(tel||"").replace(/\D/g,"");
    var masked=t.length>=4?("&#8226;&#8226;&#8226;&#8226; "+t.slice(-4)):t;
    icono="<div style='position:relative;display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:#e8f6ee'>"+
            "<span style='font-size:2.1rem;color:#3fae74;line-height:1'>&#10003;</span>"+
            "<span style='position:absolute;bottom:-3px;right:-3px;font-size:1.1rem'>&#9200;</span>"+
          "</div>";
    titulo="\u00a1Listo! Te vamos a avisar";
    var cantTxt=(cant&&cant>1)?(" Te reservamos el aviso por <b>"+cant+"</b> unidades."):"";
    texto="Cuando <b>"+_avisoEsc(_prodMl(p.nombre,p.ml))+"</b> vuelva a tener stock, te avisamos a tu WhatsApp registrado <b>"+masked+"</b>."+cantTxt;
    btnTxt="Perfecto"; btnAccion="_avisoStockCerrar()";
  } else if(modo==="sintel"){
    icono="<div style='font-size:2.7rem'>&#128241;</div>";
    titulo="Falta registrar tu tel\u00e9fono";
    texto="Para avisarte cuando <b>"+_avisoEsc(_prodMl(p.nombre,p.ml))+"</b> vuelva, necesitamos tu tel\u00e9fono. Cargalo en tus datos y te avisamos.";
    btnTxt="Registrar mis datos"; btnAccion="_avisoStockIrPerfil()";
  } else {
    icono="<div style='font-size:2.7rem'>&#128276;</div>";
    titulo="Avisame cuando vuelva";
    texto="Inici\u00e1 sesi\u00f3n o registrate y te avisamos a tu WhatsApp apenas <b>"+_avisoEsc(_prodMl(p.nombre,p.ml))+"</b> vuelva a tener stock.";
    btnTxt="Iniciar sesi\u00f3n / Registrarme"; btnAccion="_avisoStockIrLogin()";
  }
  var mo=document.createElement('div');
  mo.id='moAvisoStock';
  mo.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:1rem';
  mo.onclick=function(e){if(e.target===mo)_avisoStockCerrar();};
  mo.innerHTML=
    "<div style='background:#fdfbf7;border-radius:18px;max-width:360px;width:92%;overflow:hidden;box-shadow:0 12px 48px rgba(184,158,110,.25)'>"+
      "<div style='padding:1.4rem 1.3rem .8rem;text-align:center'>"+
        "<div style='margin-bottom:.55rem'>"+icono+"</div>"+
        "<div style='font-size:1.04rem;font-weight:700;color:#5a4a30'>"+titulo+"</div>"+
        "<div style='font-size:.78rem;color:#7a6a50;margin-top:.5rem;line-height:1.5'>"+texto+"</div>"+
      "</div>"+
      "<div style='padding:0 1.3rem 1.3rem'>"+
        "<button onclick='"+btnAccion+"' style='width:100%;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:10px;padding:.8rem;font-size:.85rem;font-weight:700;font-family:inherit;cursor:pointer'>"+btnTxt+"</button>"+
        (modo==="ok"?"":"<button onclick='_avisoStockCerrar()' style='width:100%;background:transparent;border:none;color:#9a8870;font-size:.72rem;margin-top:.55rem;cursor:pointer;font-family:inherit'>Cancelar</button>")+
      "</div>"+
    "</div>";
  document.body.appendChild(mo);
  if(typeof _catModalBackRegistrar==='function')_catModalBackRegistrar('moAvisoStock',_avisoStockCerrar);
}

// Ir a iniciar sesion / registrarse (cliente no logueado)
function _avisoStockIrLogin(){
  _avisoStockCerrar();
  try{ _catDrawerView="login"; }catch(e){}
  var dw=document.getElementById("drawerCuenta");
  if(dw && !dw.classList.contains("open"))toggleMiCuenta();
  else if(typeof catRenderDrawer==='function')catRenderDrawer();
}

// Ir al tab Perfil para registrar los datos personales (cliente sin telefono)
function _avisoStockIrPerfil(){
  _avisoStockCerrar();
  try{ window._catForzarTab="perfil"; _catPanelTab="perfil"; }catch(e){}
  var dw=document.getElementById("drawerCuenta");
  if(dw && !dw.classList.contains("open"))toggleMiCuenta();
  else if(typeof catRenderDrawer==='function')catRenderDrawer();
}

function _avisoStockCerrar(){ var m=document.getElementById('moAvisoStock'); if(m)m.remove(); if(typeof _catModalBackDesregistrar==='function')_catModalBackDesregistrar('moAvisoStock'); }

function compartirProducto(prodId){
  var p=(allProds||[]).find(function(x){return x.id===prodId;});
  if(!p)return;
  var base=location.href.split('/').slice(0,-1).join('/')+'/';
  var link=base+'card.html?id='+prodId;

  // Remove existing modal if any
  var old=document.getElementById('moCompartirCat');
  if(old) old.remove();

  var mo=document.createElement('div');
  mo.id='moCompartirCat';
  mo.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45)';
  mo.onclick=function(e){if(e.target===mo)_moCompartirCatCerrar();};

  mo.innerHTML=
    "<div style='background:#fdfbf7;border-radius:18px;max-width:360px;width:92%;overflow:hidden;box-shadow:0 12px 48px rgba(184,158,110,.25),0 0 0 1px rgba(184,158,110,.12)'>"+
      "<div style='padding:1.1rem 1.2rem .8rem;border-bottom:1px solid rgba(184,158,110,.15);display:flex;align-items:center;justify-content:space-between'>"+
        "<span style='font-size:.95rem;font-weight:600;color:#5a4a30;letter-spacing:.01em'>Compartir producto</span>"+
        "<button onclick='_moCompartirCatCerrar()' style='background:transparent;border:none;font-size:1.2rem;cursor:pointer;color:#b89e6e;line-height:1;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%' onmouseover='this.style.background=\"rgba(184,158,110,.12)\"' onmouseout='this.style.background=\"transparent\"'>&times;</button>"+
      "</div>"+
      "<div style='padding:.8rem 1.2rem .9rem;font-size:.72rem;color:#9a8870;font-style:italic'>"+_prodMl(p.nombre, p.ml)+"</div>"+
      "<div style='padding:0 1.2rem 1.2rem;display:flex;flex-direction:column;gap:.55rem'>"+
        // Botón 0: WhatsApp (mensaje armado con nombre + precio + dupe + link)
        "<button id='_btnCpWsp' style='display:flex;align-items:center;gap:.7rem;background:#25D366;color:#fff;border:none;border-radius:12px;padding:.9rem 1rem;cursor:pointer;font-size:.78rem;font-weight:600;text-align:left;width:100%;box-shadow:0 4px 14px rgba(37,211,102,.3);transition:all .2s' onmouseover='this.style.transform=\"translateY(-1px)\"' onmouseout='this.style.transform=\"translateY(0)\"'>"+
          "<span style='font-size:1.3rem'>&#128241;</span>"+
          "<div><div style='font-weight:700;color:#fff;font-size:.85rem'>Enviar por WhatsApp</div><div style='font-size:.66rem;color:rgba(255,255,255,.9);margin-top:.15rem'>Manda nombre, precio y link listo</div></div>"+
        "</button>"+
        // Botón 1: Link
        "<button id='_btnCpLink' style='display:flex;align-items:center;gap:.7rem;background:#fff;color:#3a2f1f;border:1px solid rgba(184,158,110,.25);border-radius:12px;padding:.85rem 1rem;cursor:pointer;font-size:.78rem;font-weight:500;text-align:left;width:100%;transition:all .2s' onmouseover='this.style.borderColor=\"rgba(184,158,110,.5)\";this.style.background=\"#faf6ed\"' onmouseout='this.style.borderColor=\"rgba(184,158,110,.25)\";this.style.background=\"#fff\"'>"+
          "<span style='font-size:1.2rem;color:#b89e6e'>&#128279;</span>"+
          "<div><div style='font-weight:600;color:#3a2f1f;font-size:.82rem'>Link de la tarjeta</div><div style='font-size:.66rem;color:#9a8870;margin-top:.15rem'>Copia el link directo al producto</div></div>"+
        "</button>"+
        // Botón 2: Imagen
        "<button id='_btnGenImg' style='display:flex;align-items:center;gap:.7rem;background:#fff;color:#3a2f1f;border:1px solid rgba(184,158,110,.25);border-radius:12px;padding:.85rem 1rem;cursor:pointer;font-size:.78rem;font-weight:500;text-align:left;width:100%;transition:all .2s' onmouseover='this.style.borderColor=\"rgba(184,158,110,.5)\";this.style.background=\"#faf6ed\"' onmouseout='this.style.borderColor=\"rgba(184,158,110,.25)\";this.style.background=\"#fff\"'>"+
          "<span style='font-size:1.2rem;color:#b89e6e'>&#128247;</span>"+
          "<div><div style='font-weight:600;color:#3a2f1f;font-size:.82rem'>Imagen del producto</div><div style='font-size:.66rem;color:#9a8870;margin-top:.15rem'>Abre la tarjeta para descargar o compartir</div></div>"+
        "</button>"+

      "</div>"+
    "</div>";

  document.body.appendChild(mo);

  // FIX 2026-05-15: registrar para botón atrás del celular
  _catModalBackRegistrar('moCompartirCat', _moCompartirCatCerrar);

  var _btnWsp=document.getElementById('_btnCpWsp');
  if(_btnWsp) _btnWsp.onclick=function(){
    var precioTxt=""; try{var r=calcP(p); if(r){ function _f(v){return "$"+Math.round(v||0).toLocaleString('es-AR');}
      if(p.precio_pestana>0){ precioTxt=_f(p.precio_pestana); }
      else { var ps=[]; if(r.pi>0)ps.push("lista "+_f(r.pi)); if(r.pe>0)ps.push("x3 "+_f(r.pe)); if(r.pm>0)ps.push("x10 "+_f(r.pm)); precioTxt=ps.join(" · "); }
    }}catch(e){}
    var dupe=""; try{ if(Array.isArray(window._fichasSB)){ var fc=window._fichasSB.find(function(f){return f&&f.producto_id===prodId&&f.inspirado_en_nombre&&String(f.inspirado_en_nombre).trim();}); if(fc) dupe=String(fc.inspirado_en_nombre).trim(); } }catch(e){}
    var msg="\u2728 "+_prodMl(p.nombre, p.ml)+"\n"+(dupe?("Inspirado en "+dupe+"\n"):"")+(precioTxt?(precioTxt+"\n"):"")+"\nMir\u00e1 la ficha: "+link+"\n\nDistribuidora Belle \uD83C\uDF38";
    window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank");
    setTimeout(_moCompartirCatCerrar,400);
  };
  document.getElementById('_btnCpLink').onclick=function(){
    navigator.clipboard.writeText(link).then(function(){
      var btn=document.getElementById('_btnCpLink');
      if(btn){btn.style.borderColor='#4caf82';btn.children[1].children[0].textContent='Link copiado!';}
      setTimeout(_moCompartirCatCerrar,1200);
    }).catch(function(){
      // Sin acceso al portapapeles: se muestra el link en un campo para copiarlo a mano.
      _catPreguntar({titulo:'Copiá este link', texto:'No pudimos copiarlo solo. Seleccionalo y copialo a mano:', ok:'Listo', cancelar:'Cerrar', campo:{label:'Link', valor:link, tipo:'text'}});
    });
  };

  document.getElementById('_btnGenImg').onclick=function(){
    window.open(link,'_blank');
    setTimeout(_moCompartirCatCerrar,400);
  };

}

// FIX 2026-05-15: cerrar modal compartir
function _moCompartirCatCerrar(){
  var m=document.getElementById('moCompartirCat');
  if(m) m.remove();
  _catModalBackDesregistrar('moCompartirCat');
}

function initSearchClears(){
  [
    // srch: lo maneja belleClearXScript (X limpia circular). No agregar aca para evitar X doble.
    {id:'acordesPanelSearch',fn:function(){renderAcordesPanel()}}
  ].forEach(function(s){
    var inp=document.getElementById(s.id);
    if(!inp||document.getElementById('x-'+s.id))return;
    var btn=document.createElement('button');
    btn.id='x-'+s.id;
    btn.title='Limpiar';
    btn.innerHTML='&times;';
    btn.style.cssText='position:absolute;right:.3rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--tx3);font-size:1.1rem;padding:0;line-height:1;display:none;z-index:2';
    btn.onclick=function(e){e.stopPropagation();inp.value='';btn.style.display='none';s.fn();};
    inp.addEventListener('input',function(){btn.style.display=inp.value?'block':'none';});
    var par=inp.parentNode;
    if(getComputedStyle(par).position==='static')par.style.position='relative';
    inp.style.paddingRight='1.5rem';
    par.appendChild(btn);
  });
}
window.addEventListener('load',function(){setTimeout(initSearchClears,600);});



var pestanasCatalogo=[];

function _renderUnPanel(containerEl, panelKey, dests, bgImg, _ca, _cn, _cp, _cf, _t1, _t2, _t3, _alto){
  if(!containerEl)return;
  if(!dests.length && !_t1 && !_t2 && !_t3 && !bgImg)return;
  bgImg=bgImg||'';
  _ca=_ca||'#c4965a';_cn=_cn||'#1a1a1a';_cp=_cp||'#333';_cf=_cf||'#f9f1e0';
  _t1=_t1||'';_t2=_t2||'';_t3=_t3||'';
  _alto=_alto||760;

  var cards=dests.map(function(p){
    var nom=p.nombre||'';
    var br=getBrand(nom);
    var sn=br?nom.replace(br+' - ',''):nom;
    var snClean=sn.replace(/\s*\|[^|]*/g,'').replace(/\s*\d+\s*ml\s*/gi,' ').trim();
    var tags=parseProductTags(sn);
    var tagsHtml='';
    if(tags.tipo)tagsHtml+='<span class="dest-chip-tag dest-chip-tag-tipo" style="color:'+_ca+';border-color:'+_ca+'44;background:'+_ca+'14">'+tags.tipo+'</span>';
    if(p.ml)tagsHtml+='<span class="dest-chip-tag dest-chip-tag-ml">'+p.ml+' ML</span>';else if(tags.ml)tagsHtml+='<span class="dest-chip-tag dest-chip-tag-ml">'+tags.ml+'</span>';
    // FIX: usar calcP() para obtener precios calculados (igual que el catálogo principal)
    // Antes se usaba directamente p.precio_may_ars etc., valores guardados que podían estar desactualizados
    var r=(typeof calcP==='function')?calcP(p):{pm:p.precio_may_ars||0,pe:p.precio_med_ars||0,pi:p.precio_min_ars||0};
    var pm=r.pm||0,pe=r.pe||0,pi=r.pi||0;
    // Si el cliente tiene CC habilitada o precio_mayorista, mostrar el panel con estilo VIP
    // 🎯 FEAT 2026-05-22: precio_mayorista activa la misma vista VIP que CC.
    var _isCC = !!(typeof _catCliente!=="undefined" && _catCliente && (_catCliente.cuenta_corriente_habilitada || _catCliente.precio_mayorista) && pm);
    // ── Oferta vigente ──
    var _hasOf = !!(r.oferta && !r.oferta_descartada_por_cc);
    var _ofLabel = '';
    if(_hasOf){
      _ofLabel = r.oferta.etiqueta || '';
      if(!_ofLabel){
        if(r.oferta_tipo==='descuento_pct' && r.descuento_pct) _ofLabel = Math.round(r.descuento_pct)+'% OFF';
        else if(r.oferta_tipo==='precio_unico') _ofLabel = 'OFERTA';
        else if(r.oferta_tipo==='x10_sin_minimo') _ofLabel = 'PRECIO MAYOR';
        else if(r.oferta_tipo==='x3_sin_minimo') _ofLabel = 'PRECIO X3';
        else if(r.oferta_tipo==='multixmenos' && r.multi_lleva && r.multi_paga) _ofLabel = r.multi_lleva+'x'+r.multi_paga;
        else _ofLabel = 'OFERTA';
      }
    }
    var ph='<div class="dest-chip-prices">';
    if(_hasOf && r.oferta_tipo==='precio_unico'){
      // Precio único en oferta — un solo recuadro destacado
      var orig = r.pi_orig || r.pe_orig || r.pm_orig || 0;
      ph+='<div class="dest-chip-price" style="border:2px solid #c45a3a;background:rgba(196,90,58,.14);grid-column:1/-1"><span class="dest-chip-price-lbl" style="color:#c45a3a;font-weight:700;letter-spacing:.04em">🔥 '+_ofLabel+'</span><span class="dest-chip-price-val" style="color:#c45a3a;font-weight:700">$'+Math.round(r.precio_unico||pi).toLocaleString('es-AR')+(orig>r.precio_unico?' <small style="color:#999;text-decoration:line-through;font-weight:400">$'+Math.round(orig).toLocaleString('es-AR')+'</small>':'')+'</span></div>';
    } else if(_hasOf && (r.oferta_tipo==='x10_sin_minimo' || r.oferta_tipo==='x3_sin_minimo')){
      // x10/x3 sin mín: destaca el efectivo y tacha los demás
      var efPx = r.precio_efectivo || 'pm';
      ['pm','pe','pi'].forEach(function(s){
        var v = r[s]; if(!v) return;
        var lbl = s==='pm'?'x10':(s==='pe'?'x3':'Lista');
        if(s===efPx){
          ph+='<div class="dest-chip-price" style="border:2px solid #c45a3a;background:rgba(196,90,58,.14)"><span class="dest-chip-price-lbl" style="color:#c45a3a;font-weight:700">🔥 '+_ofLabel+'</span><span class="dest-chip-price-val" style="color:#c45a3a;font-weight:700">$'+Math.round(v).toLocaleString('es-AR')+'</span></div>';
        } else {
          ph+='<div class="dest-chip-price" style="border-color:'+_ca+'44;background:'+_ca+'08;opacity:.6"><span class="dest-chip-price-lbl" style="color:'+_ca+'">'+lbl+'</span><span class="dest-chip-price-val" style="color:#c97a82;text-decoration:line-through">$'+Math.round(v).toLocaleString('es-AR')+'</span></div>';
        }
      });
    } else if(_hasOf && r.oferta_tipo==='descuento_pct'){
      // Descuento %: cada precio con tachado del original
      ['pm','pe','pi'].forEach(function(s){
        var v = r[s]; if(!v) return;
        var orig = r[s+'_orig']||v;
        var lbl = s==='pm'?'x10':(s==='pe'?'x3':'Lista');
        ph+='<div class="dest-chip-price" style="border:1px solid #c45a3a44;background:rgba(196,90,58,.07)"><span class="dest-chip-price-lbl" style="color:#c45a3a">'+lbl+'</span><span class="dest-chip-price-val" style="color:#c45a3a;font-weight:700">$'+Math.round(v).toLocaleString('es-AR')+(orig>v?' <small style="color:#999;text-decoration:line-through;font-weight:400">$'+Math.round(orig).toLocaleString('es-AR')+'</small>':'')+'</span></div>';
      });
    } else if(_isCC){
      // Modo CC: x10 destacado como "PRECIO VIP" + x3/x1 tachados rojo delicado
      if(pm)ph+='<div class="dest-chip-price" style="border:2px solid '+_ca+';background:'+_ca+'2a"><span class="dest-chip-price-lbl" style="color:'+_ca+';font-weight:700;letter-spacing:.04em">PRECIO VIP</span><span class="dest-chip-price-val" style="color:'+_cp+';font-weight:700">$'+Math.round(pm).toLocaleString('es-AR')+'</span></div>';
      if(pe)ph+='<div class="dest-chip-price" style="border-color:'+_ca+'44;background:'+_ca+'08;opacity:.75"><span class="dest-chip-price-lbl" style="color:'+_ca+'">x3</span><span class="dest-chip-price-val" style="color:#c97a82;text-decoration:line-through;text-decoration-color:#c97a82;text-decoration-thickness:1px">$'+Math.round(pe).toLocaleString('es-AR')+'</span></div>';
      if(pi)ph+='<div class="dest-chip-price" style="border-color:'+_ca+'44;background:'+_ca+'08;opacity:.75"><span class="dest-chip-price-lbl" style="color:'+_ca+'">Lista</span><span class="dest-chip-price-val" style="color:#c97a82;text-decoration:line-through;text-decoration-color:#c97a82;text-decoration-thickness:1px">$'+Math.round(pi).toLocaleString('es-AR')+'</span></div>';
    } else {
      if(pm)ph+='<div class="dest-chip-price" style="border-color:'+_ca+'44;background:'+_ca+'12"><span class="dest-chip-price-lbl" style="color:'+_ca+'">x10</span><span class="dest-chip-price-val" style="color:'+_cp+'">$'+Math.round(pm).toLocaleString('es-AR')+'</span></div>';
      if(pe)ph+='<div class="dest-chip-price" style="border-color:'+_ca+'44;background:'+_ca+'0d"><span class="dest-chip-price-lbl" style="color:'+_ca+'">x3</span><span class="dest-chip-price-val" style="color:'+_cp+'">$'+Math.round(pe).toLocaleString('es-AR')+'</span></div>';
      if(pi)ph+='<div class="dest-chip-price" style="border-color:'+_ca+'44;background:'+_ca+'08"><span class="dest-chip-price-lbl" style="color:'+_ca+'">Lista</span><span class="dest-chip-price-val" style="color:'+_cp+'">$'+Math.round(pi).toLocaleString('es-AR')+'</span></div>';
    }
    ph+='</div>';
    var imgHtml=p.imagen_url?'<img src="'+p.imagen_url+'" alt="" loading="lazy" style="width:100%;height:100%;object-fit:contain;padding:8px;mix-blend-mode:multiply">':'<div style="font-size:2rem;opacity:.3">🌸</div>';
    return '<button class="dest-chip" onclick="scrollToProduct('+p.id+')">'
      +'<div class="dest-chip-img">'+imgHtml+'</div>'
      +'<div class="dest-chip-body">'
      +(br?'<div class="dest-chip-brand" style="color:'+_ca+'">'+br+'</div>':'')
      +'<div class="dest-chip-name" style="color:'+_cn+'">'+snClean+'</div>'
      +(tagsHtml?'<div class="dest-chip-tags">'+tagsHtml+'</div>':'')
      +ph+'</div></button>';
  }).join('');

  var textoOverlay='';
  if(_t1||_t2||_t3){
    textoOverlay='<div style="position:absolute;z-index:2;top:0;left:0;bottom:0;display:flex;flex-direction:column;justify-content:center;padding:1rem 1.5rem;pointer-events:none;max-width:45%">'
      +(_t1?'<div style="font-family:\'Playfair Display\',serif;font-size:clamp(.9rem,2.5vw,1.5rem);font-weight:700;color:'+_ca+';line-height:1.1;text-shadow:0 1px 4px rgba(0,0,0,.4)">'+_t1+'</div>':'')
      +(_t2?'<div style="font-size:clamp(.65rem,1.5vw,.9rem);color:#fff;margin-top:.3rem;text-shadow:0 1px 3px rgba(0,0,0,.5);font-weight:500">'+_t2+'</div>':'')
      +(_t3?'<div style="font-size:clamp(.5rem,1vw,.65rem);color:rgba(255,255,255,.8);margin-top:.2rem;text-shadow:0 1px 2px rgba(0,0,0,.3)">'+_t3+'</div>':'')
      +'</div>';
  }

  var altoStyle='';
  if(_alto && _alto!==760) altoStyle='aspect-ratio:unset;height:'+_alto+'px;';
  else if(!cards && (_t1||_t2||_t3)) altoStyle='aspect-ratio:unset;height:160px;';

  var wrapper=document.createElement('div');
  wrapper.style.marginBottom='1rem';

  var isMobile=window.innerWidth<=680;
  if(isMobile){
    var bgStyle=bgImg?'background-color:'+_cf+';':'background:'+_cf+';';
    // Si no hay productos, NO incluir el medidor (evita el spacer que fuerza scroll)
    var imgMedidor=(bgImg&&cards)?'<img src="'+bgImg+'" id="dest-medidor-'+panelKey+'" style="position:absolute;height:100%;width:auto;opacity:0;pointer-events:none;top:0;left:0" draggable="false">':'';
    // Si es solo banner (sin productos), forzar aspect-ratio rectangular tipo publicidad
    var modoBanner=(!cards&&bgImg);
    var altoBannerStyle=modoBanner?'aspect-ratio:16/9;height:auto;':altoStyle;
    wrapper.innerHTML='<div class="dest-wrap" style="position:relative;'+altoBannerStyle+'">'
      +textoOverlay
      +'<div class="dest-mobile-scroll'+(modoBanner?' dest-banner-only':'')+'" id="dest-mscroll-'+panelKey+'" style="'+bgStyle+(modoBanner?'overflow:hidden;':'')+'">'
      +imgMedidor
      +(cards?'<div class="dest-mobile-cards">'+cards+'</div>':'')
      +'</div></div>';
    containerEl.appendChild(wrapper);
    setTimeout(function(){
      var scroller=document.getElementById('dest-mscroll-'+panelKey);
      if(!scroller)return;
      // Aplicar imagen de fondo por JS — método más confiable
      if(bgImg){
        scroller.style.backgroundImage='url('+JSON.stringify(bgImg)+')';
        // FIX: si no hay productos, imagen ajustada a pantalla (cover) sin scroll
        // Si hay productos, imagen scrolleable (auto 100%)
        if(!cards){
          scroller.style.backgroundSize='cover';
          scroller.style.backgroundRepeat='no-repeat';
          scroller.style.backgroundPosition='center center';
          scroller.style.overflow='hidden'; // sin scroll cuando es solo banner
        } else {
          scroller.style.backgroundSize='auto 100%';
          scroller.style.backgroundRepeat='no-repeat';
          scroller.style.backgroundPosition='left center';
        }
      }
      // Si no hay productos, NO calcular medidor ni spacer ni scroll
      if(!cards) return;
      var medidor=document.getElementById('dest-medidor-'+panelKey);
      function ajustarAncho(){
        if(!medidor||!medidor.naturalWidth)return;
        var imgW=medidor.naturalWidth*(scroller.clientHeight/medidor.naturalHeight);
        var spacer=document.getElementById('dest-spacer-'+panelKey);
        if(!spacer){spacer=document.createElement('div');spacer.id='dest-spacer-'+panelKey;scroller.appendChild(spacer);}
        spacer.style.cssText='display:inline-block;width:'+Math.max(0,imgW-scroller.clientWidth)+'px;height:1px;flex-shrink:0;';
      }
      if(medidor){if(medidor.complete&&medidor.naturalWidth)ajustarAncho();else medidor.onload=ajustarAncho;}
      scroller.addEventListener('scroll',function(){
        var max=scroller.scrollWidth-scroller.clientWidth;
        if(max<=0)return;
        scroller.style.backgroundPosition=Math.round(scroller.scrollLeft/max*100)+'% center';
      },{passive:true});
    },50);
  } else {
    var fondobg=bgImg?'<img id="dest-bgimg-'+panelKey+'" src="'+bgImg+'" draggable="false">':'<div style="position:absolute;inset:0;background:'+_cf+'"></div>';
    wrapper.innerHTML='<div class="dest-wrap" style="position:relative;'+altoStyle+'">'
      +'<div class="dest-fondo">'+fondobg+'</div>'
      +textoOverlay
      +(cards?'<div class="dest-contenido"><div class="dest-track" id="dest-track-'+panelKey+'">'+cards+'</div></div>':'')
      +'</div>';
    containerEl.appendChild(wrapper);
    if(cards){
      setTimeout(function(){
        var track=document.getElementById('dest-track-'+panelKey);
        var bgim=document.getElementById('dest-bgimg-'+panelKey);
        if(!track||!bgim)return;
        track.addEventListener('scroll',function(){
          var max=track.scrollWidth-track.clientWidth;
          if(max<=0)return;
          bgim.style.objectPosition=Math.round(track.scrollLeft/max*100)+'% center';
        },{passive:true});
      },50);
    }
  }
}

function renderDestacados(tab){
  var container=document.getElementById('destacadosContainer');
  if(!container)return;
  // UNIFICADO: banners + secciones se dibujan juntos aca (ver lista combinada mas abajo).
  // FIX 2026-06-26: si el usuario esta buscando/filtrando, NO mostrar destacados (no tapar resultados).
  if(tab!=="inicio" && tab!=="notas" && tab!=="contacto" && typeof _hayBusquedaActiva==="function" && _hayBusquedaActiva()){
    container.style.display="none"; container.innerHTML=''; return;
  }
  container.innerHTML=''; // limpiar paneles anteriores
  // FIX 2026-06-18: en inicio/notas/contacto no hay destacados — ocultar el contenedor y salir.
  // Esto evita que la campaña/destacados aparezcan debajo de la home al cargar o al re-render.
  if(tab==="inicio"||tab==="notas"||tab==="contacto"){container.style.display="none";return;}
  container.style.display="";
  // ── Caché de paneles_destacados (TTL: 5 minutos) ──
  // Antes recargábamos cada vez que se renderizaba destacados (al cambiar pestaña, etc.)
  // Ahora solo recargamos si: (a) no tenemos datos, o (b) pasaron más de 5 min desde la última carga.
  // Para refrescar manualmente (ej. tras cambios desde admin) hay realtime subscribers que
  // llaman a renderDestacados() después de invalidar window._catPanelesTimestamp.
  var ahora = Date.now();
  var TTL = 5 * 60 * 1000; // 5 minutos
  var cacheValido = window._catPaneles && window._catPanelesTimestamp && (ahora - window._catPanelesTimestamp < TTL);
  if(!cacheValido && !window._catPanelesLoading){
    window._catPanelesLoading=true;
    apiGet('paneles_destacados','select=*&order=orden').then(function(pd){
      window._catPaneles=Array.isArray(pd)?pd:[];
      window._catPanelesTimestamp=Date.now();
      window._catPanelesLoading=false;
    }).catch(function(){window._catPanelesLoading=false;});
  }

  var paneles=window._catPaneles||[];

  // Asegurar cache de secciones de la pestana; si falta, cargar y re-render.
  var _ahoraS=Date.now(), _TTLS=5*60*1000;
  var _cacheSecsOk=(window._seccionesPestanaCache && window._seccionesPestanaTs && (_ahoraS-window._seccionesPestanaTs<_TTLS));
  if(!_cacheSecsOk && typeof _ensureSeccionesCache==='function'){
    _ensureSeccionesCache(function(){ renderDestacados(tab); });
  }
  var _secsTab=((window._seccionesPestanaCache&&window._seccionesPestanaCache[tab])||[]);

  // Banners del admin para esta pestana (activos)
  var panelesDePestana=paneles.filter(function(p){return p.slug_pestana===tab && p.activo!==false;});

  var mostroAlgo=false;
  var _esMobile = (window.innerWidth || document.documentElement.clientWidth || 9999) <= 480;
  var combos=(typeof combosPublicos!=='undefined'&&combosPublicos)?combosPublicos:[];
  window._homeTieneInstagram=false;

  // ── LISTA COMBINADA: banners + secciones intercalados por 'orden' compartido ──
  var items=[];
  panelesDePestana.forEach(function(panel){
    items.push({orden:(panel.orden||0), clase:0, sub:(panel.nombre||''), kind:'panel', panel:panel});
  });
  _secsTab.forEach(function(sec){
    items.push({orden:(sec.orden||0), clase:1, sub:(sec.titulo||''), kind:'seccion', sec:sec});
  });

  // Panel general (sistema original: destacado=true sin panel asignado)
  var destsGenerales=allProds.filter(function(p){
    if(!p.destacado||p.panel_destacado_id)return false;
    if(tab==='arabes')return(p.cat_catalogo==='arabes')||(!p.cat_catalogo&&!p.pestana_id);
    if(tab==='internacionales')return p.cat_catalogo==='internacionales';
    var t=pestanasCatalogo.find(function(x){return x.slug===tab;});
    if(!t)return false;
    var ex=[];try{ex=Array.isArray(p.pestanas_extra)?p.pestanas_extra:(p.pestanas_extra?JSON.parse(p.pestanas_extra):[]);}catch(e){}
    return p.pestana_id===t.id||ex.indexOf(t.id)>=0;
  });
  destsGenerales.sort(function(a,b){return(a.orden_destacado||99)-(b.orden_destacado||99);});
  var cfgGen=(function(){try{return JSON.parse(localStorage.getItem('belle_panel_general')||'{}');}catch(e){return {};}}());
  if(destsGenerales.length){
    items.push({orden:(cfgGen.orden!=null?cfgGen.orden:999), clase:0, sub:'', kind:'general'});
  }

  // Ordenar por orden compartido; empate: banners/general antes que secciones; luego nombre
  items.sort(function(a,b){
    if((a.orden||0)!==(b.orden||0)) return (a.orden||0)-(b.orden||0);
    if(a.clase!==b.clase) return a.clase-b.clase;
    return (''+a.sub).localeCompare(''+b.sub);
  });

  // Render en ese orden, todo dentro de destacadosContainer
  items.forEach(function(it){
    if(it.kind==='panel'){
      var panel=it.panel;
      var dests=allProds.filter(function(p){
        return p.panel_destacado_id===panel.id||String(p.panel_destacado_id)===String(panel.id)||(Array.isArray(p.paneles_extra)&&p.paneles_extra.some(function(x){return x===panel.id||String(x)===String(panel.id);}));
      }).sort(function(a,b){return(a.orden_en_panel||0)-(b.orden_en_panel||0);});
      var _t1=panel.texto1||'',_t2=panel.texto2||'',_t3=panel.texto3||'';
      var _bgImg = (_esMobile && panel.imagen_url_mobile) ? panel.imagen_url_mobile : (panel.imagen_url||'');
      if(!dests.length&&!_t1&&!_t2&&!_t3&&!_bgImg)return;
      _renderUnPanel(container,'p'+panel.id,dests,_bgImg,
        panel.color_accent||'#c4965a',panel.color_nombre||'#1a1a1a',
        panel.color_precio||'#333',panel.color_fondo||'#f9f1e0',
        _t1,_t2,_t3,panel.alto||760);
      mostroAlgo=true;
    } else if(it.kind==='general'){
      var tabData=pestanasCatalogo.find(function(t){return t.slug===tab;})||{};
      var bgImgGen=tabData.imagen_destacados||'';
      var cfg=(function(){try{return JSON.parse(localStorage.getItem('belle_dest_colors_'+tab)||'{}');}catch(e){return {};}}());
      var _bgImgGen = (_esMobile && cfgGen.imagen_url_mobile) ? cfgGen.imagen_url_mobile : ((cfgGen.imagen_url||bgImgGen)||'');
      _renderUnPanel(container,'gen-'+tab,destsGenerales,_bgImgGen,
        cfg.accent||cfgGen.color_accent||'#c4965a',cfg.nombre||cfgGen.color_nombre||'#1a1a1a',
        cfg.precio||cfgGen.color_precio||'#333',cfg.fondo||cfgGen.color_fondo||'#f9f1e0',
        cfgGen.texto1||'',cfgGen.texto2||'',cfgGen.texto3||'',cfgGen.alto||760);
      mostroAlgo=true;
    } else if(it.kind==='seccion'){
      var _wrap=document.createElement('div');
      _wrap.innerHTML=_homeSeccionHtml(it.sec, combos);
      while(_wrap.firstChild){ container.appendChild(_wrap.firstChild); }
      mostroAlgo=true;
    }
  });

  if(window._homeTieneInstagram && typeof _homeProcesarInstagram==='function'){ _homeProcesarInstagram(); }
  if(typeof _liInit==='function'){ _liInit(); }

  if(!mostroAlgo)container.style.display='none';
  else container.style.display='';
}

function scrollToProduct(id){
  try{ _lvAsegurar(id); }catch(e){}
  var card=document.getElementById('card_'+id);
  if(!card){
    // El producto no está visible — hay que navegar a su pestaña primero
    var prod=allProds.find(function(x){return x.id===id;});
    if(!prod)return;
    // Determinar qué pestaña contiene este producto
    var destTab='arabes'; // fallback
    if(prod.pestana_id){
      var tab=pestanasCatalogo&&pestanasCatalogo.find(function(t){return t.id===prod.pestana_id;});
      if(tab)destTab=tab.slug||tab.id;
    } else if(prod.cat_catalogo&&prod.cat_catalogo!=='arabes'){
      destTab=prod.cat_catalogo;
    }
    // Navegar a la pestaña y luego scroll
    var tabEl=document.querySelector(".tab[onclick*='"+destTab+"']");
    if(tabEl){
      switchTab(destTab,tabEl);
      // Esperar a que se renderice el catálogo
      var intentos=0;
      var interval=setInterval(function(){
        try{ _lvAsegurar(id); }catch(e){}
        var c=document.getElementById('card_'+id);
        if(c||(++intentos>20)){
          clearInterval(interval);
          if(c){
            c.scrollIntoView({behavior:'smooth',block:'center'});
            setTimeout(function(){c.style.transition='box-shadow .3s';c.style.boxShadow='0 0 0 3px var(--accent)';setTimeout(function(){c.style.boxShadow='';},1300);},350);
          }
        }
      },100);
    }
    return;
  }
  card.scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(function(){card.style.transition='box-shadow .3s';card.style.boxShadow='0 0 0 3px var(--accent)';setTimeout(function(){card.style.boxShadow='';},1300);},350);
}


var FICHAS_BELLE=[];
// Auditoría 2026-10-04: las fichas de respaldo (250 KB) viven en fichas-belle.json y se bajan
// aparte, sin frenar la carga. Cuando llegan, se vuelve a pintar el catálogo si ya estaba.
(function(){
  try{
    fetch('fichas-belle.json',{cache:'force-cache'}).then(function(r){ return r.json(); }).then(function(a){
      if(!Array.isArray(a)) return;
      FICHAS_BELLE=a; window._fichasBelleListas=true;
      try{ if(window.allProds && allProds.length && typeof applyFilters==='function') applyFilters(); }catch(e){}
    }).catch(function(e){ console.warn('[fichas] no se pudieron bajar las fichas de respaldo', e); });
  }catch(e){}
})();

function fichaMatchProd(prodNombre, fichasArr, prodId){
  function norm(s){
    return (s||'').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  }
  function matchArr(arr, keyField){
    var pn=norm(prodNombre);
    var exact=arr.find(function(f){return norm(f[keyField]||f.nombre_completo||'')===pn;});
    if(exact)return exact;
    var pWords=pn.split(' ').filter(function(w){return w.length>2;});
    var best=null,bestScore=0;
    arr.forEach(function(f){
      var fn2=norm(f[keyField]||f.nombre_completo||'');
      var matches=pWords.filter(function(w){return fn2.indexOf(w)>=0;});
      var score=matches.length/Math.max(pWords.length,1);
      if(score>bestScore&&score>=0.6){bestScore=score;best=f;}
    });
    return best;
  }
  var sbFichas=window._fichasSB||[];
  // 1. Buscar por producto_id primero (más confiable que por nombre)
  var sbMatch=null;
  if(sbFichas.length){
    if(prodId){
      sbMatch=sbFichas.find(function(f){return f.producto_id===prodId;});
    }
    if(!sbMatch){
      sbMatch=matchArr(sbFichas,'nombre_completo');
    }
    if(sbMatch){
      var mdMatch=matchArr(fichasArr||[],'nombre_completo');
      if(mdMatch){
        var merged={};
        Object.keys(mdMatch).forEach(function(k){merged[k]=mdMatch[k];});
        Object.keys(sbMatch).forEach(function(k){if(sbMatch[k]!=null&&sbMatch[k]!=='')merged[k]=sbMatch[k];});
        return merged;
      }
      return sbMatch;
    }
  }
  // 2. Fallback a FICHAS_BELLE
  return matchArr(fichasArr||[],'nombre_completo');
}

var NOTAS_FOTOS_USER=(function(){try{return JSON.parse(localStorage.getItem("belle_notas_fotos")||"{}");}catch(e){return {};}}());
function guardarNotaFoto(k,u){NOTAS_FOTOS_USER[k]=u;localStorage.setItem("belle_notas_fotos",JSON.stringify(NOTAS_FOTOS_USER));}
function syncNotasFotosDesdeSupabase(cb){
  fetch(SB_URL+"/rest/v1/configuracion?select=valor&clave=eq.notas_fotos&limit=1",{
    headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY}
  }).then(function(r){return r.json();})
  .then(function(res){
    var remoto={};try{remoto=JSON.parse(res&&res[0]?res[0].valor:"{}");}catch(e){}
    Object.keys(remoto).forEach(function(k){NOTAS_FOTOS_USER[k]=remoto[k];});
    localStorage.setItem("belle_notas_fotos",JSON.stringify(NOTAS_FOTOS_USER));
    if(cb)cb();
  }).catch(function(){if(cb)cb();});
}
var NOTAS_FOTOS={"bergamota": "https://images.unsplash.com/photo-1587491439149-bd2ff295d450?w=200&h=200&fit=crop", "limón": "https://images.unsplash.com/photo-1590502160462-58b41354f588?w=200&h=200&fit=crop", "limon": "https://images.unsplash.com/photo-1590502160462-58b41354f588?w=200&h=200&fit=crop", "naranja": "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop", "mandarina": "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=200&h=200&fit=crop", "pomelo": "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=200&h=200&fit=crop", "toronja": "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=200&h=200&fit=crop", "yuzu": "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=200&h=200&fit=crop", "rosa": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop", "jazmín": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&h=200&fit=crop", "jazmin": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&h=200&fit=crop", "jazmín sambac": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&h=200&fit=crop", "jazmín de sambac": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&h=200&fit=crop", "peonía": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "peonia": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "lavanda": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&h=200&fit=crop", "lavandín": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&h=200&fit=crop", "lirio": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "lirio de los valles": "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=200&h=200&fit=crop", "iris": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "geranio": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "ylang": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "nardos": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "tuberose": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "violeta": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "lila": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "flor de azahar": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "azahar": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "flor de naranjo": "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=200&h=200&fit=crop", "sándalo": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", "sandalo": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", "cedro": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "madera": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", "maderas": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", "abedul": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "guayaco": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", "oud": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "agarwood": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "pimienta": "https://images.unsplash.com/photo-1599909631482-e5c2a4b5c0a8?w=200&h=200&fit=crop", "pimienta rosa": "https://images.unsplash.com/photo-1599909631482-e5c2a4b5c0a8?w=200&h=200&fit=crop", "cardamomo": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&h=200&fit=crop", "canela": "https://images.unsplash.com/photo-1605372616263-3f9ee82f5e21?w=200&h=200&fit=crop", "nuez moscada": "https://images.unsplash.com/photo-1599909631482-e5c2a4b5c0a8?w=200&h=200&fit=crop", "clavo": "https://images.unsplash.com/photo-1599909631482-e5c2a4b5c0a8?w=200&h=200&fit=crop", "jengibre": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&h=200&fit=crop", "azafrán": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&h=200&fit=crop", "azafran": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&h=200&fit=crop", "elemi": "https://images.unsplash.com/photo-1599909631482-e5c2a4b5c0a8?w=200&h=200&fit=crop", "manzana": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop", "piña": "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=200&h=200&fit=crop", "pina": "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=200&h=200&fit=crop", "frambuesa": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200&h=200&fit=crop", "grosella": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200&h=200&fit=crop", "grosella negra": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200&h=200&fit=crop", "durazno": "https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?w=200&h=200&fit=crop", "melocotón": "https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?w=200&h=200&fit=crop", "fresa": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop", "ciruela": "https://images.unsplash.com/photo-1566842600175-97dca489844f?w=200&h=200&fit=crop", "pera": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop", "litchi": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop", "ámbar": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "ambar": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "ámbar gris": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "ambroxan": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "almizcle": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "almizcle blanco": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "musgo de roble": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "pachulí": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "pachuli": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "vainilla": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop", "haba tonka": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop", "tonka": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop", "incienso": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "ládano": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "ladano": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "cistus": "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop", "cuero": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", "praliné": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop", "praline": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop", "almendra": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop", "caramelo": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop", "menta": "https://images.unsplash.com/photo-1529757903572-5b53db0f5f2c?w=200&h=200&fit=crop", "menta piperita": "https://images.unsplash.com/photo-1529757903572-5b53db0f5f2c?w=200&h=200&fit=crop", "salvia": "https://images.unsplash.com/photo-1529757903572-5b53db0f5f2c?w=200&h=200&fit=crop", "enebro": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "vetiver": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "higuera": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop", "notas verdes": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "hierba": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", "notas marinas": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "agua marina": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "acuático": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "ozónico": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "sal": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop", "_default": "https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=200&h=200&fit=crop"};

function getNotaFoto(notaNombre){
  var lower=(notaNombre||'').trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]/g,' ').replace(/\s+/g,' ').trim();

  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,' ').replace(/\s+/g,' ').trim();}

  // 1. Buscar exacto en fotos de usuario
  for(var k in NOTAS_FOTOS_USER){if(norm(k)===lower)return NOTAS_FOTOS_USER[k];}

  // 2. Buscar exacto en predeterminadas
  for(var k in NOTAS_FOTOS){if(k!=='_default'&&norm(k)===lower)return NOTAS_FOTOS[k];}

  // 3. Fallback difuso — SOLO si la nota buscada CONTIENE la clave del diccionario
  // Y no existe una entrada más específica (más palabras) en el diccionario
  // Esto evita que "ámbar" matchee "ámbar gris" cuando "ámbar gris" ya tiene su propia entrada
  var lowerWords=lower.split(' ').filter(Boolean);
  var bestMatch=null;var bestLen=0;
  for(var k in NOTAS_FOTOS){
    if(k==='_default')continue;
    var kn=norm(k);var knWords=kn.split(' ').filter(Boolean);
    // La clave debe estar CONTENIDA en la nota buscada (no al revés)
    // y debe tener más palabras que el mejor match anterior
    if(knWords.length>lowerWords.length)continue; // la clave no puede ser más específica que la nota
    if(lower.indexOf(kn)>=0&&knWords.length>bestLen){
      bestMatch=NOTAS_FOTOS[k];bestLen=knWords.length;
    }
  }
  if(bestMatch)return bestMatch;

  // 4. Fallback usuario difuso
  for(var k in NOTAS_FOTOS_USER){
    var kn=norm(k);if(lower.indexOf(kn)>=0||kn.indexOf(lower)>=0)return NOTAS_FOTOS_USER[k];
  }

  return NOTAS_FOTOS['_default'];
}

// === FICHA BELLE MODAL ===
function verFichaBelle(prodId, btn){
  var prod=allProds.find(function(p){return p.id===prodId;});
  if(!prod)return;
  var mo=document.getElementById('moFichaBelle');
  var content=document.getElementById('moFichaContent');
  if(!mo||!content)return;

  // 📦 KIT (2026-05-23): si el producto es un kit con varios componentes,
  // mostrar un selector para elegir qué ficha ver.
  var kitComps = prod.kit_componentes;
  if(Array.isArray(kitComps) && kitComps.length > 0){
    // Si tiene 1 solo componente → abrir directo esa ficha
    if(kitComps.length === 1){
      var compId = parseInt(kitComps[0]);
      if(compId && compId !== prodId){
        return verFichaBelle(compId, btn);
      }
    }
    // Si tiene 2+ componentes → mostrar selector
    mostrarSelectorFichaKit(prod, kitComps);
    return;
  }

  // 🐛 FIX 2026-05-21: race condition - antes el modal se abría con el contenido
  // basado en _fichasSB que podía estar vacío porque la carga tardaba 3s en arrancar.
  // Ahora:
  //  1. Abrimos el modal de inmediato (loading o ficha si ya está cargada)
  //  2. Si las fichas aún no terminaron de cargar, esperamos y re-renderizamos cuando lleguen
  //  3. Resultado: el cliente NO ve "Sin ficha" por timing, solo si realmente no existe.
  // 🆕 TANDA 1: registrar como "visto recientemente"
  try{ _pushVistoParec(prod.id); }catch(e){}
  mo.style.display='block';
  document.body.style.overflow='hidden';

  function renderConDatos(){
    var ficha=fichaMatchProd(prod.nombre, FICHAS_BELLE, prod.id);
    window._fichaActualProd=prod;window._fichaActualData=ficha;
    content.innerHTML=renderFichaModal(prod, ficha);
    mo.scrollTop=0;
    if(prod.imagen_url){ _fichaAdaptarColor(prod.imagen_url, content); _fichaFotoTransparente(prod, content); }
    // Sync fotos de notas en background — si llegan, re-renderizar solo la pirámide
    syncNotasFotosDesdeSupabase(function(){
      var pir=content.querySelector('.fb-nota-tier');
      if(pir){ content.innerHTML=renderFichaModal(prod, ficha); mo.scrollTop=0;
        if(prod.imagen_url){_fichaAdaptarColor(prod.imagen_url,content);_fichaFotoTransparente(prod,content);} }
    });
  }

  // Si todavía está cargando la primera tanda de fichas, mostramos un loading
  // y esperamos a que termine antes de renderizar el contenido real.
  if(window._fichasSBLoading && window._fichasSBPromise){
    var nombreCorto = (prod.nombre||'').split('|')[0].trim();
    content.innerHTML =
      '<div style="padding:3rem 2rem;text-align:center;color:#9a8060">'+
        '<div style="font-size:2rem;margin-bottom:1rem;animation:fbSpin 1.2s linear infinite;display:inline-block">⏳</div>'+
        '<div style="font-family:Cormorant Garamond,serif;font-style:italic;font-size:1.2rem;color:#c4965a;margin-bottom:.4rem">'+_prodMl(nombreCorto, prod.ml)+'</div>'+
        '<div style="font-size:.85rem">Cargando ficha técnica…</div>'+
      '</div>'+
      '<style>@keyframes fbSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}</style>';
    mo.scrollTop=0;
    window._fichasSBPromise.then(function(){
      // Verificar que el modal sigue abierto y mostrando este producto
      if(mo.style.display==='block' && window._fichaActualProdId !== false){
        renderConDatos();
      }
    });
    window._fichaActualProdId = prodId;
    return;
  }

  // Si las fichas ya están cargadas (caso normal), render inmediato
  window._fichaActualProdId = prodId;
  renderConDatos();
}

// 📦 KIT (2026-05-23): selector de qué ficha ver dentro de un kit
function mostrarSelectorFichaKit(kitProd, componentesIds){
  var mo=document.getElementById('moFichaBelle');
  var content=document.getElementById('moFichaContent');
  if(!mo||!content)return;
  mo.style.display='block';
  document.body.style.overflow='hidden';
  // Buscar info de cada componente en la lista global
  var componentes = componentesIds.map(function(cid){
    return allProds.find(function(p){return p.id===parseInt(cid);});
  }).filter(function(p){return p;});  // ignorar IDs que ya no existen
  if(componentes.length === 0){
    content.innerHTML =
      '<div style="padding:2.5rem 1.5rem;text-align:center;color:#9a8060">'+
        '<div style="font-size:2rem;margin-bottom:.8rem">📦</div>'+
        '<div style="font-family:Cormorant Garamond,serif;font-style:italic;font-size:1.2rem;color:#c4965a;margin-bottom:.4rem">Kit sin componentes configurados</div>'+
        '<div style="font-size:.78rem;line-height:1.5">Este producto es un kit, pero no se configuraron los perfumes que contiene.</div>'+
      '</div>';
    mo.scrollTop=0;
    return;
  }
  var kitNombreCorto = (kitProd.nombre||'').split('|')[0].trim();
  var html =
    '<div style="padding:1.5rem 1.5rem 1.8rem">'+
      '<div style="text-align:center;margin-bottom:1.4rem">'+
        '<div style="font-size:2.2rem;margin-bottom:.4rem">📦</div>'+
        '<div style="font-family:Cormorant Garamond,serif;font-style:italic;font-size:1.35rem;color:#c4965a;line-height:1.2;margin-bottom:.3rem">'+_prodMl(kitNombreCorto, kitProd.ml)+'</div>'+
        '<div style="font-size:.78rem;color:#9a8060;line-height:1.45">Este kit contiene varios perfumes. Elegí cuál querés conocer:</div>'+
      '</div>'+
      '<div style="display:flex;flex-direction:column;gap:.6rem">';
  componentes.forEach(function(c){
    var nombreCorto = (c.nombre||'').split('|')[0].trim();
    var marca = c.empresa || '';
    var imgHtml = c.imagen_url
      ? '<img src="'+c.imagen_url+'" style="width:54px;height:54px;object-fit:contain;border-radius:6px;background:#fff;flex-shrink:0" onerror="this.style.display=\'none\'">'
      : '<div style="width:54px;height:54px;background:rgba(196,150,90,.1);border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">🌸</div>';
    html += '<button type="button" onclick="verFichaBelle('+c.id+')" style="display:flex;align-items:center;gap:.8rem;padding:.7rem .9rem;background:rgba(201,150,58,.06);border:1px solid rgba(201,150,58,.3);border-radius:10px;cursor:pointer;text-align:left;transition:all .2s;width:100%" onmouseover="this.style.background=\'rgba(201,150,58,.14)\';this.style.borderColor=\'rgba(201,150,58,.6)\'" onmouseout="this.style.background=\'rgba(201,150,58,.06)\';this.style.borderColor=\'rgba(201,150,58,.3)\'">'+
        imgHtml+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-family:Cormorant Garamond,serif;font-size:1.05rem;color:#6b5a3e;font-weight:500;line-height:1.2;margin-bottom:.1rem">'+nombreCorto+'</div>'+
          (marca?'<div style="font-size:.62rem;color:#9a8060;text-transform:uppercase;letter-spacing:.05em">'+marca+'</div>':'')+
        '</div>'+
        '<div style="font-size:1rem;color:#c4965a">→</div>'+
      '</button>';
  });
  html += '</div></div>';
  content.innerHTML = html;
  mo.scrollTop=0;
  window._fichaActualProdId = kitProd.id;
}

// 🎨 2026-08-08: quita el fondo BLANCO de la foto del perfume (flood-fill desde los
// bordes, portado de card.html) para que se funda con el fondo de color de la ficha
// en vez de mostrar un recuadro blanco. Cachea el resultado por producto.
function _fichaFotoTransparente(prod, content){
  if(!prod||!prod.imagen_url) return;
  var imgEl=content.querySelector('.fb-img img');
  if(!imgEl) return;
  if(window._fichaImgLimpiaId===prod.id && window._fichaImgLimpia){ imgEl.src=window._fichaImgLimpia; return; }
  _fichaImgB64(prod.imagen_url).then(function(durl){
    if(!durl) return;
    var tmp=new Image();
    tmp.onload=function(){
      try{
        var w=tmp.naturalWidth,h=tmp.naturalHeight;
        if(!w||!h){ imgEl.src=durl; return; }
        var cv=document.createElement('canvas');cv.width=w;cv.height=h;
        var ctx=cv.getContext('2d');ctx.drawImage(tmp,0,0);
        var d=ctx.getImageData(0,0,w,h),px=d.data,thr=236;
        var seen=new Uint8Array(w*h),stack=[];
        function isW(i){return px[i]>=thr&&px[i+1]>=thr&&px[i+2]>=thr;}
        function pu(x,y){
          if(x<0||y<0||x>=w||y>=h)return;
          var idx=y*w+x; if(seen[idx])return; seen[idx]=1;
          var i=idx*4; if(isW(i)){px[i+3]=0;stack.push(x);stack.push(y);}
        }
        var x,y;
        for(x=0;x<w;x++){pu(x,0);pu(x,h-1);}
        for(y=0;y<h;y++){pu(0,y);pu(w-1,y);}
        while(stack.length){var yy=stack.pop(),xx=stack.pop();pu(xx+1,yy);pu(xx-1,yy);pu(xx,yy+1);pu(xx,yy-1);}
        ctx.putImageData(d,0,0);
        var out=cv.toDataURL('image/png');
        window._fichaImgLimpia=out; window._fichaImgLimpiaId=prod.id;
        var el2=content.querySelector('.fb-img img');
        if(el2 && window._fichaActualProd && window._fichaActualProd.id===prod.id) el2.src=out;
      }catch(e){}
    };
    tmp.src=durl;
  });
}

function _fichaAdaptarColor(imgUrl, content){
  var img=new Image();
  img.crossOrigin='anonymous';
  img.onload=function(){
    try{
      var canvas=document.createElement('canvas');
      var size=40; // muestra pequeña para velocidad
      canvas.width=size;canvas.height=size;
      var ctx=canvas.getContext('2d');
      ctx.drawImage(img,0,0,size,size);
      var data=ctx.getImageData(0,0,size,size).data;
      // Promediar colores excluyendo blancos/negros/grises muy puros
      var r=0,g=0,b=0,count=0;
      for(var i=0;i<data.length;i+=4){
        var pr=data[i],pg=data[i+1],pb=data[i+2],pa=data[i+3];
        if(pa<100)continue; // transparente
        var mx=Math.max(pr,pg,pb),mn=Math.min(pr,pg,pb);
        var sat=(mx===0)?0:(mx-mn)/mx;
        if(sat<0.15)continue; // gris/blanco/negro — ignorar
        if(pr>230&&pg>230&&pb>230)continue; // casi blanco
        r+=pr;g+=pg;b+=pb;count++;
      }
      if(count<20){
        // Muy poca saturación — usar default
        return;
      }
      r=Math.round(r/count);
      g=Math.round(g/count);
      b=Math.round(b/count);
      // Oscurecer mucho para el fondo (mantener elegancia)
      // Versión clara y similar al color real del perfume
      var dark1='rgb('+Math.round(r*0.30)+','+Math.round(g*0.22)+','+Math.round(b*0.20)+')';
      var dark2='rgb('+Math.round(r*0.45)+','+Math.round(g*0.32)+','+Math.round(b*0.28)+')';
      // Color suave para el glow del ::before — no podemos tocar ::before via JS
      // Pero sí el background del header
      // 🎨 2026-08-08: guardar el color dominante (lo usa la descarga en formato
      // historia) y difuminar también el CUERPO de la ficha con ese color.
      window._fichaColorRGB=[r,g,b];
      var bodyEl=content.querySelector('.fb-body');
      if(bodyEl){
        bodyEl.style.background='linear-gradient(180deg,rgba('+r+','+g+','+b+',.12) 0%,rgba('+r+','+g+','+b+',.04) 380px,rgba('+r+','+g+','+b+',0) 720px)';
      }
      var header=content.querySelector('.fb-header');
      if(header){
        header.style.background='linear-gradient(160deg,'+dark1+' 0%,'+dark2+' 100%)';
        // Glow sutil en la esquina usando un div overlay
        var glow=content.querySelector('.fb-color-glow');
        if(!glow){
          glow=document.createElement('div');
          glow.className='fb-color-glow';
          glow.style.cssText='position:absolute;top:-30%;right:-5%;width:220px;height:220px;background:radial-gradient(circle,rgba('+r+','+g+','+b+',.35) 0%,transparent 65%);pointer-events:none;border-radius:50%';
          header.appendChild(glow);
        } else {
          glow.style.background='radial-gradient(circle,rgba('+r+','+g+','+b+',.25) 0%,transparent 70%)';
        }
        // Borde sutil en la imagen con el color extraído
        var fbImg=content.querySelector('.fb-img');
        if(fbImg){
          fbImg.style.borderColor='rgba('+r+','+g+','+b+',.5)';
          fbImg.style.boxShadow='0 4px 20px rgba('+r+','+g+','+b+',.35)';
        }
      }
    }catch(e){}
  };
  img.onerror=function(){};
  img.src=imgUrl;
}

function cerrarFicha(){
  var mo=document.getElementById('moFichaBelle');
  if(mo)mo.style.display='none';
  document.body.style.overflow='';
  // 🐛 FIX 2026-05-21: marcar como cerrado para que verFichaBelle no re-renderice
  // si la promesa de carga termina después de que el usuario cerró el modal.
  window._fichaActualProdId = false;
}

// Cerrar con Escape o click en backdrop
document.addEventListener('keydown',function(e){if(e.key==='Escape')cerrarFicha();});
document.getElementById('moFichaBelle').addEventListener('click',function(e){
  if(e.target===this)cerrarFicha();
});

function liquidColorFicha(texto){
  if(!texto)return'#e8c87a';
  var t=texto.toLowerCase();
  if(t.indexOf('azul')>=0)return t.indexOf('oscuro')>=0||t.indexOf('cobalto')>=0||t.indexOf('ndigo')>=0?'#1565c0':'#42a5f5';
  if(t.indexOf('rosa')>=0||t.indexOf('melocot')>=0||t.indexOf('coral')>=0)return'#f48fb1';
  if(t.indexOf('verde')>=0)return'#43a047';
  if(t.indexOf('violeta')>=0||t.indexOf('morado')>=0)return'#8e24aa';
  if(t.indexOf('negro')>=0)return'#212121';
  if(t.indexOf('blanco')>=0||t.indexOf('transparente')>=0||t.indexOf('cristalino')>=0)return'#e0e0e0';
  if(t.indexOf('dorado')>=0||t.indexOf('mbar')>=0||t.indexOf('miel')>=0||t.indexOf('champagne')>=0||t.indexOf('caramelo')>=0)return'#f9a825';
  if(t.indexOf('plateado')>=0||t.indexOf('gris')>=0||t.indexOf('plata')>=0)return'#9e9e9e';
  if(t.indexOf('naranja')>=0)return'#ff6d00';
  if(t.indexOf('rojo')>=0)return'#e53935';
  return'#e8c87a';
}

function getPrLevel(texto){
  if(!texto)return 0;var t=texto.toLowerCase();
  if(t.indexOf('muy alta')>=0||t.indexOf('beast')>=0||t.indexOf('nuclear')>=0)return 5;
  if(t.indexOf('alta')>=0)return 4;if(t.indexOf('moderada')>=0)return 3;
  if(t.indexOf('baja')>=0)return 1;return 2;
}
function getDurText(t){
  if(!t)return'—';t=t.toLowerCase();
  if(t.indexOf('muy larga')>=0)return'Muy larga';if(t.indexOf('larga')>=0&&t.indexOf('media')<0)return'Larga';
  if(t.indexOf('media-larga')>=0||t.indexOf('media larga')>=0)return'Media-larga';
  if(t.indexOf('media')>=0)return'Media';if(t.indexOf('corta')>=0)return'Corta';return t.split('|')[0].trim();
}
function getEstelaText(t){
  if(!t)return'—';t=t.toLowerCase();
  if(t.indexOf('nuclear')>=0)return'Nuclear';if(t.indexOf('intensa')>=0)return'Intensa';
  if(t.indexOf('moderada')>=0)return'Moderada';if(t.indexOf('discreta')>=0)return'Discreta';return t;
}
function hasEst(estacion,nombre){
  return (estacion||'').toLowerCase().indexOf(nombre.toLowerCase())>=0||(estacion||'').toLowerCase().indexOf('todo')>=0;
}
function hasMom(momento,word){return (momento||'').toLowerCase().indexOf(word)>=0||(momento||'').toLowerCase().indexOf('versátil')>=0||(momento||'').toLowerCase().indexOf('versatil')>=0;}

/* ════════════════════════════════════════════════════════════════
   🆕 TANDA 1 (2026-06-14): "También te puede gustar" (perfumes parecidos
   por notas + familia olfativa) y "Seguí viendo" (vistos recientemente).
   Sólo agrega contenido al pie de la ficha; no toca el flujo de compra.
   ════════════════════════════════════════════════════════════════ */
function _normParec(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function _notasArrParec(f){
  var out=[],seen={};
  ['notas_salida','notas_corazon','notas_fondo'].forEach(function(k){
    var v=f&&f[k]; if(!v)return;
    var parts=Array.isArray(v)?v:String(v).split(/[,;·\/|]+/);
    parts.forEach(function(n){ n=_normParec(n); if(n&&n.length>1&&!seen[n]){seen[n]=1;out.push(n);} });
  });
  return out;
}
function _famArrParec(f){
  var seen={},out=[];
  _normParec(f&&f.familia_olfativa).split(' ').forEach(function(t){ if(t&&t.length>2&&!seen[t]){seen[t]=1;out.push(t);} });
  return out;
}
/* DUPE-CANON v2 (auto) */
window._DUPE_CANON={"afnan 9pm elixir extrait de parfum 100ml":"jean paul gaultier le male elixir absolu","afnan 9pm black edp 100ml":"jean paul gaultier ultra male","afnan 9pm rebel edp 100ml":"creed aventus","afnan historic doria edp 100ml":"thomas kosmala apres l amour","afnan historic olmeda edp 100ml":"chanel bleu","afnan historic sahara extrait de parfum 100ml":"parfums de marly althair","afnan supremacy collector s edition edp 100ml":"creed aventus absolu","afnan supremacy not only intense extrait de parfum 100ml":"creed aventus","afnan turathi blue edp 90ml":"bvlgari tygar","afnan turathi brown edp 90ml":"yves saint laurent tuxedo","afnan turathi electric edp 90ml":"ex nihilo blue talisman","al haramain amber oud aqua dubai edp 100ml":"louis vuitton l immensite","al haramain amber oud black edition edp 100ml":"tom ford fucking fabulous","al haramain amber oud blue edition edp 100ml":"bleu de chanel edp","al haramain amber oud carbon edition edp 100ml":"creed green irish tweed","al haramain amber oud dubai night extrait de parfum 75ml":"montale arabians tonka","al haramain amber oud gold edition edp 120ml":"xerjoff erba pura","al haramain amber oud gold extreme parfum 100ml":"xerjoff erba pura","al haramain amber oud ruby edition kit 75ml 30ml bodysplash 250ml":"baccarat rouge 540 extrait","al haramain detour eco edp 100ml":"parfums de marly haltane","al haramain detour noir edp 100ml":"parfums de marly layton","al haramain detour noir intense edp 100ml":"parfums de marly pegasus exclusif","al wataniah ameerati edp 100ml":"ralph lauren woman","al wataniah attar al wesal edp 100ml":"jean paul gaultier ultra male","al wataniah rose mystery intense edp 100ml":"initio atomic rose","al wataniah thahaani edp 100ml":"givenchy l interdit","al wataniah watani purple edp 100ml":"giorgio armani si","armaf club de nuit iconic blue edp 105ml":"bleu de chanel edp","armaf club de nuit imperiale edp 105ml":"creed millesime imperial","armaf club de nuit intense edt 105ml":"creed aventus","armaf club de nuit lionheart men edp 105ml":"burberry goddess","armaf club de nuit lionheart woman edp 105ml":"burberry goddess","armaf club de nuit maleka edp 105ml":"dna frutal floral moderno","armaf club de nuit milestone edp 105ml":"creed millesime imperial","armaf club de nuit oud parfum 105ml":"xerjoff erba pura con oud","armaf club de nuit precieux i extrait de parfum 55ml":"creed aventus","armaf club de nuit sillage edp 105ml":"creed silver mountain water","armaf club de nuit untold edp 105ml":"baccarat rouge 540 edp","armaf club de nuit urban elixir elixir 105ml":"dior sauvage elixir","armaf club de nuit woman edp 105ml":"chanel coco mademoiselle","armaf odyssey aoud edp 100ml":"parfums de marly haltane","armaf odyssey dubai chocolat edp 100ml":"postres de dubai","armaf odyssey eau de montagne edp 100ml":"liquides imaginaires blanche bete","armaf odyssey femme black edp 100ml":"tom ford noir de noir","armaf odyssey go mango edp 100ml":"parfums de marly layton","armaf odyssey homme black edp 100ml":"tom ford noir extreme","armaf odyssey homme white edp 100ml":"emporio armani stronger with you","armaf odyssey mandarin sky elixir edp 100ml":"jean paul gaultier scandal le parfum","armaf odyssey mandarin sky for men edp 100ml":"jean paul gaultier scandal edt","armaf odyssey mega man edp 200ml":"yves saint laurent y edp","armaf odyssey revolution edp 100ml":"creed aventus","armaf odyssey spectra edp 100ml":"jean paul gaultier ultra male","armaf odyssey tyrant edp 100ml":"bvlgari tygar","armaf odyssey wild one edp 100ml":"dior sauvage edp","asdaaf ameer al arab imperium edp 100ml":"yves saint laurent y edp","asdaaf ameerat al arab edp 100ml":"armani my way","asdaaf ameerat al arab prive rose edp 100ml":"parfums de marly delina","bharara king edp 100ml":"creed aventus","french avenue aether extrait de parfum 100ml":"parfums de marly greenley","french avenue atlantis extrait de parfum 100ml":"wavechild","french avenue liquid brun extrait de parfum 100ml":"parfums de marly althair","french avenue vulcan baie edp 100ml":"viktor rolf pink boa","zimaya fatima pink extrait de parfum 100ml":"parfums de marly delina","zimaya sharaf blend extrait de parfum 100ml":"lattafa khamrah","lattafa asad black edp 100ml":"dior sauvage elixir","lattafa asad bourbon edp 100ml":"azzaro most wanted parfum","lattafa asad zanzibar edp 100ml":"jean paul gaultier le beau","lattafa asad elixir edp 100ml":"dior sauvage elixir","lattafa khamrah edp 100ml":"kilian angel s share","lattafa khamrah dukhan edp 100ml":"lattafa khamrah","lattafa khamrah qahwa edp 100ml":"kilian angel s share","lattafa qaed al fursan edp 90ml":"creed aventus","lattafa qaed al fursan untamed edp 90ml":"variante oscura de qaf con caramelo y especias","lattafa fakhar black edp 100ml":"yves saint laurent y edp","lattafa fakhar extrait extrait de parfum 100ml":"paco rabanne 1 million parfum","lattafa maahir black edition edp 100ml":"tom ford oud wood","lattafa maahir legacy edp 100ml":"parfums de marly sedley","lattafa his confession edp 100ml":"iris oscuro masculino tendencia","lattafa yara candy edp 100ml":"lattafa yara","lattafa yara elixir edp 100ml":"version elixir concentrada del dna yara","lattafa eclaire banoffi edp 100ml":"postre banoffee pie","lattafa noble blush edp 100ml":"rosa almendra leche","lattafa bade al oud for glory edp 100ml":"initio oud for greatness","lattafa angham edp 100ml":"burberry goddess","maison alhambra jean lowe immortal edp 100ml":"louis vuitton l immensite","maison alhambra jean lowe matiere edp 100ml":"maison francis kurkdjian oud satin mood","maison alhambra jean lowe noir edp 100ml":"louis vuitton ombre nomade","maison alhambra jean lowe nouveau edp 100ml":"louis vuitton nouveau monde","maison alhambra jean lowe fraiche edp 100ml":"louis vuitton imagination","maison alhambra jean lowe vibe edp 100ml":"louis vuitton pacific chill","maison alhambra jean lowe azure edp 100ml":"louis vuitton afternoon swim","maison alhambra salvo edp 100ml":"dior sauvage edt","maison alhambra salvo intense edp 100ml":"dior sauvage edp","maison alhambra salvo elixir edp 60ml":"dior sauvage elixir","maison alhambra yeah man edp 100ml":"yves saint laurent y edp","maison alhambra dark door sport edp 100ml":"dior sauvage sport","maison alhambra glacier pour homme edp 100ml":"jean paul gaultier le male","maison alhambra bad femme edp 100ml":"baccarat rouge 540","maison alhambra delilah edp 100ml":"ruibarbo rosa","maison alhambra la vivacite edp 100ml":"lancome la vie est belle","maison alhambra philos messenger edp 100ml":"maison francis kurkdjian vibrato","rasasi hawas for him edp 100ml":"paco rabanne invictus aqua 2016","rasasi hawas ice edp 100ml":"paco rabanne invictus aqua 2018","rasasi hawas black edp 100ml":"rasasi hawas","rasasi hawas elixir edp 100ml":"jean paul gaultier le male elixir","rasasi hawas for her eclat edp 100ml":"parfums de marly delina","rasasi hawas malibu edp 100ml":"jean paul gaultier le beau le parfum","rasasi hawas tropical edp 100ml":"jean paul gaultier le beau paradise garden","rayhaan lion edp 100ml":"jean paul gaultier ultra male","rayhaan nocturno edp 100ml":"dior sauvage edp","rayhaan pacific edp 100ml":"paco rabanne invictus","rayhaan rayhaan elixir edp 100ml":"jean paul gaultier le male elixir","rayhaan corium edp 100ml":"emporio armani stronger with you leather","rayhaan jungle vibe edp 100ml":"jean paul gaultier le beau paradise garden","rayhaan valhalla edp 100ml":"kilian angel s share"};

if(!window._dupeCanonFromText){(function(){
 var BRAND={jpg:'jean paul gaultier',ysl:'yves saint laurent',pdm:'parfums de marly',mfk:'maison francis kurkdjian',tf:'tom ford',lv:'louis vuitton',bdc:'bleu de chanel',git:'green irish tweed',adg:'acqua di gio',ck:'calvin klein',ea:'emporio armani'};
 var MARCAS=['parfums de marly','jean paul gaultier','yves saint laurent','maison francis kurkdjian','louis vuitton','emporio armani','giorgio armani','paco rabanne','ralph lauren','viktor rolf','ex nihilo','calvin klein','tom ford','creed','dior','chanel','bvlgari','xerjoff','kilian','initio','montale','lancome','givenchy','azzaro','burberry','lattafa','rasasi','armani','versace','mancera','nishane'];
 var MOD={aventus:'creed',sauvage:'dior',khamrah:'lattafa',yara:'lattafa',hawas:'rasasi'};
 var ALIAS={'angel s share':'kilian angel s share','le beau paradise garden':'jean paul gaultier le beau paradise garden'};
 function nm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();}
 window._dupeCanonFromText=function(raw){
   if(!raw) return '';
   var r=String(raw).split(/[(\/+,\u2014]|\s-\s/)[0];
   var n=nm(r),pre=['dna de ','dna ','similar a ','clon de ','clone de ','tipo ','estilo ','vibe ','inspirado en ','version de ','homenaje a ','el ','los '];
   for(var k=0;k<pre.length;k++){ if(n.indexOf(pre[k])===0){ n=n.slice(pre[k].length); break; } }
   var cuts=[' en version',' en su version',' pero ',' con toque',' con notas',' version ',' segun ',' aunque ',' mas '];
   for(var c=0;c<cuts.length;c++){ var ix=n.indexOf(cuts[c]); if(ix>0) n=n.slice(0,ix); }
   n=n.trim();
   if(!n||n.length<4) return '';
   if(n.indexOf('composicion')>=0||n.indexOf('propia')>=0||n.indexOf('propio')>=0||n.indexOf('mezcla')>=0||n.indexOf('creacion')>=0||n==='original') return '';
   n=n.split(' ').map(function(t){return BRAND[t]||t;}).join(' ');
   n=n.replace('br540','baccarat rouge 540').replace('br 540','baccarat rouge 540').replace(/\s+/g,' ').trim();
   if(n.slice(-4)===' dna') n=n.slice(0,-4).trim();
   for(var mi=0;mi<MARCAS.length;mi++){ var suf=' de '+MARCAS[mi]; if(suf.length<=n.length && n.slice(-suf.length)===suf){ n=MARCAS[mi]+' '+n.slice(0,n.length-suf.length).trim(); break; } }
   var hasB=false; for(var b=0;b<MARCAS.length;b++){ if(n===MARCAS[b]||n.indexOf(MARCAS[b]+' ')===0){ hasB=true; break; } }
   if(!hasB){ for(var mod in MOD){ if(n===mod||n.indexOf(mod+' ')===0){ if(n.indexOf(MOD[mod])<0) n=MOD[mod]+' '+n; break; } } }
   n=n.replace(/\s+/g,' ').trim();
   return ALIAS[n]||n;
 };
})();}

function _dupeParec(f){
  if(!f) return '';
  // 1) Prioridad: dato curado en Supabase (inspirado_en_nombre). Manda siempre que tenga contenido.
  var nom=(f.inspirado_en_nombre && String(f.inspirado_en_nombre).trim()) || '';
  if(nom) return window._dupeCanonFromText ? window._dupeCanonFromText(nom) : '';
  // 2) Fallback: diccionario hardcodeado por nombre de producto (solo fichas sin inspirado_en_nombre).
  try{ var key=_normParec(f.nombre_completo||f.nombre||'');
    if(key && window._DUPE_CANON && window._DUPE_CANON[key]) return window._DUPE_CANON[key]; }catch(e){}
  // 3) Último recurso: descripción larga.
  var raw=f.inspirado_en ? String(f.inspirado_en) : '';
  return window._dupeCanonFromText ? window._dupeCanonFromText(raw) : '';
}
// 🆕 2026-06-17: devuelve TODAS las inspiraciones canónicas de una ficha (array).
// Usa f.inspiraciones (multi-dupe) si existe; si no, cae al dupe principal (_dupeParec).
function _dupesParec(f){
  if(!f) return [];
  var out=[];
  function add(nombre){
    var c = window._dupeCanonFromText ? window._dupeCanonFromText(nombre) : '';
    if(c && out.indexOf(c)<0) out.push(c);
  }
  if(Array.isArray(f.inspiraciones) && f.inspiraciones.length){
    f.inspiraciones.forEach(function(it){
      if(it && it.nombre && String(it.nombre).trim()) add(String(it.nombre).trim());
    });
  }
  // Fallback legacy: si inspiraciones no aportó nada, usar el dupe principal (con su cadena de fallbacks)
  if(!out.length){
    var d=_dupeParec(f);
    if(d) out.push(d);
  }
  return out;
}
function _idxParecidos(){
  if(window._idxParec2) return window._idxParec2;
  var liveReady = Array.isArray(window._fichasSB) && window._fichasSB.length>0;
  var idx=[];
  (window.allProds||[]).forEach(function(p){
    if(p.kit_componentes && p.kit_componentes.length) return;
    var f=fichaMatchProd(p.nombre, FICHAS_BELLE, p.id);
    if(!f || !f.familia_olfativa) return;
    idx.push({ id:p.id, nombre:(p.nombre||'').split('|')[0].trim(), img:p.imagen_url||'',
               notas:_notasArrParec(f), fam:_famArrParec(f), dupes:_dupesParec(f) });
  });
  // Solo cachear cuando ya cargaron las fichas vivas (que traen inspiraciones múltiples).
  // Si todavía no llegaron, no cacheamos para que se reconstruya con los datos completos.
  if(liveReady) window._idxParec2=idx;
  return idx;
}
function _tieneSugeridos(p){ var s=p&&p.sugeridos_ids; if(typeof s==='string'){try{s=JSON.parse(s);}catch(e){return false;}} return Array.isArray(s)&&s.length>0; }
function _sugeridosManuales(prod){
  var ids=prod&&prod.sugeridos_ids;
  if(typeof ids==='string'){ try{ ids=JSON.parse(ids); }catch(e){ ids=null; } }
  if(!Array.isArray(ids)||!ids.length) return null;
  var out=[];
  ids.forEach(function(id){
    var p=(window.allProds||[]).find(function(pp){return pp.id===id;});
    if(p) out.push({ id:p.id, nombre:(p.nombre||'').split('|')[0].trim(), img:p.imagen_url||'' });
  });
  return out.length?out:null;
}
function perfumesParecidos(prod, f, max){
  // 🆕 TANDA B: override manual desde admin (sugeridos_ids). Si están cargados, mandan esos.
  var _man=_sugeridosManuales(prod);
  if(_man) return _man.slice(0, max||4);
  if(!f || !f.familia_olfativa) return [];
  // 🆕 Orden automático: (1) mismo dupe / perfume inspirador (cualquiera de los suyos), (2) más notas+familia en común.
  var miN=_notasArrParec(f), miF=_famArrParec(f), miDupes=_dupesParec(f), sc=[];
  _idxParecidos().forEach(function(x){
    if(x.id===prod.id) return;
    var nc=0; x.notas.forEach(function(n){ if(miN.indexOf(n)>=0) nc++; });
    var fc=0; x.fam.forEach(function(t){ if(miF.indexOf(t)>=0) fc++; });
    // Comparten dupe si CUALQUIERA de mis inspiraciones coincide con CUALQUIERA de las del candidato
    var mismoDupe=0;
    if(miDupes.length && x.dupes && x.dupes.length){
      for(var i=0;i<miDupes.length;i++){ if(x.dupes.indexOf(miDupes[i])>=0){ mismoDupe=1; break; } }
    }
    var score=nc*3+fc*2;
    if(mismoDupe || score>0) sc.push({x:x,dupe:mismoDupe,score:score});
  });
  sc.sort(function(a,b){ if(b.dupe!==a.dupe) return b.dupe-a.dupe; return b.score-a.score; });
  return sc.slice(0,max||4).map(function(o){return o.x;});
}
function _pushVistoParec(id){
  try{ var a=JSON.parse(localStorage.getItem('belle_vistos')||'[]');
    a=a.filter(function(x){return x!==id;}); a.unshift(id); localStorage.setItem('belle_vistos', JSON.stringify(a.slice(0,12))); }catch(e){}
}
function _getVistosParec(){ try{ return JSON.parse(localStorage.getItem('belle_vistos')||'[]'); }catch(e){ return []; } }
/* ============================================================
   PANEL ROTATIVO configurable (tipo de seccion 'rotativo')
   Fuentes: vendidos / ingresos / recomendados / manual.
   Hero giratorio + lista scrolleable. Auto-init por MutationObserver
   asi funciona en inicio y en cualquier pestana sin tocar sus renders.
   ============================================================ */
var _LI_CSS=[
  '.li-wrap{--li-alto:350px;display:grid;grid-template-columns:290px 1fr;gap:1rem;background:linear-gradient(180deg,#fdfbf7,#f9f4ea);border:1px solid rgba(196,150,90,.24);border-radius:18px;padding:.9rem;margin:.5rem .15rem 1.1rem}',
  '.li-wrap.li-lado-der{grid-template-columns:1fr 290px}',
  '.li-wrap.li-lado-der .li-hero{order:2}',
  '.li-wrap.li-lado-der .li-side{order:1}',
  '.li-hero{position:relative;background:#fff;border:1px solid rgba(196,150,90,.18);border-radius:14px;padding:.85rem;display:flex;flex-direction:column;cursor:pointer;box-shadow:0 6px 20px rgba(120,90,40,.08);overflow:hidden}',
  '.li-tag{position:absolute;top:.7rem;right:.7rem;background:rgba(196,150,90,.14);color:#a9763f;font-size:.6rem;letter-spacing:.06em;font-weight:700;padding:.22rem .55rem;border-radius:20px;border:1px solid rgba(196,150,90,.35);z-index:2}',
  '.li-fade{transition:opacity .22s ease}',
  '.li-him{flex:1;min-height:170px;border-radius:12px;background:#fff;border:1px solid rgba(196,150,90,.1);display:flex;align-items:center;justify-content:center;margin-bottom:.6rem;overflow:hidden}',
  '.li-him img{width:100%;height:100%;object-fit:contain;padding:6px}',
  '.li-hm{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:#a9763f;font-weight:700}',
  '.li-hn{font-family:"Cormorant Garamond",serif;font-size:1.5rem;font-weight:600;line-height:1.08;color:#3a2f22;margin:.12rem 0 0}',
  '.li-hprice{font-size:.95rem;font-weight:700;color:#a9763f;margin-top:.3rem}',
  '.li-dots{display:flex;gap:5px;margin-top:.7rem;flex-wrap:wrap;align-items:center}',
  '.li-dots i{width:6px;height:6px;border-radius:50%;background:rgba(196,150,90,.25);transition:all .25s}',
  '.li-dots i.on{background:#c4965a;width:16px;border-radius:4px}',
  '.li-count{font-size:.64rem;color:#a9763f;font-weight:600;margin-top:.6rem}',
  '.li-side{display:flex;flex-direction:column;min-width:0}',
  '.li-ttl{font-family:"Cormorant Garamond",serif;font-size:1.3rem;font-weight:600;color:#a9763f;margin:.1rem 0 .55rem;display:flex;align-items:center;justify-content:space-between;gap:.5rem}',
  '.li-list{display:flex;flex-direction:column;gap:.3rem;overflow-y:auto;height:var(--li-alto,350px);padding-right:.4rem;scrollbar-width:thin;scrollbar-color:#c4965a rgba(196,150,90,.1)}',
  '.li-list::-webkit-scrollbar{width:6px}',
  '.li-list::-webkit-scrollbar-track{background:rgba(196,150,90,.08);border-radius:10px;margin:2px}',
  '.li-list::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#c4965a,#a9763f);border-radius:10px}',
  '.li-mini{display:flex;gap:.5rem;align-items:center;background:#fff;border:1px solid rgba(196,150,90,.16);border-radius:10px;padding:.28rem .45rem;cursor:pointer;transition:transform .15s,box-shadow .15s,border-color .15s;flex:0 0 auto}',
  '.li-mini:hover{transform:translateX(3px);box-shadow:0 6px 16px rgba(120,90,40,.1)}',
  '.li-mini.act{border-color:#c4965a;background:linear-gradient(90deg,rgba(196,150,90,.1),#fff);box-shadow:0 4px 14px rgba(120,90,40,.12)}',
  '.li-mim{position:relative;flex:0 0 32px;width:32px;height:40px;border-radius:7px;background:#fff;border:1px solid rgba(196,150,90,.14);display:flex;align-items:center;justify-content:center;overflow:hidden}',
  '.li-mim img{width:100%;height:100%;object-fit:contain;padding:2px}',
  '.li-mtx{flex:1;min-width:0}',
  '.li-mm{font-size:.53rem;letter-spacing:.12em;text-transform:uppercase;color:#a9763f;font-weight:700}',
  '.li-mn{font-family:"Cormorant Garamond",serif;font-size:.95rem;font-weight:600;color:#3a2f22;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '.li-mr{display:flex;flex-direction:column;align-items:flex-end;gap:1px;flex-shrink:0}',
  '.li-mfecha{font-size:.6rem;color:#a9763f;font-weight:600;white-space:nowrap}',
  '.li-mprice{font-size:.64rem;color:#3a2f22;font-weight:700;white-space:nowrap}',
  '.li-ult{font-size:.5rem;color:#fff;background:#c0392b;font-weight:700;padding:.05rem .3rem;border-radius:8px;white-space:nowrap;letter-spacing:.02em}',
  '.li-vertodos{font-family:"DM Sans",sans-serif;font-size:.6rem;font-weight:600;color:#a9763f;background:rgba(196,150,90,.12);border:1px solid rgba(196,150,90,.35);border-radius:20px;padding:.2rem .6rem;cursor:pointer}',
  '.li-ph{display:none;align-items:center;justify-content:center;width:100%;height:100%;font-size:1.4rem;opacity:.3}',
  '[data-theme="dark"] .li-wrap{background:linear-gradient(180deg,#1e2231,#191c28);border-color:rgba(232,184,109,.25)}',
  '[data-theme="dark"] .li-hero,[data-theme="dark"] .li-mini{background:#222738;border-color:rgba(232,184,109,.18)}',
  '[data-theme="dark"] .li-him,[data-theme="dark"] .li-mim{background:#fff}',
  '[data-theme="dark"] .li-ttl,[data-theme="dark"] .li-hm,[data-theme="dark"] .li-mm,[data-theme="dark"] .li-tag,[data-theme="dark"] .li-mfecha,[data-theme="dark"] .li-count,[data-theme="dark"] .li-hprice{color:#e8b86d}',
  '[data-theme="dark"] .li-hn,[data-theme="dark"] .li-mn,[data-theme="dark"] .li-mprice{color:#ece7df}',
  '[data-theme="dark"] .li-mini.act{background:linear-gradient(90deg,rgba(232,184,109,.14),#222738);border-color:#e8b86d}',
  '@media(max-width:640px){.li-wrap,.li-wrap.li-lado-der{grid-template-columns:1fr}.li-wrap.li-lado-der .li-hero{order:0}.li-wrap.li-lado-der .li-side{order:0}.li-him{min-height:200px}.li-list{height:auto;max-height:340px}}'
].join('');
function _liStyle(){
  if(!document.getElementById('liPanelStyle')){
    var st=document.createElement('style'); st.id='liPanelStyle';
    st.textContent=_LI_CSS;
    (document.head||document.documentElement).appendChild(st);
  }
  return '';
}
function _liEnsureObserver(){
  if(window._liObs) return;
  try{
    window._liObs=new MutationObserver(function(){
      clearTimeout(window._liObsT);
      window._liObsT=setTimeout(function(){ if(typeof _liInit==='function')_liInit(); },60);
    });
    window._liObs.observe(document.body,{childList:true,subtree:true});
  }catch(e){}
}
function _liImgUrl(p){ var u=p.imagen_url; if(u && typeof fixImgUrl==='function') u=fixImgUrl(u); return u||''; }
function _liMediaHTML(p){
  var u=_liImgUrl(p);
  if(u) return '<img src="'+u+'" alt="" loading="lazy" onerror="this.style.display=\'none\';var s=this.nextElementSibling;if(s)s.style.display=\'flex\'"><span class="li-ph">\uD83C\uDF38</span>';
  return '<span class="li-ph" style="display:flex">\uD83C\uDF38</span>';
}
function _liMarca(p){ return (p.empresa||'').toString(); }
function _liNombre(full){ var s=(full||'').split('|')[0].trim(); var i=s.indexOf(' - '); if(i>=0 && i<24) s=s.slice(i+3).trim(); return s; }
function _liDias(p){ if(!p.ultimo_ingreso_at) return null; var d=Math.floor((Date.now()-new Date(p.ultimo_ingreso_at).getTime())/86400000); return d<0?0:d; }
function _liDiasTxt(p){ var d=_liDias(p); if(d===null) return ''; return d===0?'Hoy':(d===1?'Ayer':'hace '+d+' días'); }
function _liDiasLow(p){ var d=_liDias(p); if(d===null) return 'recién'; return d===0?'hoy':(d===1?'ayer':'hace '+d+' días'); }
function _liPrecio(p){
  try{ if(typeof precioUnitarioCatalogo==='function'){ var v=precioUnitarioCatalogo(p); if(v) return v; } }catch(e){}
  var n=p.precio_min_ars||p.precio_may_ars||p.precio_med_ars||0;
  if(!n) return '';
  try{ return '$'+Number(n).toLocaleString('es-AR'); }catch(e){ return '$'+n; }
}
function _liChip(reg,p){
  var o=reg.opts||{};
  if(o.chip==='ninguno') return '';
  if(o.chip==='texto') return o.chipTexto||'';
  if(reg.tipo==='ingresos') return 'Llegó '+_liDiasLow(p);
  if(reg.tipo==='vendidos') return 'Más vendido';
  if(reg.tipo==='recomendados') return 'Recomendado';
  return o.chipTexto||'';
}
function _liHeroHTML(reg, i){
  var prods=reg.prods, p=prods[i], o=reg.opts||{};
  var chip=_liChip(reg,p);
  var ind=o.indicador||'auto';
  var progreso='';
  var usarDots=(ind==='dots')||(ind==='auto'&&prods.length<=12);
  var usarCount=(ind==='contador')||(ind==='auto'&&prods.length>12);
  if(usarDots){
    progreso='<div class="li-dots">'+prods.map(function(_x,j){return '<i class="'+(j===i?'on':'')+'"></i>';}).join('')+'</div>';
  } else if(usarCount){
    progreso='<div class="li-count">'+(i+1)+' / '+prods.length+'</div>';
  }
  var precio=o.precio?('<div class="li-hprice li-fade">'+_liPrecio(p)+'</div>'):'';
  return (chip?('<div class="li-tag">'+chip+'</div>'):'')+
    '<div class="li-him li-fade">'+_liMediaHTML(p)+'</div>'+
    '<div class="li-fade"><div class="li-hm">'+_liMarca(p)+'</div><div class="li-hn">'+_liNombre(_prodMl(p.nombre, p.ml))+'</div></div>'+
    precio+
    progreso;
}
function _liUltimas(reg,p){
  var o=reg.opts||{};
  if(!o.ultimas) return '';
  var s=(p.stock_actual||0)-(p.reserva||0);
  var um=o.umbral||3;
  if(s>0 && s<=um) return '<span class="li-ult">ÚLTIMAS</span>';
  return '';
}
function _liMiniHTML(reg, i){
  var p=reg.prods[i], o=reg.opts||{};
  var der;
  if(reg.tipo==='vendidos') der='#'+(i+1);
  else if(reg.tipo==='ingresos') der=_liDiasTxt(p);
  else der='';
  var precio=o.precio?('<div class="li-mprice">'+_liPrecio(p)+'</div>'):'';
  var ult=_liUltimas(reg,p);
  var right='';
  if(der||precio||ult){
    right='<div class="li-mr">'+(ult||'')+(der?('<div class="li-mfecha">'+der+'</div>'):'')+precio+'</div>';
  }
  return '<div class="li-mini" data-i="'+i+'">'+
    '<div class="li-mim">'+_liMediaHTML(p)+'</div>'+
    '<div class="li-mtx"><div class="li-mm">'+_liMarca(p)+'</div><div class="li-mn">'+_liNombre(_prodMl(p.nombre, p.ml))+'</div></div>'+
    right+
  '</div>';
}
function _panelRotativoHtml(tipo, titulo, prods, opts){
  if(!prods || !prods.length) return '';
  opts=opts||{};
  _liStyle(); _liEnsureObserver();
  window._liReg = window._liReg || {};
  window._liSeq = (window._liSeq||0)+1;
  var uid = 'li'+window._liSeq+'_'+Date.now();
  var reg = {tipo:tipo, prods:prods, opts:opts, titulo:titulo};
  window._liReg[uid] = reg;
  var listaHtml = prods.map(function(_x,i){ return _liMiniHTML(reg, i); }).join('');
  var heroHtml = _liHeroHTML(reg, 0);
  var lado=(opts.lado==='der')?' li-lado-der':'';
  var altoStyle = opts.alto ? (' style="--li-alto:'+parseInt(opts.alto)+'px"') : '';
  return '<div class="li-wrap'+lado+'" data-li="'+uid+'"'+altoStyle+'>'+
    '<div class="li-hero">'+heroHtml+'</div>'+
    '<div class="li-side"><div class="li-ttl">'+_catEsc(titulo||'')+'</div><div class="li-list">'+listaHtml+'</div></div>'+
  '</div>';
}
function _liInit(){
  window._liReg = window._liReg || {};
  var wraps = document.querySelectorAll('.li-wrap[data-li]');
  Array.prototype.forEach.call(wraps, function(root){
    if(root.getAttribute('data-li-done')==='1') return;
    var uid = root.getAttribute('data-li');
    var reg = window._liReg[uid];
    if(!reg) return;
    root.setAttribute('data-li-done','1');
    var hero = root.querySelector('.li-hero');
    var lista = root.querySelector('.li-list');
    var items = Array.prototype.slice.call(root.querySelectorAll('.li-mini'));
    var prods = reg.prods, o=reg.opts||{}, idx = 0, timer = null;
    var vel = (o.velocidad!=null ? Math.round(parseFloat(o.velocidad)*1000) : 3200);
    if(!vel || vel<800) vel=3200;
    var autoRot = (o.auto!==false);
    function go(i){
      var p = prods[i]; if(!p) return;
      try{ if(typeof cerrarFicha==='function') cerrarFicha(); }catch(e){}
      if(typeof scrollToProduct==='function') scrollToProduct(p.id);
    }
    function setHero(i, scroll){
      idx = (i+prods.length)%prods.length;
      items.forEach(function(el,j){ el.classList.toggle('act', j===idx); });
      var fades = hero.querySelectorAll('.li-fade');
      if(fades.length){ Array.prototype.forEach.call(fades,function(f){ f.style.opacity=0; }); }
      setTimeout(function(){ hero.innerHTML = _liHeroHTML(reg, idx); }, fades.length?150:0);
      if(scroll && items[idx]){
        var el=items[idx], top=el.offsetTop-lista.offsetTop;
        if(top<lista.scrollTop || top+el.offsetHeight>lista.scrollTop+lista.clientHeight){
          try{ lista.scrollTo({top:top-8,behavior:'smooth'}); }catch(e){ lista.scrollTop=top-8; }
        }
      }
    }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } }
    function start(){ if(!autoRot) return; stop(); timer=setInterval(function(){
      if(!document.body.contains(root)){ clearInterval(timer); timer=null; return; }
      setHero(idx+1, true);
    }, vel); }
    items.forEach(function(el,i){
      el.addEventListener('mouseenter', function(){ stop(); setHero(i,false); });
      el.addEventListener('mouseleave', function(){ start(); });
      el.addEventListener('click', function(){ go(i); });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('click', function(){ go(idx); });
    setHero(0,false);
    start();
  });
}
function _styleParec(){
  return '<style>'+
    '.fb-parecidos{margin:.5rem .15rem 1.1rem;padding:1rem 1.05rem .8rem;background:linear-gradient(180deg,#fdfbf7 0%,#f9f4ea 100%);border:1px solid rgba(196,150,90,.28);border-radius:16px;box-shadow:0 6px 22px rgba(120,90,40,.07);position:relative}'+
    '.fb-parec-ttl{font-family:"Cormorant Garamond",serif;font-size:1.4rem;font-weight:600;color:#a9763f;letter-spacing:.01em;margin-bottom:.75rem;display:flex;align-items:center;gap:.6rem;white-space:nowrap}'+
    '.fb-parec-ttl::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(196,150,90,.45),rgba(196,150,90,0))}'+
    '.fb-parec-row{display:flex;gap:.65rem;overflow-x:auto;padding:.1rem .1rem .45rem;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}'+
    '.fb-parec-row::-webkit-scrollbar{height:5px}.fb-parec-row::-webkit-scrollbar-thumb{background:rgba(196,150,90,.35);border-radius:4px}.fb-parec-row::-webkit-scrollbar-track{background:transparent}'+
    '.fb-parec-card{flex:0 0 auto;width:225px;display:flex;align-items:stretch;gap:.6rem;background:#fff;border:1px solid rgba(196,150,90,.16);border-radius:13px;padding:.5rem;cursor:pointer;scroll-snap-align:start;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;box-shadow:0 2px 8px rgba(120,90,40,.05)}'+
    '.fb-parec-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(120,90,40,.14);border-color:rgba(196,150,90,.42)}'+
    '.fb-parec-card:active{transform:scale(.98)}'+
    '.fb-parec-img{flex:0 0 86px;width:86px;height:112px;border-radius:10px;background:radial-gradient(120% 90% at 50% 28%,#ffffff 0%,#f4ece0 100%);border:1px solid rgba(196,150,90,.22);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:inset 0 1px 10px rgba(196,150,90,.08)}'+
    '.fb-parec-img img{width:100%;height:100%;object-fit:contain;padding:7px;mix-blend-mode:multiply}'+
    '.fb-parec-ph{font-size:1.6rem;opacity:.3}'+
    '.fb-parec-nom{flex:1;display:flex;flex-direction:column;justify-content:center;overflow:hidden;padding-right:.2rem}'+
    '.fb-parec-nom-tx{font-family:"Cormorant Garamond",serif;font-size:1.08rem;line-height:1.18;font-weight:600;color:#3a2f22;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}'+
    '.fb-parec-nom-tx::after{content:"";display:block;width:26px;height:2px;margin-top:.4rem;background:linear-gradient(90deg,#c4965a,rgba(196,150,90,.2));border-radius:2px;transition:width .2s}'+
    '.fb-parec-card:hover .fb-parec-nom-tx::after{width:46px}'+
    '[data-theme="dark"] .fb-parecidos{background:linear-gradient(180deg,#1e2231,#191c28);border-color:rgba(232,184,109,.25)}'+
    '[data-theme="dark"] .fb-parec-ttl{color:#e8b86d}'+
    '[data-theme="dark"] .fb-parec-card{background:#222738;border-color:rgba(232,184,109,.16)}'+
    '[data-theme="dark"] .fb-parec-img{background:radial-gradient(120% 90% at 50% 28%,#fff,#ece2d2)}'+
    '[data-theme="dark"] .fb-parec-nom-tx{color:#ece7df}'+
    '@media(max-width:480px){.fb-parec-card{width:200px}.fb-parec-img{flex:0 0 72px;width:72px;height:96px}.fb-parec-nom-tx{font-size:1rem}.fb-parec-ttl{font-size:1.25rem}}'+
    '</style>';
}
function _cardParec(p){
  var nom=(p.nombre||'').split('|')[0].trim();
  var img=p.img!==undefined?p.img:p.imagen_url;
  if(img && typeof fixImgUrl==='function') img=fixImgUrl(img);
  var imgHtml=img
    ? '<img src="'+img+'" alt="" loading="lazy" onerror="this.style.display=\'none\';var s=this.nextElementSibling;if(s)s.style.display=\'flex\'"><span class="fb-parec-ph" style="display:none">🌸</span>'
    : '<span class="fb-parec-ph">🌸</span>';
  return '<div class="fb-parec-card" onclick="if(typeof cerrarFicha===\'function\')cerrarFicha();scrollToProduct('+p.id+')">'+
    '<div class="fb-parec-img">'+imgHtml+'</div>'+
    '<div class="fb-parec-nom"><span class="fb-parec-nom-tx">'+_prodMl(nom, _mlDe(p.id))+'</span></div>'+
  '</div>';
}
function _htmlExtrasFicha(prod, f){
  var html='', par=perfumesParecidos(prod, f, 4);
  var styleAdded=false;
  if(par.length){
    html+='<div class="fb-parecidos"><div class="fb-parec-ttl">También te puede gustar</div><div class="fb-parec-row">';
    par.forEach(function(x){ html+=_cardParec(x); });
    html+='</div></div>';
  }
  // Seguí viendo (excluye el actual y los ya mostrados como parecidos)
  var excl={}; excl[prod.id]=1; par.forEach(function(x){excl[x.id]=1;});
  var vistos=_getVistosParec().filter(function(id){return !excl[id];}), cards='', n=0;
  vistos.forEach(function(id){
    if(n>=4)return; var p=(window.allProds||[]).find(function(pp){return pp.id===id;});
    if(!p)return; n++; cards+=_cardParec(p);
  });
  if(n>0){
    html+='<div class="fb-parecidos"><div class="fb-parec-ttl">Seguí viendo</div><div class="fb-parec-row">'+cards+'</div></div>';
  }
  return html ? (_styleParec()+html) : '';
}

/* 🆕 Desplegable "También te puede gustar" en las cards de la grilla.
   Se calcula LAZY al abrir (ahí las fichas ya están disponibles) para no
   recargar el render de la grilla ni recalcular en cada filtro. */
function togParecCard(id, btn, pid){
  var el=document.getElementById(id);
  if(!el)return;
  var isOpen=(el.style.display!=='none' && el.style.display!=='');
  if(!isOpen && el.getAttribute('data-loaded')!=='1'){
    el.setAttribute('data-loaded','1');
    el.innerHTML=_parecidosInnerCard(pid);
  }
  el.style.display=isOpen?'none':'block';
  if(btn)btn.textContent=isOpen?'+ También te puede gustar':'- También te puede gustar';
}
function _cardParecGrid(x){
  var img=x.img?'<img src="'+x.img+'" alt="" onerror="this.style.display=\'none\'">':'<span style="font-size:1.2rem;opacity:.3">🌸</span>';
  return '<div class="cpar-card" onclick="event.stopPropagation();scrollToProduct('+x.id+')"><div class="cpar-img">'+img+'</div><div class="cpar-nom">'+_prodMl(x.nombre, _mlDe(x.id))+'</div></div>';
}
function _parecidosInnerCard(pid){
  try{
    var p=(window.allProds||[]).find(function(pp){return pp.id===pid;});
    if(!p || (p.kit_componentes && p.kit_componentes.length)) return '<div class="cpar-empty">Sin sugerencias por ahora.</div>';
    var f=fichaMatchProd(p.nombre, FICHAS_BELLE, p.id);
    var lista=perfumesParecidos(p, f, 4);
    if(!lista.length) return '<div class="cpar-empty">Sin sugerencias por ahora.</div>';
    var h='<div class="cpar-row">';
    lista.forEach(function(x){ h+=_cardParecGrid(x); });
    h+='</div>';
    return h;
  }catch(e){ return '<div class="cpar-empty">Sin sugerencias.</div>'; }
}

function renderFichaModal(prod, f){
  var sinFicha=!f||!f.familia_olfativa;
  var nombre=prod.nombre||'';
  var imgHtml=prod.imagen_url?'<img src="'+prod.imagen_url+'" alt="'+nombre+'" onerror="this.style.display=\'none\'">':'<span style="font-size:2.5rem;opacity:.3">🌸</span>';
  
  // Parse nombre para badges
  var partes=nombre.split('|').map(function(p){return p.trim();});
  var nombreCorto=partes[0]||nombre;
  // 🎨 2026-08-08: la marca ya va arriba en grande — no repetirla en el nombre
  // (se prueba con la empresa Y con la marca de la ficha, que a veces difieren)
  [prod.empresa,(f&&f.marca)||''].forEach(function(mm){
    mm=String(mm||'').trim();
    if(mm && nombreCorto.toUpperCase().indexOf(mm.toUpperCase()+' - ')===0) nombreCorto=nombreCorto.slice(mm.length+3);
  });
  var badgesHtml=partes.slice(1).filter(function(p){return p&&p.length<20;}).map(function(p){return'<span class="fb-badge">'+p+'</span>';}).join('');
  
  var html='<div class="fb-header">';
  html+='<span class="fb-corner tl"></span><span class="fb-corner tr"></span><span class="fb-corner bl"></span><span class="fb-corner br"></span>';
  html+='<div class="fb-htop">';
  html+='<div class="fb-img">'+imgHtml+'</div>';
  html+='<div class="fb-info">';
  html+='<div class="fb-marca">'+((f?f.marca:prod.empresa)||prod.empresa||'')+'</div>';
  html+='<div class="fb-deco"><span class="ln"></span><span class="dia"></span><span class="ln r"></span></div>';
  html+='<div class="fb-nombre">'+_prodMl(nombreCorto, prod&&prod.ml)+'</div>';
  html+='<div class="fb-badges">'+badgesHtml+(f&&f.anno?'<span class="fb-badge">'+f.anno+'</span>':'')+(f&&f.genero?'<span class="fb-badge">'+f.genero+'</span>':'')+'</div>';
  html+='</div></div>';
  
  if(!sinFicha&&f.familia_olfativa){
    html+='<div class="fb-familia">';
    f.familia_olfativa.split(/[\/,]/).forEach(function(a){a=a.trim();if(a)html+='<span class="fb-fam-chip">'+a+'</span>';});
    // ✨ Chip ≈ usa el nombre limpio (inspirado_en_nombre) si existe, sino inspirado_en (legacy)
    var insp_lbl = (f.inspirado_en_nombre && String(f.inspirado_en_nombre).trim()) ||
                   (f.inspirado_en ? f.inspirado_en.split('(')[0].trim() : '');
    if(insp_lbl) html+='<span class="fb-insp">≈ '+insp_lbl+'</span>';
    html+='</div>';
  }
  html+='</div>'; // /header
  
  if(sinFicha){
    html+='<div class="fb-body"><div style="text-align:center;padding:2rem;color:#9a8060"><div style="font-size:2rem;margin-bottom:.5rem">📋</div><div style="font-size:.85rem">Esta fragancia aún no tiene ficha técnica detallada.</div><div style="font-size:.72rem;margin-top:.4rem;color:#c4965a">Consultanos para más información.</div></div></div>';
    html+='<div class="fb-footer"><div class="fb-footer-logo">⚜ Distribuidora Belle</div><div class="fb-footer-url">distribuidorabelle.com</div></div>';
    return html;
  }
  
  html+='<div class="fb-body"><div class="fb-grid">';

  // === MOMENTO DEL DÍA + ESTACIONES (en lugar del bloque de acordes de familia olfativa) ===
  html+='<div class="fb-section">';
  html+='<div class="fb-stitle">Momento del día</div>';
  html+='<div class="fb-diurno">';
  html+='<div class="fb-diurno-seg" style="background:'+(hasMom(f.momento_dia,'día')||hasMom(f.momento_dia,'dia')||hasMom(f.momento_dia,'mañana')?'#b3d9ff;color:#1565c0':'#e8e0d0;color:#aaa')+'">☀️ Día</div>';
  html+='<div class="fb-diurno-seg" style="background:'+(hasMom(f.momento_dia,'tarde')?'#ffd54f;color:#e65100':'#e8e0d0;color:#aaa')+'">🌤 Tarde</div>';
  html+='<div class="fb-diurno-seg" style="background:'+(hasMom(f.momento_dia,'noche')?'#3949ab;color:#fff':'#e8e0d0;color:#aaa')+'">🌙 Noche</div>';
  html+='</div>';
  if(f.ocasion){
    html+='<div style="font-size:.62rem;color:#9a8060;margin:.5rem 0 .3rem;text-transform:uppercase;letter-spacing:.08em">Ocasión</div>';
    html+='<div class="fb-chips">'+f.ocasion.split(',').map(function(o){return'<span class="fb-chip">'+o.trim()+'</span>';}).join('')+'</div>';
  }
  html+='</div>';
  html+='<div class="fb-section">';
  html+='<div class="fb-stitle">Estaciones</div>';
  html+='<div class="fb-estaciones">';
  var ests=[['❄️','Invierno','#e3f2fd','#1565c0'],['🌸','Primavera','#e8f5e9','#2e7d32'],['☀️','Verano','#fff8e1','#f57f17'],['🍂','Otoño','#fff3e0','#bf360c']];
  ests.forEach(function(e){
    var activo=hasEst(f.estacion,e[1]);
    html+='<div class="fb-est'+(activo?'':' off')+'" style="background:'+e[2]+';color:'+e[3]+'">'+e[0]+' '+e[1]+'</div>';
  });
  html+='</div>';
  if(f.clima)html+='<div style="font-size:.65rem;color:#9a8060;margin-top:.5rem">☁️ '+f.clima+'</div>';
  html+='</div>';
 
  // Perfil olfativo
  var pLevel=getPrLevel(f.proyeccion);
  var pDots='';for(var i=0;i<5;i++)pDots+='<div class="fb-proy-dot'+(i<pLevel?' off':'')+'"></div>';
  // invert: filled = active
  pDots='';for(var i=0;i<5;i++)pDots+='<div class="fb-proy-dot'+(i>=pLevel?' off':'')+'"></div>';
  html+='<div class="fb-section">';
  html+='<div class="fb-stitle">Perfil olfativo</div>';
  html+='<div class="fb-perf-grid">';
  html+='<div class="fb-perf-item"><div class="fb-perf-icon">⏱</div><div class="fb-perf-lbl">Duración</div><div class="fb-perf-val">'+getDurText(f.duracion)+'</div></div>';
  html+='<div class="fb-perf-item"><div class="fb-perf-icon">≈</div><div class="fb-perf-lbl">Estela</div><div class="fb-perf-val">'+getEstelaText(f.estela)+'</div></div>';
  html+='<div class="fb-perf-item" style="grid-column:1/-1"><div class="fb-perf-lbl">Proyección</div><div class="fb-proy-dots">'+pDots+'</div><div style="font-size:.6rem;color:#9a8060;margin-top:.15rem">'+f.proyeccion+'</div></div>';
  html+='</div>';
  if(f.color_liquido){
    var lc=liquidColorFicha(f.color_liquido);
    html+='<div class="fb-liquid"><div class="fb-liq-dot" style="background:'+lc+'"></div><span style="font-size:.7rem;color:#6b5a3e">'+f.color_liquido+'</span></div>';
  }
  html+='</div>';
  
  // Perfil usuario — gráfico visual
  // 🐛 FIX 2026-05-23: bug de detección de género arreglado
  // ANTES: el regex de hombre incluía "el\b" que matcheaba cualquier artículo "el"
  //         dentro del texto (ej: "Para el día" en perfil femenino → UNISEX falso)
  // AHORA: usa el campo f.genero de la BD como FUENTE DE VERDAD.
  //        Solo si está vacío, parsea perfil_usuario con regex de palabras completas.
  //        Default: UNISEX (si no hay info suficiente).
  if(f.perfil_usuario || f.genero || f.estilo_descripcion || f.rango_edad_min || f.rango_edad_max){
    html+='<div class="fb-section">';
    html+='<div class="fb-stitle">Perfil de usuario</div>';

    var pu = f.perfil_usuario || '';

    // === DETECTAR GÉNERO (nueva lógica) ===
    var esMujer = false, esHombre = false, esUnisex = false;

    // PRIORIDAD 1: campo f.genero de la BD (fuente de verdad)
    if(f.genero && String(f.genero).trim()){
      var g = String(f.genero).toLowerCase().trim();
      // Chequear PRIMERO género específico — "Femenino (unisex en práctica)" debe ser MUJER
      if(g.indexOf('femenin') >= 0 || g === 'mujer' || g === 'mujeres' || g === 'f'){
        esMujer = true;
      }
      else if(g.indexOf('masculin') >= 0 || g === 'hombre' || g === 'hombres' || g === 'm'){
        esHombre = true;
      }
      else if(g.indexOf('unisex') >= 0 || g.indexOf('ambos') >= 0){
        esUnisex = true;
      }
      else {
        // Valor raro o desconocido → unisex por defecto
        esUnisex = true;
      }
    }
    // PRIORIDAD 2: parsear perfil_usuario (con regex arreglados)
    else if(pu){
      // Detectar primero combinaciones explícitas de unisex
      // "mujeres y hombres" / "hombres y mujeres" / "unisex" / "ambos"
      if(/mujer\w*\s+y\s+hombre\w*|hombre\w*\s+y\s+mujer\w*|\bunisex\b|ambos sexos|ambos g[eé]neros/i.test(pu)){
        esUnisex = true;
      } else {
        // Regex con \b (palabra completa) — NO matchea "el" suelto
        esMujer  = /\bmujeres?\b|\bfemenin\w*\b|\bfemale\b|\bellas?\b/i.test(pu);
        esHombre = /\bhombres?\b|\bmasculin\w*\b|\bmale\b/i.test(pu);
        if(esMujer && esHombre){ esUnisex = true; esMujer = false; esHombre = false; }
        else if(!esMujer && !esHombre){ esUnisex = true; }  // default si no detecta nada
      }
    }
    // PRIORIDAD 3: sin info → UNISEX por defecto
    else {
      esUnisex = true;
    }

    // Detectar rango de edad
    // 👤 PRIORIDAD 1 (2026-05-25): campos estructurados nuevos
    var edadMin, edadMax;
    if(f.rango_edad_min || f.rango_edad_max){
      edadMin = f.rango_edad_min ? parseInt(f.rango_edad_min) : 20;
      edadMax = f.rango_edad_max ? parseInt(f.rango_edad_max) : (f.rango_edad_min ? 70 : 40);
    } else {
      // PRIORIDAD 2 (legacy): parsear perfil_usuario con regex
      var edades = pu ? (pu.match(/(\d{1,2})[‐\-–a-z ]+(\d{2})\s*a[ñn]/i) || pu.match(/(\d{1,2})[\s\-–]+(\d{2})/)) : null;
      edadMin = edades ? parseInt(edades[1]) : 20;
      edadMax = edades ? parseInt(edades[2]) : 40;
    }

    // Iconos de género
    var generoHtml='';
    if(esUnisex){
      generoHtml='<div style="display:flex;gap:.5rem;align-items:center">'
        +'<span style="font-size:1.4rem">👩</span>'
        +'<span style="font-size:.65rem;color:#9a8060;font-weight:600">UNISEX</span>'
        +'<span style="font-size:1.4rem">👨</span>'
        +'</div>';
    } else if(esMujer){
      generoHtml='<div style="display:flex;gap:.5rem;align-items:center">'
        +'<span style="font-size:1.6rem">👩</span>'
        +'<span style="font-size:.68rem;color:#c4965a;font-weight:700;letter-spacing:.05em">PARA ELLA</span>'
        +'</div>';
    } else if(esHombre){
      generoHtml='<div style="display:flex;gap:.5rem;align-items:center">'
        +'<span style="font-size:1.6rem">👨</span>'
        +'<span style="font-size:.68rem;color:#c4965a;font-weight:700;letter-spacing:.05em">PARA ÉL</span>'
        +'</div>';
    } else {
      generoHtml='<div style="font-size:1.4rem">🧑</div>';
    }

    // Barra de edad — rangos 15-25 / 25-35 / 35-50 / 50+
    var rangos=[
      {label:'15–25',min:15,max:25},
      {label:'25–35',min:25,max:35},
      {label:'35–50',min:35,max:50},
      {label:'50+',min:50,max:70}
    ];
    var barrasHtml=rangos.map(function(r){
      // overlap entre el rango detectado y el rango de la barra
      var overlap=Math.max(0,Math.min(edadMax,r.max)-Math.max(edadMin,r.min));
      var rango_size=r.max-r.min;
      var intensity=Math.min(1,overlap/rango_size);
      var bg=intensity>0.6?'#c4965a':intensity>0.2?'rgba(196,150,90,.45)':'rgba(196,150,90,.1)';
      var tc=intensity>0.6?'#fff':'#9a8060';
      return '<div style="flex:1;text-align:center">'
        +'<div style="height:28px;border-radius:6px;background:'+bg+';margin-bottom:.25rem;display:flex;align-items:center;justify-content:center">'
        +'<span style="font-size:.58rem;font-weight:700;color:'+tc+'">'+r.label+'</span>'
        +'</div>'
        +'</div>';
    }).join('');
    
    // Descripción corta — extraer solo el estilo
    // 👤 PRIORIDAD 1 (2026-05-25): campo estilo_descripcion estructurado (sin edad ya)
    // PRIORIDAD 2 (legacy): parsear perfil_usuario quitando género y edad por regex
    var desc='';
    if(f.estilo_descripcion && String(f.estilo_descripcion).trim()){
      desc = String(f.estilo_descripcion).trim();
      if(desc.length>120) desc=desc.substring(0,117)+'...';
    } else if(pu){
      desc=pu.replace(/[Hh]ombres?[^.]*\.?/,'').replace(/[Mm]ujeres?[^.]*\.?/,'').replace(/\d+[‐\-–a-z ]+\d+\s*años?\.?/gi,'').trim();
      if(desc.length>120) desc=desc.substring(0,117)+'...';
    }
    
    html+='<div style="display:flex;gap:1.2rem;align-items:flex-start;flex-wrap:wrap">';
    
    // Col izq — género
    html+='<div style="display:flex;flex-direction:column;align-items:center;gap:.4rem;min-width:80px">';
    html+=generoHtml;
    html+='</div>';
    
    // Col der — edad + descripción
    html+='<div style="flex:1;min-width:160px">';
    html+='<div style="font-size:.6rem;color:#9a8060;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.4rem">Rango de edad</div>';
    html+='<div style="display:flex;gap:.25rem;margin-bottom:.6rem">'+barrasHtml+'</div>';
    if(desc){
      html+='<div style="font-size:.72rem;color:#6b5a3e;line-height:1.45;font-style:italic">'+desc+'</div>';
    }
    html+='</div>';
    
    html+='</div>'; // flex
    html+='</div>'; // section
  }

  // Pirámide olfativa con fotos
  if(f.notas_salida||f.notas_corazon||f.notas_fondo){
    html+='<div class="fb-section full">';
    html+='<div class="fb-stitle">Pirámide olfativa</div>';
    var notasTiers=[
      {key:'notas_salida',label:'Salida',color:'#f9a825',dot:'#f9a825'},
      {key:'notas_corazon',label:'Corazón',color:'#e91e8c',dot:'#e91e8c'},
      {key:'notas_fondo',label:'Fondo',color:'#5c6bc0',dot:'#5c6bc0'}
    ];
    notasTiers.forEach(function(tier){
      var notasStr=f[tier.key]||'';
      if(!notasStr)return;
      // 🌸 FIX 2026-08-08: algunas fichas tienen "Notas de corazón: ..." incrustado
      // DENTRO del campo de salida (sin coma) — eso generaba "notas" larguísimas sin
      // foto. Se cortan esos encabezados como separadores y se limpian restos.
      var notas=String(notasStr)
        .replace(/notas?\s+de\s+(salida|coraz[oó]n|fondo|cabeza|base|inicio)\s*:?/gi,',')
        .split(/[,;]/).map(function(n){return n.trim();})
        .filter(function(n){return n && n.length<40;});
      html+='<div class="fb-nota-tier">';
      html+='<div class="fb-nota-tier-header">';
      html+='<div class="fb-nota-dot" style="background:'+tier.dot+'"></div>';
      html+='<div class="fb-nota-tipo">'+tier.label+'</div>';
      html+='</div>';
      html+='<div class="fb-notas-fotos">';
      // FIX (2026-05-11): solo admin/vendedor ven el cursor pointer y pueden clickear notas.
      // Para el público, las notas son solo visuales.
      var _esAdmCat = !!window._catAdminMode;
      notas.forEach(function(nota){
        // \ud83c\udf38 FIX 2026-08-08: resolver \u00fanico \u2014 ahora S\u00cd mira notas_maestras (la tabla
        // del admin) y normaliza igual en todos lados. Antes la clave sin colapsar
        // espacios ni consultar la tabla dejaba notas con la foto gen\u00e9rica o rota.
        var notaKey2=(typeof _normNota==='function')?_normNota(nota):String(nota||'').toLowerCase();
        var fotoFinal=(typeof notaFotoDe==='function')?notaFotoDe(nota):(NOTAS_FOTOS_USER[notaKey2]||getNotaFoto(nota));
        if(_esAdmCat){
          html+='<div class="fb-nota-foto-item" data-nota="'+nota+'" data-key="'+notaKey2+'" onclick="abrirEditorNota(this.dataset.nota,this.dataset.key)" title="Clic para cambiar foto" style="cursor:pointer">';
        } else {
          html+='<div class="fb-nota-foto-item" style="cursor:default">';
        }
        html+='<img src="'+fotoFinal+'" alt="'+nota+'" class="fb-nota-img" loading="lazy" onerror="this.src=NOTAS_FOTOS[\'_default\']">';
        html+='<div class="fb-nota-nombre">'+nota+'</div>';
        html+='</div>';
      });
      html+='</div>';
      html+='</div>';
    });
    html+='</div>';
  }
  
  // === ACORDES (solo Supabase) ===
  var acList=[];
  try{acList=Array.isArray(prod.acordes)?prod.acordes:(prod.acordes?JSON.parse(prod.acordes):[]);}catch(e2){acList=[];}
  if(acList.length){
    html+='<div class="fb-section full">';
    html+='<div class="fb-stitle">Acordes principales</div>';
    var maxPct=Math.max.apply(null,acList.map(function(a){return a.pct||50;}));
    acList.forEach(function(a){
      var color=a.color||'#888';
      var w=Math.round((a.pct||50)/maxPct*100);
      var lum=(parseInt(color.slice(1,3),16)*0.299+parseInt(color.slice(3,5),16)*0.587+parseInt(color.slice(5,7),16)*0.114)/255;
      var tc=lum>0.5?'#1a1a1a':'#ffffff';
      html+='<div class="fb-acorde-row"><div class="fb-acorde-label">'+a.nombre+'</div><div class="fb-acorde-bar-wrap"><div class="fb-acorde-bar-fill" style="width:'+w+'%;background:'+color+';color:'+tc+'"></div></div><div class="fb-acorde-pct">'+(a.pct||50)+'%</div></div>';
    });
    html+='</div>';
  }

// Descripción
  if(f.descripcion){
    html+='<div class="fb-section full">';
    html+='<div class="fb-stitle">Descripción sensorial</div>';
    html+='<div class="fb-desc">'+_catEsc(f.descripcion)+'"</div>';
    html+='</div>';
  }
  

  
  // Inspirado en
  // ✨ 2026-05-25: si hay imagen, mostrarla al lado. Nombre destacado + descripción debajo
  var hayInspNombre = f.inspirado_en_nombre && String(f.inspirado_en_nombre).trim();
  var hayInspDesc = f.inspirado_en && String(f.inspirado_en).trim() &&
                    (!hayInspNombre || String(f.inspirado_en).trim() !== String(f.inspirado_en_nombre).trim());
  // 🆕 2026-06-17: inspiraciones extra (las que van después de la principal en f.inspiraciones)
  var inspExtras = (Array.isArray(f.inspiraciones) ? f.inspiraciones.slice(1) : []).filter(function(it){
    return it && ((it.nombre&&String(it.nombre).trim()) || (it.texto&&String(it.texto).trim()) || (it.imagen_url&&String(it.imagen_url).trim()));
  });
  if(hayInspNombre || hayInspDesc || f.inspirado_en_imagen_url || inspExtras.length){
    var inspImgUrl = '';
    // Si hay producto vinculado, buscar su imagen en el catálogo
    if(f.inspirado_en_producto_id && Array.isArray(window.prods)){
      var prodVinc = window.prods.find(function(p){return p.id===f.inspirado_en_producto_id;});
      if(prodVinc && prodVinc.imagen_url) inspImgUrl = prodVinc.imagen_url;
    }
    // Si no hay producto vinculado pero hay imagen manual (URL externa o upload)
    if(!inspImgUrl && f.inspirado_en_imagen_url) inspImgUrl = f.inspirado_en_imagen_url;

    var nombreMostrar = hayInspNombre ? f.inspirado_en_nombre :
                        (f.inspirado_en ? f.inspirado_en.split('(')[0].trim() : '');

    html+='<div class="fb-section full" style="background:rgba(196,150,90,.03)">';
    html+='<div class="fb-stitle">Inspiración</div>';
    html+='<div style="display:flex;gap:.7rem;align-items:flex-start">';
    if(inspImgUrl){
      html+='<img src="'+inspImgUrl+'" style="width:60px;height:60px;object-fit:contain;border-radius:8px;background:#fff;border:1px solid rgba(196,150,90,.25);flex-shrink:0" onerror="this.style.display=\'none\'">';
    }
    html+='<div style="flex:1;min-width:0">';
    if(nombreMostrar){
      html+='<div style="font-size:.85rem;color:#6b5a3e;font-weight:600;line-height:1.3">≈ '+nombreMostrar+'</div>';
    }
    if(hayInspDesc){
      html+='<div style="font-size:.7rem;color:#9a8060;margin-top:.25rem;line-height:1.4">'+f.inspirado_en+'</div>';
    }
    html+='</div></div>'; // /text col /flex row (principal)
    // 🆕 Inspiraciones adicionales (cada una con su imagen + nombre + descripción)
    if(inspExtras.length){
      var _ie=function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};
      inspExtras.forEach(function(it){
        var im=it.imagen_url?String(it.imagen_url):'';
        html+='<div style="display:flex;gap:.7rem;align-items:flex-start;margin-top:.6rem;padding-top:.6rem;border-top:1px solid rgba(196,150,90,.12)">';
        if(im){
          html+='<img src="'+_ie(im)+'" style="width:60px;height:60px;object-fit:contain;border-radius:8px;background:#fff;border:1px solid rgba(196,150,90,.25);flex-shrink:0" onerror="this.style.display=\'none\'">';
        }
        html+='<div style="flex:1;min-width:0">';
        if(it.nombre && String(it.nombre).trim()){
          html+='<div style="font-size:.85rem;color:#6b5a3e;font-weight:600;line-height:1.3">≈ '+_ie(String(it.nombre).trim())+'</div>';
        }
        if(it.texto && String(it.texto).trim()){
          html+='<div style="font-size:.7rem;color:#9a8060;margin-top:.25rem;line-height:1.4">'+_ie(String(it.texto).trim())+'</div>';
        }
        html+='</div></div>';
      });
    }
    html+='</div>'; // /section
  }
  
  html+='</div></div>'; // /grid /body
  
  // 🆕 TANDA 1: "También te puede gustar" + "Seguí viendo"
  html+=_htmlExtrasFicha(prod, f);
  
  // Footer
  html+='<div class="fb-footer">';
  html+='<div style="display:flex;flex-direction:column;gap:.15rem">';
  html+='<div class="fb-footer-logo">⚜ Distribuidora Belle</div>';
  html+='<div class="fb-footer-url">distribuidorabelle.com</div>';
  html+='</div>';
  html+='<div class="fb-share-btns">';
  html+='<button class="fb-share-btn" onclick="fichaCompartirLink('+prod.id+')">🔗 Link</button>';
  html+='<button class="fb-share-btn" onclick="fichaExportarJPG()">🖼 Imagen</button>';
  html+='<button class="fb-share-btn" onclick="fichaExportarPDF()">📄 PDF</button>';
  html+='</div></div>';
  
  return html;
}

function fichaCompartirLink(prodId){
  var url=location.href.split('?')[0]+'?ficha='+prodId;
  // Sin acceso al portapapeles: se muestra el link en un campo para copiarlo a mano.
  var mostrarLink=function(){ _catPreguntar({titulo:'Copiá el link', texto:'No pudimos copiarlo solo. Seleccionalo y copialo a mano:', ok:'Listo', cancelar:'Cerrar', campo:{label:'Link', valor:url, tipo:'text'}}); };
  navigator.clipboard?navigator.clipboard.writeText(url).then(function(){_catToast('Link copiado!','tok');}).catch(mostrarLink):mostrarLink();
}

// ════════════════════════════════════════════════════════════════════
// 🖼️ Helpers de captura (2026-08-08) — portados de card.html.
// html2canvas deja EN BLANCO las imágenes de otros dominios (Supabase,
// Unsplash): hay que convertirlas a base64 antes. Si el dominio no da
// permiso CORS, se reintenta por el proxy de imágenes.
// ════════════════════════════════════════════════════════════════════
function _fichaImgB64(url){
  return new Promise(function(resolve){
    if(!url||url.indexOf('data:')===0){resolve(url);return;}
    function _toData(blob){
      if(!blob){resolve(null);return;}
      var reader=new FileReader();
      reader.onloadend=function(){resolve(reader.result);};
      reader.onerror=function(){resolve(null);};
      reader.readAsDataURL(blob);
    }
    function _viaProxy(){
      var limpio=url.replace(/^https?:\/\//,'');
      var prox='https://images.weserv.nl/?url='+encodeURIComponent(limpio);
      fetch(prox,{cache:'force-cache'}).then(function(r){return r.ok?r.blob():null;}).then(_toData).catch(function(){resolve(null);});
    }
    fetch(url,{mode:'cors',cache:'force-cache'}).then(function(r){
      if(!r.ok){_viaProxy();return null;}
      return r.blob();
    }).then(function(blob){
      if(blob===null)return;
      if(!blob){_viaProxy();return;}
      _toData(blob);
    }).catch(function(){_viaProxy();});
  });
}
function _fichaPrecargarImgs(el){
  var imgs=Array.prototype.slice.call(el.querySelectorAll('img'));
  var originales=imgs.map(function(img){return {el:img,src:img.src};});
  var promesas=imgs.map(function(img){
    var src=img.src;
    if(!src||src.indexOf('data:')===0)return Promise.resolve();
    return _fichaImgB64(src).then(function(dataUrl){
      if(dataUrl){img.src=dataUrl;}
      else{img.style.visibility='hidden';}   // rota: mejor no mostrar un cuadrado en blanco
    });
  });
  return Promise.all(promesas).then(function(){
    return { restaurar:function(){originales.forEach(function(o){o.el.src=o.src;o.el.style.visibility='';});} };
  });
}

// ════════════════════════════════════════════════════════════════════
// 📱 DESCARGA EN FORMATO HISTORIA (1080×1920) — 2026-08-08
// Una sola imagen prolija, armada al estilo card.html: fondo con el color
// dominante del perfume, foto protagonista, marca y nombre grandes,
// pirámide con fotos, acordes y momentos. Nada de tiras interminables.
// ════════════════════════════════════════════════════════════════════
function fichaExportarJPG(){
  var prod=window._fichaActualProd, f=window._fichaActualData;
  if(!prod){_catToast('No hay ficha abierta','twarn');return;}
  if(typeof html2canvas==='undefined'){_catToast('Cargando librerías, reintentá en un momento...','twarn');return;}
  _catToast('Generando imagen...','tok');
  var col=window._fichaColorRGB||[74,52,110];
  var r=col[0],g=col[1],b=col[2];
  var dark1='rgb('+Math.round(r*0.26)+','+Math.round(g*0.20)+','+Math.round(b*0.20)+')';
  var dark2='rgb('+Math.round(r*0.48)+','+Math.round(g*0.36)+','+Math.round(b*0.34)+')';
  var esc=function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};

  var nombre=String(prod.nombre||'');
  var brArr=nombre.split('|').map(function(x){return x.trim();});
  var nombreCorto=brArr[0]||nombre;
  var marca=(f&&f.marca)||prod.empresa||'';
  // sacar la marca del nombre probando la empresa Y la marca de la ficha
  // (a veces la ficha dice "MARCA — País" y no coincide con el prefijo del nombre)
  [prod.empresa,(f&&f.marca)||''].forEach(function(mm){
    mm=String(mm||'').trim();
    if(mm && nombreCorto.toUpperCase().indexOf(mm.toUpperCase()+' - ')===0) nombreCorto=nombreCorto.slice(mm.length+3);
  });
  var badges=brArr.slice(1).filter(function(x){return x&&x.length<20;});
  if(prod.ml&&!/\d+\s*ml/i.test(nombreCorto)&&badges.join(' ').toLowerCase().indexOf('ml')<0)badges.push(prod.ml+' ML');
  if(f&&f.genero)badges.push(f.genero);
  badges=badges.slice(0,4);

  var oro='#e8c88f', oroL='rgba(232,200,143,.55)';
  var h='';
  h+='<div style="position:absolute;inset:26px;border:2px solid '+oroL+';pointer-events:none"></div>';
  ['top:14px;left:14px;border-right:none;border-bottom:none','top:14px;right:14px;border-left:none;border-bottom:none',
   'bottom:14px;left:14px;border-right:none;border-top:none','bottom:14px;right:14px;border-left:none;border-top:none'
  ].forEach(function(pos){ h+='<div style="position:absolute;width:44px;height:44px;border:2.5px solid '+oro+';'+pos+'"></div>'; });

  // ── zona de color: foto + marca + nombre (el fondo oscuro es DE ESTA sección,
  //    así el corte con la zona clara siempre cae después de las familias) ──
  h+='<div style="padding:62px 70px 32px;text-align:center;position:relative;background:linear-gradient(165deg,'+dark1+' 0%,'+dark2+' 100%)">';
  h+='<div style="position:absolute;top:-160px;left:50%;transform:translateX(-50%);width:820px;height:820px;background:radial-gradient(circle,rgba('+r+','+g+','+b+',.55) 0%,transparent 65%);pointer-events:none"></div>';
  var _imgStory=(window._fichaImgLimpiaId===prod.id&&window._fichaImgLimpia)?window._fichaImgLimpia:prod.imagen_url;
  if(_imgStory) h+='<img src="'+esc(_imgStory)+'" style="max-height:300px;max-width:64%;object-fit:contain;filter:drop-shadow(0 26px 44px rgba(0,0,0,.55));position:relative">';
  h+='<div style="margin-top:20px;font-size:27px;letter-spacing:.44em;text-transform:uppercase;color:'+oro+';font-weight:500;position:relative">'+esc(marca)+'</div>';
  h+='<div style="display:flex;align-items:center;justify-content:center;gap:16px;margin:15px 0 11px"><span style="width:100px;height:2px;background:linear-gradient(90deg,transparent,'+oro+')"></span><span style="width:10px;height:10px;background:'+oro+';transform:rotate(45deg)"></span><span style="width:100px;height:2px;background:linear-gradient(90deg,'+oro+',transparent)"></span></div>';
  h+='<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:60px;font-weight:700;color:#fff;line-height:1.06;position:relative">'+esc(nombreCorto)+'</div>';
  if(f&&f.anno)badges.push(String(f.anno));
  badges=badges.slice(0,5);
  if(badges.length){
    h+='<div style="display:flex;gap:11px;justify-content:center;flex-wrap:wrap;margin-top:16px;position:relative">'+badges.map(function(x){
      return '<span style="border:1.5px solid '+oroL+';color:'+oro+';padding:6px 20px;border-radius:40px;font-size:21px;letter-spacing:.06em">'+esc(x)+'</span>';
    }).join('')+'</div>';
  }
  // ≈ inspiración / creación original
  var _inspStory=(f&&f.inspirado_en_nombre&&String(f.inspirado_en_nombre).trim())||'';
  if(_inspStory) h+='<div style="margin-top:13px;font-size:22px;color:rgba(255,255,255,.75);position:relative">≈ Al estilo de <b style="color:'+oro+'">'+esc(_inspStory)+'</b></div>';
  if(f&&f.familia_olfativa){
    h+='<div style="display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin-top:14px;position:relative">'+
      f.familia_olfativa.split(/[\/,]/).map(function(x){return x.trim();}).filter(Boolean).slice(0,5).map(function(x){
        return '<span style="background:rgba(232,200,143,.16);color:'+oro+';padding:5px 18px;border-radius:40px;font-size:20px">'+esc(x)+'</span>';
      }).join('')+'</div>';
  }
  h+='</div>';

  // ── zona clara: TODA la data en cajitas compactas (mismo espíritu que la
  //    "Ficha informativa" del panel del cliente, con el formato Belle) ──
  h+='<div style="flex:1;min-height:0;overflow:hidden;background:linear-gradient(180deg,rgba('+r+','+g+','+b+',.14),rgba('+r+','+g+','+b+',.05) 340px,rgba('+r+','+g+','+b+',0)),#f6f1e7;padding:20px 48px 18px;display:flex;flex-direction:column;justify-content:space-evenly;position:relative">';
  var CAJA='background:rgba(255,255,255,.72);border:1.5px solid rgba(196,150,90,.28);border-radius:16px;padding:14px 18px;';
  var TIT='font-size:19px;letter-spacing:.2em;color:#8a7350;font-weight:700;margin-bottom:9px;display:flex;align-items:center;gap:9px;';
  function tit(t){return '<div style="'+TIT+'"><span style="width:16px;height:3px;background:#c4965a;border-radius:2px;display:inline-block"></span>'+t+'</div>';}

  // fila 1: pirámide (izq) + momento/estaciones/perfil/acordes (der)
  h+='<div style="display:flex;gap:16px;align-items:stretch;margin-bottom:14px">';

  // ── Col A: pirámide con FOTOS ──
  h+='<div style="flex:1.15;'+CAJA+'">'+tit('🧴 PIRÁMIDE');
  var tiers=[["notas_salida","Salida","#d99a26"],["notas_corazon","Corazón","#c2447e"],["notas_fondo","Fondo","#5c6bc0"]];
  var hayNotas=f&&(f.notas_salida||f.notas_corazon||f.notas_fondo);
  if(hayNotas){
    tiers.forEach(function(t){
      var s=(f&&f[t[0]])||''; if(!s)return;
      var todasN=String(s).replace(/notas?\s+de\s+(salida|coraz[oó]n|fondo|cabeza|base|inicio)\s*:?/gi,',').split(/[,;]/).map(function(x){return x.trim();}).filter(function(x){return x&&x.length<40;});
      var notas=todasN.slice(0,4), extra=todasN.length-notas.length;
      if(!notas.length)return;
      h+='<div style="margin-bottom:7px">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><span style="width:10px;height:10px;border-radius:50%;background:'+t[2]+'"></span><span style="font-size:18px;letter-spacing:.14em;color:#8a7350;font-weight:600;text-transform:uppercase">'+t[1]+'</span>'+(extra>0?'<span style="font-size:15px;color:#b0a080">+'+extra+'</span>':'')+'</div>';
      h+='<div style="display:flex;gap:12px">'+notas.map(function(n){
        var foto=(typeof notaFotoDe==='function')?notaFotoDe(n):'';
        return '<div style="width:98px;text-align:center">'+
          (foto?'<img src="'+esc(foto)+'" style="width:76px;height:76px;border-radius:50%;object-fit:cover;border:2.5px solid rgba(196,150,90,.55);box-shadow:0 4px 10px rgba(90,60,20,.22)">':'<div style="width:76px;height:76px;border-radius:50%;background:rgba(196,150,90,.15);display:inline-block"></div>')+
          '<div style="font-size:16px;color:#5e5040;margin-top:5px;line-height:1.12;overflow:hidden;max-height:36px">'+esc(n)+'</div></div>';
      }).join('')+'</div></div>';
    });
  } else { h+='<div style="font-size:18px;color:#9a8060;font-style:italic">Sin notas cargadas</div>'; }
  h+='</div>';

  // ── Col B: momento · estaciones · perfil · acordes ──
  h+='<div style="flex:1;display:flex;flex-direction:column;gap:11px">';
  // Momento
  var momOn=function(k){return f&&f.momento_dia&&(hasMom(f.momento_dia,k)||(k==='día'&&(hasMom(f.momento_dia,'dia')||hasMom(f.momento_dia,'mañana'))));};
  h+='<div style="'+CAJA+'">'+tit('🕐 MOMENTO');
  h+='<div style="display:flex;border-radius:10px;overflow:hidden">'+[['☀️','Día','día','#b3d9ff','#1565c0'],['🌤','Tarde','tarde','#ffd54f','#7a4c00'],['🌙','Noche','noche','#3949ab','#fff']].map(function(m){
    var on=momOn(m[2]);
    return '<div style="flex:1;text-align:center;padding:10px 0;font-size:19px;font-weight:600;background:'+(on?m[3]:'#eee7d8')+';color:'+(on?m[4]:'#b5ab97')+'">'+m[0]+' '+m[1]+'</div>';
  }).join('')+'</div></div>';
  // Estaciones
  h+='<div style="'+CAJA+'">'+tit('🌦 ESTACIONES');
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+[['❄️','Invierno','#e3f2fd','#1565c0'],['🌸','Primavera','#e8f5e9','#2e7d32'],['☀️','Verano','#fff8e1','#b58000'],['🍂','Otoño','#fff3e0','#bf360c']].map(function(e){
    var on=f&&f.estacion&&hasEst(f.estacion,e[1]);
    return '<div style="border-radius:9px;padding:8px 4px;text-align:center;font-size:18px;font-weight:600;background:'+(on?e[2]:'#eee7d8')+';color:'+(on?e[3]:'#b5ab97')+';'+(on?'':'filter:grayscale(1);opacity:.55')+'">'+e[0]+' '+e[1]+'</div>';
  }).join('')+'</div></div>';
  // Perfil olfativo (barras)
  if(f&&(f.proyeccion||f.duracion||f.estela)){
    var niv=function(v){ try{return (typeof _gtNivel==='function')?_gtNivel(v):60;}catch(e){return 60;} };
    h+='<div style="'+CAJA+'">'+tit('📊 PERFIL');
    [['📡 Proyección',f.proyeccion],['⏱ Duración',f.duracion],['💨 Estela',f.estela]].forEach(function(p){
      if(!p[1])return;
      h+='<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;font-size:17px;color:#5e5040;margin-bottom:4px"><span>'+p[0]+'</span><span style="color:#8a7350;max-width:56%;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(p[1])+'</span></div>'+
        '<div style="height:13px;background:rgba(196,150,90,.14);border-radius:7px;overflow:hidden"><div style="height:100%;width:'+niv(p[1])+'%;background:linear-gradient(90deg,#c4965a,#a9763f);border-radius:7px"></div></div></div>';
    });
    h+='</div>';
  }
  // Acordes (mini)
  var acList=[];try{acList=Array.isArray(prod.acordes)?prod.acordes:(prod.acordes?JSON.parse(prod.acordes):[]);}catch(e){}
  if(acList.length){
    acList=acList.slice().sort(function(a,c){return (c.pct||0)-(a.pct||0);}).slice(0,3);
    var maxPct=Math.max.apply(null,acList.map(function(a){return a.pct||50;}));
    h+='<div style="'+CAJA+'flex:1">'+tit('🎨 ACORDES');
    acList.forEach(function(a){
      var w=Math.round((a.pct||50)/maxPct*100);
      h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px"><span style="width:132px;font-size:17px;color:#5e5040;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(a.nombre||'')+'</span><span style="flex:1;height:17px;background:rgba(255,255,255,.7);border-radius:5px;overflow:hidden;display:block"><span style="display:block;height:100%;width:'+w+'%;background:'+(a.color||'#c4965a')+'"></span></span></div>';
    });
    h+='</div>';
  }
  h+='</div>';   // /col B
  h+='</div>';   // /fila 1

  // fila 2: ocasión + usuario
  var ocasArr=(f&&f.ocasion)?String(f.ocasion).split(',').map(function(x){return x.trim();}).filter(Boolean).slice(0,4):[];
  var usrLinea=[];
  if(f&&f.genero)usrLinea.push('👤 '+esc(f.genero));
  if(f&&(f.rango_edad_min||f.rango_edad_max))usrLinea.push('🎂 '+esc((f.rango_edad_min||'?')+'–'+(f.rango_edad_max||'?')+' años'));
  var usrEstilo=(f&&f.estilo_descripcion)?String(f.estilo_descripcion):'';
  if(ocasArr.length||usrLinea.length||usrEstilo){
    h+='<div style="display:flex;gap:16px;margin-bottom:14px">';
    if(ocasArr.length){
      h+='<div style="flex:1;'+CAJA+'">'+tit('🎯 OCASIÓN');
      h+='<div style="display:flex;gap:8px;flex-wrap:wrap">'+ocasArr.map(function(o){return '<span style="background:#f5f0e8;border:1px solid rgba(196,150,90,.3);color:#6b5a3e;padding:6px 16px;border-radius:30px;font-size:17px">'+esc(o)+'</span>';}).join('')+'</div></div>';
    }
    if(usrLinea.length||usrEstilo){
      h+='<div style="flex:1;'+CAJA+'">'+tit('💫 USUARIO');
      h+='<div style="font-size:18px;color:#5e5040;line-height:1.4">'+usrLinea.join(' &nbsp;·&nbsp; ')+(usrEstilo?'<div style="font-size:16px;color:#8a7350;font-style:italic;margin-top:5px;overflow:hidden;max-height:44px">✨ '+esc(usrEstilo)+'</div>':'')+'</div></div>';
    }
    h+='</div>';
  }

  // fila 3: descripción sensorial (recortada con elegancia)
  if(f&&f.descripcion){
    var descTxt=String(f.descripcion); if(descTxt.length>185)descTxt=descTxt.slice(0,182).replace(/\s+\S*$/,'')+'…';
    h+='<div style="'+CAJA+'margin-bottom:12px;text-align:center"><div style="font-size:18px;color:#6b5a3e;font-style:italic;line-height:1.45">“'+esc(descTxt)+'”</div></div>';
  }
  // footer
  h+='<div style="text-align:center;padding-top:10px;border-top:1px solid rgba(154,128,80,.35)">';
  h+='<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:38px;color:#34302a">Distribuidora <span style="color:#86703f">Belle</span></div>';
  h+='<div style="font-size:22px;letter-spacing:.14em;color:#86703f;margin-top:3px">distribuidorabelle.com</div>';
  h+='</div>';
  h+='</div>';

  var story=document.createElement('div');
  story.id='_fichaStory';
  story.style.cssText='position:fixed;left:-12000px;top:0;width:1080px;height:1920px;display:flex;flex-direction:column;background:#f6f1e7;font-family:\'DM Sans\',\'Jost\',sans-serif;overflow:hidden;z-index:-1';
  story.innerHTML=h;
  document.body.appendChild(story);

  var nombreArchivo=String(prod.nombre||'ficha').replace(/\s*\|.*/,'').trim().replace(/[^a-zA-Z0-9]/g,'_');
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve())
  .then(function(){return _fichaPrecargarImgs(story);})
  .then(function(){ return new Promise(function(res){setTimeout(res,150);}); })
  .then(function(){ return _libsPdf(); })
  .then(function(){
    return html2canvas(story,{scale:1,useCORS:true,allowTaint:true,backgroundColor:'#1a1209',logging:false,imageTimeout:0,
      onclone:function(doc){var s=doc.createElement('style');s.textContent='*{animation:none!important;transition:none!important}';doc.head.appendChild(s);
        var st=doc.getElementById('_fichaStory'); if(st){st.style.left='0';st.style.zIndex='1';}}
    });
  }).then(function(canvas){
    story.remove();
    var a=document.createElement('a');
    a.href=canvas.toDataURL('image/jpeg',0.92);
    a.download='Belle_'+nombreArchivo+'_historia.jpg';
    a.click();
    _catToast('Historia descargada ✓','tok');
  }).catch(function(e){
    story.remove();
    console.error('[ficha historia]',e);
    _catToast('Error al exportar: '+(e&&e.message||''),'terr');
  });
}
function fichaExportarPDF(){
  var el=document.getElementById('moFichaContent');
  if(!el){_catToast('No hay ficha abierta','twarn');return;}
  if(typeof html2canvas==='undefined'||typeof window.jspdf==='undefined'){
    _libsPdf().then(function(){ fichaExportarPDF(); }).catch(function(){ _catToast('No se pudieron cargar las librerías de PDF','terr'); });
    return;
  }
  var prod=window._fichaActualProd;
  var nombre=prod?prod.nombre.replace(/\s*\|.*/,'').trim():'ficha';
  var btn=el.querySelector('.fb-share-btns');
  if(btn)btn.style.visibility='hidden';
  // 🌸 FIX 2026-08-08: precargar las imágenes a base64 — sin esto las fotos de
  // notas y del perfume salían EN BLANCO en el PDF (cross-origin).
  var _hRest=null;
  _fichaPrecargarImgs(el).then(function(hh){
    _hRest=hh;
    return new Promise(function(res){setTimeout(res,120);});
  }).then(function(){
    return html2canvas(el,{
      scale:2,useCORS:true,allowTaint:true,
      backgroundColor:'#fdf8f0',logging:false,imageTimeout:0
    });
  }).then(function(canvas){
    if(_hRest)_hRest.restaurar();
    if(btn)btn.style.visibility='visible';
    var imgData=canvas.toDataURL('image/jpeg',0.93);
    var pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    var pw=pdf.internal.pageSize.getWidth();
    var ph=pdf.internal.pageSize.getHeight();
    var cw=canvas.width, ch=canvas.height;
    var ratio=cw/ch;
    var imgW=pw, imgH=imgW/ratio;
    if(imgH>ph){imgH=ph;imgW=imgH*ratio;}
    var x=(pw-imgW)/2, y=0;
    pdf.addImage(imgData,'JPEG',x,y,imgW,imgH);
    pdf.save('Belle_'+nombre.replace(/[^a-zA-Z0-9]/g,'_')+'.pdf');
  }).catch(function(e){
    if(_hRest)try{_hRest.restaurar();}catch(_e){}
    if(btn)btn.style.visibility='visible';
    _catToast('Error al exportar: '+e.message,'terr');
  });
}

// === COMPARADOR ===
var _compIds=[];
function abrirComparador(){
  if(_compIds.length<2){_catToast("Seleccioná al menos 2 perfumes para comparar","twarn");return;}
  window.open("comparador.html?ids="+_compIds.join(","),"_blank");
}

function foxClose(){
  var fox=document.getElementById('foxModal')||document.getElementById('contactModal');
  if(fox)fox.style.display='none';
}
function foxSend(){
  var name=document.getElementById('foxName')||document.getElementById('contactName');
  var msg=document.getElementById('foxMsg')||document.getElementById('contactMsg');
  if(name&&msg&&msg.value.trim()){
    _catToast('Mensaje enviado. Te contactaremos pronto.','tok');
    foxClose();
  } else {
    _catToast('Por favor completá el mensaje.','twarn');
  }
}

//]]>


// ============================================================
// COMPARADOR MODAL
// ============================================================
var _compSelIds=[];

function abrirModalComparador(){
  _compSelIds=[];
  var mo=document.getElementById('moComparadorBelle');
  mo.style.display='block';
  document.body.style.overflow='hidden';
  compActualizarSeleccionados();
  compRenderGraficos();
  setTimeout(function(){
    var s=document.getElementById('compSrch');
    if(s){s.value='';s.focus();}
    var res=document.getElementById('compResultados');
    if(res)res.style.display='none';
  },50);
}

function cerrarModalComparador(){
  document.getElementById('moComparadorBelle').style.display='none';
  document.body.style.overflow='';
}

function compBuscar(q){
  var res=document.getElementById('compResultados');
  if(!q||q.length<2){res.style.display='none';return;}
  var lower=q.toLowerCase();
  var matches=(allProds||[]).filter(function(p){
    return (p.nombre||'').toLowerCase().indexOf(lower)>=0;
  }).slice(0,8);
  if(!matches.length){res.style.display='none';return;}
  res.style.display='block';
  res.innerHTML=matches.map(function(p){
    var sel=_compSelIds.indexOf(p.id)>=0;
    var bg=sel?'rgba(196,150,90,.12)':'var(--bg-body)';
    var imgHtml=p.imagen_url
      ?'<img src="'+p.imagen_url+'" style="width:32px;height:32px;object-fit:contain;border-radius:5px;background:#fff;flex-shrink:0">'
      :'<div style="width:32px;height:32px;background:#2a2a3e;border-radius:5px;flex-shrink:0"></div>';
    var tagHtml=sel
      ?'<span style="color:var(--accent);font-size:.68rem;font-weight:700;flex-shrink:0">✓</span>'
      :'<span style="color:var(--tx-mid);font-size:.68rem;flex-shrink:0">+</span>';
    return '<div data-pid="'+p.id+'" style="display:flex;align-items:center;gap:.5rem;padding:.4rem .6rem;cursor:pointer;border-radius:8px;background:'+bg+';margin-bottom:.15rem">'
      +imgHtml
      +'<div style="flex:1;min-width:0">'
        +'<div style="font-size:.73rem;color:var(--tx-main);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+_prodMl(p.nombre,p.ml)+'</div>'
        +'<div style="font-size:.6rem;color:var(--tx-mid)">'+(p.empresa||'')+'</div>'
      +'</div>'
      +tagHtml
      +'</div>';
  }).join('');
  // Evento click delegado — sin inline handlers
  res.onclick=function(e){
    var item=e.target.closest('[data-pid]');
    if(!item)return;
    e.stopPropagation();
    compToggle(parseInt(item.dataset.pid));
  };
}

function compToggle(prodId){
  var idx=_compSelIds.indexOf(prodId);
  if(idx>=0){
    _compSelIds.splice(idx,1);
  } else {
    if(_compSelIds.length>=4){_catToast('Máximo 4 perfumes','twarn');return;}
    _compSelIds.push(prodId);
  }
  var q=document.getElementById('compSrch').value;
  if(q)compBuscar(q);
  compActualizarSeleccionados();
  compRenderGraficos();
}

function compActualizarSeleccionados(){
  var el=document.getElementById('compSeleccionados');
  if(!_compSelIds.length){
    el.innerHTML='<div style="font-size:.75rem;color:#9a8060">Ningún perfume seleccionado — buscá arriba</div>';
    return;
  }
  el.innerHTML=_compSelIds.map(function(id){
    var p=(allProds||[]).find(function(x){return x.id===id;});
    if(!p)return '';
    var nombre=(p.nombre||'').split('|')[0].trim().split(' - ').slice(1).join(' - ').trim()||p.nombre;
    nombre=_prodMl(nombre.substring(0,22), p.ml);
    return '<div style="display:flex;align-items:center;gap:.3rem;padding:.25rem .5rem .25rem .3rem;background:rgba(77,150,255,.12);border:1px solid rgba(77,150,255,.3);border-radius:20px">'
      +(p.imagen_url?'<img src="'+p.imagen_url+'" style="width:20px;height:20px;object-fit:contain;border-radius:4px;background:#fff">':'')
      +'<span style="font-size:.63rem;color:#4d96ff">'+nombre+'</span>'
      +'<button data-rem="'+id+'" style="background:none;border:none;color:rgba(77,150,255,.6);cursor:pointer;padding:0 0 0 .1rem;font-size:.75rem;line-height:1">✕</button>'
      +'</div>';
  }).join('');
  el.onclick=function(e){
    var btn=e.target.closest('[data-rem]');
    if(!btn)return;
    e.stopPropagation();
    compToggle(parseInt(btn.dataset.rem));
  };
}

// ── Helper: categoriza una nota olfativa y devuelve emoji + categoría ──
function _compClasificarNota(nota){
  if(!nota) return {emoji:'✨',cat:'otros',color:'#999'};
  var n=nota.toLowerCase().trim();
  // CÍTRICOS 🍋
  if(/bergamot|limón|limon|naranja|mandarin|pomelo|toronja|lima|yuzu|cítric|citric|neroli|petitgrain|cidra/i.test(n)) return {emoji:'🍋',cat:'Cítrico',color:'#f5c542'};
  // FRUTAS 🍑
  if(/manzana|pera|piña|pina|durazno|melocotón|melocoton|frambuesa|fresa|cereza|grosell|cassis|frutos rojos|frutas rojas|mora|arándano|arandano|frutal|fruta|guayaba|maracuyá|maracuya|melón|melon|sandía|sandia|coco|mango|lichi|lichee|ciruela|granada|albaricoque|membrillo|kiwi|papaya|higo|caqui/i.test(n)) return {emoji:'🍑',cat:'Frutal',color:'#ff8c5a'};
  // FLORES 🌸
  if(/rosa|jazmín|jazmin|azahar|tuberosa|tuberose|nardo|gardenia|peonía|peonia|orquídea|orquidea|lirio|magnolia|fresia|violeta|narciso|lavanda|lavandín|lavandin|geranio|ylang|iris|heliotropo|madreselva|flor|floral|loto|jacinto|salvia esclarea|osmant|hibisco|champaca|frangipan/i.test(n)) return {emoji:'🌸',cat:'Floral',color:'#e88aa8'};
  // ESPECIAS 🌶️
  if(/canela|cardamomo|pimienta|clavo|nuez moscada|jengibre|azafrán|azafran|comino|anís|anis|cilantro|coriandro|especia|especiad|cúrcuma|curcuma|saffron/i.test(n)) return {emoji:'🌶️',cat:'Especiado',color:'#d4623c'};
  // MADERAS 🪵
  if(/sándalo|sandalo|cedro|pachulí|pachuli|patchouli|vetiver|guayaco|guaiac|gaiac|abedul|amyris|cipriol|akigalawood|amberwood|driftwood|ámbar gris|ambar gris|maderas|amaderad|wood|cashmer|cachemira|palo de rosa|cedrat|musgo|chypre/i.test(n)) return {emoji:'🪵',cat:'Amaderado',color:'#8b6f47'};
  // OUD/ÁMBAR 🟫
  if(/oud|agar|agarwood|incienso|mirra|olíbano|olibano|ámbar(?!\s*gris)|ambar(?!\s*gris)|ládano|ladano|labdanum|benjuí|benjui|benzu/i.test(n)) return {emoji:'🌑',cat:'Ámbar/Oud',color:'#7a3d1a'};
  // GOURMAND 🍫
  if(/vainilla|tonka|caramelo|chocolate|cacao|café|cafe|coñac|conac|ron|whisky|bourbon|miel|toffee|praliné|praline|almend|nuez|avellana|pistacho|leche|merengue|panna cotta|cookies|kanafeh|knafeh|gummy|dulce de leche|moca|biscuit|gourmand/i.test(n)) return {emoji:'🍫',cat:'Gourmand',color:'#7d4e2a'};
  // VERDES/HERBALES 🌿
  if(/verde|hoja|menta|romero|albahaca|tomillo|hierba|grass|té|te|matcha|alcaravea|enebro|junípero|junipero|estragón|estragon|hinojo|gálbano|galbano|ruibarbo|aloe|fig leaf|hoja de tomate|cipres|ciprés/i.test(n)) return {emoji:'🌿',cat:'Verde/Herbal',color:'#5a9b62'};
  // ACUÁTICO/MARINO 🌊
  if(/marin|marina|acuát|acuat|mar|océan|ocean|algas|sal|aire|ozónic|ozonic|salty|water|agua|aqua|cascalone|petrichor|lluvia|notas frescas/i.test(n)) return {emoji:'🌊',cat:'Acuático',color:'#5a9bc4'};
  // ALMIZCLE/PIEL 🤍
  if(/almizcle|musk|cetalox|ambroxan|ambrette|cuero|leather/i.test(n)) return {emoji:'🤍',cat:'Almizcle/Piel',color:'#b8a99a'};
  // TABACO/CAFÉ AHUMADO ☁️
  if(/tabaco|tobacco|humo|smok|ahumad|abedul ahumado|tea|cuero ahumado/i.test(n)) return {emoji:'💨',cat:'Tabaco/Ahumado',color:'#5a4a3a'};
  return {emoji:'✨',cat:'Otros',color:'#999'};
}

// ── Helper: descompone notas de un campo "x, y, z" en array limpio ──
function _compNotasArray(str){
  if(!str) return [];
  return str.split(',').map(function(s){return s.trim();}).filter(function(s){return s.length>0;});
}

// ── Helper: calcula score de similitud entre 2 fichas (0-100) ──
function _compSimilitud(f1,f2){
  if(!f1||!f2) return 0;
  var score=0, max=0;
  // Notas en común (peso 50)
  var n1=[].concat(_compNotasArray(f1.notas_salida),_compNotasArray(f1.notas_corazon),_compNotasArray(f1.notas_fondo)).map(function(x){return x.toLowerCase();});
  var n2=[].concat(_compNotasArray(f2.notas_salida),_compNotasArray(f2.notas_corazon),_compNotasArray(f2.notas_fondo)).map(function(x){return x.toLowerCase();});
  var comunes=n1.filter(function(n){return n2.indexOf(n)>=0;}).length;
  var total=Math.max(n1.length,n2.length);
  if(total>0){score+=50*(comunes/total);}
  max+=50;
  // Familia olfativa (peso 30)
  if(f1.familia_olfativa&&f2.familia_olfativa){
    var f1f=f1.familia_olfativa.toLowerCase().split(/[\/,]/).map(function(x){return x.trim();});
    var f2f=f2.familia_olfativa.toLowerCase().split(/[\/,]/).map(function(x){return x.trim();});
    var fc=f1f.filter(function(x){return f2f.indexOf(x)>=0;}).length;
    if(Math.max(f1f.length,f2f.length)>0){score+=30*(fc/Math.max(f1f.length,f2f.length));}
  }
  max+=30;
  // Atributos comunes (peso 20)
  ['momento_dia','estacion','ocasion','clima','genero'].forEach(function(k){
    max+=4;
    if(f1[k]&&f2[k]&&f1[k].toLowerCase()===f2[k].toLowerCase())score+=4;
  });
  return Math.round((score/max)*100);
}

function compRenderGraficos(){
  var el=document.getElementById('compGraficos');
  if(_compSelIds.length<2){
    el.innerHTML='<div style="text-align:center;padding:3rem 1rem;color:var(--tx-mid)">'
      +'<div style="font-size:2.5rem;margin-bottom:.8rem;opacity:.4">⚖</div>'
      +'<div style="font-size:.88rem;font-weight:600;color:var(--tx-mid)">Seleccioná al menos 2 perfumes</div>'
      +'<div style="font-size:.72rem;margin-top:.3rem;opacity:.7">Podés comparar hasta 4 fragancias</div>'
      +'</div>';
    return;
  }
  var prods=_compSelIds.map(function(id){return (allProds||[]).find(function(x){return x.id===id;});}).filter(Boolean);
  var fichas=prods.map(function(p){return fichaMatchProd(p.nombre,FICHAS_BELLE,p.id)||null;});
  // Paleta acordes a la web
  var colores=['#c4965a','#5a8fc4','#c45a8f','#5ac47a'];
  var coloresBg=['rgba(196,150,90,.12)','rgba(90,143,196,.12)','rgba(196,90,143,.12)','rgba(90,196,122,.12)'];
  var coloresBd=['rgba(196,150,90,.4)','rgba(90,143,196,.4)','rgba(196,90,143,.4)','rgba(90,196,122,.4)'];
  var html='';

  // Helper para nombre corto
  function nomCorto(p,max){
    if(!p)return '';
    max=max||22;
    var nm=(p.nombre||'').split('|')[0].trim();
    var perf=nm.split(' - ').slice(1).join(' - ').trim()||nm;
    return _prodMl(perf.substring(0,max), p.ml);
  }

  // ── BLOQUE 1: CARDS DE PERFUMES ENRIQUECIDAS ──
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.8rem;margin-bottom:1.4rem">';
  prods.forEach(function(p,i){
    var f=fichas[i];
    var nombre=(p.nombre||'').split('|')[0].trim();
    var marca=nombre.split(' - ')[0].trim();
    var perfume=nombre.split(' - ').slice(1).join(' - ').trim()||nombre;
    var conc='';
    if(f&&f.concentracion&&f.concentracion.trim())conc=f.concentracion.trim();
    else{var m=(p.nombre||'').match(/\b(EDP|EDT|EDC|EXP|Extrait|Parfum|Cologne)\b/i);if(m)conc=m[0];}
    html+='<div style="border-radius:14px;overflow:hidden;border:2px solid '+coloresBd[i]+';background:'+coloresBg[i]+';position:relative">'
      +'<div style="height:4px;background:'+colores[i]+'"></div>'
      +'<div style="padding:.8rem">'
        +(p.imagen_url?'<img src="'+p.imagen_url+'" style="width:70px;height:70px;object-fit:contain;border-radius:8px;background:var(--bg-cimg);display:block;margin:0 auto .55rem">':'<div style="width:70px;height:70px;border-radius:8px;background:var(--bg-cimg);margin:0 auto .55rem"></div>')
        +'<div style="font-size:.55rem;font-weight:700;color:'+colores[i]+';text-transform:uppercase;letter-spacing:.06em;text-align:center;margin-bottom:.2rem">'+marca+'</div>'
        +'<div style="font-size:.74rem;font-weight:700;color:var(--tx-main);text-align:center;line-height:1.25;margin-bottom:.35rem">'+_prodMl(perfume.substring(0,32), p.ml)+'</div>'
        +(conc?'<div style="text-align:center;margin-bottom:.3rem"><span style="display:inline-block;padding:.1rem .4rem;border-radius:8px;background:'+colores[i]+';color:#fff;font-size:.55rem;font-weight:700;letter-spacing:.05em">'+conc+'</span></div>':'')
        +(f&&f.familia_olfativa?'<div style="font-size:.6rem;color:var(--tx-mid);text-align:center;line-height:1.3;font-style:italic">'+f.familia_olfativa.split('/')[0].trim().substring(0,30)+'</div>':'')
        +(function(){
          // ✨ 2026-05-25: chip ≈ usa nombre limpio del dupe si existe, sino el legacy
          if(!f) return '';
          var insp = (f.inspirado_en_nombre && String(f.inspirado_en_nombre).trim()) ||
                     (f.inspirado_en ? f.inspirado_en.split('(')[0].trim() : '');
          if(!insp) return '';
          return '<div style="font-size:.55rem;color:var(--tx-mid);text-align:center;margin-top:.4rem;padding-top:.4rem;border-top:1px dashed '+coloresBd[i]+';line-height:1.3">↪ '+insp.substring(0,40)+(insp.length>40?'…':'')+'</div>';
        })()
      +'</div>'
    +'</div>';
  });
  html+='</div>';

  // ════════ ⭐ PREMIUM 2026-06-17: veredicto · premios · precios · solapamiento · notas únicas ════════
  (function(){
    var nMap={};
    fichas.forEach(function(f,i){
      if(!f) return;
      ['notas_salida','notas_corazon','notas_fondo'].forEach(function(k){
        _compNotasArray(f[k]||'').forEach(function(n){
          var key=n.toLowerCase().trim(); if(!key) return;
          if(!nMap[key]) nMap[key]={original:n,perf:[]};
          if(nMap[key].perf.indexOf(i)<0) nMap[key].perf.push(i);
        });
      });
    });
    var todas=Object.keys(nMap);
    var enComun=todas.filter(function(k){return nMap[k].perf.length>=2;});
    function nrm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
    var atributos=[['familia_olfativa'],['genero'],['momento_dia'],['estacion'],['clima'],['ocasion'],['proyeccion'],['duracion'],['estela']];
    var coincidenAttr=0, attrConDatos=0;
    atributos.forEach(function(a){
      var vals=fichas.map(function(f){return f?nrm(f[a[0]]):'';}).filter(Boolean);
      if(vals.length<fichas.length) return;
      attrConDatos++;
      var primero=vals[0];
      if(vals.every(function(v){return v===primero;})) coincidenAttr++;
    });
    var precios=prods.map(function(p){ try{var r=calcP(p);return (r&&r.pi)||0;}catch(e){return 0;} });
    var preciosValidos=precios.filter(function(x){return x>0;});
    var minPrecio=preciosValidos.length?Math.min.apply(null,preciosValidos):0;
    function mapInt(val){
      if(!val) return 0; var v=String(val).toLowerCase();
      if(/nuclear|beast|bestial|extrem/.test(v)) return 5;
      if(/muy (alta|larga)|intens/.test(v)) return 4;
      if(/alta|larga/.test(v)) return 3;
      if(/moderada|media|notable/.test(v)) return 2;
      if(/baja|corta|discreta|leve/.test(v)) return 1;
      return 0;
    }
    function versatilidad(f){ if(!f) return 0; var s=[f.estacion,f.momento_dia,f.clima,f.ocasion].join(' ').toLowerCase(); var c=0; if(/todo el a/.test(s))c++; if(/vers[aá]til/.test(s))c++; if(/\btodo\b/.test(s))c++; return c; }
    function ganador(scoreFn){
      var best=-1, bi=-1, tie=false;
      fichas.forEach(function(f,i){ var s=scoreFn(f); if(s>best){best=s;bi=i;tie=false;} else if(s===best&&best>0){tie=true;} });
      return best>0&&!tie?bi:-1;
    }
    var premios=[
      {label:'Mayor proyección', emoji:'💨', i:ganador(function(f){return mapInt(f&&f.proyeccion);})},
      {label:'Más duradero', emoji:'⏱️', i:ganador(function(f){return mapInt(f&&f.duracion);})},
      {label:'Mayor estela', emoji:'🌫️', i:ganador(function(f){return mapInt(f&&f.estela);})},
      {label:'Más versátil', emoji:'🔄', i:ganador(versatilidad)},
      {label:'Más económico', emoji:'💲', i:(minPrecio>0?precios.indexOf(minPrecio):-1)}
    ].filter(function(x){return x.i>=0;});

    var h='';
    // 1) Veredicto
    h+='<div style="background:linear-gradient(135deg,#fff,'+coloresBg[0]+');border:1px solid var(--border-color);border-radius:16px;padding:1.1rem 1.2rem;margin-bottom:1.2rem">';
    h+='<div style="display:flex;flex-wrap:wrap;gap:.8rem;justify-content:space-around;text-align:center">';
    if(_compSelIds.length===2&&fichas[0]&&fichas[1]){
      var sim=_compSimilitud(fichas[0],fichas[1]);
      h+='<div><div style="font-size:1.8rem;font-weight:800;color:var(--accent);line-height:1">'+sim+'%</div><div style="font-size:.58rem;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.05em">Similitud</div></div>';
    }
    h+='<div><div style="font-size:1.8rem;font-weight:800;color:var(--tx-main);line-height:1">'+enComun.length+'</div><div style="font-size:.58rem;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.05em">Notas en común</div></div>';
    h+='<div><div style="font-size:1.8rem;font-weight:800;color:var(--tx-main);line-height:1">'+coincidenAttr+'/'+attrConDatos+'</div><div style="font-size:.58rem;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.05em">Atributos iguales</div></div>';
    if(minPrecio>0){ h+='<div><div style="font-size:1.35rem;font-weight:800;color:#3a8a4a;line-height:1.3">$'+minPrecio.toLocaleString('es-AR')+'</div><div style="font-size:.58rem;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.05em">Desde</div></div>'; }
    h+='</div></div>';

    // 2) Premios por categoría
    if(premios.length){
      h+='<div style="margin-bottom:1.2rem"><div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.7rem">🏆 Quién gana en cada cosa</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:.6rem">';
      premios.forEach(function(pr){
        var p=prods[pr.i];
        h+='<div style="background:'+coloresBg[pr.i]+';border:1px solid '+coloresBd[pr.i]+';border-radius:12px;padding:.7rem;text-align:center">'
          +'<div style="font-size:1.3rem;margin-bottom:.15rem">'+pr.emoji+'</div>'
          +'<div style="font-size:.56rem;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.2rem">'+pr.label+'</div>'
          +'<div style="font-size:.72rem;font-weight:700;color:'+colores[pr.i]+';line-height:1.2">'+nomCorto(p,20)+'</div>'
        +'</div>';
      });
      h+='</div></div>';
    }

    // 3) Precios lado a lado
    if(preciosValidos.length){
      h+='<div style="margin-bottom:1.2rem"><div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.7rem">💲 Precio de lista (por unidad)</div>';
      h+='<div style="display:grid;grid-template-columns:repeat('+prods.length+',1fr);gap:.6rem">';
      prods.forEach(function(p,i){
        var pr=precios[i];
        var esMin=pr>0&&pr===minPrecio&&preciosValidos.length>1;
        h+='<div style="text-align:center;background:'+coloresBg[i]+';border:1px solid '+coloresBd[i]+';border-radius:12px;padding:.8rem .5rem .7rem;position:relative">'
          +(esMin?'<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#3a8a4a;color:#fff;font-size:.5rem;font-weight:700;padding:.1rem .5rem;border-radius:10px;white-space:nowrap">MÁS BARATO</div>':'')
          +'<div style="font-size:.58rem;color:'+colores[i]+';font-weight:700;margin-bottom:.25rem">'+nomCorto(p,16)+'</div>'
          +'<div style="font-size:1.05rem;font-weight:800;color:var(--tx-main)">'+(pr>0?'$'+pr.toLocaleString('es-AR'):'—')+'</div>'
        +'</div>';
      });
      h+='</div></div>';
    }

    // 4) Solapamiento de notas
    h+='<div style="background:var(--bg-header);border-radius:14px;padding:1rem;border:1px solid var(--border-color);margin-bottom:1.2rem">';
    h+='<div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.8rem">🧩 Notas: en común vs propias</div>';
    var maxTot=1;
    var perfStats=prods.map(function(p,i){
      var prop=0,com=0;
      todas.forEach(function(k){ if(nMap[k].perf.indexOf(i)>=0){ if(nMap[k].perf.length>=2)com++; else prop++; } });
      var t=prop+com; if(t>maxTot)maxTot=t;
      return {prop:prop,com:com,tot:t};
    });
    prods.forEach(function(p,i){
      var st=perfStats[i];
      var comW=st.tot?Math.round(st.com/maxTot*100):0;
      var propW=st.tot?Math.round(st.prop/maxTot*100):0;
      h+='<div style="margin-bottom:.6rem">'
        +'<div style="display:flex;justify-content:space-between;font-size:.62rem;color:var(--tx-mid);margin-bottom:.25rem"><span style="font-weight:600;color:'+colores[i]+'">'+nomCorto(p,22)+'</span><span>'+st.com+' en común · '+st.prop+' propias</span></div>'
        +'<div style="display:flex;height:14px;border-radius:7px;overflow:hidden;background:var(--border-color)">'
          +'<div style="width:'+comW+'%;background:repeating-linear-gradient(45deg,var(--accent),var(--accent) 6px,#d8b079 6px,#d8b079 12px)"></div>'
          +'<div style="width:'+propW+'%;background:'+colores[i]+'"></div>'
        +'</div>'
      +'</div>';
    });
    h+='<div style="font-size:.55rem;color:var(--tx-mid);margin-top:.4rem"><span style="display:inline-block;width:10px;height:10px;background:var(--accent);border-radius:2px;vertical-align:middle"></span> rayado = comparten · <span style="display:inline-block;width:10px;height:10px;background:'+colores[0]+';border-radius:2px;vertical-align:middle"></span> liso = propias de cada uno</div>';
    h+='</div>';

    // 5) Notas únicas con fotos
    var hayUnicas=prods.some(function(p,i){ return todas.some(function(k){return nMap[k].perf.length===1&&nMap[k].perf[0]===i;}); });
    if(hayUnicas){
      h+='<div style="margin-bottom:1.2rem"><div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.7rem">🔍 Lo que tiene cada uno (y el otro no)</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.7rem">';
      prods.forEach(function(p,i){
        var unicas=todas.filter(function(k){return nMap[k].perf.length===1&&nMap[k].perf[0]===i;}).map(function(k){return nMap[k].original;});
        h+='<div style="border-radius:12px;border:1px solid '+coloresBd[i]+';background:'+coloresBg[i]+';padding:.7rem">'
          +'<div style="font-size:.66rem;font-weight:700;color:'+colores[i]+';margin-bottom:.55rem">'+nomCorto(p,22)+'</div>';
        if(unicas.length){
          h+='<div style="display:flex;flex-wrap:wrap;gap:.3rem">';
          unicas.slice(0,14).forEach(function(n){
            var foto=(typeof getNotaFoto==='function')?getNotaFoto(n):'';
            var ic=foto?'<img src="'+foto+'" style="width:18px;height:18px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid var(--border-color)" loading="lazy" onerror="if(typeof NOTAS_FOTOS!==\'undefined\')this.src=NOTAS_FOTOS._default;">':'<span style="font-size:.7rem">'+_compClasificarNota(n).emoji+'</span>';
            h+='<span style="display:inline-flex;align-items:center;gap:.25rem;background:var(--bg-card);border:1px solid var(--border-color);border-radius:12px;padding:.12rem .45rem .12rem .15rem;font-size:.58rem;color:var(--tx-main);text-transform:capitalize">'+ic+n+'</span>';
          });
          h+='</div>';
        } else {
          h+='<div style="font-size:.62rem;color:var(--tx-mid);font-style:italic">Todas sus notas las comparte</div>';
        }
        h+='</div>';
      });
      h+='</div></div>';
    }

    html+=h;
  })();

  // ── BLOQUE 2: SCORE DE SIMILITUD (solo si hay 2 perfumes) ──
  if(_compSelIds.length===2&&fichas[0]&&fichas[1]){
    var sim=_compSimilitud(fichas[0],fichas[1]);
    var simLabel='Muy diferentes';var simColor='#c45a5a';
    if(sim>=70){simLabel='Casi gemelos';simColor='#5ac47a';}
    else if(sim>=50){simLabel='Muy parecidos';simColor='#c4965a';}
    else if(sim>=30){simLabel='Algunas coincidencias';simColor='#c4a55a';}
    html+='<div style="background:var(--bg-header);border-radius:14px;padding:1.1rem;border:1px solid var(--border-color);margin-bottom:1.2rem">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.7rem">'
        +'<div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em">🎯 Similitud entre los dos</div>'
        +'<div style="font-size:1.4rem;font-weight:700;color:'+simColor+'">'+sim+'%</div>'
      +'</div>'
      +'<div style="position:relative;height:10px;background:var(--border-color);border-radius:5px;overflow:hidden;margin-bottom:.5rem">'
        +'<div style="position:absolute;top:0;left:0;height:100%;width:'+sim+'%;background:linear-gradient(90deg,'+colores[0]+','+colores[1]+');border-radius:5px;transition:width .8s ease"></div>'
      +'</div>'
      +'<div style="font-size:.72rem;color:'+simColor+';font-weight:600;text-align:center">'+simLabel+'</div>'
    +'</div>';
  }

  // ── BLOQUE 3: COINCIDENCIAS DESTACADAS (notas en común con iconos grandes) ──
  var notasMap={};
  fichas.forEach(function(f,i){
    if(!f)return;
    ['notas_salida','notas_corazon','notas_fondo'].forEach(function(k,kIdx){
      _compNotasArray(f[k]||'').forEach(function(n){
        var key=n.toLowerCase();
        if(!notasMap[key])notasMap[key]={original:n,perfumes:[],niveles:[]};
        if(notasMap[key].perfumes.indexOf(i)<0)notasMap[key].perfumes.push(i);
        notasMap[key].niveles.push(kIdx); // 0=salida, 1=corazón, 2=fondo
      });
    });
  });
  var comunes=Object.keys(notasMap).filter(function(n){return notasMap[n].perfumes.length>=2;})
    .sort(function(a,b){return notasMap[b].perfumes.length-notasMap[a].perfumes.length;});

  if(comunes.length){
    html+='<div style="background:linear-gradient(135deg,rgba(196,150,90,.08),rgba(90,143,196,.08));border-radius:14px;padding:1.2rem;border:1px solid var(--border-color);margin-bottom:1.2rem">';
    html+='<div style="font-size:.7rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.9rem;text-align:center">✨ Notas que comparten ('+comunes.length+')</div>';
    html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(95px,1fr));gap:.6rem">';
    comunes.slice(0,18).forEach(function(n){
      var info=notasMap[n];
      var clas=_compClasificarNota(n);
      var fotoUrl=(typeof getNotaFoto==='function')?getNotaFoto(info.original):'';
      var dotsHtml=info.perfumes.map(function(pi){return '<div style="width:7px;height:7px;border-radius:50%;background:'+colores[pi]+'"></div>';}).join('');
      // Imagen real circular en vez de emoji. Fallback al _default si la URL falla.
      var imgHtml=fotoUrl
        ?'<div style="width:46px;height:46px;border-radius:50%;overflow:hidden;margin:0 auto .35rem;border:2px solid '+clas.color+'66;box-shadow:0 1px 4px rgba(0,0,0,.08)"><img src="'+fotoUrl+'" alt="'+info.original+'" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy" onerror="if(typeof NOTAS_FOTOS!==\'undefined\')this.src=NOTAS_FOTOS._default;"></div>'
        :'<div style="font-size:1.5rem;line-height:1;margin-bottom:.25rem">'+clas.emoji+'</div>';
      html+='<div style="background:var(--bg-card);border-radius:10px;padding:.55rem .4rem;text-align:center;border:1px solid '+clas.color+'40;transition:transform .2s">'
        +imgHtml
        +'<div style="font-size:.63rem;font-weight:600;color:var(--tx-main);line-height:1.25;margin-bottom:.3rem;text-transform:capitalize">'+info.original+'</div>'
        +'<div style="display:flex;justify-content:center;gap:.2rem">'+dotsHtml+'</div>'
      +'</div>';
    });
    html+='</div></div>';
  }

  // ── BLOQUE 4: PIRÁMIDE OLFATIVA VISUAL ──
  html+='<div style="background:var(--bg-header);border-radius:14px;padding:1.1rem;border:1px solid var(--border-color);margin-bottom:1.2rem">';
  html+='<div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.9rem;text-align:center">🔺 Pirámide olfativa</div>';
  var nivelLabels=[
    {n:'Salida',e:'☁️',k:'notas_salida',sub:'primera impresión'},
    {n:'Corazón',e:'💗',k:'notas_corazon',sub:'la esencia'},
    {n:'Fondo',e:'⚓',k:'notas_fondo',sub:'la base duradera'}
  ];
  nivelLabels.forEach(function(nl){
    html+='<div style="margin-bottom:.9rem">'
      +'<div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem">'
        +'<span style="font-size:1.05rem">'+nl.e+'</span>'
        +'<div style="font-size:.7rem;font-weight:700;color:var(--tx-main)">'+nl.n+'</div>'
        +'<div style="font-size:.55rem;color:var(--tx-mid);font-style:italic">— '+nl.sub+'</div>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:repeat('+prods.length+',1fr);gap:.5rem">';
    prods.forEach(function(p,i){
      var f=fichas[i];
      var notas=f?_compNotasArray(f[nl.k]):[];
      html+='<div style="background:'+coloresBg[i]+';border-radius:9px;padding:.5rem;border:1px solid '+coloresBd[i]+';min-height:50px">';
      if(notas.length){
        notas.forEach(function(n){
          var clas=_compClasificarNota(n);
          var esComun=notasMap[n.toLowerCase()]&&notasMap[n.toLowerCase()].perfumes.length>=2;
          var fotoUrl=(typeof getNotaFoto==='function')?getNotaFoto(n):'';
          // Mini-foto circular (18x18) en lugar de emoji.
          // Si la imagen falla, cae al _default; si no hay foto en absoluto se usa el emoji como respaldo.
          var iconHtml=fotoUrl
            ?'<img src="'+fotoUrl+'" alt="" style="width:18px;height:18px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid var(--border-color)" loading="lazy" onerror="if(typeof NOTAS_FOTOS!==\'undefined\')this.src=NOTAS_FOTOS._default;">'
            :'<span style="font-size:.75rem">'+clas.emoji+'</span>';
          html+='<div style="display:inline-flex;align-items:center;gap:.3rem;padding:.18rem .4rem .18rem .2rem;background:var(--bg-card);border-radius:14px;font-size:.58rem;color:var(--tx-main);margin:.12rem .15rem .12rem 0;'+(esComun?'box-shadow:0 0 0 1.5px '+colores[i]+'70;font-weight:600':'border:1px solid var(--border-color)')+'">'
            +iconHtml
            +'<span style="text-transform:capitalize">'+n+'</span>'
            +(esComun?'<span style="color:'+colores[i]+';font-weight:700;font-size:.55rem;margin-left:.05rem">✓</span>':'')
          +'</div>';
        });
      }else{
        html+='<div style="font-size:.6rem;color:var(--tx-mid);text-align:center;padding:.5rem;font-style:italic">— sin datos —</div>';
      }
      html+='</div>';
    });
    html+='</div></div>';
  });
  html+='<div style="font-size:.55rem;color:var(--tx-mid);text-align:center;margin-top:.5rem;opacity:.8">El borde resaltado indica notas en común con otro perfume</div>';
  html+='</div>';

  // ── BLOQUE 5: HUELLA OLFATIVA (RADAR) + INTENSIDADES ──
  var proyMap={Baja:1,Moderada:2,Alta:3,'Muy alta':4,Intensa:5,Nuclear:5,'Beast mode':5};
  var durMap={'Muy corta':1,Corta:2,Media:3,Larga:4,'Muy larga':5,Extrema:5,Nuclear:5};
  var estelaMap={Discreta:1,Moderada:2,Notable:3,Intensa:4,Nuclear:5,'Bestial':5};
  function mapVal(map,val){
    if(!val)return 0;
    var v=val.toLowerCase();
    var k=Object.keys(map).find(function(key){return v.indexOf(key.toLowerCase())>=0;});
    return k?map[k]:0;
  }
  var dimLabels=['Proyección','Duración','Estela'];
  var dimMaps=[proyMap,durMap,estelaMap];
  var dimFields=['proyeccion','duracion','estela'];

  var cx=120,cy=110,r=80,sides=3;
  var angles=dimLabels.map(function(_,i){return (i*2*Math.PI/sides)-Math.PI/2;});
  function pt(val,maxVal,angle){
    var d=r*(val/maxVal);
    return {x:cx+d*Math.cos(angle),y:cy+d*Math.sin(angle)};
  }
  var radarSvg='<svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px;display:block;margin:0 auto">';
  [1,2,3,4,5].forEach(function(level){
    var pts=angles.map(function(a){var p=pt(level,5,a);return p.x+','+p.y;}).join(' ');
    radarSvg+='<polygon points="'+pts+'" fill="none" stroke="var(--border-color)" stroke-width=".8" opacity=".6"/>';
  });
  angles.forEach(function(a,i){
    var p=pt(5,5,a);
    radarSvg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+p.x+'" y2="'+p.y+'" stroke="var(--border-color)" stroke-width=".8" opacity=".6"/>';
    var lp=pt(5.85,5,a);
    radarSvg+='<text x="'+lp.x+'" y="'+lp.y+'" text-anchor="middle" dominant-baseline="middle" font-size="9" fill="var(--tx-mid)" font-family="inherit" font-weight="600">'+dimLabels[i]+'</text>';
  });
  fichas.forEach(function(f,pi){
    if(!f)return;
    var vals=dimFields.map(function(k,di){return mapVal(dimMaps[di],f[k]);});
    var hasData=vals.some(function(v){return v>0;});
    if(!hasData)return;
    var pts=angles.map(function(a,i){var p=pt(Math.max(vals[i],.2),5,a);return p.x+','+p.y;}).join(' ');
    radarSvg+='<polygon points="'+pts+'" fill="'+colores[pi]+'" fill-opacity=".22" stroke="'+colores[pi]+'" stroke-width="2"/>';
    angles.forEach(function(a,i){
      if(!vals[i])return;
      var p=pt(vals[i],5,a);
      radarSvg+='<circle cx="'+p.x+'" cy="'+p.y+'" r="4" fill="'+colores[pi]+'" stroke="var(--bg-card)" stroke-width="1.5"/>';
    });
  });
  radarSvg+='</svg>';

  html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-bottom:1.2rem;align-items:start">';
  // Radar
  html+='<div style="background:var(--bg-header);border-radius:14px;padding:1rem;border:1px solid var(--border-color)">'
    +'<div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.6rem;text-align:center">📊 Huella olfativa</div>'
    +radarSvg
    +'<div style="display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;margin-top:.5rem">';
  prods.forEach(function(p,i){
    html+='<div style="display:flex;align-items:center;gap:.25rem"><div style="width:9px;height:9px;border-radius:50%;background:'+colores[i]+';flex-shrink:0"></div><span style="font-size:.6rem;color:var(--tx-mid)">'+nomCorto(p,14)+'</span></div>';
  });
  html+='</div></div>';

  // Barras intensidades
  html+='<div style="background:var(--bg-header);border-radius:14px;padding:1rem;border:1px solid var(--border-color)">';
  html+='<div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.7rem">📈 Intensidades</div>';
  var barAttrs=[
    {label:'Proyección',map:proyMap,key:'proyeccion'},
    {label:'Duración',map:durMap,key:'duracion'},
    {label:'Estela',map:estelaMap,key:'estela'},
  ];
  barAttrs.forEach(function(attr){
    html+='<div style="margin-bottom:.85rem"><div style="font-size:.62rem;color:var(--tx-mid);font-weight:600;margin-bottom:.35rem">'+attr.label+'</div>';
    prods.forEach(function(p,i){
      var f=fichas[i];
      var v=f?mapVal(attr.map,f[attr.key]):0;
      var pct=Math.round(v/5*100);
      html+='<div style="display:flex;align-items:center;gap:.45rem;margin-bottom:.25rem">'
        +'<div style="width:11px;height:11px;border-radius:3px;background:'+colores[i]+';flex-shrink:0"></div>'
        +'<div style="flex:1;height:7px;background:var(--border-color);border-radius:4px;overflow:hidden">'
          +'<div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,'+colores[i]+'80,'+colores[i]+');border-radius:4px;transition:width .6s ease"></div>'
        +'</div>'
        +'<div style="font-size:.58rem;color:var(--tx-mid);min-width:14px;text-align:right;font-weight:600">'+(v||'—')+'</div>'
      +'</div>';
    });
    html+='</div>';
  });
  html+='</div>';
  html+='</div>'; // grid radar+barras

  // ── BLOQUE 6: CUÁNDO USAR (momento/estación/clima/ocasión) — visual ──
  function getGenero(f){
    if(!f)return '—';
    if(f.genero&&f.genero.trim())return f.genero.trim();
    var pu=f.perfil_usuario||'';
    var esMujer=/mujer|femenin/i.test(pu);
    var esHombre=/hombre|masculin/i.test(pu);
    if(/unisex/i.test(pu)||(esMujer&&esHombre))return 'Unisex';
    if(esMujer)return 'Femenino';
    if(esHombre)return 'Masculino';
    return '—';
  }
  function attrIcon(key,val){
    if(!val)return '';
    var v=val.toLowerCase();
    if(key==='momento_dia'){
      if(/día|dia|mañana|manana/.test(v))return '☀️';
      if(/tarde/.test(v))return '🌇';
      if(/noche/.test(v))return '🌙';
      if(/versátil|versatil|todo/.test(v))return '🔄';
    }
    if(key==='estacion'){
      if(/primavera/.test(v))return '🌷';
      if(/verano/.test(v))return '☀️';
      if(/otoño|otono/.test(v))return '🍂';
      if(/invierno/.test(v))return '❄️';
      if(/todo/.test(v))return '🔄';
    }
    if(key==='clima'){
      if(/calor/.test(v))return '🔥';
      if(/templado/.test(v))return '🌤️';
      if(/frío|frio/.test(v))return '🧊';
      if(/todo/.test(v))return '🔄';
    }
    if(key==='ocasion'){
      if(/trabajo|formal|oficina/.test(v))return '💼';
      if(/casual|cotidiano/.test(v))return '👕';
      if(/cita|íntim|intim|seductor/.test(v))return '💕';
      if(/evento|gala|noche|fiesta/.test(v))return '🎉';
      if(/playa|vacacion/.test(v))return '🏖️';
      if(/deporte|gym/.test(v))return '🏃';
    }
    if(key==='genero'){
      if(/femenin/.test(v))return '👩';
      if(/masculin/.test(v))return '👨';
      if(/unisex/.test(v))return '⚥';
    }
    return '•';
  }

  html+='<div style="background:var(--bg-header);border-radius:14px;padding:1rem;border:1px solid var(--border-color);margin-bottom:1.2rem">';
  html+='<div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.8rem">🌡️ Cuándo y para quién</div>';
  var attrs=[
    {key:'genero',label:'Género',fn:function(f){return getGenero(f);}},
    {key:'momento_dia',label:'Momento'},
    {key:'estacion',label:'Estación'},
    {key:'clima',label:'Clima'},
    {key:'ocasion',label:'Ocasión'},
  ];
  attrs.forEach(function(attr,ri){
    html+='<div style="display:grid;grid-template-columns:75px repeat('+prods.length+',1fr);gap:.35rem;margin-bottom:.3rem;padding:.35rem .45rem;border-radius:8px;background:'+(ri%2?'transparent':'var(--bg-body)')+'">';
    html+='<div style="font-size:.6rem;color:var(--tx-mid);font-weight:600;display:flex;align-items:center">'+attr.label+'</div>';
    fichas.forEach(function(f,i){
      var val=attr.fn?attr.fn(f):(f?(f[attr.key]||'—'):'—');
      var icon=attrIcon(attr.key,val);
      if(typeof val==='string'&&val.length>26)val=val.substring(0,24)+'…';
      html+='<div style="font-size:.62rem;color:var(--tx-main);text-align:center;padding:.25rem .35rem;border-radius:6px;background:'+coloresBg[i]+';border:1px solid '+coloresBd[i]+';display:flex;align-items:center;justify-content:center;gap:.25rem">'
        +(icon?'<span style="font-size:.85rem">'+icon+'</span>':'')
        +'<span>'+val+'</span>'
      +'</div>';
    });
    html+='</div>';
  });
  html+='</div>';

  // ── BLOQUE 7: DESCRIPCIONES ──
  var hasDesc=fichas.some(function(f){return f&&f.descripcion;});
  if(hasDesc){
    html+='<div style="margin-bottom:1.2rem"><div style="font-size:.65rem;font-weight:700;color:var(--tx-mid);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.7rem">📝 Descripción</div>';
    html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.7rem">';
    prods.forEach(function(p,i){
      var f=fichas[i];
      if(!f||!f.descripcion)return;
      html+='<div style="border-radius:12px;padding:.85rem;border-left:4px solid '+colores[i]+';background:'+coloresBg[i]+';border:1px solid '+coloresBd[i]+';border-left-width:4px">'
        +'<div style="font-size:.66rem;color:'+colores[i]+';font-weight:700;margin-bottom:.4rem">'+nomCorto(p,22)+'</div>'
        +'<div style="font-size:.7rem;color:var(--tx-mid);line-height:1.55;font-style:italic">"'+_catEsc(f.descripcion.substring(0,180))+(f.descripcion.length>180?'…':'')+'"</div>'
      +'</div>';
    });
    html+='</div></div>';
  }

  // ── BLOQUE 8: RECOMENDACIÓN — "Si te gusta X..." ──
  // Buscar en allProds otros perfumes que no estén seleccionados y tengan alta similitud con alguno de los actuales
  if(_compSelIds.length===2&&fichas[0]&&fichas[1]){
    var candidatos=[];
    (allProds||[]).forEach(function(p){
      if(_compSelIds.indexOf(p.id)>=0)return;
      var fc=fichaMatchProd(p.nombre,FICHAS_BELLE,p.id);
      if(!fc||!fc.familia_olfativa)return;
      var sim0=_compSimilitud(fichas[0],fc);
      var sim1=_compSimilitud(fichas[1],fc);
      var simMax=Math.max(sim0,sim1);
      if(simMax>=45){candidatos.push({prod:p,ficha:fc,sim:simMax,paraciendoA:sim0>sim1?0:1});}
    });
    candidatos.sort(function(a,b){return b.sim-a.sim;});
    if(candidatos.length){
      html+='<div style="background:linear-gradient(135deg,rgba(196,150,90,.1),rgba(90,196,122,.08));border-radius:14px;padding:1.1rem;border:1px solid var(--accent);margin-bottom:.5rem">';
      html+='<div style="font-size:.7rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.7rem;text-align:center">💡 Si te gustan estos, también probá…</div>';
      html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.6rem">';
      candidatos.slice(0,3).forEach(function(c){
        var p=c.prod;
        var pColor=colores[c.paraciendoA];
        html+='<div data-recprod="'+p.id+'" style="background:var(--bg-card);border-radius:10px;padding:.7rem;border:1px solid var(--border-color);cursor:pointer;transition:transform .2s,box-shadow .2s;display:flex;align-items:center;gap:.6rem" onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 4px 12px rgba(0,0,0,.1)\'" onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'none\'">'
          +(p.imagen_url?'<img src="'+p.imagen_url+'" style="width:46px;height:46px;object-fit:contain;border-radius:7px;background:var(--bg-cimg);flex-shrink:0">':'<div style="width:46px;height:46px;border-radius:7px;background:var(--bg-cimg);flex-shrink:0"></div>')
          +'<div style="flex:1;min-width:0">'
            +'<div style="font-size:.7rem;font-weight:700;color:var(--tx-main);line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+nomCorto(p,24)+'</div>'
            +'<div style="font-size:.55rem;color:var(--tx-mid);margin-top:.15rem">'+(c.ficha.familia_olfativa||'').split('/')[0].trim().substring(0,28)+'</div>'
            +'<div style="font-size:.55rem;color:'+pColor+';font-weight:600;margin-top:.2rem">↪ '+c.sim+'% parecido</div>'
          +'</div>'
        +'</div>';
      });
      html+='</div>';
      html+='<div style="font-size:.55rem;color:var(--tx-mid);text-align:center;margin-top:.6rem;opacity:.8">Click para agregarlo al comparador</div>';
      html+='</div>';
    }
  }

  el.innerHTML=html;
  // Wire up click en recomendaciones
  el.querySelectorAll('[data-recprod]').forEach(function(cardEl){
    cardEl.addEventListener('click',function(e){
      e.stopPropagation();
      var pid=parseInt(this.getAttribute('data-recprod'));
      if(_compSelIds.length>=4){_catToast('Quitá uno antes de agregar otro','twarn');return;}
      compToggle(pid);
    });
  });
  // Mostrar footer y barra de exportar cuando hay comparativa
  var footer=document.getElementById('compFooterBelle');
  var exportBar=document.getElementById('compExportBar');
  var show=_compSelIds.length>=2;
  if(footer)footer.style.display=show?'flex':'none';
  if(exportBar)exportBar.style.display=show?'flex':'none';
}



// Comparador: cerrar solo al click en el overlay exterior
(function(){
  var mo=document.getElementById('moComparadorBelle');
  if(!mo)return;
  mo.addEventListener('click',function(e){
    if(e.target===mo)cerrarModalComparador();
  });
  // El panel interno no propaga al overlay
  var panel=mo.querySelector('div');
  if(panel)panel.addEventListener('click',function(e){e.stopPropagation();});
})();


// ── Helper: convierte una URL de imagen a base64 (data URL) ──
// Esto resuelve el problema de cross-origin con Unsplash/Supabase en html2canvas:
// si las imágenes vienen de otro dominio, html2canvas las renderiza vacías.
// Convertirlas a data: las hace "locales" al documento.
function _compFetchAsDataURL(url){
  return new Promise(function(resolve){
    if(!url||url.indexOf('data:')===0){resolve(url);return;}
    fetch(url,{mode:'cors',cache:'force-cache'}).then(function(r){
      if(!r.ok){resolve(null);return;}
      return r.blob();
    }).then(function(blob){
      if(!blob){resolve(null);return;}
      var reader=new FileReader();
      reader.onloadend=function(){resolve(reader.result);};
      reader.onerror=function(){resolve(null);};
      reader.readAsDataURL(blob);
    }).catch(function(){resolve(null);});
  });
}

// Precarga TODAS las imágenes <img> dentro de un elemento, reemplazando sus src por data URLs.
// Devuelve una promesa que resuelve cuando todas terminaron (ok o falladas).
// Las imágenes que fallan se reemplazan por un placeholder transparente para que html2canvas
// no las deje en blanco.
function _compPrecargarImgs(el){
  var imgs=Array.prototype.slice.call(el.querySelectorAll('img'));
  var placeholderTransparente='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  var promesas=imgs.map(function(img){
    var src=img.src;
    if(!src||src.indexOf('data:')===0)return Promise.resolve();
    return _compFetchAsDataURL(src).then(function(dataUrl){
      // Si falla, ponemos placeholder transparente y ocultamos visualmente
      // para no dejar el cuadro en blanco (mejor sin imagen que con un blanco grande).
      if(!dataUrl){
        img.src=placeholderTransparente;
        img.style.opacity='0';
      } else {
        img.src=dataUrl;
      }
    });
  });
  return Promise.all(promesas);
}

function compExportar(tipo){
  var panel=document.getElementById('moComparadorBelle').querySelector('div');
  if(!panel){_catToast('No hay comparativa abierta','twarn');return;}
  if(typeof html2canvas==='undefined'){_catToast('Cargando... reintentá en un momento','twarn');return;}

  // Ocultar botones de buscar/cerrar durante la captura
  var srchBar=panel.children[1]; // div del buscador
  var selBar=document.getElementById('compSeleccionados');
  var exportBar=document.getElementById('compExportBar');
  var closeBtns=panel.querySelectorAll('button[onclick*="cerrar"], input, #compResultados');

  // Estado original de cada img para restaurar después (si falla la conversión)
  var imgsOriginales=Array.prototype.slice.call(panel.querySelectorAll('img')).map(function(img){
    return {el:img, src:img.src, opacity:img.style.opacity};
  });

  function restaurarUI(){
    if(srchBar)srchBar.style.display='';
    if(selBar)selBar.style.display='flex';
    if(exportBar)exportBar.style.display='flex';
    closeBtns.forEach(function(el){el.style.visibility='';});
    imgsOriginales.forEach(function(o){
      o.el.src=o.src;
      o.el.style.opacity=o.opacity||'';
    });
  }

  // Mostrar overlay "Generando imagen..."
  var ov=document.createElement('div');
  ov.id='_compExportOv';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2000;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.95rem;font-weight:600';
  ov.innerHTML='<div style="background:#1a1209;border:1px solid #c4965a;border-radius:14px;padding:1.4rem 2rem;text-align:center;font-family:inherit"><div style="font-size:2rem;margin-bottom:.5rem">📸</div><div>Generando imagen...</div><div style="font-size:.7rem;color:#c4965a;margin-top:.5rem;font-weight:400">Cargando fotos de notas</div></div>';
  document.body.appendChild(ov);

  // Temporalmente ocultar controles interactivos
  if(srchBar)srchBar.style.display='none';
  if(selBar)selBar.style.display='none';
  if(exportBar)exportBar.style.display='none';
  closeBtns.forEach(function(el){el.style.visibility='hidden';});

  // Nombre del archivo con los perfumes seleccionados
  var nombres=_compSelIds.map(function(id){
    var p=(allProds||[]).find(function(x){return x.id===id;});
    return p?(p.nombre||'').split(' - ').slice(1).join('-').trim().split('|')[0].trim().substring(0,12):'';
  }).filter(Boolean).join('_vs_');
  var fileName='Belle_Comparador_'+nombres;

  // PASO 1: Precargar todas las imágenes como base64 ANTES de pasar a html2canvas.
  // Esto resuelve el bug de las cajitas blancas en la pirámide olfativa: las imágenes
  // de Unsplash y Supabase eran cross-origin y html2canvas no podía renderizarlas.
  _compPrecargarImgs(panel).then(function(){
    // Pequeña pausa para que el browser pinte las nuevas src antes de capturar
    return new Promise(function(r){setTimeout(r,100);});
  }).then(function(){ return _libsPdf(); }).then(function(){
    // Forzar ancho fijo para que el cloned doc no haga reflow
    var anchoOriginal=panel.offsetWidth;
    return html2canvas(panel,{
      scale:2,
      useCORS:true,
      allowTaint:true,
      backgroundColor:'#fbf8f3',
      logging:false,
      imageTimeout:0,        // 0 = sin timeout (las imgs ya son data: URLs)
      width:anchoOriginal,
      windowWidth:anchoOriginal,
      // onclone: forzar visibilidad de todo en el documento clonado
      onclone:function(clonedDoc){
        // Asegurar que las imágenes en el clon tengan dimensiones explícitas
        var clonImgs=clonedDoc.querySelectorAll('img');
        clonImgs.forEach(function(img){
          // forzar carga sincrónica
          if(!img.complete){img.loading='eager';}
        });
        // Quitar animaciones que pueden causar problemas en captura
        var styleNoAnim=clonedDoc.createElement('style');
        styleNoAnim.textContent='*{animation:none!important;transition:none!important}';
        clonedDoc.head.appendChild(styleNoAnim);
      }
    });
  }).then(function(canvas){
    // Cerrar overlay y restaurar UI/imgs
    if(ov&&ov.parentNode)ov.remove();
    restaurarUI();

    if(tipo==='jpg'){
      var a=document.createElement('a');
      a.href=canvas.toDataURL('image/jpeg',0.95);
      a.download=fileName+'.jpg';
      a.click();
      _catToast('Imagen descargada','tok');
    } else {
      if(typeof window.jspdf==='undefined'){_catToast('PDF no disponible','terr');return;}
      var pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      var pw=pdf.internal.pageSize.getWidth();
      var ph=pdf.internal.pageSize.getHeight();
      var cw=canvas.width,ch=canvas.height;
      var ratio=cw/ch;
      var imgW=pw,imgH=imgW/ratio;
      if(imgH>ph){imgH=ph;imgW=imgH*ratio;}
      var x=(pw-imgW)/2;
      pdf.addImage(canvas.toDataURL('image/jpeg',0.93),'JPEG',x,0,imgW,imgH);
      pdf.save(fileName+'.pdf');
      _catToast('PDF descargado','tok');
    }
  }).catch(function(e){
    if(ov&&ov.parentNode)ov.remove();
    restaurarUI();
    console.error('[belle-cat] export error:',e);
    _catToast('Error al exportar: '+(e.message||'desconocido'),'terr');
  });
}

