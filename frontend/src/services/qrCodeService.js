// src/services/qrCodeService.js

import axiosInstance from '../lib/axiosInstance.js';

export const qrCodeService = {
    create: async (qrData) => {
        const response = await axiosInstance.post('/qrcodes', qrData);
        return response.data;
    },

    getAll: async () => {
        const response = await axiosInstance.get('/qrcodes');
        return response.data;
    },

    delete: async (id) => {
        return await axiosInstance.delete(`/qrcodes/${id}`);
    },

    disable: async (id) => {
        return await axiosInstance.patch(`/qrcodes/${id}/disable`);
    },

    enable: async (id, newMaxScans) => {
        return await axiosInstance.patch(`/qrcodes/${id}/enable`, { newMaxScans });
    },
};