const Comment = require('../../../models/comment')
const Post = require('../../../models/post')
const Like = require('../../../models/like')
module.exports.toggleLike = async function(req,res){
    console.log("im in toggleLike")
    console.log('id',req.query.id)
    console.log('type',req.query.type)
    console.log('emoji',req.query.emoji)
    let postId = req.query.id
    let type = req.query.type
    let emojiType = req.query.emoji
    try{
        let likeable;
        let deleted = false;
        if(type=='Post'){
            likeable = await Post.findById(postId).populate('likes')
        }else{
            likeable = await Comment.findById(postId).populate('likes')
            
        }
        const emojiIndex = likeable.emojis.findIndex((emoji) => emoji.type === emojiType);
        console.log('emojiIndex',emojiIndex)
        // console.log('likeable',likeable)
        
        let existingLike = await Like.findOneAndRemove({
            likeable : req.query.id,
            onModel : req.query.type,
            user : req.user.id,
            emoji : emojiType
        })

    
        if(existingLike){
            console.log('im in existing like')
            console.log('ifcount',likeable.emojis[emojiIndex].count)
            likeable.emojis[emojiIndex].count = likeable.emojis[emojiIndex].count - 1;
            console.log('ifcount1',likeable.emojis[emojiIndex].count)
            likeable.likes.pull(existingLike._id)
            deleted = true
            likeable.save().then(() => {
                // The save operation is complete here
                console.log('likeable saved');
            })
            
        }else{
            console.log('im in else like')
            let newLike = await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type,
                emoji:emojiType
            })
            if(emojiIndex==-1){
                console.log('im in -1')
                await likeable.emojis.push({
                    type : emojiType,
                    count : 1
                })
            }else{
                console.log('elsecount',likeable.emojis[emojiIndex].count)
                likeable.emojis[emojiIndex].count = likeable.emojis[emojiIndex].count + 1;
                console.log('elsecount1',likeable.emojis[emojiIndex].count)
            }
            likeable.likes.push(newLike._id)
            likeable.save().then(() => {
                // The save operation is complete here
                console.log('likeable saved');
            })
        }
        console.log('likeable',likeable.emojis)
        if(req.xhr){
            return res.status(200).json({
                message:'request successful!',
                data: {
                    deleted:deleted,
                    id:req.query.id,
                    likeable:likeable
                }
            })
        }
        req.flash('success','Like Updated')
        return res.redirect("/")
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}