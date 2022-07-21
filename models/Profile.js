const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    picture: {
        type: String,
        default:'images/avatar.jpg'
    },
    company: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String
    },
    bio: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);