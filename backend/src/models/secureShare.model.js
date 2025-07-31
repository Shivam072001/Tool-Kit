// backend/src/models/secureShare.model.js

import mongoose from 'mongoose';

const secureShareSchema = new mongoose.Schema({
    sharerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipientEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    encryptedData: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a TTL index to automatically delete expired shares
secureShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SecureShare = mongoose.model('SecureShare', secureShareSchema);

export default SecureShare;