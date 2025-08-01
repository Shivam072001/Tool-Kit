// src/routes/temporaryEmail.routes.js

import express from 'express';
import {
    generateEmail,
    getInbox,
    deleteEmail,
    receiveInternalEmail,
    updateForwardingSettings,
} from '../controllers/temporaryEmail.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateForwardingSettingsSchema } from '../validations/temporaryEmail.validation.js';

const router = express.Router();

router.use(protect);

router.post('/internal/receive', receiveInternalEmail);
router.post('/forwarding', validate(updateForwardingSettingsSchema), updateForwardingSettings);

router.post('/generate', generateEmail);
router.get('/inbox', getInbox);
router.delete('/:id', deleteEmail);

export { router as temporaryEmailRoutes };