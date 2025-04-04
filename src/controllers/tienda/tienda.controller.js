const AppError = require("../../helpers/appError")
const { db } = require('../../config/bd.config')

require('dotenv').config();


const obtenerProductosTienda = async (req, res, next) => {
    try {
        const respuesta = await db.any(`
                       SELECT pr.id, pr.nombre_producto, pr.cantidad, pr.unidad, pr.descripcion, pr.precio_unitario, pr.importe,
	                    pr.precio_venta, pr.codigo_barras, pr.producto_farmacia, pr.venta_externa, img.id id_imagen, img.url FROM inventario.producto pr
                        INNER JOIN inventario.imagenes img ON img.id = pr.id_image
                        WHERE pr.venta_externa = true AND pr.activo =true
                     `)

        return res.status(200).json(respuesta)
    } catch (error) {
        next(new AppError("Error al intentar obtner los productos"))
    }
}


module.exports = { obtenerProductosTienda }