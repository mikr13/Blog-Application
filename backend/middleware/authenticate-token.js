const jwt = require('jsonwebtoken');

const token_sec = require('../config/secret');

module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, token_sec.string_sec);
    // adding decodedToken to request to be accessed in post.routes.js
    req.userData = {email: decodedToken.email, userID: decodedToken.userID, phone: decodedToken.phone}
    next();
    } catch(error) {
        res.status(401).json({
            message: "Authentication failed.\nPlease Signup or login."
        });
    }
}