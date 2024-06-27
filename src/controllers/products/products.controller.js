const { db } = require('../../coonfig/bd.config')
const AppError = require('../../helpers/appError')

const registrarProducto = async (req, res, next) => {
    try {
        //  console.log(req.body)
        const {
            nombreProducto,
            unidad,
            cantidad,
            descripcion,
            precioUnitario,
            importe,
            precioVenta,
            codigoBarras,
            productoFarmacia
        } = req.body

        await db.oneOrNone(`INSERT INTO inventario.producto(
                 nombre_producto, cantidad, unidad, descripcion, precio_unitario, importe, precio_venta, codigo_barras, producto_farmacia)
                VALUES ( '${nombreProducto}', ${cantidad}, '${unidad}', '${descripcion}', ${precioUnitario}, ${importe}, ${precioVenta}, '${codigoBarras}', ${productoFarmacia})`)
        return res.status(200).json({ response: 'Ok' })
    } catch (error) {
        next(new AppError('Error al intentarn registrar un producto ' + error.message, 500))
    }
}

const obtenerProductos = async (req, res, next) => {
    try {
        const productos = await db.any(`SELECT *FROM inventario.producto  pr WHERE pr.activo = true`)

        return res.status(200).json(productos)
    } catch (error) {
        next(new AppError('Error al intentar obtener los productos: ' + error.message, 500))
    }
}

const eliminarProducto = async (req, res, next) => {
    try {
        const { idProducto } = req.params

        await db.oneOrNone(`UPDATE  inventario.producto SET activo = false WHERE id = '${idProducto}'`)

        return res.status(200).json({ response: 'ok' })
    } catch (error) {
        next(new AppError('Error al intentar eliminar el producto' + error.message, 500))
    }
}

module.exports = { registrarProducto, obtenerProductos, eliminarProducto }