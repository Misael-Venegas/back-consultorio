const express = require('express')
const { authenticateToken } = require('./middlewares/authenticateToken')
const { } = require('./helpers/autenticationToken')
require('dotenv').config()
const cors = require('cors')
const path = require('path'); // Importación correcta
const app = express()
const userRoutes = require('./routes/userRoutes')
const routeWithoutSecurity = require('./routes/routesWithoutAutentication')
const routePayment = require('./routes/paymentRoutes')
const globalErrorHandler = require('./middlewares/errorHandler')
const { ventaOnline, eliminarCliente } = require('./controllers/pagos/pagos.controller')

//Iniucia configuracion del server 

app.use(express.json())
app.use(cors())
const port = process.env.PORT
const HOST = '0.0.0.0'
const imagePath = path.join(__dirname, "../../public/imagenesProductos");

app.use("/imagenesProductos", express.static(imagePath));

//Hook que esta a la escucha de las respuestas por transacciones de Stripe
app.post('/webhook', express.json({ type: 'application/json' }), async (request, response, next) => {
    const event = request.body;

    switch (event.type) {
        case 'checkout.session.completed':

            const session = event.data.object;

            const total = session.amount_total / 100
            const cliente = session.metadata.cliente
            const productos = session.metadata.productos
            await ventaOnline(cliente, productos, total, next)

            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;

            break;

        default:

            //const sessionn = event.data.object;
            //console.log(sessionn.metadata)
            //  await eliminarCliente(cliente, next)
            console.log(`Unhandled event type ${event.type}`);
            break;
    }


    response.json({ received: true });
});

app.use('/paymentRoute', routePayment)

app.use('/users', routeWithoutSecurity)

app.use('/', authenticateToken, userRoutes)

app.use(globalErrorHandler)


/*app.listen(port, () => {
    console.log(`Server is ready in PORT: ${port}`)
})*/



app.listen(port, HOST, () => {
    console.log(`Server is ready in PORT: ${port}`)
})

