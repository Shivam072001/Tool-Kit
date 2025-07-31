import { OPERATION_STATUSES } from "../constants/index.js";
import { textOperationService } from "../services/textOperation.service.js";

/**
 * (New controller function)
 */
export const uploadAndSummarizeDocument = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No document file uploaded.', 400));
    }

    try {
        const { taskId } = await textOperationService.processDocumentSummarization(req.file, req.user);
        res.status(202).json({ status: OPERATION_STATUSES.PROCESSING, taskId });
    } catch (error) {
        next(new AppError(error.message, 502));
    }
};

/**
 * (New controller function)
 */
export const submitGrammarCheck = async (req, res, next) => {
    const { text } = req.body;
    if (!text) {
        return next(new AppError('Text content is required.', 400));
    }

    try {
        const { taskId } = await textOperationService.processGrammarCheck(text, req.user);
        res.status(202).json({ status: OPERATION_STATUSES.PROCESSING, taskId });
    } catch (error) {
        next(new AppError(error.message, 502));
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const history = await textOperationService.getHistory(req.user.id);
        res.status(200).json({ status: 'success', data: { history } });
    } catch (error) {
        next(error);
    }
};

export const getJobStatus = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const result = await textOperationService.getJobStatus(taskId);
        res.status(200).json(result);
    } catch (error) {
        next(new AppError('Could not retrieve task status.', 502));
    }
};

export const deleteTextOperation = async (req, res, next) => {
    try {
        await textOperationService.deleteTextOperation(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};