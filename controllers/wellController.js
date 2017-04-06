const db = require('../db.js');
const session = require('express-session');

module.exports = {
    getWell: (req, res, next) => {
        console.log('req query', req.query.well_id)
        db('well_data')
            .where('well_id', req.query.well_id)
            .select('prod_date', 'prod_oil')
            .then(results => res.status(200).json(results))
            .catch(err => res.status(500).json(err))
    },
    removeWell: (req, res, next) => {
        console.log('wellcontroll removewell', req.query.well_id)
        console.log('passport user', req.session.passport.user)
        db('wells_table').where(() => {
                this.where('well_id', parseInt(req.query.well_id))
                    .andWhere('user_id', req.session.passport.user)
            })
            .del()
            .then(results => res.status(200).json(results))
            .catch(function(err) {
                console.log(err)
                return res.status(500).json(err);
            })
    },
    getWells: (req, res, next) => {
        var user_id = req.session.passport.user
        console.log('wellcontroller', req.session.passport.user)

        db('wells_table')
            .where('user_id', user_id)
            .select('well_id', 'well_name')
            .then(results => res.status(200).json(results))
            .catch(err => res.status(500).json(err))

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
            }).then(result => {
                console.log(result);
                uploadFile.forEach(x => {
                    x.well_id = result[0]
                })
                console.log(uploadFile)
                db('well_data').insert(uploadFile).then(result => {
                    console.log(result);
                    res.status(200).json(result);
                }).catch(err => next(err))
            }).catch(err => next(err))
    }
}
