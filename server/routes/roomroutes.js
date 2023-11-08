const express = require('express')
const router = express.Router()

const {createRoom, getAllRooms, updateRoomInfo, getUsers, getARoom, addUser, deleteRoom, removeUser} = require('../controllers/roomcontroller') // import the functions from the controller
const {protect} = require('../middlewares/authmiddleware')  // import the middleware



// create routes
router.post('/',protect,createRoom) // this is the route for creating a room
router.post('/:joincode/users',protect,addUser) //this is the route for adding a user to the userlist

//read routes
router.get('/',getAllRooms)
router.get('/:joincode',getARoom)
router.get('/:joincode/users',getUsers)

//update routes
router.put('/:joincode',protect,updateRoomInfo)

//delete routes
router.delete('/:joincode',protect,deleteRoom)
router.delete('/:joincode/users',protect,removeUser)

module.exports = router; // export the router