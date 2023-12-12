const express = require('express')
const router = express.Router()

const {getCommonTimes} = require('../controllers/timeAlgoController2')

router.get('/:joincode', getCommonTimes)

module.exports = router;