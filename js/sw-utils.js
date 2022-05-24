
//guarda en el cache dinamico
function actualizaCacheDinamico( _dynamicCache, _req, _resp){

    if (_resp.ok){
        return caches.open(_dynamicCache).then(cache =>{

            cache.put(_req, _resp.clone());

            return _resp.clone();
        })
    }else{
        return _resp;
    }

}
