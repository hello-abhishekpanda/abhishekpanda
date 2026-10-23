self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    await self.registration.unregister();

    const pages = await self.clients.matchAll({ type: 'window' });
    await Promise.all(pages.map((page) => page.navigate(page.url)));
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
