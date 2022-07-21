const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../config/logger');

// function to login with a user
async function SignIn(req, res){
    const { email, password } = req.body;

    try{
        // getting the user by email
        let user = await User.findOne({ email });
        
        // if user has not been retrieved
        if(!user){
            logger.customLogger.log('info',`Invalid credentials`);
            return res.status(400).json({errors : [{msg:'Invalid credentials'}]});
        }

        // test password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            logger.customLogger.log('info',`Invalid credentials`);
            return res.status(400).json({errors : [{msg:'Invalid credentials'}]});
        }

        const payload = {
            user: {
                id : user._id,
                role: user.role
            }
        }

        // create the token
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        );
    }
    catch(err){
        console.log(err);
        logger.errorLogger.log('error',`Internal server error ${err.message}`);
        res.status(500).send('Internal Server Error')
    }
}

// return the current user info expect password
async function getCurrentUserInfo(req, res){
    try{
        // find user and select all info except password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        if(err){
            logger.errorLogger.log('error',`Internal server error ${err.message}`);
            res.status(500).json({msg: 'Internal server error'});
        }
    }
}

module.exports = {
    SignIn,
    getCurrentUserInfo
};