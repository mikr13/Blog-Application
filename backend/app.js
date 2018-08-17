
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

var uri = "mongodb://127.0.0.1:27017/mean-blog";
mongoose.connect(uri , {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log(`Connection failed with error: ${err}`);
  });

const Post = require('./models/posts.model');

/*
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

/*
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'loremipsummihir',
  saveUninitialized: true,
  resave: true
}));

//Express validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
*/

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((result) => {
      res.status(201).json({
        message: 'Post added successfully!',
        id: resule._id
      });
  });
});


app.get('/api/posts', (req, res, next) => {
  var query = Post.find();
  var promise = query.exec();
  promise.then((q_posts) => {
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: q_posts
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  var id= req.params.id;
  var query = Post.deleteOne({_id: req.params.id});
  var promise = query.exec();
  promise.then(() => {
    res.status(201).json({
      message: `Post with id: ${id} deleted successfully!`
    });
  });
});

/*
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: err.message
  });
});
*/

module.exports = app;
