// Minimal service worker for the App Payments "app" — same pattern as
// quick-pay-sw.js. Only caches this page's own shell so "Add to Home
// Screen" opens instantly in standalone mode. Never caches or intercepts
// any Supabase/network traffic — every log always hits the network fresh.
const CACHE_NAME = "mels-apppay-shell-v1";
const SHELL_FILES = [
  "app-payments.html",
  "app-payments-manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || !SHELL_FILES.some((f) => url.pathname.endsWith(f))) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
