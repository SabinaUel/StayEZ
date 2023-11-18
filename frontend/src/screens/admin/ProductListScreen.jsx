import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetHotelsQuery,
  useDeleteHotelMutation,
  useCreateHotelMutation,
} from '../../slices/hotelsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetHotelsQuery({
    pageNumber,
  });
  const navigate = useNavigate();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteHotelMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createHotel, { isLoading: loadingCreate }] =
    useCreateHotelMutation();

  const createHotelHandler = async () => {
    // if (window.confirm('Are you sure you want to create a new hotel room?')) {
    //   try {
    //     await createHotel();
    //     refetch();
    //   } catch (err) {
    //     toast.error(err?.data?.message || err.error);
    //   }
    // }
    navigate('/admin/hotel/add');
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Hotels</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createHotelHandler} style={{backgroundColor:'rgb(27, 84, 101)'}}>
            <FaPlus /> Create Hotel Rooms
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          
        
          <Table striped bordered hover responsive className='table-sm'>
            <thead>

              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>ADDRESS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td>{hotel._id}</td>
                  <td>{hotel.name}</td>
                  <td>${hotel.price}</td>
                  <td>{hotel.address}</td>
              
                  <td>
                    <LinkContainer to={`/admin/hotel/${hotel._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(hotel._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
