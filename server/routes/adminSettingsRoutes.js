import express from 'express';
import { getSettings, putSettings } from '../controllers/adminSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getSettings);
router.put('/', authMiddleware, adminMiddleware, putSettings);


export default router;
