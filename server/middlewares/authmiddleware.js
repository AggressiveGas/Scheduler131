const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')

const { token } = require('morgan')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ // checking for the authorization header - MAKING SURE its a bearer token
        try {  // if so we go into this try catch block
            // get the token from the header
            token = req.headers.authorization.split(' ')[1]  // we assign the token to the token variable and split it at the space and get the second part of the array
            
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET) // decoding and verifying the token against the secret key we have in the .env file
            
            // get the user from the token
            req.user = await User.findById(decoded.id).select('-password') // getting the user id from the token by subtracting the password from the user object

            next()
        } catch (error) {   // if anything goes wrong we get an error
            console.error(error)
            res.status(401)
            throw new Error('Not authorized') 
        }
    }

    if(!token){ // error if there is no token
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})

module.exports = { protect }
