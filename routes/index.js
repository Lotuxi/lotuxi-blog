var express = require('express');
var router = express.Router();
var passport = require('passport');
var posts = require('../models/posts.js'); //specify post model


//get homepage
router.get('/', function(req, res, next) {
    posts.find(function(err, postDocs) {
        if (err) { return next(err); }
        return res.render('index', { posts: postDocs, error: req.flash('error') });
    });
});

// save posts
router.post('/saveNewPosts', isLoggedIn, function(req, res, next) {


    //create new post
    var newPost = posts(req.body);

    //request saved posts
    newPost.save(function(err) {
        if (err) {
            if (err.name == "ValidationError") {
                req.flash('error', 'Invalid data');
                return res.redirect('/')
            }

            if (err.code == 11000) {
                req.flash('error', 'A post with the title already exisits')
                return res.redirect('/')
            }
            return next(err);
        }
        res.status(201);
        return res.redirect('/');
    });
});

router.post('/addDate', function(req, res, next) {

    var newPost = req.body.created_at
    if(!newPost || newPost == '') {
        return res.redirect('admin');
    }

    Post.findOne( {title: req.body.title }, function (err, post ) {
        if (err) {return next(err) }
        if (!post) {return next(new Error('No post found with this title.'))}

        post.created_at.push(newPost);

        post.save(function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/')
        });
    });
});



//get login page
router.get('/login', function(req, res, next) {
    res.render('login', {message : req.flash('loginMessage')})
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
} ));


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
    successRedirect: '/admin',
    failureRedirect: '/signup',
    failureFlash :true
}));

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin');
}



module.exports = router;
