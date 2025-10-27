import express from 'express';
import {
  getAvailableNotificationAdapters,
  sendTestNotification
} from '../controllers/notificationAdapterController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import demoMiddleware from '../middleware/demoMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAvailableNotificationAdapters);
router.post('/:adapterId/test', demoMiddleware, authMiddleware, sendTestNotification);

export default router;
