const { db } = require('../../config/bd.config')
const AppError = require('../../helpers/appError')

const agendarCita = (req, res, next) => {
    try {
        console.log(req.body)
        return res.status(200).json({ response: "ok" })
    } catch (error) {
        next(new AppError('Error al intentar agendar una cita' + error.message, 500))
    }
}

module.exports = { agendarCita }