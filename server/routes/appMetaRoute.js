import express from 'express';
import { getAppMetaData } from '../controllers/appMetaDataController.js';

const router = express.Router();

router.get('/', getAppMetaData);

export default router;
