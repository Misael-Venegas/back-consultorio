
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
        const { listaProductos, totalVenta, codigoVendedor, codigoTicketTerminal, metodoPago, telefonoCliente } = req.body

        const codigo = await db.oneOrNone(`select usr.codigo_vendedor from usuarios.users usr WHERE usr.codigo_vendedor = '${codigoVendedor}'`)

        if (!codigo) {
            return next(new AppError('Código de vendedor incorrecto', 500));
        }

        const validarStock = await validarStockProductos(listaProductos, next)

        if (validarStock) {
            const { id } = await db.oneOrNone(`INSERT INTO inventario.ventas(
                    codigo_vendedor, total, codigo_pago_digital, tipo_pago, telefono_cliente)
                    VALUES ('${codigoVendedor}', ${totalVenta}, ${codigoTicketTerminal ? `'${codigoTicketTerminal}'`: null}, '${metodoPago}', ${telefonoCliente ? `'${telefonoCliente}'` : null}) 
                    returning id`)

            for (const element of listaProductos) {
                try {
                    // Obtiene los datos del producto
                    const datosProducto = await db.oneOrNone(`
                    SELECT po.id, po.cantidad 
                    FROM inventario.producto po 
                    WHERE po.id = '${element.id}'
                    `);

                    // Calcula la nueva cantidad de productos
                    let nuevaCantidad = datosProducto.cantidad - element.cantidad;

                    // Inserta el producto vendido en la lista de productos de la venta
                    await db.oneOrNone(`
                    INSERT INTO inventario.ventas_lista_productos(
                        id_venta, id_producto, cantidad, descuento, precio_final
                    )
                    VALUES ('${id}', '${element.id}', ${element.cantidad}, ${element.descuento}, ${element.precioFinal})
                    `);

                    // Actualiza la cantidad del producto en el inventario
                    await db.oneOrNone(`
                    UPDATE inventario.producto
                    SET cantidad=${nuevaCantidad}
                    WHERE id = '${element.id}'
                `);
                } catch (error) {
                    // Si ocurre un error con algún producto, se envía el error al middleware de manejo de errores
                    return next(new AppError('Error al intentar registrar la venta: ' + error.message, 500));
                }
            }
            return res.status(200).json({ response: 'success' })
        }


    } catch (error) {
        console.log(error)
        return next(new AppError(error.message, 500))
    }
}


const validarStockProductos = async (listaProductos, next) => {
    try {
        for (const element of listaProductos) {

            const datosProducto = await db.oneOrNone(`
                SELECT po.id, po.cantidad 
                FROM inventario.producto po 
                WHERE po.id = '${element.id}'
                `);

            // Verifica si la cantidad solicitada es mayor que la disponible
            if (datosProducto.cantidad < element.cantidad) {
                throw new Error(`La cantidad de productos en stock es menor a la solicitada para ${element.nombre_producto}`);
            }

        }
        return true

    } catch (error) {
        return next(new AppError("Error:" + error.message, 500));

    }
}

module.exports = { obtenerListaProductosPorCodigoDeBarras, realizarVenta }