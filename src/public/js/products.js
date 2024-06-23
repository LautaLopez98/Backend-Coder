const comprar = async (pid) => {
    try {
        const cartId = document.getElementById("carrito").value;
        console.log("cartId:", cartId);
        const response = await fetch(`/api/carts/${cartId}/product/${pid}`, {
            method: "POST"
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert("Producto agregado al carrito");
        } else {
            throw new Error("Error al agregar el producto al carrito");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al agregar el producto al carrito");
    }
}