// src/services/regexService.js

import axiosInstance from '../lib/axiosInstance.js';

export const regexService = {
    /**
     * (New Method)
     * Tests a regex pattern using the backend service.
     */
    testPattern: async (patternData) => {
        const response = await axiosInstance.post('/regex/test', patternData);
        return response.data;
    },

    savePattern: async (patternData) => {
        return await axiosInstance.post('/regex', patternData);
    },
    getHistory: async () => {
        const response = await axiosInstance.get('/regex');
        return response.data;
    },
    deletePattern: async (id) => {
        return await axiosInstance.delete(`/regex/${id}`);
    },
};