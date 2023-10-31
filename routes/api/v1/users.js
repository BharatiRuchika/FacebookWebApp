const express = require("express");
const router = express.Router();
const passport = require('passport')
const multer = require('multer')
const path = require('path')
const AVATAR_PATH = path.join('/uploads/posts/images')
const users_api = require("../../../controllers/api/v1/users_api")
router.get('/sign-in',users_api.signIn)
router.get('/sign-up',users_api.signUp)
router.get('/sign-out',users_api.destroySession)
router.post('/create',users_api.create)
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/'},),users_api.createSession)
router.get('/edit',passport.checkAuthentication,users_api.edit)
router.get('/bio',passport.checkAuthentication,users_api.addBio)
router.get('/display-post',passport.checkAuthentication,users_api.displayPost)
router.post('/update-bio',passport.checkAuthentication,users_api.updateBio)
router.post('/update-user',passport.checkAuthentication,users_api.updateUser)
router.get('/display-profile/:id',passport.checkAuthentication,users_api.displayUserProfile)
router.get('/display-profile-picture-form',passport.checkAuthentication,users_api.display_profile_picture_form)
router.post('/updateProfile',passport.checkAuthentication,users_api.updateProfilePicture)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),users_api.createSession)

router.get('/auth/github',passport.authenticate('github',{scope:['profile','email']}));
router.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: '/users/sign-in'}),users_api.createSession)

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/users/sign-in' }),users_api.createSession);
  router.post('/send-friend-request',passport.checkAuthentication,users_api.sendFriendRequest)
router.post('/accept-friend-request',passport.checkAuthentication,users_api.acceptFriendRequest)
router.post('/reject-friend-request',passport.checkAuthentication,users_api.rejectFriendRequest)
router.get('/getAllFriends/:id',passport.checkAuthentication,users_api.getAllFriends)
router.get('/getAllUsers',passport.checkAuthentication,users_api.getAllUsers)
router.post('/delete',passport.checkAuthentication,users_api.deleteItem)
router.get('/getAllPost/:id',passport.checkAuthentication,users_api.getAllPost)

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

module.exports = router