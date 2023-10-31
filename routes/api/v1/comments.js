const express = require("express");
const router = express.Router();
const passport = require('passport')
let commentController = require('../../../controllers/api/v1/comments_api')
router.post("/create",passport.checkAuthentication,commentController.create)
router.get('/get/:id',passport.checkAuthentication,commentController.getComments)
module.exports = router