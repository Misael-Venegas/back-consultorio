const express = require('express')
const route = express.Router()
const { obtenerListaProductosPorCodigoDeBarras, realizarVenta } = require('../controllers/ventas/sales.cotroller')
const { inicarSesion } = require('../controllers/users/users.controller')

route.post('/login', inicarSesion)
    .get('/obtener-lista-productos-codigo-barras/:codigoBarras', obtenerListaProductosPorCodigoDeBarras)
    .post('/realizar-venta', realizarVenta)

module.exports = route
