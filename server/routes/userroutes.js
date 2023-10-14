const express = require('express')
const router = express.Router()

const {registerUser,loginUser,getMe,updateUser, getUsers,deleteUser} = require('../controllers/usercontroller') // import the functions from the controller
const {protect} = require('../middlewares/authmiddleware')  // import the middleware



// create routes
router.post('/', registerUser) // this is the route for creating a user
router.post('/login', loginUser)    // this is the route for logging in a user
router.post('/register', registerUser)  // this is the route for registering a user

// read routes
router.get('/:id',getMe)    // this is the route for getting a user
router.get('/',getUsers)    // this is the route for getting all users

// update routes
router.put('/:id',protect,updateUser)   // this is the route for updating a user

// delete routes
router.delete('/:id',protect, deleteUser)   // this is the route for deleting a user






module.exports = router // export the router