// service-worker.js

const CACHE_NAME = "memory-game-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/responsividade.css",
  "/script.js",
  "/favicon.png",
  "/flip.mp3",
  "/match.mp3",
  "/win.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
