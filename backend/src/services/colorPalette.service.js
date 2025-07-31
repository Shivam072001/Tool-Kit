// src/services/color.service.js

import { colorPaletteRepository } from '../repositories/colorPalette.repository.js';
import { AppError } from '../utils/AppError.js';

class ColorPaletteService {
    async savePalette(paletteData, userId) {
        if (!paletteData.name || !paletteData.colors) {
            throw new AppError('Palette name and colors are required.', 400);
        }
        const dataToSave = {
            ...paletteData,
            user: userId,
        };
        return await colorPaletteRepository.create(dataToSave);
    }

    async getPalettesForUser(userId) {
        return await colorPaletteRepository.findByUserId(userId);
    }

    async deletePalette(paletteId, userId) {
        const result = await colorPaletteRepository.deleteById(paletteId, userId);
        if (result.deletedCount === 0 && result.modifiedCount === 0) {
            throw new AppError('No palette found with that ID for this user.', 404);
        }
        return result;
    }
}

export const colorPaletteService = new ColorPaletteService();