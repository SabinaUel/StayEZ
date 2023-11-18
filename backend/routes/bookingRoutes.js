import express from 'express';
const router = express.Router();
import {
  addBookingItems,
  getMyBookings,
  getBookingById,
  updateBookingToPaid,
  getBookings,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Create a new booking
router.route('/').post(protect, addBookingItems);

// Get bookings for the logged-in user
router.route('/mybookings').get(protect, getMyBookings);

// Get a specific booking by ID
router.route('/:id').get(protect, getBookingById);

// Update a booking to mark it as paid
router.route('/:id/pay').put(protect, updateBookingToPaid);

// Get all bookings (for admin access)
router.route('/').get(protect, admin, getBookings);
router.route('/:id/cancel').put(protect, cancelBooking);
export default router;
