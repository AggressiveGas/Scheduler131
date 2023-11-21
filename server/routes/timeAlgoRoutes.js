const express = require('express')
const router = express.Router()

const {getCommonTimes} = require('../controllers/timeAlgoController')

router.get('/:joincode', getCommonTimes)

module.exports = router