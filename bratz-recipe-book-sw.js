// Minimal service worker for Niya's Cook Book "app". It only exists so
// iOS/Android treat "Add to Home Screen" as installing a real app shell
// (opens instantly in standalone mode, no browser address bar) instead of
// just a bookmark shortcut — Android in particular won't offer a real
// install without one of these present. It does NOT cache your actual
// recipe data — that always comes fresh from Supabase — only the page
// shell itself, and even that refreshes from the network first.
const CACHE_NAME = "mels-bratzrecipebook-shell-v1";
const SHELL_FILES = [
  "bratz-recipe-book.html",
  "bratz-recipe-book-manifest.json",
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
  // Only ever serve the cached shell for the recipe book page itself —
  // everything else (Supabase calls, images) always goes straight to
  // the network.
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
