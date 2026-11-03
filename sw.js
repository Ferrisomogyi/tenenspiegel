/* Toe Reading service worker · v9.21.1 (3 nov: herinnering/nieuws-kaartje onder de lezing; v9.21.0 2 nov: hulpbot-knop via /hulp/knop.js, /hulp/ network-first; v9.20.3 2 nov: foto-belofte eerlijk in Over en Prijzen; v9.20.2 2 nov: eerlijke AI-toestemming Anthropic, privacy foto-bewaring; v9.20.1 1 nov: Alibaba Cloud in de AI-toestemming en privacy, zht-vormteksten; 1 nov: Chinese teksten opnieuw in natuurlijk Chinees, feedbackknoppen goed/redelijk/slecht, bevestigingsmail opnieuw sturen; 31 okt: bevestigpagina voor maillinks, taal mee bij registreren; 30 okt: kostenregel onder Analyseer mijn voeten, nieuwe uitleg als je tegoed op is; 30 okt: verhaal bij zelf invullen, kleurkaarten in potloodstijl, balkje bij een vraag, een duo-blok, gesprek blijft staan; 30 okt: foto bij de lezing alleen op het toestel, logo in de kop; 30 okt: nieuwe iconen, logo 13; vragen over bewaarde lezingen; koopnoot bank-modus; tweede kassa iDEAL | Wero en Bancontact, jaarpas, KvK in de footer; v9.19.2 kijkrichting en omwisselen, regioslot, zh-Hant, bewaarvraag, lezingen op het toestel; v9.19.1 store-prijzen per product, tegoed op eigen uid, Play-melding achter PLAY_LIVE; v9.19.0 store-betalen, AI-toestemming, fair use 8; v9.18.2 domein toereading.com; v9.18.1 Forse teen op teen 2-5, benadrukte teen, anders in rust, staand-regel; v9.18.0 voorbeeldlezing + duo-voorbeeld, rondleiding, voortgangsbalk; v9.17.0 spiegel vertelt meteen, klopte-je-lezing, foto staand; v9.16.3 vormen versmalling en dunneaanzet; v9.16.2 duo-verhaal zonder markdown; v9.16.1 duo-hint; v9.16.0 meekijkfoto; v9.15.9 fix: navigatie naar andere pagina's overschreef de offline-kopie van index.html)
   Strategie:
   - navigaties (de pagina zelf): network-first, val terug op cache → nieuwe deploys komen direct door, offline blijft werken
   - overige same-origin GET (manifest, iconen): cache-first
   - POST-calls naar de worker (workers.dev) worden met rust gelaten */
const CACHE = 'tenenspiegel-v9.21.1';
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

  /* v9.21.0: hulpbot (knop.js + kennisbank) altijd vers van het netwerk, offline uit de cache */
  if (url.pathname.startsWith('/hulp/')) {
    e.respondWith(
      fetch(req)
        .then((antwoord) => { const kopie = antwoord.clone(); if (antwoord.ok) caches.open(CACHE).then((c) => c.put(req, kopie)); return antwoord; })
        .catch(() => caches.match(req))
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
