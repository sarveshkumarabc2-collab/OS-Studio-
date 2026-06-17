// Otaku Sarvesh Studio — Service Worker v1
const CACHE = 'oss-v40';
const ASSETS = [
  './otaku_sarvesh_Hinglish_v40.html',
  './manifest.json'
];

// Install: cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', e => {
  // API calls (OpenRouter, Inworld) — always network
  if (e.request.url.includes('openrouter') || 
      e.request.url.includes('inworld') ||
      e.request.url.includes('api.')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
