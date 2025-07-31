// src/models/converterHistory.model.js

import mongoose from 'mongoose';

const currencyConverterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    fromCurrency: {
        type: String,
        required: true,
    },
    toCurrency: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    result: {
        type: Number,
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

const currencyConverter = mongoose.model('currencyConverter', currencyConverterSchema);

export default currencyConverter;