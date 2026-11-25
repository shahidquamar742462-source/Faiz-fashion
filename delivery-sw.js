const CACHE_NAME = 'faiz-delivery-v2';

self.addEventListener('install', (event) => {
  // Naya service worker turant active ho jaye
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Purana cache delete karo taaki naya code load ho
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
