// src/repositories/qrCode.repository.js

import { config } from '../config/env.js';
import QRCode from '../models/qrCode.model.js';

const { enableSoftDelete } = config;

class QRCodeRepository {
    async create(qrCodeData) {
        const qrCode = new QRCode(qrCodeData);
        return await qrCode.save();
    }

    async findByUserId(userId) {
        return await QRCode.find({ user: userId, deleted: false }).sort({ createdAt: -1 });
    }

    async findById(id) {
        return await QRCode.findOne({ _id: id, deleted: false });
    }

    async findByIdAndUserId(id, userId) {
        return await QRCode.findOne({ _id: id, user: userId, deleted: false });
    }

    async updateById(id, updateData) {
        return await QRCode.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await QRCode.updateOne(filter, { deleted: true });
        } else {
            return await QRCode.deleteOne(filter);
        }
    }
}

export const qrCodeRepository = new QRCodeRepository();