document.addEventListener('DOMContentLoaded', () => {
    const changeRoleForm = document.getElementById('changeRoleForm');
    const uploadDocumentsForm = document.getElementById('upload-documents-form');

    if (changeRoleForm) {
        changeRoleForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const uid = event.target.uid.value;

            try {
                const response = await fetch(`/api/users/premium/${uid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || 'Rol de usuario cambiado correctamente');
                    location.reload();
                } else {
                    alert(`Error: ${result.message || 'No se pudo cambiar el rol del usuario'}`);
                }
            } catch (error) {
                console.error('Error al cambiar el rol del usuario:', error);
                alert('Error al cambiar el rol del usuario');
            }
        });
    }

    if (uploadDocumentsForm) {
        uploadDocumentsForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(uploadDocumentsForm);

            try {
                const response = await fetch(uploadDocumentsForm.action, {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || 'Documentos subidos correctamente');
                } else {
                    alert(`Error: ${result.message || 'No se pudieron subir los documentos'}`);
                }
            } catch (error) {
                alert('Error al enviar el formulario');
                console.error('Error:', error);
            }
        });
    }
});


