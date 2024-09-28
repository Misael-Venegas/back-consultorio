
const { db } = require('../../config/bd.config')
const AppError = require('../../helpers/appError')


const obtenerListaProductosPorCodigoDeBarras = async (req, res, next) => {
    try {
        const { codigoBarras } = req.params
        const listProductos = await db.any(`SELECT * FROM inventario.producto WHERE (codigo_barras ILIKE '%${codigoBarras}%' OR nombre_producto ILIKE '%${codigoBarras}%') AND activo = true`)
        return res.status(200).json(listProductos)
    } catch (error) {
        next(new AppError('Error al intentar obtener los productos' + error.message, 500))
    }
}


const realizarVenta = async (req, res, next) => {
    try {
        const { listaProductos, totalVenta, codigoVendedor } = req.body
  
        const codigo = await db.oneOrNone(`select usr.codigo_vendedor from usuarios.users usr WHERE usr.codigo_vendedor = '${codigoVendedor}'`)
     
        if (!codigo) {
            next(new AppError('Codigo de vendedor incorrecto', 500))
        }
        const { id } = await db.oneOrNone(`INSERT INTO inventario.ventas(
                    codigo_vendedor, total)
                    VALUES ( '${codigoVendedor}', ${totalVenta}) 
                    returning id`)

        listaProductos.forEach(async (element) => {
            try {

                const datosProducto = await db.oneOrNone(`select po.id, po.cantidad from 
                             inventario.producto po WHERE po.id = '${element.id}'`)

                if (datosProducto.cantidad < element.cantidad) {
                    throw new Error(`La cantidad de productos en stock es menor a la solicitada par ${element.nombre_producto}`)
                }

                let nuevaCantidad = datosProducto.cantidad - element.cantidad

                await db.oneOrNone(`
                    INSERT INTO inventario.ventas_lista_productos(
                    id_venta, id_producto, cantidad, descuento, precio_final)
                    VALUES ( '${id}', '${element.id}', ${element.cantidad}, ${element.descuento}, ${element.precioFinal})
                    `)

                await db.oneOrNone(`UPDATE inventario.producto
                    SET cantidad=${nuevaCantidad}
                        WHERE id = '${element.id}'`)
            } catch (error) {
                next(new AppError('Error al intentar registrar la venta' + error.message, 500))
                return
            }
        });

        return res.status(200).json({ response: 'success' })

    } catch (error) {
        console.log(error)
        next(new AppError('Error al intentar registrar la venta' + error.message, 500))
    }
}

module.exports = { obtenerListaProductosPorCodigoDeBarras, realizarVenta }