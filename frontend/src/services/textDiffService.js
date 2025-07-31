// src/services/textDiffService.js

import axiosInstance from '../lib/axiosInstance.js';

export const textDiffService = {
    saveDiff: async (originalText, changedText) => {
        return await axiosInstance.post('/text-diff', { originalText, changedText });
    },
    getHistory: async () => {
        const response = await axiosInstance.get('/text-diff');
        return response.data;
    },
    deleteDiff: async (id) => {
        return await axiosInstance.delete(`/text-diff/${id}`);
    },
};