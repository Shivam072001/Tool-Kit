import { colorPaletteService } from "../services/colorPalette.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const savePalette = async (req, res, next) => {
    try {
        const savedPalette = await colorPaletteService.savePalette(
            req.body,
            req.user.id
        );
        res.status(201).json(new ApiResponse(201, { palette: savedPalette }, 'Palette saved successfully'));
    } catch (error) {
        next(error);
    }
};

export const getPalettes = async (req, res, next) => {
    try {
        const palettes = await colorPaletteService.getPalettesForUser(req.user.id);
        res.status(200).json(new ApiResponse(200, { palettes }));
    } catch (error) {
        next(error);
    }
};

export const deletePalette = async (req, res, next) => {
    try {
        await colorPaletteService.deletePalette(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'Palette deleted successfully'));
    } catch (error) {
        next(error);
    }
};