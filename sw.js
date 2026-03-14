const CACHE_NAME = 'fintrack-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/settings.html',
  '/reports.html',
  '/transactions.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/firebase.js',
  '/js/db.js',
  '/js/auth.js',
  '/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
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
