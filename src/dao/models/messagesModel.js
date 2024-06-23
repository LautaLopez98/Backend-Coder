import mongoose from "mongoose"

export const messagesModel=mongoose.model(
    "mensajes",
    new mongoose.Schema(
        {
            email:String, 
            mensaje: String
        },
        {
            timestamps:true
        }
    )
)