const express = require('express')
const router = express.Router()
const { agregarUsuario, obtenerRolesUsuarios, getUsuarios, deleteUser, editarUsuario, cambiarContrasenhia } = require('../controllers/users/users.controller')
const { obtenerProductos, registrarProducto, eliminarProducto, editarProducto } = require('../controllers/products/products.controller')
const { obtnerUsuariosQueCumplenAnhos, obtenerProductosStockMinimo,
    obtenerTotalVentasPorDia, obtenerUsuarioConMasVentasPorMes,
    obtenerTotalVentasPorMes, obtenerUsuarioMayorVentasPorMes } = require('../controllers/dashboard/dashboard.controller')
const { agendarCita, obtenerCitas } = require('../controllers/agenda/agenda.controller')

router.post('/agregarUsuario', agregarUsuario)
    .get('/getRol', obtenerRolesUsuarios)
    .get('/obtenerUsuarios', getUsuarios)
    .get('/eliminarUsuario/:idUsuario', deleteUser)
    .post('/editarUsuario', editarUsuario)
    .post('/registrar-producto', registrarProducto)
    .get('/obtenerProductos', obtenerProductos)
    .get('/eliminar-producto/:idProducto', eliminarProducto)
    .post('/editar-producto', editarProducto)
    .post('/cambiar-contrasenhia', cambiarContrasenhia)
    .get('/obtener-stock-minimo', obtenerProductosStockMinimo)
    .get('/obtener-lista-cumpleanhos', obtnerUsuariosQueCumplenAnhos)
    .post('/total-ventas-por-dia', obtenerTotalVentasPorDia)
    .post('/obtener-usuario-con-mayor-ventas-por-dia', obtenerUsuarioConMasVentasPorMes)
    .post('/obtener-total-ventas-por-mes', obtenerTotalVentasPorMes)
    .post('/obtener-usuarios-mayor-ventas-por-mes', obtenerUsuarioMayorVentasPorMes)
    .post('/agendar-cita', agendarCita)
    .get('/obtener-citas', obtenerCitas)


module.exports = router