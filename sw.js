const CACHE_NAME = 'versecurator-v1';
const urlsToCache = [
  '/VerseCurator/',
  '/VerseCurator/index.html',
  '/VerseCurator/assets/icons/icon-192.png',
  '/VerseCurator/assets/icons/icon-512.png'
  // Note: External resources like Font Awesome and Google Fonts won't be cached
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    );
  });
});
