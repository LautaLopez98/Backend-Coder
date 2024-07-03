import {Router} from "express";
import { Mocking } from "../controllers/mockingController.js";
export const router = Router();

router.get("/", Mocking.generateProducts)