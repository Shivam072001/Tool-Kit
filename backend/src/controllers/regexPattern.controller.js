import { regexPatternService } from "../services/regexPattern.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * (New Controller Function)
 */
export const testPattern = async (req, res, next) => {
    try {
        const { pattern, testString, flavor, flags } = req.body;
        const result = await regexPatternService.testPattern(pattern, testString, flavor, flags);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

export const savePattern = async (req, res, next) => {
    try {
        const savedPattern = await regexPatternService.savePattern(req.body, req.user.id);
        res.status(201).json(new ApiResponse(201, { pattern: savedPattern }, 'Pattern saved'));
    } catch (error) {
        next(error);
    }
};

export const getPatternHistory = async (req, res, next) => {
    try {
        const history = await regexPatternService.getHistory(req.user.id);
        res.status(200).json(new ApiResponse(200, { history }));
    } catch (error) {
        next(error);
    }
};

export const deletePattern = async (req, res, next) => {
    try {
        await regexPatternService.deletePattern(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'Pattern deleted'));
    } catch (error) {
        next(error);
    }
};