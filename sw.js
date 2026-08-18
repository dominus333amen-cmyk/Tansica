const CACHE='conlang-v2';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;
  /* 页面：联网优先（保证每次更新生效），断网回退缓存 */
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put('index.html',copy));
        return res;
      }).catch(()=>caches.match('index.html'))
    );
    return;
  }
  /* 其他资源：缓存优先 + 后台更新 */
  e.respondWith(
    caches.match(e.request).then(hit=>{
      const net=fetch(e.request).then(res=>{
        if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
        return res;
      }).catch(()=>hit);
      return hit||net;
    })
  );
});
