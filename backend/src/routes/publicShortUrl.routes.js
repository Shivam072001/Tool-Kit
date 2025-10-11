import express from "express";
import { shorten, resolve } from "../controllers/urlShortener.controller.js";

const router = express.Router();

router.post('/shorten', shorten);
router.get('/:shortCode', resolve);

export default router;
