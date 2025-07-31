// src/routes/color.routes.js

import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { deletePalette, getPalettes, savePalette } from '../controllers/colorPalette.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').post(savePalette).get(getPalettes);

router.route('/:id').delete(deletePalette);

export { router as colorPaletteRoutes };