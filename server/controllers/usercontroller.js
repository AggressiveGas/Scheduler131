const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')
const Room = require('../models/roommodel')
const { token } = require('morgan')


// @desc Register user
// @route POST /api/user
// @access Public 
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body    // gets the name, email, and password from the body

    if(!name || !email || !password){   // checks if the fields are empty
        res.status(400)                 // if they are, throw an error at status 400
        throw new Error('Please enter all fields')
    }

    // looks for user email in database and stores it in userExists
    const userExists = await User.findOne({email})

    if(userExists){ // if the user exists, throw an error at status 400
        res.status(400)
        throw new Error('User already exists')
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10) // you have to generate a salt to hash the password
    const hashedPassword = await bcrypt.hash(password, salt) // this generates the password using the salt generated above. Takes the plain text pass and salt to gen the hash

    const user = await User.create({    // creates the user
        name,
        email,
        password: hashedPassword,
        roomlist: []
    })

    if(user){   // if the user is created, send the user data back
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            roomlist: user.roomlist,
            token: generateToken(user._id)
        })
    } else {    // if the user is not created, throw an error at status 400
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc login user
// @route POST /api/users
// @access Public 
const loginUser = asyncHandler(async (req, res) => {
    // gets email and password from the body
    const {email, password} = req.body

    // checks for the user email in the database
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){    // if the user exists and the password matches, send the user data back
        
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true, // Makes the token accessible only via HTTP
            secure: process.env.NODE_ENV === 'production', // Set this to true in production to secure the cookie
            maxAge: 30 , // Token expires in 30 days (adjust as needed)
        });
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            roomlist: user.roomlist,
            token: generateToken(user._id)
            })
        } else {    // if the user does not exist or the password does not match, throw an error at status 401
            res.status(401)
            throw new Error('Invalid credentials')
        }
})

// @desc get specific user data
// @route GET /api/user/:id
// @access public 
const getMe = asyncHandler(async (req, res) => {

    const {_id, name, email, roomlist} = await User.findById(req.params.id) // gets the user data from the database

    res.status(200).json({ // sends the user data back
        id: _id,
        name: name,
        email: email,
        roomlist: roomlist
    })

    

})

// @desc update user data
// @route PUT /api/user/:id
// @access private 
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id) // gets the user data from the database
    
    if(!user){  // if the user does not exist, throw an error at status 400
        res.status(400)
        throw new Error('user not found')
    }

    const salt = await bcrypt.genSalt(10) // you have to generate a salt to hash the password
    
    // Hash the password if it's included in the request body
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, salt) // this generates the password using the salt generated above. Takes the plain text pass and salt to gen the hash
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { // updates the user data
        new: true,
        runValidators: true
    })
    
    res.status(200).json({updatedUser}) // sends the updated user data back
})

// @desc Gets all rooms a specific user is in
// @route GET /api/user/userid/rooms
// @access Private
const getUserRooms = asyncHandler(async (req, res) => {
    const {roomlist} = await User.findById(req.params.id) //grabs the userlist for the given room
    
    let tmplist = []
    for(i=0;i<roomlist.length;i++){     //converts stored user ids into correlating user objects
        let tmprm = await Room.findOne({joincode: roomlist[i]})
        tmplist.push(tmprm)
    }

    res.status(200).json(tmplist)
})

// @desc get all user data
// @route GET /api/user/
// @access public 
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})//.select('_id name email')  // gets the selected user data from the database
     // note: -_id removes the id from the response
    res.status(200).json({users})   // sends the user data back
})

// @desc get delete user data
// @route GET /api/user/:id
// @access private 
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id) // gets the user data from the database

    if(!user){  // if the user does not exist, throw an error at status 400
        res.status(404)
        throw new Error('User not found')
    }

    if(!user._id.equals(req.user._id)){
        res.status(401)
        throw new Error('Not authorized to delete this user')
    }

    for(let i=0;i<(user.roomlist).length; i++){     //removes traces of the user in roooms that they were in
        const tmprm = await Room.findOne({joincode: user.roomlist[i]})
        if(!tmprm){
            break
        }
        
        if(tmprm.administrator.equals(user._id)){   //if the user that is to be deleted is the creator of any rooms, these rooms will be deleted
            for(let j=0;j<(tmprm.userlist).length;j++){      //removes the room id from member users' roomlists to prepare for deletion
                const updatedUser = await User.findByIdAndUpdate(tmprm.userlist[i], {$pull: {roomlist: tmprm.joincode}}, {
                    new: true,
                    runValidators: true
                })
            }
        
            const deletedRoom = await Room.findOneAndDelete({joincode: tmprm.joincode})
            i--
        } else {
            const updatedRoom = await Room.findOneAndUpdate({joincode: user.roomlist[i]}, {$pull: {userlist: user._id}}, {  //removes stale references of the to be deleted user from rooms they are in
                new: true,
                runValidators: true
            })
        }
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id) // deletes the user data

    res.status(200).json({deletedUser}).select('_id') // sends the deleted user id back

})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {  // export the functions
    registerUser,
    loginUser,
    getMe,
    updateUser,
    getUsers,
    deleteUser,
    getUserRooms,
}   