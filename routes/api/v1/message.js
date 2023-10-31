const express = require("express");
const router = express.Router();
const passport = require('passport')
let messageController = require('../../../controllers/api/v1/message_api')
router.post("/display-message/:id",passport.checkAuthentication,messageController.displayMessage)
router.post('/createMessage',passport.checkAuthentication,messageController.createMessage)
router.get('/openMessages/:id',passport.checkAuthentication,messageController.openMessages)
module.exports = router

