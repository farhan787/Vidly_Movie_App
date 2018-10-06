const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    }
}))

function validateCustomer(requestBody){
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(25).required()
    }
    return Joi.validate(requestBody, schema)
}

module.exports = {
    Customer, validateCustomer
}