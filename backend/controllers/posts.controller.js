const fs = require('fs');

const Post = require('../models/posts.model');


exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.ps; // + converts to int
    const currentPage = +req.query.p;
    const query = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    var promise = query.exec();
    promise.then((q_posts) => {
        fetchedPosts = q_posts;
        return Post.count();
    })
    .then((count) => {
        res.status(200).json({
            message: `Posts fetched succesfully!`,
            posts: fetchedPosts,
            postCounts: count
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({
            message: `Couldn't fetch post due to some error at our side, try again later!`,
            error: error
        })
    });
}

exports.getPostByID = (req, res, next) => {
    var query = Post.findById(req.params.id);
    var promise = query.exec();
    promise.then((post) => {
        if (post) {    
            res.status(200).json({
                post: post
            })
        } else {
            res.status(404).json({message: `Post not found`});
        }
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: `Cannot get the post with id: ${query}, a unknown error on our side`,
            error: error
        })
    })
}

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        name: req.body.name,
        email: req.body.email,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/uploads/' + req.file.filename,
        creatorID: req.userData.userID
    });
    post.save().then((result) => {
        res.status(201).json({
            message: `Post added successfully!`,
            post: {
                ...result,
                id: result._id
            }
        });
    })
    .catch(error => {
        console.log(error);
        fs.unlink(`F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\uploads\\${req.file.filename}`, (err) => {
            if (err) throw err;
        });
        res.status(500).json({
            message: `Some error occured while creating post, please check back later.`,
            error: error
        });
    });
}

exports.updatePost = (req, res, next) => {
    var imagePathnew = '';
    if(req.file) {
        Post.findById(req.params.id, (err, post) => {
            imagePath = post.imagePath;
            function removePrefix(prefix,s) {
                return s.substr(prefix.length);
            }
            imagePath = removePrefix('http:/localhost:3030/uploads//',imagePath);
            fs.unlink(`F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\uploads\\${imagePath}`, (err) => {
                if (err) throw err;
            });
        });
        const url = req.protocol + '://' + req.get('host');
        imagePathnew = url + '/uploads/' + req.file.filename;
    };
    const post = new Post({
        _id: req.params.id,
        name: req.body.name,
        email: req.body.email,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePathnew || req.body.image,
        creatorID: req.userData.userID
    });
    Post.updateOne({_id: req.params.id, creatorID: req.userData.userID}, post).then(result => {
        if(result.n > 0) {
            res.status(200).json({
                message: `Post ${post.name} updated successfully.`
            });
        } else {
            res.status(401).json({
                message: `Not authorized to update.`
            });
        }   
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: `Some error occured while updating post, please check back later.`,
            error: error
        });
    });
}

exports.deletePost =  (req, res, next) => {
    var imagePath;
    Post.findById(req.params.id, (err, post) => {
        imagePath = post.imagePath;
        function removePrefix(prefix,s) {
            return s.substr(prefix.length);
        }
        imagePath = removePrefix('http:/localhost:3030/uploads//',imagePath);
        var query = Post.deleteOne({_id: req.params.id, creatorID: req.userData.userID});
        var promise = query.exec();
        promise.then((result) => {
            if(result.n > 0) {
                if(imagePath) {
                    fs.unlink(`F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\uploads\\${imagePath}`, (err) => {
                        if (err) throw err;
                    });
                };
                res.status(201).json({
                    message: `Post deleted successfully!`
                });
            } else {
                res.status(401).json({
                    message: `Not authorized to update.`
                })
            }
        }).catch((error) => {
            console.log(error);
            res.status(500).json({
                message: `Some error occured while deleting post, please check back later.`,
                error: error
            });
        });
    });
}