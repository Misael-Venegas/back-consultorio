const jwt = require('jsonwebtoken')
require('dotenv').config()


function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401); // No autorizado
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Prohibido
            }
            req.user = user;
            next()
        })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { authenticateToken }