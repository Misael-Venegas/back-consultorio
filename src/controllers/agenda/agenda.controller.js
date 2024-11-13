const { db } = require('../../config/bd.config')
const AppError = require('../../helpers/appError')

const agendarCita = async (req, res, next) => {
    try {

        let {
            fecha,
            hora,
            motivo,
            idUsuario,
            idPaciente,
            nombrePaciente,
            aPaternoPaciente,
            aMaternoPaciente,
            telefonoPaciente,
            pacienteNuevo,
            fechaNacimientoPaciente
        } = req.body

        if (pacienteNuevo) {
            const { id } = await db.oneOrNone(`
                INSERT INTO agenda.pacientes(
                     nombre, apaterno, amaterno, telefono, fecha_naciemiento)
                    VALUES ( '${nombrePaciente}', '${aPaternoPaciente}',
                     '${aMaternoPaciente}', '${telefonoPaciente}','${fechaNacimientoPaciente}')
                     returning id
                `)
            idPaciente = id
        }


        console.log(idPaciente)
        await db.oneOrNone(`INSERT INTO agenda.agenda(
                    fecha, hora, motivo_consulta, id_usuario, estado, id_paciente)
                    VALUES ( '${fecha}', '${hora}', '${motivo}', '84e0f17d-c53d-43ec-8a7b-7a36f0628b61', 1, '${idPaciente}');`
        )

        return res.status(200).json({ response: "ok" })
    } catch (error) {
        console.log(error.message)
        next(new AppError('Error al intentar agendar una cita' + error.message, 500))
    }
}

const obtenerCitas = async (req, res, next) => {
    try {
        const response = await db.any(`select ag.id, ag.fecha, ag.hora, ag.motivo_consulta, CONCAT(pa.nombre,' ',pa.apaterno,' ',pa.amaterno) paciente, pa.telefono, pa.fecha_naciemiento  from agenda.agenda ag
            INNER JOIN agenda.pacientes pa ON pa.id = ag.id_paciente where ag.estado =1`)
       
        return res.status(200).json(response)
    } catch (error) {
        next(new AppError('Error al intentar obtner las citas' + error.message, 500))
    }
}

module.exports = { agendarCita, obtenerCitas }