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
  .then(users => {
    console.log('passprt',users)
    const user = users[0]
    // if (err) { return done(err) }
    if (!user) { return done(null, false) }
    if (!bcrypt.compareSync(password, user.user_password)) {
      return done(null, false)
    }
    done(null, user)
  })
  .catch(err => done(err))
}))

// NOTE:
//   this is passed the value that serializeUser saved our session
//   whatever value we give to done() here will end up on req.user
passport.deserializeUser((id, done) => {
  db('users').where('user_id', id).select()
  .then(user => {
    done(null, user)
  })
  .catch(err => {
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
passport.serializeUser((user, done) => done(null, user.user_id))

module.exports = passport
