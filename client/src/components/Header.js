import React, { useState } from "react";
import { AppBar, Box, Tabs, Tab, Toolbar, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const Header = () => {
    const [value, setValue] = useState();

    return (
        <div>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h3">
                        Scheduler131
                        <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: '#00FF00' }} // Apply a bright green color
                        >
                            (Not official UI; basic layout just so we can work on front-end back-end calls)
                        </Typography>
                    </Typography>
                    <Box sx={{ marginLeft: "auto" }}>
                        <Tabs indicatorColor="secondary"
                            onChange={(e, val) => setValue(val)}
                            value={value}
                            textColor="inherit">
                            <Tab to="/login" LinkComponent={Link} label="Login" />
                            <Tab to="/register" LinkComponent={Link} label="Register" />
                        </Tabs>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header;
