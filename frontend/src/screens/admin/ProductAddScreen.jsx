

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateHotelMutation, useUploadHotelImageMutation } from '../../slices/hotelsApiSlice';

const ProductAddScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [createHotel, { isLoading: loadingCreate }] = useCreateHotelMutation();
  const [uploadHotelImage, { isLoading: loadingUpload }] = useUploadHotelImageMutation();
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Create the hotel
      const createdHotel = await createHotel({
        name,
        price,
        image,
        address,
        description,
        numRooms: 10, // You might need to adjust this based on your data structure
      }).unwrap();
      
      // Display success message
      toast.success('Hotel added successfully');

      // Redirect to the hotel list page or the edited hotel details page
      navigate(`/admin/hotellist`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      // Upload the hotel image
      const res = await uploadHotelImage(formData).unwrap();
      
      // Display success message
      toast.success(res.message);
      
      // Set the image URL in the state
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/hotellist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Hotel</h1>
        {loadingCreate && <Loader />}
        <Form onSubmit={submitHandler}>
          {/* ... (Rest of the form fields, similar to ProductEditScreen) */}

          <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>

            

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>


          <Button
            type='submit'
            variant='primary'
            style={{ marginTop: '1rem' }}
          >
            Add
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductAddScreen;
