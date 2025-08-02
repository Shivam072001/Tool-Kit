import express from "express";
import {
    createShortUrl,
    deleteShortUrl,
    getUserUrls,
    disableShortUrl,
    enableShortUrl,
} from "../controllers/shortUrl.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createShortUrlSchema, enableShortUrlSchema } from "../validations/shortUrl.validation.js";
const router = express.Router();

router.use(protect); // All routes below are protected

router.route("/").post(validate(createShortUrlSchema), createShortUrl).get(getUserUrls);

router.route("/:id").delete(deleteShortUrl);

router.patch("/:id/disable", disableShortUrl);
router.patch("/:id/enable", validate(enableShortUrlSchema), enableShortUrl);

export { router as shortUrlRoutes };
