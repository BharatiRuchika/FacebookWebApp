const Comment = require('../../../models/comment')
const Post = require('../../../models/post')
const Like = require('../../../models/like')
module.exports.toggleLike = async function(req,res){
    try{
        let Id = req.query.id
        let type = req.query.type
        let emojiType = req.query.emojiType
        let emoji = req.query.emoji
        let likeable;
        let deleted = false;
        if(type=='Post'){
            likeable = await Post.findById(Id).populate('likes')
        }else{
            likeable = await Comment.findById(Id).populate('likes')  
        }
        const emojiIndex = likeable.emojis.findIndex((emoji) => emoji.type === emojiType);    
        let existingLike = await Like.findOne({
            likeable : Id,
            onModel : req.query.type,
            user : req.user.id,
        })
        if(existingLike){
            let existingemoji = existingLike.emojiType
            if(existingemoji==emojiType){
                deleted = true
                likeable.emojis[emojiIndex].count = likeable.emojis[emojiIndex].count - 1;
                likeable.likes.pull(existingLike._id)
                await Like.deleteOne({_id:existingLike._id})
            }else{
                await Like.findOneAndUpdate(existingLike._id,{
                    emojiType:emojiType,
                    emoji:emoji
                })
                let index =  likeable.emojis.findIndex((element) => element.type==existingemoji);
                likeable.emojis[index].count = likeable.emojis[index].count - 1;
                if(emojiIndex==-1){
                    await likeable.emojis.push({
                        type : emojiType,
                        count : 1
                    })
                }else{
                    likeable.emojis[emojiIndex].count = likeable.emojis[emojiIndex].count + 1;
                } 
            }
            likeable.save().then(() => {
                console.log('likeable saved');
            })
        }else{
            let newLike = await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type,
                emojiType:emojiType,
                emoji:emoji
            })
            if(emojiIndex==-1){
                await likeable.emojis.push({
                    type : emojiType,
                    count : 1
                })
            }else{
                likeable.emojis[emojiIndex].count = likeable.emojis[emojiIndex].count + 1;
            }
            likeable.likes.push(newLike._id)
            likeable.save().then(() => {
                console.log('likeable saved');
            })
        }
        if(req.xhr){
            return res.status(200).json({
                message:'request successful!',
                data: {
                    deleted:deleted,
                    id:req.query.id,
                    likeable:likeable,
                    emojiType:emojiType,
                    emoji:emoji,
                    type:type
                }
            })
        }
        req.flash('success','Like Updated')
        return res.redirect("/")
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}