import chalk from 'chalk';
import { LEVELS } from '../constants/index.js';

const { INFO, DEBUG, WARN, ERROR } = LEVELS;

class Logger {
    /**
     * Parses the V8 stack trace to find the file and line number of the log caller.
     * @returns {{fileInfo: string, history: string[]}} An object containing the immediate caller's file info and the full call stack history.
     */

    colorizeJson(obj) {
        return JSON.stringify(obj, null, 2)
            .replace(/"([^"]+)":/g, chalk.cyan('"$1":')) // keys
            .replace(/: "([^"]+)"/g, ': ' + chalk.green('"$1"')) // string values
            .replace(/: (\d+)/g, ': ' + chalk.yellow('$1')) // numbers
            .replace(/: (true|false)/g, ': ' + chalk.magenta('$1')) // booleans
            .replace(/: null/g, ': ' + chalk.gray('null')); // nulls
    }

    _getStackTrace() {
        const err = new Error();
        const stack = err.stack.split('\n').slice(1);

        const callerLine = stack.find(line =>
            !line.includes('Logger.js') &&
            !line.includes('logger.js')
        ) || '';

        const match = callerLine.match(/\((.*)\)/);
        const fileInfo = match ? match[1] : callerLine.trim().replace(/^at\s+/, '');

        const history = stack
            .map(line => line.trim().replace(/^at\s+/, ''))
            .filter(Boolean);

        return { fileInfo, history };
    }


    /**
     * Core logging function
     */
    _log(level, message, data) {
        const { fileInfo } = this._getStackTrace();
        const timestamp = new Date().toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });


        // Choose chalk color based on log level
        const colorMap = {
            [INFO]: chalk.green,
            [DEBUG]: chalk.blue,
            [WARN]: chalk.yellow,
            [ERROR]: chalk.red,
            DETAILS: chalk.cyan,
            SUCCESS: chalk.greenBright
        };
        const colorFn = colorMap[level] || chalk.white;

        const levelString = `[${level.toUpperCase()}]`.padEnd(9, ' ');

        const logObject = {
            level: level.toUpperCase(),
            timestamp,
            file: fileInfo,
            message,
            data
        };

        // Print level + timestamp in color
        console.log(colorFn(`${levelString}${timestamp}`));

        // Print JSON in plain white (to avoid messy coloring inside JSON)
        console.log(this.colorizeJson(logObject));
        console.log('');
    }

    info(message, data = null) {
        this._log(INFO, message, data);
    }

    debug(message, data = null) {
        this._log(DEBUG, message, data);
    }

    warn(message, data = null) {
        this._log(WARN, message, data);
    }

    error(message, data = null) {
        this._log(ERROR, message, data);
    }

    detailedLog(message, data = null) {
        const { history } = this._getStackTrace();
        const logObject = {
            level: 'DETAILS',
            timestamp: new Date().toISOString(),
            file_callback_history: history,
            message,
            data
        };
        console.log(chalk.cyan(JSON.stringify(logObject, null, 2)));
    }

    message(message, type) {
        const typeColorMap = {
            error: chalk.red,
            info: chalk.green,
            warn: chalk.yellow,
            success: chalk.greenBright
        };
        const colorFn = typeColorMap[type] || chalk.white;
        const timestamp = new Date().toISOString();
        const typeLabel = `[${type.toUpperCase()}]`.padEnd(9, ' ');

        console.log(colorFn(`${typeLabel}${timestamp} ${message}`));
    }
}

export const logger = new Logger();
