// src/controllers/converter.controller.js

import { currencyConverterService } from "../services/currencyConverter.service.js";


/**
 * (Existing Controller - Unchanged)
 */
export const getCurrencyRates = async (req, res, next) => {
    try {
        const ratesData = await currencyConverterService.getLatestRates();
        res.status(200).json({ status: 'success', data: ratesData });
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
        res.status(201).json({ status: 'success', message: 'Conversion saved.' });
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
        res.status(200).json({ status: 'success', data: { history } });
    } catch (error) {
        next(error);
    }
};

export const deleteCurrencyConversion = async (req, res, next) => {
    try {
        await currencyConverterService.deleteConversion(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};