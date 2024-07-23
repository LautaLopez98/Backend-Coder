document.getElementById('reset-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = "{{token}}";
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch(`/resetpassword/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword })
        });

        if (response.ok) {
            alert('Contraseña actualizada');
            window.location.href = '/login';
        } else {
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al restablecer la contraseña.');
    }
});