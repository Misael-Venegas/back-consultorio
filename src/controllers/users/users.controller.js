const { logIn } = require('../../models/users/users.model')


const inicarSesion = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body
        const respuesta = await logIn(res, usuario, contrasena)
        res.send(respuesta)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { inicarSesion }