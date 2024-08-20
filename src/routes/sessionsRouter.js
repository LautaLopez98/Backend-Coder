import {Router} from "express";
export const router = Router();
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.js";
import { UsersDTO } from "../dto/usersDto.js";
import { usersModel } from "../dao/models/usersModel.js";

router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        }
    )
})

router.post('/registro', passportCall("registro", "registro"),async (req, res) => {
    if (req.user) {
        return res.redirect('/login');
    }
    res.setHeader('Content-Type','application/json');
    return res.status(201).json({newUser: req.user});
})

router.post('/login', passportCall("login", "login"), async (req, res) => {
    if (req.user) {
        let user = { ...req.user };
        delete user.password;
        req.session.user = user;
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "Login correcto", user });
    } else {
        res.status(401).json({ error: "Credenciales inválidas" });
    }
});


router.get("/github", passport.authenticate("github", {}), (req, res)=>{})

router.get("/cbGitHub", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), (req, res)=>{
    req.session.user=req.user

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Usuario logueado", user:req.user});
})

router.get("/logout", async (req, res)=>{
    if (req.session.user) {
        let user = await usersModel.findById({ _id: req.session.user._id });
        user.last_connection = new Date();
        await user.save();
    }

    req.session.destroy(e=>{
        if(e){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor. Intenta más tarde, o contacta a tu administrador`,
                    detalle:`${error.message}`
                }
            )
        }
    })
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Logout Exitoso"});
})

router.get("/current", (req, res) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    const userDTO = new UsersDTO(req.session.user);
    return res.send(userDTO);
});