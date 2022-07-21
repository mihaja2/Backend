const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }
}, {timestamps: true});

module.exports = PostLike = mongoose.model('commentlike', PostLikeSchema);