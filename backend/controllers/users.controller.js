const fs = require('fs');
const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/users.model');
const string_sec = require('../config/secret').string_sec;

const saltRounds = 10;

// Create a schema
const schema = new passwordValidator();
 
// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().symbols()                                // Must have symbol
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'qwerty123']); // Blacklist these values


exports.createUser = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const imagePath = url + '/users-image/' + req.file.filename;
    if(schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, saltRounds).then((hash) => {
            const user = new User({
                name: req.body.name,
                dob: req.body.dob,
                email: req.body.email,
                password: hash,
                phone: req.body.phone,
                imagePath: imagePath,
                tagline: req.body.tagline,
                content: req.body.content
            });
            user.save().then((result) => {
                return res.status(201).json({
                    message: `User registered successfully, sign in to continue.`,
                    user: user
                });
            }).catch(error => {
                fs.unlink(`F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\users-image\\${req.file.filename}`, (err) => {
                    if (err) throw err;
                });
                return res.status(500).json({
                    message: `User already registered with this ${req.body.email}, use another email or if it's your then sign in to continue`,
                    error: error
                });
            });
        }).catch(error => {
            fs.unlink(`F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\users-image\\${req.file.filename}`, (err) => {
                if (err) throw err;
            });
            return res.status(503).json({
                message: `Some error occured while registering user, please check back later.`,
                error: error
            });
        });
    } else {
        fs.unlink(`F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\users-image\\${req.file.filename}`, (err) => {
            if (err) throw err;
        });
        return res.status(406).json({
            message: `Password must have 8 min characters containing atleast 1 numeric, 1 uppercase character, 1 lowercase character and 1 special character`
        })
    }
}

exports.loginUser = (req, res, next) => {
    let userData;
    User.findOne({ email: req.body.email }).then(user => {
        if(!user) {
            return res.status(401).json({
                message: `Authentication failed. User doesn't exists!`
            });
        }
        userData = user;
        return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
        if(!result) {
            return res.status(401).json({
                message: `Authentication failed. Check email or password or their combination`
            });
        }
        const token = jwt.sign({email: userData.email, userID: userData._id, phone: userData.phone}, string_sec, { expiresIn: '3h' });
        res.status(200).json({
            user: {name: userData.name, email: userData.email, userID: userData._id, imagePath: userData.imagePath},
            token: token,
            expiresIn: 10800,
            message: `Logged in successfully.`
        })
    }).catch(err => {
        return res.status(503).json({
            message: `Some error occured while registering user, please check back later.`,
            error: err
        });
    });
}