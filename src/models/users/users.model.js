const { db } = require('../../coonfig/bd.config')
const AppError = require('../../helpers/appError')
const { generateToken } = require('../../helpers/autenticationToken')

const logIn = async (res, usuario, pastword, next) => {
    try {
        if (usuario === 'root') {
            if (pastword === 'abcd.1234') {
                const usr = [{ usuario, correo: '', telefono: '', rol: 'root', fechaCumpleanhos: '' }]
                const token = generateToken(usr, next)
               
                return res.status(200).json({ token });
            } else {
                return next(new AppError('Contraseña incorrecta', 401))
            }

        }

    } catch (error) {
        next(new AppError('Error interno del servidor', 500))
    }
}

module.exports = { logIn }

