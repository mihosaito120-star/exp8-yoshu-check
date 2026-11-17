// 予習問題チェック：オフラインでも動くようにファイルを端末に保存する
var CACHE = 'exp8prep-v1';
var FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
// つながるときは最新版を取り、つながらないときは保存済みのものを使う
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) { var cp = r.clone(); if (r.ok) caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); return r; }).catch(function () { return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match('index.html'); }); }));
});
