const CACHE_NAME = 'faiz-fashion-v26'; 
const ASSETS = ['./', './index.html', './manifest.json', './logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(c => { if (c !== CACHE_NAME) return caches.delete(c); })))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;
  if (url.includes('firestore') || url.includes('googleapis') || url.includes('gstatic') || url.includes('firebase') || url.includes('cloudinary')) return;

  if (event.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/')) {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cachedResponse) => {
    if (cachedResponse) return cachedResponse;
    return fetch(event.request).then((response) => {
      const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); return response;
    });
  }));
});
