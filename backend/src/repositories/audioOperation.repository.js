// src/repositories/audioProcess.repository.js

import { config } from "../config/env.js";
import AudioOperation from "../models/audioOperation.model.js";

const { enableSoftDelete } = config;

class AudioOperationRepository {
    async create(data) {
        return await new AudioOperation(data).save();
    }
    async findByTaskId(taskId) {
        return await AudioOperation.findOne({ taskId });
    }
    async updateByTaskId(taskId, data) {
        return await AudioOperation.findOneAndUpdate({ taskId }, data, { new: true });
    }
    async findByUserId(userId) {
        return await AudioOperation.find({ user: userId, deleted: false }).sort({
            createdAt: -1,
        });
    }
    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await AudioOperation.updateOne(filter, { deleted: true });
        } else {
            return await AudioOperation.deleteOne(filter);
        }
    }
}
export const audioOperationRepository = new AudioOperationRepository();
