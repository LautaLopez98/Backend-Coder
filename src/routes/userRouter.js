import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { upload } from "../../utils.js";

export const router = Router();

router.post("/premium/:uid", UserController.changeUserRole);
router.post("/:uid/documents", upload.fields([{ name: 'documents', maxCount: 10 },{ name: 'profile', maxCount: 10 },{ name: 'product', maxCount: 10 }]), UserController.uploadDocuments);