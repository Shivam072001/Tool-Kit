// src/models/metadataOperation.model.js

import mongoose from 'mongoose';

const fileDetailSchema = new mongoose.Schema(
    {
        filename: { type: String },
        filetype: { type: String },
        size: { type: Number },
    },
    { _id: false }
);

const metadataOperationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    sourceFile: fileDetailSchema,
    metadata: {
        type: Map,
        of: String, // All metadata values will be stored as strings
        required: true,
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

const MetadataOperation = mongoose.model(
    'MetadataOperation',
    metadataOperationSchema
);

export default MetadataOperation;