const CACHE_NAME = "sharkbot-cache-v2";
const ASSETS = [
  ".",
  "index.html",
  "styles.css",
  "manifest.json",
  "assets/icon-shark.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/logo-shark.svg",
  "assets/icon-money.svg",
  "assets/icon-chart.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "sale-notification") {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title, {
      body,
      icon,
      badge: icon,
      silent: false
    });
  }
});
