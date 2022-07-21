const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required : true
    },
    lastname: {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    phonenumber: {
        type: String,
    },
    gender: {
        type: String,
        enum : ['male','female', 'others'],
        required: true
    },
    role: {
        type: String,
        enum : ['admin','user'],
        default: 'user'
    }
});

module.exports = User = mongoose.model('user', UserSchema);