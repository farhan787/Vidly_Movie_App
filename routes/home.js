const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Vidly Movies Genre App')
})

module.exports = router