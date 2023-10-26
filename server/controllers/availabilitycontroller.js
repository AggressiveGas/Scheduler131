const asynchandler = require('express-async-handler')
const Availability = require('../models/availabilitymodel');
const User = require('../models/usermodel');
const Goal = require('../models/goalmodel');

const getAvailability = asynchandler(async (req, res) => {
    const goals = await Goal.find({user: req.user._id})
    
    res.status(200).json({goals})
})

const createAvailability = asynchandler(async (req, res) => {
    
    const {label, WeeklyAvailability} = req.body
    const {user} = req.user._id

    if(!label || !WeeklyAvailability){
        res.status(400)
        throw new Error('text is required')
    }
    
    const availability = await Availability.create({
        userId: user,
        label: label,
        weeklyAvailability: WeeklyAvailability
    })

    console.log(req.body)
    res.status(200).json({availability})
})


module.exports = {getAvailability, createAvailability};

