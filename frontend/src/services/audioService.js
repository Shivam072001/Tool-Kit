import { BACKEND_ROUTES } from '../constants/index.js';
import axiosInstance from '../lib/axiosInstance.js';

const { AUDIO } = BACKEND_ROUTES;

export const audioService = {
    uploadForTranscription: async (file, onUploadProgress) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post(`${AUDIO}/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
        return response.data;
    },
    getHistory: async () => {
        const response = await axiosInstance.get(`${AUDIO}/history`)
        return response.data;
    },
    checkJobStatus: async (taskId) => {
        return await axiosInstance.get(`${AUDIO}/status/${taskId}`);
    },
    delete: async (id) => {
        return await axiosInstance.delete(`${AUDIO}/${id}`);
    }
};