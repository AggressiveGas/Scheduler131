const asynchandler = require('express-async-handler')
const Availability = require('../models/availabilitymodel');
const User = require('../models/usermodel');



// Wrap the function within asyncHandler
const getAvailability = asynchandler(async (req, res) => {
    const userId = req.params.id;

    // Fetch the availability data from the database based on userId
    const availability = await Availability.find({ user: userId });

    // Check if availability data exists
    if (!availability) {
        res.status(404);
        throw new Error('Availability not found');
    }

    // Send the availability data as a response
    res.status(200).json(availability);
});



const createAvailability = asynchandler(async (req, res) => {
    
    const { label, weeklyAvailability } = req.body; // label and weeklyAvailability
    const user = req.params.id; // user id

    const trimmedLabel = label.trim();  // Trim the label
    const capitalizedLabel = trimmedLabel.charAt(0).toUpperCase() + trimmedLabel.slice(1);  // Capitalize the first letter of the label

    // Check if each 'intervals' in 'weeklyAvailability' is an array
    weeklyAvailability.forEach(availability => {
        if (!Array.isArray(availability.intervals)) {
            res.status(400);
            throw new Error('Intervals must be an array');
        }
    });

    // Creating availability
    const availability = await Availability.create({
        label: capitalizedLabel,
        weeklyAvailability: weeklyAvailability,
        user: user
    });

    console.log(req.body);
    res.status(200).json({ availability });
});

const updateAvailability = asynchandler(async (req, res) => {

    const user_id = req.params.userid;
    const availability_id = req.params.availabilityId;

    
    const user = await User.findById(user_id);  // Find the user
    if (!user) {    // Check if user exists
        res.status(401);
        throw new Error('User not found');  // Throw an error if user does not exist
    }

    const availability = await Availability.findById(availability_id);  // Find the availability
    if(!availability){    // Check if availabilityId exists
        res.status(400);
        throw new Error('Availability not found');  // Throw an error if availabilityId does not exist
    }

    const { label, weeklyAvailability } = req.body;

    const trimmedLabel = label.trim();  // Trim the label
    const capitalizedLabel = trimmedLabel.charAt(0).toUpperCase() + trimmedLabel.slice(1);  // Capitalize the first letter of the label

    // Check if each 'intervals' in 'weeklyAvailability' is an array
    weeklyAvailability.forEach(availability => {
        if (!Array.isArray(availability.intervals)) {
            res.status(400);
            throw new Error('Intervals must be an array');
        }
    });

    // Creating availability
    const updatedAvailability = await Availability.findByIdAndUpdate(availability_id, {
        label: capitalizedLabel,
        weeklyAvailability: weeklyAvailability,
        user: user
    });
    
    

    res.status(200).json({ updatedAvailability });

});

const deleteAvailability = asynchandler(async (req, res) => {

    const availability = await Availability.findById(req.params.availabilityId);  // Find the availability
    if(!availability){    // Check if availabilityId exists
        res.status(400);
        throw new Error('Availability not found');  // Throw an error if availabilityId does not exist
    }
    
    const user = await User.findById(req.params.userid);  // Find the user
    if (!user) {    // Check if user exists
        res.status(401);
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
