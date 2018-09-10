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

const mongoose_uri = require('./config/secret');

mongoose.connect(mongoose_uri.uri , {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log(`Connection failed with error: ${err}`);
  });

const postsRoutes = require('./routes/posts.routes');
const usersRoutes = require('./routes/users.routes');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/users-image', express.static(path.join(__dirname, '/users-image')));

/*
app.use(cookieParser());

//Express session
app.use(session({
  secret: 'loremipsummihir',
  saveUninitialized: true,
  resave: true
}));
*/

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


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
