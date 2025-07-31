// src/repositories/metadataOperation.repository.js

import { config } from '../config/env.js';
import MetadataOperation from '../models/metadataOperation.model.js';

const { enableSoftDelete } = config;

class MetadataOperationRepository {
    async create(operationData) {
        const operation = new MetadataOperation(operationData);
        return await operation.save();
    }

    async findByUserId(userId) {
        return await MetadataOperation.find({ user: userId, deleted: false }).sort({
            createdAt: -1,
        });
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await MetadataOperation.updateOne(filter, { deleted: true });
        } else {
            return await MetadataOperation.deleteOne(filter);
        }
    }
}

export const metadataOperationRepository = new MetadataOperationRepository();