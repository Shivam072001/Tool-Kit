// src/services/file.service.js

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { textOperationRepository } from '../repositories/textOperation.repository.js';
import { OPERATION_STATUSES, RESPONSE_STATUS, SUBSCRIPTION_TIERS, TEXT_OPERATION_TYPES } from '../constants/index.js';
import { config } from '../config/env.js';

const { computeServiceUrl } = config;

class TextOperationService {

    async _getApiKeyForUser(user, provider = 'openai') {
        if (user.userPlan === SUBSCRIPTION_TIERS.ELITE) {
            return await apiKeyService.getDecryptedApiKey(user._id, provider);
        }
        return null;
    }

    async processDocumentSummarization(file, user) {
        const form = new FormData();
        form.append('image', fs.createReadStream(file.path));

        const apiKey = await this._getApiKeyForUser(user);
        if (apiKey) {
            form.append('api_key', apiKey);
        }

        try {
            const response = await axios.post(`${computeServiceUrl}/api/v1/ai/summarize-document/`, form, {
                headers: { ...form.getHeaders() },
            });
            const { task_id } = response.data;

            await textOperationRepository.create({
                user: user.id,
                operationType: TEXT_OPERATION_TYPES.SUMMARIZATION,
                taskId: task_id,
                source: {
                    filename: file.originalname,
                    filetype: file.mimetype,
                    size: file.size,
                },
            });

            return { taskId: task_id };
        } catch (error) {
            throw new Error('Error communicating with the compute service for summarization.');
        } finally {
            fs.unlinkSync(file.path);
        }
    }

    /**
   * Orchestrates the text grammar check process.
   * (New method)
   */
    async processGrammarCheck(text, user) {
        const apiKey = await this._getApiKeyForUser(user);
        if (apiKey) {
            payload.api_key = apiKey;
        }
        try {
            const response = await axios.post(`${computeServiceUrl}/api/v1/ai/check-grammar/`, { text });
            const { task_id } = response.data;

            await textOperationRepository.create({
                user: user.id,
                operationType: TEXT_OPERATION_TYPES.GRAMMAR_CHECK,
                taskId: task_id,
                source: {
                    text: text,
                },
            });

            return { taskId: task_id };
        } catch (error) {
            throw new Error('Error communicating with the compute service for grammar check.');
        }
    }

    async getHistory(userId) {
        return await textOperationRepository.findByUserId(userId);
    }

    /**
   * Retrieves and updates the status of any asynchronous job.
   * (Modified to handle text results)
   */
    async getJobStatus(taskId) {
        const computeResponse = await axios.get(`${computeServiceUrl}/api/v1/files/status/${taskId}/`);
        const { status, result } = computeResponse.data;

        if (status === RESPONSE_STATUS.SUCCESS) {
            const operation = await textOperationRepository.findByTaskId(taskId);
            if (!operation) throw new Error('Operation not found');

            if (operation.operationType === TEXT_OPERATION_TYPES.GRAMMAR_CHECK) {
                await textOperationRepository.updateByTaskId(taskId, {
                    status: OPERATION_STATUSES.COMPLETED,
                    result: { text: JSON.stringify(result) }
                });
                return { status: OPERATION_STATUSES.COMPLETED, result: result };
            } else {
                await textOperationRepository.updateByTaskId(taskId, {
                    status: OPERATION_STATUSES.COMPLETED,
                    result: { text: result }
                });
                return { status: OPERATION_STATUSES.COMPLETED, resultText: result };
            }
        } else if (status === RESPONSE_STATUS.FAILURE) {
            await textOperationRepository.updateByTaskId(taskId, { status: OPERATION_STATUSES.FAILED, errorMessage: result });
            return { status: OPERATION_STATUSES.FAILED, errorMessage: result };
        }

        return { status: OPERATION_STATUSES.PROCESSING };
    }

    async deleteTextOperation(operationId, userId) {
        const result = await textOperationRepository.deleteById(operationId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No file operation found with that ID for this user.', 404);
        }
        return result;
    }
}

export const textOperationService = new TextOperationService();