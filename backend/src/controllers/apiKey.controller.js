// backend/src/controllers/apiKey.controller.js

import {
    apiKeyService
} from '../services/apiKey.service.js';

export const getApiKeys = async (req, res, next) => {
    try {
        const keys = await apiKeyService.getApiKeys(req.user.id);
        res.status(200).json({
            status: 'success',
            data: {
                keys
            }
        });
    } catch (error) {
        next(error);
    }
};

export const saveApiKeys = async (req, res, next) => {
    try {
        const result = await apiKeyService.saveApiKeys(req.user.id, req.body);
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};