// src/services/metadataOperation.service.js

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { metadataOperationRepository } from '../repositories/metadataOperation.repository.js';
import { AppError } from '../utils/AppError.js';
import { config } from '../config/env.js';

const { computeServiceUrl } = config;

class MetadataOperationService {
    async inspectFile(file, user) {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path));

        try {
            // 1. Send file to Python service for metadata extraction
            const response = await axios.post(
                `${computeServiceUrl}/api/v1/metadata/extract/`,
                form,
                { headers: { ...form.getHeaders() } }
            );

            const extractedMetadata = response.data;

            // 2. Save the result to the database
            const operationData = {
                user: user.id,
                sourceFile: {
                    filename: file.originalname,
                    filetype: file.mimetype,
                    size: file.size,
                },
                metadata: extractedMetadata,
            };

            await metadataOperationRepository.create(operationData);

            // 3. Return the extracted metadata to the controller
            return extractedMetadata;
        } catch (error) {
            if (error.response) {
                // Forward error from compute service
                throw new AppError(error.response.data.error || 'Failed to inspect file.', error.response.status);
            }
            throw new AppError('Error communicating with the metadata service.', 502);
        } finally {
            // 4. Clean up the uploaded file
            fs.unlinkSync(file.path);
        }
    }

    async getHistory(userId) {
        return await metadataOperationRepository.findByUserId(userId);
    }

    async deleteHistory(operationId, userId) {
        const result = await metadataOperationRepository.deleteById(operationId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No record found with that ID for this user.', 404);
        }
        return result;
    }
}

export const metadataOperationService = new MetadataOperationService();