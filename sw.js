//imports
importScripts('/js/sw-utils.js');

const Static_Cache = 'static-v1';
const Dynamic_Cache = 'dynamic-v1';
const Inmutable_Cache = 'inmutable-v1';

const App_Shell = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    '/js/sw-utils.js'
];

const App_Shell_Inmutable = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//instalamos el registro de cache
self.addEventListener('install', e => {

    const cacheStatic = caches.open(Static_Cache).then(cache=> cache.addAll(App_Shell));

    const cacheInmutable = caches.open(Inmutable_Cache).then(cache=> cache.addAll(App_Shell_Inmutable));

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]));

});

//validamos q se borre el cache viejo
self.addEventListener('activate', e =>{

    const respuesta = caches.keys().then(keys =>{

        keys.forEach(key=>{

            if (key !== Static_Cache && key.includes('static')){
                return caches.delete(key);
            }
        });
    });

    //esperamos a que termine para no pasar al siguiente paso
    e.waitUntil(respuesta);

});

self.addEventListener('fetch' , e=>{

    const res = caches.match(e.request).then(resp =>{
        if (resp){
            return resp;
        }else{

            return fetch(e.request).then(newRes =>{

                return actualizaCacheDinamico(Dynamic_Cache, e.request, newRes);
            })
        }
    })

    e.respondWith(res);
})
