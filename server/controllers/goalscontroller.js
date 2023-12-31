const asynchandler = require('express-async-handler')
const mongoose = require('mongoose')
const Goal = require('../models/goalmodel')
const User = require('../models/usermodel')

//@desc GetGoals 
//@route GET /api/goals
//@access Private
const getGoals = asynchandler(async (req, res) => {
    const goals = await Goal.find({user: req.user._id})
    
    res.status(200).json({goals})
})

//@desc SetGoals
//@route POST /api/goals
//@access Private
const setGoals =asynchandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('text is required')
    }
    
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user._id
    })

    console.log(req.body)
    res.status(200).json({goal})
})

//@desc UpdateGoal
//@route PUT /api/goals/:id
//@access Private
const updateGoal = asynchandler( async (req, res) => {
    const goal = await Goal.findById(req.params.id)


    if(!goal){
        res.status(400)
        throw new Error('goal not found')
    }
    

    const user = await User.findById(req.user._id)

    // check for user
    if(!user){
        res.status(401)
        throw new Error('user not found')
    }

    // make sure logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('not authorized')
    }

    const updatedgoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({updatedgoal})
})

//@desc DeleteGoal 
//@route DELETE /api/goals/:id
//@access Private
const deleteGoal = asynchandler( async (req, res) => {
    
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('goal not found')
    }

    const user = await User.findById(req.user._id)

    // check for user
    if(!user){
        res.status(401)
        throw new Error('user not found')
    }

    // make sure logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('not authorized')
    }

    
    const deletedgoal = await Goal.findByIdAndDelete(req.params.id)

    res.status(200).json({ id: req.params.id})
})


module.exports = {getGoals, setGoals, updateGoal, deleteGoal}