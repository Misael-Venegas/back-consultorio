const AppError = require('../appError')
require('dotenv').config()
const nodemailer = require('nodemailer')

const enviarContrasenhaRegistro = async (next, contrasena, correo, nombre) => {
    console.log(nombre, contrasena)
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASSWORD_MAIL
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailOptions = {
            from: "Eyeconic Salud Visual",
            to: correo,
            subject: "Registro al sistena de Eyeconic",
            html: `<p>${nombre} ${contrasena} </p>`,
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        return next(new AppError('Error al intentar enviar el correo: ' + error.message, '500'))
    }
}


module.exports = { enviarContrasenhaRegistro }