// src/controllers/fakeData.controller.js

import { fakeDataService } from '../services/fakeData.service.js';

export const generateFakeData = async (req, res, next) => {
    try {
        const { type, count, locale, customSchema } = req.body;
        // Pass userId and the entire request body to the service
        const data = await fakeDataService.generateData({ type, count, locale, customSchema }, req.user.id);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const getGenerationHistory = async (req, res, next) => {
    try {
        const history = await fakeDataService.getHistory(req.user.id);
        res.status(200).json({ status: 'success', data: { history } });
    } catch (error) {
        next(error);
    }
};

export const deleteGenerationHistory = async (req, res, next) => {
    try {
        await fakeDataService.deleteHistory(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};