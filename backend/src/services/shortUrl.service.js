import { nanoid } from 'nanoid';
import { shortUrlRepository } from '../repositories/shortUrl.repository.js';
import { AppError } from '../utils/AppError.js';

class ShortUrlService {
    async createUrl(originalUrl, maxClicks, expiresAt, userId = null) {
        try {
            new URL(originalUrl);
        } catch (error) {
            throw new AppError('Invalid URL format provided.', 400);
        }

        const shortCode = nanoid(7);

        const urlData = {
            originalUrl,
            shortCode,
            user: userId,
            maxClicks: maxClicks ? parseInt(maxClicks, 10) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        };

        return await shortUrlRepository.createShortUrl(urlData);
    }

    async toggleUrlStatus(urlId, userId, status, newMaxClicks = null) {
        const urlDoc = await shortUrlRepository.findByIdAndUserId(urlId, userId);
        if (!urlDoc) {
            throw new AppError('No URL found with that ID for this user.', 404);
        }

        let updateData = { disabled: status };

        // If re-enabling, calculate the new max clicks limit
        if (status === false) {
            const additionalClicks = parseInt(newMaxClicks, 10);
            if (isNaN(additionalClicks) || additionalClicks <= 0) {
                throw new AppError('A positive number is required for the new max clicks limit.', 400);
            }
            // The new limit is the current number of clicks plus the additional amount
            updateData.maxClicks = urlDoc.clicks + additionalClicks;
        }

        return await shortUrlRepository.updateById(urlId, updateData);
    }

    async getUrlsForUser(userId) {
        return await shortUrlRepository.findUrlsByUserId(userId);
    }

    async deleteShortUrl(urlId, userId) {
        const result = await shortUrlRepository.deleteById(urlId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No URL found with that ID for this user.', 404);
        }
        return result;
    }
}

export const shortUrlService = new ShortUrlService();