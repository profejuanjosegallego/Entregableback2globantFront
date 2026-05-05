//URL+EP
const API_URL_USUARIOS="http://localhost:8080/paseoapi/v1/usuarios"

//FUNCION ASINCRONA PARA GUARDAR
async function guardarUsuario(datos){
    let respuesta=await fetch(API_URL_USUARIOS,{
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

//FUNCION ASINCRONA PARA ELIMINAR
async function eliminarUsuario(id){
    let respuesta=await fetch(API_URL_USUARIOS+"/"+id,{
        method:"DELETE"
    })
    if(!respuesta.ok){
        let error=await respuesta.json()
        throw new Error(error.message)
    }
    return await respuesta.json()
}

//FUNCION ASINCRONA PARA LISTAR
async function listarUsuarios(){
    let respuesta=await fetch(API_URL_USUARIOS,{
        method:"GET"
    })
    if(!respuesta.ok){
        let error=await respuesta.json()
        throw new Error(error.message)
    }
    return await respuesta.json()
}

//FUNCION ASINCRONA PARA ACTUALIZAR
async function modificarUsuario(id,datos){
    let respuesta=await fetch(API_URL_USUARIOS+"/"+id,{
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