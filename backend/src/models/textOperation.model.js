// src/models/textProcess.model.js
import mongoose from "mongoose";
import { OPERATION_STATUSES, TEXT_OPERATION_TYPES } from "../constants";

const textDetailSchema = new mongoose.Schema(
    { text: { type: String } },
    { _id: false }
);

const textOperationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    operationType: {
        type: String,
        required: true,
        enum: Object.values(TEXT_OPERATION_TYPES),
    },
    taskId: { type: String, required: true, unique: true, index: true },
    status: {
        type: String,
        required: true,
        enum: Object.values(OPERATION_STATUSES),
        default: OPERATION_STATUSES.PROCESSING,
    },
    source: textDetailSchema,
    result: textDetailSchema,
    errorMessage: { type: String },
    createdAt: { type: Date, default: Date.now, expires: "90d" },
    completedAt: { type: Date },
    deleted: { type: Boolean, default: false, index: true },
});

const TextOperation = mongoose.model("TextOperation", textOperationSchema);
export default TextOperation;
