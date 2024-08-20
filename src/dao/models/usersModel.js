import mongoose from 'mongoose'

export const usersModel=mongoose.model('usuarios',new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email:{
        type: String, unique:true
    }, 
    password: String,
    rol: {
        type: String,
        default: "user",
        enum: ["user", "admin", "premium"]
    },
    carrito: {
        type: mongoose.Types.ObjectId, ref: "carritos"
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date,
        default: null
    }
}, {timestamps:true, strict:false}))