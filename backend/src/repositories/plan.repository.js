// backend-gateway/src/repositories/plan.repository.js

import Plan from '../models/plan.model.js';

class PlanRepository {
    /**
     * Finds a plan by its name and type.
     * @param {string} name - The name of the plan (e.g., 'pro', 'elite').
     * @param {string} planType - The type of plan ('user' or 'storage').
     * @returns {Promise<Plan|null>}
     */
    async findPlanByNameAndType(name, planType) {
        return await Plan.findOne({
            name,
            planType
        });
    }

    /**
     * Retrieves all available plans.
     * @returns {Promise<Plan[]>}
     */
    async findAllPlans() {
        return await Plan.find({});
    }
}

export const planRepository = new PlanRepository();