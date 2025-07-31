// src/services/file.service.js

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { fileOperationRepository } from '../repositories/fileOperation.repository.js';
import { FILE_OPERATION_TYPES, OPERATION_STATUSES, RESPONSE_STATUS, TEXT_OPERATION_TYPES } from '../constants/index.js';
import { config } from '../config/env.js';

const { computeServiceUrl } = config;

class FileOperationService {
    /**
     * Orchestrates the image compression process.
     * @param {object} file - The uploaded file object from Multer.
     * @param {object} user - The authenticated user object.
     * @returns {Promise<{taskId: string}>}
     */
    async processFileCompression(file, user) {
        const form = new FormData();
        form.append('image', fs.createReadStream(file.path));

        try {
            const response = await axios.post(`${computeServiceUrl}/api/v1/files/compress/`, form, {
                headers: { ...form.getHeaders() },
            });
            const { task_id } = response.data;

            await fileOperationRepository.create({
                user: user.id,
                operationType: FILE_OPERATION_TYPES.COMPRESSION,
                taskId: task_id,
                source: {
                    filename: file.originalname,
                    filetype: file.mimetype,
                    size: file.size,
                },
            });

            return { taskId: task_id };
        } catch (error) {
            throw new Error('Error communicating with the compute service for compression.');
        } finally {
            fs.unlinkSync(file.path);
        }
    }

    /**
     * Orchestrates the file conversion process.
     * @param {object} file - The uploaded file object from Multer.
     * @param {object} user - The authenticated user object.
     * @param {string} targetFormat - The desired output format.
     * @returns {Promise<{taskId: string}>}
     */
    async processFileConversion(file, user, targetFormat) {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path));
        form.append('targetFormat', targetFormat);

        try {
            const response = await axios.post(`${computeServiceUrl}/api/v1/files/convert/`, form, {
                headers: { ...form.getHeaders() },
            });
            const { task_id } = response.data;

            await fileOperationRepository.create({
                user: user.id,
                operationType: FILE_OPERATION_TYPES.CONVERSION,
                taskId: task_id,
                source: {
                    filename: file.originalname,
                    filetype: file.mimetype,
                    size: file.size,
                    sourceFormat: file.mimetype.split('/')[1],
                },
                result: {
                    targetFormat: targetFormat.toUpperCase(),
                },
            });

            return { taskId: task_id };
        } catch (error) {
            throw new Error('Error communicating with the compute service for file conversion.');
        } finally {
            fs.unlinkSync(file.path);
        }
    }

    /**
     * Retrieves and updates the status of any asynchronous job.
     * @param {string} taskId - The unique ID of the task.
     * @returns {Promise<object>}
     */
    /**
   * Orchestrates the AI background removal process.
   * (New method)
   */
    async processBackgroundRemoval(file, user) {
        const form = new FormData();
        form.append('image', fs.createReadStream(file.path));

        try {
            const response = await axios.post(`${computeServiceUrl}/api/v1/ai/remove-background/`, form, {
                headers: { ...form.getHeaders() },
            });
            const { task_id } = response.data;

            await fileOperationRepository.create({
                user: user.id,
                operationType: 'ai-background-removal',
                taskId: task_id,
                source: {
                    filename: file.originalname,
                    filetype: file.mimetype,
                    size: file.size,
                },
            });

            return { taskId: task_id };
        } catch (error) {
            throw new Error('Error communicating with the compute service for background removal.');
        } finally {
            fs.unlinkSync(file.path);
        }
    }

    /**
   * Retrieves and updates the status of any asynchronous job.
   * (Modified to handle text results)
   */
    async getJobStatus(taskId) {
        const computeResponse = await axios.get(`${computeServiceUrl}/api/v1/files/status/${taskId}/`);
        const { status, result } = computeResponse.data;

        if (status === RESPONSE_STATUS.SUCCESS) {
            const operation = await fileOperationRepository.findByTaskId(taskId);
            if (!operation) throw new Error('Operation not found');

            if (operation.operationType === TEXT_OPERATION_TYPES.GRAMMAR_CHECK) {
                await fileOperationRepository.updateByTaskId(taskId, {
                    status: OPERATION_STATUSES.COMPLETED,
                    result: { text: JSON.stringify(result) }
                });
                return { status: OPERATION_STATUSES.COMPLETED, result: result };
            } else {
                await fileOperationRepository.updateByTaskId(taskId, {
                    status: OPERATION_STATUSES.COMPLETED,
                    result: { text: result }
                });
                return { status: OPERATION_STATUSES.COMPLETED, resultText: result };
            }
        } else if (status === RESPONSE_STATUS.FAILURE) {
            await fileOperationRepository.updateByTaskId(taskId, { status: OPERATION_STATUSES.FAILED, errorMessage: result });
            return { status: OPERATION_STATUSES.FAILED, errorMessage: result };
        }

        return { status: OPERATION_STATUSES.PROCESSING };
    }

    async deleteFileOperation(operationId, userId) {
        const result = await fileOperationRepository.deleteById(operationId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No file operation found with that ID for this user.', 404);
        }
        return result;
    }
}

export const fileOperationService = new FileOperationService();