// src/services/urlService.js

import axiosInstance from '../lib/axiosInstance';

export const shortUrlService = {
    createShortUrl: async (originalUrl, maxClicks, expiresAt) => {
        const response = await axiosInstance.post('/urls', {
            originalUrl,
            maxClicks: maxClicks || null,
            expiresAt: expiresAt || null,
        });
        return response.data;
    },

    getUserUrls: async () => {
        const response = await axiosInstance.get('/urls');
        return response.data;
    },

    deleteShortUrl: async (id) => {
        return await axiosInstance.delete(`/urls/${id}`);
    },

    disableShortUrl: async (id) => {
        return await axiosInstance.patch(`/urls/${id}/disable`);
    },

    enableShortUrl: async (id, newMaxClicks) => {
        return await axiosInstance.patch(`/urls/${id}/enable`, { newMaxClicks });
    },
};