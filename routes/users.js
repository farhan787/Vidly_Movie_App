const express = require('express')
const router = express.Router()
const _ = require('lodash')     // for picking selective properties from objects
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

const { User, validateUser } = require('../models/user')

// for my use -- personal  testing
router.get('/', async (req, res) => {
    const users = await User.find().select('-password -__v').sort('name')
    if(!users) return res.status(400).send('No users')  
    res.send(users)
})

// for getting currently logged in user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user) 
})

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // To check if the user with that email already exist or not
    let user = await User.findOne({ email: req.body.email })
    if(user) return res.status(400).send('User with this email already exists')

    // if user doesn't exist then create a new user
    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})


module.exports = router