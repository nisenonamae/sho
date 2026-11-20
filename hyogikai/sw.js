// 最高評議会のサービスワーカー:つながるときは必ず最新を取り、つながらないときだけ手元の保存を使う
// 同じ nisenonamae.github.io のほかのアプリの保存には手を出さない
const CACHE = "hyogikai-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin || !req.url.startsWith(self.registration.scope)) return;
  e.respondWith((async () => {
    try { const res = await fetch(req, { cache: "no-store" }); if (res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); } return res; }
    catch (err) { const hit = await caches.match(req); if (hit) return hit; throw err; }
  })());
});
