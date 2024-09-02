const express = require('express')
const { authenticateToken } = require('./middlewares/authenticateToken')
const { } = require('./helpers/autenticationToken')
require('dotenv').config()
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/userRoutes')
const routeWithoutSecurity = require('./routes/routesWithoutAutentication')
const globalErrorHandler = require('./middlewares/errorHandler')
//Iniucia configuracion del server 
app.use(express.json())
app.use(cors())

const port = process.env.PORT
//const HOST = '0.0.0.0'
app.use('/users', routeWithoutSecurity) // routes that needn't security 

app.use('/', authenticateToken, userRoutes)

app.use(globalErrorHandler)


app.listen(port, () => {
    console.log(`Server is ready in PORT: ${port}`)
})

/*
app.listen(port, HOST, () => {
    console.log(`Server is ready in PORT: ${port}`)
})
*/
