// Otaku Sarvesh Studio — Service Worker v2
const CACHE = 'oss-v41';
const ASSETS = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('openrouter') ||
      e.request.url.includes('inworld') ||
      e.request.url.includes('api.')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        return caches.open(CACHE).then(c => {
          c.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
