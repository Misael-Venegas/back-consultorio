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
            fechaNacimientoPaciente,
            edadPaciente
        } = req.body

        const resultado = await validarCitaExistente(fecha, hora, '')

        console.log(req.body)

        if (resultado) {
            throw new Error("Ya existe una reservación con esta fecha y hora.")
        }


        if (pacienteNuevo) {
            const query = `
            INSERT INTO agenda.pacientes (
                nombre, apaterno, amaterno, telefono, fecha_naciemiento, edad
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

            const values = [
                nombrePaciente,
                aPaternoPaciente,
                aMaternoPaciente,
                telefonoPaciente,
                fechaNacimientoPaciente || null,
                edadPaciente || null
            ];
            const { id } = await db.oneOrNone(query, values);

            idPaciente = id
        }

        await db.oneOrNone(`INSERT INTO agenda.agenda(
                    fecha, hora, motivo_consulta, id_usuario, estado, id_paciente)
                    VALUES ( '${fecha}', '${hora}', '${motivo}', '${idUsuario}', 1, '${idPaciente}');`
        )

        return res.status(200).json({ response: "ok" })
    } catch (error) {
        console.log(error.message)
        next(new AppError('Error al intentar agendar una cita' + error.message, 500))
    }
}

const obtenerCitas = async (req, res, next) => {
    try {
        const { fecha } = req.params

        const response = await db.any(`select ag.id, to_char(ag.fecha, 'YYYY-MM-DD') fecha, ag.hora, ag.motivo_consulta, CONCAT(pa.nombre,' ',pa.apaterno,' ',pa.amaterno) paciente,
            pa.telefono, to_char(pa.fecha_naciemiento, 'YYYY-MM-DD') fecha_naciemiento, ag.estado, 
	        usr.id id_especialista, CONCAT(usr.nombre, ' ', usr.a_paterno, ' ', usr.a_materno) especialista
			from agenda.agenda ag 
			INNER JOIN agenda.pacientes pa ON pa.id = ag.id_paciente     
			INNER JOIN usuarios.users usr ON usr.id = ag.id_usuario
			where ag.fecha = '${fecha}' AND (ag.estado = 1 OR ag.estado = 2 OR ag.estado = 4) ORDER BY ag.fecha, ag.hora`)

        return res.status(200).json(response)
    } catch (error) {
        next(new AppError('Error al intentar obtner las citas' + error.message, 500))
    }
}

const obtenerEspecialistas = async (req, res, next) => {
    try {
        const response = await db.any(`
        select usr.id, CONCAT(usr.nombre, ' ', usr.a_paterno, ' ', usr.a_materno) nombre, r.rol from usuarios.users usr
                 INNER JOIN usuarios.rol r ON r.id = usr.id_rol
                WHERE r.rol='Especialista'
        `)
        return res.status(200).json(response)
    } catch (error) {
        next(new AppError('Error al intentar obtner a los especialistas' + error.message, 500))
    }
}

const cancelarCita = async (req, res, next) => {
    try {
        const { id } = req.params

        db.oneOrNone(`
            UPDATE agenda.agenda SET estado=3 WHERE id = '${id}' 
            `)
        return res.status(200).json({ response: 'ok' })
    } catch (error) {
        next(new AppError('Error al actualizar el estado de la cita' + error.message, 500))
    }
}

const aprobarCita = (req, res, next) => {
    try {

        // 1 registrada
        // 2 concluida
        // 3 cancelada
        // 4 no asistio
        const { id, tipo } = req.params
        db.oneOrNone(`
            UPDATE agenda.agenda SET estado=${tipo} WHERE id = '${id}' 
            `)
        return res.status(200).json({ response: 'ok' })
    } catch (error) {
        next(new AppError('Error al actualizar el estado de la cita' + error.message, 500))
    }
}

const obtenerCitasPorEspecialista = async (req, res, next) => {
    try {
        const { idEspecialista } = req.params
        const response = await db.any(`select ag.id, to_char(ag.fecha, 'YYYY-MM-DD') fecha, ag.hora, ag.motivo_consulta, CONCAT(pa.nombre,' ',pa.apaterno,' ',pa.amaterno) paciente,
            pa.telefono, to_char(pa.fecha_naciemiento, 'YYYY-MM-DD') fecha_naciemiento, ag.estado, 
	        usr.id id_especialista, CONCAT(usr.nombre, ' ', usr.a_paterno, ' ', usr.a_materno) especialista
			from agenda.agenda ag 
			INNER JOIN agenda.pacientes pa ON pa.id = ag.id_paciente     
			INNER JOIN usuarios.users usr ON usr.id = ag.id_usuario
			where ag.id_usuario = '${idEspecialista}' AND (ag.estado = 1 OR ag.estado = 2 ) ORDER BY ag.fecha, ag.hora`)
        return res.status(200).json(response)
    } catch (error) {
        next(new AppError('Error al intentar obtener las citas ' + error.message, 500))
    }
}

const editarCita = async (req, res, next) => {
    try {
        const datos = req.body

        const resultado = await validarCitaExistente(datos.fecha, datos.hora, datos.id)
        if (resultado) {
            throw new Error("Ya existe una reservación con esta fecha y hora.")
        }

        const response = await db.oneOrNone(`
            UPDATE agenda.agenda
            SET fecha='${datos?.fecha}', motivo_consulta='${datos?.motivo}', id_usuario='${datos?.idUsuario}', hora='${datos?.hora}'
            WHERE id='${datos.id}'
            `)
        return res.status(200).json({ response: 'ok' })
    } catch (error) {
        next(new AppError('Error al intentar editar la cita ' + error.message, 500))
    }
}

const obtenerCitasUsuario = async (req, res, next) => {
    try {
        const { idUsuario } = req.params
        const response = await db.any(`select ag.id, to_char(ag.fecha, 'YYYY-MM-DD') fecha, ag.hora, ag.motivo_consulta, CONCAT(pa.nombre,' ',pa.apaterno,' ',pa.amaterno) paciente,
            pa.telefono, to_char(pa.fecha_naciemiento, 'YYYY-MM-DD') fecha_naciemiento, ag.estado, 
	        usr.id id_especialista, CONCAT(usr.nombre, ' ', usr.a_paterno, ' ', usr.a_materno) especialista
			from agenda.agenda ag 
			INNER JOIN agenda.pacientes pa ON pa.id = ag.id_paciente     
			INNER JOIN usuarios.users usr ON usr.id = ag.id_usuario
			where ag.id_paciente = '${idUsuario}' ORDER BY ag.fecha, ag.hora`)
        return res.status(200).json(response)
    } catch (error) {
        next(new AppError('Error al intentar editar la cita ' + error.message, 500))
    }
}

const validarCitaExistente = async (fecha, hora, id) => {

    const condicion = id == '' ? '' : `AND ag.id != '${id}'`
    const resultado = await db.oneOrNone(`select ag.id from agenda.agenda ag where ag.fecha = '${fecha}' AND ag.hora = '${hora}' AND ag.estado=1 ${condicion}`)

    return resultado

}

module.exports = { agendarCita, obtenerCitas, obtenerEspecialistas, cancelarCita, aprobarCita, obtenerCitasPorEspecialista, editarCita, obtenerCitasUsuario }