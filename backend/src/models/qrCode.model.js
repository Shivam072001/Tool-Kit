// src/models/qrCode.model.js

import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    value: {
        type: String,
        required: [true, 'QR Code value is required.'],
        trim: true,
    },
    foregroundColor: {
        type: String,
        default: '#000000',
    },
    backgroundColor: {
        type: String,
        default: '#FFFFFF',
    },
    scans: {
        type: Number,
        default: 0
    },
    maxScans: {
        type: Number,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false,
        index: true,
    },
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

export default QRCode;