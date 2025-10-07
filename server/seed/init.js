import dotenv from 'dotenv';
import { adminUser } from './users.js';
import logger from "../utils/logger.js";

import Settings from '../models/Settings.js';
import User from '../models/User.js';

dotenv.config();

export const initDatabase = async () => {
    if (await Settings.countDocuments() === 0) {
        await Settings.create({});
        logger.info('Default settings created.');
    }
    if (await User.countDocuments() === 0) {
        await User.create(adminUser);
        logger.info('Default admin user created.');
    }
}