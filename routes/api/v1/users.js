const express = require("express");
const router = express.Router();
const passport = require('passport')
const multer = require('multer')
const path = require('path')
const AVATAR_PATH = path.join('/uploads/posts/images')

const users_api = require("../../../controllers/api/v1/users_api")
// router.post('/create-session',users_api.createSession)
router.get('/sign-in',users_api.signIn)
router.get('/sign-up',users_api.signUp)
router.get('/sign-out',users_api.destroySession)
router.post('/create',users_api.create)
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/'},),users_api.createSession)
// router.get('/profile',passport.checkAuthentication,users_api.profile)
router.get('/edit',passport.checkAuthentication,users_api.edit)
router.get('/bio',passport.checkAuthentication,users_api.addBio)
router.get('/display-post',passport.checkAuthentication,users_api.displayPost)
router.post('/update-bio',passport.checkAuthentication,users_api.updateBio)
router.post('/update-user',passport.checkAuthentication,users_api.updateUser)
router.get('/display-profile',passport.checkAuthentication,users_api.displayUserProfile)
router.get('/display-profile-picture-form',passport.checkAuthentication,users_api.display_profile_picture_form)
router.post('/updateProfile',passport.checkAuthentication,users_api.updateProfilePicture)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"../../../",AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });
router.post('/create-post',passport.checkAuthentication,upload.single('avatar'),users_api.createPost)
// router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
// router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession)
module.exports = router