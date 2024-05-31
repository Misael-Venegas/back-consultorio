const express = require('express')
const route = express.Router()
const { db } = require('../coonfig/bd.config')

const { inicarSesion } = require('../controllers/users/users.controller')

route.post('/login', inicarSesion)

module.exports = route
