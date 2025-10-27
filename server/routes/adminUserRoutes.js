import express from 'express';
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/adminUserController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import demoMiddleware from '../middleware/demoMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getUsers);
router.post('/', demoMiddleware, authMiddleware, adminMiddleware, createUser);
router.put('/:id', demoMiddleware, authMiddleware, adminMiddleware, updateUser);
router.delete('/:id', demoMiddleware, authMiddleware, adminMiddleware, deleteUser);


export default router;
