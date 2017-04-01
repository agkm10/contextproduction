const db = require('../db.js');
const session = require('express-session');

module.exports = {
    getWell: function(req, res, next) {
      console.log('req query',req.query.well_id)
        db('well_data')
            .where('well_id', req.query.well_id)
            .select('prod_date', 'prod_oil')
            .then(function(results) {
                return res.status(200).json(results)
            })
            .catch(function(err) {
              console.log(err)
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
            .select('well_id','well_name')
            .then(function(results) {
                return res.status(200).json(results)
            })
            .catch(function(err) {
                return res.status(500).json(err);
            })
        // db.get_wells(user_id, function(err, results) {
        //     if (err) return res.status(500).json(err);
        //     return res.status(200).json(results)
        // });
    },
    uploadWell: (req, res, next) => {
        var uploadFile = req.body.wellinfo;
        var wellName = req.body.wellname;
        var user_id = req.session.passport.user;
        console.log('csvController Running: ', uploadFile)
        // db.schema.dropTableIfExists('test_well12');
        db('wells_table')
            .returning('well_id')
            .insert({
                well_name: wellName,
                user_id: user_id
            }).then(function(result) {
                console.log(result);
                uploadFile.forEach(x => {
                    x.well_id = result[0]
                })
                console.log(uploadFile)
                db('well_data').insert(uploadFile).then(function(result) {
                    console.log(result);
                    res.status(200).json(result);
                }).catch(function(err) {
                    next(err)
                })
            }).catch(function(err) {
                next(err)
            })
    }

    // db.insert(uploadFile).into('test_well12')

}
