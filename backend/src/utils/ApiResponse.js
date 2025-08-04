import { OPERATION_STATUSES } from "../constants/index.js";

/**
 * A standardized response wrapper for API calls.
 * This class ensures a consistent and predictable structure for all responses.
 */
class ApiResponse {
    /**
     * @param {number} statusCode The HTTP status code.
     * @param {object} data The data payload to be sent.
     * @param {string} [message='success'] A descriptive message for the response.
     */
    constructor(statusCode, data, message = OPERATION_STATUSES.SUCCESS) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // Success is determined by a status code less than 400
    }
}

export { ApiResponse };