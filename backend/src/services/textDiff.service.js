// src/services/textDiff.service.js

import { textDiffRepository } from '../repositories/textDiff.repository.js';

class TextDiffService {
    async saveDiff(data, userId) {
        const diffData = {
            user: userId,
            originalText: data.originalText,
            changedText: data.changedText,
        };
        return await textDiffRepository.create(diffData);
    }

    async getHistory(userId) {
        return await textDiffRepository.findByUserId(userId);
    }

    async deleteDiff(id, userId) {
        return await textDiffRepository.deleteById(id, userId);
    }
}

export const textDiffService = new TextDiffService();