const jwt = require('jsonwebtoken');
const AppError = require('./appError');
require('dotenv').config()


const generateToken = (usuarios, next) => {
    try {
        // Asumiendo que quieres usar el primer usuario del array
        return jwt.sign(usuarios[0], process.env.JWT_SECRET);
    } catch (error) {
        next(new AppError('Error al intentar crear el token', 500))
    }
}

module.exports = { generateToken }