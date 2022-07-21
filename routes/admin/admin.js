const express = require('express');
const { createUserAdmin, getAllUser, deleteUser, deletePost, modifyLoginCredentials, reinitPassword, modifyPostForAdmin, modifyCommentForAdmin, deleteComment } = require('../../controllers/admin.controller');
const admin = require('../../middleware/admin');
const { check, validationResult } = require('express-validator');
const upload_image = require('../../middleware/upload_image');
const multer = require('multer');
const router = express.Router();

router.get('/', admin, (req, res)=>{
    res.send('it works!!');
});

router.post('/createUser', (req, res)=>{
    createUserAdmin(req, res);
});

router.get('/users', admin, (req, res)=>{
    getAllUser(req, res);
});

router.delete('/user/:id', admin, async (req, res)=>{
    deleteUser(req, res);
});

router.delete('/post/:id', admin, (req, res)=>{
    deletePost(req, res);
});

router.delete('/comment/:id', admin, (req, res)=>{
    deleteComment(req, res);
});

//Modifier les identifiants de connexion Admin
router.put('/me',  [admin,[
    check('email', 'Enter a valid email adress').isEmail(),
    check('oldPassword','please enter your old password').not().isEmpty(),
    check('newPassword','please enter a password with 8 or more characters').matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*])(?=.*[a-zA-Z]).{8,}$/, "i")
]],(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    modifyLoginCredentials(req, res);
});

//Modifier le mot de passe user
router.put('/changePassword/:id', [admin, [
    check('newPassword','please enter a password with 8 or more characters').matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*])(?=.*[a-zA-Z]).{8,}$/, "i")
]], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    reinitPassword(req, res);
})

//Modifier les images pour Admin
router.put('/modify/post/:type/:id', [admin, multer({
    storage: upload_image.files.storage(), 
    allowedFiles:upload_image.files.allowedFiles 
    }).single('picture'), [
    check('message', 'Message is required').not().isEmpty()
]], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    modifyPostForAdmin(req, res);
});

//Modifier les commentaires pour Admin
router.put('/modify/comment/:id', [admin, [
    check('message', 'Message is required').not().isEmpty()
]], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    modifyCommentForAdmin(req, res);
})

module.exports = router;