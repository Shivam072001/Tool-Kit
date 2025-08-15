import express from 'express';
import { AppError } from '../utils/AppError.js';
import { authRoutes } from './auth.routes.js';
import { planRoutes } from './plan.routes.js';
import { shortUrlRoutes } from './shortUrl.routes.js';
import { qrCodeRoutes } from './qrCode.routes.js';
import { passwordVaultRoutes } from './passwordVault.routes.js';
import { secureShareRoutes } from './secureShare.routes.js';
import { currencyConverterRoutes } from './currencyConverter.routes.js';
import { fileOperationRoutes } from './fileOperation.routes.js';
import { textOperationRoutes } from './textOperation.routes.js';
import { textDiffRoutes } from './textDiff.routes.js';
import { audioOperationRoutes } from './audioOperation.routes.js';
import { colorPaletteRoutes } from './colorPalette.routes.js';
import { temporaryEmailRoutes } from './temporaryEmail.routes.js';
import { metadataOperationRoutes } from './metadataOperation.routes.js';
import { regexRoutes } from './regexPattern.routes.js';
import { redirect } from '../controllers/redirect.controller.js';
import { apiKeyRoutes } from './apiKey.routes.js';

const router = express.Router();

// --- API Routes ---
router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/keys', apiKeyRoutes);
router.use('/urls', shortUrlRoutes);
router.use('/files', fileOperationRoutes);
router.use('/text', textOperationRoutes);
router.use('/audio', audioOperationRoutes);
router.use('/qrcodes', qrCodeRoutes);
router.use('/vault', passwordVaultRoutes);
router.use('/share', secureShareRoutes);
router.use('/currency', currencyConverterRoutes);
router.use('/text-diff', textDiffRoutes);
router.use('/colors', colorPaletteRoutes);
router.use('/temp-email', temporaryEmailRoutes);
router.use('/metadata', metadataOperationRoutes);
router.use('/regex', regexRoutes);

// --- Root Level Routes ---
router.get('/:code', redirect);
router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// --- Catch-all 404 Route for API ---
router.all('/api{/*path}', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default router;