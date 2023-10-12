const express = require("express");
const router = express.Router();
const passport = require('passport')
let commentController = require('../../../controllers/api/v1/comments_api')
router.post("/create",commentController.create)
module.exports = router