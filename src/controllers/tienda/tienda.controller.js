const AppError = require("../../helpers/appError")
const { db } = require('../../config/bd.config')
const Stripe = require('stripe')
require('dotenv').config();


const obtenerProductosTienda = async (req, res, next) => {
    try {
        const respuesta = await db.any(`
                        SELECT * FROM inventario.producto pr
                        INNER JOIN inventario.imagenes img ON img.id = pr.id_image
                        WHERE pr.venta_externa = true 
                     `)

        return res.status(200).json(respuesta)
    } catch (error) {
        next(new AppError("Error al intentar obtner los productos"))
    }
}

const realizarPagoEnLinea = async (req, res) => {
    try {

        const stripe = Stripe(process.env.SECRET_STRIPE_KEY)

        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        next(new AppError(error.message))
    }
}

module.exports = { obtenerProductosTienda, realizarPagoEnLinea }