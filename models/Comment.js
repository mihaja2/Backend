const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    message: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    comment_likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'commentlike'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

module.exports = Comment = mongoose.model('comment', CommentSchema);