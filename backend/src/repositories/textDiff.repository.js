// src/repositories/textDiff.repository.js

import { config } from '../config/env.js';
import TextDiff from '../models/textDiff.model.js';

const { enableSoftDelete } = config;

class TextDiffRepository {
    async create(diffData) {
        const textDiff = new TextDiff(diffData);
        return await textDiff.save();
    }

    async findByUserId(userId) {
        return await TextDiff.find({ user: userId, deleted: false }).sort({ createdAt: -1 }).limit(20);
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await TextDiff.updateOne(filter, { deleted: true });
        } else {
            return await TextDiff.deleteOne(filter);
        }
    }
}

export const textDiffRepository = new TextDiffRepository();