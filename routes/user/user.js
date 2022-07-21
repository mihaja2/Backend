const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {SignUp, changePassword, deleteCurrentUser} = require('../../controllers/user.controller');
const auth = require('../../middleware/auth');


router.get('/', (req, res)=> res.send('User route'));

router.post('/signup', [
    check('firstname', 'Firstname is required').not().isEmpty(),
    check('lastname', 'Lastname is required').not().isEmpty(),
    check('email', 'Enter a valid email adress').isEmail(),
    check('password','please enter a password with 8 or more characters').matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*])(?=.*[a-zA-Z]).{8,}$/, "i")
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // The function to signin a user
    SignUp(req, res);
});

router.put('/changepassword', [auth,[
    check('oldPassword','please enter your old password').not().isEmpty(),
    check('newPassword','please enter a password with 8 or more characters').matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*])(?=.*[a-zA-Z]).{8,}$/, "i")
]], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // The function to signin a user
    changePassword(req, res);
});

router.delete('/me', auth, async (req, res)=>{
    deleteCurrentUser(req, res);
})

module.exports = router
