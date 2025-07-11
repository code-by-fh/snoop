import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authMiddleware from './middleware/authMiddleware.js';
import { errorHandler } from "./middleware/errorHandler.js";
import Settings from "./models/Settings.js";
import { startRuntime } from './services/runtime/scheduler.js';
import logger from './utils/logger.js';
import { requestLogger } from './middleware/requestLogger.js';
import { initDatabase } from './seed/init.js'

// Import routes
import adminSettingsRoutes from './routes/adminSettingsRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import notificationAdapterRoutes from './routes/notificationAdapterRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((err) => logger.error('MongoDB connection error:', err));

if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

await initDatabase();

const settings = await Settings.findOne({})
  .then((settings) => settings.toJSON())
  .catch((err) => {
    console.error('Error fetching settings:', err);
    return null;
  });

await startRuntime(settings);

const app = express();

// Middleware
app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', authMiddleware, jobRoutes);
app.use('/api/notificationAdapters', notificationAdapterRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/listings', authMiddleware, listingRoutes);
app.use('/api/statistics', authMiddleware, statsRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);

app.use(errorHandler);

const PORT = settings.port || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
