var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var postSchema = new Schema({
    title: String,
    body: String,
    created_at: { type: Date, default: Date.now }
});

postSchema.plugin(mongoosePaginate);




var Post = mongoose.model('Post', postSchema);

module.exports = Post;