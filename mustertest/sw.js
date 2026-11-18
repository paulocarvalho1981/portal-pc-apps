const CACHE_NAME = 'muster-management-shell-v1';
const API_CACHE_NAME = 'muster-management-api-v1';

self.addEventListener('install', (event) => {
  const scope = new URL(self.registration.scope);
  const routes = [
    scope.pathname,
    `${scope.pathname}muster/lifeboat-1/`,
    `${scope.pathname}muster/lifeboat-2/`,
    `${scope.pathname}muster/lifeboat-3/`,
    `${scope.pathname}muster/lifeboat-4/`,
  ];
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(routes)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin === 'https://api.pc.api.br') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) void caches.open(API_CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached ?? new Response(JSON.stringify({ message: 'Sem conexão.' }), { status: 503, headers: { 'Content-Type': 'application/json' } }))),
    );
    return;
  }

  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request).then((cached) => cached ?? fetch(request).then((response) => {
      if (response.ok) void caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
      return response;
    })),
  );
});
