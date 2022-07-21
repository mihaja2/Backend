const Comment = require("../models/Comment");
const logger = require('../config/logger');

// see all comment for a post
async function getAllCommentByPostId(req, res){
    try{
        const comment = await Comment.find({post: req.params.id}).sort([['createdAt', 'descending']]).populate('comment_likes', ['user']).populate('user');

        if(Object.keys(comment).length==0){
            logger.customLogger.log('info',`No comment available for post ${req.params.id}`);
            return res.status(200).json({msg: 'No comment available'})
        }

        return res.status(200).json(comment);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal server error');
    }
}

// create a comment for a post
async function createCommentByPostId(req, res){
    const {
        message
    } = req.body;

    const commentFields = {};

    commentFields.user = req.user.id;
    commentFields.post = req.params.id;
    if(message) commentFields.message = message;
    try{
        const comment = new Comment(commentFields);
        let commentData = await comment.save();
        await Post.updateOne({
            _id: req.params.id
        }, {
            $push: {comments:commentData._id}
        })
        logger.customLogger.log('info', `Comment for post ${commentFields.post} of ${commentFields.user} created`);
        return res.status(201).json(comment);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal server error');
    }
}

// function to update a comment
async function updateCommentById(req, res){
    const {
        message
    } = req.body;

    const commentFields = {};

    if(message) commentFields.message = message;
    commentFields.updatedAt = Date.now();

    try{
        let comment = await Comment.findOne({_id: req.params.id, user: req.user.id}).populate('comment_likes', ['user']);
        if(!comment){
            logger.customLogger.log('info', `Comment ${req.params.id} doesn't exist`);
            return res.status(404).json({msg: 'Comment doesn\'t exist'});
        }
        comment = await Comment.findOneAndUpdate({_id: req.params.id, user: req.user.id}, {$set : commentFields}, {new : true});
        await comment.save();
        logger.customLogger.log('info', `Comment ${req.params.id} of ${req.user.id} updated`);
        return res.status(201).json(comment);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal server error');
    }
}

// used to remove a comment
async function deleteCommentById(req, res){
    try{
        const comment = await Comment.findOneAndRemove({_id: req.params.id, user: req.user.id});
        if(!comment){
            logger.customLogger.log('info', `Comment ${req.params.id} doesn't exist`);
            return res.status(404).json({msg: 'Comment doesn\'t exist'});
        }
        await Post.updateOne({
            _id: comment.post
        }, {
            $pull: {comments:comment._id}
        })
        logger.customLogger.log('info', `Comment ${req.params.id} deleted`);
        return res.json({msg: 'Comment deleted'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getAllCommentByPostId,
    createCommentByPostId,
    updateCommentById,
    deleteCommentById
}