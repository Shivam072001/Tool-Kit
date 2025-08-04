import { metadataOperationService } from '../services/metadataOperation.service.js';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const inspectFile = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded.', 400));
    }
    try {
        const metadata = await metadataOperationService.inspectFile(req.file, req.user);
        res.status(200).json(new ApiResponse(200, { metadata }));
    } catch (error) {
        next(error);
    }
};

export const getInspectionHistory = async (req, res, next) => {
    try {
        const history = await metadataOperationService.getHistory(req.user.id);
        res.status(200).json(new ApiResponse(200, { history }));
    } catch (error) {
        next(error);
    }
};

export const deleteInspectionHistory = async (req, res, next) => {
    try {
        await metadataOperationService.deleteHistory(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'History deleted'));
    } catch (error) {
        next(error);
    }
};