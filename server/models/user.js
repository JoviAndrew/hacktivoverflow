const mongoose = require('mongoose');
const Schema = mongoose.Schema

let userSchema = mongoose.Schema({
    fbId: String,
    username: String,
    firstname: String,
    lastname: String,
    password: String,
}, {
    timestamps: true
})

let user = mongoose.model('user', userSchema);

module.exports = user;