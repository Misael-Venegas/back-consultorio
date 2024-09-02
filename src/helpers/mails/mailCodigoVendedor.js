const AppError = require('../appError')
require('dotenv').config()
const nodemailer = require('nodemailer')
const { imageEyeconic } = require('../images/logoEyeconic')

const enviarCodigoVendedor = async (next, nombre, correo, codigo) => {
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
            subject: "Código de vendedor Eyeconic",
            html: htmlMail(nombre, codigo),
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        return next(new AppError('Error al intentar enviar el código del vendedor por correo: ' + error.message, '500'))
    }
}

const htmlMail = (nombre, codigoVentas) => {
    return ` 
     <div data-link='class{getClass:IsBodyExpanded}' class='c-ReadMessagePartBody'>
      <div class='readMsgBody'>
      <div data-link='class{:~tag.cssClasses(PlainText, IsContentFiltered)}' class='ExternalClass MsgBodyContainer' id='bodyreadMessagePartBodyControl262f'>
      <title>Notificación automática</title>
      <style>
          .ExternalClass {
              font-family:Arial,sans-serif;
              line-height:22px;
              font-size:15px;
              color:#717171;
              font-weight:normal;
          }

          @media only screen and (max-device-width: 600px) {
              .ExternalClass table[class='ecxtable'], .ExternalClass td[class='ecxcell'] {
              width:96% !important;
              }
          }

          .ExternalClass h2 {
              font-family:'Roboto',Helvetica,Arial,sans-serif;
              font-weight:normal !important;
          }
      </style>
      <br />
      <table width='100%' cellspacing='0' cellpadding='5' border='0' bgcolor='#f5f5f5'>
          <tbody>
              <tr>
                  <td width='100%' bgcolor='#f5f5f5'>
                      <table width='600' cellspacing='0' cellpadding='0' border='0' align='center' style='font-family:Arial,sans-serif;line-height:22px;font-size:15px;color:#717171;font-weight:normal;' class='table'>
                          <tbody>
                              
                              <tr>
                                  <td width='600' bgcolor='#ffffff' style='padding-top:30px;padding-bottom:10px;padding-right:30px;padding-left:30px;border-width:1px;border-style:solid;border-color:#e0e0e0;border-top:none;' class='ecxcell'>
                                      <table cellspacing='0' cellpadding='0' border='0' width='100%'>
                                          <tbody>
                                              <tr>
                                                  <td colspan='2' style='padding-right:10px;text-align:center;'><img src='${imageEyeconic}' /><br /></td>
                                              </tr>
                                              <tr> 
                                                <td> 
                                                  <h4> Hola ${nombre}.</h4> 
                                                </td> 
                                              </tr>
                                              <tr> 
                                                <td> 
                                                  Por este medio te adjuntamos tu código de vendedor.<br><br>
                                                </td> 
                                              </tr>
                                           
                                              ${codigoVentas ? `<tr><td>Código de vendedor: ${codigoVentas}</td></tr>` : ''}
                                              <tr> 
                                                <td> 
                                                <p>
                                                <strong> Nota: Este código es único y te recomendamos no compartirlo con nadie.</strong> 
                                                </p>
                                                </td> 
                                              </tr>
                                          </tbody>
                                      </table>
                                      <table cellspacing='0' cellpadding='0' border='0'>
                                          <tbody>
                                              <tr>
                                                  <td><img width='1' height='20' border='0' src='https://dub127.mail.live.com/Handlers/ImageProxy.mvc?bicild=&amp;canary=3mQTZFk6YNqml8hCd0vdO1b4DA82dgeFxTR5lgiM24Y%3d0&amp;url=http%3a%2f%2fcursosage.edu20.org%2fimages%2fspacer.gif'></td>
                                              </tr>
                                              <tr>
                                                  <td style='border-top-width:1px;border-top-style:solid;border-top-color:#e0e0e0;padding-top:15px;'>
                                                      <p>Esto es sólo una notificación, no debe responder a este correo.</p>
                                                  </td>
                                              </tr>
                                              
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
     `
}

module.exports = {enviarCodigoVendedor}