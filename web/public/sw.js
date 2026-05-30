const CACHE_NAME = 'musiqsphere-site-cache-v1';
const IMAGE_CACHE_NAME = 'musiqsphere-image-cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/vite.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Audio streaming - handled by app logic, but let's bypass SW for it
  if (url.pathname.includes('/api/songs/') && url.pathname.includes('/stream')) {
    return;
  }

  // 2. Images (album covers) - cache them as they are requested
  if (event.request.destination === 'image' || url.pathname.includes('/storage/songs/covers/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          
          const responseToCache = networkResponse.clone();
          caches.open(IMAGE_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Application Shell (HTML/JS/CSS) - Cache First
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

