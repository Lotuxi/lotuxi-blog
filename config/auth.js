var passport = require('passport');
var localStrategy = require('passport-http').localStrategy;
var User = require('../models/user');

passport.use(new localStrategy(
    function(username, password, callback) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // See if the user exists
            if (!user) { return callback(null, false); }

            // check to see if password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // if password does not match
                if (!isMatch) { return callback(null, false); }

                // if Success
                return callback(null, user);
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
