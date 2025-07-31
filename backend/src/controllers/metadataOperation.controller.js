// src/controllers/metadataOperation.controller.js

import { metadataOperationService } from '../services/metadataOperation.service.js';
import { AppError } from '../utils/AppError.js';

export const inspectFile = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded.', 400));
    }
    try {
        const metadata = await metadataOperationService.inspectFile(req.file, req.user);
        res.status(200).json({ status: 'success', data: { metadata } });
    } catch (error) {
        next(error);
    }
};

export const getInspectionHistory = async (req, res, next) => {
    try {
        const history = await metadataOperationService.getHistory(req.user.id);
        res.status(200).json({ status: 'success', data: { history } });
    } catch (error) {
        next(error);
    }
};

export const deleteInspectionHistory = async (req, res, next) => {
    try {
        await metadataOperationService.deleteHistory(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};