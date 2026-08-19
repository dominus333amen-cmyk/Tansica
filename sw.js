/* sw.js —— 清除舊緩存並自我卸載，保證永遠加載最新頁面 */
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k);}));})
      .then(function(){return self.clients.claim();})
      .then(function(){return self.registration.unregister();})
  );
});
self.addEventListener('fetch',function(){});
