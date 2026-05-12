const API_URL_ESPACIOS="http://localhost:8080/paseoapi/v1/espacios"

async function guardarEspacio(datos){
    let respuesta=await fetch(API_URL_ESPACIOS,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(datos)
    })
    if(!respuesta.ok){
        let error=await respuesta.json()
        throw new Error(error.message)
    }
    return await respuesta.json()
}

async function listarEspacios(){
    let respuesta=await fetch(API_URL_ESPACIOS,{
        method:"GET"
    })
    if(!respuesta.ok){
        let error=await respuesta.json()
        throw new Error(error.message)
    }
    return await respuesta.json()
}

async function modificarEspacio(id,datos){
    let respuesta=await fetch(API_URL_ESPACIOS+"/"+id,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(datos)
    })
    if(!respuesta.ok){
        let error=await respuesta.json()
        throw new Error(error.message)
    }
    return await respuesta.json()
}

async function eliminarEspacio(id){
    let respuesta=await fetch(API_URL_ESPACIOS+"/"+id,{
        method:"DELETE"
    })
    if(!respuesta.ok){
        let error=await respuesta.json()
        throw new Error(error.message)
    }
    return await respuesta.json()
}
