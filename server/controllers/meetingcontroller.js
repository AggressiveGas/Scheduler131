const asyncHandler = require('express-async-handler')
const Room = require('../models/roommodel')
const Meeting = require('../models/meetingmodel')
const mongoose = require('mongoose')

// @desc Create a new meeting
// @route POST /api/meetings/:joincode
// @access Public
const createMeeting = asyncHandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode})
    if(!room){      //Checks if param joincode is an existing room
        res.status(400)
        throw new Error('Invalid room code')
    }

    const {day, start, end} = req.body;

    if(!day || !start || !end || start > end){
        res.status(400)
        throw new Error('Invalid meeting time')
    }
    
    const meeting = await Meeting.create({    // creates the meeting
        roomcode: req.params.joincode,
        day: day,
        start: start,
        end: end
    })

    if(meeting){   // if the meeting is created, send the meeting data back
        res.status(201).json({
            roomcode: meeting.roomcode,
            day: meeting.day,
            start: meeting.start,
            end: meeting.end
        })
    } else {    // if the room is not created, throw an error at status 400
        res.status(400)
        throw new Error('Invalid meeting data')
    }
})

// @desc Get existing meetings for a room
// @route GET /api/meetings/:joincode
// @access Public
const getMeetings = asyncHandler(async (req, res) => {
    const meetings = await Meeting.find({roomcode: req.params.joincode})

    if(!meetings){
        res.status(404)
        throw new Error('No rooms found')
    }

    res.status(200).json({meetings})
})

// @desc Edit a single existing meeting
// @route PUT /api/meetings/:id
// @access Public
const editMeetingTime = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id)

    if(!meeting){  // if the meeting does not exist, throw an error at status 404
        res.status(404)
        throw new Error('Meeting not found')
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { // updates the meeting time
        new: true,
        runValidators: true
    })
    
    res.status(200).json(updatedMeeting) // sends the updated meeting data back
})

// @desc Delete a meeting
// @route DELETE /api/meetings/:id
// @access Public
const deleteMeeting = asyncHandler(async (req, res) => {
    const meeting = await Meeting.findById(req.params.id)   //meeting object id in request

    if(!meeting){  // if the meeting does not exist, throw an error at status 404
        res.status(404)
        throw new Error('Meeting not found')
    }

    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id) // deletes the user data

    res.status(200).json({deletedMeeting}).select('_id') // sends the deleted user id back

})

module.exports = {  // export the functions
    createMeeting, deleteMeeting, getMeetings, editMeetingTime
}   