const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')
const { token } = require('morgan')


// @desc Register user
// @route POST /api/users
// @access Public 
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please enter all fields')
    }

    //check if the user already exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10) // you have to generate a salt to hash the password
    const hashedPassword = await bcrypt.hash(password, salt) // this generates the password using the salt generated above. Takes the plain text pass and salt to gen the hash

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
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

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
            })
        } else {
            res.status(401)
            throw new Error('Invalid credentials')
        }
})

// @desc get user data
// @route GET /api/users/me
// @access private 
const getMe = asyncHandler(async (req, res) => {

    const {_id, name, email} = await User.findById(req.user._id)

    res.status(200).json({
        id: _id,
        name: name,
        email: email
    })

})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}   