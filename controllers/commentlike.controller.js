const logger = require('../config/logger');
const Comment = require('../models/Comment');
const CommentLike = require('../models/CommentLike');

async function comment_toggle_like (req, res){
    let comment_id = req.params.id;
    Comment.findOne({_id:comment_id}).then((comment)=>{
        if(!comment){
            logger.customLogger.log('info', `Comment ${comment_id} not found`);
            return res.status(404).json({msg:'Comment not found'});
        }
        else{
            CommentLike.findOne({
                user: req.user.id,
                comment: comment_id
            }).then(async (commentlike)=>{
                try{
                    if(!commentlike){
                        let commentlike = new CommentLike({
                            user: req.user.id,
                            comment: comment_id
                        });
                        let likeData = await commentlike.save();
                        await Comment.updateOne({
                            _id: comment_id
                        }, {
                            $push: {comment_likes:likeData._id}
                        })
                        logger.customLogger.log('info', `Comment ${comment_id} successfully liked`);
                        return res.status(200).json({msg:'Comment successfully liked'});
                    }
                    else{
                        await CommentLike.deleteOne({
                            _id:commentlike._id
                        });
    
                        await Comment.updateOne({
                            _id: commentlike.comment
                        }, {
                            $pull: {comment_likes:commentlike._id}
                        })
                        logger.customLogger.log('info', `Comment ${comment_id} successfully unliked`);
                        return res.status(200).json({msg:'Comment successfully unliked'});
                    }
                }
                catch(err){
                    console.error(err.message);
                    logger.errorLogger.log('error',`Internal server error ${err.message}`);
                    res.status(500).send('Internal Server Error');
                }
            }).catch((err)=>{
                console.error(err.message);
                logger.errorLogger.log('error',`Internal server error ${err.message}`);
                res.status(500).send('Internal Server Error');
            })
        }
    }).catch((err)=>{
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    })
}

async function getAllCommentLike(req, res){
    let comment_id = req.params.id;
    Comment.findOne({_id: comment_id}).then(async (comment)=>{
        if(!comment){
            logger.customLogger.log('info', `Comment ${comment_id} not found`);
            return res.status(404).json({msg:'Comment not found'});
        }
        else{
            let commentlike = await CommentLike.find({
                comment: comment_id
            }).populate('user');
            if(!commentlike){
                logger.customLogger.log('info', `Like for comment ${comment_id} not found`);
                return res.status(404).json({msg:'Like for comment not found'});
            }
            else{
                logger.customLogger.log('info', `Get like for comment ${comment_id} succeed`);
                return res.status(200).send(commentlike)
            }
        }
    }).catch((err)=>{
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    })
}

module.exports = {
    comment_toggle_like,
    getAllCommentLike
};