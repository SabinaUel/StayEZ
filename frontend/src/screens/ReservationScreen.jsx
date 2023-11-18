import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Card, ListGroup as RBListGroup } from 'react-bootstrap';
import { useGetMyBookingsQuery } from '../slices/bookingApiSlice';
import Message from '../components/Message'
const ReservationScreen = () => {
  // Get the list of bookings
  const { data: bookings, isLoading, error } = useGetMyBookingsQuery();

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>My Bookings</h1>
        {bookings && bookings.length === 0 ? (
          <Message>
            Your booking is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <Card>
            <RBListGroup variant='flush'>
              {bookings &&
                bookings.map((item) => (
                  
                  <RBListGroup.Item key={item._id}>
                    <Card>
                      <Card.Body>
                        <p>{item._id}</p>
                        <Card.Text>
                          <p><strong>Total Price:</strong> {item.totalPrice}</p>
                          <p><strong>Check-in:</strong> {item.check_in}</p>
                          <p><strong>Check-out:</strong> {item.check_out}</p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </RBListGroup.Item>
                ))}
            </RBListGroup>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default ReservationScreen;
