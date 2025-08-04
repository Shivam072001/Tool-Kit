import { qrCodeService } from '../services/qrCode.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createQRCode = async (req, res, next) => {
    try {
        const newQRCode = await qrCodeService.createQRCode(req.body, req.user.id);
        res.status(201).json(new ApiResponse(201, { qrCode: newQRCode }, 'QR Code created'));
    } catch (error) {
        next(error);
    }
};

export const getUserQRCodes = async (req, res, next) => {
    try {
        const qrCodes = await qrCodeService.getQRCodesForUser(req.user.id);
        res.status(200).json(new ApiResponse(200, { qrCodes, results: qrCodes.length }));
    } catch (error) {
        next(error);
    }
};

export const disableQRCode = async (req, res, next) => {
    try {
        const updatedQRCode = await qrCodeService.toggleQRCodeStatus(req.params.id, req.user.id, true);
        res.status(200).json(new ApiResponse(200, { qrCode: updatedQRCode }, 'QR Code disabled'));
    } catch (error) {
        next(error);
    }
};

export const enableQRCode = async (req, res, next) => {
    try {
        const { newMaxScans } = req.body;
        const updatedQRCode = await qrCodeService.toggleQRCodeStatus(req.params.id, req.user.id, false, newMaxScans);
        res.status(200).json(new ApiResponse(200, { qrCode: updatedQRCode }, 'QR Code enabled'));
    } catch (error) {
        next(error);
    }
};

export const deleteQRCode = async (req, res, next) => {
    try {
        await qrCodeService.deleteQRCode(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'QR Code deleted'));
    } catch (error) {
        next(error);
    }
};