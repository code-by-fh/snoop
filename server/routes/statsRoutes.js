import express from 'express';
import { getDashboardStats, getJobStats } from '../controllers/statsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware,getDashboardStats);
router.get('/jobs/:id',authMiddleware, getJobStats);

export default router;
