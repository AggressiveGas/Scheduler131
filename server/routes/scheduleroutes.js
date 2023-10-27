// Purpose: To handle routing for the schedule page
const express = require('express')
const router = express.Router()
const { /*import the functions*/} = require('../controllers/schedulecontroller') // import the functions from the controller

// create routes
router.post('/:id/availability', /*createSchedule*/) // this is the route for creating a schedule

// read routes
router.get('/:id/availability', /*getSchedule*/)    // this is the route for getting a schedule

// update routes
router.put('/:id/availability', /*updateSchedule*/)   // this is the route for updating a schedule

// delete routes
router.delete('/:id', /*deleteSchedule*/)   // this is the route for deleting a schedule







module.exports = router; // export the router