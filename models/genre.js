const mongoose = require('mongoose')
const Joi = require('joi')

const Genre = mongoose.model('Genre', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
}))

function validateGenre(reqGenre){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(reqGenre, schema)
}

module.exports = {
    Genre, validateGenre
}
