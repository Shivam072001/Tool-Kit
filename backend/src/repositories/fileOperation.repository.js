import { config } from "../config/env.js";
import { OPERATION_STATUSES } from "../constants/index.js";
import FileOperation from "../models/fileOperation.model.js";

const { enableSoftDelete } = config

class FileOperationRepository {
    async create(operationData) {
        const operation = new FileOperation(operationData);
        return await operation.save();
    }

    async findByTaskId(taskId) {
        return await FileOperation.findOne({ taskId, deleted: false });
    }

    async updateByTaskId(taskId, updateData) {
        // Add completedAt timestamp if status is changing to completed or failed
        if (updateData.status && (updateData.status === OPERATION_STATUSES.COMPLETED || updateData.status === OPERATION_STATUSES.FAILED)) {
            updateData.completedAt = Date.now();
        }

        return await FileOperation.findOneAndUpdate({ taskId }, updateData, { new: true });
    }

    async findByUserId(userId) {
        return await FileOperation.find({ user: userId, deleted: false }).sort({ createdAt: -1 });
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await FileOperation.updateOne(filter, { deleted: true });
        } else {
            return await FileOperation.deleteOne(filter);
        }
    }
}

export const fileOperationRepository = new FileOperationRepository();