const express = require('express')
const route = express.Router()
const { obtenerListaProductosPorCodigoDeBarras, realizarVenta } = require('../controllers/ventas/sales.cotroller')
const { inicarSesion, recuperarContrasenha } = require('../controllers/users/users.controller')
const { obtenerProductosTienda } = require('../controllers/tienda/tienda.controller')

route.post('/login', inicarSesion)
    .get('/obtener-lista-productos-codigo-barras/:codigoBarras', obtenerListaProductosPorCodigoDeBarras)
    .post('/realizar-venta', realizarVenta)
    .get('/recuperar-contrasenha/:correoElectronico', recuperarContrasenha)
    .get('/obtener-productos-tienda', obtenerProductosTienda)
module.exports = route
