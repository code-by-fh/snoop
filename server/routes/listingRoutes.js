import express from 'express';
import {
  deleteListing,
  getListings,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.delete('/:id', deleteListing);

export default router;
