const mongoose = require('mongoose')
const Joi = require('joi')
const Fawn = require('fawn')
const moment = require('moment')

Fawn.init(mongoose)

const rentalSchema = mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 20
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

rentalSchema.statics.lookup = function(customerId, movieId) {
        return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    })
}

rentalSchema.statics.rentalExist = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
        'dateReturned': { $exists: false }
    })
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date()

    const rentalDays = moment().diff(this.dateOut, 'days')
    rentalFee = rentalDays * this.movie.dailyRentalRate

    if(rentalFee === 0)
        rentalFee = this.movie.dailyRentalRate

    this.rentalFee = rentalFee
}

const Rental = mongoose.model('Rental', rentalSchema)

function validateRental(reqRental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(reqRental, schema)
}

module.exports = {
    Rental, validateRental
}


