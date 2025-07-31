// backend-gateway/src/controllers/error.controller.js

import { config } from '../config/env.js';
import { OPERATION_STATUSES } from '../constants/index.js';
import { AppError } from '../utils/AppError.js';


const { nodeEnv } = config;

// Handles Mongoose CastError (e.g., invalid ObjectId)
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

// Handles Mongoose Duplicate Key Error (e.g., unique email constraint)
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new AppError(message, 400);
};

// Handles Mongoose Validation Error
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Handles invalid JWT
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

// Handles expired JWT
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

// Sends detailed error response for development environment
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Sends generic, safe error response for production environment
const sendErrorProd = (err, res) => {
    // A) For operational, trusted errors: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // B) For programming or other unknown errors: don't leak error details
    // 1) Log error to the console for developers
    console.error('ERROR 💥', err);
    // 2) Send generic message to client
    return res.status(500).json({
        status: OPERATION_STATUSES.ERROR,
        message: 'Something went very wrong!'
    });
};


export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || OPERATION_STATUSES.ERROR;

    if (nodeEnv === 'development') {
        sendErrorDev(err, res);
    } else if (nodeEnv === 'production') {
        let error = { ...err, message: err.message, name: err.name };

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};