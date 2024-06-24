import ProductManagerMONGO from "../dao/Mongo/productManagerMONGO.js";

class ProductService {
    constructor(dao){
        this.dao = dao;
    }

    getProducts = async()=>{
        return await this.dao.get();
    }

    getProductBy = async(filtro={})=>{
        return await this.dao.getById(filtro);
    }

    addProduct = async(product)=>{
        return await this.dao.add(product)
    }

    deleteProduct = async(id)=>{
        return await this.dao.delete({ _id: id })
    }

    updateProduct = async(productId, newProductData)=>{
        return await this.dao.update(productId, newProductData)
    }
}

export const productService = new ProductService(new ProductManagerMONGO)