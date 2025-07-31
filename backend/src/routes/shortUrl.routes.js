import express from "express";
import {
    createShortUrl,
    deleteShortUrl,
    getUserUrls,
    disableShortUrl,
    enableShortUrl,
} from "../controllers/shortUrl.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protect); // All routes below are protected

router.route("/").post(createShortUrl).get(getUserUrls);

router.route("/:id").delete(deleteShortUrl);

router.patch("/:id/disable", disableShortUrl);
router.patch("/:id/enable", enableShortUrl);

export { router as shortUrlRoutes };
