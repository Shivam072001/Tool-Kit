// src/controllers/audioProcess.controller.js
import { OPERATION_STATUSES } from '../constants/index.js';
import { audioOperationService } from '../services/audioOperation.service.js';
import { AppError } from '../utils/AppError.js';

export const uploadAndTranscribeAudio = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No audio file uploaded.', 400));
    }

    try {
        const { taskId } = await audioOperationService.processAudioTranscription(req.file, req.user);
        res.status(202).json({ status: OPERATION_STATUSES.PROCESSING, taskId });
    } catch (error) {
        next(new AppError(error.message, 502));
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const history = await audioOperationService.getHistory(req.user.id);
        res.status(200).json({ status: 'success', data: { history } });
    } catch (error) {
        next(error);
    }
};

export const getJobStatus = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const result = await audioOperationService.getJobStatus(taskId);
        res.status(200).json(result);
    } catch (error) {
        next(new AppError('Could not retrieve job status.', 502));
    }
};

export const deleteAudioOperation = async (req, res, next) => {
    try {
        await audioOperationService.deleteAudioOperation(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};