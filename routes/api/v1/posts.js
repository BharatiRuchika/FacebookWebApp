const express = require("express");
const router = express.Router();
const passport = require('passport')
let postController = require('../../../controllers/api/v1/posts_api')
router.post("/updatePost",passport.checkAuthentication,postController.updatePost)
module.exports = router