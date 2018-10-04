const express = require('express')
const mongoose = require('mongoose')
const home = require('./routes/home')
const genres = require('./routes/genres')
const customers = require('./routes/customers')

const port = process.env.PORT || 3000

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to mongodb'))
    .catch(err => console.error('Could not connect to mongodb...'))

const app = express()
app.use(express.json())

app.use('/', home)
app.use('/api/genres', genres)
app.use('/api/customers', customers)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
