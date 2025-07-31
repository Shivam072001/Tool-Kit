// src/services/audioProcess.service.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { audioOperationRepository } from '../repositories/audioOperation.repository.js';
import { AUDIO_OPERATION_TYPES, OPERATION_STATUSES, RESPONSE_STATUS } from '../constants/index.js';
import { config } from '../config/env.js';

const { computeServiceUrl } = config;

class AudioOperationService {
    async processAudioTranscription(file, user) {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path));

        try {
            const response = await axios.post(`${computeServiceUrl}/api/v1/ai/transcribe-audio/`, form, {
                headers: { ...form.getHeaders() },
            });
            const { task_id } = response.data;

            await audioOperationRepository.create({
                user: user.id,
                operationType: AUDIO_OPERATION_TYPES.TRANSCRIPTION,
                taskId: task_id,
                source: {
                    filename: file.originalname,
                    filetype: file.mimetype,
                    size: file.size,
                },
            });

            return { taskId: task_id };
        } catch (error) {
            throw new Error('Error communicating with the compute service for transcription.');
        } finally {
            fs.unlinkSync(file.path);
        }
    }

    async getJobStatus(taskId) {
        const computeResponse = await axios.get(`${computeServiceUrl}/api/v1/files/status/${taskId}/`);
        const { status, result } = computeResponse.data;

        if (status === RESPONSE_STATUS.SUCCESS) {
            await audioOperationRepository.updateByTaskId(taskId, {
                status: OPERATION_STATUSES.COMPLETED,
                result: { text: result }
            });
            return { status: OPERATION_STATUSES.COMPLETED, resultText: result };
        } else if (status === RESPONSE_STATUS.FAILURE) {
            await audioOperationRepository.updateByTaskId(taskId, {
                status: OPERATION_STATUSES.FAILED,
                errorMessage: result,
            });
            return { status: OPERATION_STATUSES.FAILED, errorMessage: result };
        }

        return { status: OPERATION_STATUSES.PROCESSING };
    }

    async deleteAudioOperation(operationId, userId) {
        const result = await audioOperationRepository.deleteById(operationId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No file operation found with that ID for this user.', 404);
        }
        return result;
    }
}

export const audioOperationService = new AudioOperationService();