// src/models/colorPalette.model.js

import mongoose from 'mongoose';

const colorPaletteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    colors: {
        type: [String], // Array of hex color codes
        required: true,
        validate: [
            (val) => val.length > 0,
            'Color palette must have at least one color.',
        ],
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

const ColorPalette = mongoose.model('ColorPalette', colorPaletteSchema);

export default ColorPalette;