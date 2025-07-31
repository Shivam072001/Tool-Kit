// src/controllers/regex.controller.js

import { regexPatternService } from "../services/regexPattern.service.js";

/**
 * (New Controller Function)
 */
export const testPattern = async (req, res, next) => {
    try {
        const { pattern, testString, flavor, flags } = req.body;
        const result = await regexPatternService.testPattern(pattern, testString, flavor, flags);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
};

export const savePattern = async (req, res, next) => {
    try {
        const savedPattern = await regexPatternService.savePattern(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: { pattern: savedPattern } });
    } catch (error) {
        next(error);
    }
};

export const getPatternHistory = async (req, res, next) => {
    try {
        const history = await regexPatternService.getHistory(req.user.id);
        res.status(200).json({ status: 'success', data: { history } });
    } catch (error) {
        next(error);
    }
};

export const deletePattern = async (req, res, next) => {
    try {
        await regexPatternService.deletePattern(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};