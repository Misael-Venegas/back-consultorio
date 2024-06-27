const express = require('express')
const router = express.Router()
const { agregarUsuario, obtenerRolesUsuarios, getUsuarios, deleteUser, editarUsuario } = require('../controllers/users/users.controller')
const { obtenerProductos, registrarProducto, eliminarProducto } = require('../controllers/products/products.controller')
router.post('/agregarUsuario', agregarUsuario)
    .get('/getRol', obtenerRolesUsuarios)
    .get('/obtenerUsuarios', getUsuarios)
    .get('/eliminarUsuario/:idUsuario', deleteUser)
    .post('/editarUsuario', editarUsuario)
    .post('/registrar-producto', registrarProducto)
    .get('/obtenerProductos', obtenerProductos)
    .get('/eliminar-producto/:idProducto', eliminarProducto)


module.exports = router