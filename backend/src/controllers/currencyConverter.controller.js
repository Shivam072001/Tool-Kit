import { currencyConverterService } from "../services/currencyConverter.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * (Existing Controller - Unchanged)
 */
export const getCurrencyRates = async (req, res, next) => {
    try {
        const ratesData = await currencyConverterService.getLatestRates();
        res.status(200).json(new ApiResponse(200, ratesData));
    } catch (error) {
        next(error);
    }
};

/**
 * (New Controller)
 */
export const saveConversion = async (req, res, next) => {
    try {
        await currencyConverterService.saveConversionHistory(req.body, req.user.id);
        res.status(201).json(new ApiResponse(201, null, 'Conversion saved.'));
    } catch (error) {
        next(error);
    }
};

/**
 * (New Controller)
 */
export const getConversionHistory = async (req, res, next) => {
    try {
        const history = await currencyConverterService.getConversionHistory(req.user.id);
        res.status(200).json(new ApiResponse(200, { history }));
    } catch (error) {
        next(error);
    }
};

export const deleteCurrencyConversion = async (req, res, next) => {
    try {
        await currencyConverterService.deleteConversion(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'Conversion deleted successfully'));
    } catch (error) {
        next(error);
    }
};