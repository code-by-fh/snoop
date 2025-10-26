import express from 'express';
import {
  createListing,
  deleteListing,
  getListings,
} from '../controllers/listingController.js';

const router = express.Router();

router.post('/', createListing);
router.get('/', getListings);
router.delete('/:id', deleteListing);

export default router;
