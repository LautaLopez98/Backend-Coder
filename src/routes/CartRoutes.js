import {Router} from "express";
import { auth } from "../middlewares/auth.js";
import { CartController } from "../controllers/cartController.js";
export const router = Router();

router.get("/", CartController.getCarts);
router.get("/:cid", CartController.getCartById)
router.post("/", CartController.createCart);
router.post("/:cid/purchase", auth(["user"]), CartController.purchaseCart)
router.post('/:cid/product/:pid', auth(["user"]), CartController.addToCart);
router.delete("/:cid/products/:pid", auth(["user"]), CartController.deleteProductInCart);
router.put("/:cid", auth(["admin", "user"]), CartController.updateCart);
router.put("/:cid/products/:pid", auth(["admin", "user"]), CartController.updateProductInCart);
router.delete("/:cid", auth(["admin", "user"]), CartController.deleteProducts);