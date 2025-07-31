// src/routes/metadataOperation.routes.js

import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import {
    inspectFile,
    getInspectionHistory,
    deleteInspectionHistory,
} from '../controllers/metadataOperation.controller.js';

const router = express.Router();

router.use(protect);

router.post('/inspect', upload.single('file'), inspectFile);
router.route('/history').get(getInspectionHistory);
router.route('/history/:id').delete(deleteInspectionHistory);

export { router as metadataOperationRoutes };