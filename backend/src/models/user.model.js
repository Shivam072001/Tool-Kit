// backend-gateway/src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { SUBSCRIPTION_TIERS } from '../constants';

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
    vaultSalt: {
        type: String,
    },
    subscriptionTier: {
        type: String,
        enum: Object.values(SUBSCRIPTION_TIERS),
        default: SUBSCRIPTION_TIERS.FREE
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

// Add index on email for faster query performance
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;