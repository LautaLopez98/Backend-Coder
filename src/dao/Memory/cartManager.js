import * as fs from 'node:fs/promises';
import __dirname from '../../../utils.js';
import path from 'node:path';

const cartInFile = path.resolve(__dirname, "src", "data", "carts.json") 


class CartManager {
    constructor() {
        this.path = cartInFile;
        this.cart = this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.cart = JSON.parse(data);
        } catch (error) {
            if (error.code === "ENOENT"){
                return this.cart = [];
            } else {
            console.log(`Error al intentar leer el archivo de cart, ${error}`);
            }
        }
    }

    async saveCart() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.cart, null, 2));
        } catch (error) {
            console.log(`Error al intentar guardar el archivo de cart, ${error}`);
        }
    }

    idCart() {
        let id = 1;
        if (this.cart.length !== 0)
            id = this.cart[this.cart.length - 1].id + 1;
        return id;
    }

    async getById(id) {
        const producto = this.cart.find(p => p.id == id)
        if (producto)
            return producto
        else
            return `No se encontró el cart con id ${id}`;
    }

    async create(){
        const newCart = {
            id: this.idCart(),
            product: []
        }

        this.cart.push(newCart)
        await this.saveCart();

        return newCart
    }

    async addToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error("No se encontró el carrito");
        }

        if (!cart.product) {
            cart.product = [];
        }
    
        const existingCartItem = cart.product.find(item => item.productId === productId);
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            cart.product.push({
                productId: productId,
                quantity: quantity
            });
        }
    
        await this.saveCart();
    
        return cart;
    }
    
}

export default CartManager;
