// Sprosse Service Worker v0.9.3
const CACHE = 'sprosse-v0.9.3';

self.addEventListener('install', function(e) {
  // Kein pre-caching - vermeidet Request-Fehler bei verschiedenen Deployment-Pfaden
  // Dateien werden beim ersten Aufruf gecacht (Network-first)
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Nur GET-Requests cachen
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    fetch(e.request).then(function(response) {
      // Nur erfolgreiche Responses cachen
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, clone);
        });
      }
      return response;
    }).catch(function() {
      // Offline: aus Cache laden
      return caches.match(e.request);
    })
  );
});

self.addEventListener('message', function(e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
