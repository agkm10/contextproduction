const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const db = require('./db')

const config = {
  usernameField: 'email',
  passwordField: 'password'
}

module.exports = passport
