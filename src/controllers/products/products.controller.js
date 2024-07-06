const { db } = require('../../config/bd.config')
const AppError = require('../../helpers/appError')

const registrarProducto = async (req, res, next) => {
    try {
        console.log('Agregar', req.body)
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
        const productos = await db.any(`SELECT *FROM inventario.producto  pr WHERE pr.activo = true ORDER BY pr.nombre_producto`)

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
const editarProducto = async (req, res, next) => {
    try {
        //console.log('Editar', req.body)
        const {
            id,
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
        // console.log(id)
        await db.oneOrNone(`UPDATE inventario.producto
        SET nombre_producto='${nombreProducto}', cantidad=${cantidad},
        unidad='${unidad}', descripcion='${descripcion}', precio_unitario=${precioUnitario}, 
        importe=${importe}, precio_venta=${precioVenta}, codigo_barras='${codigoBarras}', producto_farmacia=${productoFarmacia}
        WHERE id='${id}'`)


        return res.status(200).json({ response: 'ok' })

    } catch (error) {
        console.log(error)
        next(new AppError('Error al intentar editar el prducto: ' + error.message, 500))
    }
}

module.exports = { registrarProducto, obtenerProductos, eliminarProducto, editarProducto }