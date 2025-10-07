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
import { requestLogger } from './middleware/requestLogger.js';
import { initDatabase } from './seed/init.js'
import logger from '#utils/logger.js';

// Import routes
import adminSettingsRoutes from './routes/adminSettingsRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import notificationAdapterRoutes from './routes/notificationAdapterRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import healthRouter from "./routes/healthRouter.js";
import { setupSocketServer } from './services/socket/socketServer.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((err) => logger.error('MongoDB connection error:', err));

if (process.env.NODE_ENV !== 'production' && process.env.MONGO_DB_DEBUG === 'true') {
  mongoose.set('debug', true);
}

await initDatabase();
await setupSocketServer();

const settings = await Settings.findOne({})
  .then((settings) => settings.toJSON())
  .catch((err) => {
    logger.error('Error fetching settings:', err);
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
app.use('/api/me', userRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use("/health", healthRouter);

app.use(errorHandler);

const PORT = settings.port || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;