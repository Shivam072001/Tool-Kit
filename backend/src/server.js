// backend-gateway/src/server.js

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';
import connectDB from './config/db.js';
import { corsOptions } from './config/cors.js';
import mainRouter from './routes/index.js';
import { globalErrorHandler } from './controllers/error.controller.js';
import { config } from './config/env.js';
import { logger } from './utils/Logger.js';
import { LEVELS } from './constants/index.js';
import { swaggerSpec } from './config/swagger.js';
import { AppError } from './utils/AppError.js';

// Load environment variables
dotenv.config();

const { nodeEnv, port } = config;
const { SUCCESS, WARN, ERROR } = LEVELS

// --- Initialize Express App ---
const app = express();
const httpServer = createServer(app);

// --- Initialize Socket.io ---
const io = new Server(httpServer, {
    cors: corsOptions
});

// --- Socket.io Connection Logic ---
io.on('connection', (socket) => {
    logger.info('🔌 A user connected:', { "Socket Id": socket.id });

    socket.on('join_room', (userId) => {
        socket.join(userId);
        logger.info(`User ${socket.id} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
        logger.info('A user disconnected:', { "Socket Id": socket.id });
    });
});

// --- Connect to Database ---
connectDB();

// --- Global Middleware ---

// 1. Security Headers
app.use(helmet());

// 2. CORS
app.use(cors(corsOptions));

// 3. Request Logger
if (nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// 4. Rate Limiting (prevents brute-force attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/v1', limiter);

// 5. Body Parsers
app.use(express.json({ limit: '10kb' })); // Control request body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get(
    '/redoc',
    redoc({
        title: 'API Docs',
        specUrl: '/docs-json',
    })
);
app.get('/docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// --- Mount Routers ---
app.use('/api/v1', mainRouter);

// Handle 404 Not Found
app.all('{*path}', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// --- Global Error Handling ---
// This middleware must be last
app.use(globalErrorHandler);


// --- Start Server using httpServer ---
httpServer.listen(port, () => {
    logger.message(`🚀 Server running in ${nodeEnv} mode on port ${port}`, SUCCESS);
});

// --- Graceful Shutdown ---
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', { Error: err });
    httpServer.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM signal (from Docker, Kubernetes, etc.)
process.on('SIGTERM', () => {
    logger.message('👋 SIGTERM RECEIVED. Shutting down gracefully.', WARN);
    httpServer.close(() => {
        logger.message('💥 Process terminated.', ERROR);
    });
});

export { io };