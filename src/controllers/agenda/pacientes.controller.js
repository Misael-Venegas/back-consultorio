const { db } = require('../../config/bd.config')
const AppError = require('../../helpers/appError')

const filtrarPacientes = async (req, res, next) => {
    try {
        const { nombre } = req.params
        const response = await db.any(`select * from agenda.pacientes p where (p.nombre ILIKE '%${nombre}%' OR p.apaterno ILIKE '%${nombre}%' OR p.amaterno ILIKE'%${nombre}%')`)
        return res.status(200).json(response)
    } catch (error) {
        next(new AppError('Error al intentar obtner los pacientes ' + error.message, 500))
    }
}


module.exports = { filtrarPacientes }
