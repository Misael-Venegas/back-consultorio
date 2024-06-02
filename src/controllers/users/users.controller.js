const AppError = require('../../helpers/appError')
const { generateToken } = require('../../helpers/autenticationToken')
const { db } = require('../../coonfig/bd.config')

const inicarSesion = async (req, res, next) => {
    try {
        const { usuario, contrasena } = req.body;
        if (usuario === 'root') {
            if (contrasena === 'abcd.1234') {
                const usr = [{ usuario, correo: '', telefono: '', rol: 'root', fechaCumpleanhos: '' }]
                const token = generateToken(usr)

                return res.status(200).json({ token });
            } else {
                return next(new AppError('Contraseña incorrecta', 401))
            }

        }
    } catch (error) {
        next(new AppError('Error interno del servidor', 500));
    }
}


const obtenerRolesUsuarios = async (req, res, next) => {
    try {
        const respuesta = await db.any(`select * FROM usuarios.rol ORDER BY rol`)
        return res.status(200).json(respuesta);
    } catch (error) {
        next(new AppError('Error interno del servidor: ' + error, 500))
    }
}

const agregarUsuario = async (req, res, next) => {
    try {
        const { nombre, aPaterno, aMaterno, correo, telefono, rol, cumpleanhos } = req.body
        const dataUsr = await db.any(`select * from usuarios.users usr where usr.correo = '${correo}'`)
       
        if (dataUsr.length > 0) {
            return next(new AppError('Este correo ya fue registrado con otro usuario', 400))
        }

        await db.oneOrNone(`INSERT INTO usuarios.users(
             nombre, a_paterno, a_materno, correo, telefono, id_rol, fecha_cumpleanhos)
            VALUES ('${nombre}', '${aPaterno}', '${aMaterno}', '${correo}', '${telefono}', '${rol}', '${cumpleanhos}')`)

        return res.status(200).json({ response: 'succes' })
    } catch (error) {
        console.log(error)
        next(new AppError('Error interno del servidor: ' + error, 500))
    }
}

const getUsuarios = async (req, res, next) => {
    try {
        const users = await db.any(`select CONCAT(usr.nombre,' ', usr.a_paterno,' ',usr.a_materno) nombre, usr.correo, usr.telefono, usr.fecha_cumpleanhos, r.rol from usuarios.users usr
                                    INNER JOIN usuarios.rol r ON r.id = usr.id_rol	
                                    ORDER BY usr.nombre`
        )
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        next(new AppError('Error al intentar obtener los usuarios: ' + error, 500))
    }
}

module.exports = { inicarSesion, agregarUsuario, obtenerRolesUsuarios, getUsuarios }