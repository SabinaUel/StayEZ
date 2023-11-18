// import { useState,useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
 import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
// import {
//   Row,
//   Col,
//   Image,
//   ListGroup,
//   Card,
//   Button,
//   Form,
// } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import {
//   useGetHotelDetailsQuery,
//   useCreateReviewMutation,
// } from '../slices/hotelsApiSlice';
// import {
// useCreateBookingMutation,
// useGetPaypalClientIdQuery,
// useUpdateBookingToPaidMutation,
// } from '../slices/bookingApiSlice';
// import Rating from '../components/Rating';
// import Loader from '../components/Loader';
// import Message from '../components/Message';
// import Meta from '../components/Meta';
// import { addToCart } from '../slices/cartSlice';

// const HotelScreen = () => {
//   const { id: hotelId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [qty, setQty] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [checkInDate, setCheckInDate] = useState(''); // Add date state
//   const [checkOutDate, setCheckOutDate] = useState(''); // Add date state
//   const [numGuests, setNumGuests] = useState(1);
//   const [roomType, setRoomType] = useState('Standard'); // Add room type state
//   const [totalPrice,setTotalPrice]=useState(0)
//   const [createBooking] = useCreateBookingMutation();




// // Function to calculate the number of nights between two dates
// const calculateNumberOfNights = (check_in, check_out) => {
//   const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
//   const startDate = new Date(check_in);
//   const endDate = new Date(check_out);
//   return Math.round(Math.abs((startDate - endDate) / oneDay));
// };
//   const updateTotalPrice = () => {
//     // Calculate the base price based on the selected room type
//     let basePrice = 0;
//     if (roomType === 'Standard') {
//       basePrice = 100; // Replace with the actual base price for Standard room
//     } else if (roomType === 'Deluxe') {
//       basePrice = 150; // Replace with the actual base price for Deluxe room
//     } else if (roomType === 'Suite') {
//       basePrice = 200; // Replace with the actual base price for Suite
//     }

//     // Calculate the number of nights based on check-in and check-out dates
//     const numberOfNights = calculateNumberOfNights(checkInDate, checkOutDate);

//     // Calculate the total price
//     const calculatedTotalPrice = basePrice * numberOfNights * numGuests;
//     setTotalPrice(calculatedTotalPrice);
//   };

//   useEffect(() => {
//     // Update the total price whenever check-in date, checkout date, or room type changes
//     if (checkInDate && checkOutDate) {
//       updateTotalPrice();
//     }
//   }, [checkInDate, checkOutDate, roomType]);
//   const addToCartHandler = () => {
//     dispatch(addToCart({ ...hotel, qty }));
//     navigate('/cart');
//   };

  
//   const bookingHandler = async () => {
//     try {
//       const res = await createBooking({
//         hotel:hotelId,
//         roomType:'deluxe',
//         check_in:checkInDate,
//         check_out:checkOutDate,
//         num_guests:numGuests,
   
//       }).unwrap();
//       // dispatch(clearCartItems());
//       navigate(`/booking/${res._id}`);
//       console.log('Booking Data:', res.totalPrice);

//       // For now, let's assume the booking is successful and show a success message
//       // toast.success('Booking successful');
//     } catch (err) {
//       toast.error(err);
//     }
//   };


//   const [updateBookingToPaid, { isLoading: loadingPay }] = useUpdateBookingToPaidMutation();
//   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
//   const {
//     data: paypal,
//     isLoading: loadingPayPal,
//     error: errorPayPal,
//   } = useGetPaypalClientIdQuery();

//   useEffect(() => {
//     if (!errorPayPal && !loadingPayPal && paypal.clientId) {
//       const loadPaypalScript = async () => {
//         paypalDispatch({
//           type: 'resetOptions',
//           value: {
//             'client-id': paypal.clientId,
//             currency: 'USD',
//           },
//         });
//         paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
//       };
     
//         if (!window.paypal) {
//           loadPaypalScript();
//         }
      
//     }
//   }, [errorPayPal, loadingPayPal, paypal, paypalDispatch]);

//   const {
//     data: hotel,
//     isLoading,
//     refetch,
//     error,
//   } = useGetHotelDetailsQuery(hotelId);

//   const { userInfo } = useSelector((state) => state.auth);

//   const [createReview, { isLoading: loadingHotelReview }] =
//     useCreateReviewMutation();

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       await createReview({
//         hotelId,
//         rating,
//         comment,
//       }).unwrap();
//       refetch();
//       // toast.success('Review created successfully');
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };



//   return (
//     <>
//       <Link className='btn btn-light my-3' to='/'>
//         Go Back
//       </Link>
//       {isLoading ? (
//         <Loader />
//       ) : error ? (
//         <Message variant='danger'>
//           {error?.data?.message || error.error}
//         </Message>
//       ) : (
//         <>
//           <Meta title={hotel.name} description={hotel.description} />
//           <Row>
//             <Col md={6}>
//               <Image src={hotel.image} alt={hotel.name} fluid />
//             </Col>
//             <Col md={6}>
//               <ListGroup variant='flush'>
//                 <ListGroup.Item>
//                   <h3>{hotel.name}</h3>
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <Rating
//                     value={hotel.rating}
//                     text={`${hotel.numReviews} reviews`}
//                   />
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   Description: {hotel.description}
//                 </ListGroup.Item>
//               </ListGroup>
//               <Form>
//                 <Form.Group controlId='checkInDate'>
//                   <Form.Label>Check-In Date</Form.Label>
//                   <Form.Control
//                     type='date'
//                     value={checkInDate}
//                     onChange={(e) => setCheckInDate(e.target.value)}
//                   />
//                 </Form.Group>
//                 <Form.Group controlId='checkOutDate'>
//                   <Form.Label>Check-Out Date</Form.Label>
//                   <Form.Control
//                     type='date'
//                     value={checkOutDate}
//                     onChange={(e) => setCheckOutDate(e.target.value)}
//                   />
//                 </Form.Group>
//                 <Form.Group controlId='numGuests'>
//                   <Form.Label>Number of Guests</Form.Label>
//                   <Form.Control
//                     type='number'
//                     value={numGuests}
//                     onChange={(e) => setNumGuests(e.target.value)}
//                   />
//                 </Form.Group>
//                 <Form.Group controlId='roomType'>
//                   <Form.Label>Select Room Type</Form.Label>
//                   <Form.Control
//                     as='select'
//                     value={roomType}
//                     onChange={(e) => setRoomType(e.target.value)}
//                   >
//                     <option value='Standard'>Standard</option>
//                     <option value='Deluxe'>Deluxe</option>
//                     <option value='Suite'>Suite</option>
//                   </Form.Control>
//                 </Form.Group>
             
//                 <Card style={{ width: '18rem', marginTop: '20px' }}>
//               <Card.Body>
//                 <Card.Title>Total Price</Card.Title>
//                 <Card.Text>
//                   ${totalPrice.toFixed(2)}
//                 </Card.Text>
//                 <Button
//                   className='btn-block'
//                   type='button'
//                   onClick={bookingHandler}
//                   style={{ marginTop: '10px' }}
//                 >
//                   Pay Now To Book
//                 </Button>
//               </Card.Body>
//             </Card>

//               </Form>
//             </Col>
//           </Row>
//           {/* ... Rest of the code remains the same */}
//         </>
//       )}
//     </>
//   );
// };

// export default HotelScreen;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Container,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetHotelDetailsQuery,
  useCreateReviewMutation,
} from '../slices/hotelsApiSlice';
import {
  useCreateBookingMutation,
  useGetPaypalClientIdQuery,
  useUpdateBookingToPaidMutation,
} from '../slices/bookingApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWifi,
  faSwimmingPool,
  faParking,
} from '@fortawesome/free-solid-svg-icons';
const HotelScreen = () => {
  const { id: hotelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numGuests, setNumGuests] = useState(1);
  const [roomType, setRoomType] = useState('Standard');
  const [totalPrice, setTotalPrice] = useState(0);
  const [createBooking] = useCreateBookingMutation();
  const {
    data: hotel,
    isLoading,
    refetch,
    error,
  } = useGetHotelDetailsQuery(hotelId);


  const updateTotalPrice = () => {
    let basePrice = hotel.price||0;
    if (roomType === 'Standard') {
      basePrice = hotel.price;
    } else if (roomType === 'Deluxe') {
      basePrice = hotel.price+50
    } else if (roomType === 'Suite') {
      basePrice = hotel.price+100;
    }

    const numberOfNights = calculateNumberOfNights(checkInDate, checkOutDate);

    const calculatedTotalPrice = basePrice * numberOfNights * numGuests;
    setTotalPrice(calculatedTotalPrice);
  };

  const calculateNumberOfNights = (check_in, check_out) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(check_in);
    const endDate = new Date(check_out);
    return Math.round(Math.abs((startDate - endDate) / oneDay));
  };

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      updateTotalPrice();
    }
  }, [checkInDate, checkOutDate, roomType]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...hotel, qty }));
    navigate('/cart');
  };

  const bookingHandler = async () => {
    try {
      const res = await createBooking({
        hotel: hotelId,
        roomType: roomType,
        check_in: checkInDate,
        check_out: checkOutDate,
        num_guests: numGuests,
        totalPrice:totalPrice
      }).unwrap();
      navigate(`/booking/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      if (!window.paypal) {
        loadPaypalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, paypal, paypalDispatch]);



  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingHotelReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        hotelId,
        rating,
        comment,
      }).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={hotel.name} description={hotel.description} />
          <Row>
            <Col md={6}>
              <Image src={hotel.image} alt={hotel.name} fluid />
              <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h3>{hotel.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        value={hotel.rating}
                        text={`${hotel.numReviews} reviews`}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p> {hotel.description}</p>
                      <h6>Facilities:</h6>
            
              <p>
                <FontAwesomeIcon icon={faWifi} /> WiFi
              </p>
         
           
              <p>
                <FontAwesomeIcon icon={faSwimmingPool} /> Swimming Pool
              </p>
          
        
              <p>
                <FontAwesomeIcon icon={faParking} /> Parking
              </p>
         
                    </ListGroup.Item>
                    
                  </ListGroup>
            </Col>
            <Col md={6}>
              <Row>
                <Col>
                 
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form>
                    <Form.Group controlId='checkInDate'>
                      <Form.Label>Check-In Date</Form.Label>
                      <Form.Control
                        type='date'
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='checkOutDate'>
                      <Form.Label>Check-Out Date</Form.Label>
                      <Form.Control
                        type='date'
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='numGuests'>
                      <Form.Label>Number of Guests</Form.Label>
                      <Form.Control
                        type='number'
                        value={numGuests}
                        onChange={(e) => setNumGuests(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='roomType'>
                      <Form.Label>Select Room Type</Form.Label>
                      <Form.Control
                        as='select'
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                      >
                        <option value='Standard'>Standard</option>
                        <option value='Deluxe'>Deluxe</option>
                        <option value='Suite'>Suite</option>
                      </Form.Control>
                    </Form.Group>
                    <Card style={{ marginTop: '20px' }}>
    <Card.Body>
      <Card.Title>Total Price: ${totalPrice.toFixed(2)}</Card.Title>
      <Card.Text>
       
      </Card.Text>
    
    </Card.Body>
  </Card>
                    <Button
                      className='btn-block'
                      type='button'
                      onClick={bookingHandler}
                      style={{backgroundColor:'rgb(27, 84, 101)',marginTop:'10px'}}
                  
                    >
                      Pay Now To Book
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default HotelScreen;


