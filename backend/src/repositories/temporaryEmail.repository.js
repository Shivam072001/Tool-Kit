// src/repositories/temporaryEmail.repository.js

import { config } from '../config/env.js';
import TemporaryEmail from '../models/temporaryEmail.model.js';

const { enableSoftDelete } = config;

class TemporaryEmailRepository {
    async create(emailData) {
        const tempEmail = new TemporaryEmail(emailData);
        return await tempEmail.save();
    }

    async findByUserId(userId) {
        // Find the most recent, non-deleted email for the user
        return await TemporaryEmail.findOne({ user: userId, deleted: false }).sort({
            createdAt: -1,
        });
    }

    async findByEmailAddress(emailAddress) {
        return await TemporaryEmail.findOne({ emailAddress, deleted: false });
    }

    async addMessageToInbox(emailAddress, message) {
        return await TemporaryEmail.findOneAndUpdate(
            { emailAddress, deleted: false },
            { $push: { inbox: { $each: [message], $position: 0 } } },
            { new: true }
        );
    }

    async delete(emailId, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: emailId, user: userId };
        if (useSoftDelete) {
            return await TemporaryEmail.updateOne(
                { _id: emailId, user: userId },
                {
                    deleted: true,
                    expiresAt: new Date()
                },
            );
        } else {
            return await ShortUrl.deleteOne(filter);
        }
    }
}

export const temporaryEmailRepository = new TemporaryEmailRepository();