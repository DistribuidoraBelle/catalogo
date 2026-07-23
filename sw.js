/* Distribuidora Belle — Service Worker (PWA + Web Push) */
var BELLE_ICON = 'https://distribuidorabelle.com/favicon.png';
var BELLE_BADGE = 'https://distribuidorabelle.com/belle-badge.png';

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

/* Fetch handler (network-first SOLO para la navegacion / carga de paginas).
   Es lo que Chrome Android necesita para considerar la web "instalable como app".
   - Siempre baja la pagina FRESCA de la red, ignorando el cache HTTP del navegador
     (cache:'reload'). Asi despues de cada deploy no hace falta Ctrl+Shift+R.
   - Cae al cache solo si no hay internet (offline basico).
   - NO intercepta Supabase, imagenes ni otros assets: esos van directo a la red. */
var BELLE_NAV_CACHE = 'belle-nav-v1';
self.addEventListener('fetch', function(event){
  var req = event.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate'){
    event.respondWith(
      fetch(req.url, {cache:'reload', credentials:'same-origin'}).then(function(resp){
        try { var copy = resp.clone(); caches.open(BELLE_NAV_CACHE).then(function(c){ c.put(req, copy); }); } catch(e){}
        return resp;
      }).catch(function(){
        return caches.match(req).then(function(m){ return m || Response.error(); });
      })
    );
  }
});

function _isUrl(s){ return typeof s === 'string' && /^https?:\/\//.test(s); }

// Recibe el push del servidor y muestra la notificación nativa en el celular
self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(err){ data = { title: 'Distribuidora Belle', body: (event.data && event.data.text) ? event.data.text() : '' }; }

  var title = data.title || 'Distribuidora Belle';
  var options = {
    body: data.body || '',
    // Ícono chico (izquierda): SIEMPRE el logo Belle. Solo se respeta otro si es una URL válida.
    icon: _isUrl(data.icon) ? data.icon : BELLE_ICON,
    // Icono chico (barra de estado): silueta monocroma de la B (fondo transparente).
    badge: BELLE_BADGE,
    // Imagen grande (derecha): la foto del perfume / publicidad de la notificación, si tiene.
    image: _isUrl(data.image) ? data.image : undefined,
    tag: data.tag || ('belle-' + Date.now()),
    renotify: true,
    data: { url: data.url || './index.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Al tocar la notificación: enfocar una pestaña abierta o abrir el catálogo
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var targetUrl = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        var c = list[i];
        if ('focus' in c){
          try { if ('navigate' in c) c.navigate(targetUrl); } catch(e){}
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
