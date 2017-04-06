var config      = require('./knex.js');
var env         = 'development';
var knex        = require('knex')(config[env]);

module.exports = knex;
