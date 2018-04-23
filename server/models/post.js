const mongoose = require('mongoose');
const Schema = mongoose.Schema

let postSchema = mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user'},
    username: String,
    header: String,
    post_text: String, 
    type: String
}, {
    timestamps: true
})

let post = mongoose.model('post', postSchema);

module.exports = post;