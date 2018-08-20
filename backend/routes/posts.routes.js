const express = require('express');

const router = express.Router();

const Post = require('../models/posts.model');


router.get('/', (req, res, next) => {
    var query = Post.find();
    var promise = query.exec();
    promise.then((q_posts) => {
        res.status(200).json({
            message: "Posts fetched succesfully!",
            posts: q_posts
        });
    });
});

router.get('/:id', (req, res, next) => {
    var query = Post.findById(req.params.id);
    var promise = query.exec();
    promise.then((post) => {
        if (post) {    
            res.status(200).json({
                post: post
            })
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    })
});

router.post('/', (req, res, next) => {
    const post = new Post({
        name: req.body.name,
        age: req.body.age || null,
        email: req.body.email,
        title: req.body.title,
        content: req.body.content
    });
    post.save().then((result) => {
        res.status(201).json({
            message: 'Post added successfully!',
            id: result._id
        });
    });
});

router.put('/:id', (req, res, next) => {
    const post = new Post({
        name: req.body.name,
        age: req.body.age,
        _id: req.body.id,
        email: req.body.email,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id: req.params.id}, post).then(result => {
        res.status(200).json({
            message: "Update successfull"
        });
    });
});

router.delete('/:id', (req, res, next) => {
    var id= req.params.id;
    var query = Post.deleteOne({_id: req.params.id});
    var promise = query.exec();
    promise.then(() => {
        res.status(201).json({
        message: `Post deleted successfully!`
        });
    });
});

module.exports = router;