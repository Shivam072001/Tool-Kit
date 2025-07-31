// src/repositories/colorPalette.repository.js

import { config } from '../config/env.js';
import ColorPalette from '../models/colorPalette.model.js';

const { enableSoftDelete } = config;

class ColorPaletteRepository {
    async create(paletteData) {
        const palette = new ColorPalette(paletteData);
        return await palette.save();
    }

    async findByUserId(userId) {
        return await ColorPalette.find({ user: userId, deleted: false }).sort({
            createdAt: -1,
        });
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await ColorPalette.updateOne(filter, { deleted: true });
        } else {
            return await ColorPalette.deleteOne(filter);
        }
    }
}

export const colorPaletteRepository = new ColorPaletteRepository();