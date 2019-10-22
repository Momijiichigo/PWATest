var CACHE_NAME = "0.0.22";
const FILES_TO_CACHE = [
    './index.html',
    './drawing.svg'
];
let mainWin=null;
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache)=> {
        console.log('[ServiceWorker] Pre-caching offline page');
        if(mainWin!=null)mainWin.postMessage("installing");
        return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', function(event) {  
  event.waitUntil(
      caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key);
              if(mainWin!=null)mainWin.postMessage("removingOld");
              return caches.delete(key);
            }
          }));
        })
    
  );
});
self.addEventListener('fetch', function(evt) {
  evt.respondWith(
      caches.match(evt.request).then(res=>{
        return res || fetch(evt.request);
      })
  );
});
self.addEventListener('message', function(event){
  console.log("SW Received Message: " + event.data);
  if(event.data=="start")mainWin=event.ports[0];
});

  /*
s = ["72x72","96x96", "128x128", "144x144", "152x152", "192x192", "384x384", "512x512"]
for(x=0;x<s.length;x++){
  console.log(`{
    "src": "./icon-${s[x]}.png",
    "sizes": "${s[x]}",
    "type": "image/png"
  },`);
}
*/