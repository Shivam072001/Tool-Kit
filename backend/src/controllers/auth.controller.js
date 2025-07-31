// backend-gateway/src/controllers/auth.controller.js

import { authService } from '../services/auth.service.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.register(email, password);
        res.status(201).json({ status: 'success', token, data: { user } });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.status(200).json({ status: 'success', token, data: { user } });
    } catch (error) {
        next(error);
    }
};