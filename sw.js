// Sprosse Service Worker
const CACHE = 'sprosse-v0.9.3';
const FILES = [
  '/',
  '/sprosse/',
  '/sprosse/index.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    }).then(function() {
      return self.skipWaiting();
    })
  );
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
  e.respondWith(
    fetch(e.request).then(function(response) {
      var clone = response.clone();
      caches.open(CACHE).then(function(cache) {
        cache.put(e.request, clone);
      });
      return response;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('message', function(e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
