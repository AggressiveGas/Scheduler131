const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')
const Room = require('../models/roommodel')
const mongoose = require('mongoose')

// @desc Create a new room
// @route POST /api/rooms
// @access Public 
const createRoom = asyncHandler(async (req, res) => {
    const {name} = req.body    // gets the name of the room from the body
    
    if(!name){   // checks if the field is empty
        res.status(400)                 // if it is, throw an error status 400
        throw new Error('Please enter a room name')
    }

    //generates unique room code
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let tempcode = ''
    genloop: do {
        tempcode = generateCode(alphabet)

        roomExists = await Room.findOne({joincode: tempcode})
        if(roomExists) continue genloop    // if a room with this joincode already exists, generate a new code

    } while (0)

    const room = await Room.create({    // creates the room
        name,
        joincode: tempcode,
        administrator: req.user._id
    })

    if(room){   // if the room is created, send the user data back
        res.status(201).json({
            name: room.name,
            joincode: room.joincode,
            administrator: room.administrator
        })
    } else {    // if the room is not created, throw an error at status 400
        res.status(400)
        throw new Error('Invalid room data')
    }
})

//generates room code
function generateCode(alphabet) {
    code = ''

    //adds random uppercase or lowercase letter one at a time to the room code until it is 6 characters long
    for(let i = 0; i < 6; i++) {
        code += alphabet[Math.floor(Math.random() * alphabet.length)]
    }

    return code
}

module.exports = {  // export the functions
    createRoom,
}   