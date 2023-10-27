const express = require('express')
const router = express.Router()
const {getAvailability, createAvailability, updateAvailability, deleteAvailability} = require('../controllers/availabilitycontroller')
const {protect} = require('../middlewares/authmiddleware')


router.get('/:id/availability', protect ,getAvailability)

router.post('/:id/availability', protect ,createAvailability)

router.put('/:userid/availability/:availabilityId', protect ,updateAvailability)

router.delete('/:userid/availability/:availabilityId', protect ,deleteAvailability)




module.exports = router

