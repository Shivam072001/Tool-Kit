// src/models/passwordVault.model.js

import mongoose from 'mongoose';

const passwordVaultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each user has only one vault
        index: true,
    },
    vaultData: {
        type: String, // This will store the AES-encrypted JSON string of all passwords
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the timestamp on each save
passwordVaultSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const PasswordVault = mongoose.model('PasswordVault', passwordVaultSchema);

export default PasswordVault;