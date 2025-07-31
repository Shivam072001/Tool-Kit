// src/services/currencyConverterService.js

import axiosInstance from '../lib/axiosInstance.js';

export const currencyConverterService = {
    getCurrencyRates: async () => {
        const response = await axiosInstance.get('/currency/list');
        return response.data;
    },

    // (New Method)
    saveConversion: async (conversionData) => {
        return await axiosInstance.post('/currency/history', conversionData);
    },

    // (New Method)
    getHistory: async () => {
        const response = await axiosInstance.get('/currency/history');
        return response.data;
    },

    deleteHistory: async (id) => {
        return await axiosInstance.delete(`/currency/history/${id}`);
    },
};