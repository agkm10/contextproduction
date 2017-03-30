const db = require('../db/db.js');
const session = require('express-session');
const knex = require('knex')
module.exports = {
    getWell: function(req, res, next) {
      db('test_well')
      .select('date','oil','gas')
      .then(function(results){
        return res.status(200).json(results)
      })
      .catch(function(err){
        return res.status(500).json(err);
      })
        // db.get_well(function(err, results) {
        //     if (err) return res.status(500).json(err);
        //     return res.status(200).json(results)
        // });
    },
    getWells: function(req, res, next) {
        var user_id = req.session.passport.user
        console.log('wellcontroller', req.session.passport.user)

        db('wells_table')
        .where('user_id', user_id)
        .select('well_name')
        .then(function(results){
          return res.status(200).json(results)
        })
        .catch(function(err){
          return res.status(500).json(err);
        })
        // db.get_wells(user_id, function(err, results) {
        //     if (err) return res.status(500).json(err);
        //     return res.status(200).json(results)
        // });
    }
}
