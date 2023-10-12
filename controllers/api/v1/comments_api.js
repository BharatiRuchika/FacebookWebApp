const Post = require('../../../models/post')
const Comment = require('../../../models/comment')
module.exports.create = async function(req,res){
    console.log('body',req.body)
    // console.log('id',req.query.postId)
    let userId = req.user.id
    let content = req.body.comment_content
    let postId = req.body.postId
    let post = await Post.findById(postId)
    console.log('post',post)
    if(post){
        let comment = await Comment.create({
            content,
            user:userId,
            post:postId
        })
       
        post.comments.push(comment)
        post.save()
        comment = await comment.populate('user','fullName email avatar')
        console.log('comment',comment)
        if(req.xhr){
            console.log('im in xhr')
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
        console.log('im here also')
        return res.redirect('/')
    }
}