import { audioOperationService } from '../services/audioOperation.service.js';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { OPERATION_STATUSES } from '../constants/index.js';

export const uploadAndTranscribeAudio = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No audio file uploaded.', 400));
    }

    try {
        const { taskId } = await audioOperationService.processAudioTranscription(req.file, req.user);
        res.status(202).json(new ApiResponse(202, { taskId }, OPERATION_STATUSES.PROCESSING));
    } catch (error) {
        next(new AppError(error.message, 502));
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const history = await audioOperationService.getHistory(req.user.id);
        res.status(200).json(new ApiResponse(200, { history }));
    } catch (error) {
        next(error);
    }
};

export const getJobStatus = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const result = await audioOperationService.getJobStatus(taskId);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(new AppError('Could not retrieve task status.', 502));
    }
};

export const deleteAudioOperation = async (req, res, next) => {
    try {
        await audioOperationService.deleteAudioOperation(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'Operation deleted successfully'));
    } catch (error) {
        next(error);
    }
};