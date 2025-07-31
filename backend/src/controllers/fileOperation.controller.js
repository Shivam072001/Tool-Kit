// src/controllers/file.controller.js

import { AppError } from '../utils/AppError.js';
import { fileOperationService } from '../services/fileOperation.service.js';
import { conversionMap } from '../config/conversions.js';
import { OPERATION_STATUSES } from '../constants/index.js';

/**
 * (New Controller Function)
 * Sends the available conversion options to the client.
 */
export const getConversionOptions = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            conversionMap,
        },
    });
};

export const uploadAndCompressFile = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No image file uploaded.', 400));
    }

    try {
        const { taskId } = await fileOperationService.processFileCompression(req.file, req.user);
        res.status(202).json({
            status: OPERATION_STATUSES.PROCESSING,
            taskId: taskId,
        });
    } catch (error) {
        next(new AppError(error.message, 502));
    }
};

export const uploadAndConvertFile = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded.', 400));
    }

    const { targetFormat } = req.body;
    if (!targetFormat) {
        return next(new AppError('Target format is required.', 400));
    }

    try {
        const { taskId } = await fileOperationService.processFileConversion(req.file, req.user, targetFormat);
        res.status(202).json({
            status: OPERATION_STATUSES.PROCESSING,
            taskId: taskId,
        });
    } catch (error) {
        next(new AppError(error.message, 502));
    }
};

export const uploadAndRemoveBackground = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No image file uploaded.', 400));
    }

    try {
        const { taskId } = await fileOperationService.processBackgroundRemoval(req.file, req.user);
        res.status(202).json({
            status: OPERATION_STATUSES.PROCESSING,
            taskId: taskId,
        });
    } catch (error) {
        next(new AppError(error.message, 502));
    }
};

export const getJobStatus = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const result = await fileOperationService.getJobStatus(taskId);
        res.status(200).json(result);
    } catch (error) {
        next(new AppError('Could not retrieve task status.', 502));
    }
};

export const deleteFileOperation = async (req, res, next) => {
    try {
        await fileOperationService.deleteFileOperation(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};