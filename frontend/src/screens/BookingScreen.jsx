import { useEffect,useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetBookingDetailsQuery,
  useGetPaypalClientIdQuery,
  useUpdateBookingToPaidMutation,
} from '../slices/bookingApiSlice';

const BookingScreen = () => {
  const { id: bookingId } = useParams();

  const {
    data: booking,
    refetch,
    isLoading,
    error,
  } = useGetBookingDetailsQuery(bookingId);

  const [updateBookingToPaid, { isLoading: loadingPay }] = useUpdateBookingToPaidMutation();
  const [isPaidChanged, setIsPaidChanged] = useState(false);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
       await updateBookingToPaid(bookingId);
       setIsPaidChanged(true); // Set the state variable to trigger rerender

        toast.success('Booking is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();

  //   toast.success('Order is paid');
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: 100 },
          },
        ],
      })
      .then((bookingId) => {
        return bookingId;
      });
  }

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
      if (booking && !booking.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, booking, paypal, paypalDispatch,isPaidChanged]);


  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();

  //   toast.success('Order is paid');
  // }

  

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <h1>Booking {booking._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
          

            <ListGroup.Item>
            
              {isPaidChanged ? (
                <Message variant='success'>Paid  {booking.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Booking Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>${booking.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            
              
              {!booking.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      {/* <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApprove}
                      >
                        Test Pay Order
                      </Button> */}

                      <div>
                      <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BookingScreen;
