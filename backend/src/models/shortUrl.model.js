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
        required: false
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

shortUrlSchema.index({ user: 1 });

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;