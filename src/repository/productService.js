import ProductManagerMONGO from "../dao/Mongo/productManagerMONGO.js";

class ProductService {
    constructor(dao){
        this.dao = dao;
    }

    getProducts = async(limit, page, sort, query)=>{
        return await this.dao.get(limit, page, sort, query);
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