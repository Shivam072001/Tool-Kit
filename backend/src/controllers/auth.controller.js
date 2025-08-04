import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.register(email, password);
        res.status(201).json(new ApiResponse(201, { user, token }, 'User registered successfully'));
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
    } catch (error) {
        next(error);
    }
};