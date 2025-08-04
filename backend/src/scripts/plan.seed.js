import dotenv from 'dotenv';
import Plan from '../models/plan.model.js';
import {
    plans
} from '../data/plans.data.js';
import connectDB from '../config/db.js';

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        await Plan.deleteMany();
        console.log('Cleared existing plans...');

        await Plan.insertMany(plans);
        console.log('Successfully imported all plans!');
        process.exit();
    } catch (error) {
        console.error(`Error during seeding: ${error}`);
        process.exit(1);
    }
};

importData();