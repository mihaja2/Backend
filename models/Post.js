const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    message: {
        type: String,
        required: true
    },
    picture: {
        type: String,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }],
    post_likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'postlike'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

module.exports = Post = mongoose.model('post', PostSchema);