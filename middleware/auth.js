// authorisation

const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')

    // 401 means client doesn't have authentication credentials to access this resource
    if(!token) return res.status(401).send('Access denied. No token provided')

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        console.log(decoded);
        req.user = decoded  // set the user object in the request having decoded jwt
        next()
    }catch(ex){
        res.status(400).send('Invalid Token')
    }
}