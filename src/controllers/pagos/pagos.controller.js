const AppError = require("../../helpers/appError")
const Stripe = require('stripe')
const { db } = require('../../config/bd.config')
require('dotenv').config()

const payment = async (req, res, next) => {

    try {
        const carrito = req.body.carrito
        const productos = req.body.arrayProductos
        const cliente = req.body.dataClientes
        const stripe = new Stripe(process.env.SECRET_STRIPE_KEY)
        console.log(carrito)
        const arrayProductos = carrito.map(producto => {
            const dataProducto = {
                id: producto.id,
                cantidad: producto.cantidadProductos,
                precio_final: producto.precio_venta
            }
            return dataProducto
        }

        )
        const query = `INSERT INTO clientes.cliente(
            nombre, apaterno, amaterno, correo, telefono, calle, no_exterior, no_interior, referencias, cp, municipio, estado)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
            `
        const values = [
            cliente.nombre,
            cliente.aPaterno,
            cliente.aMaterno || null,
            cliente.correo,
            cliente.telefono,
            cliente.calle,
            cliente.noExterior,
            cliente.noInterior || null,
            cliente.referencias || null,
            cliente.codigoPostal,
            cliente.municipio,
            cliente.estado
        ]

        //Se registran los datos del cliente
        const { id } = await db.oneOrNone(query, values)

        const session = await stripe.checkout.sessions.create({
            locale: 'es',
            line_items: productos,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/succes-page`,
            cancel_url: `${process.env.CLIENT_URL}/error-page`,
            metadata: {
                cliente: id,
                productos: JSON.stringify(arrayProductos),
            },

        })


        res.json({ url: session.url })
    } catch (error) {
        next(new AppError('Stripe Error: ' + error.message))
    }
}

const ventaOnline = async (cliente, productos, total, next) => {
    // console.log(cliente, productos, total)
    //console.log(cliente)

    const listaProductos = JSON.parse(productos)
    console.log(listaProductos, cliente)
    try {

        const datosCliente = await db.oneOrNone(`
            select * from clientes.cliente where id = '${cliente}'
            `)

        //Se registra la venta
        const queryVentas = `INSERT INTO inventario.ventas(
              total, tipo_pago, telefono_cliente, venta_online, atendida, id_cliente)
                VALUES (  $1, $2, $3, $4, $5, $6)
                RETURNING id
                `

        const valuesVentas = [
            total,
            'tarejata',
            datosCliente.telefono,
            true,
            false,
            cliente
        ]

        const idVenta = await db.oneOrNone(queryVentas, valuesVentas)

        //se registran los productos vendidos
        for (const venta of listaProductos) {

            const queryVentaProducto = `INSERT INTO inventario.ventas_lista_productos(
                id_venta, id_producto, cantidad, precio_final)
                VALUES ($1, $2, $3, $4)`;

            const valuesVentaProducto = [
                idVenta.id,
                venta.id,
                venta.cantidad,
                venta.precio_final
            ];

            await db.none(queryVentaProducto, valuesVentaProducto);

            // Obtener cantidad actual del producto
            const datosProducto = await db.oneOrNone(`
                SELECT cantidad FROM inventario.producto WHERE id = $1
            `, [venta.id]);


            if (!datosProducto) throw new Error(`Producto con ID ${venta.id} no encontrado`);

            const nuevaCantidad = datosProducto.cantidad - venta.cantidad;
            console.log('Cantidad: ', nuevaCantidad)
            // Actualizar cantidad en inventario
            await db.oneOrNone(`
               UPDATE inventario.producto
                    SET cantidad=${nuevaCantidad}
                    WHERE id = '${venta.id}'
            `);

            console.log(`✅ Producto ${venta.id} actualizado con nueva cantidad: ${nuevaCantidad}`);
        }

    } catch (error) {

        next(new AppError('Venta online' + error.message))
    }
}

const eliminarCliente = async (id_cliente, next) => {
    try {
        console.log(id_cliente)
        await db.oneOrNone(`
              DELETE FROM clientes.cliente where id = ${id_cliente}
            `)
    } catch (error) {
        next(new AppError('Eliminar cliente' + error.message))
    }
}

module.exports = { payment, ventaOnline, eliminarCliente }