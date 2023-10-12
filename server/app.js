//import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const {errorHandler} = require('./middlewares/errormiddleware');
const connectDB = require('./config/db');
// app
const app = express();
connectDB();

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("DB Connected")).catch(err => console.log('DB CONNECTION ERROR',err));

// middleware
app.use(morgan("dev"));
app.use(cors({origin:true, credentials:true}));
app.use(express.json()); //req.body allows us to access the body of the request or else it comes through as undefined
app.use(express.urlencoded({extended: true})); //req.body its to allow text to be encoded into the url


// routes

 
app.use('/api/goals', require('./routes/goalroutes'));
app.use('/api/users', require('./routes/userroutes'));


// error handler

app.use(errorHandler); // this error handler work idk why. its supposed to make it so i dont get errors in html but idk by: @AggressiveGas  
// FIXME(@AggressiveGas): i dont comprehend how to fix this error handler if anyone can fix please! it makes it hard to bug fix the api with big ass html error responces


// port

const port = process.env.PORT || 8080;

// listen

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});