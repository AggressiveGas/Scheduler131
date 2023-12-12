const asynchandler = require('express-async-handler')
const Availability = require('../models/availabilitymodel2');
const User = require('../models/usermodel');
const Room = require('../models/roommodel')

// Wrap the function within asyncHandler
const getAvailability = asynchandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch the availability data from the database based on userId
    const availabilities = await Availability.find({user: userId});

    // Check if availability data exists
    if (!availabilities) {
        res.status(404);
        throw new Error('Availability not found');
    }

    // Send the availability data as a response
    res.status(200).json(availabilities);
});

const createAvailability = asynchandler(async (req, res) => {
    
    const {day, intervals} = req.body; // date and time intervals
    const user = req.user._id; // user id

    const availabilityExists = await Availability.findOne({day: day, user: user});

    if(availabilityExists){
        const updatedAvailability = await Availability.findOneAndUpdate({day: day, user: user}, {$addToSet: {intervals: {"start": intervals[0].start, "end": intervals[0].end}}}, { // updates the availability data
            new: true,
            runValidators: true
        })
        res.status(200).json({updatedAvailability});
    }

    // Creating availability
    else {
        const availability = await Availability.create({
        user: user,
        day: day,
        intervals: intervals
    });

    if (!availability) {
        res.status(400);
        throw new Error('Availability not able to be created');
    }

   // console.log(req.body) // for testing purposes
    res.status(200).json({ availability });
    }
});

const updateAvailability = asynchandler(async (req, res) => {

    const user_id = req.user._id;
    const availability_id = req.params.availabilityId;

    const user = await User.findById(user_id);  // Find the user
    if (!user) {    // Check if user exists
        res.status(404);
        throw new Error('User not found');  // Throw an error if user does not exist
    }

    const availability = await Availability.findById(availability_id);  // Find the availability
    if(!availability){    // Check if availabilityId exists
        res.status(404);
        throw new Error('Availability not found');  // Throw an error if availabilityId does not exist
    }

    const { day, intervals } = req.body;

    // Creating availability
    const updatedAvailability = await Availability.findByIdAndUpdate(availability_id, {
        day: day,
        intervals: intervals,
        user: user
    });

    if (!updatedAvailability) {
        res.status(400);
        throw new Error('Availability not able to be created');
    }

    res.status(200).json({ updatedAvailability });
});

const deleteAvailability = asynchandler(async (req, res) => {

    const availability = await Availability.findById(req.params.availabilityId);  // Find the availability
    if(!availability){    // Check if availabilityId exists
        res.status(404);
        throw new Error('Availability not found');  // Throw an error if availabilityId does not exist
    }
    
    const user = await User.findById(req.user._id);  // Find the user
    if (!user) {    // Check if user exists
        res.status(404);
        throw new Error('User not found');  // Throw an error if user does not exist
    }

    if (availability.user.toString() !== user._id.toString()) {  // Check if the availability belongs to the user
        res.status(401);
        throw new Error('Not authorized');  // Throw an error if the availability does not belong to the user
    }

    const deletedavailability = await Availability.findByIdAndDelete(req.params.availabilityId);  // Delete the availability

    res.status(200).json({deletedavailability});

});

module.exports = {getAvailability, createAvailability, updateAvailability, deleteAvailability};