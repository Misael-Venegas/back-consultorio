const pgp = require('pg-promise')

const db = pgp('postgres://postgres:0104@localhost:5432/Optica')


module.exports = { pgp, db }