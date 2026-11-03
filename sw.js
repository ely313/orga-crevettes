// Réseau d'abord : les mises à jour publiées sur GitHub arrivent sans réinstaller l'appli.
// Le cache sert seulement quand il n'y a pas de réseau.
const CACHE = 'crevettes-v2';
const SHELL = ['./','index.html','style.css','app.js','firebase-config.js','firebase-store.js','firebase-bundle.js','manifest.webmanifest',
  'icons/icon-64.png','icons/icon-192.png','icons/icon-256.png','icons/icon-512.png',
  ...['bleu','pivoine','sauge','corail','ocre','lilas'].map(m=>`motifs/${m}.svg`)];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); } return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
