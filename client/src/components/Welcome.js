import React from 'react';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";

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
        </div>
    );
}

export default Welcome;
