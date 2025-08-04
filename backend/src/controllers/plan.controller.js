// backend-gateway/src/controllers/plan.controller.js

import {
    planService
} from '../services/plan.service.js';

export const getPlans = async (req, res, next) => {
    try {
        const plans = await planService.getAllPlans();
        res.status(200).json({
            status: 'success',
            data: {
                plans
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUserPlans = async (req, res, next) => {
    try {
        const planDetails = await planService.getCurrentPlanDetails(req.user);
        res.status(200).json({
            status: 'success',
            data: planDetails,
        });
    } catch (error) {
        next(error);
    }
};