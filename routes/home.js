const express = require('express')
const router = express.Router()
const path = require('path')

const public = path.join(__dirname, '../public/')
router.use(express.static(public))

router.get('/', (req, res) => {
    res.sendFile('index.html')
})

module.exports = router