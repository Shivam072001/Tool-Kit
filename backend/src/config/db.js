// backend-gateway/src/config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | 🟡 connecting...');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | 🟢 connected successfully.');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | 🔵 reconnected.');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | 🔴 disconnected.');
        });
        mongoose.connection.on('error', (error) => {
            console.error('MongoDB | ❌ connection error:', error);
        });

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error('MongoDB | ❌ Initial connection failed:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;