// src/routes/regex.routes.js

import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
    deletePattern,
    getPatternHistory,
    savePattern,
    testPattern
} from '../controllers/regexPattern.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { testPatternSchema, savePatternSchema } from '../validations/regexPattern.validation.js';

const router = express.Router();

router.use(protect);

router.post('/test', validate(testPatternSchema), testPattern);

router.route('/')
    .post(validate(savePatternSchema), savePattern)
    .get(getPatternHistory);

router.route('/:id').delete(deletePattern);

export { router as regexRoutes };