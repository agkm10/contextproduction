var config      = require('../knex.js');
var env         = 'development';
var knex        = require('knex')(config[env]);

module.exports = knex;


// const massive = require('massive');
// const connectionString = "postgres://postgres:spydertl@localhost/contextproduction"
// const massiveInstance = massive.connectSync({
//     connectionString: connectionString
// })
//
// module.exports = massiveInstance
