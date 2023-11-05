import express from 'express';
const router = express.Router();
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  createHotelReview,
  getTopHotels,
} from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getHotels).post(protect, admin, createHotel);
router.route('/:id/reviews').post(protect, checkObjectId, createHotelReview);
router.get('/top', getTopHotels);
router
  .route('/:id')
  .get(checkObjectId, getHotelById)
  .put(protect, admin, checkObjectId, updateHotel)
  .delete(protect, admin, checkObjectId, deleteHotel);

export default router;
