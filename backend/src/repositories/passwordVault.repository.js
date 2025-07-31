// src/repositories/passwordVault.repository.js

import PasswordVault from '../models/passwordVault.model.js';

class PasswordVaultRepository {
    /**
     * Finds a user's vault.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<passwordVault|null>}
     */
    async findByUserId(userId) {
        return await PasswordVault.findOne({ user: userId });
    }

    /**
     * Creates or updates a user's vault.
     * @param {string} userId - The ID of the user.
     * @param {string} encryptedData - The encrypted vault data string.
     * @returns {Promise<passwordVault>}
     */
    async upsert(userId, encryptedData) {
        return await PasswordVault.findOneAndUpdate(
            { user: userId },
            { vaultData: encryptedData, user: userId },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }
}

export const passwordVaultRepository = new PasswordVaultRepository();