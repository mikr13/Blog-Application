const express = require('express');
const multer = require('multer');
const fs = require('fs');

const Post = require('../models/posts.model');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid) {
            error = null;
        }
        cb(error, 'backend/uploads');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});
  
const upload = multer({ storage: storage });


router.get('/', (req, res, next) => {
    const pageSize = +req.query.pS; // + converts to int
    const currentPage = +req.query.p;
    var query = Post.find();
    if(pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
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

router.post('/', upload.single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        name: req.body.name,
        email: req.body.email,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/uploads/' + req.file.filename
    });
    post.save().then((result) => {
        res.status(201).json({
            message: 'Post added successfully!',
            post: {
                ...result,
                id: result._id
            }
        });
    });
});

router.put('/:id', upload.single('image'), (req, res, next) => {
    var imagePathnew = '';
    if(req.file) {
        Post.findById(req.params.id, (err, post) => {
            imagePath = post.imagePath;
            function removePrefix(prefix,s) {
                return s.substr(prefix.length);
            }
            imagePath = removePrefix('http:/localhost:3030/uploads//',imagePath);
            fs.unlink('F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\uploads\\' + imagePath, (err) => {
                if (err) throw err;
                console.log(imagePath + ' was deleted');
            });
        });
        const url = req.protocol + '://' + req.get('host');
        imagePathnew = url + '/uploads/' + req.file.filename;
    };
    const post = {
        name: req.body.name,
        email: req.body.email,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePathnew
    };
    Post.updateOne({_id: req.params.id}, post).then(result => {
        res.status(200).json({
            message: "Update successfull"
        });
    });
});

router.delete('/:id', (req, res, next) => {
    var imagePath;
    Post.findById(req.params.id, (err, post) => {
        imagePath = post.imagePath;
        function removePrefix(prefix,s) {
            return s.substr(prefix.length);
        }
        imagePath = removePrefix('http:/localhost:3030/uploads//',imagePath);
        var query = Post.deleteOne({_id: req.params.id});
        var promise = query.exec();
        promise.then(() => {
            fs.unlink('F:\\MEAN\\Project with Angular 2+\\Project1\\backend\\uploads\\' + imagePath, (err) => {
                if (err) throw err;
                console.log(imagePath + ' was deleted');
            });
            res.status(201).json({
            message: `Post deleted successfully!`
            });
        });
    });
});

module.exports = router;