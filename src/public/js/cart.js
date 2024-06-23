async function eliminarProducto(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Producto eliminado del carrito');
            location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error al eliminar producto: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al eliminar el producto');
    }
}

async function finalizarCompra(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Compra finalizada con éxito');
            window.location.href = '/products';
        } else {
            const errorData = await response.json();
            alert(`Error al finalizar la compra: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al finalizar la compra');
    }
}