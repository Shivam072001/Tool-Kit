// backend/src/repositories/secureShare.repository.js

import SecureShare from '../models/secureShare.model.js';

class SecureShareRepository {
    async create(shareData) {
        const share = new SecureShare(shareData);
        return await share.save();
    }

    async findByAccessToken(accessToken) {
        return await SecureShare.findOne({ accessToken });
    }

    async markAsUsed(id) {
        return await SecureShare.findByIdAndUpdate(id, { isUsed: true }, { new: true });
    }
}

export const secureShareRepository = new SecureShareRepository();