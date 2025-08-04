import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { deleteTextOperation, getJobStatus, submitGrammarCheck, uploadAndSummarizeDocument } from "../controllers/textOperation.controller.js";
import { checkUsage } from "../middlewares/subscription.middleware.js";

const router = express.Router();

// All file routes are protected
router.use(protect);

router.post(
    "/summarize-document",
    upload.single("file"),
    checkUsage('llm'),
    uploadAndSummarizeDocument
);
router.post('/check-grammar', checkUsage('llm'), submitGrammarCheck);
router.get("/status/:taskId", getJobStatus);
router.route("/:id").delete(deleteTextOperation);

export { router as textOperationRoutes };
