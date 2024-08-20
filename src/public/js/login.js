// async function login(event) {
//     event.preventDefault();

//     const formData = new FormData(document.getElementById('formLogin'));

//     try {
//         const response = await fetch(formLogin.action, {
//             method: 'POST',
//             body: formData,
//         });

//         const data = await response.json();

//         if (response.ok) {
//             window.location.href = '/products';
//         } else {
//             alert(data.error || 'Error en el login');
//         }
//     } catch (error) {
//         console.error('Error en la solicitud:', error);
//         alert('Error en la solicitud');
//     }
// }




