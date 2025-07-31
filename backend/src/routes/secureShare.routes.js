// backend/src/routes/secureShare.routes.js

import express from 'express';
import { createShare, claimShare } from '../controllers/secureShare.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createShare);
router.get('/:accessToken', claimShare);

export { router as secureShareRoutes };