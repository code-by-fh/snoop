import cron from 'node-cron';
import { seedDatabase } from '../../database/seed/index.js';
import logger from '#utils/logger.js';
import mongoose from 'mongoose';


export function cleanupDemoAtMidnight() {
    cron.schedule('0 0 * * *', cleanup);
    logger.info('🌱 Demo cleanup cron job scheduled.');
}

async function cleanup() {
    logger.info('🌱 Cleaning up demo data at midnight...');
    const collections = await mongoose.connection.db.collections();
    for (const c of collections) {
        await mongoose.connection.db.dropCollection(c.collectionName).catch(() => { });
    }
    await seedDatabase();
    logger.info('🌱 Demo data cleaned up.');
}