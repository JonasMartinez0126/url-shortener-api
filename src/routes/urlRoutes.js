import { Router } from "express";
import { createShortURL } from "../controllers/urlController.js";

const router = Router();

// POST /api/shorten
router.post("/shorten", createShortURL);

export default router;
