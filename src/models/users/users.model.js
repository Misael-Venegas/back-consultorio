const { db } = require('../../coonfig/bd.config')
const { generateToken } = require('../../helpers/autenticationToken')
const logIn = async (res,usuario, pastword) => {
    try {
        if (usuario === 'root') {
            if (pastword === 'abcd.1234') {
                const usr = [{ usuario, correo: '', telefono: '', rol: 'root', fechaCumpleanhos: '' }]
                const token = generateToken(usr)
                console.log(token)
                return res.status(200).json({ token });
            }
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }
        return res.status(404).json({ error: "Usuario no encontrado" });
    } catch (error) {
        console.error(error); // Esto ayuda a la depuración del servidor
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = { logIn }

