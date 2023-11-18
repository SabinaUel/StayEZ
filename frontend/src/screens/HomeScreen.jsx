import { Row, Col } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { useGetHotelsQuery } from '../slices/hotelsApiSlice';
import { Link } from 'react-router-dom';
import Hotel from '../components/Hotel';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword,longitude,latitude,radius } = useParams();

  const { data, isLoading, error } = useGetHotelsQuery({
    keyword,
    pageNumber,
    longitude,latitude,radius
  });

console.log('data',data)
  return (
    <>
      {/* {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )} */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
  
          <Row>
            {data.hotels ? ( // Add a conditional check here
              data.hotels.map((hotel) => (
                <Col key={hotel._id} sm={12} md={6} lg={4} xl={3}>
                  <Hotel hotel={hotel} />
                </Col>
              ))
            ) : (
              // Render a message or component when data.hotels is undefined
              <Message variant='info'>No hotels found.</Message>
            )}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
       
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;

