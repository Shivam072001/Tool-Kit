// src/repositories/regexPattern.repository.js

import { config } from '../config/env.js';
import RegexPattern from '../models/regexPattern.model.js';

const { enableSoftDelete } = config;

class RegexPatternRepository {
    async create(patternData) {
        const pattern = new RegexPattern(patternData);
        return await pattern.save();
    }

    async findByUserId(userId) {
        return await RegexPattern.find({ user: userId, deleted: false }).sort({
            createdAt: -1,
        });
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await RegexPattern.updateOne(filter, { deleted: true });
        } else {
            return await RegexPattern.deleteOne(filter);
        }
    }
}

export const regexPatternRepository = new RegexPatternRepository();