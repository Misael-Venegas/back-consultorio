const { db } = require('../../coonfig/bd.config')
const AppError = require('../../helpers/appError')

const registrarProducto = async (req, res, next) => {
    try {
        console.log(req.body)
    } catch (error) {

    }
}

const obtenerProductos = async (req, res, next) => {
    try {
        const productos = await db.any(`SELECT *FROM inventario.producto `)
        console.log(productos)
        return res.status(200).json(productos)
    } catch (error) {
        next(new AppError('Error al intentar obtener los productos: ' + error.message, 500))
    }
}

module.exports = { registrarProducto, obtenerProductos }