const express = require('express');

const mainController = require('../controllers/mainController');
const passport = require('passport');

const router = express.Router()

router.get('/', mainController.home);
router.get('/oops', mainController.oops);
router.get('/logout', mainController.logout);

router.post('/api/login', passport.authenticate('local', {
  successRedirect: '/users/me',
  failureRedirect: '/oops'
}));

module.exports = router
