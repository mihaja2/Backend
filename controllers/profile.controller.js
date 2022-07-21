const logger = require('../config/logger');
const Profile = require('../models/Profile');

async function getCurrentUserProfile(req, res){
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['firstname','lastname', 'email', 'status','phonenumber', 'role']);
        if(!profile){
            logger.customLogger.log('info', `Profile ${req.user.id} not found`);
            return res.status(404).json({msg:'profile not found'});
        }
        return res.json(profile);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
}

async function createOrUpdateProfile(req, res){
    const {
        company,
        location,
        status,
        bio
    } = req.body;
    let picture;
    if (req.file)
        picture = req.file.destination+req.file.filename;

    // Build a profile object
    const profileFields = {};

    // affect all column that has been specified in the request object
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(location) profileFields.location = location;
    if(status) profileFields.status = status;
    if(bio) profileFields.bio = bio;
    if(picture) profileFields.picture = picture;

    try{
        // find profile by the user.id send by the token
        let profile = await Profile.findOne({user: req.user.id});

        // if not found, create a new profile
        if(!profile){
            profile = new Profile(profileFields);
            await profile.save();
            logger.customLogger.log('info', `Profile ${profileFields.user} created`);
            return res.status(201).json(profile);
        }

        // if found, update the existing one
        profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set : profileFields}, {new : true});
        logger.customLogger.log('info', `Profile ${profileFields.user} updated`);
        return res.json(profile);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
}

async function getProfileById(req, res){
    try{
        const profile = await Profile.findOne({user: req.params.id}).populate('user', ['firstname','lastname', 'email', 'status','phonenumber', 'role']);
        if(!profile){
            logger.customLogger.log('info', `Profile ${req.user.id} not found`);
            return res.status(404).json({msg:'profile not found'});
        }
        logger.customLogger.log('info', `Profile ${req.user.id} found`);
        return res.json(profile);
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteProfileById(req, res){
    try{
        const profile = await Profile.findOneAndRemove({user: req.params.id});
        if(!profile){
            logger.customLogger.log('info', `Profile ${req.user.id} not found`);
            return res.status(404).json({msg:'profile not found'});
        }
        logger.customLogger.log('info', `Profile ${req.user.id} deleted`);
        return res.json({msg: 'Profile deleted'});
    }catch(err){
        console.error(err.message);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getCurrentUserProfile,
    createOrUpdateProfile,
    getProfileById,
    deleteProfileById
};