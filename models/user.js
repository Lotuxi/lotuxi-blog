var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local : {
        username: String,
        password: String
    }
});

userSchema.methods.generateHash = function(password) {
    //create salted hash of password by hashing plaintext password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
    //hash entered password, compare with stored password
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('Users', userSchema);