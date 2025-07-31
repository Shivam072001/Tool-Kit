// backend-gateway/src/services/auth.service.js

import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { config } from '../config/env.js';
import { DEFAULT_JWT_EXPIRATION } from '../constants/index.js';

const { jwtSecret, jwtExpiresIn } = config;

class AuthService {
    /**
     * Registers a new user.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Promise<object>} An object containing the new user and token.
     */
    async register(email, password) {
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new AppError('An account with this email already exists.', 409);
        }

        const newUser = await userRepository.createUser({ email, password });
        const token = this.generateToken(newUser._id);

        // Don't send password back, even if hashed
        newUser.password = undefined;
        return { user: newUser, token };
    }

    /**
     * Logs in a user.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Promise<object>} An object containing the user and token.
     */
    async login(email, password) {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new AppError('Invalid credentials.', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AppError('Invalid credentials.', 401);
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = this.generateToken(user._id);

        user.password = undefined;
        return { user, token };
    }

    /**
     * Generates a JWT for a given user ID.
     * @param {string} userId - The user's ID.
     * @returns {string} The generated JSON Web Token.
     */
    generateToken(userId) {
        return jwt.sign({ id: userId }, jwtSecret, {
            expiresIn: jwtExpiresIn || DEFAULT_JWT_EXPIRATION,
        });
    }
}

export const authService = new AuthService();