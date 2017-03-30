INSERT INTO users (user_name, user_email, user_password)
VALUES ($1, $2, $3)
RETURNING *
;
knex('users')
.returning()
.insert({user_name: '$1'},{ user_email: '$2'},{user_password: '$3'})
