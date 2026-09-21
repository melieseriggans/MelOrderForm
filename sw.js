// Minimal service worker for the main site.
//
// This exists only so "Add to Home Screen" installs Mel's Treat as a real
// app (opens full-screen, no Safari/Chrome address bar) instead of just a
// bookmark — that install behavior requires a service worker to be present.
//
// It deliberately caches NOTHING. Your menu, prices and stock all come from
// live Supabase calls, and caching the site's HTML/JS would risk someone
// seeing stale prices or an "in stock" item that's actually sold out.
// Every request just passes straight through to the network, same as a
// normal page load.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// No fetch handler on purpose — nothing is intercepted or cached.
