import { Router } from "express";
import { UserController } from "../controllers/userController.js";

export const router = Router();

router.post("/premium/:uid", UserController.changeUserRole);