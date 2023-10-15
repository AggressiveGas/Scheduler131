//imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate(); // useNavigate provides navigation functionality
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/user/register", {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      const data = res.data;
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    //send http request
    try {
      const data = await sendRequest();
      // Navigate to '/login' after successful registration
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '305px 20px', backgroundColor: '#E0E0E8' }}>
      <form onSubmit={handleSubmit}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          width={300}
          display="flex"
          flexDirection={'column'}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h2" style={{ fontSize: '25px' }}>Register Account</Typography>
          <TextField
            name="email"
            onChange={handleChange}
            type={'email'}
            value={inputs.email}
            variant="outlined"
            placeholder="Email"
            margin="normal"
            style={{ backgroundColor: 'white' }}
          />
          <TextField
            name="name"
            onChange={handleChange}
            value={inputs.name}
            variant="outlined"
            placeholder="User Name"
            margin="normal"
            style={{ backgroundColor: 'white' }}
          />
          <TextField
            name="password"
            onChange={handleChange}
            type="password"
            value={inputs.password}
            variant="outlined"
            placeholder="Password"
            margin="normal"
            style={{ backgroundColor: 'white' }}
          />
          <Button variant="contained" type="submit">Register</Button>
        </Box>
      </form>
    </div>
  );
};

export default Signup;
