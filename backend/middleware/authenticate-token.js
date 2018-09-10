const jwt = require('jsonwebtoken');

const token_sec = require('../config/secret');

module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, token_sec.string_sec);
    next();
    } catch(error) {
        res.status(401).json({
            message: "Authentication failed.\nPlease Signup or login."
        });
    }
}