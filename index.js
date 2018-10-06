const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


const home = require('./routes/home')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')

const port = process.env.PORT || 3000

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to mongodb'))
    .catch(err => console.error('Could not connect to mongodb...'))

const app = express()
app.use(express.json())

app.use('/', home)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
