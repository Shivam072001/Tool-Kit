// src/services/fakeData.service.js

import axios from 'axios';
import { AppError } from '../utils/AppError.js';
import { fakeDataOperationRepository } from '../repositories/fakeDataOperation.repository.js';
import { config } from '../config/env.js';

const { computeServiceUrl } = config;

class FakeDataService {
    async generateData(options, userId) {
        try {
            // Prepare payload for the Python service
            const payload = {
                type: options.type,
                count: options.count,
                locale: options.locale,
                // Include customSchema if it exists
                schema: options.customSchema || null,
            };

            const response = await axios.post(
                `${computeServiceUrl}/api/v1/fake-data/generate/`,
                payload
            );

            // Save a record of the operation
            await fakeDataOperationRepository.create({
                user: userId,
                dataType: options.type,
                count: options.count,
                locale: options.locale,
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                throw new AppError(error.response.data.error || 'Failed to generate data.', error.response.status);
            }
            throw new AppError('Error communicating with the data generation service.', 502);
        }
    }

    async getHistory(userId) {
        return await fakeDataOperationRepository.findByUserId(userId);
    }

    async deleteHistory(operationId, userId) {
        const result = await fakeDataOperationRepository.deleteById(operationId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No record found with that ID for this user.', 404);
        }
        return result;
    }
}

export const fakeDataService = new FakeDataService();