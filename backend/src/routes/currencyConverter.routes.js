// src/routes/converter.routes.js

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    deleteCurrencyConversion,
    getConversionHistory,
    getCurrencyRates,
    saveConversion,
} from "../controllers/currencyConverter.controller.js";

const router = express.Router();

// All converter routes are protected
router.use(protect);

router.get("/list", getCurrencyRates);

router.route("/history").post(saveConversion).get(getConversionHistory);
router.route('/history/:id').delete(deleteCurrencyConversion);

export { router as currencyConverterRoutes };
