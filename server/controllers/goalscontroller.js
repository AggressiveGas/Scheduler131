const asynchandler = require('express-async-handler')

//@desc GetGoals 
//@route GET /api/goals
//@access Private
const getGoals = asynchandler(async (req, res) => {
    res.status(200).json({message: 'get the goals'})
})

//@desc SetGoals
//@route POST /api/goals
//@access Private
const setGoals =asynchandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('text is required')
    }
    
    console.log(req.body)
    res.status(200).json({message: 'set the goals'})
})

//@desc UpdateGoal
//@route PUT /api/goals/:id
//@access Private
const updateGoal = asynchandler( async (req, res) => {
    res.status(200).json({message: `update goal ${req.params.id}`})
})

//@desc DeleteGoal 
//@route DELETE /api/goals/:id
//@access Private
const deleteGoal = asynchandler( async (req, res) => {
    res.status(200).json({message: `delete goal ${req.params.id}`})
})


module.exports = {getGoals, setGoals, updateGoal, deleteGoal}