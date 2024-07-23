import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const productCollection="productos"
const productSchema=new mongoose.Schema({
    title:{type:String, required:[true,"El título es obligatorio"]},
    description:{type:String, required:[true,"La descripción es obligatoria"]},
    price:{type:Number, required:[true,"El precio es obligatorio"]},
    thumbnail:{ type: String },
    code:{type:String, required:[true,"El código es obligatorio"], unique: true},
    stock:{type:String, required:[true,"El stock es obligatorio"]},
    category:{type:String, required:[true,"La categoría es obligatoria"]},
    owner: {type: String, default: "admin"},
    status:{type:Boolean, default: true},
})

productSchema.plugin(paginate)
export const productsModel=mongoose.model(productCollection, productSchema)