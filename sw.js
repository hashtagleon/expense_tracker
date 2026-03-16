const CACHE_NAME = 'fintrack-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/settings.html',
  '/reports.html',
  '/transactions.html',
  '/css/styles.css?v=3',
  '/js/app.js',
  '/js/firebase.js',
  '/js/db.js',
  '/js/auth.js',
  '/images/logo.png?v=2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
