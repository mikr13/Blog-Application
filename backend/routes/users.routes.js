const express = require('express');

const multerUpload = require('../middleware/user-images-upload');

const UserController = require('../controllers/users.controller');

const router = express.Router();


router.post('/signup', multerUpload, UserController.createUser);

router.post('/login', UserController.loginUser);

module.exports = router;