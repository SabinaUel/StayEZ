import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { FaPhoneAlt } from "react-icons/fa";


 // Import the phone icon

const Hotel = ({ hotel }) => {
  const handlePhoneClick = () => {
    // Use window.location.href to open the phone app
    window.location.href = `tel:${hotel.contact_no}`;
  }
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/hotel/${hotel._id}`}>
        <Card.Img src={hotel.image} variant='top' className='hotel-image' />
      </Link>

      <Card.Body>
        <Link to={`/hotel/${hotel._id}`} className='hotel-link'>
          <Card.Title as='div' className='hotel-title'>
            <strong>{hotel.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='hotel-rating'>
          <Rating value={hotel.rating} text={`${hotel.numReviews} reviews`} />
        </Card.Text>
        <Card.Text as='div' className='hotel-contact' onClick={handlePhoneClick} style={{ cursor: 'pointer' }}>
          <FaPhoneAlt className='mobile-icon' />
          <span className='contact-number' style={{marginLeft:'3px'}}>{hotel.contact_no}</span>
        </Card.Text>

        <Card.Text as='div' className='hotel-address'>
          {hotel.address}
        </Card.Text>

        <Card.Text as='div' className='hotel-price'>
          Starting from :
          <strong></strong> ${hotel.price} per Night
        </Card.Text>

        <Link to={`/hotel/${hotel._id}`} >
          <Button variant='primary' className='btn-sm view-details-link' style={{backgroundColor:'rgb(27, 84, 101)'}} >
            View Details
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Hotel;
