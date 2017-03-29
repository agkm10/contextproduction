const massive = require('massive');
const connectionString = "postgres://postgres:spydertl@localhost/sandbox"
const massiveInstance = massive.connectSync({
    connectionString: connectionString
})

module.exports = massiveInstance
