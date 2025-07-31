// backend-gateway/src/middleware/auth.middleware.js

import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { config } from '../config/env.js';

const { jwtSecret } = config;

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in. Please log in to get access.', 401));
        }

        const decoded = await promisify(jwt.verify)(token, jwtSecret);
        const currentUser = await userRepository.findUserById(decoded.id);

        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        req.user = currentUser;
        next();
    } catch (error) {
        next(new AppError('Authentication failed.', 401));
    }
};