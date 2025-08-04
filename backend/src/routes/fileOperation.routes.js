import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
    uploadAndCompressFile,
    uploadAndConvertFile,
    uploadAndRemoveBackground,
    getJobStatus,
    deleteFileOperation,
    getConversionOptions,
} from "../controllers/fileOperation.controller.js";
import { checkUsage } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/convert/options", getConversionOptions);

router.post("/compress", upload.single("file"), checkUsage('tool'), uploadAndCompressFile);
router.post(
    "/convert",
    upload.single("file"),
    checkUsage('tool'),
    uploadAndConvertFile
);
router.post(
    "/remove-background",
    upload.single("image"),
    checkUsage('llm'),
    uploadAndRemoveBackground
);
router.get("/status/:taskId", getJobStatus);
router.route("/:id").delete(deleteFileOperation);

export { router as fileOperationRoutes };