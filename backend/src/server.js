// backend-gateway/src/server.js

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { corsOptions } from './config/cors.js';
import mainRouter from './routes/index.js';
import { globalErrorHandler } from './controllers/error.controller.js';
import { config } from './config/env.js';

// Load environment variables
dotenv.config();

const { nodeEnv, port } = config;

// --- Initialize Express App ---
const app = express();
const httpServer = createServer(app);

// --- Initialize Socket.io ---
const io = new Server(httpServer, {
    cors: corsOptions
});

// --- Socket.io Connection Logic ---
io.on('connection', (socket) => {
    console.log('🔌 A user connected:', socket.id);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('🔥 A user disconnected:', socket.id);
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
app.use('/api', limiter); // Apply to all API routes

// 5. Body Parsers
app.use(express.json({ limit: '10kb' })); // Control request body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// --- Mount Routers ---
app.use('/', mainRouter);


// --- Global Error Handling ---
// This middleware must be last
app.use(globalErrorHandler);


// --- Start Server using httpServer ---
httpServer.listen(port, () => {
    console.log(`🚀 Server running in ${nodeEnv} mode on port ${port}`);
});

// --- Graceful Shutdown ---
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM signal (from Docker, Kubernetes, etc.)
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully.');
    server.close(() => {
        console.log('💥 Process terminated.');
    });
});

export { io };