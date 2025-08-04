// backend-gateway/src/services/plan.service.js

import {
    planRepository
} from '../repositories/plan.repository.js';
import {
    AppError
} from '../utils/AppError.js';

class PlanService {
    /**
     * Retrieves the details of a user's current plans.
     * @param {object} user - The authenticated user object.
     * @returns {Promise<object>} An object containing user and storage plan details.
     */
    async getCurrentPlanDetails(user) {
        const userPlan = await planRepository.findPlanByNameAndType(user.userPlan, 'user');
        if (!userPlan) {
            throw new AppError('User plan details not found.', 404);
        }

        let storagePlan = null;
        if (user.storagePlan) {
            storagePlan = await planRepository.findPlanByNameAndType(user.storagePlan, 'storage');
        }

        return {
            userPlan,
            storagePlan
        };
    }

    /**
     * Retrieves all available plans.
     * @returns {Promise<Plan[]>}
     */
    async getAllPlans() {
        return await planRepository.findAllPlans();
    }
}

export const planService = new PlanService();