import { Row, Col } from 'react-bootstrap';
import Hotel from '../components/Hotel';
import hotels from '../hotels';

const HomeScreen = () => {
  return (
    <>
      <h1>Latest hotels</h1>
      <Row>
        {hotels.map((hotel) => (
          <Col key={hotel._id} sm={12} md={6} lg={4} xl={3}>
            <Hotel hotel={hotel} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;