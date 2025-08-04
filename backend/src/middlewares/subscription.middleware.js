// backend-gateway/src/middlewares/subscription.middleware.js

import {
    planService
} from '../services/plan.service.js';
import {
    usageRepository
} from '../repositories/usage.repository.js';
import {
    AppError
} from '../utils/AppError.js';

export const checkUsage = (usageType) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            const {
                userPlan
            } = await planService.getCurrentPlanDetails(user);
            const usage = await usageRepository.findOrCreateToday(user._id);

            if (usageType === 'tool') {
                if (usage.toolUses >= userPlan.benefits.toolUsesPerDay) {
                    return next(new AppError('You have exceeded your daily limit for tool usage.', 429));
                }
                await usageRepository.incrementToolUses(usage._id);
            } else if (usageType === 'llm') {
                if (usage.llmCalls >= userPlan.benefits.llmCallsPerDay) {
                    return next(new AppError('You have exceeded your daily limit for LLM calls.', 429));
                }
                await usageRepository.incrementLlmCalls(usage._id);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};