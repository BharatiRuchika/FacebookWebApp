const express = require("express");
const router = express.Router();
const passport = require('passport')
let likesController = require('../../../controllers/api/v1/likes_api')
router.post("/toggle",passport.checkAuthentication,likesController.toggleLike)
module.exports = router