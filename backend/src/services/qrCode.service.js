// src/services/qrCode.service.js

import { qrCodeRepository } from '../repositories/qrCode.repository.js';
import { AppError } from '../utils/AppError.js';

class QRCodeService {
    async createQRCode(data, userId) {
        if (!data.value || data.value.trim() === '') {
            throw new AppError('QR Code value cannot be empty.', 400);
        }

        const qrCodeData = {
            value: data.value,
            backgroundColor: data.backgroundColor,
            foregroundColor: data.foregroundColor,
            maxScans: data.maxScans ? parseInt(data.maxScans, 10) : null,
            user: userId,
        };

        return await qrCodeRepository.create(qrCodeData);
    }

    async toggleQRCodeStatus(qrCodeId, userId, status, newMaxScans = null) {
        const qrCode = await qrCodeRepository.findByIdAndUserId(qrCodeId, userId);
        if (!qrCode) {
            throw new AppError('No QR Code found with that ID for this user.', 404);
        }

        let updateData = { disabled: status };

        if (status === false) {
            const additionalScans = parseInt(newMaxScans, 10);
            if (isNaN(additionalScans) || additionalScans <= 0) {
                throw new AppError('A positive number is required for the new scan limit.', 400);
            }
            updateData.maxScans = qrCode.scans + additionalScans;
        }

        return await qrCodeRepository.updateById(qrCodeId, updateData);
    }


    async getQRCodesForUser(userId) {
        return await qrCodeRepository.findByUserId(userId);
    }

    async deleteQRCode(qrCodeId, userId) {
        const result = await qrCodeRepository.deleteById(qrCodeId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No QR Code found with that ID for this user.', 404);
        }
        return result;
    }
}

export const qrCodeService = new QRCodeService();