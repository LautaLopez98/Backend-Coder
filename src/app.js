import express from 'express';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { initPassport } from './config/passportConfig.js';
import {router as productsRoutes} from "./routes/ProductRoutes.js"
import {router as cartRoutes} from "./routes/CartRoutes.js"
import {router as vistasRoutes} from "./routes/vistas.router.js";
import {router as sessionsRoutes} from "./routes/sessionsRouter.js";
import {router as mockingRouter} from "./routes/mockingRouter.js";
import {router as loggerRouter} from "./routes/loggerRouter.js";
import {router as userRoutes} from "./routes/userRouter.js"
import {router as resetRoutes} from "./routes/resetPassword.js"
import {Server} from 'socket.io';
import {engine} from 'express-handlebars';
import __dirname from '../utils.js';
import path from "path";
import { errorHandler } from './middlewares/errorHandler.js';
import mongoose from 'mongoose';
import { messagesModel } from './dao/models/messagesModel.js';
import { productsModel } from './dao/models/productModel.js';
import sessions from "express-session"
import { config } from './config/config.js';
import compression from 'express-compression';
import "express-async-errors"
import { logger } from './logger.js';
import { middLogger } from './logger.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from "swagger-ui-express";

const publics = path.join(__dirname, "src","public");
const views = path.resolve(__dirname, "src","views")

const PORT = config.PORT
const app = express()

const options={
    definition:{
        openapi: "3.0.0",
        info:{
            title:"Api Backend",
            version: "1.0.0",
            description:"Documentación del Ecommerce"
        },
    },
    apis: ["./src/docs/*.yaml"]
}
const spec = swaggerJsDoc(options)


app.use(express.json());
app.use(compression({}))
app.use(express.urlencoded({extended: true}));

app.use(sessions({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        ttl: 3600,
        mongoUrl: config.MONGO_URL_COMPLETE
    })
}))

app.use(middLogger);
initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(publics));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', views);


app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec))
app.use("/", vistasRoutes);
app.use("/mockingproducts", mockingRouter);
app.use("/loggertest", loggerRouter);
app.use("/resetpassword", resetRoutes);
app.use(errorHandler)

let usuarios=[]

const serverHTTP = app.listen(PORT, ()=> logger.info(`Server online en puerto ${PORT}`));
export const io = new Server(serverHTTP);

io.on('connection', async (socket) =>{
    const productos = await productsModel.find();
    socket.emit('products', productos);
    console.log("Cliente conectado");

    socket.on('addProduct', async (producto) =>{
        const newGame = await productsModel.create({...producto});
        if (newGame) {
            productos.push(newGame);
            console.log(newGame)
            socket.emit('products', productos);
        }
    })

    socket.on('deleteProduct', async (productId) =>{
        let deleteProduct = await productsModel.deleteOne(productId)
        if (deleteProduct){
            socket.emit('productDeleted', deleteProduct);
        } else {
            console.log('Producto no encontrado');
            socket.emit('deleteError', 'Producto no encontrado');
        }
    })
}),

//Socket del chat//
io.on('connection', (socket) =>{
    socket.on("id", async(nombre)=>{
        usuarios.push({id:socket.id, nombre})
        let mensajes=await messagesModel.find().lean()
        mensajes=mensajes.map(m=>{
            return {nombre: m.email, mensaje: m.mensaje}
        })
        socket.emit("mensajesPrevios", mensajes)
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", async(nombre, mensaje)=>{
        await messagesModel.create({email:nombre, mensaje})
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("saleUsuario", usuario.nombre)
        }
    })
})

const db = async() => {
    try {
        await mongoose.connect(
            config.MONGO_URL, {dbName: config.DB_NAME} )
        console.log(`db ${config.DB_NAME} online`)
    } catch (error) {
        console.log("Error al conectar a la base de datos", error.message);
    }
}

db()

export default app;