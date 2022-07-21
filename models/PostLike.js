const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
}, {timestamps: true});

module.exports = PostLike = mongoose.model('postlike', PostLikeSchema);