// src/services/converter.service.js

import axios from 'axios';
import { AppError } from '../utils/AppError.js';
import { currencyConverterRepository } from '../repositories/currencyConverter.repository.js';

const cache = {
    rates: null,
    lastFetch: 0,
    ttl: 1000 * 60 * 60, // Cache for 1 hour
};

class CurrencyConverterService {
    /**
     * (Existing Method - Unchanged)
     * Fetches the latest currency exchange rates, using a cache.
     */
    async getLatestRates() {
        const now = Date.now();
        if (cache.rates && (now - cache.lastFetch < cache.ttl)) {
            return cache.rates;
        }

        try {
            const response = await axios.get('https://api.frankfurter.app/latest?from=USD');
            cache.rates = response.data;
            cache.lastFetch = now;
            return response.data;
        } catch (error) {
            console.error("Failed to fetch currency rates:", error);
            throw new AppError('Could not fetch latest currency rates.', 502);
        }
    }

    /**
     * (New Method)
     * Saves a conversion event to the user's history.
     * @param {object} conversionData - The details of the conversion.
     * @param {string} userId - The ID of the user.
     */
    async saveConversionHistory(conversionData, userId) {
        const historyData = {
            user: userId,
            fromCurrency: conversionData.fromCurrency,
            toCurrency: conversionData.toCurrency,
            amount: conversionData.amount,
            result: conversionData.result,
        };
        return await currencyConverterRepository.create(historyData);
    }

    /**
     * (New Method)
     * Retrieves the conversion history for a user.
     * @param {string} userId - The ID of the user.
     */
    async getConversionHistory(userId) {
        return await currencyConverterRepository.findByUserId(userId);
    }

    async deleteConversion(operationId, userId) {
        const result = await currencyConverterRepository.deleteById(operationId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No No currency found for this user.', 404);
        }
        return result;
    }
}

export const currencyConverterService = new CurrencyConverterService();