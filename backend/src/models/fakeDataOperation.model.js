// src/models/fakeDataOperation.model.js

import mongoose from 'mongoose';

const fakeDataOperationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    dataType: {
        type: String,
        required: true,
        enum: ['personal', 'business', 'finance'],
    },
    count: {
        type: Number,
        required: true,
    },
    locale: {
        type: String,
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

const FakeDataOperation = mongoose.model(
    'FakeDataOperation',
    fakeDataOperationSchema
);

export default FakeDataOperation;