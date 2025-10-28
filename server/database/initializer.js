import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Settings from '#models/Settings.js';
import User from '#models/User.js';
import logger from '#utils/logger.js';
import { seedDatabase } from './seed/index.js';
import { adminUser } from './seed/users.js';

export const initDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('❌ MONGODB_URI is not set');

        await mongoose.connect(uri);
        logger.info('✅ MongoDB connected successfully');
        logger.info(`Connected to DB: ${mongoose.connection.db.databaseName}`);

        if (process.env.NODE_ENV !== 'production' && process.env.MONGO_DB_DEBUG === 'true') {
            mongoose.set('debug', true);
            logger.info('🪶 Mongoose debug mode enabled');
        }

        if (process.env.IS_DEMO === 'true') {
            const collections = await mongoose.connection.db.collections();
            for (const c of collections) {
                await c.deleteMany({});
            }
            logger.warn('⚠️ All collections cleared for demo mode purposes');
            await seedDatabase();
            logger.info('🌱 Database seeding completed');
        } else {
            const userCount = await User.countDocuments();
            if (userCount === 0) {
                await User.create(adminUser);
                logger.info('👑 Default admin user created.');
            }
        }

        const settingsCount = await Settings.countDocuments();
        if (settingsCount === 0) {
            await Settings.create({});
            logger.info('⚙️ Default settings created.');
        }

        const settings = await Settings.findOne({});
        return settings?.toJSON() ?? {};
    } catch (err) {
        logger.error('❌ Database initialization error:', err);
        throw err;
    }
};
