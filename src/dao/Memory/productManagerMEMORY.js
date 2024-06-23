import * as fs from 'node:fs/promises';
import __dirname from '../../../utils.js';
import path from 'node:path';

const productsInFile = path.resolve(__dirname, "src", "data", "products.json")

class productManagerMEMORY {
    #products;

    constructor() {
        this.path = productsInFile;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.#products = JSON.parse(data);
            return this.#products;
        } catch (error) {
            console.log(`Error al intentar leer el archivo de productos, ${error}`);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products, null, 2));
        } catch (error) {
            console.log(`Error al intentar guardar el archivo de productos, ${error}`);
        }
    }

    idProduct() {
        let id = 1;
        if (this.#products.length !== 0)
            id = this.#products[this.#products.length - 1].id + 1;
        return id;
    }

    async add ({title, description, price, thumbnail= [], code, stock, category, status = true}) {
        if (!title || !description || !price || !code || !stock || !category) return 'Se requieren todos los parámetros [title, description, price, code, stock, category]';
        console.log(thumbnail);
        const repeat = this.#products.some(p => p.code === code);
        if (repeat)
            return `El código ${code} ya se encuentra registrado en otro producto`;

        const id = this.idProduct();
        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status
        };
        this.#products.push(newProduct);
        await this.saveProducts();

        return 'Producto agregado con éxito!';
    }

    get(limit) {
        if (limit) {
            return this.#products.slice(0, limit);
        } else {
            return this.#products;
        }
    }

    async getById(id) {
        const producto = this.#products.find(p => p.id == id)
        if (producto)
            return producto
        else
            return `No se encontró el producto con id ${id}`;
    }

    async update(id, objectUpdate) {
        let msg = `El producto con id ${id} no existe`;

        const index = this.#products.findIndex(p => p.id === id);
        if (index !== -1) {
            const { id, ...rest } = objectUpdate;
            this.#products[index] = { ...this.#products[index], ...rest };
            await this.saveProducts();
            msg = 'Producto actualizado';
        }

        return msg;
    }

    async delete(id) {
        const index = this.#products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.#products.splice(index, 1);
            await this.saveProducts();
            return 'Producto eliminado!';
        } else {
            return `No se encontró el producto con id ${id}`;
        }
    }
}

export default productManagerMEMORY

// const entorno = async () => {
//     const product = new ProductManager("../data/products.json");
//     await product.loadProducts();

//     // console.log(await product.addProduct('Juego 1', 'Juego número 1', '20000', 'thumbnail', 'FZ515', '10'));
//     // console.log(await product.addProduct('Juego 2', 'Juego número 2', '30000', 'thumbnail', 'FS515', '10'));
//     // console.log(await product.addProduct('Juego 3', 'Juego número 3', '40000', 'thumbnail', 'JZ515', '10'));
//     // console.log(await product.addProduct('Juego 4', 'Juego número 4', '24000', 'thumbnail', 'KS515', '10'));
//     // console.log(await product.addProduct('Juego 5', 'Juego número 5', '25000', 'thumbnail', '4Z515', '10'));
//     // console.log(await product.addProduct('Juego 6', 'Juego número 6', '12000', 'thumbnail', 'ES515', '10'));
//     // console.log(await product.addProduct('Juego 7', 'Juego número 7', '15000', 'thumbnail', 'SZ515', '10'));
//     // console.log(await product.addProduct('Juego 8', 'Juego número 8', '26000', 'thumbnail', 'DS515', '10'));
//     // console.log(await product.addProduct('Juego 9', 'Juego número 9', '22000', 'thumbnail', 'XZ515', '10'));
//     // console.log(await product.addProduct('Juego 10', 'Juego número 10', '30000', 'thumbnail', 'MS515', '10'));
//     console.log(product.getProducts());
//     console.log(await product.getProductById(11));

//     // const newData = {
//     //     "id": 2,
//     //     "title": "Juego 2",
//     //     "description": "Juego número 2",
//     //     "price": "10000",
//     //     "thumbnail": "thumbnail",
//     //     "code": "FS515",
//     //     "stock": "100"
//     // }
//     // console.log(await product.updateProduct(2, newData));

//     // console.log(await product.deleteProduct(1));
//     // console.log(await product.deleteProduct(2));
// };

// entorno();