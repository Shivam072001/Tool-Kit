// src/routes/qrCode.routes.js

import express from "express";
import {
    createQRCode,
    deleteQRCode,
    getUserQRCodes,
    disableQRCode,
    enableQRCode,
} from "../controllers/qrCode.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createQRCodeSchema, enableQRCodeSchema } from "../validations/qrCode.validation.js";

const router = express.Router();

router.use(protect);

router.route("/").post(validate(createQRCodeSchema), createQRCode).get(getUserQRCodes);

router.route("/:id").delete(deleteQRCode);

router.patch("/:id/disable", disableQRCode);
router.patch("/:id/enable", validate(enableQRCodeSchema), enableQRCode);

export { router as qrCodeRoutes };
