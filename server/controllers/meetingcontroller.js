const asyncHandler = require('express-async-handler')
const Room = require('../models/roommodel')
const Meeting = require('../models/meetingmodel')
const mongoose = require('mongoose')

// @desc Create a new meeting
// @route POST /api/rooms/joincode/meetings
// @access Private
const createMeeting = asyncHandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode})
    if(!room){      //Checks if param joincode is an existing room
        res.status(400)
        throw new Error('Invalid room code')
    }
    
    const meeting = await Meeting.create({    // creates the meeting
        roomcode: req.params.joincode,
        time: req.body.time
    })

    if(meeting){   // if the meeting is created, send the meeting data back
        res.status(201).json({
            roomcode: meeting.roomcode,
            time: meeting.time
        })
    } else {    // if the room is not created, throw an error at status 400
        res.status(400)
        throw new Error('Invalid meeting data')
    }
})

module.exports = {  // export the functions
    createMeeting, 
}   