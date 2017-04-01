const db = require('./db.js');

db.schema.createTable('test_well12', function(table) {
    table.increments();
    table.string('name');
    table.timestamps();
})
