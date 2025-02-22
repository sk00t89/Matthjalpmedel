const cacheName = "mattapp-v1";
const assets = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/app.js",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png"
];

// Installera Service Worker och cacha filer
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assets);
        })
    );
});

// Ladda cache först, om det inte finns hämta från nätet
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
