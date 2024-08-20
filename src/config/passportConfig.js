import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import UsersManager from "../dao/Mongo/usuariosManager.js";
import { generaHash, validatePassword } from "../../utils.js";
import CartManagerMONGO from "../dao/Mongo/cartManagerMONGO.js";
import { config } from "./config.js";
import { sendWelcomeEmail } from "../nodemailer.js";
import mongoose from "mongoose";
import { usersModel } from "../dao/models/usersModel.js";

const usuariosManager = new UsersManager()
const cartManager = new CartManagerMONGO();

export const initPassport = () =>{
    passport.use("registro", new local.Strategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, username, password, done)=>{
            try {
                let {first_name, last_name, age} = req.body;
                if(!first_name || !last_name || !age){
                    return done(null, false, { message: "Campos incompletos" });
                }
                let exist = await usuariosManager.getUserBy({email: username})
                if (exist) {
                    return done(null, false, {message: `El correo ${username} ya esta registrado`})
                }
                
                password = generaHash(password)

                let newCart=await cartManager.create()
                let newUser = await usuariosManager.create({first_name, last_name, age, email:username, password, carrito: newCart._id})
                // usuario adminCoder@coder.com, contraseña 123 ya creado //
                // sendWelcomeEmail(username)
                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    ))
    
    passport.use("login", new local.Strategy(
        {
            usernameField: "email"
        },
        async (username, password, done) => {
            try {
                let user = await usuariosManager.getUserBy({ email: username });
                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }
            
                if (!validatePassword(password, user.password)) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                user.last_connection = new Date();
                await usersModel.updateOne({ _id: user._id }, { last_connection: user.last_connection });
    
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("github", new github.Strategy(
        {
            clientID:config.CLIENT_ID,
            clientSecret:config.CLIENT_SECRET,
            callbackURL:"http://localhost:8080/api/sessions/cbGitHub"
        },
        async(tokenAcceso, tokenRefresh, profile, done)=>{
            try {
                let email=profile._json.email
                let first_name=profile._json.name
                if(!email){
                    return done(null, false)
                }
                let user=await usuariosManager.getUserBy({email})
                if(!user){
                    let newCart=await cartManager.create()
                    user=await usuariosManager.create(
                        {
                            first_name, email, profile, carrito: newCart._id
                        }
                    )
                    user=await usuariosManager.getUserBy({email})
                }

                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done)=>{
        return done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user=await usuariosManager.getUserBy({_id:id})
        return done(null, user)
    })
}