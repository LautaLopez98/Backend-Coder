// const register=async(e)=>{
//     e.preventDefault()
//     let [first_name, last_name, age, email, password]=new FormData(document.getElementById("formRegister")).values()
//     let body={
//         first_name, last_name, age, email, password
//     }
//     let respuesta=await fetch("/api/sessions/registro", {
//         method:"post", 
//         headers:{
//             "Content-Type":"application/json"
//         },
//         body: JSON.stringify(body)
//     })
//     let datos=await respuesta.json()
//     console.log(datos)
//     if(respuesta.ok){
//         window.location.href="/login"
//     }else{
//         window.location.href="/registro?error=Error al cargar los datos"
//     }
// }