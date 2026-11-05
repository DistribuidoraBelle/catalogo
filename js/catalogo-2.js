
// ═══════════════════════════════════════════════════════
// REALTIME — Supabase WebSocket — actualizaciones en vivo
// ═══════════════════════════════════════════════════════
var _sbClient = null;
var _rtReady = false;
var _rtDebounceTimers = {};

function _rtDebounce(key, fn, delay) {
  clearTimeout(_rtDebounceTimers[key]);
  _rtDebounceTimers[key] = setTimeout(fn, delay || 600);
}

function initRealtime() {
  if (!window.supabase || _rtReady) return;
  try {
    _sbClient = window.supabase.createClient(SB_URL, SB_KEY);
    _rtReady = true;

    // ── productos: stock, precios ──
    _sbClient.channel('rt-productos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos_priv' },
        function(payload) {
          var rec = payload.new || payload.old;
          if (!rec || !rec.id) return;
          // Actualizar en allProds
          var idx = allProds.findIndex(function(p) { return p.id === rec.id; });
          if (payload.eventType === 'DELETE') {
            if (idx >= 0) allProds.splice(idx, 1);
          } else if (idx >= 0) {
            Object.assign(allProds[idx], rec);
          } else if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && rec.activo) {
            allProds.push(rec);
          }
          // Re-render silencioso — sin loading
          _rtDebounce('prods', function() {
            if (typeof applyFilters === 'function') applyFilters();
            else if (typeof carRender === 'function') carRender();
            try{ _madreRefrescar(); }catch(e){}   // 2026-10-08: sin stock → sale de la campaña al instante
          }, 400);
        })
      .subscribe();

    // ── paneles_destacados ──
    _sbClient.channel('rt-destacados')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'paneles_destacados' },
        function(payload) {
          // Invalidar caché para que renderDestacados haga fetch fresco
          window._catPanelesTimestamp = 0;
          _rtDebounce('destacados', function() {
            if (typeof renderDestacados === 'function') renderDestacados(curTab);
          }, 600);
        })
      .subscribe();

    // ── pestanas_catalogo ──
    _sbClient.channel('rt-pestanas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pestanas_catalogo' },
        function(payload) {
          _rtDebounce('pestanas', function() {
            if (typeof loadProds === 'function') loadProds();
          }, 800);
        })
      .subscribe();

    // ── home_sections (cambios de admin: imagen mobile/desktop, alto, color, etc.) ──
    // Invalida caché y re-renderiza la home si está visible
    _sbClient.channel('rt-home-sections')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'home_sections' },
        function(payload) {
          _rtDebounce('homeSections', function() {
            window._homeCache = null; // invalidar caché
            window._seccionesPestanaCache = null; // invalidar caché de secciones por pestaña
            var homeEl = document.getElementById('homePage');
            if (homeEl && homeEl.style.display !== 'none' && typeof loadHomePage === 'function') {
              loadHomePage();
            } else if (typeof curTab !== 'undefined' && typeof renderSeccionesPestana === 'function') {
              renderSeccionesPestana(curTab);
            }
          }, 800);
        })
      .subscribe();

    // ── ofertas (cambios de admin: pausar, editar fecha, crear, etc.) [BUG #4 fix] ──
    _sbClient.channel('rt-ofertas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ofertas' },
        function(payload) {
          _rtDebounce('ofertas', function() {
            if (typeof recargarOfertasYCampanias === 'function') recargarOfertasYCampanias();
          }, 800);
        })
      .subscribe();

    // ── ofertas_campanias (pausar/reanudar/visibilidad de pestaña) [BUG #4 fix] ──
    _sbClient.channel('rt-ofertas-camp')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ofertas_campanias' },
        function(payload) {
          _rtDebounce('ofertasCamp', function() {
            if (typeof recargarOfertasYCampanias === 'function') recargarOfertasYCampanias();
          }, 800);
        })
      .subscribe();

    // ── ofertas_campania_productos (asignación/desasignación de productos a campañas) [BUG #4 fix] ──
    _sbClient.channel('rt-ofertas-camp-prods')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ofertas_campania_productos' },
        function(payload) {
          _rtDebounce('ofertasCampProds', function() {
            if (typeof recargarOfertasYCampanias === 'function') recargarOfertasYCampanias();
          }, 800);
        })
      .subscribe();

    // ── configuracion (anuncios, recuadros del inicio, cotización, decans) ──
    _sbClient.channel('rt-config')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'configuracion' },
        function(payload) {
          _rtDebounce('config', function() {
            try{ if (typeof loadConfig === 'function') loadConfig(); }catch(e){}
            try{ if (typeof loadAnnBar === 'function') loadAnnBar(); }catch(e){}
            // la cotización cambia los precios: repintar la lista
            try{ if (typeof applyFilters === 'function') applyFilters(); }catch(e){}
          }, 700);
        })
      .subscribe();

    // ── banner_slides (carrusel de arriba) ──
    _sbClient.channel('rt-slides')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banner_slides' },
        function(payload) {
          _rtDebounce('slides', function() { try{ if (typeof loadSlides === 'function') loadSlides(); }catch(e){} }, 700);
        })
      .subscribe();

    // ── combos y sus componentes (inicio + secciones de la pestaña) ──
    function _rtCombos(){
      _rtDebounce('combos', function() {
        window._homeCache = null; window._seccionesPestanaCache = null;
        var homeEl = document.getElementById('homePage');
        try{
          if (homeEl && homeEl.style.display !== 'none' && typeof loadHomePage === 'function') loadHomePage();
          else if (typeof curTab !== 'undefined' && typeof renderSeccionesPestana === 'function') renderSeccionesPestana(curTab);
          // 2026-09-29: los combos de la pestaña y de la plantilla también se refrescan (antes quedaban viejos hasta cambiar de pestaña)
          apiGet("combos","select=*,combo_items(producto_id,cantidad,producto_nombre,es_decan,precio_ref)&activo=is.true&order=created_at.desc").then(function(d){
            if(Array.isArray(d)) combosPublicos=d;
            try{ if(typeof renderCombosEnCatalogo==='function') renderCombosEnCatalogo(); }catch(e2){}
            try{ if(window._madreCampId && typeof _madreCargar==='function') _madreCargar(); }catch(e3){}
          }).catch(function(){});
        }catch(e){}
      }, 800);
    }
    _sbClient.channel('rt-combos').on('postgres_changes', { event: '*', schema: 'public', table: 'combos' }, _rtCombos).subscribe();
    _sbClient.channel('rt-combo-items').on('postgres_changes', { event: '*', schema: 'public', table: 'combo_items' }, _rtCombos).subscribe();

    // ── marcas (logos del carrusel) ──
    _sbClient.channel('rt-marcas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marcas' },
        function(payload) {
          _rtDebounce('marcas', function() {
            try{ if (typeof _marcasCargarLogos === 'function') _marcasCargarLogos(); else if (typeof window._mcRender === 'function') window._mcRender(); }catch(e){}
          }, 800);
        })
      .subscribe();

    // ── fichas_perfume (notas, familia, descripción de la ficha) ──
    _sbClient.channel('rt-fichas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fichas_perfume' },
        function(payload) {
          var rec = payload.new || payload.old; if (!rec || !rec.id) return;
          try{
            var arr = window._fichasSB; if (!Array.isArray(arr)) return;
            var i = arr.findIndex(function(f){ return f.id === rec.id; });
            if (payload.eventType === 'DELETE') { if (i >= 0) arr.splice(i, 1); }
            else if (i >= 0) Object.assign(arr[i], rec); else arr.unshift(rec);
          }catch(e){}
        })
      .subscribe();

  } catch(e) {
    console.warn('Realtime no disponible:', e.message);
  }
}

// ── Versión nueva publicada: avisar y, si el carrito está vacío, actualizar solo ──
// Se compara el sello BELLE_BUILD del servidor (sin caché) con el que está corriendo.
(function(){
  function _miBuild(){
    try{ var ns=document.head.childNodes; for(var i=0;i<ns.length;i++){ if(ns[i].nodeType===8 && ns[i].textContent.indexOf('BELLE_BUILD')>=0) return ns[i].textContent.trim(); } }catch(e){}
    try{ var ns2=document.childNodes; for(var j=0;j<ns2.length;j++){ if(ns2[j].nodeType===8 && ns2[j].textContent.indexOf('BELLE_BUILD')>=0) return ns2[j].textContent.trim(); } }catch(e){}
    return '';
  }
  function _recargar(){
    var ps=[];
    try{ if(navigator.serviceWorker&&navigator.serviceWorker.getRegistrations) ps.push(navigator.serviceWorker.getRegistrations().then(function(rs){ return Promise.all(rs.map(function(x){ return x.update(); })); })); }catch(e){}
    try{ if(window.caches&&caches.keys) ps.push(caches.keys().then(function(ks){ return Promise.all(ks.map(function(k){ return caches.delete(k); })); })); }catch(e){}
    Promise.all(ps).catch(function(){}).then(function(){ location.replace(location.pathname+location.search.replace(/[?&]v=\d+/,'')+(location.search&&location.search.indexOf('?')===0&&location.search.length>1?'&':'?')+'v='+Date.now()+location.hash); });
  }
  var _avisado=false;
  // Auditoría 2026-10-04: antes se bajaba el HTML completo (1,8 MB) cada 3 minutos para
  // leer el sello de versión. Ahora se hace un HEAD (sin cuerpo) y se compara el ETag que
  // devuelve GitHub Pages: si cambió, hay versión nueva. El sello BELLE_BUILD queda como respaldo.
  var _etagMio=null;
  function _chequearVersion(){
    if(_avisado || document.visibilityState!=='visible') return;
    fetch(location.pathname,{method:'HEAD',cache:'no-store'}).then(function(r){
      if(!r.ok) return;
      var tag=(r.headers.get('etag')||r.headers.get('last-modified')||'').trim(); if(!tag) return;
      if(_etagMio===null){ _etagMio=tag; return; }
      if(tag===_etagMio) return;
      _avisado=true;
      var carritoVacio=true; try{ carritoVacio=!Object.keys(window.cart||{}).length; }catch(e){}
      var modalAbierto=!!document.querySelector('.modal.open,.modal-overlay.open,#cobModal.open,.drawer.open');
      if(carritoVacio && !modalAbierto && document.visibilityState==='visible'){ _recargar(); return; }
      if(document.getElementById('belleVerBar')) return;
      var bar=document.createElement('div'); bar.id='belleVerBar';
      bar.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;background:#1f9d57;color:#fff;padding:.55rem .9rem;font-size:.8rem;font-weight:700;text-align:center;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)';
      bar.innerHTML='🔄 Hay novedades en el catálogo — <u>tocá acá para actualizar</u>';
      bar.onclick=function(){ bar.textContent='Actualizando...'; _recargar(); };
      document.body.appendChild(bar);
    }).catch(function(){});
  }
  window.addEventListener('load',function(){ setTimeout(_chequearVersion,3000); });
  setInterval(_chequearVersion, 3*60*1000);
  document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='visible') setTimeout(_chequearVersion,1500); });
})();

document.addEventListener('DOMContentLoaded', function() {
  var _rtCheck = setInterval(function() {
    if (window.supabase && allProds && allProds.length) {
      clearInterval(_rtCheck);
      initRealtime();
    }
  }, 500);
});

// ═══════════════════════════════════════════════════════
// MI CUENTA — inicialización de Auth
// ═══════════════════════════════════════════════════════
function initCatAuth(){
  if(!window.supabase || _catAuthReady) return;
  try{
    _sbAuth = window.supabase.createClient(SB_URL, SB_ANON, {
      auth:{
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'belle_cat_auth'
      }
    });
    _catAuthReady = true;

    // Recuperar sesión existente al cargar
    _sbAuth.auth.getSession().then(function(res){
      if(res && res.data && res.data.session){
        _catSession = res.data.session;
        _catCargarClienteData();
      }
    }).catch(function(e){ console.error("[belle-cat] getSession error:", e); });

    // Listener de cambios de sesión (login, logout, refresh token)
    _sbAuth.auth.onAuthStateChange(function(event, session){
      _catSession = session || null;
      if(event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED'){
        if(session) _catCargarClienteData();
      } else if(event === 'SIGNED_OUT'){
        _catCliente = null;
        _catFavs = [];
        _catDrawerView = "login";
        if(typeof catActualizarBoton === 'function') catActualizarBoton();
        if(typeof catActualizarCorazones === 'function') catActualizarCorazones();
        // Si el drawer está abierto, re-renderizarlo
        var dw = document.getElementById("drawerCuenta");
        if(dw && dw.classList.contains("open") && typeof catRenderDrawer === 'function'){
          catRenderDrawer();
        }
      }
    });
  } catch(e){
    console.error("[belle-cat] initCatAuth error:", e);
  }
}

// Carga datos del cliente desde tabla `clientes` usando el email de la sesión.
// Si el cliente NO existe (caso login con Google primera vez), lo crea automáticamente
// con los datos que vienen del provider OAuth.
function _catCargarClienteData(_try){
  if(!_catSession || !_catSession.user) return;
  var user = _catSession.user;
  var email = user.email;
  if(!email) return;
  _try = _try||0;
  apiGet("clientes","select=*&email=ilike."+encodeURIComponent(email)+"&limit=1")
    .then(function(rows){
      if(rows && rows.length){
        // Cliente ya existe → todo normal
        _catCliente = rows[0];
        try{ _madreRefrescar(); }catch(_eM){}
        // Si la fila no tiene auth_user_id (cliente legacy creado por admin sin auth),
        // linkearla ahora que tenemos sesión válida. Esto desbloquea acceso futuro vía RLS.
        if(!_catCliente.auth_user_id && user.id){
          apiPatch("clientes", {auth_user_id: user.id, updated_at: new Date().toISOString()}, "id=eq."+_catCliente.id)
            .then(function(){
              _catCliente.auth_user_id = user.id;
              _dbg("[belle-cat] cliente linkeado a auth_user_id:", user.id);
            })
            .catch(function(e){ console.error("[belle-cat] error linkeando auth_user_id:", e); });
        }
        _catFinalizarCargaCliente();
      } else {
        // Cliente NO existe (todavía).
        var esOAuth = user.app_metadata && user.app_metadata.provider && user.app_metadata.provider !== 'email';
        if(esOAuth){
          _catAutocrearClienteDesdeOAuth(user);
        } else if(_try < 6){
          // Puede ser una condición de carrera: la fila se está creando recién
          // (registro por email). Reintentar antes de rendirse.
          setTimeout(function(){ _catCargarClienteData(_try+1); }, 900);
        } else {
          // Hay sesión válida pero la fila de cliente no existe (el registro no la
          // llegó a crear). Auto-reparar: crearla ahora con los datos de la sesión.
          _dbg("[belle-cat] sin fila de cliente tras reintentos → autocreando");
          _catAutocrearClienteDesdeOAuth(user);
        }
      }
    })
    .catch(function(e){
      console.error("[belle-cat] _catCargarClienteData error:", e);
      if(_try < 6){ setTimeout(function(){ _catCargarClienteData(_try+1); }, 1200); }
      else { _catFinalizarCargaCliente(); }
    });
}

// Crea el registro en `clientes` con los datos que vienen del provider OAuth (Google/Facebook)
function _catAutocrearClienteDesdeOAuth(user){
  var meta = user.user_metadata || {};
  // Google manda: full_name, name, given_name, family_name, picture, email
  // Facebook manda: full_name, name, picture
  var nombreCompleto = meta.full_name || meta.name || "";
  var nombre = meta.given_name || (nombreCompleto.split(" ")[0] || "");
  var apellido = meta.family_name || (nombreCompleto.split(" ").slice(1).join(" ") || "");
  if(!nombre) nombre = (user.email||"").split("@")[0]; // fallback
  if(!apellido) apellido = "—"; // tu BD requiere apellido NOT NULL; lo completará en Perfil

  var datos = {
    nombre: nombre,
    apellido: apellido,
    email: user.email,
    auth_user_id: user.id,
    estado: "activo",
    cuenta_corriente_habilitada: false,
    saldo_cc: 0
  };
  _dbg("[belle-cat] Autocreando cliente OAuth:",datos);

  apiPost("clientes", datos).then(function(rowsCreated){
    var nuevo = Array.isArray(rowsCreated) && rowsCreated.length ? rowsCreated[0] : null;
    if(nuevo){
      _catCliente = nuevo;
      _catToast("¡Bienvenido "+nombre+"! Cargá tu dirección para empezar","tok");
      // Pedir domicilio obligatorio + completar teléfono
      _catFinalizarCargaCliente();
      // Forzar pedido de primer domicilio
      setTimeout(function(){
        if(typeof _catPedirPrimerDomicilio === 'function'){
          _catPedirPrimerDomicilio();
        }
      }, 600);
    } else {
      // Si por alguna razón no devolvió la fila, recargar
      console.warn("[belle-cat] autocrear no devolvió fila, reintentando lectura");
      apiGet("clientes","select=*&email=ilike."+encodeURIComponent(user.email)+"&limit=1").then(function(rows2){
        if(rows2 && rows2.length){
          _catCliente = rows2[0];
          try{ _madreRefrescar(); }catch(_eM){}
          _catFinalizarCargaCliente();
          setTimeout(function(){
            if(typeof _catPedirPrimerDomicilio === 'function') _catPedirPrimerDomicilio();
          }, 600);
        }
      });
    }
  }).catch(function(e){
    console.error("[belle-cat] autocrear cliente OAuth error:",e);
    _catToast("Error al crear tu cuenta. Intentá de nuevo.","terr");
  });
}

// Pasos finales después de tener _catCliente cargado (existía o se acaba de crear)
function _catFinalizarCargaCliente(){
  if(typeof catActualizarBoton === 'function') catActualizarBoton();
  if(typeof catCargarFavsIds === 'function') catCargarFavsIds();
  if(typeof _catCargarNotifs === 'function') _catCargarNotifs();
  // Catálogos del cliente: si Belle cambió precios desde la última vez, deja
  // UN aviso simple en la campanita (sin mostrar ningún precio).
  if(_catCliente && _catCliente.puede_crear_catalogos && typeof _catCatChequearPrecios === 'function'){
    setTimeout(function(){ _catCatChequearPrecios(function(){ if(typeof _catCargarNotifs==='function')_catCargarNotifs(true); }); }, 2500);
  }
  // Si el drawer está abierto, re-renderizarlo
  var dw = document.getElementById("drawerCuenta");
  if(dw && dw.classList.contains("open") && typeof catRenderDrawer === 'function'){
    _catDrawerView = "panel";
    catRenderDrawer();
  }
  // Cartel automático de avisos: aparece en cada login mientras el usuario no haya decidido (aceptar/negar)
  if(typeof _catMaybeAutoPushPrompt === 'function') _catMaybeAutoPushPrompt();
}

// Disparar init cuando esté el SDK
document.addEventListener('DOMContentLoaded', function(){
  var _authCheck = setInterval(function(){
    if(window.supabase){
      clearInterval(_authCheck);
      initCatAuth();
    }
  }, 300);
});

// ════════════════════════════════════════════════════════════════════
// FASE B — Panel del cliente (login, registro, perfil, pedidos, etc)
// ════════════════════════════════════════════════════════════════════

// Estado global del drawer Mi Cuenta
var _catDrawerView = "login"; // "login" | "registro" | "recuperar" | "panel"
var _catPanelTab = "pedidos";  // "pedidos" (default) | "favoritos" | "direcciones" | "compras" | "perfil"
var _catDrawerLoadTries = 0, _catDrawerLoadPoll = null;
function _catReintentarCarga(){
  _catDrawerLoadTries = 0;
  if(_catDrawerLoadPoll){ clearTimeout(_catDrawerLoadPoll); _catDrawerLoadPoll = null; }
  if(_catSession && _catSession.user){ _catCargarClienteData(); }
  if(typeof catRenderDrawer === 'function') catRenderDrawer();
}

// ── Helpers de UI ────────────────────────────────────────────────────
function _catEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
// Para valores que van adentro de un atributo entre comillas simples (src, alt, title). _catEsc ya
// cubre la comilla simple; este alias deja explícito en el call site que el valor va en un atributo.
function _catEscAttr(s){return _catEsc(s).replace(/'/g,"&#39;");}
function _catToast(msg, tipo){
  // Reutiliza el toast existente del catálogo si está, sino crea uno simple
  if(typeof toast === 'function'){ toast(msg, tipo); return; }
  var t = document.createElement('div');
  var bg = tipo==="terr"?"#c5443a":tipo==="twarn"?"#c4965a":"#5a8a4a";
  t.style.cssText = "position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:"+bg+";color:#fff;padding:.7rem 1.2rem;border-radius:8px;font-size:.85rem;z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,.2);max-width:90%;text-align:center";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){t.style.opacity="0";t.style.transition="opacity .4s";},2200);
  setTimeout(function(){t.remove();},2700);
}

// ── Render principal del drawer (decide login vs panel) ─────────────
function catRenderDrawer(){
  var body = document.getElementById("cuentaBody");
  var titulo = document.getElementById("cuentaTitulo");
  if(!body) return;

  if(!_catSession || !_catSession.user){
    // No hay sesión → mostrar la vista correspondiente (login/registro/recuperar)
    if(titulo) titulo.textContent = "Mi cuenta";
    if(_catDrawerView === "registro"){
      _catRenderRegistro(body);
    } else if(_catDrawerView === "recuperar"){
      _catRenderRecuperar(body);
    } else {
      _catRenderLogin(body);
    }
    return;
  }

  // Hay sesión, pero quizás aún no cargó _catCliente (pasa por timing)
  if(!_catCliente){
    body.innerHTML = "<div style='text-align:center;padding:2.5rem 1rem;color:var(--mid)'>"+
      "<div class='cat-spin' style='margin-bottom:.7rem'></div>"+
      "<div style='font-size:.85rem'>Cargando datos...</div>"+
      "</div>";
    if(_catDrawerLoadPoll){ clearTimeout(_catDrawerLoadPoll); _catDrawerLoadPoll = null; }
    _catDrawerLoadPoll = setTimeout(function(){
      var dw2 = document.getElementById("drawerCuenta");
      if(!dw2 || !dw2.classList.contains("open")){ _catDrawerLoadTries = 0; return; }
      if(!_catSession || !_catSession.user){ _catDrawerLoadTries = 0; catRenderDrawer(); return; }
      if(_catCliente){ _catDrawerLoadTries = 0; catRenderDrawer(); return; }
      _catDrawerLoadTries++;
      if(_catDrawerLoadTries < 14){
        catRenderDrawer(); // sigue mostrando el spinner y reprograma el chequeo
      } else {
        _catDrawerLoadTries = 0;
        body.innerHTML = "<div style='text-align:center;padding:2.5rem 1rem;color:var(--mid)'>"+
          "<div style='font-size:.9rem;margin-bottom:.9rem;color:var(--tx,#5a4a30)'>No pudimos cargar tu cuenta.</div>"+
          "<button onclick='_catReintentarCarga()' style='background:#c4965a;color:#fff;border:none;border-radius:9px;padding:.6rem 1.2rem;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit'>Reintentar</button>"+
          "</div>";
      }
    }, 800);
    return;
  }
  _catDrawerLoadTries = 0;
  if(_catDrawerLoadPoll){ clearTimeout(_catDrawerLoadPoll); _catDrawerLoadPoll = null; }

  // Tiene cliente cargado → mostrar panel
  if(titulo){
    var nom = _catCliente.nombre || "Mi cuenta";
    titulo.textContent = String(nom).split(" ")[0];
  }
  _catRenderPanel(body);
}

// ── Vista LOGIN ──────────────────────────────────────────────────────
function _catRenderLogin(body){
  var h = "";
  h += "<div style='padding:.5rem .2rem'>";
  h += "<div style='text-align:center;margin-bottom:1.2rem'>";
  h += "<div style='font-size:2.5rem;margin-bottom:.3rem'>&#128272;</div>";
  h += "<div style='font-size:1.05rem;font-weight:600;color:var(--dark)'>Iniciar sesión</div>";
  h += "<div style='font-size:.78rem;color:var(--mid);margin-top:.2rem'>Accedé a tus pedidos, favoritos y más</div>";
  h += "</div>";

  h += "<div style='display:flex;flex-direction:column;gap:.7rem'>";

  // Botón "Continuar con Google"
  h += "<button onclick='catLoginGoogle()' style='background:#fff;color:#3c4043;border:1px solid #dadce0;padding:.65rem;border-radius:8px;font-size:.88rem;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;font-family:inherit;transition:box-shadow .15s' onmouseover='this.style.boxShadow=&quot;0 1px 3px rgba(60,64,67,.15)&quot;' onmouseout='this.style.boxShadow=&quot;none&quot;'>"+
    "<svg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'>"+
      "<path fill='#4285F4' d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z'/>"+
      "<path fill='#34A853' d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z'/>"+
      "<path fill='#FBBC05' d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z'/>"+
      "<path fill='#EA4335' d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z'/>"+
    "</svg>"+
    "<span>Continuar con Google</span>"+
    "</button>";

  // Divisor
  h += "<div style='display:flex;align-items:center;gap:.6rem;margin:.3rem 0'>";
  h += "<div style='flex:1;height:1px;background:#e8d9bf'></div>";
  h += "<span style='font-size:.66rem;color:var(--mid);text-transform:uppercase;letter-spacing:.05em'>o con email</span>";
  h += "<div style='flex:1;height:1px;background:#e8d9bf'></div>";
  h += "</div>";

  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>Email</label>";
  h += "<input type='email' id='_catLoginEmail' autocomplete='email' onkeydown='if(event.key===&quot;Enter&quot;)document.getElementById(&quot;_catLoginPwd&quot;).focus()' style='width:100%;padding:.6rem .8rem;border:1px solid var(--accent-light, #e8d9bf);border-radius:8px;font-size:.92rem;background:#fff;color:var(--dark);margin-top:.3rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>Contraseña</label>";
  h += "<input type='password' id='_catLoginPwd' autocomplete='current-password' onkeydown='if(event.key===&quot;Enter&quot;)catLogin()' style='width:100%;padding:.6rem .8rem;border:1px solid var(--accent-light, #e8d9bf);border-radius:8px;font-size:.92rem;background:#fff;color:var(--dark);margin-top:.3rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<div style='text-align:right;margin-top:-.2rem'>";
  h += "<a href='javascript:void(0)' onclick='_catCambiarVista(&quot;recuperar&quot;)' style='font-size:.72rem;color:var(--accent);text-decoration:none'>¿Olvidaste tu contraseña?</a>";
  h += "</div>";

  h += "<button id='_catLoginBtn' onclick='_lockClick(this,function(){return catLogin();},{texto:\"Iniciando...\"})' style='background:var(--accent);color:#fff;border:none;padding:.7rem;border-radius:8px;font-size:.92rem;font-weight:600;cursor:pointer;margin-top:.5rem;letter-spacing:.02em'>Iniciar sesión</button>";

  h += "<div style='text-align:center;margin:.8rem 0;display:flex;align-items:center;gap:.6rem'>";
  h += "<div style='flex:1;height:1px;background:#e8d9bf'></div>";
  h += "<span style='font-size:.7rem;color:var(--mid)'>o</span>";
  h += "<div style='flex:1;height:1px;background:#e8d9bf'></div>";
  h += "</div>";

  h += "<button onclick='_catCambiarVista(&quot;registro&quot;)' style='background:transparent;color:var(--accent);border:1.5px solid var(--accent);padding:.65rem;border-radius:8px;font-size:.88rem;font-weight:600;cursor:pointer;letter-spacing:.02em'>Crear cuenta nueva</button>";

  h += "</div>";
  h += "</div>";
  body.innerHTML = h;

  setTimeout(function(){
    var e = document.getElementById("_catLoginEmail");
    if(e) e.focus();
  }, 200);
}

// ── Vista REGISTRO (versión preliminar — sin domicilio aún, eso viene en sub-bloque 4) ──
function _catRenderRegistro(body){
  var h = "";
  h += "<div style='padding:.5rem .2rem'>";
  h += "<button onclick='_catCambiarVista(&quot;login&quot;)' style='background:none;border:none;color:var(--mid);font-size:.78rem;cursor:pointer;padding:0;margin-bottom:.7rem;display:flex;align-items:center;gap:.3rem'>&larr; Volver al login</button>";

  h += "<div style='text-align:center;margin-bottom:1.2rem'>";
  h += "<div style='font-size:2.3rem;margin-bottom:.3rem'>&#128100;</div>";
  h += "<div style='font-size:1.05rem;font-weight:600;color:var(--dark)'>Crear cuenta</div>";
  h += "<div style='font-size:.75rem;color:var(--mid);margin-top:.2rem'>Es gratis y rápido</div>";
  h += "</div>";

  h += "<div style='background:#fef9f0;border:1px solid #f4e3c1;border-radius:7px;padding:.55rem .7rem;margin-bottom:.8rem;font-size:.72rem;color:#8a6f3a'>";
  h += "&#9432; Después de registrarte vas a poder agregar tu dirección de entrega.";
  h += "</div>";

  // Botón "Continuar con Google" arriba (más rápido que llenar el form)
  h += "<button onclick='catLoginGoogle()' style='width:100%;background:#fff;color:#3c4043;border:1px solid #dadce0;padding:.65rem;border-radius:8px;font-size:.88rem;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;font-family:inherit;margin-bottom:.8rem;transition:box-shadow .15s' onmouseover='this.style.boxShadow=&quot;0 1px 3px rgba(60,64,67,.15)&quot;' onmouseout='this.style.boxShadow=&quot;none&quot;'>"+
    "<svg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'>"+
      "<path fill='#4285F4' d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z'/>"+
      "<path fill='#34A853' d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z'/>"+
      "<path fill='#FBBC05' d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z'/>"+
      "<path fill='#EA4335' d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z'/>"+
    "</svg>"+
    "<span>Registrarme con Google</span>"+
    "</button>";

  // Divisor
  h += "<div style='display:flex;align-items:center;gap:.6rem;margin-bottom:.8rem'>";
  h += "<div style='flex:1;height:1px;background:#e8d9bf'></div>";
  h += "<span style='font-size:.66rem;color:var(--mid);text-transform:uppercase;letter-spacing:.05em'>o con email</span>";
  h += "<div style='flex:1;height:1px;background:#e8d9bf'></div>";
  h += "</div>";

  h += "<div style='display:flex;flex-direction:column;gap:.7rem'>";
  h += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:.5rem'>";
  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Nombre *</label>";
  h += "<input type='text' id='_catRegNombre' style='width:100%;padding:.55rem .7rem;border:1px solid #e8d9bf;border-radius:8px;font-size:.88rem;background:#fff;color:var(--dark);margin-top:.25rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Apellido</label>";
  h += "<input type='text' id='_catRegApellido' style='width:100%;padding:.55rem .7rem;border:1px solid #e8d9bf;border-radius:8px;font-size:.88rem;background:#fff;color:var(--dark);margin-top:.25rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "</div>";

  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Email *</label>";
  h += "<input type='email' id='_catRegEmail' autocomplete='email' style='width:100%;padding:.55rem .7rem;border:1px solid #e8d9bf;border-radius:8px;font-size:.88rem;background:#fff;color:var(--dark);margin-top:.25rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Teléfono *</label>";
  h += "<input type='tel' id='_catRegTel' placeholder='3515121193' style='width:100%;padding:.55rem .7rem;border:1px solid #e8d9bf;border-radius:8px;font-size:.88rem;background:#fff;color:var(--dark);margin-top:.25rem;box-sizing:border-box;font-family:inherit'>";
  h += "<div style='font-size:.66rem;color:var(--mid);margin-top:.2rem'>Sin 0 ni 15. Ej: 3515121193</div></div>";

  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Contraseña *</label>";
  h += "<input type='password' id='_catRegPwd' autocomplete='new-password' style='width:100%;padding:.55rem .7rem;border:1px solid #e8d9bf;border-radius:8px;font-size:.88rem;background:#fff;color:var(--dark);margin-top:.25rem;box-sizing:border-box;font-family:inherit'>";
  h += "<div style='font-size:.66rem;color:var(--mid);margin-top:.2rem'>Mínimo 6 caracteres</div></div>";

  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Repetir contraseña *</label>";
  h += "<input type='password' id='_catRegPwd2' autocomplete='new-password' onkeydown='if(event.key===&quot;Enter&quot;)catRegistro()' style='width:100%;padding:.55rem .7rem;border:1px solid #e8d9bf;border-radius:8px;font-size:.88rem;background:#fff;color:var(--dark);margin-top:.25rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<button id='_catRegBtn' onclick='_lockClick(this,function(){return catRegistro();},{texto:\"Creando cuenta...\"})' style='background:var(--accent);color:#fff;border:none;padding:.7rem;border-radius:8px;font-size:.92rem;font-weight:600;cursor:pointer;margin-top:.6rem;letter-spacing:.02em'>Crear cuenta</button>";

  h += "<div style='text-align:center;margin-top:.5rem;font-size:.74rem;color:var(--mid)'>";
  h += "¿Ya tenés cuenta? <a href='javascript:void(0)' onclick='_catCambiarVista(&quot;login&quot;)' style='color:var(--accent);text-decoration:none;font-weight:600'>Iniciar sesión</a>";
  h += "</div>";

  h += "</div>";
  h += "</div>";
  body.innerHTML = h;

  setTimeout(function(){
    var e = document.getElementById("_catRegNombre");
    if(e) e.focus();
  }, 200);
}

// ── Vista RECUPERAR contraseña ───────────────────────────────────────
function _catRenderRecuperar(body){
  var h = "";
  h += "<div style='padding:.5rem .2rem'>";
  h += "<button onclick='_catCambiarVista(&quot;login&quot;)' style='background:none;border:none;color:var(--mid);font-size:.78rem;cursor:pointer;padding:0;margin-bottom:.7rem;display:flex;align-items:center;gap:.3rem'>&larr; Volver al login</button>";

  h += "<div style='text-align:center;margin-bottom:1.2rem'>";
  h += "<div style='font-size:2.3rem;margin-bottom:.3rem'>&#128274;</div>";
  h += "<div style='font-size:1.05rem;font-weight:600;color:var(--dark)'>Recuperar contraseña</div>";
  h += "<div style='font-size:.75rem;color:var(--mid);margin-top:.2rem'>Te enviaremos un email para restablecerla</div>";
  h += "</div>";

  h += "<div style='display:flex;flex-direction:column;gap:.7rem'>";
  h += "<div><label style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Email</label>";
  h += "<input type='email' id='_catRecEmail' autocomplete='email' onkeydown='if(event.key===&quot;Enter&quot;)catRecuperarPwd()' style='width:100%;padding:.6rem .8rem;border:1px solid #e8d9bf;border-radius:8px;font-size:.92rem;background:#fff;color:var(--dark);margin-top:.3rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<button id='_catRecBtn' onclick='catRecuperarPwd()' style='background:var(--accent);color:#fff;border:none;padding:.7rem;border-radius:8px;font-size:.92rem;font-weight:600;cursor:pointer;margin-top:.5rem'>Enviar email de recuperación</button>";

  h += "</div>";
  h += "</div>";
  body.innerHTML = h;

  setTimeout(function(){
    var e = document.getElementById("_catRecEmail");
    if(e) e.focus();
  }, 200);
}

// ── Cambiar vista del drawer ─────────────────────────────────────────
function _catCambiarVista(vista){
  _catDrawerView = vista;
  catRenderDrawer();
}

// ── LOGIN ────────────────────────────────────────────────────────────
// ── LOGIN/REGISTRO con Google (OAuth) ─────────────────────────────────
// Tanto login como registro usan el mismo flujo: Supabase abre la ventana de Google,
// el usuario elige su cuenta, Supabase recibe la confirmación y dispara onAuthStateChange.
// Si el cliente no existe en la tabla `clientes`, lo crea automáticamente con los datos
// que vienen de Google (nombre, email, foto). Después le pide domicilio.
function catLoginGoogle(){
  if(!_sbAuth){_catToast("Sistema cargando, esperá un segundo","twarn");return;}
  // Marcar que la sesión que viene es OAuth-Google (para diferenciar el flujo post-login)
  try{ sessionStorage.setItem('_catOAuthFlow', 'google'); } catch(e){}
  _sbAuth.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Volver al sitio actual después del login
      redirectTo: window.location.origin + window.location.pathname,
      queryParams: {
        // Pedir info de email + perfil básico
        access_type: 'online',
        prompt: 'select_account'
      }
    }
  }).catch(function(e){
    console.error("[belle-cat] catLoginGoogle error:",e);
    _catToast("No se pudo iniciar el login con Google","terr");
  });
}

function catLogin(){
  var email = (document.getElementById("_catLoginEmail")||{value:""}).value.trim().toLowerCase();
  var pwd = (document.getElementById("_catLoginPwd")||{value:""}).value;
  if(!email || !pwd){_catToast("Completá email y contraseña","twarn");return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){_catToast("El email no es válido","twarn");return;}

  if(!_sbAuth){_catToast("Sistema cargando, esperá un segundo","twarn");return;}

  // Retornar la promesa para que _lockClick pueda esperarla
  return _sbAuth.auth.signInWithPassword({email: email, password: pwd}).then(function(res){
    if(res.error){
      var msg = res.error.message || "Error al iniciar sesión";
      if(/invalid login credentials/i.test(msg)) msg = "Email o contraseña incorrectos";
      else if(/email not confirmed/i.test(msg)) msg = "Confirmá tu email primero (revisá tu bandeja de entrada)";
      _catToast(msg, "terr");
      return;
    }
    _catToast("¡Bienvenido!","tok");
    _catDrawerView = "panel";
    // El listener onAuthStateChange se encarga de cargar _catCliente y rerender
  }).catch(function(e){
    console.error("[belle-cat] catLogin error:",e);
    _catToast("Error de conexión","terr");
  });
}

// ── REGISTRO ─────────────────────────────────────────────────────────
function catRegistro(){
  var nombre = (document.getElementById("_catRegNombre")||{value:""}).value.trim();
  var apellido = (document.getElementById("_catRegApellido")||{value:""}).value.trim();
  var email = (document.getElementById("_catRegEmail")||{value:""}).value.trim().toLowerCase();
  var tel = (document.getElementById("_catRegTel")||{value:""}).value.trim();
  var pwd = (document.getElementById("_catRegPwd")||{value:""}).value;
  var pwd2 = (document.getElementById("_catRegPwd2")||{value:""}).value;

  // Validaciones
  if(!nombre){_catToast("Ingresá tu nombre","twarn");return;}
  if(!email){_catToast("Ingresá tu email","twarn");return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){_catToast("El email no es válido","twarn");return;}
  if(!tel){_catToast("Ingresá tu teléfono","twarn");return;}
  var telLimpio = tel.replace(/\D/g,"");
  if(telLimpio.length < 8 || telLimpio.length > 13){_catToast("El teléfono no es válido","twarn");return;}
  if(!pwd || pwd.length < 6){_catToast("La contraseña debe tener al menos 6 caracteres","twarn");return;}
  if(pwd !== pwd2){_catToast("Las contraseñas no coinciden","twarn");return;}

  if(!_sbAuth){_catToast("Sistema cargando, esperá un segundo","twarn");return;}

  // Retornar la promesa para que _lockClick pueda esperarla
  return apiGet("clientes","select=id,email&email=eq."+encodeURIComponent(email)+"&limit=1").then(function(rows){
    if(rows && rows.length){
      _catToast("Ya hay una cuenta con ese email. ¿Olvidaste la contraseña?","twarn");
      return;
    }
    // Registrar en Supabase Auth
    return _sbAuth.auth.signUp({
      email: email,
      password: pwd,
      options: {
        data: {nombre: nombre, apellido: apellido, telefono: telLimpio}
      }
    }).then(function(res){
      if(res.error){
        var msg = res.error.message || "Error al registrarse";
        if(/already registered/i.test(msg) || /already exists/i.test(msg)){
          msg = "Ya hay una cuenta con ese email. ¿Olvidaste la contraseña?";
        } else if(/password/i.test(msg) && /weak/i.test(msg)){
          msg = "La contraseña es muy débil. Probá una más larga.";
        }
        _catToast(msg, "terr");
        return;
      }
      // Crear fila en tabla `clientes`
      var authUserId = res.data && res.data.user ? res.data.user.id : null;
      var dataCliente = {
        nombre: nombre,
        apellido: apellido || null,
        email: email,
        telefono_principal: telLimpio,
        lista_precios: "minorista",
        estado: "activo",
        cuenta_corriente_habilitada: false,
        saldo_cc: 0
      };
      if(authUserId) dataCliente.auth_user_id = authUserId;

      return apiPost("clientes", dataCliente).then(function(rowsCli){
        // Recuperar el cliente recién creado (con su nuevo id)
        var clienteNuevo = Array.isArray(rowsCli) && rowsCli.length ? rowsCli[0] : null;
        if(clienteNuevo){
          _catCliente = clienteNuevo;
        }
        // Si la sesión vino directa (auto-confirm en Supabase) → ya está logueado
        if(res.data && res.data.session){
          _catSession = res.data.session;
          _catToast("¡Cuenta creada! Ahora agregá tu dirección","tok");
          // OBLIGATORIO: pedir domicilio antes de poder seguir
          setTimeout(function(){
            _catPedirPrimerDomicilio();
          }, 400);
        } else {
          // Necesita confirmar email (config de Supabase)
          _catToast("Cuenta creada. Revisá tu email para confirmarla.","tok");
          _catDrawerView = "login";
          catRenderDrawer();
        }
      });
    });
  }).catch(function(e){
    console.error("[belle-cat] catRegistro error:",e);
    _catToast("Error al crear la cuenta. Intentá de nuevo.","terr");
  });
}

// ── RECUPERAR contraseña ─────────────────────────────────────────────
function catRecuperarPwd(){
  var email = (document.getElementById("_catRecEmail")||{value:""}).value.trim().toLowerCase();
  if(!email){_catToast("Ingresá tu email","twarn");return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){_catToast("El email no es válido","twarn");return;}

  var btn = document.getElementById("_catRecBtn");
  if(btn){btn.disabled = true; btn.textContent = "Enviando...";}

  if(!_sbAuth){_catToast("Sistema cargando","twarn");if(btn){btn.disabled=false;btn.textContent="Enviar email de recuperación";}return;}

  _sbAuth.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname  // URL actual (sea catalogo_index.html o /catalogo)
  }).then(function(res){
    if(res.error){
      console.error("[belle-cat] resetPassword error:",res.error);
      _catToast("Error al enviar el email","terr");
      if(btn){btn.disabled=false;btn.textContent="Enviar email de recuperación";}
      return;
    }
    _catToast("Te enviamos un email con instrucciones","tok");
    _catDrawerView = "login";
    setTimeout(catRenderDrawer, 1200);
  }).catch(function(e){
    console.error("[belle-cat] catRecuperarPwd error:",e);
    _catToast("Error de conexión","terr");
    if(btn){btn.disabled=false;btn.textContent="Enviar email de recuperación";}
  });
}

// ── LOGOUT ───────────────────────────────────────────────────────────
function catLogout(){
  if(!_sbAuth){return;}
  _catModalConfirm({
    titulo: 'Cerrar sesión',
    mensaje: '¿Estás seguro que querés cerrar sesión? Tu carrito se vaciará.',
    confirmTxt: 'Sí, cerrar sesión',
    cancelTxt: 'Cancelar',
    icono: '👋',
    onConfirm: function(){
      _sbAuth.auth.signOut().then(function(){
        _catCliente = null;
        _catSession = null;
        _catFavs = [];
        _catNotifs = [];
        _catNotifLoaded = false;
        if(typeof _catRenderBell === 'function') _catRenderBell();
        _catDrawerView = "login";
        // Limpiar carrito al cerrar sesión: si otra persona usa el dispositivo,
        // no debe heredar los productos del cliente anterior.
        cart = {};
        cstate = {};
        decanState = {};
        if(typeof updateCartCount === 'function') updateCartCount();
        if(typeof renderDrawer === 'function') renderDrawer();
        if(typeof catActualizarBoton === 'function') catActualizarBoton();
        catRenderDrawer();
        _catToast("Sesión cerrada","tok");
      }).catch(function(e){
        console.error("[belle-cat] catLogout error:",e);
        _catToast("Error al cerrar sesión","terr");
      });
    }
  });
}

// ── Vista PANEL (placeholder por ahora — los tabs se completan en sub-bloques 2-7) ──
function _catRenderPanel(body){
  var c = _catCliente;
  var nom = ((c.nombre||"")+" "+(c.apellido||"")).trim() || c.email;
  var inicial = (nom||"?").charAt(0).toUpperCase();

  var h = "";
  h += "<div style='padding:0'>";

  // Header con avatar y nombre
  h += "<div style='background:linear-gradient(135deg, var(--accent), var(--accent-light, #d4a574));padding:1.2rem 1rem;text-align:center;color:#fff;border-radius:8px;margin-bottom:1rem'>";
  h += "<div style='width:55px;height:55px;border-radius:50%;background:rgba(255,255,255,.25);margin:0 auto .5rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:600;backdrop-filter:blur(8px)'>"+inicial+"</div>";
  h += "<div style='font-size:1rem;font-weight:600'>"+_catEsc(nom)+"</div>";
  h += "<div style='font-size:.72rem;opacity:.85;margin-top:.15rem'>"+_catEsc(c.email||"")+"</div>";
  h += "</div>";

  // Tabs (orden definido por usuario):
  // 1) Pedidos (default) — pedidos activos + CC (saldo+movs si tiene)
  // 2) Favoritos
  // 3) Direcciones
  // 4) Mis compras — pedidos cobrados/entregados (historial)
  // 5) Perfil
  // Botón del panel: chico (fila de 3) o largo (apilado). Fix 2026-07: perfil/
  // direcciones/compras van en un renglón; el resto largos, uno abajo del otro.
  var _catBtnPanel = function(t, largo){
    var act = _catPanelTab === t.key;
    var dest = !!t.destacado;
    var bg = act ? "var(--accent)" : (dest ? "linear-gradient(135deg,#c4965a,#a9763f)" : "transparent");
    var col = (act||dest) ? "#fff" : "var(--mid)";
    var bd = (act||dest) ? "var(--accent)" : "#e8d9bf";
    var fw = (act||dest) ? "700" : "500";
    var glow = dest ? "box-shadow:0 2px 9px rgba(196,150,90,.45);" : "";
    var oc = t.action ? t.action : ("_catSetTab(&quot;"+t.key+"&quot;)");
    if(largo){
      return "<button onclick='"+oc+"' style='width:100%;background:"+bg+";color:"+col+";border:1px solid "+bd+";"+glow+"border-radius:9px;padding:.72rem .95rem;font-size:.82rem;cursor:pointer;font-weight:"+fw+";font-family:inherit;display:flex;align-items:center;gap:.55rem;transition:all .15s'>"+
        "<span style='font-size:1rem;flex-shrink:0'>"+t.icon+"</span>"+
        "<span style='overflow:hidden;text-overflow:ellipsis'>"+t.label+"</span>"+
        "</button>";
    }
    return "<button onclick='"+oc+"' style='background:"+bg+";color:"+col+";border:1px solid "+bd+";border-radius:8px;padding:.5rem .35rem;font-size:.72rem;cursor:pointer;font-weight:"+fw+";font-family:inherit;display:flex;align-items:center;justify-content:center;gap:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;transition:all .15s'>"+
      "<span style='font-size:.85rem;flex-shrink:0'>"+t.icon+"</span>"+
      "<span style='overflow:hidden;text-overflow:ellipsis'>"+t.label+"</span>"+
      "</button>";
  };
  // Fila de 3 (chicos)
  h += "<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;margin-bottom:.55rem'>";
  h += _catBtnPanel({key:"perfil",      label:"Perfil",      icon:"&#128100;"}, false);
  h += _catBtnPanel({key:"direcciones", label:"Direcciones", icon:"&#128205;"}, false);
  h += _catBtnPanel({key:"compras",     label:"Mis compras", icon:"&#128722;"}, false);
  h += "</div>";
  // Largos apilados
  var _largosPanel = [];
  _largosPanel.push({key:"pedidos",   label:"Mis Pedidos",   icon:"&#128230;"});
  if(_catCliente && _catCliente.puede_crear_catalogos){
    _largosPanel.push({key:"catalogos", label:"Mis Catálogos", icon:"&#128212;"});
  }
  _largosPanel.push({key:"favoritos", label:"Favoritos", icon:"&hearts;"});
  _largosPanel.push({key:"notificaciones", label:"Notificaciones"+((typeof _catNotifUnread==='function'&&_catNotifUnread()>0)?(" ("+_catNotifUnread()+")"):""), icon:"&#128276;"});
  _largosPanel.push({key:"tarjeta", label:"Crear tarjetas de productos", icon:"&#10024;", action:"abrirGenTarjeta()"});
  h += "<div style='display:flex;flex-direction:column;gap:.42rem;border-bottom:1px solid #e8d9bf;margin-bottom:1rem;padding-bottom:.8rem'>";
  _largosPanel.forEach(function(t){ h += _catBtnPanel(t, true); });
  h += "</div>";

  // Contenido del tab activo
  h += "<div id='_catTabBody'></div>";

  // Botón cerrar sesión al pie
  h += "<div style='margin-top:1.5rem;padding-top:1rem;border-top:1px solid #e8d9bf'>";
  h += "<button onclick='catLogout()' style='width:100%;background:transparent;color:#c5443a;border:1px solid #c5443a;padding:.5rem;border-radius:7px;font-size:.78rem;cursor:pointer;font-weight:600'>Cerrar sesión</button>";
  h += "</div>";

  h += "</div>";
  body.innerHTML = h;
  _catRenderTab();
}

function _catSetTab(tab){
  _catPanelTab = tab;
  _catRenderTab();
  // Re-render tabs para actualizar el activo
  catRenderDrawer();
}

function _catRenderTab(){
  var box = document.getElementById("_catTabBody");
  if(!box) return;
  if(_catPanelTab === "pedidos"){
    _catRenderTabPedidos(box);
  } else if(_catPanelTab === "catalogos"){
    _catRenderTabCatalogos(box);
  } else if(_catPanelTab === "favoritos"){
    _catRenderTabFavoritos(box);
  } else if(_catPanelTab === "direcciones"){
    _catRenderTabDirecciones(box);
  } else if(_catPanelTab === "compras"){
    _catRenderTabCompras(box);
  } else if(_catPanelTab === "perfil"){
    _catRenderTabPerfil(box);
  } else if(_catPanelTab === "notificaciones"){
    _catRenderTabNotifs(box);
  }
}



// ══════════════════════════════════════════════════════════════════
// MIS CATÁLOGOS (cliente) — Fase 2: lista + formato + vista previa
// ══════════════════════════════════════════════════════════════════
var _catCatConfig = null;
var _catCatList = [];
var _catCatLoaded = false;
var _catCatModalState = null;

function _catCargarCatalogos(cb){
  if(!_catCliente || !_catCliente.id){ _catCatList=[]; _catCatLoaded=true; if(cb)cb(); return; }
  var pCfg = _catCatConfig ? Promise.resolve(_catCatConfig) : apiGet("catalogos_config","select=*&id=eq.1").then(function(r){ return (Array.isArray(r)&&r[0])||{}; }).catch(function(){return {};});
  var pList = apiGet("catalogos_cliente","select=*&cliente_id=eq."+_catCliente.id+"&order=updated_at.desc&limit=100").catch(function(){return [];});
  Promise.all([pCfg,pList]).then(function(res){
    _catCatConfig = res[0]||{};
    _catCatList = Array.isArray(res[1])?res[1]:[];
    _catCatLoaded = true;
    var ids=_catCatList.map(function(c){return c.id;});
    if(ids.length){
      apiGet("catalogos_cliente_productos","select=catalogo_id&catalogo_id=in.("+ids.join(",")+")&limit=5000").then(function(rows){
        var cnt={}; (rows||[]).forEach(function(r){ cnt[r.catalogo_id]=(cnt[r.catalogo_id]||0)+1; });
        _catCatList.forEach(function(c){ c._nprod=cnt[c.id]||0; });
        if(cb)cb();
        // Chequeo de precios viejos: refresca el cartelito de "Actualizar precios"
        // y deja UN aviso simple en la campanita si hace falta.
        _catCatChequearPrecios(function(){ if(_catPanelTab==='catalogos'){ var b=document.getElementById('_catTabBody'); if(b)_catRenderTabCatalogos(b); } });
      }).catch(function(){ if(cb)cb(); });
    } else { if(cb)cb(); }
  });
}

// ══════════════════════════════════════════════════════════════════
// MIS CATÁLOGOS — plantillas, precios y aviso de actualización
// (v3 2026-08: 5 plantillas, vista previa fiel en vivo, ajuste de precios
//  por porcentaje sobre selección, aviso simple de cambios de precio y
//  generación de PDF con caché de imágenes en dataURL)
// ══════════════════════════════════════════════════════════════════
var _catCatCambios = {};   // {catalogo_id: cuántos precios de Belle cambiaron}
var _catCatCambiosMin = 3; // mínimo para avisar (lo define catalogos_config)

function _catRpcCat(fn, body){
  var tok=(typeof _sbToken==='function')?_sbToken():null;
  var auth=tok?("Bearer "+tok):("Bearer "+SB_KEY);
  return fetch(SB_URL+"/rest/v1/rpc/"+fn,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':auth},body:JSON.stringify(body||{})})
    .then(function(r){ if(!r.ok){ return r.text().then(function(t){ throw new Error('HTTP '+r.status+': '+t.slice(0,140)); }); } return r.json(); });
}

// Pregunta a la base si los catálogos del cliente quedaron con precios viejos.
// El RPC deja UN aviso simple en la campanita (sin detalle de precios).
function _catCatChequearPrecios(cb){
  if(!_catCliente || !_catCliente.id || !_catCliente.puede_crear_catalogos){ if(cb)cb(); return; }
  _catRpcCat('catalogo_chequear_precios').then(function(res){
    var d=Array.isArray(res)?res[0]:res;
    if(d && d.min)_catCatCambiosMin=d.min;
    _catCatCambios={};
    ((d&&d.catalogos)||[]).forEach(function(c){ _catCatCambios[c.id]=c.cambios||0; });
    if(cb)cb();
  }).catch(function(e){ console.warn('[cat precios]',e); if(cb)cb(); });
}

function _catRenderTabCatalogos(box){
  if(!box)return;
  if(!_catCatLoaded){
    box.innerHTML="<div style='padding:1.5rem;text-align:center;color:#9a8870'>Cargando...</div>";
    _catCargarCatalogos(function(){ var b=document.getElementById("_catTabBody"); if(b)_catRenderTabCatalogos(b); });
    return;
  }
  var cfg=_catCatConfig||{};
  var max=cfg.max_borradores_por_cliente||0;
  var alcanzo = max>0 && _catCatList.length>=max;
  var h="";
  h+="<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem'>";
  h+="<div style='font-size:1.05rem;font-weight:700;color:#5a4a30;font-family:\"Cormorant Garamond\",serif'>Mis Catálogos</div>";
  if(!alcanzo){ h+="<button onclick='_catCatNuevo()' style='background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:8px;padding:.45rem .85rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:inherit'>+ Nuevo</button>"; }
  h+="</div>";
  h+="<div style='font-size:.74rem;color:#9a8870;margin-bottom:.9rem'>Armá tu catálogo en PDF con tu marca y tus precios. Elegí entre varias plantillas y mirá cómo queda antes de descargarlo.</div>";
  if(alcanzo){ h+="<div style='font-size:.7rem;color:#b8860b;background:#fff8ec;border:1px solid #f0dca6;border-radius:8px;padding:.5rem .7rem;margin-bottom:.8rem'>Llegaste al máximo de "+max+" catálogos. Borrá uno para crear otro.</div>"; }
  if(!_catCatList.length){
    h+="<div style='padding:1.6rem 1rem;text-align:center;color:#9a8870;font-size:.82rem;border:1px dashed #e8d9bf;border-radius:10px'><div style='font-size:1.9rem;margin-bottom:.3rem'>&#128212;</div>Todavía no tenés catálogos.<br>Tocá <b>+ Nuevo</b> para armar el primero.</div>";
  } else {
    _catCatList.forEach(function(cat){
      var nprod = cat._nprod!=null?cat._nprod:null;
      var fecha = cat.updated_at?new Date(cat.updated_at).toLocaleDateString('es-AR'):"";
      var tpl=_catTplDef((cat.config&&cat.config.plantilla)||'tabla');
      var camb=_catCatCambios[cat.id]||0;
      h+="<div style='border:1px solid #e8d9bf;border-radius:11px;padding:.8rem .9rem;margin-bottom:.7rem;background:#fffdf9'>";
      h+="<div style='display:flex;align-items:center;gap:.4rem'><div style='font-size:.95rem;font-weight:700;color:#5a4a30;flex:1;min-width:0'>"+_catEsc(cat.nombre||'Catálogo')+"</div>";
      h+="<span style='font-size:.6rem;font-weight:700;color:#a9763f;background:#f7efe1;border:1px solid #ecdcc0;border-radius:999px;padding:.15rem .5rem;white-space:nowrap'>"+_catEsc(tpl.nombre)+"</span></div>";
      h+="<div style='font-size:.66rem;color:#aa9a80;margin-top:.15rem'>"+(nprod!=null?(nprod+" producto"+(nprod===1?'':'s')+" · "):"")+"editado "+fecha+"</div>";
      // 2026-09-29 (Ger): sin aviso de "hubo actualizaciones de precios"; el catálogo se regenera con los precios del día al descargarlo
      h+="<div style='display:flex;gap:.4rem;margin-top:.7rem;flex-wrap:wrap'>";
      h+="<button onclick='_catCatElegirProductos("+cat.id+")' style='flex:1;min-width:140px;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:8px;padding:.5rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:inherit'>Productos y precios →</button>";
      h+="<button onclick='_catCatPdfGenerar("+cat.id+")' style='flex:1;min-width:120px;background:#fff;border:1.5px solid #c4965a;color:#a9763f;border-radius:8px;padding:.5rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:inherit'>📄 Descargar PDF</button>";
      h+="<button onclick='_catCatEditarFormato("+cat.id+")' style='flex:1;min-width:120px;background:#f4e5c9;border:1.5px solid #c4965a;color:#8a6a3a;border-radius:8px;padding:.5rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:inherit'>&#127912; Diseño</button>";
      h+="<button onclick='_catCatDuplicar("+cat.id+")' title='Duplicar' style='background:#fff;border:1px solid #d4ba8a;color:#a9763f;border-radius:8px;padding:.5rem .65rem;font-size:.82rem;cursor:pointer;font-family:inherit'>&#128203;</button>";
      h+="<button onclick='_catCatBorrar("+cat.id+")' title='Borrar' style='background:#fff;border:1px solid #f0dad6;color:#cc6b62;border-radius:8px;padding:.5rem .65rem;font-size:.82rem;cursor:pointer;font-family:inherit'>&#128465;</button>";
      h+="</div>";
      h+="</div>";
    });
  }
  box.innerHTML=h;
}

// ── PLANTILLAS ────────────────────────────────────────────────────
// pp = productos por hoja según densidad: [primera hoja, resto].
// La primera lleva menos porque arriba va el banner grande (salvo que la
// portada sea hoja aparte, ahí todas usan el número de "resto").
function _catTplDefs(){ return [
  {id:'tabla',     nombre:'Lista clásica', icon:'&#9636;', desc:'Filas con foto chica, precio, notas y acordes. Entran muchos perfumes por hoja.',
   cols:1, pp:{comoda:[5,6],  normal:[7,9],  compacta:[9,12]}},
  {id:'editorial', nombre:'Editorial',     icon:'&#10022;', desc:'Un perfume por bloque, foto grande y tipografía de revista de lujo.',
   cols:1, pp:{comoda:[2,3],  normal:[3,4],  compacta:[4,5]}},
  {id:'revista',   nombre:'Revista',       icon:'&#9635;', desc:'Tarjetas grandes en dos columnas, con foto destacada y acordes.',
   cols:2, pp:{comoda:[4,4],  normal:[4,6],  compacta:[6,8]}},
  {id:'galeria',   nombre:'Galería',       icon:'&#9638;', desc:'Grilla de fotos en tres columnas. Nombre y precio, puro impacto visual.',
   cols:3, pp:{comoda:[6,9],  normal:[9,12], compacta:[12,15]}},
  {id:'minimal',   nombre:'Minimalista',   icon:'&#8801;', desc:'Lista de texto en dos columnas, sin fotos. Se genera en segundos.',
   cols:2, pp:{comoda:[16,20],normal:[22,28],compacta:[30,38]}}
];}
function _catTplHabilitadas(){
  var cfg=_catCatConfig||{};
  var wl=Array.isArray(cfg.plantillas_habilitadas)?cfg.plantillas_habilitadas:[];
  var all=_catTplDefs();
  if(!wl.length)return all;
  var out=all.filter(function(t){return wl.indexOf(t.id)>=0;});
  return out.length?out:all;
}
function _catTplDef(id){
  var all=_catTplDefs();
  return all.filter(function(t){return t.id===id;})[0] || all[0];
}
function _catTplPerPage(cfg){
  var t=_catTplDef(cfg.plantilla||'tabla');
  var d=cfg.densidad||'normal';
  var pp=t.pp[d]||t.pp.normal;
  var first=pp[0], rest=pp[1];
  if(cfg.tapa_on || (cfg.portada_modo||'banner')!=='banner') first=rest;   // sin banner arriba entran los mismos
  return [Math.max(1,first), Math.max(1,rest)];
}
// Cuánto mide cada cosa según la plantilla y la densidad elegida. El tamaño de
// la FOTO y el alto de la fila/tarjeta salen de acá: en "Espaciado" las fotos son
// grandes y entran menos por hoja; en "Compacto" son chicas y entran más. Nunca
// se deforman — la foto ya viene encuadrada y se muestra con object-fit:contain.
function _catMedidas(cfg){
  var t=cfg.plantilla||'tabla', d=cfg.densidad||'normal';
  var M={
    tabla:    {comoda:{fila:150,foto:118,pad:14,nota:60,nom:21,ac:4},
               normal:{fila:112,foto:86, pad:11,nota:44,nom:18,ac:4},
               compacta:{fila:84,foto:62,pad:8, nota:33,nom:15,ac:3}},
    editorial:{comoda:{foto:250,nom:34}, normal:{foto:195,nom:30}, compacta:{foto:150,nom:25}},
    revista:  {comoda:{foto:250,nom:19}, normal:{foto:210,nom:17}, compacta:{foto:170,nom:15}},
    galeria:  {comoda:{foto:190,nom:15}, normal:{foto:150,nom:13}, compacta:{foto:120,nom:11}},
    minimal:  {comoda:{nom:15}, normal:{nom:13}, compacta:{nom:11}}
  };
  var g=M[t]||M.tabla;
  return g[d]||g.normal;
}
function _catTplFont(cfg){
  var t=cfg.tipografia||'elegante';
  if(t==='moderna') return {head:'"Helvetica Neue",Arial,sans-serif', body:'Arial,"Helvetica Neue",Helvetica,sans-serif'};
  if(t==='clasica') return {head:'Georgia,"Times New Roman",serif', body:'Georgia,"Times New Roman",serif'};
  return {head:'"Cormorant Garamond",Georgia,serif', body:'"DM Sans",Arial,Helvetica,sans-serif'};
}

// ── CACHÉ DE IMÁGENES ─────────────────────────────────────────────
// Para el PDF convertimos cada foto UNA vez a dataURL (redimensionada).
// Así html2canvas no vuelve a pedirla por red en cada hoja: es la mayor
// ganancia de tiempo cuando el catálogo tiene muchas páginas.
var _catImgCache = {};
var _catImgLive = false; // true = vista previa en pantalla (usa la URL directa)
function _catImgKey(u,fondo){ return u+'|'+(fondo||''); }
function _catImgOk(u,fondo){ if(!u)return false; if(_catImgLive)return true; return !!_catImgCache[_catImgKey(u,fondo)]; }
function _catImgSrc(u,fondo){
  if(!u)return '';
  var k=_catImgKey(u,fondo);
  if(_catImgLive)return _catImgCache[k]||u;   // en la vista previa, si todavía no se procesó, va la foto tal cual
  return _catImgCache[k]||'';
}
// Saca el FONDO BLANCO del frasco sin tocar el perfume: parte de los bordes de la
// foto y va comiendo sólo el blanco que está pegado al borde (relleno por
// inundación). Así el blanco de la etiqueta o del vidrio, que está "adentro" y no
// toca el borde, queda intacto. Lo que se saca se pinta del color de la hoja.
function _catQuitarFondoBlanco(ctx, w, h, fondoRgb, alpha){
  var img;
  try{ img=ctx.getImageData(0,0,w,h); }catch(e){ return false; }   // foto de otro dominio sin CORS
  var d=img.data, n=w*h;
  var vis=new Uint8Array(n);
  var stack=new Int32Array(n), sp=0;
  function esFondo(i){
    var o=i*4, r=d[o], g=d[o+1], b=d[o+2];
    if(r<232||g<232||b<232) return false;
    var mx=r>g?(r>b?r:b):(g>b?g:b), mn=r<g?(r<b?r:b):(g<b?g:b);
    return (mx-mn)<=14;                                            // blanco/gris clarito, no un color pastel
  }
  function meter(i){ if(i>=0 && i<n && !vis[i] && esFondo(i)){ vis[i]=1; stack[sp++]=i; } }
  var x,y,i;
  for(x=0;x<w;x++){ meter(x); meter((h-1)*w+x); }
  for(y=0;y<h;y++){ meter(y*w); meter(y*w+w-1); }
  var quitados=0;
  while(sp>0){
    i=stack[--sp]; quitados++;
    x=i%w; y=(i-x)/w;
    if(x>0)meter(i-1);
    if(x<w-1)meter(i+1);
    if(y>0)meter(i-w);
    if(y<h-1)meter(i+w);
  }
  if(!quitados) return false;
  var fr=alpha?0:fondoRgb[0], fg=alpha?0:fondoRgb[1], fb=alpha?0:fondoRgb[2], o;
  for(i=0;i<n;i++){ if(vis[i]){ o=i*4; if(alpha){ d[o+3]=0; } else { d[o]=fr; d[o+1]=fg; d[o+2]=fb; } } }
  // Suaviza el borde: los píxeles casi blancos pegados al fondo se mezclan un
  // poco, para que no quede un halo blanco alrededor del frasco.
  for(i=0;i<n;i++){
    if(vis[i])continue;
    x=i%w; y=(i-x)/w;
    if(!((x>0&&vis[i-1])||(x<w-1&&vis[i+1])||(y>0&&vis[i-w])||(y<h-1&&vis[i+w])))continue;
    o=i*4;
    var m=d[o]<d[o+1]?(d[o]<d[o+2]?d[o]:d[o+2]):(d[o+1]<d[o+2]?d[o+1]:d[o+2]);
    if(m<190)continue;
    var t2=(m-190)/65; if(t2>1)t2=1;
    if(alpha){ d[o+3]=Math.round(d[o+3]*(1-t2)); }
    else { d[o]=d[o]+(fr-d[o])*t2; d[o+1]=d[o+1]+(fg-d[o+1])*t2; d[o+2]=d[o+2]+(fb-d[o+2])*t2; }
  }
  ctx.putImageData(img,0,0);
  return true;
}
function _catImgPrep(url, maxW, fondo, cb){
  if(typeof fondo==='function'){ cb=fondo; fondo=null; }
  if(!url){ cb(); return; }
  var key=_catImgKey(url,fondo);
  if(_catImgCache[key]!==undefined){ cb(); return; }
  var im=new Image(); try{ im.crossOrigin='anonymous'; }catch(e){}
  var done=false;
  var t=setTimeout(function(){ if(done)return; done=true; _catImgCache[key]=''; cb(); }, 9000);
  im.onload=function(){
    if(done)return; done=true; clearTimeout(t);
    try{
      var w=im.naturalWidth||im.width, hh=im.naturalHeight||im.height;
      if(!w||!hh){ _catImgCache[key]=''; cb(); return; }
      var lim=maxW||420;
      var sc=Math.min(1, lim/((fondo && fondo!=='alpha')?Math.max(w,hh):w));
      var cw=Math.max(1,Math.round(w*sc)), ch=Math.max(1,Math.round(hh*sc));
      var alpha=(fondo==='alpha');
      var cuadrar=!!(fondo && !alpha);   // las fotos de perfume van encuadradas
      var base=alpha?null:(fondo||'#ffffff'), rgb=alpha?null:_catHexRgb(base);
      var cv=document.createElement('canvas'); cv.width=cw; cv.height=ch;
      var ctx=cv.getContext('2d',{willReadFrequently:true});
      if(!alpha){ ctx.fillStyle=base; ctx.fillRect(0,0,cw,ch); }
      ctx.drawImage(im,0,0,cw,ch);
      if(fondo) _catQuitarFondoBlanco(ctx,cw,ch,rgb,alpha);
      if(cuadrar){
        // Todas las fotos terminan en un lienzo CUADRADO, con el frasco centrado
        // y su proporción intacta. Sin esto, una foto apaisada se ve gorda al
        // lado de una vertical aunque ninguna esté deformada.
        var lado=maxW||300;
        var cv2=document.createElement('canvas'); cv2.width=lado; cv2.height=lado;
        var c2=cv2.getContext('2d');
        c2.fillStyle=base; c2.fillRect(0,0,lado,lado);
        var esc=Math.min((lado*0.94)/cw,(lado*0.94)/ch);
        var dw=Math.max(1,Math.round(cw*esc)), dh=Math.max(1,Math.round(ch*esc));
        c2.drawImage(cv,Math.round((lado-dw)/2),Math.round((lado-dh)/2),dw,dh);
        cv=cv2;
      }
      // El logo va en PNG para conservar la transparencia; el resto en JPEG (más liviano).
      _catImgCache[key]=alpha?cv.toDataURL('image/png'):cv.toDataURL('image/jpeg',0.86);
    }catch(e){ _catImgCache[key]=''; }
    cb();
  };
  im.onerror=function(){ if(done)return; done=true; clearTimeout(t); _catImgCache[key]=''; cb(); };
  im.src=url;
}
// Baja TODAS las imágenes del catálogo en paralelo (de a 6) antes de dibujar.
function _catImgPreloadAll(list, onProg, cb){
  var uniq=[], seen={};
  (list||[]).forEach(function(o){ if(!o||!o.url)return; var k=_catImgKey(o.url,o.fondo); if(!seen[k]){ seen[k]=1; uniq.push(o); } });
  var total=uniq.length; if(!total){ cb&&cb(); return; }
  var i=0, done=0, CONC=6, running=0, finished=false;
  function next(){
    if(finished)return;
    while(running<CONC && i<total){
      var it=uniq[i++]; running++;
      _catImgPrep(it.url, it.max, it.fondo, function(){
        running--; done++;
        if(onProg)onProg(done/total);
        if(done>=total){ if(!finished){ finished=true; cb&&cb(); } }
        else next();
      });
    }
  }
  next();
}

// ── CONFIG DEL CATÁLOGO (defaults / clamp) ────────────────────────
function _catCatDefaults(){
  // base + lo último que usó el cliente (solo para catálogos NUEVOS)
  var base=_catCatBase();
  var last=(_catCatList&&_catCatList.length&&_catCatList[0].config)?_catCatList[0].config:null;
  if(last){ _catCatKeys().forEach(function(k){ if(last[k]!=null)base[k]=last[k]; }); }
  return base;
}
// Valores por defecto puros: los usa todo lo que TIENE que respetar el config
// guardado del catálogo (generar PDF, editar el diseño) para no heredar sin
// querer el formato de otro catálogo del mismo cliente.
function _catCatBase(){
  var cfg=_catCatConfig||{};
  var firstP = (cfg.modo_x1_habilitado!==false)?'x1':((cfg.modo_sugerido_habilitado!==false)?'sugerido':'manual');
  var firstN = (cfg.notas_fotos_habilitado!==false)?'fotos':'escritas';
  var base={ nombre:'', plantilla:'tabla', densidad:'normal', tipografia:'elegante',
    portada_modo:'banner',
    // ── TAPA (hoja de portada) ──
    tapa_on:false, tapa_fondo_tipo:'frascos', tapa_imagen_url:'', tapa_galeria_id:'',
    tapa_c1:'#141414', tapa_c2:'#c9a227', tapa_color_texto:'#f6ead1', tapa_overlay:0,
    tapa_layout:'centrado', tapa_titulo:'', tapa_subtitulo:'', tapa_epigrafe:'',
    tapa_titulo_tam:'normal', tapa_mayusculas:true, tapa_marco:false,
    tapa_logo_url:'', tapa_logo_pos:'abajo', tapa_logo_tam:'normal',
    tapa_pie_modo:'ninguno', tapa_pie_texto:'', tapa_pie_bg:'#141414', tapa_pie_fg:'#ffffff',
    banner_modo:'default', banner_imagen_url:'', banner_preset_id:'',
    banner_texto1:(cfg.texto_default||'CATÁLOGO'), banner_texto2:'',
    banner_bg:(cfg.color_fondo_default||'#1a1a1a'), banner_fg:'#ffffff',
    hoja_modo:'none', hoja_imagen_url:'', hoja_texto:'', hoja_bg:(cfg.color_fondo_default||'#1a1a1a'), hoja_fg:'#ffffff',
    cat_bg:'#fdfbf7', precio_color:'#a9763f', precio_estilo:'plano',
    precio_modo:firstP, notas_modo:firstN,
    mostrar_marca:true, mostrar_meta:true, mostrar_notas:true, mostrar_acordes:true,
    mostrar_numeracion:false, mostrar_paginas:true, borde_hoja:false,
    incluir_contacto:false, contacto_texto:'', contacto_nombre:'', contacto_telefono:((_catCliente&&_catCliente.telefono_principal)||''), contacto_nota:'' };
  return base;
}
function _catCatKeys(){ return ['plantilla','densidad','tipografia','portada_modo',
  'tapa_on','tapa_fondo_tipo','tapa_imagen_url','tapa_galeria_id','tapa_c1','tapa_c2','tapa_color_texto','tapa_overlay',
  'tapa_layout','tapa_titulo','tapa_subtitulo','tapa_epigrafe','tapa_titulo_tam','tapa_mayusculas','tapa_marco',
  'tapa_logo_url','tapa_logo_pos','tapa_logo_tam','tapa_pie_modo','tapa_pie_texto','tapa_pie_bg','tapa_pie_fg','banner_modo','banner_imagen_url','banner_preset_id','banner_texto1','banner_texto2','banner_bg','banner_fg','hoja_modo','hoja_imagen_url','hoja_texto','hoja_bg','hoja_fg','cat_bg','precio_color','precio_estilo','precio_modo','notas_modo','mostrar_marca','mostrar_meta','mostrar_notas','mostrar_acordes','mostrar_numeracion','mostrar_paginas','borde_hoja','incluir_contacto','contacto_texto','contacto_nombre','contacto_telefono','contacto_nota']; }
function _catCatClamp(s){
  var cfg=_catCatConfig||{};
  var pE=[]; if(cfg.modo_x1_habilitado!==false)pE.push('x1'); if(cfg.modo_sugerido_habilitado!==false)pE.push('sugerido'); if(cfg.modo_manual_habilitado!==false)pE.push('manual'); pE.push('sinprecio');
  if(pE.indexOf(s.precio_modo)<0)s.precio_modo=pE[0]||'x1';
  var nE=[]; if(cfg.notas_fotos_habilitado!==false)nE.push('fotos'); if(cfg.notas_escritas_habilitado!==false)nE.push('escritas');
  if(nE.indexOf(s.notas_modo)<0)s.notas_modo=nE[0]||'fotos';
  var tE=_catTplHabilitadas().map(function(t){return t.id;});
  if(tE.indexOf(s.plantilla)<0)s.plantilla=tE[0]||'tabla';
  if(['comoda','normal','compacta'].indexOf(s.densidad)<0)s.densidad='normal';
  if(['clasica','moderna','elegante'].indexOf(s.tipografia)<0)s.tipografia='elegante';
  // Los catálogos viejos guardaban la portada como portada_modo='hoja'.
  // Ahora eso es la TAPA, con su propio diseño: los pasamos sin que cambie nada.
  if(s.portada_modo==='hoja'){
    s.tapa_on=true; s.portada_modo='banner';
    if(!s.tapa_titulo)s.tapa_titulo=s.banner_texto1||'';
    if(!s.tapa_subtitulo)s.tapa_subtitulo=s.banner_texto2||'';
    if(!s._tapaMigrada){
      s._tapaMigrada=true;
      if(s.banner_modo==='imagen' && s.banner_imagen_url){ s.tapa_fondo_tipo='imagen_propia'; s.tapa_imagen_url=s.banner_imagen_url; }
      else { s.tapa_fondo_tipo='liso'; s.tapa_c1=s.banner_bg||'#141414'; }
      s.tapa_color_texto=s.banner_fg||'#ffffff';
    }
  }
  if(['ninguna','banner'].indexOf(s.portada_modo)<0)s.portada_modo='banner';
  s.tapa_on=!!s.tapa_on;
  if(_catTapaFondos().map(function(f){return f.id;}).concat(['imagen_propia','galeria']).indexOf(s.tapa_fondo_tipo)<0)s.tapa_fondo_tipo='frascos';
  if(['centrado','superior','inferior','banda','marco'].indexOf(s.tapa_layout)<0)s.tapa_layout='centrado';
  if(['chico','normal','grande'].indexOf(s.tapa_titulo_tam)<0)s.tapa_titulo_tam='normal';
  if(['ninguno','arriba','abajo'].indexOf(s.tapa_logo_pos)<0)s.tapa_logo_pos='abajo';
  if(['chico','normal','grande'].indexOf(s.tapa_logo_tam)<0)s.tapa_logo_tam='normal';
  if(['ninguno','texto','barra'].indexOf(s.tapa_pie_modo)<0)s.tapa_pie_modo='ninguno';
  s.tapa_overlay=Math.max(0,Math.min(75,parseInt(s.tapa_overlay)||0));
  if(['plano','pastilla','borde'].indexOf(s.precio_estilo)<0)s.precio_estilo='plano';
  return s;
}

function _catCatNuevo(){
  var cfg=_catCatConfig||{}; var max=cfg.max_borradores_por_cliente||0;
  if(max>0 && _catCatList.length>=max){ _catToast('Llegaste al máximo de catálogos','twarn'); return; }
  _catCatModal(null);
}
function _catCatEditarFormato(id){ var c=_catCatList.filter(function(x){return x.id===id;})[0]; if(c)_catCatModal(c); }
// ── Precio sugerido = precio_min * (1+pct/100) redondeado al múltiplo configurado
function _catCatPrecioSugerido(precioMin,cfg){
  cfg=cfg||{}; var pct=(cfg.precio_sugerido_pct!=null)?cfg.precio_sugerido_pct:7; var red=cfg.precio_redondeo?cfg.precio_redondeo:1000;
  var v=(precioMin||0)*(1+pct/100); if(red>0)v=Math.round(v/red)*red; else v=Math.round(v); return v;
}

// ══════════════════════════════════════════════════════════════════
// PRODUCTOS Y PRECIOS (selección + ajuste por porcentaje)
// ══════════════════════════════════════════════════════════════════
var _catCatProd=null;
function _catCatElegirProductos(id){
  var cat=_catCatList.filter(function(x){return x.id===id;})[0]; if(!cat){ _catToast('Catálogo no encontrado','twarn'); return; }
  var cfg=_catCatConfig||{};
  var modo=(cat.config&&cat.config.precio_modo)||'x1';
  var perfumes=(allProds||[]).filter(function(p){return p.tipo==='perfume';});
  if(!perfumes.length){ _catToast('Todavía no hay perfumes cargados','twarn'); return; }
  apiGet('catalogos_cliente_productos','select=producto_id,precio,precio_manual&catalogo_id=eq.'+id+'&limit=5000').then(function(rows){
    rows=Array.isArray(rows)?rows:[];
    var sel={}, manual={}, over={}, sinp={};
    if(rows.length){
      rows.forEach(function(r){ sel[r.producto_id]=true; if(r.precio==null){ sinp[r.producto_id]=true; } else if(r.precio_manual){ if(modo==='manual') manual[r.producto_id]=String(r.precio); else over[r.producto_id]=String(r.precio); } });
    } else {
      // Predeterminado: TODOS los perfumes elegidos
      perfumes.forEach(function(p){ sel[p.id]=true; });
    }
    _catCatProd={ catId:id, modo:modo, cfg:cfg, perfumes:perfumes, sel:sel, manual:manual, over:over, sinp:sinp, nombre:cat.nombre||'Mi catálogo' };
    _catCatProdAbrir();
  }).catch(function(e){ console.error('[catcat prod load]',e); _catToast('No se pudieron cargar los productos','twarn'); });
}
function _catCatProdAbrir(){
  var st=_catCatProd; if(!st)return;
  var prev=document.getElementById('_catCatProdOv'); if(prev)prev.remove();
  var modoLbl = st.modo==='manual'?'Vos ponés los precios':(st.modo==='sugerido'?'Precio sugerido':(st.modo==='sinprecio'?'Sin precios':'Precio de lista Belle'));
  var ov=document.createElement('div'); ov.id='_catCatProdOv';
  ov.style.cssText='position:fixed;inset:0;z-index:99990;background:#fdfbf7;display:flex;flex-direction:column';
  var h="";
  h+="<div style='background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;padding:.9rem 1rem;display:flex;align-items:center;gap:.6rem;flex-shrink:0'>";
  h+="<button onclick='_catCatProdCerrar()' style='background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:8px;width:34px;height:34px;font-size:1.3rem;line-height:1;cursor:pointer;flex-shrink:0'>‹</button>";
  h+="<div style='flex:1;min-width:0'><div style='font-family:\"Cormorant Garamond\",serif;font-size:1.15rem;font-weight:700;line-height:1.1'>Elegí los perfumes</div>";
  h+="<div style='font-size:.68rem;opacity:.92;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>"+_catEsc(st.nombre)+" · "+modoLbl+"</div></div></div>";
  h+="<div style='padding:.7rem 1rem;background:#fff;border-bottom:1px solid #efe7d8;flex-shrink:0'>";
  h+="<input id='_catCatProdSearch' type='text' placeholder='Buscar perfume o marca…' oninput='_catCatProdSearch(this.value)' style='width:100%;border:1px solid #e0d4bd;border-radius:9px;padding:.55rem .7rem;font-size:.85rem;font-family:inherit;box-sizing:border-box;margin-bottom:.5rem'>";
  h+="<div style='display:flex;align-items:center;gap:.4rem;flex-wrap:wrap'>";
  h+="<button onclick='_catCatProdTodos(true)' style='background:#f3ead8;color:#8a6a3a;border:none;border-radius:7px;padding:.35rem .6rem;font-size:.7rem;font-weight:600;cursor:pointer;font-family:inherit'>Marcar todos</button>";
  h+="<button onclick='_catCatProdTodos(false)' style='background:#f3ead8;color:#8a6a3a;border:none;border-radius:7px;padding:.35rem .6rem;font-size:.7rem;font-weight:600;cursor:pointer;font-family:inherit'>Ninguno</button>";
  h+="<button onclick='_catCatProdVisibles(true)' style='background:#f3ead8;color:#8a6a3a;border:none;border-radius:7px;padding:.35rem .6rem;font-size:.7rem;font-weight:600;cursor:pointer;font-family:inherit'>Marcar los que veo</button>";
  if(st.modo!=='sinprecio'){
    h+="<button id='_ccpPctBtn' onclick='_catCatProdPctToggle()' style='background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:7px;padding:.35rem .7rem;font-size:.7rem;font-weight:700;cursor:pointer;font-family:inherit'>% Ajustar precios</button>";
  }
  h+="<button id='_ccpAccBtn' onclick='_catCatProdAccToggle()' style='background:#3a2f1c;color:#fff;border:none;border-radius:7px;padding:.35rem .7rem;font-size:.7rem;font-weight:700;cursor:pointer;font-family:inherit'>⚙ Acciones en bloque</button>";
  h+="<div style='flex:1'></div><div id='_catCatProdCount' style='font-size:.72rem;color:#6a5a40;font-weight:600'></div></div>";
  h+="<div id='_ccpPctBox' style='display:none;margin-top:.6rem'></div>";
  h+="<div id='_ccpAccBox' style='display:none;margin-top:.6rem'></div>";
  h+="</div>";
  if(st.modo==='manual'){
    h+="<div style='padding:.45rem 1rem;background:#faf6ee;border-bottom:1px solid #f0e7d6;font-size:.68rem;color:#8a7a5a;flex-shrink:0'>Escribí el precio de cada perfume. Los que dejes vacíos los resolvés al guardar.</div>";
  }
  h+="<div id='_catCatProdList' style='flex:1;overflow-y:auto;padding:.2rem 1rem 1rem'></div>";
  h+="<div style='padding:.8rem 1rem;background:#fff;border-top:1px solid #efe7d8;flex-shrink:0;display:flex;gap:.6rem'>";
  h+="<button onclick='_catCatProdCerrar()' style='background:#fff;color:#8a6a3a;border:1.5px solid #d8c4a0;border-radius:10px;padding:.7rem 1rem;font-size:.82rem;font-weight:600;cursor:pointer;font-family:inherit'>Cancelar</button>";
  h+="<button id='_catCatProdGuardarBtn' onclick='_catCatProdGuardar()' style='flex:1;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:10px;padding:.7rem;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit'>Guardar productos</button></div>";
  ov.innerHTML=h;
  document.body.appendChild(ov);
  _catCatProdRenderList();
  _catCatProdCount();
}

// ── Ajuste masivo de precios (%) ──────────────────────────────────
function _catCatProdPctToggle(){
  var box=document.getElementById('_ccpPctBox'); if(!box)return;
  if(box.style.display==='block'){ box.style.display='none'; box.innerHTML=''; return; }
  var acc=document.getElementById('_ccpAccBox'); if(acc){ acc.style.display='none'; acc.innerHTML=''; }
  box.style.display='block';
  var inp="border:1px solid #e0d4bd;border-radius:8px;padding:.45rem .55rem;font-size:.82rem;font-family:inherit;box-sizing:border-box;background:#fff;color:#5a4a30";
  var h="<div style='background:#faf6ee;border:1px solid #ecdcc0;border-radius:11px;padding:.7rem .8rem'>";
  h+="<div style='font-size:.76rem;font-weight:700;color:#8a6a3a;margin-bottom:.5rem'>Ajustar precios en bloque</div>";
  h+="<div style='display:flex;gap:.4rem;flex-wrap:wrap;align-items:center'>";
  h+="<select id='_ccpPctDir' style='"+inp+"'><option value='sube'>Aumentar</option><option value='baja'>Bajar</option></select>";
  h+="<input id='_ccpPctVal' type='number' inputmode='decimal' value='10' style='"+inp+";width:78px;text-align:right'>";
  h+="<select id='_ccpPctUni' style='"+inp+"'><option value='pct'>%</option><option value='monto'>$ fijo</option></select>";
  h+="<select id='_ccpPctAmb' style='"+inp+"'><option value='sel'>a los marcados</option><option value='vis'>a los que veo</option><option value='todos'>a todos</option></select>";
  h+="<select id='_ccpPctRed' style='"+inp+"'><option value='0'>sin redondear</option><option value='100'>redondear a 100</option><option value='500'>redondear a 500</option><option value='1000' selected>redondear a 1.000</option></select>";
  h+="<button onclick='_catCatProdPctAplicar()' style='background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:8px;padding:.5rem .9rem;font-size:.76rem;font-weight:700;cursor:pointer;font-family:inherit'>Aplicar</button>";
  h+="<button onclick='_catCatProdPctReset()' title='Volver a los precios automáticos' style='background:#fff;color:#8a6a3a;border:1px solid #d8c4a0;border-radius:8px;padding:.5rem .8rem;font-size:.76rem;font-weight:600;cursor:pointer;font-family:inherit'>Deshacer todo</button>";
  h+="</div>";
  h+="<div style='font-size:.66rem;color:#9a8870;margin-top:.45rem;line-height:1.35'>Se aplica sobre el precio que hoy muestra cada perfume. Podés repetirlo las veces que quieras.</div>";
  h+="</div>";
  box.innerHTML=h;
}
// Precio que hoy muestra un producto en la lista (manual > override > modo del catálogo)
function _catCatProdPrecioEfectivo(p){
  var st=_catCatProd; if(!st)return 0;
  if(st.sinp && st.sinp[p.id]) return null;
  if(st.modo==='manual'){
    var raw=(st.manual[p.id]!=null?String(st.manual[p.id]):'').replace(/\D/g,'');
    return raw?parseInt(raw):0;
  }
  if(st.over && st.over[p.id]!=null){
    var o=String(st.over[p.id]).replace(/\D/g,'');
    if(o)return parseInt(o);
  }
  if(st.modo==='sugerido') return _catCatPrecioSugerido(p.precio_min_ars,st.cfg);
  if(st.modo==='sinprecio') return null;
  return p.precio_min_ars||0;
}
function _catCatProdPctAplicar(){
  var st=_catCatProd; if(!st)return;
  var dir=(document.getElementById('_ccpPctDir')||{}).value||'sube';
  var val=parseFloat((document.getElementById('_ccpPctVal')||{}).value||'0')||0;
  var uni=(document.getElementById('_ccpPctUni')||{}).value||'pct';
  var amb=(document.getElementById('_ccpPctAmb')||{}).value||'sel';
  var red=parseInt((document.getElementById('_ccpPctRed')||{}).value||'0')||0;
  if(val<=0){ _catToast('Poné un valor mayor a 0','twarn'); return; }
  var visibles=null;
  if(amb==='vis'){
    visibles={};
    var rows=document.querySelectorAll('#_catCatProdList ._ccpRow');
    for(var i=0;i<rows.length;i++){ if(rows[i].style.display!=='none'){ var pid=parseInt(rows[i].getAttribute('data-pid')); if(pid)visibles[pid]=1; } }
  }
  var n=0;
  st.perfumes.forEach(function(p){
    if(amb==='sel' && !st.sel[p.id])return;
    if(amb==='vis' && !(visibles&&visibles[p.id]))return;
    if(st.sinp && st.sinp[p.id])return;
    var base=_catCatProdPrecioEfectivo(p);
    if(base==null || !(base>0))return;
    var nuevo = (uni==='monto') ? (dir==='baja'? base-val : base+val)
                                : (dir==='baja'? base*(1-val/100) : base*(1+val/100));
    nuevo=Math.round(nuevo);
    if(red>0)nuevo=Math.round(nuevo/red)*red;
    if(nuevo<0)nuevo=0;
    if(!nuevo)return;
    if(st.modo==='manual'){ st.manual[p.id]=String(nuevo); }
    else { if(!st.over)st.over={}; st.over[p.id]=String(nuevo); }
    n++;
  });
  _catCatProdRenderList();
  _catToast(n?('Precios ajustados en '+n+' perfume'+(n===1?'':'s')):'No había precios para ajustar', n?'tok':'twarn');
}
function _catCatProdPctReset(){
  var st=_catCatProd; if(!st)return;
  var hacer=function(){
    st.over={};
    if(st.modo==='manual')st.manual={};
    _catCatProdRenderList();
    _catToast('Volvimos a los precios automáticos','tok');
  };
  if(typeof _catModalConfirm==='function'){
    _catModalConfirm({titulo:'Deshacer ajustes', mensaje:'Se borran los precios que cambiaste a mano y vuelven los automáticos. ¿Seguimos?', confirmTxt:'Sí, deshacer', cancelTxt:'No', icono:'↺', onConfirm:hacer});
  } else hacer();
}

function _catCatProdRenderList(){
  var st=_catCatProd; var box=document.getElementById('_catCatProdList'); if(!st||!box)return;
  var h="";
  st.perfumes.forEach(function(p){
    var pid=p.id, on=!!st.sel[pid];
    var marca=String(p.empresa||'').trim();
    var ml=p.ml?(' · '+p.ml+' ml'):'';
    var s=((p.nombre||'')+' '+marca).toLowerCase();
    h+="<div class='_ccpRow' data-pid='"+pid+"' data-s=\""+_catEsc(s)+"\" style='display:flex;align-items:center;gap:.6rem;padding:.5rem .1rem;border-bottom:1px solid #f2ece0'>";
    h+="<input type='checkbox' id='_ccpChk"+pid+"' "+(on?'checked':'')+" onchange='_catCatProdToggle("+pid+",this.checked)' style='width:19px;height:19px;accent-color:#c4965a;flex-shrink:0'>";
    h+="<div style='flex:1;min-width:0' onclick='_catCatProdRowTap("+pid+")'><div style='font-weight:600;font-size:.8rem;color:#3a2f1c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>"+_catEsc(p.nombre||'')+"</div><div style='font-size:.65rem;color:#9a8a6a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>"+_catEsc(marca)+ml+"</div></div>";
    h+="<div id='_ccpPrice"+pid+"' style='display:flex;align-items:center;gap:.15rem;flex-shrink:0'>"+_catCatProdPriceCellInner(p)+"</div>";
    h+="</div>";
  });
  box.innerHTML=h;
  var q=(document.getElementById('_catCatProdSearch')||{}).value||'';
  if(q)_catCatProdSearch(q);
}
function _catCatProdPriceCellInner(p){
  var st=_catCatProd; var pid=p.id; var cfg=st.cfg;
  var sug=_catCatPrecioSugerido(p.precio_min_ars,cfg);
  if(st.modo==='sinprecio')return "<span style='color:#b8a888;font-size:.72rem'>sin precio</span>";
  if(st.sinp && st.sinp[pid]){
    return "<span style='color:#8a6a3a;font-size:.72rem;font-weight:700'>🚫 Sin precio</span><button onclick='_catCatProdSinPrecio("+pid+",false)' title='Volver a poner precio' style='background:none;border:none;cursor:pointer;font-size:.9rem;padding:0 .15rem;opacity:.8'>↺</button>";
  }
  if(st.modo==='manual'){
    var mv=st.manual[pid]!=null?_catEsc(String(st.manual[pid])):'';
    return "<span style='color:#b09a72;font-size:.8rem'>$</span><input type='number' inputmode='numeric' value='"+mv+"' placeholder='"+sug+"' oninput='_catCatProdManual("+pid+",this.value)' style='width:68px;border:1px solid #e0d4bd;border-radius:7px;padding:.35rem .4rem;font-size:.8rem;font-family:inherit;text-align:right;box-sizing:border-box'><button onclick='_catCatProdSinPrecio("+pid+",true)' title='Dejar sin precio' style='background:none;border:none;cursor:pointer;font-size:.9rem;padding:0 .15rem;opacity:.7'>🚫</button>";
  }
  if(st.over && st.over[pid]!=null){
    var ov=_catEsc(String(st.over[pid]));
    return "<span style='color:#b09a72;font-size:.8rem'>$</span><input type='number' inputmode='numeric' value='"+ov+"' oninput='_catCatProdOver("+pid+",this.value)' style='width:74px;border:1px solid #c4965a;border-radius:7px;padding:.35rem .4rem;font-size:.8rem;font-family:inherit;text-align:right;box-sizing:border-box'><button onclick='_catCatProdOverCancel("+pid+")' title='Volver al precio automático' style='background:none;border:none;color:#b8a888;cursor:pointer;font-size:.95rem;padding:0 .1rem;line-height:1'>↺</button>";
  }
  var pr=(st.modo==='sugerido')?sug:(p.precio_min_ars||0);
  return "<span style='font-weight:700;color:#c4965a;font-size:.82rem'>"+fmt(pr)+"</span><button onclick='_catCatProdEdit("+pid+")' title='Cambiar este precio' style='background:none;border:none;cursor:pointer;font-size:.78rem;padding:0 .1rem;opacity:.75'>✏️</button><button onclick='_catCatProdSinPrecio("+pid+",true)' title='Dejar sin precio' style='background:none;border:none;cursor:pointer;font-size:.82rem;padding:0 .1rem;opacity:.55'>🚫</button>";
}
function _catCatProdRefreshPrice(pid){ var st=_catCatProd; if(!st)return; var p=st.perfumes.filter(function(x){return x.id===pid;})[0]; var cell=document.getElementById('_ccpPrice'+pid); if(p&&cell)cell.innerHTML=_catCatProdPriceCellInner(p); }
function _catCatProdEdit(pid){ var st=_catCatProd; if(!st)return; if(!st.over)st.over={}; var p=st.perfumes.filter(function(x){return x.id===pid;})[0]; if(!p)return; var start=(st.modo==='sugerido')?_catCatPrecioSugerido(p.precio_min_ars,st.cfg):(p.precio_min_ars||0); st.over[pid]=String(start); _catCatProdRefreshPrice(pid); }
function _catCatProdOver(pid,val){ var st=_catCatProd; if(!st)return; if(!st.over)st.over={}; st.over[pid]=val; }
function _catCatProdSinPrecio(pid,val){ var st=_catCatProd; if(!st)return; if(!st.sinp)st.sinp={}; if(val){ st.sinp[pid]=true; } else { delete st.sinp[pid]; } _catCatProdRefreshPrice(pid); }
function _catCatProdOverCancel(pid){ var st=_catCatProd; if(!st||!st.over)return; delete st.over[pid]; _catCatProdRefreshPrice(pid); }
function _catCatProdRowTap(pid){ var st=_catCatProd; if(!st)return; var on=!st.sel[pid]; st.sel[pid]=on; var chk=document.getElementById('_ccpChk'+pid); if(chk)chk.checked=on; _catCatProdCount(); }
function _catCatProdToggle(pid,checked){ var st=_catCatProd; if(!st)return; st.sel[pid]=checked; _catCatProdCount(); }
function _catCatProdManual(pid,val){ var st=_catCatProd; if(!st)return; st.manual[pid]=val; }
function _catCatProdTodos(val){ var st=_catCatProd; if(!st)return; st.perfumes.forEach(function(p){ st.sel[p.id]=val; }); _catCatProdRenderList(); _catCatProdCount(); }
function _catCatProdVisibles(val){
  var st=_catCatProd; if(!st)return;
  var rows=document.querySelectorAll('#_catCatProdList ._ccpRow'), n=0;
  for(var i=0;i<rows.length;i++){
    if(rows[i].style.display==='none')continue;
    var pid=parseInt(rows[i].getAttribute('data-pid')); if(!pid)continue;
    st.sel[pid]=val; n++;
    var chk=document.getElementById('_ccpChk'+pid); if(chk)chk.checked=val;
  }
  _catCatProdCount();
  _catToast(n+' perfume'+(n===1?'':'s')+(val?' marcados':' desmarcados'),'tok');
}

// ── Acciones en bloque sobre la lista de perfumes del catálogo del cliente (2026-10-04) ──
// Permite elegir un alcance (marcados, los que veo, todos, una marca, un género) y aplicarle
// de una: marcar, desmarcar (ocultar), sin precio, con precio, precio automático, precio fijo,
// quedarse solo con los que tienen stock, o invertir la selección.
function _catCatProdAccToggle(){
  var box=document.getElementById('_ccpAccBox'); var st=_catCatProd; if(!box||!st)return;
  if(box.style.display==='block'){ box.style.display='none'; box.innerHTML=''; return; }
  var pct=document.getElementById('_ccpPctBox'); if(pct){ pct.style.display='none'; pct.innerHTML=''; }
  box.style.display='block';
  var inp="border:1px solid #e0d4bd;border-radius:8px;padding:.45rem .55rem;font-size:.8rem;font-family:inherit;box-sizing:border-box;background:#fff;color:#5a4a30";
  var bt="border:none;border-radius:8px;padding:.5rem .7rem;font-size:.72rem;font-weight:700;cursor:pointer;font-family:inherit";
  var marcas={}; st.perfumes.forEach(function(p){ var m=String(p.empresa||'').trim(); if(m) marcas[m]=1; });
  var generos={}; st.perfumes.forEach(function(p){ var g=String(p.genero||'').trim(); if(g) generos[g]=1; });
  var h="<div style='background:#faf6ee;border:1px solid #ecdcc0;border-radius:11px;padding:.7rem .8rem'>";
  h+="<div style='font-size:.76rem;font-weight:700;color:#8a6a3a;margin-bottom:.5rem'>Acciones en bloque</div>";
  h+="<div style='display:flex;gap:.4rem;flex-wrap:wrap;align-items:center;margin-bottom:.55rem'>";
  h+="<span style='font-size:.72rem;color:#6a5a40'>Aplicar a</span>";
  h+="<select id='_ccpAccAmb' onchange='_catCatProdAccAmbito()' style='"+inp+"'><option value='sel'>los marcados</option><option value='vis'>los que veo</option><option value='todos'>todos los perfumes</option><option value='marca'>una marca…</option>"+(Object.keys(generos).length>1?"<option value='genero'>un género…</option>":"")+"</select>";
  h+="<select id='_ccpAccMarca' style='"+inp+";display:none;max-width:180px'>"+Object.keys(marcas).sort().map(function(m){ return "<option value=\""+_catEsc(m)+"\">"+_catEsc(m)+"</option>"; }).join('')+"</select>";
  h+="<select id='_ccpAccGen' style='"+inp+";display:none'>"+Object.keys(generos).sort().map(function(g){ return "<option value=\""+_catEsc(g)+"\">"+_catEsc(g)+"</option>"; }).join('')+"</select>";
  h+="<span id='_ccpAccN' style='font-size:.7rem;color:#9a8870'></span>";
  h+="</div>";
  h+="<div style='display:flex;gap:.4rem;flex-wrap:wrap;align-items:center'>";
  h+="<button onclick='_catCatProdAccion(\"marcar\")' style='"+bt+";background:#e8f3e4;color:#2f6b3a'>✔ Marcar</button>";
  h+="<button onclick='_catCatProdAccion(\"desmarcar\")' style='"+bt+";background:#f6e4e4;color:#8a3a3a' title='Los desmarcados no entran al catálogo'>✖ Desmarcar (ocultar)</button>";
  h+="<button onclick='_catCatProdAccion(\"invertir\")' style='"+bt+";background:#f3ead8;color:#8a6a3a'>⇄ Invertir</button>";
  h+="<button onclick='_catCatProdAccion(\"constock\")' style='"+bt+";background:#f3ead8;color:#8a6a3a' title='Desmarca los que hoy no tienen stock'>📦 Solo con stock</button>";
  if(st.modo!=='sinprecio'){
    h+="<button onclick='_catCatProdAccion(\"sinprecio\")' style='"+bt+";background:#fff;color:#8a6a3a;border:1px solid #d8c4a0' title='Quedan en el catálogo, pero sin precio a la vista'>🚫 Sin precio</button>";
    h+="<button onclick='_catCatProdAccion(\"conprecio\")' style='"+bt+";background:#fff;color:#8a6a3a;border:1px solid #d8c4a0'>$ Con precio</button>";
    h+="<button onclick='_catCatProdAccion(\"auto\")' style='"+bt+";background:#fff;color:#8a6a3a;border:1px solid #d8c4a0' title='Vuelve al precio "+(st.modo==='sugerido'?'sugerido':(st.modo==='manual'?'vacío (lo resolvés al guardar)':'precio de lista de Belle'))+"'>↺ Precio automático</button>";
    h+="<span style='display:inline-flex;align-items:center;gap:.25rem'><span style='color:#b09a72;font-size:.8rem'>$</span><input id='_ccpAccFijo' type='number' inputmode='numeric' placeholder='precio fijo' style='"+inp+";width:96px'><button onclick='_catCatProdAccion(\"fijo\")' style='"+bt+";background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff'>Poner a todos</button></span>";
  }
  h+="</div>";
  h+="<div style='font-size:.66rem;color:#9a8870;margin-top:.45rem;line-height:1.35'>Marcado = entra al catálogo. Sin precio = entra pero no muestra el precio. Nada se guarda hasta que toques <b>Guardar productos</b>.</div>";
  h+="</div>";
  box.innerHTML=h;
  _catCatProdAccAmbito();
}
function _catCatProdAccAmbito(){
  var amb=(document.getElementById('_ccpAccAmb')||{}).value||'sel';
  var sm=document.getElementById('_ccpAccMarca'), sg=document.getElementById('_ccpAccGen');
  if(sm) sm.style.display=(amb==='marca')?'inline-block':'none';
  if(sg) sg.style.display=(amb==='genero')?'inline-block':'none';
  var n=_catCatProdAccObjetivo().length;
  var el=document.getElementById('_ccpAccN'); if(el) el.textContent='('+n+' perfume'+(n===1?'':'s')+')';
}
function _catCatProdAccObjetivo(){
  var st=_catCatProd; if(!st)return [];
  var amb=(document.getElementById('_ccpAccAmb')||{}).value||'sel';
  if(amb==='sel') return st.perfumes.filter(function(p){ return !!st.sel[p.id]; });
  if(amb==='todos') return st.perfumes.slice();
  if(amb==='marca'){ var m=(document.getElementById('_ccpAccMarca')||{}).value||''; return st.perfumes.filter(function(p){ return String(p.empresa||'').trim()===m; }); }
  if(amb==='genero'){ var g=(document.getElementById('_ccpAccGen')||{}).value||''; return st.perfumes.filter(function(p){ return String(p.genero||'').trim()===g; }); }
  var vis={}; var rows=document.querySelectorAll('#_catCatProdList ._ccpRow');
  for(var i=0;i<rows.length;i++){ if(rows[i].style.display!=='none'){ var pid=parseInt(rows[i].getAttribute('data-pid')); if(pid)vis[pid]=1; } }
  return st.perfumes.filter(function(p){ return !!vis[p.id]; });
}
function _catCatProdAccion(acc){
  var st=_catCatProd; if(!st)return;
  var lista=_catCatProdAccObjetivo();
  if(!lista.length){ _catToast('No hay perfumes en ese alcance','twarn'); return; }
  if(!st.sinp) st.sinp={}; if(!st.over) st.over={}; if(!st.manual) st.manual={};
  var n=0, msg='';
  if(acc==='fijo'){
    var raw=String((document.getElementById('_ccpAccFijo')||{}).value||'').replace(/\D/g,''); var val=raw?parseInt(raw):0;
    if(!(val>0)){ _catToast('Escribí el precio fijo primero','twarn'); return; }
  }
  lista.forEach(function(p){
    var pid=p.id;
    if(acc==='marcar'){ if(!st.sel[pid]){ st.sel[pid]=true; n++; } }
    else if(acc==='desmarcar'){ if(st.sel[pid]){ st.sel[pid]=false; n++; } }
    else if(acc==='invertir'){ st.sel[pid]=!st.sel[pid]; n++; }
    else if(acc==='constock'){ if(st.sel[pid] && !((p.stock_actual||0)>0)){ st.sel[pid]=false; n++; } }
    else if(acc==='sinprecio'){ if(!st.sinp[pid]){ st.sinp[pid]=true; n++; } }
    else if(acc==='conprecio'){ if(st.sinp[pid]){ delete st.sinp[pid]; n++; } }
    else if(acc==='auto'){ delete st.sinp[pid]; delete st.over[pid]; if(st.modo==='manual') st.manual[pid]=''; n++; }
    else if(acc==='fijo'){ delete st.sinp[pid]; if(st.modo==='manual') st.manual[pid]=String(val); else st.over[pid]=String(val); n++; }
  });
  var txt={marcar:'marcados',desmarcar:'desmarcados',invertir:'invertidos',constock:'sin stock desmarcados',sinprecio:'sin precio',conprecio:'con precio otra vez',auto:'con precio automático',fijo:'con precio fijo'}[acc]||'';
  _catCatProdRenderList(); _catCatProdCount(); _catCatProdAccAmbito();
  _catToast(n?(n+' perfume'+(n===1?'':'s')+' '+txt):'No había nada para cambiar', n?'tok':'twarn');
}
function _catCatProdSearch(q){ q=(q||'').trim().toLowerCase(); var rows=document.querySelectorAll('#_catCatProdList ._ccpRow'); for(var i=0;i<rows.length;i++){ var s=rows[i].getAttribute('data-s')||''; rows[i].style.display=(!q||s.indexOf(q)>=0)?'flex':'none'; } }
function _catCatProdCount(){ var st=_catCatProd; if(!st)return; var n=0; st.perfumes.forEach(function(p){ if(st.sel[p.id])n++; }); var el=document.getElementById('_catCatProdCount'); if(el)el.textContent=n+' elegidos'; }
function _catCatProdCerrar(){ var ov=document.getElementById('_catCatProdOv'); if(ov)ov.remove(); _catCatProd=null; }
function _catCatProdGuardar(){
  var st=_catCatProd; if(!st)return;
  var seleccionados=st.perfumes.filter(function(p){ return !!st.sel[p.id]; });
  if(!seleccionados.length){ _catToast('Elegí al menos un perfume','twarn'); return; }
  if(st.modo==='manual'){
    var faltan=seleccionados.filter(function(p){ if(st.sinp&&st.sinp[p.id])return false; var raw=(st.manual[p.id]!=null?String(st.manual[p.id]):'').replace(/\D/g,''); return !(raw&&parseInt(raw)>0); });
    if(faltan.length){ _catCatProdResolverFaltantes(faltan.length, function(choice){ _catCatProdPersistir(seleccionados, choice); }); return; }
  }
  _catCatProdPersistir(seleccionados, null);
}
function _catCatProdPersistir(seleccionados, faltanChoice){
  var st=_catCatProd; if(!st)return; var modo=st.modo, cfg=st.cfg;
  var rows=[], orden=0;
  seleccionados.forEach(function(p){
    var precio=null, manual=false, incluir=true;
    var base=(p.precio_min_ars!=null)?p.precio_min_ars:null;
    if(st.sinp && st.sinp[p.id]){ rows.push({catalogo_id:st.catId, producto_id:p.id, precio:null, precio_manual:false, precio_base:base, orden:orden++}); return; }
    var ovRaw=(st.over && st.over[p.id]!=null)?String(st.over[p.id]).replace(/\D/g,''):'';
    var ovVal=ovRaw?parseInt(ovRaw):0;
    if(modo!=='manual' && ovVal>0){ precio=ovVal; manual=true; }
    else if(modo==='manual'){
      var raw=(st.manual[p.id]!=null?String(st.manual[p.id]):'').replace(/\D/g,'');
      var val=raw?parseInt(raw):0;
      if(val>0){ precio=val; manual=true; }
      else if(faltanChoice==='sugerido'){ precio=_catCatPrecioSugerido(p.precio_min_ars,cfg); manual=false; }
      else if(faltanChoice==='sinprecio'){ precio=null; manual=false; }
      else { incluir=false; }
    } else if(modo==='sugerido'){ precio=_catCatPrecioSugerido(p.precio_min_ars,cfg); manual=false; }
    else if(modo==='sinprecio'){ precio=null; manual=false; }
    else { precio=p.precio_min_ars||0; manual=false; }
    if(incluir){ rows.push({catalogo_id:st.catId, producto_id:p.id, precio:precio, precio_manual:manual, precio_base:base, orden:orden++}); }
  });
  var btn=document.getElementById('_catCatProdGuardarBtn'); if(btn){btn.disabled=true;btn.textContent='Guardando...';}
  apiDelete('catalogos_cliente_productos','catalogo_id=eq.'+st.catId).then(function(){
    if(!rows.length) return null;
    return apiPost('catalogos_cliente_productos', rows);
  }).then(function(){
    _catToast('Productos guardados ('+rows.length+')','tok');
    var c=_catCatList.filter(function(x){return x.id===st.catId;})[0]; if(c)c._nprod=rows.length;
    _catCatCambios[st.catId]=0;
    _catCatProdCerrar();
    if(_catPanelTab==='catalogos'){ var b=document.getElementById('_catTabBody'); if(b)_catRenderTabCatalogos(b); }
  }).catch(function(e){ console.error('[catcat prod save]',e); _catToast('No se pudo guardar','twarn'); if(btn){btn.disabled=false;btn.textContent='Guardar productos';} });
}
function _catCatProdResolverFaltantes(n, onChoice){
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(20,15,8,.55);display:flex;align-items:center;justify-content:center;padding:1.2rem';
  var h="<div style='background:#fffdf9;border-radius:16px;max-width:380px;width:100%;padding:1.3rem;box-shadow:0 18px 50px rgba(0,0,0,.3)'>";
  h+="<div style='font-family:\"Cormorant Garamond\",serif;font-size:1.3rem;font-weight:700;color:#3a2f1c;margin-bottom:.5rem'>Faltan precios</div>";
  h+="<div style='font-size:.85rem;color:#6a5a40;line-height:1.45;margin-bottom:1.1rem'>Hay <b>"+n+"</b> perfume"+(n===1?'':'s')+" sin precio. ¿Qué hacemos con esos?</div>";
  h+="<button id='_ccpFaltSug' style='width:100%;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:10px;padding:.7rem;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:.5rem'>Mostrarlos con precio sugerido</button>";
  h+="<button id='_ccpFaltSin' style='width:100%;background:#fff;color:#3a2f1c;border:1.5px solid #c4965a;border-radius:10px;padding:.7rem;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:.5rem'>Mostrarlos sin precio</button>";
  h+="<button id='_ccpFaltOcu' style='width:100%;background:#fff;color:#8a6a3a;border:1.5px solid #d8c4a0;border-radius:10px;padding:.7rem;font-size:.82rem;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:.5rem'>No mostrarlos en el catálogo</button>";
  h+="<button id='_ccpFaltCan' style='width:100%;background:transparent;color:#9a8a6a;border:none;padding:.4rem;font-size:.78rem;cursor:pointer;font-family:inherit'>Volver a editar</button></div>";
  ov.innerHTML=h;
  document.body.appendChild(ov);
  ov.addEventListener('click',function(e){ if(e.target===ov) ov.remove(); });
  document.getElementById('_ccpFaltSug').onclick=function(){ ov.remove(); onChoice('sugerido'); };
  document.getElementById('_ccpFaltSin').onclick=function(){ ov.remove(); onChoice('sinprecio'); };
  document.getElementById('_ccpFaltOcu').onclick=function(){ ov.remove(); onChoice('ocultar'); };
  document.getElementById('_ccpFaltCan').onclick=function(){ ov.remove(); };
}


// ══════════════════════════════════════════════════════════════════
// GENERACIÓN DEL CATÁLOGO (jsPDF + html2canvas) — hoja por hoja
// ══════════════════════════════════════════════════════════════════
function _catCatPdfOverlay(show,msg,pct){
  var ov=document.getElementById('_catCatPdfOv');
  if(!show){ if(ov)ov.remove(); return; }
  if(!ov){
    ov=document.createElement('div'); ov.id='_catCatPdfOv';
    ov.style.cssText='position:fixed;inset:0;z-index:100001;background:rgba(253,251,247,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:2rem;text-align:center';
    ov.innerHTML="<div style='width:46px;height:46px;border:4px solid #ecdcc2;border-top-color:#c4965a;border-radius:50%;animation:_catSpin 1s linear infinite'></div><div id='_catCatPdfMsg' style='font-family:\"Cormorant Garamond\",serif;font-size:1.2rem;color:#5a4a30;font-weight:600'></div><div id='_catCatPdfBarWrap' style='width:230px;max-width:80vw;height:9px;background:#ece0cc;border-radius:6px;overflow:hidden;display:none'><div id='_catCatPdfBar' style='height:100%;width:0%;background:linear-gradient(90deg,#c4965a,#a9763f);border-radius:6px;transition:width .25s ease'></div></div><div style='font-size:.72rem;color:#9a8a6a'>No cierres esta ventana</div>";
    document.body.appendChild(ov);
    if(!document.getElementById('_catSpinStyle')){ var st=document.createElement('style'); st.id='_catSpinStyle'; st.textContent='@keyframes _catSpin{to{transform:rotate(360deg)}}'; document.head.appendChild(st); }
  }
  var m=document.getElementById('_catCatPdfMsg'); if(m)m.textContent=msg||'Generando…';
  var wrap=document.getElementById('_catCatPdfBarWrap'), bar=document.getElementById('_catCatPdfBar');
  if(wrap&&bar){ if(pct==null){ wrap.style.display='none'; } else { wrap.style.display='block'; bar.style.width=Math.max(0,Math.min(100,Math.round(pct*100)))+'%'; } }
}
function _catLumText(hex){
  hex=String(hex||'').replace('#',''); if(hex.length===3)hex=hex.replace(/(.)/g,'$1$1');
  var r=parseInt(hex.substr(0,2),16)||0, g=parseInt(hex.substr(2,2),16)||0, b=parseInt(hex.substr(4,2),16)||0;
  return (0.299*r+0.587*g+0.114*b)>150?'#2a2118':'#ffffff';
}
function _catHexRgb(hex){ hex=String(hex||'').replace('#',''); if(hex.length===3)hex=hex.replace(/(.)/g,'$1$1'); return [parseInt(hex.substr(0,2),16)||0,parseInt(hex.substr(2,2),16)||0,parseInt(hex.substr(4,2),16)||0]; }
function _catCatNotaFoto(nombre){
  if(!window._catNotaFotoMap){
    var m={}; (window._catNotasMaestras||[]).forEach(function(n){
      if(n && n.foto_url){ if(n.clave)m[_normNota(n.clave)]=n.foto_url; if(n.nombre_display)m[_normNota(n.nombre_display)]=n.foto_url; }
    });
    window._catNotaFotoMap=m;
  }
  var key=(typeof _normNota==='function')?_normNota(nombre):String(nombre||'').toLowerCase();
  if(window._catNotaFotoMap[key]) return window._catNotaFotoMap[key];
  try{ var u=getNotaFoto(nombre); if(u) return u; }catch(e){}
  return '';
}
function _catCatPdfEnsureNotas(cb){
  if(window._catNotasMaestras){ cb(); return; }
  apiGet('notas_maestras','select=clave,nombre_display,foto_url&limit=5000').then(function(rows){
    window._catNotasMaestras=Array.isArray(rows)?rows:[]; window._catNotaFotoMap=null; cb();
  }).catch(function(){ window._catNotasMaestras=window._catNotasMaestras||[]; cb(); });
}
function _catCatPdfNotasList(ficha){
  var arr=[]; ['notas_salida','notas_corazon','notas_fondo'].forEach(function(k){
    String((ficha&&ficha[k])||'').split(',').forEach(function(s){ s=s.trim(); if(s)arr.push(s); });
  });
  var seen={}, out=[]; arr.forEach(function(n){ var key=n.toLowerCase(); if(!seen[key]){seen[key]=1; out.push(n);} });
  return out;
}
function _catCatPdfConc(p,ficha){
  if(ficha && ficha.concentracion && String(ficha.concentracion).trim()) return String(ficha.concentracion).trim();
  var m=String(p.nombre||'').match(/(Extrait de Parfum|Eau de Parfum|Parfum Intense|Extrait|Elixir|EDP|EDT|EDC|Parfum|Cologne)/i);
  return m?m[1]:'';
}
function _catCatPastels(){ return [
 {bg:'#faf6ee',ac:'#9a7338'},{bg:'#eef6ec',ac:'#4e7d52'},{bg:'#e8f4ef',ac:'#3f8a72'},
 {bg:'#eaf2fa',ac:'#3f6fa0'},{bg:'#eef3f8',ac:'#4a6f93'},{bg:'#f1edf8',ac:'#6b59a0'},
 {bg:'#f9eef5',ac:'#a45285'},{bg:'#faeeee',ac:'#b05656'},{bg:'#fdf0e8',ac:'#c07a47'},
 {bg:'#fbf6e6',ac:'#9a8330'},{bg:'#f3f1ee',ac:'#6e6258'},{bg:'#eef1f2',ac:'#566a72'},
 {bg:'#ffffff',ac:'#1a1a1a'},{bg:'#141414',ac:'#e6c98a'},{bg:'#1d2430',ac:'#9fc2e8'}
]; }

// ── piezas reutilizables ──────────────────────────────────────────
function _catAcordesDe(p,max){
  var ac=[]; try{ ac=Array.isArray(p.acordes)?p.acordes:(p.acordes?JSON.parse(p.acordes):[]); }catch(e){ ac=[]; }
  if(!Array.isArray(ac))ac=[];
  return ac.slice().sort(function(a,b){return (b.pct||0)-(a.pct||0);}).slice(0,max||4);
}
// sinFondo=true -> a la foto del perfume se le saca el fondo blanco y queda
// sobre la superficie que tiene atrás (la hoja o la tarjeta), sin recuadro.
function _catFotoHTML(url,w,h,fit,radius,bg,sinFondo){
  var fondo=sinFondo?(bg||'#ffffff'):null;
  var src=_catImgOk(url,fondo)?_catImgSrc(url,fondo):'';
  var inner=src?("<img src='"+src+"' crossorigin='anonymous' style='width:100%;height:100%;object-fit:"+(fit||'cover')+";display:block'>"):"";
  return "<div style='width:"+w+";height:"+h+";background:"+(bg||'#fff')+";border-radius:"+(radius||0)+"px;overflow:hidden;flex-shrink:0'>"+inner+"</div>";
}
// Superficie que queda DETRÁS de la foto en cada plantilla: es el color con el
// que se rellena lo que era fondo blanco.
function _catSuperficieFoto(cfg){
  var tpl=cfg.plantilla||'tabla';
  if(tpl==='revista'||tpl==='galeria') return '#ffffff';   // las tarjetas son blancas
  return cfg.cat_bg||'#fdfbf7';                            // lista clásica y editorial: la hoja
}
function _catPrecioHTML(item,cfg,size,alinear){
  if(item.precio==null) return "";
  var ac=cfg.precio_color||'#a9763f', est=cfg.precio_estilo||'plano', F=_catTplFont(cfg);
  var txt=fmt(item.precio);
  var st="font-family:"+F.body+";font-size:"+size+"px;font-weight:800;white-space:nowrap;";
  if(est==='pastilla') return "<span style='"+st+"display:inline-block;background:"+ac+";color:"+_catLumText(ac)+";padding:3px 10px;border-radius:999px'>"+txt+"</span>";
  if(est==='borde')    return "<span style='"+st+"display:inline-block;border:1.5px solid "+ac+";color:"+ac+";padding:2px 9px;border-radius:7px'>"+txt+"</span>";
  return "<span style='"+st+"color:"+ac+"'>"+txt+"</span>";
}
function _catAcordesPills(p,cfg,max,fs){
  if(cfg.mostrar_acordes===false) return "";
  var ac=_catAcordesDe(p,max||4); if(!ac.length)return "";
  var F=_catTplFont(cfg), h="<div style='display:flex;flex-wrap:wrap;gap:3px'>";
  ac.forEach(function(a){
    var col=a.color||'#c4965a';
    h+="<span style='background:"+col+";color:"+_catLumText(col)+";font-family:"+F.body+";font-size:"+(fs||8)+"px;font-weight:700;padding:2px 7px;border-radius:999px;text-transform:capitalize;white-space:nowrap'>"+_catEsc(a.nombre||'')+"</span>";
  });
  return h+"</div>";
}
function _catNotasTexto(item,cfg,max){
  if(cfg.mostrar_notas===false) return "";
  var n=_catCatPdfNotasList(item.ficha); if(!n.length)return "";
  return _catEsc(n.slice(0,max||8).join(' · '));
}
function _catNotasStrip(item,cfg,n,size){
  if(cfg.mostrar_notas===false) return "";
  var F=_catTplFont(cfg);
  if((cfg.notas_modo||'fotos')==='escritas'){
    var t=_catNotasTexto(item,cfg,n);
    return t?("<div style='font-family:"+F.body+";font-size:8.5px;color:#7a6a50;line-height:1.35'>"+t+"</div>"):"";
  }
  var notas=_catCatPdfNotasList(item.ficha).slice(0,n); if(!notas.length)return "";
  var h="<div style='display:flex;gap:4px'>";
  notas.forEach(function(nm){
    var foto=_catCatNotaFoto(nm);
    if(_catImgOk(foto)){
      h+="<div style='width:"+size+"px;flex-shrink:0'><div style='width:"+size+"px;height:"+size+"px;border-radius:50%;overflow:hidden;background:#efe4cf'><img src='"+_catImgSrc(foto)+"' crossorigin='anonymous' style='width:100%;height:100%;object-fit:cover;display:block'></div><div style='font-family:"+F.body+";font-size:6px;color:#8a7a5a;text-align:center;line-height:1.05;margin-top:2px;height:12px;overflow:hidden'>"+_catEsc(nm)+"</div></div>";
    } else {
      h+="<div style='width:"+size+"px;flex-shrink:0'><div style='width:"+size+"px;height:"+size+"px;border-radius:50%;background:#e7d8bb;display:flex;align-items:center;justify-content:center;text-align:center;padding:2px;box-sizing:border-box'><span style='font-family:"+F.body+";font-size:6px;color:#6a5a40;line-height:1.05;font-weight:600'>"+_catEsc(nm)+"</span></div><div style='height:14px'></div></div>";
    }
  });
  return h+"</div>";
}
// grilla de notas de la plantilla "Lista clásica"
function _catCatPdfNotasHTML(item,cfg){
  if(cfg.mostrar_notas===false) return "";
  var F=_catTplFont(cfg);
  var notas=_catCatPdfNotasList(item.ficha);
  if(!notas.length) return "<span style='font-size:9px;color:#c4b89c'>—</span>";
  if((cfg.notas_modo||'fotos')==='escritas'){
    var f=item.ficha||{}, parts=[];
    if(f.notas_salida)parts.push("<b style='color:#9a7d4e'>Salida:</b> "+_catEsc(f.notas_salida));
    if(f.notas_corazon)parts.push("<b style='color:#9a7d4e'>Corazón:</b> "+_catEsc(f.notas_corazon));
    if(f.notas_fondo)parts.push("<b style='color:#9a7d4e'>Fondo:</b> "+_catEsc(f.notas_fondo));
    return "<div style='font-family:"+F.body+";font-size:9px;color:#6a5a40;line-height:1.3'>"+parts.join('<br>')+"</div>";
  }
  notas=notas.slice(0,8);
  var n=notas.length;
  var cols=Math.min(4,Math.max(2,n));
  var alto=(_catMedidas(cfg).nota)||44;   // lo marca la densidad: la fila nunca crece de más
  var fs=(alto>=52)?'8px':((alto>=40)?'7px':'6px');
  var h="<div style='display:grid;grid-template-columns:repeat("+cols+",1fr);gap:1px;width:100%'>";
  notas.forEach(function(nm){
    var foto=_catCatNotaFoto(nm);
    if(_catImgOk(foto)){
      h+="<div style='position:relative;height:"+alto+"px;overflow:hidden;background:#efe4cf'><img src='"+_catImgSrc(foto)+"' crossorigin='anonymous' style='width:100%;height:100%;object-fit:cover;display:block'><div style='position:absolute;left:0;right:0;bottom:0;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.72));color:#fff;font-size:"+fs+";line-height:1.02;padding:3px 1px 1px;text-align:center;font-weight:600'>"+_catEsc(nm)+"</div></div>";
    } else {
      h+="<div style='height:"+alto+"px;background:#e7d8bb;display:flex;align-items:center;justify-content:center;text-align:center;padding:2px;box-sizing:border-box'><span style='font-size:"+fs+";color:#6a5a40;line-height:1.05;font-weight:600'>"+_catEsc(nm)+"</span></div>";
    }
  });
  h+="</div>";
  return h;
}
function _catCatPdfAcordesHTML(p,cfg){
  if(cfg && cfg.mostrar_acordes===false) return "";
  var m=_catMedidas(cfg||{});
  var ac=_catAcordesDe(p,m.ac||4);
  if(!ac.length) return "<span style='font-size:9px;color:#c4b89c'>—</span>";
  var chico=(m.ac||4)<4;
  var h="";
  ac.forEach(function(a){
    var col=a.color||'#c4965a', tc=_catLumText(col);
    h+="<div style='background:"+col+";border-radius:5px;padding:"+(chico?'2px 7px':'3px 8px')+";margin-bottom:2px;display:flex;align-items:center'><span style='font-size:"+(chico?'7.5px':'8.5px')+";font-weight:700;color:"+tc+";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize'>"+_catEsc(a.nombre||'')+"</span></div>";
  });
  return h;
}

// ── banner / encabezado / portada ─────────────────────────────────
function _catCatPdfBannerHTML(cat,cfg,slim){
  var F=_catTplFont(cfg);
  var t1=_catEsc(cfg.banner_texto1||cat.nombre||'CATÁLOGO');
  var t2=_catEsc(cfg.banner_texto2||'');
  if(cfg.banner_modo==='imagen' && cfg.banner_imagen_url && _catImgOk(cfg.banner_imagen_url)){
    return "<div style='height:"+(slim?70:200)+"px;overflow:hidden;flex-shrink:0'><img src='"+_catImgSrc(cfg.banner_imagen_url)+"' crossorigin='anonymous' style='width:100%;height:100%;object-fit:cover;display:block'></div>";
  }
  var bg=cfg.banner_bg||'#1a1a1a', fg=cfg.banner_fg||'#ffffff';
  if(cfg.banner_modo==='preset'){
    var pr=(Array.isArray((_catCatConfig||{}).banner_presets)?_catCatConfig.banner_presets:[]).filter(function(x){return x.id===cfg.banner_preset_id;})[0];
    if(pr){ bg=pr.bg||bg; fg=pr.fg||fg; }
  }
  var h="<div style='height:"+(slim?60:200)+"px;background:"+bg+";color:"+fg+";display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 24px;flex-shrink:0'>";
  h+="<div style='font-family:"+F.head+";font-size:"+(slim?'26px':'44px')+";font-weight:700;letter-spacing:.02em;line-height:1.1'>"+t1+"</div>";
  if(t2)h+="<div style='font-family:"+F.body+";font-size:"+(slim?'10px':'13px')+";opacity:.85;margin-top:6px;letter-spacing:.16em;text-transform:uppercase'>"+t2+"</div>";
  h+="</div>";
  return h;
}
function _catCatPdfHojaBannerHTML(cfg){
  var modo=cfg.hoja_modo||'none';
  if(modo==='none') return "";
  var F=_catTplFont(cfg);
  if(modo==='imagen' && cfg.hoja_imagen_url && _catImgOk(cfg.hoja_imagen_url)){
    return "<div style='height:64px;overflow:hidden;flex-shrink:0'><img src='"+_catImgSrc(cfg.hoja_imagen_url)+"' crossorigin='anonymous' style='width:100%;height:100%;object-fit:cover;display:block'></div>";
  }
  var txt=_catEsc(cfg.hoja_texto||''); if(!txt) return "";
  var bg=cfg.hoja_bg||'#1a1a1a', fg=cfg.hoja_fg||'#ffffff';
  return "<div style='height:46px;background:"+bg+";color:"+fg+";display:flex;align-items:center;justify-content:center;text-align:center;padding:0 20px;flex-shrink:0'><div style='font-family:"+F.head+";font-size:22px;font-weight:700;letter-spacing:.05em'>"+txt+"</div></div>";
}
// ══════════════════════════════════════════════════════════════════
// TAPA DEL CATÁLOGO (hoja de portada) — armador completo
// Todos los fondos se dibujan con HTML/CSS puro (nada de imágenes de
// terceros ni librerías): así no hay licencias de por medio, no depende
// de internet y html2canvas los pasa al PDF sin problemas.
// ══════════════════════════════════════════════════════════════════
function _catTapaFondos(){ return [
  {id:'frascos', g:'Perfumería', n:'Frascos'},
  {id:'botanico',g:'Perfumería', n:'Botánico'},
  {id:'artdeco', g:'Perfumería', n:'Art déco'},
  {id:'estela',  g:'Perfumería', n:'Estela'},
  {id:'gotas',   g:'Perfumería', n:'Gotas'},
  {id:'degrade', g:'Abstracto',  n:'Degradé'},
  {id:'olas',    g:'Abstracto',  n:'Olas'},
  {id:'marmol',  g:'Abstracto',  n:'Mármol'},
  {id:'geo',     g:'Abstracto',  n:'Geométrico'},
  {id:'lineas',  g:'Abstracto',  n:'Líneas'},
  {id:'liso',    g:'Abstracto',  n:'Liso'}
];}
function _catTapaPaletas(){ return [
  {n:'Noche y oro',   c1:'#141414', c2:'#c9a227', tx:'#f6ead1'},
  {n:'Arena',         c1:'#f3e9d8', c2:'#a9763f', tx:'#4a3a22'},
  {n:'Vino',          c1:'#3d1220', c2:'#c98aa0', tx:'#f7e6ec'},
  {n:'Bosque',        c1:'#12241d', c2:'#8fc0a3', tx:'#eef6f0'},
  {n:'Océano',        c1:'#0f2436', c2:'#7fb3d5', tx:'#eaf3fb'},
  {n:'Rosa viejo',    c1:'#f6e7ec', c2:'#a45285', tx:'#4a2136'},
  {n:'Lavanda',       c1:'#241d38', c2:'#b3a1e0', tx:'#f0ecfa'},
  {n:'Blanco y negro',c1:'#ffffff', c2:'#1a1a1a', tx:'#1a1a1a'},
  {n:'Terracota',     c1:'#7a3b23', c2:'#e8b98d', tx:'#fdeee2'},
  {n:'Champán',       c1:'#efe3cf', c2:'#8a6a3a', tx:'#3f3120'}
];}
function _catTapaEsFondoImagen(cfg){
  var t=cfg.tapa_fondo_tipo||'frascos';
  return t==='imagen_propia' || t==='galeria';
}
function _catTapaImagenUrl(cfg){
  if((cfg.tapa_fondo_tipo||'')==='imagen_propia') return cfg.tapa_imagen_url||'';
  if((cfg.tapa_fondo_tipo||'')==='galeria'){
    var g=(Array.isArray((_catCatConfig||{}).tapa_fondos)?_catCatConfig.tapa_fondos:[]).filter(function(x){return x.id===cfg.tapa_galeria_id;})[0];
    return (g&&g.url)||'';
  }
  return '';
}
// Dibujo del fondo (sin textos). W/H son los de la hoja A4 a 794×1123.
function _catTapaFondoHTML(cfg){
  var tipo=cfg.tapa_fondo_tipo||'frascos';
  var c1=cfg.tapa_c1||'#141414', c2=cfg.tapa_c2||'#c9a227';
  var h="";
  if(_catTapaEsFondoImagen(cfg)){
    var u=_catTapaImagenUrl(cfg);
    h+="<div style='position:absolute;left:0;top:0;width:794px;height:1123px;background:"+c1+"'></div>";
    if(u && _catImgOk(u)) h+="<img src='"+_catImgSrc(u)+"' crossorigin='anonymous' style='position:absolute;left:0;top:0;width:794px;height:1123px;object-fit:cover;display:block'>";
    return h;
  }
  h+="<div style='position:absolute;left:0;top:0;width:794px;height:1123px;background:"+c1+"'></div>";
  function caja(st){ h+="<div style='position:absolute;"+st+"'></div>"; }
  var i;
  if(tipo==='liso'){
    /* nada más: color pleno */
  } else if(tipo==='degrade'){
    caja("left:0;top:0;width:794px;height:1123px;background:linear-gradient(155deg,"+c1+" 0%,"+c2+" 100%)");
  } else if(tipo==='frascos'){
    var anchos=[104,132,92,150,116], altos=[300,420,250,470,330], x=26;
    for(i=0;i<anchos.length;i++){
      caja("left:"+x+"px;bottom:-46px;width:"+anchos[i]+"px;height:"+altos[i]+"px;background:"+c2+";opacity:.16;border-radius:22px 22px 12px 12px");
      caja("left:"+(x+Math.round(anchos[i]/2)-21)+"px;bottom:"+(altos[i]-46)+"px;width:42px;height:50px;background:"+c2+";opacity:.16;border-radius:7px");
      x+=anchos[i]+30;
    }
  } else if(tipo==='botanico'){
    var ramas=[[-56,-70,26],[706,-40,-24],[-70,780,-22],[712,830,22]];
    ramas.forEach(function(r){
      var hh="";
      for(i=0;i<9;i++){
        var yy=i*38;
        hh+="<div style='position:absolute;left:"+(i%2?18:-40)+"px;top:"+yy+"px;width:58px;height:22px;background:"+c2+";opacity:.22;border-radius:60% 10% 60% 10%;transform:rotate("+(i%2?-24:24)+"deg)'></div>";
      }
      h+="<div style='position:absolute;left:"+r[0]+"px;top:"+r[1]+"px;width:60px;height:360px;transform:rotate("+r[2]+"deg)'>"+
         "<div style='position:absolute;left:28px;top:0;width:2px;height:360px;background:"+c2+";opacity:.3'></div>"+hh+"</div>";
    });
  } else if(tipo==='artdeco'){
    [[-190,-190,1],[604,933,1]].forEach(function(o){
      for(i=0;i<5;i++){
        var d=200+i*130;
        caja("left:"+(o[0]+190-d/2)+"px;top:"+(o[1]+190-d/2)+"px;width:"+d+"px;height:"+d+"px;border:2px solid "+c2+";opacity:"+(0.34-i*0.045).toFixed(2)+";border-radius:50%");
      }
    });
    caja("left:30px;top:30px;right:30px;bottom:30px;border:1px solid "+c2+";opacity:.35");
    caja("left:38px;top:38px;right:38px;bottom:38px;border:3px solid "+c2+";opacity:.18");
  } else if(tipo==='estela'){
    caja("left:-160px;top:120px;width:900px;height:520px;background:radial-gradient(ellipse at center,"+c2+" 0%,rgba(255,255,255,0) 68%);opacity:.34");
    caja("left:120px;top:520px;width:840px;height:460px;background:radial-gradient(ellipse at center,"+c2+" 0%,rgba(255,255,255,0) 70%);opacity:.24");
    caja("left:-60px;top:760px;width:700px;height:420px;background:radial-gradient(ellipse at center,"+c2+" 0%,rgba(255,255,255,0) 72%);opacity:.18");
  } else if(tipo==='gotas'){
    var g=[[70,120,120,.20],[520,90,64,.26],[300,300,180,.13],[640,380,96,.20],[120,520,150,.16],[430,640,72,.26],[660,760,190,.11],[90,880,110,.20],[380,960,140,.14],[600,1020,80,.24],[240,60,52,.24],[720,220,44,.28]];
    g.forEach(function(o){ caja("left:"+o[0]+"px;top:"+o[1]+"px;width:"+o[2]+"px;height:"+o[2]+"px;border-radius:50%;background:"+c2+";opacity:"+o[3]); });
  } else if(tipo==='olas'){
    var ol=[[-320,60,.20],[-260,330,.15],[-380,620,.22],[-300,900,.13]];
    ol.forEach(function(o){ caja("left:"+o[0]+"px;top:"+o[1]+"px;width:1440px;height:430px;border-radius:50%;background:"+c2+";opacity:"+o[2]); });
  } else if(tipo==='marmol'){
    var v=[[-160,60,900,17,7,.22],[60,150,860,-11,3,.13],[-200,290,1000,22,10,.18],[140,430,820,-16,4,.12],[-140,560,960,19,8,.20],
           [40,700,880,-13,3,.12],[-180,840,1000,21,6,.17],[100,980,860,-15,4,.11],[-120,1080,900,17,9,.15]];
    v.forEach(function(o){ caja("left:"+o[0]+"px;top:"+o[1]+"px;width:"+o[2]+"px;height:"+o[4]+"px;transform:rotate("+o[3]+"deg);opacity:"+o[5]+";background:linear-gradient(90deg,rgba(255,255,255,0),"+c2+",rgba(255,255,255,0))"); });
  } else if(tipo==='geo'){
    var q=[[60,110,170,.16,1],[520,60,120,.24,0],[300,330,230,.10,1],[610,430,150,.20,0],[80,600,200,.14,0],[430,760,180,.18,1],[640,950,130,.22,0],[130,930,160,.12,1]];
    q.forEach(function(o){
      caja("left:"+o[0]+"px;top:"+o[1]+"px;width:"+o[2]+"px;height:"+o[2]+"px;transform:rotate(45deg);opacity:"+o[3]+";"+(o[4]?("background:"+c2):("border:3px solid "+c2)));
    });
  } else if(tipo==='lineas'){
    for(i=0;i<26;i++){
      caja("left:"+(-320+i*64)+"px;top:-200px;width:3px;height:1600px;transform:rotate(24deg);background:"+c2+";opacity:.14");
    }
  }
  return h;
}
function _catTapaTitTam(cfg){
  var t=cfg.tapa_titulo_tam||'normal';
  return t==='chico'?44:(t==='grande'?86:64);
}
function _catTapaLogoTam(cfg){
  var t=cfg.tapa_logo_tam||'normal';
  return t==='chico'?90:(t==='grande'?200:140);
}
function _catCatPdfPortadaHTML(cat,cfg,gcfg){
  var F=_catTplFont(cfg);
  var fg=cfg.tapa_color_texto||'#ffffff';
  var c2=cfg.tapa_c2||'#c9a227';
  var lay=cfg.tapa_layout||'centrado';
  var t1=String(cfg.tapa_titulo||cat.nombre||'CATÁLOGO');
  if(cfg.tapa_mayusculas!==false)t1=t1.toUpperCase();
  var t2=_catEsc(cfg.tapa_subtitulo||'');
  var ep=_catEsc(cfg.tapa_epigrafe||'');
  var ts=_catTapaTitTam(cfg);

  var h="<div style='width:794px;height:1123px;position:relative;overflow:hidden;background:"+(cfg.tapa_c1||'#141414')+";color:"+fg+";box-sizing:border-box'>";
  h+=_catTapaFondoHTML(cfg);
  var vel=parseInt(cfg.tapa_overlay)||0;
  if(vel>0) h+="<div style='position:absolute;left:0;top:0;width:794px;height:1123px;background:rgba(0,0,0,"+(vel/100).toFixed(2)+")'></div>";
  if(cfg.tapa_marco) h+="<div style='position:absolute;left:34px;top:34px;right:34px;bottom:34px;border:2px solid "+fg+";opacity:.45'></div>";

  // ── bloque de textos ──
  var txt="";
  if(ep)txt+="<div style='font-family:"+F.body+";font-size:13px;letter-spacing:.34em;text-transform:uppercase;opacity:.85;margin-bottom:18px'>"+ep+"</div>";
  if(lay!=='banda')txt+="<div style='width:64px;height:1px;background:"+fg+";opacity:.6;margin:0 auto 24px'></div>";
  txt+="<div style='font-family:"+F.head+";font-size:"+ts+"px;font-weight:700;line-height:1.04;letter-spacing:.015em'>"+_catEsc(t1)+"</div>";
  if(t2)txt+="<div style='font-family:"+F.body+";font-size:15px;letter-spacing:.26em;text-transform:uppercase;opacity:.9;margin-top:16px'>"+t2+"</div>";
  if(lay!=='banda')txt+="<div style='width:64px;height:1px;background:"+fg+";opacity:.6;margin:24px auto 0'></div>";

  if(lay==='banda'){
    var bandBg=_catHexRgb(cfg.tapa_c1||'#141414');
    h+="<div style='position:absolute;left:0;top:392px;width:794px;padding:44px 70px;box-sizing:border-box;text-align:center;background:rgba("+bandBg[0]+","+bandBg[1]+","+bandBg[2]+",.82)'>"+txt+"</div>";
  } else if(lay==='marco'){
    h+="<div style='position:absolute;left:86px;top:250px;width:622px;box-sizing:border-box;padding:56px 40px;text-align:center;border:2px solid "+c2+"'>"+txt+"</div>";
  } else {
    var just=(lay==='superior')?'flex-start':((lay==='inferior')?'flex-end':'center');
    var pad=(lay==='superior')?'150px 70px 0':((lay==='inferior')?'0 70px 260px':'0 70px');
    h+="<div style='position:absolute;left:0;top:0;width:794px;height:1123px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:"+just+";text-align:center;padding:"+pad+"'>"+txt+"</div>";
  }

  // ── logo ──
  var lp=cfg.tapa_logo_pos||'abajo';
  if(lp!=='ninguno' && cfg.tapa_logo_url && _catImgOk(cfg.tapa_logo_url,'alpha')){
    var lt=_catTapaLogoTam(cfg);
    var pos=(lp==='arriba')?"top:70px":"bottom:"+((cfg.tapa_pie_modo==='barra')?170:96)+"px";
    h+="<div style='position:absolute;left:0;right:0;"+pos+";text-align:center'><img src='"+_catImgSrc(cfg.tapa_logo_url,'alpha')+"' crossorigin='anonymous' style='max-width:"+lt+"px;max-height:"+lt+"px;display:inline-block'></div>";
  }

  // ── pie / banner de abajo ──
  var pieTxt=cfg.tapa_pie_texto||'';
  if(!pieTxt && cfg.incluir_contacto){
    var pp=[]; if(cfg.contacto_nombre)pp.push(cfg.contacto_nombre); if(cfg.contacto_telefono)pp.push(cfg.contacto_telefono); if(cfg.contacto_nota)pp.push(cfg.contacto_nota);
    pieTxt=pp.join('  ·  ');
  }
  var pm=cfg.tapa_pie_modo||'ninguno';
  if(pm==='barra'){
    h+="<div style='position:absolute;left:0;bottom:0;width:794px;height:96px;background:"+(cfg.tapa_pie_bg||'#141414')+";color:"+(cfg.tapa_pie_fg||'#ffffff')+";display:flex;align-items:center;justify-content:center;text-align:center;padding:0 60px;box-sizing:border-box'>"+
       "<div style='font-family:"+F.body+";font-size:15px;letter-spacing:.14em;text-transform:uppercase;font-weight:700'>"+_catEsc(pieTxt)+"</div></div>";
  } else if(pm==='texto' && pieTxt){
    h+="<div style='position:absolute;left:0;right:0;bottom:64px;text-align:center;font-family:"+F.body+";font-size:13px;letter-spacing:.1em;opacity:.92'>"+_catEsc(pieTxt)+"</div>";
  }

  if(gcfg && gcfg.credito_belle){
    var cb=(pm==='barra')?"bottom:106px":"bottom:30px";
    h+="<div style='position:absolute;left:0;right:0;"+cb+";text-align:center;font-family:"+F.body+";font-size:9px;opacity:.6'>"+_catEsc(gcfg.credito_belle)+"</div>";
  }
  h+="</div>";
  return h;
}
function _catCatPdfContactStrip(cfg){
  if(!cfg.incluir_contacto)return "";
  var F=_catTplFont(cfg);
  var nom=_catEsc(cfg.contacto_nombre||''), tel=_catEsc(cfg.contacto_telefono||''), nota=_catEsc(cfg.contacto_nota||'');
  var parts=[]; if(nom)parts.push("<b style='color:"+(cfg.precio_color||'#9a7d4e')+"'>"+nom+"</b>"); if(tel)parts.push(tel); if(nota)parts.push(nota);
  if(!parts.length)return "";
  return "<div style='border-top:1px solid rgba(0,0,0,.12);padding-top:6px;text-align:center;font-family:"+F.body+";font-size:10px;color:#7a6a4e'>"+parts.join(" &nbsp;·&nbsp; ")+"</div>";
}
function _catCatPdfPie(cat,cfg,gcfg,pageNum,totalPages,isLast){
  var F=_catTplFont(cfg), h="<div style='padding:0 30px 12px;flex-shrink:0'>";
  h+=_catCatPdfContactStrip(cfg);
  if(isLast && gcfg && gcfg.credito_belle) h+="<div style='text-align:center;font-size:9px;color:#a89e8c;margin-top:4px;font-family:"+F.body+"'>"+_catEsc(gcfg.credito_belle)+"</div>";
  if(cfg.mostrar_paginas!==false) h+="<div style='display:flex;justify-content:space-between;font-family:"+F.body+";font-size:9px;color:#a89e8c;margin-top:5px'><span>"+_catEsc(cat.nombre||'Catálogo')+"</span><span>"+pageNum+" / "+totalPages+"</span></div>";
  h+="</div>";
  return h;
}

// ── PLANTILLA: Lista clásica ──────────────────────────────────────
function _catTplTablaHead(cfg,wPerf,wPre,wNot,wAco){
  var ac=cfg.precio_color||'#a9763f', F=_catTplFont(cfg);
  var c="font-family:"+F.body+";font-size:9px;font-weight:700;color:"+ac+";text-transform:uppercase;letter-spacing:.06em";
  var h="<div style='display:flex;border-bottom:2px solid "+ac+";padding-bottom:5px;margin-bottom:2px'>";
  h+="<div style='flex:0 0 "+wPerf+"%;"+c+"'>Perfume</div>";
  h+="<div style='flex:0 0 "+wPre+"%;"+c+"'>Precio</div>";
  if(wNot)h+="<div style='flex:0 0 "+wNot+"%;"+c+"'>Notas</div>";
  if(wAco)h+="<div style='flex:0 0 "+wAco+"%;"+c+"'>Acordes</div>";
  h+="</div>";
  return h;
}
function _catTplTablaRow(item,cfg,wPerf,wPre,wNot,wAco){
  var p=item.p, ficha=item.ficha||{}, F=_catTplFont(cfg), m=_catMedidas(cfg);
  var ac=cfg.precio_color||'#a9763f';
  var nombre=_catEsc(String(p.nombre||'').replace(/\s*\|.*/,'').trim());
  var marca=_catEsc(String(p.empresa||'').trim());
  var conc=_catCatPdfConc(p,ficha), ml=p.ml?(p.ml+' ml'):'';
  var metaParts=[]; if(conc)metaParts.push(_catEsc(conc)); if(ml)metaParts.push(_catEsc(ml));
  var meta=metaParts.join(' · ');
  var num=(cfg.mostrar_numeracion&&item.n)?("<span style='color:#b8a888;font-weight:700'>"+item.n+". </span>"):"";
  var nom=(cfg.tipografia==='moderna')?(m.nom-3):m.nom;
  var h="<div style='display:flex;align-items:center;height:"+m.fila+"px;box-sizing:border-box;overflow:hidden;border-bottom:1px solid rgba(0,0,0,.08);padding:"+m.pad+"px 0'>";
  h+="<div style='flex:0 0 "+wPerf+"%;padding-right:8px;display:flex;gap:10px;align-items:center'>";
  h+="<div style='align-self:center;flex-shrink:0'>"+_catFotoHTML(p.imagen_url,m.foto+'px',m.foto+'px','contain',0,cfg.cat_bg||'#fdfbf7',true)+"</div>";
  h+="<div style='flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center'>";
  h+="<div style='font-family:"+F.head+";font-size:"+nom+"px;font-weight:700;color:#2e2a26;line-height:1.18'>"+num+nombre+"</div>";
  if(marca && cfg.mostrar_marca!==false)h+="<div style='font-family:"+F.body+";font-size:10.5px;color:"+ac+";font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-top:2px'>"+marca+"</div>";
  if(meta && cfg.mostrar_meta!==false)h+="<div style='font-family:"+F.body+";font-size:10.5px;color:"+ac+";margin-top:1px'>"+meta+"</div>";
  h+="</div></div>";
  h+="<div style='flex:0 0 "+wPre+"%;display:flex;align-items:center'>"+_catPrecioHTML(item,cfg,Math.round(m.nom*0.9))+"</div>";
  if(wNot)h+="<div style='flex:0 0 "+wNot+"%;padding-right:8px;display:flex;align-items:center;overflow:hidden'>"+_catCatPdfNotasHTML(item,cfg)+"</div>";
  if(wAco)h+="<div style='flex:0 0 "+wAco+"%;display:flex;flex-direction:column;justify-content:center;gap:2px;overflow:hidden'>"+_catCatPdfAcordesHTML(p,cfg)+"</div>";
  h+="</div>";
  return h;
}
function _catTplTabla(cfg,items){
  var wNot=(cfg.mostrar_notas===false)?0:24, wAco=(cfg.mostrar_acordes===false)?0:21;
  var wPre=15, wPerf=100-wNot-wAco-wPre;
  var h="<div style='flex:1;padding:18px 30px 8px;overflow:hidden'>";
  h+=_catTplTablaHead(cfg,wPerf,wPre,wNot,wAco);
  items.forEach(function(it){ h+=_catTplTablaRow(it,cfg,wPerf,wPre,wNot,wAco); });
  h+="</div>";
  return h;
}

// ── PLANTILLA: Editorial ──────────────────────────────────────────
function _catTplEditorial(cfg,items){
  var F=_catTplFont(cfg), ac=cfg.precio_color||'#a9763f', m=_catMedidas(cfg);
  var h="<div style='flex:1;padding:22px 44px 10px;display:flex;flex-direction:column;justify-content:space-around;overflow:hidden'>";
  items.forEach(function(it,i){
    var p=it.p, ficha=it.ficha||{};
    var nombre=_catEsc(String(p.nombre||'').replace(/\s*\|.*/,'').trim());
    var marca=_catEsc(String(p.empresa||'').trim());
    var conc=_catCatPdfConc(p,ficha), ml=p.ml?(p.ml+' ml'):'';
    var metaParts=[]; if(conc)metaParts.push(_catEsc(conc)); if(ml)metaParts.push(_catEsc(ml));
    var rev=(i%2===1);
    h+="<div style='display:flex;gap:24px;align-items:center;padding:12px 0;"+(rev?'flex-direction:row-reverse;':'')+"'>";
    h+=_catFotoHTML(p.imagen_url,m.foto+'px',m.foto+'px','contain',0,cfg.cat_bg||'#fdfbf7',true);
    h+="<div style='flex:1;min-width:0;"+(rev?'text-align:right;':'')+"'>";
    if(marca && cfg.mostrar_marca!==false)h+="<div style='font-family:"+F.body+";font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:"+ac+";font-weight:700;margin-bottom:5px'>"+marca+"</div>";
    h+="<div style='font-family:"+F.head+";font-size:"+m.nom+"px;font-weight:700;color:#241f1a;line-height:1.08'>"+((cfg.mostrar_numeracion&&it.n)?("<span style='color:#c3b49a'>"+it.n+". </span>"):"")+nombre+"</div>";
    if(metaParts.length && cfg.mostrar_meta!==false)h+="<div style='font-family:"+F.body+";font-size:10px;color:#8a7a5a;margin-top:4px;letter-spacing:.05em'>"+metaParts.join(' · ')+"</div>";
    h+="<div style='width:46px;height:1px;background:"+ac+";opacity:.55;margin:10px 0;"+(rev?'margin-left:auto;':'')+"'></div>";
    var notas=_catNotasStrip(it,cfg,6,Math.round(m.foto*0.16));
    if(notas)h+="<div style='margin-bottom:8px;"+(rev?'display:flex;justify-content:flex-end;':'')+"'>"+notas+"</div>";
    var pills=_catAcordesPills(p,cfg,4,8.5);
    if(pills)h+="<div style='"+(rev?'display:flex;justify-content:flex-end;':'')+"'>"+pills+"</div>";
    h+="</div>";
    var pr=_catPrecioHTML(it,cfg,Math.round(m.nom*0.72));
    if(pr)h+="<div style='flex-shrink:0;text-align:"+(rev?'left':'right')+"'>"+pr+"</div>";
    h+="</div>";
  });
  h+="</div>";
  return h;
}

// ── PLANTILLA: Revista (grilla 2) ─────────────────────────────────
function _catTplRevista(cfg,items,capRows){
  var F=_catTplFont(cfg), ac=cfg.precio_color||'#a9763f', m=_catMedidas(cfg);
  var h="<div style='flex:1;min-height:0;padding:18px 26px 8px;display:flex;flex-direction:column;overflow:hidden'>";
  h+="<div style='flex:1;min-height:0;display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat("+capRows+",1fr);gap:14px'>";
  items.forEach(function(it){
    var p=it.p, ficha=it.ficha||{};
    var nombre=_catEsc(String(p.nombre||'').replace(/\s*\|.*/,'').trim());
    var marca=_catEsc(String(p.empresa||'').trim());
    var conc=_catCatPdfConc(p,ficha), ml=p.ml?(p.ml+' ml'):'';
    var metaParts=[]; if(conc)metaParts.push(_catEsc(conc)); if(ml)metaParts.push(_catEsc(ml));
    h+="<div style='background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;min-height:0'>";
    h+="<div style='flex:0 0 54%;overflow:hidden;background:#ffffff;display:flex;align-items:center;justify-content:center'>"+
       "<div style='width:100%;height:100%;max-width:"+m.foto+"px;max-height:"+m.foto+"px'>"+_catFotoHTML(p.imagen_url,'100%','100%','contain',0,'#ffffff',true)+"</div></div>";
    h+="<div style='flex:1;min-height:0;padding:9px 12px 10px;display:flex;flex-direction:column'>";
    if(marca && cfg.mostrar_marca!==false)h+="<div style='font-family:"+F.body+";font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:"+ac+";font-weight:700'>"+marca+"</div>";
    h+="<div style='font-family:"+F.head+";font-size:"+m.nom+"px;font-weight:700;color:#2a251f;line-height:1.12;margin-top:2px'>"+nombre+"</div>";
    if(metaParts.length && cfg.mostrar_meta!==false)h+="<div style='font-family:"+F.body+";font-size:8.5px;color:#9a8a6a;margin-top:2px'>"+metaParts.join(' · ')+"</div>";
    var pills=_catAcordesPills(p,cfg,3,7.5);
    if(pills)h+="<div style='margin-top:5px'>"+pills+"</div>";
    h+="<div style='flex:1'></div>";
    h+="<div style='display:flex;align-items:flex-end;justify-content:space-between;gap:6px;margin-top:5px'>";
    var nt=_catNotasTexto(it,cfg,4);
    h+="<div style='font-family:"+F.body+";font-size:7.5px;color:#a89880;line-height:1.25;flex:1;min-width:0;overflow:hidden;max-height:20px'>"+nt+"</div>";
    h+=_catPrecioHTML(it,cfg,15);
    h+="</div></div></div>";
  });
  h+="</div></div>";
  return h;
}

// ── PLANTILLA: Galería (grilla 3) ─────────────────────────────────
function _catTplGaleria(cfg,items,capRows){
  var F=_catTplFont(cfg), ac=cfg.precio_color||'#a9763f', m=_catMedidas(cfg);
  var h="<div style='flex:1;min-height:0;padding:18px 26px 8px;display:flex;flex-direction:column;overflow:hidden'>";
  h+="<div style='flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat("+capRows+",1fr);gap:12px'>";
  items.forEach(function(it){
    var p=it.p, ficha=it.ficha||{};
    var nombre=_catEsc(String(p.nombre||'').replace(/\s*\|.*/,'').trim());
    var marca=_catEsc(String(p.empresa||'').trim());
    var ml=p.ml?(p.ml+' ml'):'';
    h+="<div style='background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;min-height:0'>";
    h+="<div style='flex:1;min-height:0;background:#ffffff;display:flex;align-items:center;justify-content:center'>"+
       "<div style='width:100%;height:100%;max-width:"+m.foto+"px;max-height:"+m.foto+"px'>"+_catFotoHTML(p.imagen_url,'100%','100%','contain',0,'#ffffff',true)+"</div></div>";
    h+="<div style='flex-shrink:0;padding:7px 9px 9px;text-align:center;border-top:1px solid rgba(0,0,0,.05)'>";
    if(marca && cfg.mostrar_marca!==false)h+="<div style='font-family:"+F.body+";font-size:7px;letter-spacing:.16em;text-transform:uppercase;color:"+ac+";font-weight:700'>"+marca+"</div>";
    h+="<div style='font-family:"+F.head+";font-size:"+m.nom+"px;font-weight:700;color:#2a251f;line-height:1.12;margin-top:1px;max-height:"+(m.nom*2+4)+"px;overflow:hidden'>"+nombre+"</div>";
    if(ml && cfg.mostrar_meta!==false)h+="<div style='font-family:"+F.body+";font-size:7.5px;color:#a89880;margin-top:1px'>"+_catEsc(ml)+"</div>";
    var pr=_catPrecioHTML(it,cfg,13);
    if(pr)h+="<div style='margin-top:4px'>"+pr+"</div>";
    h+="</div></div>";
  });
  h+="</div></div>";
  return h;
}

// ── PLANTILLA: Minimalista (2 columnas de texto) ──────────────────
function _catTplMinimal(cfg,items){
  var F=_catTplFont(cfg), ac=cfg.precio_color||'#a9763f', m=_catMedidas(cfg);
  var mitad=Math.ceil(items.length/2);
  var cols=[items.slice(0,mitad), items.slice(mitad)];
  var h="<div style='flex:1;padding:22px 34px 10px;display:flex;gap:26px;overflow:hidden'>";
  cols.forEach(function(col){
    h+="<div style='flex:1;min-width:0'>";
    col.forEach(function(it){
      var p=it.p, ficha=it.ficha||{};
      var nombre=_catEsc(String(p.nombre||'').replace(/\s*\|.*/,'').trim());
      var marca=_catEsc(String(p.empresa||'').trim());
      var conc=_catCatPdfConc(p,ficha), ml=p.ml?(p.ml+' ml'):'';
      var metaParts=[]; if(marca && cfg.mostrar_marca!==false)metaParts.push(marca);
      if(cfg.mostrar_meta!==false){ if(conc)metaParts.push(_catEsc(conc)); if(ml)metaParts.push(_catEsc(ml)); }
      h+="<div style='display:flex;align-items:baseline;gap:8px;padding:6px 0;border-bottom:1px dotted rgba(0,0,0,.14)'>";
      h+="<div style='flex:1;min-width:0'>";
      h+="<div style='font-family:"+F.head+";font-size:"+m.nom+"px;font-weight:700;color:#2a251f;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>"+((cfg.mostrar_numeracion&&it.n)?("<span style='color:#c3b49a'>"+it.n+". </span>"):"")+nombre+"</div>";
      if(metaParts.length)h+="<div style='font-family:"+F.body+";font-size:7.5px;color:#a2926f;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>"+metaParts.join(' · ')+"</div>";
      h+="</div>";
      h+=_catPrecioHTML(it,cfg,12);
      h+="</div>";
    });
    h+="</div>";
  });
  h+="</div>";
  return h;
}

// ── ARMADO DE LA HOJA ─────────────────────────────────────────────
function _catCatPdfPageHTML(cat,cfg,gcfg,pageItems,isFirst,isLast,pageNum,totalPages,capRows){
  var bg=cfg.cat_bg||'#fdfbf7', ac=cfg.precio_color||'#a9763f', F=_catTplFont(cfg);
  var tplId=cfg.plantilla||'tabla';
  // Revista y Galería son grillas: calzan exactas en la hoja.
  // Las demás fluyen, así que van con min-height para no cortar ningún perfume.
  var alto=(tplId==='revista'||tplId==='galeria')?"height:1123px;overflow:hidden;":"min-height:1123px;";
  var h="<div style='width:794px;"+alto+"background:"+bg+";box-sizing:border-box;font-family:"+F.body+";display:flex;flex-direction:column;position:relative'>";
  if(cfg.borde_hoja)h+="<div style='position:absolute;left:13px;top:13px;right:13px;bottom:13px;border:1px solid "+ac+";opacity:.28;pointer-events:none;z-index:2'></div>";
  if(isFirst && !cfg.tapa_on && (cfg.portada_modo||'banner')==='banner') h+=_catCatPdfBannerHTML(cat,cfg,false);
  else h+=_catCatPdfHojaBannerHTML(cfg);
  if(tplId==='editorial')      h+=_catTplEditorial(cfg,pageItems);
  else if(tplId==='revista')   h+=_catTplRevista(cfg,pageItems,capRows||3);
  else if(tplId==='galeria')   h+=_catTplGaleria(cfg,pageItems,capRows||4);
  else if(tplId==='minimal')   h+=_catTplMinimal(cfg,pageItems);
  else                         h+=_catTplTabla(cfg,pageItems);
  h+=_catCatPdfPie(cat,cfg,gcfg,pageNum,totalPages,isLast);
  h+="</div>";
  return h;
}

// Reparto PAREJO de perfumes por hoja: calcula cuántas hojas hacen falta
// y reparte lo más parejo posible respetando el techo de cada una, para no
// dejar la última coja (ej 7/10/4).
function _catCatReparto(total,maxFirst,maxRest){
  if(total<=maxFirst) return [total];
  var n=1, cap=maxFirst;
  while(cap<total){ n++; cap+=maxRest; }
  var caps=[maxFirst]; for(var k=1;k<n;k++)caps.push(maxRest);
  var cnt=[]; for(var j=0;j<n;j++)cnt.push(0);
  var left=total, idx=0, guard=0;
  while(left>0 && guard<100000){
    if(cnt[idx]<caps[idx]){ cnt[idx]++; left--; }
    idx=(idx+1)%n; guard++;
  }
  return cnt;
}

function _catCatItemsDe(rows){
  var byId={}; (allProds||[]).forEach(function(p){ byId[p.id]=p; });
  var items=[], n=0;
  (rows||[]).forEach(function(r){
    var p=byId[r.producto_id]; if(!p)return;
    var ficha=null; try{ ficha=fichaMatchProd(p.nombre,(typeof FICHAS_BELLE!=='undefined'?FICHAS_BELLE:[]),p.id); }catch(e){}
    items.push({p:p, ficha:ficha||{}, precio:r.precio, n:++n});
  });
  return items;
}
// Todas las imágenes que hace falta bajar para este catálogo (con su ancho máximo)
function _catCatImagenes(cfg,items){
  var out=[];
  if(cfg.tapa_on){
    var tu=_catTapaImagenUrl(cfg);
    if(tu) out.push({url:tu,max:900});
    if(cfg.tapa_logo_pos!=='ninguno' && cfg.tapa_logo_url) out.push({url:cfg.tapa_logo_url,max:420,fondo:'alpha'});
  }
  if(!cfg.tapa_on && cfg.banner_modo==='imagen' && cfg.banner_imagen_url) out.push({url:cfg.banner_imagen_url,max:900});
  if(cfg.hoja_modo==='imagen' && cfg.hoja_imagen_url) out.push({url:cfg.hoja_imagen_url,max:900});
  var tpl=cfg.plantilla||'tabla';
  if(tpl==='minimal') return out;                      // sin fotos: por eso vuela
  // Pedimos la foto al doble del tamaño en que se va a ver (el PDF se dibuja a
  // escala 1.25-1.5), con un piso para que nunca salga pixelada.
  var mm=_catMedidas(cfg);
  var maxProd=Math.max(200, Math.min(460, Math.round((mm.foto||160)*2)));
  var sup=_catSuperficieFoto(cfg);
  items.forEach(function(it){ if(it.p.imagen_url)out.push({url:it.p.imagen_url,max:maxProd,fondo:sup}); });
  if(cfg.mostrar_notas!==false && (cfg.notas_modo||'fotos')==='fotos' && (tpl==='tabla'||tpl==='editorial')){
    var maxN=(tpl==='editorial')?6:12;
    items.forEach(function(it){
      _catCatPdfNotasList(it.ficha).slice(0,maxN).forEach(function(nm){ var u=_catCatNotaFoto(nm); if(u)out.push({url:u,max:130}); });
    });
  }
  return out;
}

function _catCatPdfGenerar(catId){
  var cat=(_catCatList||[]).filter(function(x){return x.id===catId;})[0];
  if(!cat){ _catToast('Catálogo no encontrado','twarn'); return; }
  if(typeof window.jspdf==='undefined' || typeof html2canvas==='undefined'){ _libsPdf().then(function(){ _catCatPdfGenerar(catId); }).catch(function(){ _catToast('No se pudieron cargar las librerías de PDF','terr'); }); return; }
  var cfg=_catCatClamp(Object.assign(_catCatBase(), cat.config||{}));
  var gcfg=_catCatConfig||{};
  _catCatPdfOverlay(true,'Preparando tu catálogo…');
  apiGet('catalogos_cliente_productos','select=producto_id,precio,precio_manual,orden&catalogo_id=eq.'+catId+'&order=orden.asc&limit=5000').then(function(rows){
    rows=Array.isArray(rows)?rows:[];
    if(!rows.length){ _catCatPdfOverlay(false); _catToast('Este catálogo no tiene productos. Tocá "Productos y precios".','twarn'); return; }
    var items=_catCatItemsDe(rows);
    if(!items.length){ _catCatPdfOverlay(false); _catToast('No pude armar el catálogo','twarn'); return; }
    _catCatPdfEnsureNotas(function(){ _catCatPdfRender(cat,cfg,gcfg,items); });
  }).catch(function(e){ console.error('[catpdf load]',e); _catCatPdfOverlay(false); _catToast('No pude cargar los productos','twarn'); });
}

function _catCatPdfRender(cat,cfg,gcfg,items){
  var pp=_catTplPerPage(cfg);
  var tpl=_catTplDef(cfg.plantilla||'tabla');
  var conPortada=!!cfg.tapa_on;
  var pages=[], _off=0;
  _catCatReparto(items.length,pp[0],pp[1]).forEach(function(c){ pages.push(items.slice(_off,_off+c)); _off+=c; });
  var cols=tpl.cols||1;
  var totalPages=pages.length+(conPortada?1:0);

  var pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  var pw=pdf.internal.pageSize.getWidth(), ph=pdf.internal.pageSize.getHeight();
  var bgHex=cfg.cat_bg||'#fdfbf7', bgRgb=_catHexRgb(bgHex);
  var host=document.createElement('div');
  host.style.cssText='position:fixed;left:-99999px;top:0;width:794px;background:'+bgHex;
  document.body.appendChild(host);
  var idx=0, hechas=0;
  // Con muchas hojas bajamos un poco la escala: el PDF pesa menos y sale antes.
  var escala = totalPages>14?1.25:1.5;

  function finish(ok){
    if(host.parentNode)host.parentNode.removeChild(host);
    _catCatPdfOverlay(false);
    if(ok){ pdf.save('Catalogo_'+String(cat.nombre||'Belle').replace(/[^a-zA-Z0-9]/g,'_')+'.pdf'); _catToast('¡Catálogo PDF listo!','tok'); }
  }
  function pintar(html, cb){
    host.innerHTML=html;
    html2canvas(host.firstChild,{scale:escala,useCORS:true,allowTaint:false,backgroundColor:bgHex,logging:false,imageTimeout:0}).then(function(canvas){
      var imgData=canvas.toDataURL('image/jpeg',0.9);
      if(hechas>0)pdf.addPage();
      pdf.setFillColor(bgRgb[0],bgRgb[1],bgRgb[2]); pdf.rect(0,0,pw,ph,'F');
      var ratio=canvas.width/canvas.height, imgW=pw, imgH=imgW/ratio;
      if(imgH>ph){ imgH=ph; imgW=imgH*ratio; }
      pdf.addImage(imgData,'JPEG',(pw-imgW)/2,0,imgW,imgH);
      hechas++;
      _catCatPdfOverlay(true,'Armando hoja '+hechas+' de '+totalPages+'…', 0.35+0.65*(hechas/totalPages));
      setTimeout(cb,30);
    }).catch(function(e){ console.error('[catpdf page]',e); finish(false); _catToast('Error generando el PDF','terr'); });
  }
  function doPage(){
    if(idx>=pages.length){ finish(true); return; }
    var pageItems=pages[idx], isFirst=idx===0, isLast=idx===pages.length-1;
    var num=idx+1+(conPortada?1:0);
    var capRows=Math.max(1,Math.ceil((isFirst?pp[0]:pp[1])/cols));
    idx++;
    pintar(_catCatPdfPageHTML(cat,cfg,gcfg,pageItems,isFirst,isLast,num,totalPages,capRows), doPage);
  }

  _catImgLive=false;
  _catCatPdfOverlay(true,'Bajando las fotos…',0);
  _catImgPreloadAll(_catCatImagenes(cfg,items), function(f){ _catCatPdfOverlay(true,'Bajando las fotos…', 0.35*f); }, function(){
    _catCatPdfOverlay(true,'Armando las hojas…',0.35);
    if(conPortada){ pintar(_catCatPdfPortadaHTML(cat,cfg,gcfg), doPage); }
    else doPage();
  });
}

// ══════════════════════════════════════════════════════════════════
// MODAL DE DISEÑO — controles a la izquierda, vista previa real a la derecha
// ══════════════════════════════════════════════════════════════════
function _catCatModalCSS(){
  if(document.getElementById('_catCatCSS'))return;
  var st=document.createElement('style'); st.id='_catCatCSS';
  st.textContent=[
  '#_moCatCat{position:fixed;inset:0;z-index:9999;background:rgba(20,15,8,.62);display:flex;align-items:center;justify-content:center;padding:0}',
  '.ccm-panel{background:#fdfbf7;width:100%;height:100%;max-width:1180px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 22px 64px rgba(0,0,0,.34)}',
  '.ccm-head{display:flex;align-items:center;gap:.6rem;padding:.85rem 1rem;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;flex-shrink:0}',
  '.ccm-head h3{margin:0;font-family:"Cormorant Garamond",serif;font-size:1.25rem;font-weight:700;line-height:1.1}',
  '.ccm-head p{margin:0;font-size:.67rem;opacity:.92}',
  '.ccm-x{background:rgba(255,255,255,.18);border:none;color:#fff;width:34px;height:34px;border-radius:9px;font-size:1.25rem;line-height:1;cursor:pointer;flex-shrink:0}',
  '.ccm-body{flex:1;display:flex;min-height:0}',
  '.ccm-left{flex:1;min-width:0;overflow-y:auto;padding:.85rem .9rem 1.4rem;-webkit-overflow-scrolling:touch}',
  '.ccm-right{display:none}',
  '.ccm-prevMob{margin-bottom:.8rem}',
  '@media(min-width:900px){#_moCatCat{padding:1.1rem}.ccm-panel{border-radius:18px;height:94vh}.ccm-right{display:flex;width:400px;flex-shrink:0;border-left:1px solid #eee2cd;background:#f4eee2;flex-direction:column}.ccm-prevMob{display:none}.ccm-left{padding:1rem 1.15rem 1.6rem}}',
  '.ccm-sec{border:1px solid #ecdfc9;border-radius:14px;background:#fff;margin-bottom:.6rem;overflow:hidden}',
  '.ccm-secH{display:flex;align-items:center;gap:.5rem;padding:.68rem .8rem;cursor:pointer;-webkit-user-select:none;user-select:none;background:#fffdf9}',
  '.ccm-secT{font-size:.84rem;font-weight:700;color:#5a4a30;flex-shrink:0}',
  '.ccm-secV{font-size:.66rem;color:#b09b73;flex:1;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '.ccm-secA{color:#c4965a;font-size:.8rem;transition:transform .18s ease;flex-shrink:0}',
  '.ccm-sec.open .ccm-secA{transform:rotate(90deg)}',
  '.ccm-sec.open .ccm-secH{border-bottom:1px solid #f4ebda}',
  '.ccm-secB{padding:.15rem .8rem .85rem;display:none}',
  '.ccm-sec.open .ccm-secB{display:block}',
  '.ccm-lbl{font-size:.64rem;color:#9a8870;text-transform:uppercase;font-weight:700;letter-spacing:.05em;display:block;margin:.75rem 0 .3rem}',
  '.ccm-hint{font-size:.65rem;color:#aa9a80;line-height:1.35;margin:.25rem 0 .1rem}',
  '.ccm-inp{width:100%;padding:.55rem .7rem;border:1px solid #e0d4bf;border-radius:9px;font-size:.85rem;font-family:inherit;color:#5a4a30;box-sizing:border-box;background:#fff}',
  '.ccm-chips{display:flex;gap:.32rem;flex-wrap:wrap}',
  '.ccm-chip{border:1px solid #e5d6b8;background:#fff;color:#a9763f;border-radius:999px;padding:.4rem .78rem;font-size:.71rem;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.1}',
  '.ccm-chip.on{background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border-color:transparent}',
  '.ccm-seg{display:flex;gap:.4rem;background:#f2e8d6;border-radius:12px;padding:.28rem}',
  '.ccm-segb{flex:1;border:none;background:transparent;color:#9a8358;border-radius:9px;padding:.62rem .5rem;font-size:.78rem;font-weight:800;letter-spacing:.06em;cursor:pointer;font-family:inherit}',
  '.ccm-segb.on{background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;box-shadow:0 2px 8px rgba(169,118,63,.28)}',
  '.ccm-tplgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.5rem}',
  '.ccm-tpl{border:1.5px solid #ece0ca;border-radius:13px;padding:.55rem;cursor:pointer;background:#fff;text-align:left}',
  '.ccm-tpl.on{border-color:#c4965a;background:#fffaf1;box-shadow:0 0 0 3px rgba(196,150,90,.15)}',
  '.ccm-tplT{display:flex;align-items:center;gap:.35rem}',
  '.ccm-tplN{font-size:.79rem;font-weight:700;color:#4a3c26}',
  '.ccm-tplD{font-size:.62rem;color:#a2926f;line-height:1.32;margin-top:.2rem}',
  '.ccm-mini{display:flex;gap:2px;margin-bottom:.35rem;height:26px}',
  '.ccm-mini i{background:#e9dcc4;border-radius:2px;display:block}',
  '.ccm-sw{display:flex;align-items:center;justify-content:space-between;gap:.6rem;padding:.42rem 0;font-size:.8rem;color:#5a4a30;border-bottom:1px solid #f6f0e4}',
  '.ccm-sw:last-child{border-bottom:none}',
  '.ccm-sw input{width:19px;height:19px;accent-color:#c4965a;flex-shrink:0}',
  '.ccm-foot{padding:.75rem .9rem;border-top:1px solid #f0e7d6;display:flex;gap:.55rem;background:#faf6ee;flex-shrink:0}',
  '.ccm-btn{border-radius:10px;padding:.68rem;font-size:.83rem;font-weight:700;cursor:pointer;font-family:inherit;border:none}',
  '.ccm-prevHead{padding:.65rem .9rem;border-bottom:1px solid #e6dbc6;display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;flex-shrink:0}',
  '.ccm-prevTit{font-size:.72rem;font-weight:800;color:#7a6444;letter-spacing:.06em;text-transform:uppercase;flex:1}',
  '.ccm-pg{border:1px solid #ddcdaa;background:#fff;color:#8a6a3a;border-radius:7px;padding:.24rem .55rem;font-size:.66rem;font-weight:700;cursor:pointer;font-family:inherit}',
  '.ccm-pg.on{background:#c4965a;color:#fff;border-color:transparent}',
  '.ccm-prevWrap{flex:1;overflow:auto;padding:.9rem;display:block}',
  '.ccm-prevWrap>div{width:100%}',
  '.ccm-stage{position:relative;box-shadow:0 10px 28px rgba(90,70,40,.22);background:#fff;overflow:hidden;flex-shrink:0}',
  '.ccm-stage>div{transform-origin:top left}',
  '.ccm-prevFoot{padding:.5rem .9rem .7rem;font-size:.64rem;color:#9a8768;text-align:center;flex-shrink:0;border-top:1px solid #e6dbc6}',
  '.ccm-prevHeadM{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;margin-bottom:.4rem}',
  '.ccm-prevMob>div{display:flex;justify-content:center}',
  '.ccm-prevMob>.ccm-prevHeadM{justify-content:flex-start}',
  '.ccm-prevFootM{font-size:.63rem;color:#9a8768;text-align:center;margin-top:.35rem}'
  ].join('\n');
  document.head.appendChild(st);
}

function _catCatModal(cat){
  var old=document.getElementById('_moCatCat'); if(old)old.remove();
  _catCatModalCSS();
  var s;
  if(cat){ s=Object.assign(_catCatBase(), cat.config||{}, {id:cat.id, nombre:cat.nombre}); s._file=null; s._imgPreview=(cat.config&&cat.config.banner_imagen_url)||''; }
  else { s=_catCatDefaults(); s.id=null; s._file=null; s._imgPreview=s.banner_imagen_url||''; }
  s=_catCatClamp(s);
  s._sec=s._sec||0; s._prevPage=0; s._items=null;
  _catCatModalState=s;

  var mo=document.createElement('div');
  mo.id='_moCatCat';
  mo.onclick=function(e){ if(e.target===mo)_catCatCerrarModal(); };
  var h="<div class='ccm-panel' onclick='event.stopPropagation()'>";
  h+="<div class='ccm-head'><div style='flex:1;min-width:0'><h3>"+(cat?'Diseño del catálogo':'Nuevo catálogo')+"</h3><p>Elegí la plantilla y mirá al costado cómo va quedando</p></div>";
  h+="<button class='ccm-x' onclick='_catCatCerrarModal()'>&times;</button></div>";
  h+="<div class='ccm-body'>";
  h+="<div class='ccm-left'>";
  h+="<label class='ccm-lbl' style='margin-top:0'>Nombre del catálogo</label>";
  h+="<input id='_catCatNombre' class='ccm-inp' type='text' value='"+_catEsc(s.nombre||'')+"' placeholder='Ej: Catálogo Primavera' oninput='_catCatNombreLive(this.value)' style='margin-bottom:.8rem'>";
  h+="<div id='_ccmTapaSw' style='margin-bottom:.8rem'></div>";
  h+="<div class='ccm-prevMob'><div class='ccm-prevHeadM'><span class='ccm-prevTit'>Vista previa</span><span id='_ccmPgBtnsMob' style='display:flex;gap:.25rem;flex-wrap:wrap'></span><button id='_ccmZoomBtn' class='ccm-pg' onclick='_catCatPrevZoom()'>Agrandar</button></div><div id='_ccmPrevMobBox'></div><div class='ccm-prevFootM' id='_ccmPrevFootMob'></div></div>";
  h+="<div id='_ccmSecs'></div>";
  h+="</div>";
  h+="<div class='ccm-right'>";
  h+="<div class='ccm-prevHead'><span class='ccm-prevTit'>Vista previa</span><span id='_ccmPgBtns' style='display:flex;gap:.25rem;flex-wrap:wrap'></span></div>";
  h+="<div class='ccm-prevWrap'><div id='_ccmPrevBox'></div></div>";
  h+="<div class='ccm-prevFoot' id='_ccmPrevFoot'></div>";
  h+="</div>";
  h+="</div>";
  h+="<div class='ccm-foot'>";
  h+="<button class='ccm-btn' onclick='_catCatCerrarModal()' style='flex:1;background:#fff;border:1px solid #d4ba8a;color:#9a8870;font-weight:600'>Cancelar</button>";
  h+="<button id='_catCatGuardarBtn' class='ccm-btn' onclick='_catCatGuardar()' style='flex:1.6;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff'>Guardar diseño</button>";
  h+="</div></div>";
  mo.innerHTML=h;
  document.body.appendChild(mo);
  if(typeof _catModalBackRegistrar==='function')_catModalBackRegistrar('_moCatCat',_catCatCerrarModal);
  _catCatRenderTapaSw();
  _catCatRenderSecs();
  _catCatPreviewCargarItems(function(){ _catCatPreviewUpdate(); });
}

function _catCatNombreLive(v){ if(_catCatModalState){ _catCatModalState.nombre=v; _catCatPreviewUpdate(); } }

// ── TAPA: secciones del armador ───────────────────────────────────
function _catCatTapaOn(v){
  var s=_catCatModalState; if(!s)return;
  s.tapa_on=!!v;
  if(v && !s.tapa_titulo && s.banner_texto1)s.tapa_titulo=s.banner_texto1;
  if(v && !s.tapa_subtitulo && s.banner_texto2)s.tapa_subtitulo=s.banner_texto2;
  s._sec=0;                       // abre el menú de personalización de la tapa
  s._prevPage=0;
  _catCatPrevIr(v?'tapa':'hoja');
  _catCatRenderSecs();
  _catCatPreviewNow();
}
function _catCatTapaMiniHTML(id, ancho){
  // Miniatura real del fondo: la misma hoja de 794×1123 achicada
  var s=_catCatModalState||{};
  var cfgM={tapa_fondo_tipo:id, tapa_c1:s.tapa_c1||'#141414', tapa_c2:s.tapa_c2||'#c9a227'};
  var k=ancho/794, alto=Math.round(1123*k);
  return "<div style='width:"+ancho+"px;height:"+alto+"px;overflow:hidden;position:relative;border-radius:6px'>"+
         "<div style='width:794px;height:1123px;position:relative;transform:scale("+k+");transform-origin:top left'>"+_catTapaFondoHTML(cfgM)+"</div></div>";
}
function _catCatSecTapaFondo(){
  var s=_catCatModalState, gcfg=_catCatConfig||{};
  var galeria=Array.isArray(gcfg.tapa_fondos)?gcfg.tapa_fondos:[];
  var h="<div class='ccm-hint'>Elegí una imagen tuya o armá la tapa con uno de nuestros diseños. Todos se pueden recolorear.</div>";

  h+="<label class='ccm-lbl'>De dónde sale el fondo</label><div class='ccm-chips'>";
  h+="<button type='button' class='ccm-chip"+(s.tapa_fondo_tipo==='imagen_propia'?' on':'')+"' onclick='_catCatStateSet(\"tapa_fondo_tipo\",\"imagen_propia\",true)'>Mi imagen</button>";
  if(galeria.length)h+="<button type='button' class='ccm-chip"+(s.tapa_fondo_tipo==='galeria'?' on':'')+"' onclick='_catCatStateSet(\"tapa_fondo_tipo\",\"galeria\",true)'>Galería Belle</button>";
  h+="<button type='button' class='ccm-chip"+(!_catTapaEsFondoImagen(s)?' on':'')+"' onclick='_catCatStateSet(\"tapa_fondo_tipo\",\"frascos\",true)'>Diseños</button>";
  h+="</div>";

  if(s.tapa_fondo_tipo==='imagen_propia'){
    var src=s._tapaPreview||s.tapa_imagen_url||'';
    h+="<div class='ccm-hint' style='margin-top:.6rem'>Subí tu tapa terminada o una foto de fondo. Sugerido: <b>1240 × 1754 px</b> (hoja A4 vertical).</div>";
    if(src)h+="<div style='width:120px;height:170px;border-radius:9px;overflow:hidden;border:1px solid #e8d9bf;margin:.45rem 0'><img src='"+src+"' style='width:100%;height:100%;object-fit:cover;display:block'></div>";
    h+="<input type='file' accept='image/*' onchange='_catCatTapaFile(this)' style='font-size:.78rem;color:#5a4a30'>";
  } else if(s.tapa_fondo_tipo==='galeria'){
    h+="<div class='ccm-hint' style='margin-top:.6rem'>Fondos de uso libre cargados por Belle.</div>";
    h+="<div style='display:flex;gap:.45rem;flex-wrap:wrap;margin-top:.45rem'>";
    galeria.forEach(function(g){
      var sel=(s.tapa_galeria_id===g.id);
      h+="<div onclick='_catCatStateSet(\"tapa_galeria_id\",\""+g.id+"\",true)' title='"+_catEsc(g.nombre||'')+"' style='cursor:pointer;border:2px solid "+(sel?'#a9763f':'transparent')+";border-radius:9px;padding:1px'>";
      h+="<div style='width:66px;height:93px;border-radius:7px;overflow:hidden;background:#efe7d8'><img src='"+_catEsc(g.url||'')+"' style='width:100%;height:100%;object-fit:cover;display:block'></div></div>";
    });
    h+="</div>";
  } else {
    var grupos={};
    _catTapaFondos().forEach(function(f){ (grupos[f.g]=grupos[f.g]||[]).push(f); });
    Object.keys(grupos).forEach(function(g){
      h+="<label class='ccm-lbl'>"+g+"</label><div style='display:flex;gap:.45rem;flex-wrap:wrap'>";
      grupos[g].forEach(function(f){
        var sel=(s.tapa_fondo_tipo===f.id);
        h+="<div onclick='_catCatStateSet(\"tapa_fondo_tipo\",\""+f.id+"\",true)' style='cursor:pointer;text-align:center;border:2px solid "+(sel?'#a9763f':'transparent')+";border-radius:9px;padding:2px'>";
        h+=_catCatTapaMiniHTML(f.id,62);
        h+="<div style='font-size:.6rem;color:"+(sel?'#a9763f':'#a2926f')+";font-weight:700;margin-top:.15rem'>"+f.n+"</div></div>";
      });
      h+="</div>";
    });
  }

  h+="<label class='ccm-lbl'>Colores de la tapa</label>";
  h+="<div style='display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:.5rem'>";
  _catTapaPaletas().forEach(function(pl,i){
    var sel=(String(s.tapa_c1||'').toLowerCase()===pl.c1.toLowerCase() && String(s.tapa_c2||'').toLowerCase()===pl.c2.toLowerCase());
    h+="<div onclick='_catCatTapaPaleta("+i+")' title='"+pl.n+"' style='cursor:pointer;width:38px;height:26px;border-radius:7px;overflow:hidden;border:2px solid "+(sel?'#a9763f':'#e6ddcb');
    h+=";display:flex'><span style='flex:2;background:"+pl.c1+"'></span><span style='flex:1;background:"+pl.c2+"'></span></div>";
  });
  h+="</div>";
  h+="<div style='display:flex;align-items:center;gap:1rem;flex-wrap:wrap'>";
  h+="<label style='font-size:.72rem;color:#7a6a50'>Base <input type='color' value='"+(s.tapa_c1||'#141414')+"' oninput='_catCatStateSet(\"tapa_c1\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
  h+="<label style='font-size:.72rem;color:#7a6a50'>Detalle <input type='color' value='"+(s.tapa_c2||'#c9a227')+"' oninput='_catCatStateSet(\"tapa_c2\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
  h+="<label style='font-size:.72rem;color:#7a6a50'>Letra <input type='color' value='"+(s.tapa_color_texto||'#ffffff')+"' oninput='_catCatStateSet(\"tapa_color_texto\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
  h+="</div>";

  h+="<label class='ccm-lbl'>Oscurecer el fondo (para que se lea el texto)</label>";
  h+="<input type='range' min='0' max='75' step='5' value='"+(parseInt(s.tapa_overlay)||0)+"' oninput='_catCatStateSet(\"tapa_overlay\",this.value)' style='width:100%;accent-color:#c4965a'>";
  return h;
}
function _catCatTapaPaleta(i){
  var s=_catCatModalState; if(!s)return;
  var pl=_catTapaPaletas()[i]; if(!pl)return;
  s.tapa_c1=pl.c1; s.tapa_c2=pl.c2; s.tapa_color_texto=pl.tx;
  _catCatRenderSecs(); _catCatPreviewNow();
}
function _catCatSecTapaTextos(){
  var s=_catCatModalState;
  var h="<label class='ccm-lbl'>Antetítulo (chiquito, arriba)</label>";
  h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.tapa_epigrafe||'')+"' placeholder='Ej: Colección 2026' oninput='_catCatStateSet(\"tapa_epigrafe\",this.value)'>";
  h+="<label class='ccm-lbl'>Título</label>";
  h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.tapa_titulo||'')+"' placeholder='"+_catEsc(s.nombre||'El nombre de tu perfumería')+"' oninput='_catCatStateSet(\"tapa_titulo\",this.value)'>";
  h+="<label class='ccm-lbl'>Subtítulo</label>";
  h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.tapa_subtitulo||'')+"' placeholder='Ej: Perfumes árabes y de diseñador' oninput='_catCatStateSet(\"tapa_subtitulo\",this.value)'>";
  h+="<label class='ccm-lbl'>Tamaño del título</label>"+_catCatChips('tapa_titulo_tam',[['chico','Chico'],['normal','Normal'],['grande','Grande']],true);
  h+="<div style='height:.3rem'></div>"+_catCatSw('tapa_mayusculas','Título en MAYÚSCULAS');
  h+="<label class='ccm-lbl'>Dónde va el texto</label>";
  h+=_catCatChips('tapa_layout',[['centrado','Al medio'],['superior','Arriba'],['inferior','Abajo'],['banda','En una franja'],['marco','En un recuadro']],true);
  h+="<div style='height:.3rem'></div>"+_catCatSw('tapa_marco','Marco fino en la tapa');
  return h;
}
function _catCatSecTapaPie(){
  var s=_catCatModalState;
  var h="<div class='ccm-hint'>Tu logo y una franja abajo, para que la tapa quede con tu marca.</div>";
  h+="<label class='ccm-lbl'>Logo</label>"+_catCatChips('tapa_logo_pos',[['abajo','Abajo'],['arriba','Arriba'],['ninguno','Sin logo']],true);
  if((s.tapa_logo_pos||'abajo')!=='ninguno'){
    var src=s._logoPreview||s.tapa_logo_url||'';
    h+="<div class='ccm-hint' style='margin-top:.5rem'>Si el logo viene con fondo blanco, se lo sacamos solo. Mejor si es PNG con fondo transparente.</div>";
    if(src)h+="<div style='margin:.45rem 0;padding:.5rem;border:1px solid #e8d9bf;border-radius:9px;background:"+(s.tapa_c1||'#141414')+";display:inline-block'><img src='"+src+"' style='max-width:110px;max-height:70px;display:block'></div>";
    h+="<div><input type='file' accept='image/*' onchange='_catCatLogoFile(this)' style='font-size:.78rem;color:#5a4a30'></div>";
    h+="<label class='ccm-lbl'>Tamaño del logo</label>"+_catCatChips('tapa_logo_tam',[['chico','Chico'],['normal','Normal'],['grande','Grande']],true);
  }
  h+="<label class='ccm-lbl'>Franja de abajo</label>";
  h+=_catCatChips('tapa_pie_modo',[['ninguno','Ninguna'],['texto','Solo texto'],['barra','Franja de color']],true);
  if((s.tapa_pie_modo||'ninguno')!=='ninguno'){
    h+="<input type='text' class='ccm-inp' style='margin-top:.5rem' value='"+_catEsc(s.tapa_pie_texto||'')+"' placeholder='Si lo dejás vacío usa tu contacto' oninput='_catCatStateSet(\"tapa_pie_texto\",this.value)'>";
    if(s.tapa_pie_modo==='barra'){
      h+="<div style='display:flex;gap:1.2rem;align-items:center;margin-top:.5rem'>";
      h+="<label style='font-size:.72rem;color:#7a6a50'>Fondo <input type='color' value='"+(s.tapa_pie_bg||'#141414')+"' oninput='_catCatStateSet(\"tapa_pie_bg\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
      h+="<label style='font-size:.72rem;color:#7a6a50'>Letra <input type='color' value='"+(s.tapa_pie_fg||'#ffffff')+"' oninput='_catCatStateSet(\"tapa_pie_fg\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
      h+="</div>";
    }
  }
  return h;
}
function _catCatTapaFile(input){
  var f=input&&input.files&&input.files[0]; if(!f)return;
  if(f.size>6*1024*1024){ _catToast('La imagen es muy grande (máx 6MB)','twarn'); input.value=''; return; }
  var s=_catCatModalState; s._tapaFile=f;
  try{ if(s._tapaPreviewObj)URL.revokeObjectURL(s._tapaPreviewObj); }catch(e){}
  s._tapaPreviewObj=URL.createObjectURL(f); s._tapaPreview=s._tapaPreviewObj;
  _catCatRenderSecs(); _catCatPreviewNow();
}
function _catCatLogoFile(input){
  var f=input&&input.files&&input.files[0]; if(!f)return;
  if(f.size>4*1024*1024){ _catToast('El logo es muy grande (máx 4MB)','twarn'); input.value=''; return; }
  var s=_catCatModalState; s._logoFile=f;
  try{ if(s._logoPreviewObj)URL.revokeObjectURL(s._logoPreviewObj); }catch(e){}
  s._logoPreviewObj=URL.createObjectURL(f); s._logoPreview=s._logoPreviewObj;
  _catCatRenderSecs(); _catCatPreviewNow();
}

// ── secciones (acordeón) ──────────────────────────────────────────
function _catCatSecs(){
  var s=_catCatModalState||{}, cfg=_catCatConfig||{};
  var tpl=_catTplDef(s.plantilla);
  var dens={comoda:'Espaciado',normal:'Normal',compacta:'Compacto'}[s.densidad||'normal'];
  var tipo={clasica:'Clásica',moderna:'Moderna',elegante:'Elegante'}[s.tipografia||'elegante'];
  var port={ninguna:'Sin banner',banner:'Banner arriba'}[s.portada_modo||'banner'];
  var pm={x1:'Precio de lista Belle',sugerido:'Sugerido',manual:'Tus precios',sinprecio:'Sin precios'}[s.precio_modo||'x1'];
  var muestro=[]; if(s.mostrar_notas!==false)muestro.push('notas'); if(s.mostrar_acordes!==false)muestro.push('acordes'); if(s.mostrar_marca!==false)muestro.push('marca');
  var secs=[];
  if(s.tapa_on){
    var fondoNom;
    if(s.tapa_fondo_tipo==='imagen_propia')fondoNom='Mi imagen';
    else if(s.tapa_fondo_tipo==='galeria')fondoNom='Galería Belle';
    else { var fd=_catTapaFondos().filter(function(f){return f.id===s.tapa_fondo_tipo;})[0]; fondoNom=fd?fd.n:'Diseño'; }
    var layNom={centrado:'Texto al medio',superior:'Texto arriba',inferior:'Texto abajo',banda:'Texto en franja',marco:'Texto en recuadro'}[s.tapa_layout||'centrado'];
    var pieNom=(s.tapa_logo_pos!=='ninguno'&&(s.tapa_logo_url||s._logoPreview))?'con logo':'sin logo';
    pieNom+=' · '+{ninguno:'sin franja',texto:'texto abajo',barra:'franja de color'}[s.tapa_pie_modo||'ninguno'];
    secs.push({t:'Tapa · Fondo',      v:fondoNom, pv:'tapa', body:_catCatSecTapaFondo});
    secs.push({t:'Tapa · Textos',     v:layNom,   pv:'tapa', body:_catCatSecTapaTextos});
    secs.push({t:'Tapa · Logo y pie', v:pieNom,   pv:'tapa', body:_catCatSecTapaPie});
  } else {
    secs.push({t:'Arriba de la 1ª hoja', v:port, pv:'hoja', body:_catCatSecPortada});
  }
  secs=secs.concat([
    {t:'Plantilla',  v:tpl.nombre+' · '+dens+' · '+tipo, pv:'hoja', body:_catCatSecPlantilla},
    {t:'Encabezado de hojas', v:{none:'Sin encabezado',texto:'Texto',imagen:'Imagen'}[s.hoja_modo||'none'], pv:'hoja2', body:_catCatSecHoja},
    {t:'Precios',    v:pm,    pv:'hoja', body:_catCatSecPrecios},
    {t:'Qué mostrar',v:muestro.length?muestro.join(', '):'solo lo básico', pv:'hoja', body:_catCatSecMostrar},
    {t:'Colores',    v:'',    pv:'hoja', body:_catCatSecColores},
    {t:'Tu contacto',v:(s.incluir_contacto?'Sí, en el pie':'No'), pv:'hoja', body:_catCatSecContacto}
  ]);
  if(cfg.permitir_contacto_pie===false)secs.pop();
  return secs;
}
function _catCatRenderTapaSw(){
  var box=document.getElementById('_ccmTapaSw'); if(!box)return;
  var s=_catCatModalState||{}, on=!!s.tapa_on;
  var h="<div class='ccm-seg'>";
  h+="<button type='button' class='ccm-segb"+(on?' on':'')+"' onclick='_catCatTapaOn(true)'>CON TAPA</button>";
  h+="<button type='button' class='ccm-segb"+(!on?' on':'')+"' onclick='_catCatTapaOn(false)'>SIN TAPA</button>";
  h+="</div>";
  h+="<div class='ccm-hint' style='text-align:center;margin-top:.35rem'>"+(on?'El catálogo arranca con una hoja de tapa que armás vos.':'El catálogo arranca directo con los perfumes.')+"</div>";
  box.innerHTML=h;
}
function _catCatRenderSecs(){
  var box=document.getElementById('_ccmSecs'); if(!box)return;
  _catCatRenderTapaSw();
  var s=_catCatModalState, secs=_catCatSecs(), h="";
  secs.forEach(function(sec,i){
    var open=(s._sec===i);
    h+="<div class='ccm-sec"+(open?' open':'')+"' id='_ccmSec"+i+"'>";
    h+="<div class='ccm-secH' onclick='_catCatSecTog("+i+")'><span class='ccm-secT'>"+sec.t+"</span><span class='ccm-secV'>"+_catEsc(sec.v||'')+"</span><span class='ccm-secA'>&#9656;</span></div>";
    h+="<div class='ccm-secB'>"+(open?sec.body():"")+"</div>";
    h+="</div>";
  });
  box.innerHTML=h;
  if(typeof _catCatRenderPastels==='function')_catCatRenderPastels();
}
function _catCatSecTog(i){
  var s=_catCatModalState; if(!s)return;
  var abriendo=(s._sec!==i);
  s._sec=abriendo?i:-1;
  // La vista previa sigue a lo que estás editando: si abrís una sección de la
  // tapa muestra la tapa, y si abrís una del catálogo salta a la hoja 1.
  if(abriendo){
    var sec=_catCatSecs()[i];
    if(sec && sec.pv) _catCatPrevIr(sec.pv);
  }
  _catCatRenderSecs();
  _catCatPreviewNow();
}
// Lleva la vista previa a la tapa ('tapa'), a la primera hoja de productos
// ('hoja') o a la segunda ('hoja2', para ver el cintillo de las hojas siguientes).
function _catCatPrevIr(tipo){
  var s=_catCatModalState; if(!s)return;
  var pags=_catCatPrevPaginas(), i;
  if(tipo==='tapa'){
    for(i=0;i<pags.length;i++){ if(pags[i].tipo==='portada'){ s._prevPage=i; return; } }
    s._prevPage=0; return;
  }
  var hojas=[];
  for(i=0;i<pags.length;i++){ if(pags[i].tipo==='hoja')hojas.push(i); }
  if(!hojas.length){ s._prevPage=0; return; }
  if(tipo==='hoja2' && hojas.length>1){ s._prevPage=hojas[1]; return; }
  s._prevPage=hojas[0];
}
function _catCatPrevTipoActual(){
  var s=_catCatModalState; if(!s)return 'hoja';
  var pags=_catCatPrevPaginas(), p=pags[s._prevPage||0];
  return (p && p.tipo==='portada')?'tapa':'hoja';
}

function _catCatChips(campo, opciones, extraJS){
  var s=_catCatModalState||{};
  var h="<div class='ccm-chips'>";
  opciones.forEach(function(o){
    var on=(s[campo]===o[0]);
    h+="<button type='button' class='ccm-chip"+(on?' on':'')+"' onclick='_catCatStateSet(\""+campo+"\",\""+o[0]+"\""+(extraJS?",true":"")+")'>"+o[1]+"</button>";
  });
  return h+"</div>";
}
function _catCatSw(campo,label,hint){
  var s=_catCatModalState||{};
  var on=(s[campo]!==false && s[campo]!=null)?!!s[campo]:false;
  return "<label class='ccm-sw'><span style='flex:1'>"+label+(hint?("<span style='display:block;font-size:.64rem;color:#a89880;font-weight:400'>"+hint+"</span>"):"")+"</span><input type='checkbox' "+(on?'checked':'')+" onchange='_catCatStateSet(\""+campo+"\",this.checked,true)'></label>";
}

function _catCatMiniTpl(id){
  // dibujito chiquito que insinúa el layout de cada plantilla
  var b="background:#e2d2b4";
  if(id==='tabla')     return "<div class='ccm-mini' style='flex-direction:column;gap:3px'><i style='height:5px;width:100%;"+b+"'></i><i style='height:5px;width:100%;"+b+"'></i><i style='height:5px;width:100%;"+b+"'></i><i style='height:5px;width:70%;"+b+"'></i></div>";
  if(id==='editorial') return "<div class='ccm-mini'><i style='width:26%;height:100%;"+b+"'></i><div style='flex:1;display:flex;flex-direction:column;gap:3px;justify-content:center'><i style='height:6px;width:80%;"+b+"'></i><i style='height:4px;width:55%;"+b+"'></i></div></div>";
  if(id==='revista')   return "<div class='ccm-mini' style='gap:3px'><i style='flex:1;height:100%;"+b+"'></i><i style='flex:1;height:100%;"+b+"'></i></div>";
  if(id==='galeria')   return "<div class='ccm-mini' style='gap:2px'><i style='flex:1;height:100%;"+b+"'></i><i style='flex:1;height:100%;"+b+"'></i><i style='flex:1;height:100%;"+b+"'></i></div>";
  return "<div class='ccm-mini' style='gap:6px'><div style='flex:1;display:flex;flex-direction:column;gap:3px'><i style='height:4px;"+b+"'></i><i style='height:4px;"+b+"'></i><i style='height:4px;"+b+"'></i></div><div style='flex:1;display:flex;flex-direction:column;gap:3px'><i style='height:4px;"+b+"'></i><i style='height:4px;"+b+"'></i><i style='height:4px;"+b+"'></i></div></div>";
}
function _catCatSecPlantilla(){
  var s=_catCatModalState;
  var h="<div class='ccm-hint' style='margin-bottom:.5rem'>El corazón del catálogo: cómo se acomodan los perfumes en cada hoja.</div>";
  h+="<div class='ccm-tplgrid'>";
  _catTplHabilitadas().forEach(function(t){
    var on=(s.plantilla===t.id);
    h+="<div class='ccm-tpl"+(on?' on':'')+"' onclick='_catCatStateSet(\"plantilla\",\""+t.id+"\",true)'>"+_catCatMiniTpl(t.id);
    h+="<div class='ccm-tplT'><span style='color:#c4965a'>"+t.icon+"</span><span class='ccm-tplN'>"+t.nombre+"</span></div>";
    h+="<div class='ccm-tplD'>"+t.desc+"</div></div>";
  });
  h+="</div>";
  h+="<label class='ccm-lbl'>Cuántos entran por hoja</label>";
  h+=_catCatChips('densidad',[['comoda','Espaciado'],['normal','Normal'],['compacta','Compacto']],true);
  h+="<label class='ccm-lbl'>Tipografía</label>";
  h+=_catCatChips('tipografia',[['elegante','Elegante'],['clasica','Clásica'],['moderna','Moderna']],true);
  return h;
}
function _catCatSecPortada(){
  var s=_catCatModalState;
  var h="<div class='ccm-hint'>Sin tapa, el catálogo arranca directo con el listado. Podés ponerle un banner arriba de la primera hoja.</div>";
  h+=_catCatChips('portada_modo',[['banner','Banner arriba'],['ninguna','Sin banner']],true);
  if((s.portada_modo||'banner')!=='ninguna'){
    h+="<label class='ccm-lbl'>Estilo de la portada</label>";
    h+="<div class='ccm-chips'>";
    [['default','Texto'],['preset','Prediseñado'],['imagen','Mi imagen']].forEach(function(o){
      var on=(s.banner_modo===o[0]);
      h+="<button type='button' class='ccm-chip"+(on?' on':'')+"' onclick='_catCatBannerModo(\""+o[0]+"\")'>"+o[1]+"</button>";
    });
    h+="</div><div id='_catCatBannerFields' style='margin-top:.55rem'></div>";
  }
  setTimeout(_catCatRenderBannerFields,0);
  return h;
}
function _catCatSecHoja(){
  var h="<div class='ccm-hint'>Una franja finita arriba de la 2ª hoja en adelante, para que tu marca esté siempre presente.</div>";
  h+="<div class='ccm-chips'>";
  var s=_catCatModalState;
  [['none','Ninguno'],['texto','Texto'],['imagen','Imagen']].forEach(function(o){
    var on=((s.hoja_modo||'none')===o[0]);
    h+="<button type='button' class='ccm-chip"+(on?' on':'')+"' onclick='_catCatHojaModo(\""+o[0]+"\")'>"+o[1]+"</button>";
  });
  h+="</div><div id='_catCatHojaFields' style='margin-top:.55rem'></div>";
  setTimeout(_catCatRenderHojaFields,0);
  return h;
}
function _catCatSecPrecios(){
  var s=_catCatModalState, cfg=_catCatConfig||{};
  var pModos=[]; if(cfg.modo_x1_habilitado!==false)pModos.push(['x1','Precio de lista Belle']); if(cfg.modo_sugerido_habilitado!==false)pModos.push(['sugerido','Precio sugerido']); if(cfg.modo_manual_habilitado!==false)pModos.push(['manual','Tus precios']); pModos.push(['sinprecio','Sin precios']);
  var h=_catCatChips('precio_modo',pModos,true);
  h+="<div style='font-size:.7rem;color:#7a6a50;background:#faf6ee;border:1px solid #f0e7d6;border-radius:9px;padding:.5rem .65rem;margin-top:.5rem;line-height:1.4'>"+_catCatPmDescTxt(s.precio_modo)+"</div>";
  h+="<label class='ccm-lbl'>Cómo se ve el precio</label>";
  h+=_catCatChips('precio_estilo',[['plano','Simple'],['pastilla','Pastilla'],['borde','Con borde']],true);
  h+="<div class='ccm-hint' style='margin-top:.5rem'>Los precios de cada perfume los ajustás en <b>Productos y precios</b>, donde también podés subirlos por porcentaje.</div>";
  return h;
}
function _catCatSecMostrar(){
  var s=_catCatModalState, cfg=_catCatConfig||{};
  var h="";
  h+=_catCatSw('mostrar_marca','Marca del perfume');
  h+=_catCatSw('mostrar_meta','Mililitros y concentración');
  h+=_catCatSw('mostrar_notas','Notas olfativas');
  if(s.mostrar_notas!==false){
    var nModos=[]; if(cfg.notas_fotos_habilitado!==false)nModos.push(['fotos','Con fotitos']); if(cfg.notas_escritas_habilitado!==false)nModos.push(['escritas','Escritas']);
    if(nModos.length>1){
      h+="<label class='ccm-lbl'>Cómo mostrar las notas</label>"+_catCatChips('notas_modo',nModos,true);
      if(s.notas_modo==='fotos')h+="<div style='font-size:.65rem;color:#9a7d4e;background:#fbf3e3;border:1px solid #ecdcc0;border-radius:8px;padding:.4rem .55rem;margin-top:.4rem;line-height:1.35'>&#9203; Con fotitos el catálogo tarda un poco más en generarse.</div>";
    }
  }
  h+="<div style='height:.4rem'></div>";
  h+=_catCatSw('mostrar_acordes','Acordes de color');
  h+=_catCatSw('mostrar_numeracion','Numerar los perfumes');
  h+=_catCatSw('mostrar_paginas','Pie con número de hoja');
  h+=_catCatSw('borde_hoja','Marco fino en cada hoja');
  return h;
}
function _catCatSecColores(){
  var s=_catCatModalState;
  var h="<div class='ccm-hint'>Elegí un fondo y te sugerimos el color del precio (después lo podés cambiar).</div>";
  h+="<div id='_catCatPastelGrid' style='display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0 .6rem'></div>";
  h+="<div style='display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap'>";
  h+="<label style='font-size:.74rem;color:#7a6a50'>Color del precio <input type='color' id='_catCatPrecioColor' value='"+(s.precio_color||'#a9763f')+"' oninput='_catCatStateSet(\"precio_color\",this.value)' style='width:42px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
  h+="<label style='font-size:.74rem;color:#7a6a50'>Fondo <input type='color' id='_catCatBgColor' value='"+(s.cat_bg||'#fdfbf7')+"' oninput='_catCatStateSet(\"cat_bg\",this.value)' style='width:42px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
  h+="</div>";
  setTimeout(_catCatRenderPastels,0);
  return h;
}
function _catCatSecContacto(){
  var s=_catCatModalState;
  var h=_catCatSw('incluir_contacto','Incluir mi contacto en el pie');
  h+="<div id='_catCatContactoFields' style='display:"+(s.incluir_contacto?'block':'none')+";margin-top:.5rem'>";
  h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.contacto_nombre||'')+"' placeholder='Nombre o comercio (opcional)' oninput='_catCatStateSet(\"contacto_nombre\",this.value)' style='margin-bottom:.4rem'>";
  h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.contacto_telefono||'')+"' placeholder='"+_catEsc((_catCliente&&_catCliente.telefono_principal)||'Tu teléfono / WhatsApp')+"' oninput='_catCatStateSet(\"contacto_telefono\",this.value)' style='margin-bottom:.4rem'>";
  h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.contacto_nota||'')+"' placeholder='Nota (opcional). Ej: Envíos a todo el país' oninput='_catCatStateSet(\"contacto_nota\",this.value)'>";
  h+="</div>";
  return h;
}

function _catCatPmDescTxt(m){
  if(m==='x1')return "<b>Precio de lista Belle:</b> mostrás el precio de lista de Belle, tal cual.";
  if(m==='sugerido')return "<b>Precio sugerido:</b> Belle te sugiere un precio de venta con tu ganancia ya incluida y redondeado prolijo.";
  if(m==='manual')return "<b>Poné tus precios:</b> vos ponés el precio de cada perfume, a tu gusto.";
  if(m==='sinprecio')return "<b>Sin precios:</b> el catálogo muestra los productos sin ningún precio. Ideal para catálogos solo informativos.";
  return "";
}
function _catCatStateSet(k,v,rerender){
  if(!_catCatModalState)return;
  _catCatModalState[k]=v;
  // Si tocás algo de la tapa, la vista previa se va a la tapa; si tocás algo del
  // catálogo, vuelve a las hojas de productos. (Si ya estás mirando la hoja
  // correcta no se mueve, así podés seguir en la hoja 2 o 3 si la elegiste.)
  var esTapa=(String(k).indexOf('tapa_')===0);
  var actual=_catCatPrevTipoActual();
  if(esTapa && actual!=='tapa') _catCatPrevIr('tapa');
  else if(!esTapa && actual==='tapa' && k!=='nombre') _catCatPrevIr('hoja');
  if(k==='incluir_contacto'){ var cf=document.getElementById('_catCatContactoFields'); if(cf)cf.style.display=v?'block':'none'; }
  if(k==='cat_bg'||k==='precio_color'){ if(typeof _catCatRenderPastels==='function')_catCatRenderPastels(); }
  if(rerender)_catCatRenderSecs();
  _catCatPreviewUpdate();
}
function _catCatBannerModo(m){
  if(!_catCatModalState)return;
  _catCatModalState.banner_modo=m;
  _catCatRenderSecs();
  _catCatPreviewUpdate();
}
function _catCatPickPreset(id){ if(!_catCatModalState)return; _catCatModalState.banner_preset_id=id; _catCatRenderBannerFields(); _catCatPreviewUpdate(); }
function _catCatRenderPastels(){
  var box=document.getElementById('_catCatPastelGrid'); if(!box)return;
  var s=_catCatModalState, arr=_catCatPastels(), h="";
  arr.forEach(function(p,i){
    var sel=(String(s.cat_bg||'').toLowerCase()===p.bg.toLowerCase());
    h+="<div onclick='_catCatPickPastel("+i+")' style='width:34px;height:34px;border-radius:9px;cursor:pointer;background:"+p.bg+";border:2px solid "+(sel?p.ac:'#e6ddcb')+";display:flex;align-items:center;justify-content:center'><span style='width:12px;height:12px;border-radius:50%;background:"+p.ac+"'></span></div>";
  });
  box.innerHTML=h;
}
function _catCatPickPastel(i){
  var s=_catCatModalState; if(!s)return; var p=_catCatPastels()[i]; if(!p)return;
  s.cat_bg=p.bg; s.precio_color=p.ac;
  var pc=document.getElementById('_catCatPrecioColor'); if(pc)pc.value=p.ac;
  var bc=document.getElementById('_catCatBgColor'); if(bc)bc.value=p.bg;
  _catCatRenderPastels(); _catCatPreviewUpdate();
}
function _catCatBannerFile(input){
  var f=input&&input.files&&input.files[0]; if(!f)return;
  if(f.size>5*1024*1024){ _catToast('La imagen es muy grande (máx 5MB)','twarn'); input.value=''; return; }
  _catCatModalState._file=f;
  try{ if(_catCatModalState._imgPreviewObj)URL.revokeObjectURL(_catCatModalState._imgPreviewObj); }catch(e){}
  _catCatModalState._imgPreviewObj=URL.createObjectURL(f);
  _catCatModalState._imgPreview=_catCatModalState._imgPreviewObj;
  _catCatRenderBannerFields();
  _catCatPreviewUpdate();
}
function _catCatRenderBannerFields(){
  var box=document.getElementById('_catCatBannerFields'); if(!box)return;
  var s=_catCatModalState, cfg=_catCatConfig||{};
  var h="";
  if(s.banner_modo==='imagen'){
    var src=s._imgPreview||s.banner_imagen_url||'';
    h+="<div class='ccm-hint'>Subí la imagen de tu comercio. Resolución sugerida: <b>"+_catEsc(cfg.resolucion_banner_sugerida||'1200 × 400 px')+"</b>.</div>";
    if(src)h+="<div style='width:100%;height:70px;border-radius:9px;overflow:hidden;border:1px solid #e8d9bf;margin:.4rem 0'><img src='"+src+"' style='width:100%;height:100%;object-fit:cover;display:block'></div>";
    h+="<input type='file' accept='image/*' onchange='_catCatBannerFile(this)' style='font-size:.78rem;color:#5a4a30'>";
    h+="<label class='ccm-lbl'>Texto (se usa si la imagen no carga)</label>";
    h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.banner_texto1||'')+"' placeholder='Tu perfumería' oninput='_catCatStateSet(\"banner_texto1\",this.value)'>";
  } else if(s.banner_modo==='preset'){
    var presets=Array.isArray(cfg.banner_presets)?cfg.banner_presets:[];
    if(!presets.length){ h+="<div class='ccm-hint'>No hay estilos prediseñados disponibles. Usá Texto o Mi imagen.</div>"; }
    else {
      h+="<div class='ccm-hint'>Elegí un estilo:</div><div style='display:flex;gap:.4rem;flex-wrap:wrap;margin:.4rem 0 .55rem'>";
      presets.forEach(function(p){
        var sel=(s.banner_preset_id===p.id);
        h+="<div onclick='_catCatPickPreset(\""+p.id+"\")' style='cursor:pointer;border:2px solid "+(sel?'#a9763f':'transparent')+";border-radius:9px;padding:1px'>";
        h+="<div style='width:84px;height:38px;border-radius:7px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:.55rem;font-weight:700;overflow:hidden;background:"+(p.bg||'#1a1a1a')+";color:"+(p.fg||'#fff')+"'>"+_catEsc(p.nombre||'')+"</div></div>";
      });
      h+="</div>";
    }
    h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.banner_texto1||'')+"' placeholder='Tu perfumería (renglón 1)' oninput='_catCatStateSet(\"banner_texto1\",this.value)' style='margin-bottom:.4rem'>";
    h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.banner_texto2||'')+"' placeholder='Renglón 2 (opcional)' oninput='_catCatStateSet(\"banner_texto2\",this.value)'>";
  } else {
    h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.banner_texto1||'')+"' placeholder='Texto (renglón 1)' oninput='_catCatStateSet(\"banner_texto1\",this.value)' style='margin-bottom:.4rem'>";
    h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.banner_texto2||'')+"' placeholder='Renglón 2 (opcional)' oninput='_catCatStateSet(\"banner_texto2\",this.value)' style='margin-bottom:.5rem'>";
    h+="<div style='display:flex;gap:1.2rem;align-items:center'>";
    h+="<label style='font-size:.72rem;color:#7a6a50'>Fondo <input type='color' value='"+(s.banner_bg||'#1a1a1a')+"' oninput='_catCatStateSet(\"banner_bg\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
    h+="<label style='font-size:.72rem;color:#7a6a50'>Letra <input type='color' value='"+(s.banner_fg||'#ffffff')+"' oninput='_catCatStateSet(\"banner_fg\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
    h+="</div>";
  }
  box.innerHTML=h;
}
function _catCatHojaModo(m){
  if(!_catCatModalState)return;
  _catCatModalState.hoja_modo=m;
  _catCatRenderSecs();
  _catCatPreviewUpdate();
}
function _catCatHojaFile(input){
  var f=input&&input.files&&input.files[0]; if(!f)return;
  if(f.size>5*1024*1024){ _catToast('La imagen es muy grande (máx 5MB)','twarn'); input.value=''; return; }
  _catCatModalState._hojaFile=f;
  try{ if(_catCatModalState._hojaPreviewObj)URL.revokeObjectURL(_catCatModalState._hojaPreviewObj); }catch(e){}
  _catCatModalState._hojaPreviewObj=URL.createObjectURL(f);
  _catCatModalState._hojaPreview=_catCatModalState._hojaPreviewObj;
  _catCatRenderHojaFields();
  _catCatPreviewUpdate();
}
function _catCatRenderHojaFields(){
  var box=document.getElementById('_catCatHojaFields'); if(!box)return;
  var s=_catCatModalState, modo=s.hoja_modo||'none', h="";
  if(modo==='none'){
    h="<div class='ccm-hint'>Las hojas siguientes salen sin encabezado.</div>";
  } else if(modo==='imagen'){
    var src=s._hojaPreview||s.hoja_imagen_url||'';
    h+="<div class='ccm-hint'>Subí una imagen apaisada y finita (tipo cintillo). Sugerido: <b>1200 × 200 px</b>.</div>";
    if(src)h+="<div style='width:100%;height:46px;border-radius:9px;overflow:hidden;border:1px solid #e8d9bf;margin:.4rem 0'><img src='"+src+"' style='width:100%;height:100%;object-fit:cover;display:block'></div>";
    h+="<input type='file' accept='image/*' onchange='_catCatHojaFile(this)' style='font-size:.78rem;color:#5a4a30'>";
  } else {
    h+="<input type='text' class='ccm-inp' value='"+_catEsc(s.hoja_texto||'')+"' placeholder='Texto del encabezado (ej: Tu Perfumería)' oninput='_catCatStateSet(\"hoja_texto\",this.value)' style='margin-bottom:.5rem'>";
    h+="<div style='display:flex;gap:1.2rem;align-items:center'>";
    h+="<label style='font-size:.72rem;color:#7a6a50'>Fondo <input type='color' value='"+(s.hoja_bg||'#1a1a1a')+"' oninput='_catCatStateSet(\"hoja_bg\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
    h+="<label style='font-size:.72rem;color:#7a6a50'>Letra <input type='color' value='"+(s.hoja_fg||'#ffffff')+"' oninput='_catCatStateSet(\"hoja_fg\",this.value)' style='width:38px;height:30px;vertical-align:middle;border:1px solid #e0d4bf;border-radius:5px;cursor:pointer'></label>";
    h+="</div>";
  }
  box.innerHTML=h;
}

// ── VISTA PREVIA FIEL ─────────────────────────────────────────────
// Dibuja la MISMA hoja que sale en el PDF, escalada al ancho del panel.
function _catCatPreviewCargarItems(cb){
  var s=_catCatModalState; if(!s){ cb&&cb(); return; }
  var perfumes=(allProds||[]).filter(function(p){return p.tipo==='perfume';});
  function armarDemo(){
    var cfg=_catCatConfig||{};
    var rows=perfumes.slice(0,40).map(function(p){
      var pr=null;
      if(s.precio_modo==='sinprecio')pr=null;
      else if(s.precio_modo==='sugerido')pr=_catCatPrecioSugerido(p.precio_min_ars,cfg);
      else pr=p.precio_min_ars||0;
      return {producto_id:p.id, precio:pr};
    });
    s._items=_catCatItemsDe(rows); s._demo=true;
  }
  if(!s.id){ armarDemo(); _catCatPdfEnsureNotas(function(){ cb&&cb(); }); return; }
  apiGet('catalogos_cliente_productos','select=producto_id,precio,orden&catalogo_id=eq.'+s.id+'&order=orden.asc&limit=60').then(function(rows){
    rows=Array.isArray(rows)?rows:[];
    if(rows.length){ s._items=_catCatItemsDe(rows); s._demo=false; }
    else armarDemo();
    _catCatPdfEnsureNotas(function(){ cb&&cb(); });
  }).catch(function(){ armarDemo(); _catCatPdfEnsureNotas(function(){ cb&&cb(); }); });
}
function _catCatPrevPaginas(){
  var s=_catCatModalState; if(!s)return [];
  var cfg=_catCatClamp(Object.assign({},s));
  var items=s._items||[];
  var pp=_catTplPerPage(cfg);
  var out=[];
  if(cfg.tapa_on) out.push({tipo:'portada', label:'Tapa'});
  var off=0, n=1;
  while(off<items.length && out.length<4){
    var cap=(n===1)?pp[0]:pp[1];
    out.push({tipo:'hoja', items:items.slice(off,off+cap), first:(n===1), label:'Hoja '+n});
    off+=cap; n++;
  }
  if(!out.length)out.push({tipo:'hoja', items:[], first:true, label:'Hoja 1'});
  return out;
}
// Se llama en cada tecla: la agrupamos para que escribir siga siendo fluido.
var _catPrevT=null;
function _catCatPreviewUpdate(){
  if(_catPrevT)clearTimeout(_catPrevT);
  _catPrevT=setTimeout(function(){ _catPrevT=null; _catCatPreviewNow(); },110);
}
function _catCatPreviewNow(){
  var s=_catCatModalState; if(!s)return;
  var pags=_catCatPrevPaginas();
  if(s._prevPage>=pags.length)s._prevPage=0;
  // botonera de hojas
  var bh="";
  pags.forEach(function(p,i){ bh+="<button class='ccm-pg"+(i===s._prevPage?' on':'')+"' onclick='_catCatPrevPage("+i+")'>"+p.label+"</button>"; });
  ['_ccmPgBtns','_ccmPgBtnsMob'].forEach(function(id){ var bb=document.getElementById(id); if(bb)bb.innerHTML=bh; });
  var zb=document.getElementById('_ccmZoomBtn');
  if(zb)zb.textContent=s._prevZoom?'Achicar':'Agrandar';
  ['_ccmPrevBox','_ccmPrevMobBox'].forEach(function(id){ _catCatPrevPintar(id, pags[s._prevPage], pags.length); });
  var cfgF=_catCatClamp(Object.assign({},s));
  var ppF=_catTplPerPage(cfgF);
  var nprod=(_catCatList.filter(function(x){return x.id===s.id;})[0]||{})._nprod;
  var txt;
  if(s._demo || nprod==null) txt="Ejemplo con perfumes reales. Entran ~"+ppF[1]+" por hoja.";
  else txt=nprod+" perfumes · ~"+ppF[1]+" por hoja · "+Math.max(1,Math.ceil(Math.max(0,nprod-ppF[0])/ppF[1])+1)+" hojas aprox.";
  ['_ccmPrevFoot','_ccmPrevFootMob'].forEach(function(id){ var ft=document.getElementById(id); if(ft)ft.textContent=txt; });
}
function _catCatPrevPage(i){ if(!_catCatModalState)return; _catCatModalState._prevPage=i; _catCatPreviewUpdate(); }
function _catCatPrevZoom(){ if(!_catCatModalState)return; _catCatModalState._prevZoom=!_catCatModalState._prevZoom; _catCatPreviewNow(); }
function _catCatPrevPintar(boxId, pag, totalPags){
  var box=document.getElementById(boxId); if(!box || !pag)return;
  var w=box.clientWidth||box.offsetWidth||0;
  if(w<40){ box.innerHTML=""; return; }   // panel oculto (mobile/desktop según el ancho)
  var s=_catCatModalState;
  // En el celular la hoja va chiquita para no tapar los controles (se agranda con el botón)
  if(boxId==='_ccmPrevMobBox' && !s._prevZoom) w=Math.min(w,236);
  var cfg=_catCatClamp(Object.assign({},s));
  var cat={id:s.id, nombre:s.nombre||'Mi catálogo'};
  var gcfg=_catCatConfig||{};
  var tpl=_catTplDef(cfg.plantilla);
  var pp=_catTplPerPage(cfg);
  var capRows=Math.max(1,Math.ceil((pag.first?pp[0]:pp[1])/(tpl.cols||1)));
  // en la vista previa usamos las URLs directas (nada de dataURL): es instantáneo
  var prevLive=_catImgLive; _catImgLive=true;
  var cfgPrev=Object.assign({},cfg);
  if(cfg.banner_modo==='imagen'){ cfgPrev.banner_imagen_url=s._imgPreview||cfg.banner_imagen_url||''; }
  if(cfg.hoja_modo==='imagen'){ cfgPrev.hoja_imagen_url=s._hojaPreview||cfg.hoja_imagen_url||''; }
  if(cfg.tapa_on){
    if(cfg.tapa_fondo_tipo==='imagen_propia') cfgPrev.tapa_imagen_url=s._tapaPreview||cfg.tapa_imagen_url||'';
    if(s._logoPreview) cfgPrev.tapa_logo_url=s._logoPreview;
  }
  var html;
  if(pag.tipo==='portada') html=_catCatPdfPortadaHTML(cat,cfgPrev,gcfg);
  else html=_catCatPdfPageHTML(cat,cfgPrev,gcfg,pag.items||[],!!pag.first,false,1,Math.max(1,totalPags),capRows);
  _catImgLive=prevLive;
  var k=w/794, hojaH=Math.round(1123*k);
  box.innerHTML="<div class='ccm-stage' style='width:"+w+"px;height:"+hojaH+"px'><div id='_ccmStageIn' style='width:794px;transform:scale("+k+")'>"+html+"</div></div>";
  // Si la hoja creció (plantillas que fluyen), el PDF la achica para que entre:
  // acá hacemos lo mismo para que la vista previa no mienta.
  var inn=document.getElementById('_ccmStageIn');
  if(inn){
    var real=inn.firstChild?inn.firstChild.offsetHeight:1123;
    if(real>1130){
      var k2=Math.min(w/794, hojaH/real);
      inn.style.transform="scale("+k2+")";
      inn.style.marginLeft=Math.max(0,Math.round((w-794*k2)/2))+"px";
    }
  }
  // La vista previa arranca con las fotos tal cual y, apenas se procesan (fondo
  // blanco recortado), se vuelve a dibujar una sola vez: así muestra lo mismo
  // que va a salir en el PDF.
  if(!s._prevCargando){
    var faltan=_catCatImagenes(cfgPrev,(pag.items||[])).filter(function(o){
      return o.fondo && _catImgCache[_catImgKey(o.url,o.fondo)]===undefined;
    });
    if(faltan.length){
      s._prevCargando=true;
      _catImgPreloadAll(faltan,null,function(){ s._prevCargando=false; _catCatPreviewNow(); });
    }
  }
}

// ── guardar / duplicar / borrar ───────────────────────────────────
function _catCatGuardar(){
  var s=_catCatModalState; if(!s)return;
  var nombre=((document.getElementById('_catCatNombre')||{value:''}).value||'').trim()||'Mi catálogo';
  s.nombre=nombre;
  var btn=document.getElementById('_catCatGuardarBtn'); if(btn){btn.disabled=true;btn.textContent='Guardando...';}
  var doSave=function(){
    var config={}, base=_catCatBase();
    _catCatKeys().forEach(function(k){ config[k]=(s[k]!=null)?s[k]:base[k]; });
    var payload={nombre:nombre, config:config, updated_at:new Date().toISOString()};
    var p;
    if(s.id){ p=apiPatch('catalogos_cliente',payload,'id=eq.'+s.id); }
    else { payload.cliente_id=_catCliente.id; p=apiPost('catalogos_cliente',payload); }
    p.then(function(){
      _catToast('Catálogo guardado','tok');
      _catCatCerrarModal();
      _catCargarCatalogos(function(){ if(_catPanelTab==='catalogos'){ var b=document.getElementById('_catTabBody'); if(b)_catRenderTabCatalogos(b); } });
    }).catch(function(e){ console.error('[catcat save]',e); _catToast('No se pudo guardar','twarn'); if(btn){btn.disabled=false;btn.textContent='Guardar diseño';} });
  };
  var _uidOK=(_catSession&&_catSession.user&&_catSession.user.id)||null;
  function _upOne(file,cb){
    if(!_uidOK){ cb(new Error('sesión')); return; }
    var ext=(((file.name||'img').split('.').pop())||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
    var path=_uidOK+'/banner_'+Date.now()+'_'+Math.random().toString(36).slice(2,7)+'.'+ext;
    _sbAuth.storage.from('catalogos-clientes').upload(path,file,{upsert:true,contentType:file.type}).then(function(res){
      if(res && res.error)throw res.error;
      var pub=_sbAuth.storage.from('catalogos-clientes').getPublicUrl(path);
      cb(null,(pub&&pub.data&&pub.data.publicUrl)||'');
    }).catch(function(e){ cb(e); });
  }
  function _fail(){ _catToast('No se pudo subir la imagen','twarn'); if(btn){btn.disabled=false;btn.textContent='Guardar diseño';} }
  // Cola de subidas: banner de hoja 1, cintillo de las hojas, imagen de tapa y logo.
  var cola=[];
  if(s.banner_modo==='imagen' && s._file)                    cola.push({f:s._file,      set:'banner_imagen_url', limpiar:'_file'});
  if(s.hoja_modo==='imagen' && s._hojaFile)                  cola.push({f:s._hojaFile,  set:'hoja_imagen_url',   limpiar:'_hojaFile'});
  if(s.tapa_on && s.tapa_fondo_tipo==='imagen_propia' && s._tapaFile) cola.push({f:s._tapaFile, set:'tapa_imagen_url', limpiar:'_tapaFile'});
  if(s.tapa_on && s.tapa_logo_pos!=='ninguno' && s._logoFile) cola.push({f:s._logoFile,  set:'tapa_logo_url',     limpiar:'_logoFile'});
  if(!cola.length){ doSave(); return; }
  if(!_uidOK){ _catToast('Sesión no válida','twarn'); if(btn){btn.disabled=false;btn.textContent='Guardar diseño';} return; }
  (function siguiente(){
    if(!cola.length){ doSave(); return; }
    var it=cola.shift();
    _upOne(it.f,function(err,url){
      if(err){ console.error('[catcat upload]',it.set,err); _fail(); return; }
      s[it.set]=url; s[it.limpiar]=null;
      siguiente();
    });
  })();
}

function _catCatDuplicar(id){
  var c=_catCatList.filter(function(x){return x.id===id;})[0]; if(!c)return;
  var cfg=_catCatConfig||{}; var max=cfg.max_borradores_por_cliente||0;
  if(max>0 && _catCatList.length>=max){ _catToast('Llegaste al máximo de catálogos','twarn'); return; }
  var refresh=function(){ _catCargarCatalogos(function(){ if(_catPanelTab==='catalogos'){ var b=document.getElementById('_catTabBody'); if(b)_catRenderTabCatalogos(b); } }); };
  apiPost('catalogos_cliente',{cliente_id:_catCliente.id, nombre:(c.nombre||'Catálogo')+' (copia)', config:c.config||{}, updated_at:new Date().toISOString()}).then(function(res){
    var nuevo=Array.isArray(res)?res[0]:res;
    if(nuevo && nuevo.id){
      apiGet('catalogos_cliente_productos','select=producto_id,precio,precio_manual,precio_base,orden&catalogo_id=eq.'+id+'&limit=5000').then(function(prods){
        prods=Array.isArray(prods)?prods:[];
        if(prods.length){
          var rows=prods.map(function(p){ return {catalogo_id:nuevo.id, producto_id:p.producto_id, precio:p.precio, precio_manual:p.precio_manual, precio_base:p.precio_base, orden:p.orden}; });
          apiPost('catalogos_cliente_productos',rows).then(function(){ _catToast('Catálogo duplicado','tok'); refresh(); }).catch(function(){ _catToast('Catálogo duplicado','tok'); refresh(); });
        } else { _catToast('Catálogo duplicado','tok'); refresh(); }
      }).catch(function(){ _catToast('Catálogo duplicado','tok'); refresh(); });
    } else { _catToast('Catálogo duplicado','tok'); refresh(); }
  }).catch(function(e){ console.error('[catcat dup]',e); _catToast('No se pudo duplicar','twarn'); });
}

function _catCatBorrar(id){
  var c=_catCatList.filter(function(x){return x.id===id;})[0]; if(!c)return;
  var hacer=function(){
    _catCatList=_catCatList.filter(function(x){return x.id!==id;});
    if(_catPanelTab==='catalogos'){ var b=document.getElementById('_catTabBody'); if(b)_catRenderTabCatalogos(b); }
    apiDelete('catalogos_cliente','id=eq.'+id).catch(function(e){ console.error('[catcat del]',e); _catToast('No se pudo borrar','twarn'); _catCargarCatalogos(function(){ if(_catPanelTab==='catalogos'){ var b2=document.getElementById('_catTabBody'); if(b2)_catRenderTabCatalogos(b2); } }); });
  };
  if(typeof _catModalConfirm==='function'){
    _catModalConfirm({titulo:'Borrar catálogo', mensaje:'¿Querés borrar "'+(c.nombre||'este catálogo')+'"? No se puede deshacer.', confirmTxt:'Sí, borrar', cancelTxt:'Cancelar', icono:'🗑️', peligroso:true, onConfirm:hacer});
  } else {
    _catPreguntar({titulo:'Borrar catálogo', texto:'¿Borrar este catálogo? No se puede deshacer.', ok:'Sí, borrar', cancelar:'Cancelar'}).then(function(si){ if(si)hacer(); });
  }
}

function _catCatCerrarModal(){
  var m=document.getElementById('_moCatCat'); if(m)m.remove();
  try{ if(_catCatModalState&&_catCatModalState._imgPreviewObj)URL.revokeObjectURL(_catCatModalState._imgPreviewObj); }catch(e){}
  try{ if(_catCatModalState&&_catCatModalState._hojaPreviewObj)URL.revokeObjectURL(_catCatModalState._hojaPreviewObj); }catch(e){}
  try{ if(_catCatModalState&&_catCatModalState._tapaPreviewObj)URL.revokeObjectURL(_catCatModalState._tapaPreviewObj); }catch(e){}
  try{ if(_catCatModalState&&_catCatModalState._logoPreviewObj)URL.revokeObjectURL(_catCatModalState._logoPreviewObj); }catch(e){}
}

// ══════════════ NOTIFICACIONES DEL CLIENTE (campanita + tab) ══════════════
var _catNotifs = [];
var _catNotifLoaded = false;
var _catNotifFirma = "";   // JSON de la última carga: si no cambió, no se re-renderiza (evita re-pedir fotos)
var _catNotifUltCarga = 0; // ts de la última carga OK: evita recargas en ráfaga (TOKEN_REFRESHED, focus, etc.)
window._catImgMal = window._catImgMal || {}; // src de <img> que fallaron: no se vuelven a pedir en esta sesión
function _catImgErr(img){ try{ img.style.display='none'; window._catImgMal[img.getAttribute('src')]=1; }catch(e){} }
var _catBellOpen = false; // true mientras se ABRE la campanita: evita que markAllRead vacíe el dropdown al instante

function _catCargarNotifs(force){
  if(!_catCliente || !_catCliente.id){ _catNotifs=[]; _catNotifLoaded=false; _catNotifFirma=""; if(typeof _catRenderBell==='function')_catRenderBell(); return; }
  // Debounce: los eventos de auth (SIGNED_IN al volver a la pestaña, TOKEN_REFRESHED) llaman a esto
  // en ráfaga; si ya cargamos hace <30s y no es forzado, no volvemos a pegarle a la DB.
  if(!force && _catNotifLoaded && (Date.now()-_catNotifUltCarga) < 30000) return;
  apiGet("notificaciones_cliente","select=*&cliente_id=eq."+_catCliente.id+"&order=created_at.desc&limit=200")
    .then(function(rows){
      _catNotifs = Array.isArray(rows)?rows:[];
      _catNotifLoaded = true;
      _catNotifUltCarga = Date.now();
      var firma=""; try{ firma=JSON.stringify(_catNotifs); }catch(e){ firma=String(Date.now()); }
      var cambio = (firma!==_catNotifFirma); _catNotifFirma=firma;
      _catRenderBell();
      if(!cambio) return; // mismos datos → no repintar listas (no re-pedir imágenes)
      var dd=document.getElementById("catNotifDrop");
      if(dd && dd.style.display==="block") _catRenderNotifList(document.getElementById("catNotifDropBody"), false, true);
      if(_catPanelTab==="notificaciones"){ var box=document.getElementById("_catTabBody"); if(box)_catRenderTabNotifs(box); }
    })
    .catch(function(e){ console.error("[cat-notifs]",e); });
}

function _catNotifUnread(){ return _catNotifs.filter(function(n){return !n.leida;}).length; }

function _catRenderBell(){
  var btn=document.getElementById("catBellBtn");
  var badge=document.getElementById("catBellBadge");
  if(!btn)return;
  if(!_catCliente || !_catCliente.id){ btn.style.display="none"; if(badge)badge.style.display="none"; return; }
  btn.style.display="inline-flex";
  var u=_catNotifUnread();
  if(badge){
    if(u>0){ badge.textContent=(u>99?"99+":String(u)); badge.style.display="flex"; }
    else { badge.style.display="none"; }
  }
}

function catToggleNotifs(){
  var dd=document.getElementById("catNotifDrop");
  if(!dd)return;
  if(dd.style.display==="block"){ dd.style.display="none"; return; }
  _catBellOpen=true; // mientras abrimos, markAllRead NO debe re-renderizar/vaciar el dropdown
  _catRenderNotifList(document.getElementById("catNotifDropBody"), false, true);
  dd.style.display="block";
  // 🆕 2026-07: al abrir, marcar como leídas → se va el punto rojo (ya las vio).
  // La lista queda VISIBLE mientras el dropdown está abierto; al reabrir (ya leídas) muestra el vacío con botón al panel.
  try{ _catNotifMarkAllRead(); }catch(e){}
  _catBellOpen=false;
}

function _catCerrarNotifDrop(e){
  var dd=document.getElementById("catNotifDrop");
  var btn=document.getElementById("catBellBtn");
  if(!dd || dd.style.display!=="block")return;
  if(e && (dd.contains(e.target) || (btn&&btn.contains(e.target))))return;
  dd.style.display="none";
}
document.addEventListener("click", _catCerrarNotifDrop, true);
function _catNotifClick(id, pagina, linkId, linkUrlEnc){
  try{ _catNotifMarkOne(id); }catch(e){}
  try{ apiPatch("notificaciones_cliente",{clickeada:true,clickeada_at:new Date().toISOString()},"id=eq."+id).catch(function(){}); }catch(e){}
  var ddc=document.getElementById("catNotifDrop"); if(ddc)ddc.style.display="none";
  var url = linkUrlEnc ? decodeURIComponent(linkUrlEnc) : "";
  // ── destinos que NO requieren cerrar el drawer ──
  if(pagina==='url' && url){ try{window.open(url,'_blank','noopener');}catch(e){} return; }
  if(pagina==='whatsapp'){ var wa = url ? url : "https://wa.me/5493515121193"; try{window.open(wa,'_blank','noopener');}catch(e){} return; }
  // ── panel del cliente (panel:favoritos / panel:pedidos / panel:avisos / panel:direcciones / panel:perfil) ──
  if(pagina && pagina.indexOf('panel:')===0){
    var tabKey=pagina.split(':')[1]||'notificaciones';
    if(tabKey==='avisos'||tabKey==='notificaciones')tabKey='notificaciones';
    _catPanelTab=tabKey;
    var dw0=document.getElementById("drawerCuenta");
    if(dw0 && dw0.classList.contains("open")){ if(typeof _catSetTab==='function')_catSetTab(tabKey); }
    else if(typeof toggleMiCuenta==='function'){ toggleMiCuenta(); setTimeout(function(){ if(typeof _catSetTab==='function')_catSetTab(tabKey); },80); }
    return;
  }
  // ── destinos del catálogo: cerrar drawer y navegar ──
  var dw=document.getElementById("drawerCuenta");
  var cerrarYIr=function(fn){
    if(dw && dw.classList.contains("open") && typeof toggleMiCuenta==='function'){ toggleMiCuenta(); setTimeout(fn,320); }
    else fn();
  };
  if(pagina==='producto' && linkId){ if(typeof _catIrAProducto==='function')_catIrAProducto(linkId); return; }
  if(pagina==='ofertas'){ cerrarYIr(function(){ if(typeof _homeVerOfertas==='function')_homeVerOfertas(); }); return; }
  if(pagina==='combos'){ cerrarYIr(function(){ if(typeof _homeVerCombos==='function')_homeVerCombos(); else if(typeof _homeVerOfertas==='function')_homeVerOfertas(); }); return; }
  if((pagina==='marca'||pagina==='familia'||pagina==='busqueda') && url){
    cerrarYIr(function(){
      var inp=document.getElementById("searchInput");
      if(inp){ inp.value=url; if(typeof applyFilters==='function')applyFilters(); try{inp.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){} }
    });
    return;
  }
}

function _catDeepLinkIr(dest,q,p){
  try{
    if(dest==='ofertas'){ if(typeof _homeVerOfertas==='function')_homeVerOfertas(); return; }
    if(dest==='combos'){ if(typeof _homeVerCombos==='function')_homeVerCombos(); else if(typeof _homeVerOfertas==='function')_homeVerOfertas(); return; }
    if(dest==='buscar'){ var inp=document.getElementById('srch')||document.getElementById('searchInput'); if(inp){ inp.value=q||''; if(typeof applyFilters==='function')applyFilters(); try{inp.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){} } return; }
    if(dest==='pestana'){ // 2026-10-09: abre una pestaña del catálogo por slug (ej. ?ir=pestana&p=regaleria); espera a que estén los botones
      var _slug=String(p||''), _int=0;
      (function _buscar(){
        var btn=null; document.querySelectorAll('.tab').forEach(function(x){ var oc=x.getAttribute('onclick')||''; if(oc.indexOf("switchTab('"+_slug+"'")>=0||oc.indexOf('switchTab("'+_slug+'"')>=0) btn=x; });
        if(btn&&typeof switchTab==='function'){ switchTab(_slug,btn); try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){} return; }
        if(++_int<30) setTimeout(_buscar,300);
      })();
      return; }
    if(dest==='panel'){ var tab=p||'notificaciones'; if(tab==='avisos')tab='notificaciones'; var dw=document.getElementById('drawerCuenta'); if(dw&&dw.classList.contains('open')){ if(typeof _catSetTab==='function')_catSetTab(tab); } else if(typeof toggleMiCuenta==='function'){ toggleMiCuenta(); setTimeout(function(){ if(typeof _catSetTab==='function')_catSetTab(tab); },120); } return; }
  }catch(e){console.warn('[deeplink]',e);}
}
// Abre Mi Cuenta directo en la pestaña "Avisos" (para notificaciones de ingreso de stock)
function _catAbrirAvisos(){
  var ddc=document.getElementById("catNotifDrop"); if(ddc)ddc.style.display="none";
  var dw=document.getElementById("drawerCuenta");
  window._catForzarTab="notificaciones"; _catPanelTab="notificaciones";
  if(dw && dw.classList.contains("open")){ if(typeof _catSetTab==='function')_catSetTab("notificaciones"); }
  else if(typeof toggleMiCuenta==='function'){ toggleMiCuenta(); setTimeout(function(){ if(typeof _catSetTab==='function')_catSetTab("notificaciones"); },80); }
}
// ══════════════ PUSH (notificaciones al celular) ══════════════
var _VAPID_PUBLIC = "BIzSs-OcJ0M4OiSgeHGMSgT0iPk-ZxG4njAbRvfgFKLnLqs1AE2SYbY0SOegbxbzDhQ9CAiu7XAfPkDyOe9gcDc";
function _catPushSupported(){ return ('serviceWorker' in navigator) && ('PushManager' in window) && ('Notification' in window); }
function _urlB64ToUint8(base64String){
  var padding="=".repeat((4 - base64String.length % 4) % 4);
  var base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
  var raw=window.atob(base64); var arr=new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++)arr[i]=raw.charCodeAt(i);
  return arr;
}
function _catActivarPush(){
  if(!_catCliente||!_catCliente.id){ if(typeof _catToast==='function')_catToast("Inici\u00e1 sesi\u00f3n primero","twarn"); return; }
  if(!_catPushSupported()){ if(typeof _catToast==='function')_catToast("Tu navegador no soporta notificaciones push","twarn"); _catPushRefreshBtn(); return; }
  Notification.requestPermission().then(function(perm){
    if(perm!=="granted"){ if(typeof _catToast==='function')_catToast("No activaste las notificaciones","twarn"); _catPushRefreshBtn(); return; }
    navigator.serviceWorker.register("sw.js").then(function(reg){
      return (reg.pushManager.getSubscription().then(function(sub){
        if(sub) return sub;
        return reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:_urlB64ToUint8(_VAPID_PUBLIC) });
      }));
    }).then(function(sub){
      var j=sub.toJSON()||{}; var keys=j.keys||{};
      // upsert: borrar este endpoint si ya estaba y reinsertar a nombre del cliente actual
      return apiDelete("push_subscriptions","endpoint=eq."+encodeURIComponent(j.endpoint)).catch(function(){}).then(function(){
        return apiPost("push_subscriptions",{ rol:"cliente", cliente_id:_catCliente.id, auth_user_id:(_catCliente.auth_user_id||null), endpoint:j.endpoint, p256dh:keys.p256dh||null, auth:keys.auth||null, user_agent:navigator.userAgent, activa:true });
      });
    }).then(function(){
      if(typeof _catToast==='function')_catToast("\u00a1Notificaciones activadas! \ud83d\udd14","tok");
      _catPushRefreshBtn();
    }).catch(function(e){ console.error("[push]",e); if(typeof _catToast==='function')_catToast("No se pudo activar, prob\u00e1 de nuevo","twarn"); _catPushRefreshBtn(); });
  }).catch(function(e){ console.error("[push perm]",e); });
}
// detección iOS / app instalada (standalone)
var _catDeferredInstall=null;
window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); _catDeferredInstall=e; try{_catPushRefreshBtn();}catch(_e){} });
function _catIsIOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent||"") || ((navigator.platform==='MacIntel') && navigator.maxTouchPoints>1); }
function _catIsStandalone(){ return (window.navigator.standalone===true) || !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches); }

// ── Cartel automático de avisos: aparece en CADA login hasta que el usuario decida (aceptar o negar) ──
var _catAutoPushShown = false;
function _catMaybeAutoPushPrompt(){
  try{
    if(_catAutoPushShown) return;                      // una sola vez por sesión
    if(!_catCliente) return;                            // solo con cuenta logueada
    if(!_catPushSupported || !_catPushSupported()) return;
    if(typeof Notification === 'undefined') return;
    if(Notification.permission !== 'default') return;  // ya aceptó o negó → nunca más automático
    // iOS sin instalar como app: el permiso no funciona ahí, no tiene sentido pedirlo
    if(_catIsIOS && _catIsIOS() && _catIsStandalone && !_catIsStandalone()) return;
    _catAutoPushShown = true;
    setTimeout(_catMostrarAutoPushPrompt, 1300);
  }catch(e){}
}
function _catMostrarAutoPushPrompt(){
  if(typeof Notification === 'undefined' || Notification.permission !== 'default') return;
  if(typeof _catModalConfirm !== 'function'){
    if(typeof _catActivarPush === 'function') _catActivarPush();
    return;
  }
  _catModalConfirm({
    icono:'\ud83d\udd14',
    titulo:'\u00bfQuer\u00e9s recibir avisos?',
    mensaje:'Activ\u00e1 las notificaciones para enterarte de ofertas, reingresos de stock y novedades de Distribuidora Belle. Pod\u00e9s desactivarlas cuando quieras desde tu cuenta.',
    confirmTxt:'\ud83d\udd14 Activar avisos',
    cancelTxt:'Ahora no',
    onConfirm:function(){ if(typeof _catActivarPush === 'function') _catActivarPush(); },
    onCancel:function(){}
  });
}
function _catInstalarApp(){
  if(_catDeferredInstall){ _catDeferredInstall.prompt(); _catDeferredInstall.userChoice.then(function(){ _catDeferredInstall=null; setTimeout(_catPushRefreshBtn,300); }); }
}
function _catIOSInstallCardHTML(){
  var paso="flex-shrink:0;width:20px;height:20px;border-radius:50%;background:#c4965a;color:#fff;font-size:.7rem;font-weight:800;display:flex;align-items:center;justify-content:center";
  return "<div style='background:#fff;border:1px solid #ecdfca;border-radius:11px;padding:.85rem .9rem;font-size:.74rem;color:#6a5a40;line-height:1.5'>"+
    "<div style='font-weight:800;color:#a9763f;font-size:.82rem;margin-bottom:.4rem'>\ud83d\udcf2 Activ\u00e1 las notificaciones en tu iPhone</div>"+
    "<div>Para que te lleguen al celular, primero agreg\u00e1 Belle a tu pantalla de inicio:</div>"+
    "<div style='margin-top:.55rem;display:flex;flex-direction:column;gap:.45rem'>"+
      "<div style='display:flex;gap:.5rem;align-items:flex-start'><span style='"+paso+"'>1</span><span>Toc\u00e1 el bot\u00f3n <b>Compartir</b> <span style='display:inline-block;border:1px solid #d4ba8a;border-radius:5px;padding:0 .35rem;font-weight:700'>\u2191</span> (abajo en Safari).</span></div>"+
      "<div style='display:flex;gap:.5rem;align-items:flex-start'><span style='"+paso+"'>2</span><span>Eleg\u00ed <b>\u00abAgregar a inicio\u00bb</b>.</span></div>"+
      "<div style='display:flex;gap:.5rem;align-items:flex-start'><span style='"+paso+"'>3</span><span>Abr\u00ed <b>Belle</b> desde el \u00edcono nuevo y volv\u00e9 ac\u00e1 para tocar <b>Activar</b>.</span></div>"+
    "</div>"+
  "</div>";
}
function _catPushBtnHTML(){
  if(_catIsIOS() && !_catIsStandalone()) return _catIOSInstallCardHTML();
  var instalar = (_catDeferredInstall && !_catIsStandalone())
    ? "<button onclick='_catInstalarApp()' style='width:100%;display:flex;align-items:center;justify-content:center;gap:.4rem;background:#fff;border:1px solid #d4ba8a;color:#a9763f;border-radius:10px;padding:.55rem;font-size:.76rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:.5rem'>\ud83d\udcf2 Instalar la app de Belle</button>"
    : "";
  if(!_catPushSupported()) return instalar+"<div style='font-size:.72rem;color:#9a8870;background:#f7f1e7;border:1px solid #ecdfca;border-radius:9px;padding:.6rem .7rem'>\ud83d\udd14 Tu navegador no permite notificaciones push. Prob\u00e1 desde Chrome en el celular.</div>";
  var p=(typeof Notification!=="undefined")?Notification.permission:"default";
  if(p==="denied") return instalar+"<div style='font-size:.72rem;color:#9a6b62;background:#fdf1ef;border:1px solid #f3d9d4;border-radius:9px;padding:.6rem .7rem'>\ud83d\udd15 Notificaciones bloqueadas. Activalas desde los ajustes del navegador para este sitio.</div>";
  if(p==="granted") return instalar+"<div style='display:flex;align-items:center;justify-content:space-between;gap:.5rem;font-size:.74rem;color:#2e7d52;background:#eef8f1;border:1px solid #cfe9d8;border-radius:9px;padding:.6rem .7rem'><span>\u2705 Notificaciones activadas en este dispositivo</span><button onclick='_catActivarPush()' style='background:transparent;border:1px solid #bfe0cb;color:#2e7d52;border-radius:7px;padding:.25rem .55rem;font-size:.66rem;cursor:pointer;font-family:inherit'>Re-activar</button></div>";
  return instalar+"<button onclick='_catActivarPush()' style='width:100%;display:flex;align-items:center;justify-content:center;gap:.45rem;background:linear-gradient(135deg,#c4965a,#a9763f);color:#fff;border:none;border-radius:10px;padding:.7rem;font-size:.8rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 3px 10px rgba(196,150,90,.35)'>\ud83d\udd14 Activar notificaciones en este celular</button><div style='font-size:.66rem;color:#9a8870;text-align:center;margin-top:.35rem'>Te van a llegar avisos de ofertas e ingresos de stock</div>";
}
function _catPushRefreshBtn(){ var slot=document.getElementById("_catPushSlot"); if(slot)slot.innerHTML=_catPushBtnHTML(); }
// Re-renderiza las vistas de notificaciones que estén abiertas (campanita + tab) y la campanita
function _catNotifRefreshViews(){
  _catRenderBell();
  if(!_catBellOpen){
    var dd=document.getElementById("catNotifDrop");
    if(dd && dd.style.display==="block"){ var b=document.getElementById("catNotifDropBody"); if(b)_catRenderNotifList(b, false, true); }
  }
  if(_catPanelTab==="notificaciones"){
    var lb=document.getElementById("_catNotifTabList");
    if(lb){ _catRenderNotifList(lb, true); }
    else { var tb=document.getElementById("_catTabBody"); if(tb)_catRenderTabNotifs(tb); }
  }
}

function _catNotifMarkAllRead(){
  if(!_catCliente || !_catCliente.id)return;
  var noLeidas=_catNotifs.filter(function(n){return !n.leida;});
  if(!noLeidas.length)return;
  var nowIso=new Date().toISOString();
  noLeidas.forEach(function(n){ n.leida=true; n.leida_at=nowIso; });
  _catNotifRefreshViews();
  apiPatch("notificaciones_cliente",{leida:true,leida_at:nowIso},"cliente_id=eq."+_catCliente.id+"&leida=eq.false")
    .catch(function(e){ console.error("[cat-notifs mark]",e); });
}

// Marca UNA notificación como leída
function _catNotifMarkOne(id){
  var n=null; for(var i=0;i<_catNotifs.length;i++){ if(_catNotifs[i].id===id){ n=_catNotifs[i]; break; } }
  if(!n || n.leida)return;
  var nowIso=new Date().toISOString();
  n.leida=true; n.leida_at=nowIso;
  _catNotifRefreshViews();
  apiPatch("notificaciones_cliente",{leida:true,leida_at:nowIso},"id=eq."+id)
    .catch(function(e){ console.error("[notif mark one]",e); });
}

// Borra UNA notificación (el registro) — con confirmación
function _catNotifDeleteOne(id){
  var n=null; for(var i=0;i<_catNotifs.length;i++){ if(_catNotifs[i].id===id){ n=_catNotifs[i]; break; } }
  if(!n)return;
  var hacer=function(){
    var idx=_catNotifs.indexOf(n);
    if(idx>=0)_catNotifs.splice(idx,1);
    _catNotifRefreshViews();
    apiDelete("notificaciones_cliente","id=eq."+id)
      .catch(function(e){ console.error("[notif del]",e); if(typeof _catToast==='function')_catToast("No se pudo borrar, proba de nuevo","twarn"); _catCargarNotifs(true); });
  };
  if(typeof _catModalConfirm==='function'){
    var dd=document.getElementById("catNotifDrop"); if(dd)dd.style.display="none";
    _catModalConfirm({
      titulo:'Borrar notificaci\u00f3n',
      mensaje:'\u00bfQuer\u00e9s borrar esta notificaci\u00f3n? No se puede deshacer.',
      confirmTxt:'S\u00ed, borrar',
      cancelTxt:'Cancelar',
      icono:'\ud83d\uddd1\ufe0f',
      peligroso:true,
      onConfirm:hacer
    });
  } else {
    _catPreguntar({titulo:'Borrar notificaci\u00f3n', texto:'\u00bfBorrar esta notificaci\u00f3n? No se puede deshacer.', ok:'S\u00ed, borrar', cancelar:'Cancelar'}).then(function(si){ if(si)hacer(); });
  }
}

function _catNotifFmtFecha(iso){
  if(!iso)return "";
  var d=new Date(iso), now=new Date();
  var s=Math.floor((now-d)/1000); if(s<0)s=0;
  if(s<60)return "reci\u00e9n";
  var m=Math.floor(s/60); if(m<60)return "hace "+m+" min";
  var h=Math.floor(m/60); if(h<24)return "hace "+h+" h";
  var dias=Math.floor(h/24); if(dias<7)return "hace "+dias+(dias===1?" d\u00eda":" d\u00edas");
  var sem=Math.floor(dias/7); if(dias<30)return "hace "+sem+(sem===1?" semana":" semanas");
  var meses=Math.floor(dias/30); if(meses<12)return "hace "+meses+(meses===1?" mes":" meses");
  var anios=Math.floor(dias/365); return "hace "+anios+(anios===1?" a\u00f1o":" a\u00f1os");
}

function _catNotifVerMas(id, ev){
  if(ev){ try{ ev.stopPropagation(); }catch(e){} }
  var rest=document.getElementById("_catNrest"+id);
  if(rest){ rest.style.display="flex"; }
  var btn=document.getElementById("_catNvm"+id);
  if(btn){ btn.style.display="none"; }
}
function _catRenderNotifList(box, inPanel, bellMode){
  if(!box)return;
  var rich = inPanel || bellMode; // formato COMPLETO (con fotos de productos) igual en panel y campanita
  var lista=_catNotifs.slice();
  lista.sort(function(a,b){ return new Date(b.created_at||0) - new Date(a.created_at||0); });
  if(!inPanel){ lista=lista.filter(function(n){ return !n.leida; }); }
  if(!lista.length){
    if(inPanel){
      box.innerHTML="<div style='padding:1.6rem 1rem;text-align:center;color:#9a8870;font-size:.8rem'><div style='font-size:1.8rem;margin-bottom:.3rem'>&#128276;</div>No ten\u00e9s notificaciones todav\u00eda.</div>";
    } else {
      // Campanita sin no le\u00eddas \u2192 mensaje + bot\u00f3n para ver las anteriores en el panel
      box.innerHTML="<div style='padding:1.5rem 1.1rem;text-align:center;color:#9a8870'>"+
        "<div style='font-size:1.8rem;margin-bottom:.35rem'>&#10003;</div>"+
        "<div style='font-size:.82rem;font-weight:700;color:#5a4a30'>No ten\u00e9s notificaciones nuevas</div>"+
        "<div style='font-size:.74rem;color:#9a8870;margin-top:.25rem;line-height:1.35'>Entr\u00e1 al panel para ver las anteriores.</div>"+
        "<button onclick='_catAbrirAvisos()' style='margin-top:.85rem;background:var(--accent,#c4965a);color:#fff;border:none;padding:.5rem 1rem;border-radius:9px;font-size:.76rem;font-weight:700;cursor:pointer;font-family:inherit'>&#128276; Ver panel de notificaciones</button>"+
      "</div>";
    }
    return;
  }
  var h="";
  if(_catNotifUnread()>0 && !bellMode){
    h+="<div style='padding:.45rem .7rem;border-bottom:1px solid #f0e7d6;text-align:right;background:#fff'>"+
        "<button onclick='_catNotifMarkAllRead()' style='background:transparent;border:1px solid #d4ba8a;color:#a9763f;border-radius:7px;padding:.25rem .6rem;font-size:.68rem;cursor:pointer;font-family:inherit'>&#10003; Marcar todas le\u00eddas</button>"+
      "</div>";
  }
  lista.forEach(function(n){
    var nueva=!n.leida;
    var ico = n.icono ? n.icono : (n.parcial ? "\u26a0\ufe0f" : "\ud83c\udf38");
    var col = n.parcial ? "#b8860b" : "#3fae74";
    var lp = n.link_pagina||"";
    var hasLink = (lp==='producto' && n.link_id) || lp==='ofertas' || lp==='combos' || lp==='whatsapp' || (lp.indexOf('panel:')===0) || ((lp==='url'||lp==='marca'||lp==='familia'||lp==='busqueda') && n.link_url);
    var prods=n.productos; if(typeof prods==='string'){try{prods=JSON.parse(prods);}catch(e){prods=null;}} if(!Array.isArray(prods))prods=null;
    var hasProds=!!(prods && prods.length);
    var acc="";
    if(nueva){ acc+="<button onclick='_catNotifMarkOne("+n.id+")' title='Marcar le\u00edda' style='width:27px;height:27px;border-radius:6px;border:1px solid #cdebd9;background:#fff;color:#3fae74;font-size:.85rem;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;padding:0'>&#10003;</button>"; }
    if(inPanel){ acc+="<button onclick='_catNotifDeleteOne("+n.id+")' title='Borrar' style='width:27px;height:27px;border-radius:6px;border:1px solid #f0dad6;background:#fff;color:#cc6b62;font-size:.82rem;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;padding:0'>&#128465;</button>"; }
    var linkCall="_catNotifClick("+n.id+",'"+lp+"',"+(n.link_id||"null")+","+(n.link_url?("'"+encodeURIComponent(n.link_url)+"'"):"null")+")";
    var wrapClick="";
    if(hasProds && !rich){ wrapClick=" onclick=\"_catAbrirAvisos()\" style='cursor:pointer'"; }
    else if(hasLink && !hasProds){ wrapClick=" onclick=\""+linkCall+"\" style='cursor:pointer'"; }
    var imgHtml=(n.imagen_url && !window._catImgMal[n.imagen_url])?("<img src='"+_catEsc(n.imagen_url)+"' loading='lazy' style='width:100%;max-height:160px;object-fit:cover;border-radius:9px;margin-top:.5rem;display:block' onerror=\"_catImgErr(this)\">"):"";
    var prodHtml="";
    if(hasProds && rich){
      prodHtml="<div style='margin-top:.5rem;display:flex;flex-direction:column;gap:.4rem'>";
      prods.forEach(function(p,pi){
        if(pi===8){ prodHtml+="<div id='_catNrest"+n.id+"' style='display:none;flex-direction:column;gap:.4rem'>"; }
        var pid=(p&&(p.id||p.producto_id))||null;
        var pn=(p&&_nomMl(p.nombre||p.producto_nombre, pid))||("Producto "+(pid||""));
        var pim=(p&&(p.imagen||p.imagen_url))||""; if(pim && window._catImgMal[pim]) pim="";
        prodHtml+="<div onclick=\"_catNotifClick("+n.id+",'producto',"+(pid||"null")+",null)\" style='display:flex;align-items:center;gap:.55rem;padding:.45rem .55rem;border:1px solid #eee;border-radius:9px;cursor:pointer;background:#fff'>"+
          (pim?("<img src='"+_catEsc(pim)+"' loading='lazy' style='width:42px;height:42px;object-fit:contain;border-radius:6px;flex-shrink:0;background:#faf8f4' onerror=\"_catImgErr(this)\">"):"")+
          "<span style='font-size:.78rem;color:#5a4a30;font-weight:600;flex:1;min-width:0'>"+_catEsc(pn)+"</span>"+
          "<span style='font-size:1.05rem;color:#c4965a;flex-shrink:0'>\u203a</span>"+
        "</div>";
      });
      if(prods.length>8){ prodHtml+="</div><button id='_catNvm"+n.id+"' type='button' onclick='_catNotifVerMas("+n.id+",event)' style='align-self:center;margin-top:.15rem;background:#faf3e8;border:1px solid #e8d3b0;color:#a9763f;font-weight:700;font-size:.74rem;padding:.4rem .9rem;border-radius:8px;cursor:pointer;font-family:inherit'>Ver "+(prods.length-8)+" más ▾</button>"; }
      prodHtml+="</div>";
    }
    var dropListHtml="";
    if(hasProds && !rich){
      dropListHtml="<div style='margin-top:.45rem;display:flex;flex-direction:column;gap:.2rem'>";
      prods.forEach(function(p){
        var pn=(p&&_nomMl(p.nombre||p.producto_nombre, p.id||p.producto_id))||"";
        if(!pn)return;
        dropListHtml+="<div style='display:flex;align-items:center;gap:.4rem;font-size:.74rem;color:#5a4a30;line-height:1.3'>"+
          "<span style='color:#c4965a;font-size:.6rem;flex-shrink:0'>\u25cf</span>"+
          "<span style='flex:1;min-width:0;font-weight:600'>"+_catEsc(pn)+"</span>"+
        "</div>";
      });
      dropListHtml+="<div style='margin-top:.4rem;font-size:.7rem;font-weight:800;color:#a9763f'>\ud83d\udcf8 Ver todo con fotos \u2192</div>";
      dropListHtml+="</div>";
    }
    var ctaHtml="";
    if(hasLink && !hasProds && n.cta_texto){
      ctaHtml="<div style='margin-top:.55rem'><button onclick=\""+linkCall+"\" style='background:var(--accent,#c4965a);color:#fff;border:none;padding:.4rem .9rem;border-radius:8px;font-size:.74rem;font-weight:700;cursor:pointer;font-family:inherit'>"+_catEsc(n.cta_texto)+"</button></div>";
    }
    h+="<div style='display:flex;gap:.55rem;padding:.7rem .7rem .7rem "+(nueva?".6rem":".85rem")+";border-bottom:1px solid #f0e7d6;background:#fff;"+(nueva?"border-left:3px solid #c4965a;":"")+"'>"+
        "<div style='font-size:1.05rem;flex-shrink:0;color:"+col+";line-height:1.4'>"+ico+"</div>"+
        "<div style='min-width:0;flex:1'>"+
          "<div"+wrapClick+">"+
            "<div style='font-size:.8rem;font-weight:700;color:#5a4a30'>"+_catEsc(n.titulo||"Notificaci\u00f3n")+(nueva?" <span style='display:inline-block;width:7px;height:7px;border-radius:50%;background:#c4965a;vertical-align:middle'></span>":"")+"</div>"+
            ((n.mensaje && !hasProds)?("<div style='font-size:.74rem;color:#7a6a50;margin-top:.15rem;line-height:1.35;white-space:pre-wrap'>"+_catEsc(n.mensaje)+"</div>"):"")+
            imgHtml+dropListHtml+
          "</div>"+
          prodHtml+ctaHtml+
          "<div style='font-size:.64rem;color:#aa9a80;margin-top:.3rem'>"+_catNotifFmtFecha(n.created_at)+"</div>"+
        "</div>"+
        "<div style='flex-shrink:0;display:flex;flex-direction:column;gap:.3rem;align-items:flex-end'>"+acc+"</div>"+
      "</div>";
  });
  box.innerHTML=h;
}

// ── TAB Notificaciones (dentro de Mi Cuenta) ──
function _catRenderTabNotifs(box){
  if(!box)return;
  if(!_catNotifLoaded){
    box.innerHTML="<div style='padding:1.5rem;text-align:center;color:#9a8870'>Cargando...</div>";
    _catCargarNotifs();
    return;
  }
  box.innerHTML="<div id='_catPushSlot' style='margin-bottom:.8rem'>"+_catPushBtnHTML()+"</div>"+
    "<div style='font-size:.82rem;font-weight:700;color:#5a4a30;margin-bottom:.6rem'>Tus notificaciones</div>"+
    "<div id='_catNotifTabList' style='border:1px solid #f0e7d6;border-radius:10px;overflow:hidden'></div>";
  _catRenderNotifList(document.getElementById("_catNotifTabList"), true);
}

// ── TAB Perfil ───────────────────────────────────────────────────────
function _catRenderTabPerfil(box){
  var c = _catCliente;
  var h = "";
  h += "<div style='display:flex;flex-direction:column;gap:.7rem'>";

  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>Nombre</label>";
  h += "<input type='text' id='_catPfNombre' value='"+_catEsc(c.nombre||"")+"' style='width:100%;padding:.5rem .7rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.85rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>Apellido</label>";
  h += "<input type='text' id='_catPfApellido' value='"+_catEsc(c.apellido||"")+"' style='width:100%;padding:.5rem .7rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.85rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>Email</label>";
  h += "<input type='email' value='"+_catEsc(c.email||"")+"' disabled style='width:100%;padding:.5rem .7rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.85rem;background:#f5f0e8;color:var(--mid);margin-top:.2rem;box-sizing:border-box;font-family:inherit;cursor:not-allowed'>";
  h += "<div style='font-size:.62rem;color:var(--mid);margin-top:.15rem'>El email no se puede cambiar</div></div>";

  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>Teléfono</label>";
  h += "<input type='tel' id='_catPfTel' value='"+_catEsc(c.telefono_principal||"")+"' style='width:100%;padding:.5rem .7rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.85rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<button onclick='_catGuardarPerfil()' style='background:var(--accent);color:#fff;border:none;padding:.6rem;border-radius:7px;font-size:.85rem;font-weight:600;cursor:pointer;margin-top:.5rem'>Guardar cambios</button>";

  h += "<div style='margin-top:.8rem;padding-top:.8rem;border-top:1px solid #e8d9bf'>";
  h += "<button onclick='_catCambiarPwd()' style='width:100%;background:transparent;color:var(--accent);border:1px solid var(--accent);padding:.55rem;border-radius:7px;font-size:.8rem;font-weight:500;cursor:pointer'>Cambiar contraseña</button>";
  h += "</div>";

  h += "</div>";
  box.innerHTML = h;
}

function _catGuardarPerfil(){
  var nombre = (document.getElementById("_catPfNombre")||{value:""}).value.trim();
  if(!nombre){_catToast("El nombre es obligatorio","twarn");return;}
  var apellido = (document.getElementById("_catPfApellido")||{value:""}).value.trim();
  var tel = (document.getElementById("_catPfTel")||{value:""}).value.trim().replace(/\D/g,"");
  var data = {
    nombre: nombre,
    apellido: apellido || null,
    telefono_principal: tel || null,
    updated_at: new Date().toISOString()
  };
  apiPatch("clientes", data, "id=eq."+_catCliente.id).then(function(){
    // Actualizar cache local
    _catCliente.nombre = nombre;
    _catCliente.apellido = apellido || null;
    _catCliente.telefono_principal = tel || null;
    _catToast("Perfil actualizado","tok");
    catActualizarBoton();
  }).catch(function(e){
    console.error("[belle-cat] _catGuardarPerfil error:",e);
    _catToast("Error al guardar","terr");
  });
}

function _catCambiarPwd(){
  // Modal con dos inputs en lugar de prompts del navegador (que se ven feos en mobile).
  var prev = document.getElementById('_catMoCambiarPwd');
  if(prev) prev.remove();
  var mo = document.createElement('div');
  mo.id = '_catMoCambiarPwd';
  mo.style.cssText = 'position:fixed;inset:0;background:rgba(20,15,8,.75);z-index:1400;display:flex;align-items:center;justify-content:center;padding:1rem';
  mo.innerHTML =
    "<div style='background:#fff;border-radius:14px;max-width:380px;width:100%;padding:1.4rem;box-shadow:0 8px 40px rgba(0,0,0,.3)'>"+
      "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem'>"+
        "<div style='font-size:1rem;font-weight:700;color:var(--dark)'>🔑 Cambiar contraseña</div>"+
        "<button onclick='_catCambiarPwdCerrar()' style='background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--mid);padding:0;line-height:1'>&times;</button>"+
      "</div>"+
      "<div style='display:grid;gap:.6rem'>"+
        "<div>"+
          "<label style='font-size:.7rem;color:var(--mid);display:block;margin-bottom:.2rem'>Nueva contraseña (mín. 6 caracteres)</label>"+
          "<input type='password' id='_catPwdNueva' autocomplete='new-password' style='width:100%;padding:.55rem .7rem;background:#faf6ee;border:1px solid #e8d9bf;border-radius:7px;font-size:.85rem;color:var(--dark);box-sizing:border-box'>"+
        "</div>"+
        "<div>"+
          "<label style='font-size:.7rem;color:var(--mid);display:block;margin-bottom:.2rem'>Repetir contraseña</label>"+
          "<input type='password' id='_catPwdNueva2' autocomplete='new-password' style='width:100%;padding:.55rem .7rem;background:#faf6ee;border:1px solid #e8d9bf;border-radius:7px;font-size:.85rem;color:var(--dark);box-sizing:border-box'>"+
        "</div>"+
      "</div>"+
      "<div style='display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem'>"+
        "<button onclick='_catCambiarPwdCerrar()' style='background:transparent;color:var(--mid);border:1px solid #e8d9bf;padding:.55rem 1rem;border-radius:7px;font-size:.82rem;cursor:pointer'>Cancelar</button>"+
        "<button id='_catBtnCambiarPwd' onclick='_lockClick(this,_catCambiarPwdConfirmar,{texto:\"Guardando...\"})' style='background:var(--accent);color:#fff;border:none;padding:.55rem 1.1rem;border-radius:7px;font-size:.82rem;font-weight:600;cursor:pointer'>Guardar</button>"+
      "</div>"+
    "</div>";
  mo.addEventListener('click', function(e){if(e.target===mo) _catCambiarPwdCerrar();});
  document.body.appendChild(mo);
  // FIX 2026-05-15: registrar para botón atrás del celular
  _catModalBackRegistrar('_catMoCambiarPwd', _catCambiarPwdCerrar);
  setTimeout(function(){var f=document.getElementById('_catPwdNueva');if(f)f.focus();}, 100);
}

// FIX 2026-05-15: cerrar modal cambiar password
function _catCambiarPwdCerrar(){
  var m = document.getElementById('_catMoCambiarPwd');
  if(m) m.remove();
  _catModalBackDesregistrar('_catMoCambiarPwd');
}

function _catCambiarPwdConfirmar(){
  var nueva = (document.getElementById('_catPwdNueva')||{value:''}).value;
  var nueva2 = (document.getElementById('_catPwdNueva2')||{value:''}).value;
  if(!nueva || nueva.length < 6){_catToast("Mínimo 6 caracteres","twarn");return Promise.resolve();}
  if(nueva !== nueva2){_catToast("Las contraseñas no coinciden","terr");return Promise.resolve();}
  if(!_sbAuth){_catToast("Sistema cargando","twarn");return Promise.resolve();}
  return _sbAuth.auth.updateUser({password: nueva}).then(function(res){
    if(res.error){_catToast(res.error.message||"Error","terr");return;}
    _catToast("Contraseña actualizada","tok");
    _catCambiarPwdCerrar();
  }).catch(function(e){
    console.error("[belle-cat] _catCambiarPwdConfirmar error:",e);
    _catToast("Error","terr");
  });
}

// ════════════════════════════════════════════════════════════════════
// FASE B Sub-bloque 2 — Mis Pedidos (timeline + detalle)
// ════════════════════════════════════════════════════════════════════

function _catFmtMoney(n){
  if(n==null||isNaN(n)) return "—";
  return "$"+Math.round(n).toLocaleString("es-AR");
}

function _catFmtFecha(iso, conHora){
  if(!iso) return "—";
  try {
    var d = new Date(iso);
    var opts = {day:"2-digit",month:"2-digit",year:"2-digit",timeZone:"America/Argentina/Buenos_Aires"};
    if(conHora){opts.hour="2-digit";opts.minute="2-digit";}
    return d.toLocaleString("es-AR", opts);
  } catch(e){ return "—"; }
}

// Formato corto sin hora — útil para fechas tipo cuota/fecha próxima.
// Acepta tanto "YYYY-MM-DD" (date pura) como ISO con hora.
function _catFmtFechaCorta(iso){
  if(!iso) return "—";
  try {
    var d;
    // Si es solo fecha (sin "T") interpretar en local para evitar shift de zona
    if(typeof iso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(iso)){
      var p = iso.split("-");
      d = new Date(parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10));
    } else {
      d = new Date(iso);
    }
    return d.toLocaleDateString("es-AR", {day:"2-digit",month:"2-digit",year:"2-digit"});
  } catch(e){ return "—"; }
}

// Tab Mis Pedidos
function _catAbrirHistorialPagos(clienteId, nombre){
  var ov=document.createElement('div'); ov.id='_catMoHistPagos';
  ov.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center';
  ov.innerHTML="<div style='background:#fff;width:100%;max-width:480px;max-height:82vh;border-radius:14px 14px 0 0;display:flex;flex-direction:column;overflow:hidden'>"+
    "<div style='display:flex;justify-content:space-between;align-items:center;padding:.9rem 1rem;border-bottom:1px solid #eee'>"+
      "<div style='font-weight:700;color:var(--dark);font-size:.95rem'>&#128179; Historial de pagos</div>"+
      "<button onclick='var _m=document.getElementById(\"_catMoHistPagos\");if(_m)_m.remove()' style='background:none;border:none;font-size:1.2rem;color:#999;cursor:pointer;line-height:1'>&#10005;</button>"+
    "</div>"+
    "<div id='_catHistPagosBody' style='overflow-y:auto;padding:.9rem 1rem'><div style='text-align:center;padding:1.5rem;color:var(--mid)'>Cargando&hellip;</div></div>"+
  "</div>";
  document.body.appendChild(ov);
  ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
  apiGet('cc_pagos','select=*&cliente_id=eq.'+clienteId+'&order=fecha.desc,created_at.desc&limit=500').then(function(pagos){
    var body=document.getElementById('_catHistPagosBody'); if(!body)return;
    pagos=Array.isArray(pagos)?pagos:[];
    if(!pagos.length){ body.innerHTML="<div style='text-align:center;padding:1.5rem;color:var(--mid)'>Todav&iacute;a no hay pagos registrados.</div>"; return; }
    var total=pagos.reduce(function(s,p){return s+(parseFloat(p.monto)||0);},0);
    var hh="<div style='display:flex;justify-content:space-between;align-items:center;background:#f7f2e9;border-radius:8px;padding:.6rem .8rem;margin-bottom:.7rem'>"+
      "<span style='font-size:.72rem;color:var(--mid);text-transform:uppercase;font-weight:700'>Total pagado ("+pagos.length+")</span>"+
      "<span style='font-size:1.05rem;font-weight:800;color:#5a8a4a'>"+_catFmtMoney(total)+"</span></div>";
    pagos.forEach(function(p){
      var monto=parseFloat(p.monto)||0;
      var fecha=_catFmtFechaCorta(p.fecha||p.created_at);
      var forma=(p.forma_pago||'efectivo'); forma=forma.charAt(0).toUpperCase()+forma.slice(1);
      hh+="<div style='display:flex;justify-content:space-between;gap:.5rem;padding:.55rem .7rem;background:#fff;border:1px solid #eee;border-radius:8px;margin-bottom:.4rem'>"+
        "<div style='min-width:0;flex:1'>"+
          "<div style='color:var(--dark);font-size:.82rem;font-weight:600'>"+_catEsc(forma)+(p.nota?" <span style='font-weight:400;color:var(--mid)'>&mdash; "+_catEsc(p.nota)+"</span>":"")+"</div>"+
          "<div style='font-size:.66rem;color:var(--mid);margin-top:.1rem'>"+fecha+"</div>"+
        "</div>"+
        "<div style='font-weight:800;color:#5a8a4a;flex-shrink:0;font-size:.9rem'>+"+_catFmtMoney(monto)+"</div>"+
      "</div>";
    });
    body.innerHTML=hh;
  }).catch(function(){ var body=document.getElementById('_catHistPagosBody'); if(body)body.innerHTML="<div style='text-align:center;padding:1.5rem;color:#c5443a'>Error cargando pagos</div>"; });
}

function _catRenderTabPedidos(box){
  if(!_catCliente){box.innerHTML = "<div class='empty'>Sin datos</div>";return;}
  box.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:var(--mid);font-size:.85rem'>"+
    "<div class='cat-spin' style='margin-bottom:.6rem'></div>Cargando tus pedidos...</div>";

  // Cargar pedidos + (si tiene CC) últimos pagos del nuevo sistema
  var promesas = [
    apiGet("pedidos_catalogo","select=*&cliente_id=eq."+_catCliente.id+"&order=created_at.desc&limit=100")
  ];
  if(_catCliente.cuenta_corriente_habilitada){
    promesas.push(
      apiGet("cc_pagos","select=*&cliente_id=eq."+_catCliente.id+"&order=fecha.desc,created_at.desc&limit=10")
        .catch(function(e){console.error("[belle-cat] cc_pagos error:",e); return [];})
    );
  } else {
    promesas.push(Promise.resolve([]));
  }

  Promise.all(promesas).then(function(res){
    var pedidos = Array.isArray(res[0]) ? res[0] : [];
    var pagos   = Array.isArray(res[1]) ? res[1] : [];

    // Filtrar pedidos ACTIVOS (no cobrados completos, no cancelados)
    // El cliente NO ve cancelados — esos solo los ven admin/vendedor.
    // "cobrado_parcial" SÍ aparece (es CC en marcha).
    var activos = pedidos.filter(function(p){
      if(p.estado === "cancelado") return false;
      if(p.estado === "cobrado") return false; // pago completo → va a "Mis compras"
      return true;
    });

    var h = "";

    // ─── BLOQUE CUENTA CORRIENTE (sistema nuevo: 3 recuadros) ───────────
    if(_catCliente.cuenta_corriente_habilitada){
      // Cálculos basados en pedidos activos
      var totalActivos = 0;
      var totalCobrado = 0;
      activos.forEach(function(p){
        totalActivos += parseFloat(p.total) || 0;
        totalCobrado += parseFloat(p.cobrado_total) || 0;
      });
      var saldoAbonar = totalActivos - totalCobrado;
      // Saldo a favor del cliente (si pagó de más)
      var saldoFavor = parseFloat(_catCliente.saldo_cc) || 0;
      if(saldoFavor < 0) saldoFavor = 0; // ignorar deudas viejas, sólo nos importa el "a favor"

      // Crédito
      var creditoTotal = parseFloat(_catCliente.limite_credito) || 0;
      var creditoUsado = saldoAbonar; // lo que debe es lo que está "usando"
      var creditoDispon = creditoTotal - creditoUsado;

      // Cuota próxima
      var cuotaMonto = parseFloat(_catCliente.cuota_proxima_monto) || 0;
      var cuotaFecha = _catCliente.cuota_proxima_fecha;
      var cuotaGracia = parseInt(_catCliente.cuota_proxima_dias_gracia) || 0;
      var cuotaNota = _catCliente.cuota_proxima_nota || "";

      // Detectar si la cuota está vencida (incluyendo días de gracia)
      var cuotaVencida = false;
      var diasParaCuota = null;
      if(cuotaMonto > 0 && cuotaFecha){
        var hoy = new Date(); hoy.setHours(0,0,0,0);
        var fechaCuota = new Date(cuotaFecha+"T00:00:00");
        var fechaLimite = new Date(fechaCuota); fechaLimite.setDate(fechaLimite.getDate() + cuotaGracia);
        diasParaCuota = Math.floor((fechaLimite - hoy) / 86400000);
        if(diasParaCuota < 0) cuotaVencida = true;
      }

      // ── Cartel BLOQUEADO arriba si corresponde (amarillo según pedido del usuario) ──
      if(_catCliente.bloqueado){
        h += "<div style='background:linear-gradient(135deg, #fef9e8, #fcf2d5);border:2px solid #d4a830;border-radius:10px;padding:.9rem 1rem;margin-bottom:1rem'>";
        h += "<div style='display:flex;align-items:flex-start;gap:.6rem'>";
        h += "<div style='font-size:1.5rem;flex-shrink:0'>&#9888;</div>";
        h += "<div style='flex:1'>";
        h += "<div style='font-size:.88rem;font-weight:700;color:#7a5a1a;margin-bottom:.2rem'>Cuenta bloqueada para nuevos pedidos</div>";
        h += "<div style='font-size:.75rem;color:#7a5a1a;line-height:1.4'>"+_catEsc(_catCliente.bloqueado_motivo || "Para volver a hacer pedidos, abonar el saldo de la cuota acordada. Contactá a tu vendedor.")+"</div>";
        h += "</div></div></div>";
      } else if(cuotaVencida){
        // Si tiene cuota vencida pero todavía no fue marcado como bloqueado, avisar (amarillo)
        h += "<div style='background:linear-gradient(135deg, #fef9e8, #fcf2d5);border:2px solid #d4a830;border-radius:10px;padding:.9rem 1rem;margin-bottom:1rem'>";
        h += "<div style='display:flex;align-items:flex-start;gap:.6rem'>";
        h += "<div style='font-size:1.5rem;flex-shrink:0'>&#9888;</div>";
        h += "<div style='flex:1'>";
        h += "<div style='font-size:.88rem;font-weight:700;color:#7a5a1a;margin-bottom:.2rem'>Tu cuota acordada venció</div>";
        h += "<div style='font-size:.75rem;color:#7a5a1a;line-height:1.4'>Debes abonar "+_catFmtMoney(cuotaMonto)+" (vencía el "+_catFmtFechaCorta(cuotaFecha)+(cuotaGracia>0?" + "+cuotaGracia+" día"+(cuotaGracia>1?"s":"")+" de gracia":"")+") antes de hacer un nuevo pedido.</div>";
        h += "</div></div></div>";
      }

      // ── 3 RECUADROS principales ──
      h += "<div style='background:linear-gradient(135deg, #fdf8f0, #faf5ec);border:1px solid #e8d9bf;border-radius:10px;padding:.9rem 1rem;margin-bottom:1rem'>";
      h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:700;letter-spacing:.05em;margin-bottom:.7rem'>&#128179; Mi Cuenta Corriente</div>";

      // ─── ORDEN VERTICAL: Crédito total → Crédito disponible → Total pedidos → Saldo → Cuota ───

      // 1) CRÉDITO TOTAL (lo que la empresa le asigna)
      if(creditoTotal > 0){
        h += "<div style='background:#fff;border:1px solid #e8d9bf;border-radius:8px;padding:.55rem .75rem;margin-bottom:.4rem'>";
        h += "<div style='display:flex;justify-content:space-between;align-items:center;gap:.5rem'>";
        h += "<div>";
        h += "<div style='font-size:.6rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>&#128081; Crédito total</div>";
        h += "<div style='font-size:.6rem;color:var(--mid);margin-top:.1rem'>Asignado por la empresa</div>";
        h += "</div>";
        h += "<div style='font-size:1.1rem;font-weight:800;color:var(--dark)'>"+_catFmtMoney(creditoTotal)+"</div>";
        h += "</div></div>";

        // 2) CRÉDITO DISPONIBLE (un pelín separado abajo, con barra)
        var pctUsado = creditoTotal > 0 ? Math.min(100, Math.max(0, (creditoUsado/creditoTotal)*100)) : 0;
        var colorBarra = pctUsado >= 100 ? "#c5443a" : (pctUsado >= 80 ? "#d4a830" : "#5a8a4a");
        h += "<div style='background:#fff;border:1px solid "+(creditoDispon<=0?"#c5443a":"#e8d9bf")+";border-radius:8px;padding:.55rem .75rem;margin-bottom:.85rem'>";
        h += "<div style='display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.4rem'>";
        h += "<div>";
        h += "<div style='font-size:.6rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>&#9989; Crédito disponible</div>";
        h += "<div style='font-size:.6rem;color:var(--mid);margin-top:.1rem'>Total menos pedidos en curso</div>";
        h += "</div>";
        h += "<div style='font-size:1.1rem;font-weight:800;color:"+(creditoDispon>0?"#5a8a4a":"#c5443a")+"'>"+_catFmtMoney(Math.max(0,creditoDispon))+"</div>";
        h += "</div>";
        // Barra de progreso
        h += "<div style='background:#f0e6d3;height:7px;border-radius:4px;overflow:hidden'>";
        h += "<div style='background:"+colorBarra+";height:100%;width:"+pctUsado+"%;transition:width .3s'></div>";
        h += "</div>";
        h += "</div>";
      }

      // 4) SALDO (deuda después de pagos)
      h += "<div style='background:#fff;border:1px solid "+(saldoAbonar>0.01?"#c4965a":"#a8d4a0")+";border-radius:8px;padding:.55rem .75rem;margin-bottom:.85rem'>";
      h += "<div style='display:flex;justify-content:space-between;align-items:center;gap:.5rem'>";
      h += "<div>";
      h += "<div style='font-size:.6rem;color:var(--mid);text-transform:uppercase;font-weight:600;letter-spacing:.04em'>&#128176; Deuda</div>";
      h += "<div style='font-size:.6rem;color:var(--mid);margin-top:.1rem'>"+(totalCobrado>0?"Pagado: "+_catFmtMoney(totalCobrado):(saldoAbonar<=0.01?"Al día ✓":"Sin pagos aún"))+"</div>";
      h += "</div>";
      h += "<div style='font-size:1.1rem;font-weight:800;color:"+(saldoAbonar>0.01?"#c5443a":"#5a8a4a")+"'>"+_catFmtMoney(saldoAbonar)+"</div>";
      h += "</div></div>";

      // 5) CUOTA (si hay una asignada con fecha)
      if(cuotaMonto > 0 && cuotaFecha){
        var bgCuota, bordeCuota, txtCuota;
        if(cuotaVencida){
          bgCuota = "#fef9e8"; bordeCuota = "#d4a830"; txtCuota = "#7a5a1a"; // AMARILLO según pedido del usuario
        } else if(diasParaCuota !== null && diasParaCuota <= 3){
          bgCuota = "#fef9e8"; bordeCuota = "#d4a830"; txtCuota = "#7a5a1a";
        } else {
          bgCuota = "#fff"; bordeCuota = "#e8d9bf"; txtCuota = "var(--dark)";
        }
        h += "<div style='background:"+bgCuota+";border:1px solid "+bordeCuota+";border-radius:8px;padding:.55rem .75rem;margin-bottom:.6rem'>";
        h += "<div style='display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem'>";
        h += "<div style='flex:1;min-width:0'>";
        h += "<div style='font-size:.6rem;color:"+txtCuota+";text-transform:uppercase;font-weight:600;letter-spacing:.04em'>&#128197; Cuota acordada</div>";
        h += "<div style='font-size:.95rem;font-weight:700;color:"+txtCuota+";margin-top:.15rem'>"+_catFmtMoney(cuotaMonto)+" — "+_catFmtFechaCorta(cuotaFecha)+"</div>";
        if(cuotaNota) h += "<div style='font-size:.66rem;color:var(--mid);margin-top:.15rem;font-style:italic'>"+_catEsc(cuotaNota)+"</div>";
        h += "</div>";
        // Estado a la derecha
        h += "<div style='text-align:right;flex-shrink:0'>";
        if(cuotaVencida){
          h += "<div style='font-size:.66rem;font-weight:700;color:#c4965a'>VENCIDO</div>";
        } else if(diasParaCuota === 0){
          h += "<div style='font-size:.66rem;font-weight:700;color:#d4a830'>HOY</div>";
        } else if(diasParaCuota === 1){
          h += "<div style='font-size:.66rem;font-weight:700;color:#d4a830'>MAÑANA</div>";
        } else if(diasParaCuota !== null && diasParaCuota > 0){
          h += "<div style='font-size:.66rem;font-weight:600;color:var(--mid)'>en "+diasParaCuota+" día"+(diasParaCuota===1?"":"s")+"</div>";
        }
        if(cuotaGracia > 0 && !cuotaVencida){
          h += "<div style='font-size:.58rem;color:var(--mid);margin-top:.1rem'>+"+cuotaGracia+"d gracia</div>";
        }
        h += "</div>";
        h += "</div>";
        h += "</div>";
      }

      // Saldo a favor (si pagó de más)
      if(saldoFavor > 0.01){
        h += "<div style='background:#e8f5e0;border:1px solid #b8d8a8;border-radius:8px;padding:.5rem .75rem;margin-bottom:.6rem;display:flex;justify-content:space-between;align-items:center;gap:.5rem'>";
        h += "<div>";
        h += "<div style='font-size:.66rem;color:#3a6f2a;text-transform:uppercase;font-weight:600'>&#10003; A tu favor</div>";
        h += "<div style='font-size:.6rem;color:var(--mid)'>Se aplicará a tus próximos pedidos</div>";
        h += "</div>";
        h += "<div style='font-size:1rem;font-weight:700;color:#3a6f2a'>"+_catFmtMoney(saldoFavor)+"</div>";
        h += "</div>";
      }

      // FEAT CC v2 (2026-05-14): Contenedor para cuotas reales del sistema nuevo
      // Se llena async después del render con _catRenderCuotasCliente()
      h += "<div id='_catCuotasContainer'></div>";

      // Botón historial de pagos (abre modal)
      if(pagos.length){
        h += "<div style='border-top:1px solid #e8d9bf;padding-top:.6rem;margin-top:.5rem'>";
        h += "<button onclick='_catAbrirHistorialPagos("+_catCliente.id+",&quot;&quot;)' style='width:100%;background:#faf5ec;border:1px solid #e8d9bf;border-radius:9px;padding:.6rem;color:var(--dark);font-size:.82rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.4rem'>&#128179; Historial de pagos</button>";
        h += "</div>";
      }

      h += "</div>";
    }

    // ── PEDIDOS ACTIVOS ──
    if(!activos.length){
      h += "<div style='text-align:center;padding:2rem 1rem;color:var(--mid)'>"+
        "<div style='font-size:2.5rem;margin-bottom:.5rem;opacity:.5'>&#128230;</div>"+
        "<div style='font-size:.9rem;font-weight:600;color:var(--dark);margin-bottom:.3rem'>"+(pedidos.length?"No tenés pedidos pendientes":"Aún no tenés pedidos")+"</div>"+
        "<div style='font-size:.78rem;color:var(--mid)'>"+(pedidos.length?"Mirá tus compras anteriores en \"Mis compras\"":"Cuando hagas tu primer pedido va a aparecer acá")+"</div>"+
        "</div>";
    } else {
      h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.5rem;letter-spacing:.04em'>Pedidos en curso</div>";
      h += "<div style='display:flex;flex-direction:column;gap:.7rem'>";
      activos.forEach(function(p){
        h += _catCardPedido(p);
      });
      h += "</div>";
    }

    box.innerHTML = h;
    // FEAT CC v2 (2026-05-14): cargar cuotas reales async
    if(_catCliente.cuenta_corriente_habilitada){
      setTimeout(function(){ _catRenderCuotasCliente(activos); }, 50);
    }
  }).catch(function(e){
    console.error("[belle-cat] _catRenderTabPedidos error:",e);
    box.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:#c5443a;font-size:.85rem'>Error al cargar pedidos</div>";
  });
}

// Tab Mis compras: pedidos cobrados/entregados (historial). Sin cancelados.
function _catRenderTabCompras(box){
  if(!_catCliente){box.innerHTML = "<div class='empty'>Sin datos</div>";return;}
  box.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:var(--mid);font-size:.85rem'>"+
    "<div class='cat-spin' style='margin-bottom:.6rem'></div>Cargando tus compras...</div>";

  apiGet("pedidos_catalogo","select=*&cliente_id=eq."+_catCliente.id+"&order=created_at.desc&limit=100").then(function(rows){
    var pedidos = Array.isArray(rows) ? rows : [];
    // Solo cobrados/entregados (cancelados NO los ve el cliente)
    var historial = pedidos.filter(function(p){
      if(p.estado === "cancelado") return false;
      return (p.estado === "cobrado") || (p.estado_envio === "entregado");
    });
    if(!historial.length){
      box.innerHTML = "<div style='text-align:center;padding:2.5rem 1rem;color:var(--mid)'>"+
        "<div style='font-size:2.5rem;margin-bottom:.5rem;opacity:.5'>&#128722;</div>"+
        "<div style='font-size:.9rem;font-weight:600;color:var(--dark);margin-bottom:.3rem'>Aún no tenés compras finalizadas</div>"+
        "<div style='font-size:.78rem;color:var(--mid)'>Cuando termines de pagar y recibir un pedido va a aparecer en este historial</div>"+
        "</div>";
      return;
    }
    var h = "";
    h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.5rem;letter-spacing:.04em'>"+historial.length+" compra"+(historial.length===1?"":"s")+"</div>";
    h += "<div style='display:flex;flex-direction:column;gap:.7rem'>";
    historial.forEach(function(p){
      h += _catCardPedido(p);
    });
    h += "</div>";
    box.innerHTML = h;
  }).catch(function(e){
    console.error("[belle-cat] _catRenderTabCompras error:",e);
    box.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:#c5443a;font-size:.85rem'>Error al cargar tu historial</div>";
  });
}

// ══════════════════════════════════════════════════════════════════════
// 🔁 REPETIR PEDIDO
// El cliente vuelve a pedir lo mismo de la otra vez, pero sin sorpresas:
// primero se le muestra qué hay, qué se quedó sin stock y qué cambió de
// precio desde aquel día. Recién ahí lo pasa al carrito.
// ══════════════════════════════════════════════════════════════════════
window._rep = null;

function _repItems(p){
  var items=[];
  try{ items = typeof p.items==='string' ? JSON.parse(p.items) : (Array.isArray(p.items)?p.items:[]); }
  catch(e){ items=[]; }
  return Array.isArray(items)?items:[];
}

function _repAbrir(pedId){
  var mo=document.getElementById('_repMo');
  if(mo)mo.remove();
  mo=document.createElement('div');
  mo.id='_repMo';
  mo.style.cssText='position:fixed;inset:0;background:rgba(20,15,8,.7);z-index:1300;display:flex;align-items:center;justify-content:center;padding:1rem';
  mo.addEventListener('click',function(e){ if(e.target===mo)_repCerrar(); });
  mo.innerHTML="<div style='background:var(--bg-card,#fff);border-radius:14px;max-width:480px;width:100%;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.3)'>"+
    "<div style='padding:1rem 1.1rem;border-bottom:1px solid var(--border-color,#e8d9bf);display:flex;justify-content:space-between;align-items:center'>"+
      "<div style='font-size:.95rem;font-weight:700;color:var(--tx-main,#1a1a1a)'>🔁 Repetir este pedido</div>"+
      "<button onclick='_repCerrar()' style='background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--tx-mid,#555);padding:0;line-height:1'>&times;</button>"+
    "</div>"+
    "<div id='_repBody' style='overflow-y:auto;padding:1rem 1.1rem;flex:1'><div style='text-align:center;padding:2rem 1rem;color:var(--tx-mid,#555)'><div class='cat-spin' style='margin-bottom:.5rem'></div>Mirando qué hay disponible...</div></div>"+
    "<div id='_repPie' style='padding:.85rem 1.1rem;border-top:1px solid var(--border-color,#e8d9bf)'></div>"+
    "</div>";
  document.body.appendChild(mo);
  try{ if(typeof _catModalBackRegistrar==='function')_catModalBackRegistrar('_repMo', _repCerrar); }catch(e){}

  apiGet("pedidos_catalogo","select=id,nro_orden,items,created_at,total&id=eq."+pedId+"&limit=1").then(function(rows){
    var ped=(Array.isArray(rows)&&rows[0])?rows[0]:null;
    if(!ped){ document.getElementById('_repBody').innerHTML="<div style='text-align:center;padding:2rem;color:#c5443a'>No encontré ese pedido</div>"; return; }
    _repArmar(ped);
  }).catch(function(e){
    console.error('[repetir]',e);
    var b=document.getElementById('_repBody');
    if(b)b.innerHTML="<div style='text-align:center;padding:2rem;color:#c5443a'>No se pudo cargar el pedido</div>";
  });
}
function _repCerrar(){ var m=document.getElementById('_repMo'); if(m)m.remove(); window._rep=null; }

function _repArmar(ped){
  var items=_repItems(ped);
  var filas=[];
  items.forEach(function(it,idx){
    var qty=parseInt(it.qty||it.cant||1)||1;
    var precioAntes=parseFloat(it.precio)||0;
    var base={idx:idx, nombre:it.nombre||'Producto', qtyPedida:qty, precioAntes:precioAntes,
              isDecan:!!it.isDecan, isCombo:!!it.isCombo, prodId:it.producto_id||null, elegido:true};
    if(it.isCombo){
      base.estado='combo'; base.motivo='Los combos cambian seguido — armalo de nuevo desde la sección de combos';
      base.elegido=false; filas.push(base); return;
    }
    if(it.isBonificado){
      base.estado='bonif'; base.motivo='Era un regalo de aquella compra'; base.elegido=false; filas.push(base); return;
    }
    var p=(typeof allProds!=='undefined'&&allProds)?allProds.filter(function(x){return x.id===base.prodId;})[0]:null;
    if(!p){ base.estado='nohay'; base.motivo='Ya no está en el catálogo'; base.elegido=false; filas.push(base); return; }
    base.prod=p;
    base.nombre=p.nombre||base.nombre;
    var stock=parseInt(p.stock_actual)||0;
    if(stock<=0){ base.estado='sinstock'; base.motivo='Sin stock por ahora'; base.elegido=false; filas.push(base); return; }
    // Primero cuántas se pueden llevar, y RECIÉN AHÍ el precio: el precio
    // depende del tramo por cantidad, así que si quedan menos unidades de las
    // que pidió, el precio que se muestra tiene que ser el de esas unidades.
    base.qty=Math.min(qty, base.isDecan?qty:stock);
    base.stock=stock;
    base.estado=(base.qty<qty)?'poco':'listo';
    if(base.estado==='poco') base.motivo='Quedan '+stock+' de los '+qty+' que llevaste';
    // precio de hoy, con las ofertas que estén corriendo
    var r=(typeof calcP==='function')?calcP(p):null;
    var precioHoy=0;
    if(r){
      if(base.isDecan) precioHoy=r.decan||0;
      else if(!r.oferta && p.precio_pestana>0) precioHoy=p.precio_pestana;
      else {
        var seg=(typeof getBestSeg==='function')?getBestSeg(base.qty,r):'pi';
        precioHoy=r[seg]||r.pi||0;
        base.porTramo=true;   // este precio puede mejorar si suma más unidades
      }
      base.hayOferta=!!r.oferta;
      base.ofertaEtiqueta=r.oferta_etiqueta||'';
    }
    base.precioHoy=Math.round(precioHoy);
    filas.push(base);
  });
  window._rep={ped:ped, filas:filas};
  _repPintar();
}

function _repPintar(){
  var st=window._rep; if(!st)return;
  var body=document.getElementById('_repBody'), pie=document.getElementById('_repPie');
  if(!body||!pie)return;
  var esc=(typeof _catEsc==='function')?_catEsc:function(s){return String(s==null?'':s);};
  var money=(typeof _catFmtMoney==='function')?_catFmtMoney:function(n){return '$'+Math.round(n||0).toLocaleString('es-AR');};

  var fecha=(typeof _catFmtFecha==='function')?_catFmtFecha(st.ped.created_at,true):'';
  var h="<div style='font-size:.78rem;color:var(--tx-mid,#555);margin-bottom:.8rem;line-height:1.5'>"+
        "Estás repitiendo <b>"+esc(st.ped.nro_orden||('#'+st.ped.id))+"</b>"+(fecha?(" de "+fecha):"")+
        ". Destildá lo que no quieras y fijate los precios de hoy.</div>";

  var disponibles=st.filas.filter(function(f){ return f.estado==='listo'||f.estado==='poco'; });
  var otros=st.filas.filter(function(f){ return f.estado!=='listo'&&f.estado!=='poco'; });

  disponibles.forEach(function(f){
    var subio=(f.precioAntes>0 && f.precioHoy>f.precioAntes);
    var bajo=(f.precioAntes>0 && f.precioHoy<f.precioAntes);
    h+="<label style='display:flex;gap:.6rem;align-items:flex-start;padding:.6rem .1rem;border-bottom:1px solid var(--border-color,#eee);cursor:pointer'>";
    h+="<input type='checkbox' "+(f.elegido?'checked':'')+" onchange='_repTildar("+f.idx+",this.checked)' style='margin-top:.2rem;accent-color:var(--accent,#c4965a);width:17px;height:17px;flex-shrink:0'>";
    h+="<div style='flex:1;min-width:0'>";
    h+="<div style='font-size:.82rem;font-weight:600;color:var(--tx-main,#1a1a1a);line-height:1.3'>"+esc(_nomMl(f.nombre,f.prodId))+(f.isDecan?" <span style='font-size:.66rem;color:var(--tx-mid,#555)'>(decant)</span>":"")+"</div>";
    h+="<div style='display:flex;align-items:center;gap:.5rem;margin-top:.25rem;flex-wrap:wrap'>";
    h+="<span style='font-size:.74rem;color:var(--tx-mid,#555)'>"+f.qty+" u.</span>";
    if(f.precioHoy>0){
      h+="<span style='font-size:.8rem;font-weight:700;color:var(--accent,#c4965a)'>"+money(f.precioHoy)+"</span>";
      if(subio)h+="<span style='font-size:.66rem;color:#c5443a'>antes "+money(f.precioAntes)+" ▲</span>";
      else if(bajo)h+="<span style='font-size:.66rem;color:#5a8a4a'>antes "+money(f.precioAntes)+" ▼</span>";
    }
    if(f.hayOferta)h+="<span style='font-size:.62rem;font-weight:700;color:#fff;background:#c5443a;padding:.1rem .4rem;border-radius:8px'>🔥 "+esc(f.ofertaEtiqueta||'OFERTA')+"</span>";
    h+="</div>";
    if(f.motivo)h+="<div style='font-size:.68rem;color:#b8860b;margin-top:.15rem'>"+esc(f.motivo)+"</div>";
    h+="</div></label>";
  });

  if(!disponibles.length){
    h+="<div style='text-align:center;padding:1.5rem 1rem;color:var(--tx-mid,#555);font-size:.85rem'>De aquel pedido no quedó nada disponible por ahora.</div>";
  }
  if(disponibles.some(function(f){ return f.porTramo; })){
    h+="<div style='font-size:.68rem;color:var(--tx-mid,#555);margin-top:.5rem;line-height:1.4;font-style:italic'>Estos precios son por la cantidad de acá. Si en el carrito juntás más unidades, te queda mejor todavía.</div>";
  }

  if(otros.length){
    h+="<div style='margin-top:.9rem;font-size:.7rem;text-transform:uppercase;letter-spacing:.04em;font-weight:700;color:var(--tx-mid,#555)'>No se pueden repetir</div>";
    otros.forEach(function(f){
      h+="<div style='padding:.5rem .1rem;border-bottom:1px solid var(--border-color,#eee);opacity:.65'>"+
         "<div style='font-size:.8rem;color:var(--tx-main,#1a1a1a)'>"+esc(_nomMl(f.nombre,f.prodId))+"</div>"+
         "<div style='font-size:.68rem;color:var(--tx-mid,#555)'>"+esc(f.motivo||'')+"</div></div>";
    });
  }
  body.innerHTML=h;

  var elegidos=disponibles.filter(function(f){ return f.elegido; });
  var total=elegidos.reduce(function(a,f){ return a+(f.precioHoy*f.qty); },0);
  var pieH="";
  if(elegidos.length){
    pieH+="<div style='display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.6rem'>"+
          "<span style='font-size:.78rem;color:var(--tx-mid,#555)'>"+elegidos.length+" producto"+(elegidos.length===1?'':'s')+"</span>"+
          "<span style='font-size:1.05rem;font-weight:700;color:var(--accent,#c4965a)'>"+money(total)+"</span></div>";
  }
  pieH+="<button "+(elegidos.length?"":"disabled ")+"onclick='_repAlCarrito()' style='width:100%;background:"+(elegidos.length?'var(--accent,#c4965a)':'#bbb')+";color:#fff;border:none;border-radius:10px;padding:.8rem;font-size:.9rem;font-weight:700;cursor:"+(elegidos.length?'pointer':'default')+";font-family:inherit'>"+
        (elegidos.length?("Agregar al carrito"):"Nada para agregar")+"</button>";
  pie.innerHTML=pieH;
}
function _repTildar(idx, val){
  var st=window._rep; if(!st)return;
  st.filas.forEach(function(f){ if(f.idx===idx)f.elegido=!!val; });
  _repPintar();
}

function _repAlCarrito(){
  var st=window._rep; if(!st)return;
  var elegidos=st.filas.filter(function(f){ return f.elegido && (f.estado==='listo'||f.estado==='poco'); });
  if(!elegidos.length)return;

  // Se usa el mismo addCart/addDecan de siempre para que el precio, la oferta
  // y el tramo salgan exactamente igual que si los agregara a mano. Se les
  // tapa el toast y el re-render mientras dura, si no parpadea todo.
  var toastOrig=window.showToast, filtrosOrig=window.applyFilters;
  var agregados=0;
  try{
    window.showToast=function(){};
    window.applyFilters=function(){};
    elegidos.forEach(function(f){
      try{
        if(f.isDecan){
          if(typeof decanState!=='undefined'){ decanState[f.prodId]=f.qty; }
          if(typeof addDecan==='function'){ addDecan(f.prodId); agregados++; }
        }else{
          if(typeof cstate!=='undefined'){ cstate[f.prodId]={qty:f.qty}; }
          if(typeof addCart==='function'){ addCart(f.prodId); agregados++; }
        }
      }catch(e){ console.warn('[repetir item]',f.nombre,e); }
    });
  } finally {
    window.showToast=toastOrig;
    window.applyFilters=filtrosOrig;
  }
  try{ if(typeof updateCartCount==='function')updateCartCount(); }catch(e){}
  try{ if(typeof applyFilters==='function')applyFilters(); }catch(e){}
  try{ if(typeof renderDrawer==='function')renderDrawer(); }catch(e){}
  _repCerrar();
  try{ if(typeof showToast==='function')showToast(agregados+' producto'+(agregados===1?'':'s')+' en tu carrito 🔁'); }catch(e){}
  // abrir el carrito para que lo vea
  setTimeout(function(){
    try{
      var dr=document.getElementById('drawer');
      if(dr && dr.classList.contains('open'))return;
      if(typeof toggleCart==='function')toggleCart();
    }catch(e){}
  },250);
}

// Card de un pedido (resumen + click para ver detalle)
function _catCardPedido(p){
  var estadoLabel = _catEstadoLabel(p);
  var estadoColor = _catEstadoColor(p);
  var fecha = _catFmtFecha(p.created_at, true);

  var items = [];
  try { items = typeof p.items==="string" ? JSON.parse(p.items) : (Array.isArray(p.items) ? p.items : []); }
  catch(e){ items = []; }
  var totItems = items.reduce(function(s,i){return s+(parseInt(i.cant||i.qty||1)||0);},0);

  var h = "";
  h += "<div onclick='_catVerPedido("+p.id+")' style='background:#fff;border:1px solid #e8d9bf;border-radius:9px;padding:.8rem .9rem;cursor:pointer;transition:border-color .15s' onmouseover='this.style.borderColor=\"var(--accent)\"' onmouseout='this.style.borderColor=\"#e8d9bf\"'>";
  h += "<div style='display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.4rem'>";
  h += "<div style='min-width:0;flex:1'>";
  h += "<div style='font-size:.85rem;font-weight:600;color:var(--dark)'>"+_catEsc(p.nro_orden||"#"+p.id)+"</div>";
  h += "<div style='font-size:.7rem;color:var(--mid);margin-top:.1rem'>"+fecha+" · "+totItems+" producto(s)</div>";
  h += "</div>";
  h += "<div style='text-align:right;flex-shrink:0'>";
  h += "<div style='font-size:.92rem;font-weight:700;color:var(--accent)'>"+_catFmtMoney(p.total)+"</div>";
  h += "</div>";
  h += "</div>";
  h += "<div style='display:flex;align-items:center;gap:.4rem;margin-top:.3rem;flex-wrap:wrap'>";
  h += "<span style='font-size:.65rem;font-weight:600;color:#fff;background:"+estadoColor+";padding:.2rem .5rem;border-radius:10px;letter-spacing:.02em'>"+estadoLabel+"</span>";
  // FEAT CC v2 (2026-05-14): badge de cuotas si aplica
  if(p.cc_nro_cuotas_real && p.cc_nro_cuotas_real > 1){
    h += "<span style='font-size:.62rem;font-weight:600;color:#7a5a1a;background:rgba(196,150,90,.18);padding:.18rem .45rem;border-radius:10px'>💳 "+p.cc_nro_cuotas_real+" cuotas</span>";
  } else if(p.es_cc){
    h += "<span style='font-size:.62rem;font-weight:600;color:#7a5a1a;background:rgba(196,150,90,.18);padding:.18rem .45rem;border-radius:10px'>💳 CC</span>";
  }
  h += "<span style='font-size:.65rem;color:var(--mid);margin-left:auto'>Ver detalle &rarr;</span>";
  h += "</div>";
  // 🔁 Repetir: vuelve a pedir lo mismo (para el pulgar, botón propio)
  if(items.length){
    h += "<button onclick='event.stopPropagation();_repAbrir("+p.id+")' style='width:100%;margin-top:.6rem;background:rgba(196,150,90,.12);border:1px solid var(--accent,#c4965a);color:var(--accent,#c4965a);border-radius:8px;padding:.5rem;font-size:.78rem;font-weight:700;cursor:pointer;font-family:inherit'>&#128257; Repetir este pedido</button>";
  }
  h += "</div>";
  return h;
}

// Estado para mostrar en card y timeline (combina estado+estado_envio para el cliente)
function _catEstadoLabel(p){
  if(p.estado === "cancelado") return "Cancelado";
  if(p.estado === "cobrado") return "Pagado";
  // Si hay estado_envio, prevalece para el cliente
  if(p.estado_envio === "entregado") return "Entregado";
  if(p.estado_envio === "en_reparto") return "En reparto";
  if(p.estado_envio === "en_preparacion") return "En preparación";
  if(p.estado === "reservado") return "Reservado";
  if(p.estado === "cobrado_parcial") return "Pago parcial";
  return "Pendiente de confirmación";
}

function _catEstadoColor(p){
  if(p.estado === "cancelado") return "#c5443a";
  if(p.estado === "cobrado" || p.estado_envio === "entregado") return "#5a8a4a";
  if(p.estado_envio === "en_reparto") return "#4a8ac5";
  if(p.estado_envio === "en_preparacion") return "#c4965a";
  if(p.estado === "reservado") return "#7a9eb8";
  return "#a08c6a";
}

// Modal con detalle del pedido + timeline
function _catVerPedido(pedId){
  // Crear/reutilizar modal
  var mo = document.getElementById("_catMoPedido");
  if(!mo){
    mo = document.createElement("div");
    mo.id = "_catMoPedido";
    mo.style.cssText = "position:fixed;inset:0;background:rgba(20,15,8,.7);z-index:1200;display:flex;align-items:center;justify-content:center;padding:1rem";
    mo.addEventListener("click", function(e){if(e.target===mo)_catCerrarPedido();});
    document.body.appendChild(mo);
    // FIX 2026-05-15: registrar para botón atrás del celular (solo al crear, no al reusar)
    _catModalBackRegistrar('_catMoPedido', _catCerrarPedido);
  }
  mo.innerHTML = "<div style='background:#fff;border-radius:14px;max-width:480px;width:100%;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.3)'>"+
    "<div style='padding:1rem 1.1rem;border-bottom:1px solid #e8d9bf;display:flex;justify-content:space-between;align-items:center'>"+
      "<div style='font-size:.95rem;font-weight:700;color:var(--dark)'>Detalle del pedido</div>"+
      "<button onclick='_catCerrarPedido()' style='background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--mid);padding:0;line-height:1'>&times;</button>"+
    "</div>"+
    "<div id='_catMoPedidoBody' style='overflow-y:auto;padding:1rem 1.1rem'><div style='text-align:center;padding:2rem 1rem;color:var(--mid)'><div class='cat-spin' style='margin-bottom:.5rem'></div>Cargando...</div></div>"+
    "</div>";

  // Cargar pedido + log de estados
  Promise.all([
    apiGet("pedidos_catalogo","select=*&id=eq."+pedId+"&limit=1"),
    apiGet("pedidos_estados_log","select=estado,nota,created_at&pedido_id=eq."+pedId+"&order=created_at.asc")
  ]).then(function(res){
    var ped = Array.isArray(res[0]) && res[0][0] ? res[0][0] : null;
    var logs = Array.isArray(res[1]) ? res[1] : [];
    var body = document.getElementById("_catMoPedidoBody");
    if(!body) return;
    if(!ped){body.innerHTML = "<div style='text-align:center;color:#c5443a;padding:2rem'>Pedido no encontrado</div>";return;}

    var items = [];
    try { items = typeof ped.items==="string" ? JSON.parse(ped.items) : (Array.isArray(ped.items) ? ped.items : []); } catch(e){ items=[]; }

    var h = "";
    // Header: número y total
    h += "<div style='background:#fdf8f0;border-radius:9px;padding:.8rem;margin-bottom:1rem;text-align:center'>";
    h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Pedido</div>";
    h += "<div style='font-size:1.05rem;font-weight:700;color:var(--dark);margin:.15rem 0'>"+_catEsc(ped.nro_orden||"#"+pedId)+"</div>";
    h += "<div style='font-size:.7rem;color:var(--mid)'>"+_catFmtFecha(ped.created_at, true)+"</div>";
    h += "<div style='font-size:1.4rem;font-weight:800;color:var(--accent);margin-top:.4rem'>"+_catFmtMoney(ped.total)+"</div>";
    if(ped.cobrado_parcial && ped.cobrado_parcial>0 && ped.estado!=="cobrado"){
      h += "<div style='font-size:.72rem;color:#5a8a4a;margin-top:.2rem'>Pagado: "+_catFmtMoney(ped.cobrado_parcial)+" · Resta: "+_catFmtMoney((ped.total||0)-ped.cobrado_parcial)+"</div>";
    }
    h += "</div>";

    // Estado actual destacado
    var estLab = _catEstadoLabel(ped);
    var estCol = _catEstadoColor(ped);
    h += "<div style='display:flex;align-items:center;gap:.5rem;padding:.6rem .8rem;background:"+estCol+"15;border:1px solid "+estCol+"40;border-radius:8px;margin-bottom:1rem'>";
    h += "<span style='width:9px;height:9px;border-radius:50%;background:"+estCol+";flex-shrink:0'></span>";
    h += "<span style='font-size:.8rem;font-weight:600;color:"+estCol+"'>"+estLab+"</span>";
    h += "</div>";

    // Productos
    h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.4rem'>Productos</div>";
    h += "<div style='display:flex;flex-direction:column;gap:.4rem;margin-bottom:1.2rem'>";
    if(!items.length){
      h += "<div style='font-size:.8rem;color:var(--mid);font-style:italic'>Sin productos en el pedido</div>";
    } else {
      items.forEach(function(it){
        var nom = it.nombre || it.name || ("Producto #"+(it.id||"?"));
        var cant = parseInt(it.cant || it.qty || 1) || 1;
        var sub = it.subtotal || ((it.precio||it.price||0) * cant);
        var esCombo = it.isCombo || (it.segmento==="combo");
        // Si es combo, intentar mostrar qué incluye buscándolo en combosPublicos
        var comboItemsHtml = "";
        if(esCombo && it.combo_id){
          var combo = (combosPublicos||[]).find(function(c){return c.id===it.combo_id;});
          if(combo && combo.combo_items && combo.combo_items.length){
            comboItemsHtml = "<div style='margin-top:.3rem;padding:.3rem .45rem;background:#fff;border-radius:5px;border-left:2px solid var(--accent)'>";
            combo.combo_items.forEach(function(ci){
              comboItemsHtml += "<div style='font-size:.68rem;color:var(--mid)'>&check; x"+(ci.cantidad||1)+" "+_catEsc(_nomMl(ci.producto_nombre||"", ci.producto_id))+"</div>";
            });
            comboItemsHtml += "</div>";
          }
        }
        h += "<div style='display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;padding:.45rem .55rem;background:#faf5ec;border-radius:6px;font-size:.8rem'>";
        h += "<div style='min-width:0;flex:1'>";
        h += "<div style='color:var(--dark);font-weight:500'>"+(esCombo?"🎁 ":"")+_catEsc(esCombo?nom:_prodMl(nom, _mlDe(it.producto_id||it.id)))+"</div>";
        h += "<div style='font-size:.7rem;color:var(--mid);margin-top:.1rem'>x"+cant+(it.precio?" · "+_catFmtMoney(it.precio||it.price)+" c/u":"")+"</div>";
        h += comboItemsHtml;
        h += "</div>";
        h += "<div style='font-weight:600;color:var(--dark);flex-shrink:0'>"+_catFmtMoney(sub)+"</div>";
        h += "</div>";
      });
    }
    h += "</div>";

    // FIX 2026-05-16: si el pedido es CC con cuotas, mostrar el cronograma al cliente
    // Antes el cliente no veía sus cuotas individuales — solo el total. Ahora ve cuándo
    // vence cada cuota, cuánto debe, y cuáles ya pagó.
    if(ped.es_cc && ped.cc_nro_cuotas_real && ped.cc_nro_cuotas_real > 0){
      h += "<div id='_catPedCuotasBox' style='margin-bottom:1.2rem'>";
      h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.4rem'>Cuotas</div>";
      h += "<div style='text-align:center;padding:.7rem;color:var(--mid);font-size:.78rem'><div class='cat-spin' style='display:inline-block;margin-right:.3rem'></div>Cargando cuotas...</div>";
      h += "</div>";
    }

    // Notas del pedido (si las hay)
    if(ped.notas){
      h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.3rem'>Notas</div>";
      h += "<div style='background:#fef9f0;border:1px solid #f4e3c1;border-radius:7px;padding:.5rem .65rem;font-size:.78rem;color:var(--dark);margin-bottom:1.2rem'>"+_catEsc(ped.notas)+"</div>";
    }

    // Timeline de estados
    h += "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.5rem'>Seguimiento</div>";
    h += _catTimelinePedido(ped, logs);

    // 🔁 Repetir este pedido, también desde el detalle
    if(_repItems(ped).length){
      h += "<div style='margin-top:1.1rem'>";
      h += "<button onclick='_catCerrarPedido();_repAbrir("+ped.id+")' style='width:100%;background:var(--accent,#c4965a);color:#fff;border:none;border-radius:10px;padding:.75rem;font-size:.86rem;font-weight:700;cursor:pointer;font-family:inherit'>&#128257; Volver a pedir lo mismo</button>";
      h += "</div>";
    }

    // Botón "Necesito ayuda" — abre WhatsApp con mensaje pre-armado
    var nroOrden = ped.nro_orden || ("#" + ped.id);
    var msgWA = "Hola, tengo un problema con mi pedido " + nroOrden + ". ¿Me podés ayudar?";
    var waNum = (typeof waNumber !== "undefined" && waNumber) ? waNumber : (typeof WA_NUMBER !== "undefined" ? WA_NUMBER : "");
    if(waNum){
      h += "<div style='margin-top:1.2rem;padding-top:.9rem;border-top:1px solid #f0e6d3;text-align:center'>";
      h += "<a href='https://wa.me/" + waNum + "?text=" + encodeURIComponent(msgWA) + "' target='_blank' rel='noopener' style='display:inline-flex;align-items:center;gap:.4rem;font-size:.72rem;color:var(--mid);text-decoration:none;padding:.4rem .7rem;border:1px solid #e8d9bf;border-radius:6px;transition:background .15s' onmouseover='this.style.background=\"#faf5ec\"' onmouseout='this.style.background=\"transparent\"'>";
      h += "&#128172; Necesito ayuda con este pedido";
      h += "</a>";
      h += "</div>";
    }

    body.innerHTML = h;

    // FIX 2026-05-16: cargar cuotas async si el pedido es CC
    if(ped.es_cc && ped.cc_nro_cuotas_real && ped.cc_nro_cuotas_real > 0){
      _catCargarCuotasPedido(pedId);
    }
  }).catch(function(e){
    console.error("[belle-cat] _catVerPedido error:",e);
    var body = document.getElementById("_catMoPedidoBody");
    if(body) body.innerHTML = "<div style='text-align:center;color:#c5443a;padding:2rem'>Error al cargar el pedido</div>";
  });
}

function _catCerrarPedido(){
  var mo = document.getElementById("_catMoPedido");
  if(mo) mo.remove();
  // FIX 2026-05-15: desregistrar del back button
  _catModalBackDesregistrar('_catMoPedido');
}

// FIX 2026-05-16: cargar cuotas individuales de un pedido del cliente y mostrarlas
function _catCargarCuotasPedido(pedId){
  apiGet('cc_cuotas','select=*&pedido_id=eq.'+pedId+'&estado=neq.cancelada&order=nro_cuota.asc').then(function(cuotas){
    var box = document.getElementById('_catPedCuotasBox');
    if(!box) return;
    cuotas = Array.isArray(cuotas) ? cuotas : [];
    if(!cuotas.length){
      box.innerHTML = "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.4rem'>Cuotas</div>"+
        "<div style='background:#fef9f0;border:1px solid #f4e3c1;border-radius:7px;padding:.6rem .75rem;font-size:.75rem;color:#7a5a1a'>"+
        "Las cuotas se generan cuando admin/vendedor confirme tu pedido."+
        "</div>";
      return;
    }
    var h = "<div style='font-size:.7rem;color:var(--mid);text-transform:uppercase;font-weight:600;margin-bottom:.4rem'>Cuotas ("+cuotas.length+")</div>";
    var totalCuotas = 0;
    var pagadoCuotas = 0;
    cuotas.forEach(function(cu){ totalCuotas += parseFloat(cu.monto)||0; pagadoCuotas += parseFloat(cu.monto_pagado)||0; });
    h += "<div style='background:linear-gradient(135deg,#fdf8f0,#faf5ec);border:1px solid #e8d9bf;border-radius:9px;padding:.5rem .65rem'>";
    cuotas.forEach(function(cu){
      var pagado = parseFloat(cu.monto_pagado)||0;
      var monto = parseFloat(cu.monto)||0;
      var pendiente = monto - pagado;
      var hoy = new Date(); hoy.setHours(0,0,0,0);
      var fVenc = new Date(cu.fecha_vencimiento+"T00:00:00");
      var diasGracia = parseInt(cu.dias_gracia)||0;
      var fLimite = new Date(fVenc); fLimite.setDate(fLimite.getDate()+diasGracia);
      var dias = Math.floor((fLimite-hoy)/86400000);
      var ic, col, lbl;
      if(cu.estado === 'pagada'){
        ic='✓'; col='#3a6f2a'; lbl='Pagada';
      } else if(cu.estado === 'parcial'){
        ic='◑'; col='#a06820'; lbl='Parcial';
      } else if(dias < 0){
        ic='⚠'; col='#b53939'; lbl='Vencida hace '+(-dias)+'d';
      } else if(dias === 0){
        ic='🔔'; col='#a06820'; lbl='Vence hoy';
      } else if(dias <= 3){
        ic='⏰'; col='#a06820'; lbl='Vence en '+dias+'d';
      } else {
        ic='⏳'; col='var(--mid)'; lbl='En '+dias+'d';
      }
      h += "<div style='display:flex;justify-content:space-between;align-items:center;padding:.4rem 0;border-bottom:1px solid rgba(196,150,90,.18);font-size:.78rem'>";
      h += "<div style='flex:1;min-width:0'>";
      h += "<div style='color:"+col+";font-weight:600'>"+ic+" Cuota "+cu.nro_cuota+"/"+cu.total_cuotas+"</div>";
      h += "<div style='font-size:.65rem;color:var(--mid);margin-top:.05rem'>"+_catFmtFechaCorta(cu.fecha_vencimiento)+" · "+lbl+"</div>";
      h += "</div>";
      h += "<div style='text-align:right;flex-shrink:0'>";
      if(cu.estado === 'pagada'){
        h += "<div style='font-size:.75rem;font-weight:700;color:#3a6f2a'>"+_catFmtMoney(monto)+"</div>";
        h += "<div style='font-size:.62rem;color:var(--mid)'>pagada</div>";
      } else {
        h += "<div style='font-size:.85rem;font-weight:700;color:"+col+"'>"+_catFmtMoney(pendiente)+"</div>";
        if(pagado>0){
          h += "<div style='font-size:.62rem;color:var(--mid)'>de "+_catFmtMoney(monto)+"</div>";
        }
      }
      h += "</div>";
      h += "</div>";
    });
    var pendienteTotal = totalCuotas - pagadoCuotas;
    h += "<div style='display:flex;justify-content:space-between;padding-top:.45rem;margin-top:.2rem;font-size:.75rem;font-weight:700'>";
    h += "<span style='color:var(--dark)'>Pendiente total:</span>";
    h += "<span style='color:"+(pendienteTotal>0?'#b53939':'#3a6f2a')+"'>"+_catFmtMoney(pendienteTotal)+"</span>";
    h += "</div>";
    h += "</div>";
    box.innerHTML = h;
  }).catch(function(e){
    console.error('[cat cuotas pedido]',e);
    var box = document.getElementById('_catPedCuotasBox');
    if(box) box.innerHTML = "<div style='font-size:.72rem;color:#b53939'>Error cargando cuotas</div>";
  });
}

// Timeline visual del pedido — etapas FIJAS según estado real
function _catTimelinePedido(ped, logs){
  // Etapas fijas que el cliente ve. Cada etapa puede estar:
  //  - "pendiente" (gris, no llegó todavía)
  //  - "actual"    (dorado, etapa actual del pedido)
  //  - "completado" (verde, ya pasó)
  // El estado del pedido determina hasta dónde llegamos.
  // Si está cancelado, lo mostramos al final con su propia etapa.

  var estado = (ped.estado || "pendiente").toLowerCase();
  var estadoEnvio = (ped.estado_envio || "").toLowerCase();
  var cancelado = estado === "cancelado";

  // Mapeo: ¿qué etapa está completada según el estado?
  // Etapas (en orden):
  //   1. recibido       → cuando admin/vendedor lo confirma (estado pasa a "reservado")
  //   2. preparando     → cuando hay pago registrado (cobrado_parcial o cobrado_total > 0)
  //   3. en_reparto     → cuando se asigna a una ruta (estado_envio = "en_reparto")
  //   4. cobrado        → cuando el pedido está totalmente pagado (estado = "cobrado")
  // Mientras está en "pendiente": ninguna etapa marcada como completa, todas pendientes.

  // Determinar progreso real (índice de la última etapa completada)
  var idxCompletado = -1; // -1 = nada completado, todas grises

  // Etapa 1: Pedido recibido — solo si admin/vendedor confirmó
  if(estado === "reservado" || estado === "cobrado_parcial" || estado === "cobrado" || estadoEnvio === "en_preparacion" || estadoEnvio === "en_reparto" || estadoEnvio === "entregado"){
    idxCompletado = 0;
  }
  // Etapa 2: Preparando pedido — cuando hay pago registrado
  var hayPago = (parseFloat(ped.cobrado_total)||0) > 0 || (parseFloat(ped.cobrado_parcial)||0) > 0;
  if(hayPago || estado === "cobrado_parcial" || estado === "cobrado" || estadoEnvio === "en_preparacion" || estadoEnvio === "en_reparto" || estadoEnvio === "entregado"){
    idxCompletado = Math.max(idxCompletado, 1);
  }
  // Etapa 3: En reparto
  if(estadoEnvio === "en_reparto" || estadoEnvio === "entregado"){
    idxCompletado = Math.max(idxCompletado, 2);
  }
  // Etapa 4: Cobrado completo
  if(estado === "cobrado"){
    idxCompletado = 3;
  }

  // Construir las fechas de cada etapa desde los logs (si existen)
  var fechasEtapa = {};
  // Etapa 0 (recibido) → log.estado === "reservado"
  // Etapa 1 (preparando) → primer registro en cc_pagos del pedido o log.estado === "cobrado_parcial"
  // Etapa 2 (en_reparto) → log.estado_envio === "en_reparto" o log.estado === "en_reparto"
  // Etapa 3 (cobrado) → ped.cobrado_at o log.estado === "cobrado"
  if(Array.isArray(logs)){
    logs.forEach(function(l){
      var e = (l.estado||"").toLowerCase();
      if(e === "reservado" && !fechasEtapa[0]) fechasEtapa[0] = l.created_at;
      if((e === "cobrado_parcial" || e === "en_preparacion") && !fechasEtapa[1]) fechasEtapa[1] = l.created_at;
      if((e === "en_reparto") && !fechasEtapa[2]) fechasEtapa[2] = l.created_at;
      if(e === "cobrado" && !fechasEtapa[3]) fechasEtapa[3] = l.created_at;
    });
  }
  // Fallback: si no hay log de "cobrado", usar ped.cobrado_at
  if(!fechasEtapa[3] && ped.cobrado_at) fechasEtapa[3] = ped.cobrado_at;

  // Etapas a mostrar
  var etapas = [
    {label:"Pedido recibido",   icon:"&#128230;", desc:"Tu pedido fue recibido por nuestro equipo"},
    {label:"Preparando pedido", icon:"&#127922;", desc:"Estamos preparando tu pedido"},
    {label:"En reparto",        icon:"&#128666;", desc:"Tu pedido está en camino"},
    {label:"Pedido cobrado",    icon:"&check;",   desc:"Pedido completado y cobrado"}
  ];

  // Si está cancelado, mostrar mensaje especial
  if(cancelado){
    var h = "<div style='background:#fde8e8;border:1px solid #e8a8a8;border-radius:8px;padding:.7rem .9rem;display:flex;align-items:center;gap:.6rem'>";
    h += "<div style='font-size:1.4rem'>&#10060;</div>";
    h += "<div style='flex:1'>";
    h += "<div style='font-size:.85rem;font-weight:700;color:#9a2a22'>Pedido cancelado</div>";
    h += "<div style='font-size:.7rem;color:#7a3530;margin-top:.1rem'>Si tenés dudas, contactá a tu vendedor</div>";
    h += "</div></div>";
    return h;
  }

  // Render
  var h = "<div style='position:relative;padding-left:1.4rem'>";
  // Línea vertical
  h += "<div style='position:absolute;left:.45rem;top:.5rem;bottom:.5rem;width:2px;background:#e8d9bf'></div>";

  etapas.forEach(function(et, idx){
    // Estado de esta etapa
    var completado = idx <= idxCompletado;
    var actual = idx === idxCompletado + 1; // próxima etapa pendiente

    var dotBg, dotBorder, txtColor, descColor;
    if(completado){
      dotBg = "#5a8a4a";       // verde
      dotBorder = "#5a8a4a";
      txtColor = "var(--dark)";
      descColor = "var(--mid)";
    } else if(actual){
      dotBg = "#c4965a";       // dorado (siguiente)
      dotBorder = "#c4965a";
      txtColor = "var(--dark)";
      descColor = "var(--mid)";
    } else {
      dotBg = "#fff";          // pendiente
      dotBorder = "#d4c4a4";
      txtColor = "#a08c6a";
      descColor = "#b8a888";
    }

    h += "<div style='position:relative;padding:.35rem 0 .6rem;padding-left:.3rem'>";
    h += "<div style='position:absolute;left:-1.4rem;top:.45rem;width:14px;height:14px;border-radius:50%;background:"+dotBg+";border:3px solid #fff;box-shadow:0 0 0 1.5px "+dotBorder+"'></div>";
    h += "<div style='display:flex;justify-content:space-between;align-items:flex-start;gap:.4rem'>";
    h += "<div style='min-width:0;flex:1'>";
    h += "<div style='font-size:.8rem;font-weight:600;color:"+txtColor+"'>"+et.icon+" "+et.label+"</div>";
    h += "<div style='font-size:.66rem;color:"+descColor+";margin-top:.1rem'>"+et.desc+"</div>";
    h += "</div>";
    if(completado && fechasEtapa[idx]){
      h += "<div style='font-size:.62rem;color:var(--mid);flex-shrink:0;text-align:right'>"+_catFmtFecha(fechasEtapa[idx], true)+"</div>";
    }
    h += "</div>";
    h += "</div>";
  });
  h += "</div>";
  return h;
}

// ════════════════════════════════════════════════════════════════════
// FASE B Sub-bloque 4 — DIRECCIONES (Google Maps + Andreani)
// ════════════════════════════════════════════════════════════════════

// Coordenadas de referencia: centro de Córdoba Capital, Argentina
// Cambiar después por la dirección exacta del depósito de Belle
var BELLE_DEPOSITO_LAT = -31.4201;
var BELLE_DEPOSITO_LNG = -64.1888;
var BELLE_RADIO_KM = 40;       // Si está más lejos: envío por Andreani
// (BELLE_PAQAR_MIN_UNIDADES eliminada — el sistema viejo de Paq.ar fue reemplazado por Andreani con tarifas por zona)

// Estado del selector de direcciones (se reinicia cada vez que se abre)
var _catDir = {
  map: null,
  marker: null,
  autocomplete: null,
  pos: null,        // {lat, lng}
  componentes: {},  // calle, numero, ciudad, etc — extraídos de Place
  direccionFmt: "",
  distanciaKm: null,
  modoEntrega: "vendedor", // "vendedor" o "correo"
  cb: null          // callback al guardar
};

// Calcula distancia en km entre dos puntos (Haversine)
function _catDistKm(lat1, lng1, lat2, lng2){
  var R = 6371;
  var dLat = (lat2-lat1) * Math.PI/180;
  var dLng = (lng2-lng1) * Math.PI/180;
  var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
          Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180) *
          Math.sin(dLng/2)*Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Carga el SDK de Google Maps la primera vez que hace falta y espera a que esté listo
function _catGmapsCargar(){
  if(window._gmapsScript) return;
  window._gmapsScript=true;
  var sc=document.createElement('script');
  sc.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDNoIeGswrjA2FcL2G4ZUPi6iu5Wzf68cY&libraries=places&loading=async&language=es&region=AR";
  sc.async=true; sc.defer=true;
  sc.onerror=function(){ window._gmapsScript=false; };
  document.head.appendChild(sc);
}
function _catGmapsReady(){
  try{ _catGmapsCargar(); }catch(e){}
  return new Promise(function(resolve, reject){
    var max = 150; // 15 segundos máximo (ahora se baja recién acá; en 3G tarda un poco más)
    var i = 0;
    var t = setInterval(function(){
      if(window.google && window.google.maps && window.google.maps.places){
        clearInterval(t);
        resolve();
      } else if(++i > max){
        clearInterval(t);
        reject(new Error("Google Maps no se cargó (¿problemas de red? ¿API key inválida?)"));
      }
    }, 100);
  });
}

// ── Modal selector de domicilio (REUTILIZABLE: registro y panel) ────
// callback(direccion) recibe el objeto completo o null si canceló.
function _catAbrirSelectorDomicilio(opts){
  opts = opts || {};
  var titulo = opts.titulo || "Agregar dirección";
  var direccionExistente = opts.direccion || null;
  _catDir.cb = opts.cb || function(){};
  _catDir.pedirTelefono = !!opts.pedirTelefono; // Nuevo: si true, muestra campo de teléfono y lo valida
  _catDir.pos = direccionExistente && direccionExistente.lat ? {lat: direccionExistente.lat, lng: direccionExistente.lng} : null;
  _catDir.componentes = direccionExistente ? {
    calle: direccionExistente.calle || "",
    numero: direccionExistente.numero || "",
    barrio: direccionExistente.barrio || "",
    ciudad: direccionExistente.localidad || direccionExistente.ciudad || "", // BD usa "localidad"; "ciudad" por compat
    provincia: direccionExistente.provincia || "",
    pais: direccionExistente.pais || "Argentina",
    codigo_postal: direccionExistente.codigo_postal || ""
  } : {};
  _catDir.direccionFmt = direccionExistente ? (direccionExistente.direccion_completa || "") : "";
  _catDir.distanciaKm = direccionExistente ? direccionExistente.distancia_km : null;
  // Si edita una dirección existente, conservar su modo_entrega (puede ser 'vendedor' legacy).
  // Si crea una nueva, default 'domicilio' — _catActualizarAvisoDistancia lo sobreescribirá según radio.
  _catDir.modoEntrega = direccionExistente ? (direccionExistente.modo_entrega || "domicilio") : "domicilio";

  var mo = document.getElementById("_catMoDir");
  if(!mo){
    mo = document.createElement("div");
    mo.id = "_catMoDir";
    mo.style.cssText = "position:fixed;inset:0;background:rgba(20,15,8,.75);z-index:1300;display:flex;align-items:center;justify-content:center;padding:.5rem";
    document.body.appendChild(mo);
    // FIX 2026-05-15: registrar para botón atrás del celular (cierra cancelando)
    _catModalBackRegistrar('_catMoDir', function(){ _catCerrarSelectorDir(false); });
  }
  mo.innerHTML = "<div style='background:#fff;border-radius:14px;max-width:600px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.3)'>"+
    "<div style='padding:.9rem 1.1rem;border-bottom:1px solid #e8d9bf;display:flex;justify-content:space-between;align-items:center;flex-shrink:0'>"+
      "<div style='font-size:.95rem;font-weight:700;color:var(--dark)'>"+_catEsc(titulo)+"</div>"+
      "<button onclick='_catCerrarSelectorDir(false)' style='background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--mid);padding:0;line-height:1'>&times;</button>"+
    "</div>"+
    "<div style='overflow-y:auto;padding:.9rem 1.1rem;flex:1' id='_catDirBody'>"+
      "<div style='text-align:center;padding:2rem 1rem;color:var(--mid)'><div class='cat-spin' style='margin-bottom:.5rem'></div>Cargando mapa...</div>"+
    "</div>"+
    "</div>";

  _catGmapsReady().then(function(){
    _catRenderSelectorDirUI();
  }).catch(function(e){
    console.error("[belle-cat] Google Maps no cargó:",e);
    var b = document.getElementById("_catDirBody");
    if(b) b.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:#c5443a'>"+
      "<div style='font-size:2rem;margin-bottom:.5rem'>&#9888;</div>"+
      "<div style='font-weight:600;margin-bottom:.3rem'>No se pudo cargar el mapa</div>"+
      "<div style='font-size:.78rem;color:var(--mid)'>Revisá tu conexión a internet</div>"+
      "<button onclick='_catCerrarSelectorDir(false)' style='margin-top:1rem;background:var(--accent);color:#fff;border:none;padding:.5rem 1rem;border-radius:6px;cursor:pointer'>Cerrar</button>"+
      "</div>";
  });
}

function _catCerrarSelectorDir(guardar){
  if(guardar && _catDir.cb){
    // Disparar callback con los datos
    var datos = _catRecolectarDir();
    if(!datos) return; // validación falló
    _catDir.cb(datos);
  }
  var mo = document.getElementById("_catMoDir");
  if(mo) mo.remove();
  _catDir.map = null;
  _catDir.marker = null;
  _catDir.autocomplete = null;
  // FIX 2026-05-15: desregistrar del back button
  _catModalBackDesregistrar('_catMoDir');
}

// Renderiza el form interno del modal selector
function _catRenderSelectorDirUI(){
  var b = document.getElementById("_catDirBody");
  if(!b) return;
  var pos = _catDir.pos || {lat: BELLE_DEPOSITO_LAT, lng: BELLE_DEPOSITO_LNG};
  var c = _catDir.componentes || {};

  var h = "";

  // ─── Campo TELÉFONO (solo si se pidió explícitamente, ej: cliente Google sin tel cargado) ───
  if(_catDir.pedirTelefono){
    h += "<div style='background:rgba(196,150,90,.08);border:2px solid var(--accent);border-radius:10px;padding:.7rem .8rem;margin-bottom:.8rem'>";
    h += "<div style='font-size:.7rem;color:var(--accent);text-transform:uppercase;font-weight:700;letter-spacing:.05em;margin-bottom:.3rem;display:flex;align-items:center;gap:.4rem'>";
    h += "<span style='font-size:1rem'>&#128241;</span> Teléfono de contacto";
    h += "</div>";
    h += "<input type='tel' id='_catDirTelefono' inputmode='numeric' placeholder='Ej: 3515121193 (10 dígitos, sin 0 ni 15)' style='width:100%;padding:.55rem .75rem;border:1px solid #d4ba8a;border-radius:7px;font-size:.92rem;background:#fff;color:var(--dark);box-sizing:border-box;font-family:inherit;outline:none'>";
    h += "<div style='font-size:.66rem;color:var(--mid);margin-top:.35rem'>Lo necesitamos para contactarte sobre tu pedido. 10 dígitos, sin 0 ni 15.</div>";
    h += "</div>";
  }

  // Buscador prominente con autocomplete + fallback con botón
  h += "<div style='background:linear-gradient(135deg, #fdf8f0, #faf5ec);border:2px solid var(--accent);border-radius:10px;padding:.7rem .8rem;margin-bottom:.8rem'>";
  h += "<div style='font-size:.7rem;color:var(--accent);text-transform:uppercase;font-weight:700;letter-spacing:.05em;margin-bottom:.3rem;display:flex;align-items:center;gap:.4rem'>";
  h += "<span style='font-size:1rem'>&#128269;</span> Buscar mi dirección en Google Maps";
  h += "</div>";
  h += "<div style='display:flex;gap:.4rem'>";
  h += "<input type='text' id='_catDirSearch' placeholder='Ej: Av. Colón 1234 Córdoba' autocomplete='off' style='flex:1;padding:.6rem .75rem;border:1px solid #d4ba8a;border-radius:7px;font-size:.92rem;background:#fff;color:var(--dark);box-sizing:border-box;font-family:inherit;outline:none' onkeydown='if(event.key===\"Enter\"){event.preventDefault();_catBuscarDireccionManual();}'>";
  h += "<button onclick='_catBuscarDireccionManual()' style='background:var(--accent);color:#fff;border:none;padding:.6rem 1rem;border-radius:7px;font-size:.85rem;font-weight:600;cursor:pointer;flex-shrink:0' title='Buscar'>Buscar</button>";
  h += "</div>";
  h += "<div style='font-size:.66rem;color:var(--mid);margin-top:.35rem'>Escribí calle + número + ciudad. Mientras escribís te aparecen sugerencias.</div>";
  h += "</div>";

  // Mapa
  h += "<div id='_catDirMap' style='width:100%;height:240px;border-radius:9px;border:1px solid #e8d9bf;background:#f5f0e8;margin-bottom:.5rem'></div>";
  h += "<div style='font-size:.66rem;color:var(--mid);margin-bottom:1rem;text-align:center'>Arrastrá el alfiler para ajustar la ubicación exacta</div>";

  // Aviso de distancia (se llena al actualizar pin)
  h += "<div id='_catDirAviso' style='margin-bottom:1rem'></div>";

  // Campos editables
  h += "<div style='margin-bottom:.5rem'><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Etiqueta *</label>";
  h += "<input type='text' id='_catDirEtiqueta' placeholder='Casa, Trabajo...' value='"+_catEsc((c.etiqueta||"Casa"))+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<div style='display:grid;grid-template-columns:2fr 1fr 1fr;gap:.5rem;margin-bottom:.5rem'>";
  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Calle *</label>";
  h += "<input type='text' id='_catDirCalle' value='"+_catEsc(c.calle||"")+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Número *</label>";
  h += "<input type='text' id='_catDirNumero' value='"+_catEsc(c.numero||"")+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Piso/Depto</label>";
  h += "<input type='text' id='_catDirPiso' placeholder='Ej: 3B' value='"+_catEsc(c.piso_depto||"")+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "</div>";

  h += "<div style='margin-bottom:.5rem'><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Barrio</label>";
  h += "<input type='text' id='_catDirBarrio' value='"+_catEsc(c.barrio||"")+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";

  h += "<div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem;margin-bottom:.5rem'>";
  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Ciudad *</label>";
  h += "<input type='text' id='_catDirCiudad' value='"+_catEsc(c.ciudad||"")+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Provincia *</label>";
  h += "<input type='text' id='_catDirProvincia' value='"+_catEsc(c.provincia||"")+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "<div><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>CP *</label>";
  h += "<input type='text' id='_catDirCP' value='"+_catEsc(c.codigo_postal||"")+"' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.84rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit'></div>";
  h += "</div>";

  h += "<div style='margin-bottom:.8rem'><label style='font-size:.66rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Referencias / aclaraciones</label>";
  h += "<textarea id='_catDirRef' rows='2' placeholder='Ej: timbre rojo, portón gris, casa con árbol al frente...' style='width:100%;padding:.45rem .6rem;border:1px solid #e8d9bf;border-radius:7px;font-size:.82rem;background:#fff;color:var(--dark);margin-top:.2rem;box-sizing:border-box;font-family:inherit;resize:vertical'>"+_catEsc(_catDir.referencias||"")+"</textarea></div>";

  // Botones
  h += "<div style='display:flex;gap:.5rem;justify-content:flex-end;padding-top:.5rem;border-top:1px solid #e8d9bf'>";
  h += "<button onclick='_catCerrarSelectorDir(false)' style='background:transparent;color:var(--mid);border:1px solid #e8d9bf;padding:.55rem 1rem;border-radius:7px;font-size:.85rem;cursor:pointer'>Cancelar</button>";
  h += "<button onclick='_catCerrarSelectorDir(true)' style='background:var(--accent);color:#fff;border:none;padding:.55rem 1.2rem;border-radius:7px;font-size:.85rem;font-weight:600;cursor:pointer'>Guardar dirección</button>";
  h += "</div>";

  b.innerHTML = h;

  // Inicializar mapa, autocomplete y marker
  setTimeout(function(){
    _catInicializarMapa(pos);
  }, 50);
}

// Inicializa el mapa + marker arrastrable + autocomplete
function _catInicializarMapa(initialPos){
  var mapEl = document.getElementById("_catDirMap");
  if(!mapEl || !window.google || !window.google.maps) return;

  _catDir.map = new google.maps.Map(mapEl, {
    center: initialPos,
    zoom: _catDir.pos ? 16 : 12,
    disableDefaultUI: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    zoomControl: true,
    gestureHandling: "greedy"
  });

  _catDir.marker = new google.maps.Marker({
    position: initialPos,
    map: _catDir.map,
    draggable: true,
    title: "Tu dirección"
  });

  // Cuando el usuario arrastra el pin, recalcular distancia y actualizar aviso
  _catDir.marker.addListener("dragend", function(){
    var p = _catDir.marker.getPosition();
    _catDir.pos = {lat: p.lat(), lng: p.lng()};
    _catActualizarAvisoDistancia();
    // Geocodificar inverso para llenar campos automáticamente
    _catGeocodeReverse(_catDir.pos);
  });

  // Autocomplete del buscador
  var inp = document.getElementById("_catDirSearch");
  if(inp){
    // Verificar que Places API esté disponible
    if(!google.maps.places || !google.maps.places.Autocomplete){
      console.error("[belle-cat] google.maps.places NO está disponible. ¿Habilitaste Places API en Google Cloud?");
      _catToast("Places API no disponible — usá el botón Buscar","twarn");
    } else {
      try {
        _catDir.autocomplete = new google.maps.places.Autocomplete(inp, {
          fields: ["address_components","formatted_address","geometry","name"],
          types: ["address"],
          // Sesgo de búsqueda: Argentina, pero permite resultados de otros países si el cliente está afuera
          componentRestrictions: undefined,
          // Caja de visualización: priorizar resultados cercanos a Córdoba
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(-55.0, -73.5), // SO de Argentina
            new google.maps.LatLng(-21.7, -53.6)  // NE de Argentina
          ),
          strictBounds: false
        });
        _catDir.autocomplete.addListener("place_changed", function(){
          var place = _catDir.autocomplete.getPlace();
          _dbg("[belle-cat] place_changed:", place);
          if(!place || !place.geometry || !place.geometry.location){
            _catBuscarDireccionManual();
            return;
          }
          _catAplicarDireccionEncontrada(place.geometry.location, place.address_components || [], place.formatted_address || "");
        });
        _dbg("[belle-cat] Autocomplete inicializado correctamente. Si NO ves sugerencias mientras escribís, revisá: 1) que Places API esté activa, 2) que la API key tenga permiso para Places API, 3) que el .pac-container no esté oculto.");
      } catch(e){
        console.error("[belle-cat] Error inicializando Autocomplete:", e);
        _catToast("Sugerencias no disponibles. Usá el botón Buscar.","twarn");
      }
    }
  }

  // Si ya hay posición previa, calcular distancia ya
  if(_catDir.pos){
    _catActualizarAvisoDistancia();
  } else {
    // Posición inicial = depósito
    _catDir.pos = initialPos;
  }
}

// Aplicar resultado de búsqueda (centra el mapa, mueve marker, llena campos)
function _catAplicarDireccionEncontrada(loc, addressComponents, formattedAddress){
  _catDir.pos = {lat: typeof loc.lat==="function"?loc.lat():loc.lat, lng: typeof loc.lng==="function"?loc.lng():loc.lng};
  if(_catDir.map){
    _catDir.map.setCenter(_catDir.pos);
    _catDir.map.setZoom(17);
  }
  if(_catDir.marker){
    _catDir.marker.setPosition(_catDir.pos);
  }
  _catDir.direccionFmt = formattedAddress || "";
  _catParsearComponentes(addressComponents || []);
  _catActualizarCamposUI();
  _catActualizarAvisoDistancia();
}

// Búsqueda manual con Geocoder (fallback si Autocomplete no funciona o el usuario aprieta el botón)
function _catBuscarDireccionManual(){
  var inp = document.getElementById("_catDirSearch");
  if(!inp) return;
  var q = (inp.value || "").trim();
  if(!q){_catToast("Escribí una dirección primero","twarn");return;}
  if(!window.google || !window.google.maps){_catToast("El mapa todavía está cargando, esperá un segundo","twarn");return;}

  var g = new google.maps.Geocoder();
  g.geocode({address: q, region: "AR"}, function(results, status){
    if(status === "OK" && results && results[0]){
      var r = results[0];
      _catAplicarDireccionEncontrada(r.geometry.location, r.address_components || [], r.formatted_address || "");
    } else if(status === "ZERO_RESULTS"){
      _catToast("No encontramos esa dirección. Probá con más detalles (ciudad).","twarn");
    } else if(status === "REQUEST_DENIED"){
      _catToast("Error de permisos en Google Maps. Avisanos.","terr");
      console.error("[belle-cat] Geocoder REQUEST_DENIED — revisar restricciones de la API key");
    } else {
      _catToast("Error al buscar: "+status,"terr");
      console.error("[belle-cat] Geocoder error:", status);
    }
  });
}

// Geocoding inverso: dado un punto, obtener calle, número, etc
function _catGeocodeReverse(pos){
  if(!window.google || !window.google.maps) return;
  var g = new google.maps.Geocoder();
  g.geocode({location: pos}, function(results, status){
    if(status === "OK" && results && results[0]){
      var r = results[0];
      _catDir.direccionFmt = r.formatted_address || "";
      _catParsearComponentes(r.address_components || []);
      _catActualizarCamposUI();
    }
  });
}

// Extrae los componentes (calle, número, ciudad, etc) de un Place
function _catParsearComponentes(comps){
  var c = {};
  comps.forEach(function(comp){
    var types = comp.types || [];
    if(types.indexOf("street_number") >= 0)         c.numero = comp.long_name;
    else if(types.indexOf("route") >= 0)            c.calle = comp.long_name;
    else if(types.indexOf("sublocality") >= 0 || types.indexOf("sublocality_level_1") >= 0) c.barrio = comp.long_name;
    else if(types.indexOf("locality") >= 0)         c.ciudad = comp.long_name;
    else if(types.indexOf("administrative_area_level_2") >= 0 && !c.ciudad) c.ciudad = comp.long_name;
    else if(types.indexOf("administrative_area_level_1") >= 0) c.provincia = comp.long_name;
    else if(types.indexOf("country") >= 0)          c.pais = comp.long_name;
    else if(types.indexOf("postal_code") >= 0)      c.codigo_postal = comp.long_name;
  });
  // Mergear con lo que ya hay (preserva etiqueta y piso_depto)
  _catDir.componentes = Object.assign({}, _catDir.componentes, c);
}

// Refresca los inputs del form con _catDir.componentes
function _catActualizarCamposUI(){
  var c = _catDir.componentes || {};
  var ids = {
    "_catDirCalle": c.calle,
    "_catDirNumero": c.numero,
    "_catDirBarrio": c.barrio,
    "_catDirCiudad": c.ciudad,
    "_catDirProvincia": c.provincia,
    "_catDirCP": c.codigo_postal
  };
  Object.keys(ids).forEach(function(id){
    var el = document.getElementById(id);
    if(el && ids[id]) el.value = ids[id];
  });
}

// Calcula distancia y muestra aviso (verde dentro del radio / amarillo fuera del radio)
function _catActualizarAvisoDistancia(){
  var avi = document.getElementById("_catDirAviso");
  if(!avi || !_catDir.pos) return;
  var dist = _catDistKm(BELLE_DEPOSITO_LAT, BELLE_DEPOSITO_LNG, _catDir.pos.lat, _catDir.pos.lng);
  _catDir.distanciaKm = Math.round(dist * 10) / 10;
  if(dist <= BELLE_RADIO_KM){
    _catDir.modoEntrega = "domicilio";
    avi.innerHTML = "<div style='background:#e8f5e0;border:1px solid #b8d8a8;border-radius:7px;padding:.55rem .75rem;font-size:.78rem;color:#3a6f2a;display:flex;align-items:center;gap:.5rem'>"+
      "<span style='font-size:1.1rem'>&check;</span>"+
      "<div><b>Envío a domicilio disponible (gratis)</b><br><span style='font-size:.7rem'>Estás a "+_catDir.distanciaKm+" km del centro</span></div>"+
      "</div>";
  } else {
    _catDir.modoEntrega = "andreani";
    avi.innerHTML = "<div style='background:#fef9e8;border:1px solid #f4d987;border-radius:7px;padding:.6rem .75rem;font-size:.78rem;color:#7a5a1a'>"+
      "<div style='font-weight:600;margin-bottom:.2rem'>&#128230; Envío por Andreani</div>"+
      "<div style='font-size:.72rem;line-height:1.4'>Estás a "+_catDir.distanciaKm+" km del centro, fuera del radio de envío a domicilio. El costo del envío se calcula al confirmar el pedido según tu zona.</div>"+
      "<div style='font-size:.7rem;margin-top:.3rem;color:#8a6f3a'>Asegurate de completar bien todos los campos: calle, número, ciudad, provincia y código postal.</div>"+
      "</div>";
  }
}

// Recolecta los datos del form para guardar
function _catRecolectarDir(){
  var etiqueta = (document.getElementById("_catDirEtiqueta")||{value:""}).value.trim();
  var calle = (document.getElementById("_catDirCalle")||{value:""}).value.trim();
  var numero = (document.getElementById("_catDirNumero")||{value:""}).value.trim();
  var barrio = (document.getElementById("_catDirBarrio")||{value:""}).value.trim();
  var ciudad = (document.getElementById("_catDirCiudad")||{value:""}).value.trim();
  var provincia = (document.getElementById("_catDirProvincia")||{value:""}).value.trim();
  var cp = (document.getElementById("_catDirCP")||{value:""}).value.trim();
  var piso = (document.getElementById("_catDirPiso")||{value:""}).value.trim();
  var ref = (document.getElementById("_catDirRef")||{value:""}).value.trim();

  // ─── Si se pidió teléfono, validarlo (formato argentino: 10 dígitos sin 0 ni 15) ───
  var telefono = null;
  if(_catDir.pedirTelefono){
    var telRaw = (document.getElementById("_catDirTelefono")||{value:""}).value.trim();
    var telDigits = telRaw.replace(/\D/g,"");
    if(!telDigits){
      _catToast("Ingresá tu teléfono","twarn"); return null;
    }
    // Sacar el 0 inicial si lo puso por costumbre (ej: 0351...)
    if(telDigits.length === 11 && telDigits.charAt(0) === "0") telDigits = telDigits.substring(1);
    // Sacar el 15 después del código de área (ej: 3515 + 15 + nro → 11 dígitos)
    if(telDigits.length === 12 && telDigits.substring(3,5) === "15"){
      telDigits = telDigits.substring(0,3) + telDigits.substring(5);
    }
    if(telDigits.length === 11 && telDigits.substring(2,4) === "15"){
      // ej: 35 + 15 + 12345678 → quitar 15
      telDigits = telDigits.substring(0,2) + telDigits.substring(4);
    }
    if(telDigits.length !== 10){
      _catToast("El teléfono debe tener 10 dígitos (ej: 3515121193, sin 0 ni 15)","twarn"); return null;
    }
    telefono = telDigits;
  }

  // Validaciones
  if(!etiqueta){_catToast("Ingresá una etiqueta (Casa, Trabajo...)","twarn");return null;}
  if(!calle){_catToast("Falta la calle","twarn");return null;}
  if(!numero){_catToast("Falta el número","twarn");return null;}
  if(!ciudad){_catToast("Falta la ciudad","twarn");return null;}
  if(!provincia){_catToast("Falta la provincia","twarn");return null;}
  if(!cp){_catToast("Falta el código postal","twarn");return null;}
  if(!_catDir.pos){_catToast("Buscá tu dirección en el mapa primero","twarn");return null;}

  var dirCompleta = calle+" "+numero+(piso?", "+piso:"")+", "+ciudad+", "+provincia+(cp?", CP "+cp:"")+", "+(_catDir.componentes.pais||"Argentina");
  // Devolvemos los datos con los nombres reales de las columnas en la BD:
  //  - "localidad" (no "ciudad")
  //  - "es_principal" (no "principal", aunque la BD también tiene "principal" como columna extra; usamos la oficial)
  var datos = {
    etiqueta: etiqueta,
    calle: calle,
    numero: numero,
    piso_depto: piso || null,
    barrio: barrio || null,
    localidad: ciudad,         // mapeo: nuestra var "ciudad" -> columna "localidad"
    provincia: provincia,
    codigo_postal: cp,
    pais: _catDir.componentes.pais || "Argentina",
    direccion_completa: dirCompleta,
    lat: _catDir.pos.lat,
    lng: _catDir.pos.lng,
    distancia_km: _catDir.distanciaKm,
    modo_entrega: _catDir.modoEntrega,
    referencias: ref || null
  };
  // Si capturamos teléfono, lo agregamos como propiedad especial (no es de la dirección, va al cliente)
  if(telefono){
    datos.__telefono_cliente = telefono;
  }
  return datos;
}

// ── TAB DIRECCIONES del panel del cliente ────────────────────────────
function _catRenderTabDirecciones(box){
  if(!_catCliente){box.innerHTML="<div class='empty'>Sin datos</div>";return;}
  box.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:var(--mid)'><div class='cat-spin' style='margin-bottom:.5rem'></div>Cargando direcciones...</div>";

  apiGet("clientes_direcciones","select=*&cliente_id=eq."+_catCliente.id+"&order=es_principal.desc,created_at.desc").then(function(rows){
    var dirs = Array.isArray(rows) ? rows : [];
    var h = "";

    // Botón agregar
    h += "<button onclick='_catNuevaDir()' style='width:100%;background:var(--accent);color:#fff;border:none;padding:.6rem;border-radius:8px;font-size:.85rem;font-weight:600;cursor:pointer;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;gap:.4rem'>+ Agregar nueva dirección</button>";

    if(!dirs.length){
      h += "<div style='text-align:center;padding:1.5rem 1rem;color:var(--mid);background:#faf5ec;border-radius:9px'>"+
        "<div style='font-size:2rem;margin-bottom:.4rem;opacity:.5'>&#128205;</div>"+
        "<div style='font-size:.85rem;font-weight:600;color:var(--dark);margin-bottom:.2rem'>Aún no tenés direcciones guardadas</div>"+
        "<div style='font-size:.74rem'>Agregá una para poder hacer pedidos</div>"+
        "</div>";
    } else {
      h += "<div style='display:flex;flex-direction:column;gap:.6rem'>";
      dirs.forEach(function(d){
        h += _catCardDireccion(d);
      });
      h += "</div>";
    }
    box.innerHTML = h;
  }).catch(function(e){
    console.error("[belle-cat] _catRenderTabDirecciones error:",e);
    box.innerHTML = "<div style='text-align:center;color:#c5443a;padding:2rem'>Error al cargar direcciones</div>";
  });
}

function _catCardDireccion(d){
  // Modo de entrega: actualizado a domicilio/andreani (legacy 'correo' = Andreani fuera de radio)
  var esDomicilio = d.modo_entrega === "domicilio" || d.modo_entrega === "vendedor"; // legacy 'vendedor'
  var modoLabel = esDomicilio ? "&#128666; Envío a domicilio" : "&#128230; Envío por Andreani";
  var modoColor = esDomicilio ? "#3a6f2a" : "#7a5a1a";
  var modoBg    = esDomicilio ? "#e8f5e0" : "#fef9e8";
  var esPrinc = d.es_principal || d.principal; // compat: BD tiene ambas

  var h = "";
  h += "<div style='background:#fff;border:1px solid "+(esPrinc?"var(--accent)":"#e8d9bf")+";border-radius:9px;padding:.8rem;'>";
  h += "<div style='display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.4rem'>";
  h += "<div style='min-width:0;flex:1'>";
  h += "<div style='display:flex;align-items:center;gap:.4rem;flex-wrap:wrap'>";
  h += "<span style='font-size:.9rem;font-weight:700;color:var(--dark)'>"+_catEsc(d.etiqueta||"Sin etiqueta")+"</span>";
  if(esPrinc) h += "<span style='font-size:.6rem;background:var(--accent);color:#fff;padding:.1rem .4rem;border-radius:10px;font-weight:600'>PRINCIPAL</span>";
  h += "</div>";
  h += "<div style='font-size:.78rem;color:var(--dark);margin-top:.25rem;line-height:1.4'>"+_catEsc(d.direccion_completa || ((d.calle||"")+" "+(d.numero||"")))+"</div>";
  if(d.piso_depto) h += "<div style='font-size:.72rem;color:var(--mid);margin-top:.15rem'>Piso/Depto: "+_catEsc(d.piso_depto)+"</div>";
  if(d.referencias) h += "<div style='font-size:.7rem;color:var(--mid);margin-top:.2rem;font-style:italic'>&quot;"+_catEsc(d.referencias)+"&quot;</div>";
  h += "</div>";
  h += "</div>";
  // Modo de entrega
  h += "<div style='background:"+modoBg+";border-radius:5px;padding:.3rem .55rem;font-size:.7rem;color:"+modoColor+";margin:.5rem 0;font-weight:500'>"+modoLabel+(d.distancia_km?" · "+d.distancia_km+" km":"")+"</div>";
  // Botones
  h += "<div style='display:flex;gap:.4rem;flex-wrap:wrap'>";
  if(!esPrinc){
    h += "<button onclick='_catMarcarPrincipal("+d.id+")' style='font-size:.7rem;padding:.3rem .65rem;background:transparent;border:1px solid var(--accent);color:var(--accent);border-radius:5px;cursor:pointer;font-weight:500'>&#9733; Marcar principal</button>";
  }
  h += "<button onclick='_catEditarDir("+d.id+")' style='font-size:.7rem;padding:.3rem .65rem;background:transparent;border:1px solid #c4965a;color:#c4965a;border-radius:5px;cursor:pointer'>&#9998; Editar</button>";
  h += "<button onclick='_catEliminarDir("+d.id+")' style='font-size:.7rem;padding:.3rem .65rem;background:transparent;border:1px solid #c5443a;color:#c5443a;border-radius:5px;cursor:pointer'>&times; Eliminar</button>";
  h += "</div>";
  h += "</div>";
  return h;
}

function _catNuevaDir(opts){
  opts = opts || {};
  // pedirTelefono: si true, el modal incluye campo teléfono y lo guardamos en clientes.telefono_principal
  _catAbrirSelectorDomicilio({
    titulo: opts.titulo || "Agregar dirección",
    pedirTelefono: !!opts.pedirTelefono,
    cb: function(datos){
      if(!datos || !_catCliente) return;
      // Si vino teléfono dentro de los datos, lo separamos y actualizamos el cliente
      var telefonoNuevo = datos.__telefono_cliente || null;
      if(telefonoNuevo) delete datos.__telefono_cliente;
      datos.cliente_id = _catCliente.id;
      // Si es la primera dirección, marcarla principal
      apiGet("clientes_direcciones","select=id&cliente_id=eq."+_catCliente.id+"&limit=1").then(function(prev){
        if(!prev || !prev.length) datos.es_principal = true;
        return apiPost("clientes_direcciones", datos);
      }).then(function(){
        // Si capturamos teléfono nuevo, guardarlo en el cliente
        if(telefonoNuevo){
          return apiPatch("clientes", {telefono_principal: telefonoNuevo, updated_at: new Date().toISOString()}, "id=eq."+_catCliente.id).then(function(){
            // Actualizar el objeto cliente local
            _catCliente.telefono_principal = telefonoNuevo;
          });
        }
      }).then(function(){
        _catToast("Datos guardados","tok");
        _catRenderTab();
        // Si había callback externo (ej: continuación de un pedido), invocarlo
        if(typeof opts.onComplete === "function") opts.onComplete();
      }).catch(function(e){
        console.error("[belle-cat] _catNuevaDir error:",e);
        _catToast("Error al guardar","terr");
      });
    }
  });
}

function _catEditarDir(id){
  apiGet("clientes_direcciones","select=*&id=eq."+id+"&limit=1").then(function(rows){
    var d = rows && rows[0];
    if(!d) return;
    _catAbrirSelectorDomicilio({
      titulo: "Editar dirección",
      direccion: d,
      cb: function(datos){
        if(!datos) return;
        apiPatch("clientes_direcciones", Object.assign({}, datos, {updated_at:new Date().toISOString()}), "id=eq."+id).then(function(){
          _catToast("Dirección actualizada","tok");
          _catRenderTab();
        }).catch(function(e){
          console.error("[belle-cat] editar dir error:",e);
          _catToast("Error al actualizar","terr");
        });
      }
    });
  });
}

function _catEliminarDir(id){
  _catModalConfirm({
    titulo: 'Eliminar dirección',
    mensaje: '¿Querés eliminar esta dirección? Esta acción no se puede deshacer.',
    confirmTxt: 'Sí, eliminar',
    cancelTxt: 'Cancelar',
    icono: '🗑️',
    peligroso: true,
    onConfirm: function(){
      apiDelete("clientes_direcciones", "id=eq."+id).then(function(){
        _catToast("Dirección eliminada","tok");
        _catRenderTab();
      }).catch(function(e){
        console.error("[belle-cat] eliminar dir error:",e);
        _catToast("Error al eliminar","terr");
      });
    }
  });
}

function _catMarcarPrincipal(id){
  if(!_catCliente) return;
  // Primero, desmarcar todas las del cliente
  apiPatch("clientes_direcciones", {es_principal: false}, "cliente_id=eq."+_catCliente.id).then(function(){
    // Después marcar la elegida
    return apiPatch("clientes_direcciones", {es_principal: true}, "id=eq."+id);
  }).then(function(){
    _catToast("Dirección principal actualizada","tok");
    _catRenderTab();
  }).catch(function(e){
    console.error("[belle-cat] marcar principal error:",e);
    _catToast("Error","terr");
  });
}

// Después del registro: forzar carga del primer domicilio
function _catPedirPrimerDomicilio(){
  // Asegurarse que el drawer esté abierto
  var dw = document.getElementById("drawerCuenta");
  if(dw && !dw.classList.contains("open")){
    toggleMiCuenta();
  }
  // CRÍTICO: re-cargar _catCliente por email para asegurar que tenga el ID correcto
  // (apiPost a veces devuelve datos incompletos según config de Supabase)
  var emailSesion = _catSession && _catSession.user ? _catSession.user.email : null;
  var prep = (_catCliente && _catCliente.id) ? Promise.resolve(_catCliente)
    : (emailSesion ? apiGet("clientes","select=*&email=ilike."+encodeURIComponent(emailSesion)+"&limit=1").then(function(rows){
        if(rows && rows[0]){_catCliente = rows[0]; return rows[0];}
        return null;
      }) : Promise.resolve(null));

  prep.then(function(){
    if(!_catCliente || !_catCliente.id){
      console.error("[belle-cat] _catPedirPrimerDomicilio: no hay _catCliente todavía. Email sesión:",emailSesion);
      _catToast("Datos cargando, esperá un segundo y reintentá","twarn");
      return;
    }
    _dbg("[belle-cat] Pidiendo primer domicilio para cliente #"+_catCliente.id);

    _catAbrirSelectorDomicilio({
      titulo: "Cargá tu primera dirección",
      cb: function(datos){
        if(!datos){
          console.error("[belle-cat] callback primer domicilio: datos null");
          return;
        }
        if(!_catCliente || !_catCliente.id){
          console.error("[belle-cat] callback primer domicilio: _catCliente no disponible");
          _catToast("Error: no se pudo identificar tu cuenta","terr");
          return;
        }
        datos.cliente_id = _catCliente.id;
        datos.es_principal = true;
        _dbg("[belle-cat] Guardando primer domicilio:",datos);
        apiPost("clientes_direcciones", datos).then(function(resp){
          _dbg("[belle-cat] Primer domicilio guardado:",resp);
          _catToast("¡Listo! Ya podés hacer pedidos","tok");
          _catDrawerView = "panel";
          _catPanelTab = "direcciones";
          catRenderDrawer();
        }).catch(function(e){
          console.error("[belle-cat] guardar primer domicilio error:",e);
          _catToast("Error al guardar la dirección. Probá desde el panel.","terr");
          _catDrawerView = "panel";
          _catPanelTab = "direcciones";
          catRenderDrawer();
        });
      }
    });
  });
}

// ════════════════════════════════════════════════════════════════════
// FASE B Sub-bloque 6 — FAVORITOS del cliente
// ════════════════════════════════════════════════════════════════════

// Carga IDs de favoritos del cliente (se llama después del login)
function catCargarFavsIds(){
  if(!_catCliente || !_catCliente.id){_catFavs = []; return;}
  apiGet("clientes_favoritos","select=producto_id&cliente_id=eq."+_catCliente.id)
    .then(function(rows){
      _catFavs = (Array.isArray(rows) ? rows : []).map(function(r){return r.producto_id;});
      _dbg("[belle-cat] Favoritos cargados:", _catFavs.length);
      if(typeof catActualizarCorazones === 'function') catActualizarCorazones();
    })
    .catch(function(e){console.error("[belle-cat] catCargarFavsIds error:",e); _catFavs = [];});
}

// Toggle favorito desde el catálogo (corazón en card o desde la lista)
function catToggleFav(productoId){
  if(!_catCliente){
    _catToast("Iniciá sesión para guardar favoritos","twarn");
    _catDrawerView = "login";
    var dw = document.getElementById("drawerCuenta");
    if(dw && !dw.classList.contains("open")) toggleMiCuenta();
    else if(typeof catRenderDrawer==='function') catRenderDrawer();
    return;
  }
  productoId = parseInt(productoId);
  var idx = _catFavs.indexOf(productoId);
  if(idx >= 0){
    _catFavs.splice(idx, 1);
    apiDelete("clientes_favoritos", "cliente_id=eq."+_catCliente.id+"&producto_id=eq."+productoId).then(function(){
      _catToast("Quitado de favoritos","tok");
      if(typeof catActualizarCorazones === 'function') catActualizarCorazones();
      if(window._soloFavs && typeof applyFilters==='function') applyFilters();
      var _fb=document.getElementById("favsBanner"); if(window._soloFavs&&_fb){var _n=(_catFavs||[]).length;_fb.querySelector("span").innerHTML="\u2764\ufe0f Mis favoritos"+(_n?" ("+_n+")":"");}
      if(_catPanelTab === "favoritos"){
        var box = document.getElementById("_catTabBody");
        if(box) _catRenderTabFavoritos(box);
      }
    }).catch(function(e){
      console.error("[belle-cat] toggleFav remove:",e);
      _catFavs.push(productoId);
    });
  } else {
    _catFavs.push(productoId);
    apiPost("clientes_favoritos", {cliente_id: _catCliente.id, producto_id: productoId}).then(function(){
      _catToast("Agregado a favoritos ❤","tok");
      if(typeof catActualizarCorazones === 'function') catActualizarCorazones();
    }).catch(function(e){
      console.error("[belle-cat] toggleFav add:",e);
      _catFavs = _catFavs.filter(function(x){return x!==productoId;});
    });
  }
}

// Refrescar visualmente los corazones en las cards del catálogo
function catActualizarCorazones(){
  document.querySelectorAll('.fav-heart').forEach(function(el){
    var pid = parseInt(el.dataset.pid);
    var es = _catFavs.indexOf(pid) >= 0;
    el.innerHTML = es ? "❤" : "♡";
    el.style.color = es ? "#c5443a" : "#bbb";
  });
}

// ── Tab Favoritos ────────────────────────────────────────────────────
function _catRenderTabFavoritos(box){
  if(!_catCliente){box.innerHTML = "<div class='empty'>Iniciá sesión</div>"; return;}
  if(!_catFavs || !_catFavs.length){
    box.innerHTML = "<div style='text-align:center;padding:2.5rem 1rem;color:var(--mid)'>"+
      "<div style='font-size:2.5rem;margin-bottom:.5rem;opacity:.5'>♡</div>"+
      "<div style='font-size:.9rem;font-weight:600;color:var(--dark);margin-bottom:.3rem'>Aún no tenés favoritos</div>"+
      "<div style='font-size:.78rem;color:var(--mid);max-width:300px;margin:0 auto'>Tocá el corazón en cualquier producto del catálogo para agregarlo a tus favoritos.</div>"+
      "</div>";
    return;
  }
  // 🚀 2026-08: los favoritos casi siempre YA estan en memoria (allProds). Antes SIEMPRE
  // se iba a buscarlos a la base y por eso "tardaba un rato" en mostrarlos. Ahora se
  // pintan al instante con lo que hay y solo se consulta la red si falta alguno.
  var _pinta = function(prods){
    if(!prods || !prods.length){
      box.innerHTML = "<div class='empty'>No se encontraron tus favoritos. Quizás fueron eliminados del catálogo.</div>";
      return;
    }
    var h = "";
    h += "<div style='font-size:.74rem;color:var(--mid);margin-bottom:.6rem'>"+prods.length+" producto"+(prods.length===1?"":"s")+" guardado"+(prods.length===1?"":"s")+"</div>";
    h += "<div style='display:flex;flex-direction:column;gap:.55rem'>";
    prods.forEach(function(p){ h += _catFavCard(p); });
    h += "</div>";
    h += "<button onclick='catCerrarTabsDrawer()' style='width:100%;background:transparent;color:var(--accent);border:1px solid var(--accent);padding:.55rem;border-radius:7px;font-size:.78rem;cursor:pointer;margin-top:1rem;font-weight:500'>Ir al catálogo →</button>";
    box.innerHTML = h;
  };
  try{
    if(typeof allProds!=='undefined' && allProds && allProds.length){
      var _enMem = allProds.filter(function(p){ return _catFavs.indexOf(p.id)>=0; });
      if(_enMem.length){
        _enMem.sort(function(a,b){ return String(a.nombre||'').localeCompare(String(b.nombre||'')); });
        _pinta(_enMem);                      // instantáneo
        if(_enMem.length === _catFavs.length) return;   // estaban todos: listo
      }
    }
  }catch(e){}
  if(!box.innerHTML || box.innerHTML.indexOf('cat-spin')<0){
    if(!box.children.length) box.innerHTML = "<div style='text-align:center;padding:2rem 1rem;color:var(--mid)'><div class='cat-spin' style='margin-bottom:.5rem'></div>Cargando favoritos...</div>";
  }
  var ids = _catFavs.join(",");
  apiGet("productos","select=*&id=in.("+ids+")&order=nombre").then(function(prods){
    _pinta(prods);
  }).catch(function(e){
    console.error("[belle-cat] _catRenderTabFavoritos:",e);
    box.innerHTML = "<div style='text-align:center;padding:2rem;color:#c5443a'>Error al cargar tus favoritos</div>";
  });
}

// Card mini de un favorito: visual similar al catálogo (3 columnas de precios x1/x3/x10
// que se iluminan según la cantidad), pero más compacta. Foto clickeable lleva al producto.
// Reusa las MISMAS funciones del catálogo (cstate, chgQty, addCart) para que el estado sea coherente.
function _catFavCard(p){
  if(typeof calcP !== 'function') return "";
  var id = p.id;
  var r = calcP(p);
  var marca = (typeof getBrand === 'function') ? getBrand(p.nombre) : "";
  var nomCorto = marca ? p.nombre.replace(marca + " - ", "") : p.nombre;
  var stockTotal = p.stock_actual || 0;
  var nostock = stockTotal === 0;
  var img = (typeof fixImgUrl === 'function' ? fixImgUrl(p.imagen_url||'') : (p.imagen_url||""));
  var st = (window.cstate && cstate[id]) ? cstate[id] : {qty:0};
  var inCart = (window.cart && cart[id] && !cart[id].isDecan) ? cart[id] : null;
  var qtyEnCarrito = inCart ? inCart.qty : 0;

  // Cálculo del "mejor precio" según cuántas unidades habría con esto + lo que ya hay en carrito
  // (mismo patrón que renderCard)
  var totalUnits = (typeof getCartTotalUnits === 'function' ? getCartTotalUnits() : 0)
                 + (st.qty||0) - (inCart ? inCart.qty : 0);
  var pUnico = p.precio_pestana || 0;
  var bestSeg = totalUnits > 0 ? (pUnico > 0 ? "pi" : (typeof getBestSeg === 'function' ? getBestSeg(totalUnits, r) : "pi")) : "none";

  // Restricciones de mínimos del producto
  var minGrupo = p.min_grupo || "";
  var minCant = parseInt(p.min_cantidad) || 0;

  var h = "";
  h += "<div id='_catFavCard"+id+"' style='background:#fff;border:1px solid #e8d9bf;border-radius:9px;padding:.55rem;display:flex;gap:.55rem;align-items:flex-start;position:relative;"+(nostock?"opacity:.55":"")+"'>";

  // Botón quitar de favoritos (corazón rojo arriba a la derecha)
  h += "<button onclick='catToggleFav("+id+")' style='position:absolute;top:.35rem;right:.4rem;background:transparent;border:none;font-size:1rem;cursor:pointer;color:#c5443a;padding:0;line-height:1;z-index:2' title='Quitar de favoritos'>❤</button>";

  // FOTO clickeable → ir al producto en catálogo
  h += "<div onclick='_catIrAProducto("+id+")' style='width:72px;height:72px;border-radius:7px;overflow:hidden;flex-shrink:0;background:#faf5ec;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;border:1px solid #f0e6d3' title='Ver en catálogo'>";
  if(img){
    h += "<img src='"+_catEsc(img)+"' style='width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;padding:3px' onerror='this.style.display=\"none\";var ph=this.nextElementSibling;if(ph)ph.style.display=\"flex\"'>";
    h += "<div style='display:none;font-size:.6rem;color:var(--mid);text-align:center;width:100%;height:100%;align-items:center;justify-content:center'>Sin foto</div>";
  } else {
    h += "<div style='font-size:.6rem;color:var(--mid);text-align:center'>Sin foto</div>";
  }
  // Overlay sutil de "ver"
  h += "</div>";

  // BLOQUE INFO + PRECIOS + CONTROLES
  h += "<div style='flex:1;min-width:0;padding-right:1.4rem;display:flex;flex-direction:column;gap:.35rem'>";

  // Marca + nombre
  if(marca) h += "<div style='font-size:.58rem;color:var(--mid);text-transform:uppercase;letter-spacing:.04em;font-weight:600'>"+_catEsc(marca)+"</div>";
  h += "<div onclick='_catIrAProducto("+id+")' style='font-size:.78rem;font-weight:600;color:var(--dark);line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer' title='Ver en catálogo'>"+_catEsc(_prodMl(nomCorto, _mlDe(id)))+"</div>";

  if(nostock){
    h += "<div style='font-size:.68rem;color:#c5443a;font-weight:600;margin-top:.15rem'>Sin stock</div>";
  } else {
    // 3 COLUMNAS de precios estilo catálogo (x10 / x3 / x1) — replicada visualmente con la dinámica del .lit
    if(pUnico > 0){
      // Caso especial: producto con precio único (precio_pestana)
      h += "<div style='display:flex;gap:.25rem'>";
      h += "<div class='_favPopt _favLit' style='flex:1;background:rgba(196,150,90,.12);border:1px solid var(--accent);border-radius:5px;padding:.25rem .35rem;text-align:center'>";
      h += "<div style='font-size:.55rem;color:var(--mid);text-transform:uppercase;font-weight:600'>Precio único</div>";
      h += "<div style='font-size:.74rem;font-weight:700;color:var(--dark)'>"+fmt(pUnico)+"</div>";
      h += "</div>";
      h += "</div>";
    } else {
      var segs = [{k:"pm", lab:"x10+"}, {k:"pe", lab:"x3+"}, {k:"pi", lab:"Lista"}];
      h += "<div class='_favPriceRow' data-pid='"+id+"' style='display:flex;gap:.25rem'>";
      segs.forEach(function(s){
        // Filtros de mínimo grupo (si solo mayor)
        if(s.k==="pi" && minGrupo && minCant>=3) return;
        if(s.k==="pe" && minGrupo && minCant>=10) return;
        var v = r[s.k];
        var dis = !v;
        var lit = (bestSeg === s.k);
        h += "<div class='_favPopt"+(lit?" _favLit":"")+(dis?" _favDis":"")+"' data-seg='"+s.k+"' style='flex:1;background:"+(lit?"rgba(196,150,90,.12)":"transparent")+";border:1px solid "+(lit?"var(--accent)":"#e8d9bf")+";border-radius:5px;padding:.22rem .3rem;text-align:center;"+(dis?"opacity:.4":"")+"'>";
        h += "<div style='font-size:.54rem;color:"+(lit?"var(--accent)":"var(--mid)")+";text-transform:uppercase;font-weight:600;letter-spacing:.04em'>"+s.lab+"</div>";
        h += "<div style='font-size:.72rem;font-weight:"+(lit?"700":"600")+";color:var(--dark)'>"+(dis?"-":fmt(v))+"</div>";
        h += "</div>";
      });
      h += "</div>";
    }

    // Indicador de "precio aplicado" si hay cantidad seleccionada
    if(st.qty > 0 && bestSeg !== "none"){
      // Si hay oferta vigente, mostrar etiqueta de oferta
      var _favHasOf=!!(r&&r.oferta&&!r.oferta_descartada_por_cc);
      var segN;
      if(_favHasOf){
        segN = "🔥 "+(r.oferta_etiqueta||"Oferta")+" aplicada";
      } else {
        segN = (bestSeg==="pm"?"Precio x10":bestSeg==="pe"?"Precio x3":"Precio de lista")+" aplicado";
      }
      h += "<div id='_favApplied"+id+"' style='font-size:.6rem;color:var(--accent);font-weight:600;text-align:center'>"+segN+"</div>";
    } else {
      h += "<div id='_favApplied"+id+"' style='font-size:.6rem;color:transparent;height:.6rem'>·</div>";
    }

    // CONTROLES: cantidad +/- (usa cstate igual que el catálogo) + botón Agregar (usa addCart)
    h += "<div style='display:flex;align-items:center;gap:.35rem;margin-top:.1rem'>";
    h += "<div style='display:flex;align-items:center;border:1px solid #e8d9bf;border-radius:6px;overflow:hidden;background:#faf5ec'>";
    h += "<button onclick='_catFavChgQty("+id+",-1)' style='background:transparent;border:none;width:24px;height:24px;cursor:pointer;font-size:.9rem;color:var(--dark);font-family:inherit'>−</button>";
    h += "<div id='_catFavQty"+id+"' style='min-width:24px;text-align:center;font-size:.78rem;font-weight:600;color:var(--dark)'>"+(st.qty||0)+"</div>";
    h += "<button onclick='_catFavChgQty("+id+",1)' style='background:transparent;border:none;width:24px;height:24px;cursor:pointer;font-size:.9rem;color:var(--dark);font-family:inherit'>+</button>";
    h += "</div>";
    h += "<button onclick='_catFavAgregarAlCarrito("+id+")' style='flex:1;background:var(--accent);color:#fff;border:none;padding:.32rem .55rem;border-radius:6px;font-size:.72rem;font-weight:600;cursor:pointer;font-family:inherit;"+((st.qty||0)===0?"opacity:.5;cursor:not-allowed":"")+"'>"+(qtyEnCarrito>0?"En carrito ("+qtyEnCarrito+")":"Agregar")+"</button>";
    h += "</div>";
  }

  h += "</div>"; // /info
  h += "</div>"; // /card
  return h;
}

// Cambiar cantidad en favorito — reusa cstate del catálogo + actualiza la card de favoritos en vivo
function _catFavChgQty(id, delta){
  if(typeof chgQty === 'function'){
    chgQty(id, delta);
  } else {
    if(!window.cstate) window.cstate = {};
    if(!cstate[id]) cstate[id] = {qty:0};
    cstate[id].qty = Math.max(0, cstate[id].qty + delta);
  }
  // Re-renderizar SOLO la card del favorito (más eficiente que toda la lista)
  var oldCard = document.getElementById("_catFavCard"+id);
  if(oldCard){
    var p = (window.allProds||[]).find(function(x){return x.id===id;});
    if(p){
      var tmp = document.createElement("div");
      tmp.innerHTML = _catFavCard(p);
      var newCard = tmp.firstChild;
      if(newCard) oldCard.parentNode.replaceChild(newCard, oldCard);
    }
  }
}

// Agregar al carrito — usa addCart del catálogo (que ya valida stock, mínimos, etc)
function _catFavAgregarAlCarrito(id){
  if(typeof addCart === 'function'){
    addCart(id);
    // Re-render del tab de favoritos para reflejar el "En carrito (N)"
    var tab = document.getElementById("_catTabBody");
    if(tab && _catPanelTab === "favoritos") _catRenderTabFavoritos(tab);
  } else {
    _catToast("No se pudo agregar","terr");
  }
}

// Click en foto/nombre del favorito → cierra el drawer y va al producto en el catálogo con highlight
function _catIrAProducto(id){
  id = Number(id);
  // Cerrar el dropdown de notificaciones si está abierto
  var nd = document.getElementById("catNotifDrop");
  if(nd) nd.style.display = "none";
  // Cerrar el drawer "Mi Cuenta" si está abierto
  var dw = document.getElementById("drawerCuenta");
  if(dw && dw.classList.contains("open") && typeof toggleMiCuenta === 'function'){
    toggleMiCuenta();
  }

  // Resetea TODOS los filtros del catálogo para garantizar que el producto se dibuje
  function _resetFiltrosCat(){
    try{
      var s=document.getElementById("srch"); if(s) s.value="";
      var bf=document.getElementById("brandFilter"); if(bf) bf.value="";
      var inf=document.getElementById("inspiradoFilter"); if(inf) inf.value="";
      var ns=document.getElementById("notasSearchInput"); if(ns) ns.value="";
      genF=""; kitF=false; famF=""; precioF="";
      _acordesFiltro=[]; _notasFiltro=[];
      window._soloFavs=false;
    }catch(e){}
  }
  function _scrollSiEsta(){
    var card=document.getElementById("card_"+id);
    if(card){ _catScrollHighlight(card); return true; }
    return false;
  }

  setTimeout(function(){
    // 1) Limpiar filtros y forzar el render buscando el producto por su nombre
    _resetFiltrosCat();
    var prod=(window.allProds||[]).find(function(x){return Number(x.id)===id;});
    if(prod && prod.nombre){
      var s=document.getElementById("srch");
      if(s) s.value=prod.nombre;
    }
    if(typeof applyFilters==='function') applyFilters();
    // 2) Esperar a que se dibujen las tarjetas y hacer scroll
    setTimeout(function(){
      if(_scrollSiEsta()) return;
      // 3) Reintento por si el render fue lento
      setTimeout(function(){
        if(_scrollSiEsta()) return;
        // 4) Último recurso: abrir la ficha del producto
        if(prod && typeof verFichaBelle==='function'){
          try{ verFichaBelle(id); return; }catch(e){}
        }
        if(typeof _catToast==='function') _catToast("Abrí el catálogo para verlo 🌸","twarn");
      }, 450);
    }, 350);
  }, 220);
}

function _catScrollHighlight(card){
  card.scrollIntoView({behavior:"smooth", block:"center"});
  // Highlight dorado breve
  var orig = card.style.boxShadow || "";
  var origBg = card.style.backgroundColor || "";
  card.style.transition = "box-shadow .3s, background-color .3s";
  card.style.boxShadow = "0 0 0 3px var(--accent), 0 6px 20px rgba(196,150,90,.4)";
  card.style.backgroundColor = "rgba(255,243,221,.6)";
  setTimeout(function(){
    card.style.boxShadow = orig;
    card.style.backgroundColor = origBg;
  }, 1800);
}



