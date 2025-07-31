// src/controllers/textDiff.controller.js

import { textDiffService } from '../services/textDiff.service.js';

export const saveDiff = async (req, res, next) => {
    try {
        const savedDiff = await textDiffService.saveDiff(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: { diff: savedDiff } });
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const history = await textDiffService.getHistory(req.user.id);
        res.status(200).json({ status: 'success', data: { history } });
    } catch (error) {
        next(error);
    }
};

export const deleteDiff = async (req, res, next) => {
    try {
        await textDiffService.deleteDiff(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};