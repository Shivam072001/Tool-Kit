// src/routes/regex.routes.js

import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
    deletePattern,
    getPatternHistory,
    savePattern,
    testPattern
} from '../controllers/regexPattern.controller.js';

const router = express.Router();

router.use(protect);

router.post('/test', testPattern);

router.route('/')
    .post(savePattern)
    .get(getPatternHistory);

router.route('/:id').delete(deletePattern);

export { router as regexRoutes };