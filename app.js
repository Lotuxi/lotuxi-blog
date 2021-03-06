var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(session({
    secret: 'f1uff3rnutt3er',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

//user DB
var url = 'mongodb://localhost:27017/lotuxi-blog';
var posts = mongoose.createConnection('mongodb://localhost:27017/posts');
mongoose.connect(url);




//require models
var posts = require('./models/posts');

var models = {};
models['posts'] = posts;

app.use(function(req, res, next) {
  req.models = models;
  next();
});



// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;