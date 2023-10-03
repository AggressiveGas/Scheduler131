//import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// app
const app = express();



// db


// middleware
app.use(morgan("dev"));
app.use(cors({origin:true, credentials:true}));



// routes

// port

const port = process.env.PORT || 8080;

// listen

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});