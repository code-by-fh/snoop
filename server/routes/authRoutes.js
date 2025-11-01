import express from 'express';
import { login, signup, me, requestPasswordReset, resetPassword, activateAccount } from '../controllers/authController.js';
import selfRegistrationMiddleware from '../middleware/selfRegistrationMiddleware.js';

const router = express.Router();

router.get('/me', me);
router.post('/login', login);
router.post('/signup', selfRegistrationMiddleware, signup);
router.post('/password/reset', selfRegistrationMiddleware, requestPasswordReset);
router.post('/password/reset/:token', selfRegistrationMiddleware, resetPassword);
router.post('/activate-account', selfRegistrationMiddleware, activateAccount);

export default router;
