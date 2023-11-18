import asyncHandler from '../middleware/asyncHandler.js';
import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
import Hotel from '../models/hotelModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

const calculateTotalPrice = (roomPrice, check_in, check_out) => {
  // Calculate the number of nights
  const numberOfNights = calculateNumberOfNights(check_in, check_out);

  // Multiply room price by the number of nights
  return roomPrice * numberOfNights;
};

// Function to calculate the number of nights between two dates
const calculateNumberOfNights = (check_in, check_out) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const startDate = new Date(check_in);
  const endDate = new Date(check_out);
  return Math.round(Math.abs((startDate - endDate) / oneDay));
};

// @desc    Create new Booking
// @route   POST /api/bookings
// @access  Private

const addBookingItems = asyncHandler(async (req, res) => {
  try {
    const {
      room,
      hotel,
      check_in,
      check_out,
      num_guests,
      special_requirements,
      paymentMethod,
      paymentResult,
      totalPrice,
    } = req.body;

    // Check room availability
    // const selectedRoom = await Room.findById(room);
    // if (!selectedRoom || !selectedRoom.availability) {
    //   return res.status(400).json({ error: 'Selected room is not available.' });
    // }

    // Calculate total price based on room price and duration
    // const { price } = selectedRoom;

    // Create a new booking
    const booking = new Booking({
      room,
      hotel,
      user: req.user._id,
      check_in,
      check_out,
      num_guests,
      special_requirements,
      paymentMethod,
      paymentResult,
      totalPrice,
      isPaid: false,
    });

    const savedBooking = await booking.save();

    // Update room availability
    // selectedRoom.availability = false;
    // await selectedRoom.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while booking the room.' });
  }
});

// @desc    Get logged in user Bookings
// @route   GET /api/Bookings/myBookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id });
  res.json(bookings);
});

// @desc    Get Booking by ID
// @route   GET /api/Bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (booking) {
    res.json(booking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Update Booking to paid
// @route   PUT /api/Bookings/:id/pay
// @access  Private
const updateBookingToPaid = asyncHandler(async (req, res) => {
  // NOTE: here we need to verify the payment was made to PayPal before marking
  // the Booking as paid
  // const { verified, value } = await verifyPayPalPayment(req.body.id);
  // if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  // const isNewTransaction = await checkIfNewTransaction(Booking, req.body.id);
  // if (!isNewTransaction) throw new Error('Transaction has been used before');
  console.log('helloooo');
  const booking = await Booking.findById(req.params.id);
  console.log('booking', booking);
  if (booking) {
    // check the correct amount was paid
    // const paidCorrectAmount = booking.totalPrice.toString() === value;
    // if (!paidCorrectAmount) throw new Error('Incorrect amount paid');
    console.log('booking2', booking);

    booking.isPaid = true;
    booking.paidAt = Date.now();
    // booking.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   email_address: req.body.payer.email_address,
    // };

    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Get all Bookings
// @route   GET /api/Bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).populate('user', 'id name');
  res.json(bookings);
});

// @desc    cancel booking
// @route   PUT /api/bookings/cancel
// @access  public/Admin
const cancelBooking = asyncHandler(async (req, res) => {
  try {
    // Fetch the booking from the database
    const booking = await Booking.findById(req.params.id);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking is already canceled
    if (booking.isCancelled) {
      return res.status(400).json({ message: 'Booking is already canceled' });
    }

    // Update the booking status to canceled
    booking.isCancelled = true;
    booking.cancelledAt = Date.now();

    // Save the updated booking to the database
    await booking.save();

    // Respond with success message
    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export {
  addBookingItems,
  getMyBookings,
  getBookingById,
  updateBookingToPaid,
  getBookings,
  cancelBooking,
};
