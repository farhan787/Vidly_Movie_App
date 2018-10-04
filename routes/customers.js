const express = require('express')
const router = express.Router()

const { Customer, validateCustomer } = require('../models/customer')

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    if(!customers) return res.status(404).send('No customer availabe')
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send(`Invalid Customer Id`)
    res.send(customer)
})

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })
    customer = await customer.save()

    res.send(customer)
})

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }
    }, { new: true })
    
    if(!updatedCustomer) return res.status(404).send(`Invalid Customer Id`)

    res.send(updatedCustomer)
})

router.delete('/:id', async (req, res) => {
    const deletedCustomer = await Customer.findByIdAndRemove(req.params.id)
    if(!deletedCustomer) return res.status(404).send(`Invalid Customer Id`)

    res.send(deletedCustomer)
})

module.exports = router