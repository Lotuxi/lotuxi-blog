var express = require('express');
var router = express.Router();

var passport = require('passport');
var posts = require('../models/posts.js'); //specify post model
var flash = require('connect-flash');


//get homepage
router.get('/', function(req, res, next) {
    posts.find({}).sort('-created_at').exec(function(err, postDocs) {
        if (err) { return next(err); }
        return res.render('index', { postly: postDocs });
    });
});

// save posts
router.post('/saveposts', isLoggedIn, function(req, res, next) {

    console.log(req.body.created_at);
    var date = req.body.created_at || Date.now();


    req.body.created_at = [];
    req.body.created_at.push(date);

    //create new post
    var newPost = posts(req.body);

    //request saved posts
    newPost.save(function(err) {
        if (err) {
          if (err.title == 'Validation error') {
            req.flash('error', 'Invalid data');
            return res.redirect('/')
          }

          if (err.code == 11000) {
              req.flash('error', 'A post with that title already exists');
          }
            return next(err);
        }
        res.status(201);//created
        return res.redirect('/');
    });
});

//TODO add post deletion


//TODO add pagination
//posts.paginate({}, { page: 5, limit: 10 }, function(err, result) {
//    // result.docs
//    // result.total
//    // result.limit - 10
//    // result.page - 3
//    // result.pages
//});

//get login page
router.get('/login', function(req, res, next) {
    res.render('login', {message : req.flash('loginMessage')})
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: './admin',
    failureRedirect: '/login',
    failureFlash: true
} ));

//get About page
router.get('/about', function(req, res) {
    res.render('about')
});

//get contact page
router.get('/contact', function(req, res) {
    res.render('contact')
});

//Get Admin
router.get('/admin', isLoggedIn, function(req, res, next) {
    res.render('admin', {user : req.user, updateMessage: req.flash('updateMsg') });
});

//get logout
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

//get signup page
router.get('/signup', function(req, res, next) {
    res.render('signup', {message : req.flash('signupMessage') } )
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: './login',
    failureRedirect: '/signup',
    failureFlash :true
}));

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

posts.paginate({}, 2, 1)



module.exports = router;
