import mongoose from 'mongoose';
import { logger } from '../utils/Logger.js';
import { LEVELS } from '../constants/index.js';

const { SUCCESS, INFO, WARN, ERROR } = LEVELS

const connectDB = async () => {
    try {
        mongoose.connection.on('connecting', () => {
            logger.message('MongoDB | 🟡 connecting...', WARN);
        });
        mongoose.connection.on('connected', () => {
            logger.message('MongoDB | 🟢 connected successfully.', SUCCESS);
        });
        mongoose.connection.on('reconnected', () => {
            logger.message('MongoDB | 🔵 reconnected.', INFO);
        });
        mongoose.connection.on('disconnected', () => {
            logger.message('MongoDB | 🔴 disconnected.', ERROR);
        });
        mongoose.connection.on('error', (error) => {
            logger.message('MongoDB | ❌ connection error:', ERROR);
        });

        await mongoose.connect(process.env.MONGO_URI, {});
    } catch (error) {
        logger.error('MongoDB | ❌ Initial connection failed:', { 'Error': error });
        process.exit(1);
    }
};

export default connectDB;