// backend-gateway/src/repositories/url.repository.js

import { config } from '../config/env.js';
import ShortUrl from '../models/shortUrl.model.js';

const { enableSoftDelete } = config;

class ShortUrlRepository {
    async createShortUrl(urlData) {
        const shortUrl = new ShortUrl(urlData);
        return await shortUrl.save();
    }

    async findUrlByShortCode(shortCode) {
        return await ShortUrl.findOne({ shortCode, deleted: false });
    }

    async incrementClickCount(shortCode) {
        return await ShortUrl.findOneAndUpdate(
            { shortCode },
            { $inc: { clicks: 1 } },
            { new: true }
        );
    }

    async findUrlsByUserId(userId) {
        return await ShortUrl.find({ user: userId, deleted: false }).sort({ createdAt: -1 });
    }

    async findByIdAndUserId(id, userId) {
        return await ShortUrl.findOne({ _id: id, user: userId, deleted: false });
    }

    async updateById(id, updateData) {
        return await ShortUrl.findByIdAndUpdate({ id, deleted: false }, updateData, { new: true });
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await ShortUrl.updateOne(filter, { deleted: true });
        } else {
            return await ShortUrl.deleteOne(filter);
        }
    }
}

export const shortUrlRepository = new ShortUrlRepository();