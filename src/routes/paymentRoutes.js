const express = require('express')
const Stripe = require('stripe')
const bodyParser = require('body-parser')
const router = express.Router()


const stripe = new Stripe(process.env.SECRET_STRIPE_KEY)
const { payment, ventaOnline } = require('../controllers/pagos/pagos.controller')

router.post('/create-checkout-session', payment)


module.exports = router

