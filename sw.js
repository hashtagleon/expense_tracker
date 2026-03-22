const CACHE_NAME = 'fintrack-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/settings.html',
  '/reports.html',
  '/transactions.html',
  '/add-transaction.html',
  '/css/styles.css?v=4',
  '/js/app.js?v=4',
  '/js/firebase.js',
  '/js/db.js',
  '/js/auth.js',
  '/js/categories.js',
  '/js/charts.js',
  '/images/logo.png?v=2'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Instantly jump queue on new update
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
  self.clients.claim(); // Immediately start controlling clients
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
