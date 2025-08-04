// backend-gateway/src/models/usage.model.js

import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    toolUses: {
        type: Number,
        default: 0,
    },
    llmCalls: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});

usageSchema.index({
    userId: 1,
    date: 1
}, {
    unique: true
});

const Usage = mongoose.model('Usage', usageSchema);

export default Usage;