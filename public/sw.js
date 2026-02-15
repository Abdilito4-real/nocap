const CACHE_NAME = 'nocap-cache-v4';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/screenshots/desktop.png',
  '/screenshots/mobile.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // 1. Navigation requests: Network First
  // This ensures we always get the latest HTML with the latest asset hashes.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 2. Static assets (Next.js chunks, images, etc.)
  // For /_next/static/ we use Stale-While-Revalidate or Cache-First.
  // Given the hashes in the name, Cache-First is generally safe,
  // but Stale-While-Revalidate is safer for things that might change.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // If it's a versioned asset, cache is fine.
        // But let's still try to refresh it in the background if it's not a hash-named file.
        const isVersioned = url.pathname.startsWith('/_next/static/') && !url.pathname.includes('chunks/main-');

        if (isVersioned) {
          return cachedResponse;
        }

        // Stale-while-revalidate for others
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        }).catch(() => {});

        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache static assets
        if (
          url.pathname.startsWith('/_next/static/') ||
          url.pathname.startsWith('/icons/') ||
          url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff2?)$/)
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }

        return networkResponse;
      });
    })
  );
});
