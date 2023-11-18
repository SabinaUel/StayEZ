import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Enter Location'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
  // import React, { useState, useEffect } from 'react';
  // import { Form, Button } from 'react-bootstrap';
  // import { useNavigate } from 'react-router-dom';

  // const SearchBox = () => {
  //   const navigate = useNavigate();
  //   const [location, setLocation] = useState('');
  //   const [latitude, setLatitude] = useState(null);
  //   const [longitude, setLongitude] = useState(null);

  //   useEffect(() => {
  //     // Get the user's geolocation when the component mounts
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition((position) => {
  //         console.log('position',position)
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude);
  //       });
  //     }
  //   }, []);

  //   const submitHandler = (e) => {
  //     e.preventDefault();
  //     if (latitude&& longitude) {
  //       navigate(`/search?latitude=${latitude}&longitude=${longitude}&radius=10`); // Modify the radius as needed
  //     } else {
  //       navigate('/');
  //     }
  //   };

  //   return (
  //     <Form onSubmit={submitHandler} className='d-flex'>
  //       <Form.Control
  //         type='text'
  //         name='location'
  //         value={location}
  //         onChange={(e) => setLocation(e.target.value)}
  //         placeholder='Enter location...'
  //         className='mr-sm-2 ml-sm-5'
  //       ></Form.Control>
  //       <Button type='submit' variant='outline-success' className='p-2 mx-2'>
  //         Search 
  //       </Button>
  //     </Form>
  //   );
  // };

  // export default SearchBox;
