import express from 'express';
import { getSettings, putSettings } from '../controllers/adminSettingsController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import demoMiddleware from '../middleware/demoMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getSettings);
router.put('/', demoMiddleware, authMiddleware, adminMiddleware, putSettings);


export default router;
