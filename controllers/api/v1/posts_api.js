const Post = require('../../../models/post')
const Like = require('../../../models/like')
module.exports.updatePost = async function(req,res){
    try{
        // Extract parameters from the request
        let emojiType = req.body.emojiType
        let postId = req.query.postId
        // Find the post by its ID
        let post = await Post.findById(postId)
        let likeable;
        let deleted = false;
        // Find the index of the emoji in the post's emojis array
        const emojiIndex = post.emojis.findIndex((emoji) => emoji.type === emojiType);
        // If the emoji is not found in the post's emojis, add it with a count of 1
        if(emojiIndex==-1){
            post.emojis.push({
                type:emojiType,
                count:1
            })
            await post.save();
        }
        if(req.query.type=='Post'){
             // If the like is for a post, find the Post model and populate its likes
            likeable = await Post.findById(req.query.id).populate('likes')
        }else{
            // If the like is for a comment, find the Comment model and populate its likes
            likeable = await Comment.findById(req.query.id).populate('likes')
        }
         // Find and remove an existing like for the user and specified likeable
        let existingLike = await Like.findOneAndRemove({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user.id
        })

        if(existingLike){
             // If the like exists and is removed, update likeable and post data
            likeable.likes.pull(existingLike._id)
            likeable.save()
            deleted = true
            post.emojis[emojiIndex].count -= 1;
            await post.save()  
        }else{
            // If the like doesn't exist, create a new like and update likeable and post data
            let newLike = await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            })
            likeable.likes.push(newLike._id)
            likeable.save()
            post.emojis[emojiIndex].count += 1;
            await post.save()
        }
        if(req.xhr){
            return res.status(200).json({
                data:{
                post:'post'
                },
                message:'Post created!'
            })
        }
    }catch(error){
        return res.redirect('/api/v1/users/sign-up')
    }
}