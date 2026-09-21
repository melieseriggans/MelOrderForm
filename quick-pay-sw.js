// Minimal service worker for the Quick Pay "app". It only exists so
// iOS/Android treat "Add to Home Screen" as installing a real app shell
// (opens instantly in standalone mode). It does NOT cache Stripe or any
// payment traffic — every charge always hits the network fresh.
const CACHE_NAME = "mels-quickpay-shell-v1";
const SHELL_FILES = [
  "quick-pay.html",
  "quick-pay-manifest.json",
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
  // Only ever serve the cached shell for the quick-pay page itself —
  // everything else (Stripe API calls, Supabase calls, icons) always
  // goes straight to the network.
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
