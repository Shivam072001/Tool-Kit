// src/routes/passwordVault.routes.js

import express from 'express';
import { getVault, saveVault, checkPasswordBreach } from '../controllers/passwordVault.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { checkPasswordBreachSchema, saveVaultSchema } from '../validations/passwordVault.validation.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getVault)
    .post(validate(saveVaultSchema), saveVault);

router.post('/check-breach', validate(checkPasswordBreachSchema), checkPasswordBreach);


export { router as passwordVaultRoutes };