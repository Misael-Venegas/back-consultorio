const express = require('express')
const { authenticateToken } = require('./middlewares/authenticateToken')
const { } = require('./helpers/autenticationToken')
require('dotenv').config()
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/userRoutes')
const routeWithoutSecurity = require('./routes/routesWithoutAutentication')
//Iniucia configuracion del server 
app.use(express.json())
app.use(cors())

const port = process.env.PORT

app.use('/users', routeWithoutSecurity)
try {
    app.use('/', authenticateToken, userRoutes)
} catch (error) {
    throw new Error(error.message)
}

app.listen(port, () => {
    console.log(`Server is ready in PORT: ${port}`)
})
