// src/services/regex.service.js

import { config } from '../config/env.js';
import { regexPatternRepository } from '../repositories/regexPattern.repository.js';
import { AppError } from '../utils/AppError.js';
import axios from 'axios';

const { computeServiceUrl } = config;

class RegexPatternService {
    async savePattern(patternData, userId) {
        const { name, pattern, flags } = patternData;
        if (!name || !pattern) {
            throw new AppError('Pattern name and the expression are required.', 400);
        }
        const dataToSave = { user: userId, name, pattern, flags };
        return await regexPatternRepository.create(dataToSave);
    }

    async getHistory(userId) {
        return await regexPatternRepository.findByUserId(userId);
    }

    async deletePattern(patternId, userId) {
        const result = await regexPatternRepository.deleteById(patternId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No pattern found with that ID for this user.', 404);
        }
        return result;
    }

    /**
     * (New Method)
     * Forwards a regex test request to the Python compute service.
     */
    async testPattern(pattern, testString, flavor, flags) {
        if (!pattern || !flavor) {
            throw new AppError('Pattern, test string, and flavor are required.', 400);
        }
        try {
            const response = await axios.post(`${computeServiceUrl}/api/v1/regex/test/`, {
                pattern,
                test_string: testString,
                flavor,
                flags,
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new AppError(error.response.data.error || 'Failed to test regex pattern.', error.response.status);
            }
            throw new AppError('Error communicating with the regex testing service.', 502);
        }
    }
}

export const regexPatternService = new RegexPatternService();