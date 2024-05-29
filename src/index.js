const express = require('express')
const {db} =require ( './coonfig/bd.config')
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server is ready in PORT: ${port}`)
})
