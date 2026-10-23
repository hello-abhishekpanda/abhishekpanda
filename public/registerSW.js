(() => {
  const cleanup = async () => {
    const controlled = Boolean(navigator.serviceWorker?.controller);

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    if (controlled && sessionStorage.getItem('ap-legacy-worker-reload') !== 'done') {
      sessionStorage.setItem('ap-legacy-worker-reload', 'done');
      location.reload();
    }
  };

  cleanup().catch(() => {});
})();
