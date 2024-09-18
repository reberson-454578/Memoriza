const CACHE_NAME = "memoriza-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/responsividade.css",
  "/favicon.png",
  "/manifest.json",
  "/flip.mp3",
  "/match.mp3",
  "/win.mp3",
];

// Instala o Service Worker e adiciona arquivos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Verifica se há uma nova versão do cache, caso haja, atualiza
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta as requisições e responde com o cache, ou baixa novas versões
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se o arquivo estiver no cache, retorná-lo
      if (response) {
        return response;
      }
      // Caso contrário, fazer a requisição e adicioná-la ao cache
      return fetch(event.request).then((response) => {
        // Verifica se a resposta é válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        // Clona a resposta e adiciona ao cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
