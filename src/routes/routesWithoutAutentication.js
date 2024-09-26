const express = require('express')
const route = express.Router()
const { obtenerListaProductosPorCodigoDeBarras } = require('../controllers/ventas/sales.cotroller')
const { inicarSesion } = require('../controllers/users/users.controller')

route.post('/login', inicarSesion)
    .get('/obtener-lista-productos-codigo-barras/:codigoBarras', obtenerListaProductosPorCodigoDeBarras)

module.exports = route
