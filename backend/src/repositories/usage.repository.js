// backend-gateway/src/repositories/usage.repository.js

import Usage from '../models/usage.model.js';

class UsageRepository {
    async findOrCreateToday(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let usage = await Usage.findOne({
            userId,
            date: today
        });

        if (!usage) {
            usage = await Usage.create({
                userId,
                date: today
            });
        }

        return usage;
    }

    async incrementToolUses(usageId) {
        return await Usage.findByIdAndUpdate(usageId, {
            $inc: {
                toolUses: 1
            }
        }, {
            new: true
        });
    }

    async incrementLlmCalls(usageId) {
        return await Usage.findByIdAndUpdate(usageId, {
            $inc: {
                llmCalls: 1
            }
        }, {
            new: true
        });
    }
}

export const usageRepository = new UsageRepository();