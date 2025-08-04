// backend-gateway/src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
    SUBSCRIPTION_TIERS,
    USER_TYPES
} from '../constants/index.js';

const { FREE, PRO, ELITE, BUSINESS, ENTERPRISE, CUSTOM } = SUBSCRIPTION_TIERS;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be at least 8 characters long.']
    },
    userType: {
        type: String,
        enum: Object.values(USER_TYPES),
        default: USER_TYPES.INDIVIDUAL,
    },
    userPlan: {
        type: String,
        enum: [
            FREE,
            PRO,
            ELITE,
            BUSINESS,
            ENTERPRISE,
            CUSTOM,
        ],
        default: FREE,
    },
    storagePlan: {
        type: String,
        enum: [
            PRO,
            ELITE,
            BUSINESS,
            ENTERPRISE,
            CUSTOM,
        ],
        default: null,
    },
    vaultSalt: {
        type: String,
    },
    apiKeys: {
        openai: {
            type: String,
            select: false
        },
        gemini: {
            type: String,
            select: false
        },
        claude: {
            type: String,
            select: false
        },
        perplexity: {
            type: String,
            select: false
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    // Generate a vault salt for new users
    if (this.isNew) {
        this.vaultSalt = bcrypt.genSaltSync(16);
    }
    next();
});

// Method to compare candidate password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;