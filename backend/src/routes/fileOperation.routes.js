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

const router = express.Router();

router.use(protect);

router.get("/convert/options", getConversionOptions);

router.post("/compress", upload.single("file"), uploadAndCompressFile);
router.post(
    "/convert",
    upload.single("file"),
    uploadAndConvertFile
);
router.post(
    "/remove-background",
    upload.single("image"),
    uploadAndRemoveBackground
);
router.get("/status/:taskId", getJobStatus);
router.route("/:id").delete(deleteFileOperation);

export { router as fileOperationRoutes };