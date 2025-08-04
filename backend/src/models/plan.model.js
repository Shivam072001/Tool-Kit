// backend-gateway/src/models/plan.model.js

import mongoose from 'mongoose';
import {
    PLAN_TYPES,
    SUBSCRIPTION_TIERS
} from '../constants/index.js';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: Object.values(SUBSCRIPTION_TIERS),
    },
    planType: {
        type: String,
        required: true,
        enum: Object.values(PLAN_TYPES),
    },
    price: {
        type: Number,
        required: true,
    },
    benefits: {
        toolUsesPerDay: {
            type: Number,
            default: 2,
        },
        llmCallsPerDay: {
            type: Number,
            default: 2,
        },
        storageRetentionDays: {
            type: Number,
            default: 1,
        },
        permanentStorageGB: {
            type: Number,
            default: 0,
        },
        customApiKeys: {
            type: Boolean,
            default: false,
        },
    },
}, {
    timestamps: true
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;