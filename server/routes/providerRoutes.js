import express from 'express';
import {
  getProviders
} from '../controllers/providerController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',authMiddleware, asyncHandler(getProviders));

export default router;
