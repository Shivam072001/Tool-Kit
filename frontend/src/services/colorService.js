import { BACKEND_ROUTES } from '../constants/index.js';
import axiosInstance from '../lib/axiosInstance.js';

const { COLORS } = BACKEND_ROUTES;

export const colorService = {
    savePalette: async (paletteData) => {
        return await axiosInstance.post(`${COLORS}`, paletteData);
    },
    getPalettes: async () => {
        const response = await axiosInstance.get(`${COLORS}`);
        return response.data;
    },
    deletePalette: async (id) => {
        return await axiosInstance.delete(`${COLORS}/${id}`);
    },
};