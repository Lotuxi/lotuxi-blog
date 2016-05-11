var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

module.exports = function(passport) {

    // save user in session store.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    //Get user by ID, from session store
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    });


    //Signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        process.nextTick(function () {

            //Search for user
            User.findOne({'local.username': username}, function (err, user) {
                if (err) {
                    return done(err);    //database error
                }

                //See if taken
                if (user) {
                    console.log('user with that name exists');
                    return done(null, false, req.flash('signupMessage', 'Sorry, username already taken'));
                }

                //else, the username is available.
                var newUser = new User();
                newUser.local.username = username;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser)
                });
            });
        });
    }));


    passport.use('local-login', new LocalStrategy({
            usernameField:'username',
            passwordField:'password',
            passReqToCallback : true
        },

        function(req, username, password, done){
            process.nextTick(function() {
                User.findOne({'local.username': username}, function (err, user) {

                    if (err) {
                        return done(err)
                    }
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'User not found'))
                    }
                    //This method is defined in our user.js model.
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Wrong password'));
                    }

                    return done(null, user);
                })
            });
        }));

};