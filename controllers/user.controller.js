const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../config/logger');
const { createOrUpdateProfile } = require('./profile.controller');
const Profile = require('../models/Profile');
const Post = require('../models/Post');
const PostLike = require('../models/PostLike');
const Comment = require('../models/Comment');
const CommentLike = require('../models/CommentLike');

async function SignUp(req, res){
    const { firstname, lastname, email, password, phonenumber, gender } = req.body;

    try{
        let user = await User.findOne({email});

        if(user){
            logger.customLogger.log('info','User already exists');
            return res.status(400).json({errors : 'User already exists'});
        }

        user = new User({
            firstname,
            lastname,
            email,
            password,
            phonenumber,
            gender
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        const payload = {
            user: {
                id: user._id,
                role: user.role
            } 
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        )
        logger.customLogger.log('info',`User ${firstname} ${lastname} created`);
        createDefaultProfile(user._id);
        return res.status(201).send({msg:`User ${firstname} ${lastname} created`})
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal server error');
    }
}


async function changePassword(req, res){
    const {
        oldPassword,
        newPassword
    } = req.body;

    try{
        const user = await User.findOne({ _id: req.user.id });
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        /*await bcrypt.compare(oldPassword, user.password, (err, isMatch)=>{
            if(err){
                throw error;
            }
            else if (!isMatch) {
                console.log("Password doesn't match!")
              } else {
                console.log("Password matches!")
              }
        });*/
        if(!isMatch){
            logger.customLogger.log('info',`Invalid credentials`);
            return res.status(400).json({errors : [{msg:'Invalid credentials'}]});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.save();
        logger.customLogger.log('info', `Password changed for ${user.firstname} ${user.lastname}`);
        return res.status(200).json({msg: 'The password has been changed'});
    }catch(err){
        if(err){
            logger.errorLogger.log('error',`Internal server error ${err.message}`);
            res.status(500).json({msg: 'Internal server error'});
        }
    }
}

async function createDefaultProfile(userid){
    // Build a profile object
    const profileFields = {};

    // affect all column that has been specified in the request object
    profileFields.user = userid;
    try{
        let profile = new Profile(profileFields);
        await profile.save();
        logger.customLogger.log('info', `Profile ${profileFields.user} created`);
        // return res.status(201).json(profile);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteCurrentUser(req, res){
    try{
        let user = await User.findOne({_id:req.user.id});
        if(!user){
            logger.customLogger.log('info', `User ${req.user.id} not found`);
            return res.status(404).json({msg: 'User not found'});
        }
        await CommentLike.deleteMany({user: user._id});
        await PostLike.deleteMany({user: user._id});
        await Comment.deleteMany({user: user._id});
        await Post.deleteMany({user: user._id});
        await Profile.deleteOne({user: user._id});
        await User.deleteOne({_id: user._id});
        logger.customLogger.log('info', `User ${user._id} has been deleted`);
        return res.status(200).json({msg: 'User has been deleted'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    SignUp,
    changePassword,
    createDefaultProfile,
    deleteCurrentUser
};