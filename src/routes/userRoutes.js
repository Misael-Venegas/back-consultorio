const express = require('express')
const router = express.Router()
const { agregarUsuario, obtenerRolesUsuarios, getUsuarios } = require('../controllers/users/users.controller')

router.post('/agregarUsuario', agregarUsuario)
    .get('/getRol', obtenerRolesUsuarios)
    .get('/obtenerUsuarios', getUsuarios)


module.exports = router