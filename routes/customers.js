const express = require('express')
const router = express.Router()

const { Customer, validateCustomer } = require('../models/customer')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    if(!customers) return res.status(404).send('No course availabe')
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send(`No customer belongs to ${req.params.id} id`)
    res.send(customer)
})

router.post('/', auth, async (req, res) => {
    const { error } = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })
    
    const result = await customer.save()
    res.send(result)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }
    }, { new: true })
    
    if(!updatedCustomer) return res.status(404).send(`No customer belongs to ${req.params.id} id`)

    res.send(updatedCustomer)
})

router.delete('/:id', [auth, admin],async (req, res) => {
    const deletedCustomer = await Customer.findByIdAndRemove(req.params.id)
    if(!deletedCustomer) return res.status(404).send(`No customer belongs to ${req.params.id} id`)

    res.send(deletedCustomer)
})

module.exports = router