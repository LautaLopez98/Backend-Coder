import {Router} from "express";
import { upload } from "../../utils.js";
import { auth } from "../middlewares/auth.js";
import { ProductController } from "../controllers/productController.js";
export const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:pid", ProductController.getProductById);
router.post("/", upload.single("thumbnail"), auth(["admin"]), ProductController.addProduct);
router.put("/:pid", auth(["admin"]), ProductController.updateProduct);
router.delete("/:pid", auth(["admin"]), ProductController.deleteProduct);
