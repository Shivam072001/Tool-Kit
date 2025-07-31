// src/routes/fakeData.routes.js

import express from 'express';
import {
    generateFakeData,
    getGenerationHistory,
    deleteGenerationHistory
} from '../controllers/fakeData.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateFakeData);
router.route('/history').get(getGenerationHistory);
router.route('/history/:id').delete(deleteGenerationHistory);

export { router as fakeDataRoutes };