const socket = io();

socket.on('products', productos =>{
    const container = document.getElementById('products');
    container.innerHTML = '';

    productos.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p>Precio: $${p.price}</p>
            <p>Código: ${p.code}</p>
            <p>Stock: ${p.stock}</p>
            <p>Categoría: ${p.category}</p>
            <p>Estado: ${p.status}</p>
        `;
        
        container.appendChild(card);
    });
});

const form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const codigo = document.getElementById('codigo').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('categoria').value;

    const producto = {
        title: titulo,
        description: descripcion,
        price: precio,
        code: codigo,
        stock: stock,
        category: categoria,
    };

    socket.emit('addProduct', producto);
    
    form.reset()
})

console.log("Cliente conectado")