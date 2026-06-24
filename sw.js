/* Distribuidora Belle — Service Worker (PWA + Web Push) */
var BELLE_ICON = 'https://distribuidorabelle.com/og-belle.jpg';

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

// Recibe el push del servidor y muestra la notificación nativa en el celular
self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(err){ data = { title: 'Distribuidora Belle', body: (event.data && event.data.text) ? event.data.text() : '' }; }

  var title = data.title || 'Distribuidora Belle';
  var options = {
    body: data.body || '',
    icon: data.icon || BELLE_ICON,
    badge: data.badge || BELLE_ICON,
    image: data.image || undefined,
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
