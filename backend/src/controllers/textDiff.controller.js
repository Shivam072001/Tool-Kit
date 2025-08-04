import { textDiffService } from '../services/textDiff.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const saveDiff = async (req, res, next) => {
    try {
        const savedDiff = await textDiffService.saveDiff(req.body, req.user.id);
        res.status(201).json(new ApiResponse(201, { diff: savedDiff }, 'Diff saved'));
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const history = await textDiffService.getHistory(req.user.id);
        res.status(200).json(new ApiResponse(200, { history }));
    } catch (error) {
        next(error);
    }
};

export const deleteDiff = async (req, res, next) => {
    try {
        await textDiffService.deleteDiff(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'Diff deleted'));
    } catch (error) {
        next(error);
    }
};