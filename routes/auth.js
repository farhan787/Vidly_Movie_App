const express = require('express')
const router = express.Router()
const Joi = require('joi')
const bcrypt = require('bcrypt')
const validate = require('../middleware/validate')

const { User } = require('../models/user')

router.post('/', validate(validateAuth), async (req, res) => {

    let user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken()
    res.send(token)
})

function validateAuth(reqAuth){
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    }
    return Joi.validate(reqAuth, schema)
}

module.exports = router