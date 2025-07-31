// src/controllers/temporaryEmail.controller.js

import { temporaryEmailService } from '../services/temporaryEmail.service.js';

export const generateEmail = async (req, res, next) => {
    try {
        const newEmail = await temporaryEmailService.generateNewEmail(req.user.id);
        res.status(201).json({ status: 'success', data: { email: newEmail } });
    } catch (error) {
        next(error);
    }
};

export const getInbox = async (req, res, next) => {
    try {
        const email = await temporaryEmailService.checkInbox(req.user.id);
        if (!email) {
            return res.status(200).json({ status: 'success', data: { email: null } });
        }
        res.status(200).json({ status: 'success', data: { email } });
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
        res.status(200).json({ status: 'success', data: { email: updatedEmail } });
    } catch (error) {
        next(error);
    }
};

export const deleteEmail = async (req, res, next) => {
    try {
        await temporaryEmailService.deleteEmail(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};