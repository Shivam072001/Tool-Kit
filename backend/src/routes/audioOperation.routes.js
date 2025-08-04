// src/routes/audioProcess.routes.js
import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
    deleteAudioOperation,
    getHistory,
    getJobStatus,
    uploadAndTranscribeAudio,
} from "../controllers/audioOperation.controller.js";
import { checkUsage } from "../middlewares/subscription.middleware.js";

const router = express.Router();
router.use(protect);

router.post("/transcribe", upload.single("file"), checkUsage('llm'), uploadAndTranscribeAudio);
router.get('/history', getHistory);
router.get("/status/:taskId", getJobStatus);
router.delete('/:id', deleteAudioOperation);

export { router as audioOperationRoutes };
