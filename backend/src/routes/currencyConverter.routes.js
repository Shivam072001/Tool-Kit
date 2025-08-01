// src/routes/converter.routes.js

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    deleteCurrencyConversion,
    getConversionHistory,
    getCurrencyRates,
    saveConversion,
} from "../controllers/currencyConverter.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { saveConversionSchema } from "../validations/currencyConverter.validation.js";

const router = express.Router();

// All converter routes are protected
router.use(protect);

router.get("/list", getCurrencyRates);

router.route("/history").post(validate(saveConversionSchema), saveConversion).get(getConversionHistory);
router.route('/history/:id').delete(deleteCurrencyConversion);

export { router as currencyConverterRoutes };