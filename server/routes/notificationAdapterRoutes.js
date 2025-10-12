import express from 'express';
import { 
  getAvailableNotificationAdapters
} from '../controllers/notificationAdapterController.js';

const router = express.Router();

router.get('/', getAvailableNotificationAdapters);

export default router;
