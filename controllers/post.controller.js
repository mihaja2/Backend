const { post } = require("request");
const logger = require("../config/logger");
const Post = require("../models/Post");

// get all post order by column createdAt
async function getAllPost(req, res){
    try{
        const post = await Post.find().sort([['createdAt', 'descending']]).populate('post_likes', ['user']);

        // if there are no post, return a message and not a empty array
        if(Object.keys(post).length==0){
            logger.customLogger.log('info', `No post available`);
            return res.status(404).json({msg: 'No post available'});
        }
        // return an collection of post
        return res.status(200).json(post);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// Get all post for the current user
async function getPostForCurrentUser(req, res){
    try{
        const post = await Post.find({user: req.user.id}).sort([['createdAt', 'descending']]).populate('post_likes', ['user']);
        // if there are no post, return a message and not a empty array
        if(Object.keys(post).length==0){
            logger.customLogger.log('info', `No post available for id = ${req.user.id}`);
            return res.status(404).json({msg: 'No post available'});
        }
        // return an collection of post
        // console.log(post.picture);
        // res.status(200).sendFile(post.picture);
        return res.status(200).json(post);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    } 
}

// Get post by Id
async function getPostById(req, res){
    try{
        const post = await Post.findOne({_id: req.params.id}).populate('user').populate('post_likes', ['user']);
        if(!post){
            logger.customLogger.log('info', `Post ${req.params.id} not found`);
            return res.status(404).json({msg: 'Post not found'});
        }
        /*console.log(__dirname +post.picture);
        return res.status(200).sendFile('https://localhost:5000/api/'+post.picture)*/
        return res.status(200).json(post);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    } 
}

// Get post by Id
async function getAllPostByUserId(req, res){
    try{
        const post = await Post.find({user: req.params.id}).sort([['createdAt', 'descending']]).populate('user').populate('post_likes', ['user']);
        if(!post){
            logger.customLogger.log('info', `Post for user ${req.params.id} not found`);
            return res.status(404).json({msg: 'Post for user not found'});
        }
        /*console.log(__dirname +post.picture);
        return res.status(200).sendFile('https://localhost:5000/api/'+post.picture)*/
        return res.status(200).json(post);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    } 
}

// create a post
async function createPost(req, res){
    const {
        message
    } = req.body;
    try{
        //create a variable to contains all columns of a post
        let postFields = {};
        let picture = '';
        if (req.file)
            picture = req.file.destination+req.file.filename;
        // set following value
        if (message) postFields.message = message;
        if (picture) postFields.picture = picture;
        postFields.user = req.user.id;
        
        // creating a new post object with the postFields
        const post = new Post(postFields);

        // save the new post
        await post.save();

        logger.customLogger.log('info', `Post ${postFields.message} for ${postFields.user} created`);
        return res.status(201).json(post);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    } 
}

// update a post by Id
async function updatePostById(req, res){
    const {
        message
    } = req.body;

    try{
        //create a variable to contains all columns of a post
        let postFields = {};
        let picture = null;
        if (req.file)
            picture = req.file.destination+req.file.filename;
        // set following value to modify
        if(message) postFields.message = message
        if (picture) postFields.picture = picture;
        // set date now for date of update
        const updatedAt = Date.now();
        postFields.updatedAt = updatedAt;
        
        // find post by id
        let post = await Post.findOne({user: req.user.id, _id: req.params.id}).populate('post_likes', ['user']);
    
        if(!post){
            logger.customLogger.log('info', `Post ${req.params.id} for user ${req.user.id} not found`);
            return res.status(404).json({msg: 'Post not found'});
        }
        // if post exist then find and update the column specified in postFields
        post = await Post.findOneAndUpdate({user: req.user.id, _id: req.params.id}, {$set : postFields},{new : true})
        logger.customLogger.log('info', `Post ${post.id} for user ${post.user} updated`);
        
        //return the post updated
        return res.status(200).json(post);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

async function deletePostById(req,res){
    try{
        // find post by id
        const post = await Post.findOneAndRemove({user: req.user.id, _id: req.params.id});
        if(!post){
            logger.customLogger.log('info', `Post ${req.params.id} for user ${req.user.id} not found`);
            return res.status(404).json({msg: 'Post not found'});
        }
        logger.customLogger.log('info', `Post ${post.id} for user ${post.user} deleted`);
        return res.json({msg: 'Post deleted'});

    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    getAllPost,
    getPostForCurrentUser,
    getPostById,
    createPost,
    updatePostById,
    deletePostById,
    getAllPostByUserId
}