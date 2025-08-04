// Enums for database models to ensure consistency

export const SUBSCRIPTION_TIERS = {
    FREE: 'free',
    PRO: 'pro',
    ELITE: 'elite',
    BUSINESS: 'business',
    ENTERPRISE: 'enterprise',
    CUSTOM: 'custom',
};

export const USER_TYPES = {
    INDIVIDUAL: 'individual',
    BUSINESS: 'business',
};

export const PLAN_TYPES = {
    USER: 'user',
    STORAGE: 'storage',
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
    HASH: 'sha512'
};

export const LEVELS = {
    INFO: 'info',
    DEBUG: 'debug',
    WARN: 'warn',
    ERROR: 'error',
    DETAILS: 'detailed',
    RESET: 'reset',
    SUCCESS: 'success'
}

export const LOG_LEVEL_COLORS = {
    SUCCESS: '\x1b[32m',   // green
    INFO: '\x1b[34m',      // blue
    DEBUG: '\x1b[37m',     // off-white (bright white)
    WARN: '\x1b[33m',      // yellow
    ERROR: '\x1b[31m',     // red
    DETAILS: '\x1b[38;5;208m', // orange
    RESET: '\x1b[0m'
}
