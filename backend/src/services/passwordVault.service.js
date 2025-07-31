// src/services/passwordVault.service.js

import { passwordVaultRepository } from '../repositories/passwordVault.repository.js';
import { userRepository } from '../repositories/user.repository.js'; // Import user repository
import { AppError } from '../utils/AppError.js';
import crypto from 'crypto';
import axios from 'axios';

class PasswordVaultService {
    async getVault(userId) {
        const user = await userRepository.findUserById(userId);
        if (!user || !user.vaultSalt) {
            throw new AppError('User or vault salt not found.', 404);
        }
        const vault = await passwordVaultRepository.findByUserId(userId);
        return {
            vaultData: vault ? vault.vaultData : '',
            salt: user.vaultSalt // Return the salt with the vault data
        };
    }

    async saveVault(userId, encryptedData) {
        return await passwordVaultRepository.upsert(userId, encryptedData);
    }

    /**
     * Checks a password against the 'Have I Been Pwned' database.
     * @param {string} password - The password to check.
     */
    async checkPwnedPassword(password) {
        const sha1Password = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
        const prefix = sha1Password.substring(0, 5);
        const suffix = sha1Password.substring(5);

        try {
            const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
            const hashes = response.data.split('\r\n');
            for (const line of hashes) {
                const [hashSuffix, count] = line.split(':');
                if (hashSuffix === suffix) {
                    return { pwned: true, count: parseInt(count, 10) };
                }
            }
            return { pwned: false, count: 0 };
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { pwned: false, count: 0 }; // Prefix not found, so password is safe
            }
            throw new AppError('Could not connect to the breach monitoring service.', 503);
        }
    }
}

export const passwordVaultService = new PasswordVaultService();