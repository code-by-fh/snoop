import express from 'express';
import { getSettings, putSettings } from '../controllers/adminSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getSettings);
router.put('/', authMiddleware, putSettings);


export default router;
