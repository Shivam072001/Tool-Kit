// src/routes/color.routes.js

import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { deletePalette, getPalettes, savePalette } from '../controllers/colorPalette.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { savePaletteSchema } from '../validations/colorPalette.validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').post(validate(savePaletteSchema), savePalette).get(getPalettes);

router.route('/:id').delete(deletePalette);

export { router as colorPaletteRoutes };