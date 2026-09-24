/* Toe Reading service worker · v9.16.2 (duo-verhaal zonder markdown; v9.16.1 duo-hint; v9.16.0 meekijkfoto; v9.15.9 fix: navigatie naar andere pagina's overschreef de offline-kopie van index.html)
   Strategie:
   - navigaties (de pagina zelf): network-first, val terug op cache → nieuwe deploys komen direct door, offline blijft werken
   - overige same-origin GET (manifest, iconen): cache-first
   - POST-calls naar de worker (workers.dev) worden met rust gelaten */
const CACHE = 'tenenspiegel-v9.16.2';
const KERN = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(KERN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((sleutels) => Promise.all(sleutels.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((antwoord) => {
          const kopie = antwoord.clone();
          /* v9.15.8: alleen de app zelf onder ./index.html bewaren; andere pagina's (pricing, beheer) onder hun eigen url */
          const isApp = url.pathname === '/' || url.pathname.endsWith('/index.html');
          caches.open(CACHE).then((c) => c.put(isApp ? './index.html' : req, kopie));
          return antwoord;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((antwoord) => {
      const kopie = antwoord.clone();
      caches.open(CACHE).then((c) => c.put(req, kopie));
      return antwoord;
    }))
  );
});
