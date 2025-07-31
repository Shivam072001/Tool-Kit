// src/models/temporaryEmail.model.js

import mongoose from 'mongoose';

const emailMessageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now },
});

const temporaryEmailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    inbox: [emailMessageSchema],
    forwardingAddress: {
        type: String,
        trim: true,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h', // Emails will expire after 1 hour
    },
    deleted: {
        type: Boolean,
        default: false,
        index: true,
    },
});

const TemporaryEmail = mongoose.model('TemporaryEmail', temporaryEmailSchema);

export default TemporaryEmail;