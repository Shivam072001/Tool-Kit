// src/services/temporaryEmail.service.js

import { io } from '../server.js';
import { temporaryEmailRepository } from '../repositories/temporaryEmail.repository.js';
import { AppError } from '../utils/AppError.js';
import { nanoid } from 'nanoid';
import { AVAILABLE_DOMAINS } from '../config/domains.js';


// --- SIMULATION ---
// This function simulates receiving a welcome email a few seconds after creation.
const simulateWelcomeEmail = (emailAddress) => {
    setTimeout(async () => {
        const welcomeMessage = {
            from: 'UtilityBox <welcome@utilitybox.app>',
            subject: 'Welcome to Your Temporary Email!',
            body: `This is your new temporary email address: ${emailAddress}. It will expire in one hour.`,
        };
        await temporaryEmailRepository.addMessageToInbox(emailAddress, welcomeMessage);
    }, 5000); // 5-second delay
};

class TemporaryEmailService {
    async generateNewEmail(userId) {
        // For simplicity, we'll delete any existing email the user has.
        // A more advanced implementation might allow multiple active addresses.
        const existingEmail = await temporaryEmailRepository.findByUserId(userId);
        if (existingEmail) {
            await temporaryEmailRepository.delete(existingEmail._id, userId);
        }

        const randomUsername = nanoid(10).toLowerCase();
        const randomDomain = AVAILABLE_DOMAINS[Math.floor(Math.random() * AVAILABLE_DOMAINS.length)];
        const emailAddress = `${randomUsername}@${randomDomain}`;

        const newEmail = await temporaryEmailRepository.create({
            user: userId,
            emailAddress,
            inbox: [],
        });

        // Simulate a welcome email
        simulateWelcomeEmail(emailAddress);

        return newEmail;
    }

    async checkInbox(userId) {
        const email = await temporaryEmailRepository.findByUserId(userId);
        if (!email) {
            return null; // No active email found for this user
        }
        return email;
    }

    /**
     * Adds a new message to an existing temporary email's inbox.
     * This is called by our internal Python SMTP service.
     * @param {object} emailData - The parsed email data.
     * @returns {Promise<TemporaryEmail|null>}
     */
    async addNewMessage(emailData) {
        const { to, from, subject, body } = emailData;
        const tempEmail = await temporaryEmailRepository.findByEmailAddress(to);

        const message = { from, subject, body, receivedAt: new Date() };
        const updatedEmail = await temporaryEmailRepository.addMessageToInbox(to, message);

        if (updatedEmail) {
            // 1. Emit real-time event
            io.to(updatedEmail.user.toString()).emit('new_email', updatedEmail);

            // 2. Handle forwarding if enabled
            if (updatedEmail.forwardingEnabled && updatedEmail.forwardingAddress) {
                await sendForwardedEmail(updatedEmail.forwardingAddress, message);
            }
        }
        return updatedEmail;
    }

    async updateForwarding(userId, forwardingData) {
        const { forwardingAddress, forwardingEnabled } = forwardingData;

        const email = await temporaryEmailRepository.findByUserId(userId);
        if (!email) {
            throw new AppError('No active temporary email found for this user.', 404);
        }

        // Simple validation for the forwarding email
        if (forwardingAddress && !/.+\@.+\..+/.test(forwardingAddress)) {
            throw new AppError('Please provide a valid forwarding email address.', 400);
        }

        email.forwardingAddress = forwardingAddress || '';
        email.forwardingEnabled = forwardingEnabled;

        return await email.save();
    }

    async deleteEmail(emailId, userId) {
        const result = await temporaryEmailRepository.delete(emailId, userId);
        if (result.nModified === 0) {
            throw new AppError('No active email found to delete.', 404);
        }
        return result;
    }
}

export const temporaryEmailService = new TemporaryEmailService();