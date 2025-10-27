import logger from '#utils/logger.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from './index.js';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
await mongoose.connection.asPromise();
await mongoose.connection.dropDatabase();
logger.info('✅ MongoDB connected successfully');
await seedDatabase();
mongoose.connection.close();
logger.info('👌 Database Connection closed.');