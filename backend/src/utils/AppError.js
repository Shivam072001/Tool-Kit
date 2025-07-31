// backend-gateway/src/utils/AppError.js

class AppError extends Error {
    /**
     * @param {string} message - The error message for the client.
     * @param {number} statusCode - The HTTP status code (e.g., 400, 404, 500).
     */
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Capture the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError };