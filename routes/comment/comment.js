const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const commentController = require('../../controllers/comment.controller');
const { check, validationResult } = require('express-validator');

// @route GET api/comments/:id
// @desc Get all comment for a post id
// @access private
router.get('/:id', auth, (req, res)=>{
    commentController.getAllCommentByPostId(req, res);
});

// @route POST api/comments/:id
// @desc Post a comment for a post id
// @access private
router.post('/:id', [auth, [
    check('message', 'Message is required').not().isEmpty()
]], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    commentController.createCommentByPostId(req, res);
});

// @route PUT api/comments/:id
// @desc Modify a comment by id
// @access private
router.put('/:id', [auth, [
    check('message', 'Message is required').not().isEmpty()
]], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    commentController.updateCommentById(req, res);
})

// @route DELETE api/comments/:id
// @desc DELETE a comment by id
// @access private
router.delete('/:id', auth, (req, res)=>{
    commentController.deleteCommentById(req, res);
})

module.exports = router;