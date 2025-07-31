// src/repositories/fakeDataOperation.repository.js

import { config } from '../config/env.js';
import FakeDataOperation from '../models/fakeDataOperation.model.js';

const { enableSoftDelete } = config;

class FakeDataOperationRepository {
    async create(operationData) {
        const operation = new FakeDataOperation(operationData);
        return await operation.save();
    }

    async findByUserId(userId) {
        return await FakeDataOperation.find({ user: userId, deleted: false }).sort({
            createdAt: -1,
        }).limit(20); // Limit to the last 20 operations
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await FakeDataOperation.updateOne(filter, { deleted: true });
        } else {
            return await FakeDataOperation.deleteOne(filter);
        }
    }
}

export const fakeDataOperationRepository = new FakeDataOperationRepository();