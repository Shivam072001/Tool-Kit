import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * A centralized configuration object that pulls values from environment variables.
 * Provides default values for a stable development experience.
 */
export const config = {
    // Application environment ('development' or 'production')
    nodeEnv: process.env.NODE_ENV || 'development',

    // Server port
    port: process.env.PORT || 8080,

    // MongoDB connection string
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/utilitybox',

    // JWT settings
    jwtSecret: process.env.JWT_SECRET || '49pgAd04g0BrnWPTyxgeGhOHsgwYpX1sci3c2j8whAA',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

    // Secure Share feature secret
    secureShareSecret: process.env.SECURE_SHARE_SECRET || 'r5YRAYoWE7Qqt4yy5gipB7NlhmBIEU27+4dP6BozVmNhQYhQcGxaIWAEiG9pVyj1yLnkUh3xKFckHXvnqP0FsQ==',

    // Soft delete feature toggle
    enableSoftDelete: process.env.ENABLE_SOFT_DELETE === 'true',

    // CORS allowed origins
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS
        ? process.env.CORS_ALLOWED_ORIGINS.split(',')
        : ['http://localhost:5173'],

    // URL for the internal Python compute service
    computeServiceUrl: process.env.COMPUTE_SERVICE_URL || 'http://localhost:8000',
};
