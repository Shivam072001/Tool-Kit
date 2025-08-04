// src/services/apiKeyService.js

import axiosInstance from '../lib/axiosInstance.js';

export const apiKeyService = {
    getApiKeys: async () => {
        const response = await axiosInstance.get('/keys');
        return response.data;
    },
    saveApiKeys: async (keys) => {
        const response = await axiosInstance.post('/keys', keys);
        return response.data;
    },
};