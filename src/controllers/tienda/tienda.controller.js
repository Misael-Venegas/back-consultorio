const AppError = require("../../helpers/appError")
const { db } = require('../../config/bd.config')
const obtenerProductosTienda = async (req, res, next) => {
    try {
        const respuesta = await db.any(`
                        SELECT * FROM inventario.producto pr
                        INNER JOIN inventario.imagenes img ON img.id = pr.id_image
                        WHERE pr.venta_externa = true 
                     `)
                     
        return res.status(200).json(respuesta)
    } catch (error) {
        next(new AppError("Error al intentar obtner los productos"))
    }
}

module.exports = { obtenerProductosTienda }