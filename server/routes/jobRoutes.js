import express from 'express';
import {
  createJob,
  deleteJob,
  execute,
  getJobById,
  getJobs,
  updateJob
} from '../controllers/jobController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import demoMiddleware from '../middleware/demoMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createJob);
router.get('/', authMiddleware, getJobs);
router.get('/:id', authMiddleware, getJobById);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', demoMiddleware, authMiddleware, deleteJob);
router.post('/:id/execute', authMiddleware, execute);

export default router;
