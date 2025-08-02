import express from 'express';
import { AppError } from '../utils/AppError.js';
import { authRoutes } from './auth.routes.js';
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

const router = express.Router();

// --- API Routes ---
router.use('/api/auth', authRoutes);
router.use('/api/urls', shortUrlRoutes);
router.use('/api/files', fileOperationRoutes);
router.use('/api/text', textOperationRoutes);
router.use('/api/audio', audioOperationRoutes);
router.use('/api/qrcodes', qrCodeRoutes);
router.use('/api/vault', passwordVaultRoutes);
router.use('/api/shares', secureShareRoutes);
router.use('/api/currency', currencyConverterRoutes);
router.use('/api/text-diff', textDiffRoutes);
router.use('/api/colors', colorPaletteRoutes);
router.use('/api/temp-email', temporaryEmailRoutes);
router.use('/api/metadata', metadataOperationRoutes);
router.use('/api/regex', regexRoutes);

// --- Root Level Routes ---
router.get('/:code', redirect);
router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// --- Catch-all 404 Route for API ---
router.all('/api/*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default router;