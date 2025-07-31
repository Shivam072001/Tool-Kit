// src/routes/passwordVault.routes.js

import express from 'express';
import { getVault, saveVault, checkPasswordBreach } from '../controllers/passwordVault.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getVault)
    .post(saveVault);

router.post('/check-breach', checkPasswordBreach);


export { router as passwordVaultRoutes };