const mongoose = require('mongoose');
const Schema = mongoose.Schema

let questionSchema = mongoose.Schema({
    up: [{ type: Schema.Types.ObjectId, ref: 'user'}],
    down: [{ type: Schema.Types.ObjectId, ref: 'user'}],
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    username: String,
    header: String,
    post_text: String, 
    answers:[{ type: Schema.Types.ObjectId, ref: 'answers' }]
}, {
    timestamps: true
})

let question = mongoose.model('question', questionSchema);

module.exports = question;