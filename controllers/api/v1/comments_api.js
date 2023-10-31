const Post = require('../../../models/post')
const Comment = require('../../../models/comment')
const Conversation = require('../../../models/conversation')
const Message  = require('../../../models/message')
const User = require('../../../models/users')
module.exports.create = async function(req,res){
    let userId = req.user.id
    let content = req.body.comment_content
    let postId = req.body.postId
    let post = await Post.findById(postId)
    if(post){
        let comment = await Comment.create({
            content,
            user:userId,
            post:postId
        })
        post.comments.push(comment)
        post.save()
        comment = await comment.populate('user','fullName email avatar')
        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment:comment,
                    postId:postId,
                    count:post.comments.length
                },
                message:'Cooment created'
            })
        }
        req.flash('success','Comment published')
        return res.redirect('/')
    }
}


module.exports.getComments = async function(req,res){
    try{
        let id = req.params.id
        let post = await Post.findById(id).populate({
            path:'comments',
            options: { sort: { createdAt: -1 } }, 
            populate: [
                { path: 'user' },
                { path: 'likes' }
              ]
        })
        return res.render('_comment.ejs', {
            title: "Facebook | Comments",
            post:post
          })
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}