// backend-gateway/src/repositories/user.repository.js

import User from '../models/user.model.js';

class UserRepository {
    /**
     * Creates a new user in the database.
     * @param {object} userData - The user data (email, password).
     * @returns {Promise<User>} The created user document.
     */
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    /**
     * Finds a user by their email address.
     * @param {string} email - The user's email.
     * @returns {Promise<User|null>} The found user document or null.
     */
    async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    /**
     * Finds a user by their ID.
     * @param {string} id - The user's ID.
     * @returns {Promise<User|null>} The found user document or null.
     */
    async findUserById(id) {
        return await User.findById(id);
    }
}

export const userRepository = new UserRepository();