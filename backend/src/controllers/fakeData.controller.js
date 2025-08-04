import { fakeDataService } from '../services/fakeData.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const generateFakeData = async (req, res, next) => {
    try {
        const { type, count, locale, customSchema } = req.body;
        // Pass userId and the entire request body to the service
        const data = await fakeDataService.generateData({ type, count, locale, customSchema }, req.user.id);
        res.status(200).json(new ApiResponse(200, data));
    } catch (error) {
        next(error);
    }
};

export const getGenerationHistory = async (req, res, next) => {
    try {
        const history = await fakeDataService.getHistory(req.user.id);
        res.status(200).json(new ApiResponse(200, { history }));
    } catch (error) {
        next(error);
    }
};

export const deleteGenerationHistory = async (req, res, next) => {
    try {
        await fakeDataService.deleteHistory(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'History deleted successfully'));
    } catch (error) {
        next(error);
    }
};