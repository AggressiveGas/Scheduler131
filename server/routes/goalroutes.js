const express = require('express')
const router = express.Router()
const {getGoals, setGoals,updateGoal,deleteGoal} = require('../controllers/goalscontroller')
const {protect} = require('../middlewares/authmiddleware')


router.get('/', getGoals)

router.post('/', protect, setGoals)

router.put('/:id', protect, updateGoal)

router.delete('/:id', protect, deleteGoal)

module.exports = router