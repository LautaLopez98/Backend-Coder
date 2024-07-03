import {isValidObjectId} from "mongoose";
import {io} from "../app.js"
import { productService } from "../repository/productService.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { CustomError  } from "../errors/customError.js";
import { TIPOS_ERROR } from "../errors/errors.js"
import "express-async-errors"

export class ProductController {
    static getProducts = async (req, res, next) => {
        try {
            const { page, limit, sort, category, stock } = req.query;
            const query = { category, stock };
            const products = await productService.getProducts(limit, page, sort, query);
            res.json(products);
        } catch (error) {
            return next(error);
        }
    }

    static getProductById = async (req, res, next)=> {
        let {pid}=req.params
        if(!isValidObjectId(pid)){
            return next(CustomError.createError('Error', null, 'Ingrese un id válido de MongoDB como argumento para búsqueda', TIPOS_ERROR.INVALID_ARGUMENT));
        }
        try {
            let product = await productService.getProductBy({_id:pid});
            if (!product) {
                return next(CustomError.createError('ProductNotFoundError', null, `Producto con id ${pid} no encontrado`, TIPOS_ERROR.PRODUCT_NOT_FOUND));
            }
            res.json(product);
        } catch (error) {
            return next(error);
        }
    }

    static addProduct = async (req, res, next)=> {
        try {
            let {title, description, price, code, stock, category, status} = req.body;
            let thumbnail=undefined
            if(req.file){
                thumbnail=req.file.filename
            }
            if(!title || !description || !price || !code || !stock || !category){
                return next(CustomError.createError('InvalidArgumentError', null, 'Faltan datos: title, description, price, code, stock, category son obligatorios', TIPOS_ERROR.INVALID_ARGUMENT));
            }
            const product = await productService.addProduct({title, description, price, thumbnail, code, stock, category, status})
            res.json(product)
        } catch (error) {
            return next(error);
        }
    }

    static updateProduct = async (req, res, next)=> {
        let {pid}=req.params
        if(!isValidObjectId(pid)){
            return next(CustomError.createError('Error', null, 'Ingrese un id válido de MongoDB como argumento para búsqueda', TIPOS_ERROR.INVALID_ARGUMENT));
        }
        try{
            const newProduct = await productService.updateProduct({_id:pid}, req.body)
            res.json(newProduct)
        }catch(error) {
            return next(error);
        }
    }

    static deleteProduct = async (req, res, next) => {
        let { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return next(CustomError.createError('Error', null, 'Ingrese un id válido de MongoDB como argumento para búsqueda', TIPOS_ERROR.INVALID_ARGUMENT));
        }
        try {
            let products = await productService.deleteProduct(pid);
            if (products.deletedCount > 0) {
            let productList = await productService.getProducts();
            io.emit("deleteProducts", productList);
            return res.json({ payload: `Producto con ID ${pid} eliminado`});
        } else {
            return next(CustomError.createError('ProductNotFoundError', null, `El producto con id ${pid} no existe`, TIPOS_ERROR.PRODUCT_NOT_FOUND));
        }
        } catch (error) {
            return next(error);
        }
    }
}