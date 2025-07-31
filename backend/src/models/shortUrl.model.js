// backend-gateway/src/models/shortUrl.model.js

import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous URL shortening
    },
    clicks: {
        type: Number,
        default: 0
    },
    maxClicks: {
        type: Number,
        default: null
    },
    expiresAt: {
        type: Date,
        required: false
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false,
        index: true,
    },
});

// Indexing the shortCode is critical for fast redirection performance
shortUrlSchema.index({ shortCode: 1 });
shortUrlSchema.index({ user: 1 }); // Index for fetching a user's URLs

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;