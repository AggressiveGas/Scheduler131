import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    // Manages input
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    // Function to handle input changes
    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Function to send a login request to the server using post
    const sendRequest = async () => {
        try {
            const res = await axios.post("http://localhost:8080/api/user/login", {
                email: inputs.email,
                password: inputs.password,
            });
            const data = res.data;
            localStorage.setItem('authToken', data.token);  // Store the token in localStorage

            return data;
        } catch (error) {
            throw new Error(error);
        }
    };

    // Function to handle a login
    const handleSuccessfulLogin = async (userId, token) => {
        localStorage.setItem('authToken', token); // Saves the authentication token to local storage
        navigate(`/welcome/${userId}`);
    };

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);

        try {
            const data = await sendRequest();
            // Passes the user's ID and token to the /welcome page when logging in
            handleSuccessfulLogin(data._id, data.token);
        } catch (error) {
            console.error(error);
        }
    };

    // Layout & formatting for the login form (Basically the text inputs and buttons)
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
                    <Typography variant="h2" style={{ fontSize: '25px' }}>Login to Account</Typography>
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
                        name="password"
                        onChange={handleChange}
                        type="password"
                        value={inputs.password}
                        variant="outlined"
                        placeholder="Password"
                        margin="normal"
                        style={{ backgroundColor: 'white' }}
                    />
                    <Button variant="contained" type="submit">Login</Button>
                </Box>
            </form>
        </div>
    );
};

export default Login;
