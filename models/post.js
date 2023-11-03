const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const AVATAR_PATH = path.join('/uploads/posts/images')
const Comment = require('../models/comment')
const Like = require('../models/like')
const postSchema = new mongoose.Schema({
    content:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postImage:{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    emojis: [{
        type: {
            type: String, // Store emoji type (e.g., '😍')
        },
        count: {
            type: Number,
            default: 0, // Default value for count is 0
        },
      }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }],
},{
    timestamps:true
})


postSchema.pre('deleteOne',{ query: true }, async function(next) {
    console.log('im in post removve')
    const query = this.getFilter();
    const postId = query._id;
    console.log("postId",postId)
    await Like.deleteMany({likeable:postId})
    const deletedCommentIds = (await Comment.find({ post: postId }, '_id')).map(comment => comment._id);
    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ likeable: { $in: deletedCommentIds } });
  });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"..",AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})

postSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar')
postSchema.statics.avatarPath = AVATAR_PATH

const Post = mongoose.model('Post',postSchema)
module.exports = Post