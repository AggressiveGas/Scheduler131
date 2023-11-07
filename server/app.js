//import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const {errorHandler} = require('./middlewares/errormiddleware');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');


// app
const app = express();
connectDB();


//cookie parser
app.use(cookieParser());

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
app.use('/api/goals', require('./routes/goalroutes'));  // this is the route for the goals
app.use('/api/user', require('./routes/userroutes'));  // this is the route for the users
app.use('/api/rooms', require('./routes/roomroutes'));  // this is the route for the rooms

app.use('/api/user', require('./routes/availabilityroutes'));


// error handler
app.use(errorHandler); // cleans up errors so they dont show up in big html file

// port
const port = process.env.PORT || 8080; // this is the port that the server will run on

// listen

const server = app.listen(port, () => {     // this is the function that will run when the server is started
    console.log(`Server is running on port ${port}`);
});