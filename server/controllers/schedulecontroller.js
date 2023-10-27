const User = require('../models/usermodel')
const { token } = require('morgan')
const asyncHandler = require('express-async-handler')

const TOTAL_INTERVALS = 24 * 6

// Defining an async function to handle creating a schedule.
const createSchedule = asyncHandler(async (req, res) => {
    const { user_id } = req.body; // Extract user_id from the request body.
    const user = await User.findById(user_id); // Find the user in the database using the provided user_id.

    if (user) { // Check if the user exists.
        const schedule = []; // Initialize an empty schedule array.

        // Populate the schedule with false values, assuming false indicates unavailability.
        for (let i = 0; i < TOTAL_INTERVALS; i++) {
            schedule.push(false);
        }

        user.availability = schedule; // Assign the created schedule to the user.
        await user.save(); // Save the updated user object to the database.

        // Send a successful response along with the created schedule.
        res.status(201).json({
            schedule: user.availability
        });
    } else {
        // If the user doesn't exist, send a 404 error response.
        res.status(404);
        throw new Error('User not found');
    }
});

const updateSchedule = asyncHandler(async (req, res) => {
    const { user_id, schedule } = req.body; // get the user id and schedule from the request body
    const user = await User.findById(user_id); // find the user in the database
  
    if (user) {
      user.availability = schedule; // update the user's schedule
      await user.save(); // save the user
      res.status(200).json({ schedule: user.availability }); // send the updated schedule in the response
    } else {
      res.status(404); // if the user is not found, throw an error at status 404
      throw new Error('User not found');
    }
  });


const getSchedules = asyncHandler(async (req, res) => {

    const {availability} = await User.findById(req.params.id) // gets the user data from the database

    res.status(200).json({ // sends the user data back
        availability: availability,
    })
})

// Defining an async function to handle resetting a user's schedule.
const resetSchedule = asyncHandler(async (req, res) => {
    const { user_id } = req.body; // Extract user_id from the request body.
    const user = await User.findById(user_id); // Find the user in the database using the provided user_id.

    if (user) { // Check if the user exists.
        // Reset all slots in the schedule to false, assuming false indicates unavailability.
        user.availability = Array(TOTAL_INTERVALS).fill(false);

        await user.save(); // Save the updated user object to the database.

        // Send a successful response along with the reset schedule.
        res.status(200).json({
            message: 'Schedule reset successfully',
            schedule: user.availability
        });
    } else {
        // If the user doesn't exist, send a 404 error response.
        res.status(404);
        throw new Error('User not found');
    }
});






  module.exports = { // export the functions
    createSchedule,
    updateSchedule,
    getSchedules,
    resetSchedule,


}
