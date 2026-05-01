// Maathru Care - Custom Service Worker Extension
// This file is merged with the Workbox-generated SW

const CACHE_NAME = 'maathru-care-v1';
const OFFLINE_FALLBACK_PAGE = '/chat';

// Background sync for queued chat messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncQueuedMessages());
  }
});

async function syncQueuedMessages() {
  // Messages are managed via Dexie (IndexedDB)
  // The app handles sync when it detects online status
  // This service worker sync is a fallback trigger
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_MESSAGES' });
  });
}

// Push notifications support (for doctor alerts)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new message from Maathru Care.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'maathru-notification',
    data: { url: data.url || '/chat' },
    requireInteraction: data.urgent || false,
    actions: data.actions || [],
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Maathru Care', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/chat';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        const existingClient = clients.find(c => c.url.includes(url));
        if (existingClient) return existingClient.focus();
        return self.clients.openWindow(url);
      })
  );
});

// Offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_FALLBACK_PAGE) || Response.redirect(OFFLINE_FALLBACK_PAGE)
      )
    );
  }
});
