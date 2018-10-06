const mongoose = require('mongoose')
const Joi = require('joi')
const { GenreSchema } = require('./genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255      // because we don't want malicious client to send some large string that may cause problem to our application
    },
    genre: {
        type: GenreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,         // we don't want negative, so set minimum to 0
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(reqMovie){
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }
    return Joi.validate(reqMovie, schema)
}

module.exports = {
    Movie, validateMovie
}