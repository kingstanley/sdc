const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    user_type: {
        type: String,
        default: "member"
    },
    last_login: {
        type: Date
    },
    status: {
        type: String,
        default: "active"
    },
    about: {
        type: String,
        default: "I am proudly a member"
    },
    image: {
        type: String
    }
});

mongoose.model('users', UserSchema);