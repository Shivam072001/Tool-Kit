// backend/src/services/secureShare.service.js

import crypto from 'crypto';
import { secureShareRepository } from '../repositories/secureShare.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { encrypt, decrypt } from '../utils/SecureShareCrypto.js';

class SecureShareService {
    async createShare(sharerId, recipientEmail, passwordItem, expiresIn) {
        const accessToken = crypto.randomBytes(32).toString('hex');

        const encryptedData = encrypt(passwordItem, accessToken);

        const expiresAt = new Date(Date.now() + parseInt(expiresIn) * 60 * 1000); // expiresIn is in minutes

        await secureShareRepository.create({
            sharerId,
            recipientEmail,
            encryptedData,
            accessToken,
            expiresAt,
        });

        return accessToken;
    }

    async claimShare(accessToken, recipientId) {
        const recipient = await userRepository.findUserById(recipientId);
        if (!recipient) {
            throw new AppError('Recipient user not found.', 404);
        }

        const share = await secureShareRepository.findByAccessToken(accessToken);

        if (!share || share.isUsed || new Date() > share.expiresAt) {
            throw new AppError('This share link is invalid or has expired.', 410);
        }

        if (share.recipientEmail !== recipient.email) {
            throw new AppError('You are not authorized to view this share.', 403);
        }

        const decryptedData = decrypt(share.encryptedData, accessToken);
        if (!decryptedData) {
            throw new AppError('Failed to decrypt share data.', 500);
        }

        await secureShareRepository.markAsUsed(share._id);

        return decryptedData;
    }
}

export const secureShareService = new SecureShareService();