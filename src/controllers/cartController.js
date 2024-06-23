import CartManagerMONGO from "../dao/Mongo/cartManagerMONGO.js";
import ProductManagerMONGO from "../dao/Mongo/productManagerMONGO.js";
import {isValidObjectId} from "mongoose";
import { cartService } from "../services/CartService.js";
import { productService } from "../services/productService.js";
import { ticketService } from "../services/ticketService.js";

const cartManager = new CartManagerMONGO();
const productManager = new ProductManagerMONGO();


export class CartController {
    static getCarts = async (req, res) => {
        try {
            const carts = await cartService.getCarts(); 
            res.json(carts);
        } catch (error) {
            console.error("Error al obtener los carritos", error);
            res.status(500).json({error: error.message});
        }
    }

    static getCartById = async (req, res) => {
        let {cid}=req.params
        if(!isValidObjectId(cid)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id valido de MongoDB como argumento para busqueda`})
        }
        try {
            const cart = await cartService.getCartByPopulate({_id:cid});
            res.json(cart);
        
        } catch (error) {
            console.error("Error al obtener el cart", error);
            res.status(500).json({error: error.message});
        }
    }

    static createCart = async (req, res) => {
        try {
            const newCart = await cartService.createCart()
            res.json({newCart});
        } catch (error) {
            console.error("Error al crear el cart", error);
            res.status(500).json({error: error.message});
        }
    }

    static addToCart = async(req,res)=>{
        let {cid, pid}=req.params
        if(!isValidObjectId(cid) || !isValidObjectId(pid)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese cid / pid válidos`})
        }
    
        let carrito=await cartService.getCartById({_id:cid})
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Carrito inexistente: id ${cid}`})
        }
    
        let producto=await productManager.getById({_id:pid})
        if(!producto){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe producto con id ${pid}`})
        }
        let indiceProducto=carrito.products.findIndex(p=>p.product==pid)
        if(indiceProducto===-1){
            carrito.products.push({
                product: pid, quantity:1
            })
        }else{
            carrito.products[indiceProducto].quantity++
        }
    
        let resultado=await cartService.update(cid, carrito)
        if(resultado.modifiedCount>0){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Carrito actualizado", carrito });
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`No se pudo realizar la actualizacion`
                }
            )
            
        }
    }

    static deleteProductInCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const result = await cartService.deleteProductInCart(cid, pid);
            res.json({ message: "Producto eliminado del carrito", result });
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static updateCart = async (req, res) => {
        const { cid } = req.params;
        const { products } = req.body;
        try {
            const result = await cartService.update(cid, { products });
            res.json({ message: "Carrito actualizado", result });
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static updateProductInCart = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const result = await cartService.updateProductQuantity(cid, pid, quantity);
            res.json({ message: "Cantidad de producto actualizada en el carrito", result });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static deleteProducts = async (req, res) => {
        const { cid } = req.params;
        try {
            const result = await cartService.deleteProducts(cid);
            res.json({ message: "Todos los productos eliminados del carrito", result });
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static purchaseCart = async (req, res) => {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'Ingrese un id válido de MongoDB para el carrito' });
        }

        try {
            const cart = await cartService.getCartById({ _id: cid });
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            const productsNotPurchased = [];
            const purchasedProducts = [];
            let totalAmount = 0;

            for (const cartProduct of cart.products) {
                const product = await productService.getProductBy({ _id: cartProduct.product });
                if (product.stock >= cartProduct.quantity) {
                    product.stock -= cartProduct.quantity;
                    await productService.updateProduct(product._id, { stock: product.stock });
                    purchasedProducts.push({ product: product._id, quantity: cartProduct.quantity });
                    totalAmount += product.price * cartProduct.quantity;
                } else {
                    productsNotPurchased.push(cartProduct.product);
                }
            }

            if (purchasedProducts.length > 0) {
                const ticket = await ticketService.createTicket({
                    amount: totalAmount,
                    purchaser: req.session.user.email,
                    products: purchasedProducts
                });

                cart.products = cart.products.filter(cartProduct => productsNotPurchased.includes(cartProduct.product));
                await cartService.update(cid, { products: cart.products });

                return res.json({ message: 'Compra realizada con éxito', ticket, productsNotPurchased });
            } else {
                return res.status(400).json({ error: 'No se pudieron procesar los productos del carrito' });
            }

        } catch (error) {
            console.error('Error al finalizar la compra', error);
            res.status(500).json({ error: error.message });
        }
    };
}