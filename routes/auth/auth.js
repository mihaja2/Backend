const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const authController = require('../../controllers/auth.controller');

// @route Get api/auth
// @desc Test route
// @access Public
router.get('/', auth, async (req, res)=>{
    authController.getCurrentUserInfo(req, res);
});

// @route Post api/auth
// @desc login route
// @access Public
router.post('/signin', [
    check('email','please specify a mail address').isEmail(),
    check('password','please specify a password').exists()
],
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    authController.SignIn(req, res);
});

module.exports = router;