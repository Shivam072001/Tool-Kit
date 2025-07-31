import { LOG_LEVELS, LOG_LEVEL_COLORS } from '../constants/index.js'

/**
 * A custom logger class with color-coded log levels and detailed stack trace information.
 * This logger is self-contained and does not rely on any external libraries.
 */
class Logger {
    // ANSI escape codes for console colors
    static COLORS = LOG_LEVEL_COLORS;

    /**
     * Parses the V8 stack trace to find the file and line number of the log caller.
     * @returns {{fileInfo: string, history: string[]}} An object containing the immediate caller's file info and the full call stack history.
     */
    _getStackTrace() {
        const err = new Error();
        const stack = err.stack.split('\n');

        const callerLine = stack[2] || '';
        const fileInfo = callerLine.trim().replace('at ', '');

        // For detailedLog, we want the full history leading up to the logger call.
        const history = stack
            .slice(2) // Skip logger-internal calls
            .map(line => line.trim().replace('at ', ''))
            .filter(line => line); // Remove any empty lines

        return { fileInfo, history };
    }

    /**
     * The core logging function.
     * @param {string} level - The log level (e.g., 'info', 'error').
     * @param {string} message - The message to log.
     * @param {*} data - The data payload to log (object, array, string, etc.).
     */
    _log(level, message, data) {
        const color = Logger.COLORS[level] || Logger.COLORS.RESET;
        const { fileInfo } = this._getStackTrace();

        const logObject = {
            level: level.toUpperCase(),
            timestamp: new Date().toISOString(),
            file: fileInfo,
            message: message,
            data: data
        };

        const timestamp = new Date().toISOString();
        const levelString = `[${level.toUpperCase()}]`.padEnd(9, ' ');

        console.log(`${color}${levelString}${timestamp}${Logger.COLORS.RESET}`);
        console.log(JSON.stringify(logObject, null, 2));
        console.log(''); // Add a newline for readability
    }

    /**
     * Logs an informational message. (Green)
     * @param {string} message - The message to log.
     * @param {*} [data] - Optional data payload.
     */
    info(message, data = null) {
        this._log(LOG_LEVELS.INFO, message, data);
    }

    /**
     * Logs a debug message. (Blue)
     * @param {string} message - The message to log.
     * @param {*} [data] - Optional data payload.
     */
    debug(message, data = null) {
        this._log(LOG_LEVELS.DEBUG, message, data);
    }

    /**
     * Logs a warning message. (Yellow)
     * @param {string} message - The message to log.
     * @param {*} [data] - Optional data payload.
     */
    warn(message, data = null) {
        this._log(LOG_LEVELS.WARN, message, data);
    }

    /**
     * Logs an error message. (Red)
     * @param {string} message - The message to log.
     * @param {*} [data] - Optional data payload.
     */
    error(message, data = null) {
        this._log(LOG_LEVELS.ERROR, message, data);
    }

    /**
     * Logs a detailed message with a full callback history. (Orange)
     * @param {string} message - The message to log.
     * @param {*} [data] - Optional data payload.
     */
    detailedLog(message, data = null) {
        const color = Logger.COLORS.DETAILS;
        const { history } = this._getStackTrace();

        const logObject = {
            level: LOG_LEVELS.DETAILS,
            timestamp: new Date().toISOString(),
            'file_callback_history': history,
            message: message,
            data: data
        };

        console.log(`${color}%s${Logger.COLORS.DETAILS}`, JSON.stringify(logObject, null, 2));
    }
}

// Export a single, ready-to-use instance of the logger
export const logger = new Logger();
