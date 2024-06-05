const express = require('express')
const router = express.Router()
const { agregarUsuario, obtenerRolesUsuarios, getUsuarios, deleteUser } = require('../controllers/users/users.controller')

router.post('/agregarUsuario', agregarUsuario)
    .get('/getRol', obtenerRolesUsuarios)
    .get('/obtenerUsuarios', getUsuarios)
    .get('/eliminarUsuario/:idUsuario', deleteUser)


module.exports = router