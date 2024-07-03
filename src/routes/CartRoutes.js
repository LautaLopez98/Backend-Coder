import {Router} from "express";
import { auth } from "../middlewares/auth.js";
import { CartController } from "../controllers/cartController.js";
export const router = Router();

router.get("/", CartController.getCarts);
router.get("/:cid", CartController.getCartById)
router.post("/", CartController.createCart);
router.post("/:cid/purchase", CartController.purchaseCart)
router.post('/:cid/product/:pid',  CartController.addToCart);
router.delete("/:cid/products/:pid", CartController.deleteProductInCart);
router.put("/:cid",  CartController.updateCart);
router.put("/:cid/products/:pid",  CartController.updateProductInCart);
router.delete("/:cid",  CartController.deleteProducts);