import dotenv from 'dotenv';
dotenv.config();

import Settings from '#models/Settings.js';
import User from '#models/User.js';
import logger from '#utils/logger.js';
import mongoose from 'mongoose';
import { seedDatabase } from './seed/index.js';
import { adminUser } from './seed/users.js';

export const initDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await mongoose.connection.asPromise();
        logger.info('✅ MongoDB connected successfully');

        if (process.env.NODE_ENV !== 'production' && process.env.MONGO_DB_DEBUG === 'true') {
            mongoose.set('debug', true);
            logger.info('🪶 Mongoose debug mode enabled');
        }

        if (process.env.IS_DEMO === 'true') {
            await mongoose.connection.dropDatabase();
            logger.warn('⚠️ Database dropped for demo mode purposes');
            await seedDatabase();
            logger.info('🌱 Database seeding completed');
        } else {
            if (await User.countDocuments() === 0) {
                await User.create(adminUser);
                logger.info('👑 Default admin user created.');
            }
        }

        if (await Settings.countDocuments() === 0) {
            await Settings.create({});
            logger.info('Default settings created.');
        }

        const settings = await Settings.findOne({});
        return settings.toJSON();
    } catch (err) {
        logger.error(err, '❌ Database initialization error:');
        process.exit(1);
    }
};
