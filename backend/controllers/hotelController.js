import asyncHandler from '../middleware/asyncHandler.js';
import Hotel from '../models/hotelModel.js';

const getHotels = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          {
            address: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            city: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            postcode: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  let geolocationQuery = {};
  if (req.query.latitude && req.query.longitude && req.query.radius) {
    const { latitude, longitude, radius } = req.query;
    geolocationQuery = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            radius / 3963.2, // Radius in miles
          ],
        },
      },
    };
  }

  const count = await Hotel.countDocuments({ ...keyword, ...geolocationQuery });
  const hotels = await Hotel.find({ ...keyword, ...geolocationQuery })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ hotels, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single Hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const hotel = await Hotel.findById(req.params.id);
  if (hotel) {
    return res.json(hotel);
  } else {
    // NOTE: this will run if a valid ObjectId but no Hotel was found
    // i.e. Hotel may be null
    res.status(404);
    throw new Error('Hotel not found');
  }
});

// @desc    Create a Hotel
// @route   POST /api/Hotels
// @access  Private/Admin
const createHotel = asyncHandler(async (req, res) => {
  const hotel = new Hotel({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    address: 'London',
    image: '/images/sample.jpg',
    numReviews: 0,
    description: 'Sample description',
    numRooms: 10,
  });

  const createdHotel = await hotel.save();
  res.status(201).json(createdHotel);
});

// @desc    Update a Hotel
// @route   PUT /api/Hotels/:id
// @access  Private/Admin
const updateHotel = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    address,
    postcode,
    city,
    country,
    numRooms,
    contact_no,
  } = req.body;

  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    hotel.name = name;
    hotel.price = price;
    hotel.description = description;
    hotel.image = image;
    hotel.address = address;
    hotel.postcode = postcode;
    hotel.city = city;
    hotel.country = country;
    hotel.numRooms = numRooms;
    hotel.contact_no = contact_no;

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

// @desc    Delete a Hotel
// @route   DELETE /api/Hotels/:id
// @access  Private/Admin
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    await hotel.deleteOne({ _id: hotel._id });
    res.json({ message: 'Hotel removed' });
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

// @desc    Create new review
// @route   POST /api/Hotels/:id/reviews
// @access  Private
const createHotelReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    const alreadyReviewed = hotel.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Hotel already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    hotel.reviews.push(review);

    hotel.numReviews = hotel.reviews.length;

    hotel.rating =
      hotel.reviews.reduce((acc, item) => item.rating + acc, 0) /
      hotel.reviews.length;

    await hotel.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

// @desc    Get top rated Hotels
// @route   GET /api/Hotels/top
// @access  Public
const getTopHotels = asyncHandler(async (req, res) => {
  hotel;
  res.json(hotel);
});

// @desc    Fetch all Hotels
// @route   GET /api/hotels/search
// @access  Public
const getHotelsByLocation = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  console.log('req query', req.query);

  // Check if geolocation parameters are provided in the request
  if (req.query.latitude && req.query.longitude && req.query.radius) {
    try {
      const { latitude, longitude, radius } = req.query;

      // Use Mongoose to find hotels within the specified radius of the geolocation
      const hotels = await Hotel.find({
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(longitude), parseFloat(latitude)],
              radius / 3963.2,
            ], // Radius in miles
          },
        },
      });
      console.log('hotels', hotels);

      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    // If geolocation parameters are not provided, perform the regular search
    const count = await Hotel.countDocuments({ ...keyword });
    const hotels = await Hotel.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ hotels, page, pages: Math.ceil(count / pageSize) });
  }
});

// ...
export {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  createHotelReview,
  getTopHotels,
  getHotelsByLocation,
};
