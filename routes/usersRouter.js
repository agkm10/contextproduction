const express = require('express')
const usersController = require('../controllers/usersController')

const router = express.Router()

router.get('/me', usersController.me)
router.post('', usersController.create)

module.exports = router
