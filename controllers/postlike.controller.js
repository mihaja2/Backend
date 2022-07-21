const logger = require('../config/logger');
const Post = require('../models/Post');
const PostLike = require('../models/PostLike');

async function toggle_like (req, res){
    let post_id = req.params.id;
    Post.findOne({_id:post_id}).then((post)=>{
        if(!post){
            logger.customLogger.log('info', `Post ${post_id} not found`);
            return res.status(404).json({msg:'Post not found'});
        }
        else{
            PostLike.findOne({
                user: req.user.id,
                post: post_id
            }).then(async (postlike)=>{
                try{
                    if(!postlike){
                        let postLike = new PostLike({
                            user: req.user.id,
                            post: post_id
                        });
                        let likeData = await postLike.save();
                        await Post.updateOne({
                            _id: post_id
                        }, {
                            $push: {post_likes:likeData._id}
                        })
                        logger.customLogger.log('info', `Post ${post_id} successfully liked`);
                        return res.status(200).json({msg:'Post successfully liked'});
                    }
                    else{
                        await PostLike.deleteOne({
                            _id:postlike._id
                        });
    
                        await Post.updateOne({
                            _id: postlike.post
                        }, {
                            $pull: {post_likes:postlike._id}
                        })
                        logger.customLogger.log('info', `Post ${post_id} successfully unliked`);
                        return res.status(200).json({msg:'Post successfully unliked'});
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

async function getAllPostLike(req, res){
    let post_id = req.params.id;
    Post.findOne({_id: post_id}).then(async (post)=>{
        if(!post){
            logger.customLogger.log('info', `Post ${post_id} not found`);
            return res.status(404).json({msg:'Post not found'});
        }
        else{
            let postlike = await PostLike.find({
                post: post_id
            }).populate('user');
            if(!postlike){
                logger.customLogger.log('info', `Like for post ${post_id} not found`);
                return res.status(404).json({msg:'Like for post not found'});
            }
            else{
                logger.customLogger.log('info', `Get like for post ${post_id} succeed`);
                return res.status(200).send(postlike)
            }
        }
    }).catch((err)=>{
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    })
}

module.exports = {
    toggle_like,
    getAllPostLike
};