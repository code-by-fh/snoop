import express from 'express';
import { getDashboardStats, getJobStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getDashboardStats);
router.get('/jobs/:id', getJobStats);

export default router;
