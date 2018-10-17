const express = require('express')
const router = express.Router()
const moment = require('moment')
const Joi = require('joi')
const auth = require('../middleware/auth')
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')
const validate = require('../middleware/validate')

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
    if(!rental) return res.status(404).send('Rental not found')

    const existRental = await Rental.rentalExist(req.body.customerId, req.body.movieId)
    if(!existRental) return res.status(400).send('Return already processed')

    existRental.return();
    await existRental.save()
    
    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    })

    return res.send(rental)
})

function validateReturn(reqReturn){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(reqReturn, schema)
}

module.exports = router