import { Router } from "express";
import { createShortURL, getUrlState } from "../controllers/urlController.js";

const router = Router();

// POST /api/shorten
router.post("/shorten", createShortURL);

// GET /api/stats/:code
router.get("/stats/:code", getUrlState);

export default router;
