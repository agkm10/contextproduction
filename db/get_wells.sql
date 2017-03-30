SELECT well_name
FROM wells_table
where user_id = $1;
knex('wells_table').
.where('user_id', ____)
.select('well_name')
