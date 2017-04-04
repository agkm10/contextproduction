const express = require('express');
const wellController = require('../controllers/wellController');
const router = express.Router()


router.get('', wellController.getWell);
router.get('/wellsbyuser', wellController.getWells);
router.post('/upload', wellController.uploadWell);
router.delete('/removewell', wellController.removeWell);
module.exports = router
