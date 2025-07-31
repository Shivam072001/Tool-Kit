// src/repositories/textProcess.repository.js

import { config } from "../config/env.js";
import TextOperation from "../models/textOperation.model.js";

const { enableSoftDelete } = config;

class TextOperationRepository {
    async create(data) {
        return await new TextOperation(data).save();
    }
    async findByTaskId(taskId) {
        return await TextOperation.findOne({ taskId });
    }
    async updateByTaskId(taskId, data) {
        return await TextOperation.findOneAndUpdate({ taskId }, data, { new: true });
    }
    async findByUserId(userId) {
        return await TextOperation.find({ user: userId, deleted: false }).sort({
            createdAt: -1,
        });
    }
    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await TextOperation.updateOne(filter, { deleted: true });
        } else {
            return await TextOperation.deleteOne(filter);
        }
    }
}
export const textOperationRepository = new TextOperationRepository();
