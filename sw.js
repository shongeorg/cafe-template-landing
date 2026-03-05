importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log('Workbox завантажено успішно! 🎉');

  // Файли для попереднього кешування (щоб вони завжди були офлайн)
  const CACHE_NAME = 'aroma-cache-v1';
  const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/index.css',
    '/index.js',
    '/manifest.json',
    '/offline.html'
  ];

  // Встановлення Service Worker і кешування критичних файлів
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Кешування критичних ресурсів...');
          return cache.addAll(URLS_TO_CACHE);
        })
    );
  });

  // Стратегія: Спочатку кеш, потім мережа (для контенту)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'document' ||
                   request.destination === 'script' ||
                   request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // Кешування зображень (з обмеженням)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 днів
        }),
      ],
    })
  );

  // Обробка офлайн-режиму
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match('/offline.html');
        })
      );
    }
  });
}
