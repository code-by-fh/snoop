import express from 'express';
import {
   registerViewRedirect,
    registerView
} from '../controllers/trackingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/listing', registerViewRedirect);
router.get('/listing/:id', authMiddleware, registerView);

export default router;
