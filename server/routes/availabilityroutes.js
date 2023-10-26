const express = require('express')
const router = express.Router()
const {getAvailability, createAvailability} = require('../controllers/availabilitycontroller')
const {protect} = require('../middlewares/authmiddleware')


router.get('/availability', getAvailability)

router.post('/availability', createAvailability)



module.exports = router

