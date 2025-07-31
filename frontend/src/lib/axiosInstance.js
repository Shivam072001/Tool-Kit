// src/lib/axiosInstance.js

import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { config } from '../config/env'

const axiosInstance = axios.create({
    baseURL: config.apiGatewayUrl,
});

// Request interceptor to add the auth token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;