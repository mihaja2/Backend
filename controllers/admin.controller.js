const User = require("../models/User");
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const Comment = require("../models/Comment");
const CommentLike = require("../models/CommentLike");
const config = require('config');
const {createDefaultProfile} = require('../controllers/user.controller');
const jwt = require('jsonwebtoken');

// testez si l'utilisateur "admin" existe dans la base, sinon créez-le
async function createUserAdmin(req, res){
    try{
        let admin = await User.findOne({role: 'admin'});
        if(admin){
            logger.customLogger.log('info', `Admin ${admin._id} already created`);
            return res.status(200).json({msg: 'Admin already created'});
        }
        let user = new User({
            firstname : config.get('adminFirstname'),
            lastname : config.get('adminLastname'),
            email : config.get('adminEmail'),
            password : config.get('adminPassword'),
            gender : 'male',
            role: 'admin'
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        createDefaultProfile(user._id);
        logger.customLogger.log('info', `Default user admin created`);
        return res.status(201).json({msg: 'Default user admin created'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

async function getAllUser(req, res){
    try{
        let user = await User.find({role: {$ne: 'admin'}}).sort([['date', 'descending']])
        if(Object.keys(user).length==0){
            logger.customLogger.log('info', `No user available`);
            return res.status(200).json({msg: 'No user available'});
        }
        return res.status(200).json(user);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// Utilisé par Admin pour supprimer un utilisaterur specifique
async function deleteUser(req, res){
    try{   
        let user = await User.findOne({_id: req.params.id});
        if(!user){
            logger.customLogger.log('info', `User ${req.params.id} not found`);
            return res.status(400).json({msg: 'User not found'});
        }
        await CommentLike.deleteMany({user: user._id});
        await PostLike.deleteMany({user: user._id});
        await Comment.deleteMany({user: user._id});
        await Post.deleteMany({user: user._id});
        await Profile.deleteOne({user: user._id});
        await User.deleteOne({_id: user._id});
        logger.customLogger.log('info', `User ${req.params.id} deleted successfully`);
        return res.status(200).json({msg:'User deleted successfully'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// Supprimez une publication par post_Id
async function deletePost(req, res){
    try{
        let post = await Post.findOne({_id: req.params.id});
        let comment = await Comment.findOne({post: post._id});
        if(!post){
            logger.customLogger.log('info', `Post ${req.params.id} not found`);
            return res.status(200).json({msg: 'Post not found'});
        }
        await PostLike.deleteMany({post: post._id});
        if (comment) await CommentLike.deleteMany({_id: comment._id});
        await Comment.deleteMany({post: post._id});
        await Post.deleteOne({_id: post._id});
        logger.customLogger.log('info', `Post ${req.params.id} deleted successfully`);
        return res.status(200).json({msg: 'Post deleted successfully'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// Supprimez un commentaire par comment_Id
async function deleteComment(req, res){
    try{
        let comment = await Comment.findOne({_id: req.params.id});
        if(!comment){
            logger.customLogger.log('info', `Comment ${req.params.id} not found`);
            return res.status(200).json({msg: 'Comment not found'});
        }
        await CommentLike.deleteMany({comment: comment._id});
        await Comment.deleteOne({_id: comment._id});
        logger.customLogger.log('info', `Comment ${req.params.id} deleted successfully`);
        return res.status(200).json({msg: 'Comment deleted successfully'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// modify admin login and password
async function modifyLoginCredentials(req, res){
    try{
        let user = await User.findOne({_id: req.user.id});
        if(!user){
            logger.customLogger.log('info', `User ${req.user.id} not found`);
            return res.status(200).json({msg: 'Post not found'});
        }
        const { email, oldPassword, newPassword } = req.body;


        if(email) user.email = email;
        const isMatch = bcrypt.compareSync(oldPassword, user.password);

        if(!isMatch){
            logger.customLogger.log('info',`Invalid credentials`);
            return res.status(400).json({errors : [{msg:'Invalid credentials'}]});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.save();
        logger.customLogger.log('info', `Credential changed for the admin user`);
        return res.status(200).json({msg: 'Credential has been changed'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// reinitialize user password
async function reinitPassword(req, res){
    const {newPassword} = req.body;
    try{
        let user = await User.findOne({_id: req.params.id});
        if(!user){
            logger.customLogger.log('info', `User ${req.user.id} not found`);
            return res.status(200).json({msg: 'Post not found'});
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.save();
        logger.customLogger.log('info', `Password for user ${user._id} has been reinitialized`);
        return res.status(200).json({msg: 'Password has been reinitialized'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// modify a post by id
async function modifyPostForAdmin(req, res){
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
        let post = await Post.findOne({_id: req.params.id}).populate('post_likes', ['user']);
    
        if(!post){
            logger.customLogger.log('info', `Post ${req.params.id} for user ${req.user.id} not found`);
            return res.status(404).json({msg: 'Post not found'});
        }
        // if post exist then find and update the column specified in postFields
        post = await Post.findOneAndUpdate({_id: req.params.id}, {$set : postFields},{new : true})
        logger.customLogger.log('info', `Post ${post.id} for user ${post.user} updated`);
        
        //return the post updated
        return res.status(200).json(post);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// modify a comment by id
async function modifyCommentForAdmin(req, res){
    const {
        message
    } = req.body;

    const commentFields = {};

    if(message) commentFields.message = message;
    commentFields.updatedAt = Date.now();

    try{
        let comment = await Comment.findOne({_id: req.params.id}).populate('comment_likes', ['user']);
        if(!comment){
            logger.customLogger.log('info', `Comment ${req.params.id} doesn't exist`);
            return res.status(404).json({msg: 'Comment doesn\'t exist'});
        }
        comment = await Comment.findOneAndUpdate({_id: req.params.id}, {$set : commentFields}, {new : true});
        await comment.save();
        logger.customLogger.log('info', `Comment ${req.params.id} of ${req.user.id} updated`);
        return res.status(201).json(comment);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    createUserAdmin,
    getAllUser,
    deleteUser,
    deletePost,
    modifyLoginCredentials,
    reinitPassword,
    modifyPostForAdmin,
    modifyCommentForAdmin,
    deleteComment
}