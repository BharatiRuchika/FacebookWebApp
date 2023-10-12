const express = require("express");
const router = express.Router();
console.log("router loaded")
const homeController = require("../controllers/homeController");
const passport = require("passport");
router.get("/",passport.checkAuthentication,homeController.home)
router.post("/home",homeController.Home)
router.use('/api',require('./api'))
module.exports = router