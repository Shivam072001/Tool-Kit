// src/controllers/color.controller.js

import { colorPaletteService } from "../services/colorPalette.service.js";


export const savePalette = async (req, res, next) => {
    try {
        const savedPalette = await colorPaletteService.savePalette(
            req.body,
            req.user.id
        );
        res.status(201).json({ status: 'success', data: { palette: savedPalette } });
    } catch (error) {
        next(error);
    }
};

export const getPalettes = async (req, res, next) => {
    try {
        const palettes = await colorPaletteService.getPalettesForUser(req.user.id);
        res.status(200).json({ status: 'success', data: { palettes } });
    } catch (error) {
        next(error);
    }
};

export const deletePalette = async (req, res, next) => {
    try {
        await colorPaletteService.deletePalette(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};