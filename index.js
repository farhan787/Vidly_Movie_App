const express = require('express')
const home = require('./routes/home')
const genres = require('./routes/genres')
const Joi = require('joi')

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())

app.use('/', home)
app.use('/api/genres', genres)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
