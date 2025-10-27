import dotenv from 'dotenv';
dotenv.config();

import logger from '#utils/logger.js';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { initDatabase } from './database/initializer.js';
import authMiddleware from './middleware/authMiddleware.js';
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from './middleware/requestLogger.js';
import { startRuntime } from './services/runtime/scheduler.js';
import { initTracking } from './tracking/index.js';

// Import routes
import adminSettingsRoutes from './routes/adminSettingsRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import authRoutes from './routes/authRoutes.js';
import favoritesRoutes from './routes/favoriteRoutes.js';
import healthRouter from "./routes/healthRouter.js";
import jobRoutes from './routes/jobRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import notificationAdapterRoutes from './routes/notificationAdapterRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { setupSocketServer } from './socketServer.js';

const settings = await initDatabase();

await startRuntime(settings);
initTracking(process.env.API_BASE_URL || `http://localhost:${settings.port}`);

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
app.use('/api/track', trackingRoutes);
app.use('/api/favorites', authMiddleware, favoritesRoutes);
app.use('/api/statistics', authMiddleware, statsRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/me', userRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use("/health", healthRouter);

app.use(errorHandler);

const PORT = settings.port || 5000;

const server = http.createServer(app);
const io = setupSocketServer(server);
server.listen(PORT, () => {
  logger.info(`HTTP + Socket.IO server running on port ${PORT} (WebSocket path: /ws)`);
});

export default app;