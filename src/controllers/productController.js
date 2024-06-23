import {isValidObjectId} from "mongoose";
import {io} from "../app.js"
import { productService } from "../services/productService.js";
import { errorHandler } from "../middlewares/errorHandler.js";


export class ProductController {
    static getProducts = async (req, res) => {
        try {
            const { page, limit, sort, category, stock } = req.query;
            const query = { category, stock };
            const products = await productService.getProducts(limit, page, sort, query);
            res.json(products);
        } catch (error) {
            console.error("Error al obtener los productos", error);
            res.status(500).json({error: error.message});
        }
    }

    static getProductById = async (req, res)=> {
        let {pid}=req.params
        if(!isValidObjectId(pid)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id valido de MongoDB como argumento para busqueda`})
        }
        try {
            let product = await productService.getProductBy({_id:pid});
            if (!product) {
                return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
            }
            res.json(product);
        } catch (error) {
            console.error(`Error al obtener el producto con id ${pid}`, error);
            res.status(500).json({error: error.message});
            
        }
    }

    static addProduct = async (req, res)=> {
        try {
            let {title, description, price, code, stock, category, status} = req.body;
            let thumbnail=undefined
            if(req.file){
                thumbnail=req.file.filename
            }
            if(!title || !description || !price || !code || !stock || !category){
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`Faltan datos: title, description, price, code, stock, category son obligatorios`})
            }
            const product = await productService.addProduct({title, description, price, thumbnail, code, stock, category, status})
            res.json(product)
        } catch (error) {
            console.error("Error al crear el producto", error);
            res.status(500).json({error: error.message});
        }
    }

    static updateProduct = async (req, res)=> {
        let {pid}=req.params
        if(!isValidObjectId(pid)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id valido de MongoDB como argumento para busqueda`})
        }
        try{
        const newProduct = await productService.updateProduct({_id:pid}, req.body)
        res.json(newProduct)
        }catch(error) {
            console.error(`Error al actualizar el producto con id ${pid}`, error);
            res.status(500).json({error: error.message});
        }
    }

    static deleteProduct = async (req, res) => {
        let { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({error: `Enter a valid MongoDB id`});
        }
        try {
            let products = await productService.deleteProduct(pid);
            if (products.deletedCount > 0) {
            let productList = await productService.getProducts();
            io.emit("deleteProducts", productList);
            return res.json({ payload: `Product ${pid} deleted` });
        } else {
            return res.status(404).json({ error: `Product ${id} doesnt exist` });
        }
        } catch (error) {
            res.status(300).json({ error: `Error deleting product ${pid}` });
        }
    }
}