import React from 'react';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';

//functionality for DeleteUser Button (doesn't include token thing as of now)
const Welcome = () => {
    const { userId } = useParams();

    const handleDeleteUser = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/user/(userId)`); //put in userID within () --get ID from MongoDB, probably wont work due to protected and need tokens
            console.log("User has been deleted");
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    };

    const addavailability = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/user/(userId)`); //put in userID within () --get ID from MongoDB, probably wont work due to protected and need tokens
            console.log("Availability has been added");
        } catch (error) {
            console.error("Error: Unable to create availability", error);
        }
    };

    const editavailability = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/user/(userId)`); //put in userID within () --get ID from MongoDB, probably wont work due to protected and need tokens
            console.log("Availability has been edited");
        } catch (error) {
            console.error("Error: Unable to edit availability", error);
        }
    };

    const deleteavailability = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/user/(userId)`); //put in userID within () --get ID from MongoDB, probably wont work due to protected and need tokens
            console.log("Availability has been deleted");
        } catch (error) {
            console.error("Error: Unable to delete availability", error);
        }
    };

    //bellow are the Homepage Button and Delete Button
    return (
        <div style={{ padding: '100px 20px', backgroundColor: 'green' }}>
            <div>WELCOME USER</div>
            <Button
                component={Link}
                to="/"
                variant="outlined"
                color="primary"
                sx={{ backgroundColor: 'blue', color: 'white' }}
            >
                Return to Home
            </Button>
            <div></div>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleDeleteUser}
                sx={{ marginTop: '20px', marginRight:'60px', backgroundColor: 'red', color: 'white' }} 
            >
                Delete User
            </Button>
            <div>AVAILABILITY OPTIONS</div>
            <Button
                variant="outlined"
                color= "primary"
                onClick={addavailability}
                sx={{ backgroundColor: 'blue', color: 'white'}}


            >
                Add Availability
            </Button>

            
            <Button
                variant="outlined"
                color= "primary"
                onClick={editavailability}
                sx={{ backgroundColor: 'purple', color: 'white'}}


            >
                Edit Availability
            </Button>
            <Button
                variant="outlined"
                color= "primary"
                onClick={deleteavailability}
                sx={{ backgroundColor: 'cyan', color: 'white'}}
            >
                Delete Availability
            </Button>
        </div>
        
    );
    
};

export default Welcome;
