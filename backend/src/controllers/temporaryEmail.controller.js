import { temporaryEmailService } from '../services/temporaryEmail.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const generateEmail = async (req, res, next) => {
    try {
        const newEmail = await temporaryEmailService.generateNewEmail(req.user.id);
        res.status(201).json(new ApiResponse(201, { email: newEmail }, 'Email generated'));
    } catch (error) {
        next(error);
    }
};

export const getInbox = async (req, res, next) => {
    try {
        const email = await temporaryEmailService.checkInbox(req.user.id);
        res.status(200).json(new ApiResponse(200, { email }));
    } catch (error) {
        next(error);
    }
};

/**
 * [INTERNAL] Receives a parsed email from the Python SMTP service
 * and adds it to the corresponding inbox.
 */
export const receiveInternalEmail = async (req, res, next) => {
    try {
        const emailData = req.body;
        await temporaryEmailService.addNewMessage(emailData);
        // This is an internal endpoint, a simple success is sufficient.
        res.status(200).json({ status: 'success', message: 'Email received.' });
    } catch (error) {
        // Don't use the global error handler for this internal route
        // to avoid sending stack traces back to the Python service.
        console.error("Error in receiveInternalEmail:", error);
        res.status(500).json({ status: 'error', message: 'Failed to process email.' });
    }
};

export const updateForwardingSettings = async (req, res, next) => {
    try {
        const updatedEmail = await temporaryEmailService.updateForwarding(req.user.id, req.body);
        res.status(200).json(new ApiResponse(200, { email: updatedEmail }, 'Forwarding settings updated'));
    } catch (error) {
        next(error);
    }
};

export const deleteEmail = async (req, res, next) => {
    try {
        await temporaryEmailService.deleteEmail(req.params.id, req.user.id);
        res.status(204).json(new ApiResponse(204, null, 'Email deleted'));
    } catch (error) {
        next(error);
    }
};