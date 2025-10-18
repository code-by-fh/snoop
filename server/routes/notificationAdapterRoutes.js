import express from 'express';
import { 
  getAvailableNotificationAdapters,
  sendTestNotification
} from '../controllers/notificationAdapterController.js';

const router = express.Router();

router.get('/', getAvailableNotificationAdapters);
router.post('/:adapterId/test', sendTestNotification);

export default router;
