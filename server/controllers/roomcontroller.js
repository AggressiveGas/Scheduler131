const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')
const Room = require('../models/roommodel')
const mongoose = require('mongoose')

// @desc Create a new room
// @route POST /api/rooms
// @access Private
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

        let roomExists = await Room.findOne({joincode: tempcode})
        if(roomExists) continue genloop    // if a room with this joincode already exists, generate a new code

    } while (0)

    const room = await Room.create({    // creates the room
        name,
        joincode: tempcode,
        administrator: req.user._id,
        userlist: [req.user._id]
    })

    if(room){   // if the room is created, send the user data back
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {$addToSet: {roomlist: tempcode}}, { // updates the roomlist of the user who created the room
            new: true,
            runValidators: true
        })

        res.status(201).json({
            name: room.name,
            joincode: room.joincode,
            administrator: room.administrator,
            userlist: room.userlist
        })
    } else {    // if the room is not created, throw an error at status 400
        res.status(400)
        throw new Error('Invalid room data')
    }
})

// @desc Gets all room data
// @route GET /api/rooms
// @access Public
const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find({})   // gets all room data from the database
    res.status(200).json({rooms})   // sends the user data back
})

// @desc Gets specific room data
// @route GET /api/rooms/joincode
// @access Public
const getARoom = asyncHandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode})   // gets all room data from the database
    if(!room){
        res.status(404)
        throw new Error('Room not found')
    }
    res.status(200).json(room)   // sends the room data back
})

// @desc Gets all users that are in the room
// @route GET /api/rooms/joincode/users
// @access Public
const getUsers = asyncHandler(async (req, res) => {
    const {userlist} = await Room.findOne({joincode: req.params.joincode}) //grabs the userlist for the given room
    
    let tmplist = []
    for(i=0;i<userlist.length;i++){     //converts stored user ids into correlating user objects
        let tmpusr = await User.findById(userlist[i])
        tmplist.push(tmpusr)
    }

    res.status(200).json(tmplist) 
})

// @desc Create a new room
// @route PUT /api/rooms/joincode
// @access Private
const updateRoomInfo = asyncHandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode}) // gets the room data from the database
    
    if(!room){  // if the room does not exist, throw an error at status 400
        res.status(404)
        throw new Error('Room not found')
    }
    
    if(!req.user._id.equals(room.administrator)){   //checks if user sending request is room admin
        res.status(401) //unauthorized
        throw new Error('User is not authorized to perform this action')
    }

    const updatedRoom = await Room.findOneAndUpdate({joincode: req.params.joincode}, req.body, { // updates the user data
        new: true,
        runValidators: true
    })
    
    res.status(200).json({updatedRoom}) // sends the updated user data back
})

// @desc Add a user to the room; updates room's userlist and user's roomlist
// @route POST /api/rooms/joincode/users
// @access Private
const addUser = asyncHandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode}) // gets the room data from the database
    
    if(!room){  // if the room does not exist, throw an error at status 400
        res.status(404)
        throw new Error('Please enter a valid roomcode')
    }
    
    const updatedRoom = await Room.findOneAndUpdate({joincode: req.params.joincode}, {$addToSet: {userlist: req.user._id}}, { // updates the user data
        new: true,
        runValidators: true
    })

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {$addToSet: {roomlist: req.params.joincode}}, {
        new: true,
        runValidators: true
    })

    res.status(200).json({updatedRoom})
})

// @desc Create a new room
// @route DELETE /api/rooms/joincode/users
// @access Private
const removeUser = asyncHandler(async (req, res) => {
    const {administrator} = await Room.findOne({joincode: req.params.joincode})  //gets the room's userlist

    if(!administrator){
        res.status(404)
        throw new Error('Room not found')
    }

    if(req.user._id.equals(administrator)){
        res.status(400)
        throw new Error('The administrator cannot leave the room')
    }

    const updatedRoom = await Room.findOneAndUpdate({joincode: req.params.joincode}, {$pull: {userlist: req.user._id}}, { // updates the user data
        new: true,
        runValidators: true
    })

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {$pull: {roomlist: req.params.joincode}}, {
        new: true,
        runValidators: true
    })

    res.status(200).json({updatedRoom})
})

// @desc Create a new room
// @route DELETE /api/rooms/joincode
// @access Private
const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode}) // gets the room data from the database
    
    if(!room){  // if the room does not exist, throw an error at status 400
        res.status(404)
        throw new Error('Room not found')
    }
    
    if(!req.user._id.equals(room.administrator)){   //checks if user sending request is room admin
        res.status(401) //unauthorized
        throw new Error('User is not authorized to perform this action')
    }

    for(i=0;i<(room.userlist).length;i++){      //removes the room id from member users' roomlists to prepare for deletion
        const updatedUser = await User.findByIdAndUpdate(room.userlist[i], {$pull: {roomlist: req.params.joincode}}, {
            new: true,
            runValidators: true
        })
    }

    const deletedRoom = await Room.findOneAndDelete({joincode: req.params.joincode})
    
    res.status(200).json({deletedRoom}) // sends the deleted room info back
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
    createRoom, getAllRooms, updateRoomInfo, getARoom, getUsers, addUser, deleteRoom, removeUser,
}   