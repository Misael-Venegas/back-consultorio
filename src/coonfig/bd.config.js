

const initOptions = {/* initialization options */ };
require('dotenv').config()
const pgp = require('pg-promise')()

const cn = {
    host: process.env.HOST_BD,
    port: process.env.PORT_BD,
    database: process.env.DATABASE,
    user: process.env.USER_DB,
    password: process.env.PW_DB,
    max: 30 // use up to 30 connections

};

const db = pgp(cn)


module.exports = { pgp, db }