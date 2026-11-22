// FolderBeats — guarda la interfaz para que abra sin internet.
// Las canciones NO se guardan aquí: se guardan en la memoria del dispositivo (IndexedDB)
// cuando se escuchan.
const CACHE = 'folderbeats-interfaz-v2';
const INTERFAZ = ['./', './index.html', './biblioteca.json', './manifest.webmanifest', './icono-192.png', './icono-512.png'];
const EXTERNOS = [
  'https://cdn.tailwindcss.com/3.4.17',
  'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];
const AUDIO_RE = /\.(mp3|wav|ogg|m4a|aac|flac|opus|webm|bin)$/i;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const url of INTERFAZ) {
      try { await cache.add(new Request(url, { cache: 'reload' })); } catch (e) {}
    }
    for (const url of EXTERNOS) {
      try { await cache.add(new Request(url, { mode: 'no-cors' })); } catch (e) {}
    }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('folderbeats-interfaz-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Audio y archivos cifrados: directo a internet (el reproductor los guarda a su manera)
  if (AUDIO_RE.test(url.pathname) || req.headers.has('range')) return;

  const mismoSitio = url.origin === self.location.origin;
  const esApiGithub = url.hostname === 'api.github.com';

  // Página, biblioteca.json y lista de GitHub: primero internet (para ver lo nuevo), si no hay, lo guardado
  if (req.mode === 'navigate' || mismoSitio || esApiGithub) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        const guardado = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
        if (guardado) return guardado;
        if (req.mode === 'navigate') {
          const pagina = (await cache.match('./index.html')) || (await cache.match('./'));
          if (pagina) return pagina;
        }
        return Response.error();
      }
    })());
    return;
  }

  // Estilos, íconos y fuentes externas: lo guardado primero
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const guardado = await cache.match(req);
    if (guardado) return guardado;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    } catch (e) {
      return Response.error();
    }
  })());
});
