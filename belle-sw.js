/* Belle Admin — Service Worker (PWA instalable).
   Estrategia network-first para la navegacion: SIEMPRE intenta la red (ultima version)
   y solo cae al cache si no hay conexion. Asi nunca sirve una version vieja del panel.
   No intercepta los pedidos a Supabase ni a otros assets: esos van directo a la red. */
var CACHE = 'belle-admin-v1';

self.addEventListener('install', function(e){ self.skipWaiting(); });

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; })
                             .map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  var req = event.request;
  if (req.method !== 'GET') return;
  // Solo manejamos la navegacion (cargar el panel). El resto lo maneja el navegador normal.
  if (req.mode === 'navigate'){
    event.respondWith(
      fetch(req).then(function(resp){
        try {
          var copy = resp.clone();
          caches.open(CACHE).then(function(c){ c.put('/belle.html', copy); });
        } catch(e){}
        return resp;
      }).catch(function(){
        return caches.match('/belle.html').then(function(m){ return m || Response.error(); });
      })
    );
  }
});
