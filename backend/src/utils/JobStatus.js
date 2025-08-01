import axios from 'axios';
import { AppError } from './AppError.js';
import { OPERATION_STATUSES, RESPONSE_STATUS, TEXT_OPERATION_TYPES } from '../constants/index.js';
import { config } from '../config/env.js';

const { computeServiceUrl } = config;

/**
 * Checks the status of a background job from the Python service.
 * @param {string} taskId The ID of the task to check.
 * @param {import('mongoose').Model} repository The Mongoose repository for the operation model.
 * @returns {Promise<object>} The status and result of the job.
 */
export const checkJobStatus = async (taskId, repository) => {
    try {
        const computeResponse = await axios.get(`${computeServiceUrl}/api/v1/files/status/${taskId}/`);
        const { status, result } = computeResponse.data;

        if (status === RESPONSE_STATUS.SUCCESS) {
            const operation = await repository.findByTaskId(taskId);
            if (!operation) {
                throw new AppError('Operation not found', 404);
            }

            let updateData;
            let responseData;

            if (operation.operationType === TEXT_OPERATION_TYPES.GRAMMAR_CHECK) {
                updateData = {
                    status: OPERATION_STATUSES.COMPLETED,
                    result: { text: JSON.stringify(result) }
                };
                responseData = { status: OPERATION_STATUSES.COMPLETED, result: result };
            } else if (operation.operationType === TEXT_OPERATION_TYPES.SUMMARIZATION) {
                updateData = {
                    status: OPERATION_STATUSES.COMPLETED,
                    result: { text: result }
                };
                responseData = { status: OPERATION_STATUSES.COMPLETED, resultText: result };
            }
            else { // File operations
                updateData = {
                    status: OPERATION_STATUSES.COMPLETED,
                    result: { fileUrl: result },
                };
                responseData = { status: OPERATION_STATUSES.COMPLETED, result };
            }
            await repository.updateByTaskId(taskId, updateData);
            return responseData;

        } else if (status === RESPONSE_STATUS.FAILURE) {
            await repository.updateByTaskId(taskId, { status: OPERATION_STATUSES.FAILED, errorMessage: result });
            return { status: OPERATION_STATUSES.FAILED, errorMessage: result };
        }

        return { status: OPERATION_STATUSES.PROCESSING };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Could not retrieve task status.', 502);
    }
};