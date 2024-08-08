import {Router} from "express";
import { auth } from "../middlewares/auth.js";
import { CartController } from "../controllers/cartController.js";
export const router = Router();

router.get("/", CartController.getCarts);
router.get("/:cid", CartController.getCartById)
router.post("/", CartController.createCart);
router.post("/:cid/purchase", auth(["user", "premium"]), CartController.purchaseCart)
router.post('/:cid/product/:pid', auth(["user","premium"]), CartController.addToCart);
router.delete("/:cid/products/:pid", auth(["user", "premium"]), CartController.deleteProductInCart);
router.put("/:cid", auth(["admin", "user", "premium"]), CartController.updateCart);
router.put("/:cid/products/:pid", auth(["admin", "user", "premium"]), CartController.updateProductInCart);
router.delete("/:cid", auth(["admin", "user", "premium"]), CartController.deleteProducts);