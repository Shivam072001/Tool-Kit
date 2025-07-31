// src/services/fakeDataService.js

import axiosInstance from '../lib/axiosInstance.js';

export const fakeDataService = {
    generate: async (options) => {
        const response = await axiosInstance.post('/fake-data/generate', options);
        return response.data;
    },
    getHistory: async () => {
        const response = await axiosInstance.get('/fake-data/history');
        return response.data;
    },
    deleteHistory: async (id) => {
        return await axiosInstance.delete(`/fake-data/history/${id}`);
    },
};