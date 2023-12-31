import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetBookingsQuery } from '../../slices/bookingApiSlice';

const BookingListScreen = () => {
  const { data: bookings, isLoading, error } = useGetBookingsQuery();

  return (
    <>
      <h1>Bookings</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bBookinged hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>CANCELLED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.user && booking.user.name}</td>
                <td>{booking.createdAt.substring(0, 10)}</td>
                <td>${booking.totalPrice}</td>
                <td>
                  {booking.isPaid ? (
                    booking.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
             
                <td>
                {booking.isCancelled ? (
                    booking.cancelledAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default BookingListScreen;
