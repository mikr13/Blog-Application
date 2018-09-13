const express = require('express');

const checkAuth = require('../middleware/authenticate-token');
const multerUpload = require('../middleware/post-images-upload');

const PostController = require('../controllers/posts.controller');

const router = express.Router();


router.get('/', PostController.getPosts);

router.get('/:id', PostController.getPostByID);

router.post('/', checkAuth, multerUpload, PostController.createPost);

router.put('/:id', checkAuth, multerUpload, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;