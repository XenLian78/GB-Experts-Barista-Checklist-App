const CACHE_NAME = 'gb-checklist-v3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/images/G&B-LOGO.svg',
  './assets/images/MISCELA-DORO-LOGO.svg',
  './assets/images/icon-180.png',
  './js/signature_pad.umd.min.js',
  './js/html2canvas.min.js',
  './js/jspdf.umd.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
