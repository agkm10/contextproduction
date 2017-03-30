const db = require('../db');

module.exports = {
  home: (req, res, next) => {
    res.send('Welcome Home!');
  },

  oops: (req, res, next) => {
    res.send('you messed up')
  },

  logout: (req, res, next) => {
    req.logout();
    res.redirect('/');
  }
};
