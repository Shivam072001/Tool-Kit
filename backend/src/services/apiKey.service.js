// backend/src/services/apiKey.service.js

import { userRepository } from "../repositories/user.repository.js";
import { planService } from "./plan.service.js";
import { encryptApiKey, decryptApiKey } from "../utils/apiKeyCrypto.js";
import { AppError } from "../utils/AppError.js";
import { SUBSCRIPTION_TIERS } from "../constants/index.js";

class ApiKeyService {
    async saveApiKeys(userId, apiKeys) {
        const user = await userRepository.findUserById(userId);
        const { userPlan } = await planService.getCurrentPlanDetails(user);

        if (userPlan.name !== SUBSCRIPTION_TIERS.ELITE) {
            throw new AppError(
                "This feature is only available for Elite plan users.",
                403
            );
        }

        const encryptedKeys = {};
        for (const [provider, key] of Object.entries(apiKeys)) {
            if (key) {
                encryptedKeys[provider] = encryptApiKey(key);
            }
        }

        await userRepository.updateUser(userId, {
            apiKeys: encryptedKeys,
        });
        return {
            message: "API keys saved successfully.",
        };
    }

    async getApiKeys(userId) {
        const user = await userRepository.findUserByIdWithApiKeys(userId);
        const decryptedKeys = {};

        if (user && user.apiKeys) {
            for (const [provider, key] of Object.entries(user.apiKeys)) {
                if (key) {
                    decryptedKeys[provider] = "••••••••••••••••••••"; // Return a masked key
                }
            }
        }
        return decryptedKeys;
    }

    async getDecryptedApiKey(userId, provider) {
        const user = await userRepository.findUserByIdWithApiKeys(userId);
        if (user && user.apiKeys && user.apiKeys[provider]) {
            return decryptApiKey(user.apiKeys[provider]);
        }
        return null;
    }
}

export const apiKeyService = new ApiKeyService();
