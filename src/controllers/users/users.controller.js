const AppError = require('../../helpers/appError')
const { generateToken } = require('../../helpers/autenticationToken')
const { db } = require('../../config/bd.config')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const { enviarContrasenhaRegistro } = require('../../helpers/mails/mailContrasenhaRegistro')
const { enviarCodigoVendedor } = require('../../helpers/mails/mailCodigoVendedor')
const { correoRecuperarContrasenha } = require('../../helpers/mails/mailRecuperarContrasenha')
const inicarSesion = async (req, res, next) => {
  try {
    const { usuario, contrasena } = req.body;

    if (usuario === "root") {
      if (contrasena === "abcd.1234") {
        const usr = {
          nombre: usuario,
          correo: "",
          telefono: "",
          rol: "root",
          fechaCumpleanhos: "",
        };
        const token = generateToken(usr);

        return res.status(200).json({ token });
      } else {
        return next(new AppError("Contraseña incorrecta", 401));
      }
    }

    const usr = await db.oneOrNone(
      `select us.id, us.nombre, us.a_paterno, us.a_materno, us.correo,
      us.telefono, us.id_rol, us.fecha_cumpleanhos, us."password", us.codigo_vendedor, r.rol
      from usuarios.users us
      inner join usuarios.rol r on r.id = us.id_rol WHERE us.correo = '${usuario}' ORDER BY us.nombre`
    );

    if (!usr) {
      return next(new AppError("El usuario no existe", 500));
    }

    const validarContrasebhia = await bcryptjs.compare(
      contrasena,
      usr.password
    );
    if (validarContrasebhia) {
      const datosToken = {
        id: usr.id,
        nombre: usr.nombre,
        a_paterno: usr.a_paterno,
        a_materno: usr.a_materno,
        correo: usr.correo,
        telefono: usr.telefono,
        id_rol: usr.id_rol,
        fecha_cumpleanhos: usr.fecha_cumpleanhos,
        rol: usr.rol
      };
      const token = generateToken(datosToken);
      return res.status(200).json({ token });
    }
    return next(new AppError("La contraseña es incorrecta", 500));
  } catch (error) {
    next(new AppError("Error interno del servidor", 500));
  }
};

const obtenerRolesUsuarios = async (req, res, next) => {
  try {
    const respuesta = await db.any(`select * FROM usuarios.rol ORDER BY rol`);
    return res.status(200).json(respuesta);
  } catch (error) {
    next(new AppError("Error interno del servidor: " + error, 500));
  }
};

const agregarUsuario = async (req, res, next) => {
  try {
    const { nombre, aPaterno, aMaterno, correo, telefono, rol, cumpleanhos, codigoVendedor } =
      req.body;
    const dataUsr = await db.any(
      `select * from usuarios.users usr where usr.correo = '${correo}'`
    );

    if (dataUsr.length > 0) {
      return next(new AppError('Este correo ya fue registrado con otro usuario', 400))
    }

    let codigoVentas = null;

    if (codigoVendedor) {
      codigoVentas = crypto.randomBytes(2).toString('hex')
    }

    const cadena = crypto.randomBytes(2).toString('hex')
    const contrasenha = bcryptjs.hashSync(cadena, 8)



    await db.oneOrNone(`INSERT INTO usuarios.users(
             nombre, a_paterno, a_materno, correo, telefono, id_rol, fecha_cumpleanhos, password, codigo_vendedor)
            VALUES ('${nombre}', '${aPaterno}', '${aMaterno}', '${correo}', '${telefono}', '${rol}',
             '${cumpleanhos}', '${contrasenha}', ${codigoVendedor ? `'${codigoVentas}'` : null})`)

    await enviarContrasenhaRegistro(next, cadena, correo, nombre + ' ' + aPaterno + ' ' + aMaterno, codigoVentas)

    return res.status(200).json({ response: 'succes' })
  } catch (error) {

    next(new AppError('Error interno del servidor: ' + error, 500))
  }
}


const getUsuarios = async (req, res, next) => {
  try {
    const users =
      await db.any(`select usr.id, usr.nombre, usr.a_paterno,usr.a_materno, usr.correo, usr.telefono, usr.fecha_cumpleanhos, usr.codigo_vendedor, r.rol, usr.id_rol from usuarios.users usr
                                    INNER JOIN usuarios.rol r ON r.id = usr.id_rol	
                                    ORDER BY usr.nombre`);
    return res.status(200).json(users);
  } catch (error) {
    next(new AppError("Error al intentar obtener los usuarios: " + error, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    await db.oneOrNone(`DELETE FROM usuarios.users where id='${idUsuario}'`);
    return res.status(200).json({ Success: "Ok" });
  } catch (error) {
    next(new AppError("Al intenr eliminar el usuario " + error, 500));
  }
};

const editarUsuario = async (req, res, next) => {
  try {
    const {
      id,
      nombre,
      aPaterno,
      aMaterno,
      correo,
      telefono,
      rol,
      cumpleanhos,
      codigoVendedor
    } = req.body;

    let codigoVentas = null

    if (codigoVendedor) {
      const { codigo_vendedor } = await db.oneOrNone(`SELECT usr.codigo_vendedor from usuarios.users usr where usr.id = '${id}'`)
      if (codigo_vendedor) {
        codigoVentas = codigo_vendedor;
      } else {
        codigoVentas = crypto.randomBytes(2).toString('hex')
        await enviarCodigoVendedor(next, nombre + ' ' + aPaterno + ' ' + aMaterno, correo, codigoVentas)
      }
    }

    await db.oneOrNone(`UPDATE usuarios.users SET nombre='${nombre}', a_paterno='${aPaterno}', a_materno='${aMaterno}', correo='${correo}',
        telefono='${telefono}', id_rol='${rol}', fecha_cumpleanhos='${cumpleanhos}',
       codigo_vendedor = ${codigoVendedor ? `'${codigoVentas}'` : null} WHERE id='${id}'`);

    return res.status(200).json({ succes: "ok" });
  } catch (error) {
    next(new AppError("Error: Al intentar eliminar el usuario " + error, 500));
  }
};

const cambiarContrasenhia = async (req, res, next) => {
  try {

    const { contrasenha } = req.body
    const { id } = req.user

    const encriptarContrasenhia = bcryptjs.hashSync(contrasenha, 8)

    await db.oneOrNone(`UPDATE usuarios.users SET password = '${encriptarContrasenhia}' WHERE id = '${id}'`)
    return res.status(200).json({ sucess: 'ok' })
  } catch (error) {
    next(new AppError("Error: Al intenatar cambiar la contraseña: " + error.message, 500))
  }
}

const recuperarContrasenha = async (req, res, next) => {
  try {
    const { correoElectronico } = req.params

    const correoUsuario = await db.oneOrNone(`select usr.correo,  usr.nombre from usuarios.users usr WHERE usr.correo = '${correoElectronico}'`)
    console.log(correoUsuario)
    if (correoUsuario == null) {
      throw new Error('El correo que ingresaste no existe')
    }

    const cadena = crypto.randomBytes(2).toString('hex')
    const contrasenha = bcryptjs.hashSync(cadena, 8)

    await correoRecuperarContrasenha(next,correoUsuario.nombre, correoElectronico, cadena)

    await db.oneOrNone(`UPDATE usuarios.users SET password = '${contrasenha}' WHERE correo = '${correoElectronico}'`)

    return res.status(200).json({succes: 'ok'})
  } catch (error) {
    next(new AppError(error.message, 500))
  }
}

module.exports = {
  inicarSesion,
  agregarUsuario,
  obtenerRolesUsuarios,
  getUsuarios,
  deleteUser,
  editarUsuario,
  cambiarContrasenhia,
  recuperarContrasenha
};
