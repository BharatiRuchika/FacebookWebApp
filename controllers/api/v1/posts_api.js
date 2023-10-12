const Post = require('../../../models/post')
const Like = require('../../../models/like')
module.exports.updatePost = async function(req,res){
    try{
    let emojiType = req.body.emojiType
    let postId = req.query.postId
    let post = await Post.findById(postId)
    let likeable;
    let deleted = false;
    const emojiIndex = post.emojis.findIndex((emoji) => emoji.type === emojiType);
    if(emojiIndex==-1){
        post.emojis.push({
            type:emojiType,
            count:1
        })
        await post.save();
    }
    if(req.query.type=='Post'){
        likeable = await Post.findById(req.query.id).populate('likes')
        console.log('likeable',likeable)
    }else{
        likeable = await Comment.findById(req.query.id).populate('likes')
        console.log('likeable',likeable) 
    }
    let existingLike = await Like.findOneAndRemove({
        likeable:req.query.id,
        onModel:req.query.type,
        user:req.user.id
    })

    if(existingLike){
        likeable.likes.pull(existingLike._id)
        likeable.save()
        deleted = true
        post.emojis[emojiIndex].count -= 1;
        await post.save()
        
    }else{
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

    
    console.log('post',post)
    if(req.xhr){
        return res.status(200).json({
            data:{
                post:'post'
            },
            message:'Post created!'
        })
    }
   
    }catch(error){
        console.log('error',error)
        return res.redirect('/api/v1/users/sign-up')
    }
    
}