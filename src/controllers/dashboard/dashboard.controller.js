const { db } = require('../../config/bd.config')
const AppError = require('../../helpers/appError')

const obtnerUsuariosQueCumplenAnhos = async (req, res, next) => {
    try {
        const response = await db.any(`select CONCAT(usr.nombre,' ', usr.a_paterno,' ', usr.a_materno) nombre,
                            TO_CHAR(usr.fecha_cumpleanhos::date, 'dd-mm-yyyy') fecha_cumpleanhos from usuarios.users usr
                            where EXTRACT(MONTH FROM usr.fecha_cumpleanhos) = EXTRACT(MONTH FROM CURRENT_DATE)
                            ORDER BY EXTRACT(DAY FROM usr.fecha_cumpleanhos)`)

        return res.status(200).json(response)
    } catch (error) {
        next(new AppError(error.message, 500))
    }
}
const obtenerProductosStockMinimo = async (req, res, next) => {
    try {
        const datosStock = await db.any(`select pro.nombre_producto, pro.codigo_barras, pro.cantidad 
            from inventario.producto pro WHERE pro.cantidad <= 10 AND pro.activo = true`)

        return res.status(200).json(datosStock)
    } catch (error) {
        next(new AppError(error.message))
    }
}

const obtenerTotalVentasPorDia = async (req, res, next) => {
    try {
        const { fecha } = req.body

        const response = await db.oneOrNone(`
          select SUM(total) total from inventario.ventas v WHERE DATE(v.fecha_venta) = '${fecha}'
        `)

        return res.status(200).json(response)
    } catch (error) {
        next(new AppError(error.message))
    }
}

const obtenerUsuarioConMasVentasPorMes = async (req, res, next) => {
    try {
        const { fecha } = req.body

        const response = await db.oneOrNone(`SELECT usr.nombre, usr.a_paterno, usr.a_materno, COUNT(v.codigo_vendedor) total_ventas from inventario.ventas v
                        JOIN usuarios.users usr ON usr.codigo_vendedor = v.codigo_vendedor
                        WHERE DATE(v.fecha_venta) = '${fecha}'
                        GROUP BY usr.nombre, usr.a_paterno, usr.a_materno 
                        LIMIT 1`)

        return res.status(200).json(response)
    } catch (error) {
        next(new AppError(error.message))
    }
}

const obtenerTotalVentasPorMes = async (req, res, next) => {
    try {
        
        const { mes, anhio } = req.body
        
        const response = await db.oneOrNone(`select SUM(v.total) total from inventario.ventas v
                        WHERE EXTRACT(MONTH FROM v.fecha_venta) = '${mes}' 
                        AND EXTRACT(YEAR FROM v.fecha_venta) = '${anhio}'`)

        return res.status(200).json(response)

    } catch (error) {
        next(new AppError(error.message))
    }
}

module.exports = { obtnerUsuariosQueCumplenAnhos, obtenerProductosStockMinimo, obtenerTotalVentasPorDia, obtenerUsuarioConMasVentasPorMes, obtenerTotalVentasPorMes }