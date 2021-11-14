var CACHE_NAME = "sk_reza-master";
var urlsToCache = [
  "/",
  // "app/config/config.php"
  // "app/controller"
  'fallback.php',
];

self.addEventListener("install", (e) => {
  // Perform install steps
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("caching shell assets");
      return cache.addAll(urlsToCache).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("service worker has been activated");
  event.waitUntil(
    (async function () {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => {})
          .map((cacheName) => caches.delete(cacheName))
      );
    })()
  );
});

self.addEventListener("fetch", function (event) {
  console.log("fetching url :" + event.request.url);
  event.respondWith(
    (async function () {
      try {
        var fetchRequest = event.request.clone();
        return await fetch(fetchRequest).then(function (response) {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      } catch (err) {
        return caches.match(event.request).then(function (response) {
          console.log("cache match, return cache");
          if (response) {
            return response;
          } else {
            return caches.match("fallback.php");
          }
        });
      }
    })()
  );
});
