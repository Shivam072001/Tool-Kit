// backend/src/routes/secureShare.routes.js

import express from 'express';
import { createShare, claimShare } from '../controllers/secureShare.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createShareSchema } from '../validations/secureShare.validation.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createShareSchema), createShare);
router.get('/:accessToken', claimShare);

export { router as secureShareRoutes };