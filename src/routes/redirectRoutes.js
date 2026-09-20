import { Router } from "express";
import { redirectURL } from "../controllers/urlController.js";

const router = Router();

// GET /:code
router.get("/:code", redirectURL);

export default router;
