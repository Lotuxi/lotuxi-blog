//var express = require('express');
//var router = express.Router();
//var passport = require('passport');
//var User = require('../models/user');
//
////user profile - require auth
//router.get('/users/:user_id', isLoggedIn, function (req, res, next) {
//  //var id = req.params.id;
//  if (req.params.user_id != req.user._id) {
//    console.log('User attempting to access wrong user page');
//    return res.redirect('/users');
//  }
//  User.findById(req.params.user_id, function (err, userDocs) {
//    if (err) {
//      //res.send(err);
//      return next(err);
//    }
//    console.log('Returned ' + userDocs);
//    return res.render('userX', {
//      userData: userDocs,
//      error: req.flash('error')
//    });
//  });
//});
//
//
//module.exports = router;