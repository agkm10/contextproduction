const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('./db.js');

const config = {
  usernameField: 'email',
  passwordField: 'password'
}

// NOTE: this callback function runs when passport.authenticate('local') is called
passport.use(new LocalStrategy(config, (email, password, done) => {
  db('users').where('user_email', email).select()
  .then(function(users){
    console.log('passprt',users)
    const user = users[0]
    // if (err) { return done(err) }
    if (!user) { return done(null, false) }
    if (!bcrypt.compareSync(password, user.user_password)) {
      return done(null, false)
    }
    done(null, user)
  })
  .catch(function(err){
      return done(err)
  })
  // db.findUserByEmail(email, (err, users) => {
  //   console.log(users)
  //   const user = users[0]
  //   if (err) { return done(err) }
  //   if (!user) { return done(null, false) }
  //   if (!bcrypt.compareSync(password, user.user_password)) {
  //     return done(null, false)
  //   }
  //   done(null, user)
  // })
}))

// NOTE:
//   this is passed the value that serializeUser saved our session
//   whatever value we give to done() here will end up on req.user
passport.deserializeUser(function(id, done) {
  db('users').where('user_id', id).select()
  .then(function(user){
    done(null, user)
  })
  .catch(function(err){
    console.log('passport deserialize error')
    done(err)
  })
  // db.findUserById([id], (err, user) => {
  //   done(err, user)
  // })
})

// NOTE:
//   this is passed the value from deserializeUser (req.user)
//   whatever value we give to done() here will be saved on our session
passport.serializeUser(function(user, done) {
  done(null, user.user_id)
})

module.exports = passport
