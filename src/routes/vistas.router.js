import { Router } from "express";
import ProductManagerMONGO from "../dao/Mongo/productManagerMONGO.js";
import CartManagerMONGO from "../dao/Mongo/cartManagerMONGO.js";
import { productsModel } from "../dao/models/productModel.js";
import {auth} from "../middlewares/auth.js";
import { generateResetToken, verifyResetToken } from '../jwt.js';
export const router = Router();

const productManager = new ProductManagerMONGO()
const cartManager = new CartManagerMONGO()

router.get('/', async (req, res) =>{
    const productos = await productsModel.find().lean();
    return res.render('home', {productos, login: req.session.user});
})

router.get('/registro',(req, res, next)=>{
    if(req.session.user){
        return res.redirect("/profile")
    }
    next()
},(req,res)=>{
    let {error}=req.query
    res.status(200).render('registro', {error, login: req.session.user})
})

router.get('/login', (req, res) =>{
    let {error}=req.query
    res.status(200).render('login', {error, login: req.session.user})
})

router.get('/profile', auth(["admin", "user", "premium"]) ,(req, res) =>{
    res.status(200).render('profile', {user: req.session.user, login: req.session.user})
})

router.get('/realtimeproducts', auth(["admin"]), (req, res) =>{
    return res.render('realTimeProducts', {login: req.session.user});
})

router.get('/chats', auth(["user", "premium"]),(req,res)=>{
    return res.status(200).render('chat', {login: req.session.user})
})

router.get('/products', auth(["admin", "user", "premium"]), async (req, res) => {
    let {mensaje} = req.query;
    try {
        let carrito={
            _id: req.session.user.carrito
        }
        const { page, limit, sort, category, stock } = req.query;
        const pageNumber = parseInt(page) || 1;
        const result = await productManager.get(
            parseInt(limit) || 10, 
            pageNumber,
            sort,
            { category, stock }
        );
        res.render("products", { carrito,
            nombreUsuario: req.session.user.first_name,
            productos: result.payload,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            login: req.session.user,
            mensaje,
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/sendpassword', (req, res) => {
    res.render('changepassword');
});

router.get('/resetpassword/:token', (req, res) => {
    const { token } = req.params;
    const payload = verifyResetToken(token);
    if (!payload) {
        req.logger.error('El enlace ha expirado o es inválido');
        return res.render('new-login')
    }
    return res.render('resetpassword', { token });
});

router.get('/carts/:cid', async (req, res) => {
    let {cid} = req.params;
        let carrito = await cartManager.getByPopulate({_id: cid});
        res.setHeader('Content-Type','text/html');
        return res.status(200).render("carts", {carrito, login: req.session.user});
});