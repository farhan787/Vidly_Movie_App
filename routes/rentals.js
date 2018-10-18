const express = require('express')
const router = express.Router()
const Fawn = require('fawn')
const auth = require('../middleware/auth')

const { Rental, validateRental } = require('../models/rental')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('customer.name')
    if(!rentals) return res.status(404).send("No rentals")
    
    res.send(rentals)
})

router.post('/', auth, async (req, res) => {
    const { error } = validateRental(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
    if(!customer) return res.status(400).send('Invalid Customer')

    const movie = await Movie.findById(req.body.movieId)
    if(!movie) return res.status(400).send('Invalid Movie')

    const exist = await Rental.rentalExist(req.body.customerId, req.body.movieId)
    if(exist) return res.status(400).send('You already have this movie on rent.')

    if(movie.numberInStock === 0) return res.status(400).send(`${movie.title} not in stock`)

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
        .run()
        res.send(rental)
    }catch(ex){
        console.log(ex)
        res.status(500).send('Something Failed inside server')
    }

})

module.exports = router;