import {Schema} from "mongoose"
import mongoose from "mongoose"

const cartCollection="carritos"
const cartEsquema=new mongoose.Schema(
    {
        products:{
            type:[
                {
                    product:{
                        type: Schema.Types.ObjectId, 
                        ref:"productos"
                    }, 
                    quantity: Number
                }
            ]
        }
    }
)

cartEsquema.pre("find", function() {this.populate("products.product")});
export const cartModel=mongoose.model(cartCollection, cartEsquema)