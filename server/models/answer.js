const mongoose = require('mongoose');
const Schema = mongoose.Schema

let answerSchema = mongoose.Schema({
    up: [{ type: Schema.Types.ObjectId, ref: 'user'}],
    down: [{ type: Schema.Types.ObjectId, ref: 'user'}],
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    username: String,
    post_text: String, 
    questionId: {type: Schema.Types.ObjectId, ref: 'question'},
}, {
    timestamps: true
})

let answer = mongoose.model('answers', answerSchema);

module.exports = answer;