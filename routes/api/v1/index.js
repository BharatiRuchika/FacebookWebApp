const express = require("express");
const router = express.Router();
router.use('/users',require('./users'))
router.use('/likes',require("./likes"))
router.use('/message',require("./message"))
router.use('/post',require("./posts"))
router.use('/comment',require("./comments"))
module.exports = router


