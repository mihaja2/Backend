const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const profileController = require('../../controllers/profile.controller');
const upload_image = require('../../middleware/upload_image');
const multer = require('multer');

// const upload = multer({ dest: "'../images/profiles/'", });
// @route GET api/profile/me
// @desc Get the current profile
// @access Private
router.get('/me',auth, async (req, res)=>{
    profileController.getCurrentUserProfile(req, res);
});

// @route POST api/profile
// @desc Create or update a profile
// @access Private
router.post('/:type', [auth, multer({
    storage: upload_image.files.storage(), 
    allowedFiles:upload_image.files.allowedFiles 
    }).single('picture'),
async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    profileController.createOrUpdateProfile(req, res);
}])

// @route GET api/profile/:id
// @desc Get profile by id
// @access Private
router.get('/:id', auth, async(req, res)=>{
    profileController.getProfileById(req, res);
})

// @route DELETE api/profile/:id
// @desc Delete a profile by id
// @access Public
router.delete('/:id', auth, async(req, res)=>{
    profileController.deleteProfileById(req, res);
})

module.exports = router;