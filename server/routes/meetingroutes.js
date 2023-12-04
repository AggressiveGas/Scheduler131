const express = require('express')
const router = express.Router()

const {createMeeting, deleteMeeting, getMeetings, editMeetingTime} = require('../controllers/meetingcontroller') // import the functions from the controller
const {protect} = require('../middlewares/authmiddleware')  // import the middleware



// create routes
router.post('/:joincode',createMeeting) // this is the route for creating a meeting

//read routes
router.get('/:joincode',getMeetings) // reading all meetings for a room

//update routes
router.put('/:id',editMeetingTime) //update a meeting's timeslot

//delete routes
router.delete('/:id',deleteMeeting)   //deleting meeting

module.exports = router; // export the router