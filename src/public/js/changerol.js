document.getElementById('changeRoleForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const uid = event.target.uid.value;

    try {
        const response = await fetch(`/api/users/premium/${uid}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert('Rol de usuario cambiado correctamente');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        alert('Error al cambiar el rol del usuario');
    }
})