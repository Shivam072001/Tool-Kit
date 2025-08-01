// src/routes/textDiff.routes.js

import express from 'express';
import { saveDiff, getHistory, deleteDiff } from '../controllers/textDiff.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { saveDiffSchema } from '../validations/textDiff.validation.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(validate(saveDiffSchema), saveDiff)
    .get(getHistory);

router.route('/:id')
    .delete(deleteDiff);

export { router as textDiffRoutes };