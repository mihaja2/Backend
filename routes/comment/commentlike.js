const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

const CommentLikeController =  require('../../controllers/commentlike.controller');
// @route GET api/post
// @desc Get all post by date desc
// @access Public
router.post('/:id', auth, (req, res)=>{
    CommentLikeController.comment_toggle_like(req, res);
});

// @route GET api/comments/:id
// @desc Get all like by post id
// @access Public
router.get('/:id', auth, (req, res)=>{
    CommentLikeController.getAllCommentLike(req, res);
});

module.exports = router;