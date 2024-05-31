const jwt = require('jsonwebtoken')
require('dotenv').config()


const generateToken = (usuarios) => {
    try {
        // Asumiendo que quieres usar el primer usuario del array
        return jwt.sign(usuarios[0], process.env.JWT_SECRET);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { generateToken }