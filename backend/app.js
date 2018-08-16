
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const session = require('express-session');

const app = express();

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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully!'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [{
      name: 'Mihir Kumar',
      age: '21',
      email: 'mihir.kumar13ayu@gmail.com',
      id: 'fb1sh12dwu',
      title: 'Passion for Ayushee',
      content: 'I love her!!!'
    },
    {
      name: 'Ayushee',
      age: '21',
      email: 'ayusheegupta.04@gmail.com',
      id: 'jb1ah17dcv',
      title: 'Passion for Mihir',
      content: 'I love him!!!'
    }
  ];
  res.status(200).json({
    message: "Posts fetched succesfully!",
    posts: posts
  });
  //next();
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
