const express = require('express');
const wellController = require('../controllers/wellController');
const router = express.Router()

router.get('/', wellController.getWell);
module.exports = router
