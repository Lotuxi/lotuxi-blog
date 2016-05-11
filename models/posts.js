var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: { type: String, required: '{PATH} is required!'},
    body: { type: String, required: '{PATH} is required!'},
    created_at: { type: Date, default: Date.now }
});


var Posts = mongoose.model('Posts', postSchema);

module.exports = mongoose.model('Post', postSchema);