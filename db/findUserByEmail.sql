SELECT *
FROM users
WHERE user_email = $1
;
knex('users')
.where('user_email', __)
.select()
