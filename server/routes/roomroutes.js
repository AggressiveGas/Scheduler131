const express = require('express')
const router = express.Router()

const {createRoom} = require('../controllers/roomcontroller') // import the functions from the controller
const {protect} = require('../middlewares/authmiddleware')  // import the middleware



// create routes
router.post('/',protect,createRoom) // this is the route for creating a room






module.exports = router; // export the router