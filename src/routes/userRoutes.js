const express = require('express')
const router = express.Router()
const { db } = require('../coonfig/bd.config')

router.get('/', async (req, res) => {
    const respuesta = await db.any(`select * from usuarios.rol`)
    res.send(respuesta)
}
).get('/prueba', (req, res) => {
    res.send('prueba de rutas secundarias')
})

module.exports = router