import { BACKEND_ROUTES } from '../constants';
import axiosInstance from '../lib/axiosInstance';
import { logger } from '../utils/Logger';

const { AUTH } = BACKEND_ROUTES;

export const authService = {
    /**
     * Registers a new user.
     * @param {{email, password}} credentials
     */
    register: async (credentials) => {
        const response = await axiosInstance.post(`${AUTH}/register`, credentials);
        return response.data;
    },

    /**
     * Logs in a user.
     * @param {{email, password}} credentials - User's email and password.
     */
    login: async (credentials) => {
        const response = await axiosInstance.post(`${AUTH}/login`, credentials);
        const { data } = response.data;
        return {
            user: data.user,
            token: data.token,
        };
    },
};