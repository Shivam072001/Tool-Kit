// src/services/passwordVaultService.js

import axiosInstance from '../lib/axiosInstance';

export const passwordVaultService = {
    getVault: async () => {
        const response = await axiosInstance.get('/vault');
        return response.data;
    },
    saveVault: async (encryptedData) => {
        const response = await axiosInstance.post('/vault', { vaultData: encryptedData });
        return response.data;
    },
    checkBreach: async (password) => {
        const response = await axiosInstance.post('/vault/check-breach', { password });
        return response.data;
    },
    // New function to create a share link
    createShare: async (shareData) => {
        const response = await axiosInstance.post('/shares', shareData);
        return response.data;
    },
    // New function to claim a shared item
    claimShare: async (accessToken) => {
        const response = await axiosInstance.get(`/shares/${accessToken}`);
        return response.data;
    },
};