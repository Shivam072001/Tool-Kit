// backend-gateway/src/middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../utils/AppError.js';

const UPLOAD_DIR = './uploads/';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const ALLOWED_MIMETYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'text/plain',
    'text/csv',
];

export const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB file size limit
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError('This file type is not supported.', 400), false);
        }
    },
});