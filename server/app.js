//import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

//app

const app = express();

//middleware

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: true, credentials: true}));

//routes

//port
const port = process.env.PORT || 8000;

//listerner 

const server = app.listen(port, () => {console.log(`Server is running on port ${port}`)});
