// Service Worker mínimo — Distribuidora Belle
// Habilita "Agregar a inicio" (instalable) y un cache básico del shell.
// Estrategia: network-first para el catálogo (siempre datos frescos),
// con fallback a cache si no hay conexión.

const CACHE = 'belle-cache-v1';
const SHELL = ['index.html', 'favicon.svg', 'manifest.json'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(SHELL).catch(function () {});
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  // Solo manejamos GET del mismo origen. El resto (Supabase, CDNs) pasa directo.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function (res) {
      const copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy).catch(function () {}); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match('index.html');
      });
    })
  );
});
