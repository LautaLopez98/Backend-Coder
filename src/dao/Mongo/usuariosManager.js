import { usersModel } from "../models/usersModel.js";

class UsersManager {
    async getUsers() {
        return await usersModel.find().lean();
    }

    async getUserBy(filtro={}) {
        return await usersModel.findOne(filtro).lean();
    }

    async getByPopulate(filtro={}){
        return await usersModel.findOne(filtro).populate("carrito").lean()
    }

    async create(usuario){
        let nuevoUsuario=await usersModel.create(usuario)
        return nuevoUsuario.toJSON()
    }
}

export default UsersManager;