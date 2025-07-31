// src/models/regexPattern.model.js

import mongoose from 'mongoose';

const regexPatternSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'A name for the pattern is required.'],
        trim: true,
    },
    pattern: {
        type: String,
        required: [true, 'A regex pattern is required.'],
    },
    flags: {
        type: String,
        default: '', // e.g., "gi", "m", etc.
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

const RegexPattern = mongoose.model('RegexPattern', regexPatternSchema);

export default RegexPattern;