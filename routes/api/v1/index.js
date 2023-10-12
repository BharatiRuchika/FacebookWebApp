const express = require("express");
const router = express.Router();
const passport = require('passport')
// const homeController = require("../controllers/home_controller")
// router.get("/",homeController.home)
// router.use('/posts',require('./posts'))
router.use('/users',require('./users'))
router.use('/likes',require("./likes"))


router.use('/post',require("./posts"))
router.use('/comment',require("./comments"))
// router.use('/comments',require('./comments'))

module.exports = router