// src/models/audioProcess.model.js

import mongoose from "mongoose";
import { AUDIO_OPERATION_TYPES, OPERATION_STATUSES } from "../constants/index.js";

const fileDetailSchema = new mongoose.Schema(
    {
        filename: { type: String },
        filetype: { type: String },
        size: { type: Number },
    },
    { _id: false }
);

const audioOperationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    operationType: {
        type: String,
        required: true,
        enum: Object.values(AUDIO_OPERATION_TYPES),
    },
    taskId: { type: String, required: true, unique: true, index: true },
    status: {
        type: String,
        required: true,
        enum: Object.values(OPERATION_STATUSES),
        default: OPERATION_STATUSES.PROCESSING,
    },
    source: fileDetailSchema,
    result: {
        // Result for transcription is text
        text: { type: String },
    },
    errorMessage: { type: String },
    createdAt: { type: Date, default: Date.now, expires: "90d" },
    completedAt: { type: Date },
    deleted: { type: Boolean, default: false, index: true },
});

const AudioOperation = mongoose.model("AudioProcess", audioOperationSchema);
export default AudioOperation;
