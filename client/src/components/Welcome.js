import React from 'react';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import axios from 'axios';

//to delete a user from the database
const handleDeleteUser = async () => {
    try {
        const response = await axios.delete("http://localhost:8080/api/user/(PutID)"); //use real ID in (), get from mongoDB --I dont have access to the DB as of rn
        console.log("User has been deleted");
    } catch (error) {
        console.error("Error deleting user: ", error);
    }
};


const Welcome = () => {
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
                sx={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}
            >
                Delete User
            </Button>
        </div>
    );
}

export default Welcome;