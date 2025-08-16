// src/services/fileService.js
import axiosInstance from '../lib/axiosInstance';

export const fileService = {
    /**
     * (New Method)
     * Fetches the available file conversion options from the backend.
     */
    getConversionOptions: async () => {
        const response = await axiosInstance.get('/files/convert/options');
        return response.data;
    },

    /**
     * Uploads an image for compression.
     * @param {File} file - The image file to upload.
     * @param {Function} onUploadProgress - Callback for tracking upload progress.
     */
    uploadForCompression: async (file, onUploadProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/files/compress', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
        return response.data;
    },

    uploadForConversion: async (file, targetFormat, onUploadProgress) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetFormat', targetFormat);

        const response = await axiosInstance.post('/files/convert', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
        return response.data;
    },

    uploadForBackgroundRemoval: async (file, onUploadProgress) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post('/files/remove-background', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
        return response.data;
    },

    /**
     * Checks the status of a compression task.
     * @param {string} taskId - The ID of the task to check.
     */
    checkJobStatus: async (taskId) => {
        const response = await axiosInstance.get(`/files/status/${taskId}`);
        return response.data;
    },

    delete: async (id) => {
        return await axiosInstance.delete(`/files/${id}`);
    },
};