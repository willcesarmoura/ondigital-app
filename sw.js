const CACHE='ondigital-v3';
const OFFLINE_URL='./index.html';

// Instala e faz cache do app shell
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// Remove caches antigos
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: sempre busca versão nova, cai no cache só se offline
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res.ok){
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
