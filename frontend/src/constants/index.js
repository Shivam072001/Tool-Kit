// Time in milliseconds for polling job statuses
export const POLLING_INTERVAL_MS = 3000;

export const BASE_ROUTE = '/tools'

// Application Routes
export const ROUTES = {
    PRICING: "/pricing",
    LOGIN: "/login",
    REGISTER: "/register",

    DASHBOARD: "/dashboard",

    URL_SHORTENER: "/url-shortener",
    FILE_COMPRESSOR: "/file-compressor",
    FILE_CONVERTER: "/file-converter",
    BACKGROUND_REMOVER: "/background-remover",
    QR_CODE_GENERATOR: "/qr-code",
    DOCUMENT_SUMMARIZER: "/document-summarizer",
    PASSWORD_MANAGER: "/password-manager",
    CURRENCY_CONVERTER: "/currency-converter",
    GRAMMAR_CHECKER: "/grammar-checker",
    TEXT_DIFF: "/text-diff",
    VOICE_TO_TEXT: "/voice-to-text",
    COLOR_TOOLS: "/color-tools",
    TEMP_EMAIL: "/temp-email",
    METADATA_INSPECTOR: "/metadata-inspector",
    FAKE_DATA_GENERATOR: "/fake-data-generator",
    REGEX_TESTER: "/regex-tester",

    SHARED_PASSWORD: "/share/:accessToken",
};

export const BACKEND_ROUTES = {
    AUTH: '/auth',
    SHORT_URL: '/urls',
    AUDIO: '/audio',
    COLORS: '/colors',
    CURRENCY_CONVERTER: '/currency',
    TEXT_DIFF: '/text-diff',
    FAKE_DATA: '/fake-data',
    FILES: '/files',
    METADATA_INSPECTOR: '/metadata',
    VAULT: '.vault',
    SHARES: '/shares',
    QRCODES: '/qrcodes',
    REGEX: '/regex',
    TEMP_EMAIL: '/temp-email',
    TEXT: 'text'
}

export const RESPONSE_STATUS = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
};

export const OPERATION_STATUSES = {
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    SUCCESS: 'success',
    ERROR: 'error'
};

// UI Messages and Labels
export const UI_MESSAGES = {
    LOADING: 'Loading...',
    COPIED: 'Copied!',
    COPY_TO_CLIPBOARD: 'Copy to clipboard',
    ERROR_DEFAULT: 'An unexpected error occurred. Please try again.',
    // ... add other common messages
};

// Default settings for tools
export const DEFAULTS = {
    THEME: 'black-white',
    MODE: 'dark',
};

export const LEVELS = {
    INFO: 'info',
    DEBUG: 'debug',
    WARN: 'warn',
    ERROR: 'error',
    DETAILS: 'detailed',
    RESET: 'reset'
}

export const LOG_LEVEL_COLORS = {
    INFO: '\x1b[32m',    // green
    DEBUG: '\x1b[34m',   // blue
    WARN: '\x1b[33m',    // yellow
    ERROR: '\x1b[31m',   // red
    DETAILS: '\x1b[38;5;208m', // orange
    RESET: '\x1b[0m'
}