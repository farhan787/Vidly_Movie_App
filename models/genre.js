const mongoose = require('mongoose')
const Joi = require('joi')

const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
})

const Genre = mongoose.model('Genre', GenreSchema)

function validateGenre(reqGenre, objId){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(reqGenre, schema)
}

module.exports = {
    Genre, GenreSchema, validateGenre
}
