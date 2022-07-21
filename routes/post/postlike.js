const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

const PostLikeController =  require('../../controllers/postlike.controller');
// @route POST api/post/:id
// @desc Like or delike post
// @access Public
router.post('/:id', auth, (req, res)=>{
    PostLikeController.toggle_like(req, res);
});

// @route GET api/post/:id
// @desc Get all like by post id
// @access Public
router.get('/:id', auth, (req, res)=>{
    PostLikeController.getAllPostLike(req, res);
});

module.exports = router;