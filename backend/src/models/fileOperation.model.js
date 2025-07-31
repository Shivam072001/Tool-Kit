// src/models/fileProcess.model.js
import mongoose from "mongoose";
import { FILE_OPERATION_TYPES, OPERATION_STATUSES } from "../constants";

const fileDetailSchema = new mongoose.Schema(
    {
        filename: { type: String },
        filetype: { type: String },
        sourceFormat: { type: String },
        targetFormat: { type: String },
        size: { type: Number },
        fileUrl: { type: String },
    },
    { _id: false }
);

const fileOperationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    operationType: {
        type: String,
        required: true,
        enum: Object.values(FILE_OPERATION_TYPES),
    },
    taskId: { type: String, required: true, unique: true, index: true },
    status: {
        type: String,
        required: true,
        enum: Object.values(OPERATION_STATUSES),
        default: OPERATION_STATUSES,
    },
    source: fileDetailSchema,
    result: fileDetailSchema,
    errorMessage: { type: String },
    createdAt: { type: Date, default: Date.now, expires: "90d" },
    completedAt: { type: Date },
    deleted: { type: Boolean, default: false, index: true },
});

const FileOperation = mongoose.model("FileOperation", fileOperationSchema);
export default FileOperation;
