import CartManagerMONGO from "../dao/Mongo/cartManagerMONGO.js";

class CartService {
    constructor(dao){
        this.dao = dao;
    }

    getCarts = async()=>{
        return await this.dao.get();
    }

    getCartById = async(filtro={})=>{
        return await this.dao.getById(filtro);
    }

    getCartByPopulate = async(filtro={})=>{
        return await this.dao.getByPopulate(filtro);
    }

    createCart = async()=>{
        return await this.dao.create({products:[]})
    }

    addToCart = async()=>{
        return await this.dao.addToCart()
    }

    deleteProductInCart = async(cartId, productId)=>{
        return await this.dao.deleteInCart(cartId, productId)
    }

    deleteProducts = async(cartId)=>{
        return await this.dao.delete(cartId)
    }

    update = async(cartId, updatedCart)=>{
        return await this.dao.update(cartId, updatedCart)
    }

    updateProductQuantity = async (cid, pid, newQuantity) => {
        return await this.dao.updateQuantity(cid, pid, newQuantity)
    }
}

export const cartService = new CartService(new CartManagerMONGO)