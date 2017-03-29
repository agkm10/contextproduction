const db = require('../db/db.js');

module.exports = {
  getWell: function(req, res, next) {
    db.get_well(function(err, results) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(results)
  });
  }
}
