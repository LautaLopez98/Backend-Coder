import {Router} from "express";
import { logger } from "../logger.js";
export const router = Router();

router.get("/", (req, res) => {
    logger.fatal("Log de error fatal");
    logger.error("Log de error");
    logger.warning("Log de error warning");
    logger.info("Log de error info");
    logger.http("Log de error HTTP");
    logger.debug("Log de error debug");

    return res.json({ message: "Logs generados correctamente" });
});