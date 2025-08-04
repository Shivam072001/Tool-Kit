// backend/src/routes/apiKey.routes.js

import express from 'express';
import {
    protect
} from '../middlewares/auth.middleware.js';
import {
    getApiKeys,
    saveApiKeys
} from '../controllers/apiKey.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getApiKeys)
    .post(saveApiKeys);

export {
    router as apiKeyRoutes
};