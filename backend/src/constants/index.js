// Enums for database models to ensure consistency

export const SUBSCRIPTION_TIERS = {
    FREE: 'free',
    PRO: 'pro',
    ENTERPRISE: 'enterprise',
};

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

export const FILE_OPERATION_TYPES = {
    COMPRESSION: 'file-compression',
    CONVERSION: 'file-conversion',
    BG_REMOVAL: 'ai-background-removal',
};

export const TEXT_OPERATION_TYPES = {
    SUMMARIZATION: 'document-summarization',
    GRAMMAR_CHECK: 'text-grammar-check',
};

export const AUDIO_OPERATION_TYPES = {
    TRANSCRIPTION: 'audio-transcription',
};


export const DEFAULT_JWT_EXPIRATION = '1d';

export const CRYPTO_DEFAULTS = {
    ALGORITHM: 'aes-256-gcm',
    IV_LENGTH: 16,
    SALT_LENGTH: 64,
    TAG_LENGTH: 16,
    KEY_LENGTH: 32,
    ITERATIONS: 100000,
};

export const LOG_LEVELS = {
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