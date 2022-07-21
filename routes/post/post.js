const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const postController = require('../../controllers/post.controller');
const { check, validationResult } = require('express-validator');
const upload_image = require('../../middleware/upload_image');
const multer = require('multer');

// @route GET api/post
// @desc Get all post by date desc
// @access Public
router.get('/', auth, (req, res)=>{
    postController.getAllPost(req, res);
});

// @route GET api/post/me
// @desc Get all post by the user connected by date desc
// @access Private
router.get('/user/me', auth, (req, res)=>{
    postController.getPostForCurrentUser(req, res);
});

// @route GET api/post/:id
// @desc Get post by id
// @access Private
router.get('/:id', auth, (req, res)=>{
    postController.getPostById(req, res);
})

router.get('/user/:id', auth, (req, res)=>{
    postController.getAllPostByUserId(req, res);
})

// @route POST api/post/
// @desc Create a post
// @access Private
router.post('/:type', [auth, multer({
    storage: upload_image.files.storage(), 
    allowedFiles:upload_image.files.allowedFiles 
    }).single('picture'), [
    check('message', 'Message is required').not().isEmpty()
]], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    postController.createPost(req, res);
});

// @route PUT api/post/:type&:id
// @desc Update a post by id
// @access Private
router.put('/:type/:id', [auth, multer({
    storage: upload_image.files.storage(), 
    allowedFiles:upload_image.files.allowedFiles 
    }).single('picture'), [
    check('message', 'Message is required').not().isEmpty()
]], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    postController.updatePostById(req, res);
});

// @route DELETE api/post/:id
// @desc Delete a post by id
// @access Private
router.delete('/:id', auth, (req, res)=>{
    postController.deletePostById(req, res);
})

module.exports = router;