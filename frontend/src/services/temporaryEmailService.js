// src/services/temporaryEmailService.js

import axiosInstance from '../lib/axiosInstance.js';

export const temporaryEmailService = {
    generateNewEmail: async () => {
        const response = await axiosInstance.post('/temp-email/generate');
        return response.data;
    },

    getInbox: async () => {
        const response = await axiosInstance.get('/temp-email/inbox');
        return response.data;
    },

    deleteEmail: async (id) => {
        return await axiosInstance.delete(`/temp-email/${id}`);
    },
};