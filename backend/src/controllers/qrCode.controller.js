// src/controllers/qrCode.controller.js

import { qrCodeService } from '../services/qrCode.service.js';

export const createQRCode = async (req, res, next) => {
    try {
        const newQRCode = await qrCodeService.createQRCode(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: { qrCode: newQRCode } });
    } catch (error) {
        next(error);
    }
};

export const getUserQRCodes = async (req, res, next) => {
    try {
        const qrCodes = await qrCodeService.getQRCodesForUser(req.user.id);
        res.status(200).json({ status: 'success', results: qrCodes.length, data: { qrCodes } });
    } catch (error) {
        next(error);
    }
};

export const disableQRCode = async (req, res, next) => {
    try {
        const updatedQRCode = await qrCodeService.toggleQRCodeStatus(req.params.id, req.user.id, true);
        res.status(200).json({ status: 'success', data: { qrCode: updatedQRCode } });
    } catch (error) {
        next(error);
    }
};

export const enableQRCode = async (req, res, next) => {
    try {
        const { newMaxScans } = req.body;
        const updatedQRCode = await qrCodeService.toggleQRCodeStatus(req.params.id, req.user.id, false, newMaxScans);
        res.status(200).json({ status: 'success', data: { qrCode: updatedQRCode } });
    } catch (error) {
        next(error);
    }
};

export const deleteQRCode = async (req, res, next) => {
    try {
        await qrCodeService.deleteQRCode(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};