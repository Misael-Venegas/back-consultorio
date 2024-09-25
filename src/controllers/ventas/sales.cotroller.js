const { db } = require('../../config/bd.config')
const AppError = require('../../helpers/appError')


const obtenerListaProductosPorCodigoDeBarras = async (req, res, next) => {
    try {
        const { codigoBarras } = req.params
        const listProductos = await db.any(`SELECT * FROM inventario.producto WHERE (codigo_barras ILIKE %'${codigoBarras}'% OR nombre_producto ILIKE %'${codigoBarras}'%) AND activo = true`)
        console.log(listProductos)
        return res.status(200).json(listProductos)
    } catch (error) {
        next(new AppError('Error al intentar obtener los productos' + error.message, 500))
    }
}

module.exports = { obtenerListaProductosPorCodigoDeBarras }