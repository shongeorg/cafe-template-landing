importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log('Workbox завантажено успішно! 🎉');

  // Назва кешу
  const CACHE_NAME = 'aroma-cache-v2';

  // ПОВНИЙ список файлів для офлайн-режиму
  const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/index.css',
    '/index.js',
    '/manifest.json',
    '/offline.html',
    // Локальні зображення
    '/assets/hero.jpg',
    '/assets/espresso.jpg',
    '/assets/capuccino.jpg',
    '/assets/latte.jpg',
    '/assets/croissant.jpg',
    '/assets/americano.jpg',
    '/assets/flatwhite.jpg'
  ];

  // 1. Попереднє кешування при встановленні
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Кешування всіх ресурсів для офлайн-доступу...');
          return cache.addAll(URLS_TO_CACHE);
        })
        .then(() => self.skipWaiting())
    );
  });

  // 2. Активація та видалення старого кешу
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('Видалення старого кешу:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
    );
  });

  // 3. Стратегія: Stale-While-Revalidate (швидке завантаження + оновлення у фоні)
  workbox.routing.registerRoute(
    ({request}) => true, // Кешуємо все
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'aroma-universal-cache',
    })
  );

  // 4. Обробка офлайн-переходів
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
