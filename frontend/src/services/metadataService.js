// src/services/metadataService.js

import axiosInstance from '../lib/axiosInstance.js';

export const metadataService = {
    inspectFile: async (file, onUploadProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/metadata/inspect', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
        return response.data;
    },

    getHistory: async () => {
        const response = await axiosInstance.get('/metadata/history');
        return response.data;
    },

    deleteHistory: async (id) => {
        return await axiosInstance.delete(`/metadata/history/${id}`);
    },
};