const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const { Genre } = require('../models/genre')
const { Movie, validateMovie } = require('../models/movie')

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title')
    if(!movies) return res.status(404).send('No movies available')

    res.send(movies)
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if(!movie) return res.status(404).send('No movie belongs to this id')

    res.send(movie)
})

router.post('/', auth, async (req, res) => {
    const { error } = validateMovie(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('Invalid genre')

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    const result = await movie.save()
    res.send(result)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validateMovie(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('Invalid genre')

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true})

    res.send(movie)
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const result = await Movie.findByIdAndRemove(req.params.id)
    if(!result) return res.status(400).send('Invalid movie Id')

    res.send(result)
})

module.exports = router