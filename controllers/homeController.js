const Post = require('../models/post')
const User = require('../models/users')
const Comment = require('../models/comment')
const Like = require('../models/like')
module.exports.home = async function(req,res){
    console.log('im in home')
    // console.log('user',locals.user)
    try{
        let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
            path:'comments',
            populate: [
                { path: 'user' },
                { path: 'likes' }
              ]
        }).populate('likes')
        posts.forEach((post) => {
            post.liked = false
        })

        posts.forEach((post) => {
            post.comments.forEach((comment)=>{
                comment.liked = false
            })
        })
        
        posts.forEach((post) => {
            post.likes.forEach((post_like)=>{
                if(post_like.user==req.user.id){
                    console.log('true')
                    post.liked = true
                }
            })
        });
        posts.forEach((post) => {
            console.log('post.comments', post.comments);
            post.comments.forEach((comment)=>{
                comment.likes.forEach((like)=>{
                    console.log('im in like')
                    if(like.user==req.user.id){
                        console.log('true')
                        comment.liked = true
                    }
                })
            })
        });
        posts.forEach((post) => {
            post.comments.forEach((comment)=>{
                console.log('liked',comment.liked)
            })
        })
        console.log('posts',posts)
        let users = await User.find({})
        return res.render('home',{
            title:"Home",
            posts:posts,
            all_users:users,
            curr_user:req.user.id
        })
    }catch(err){
        console.log('err',err)
    }
    // return res.end('<h1>Express is up for codeil</h1>')
}

module.exports.Home = async function(req,res){
    try{
        return res.render('Home1',{
            title:"Home",
            // posts:posts,
            // all_users:users
        })
    }catch(err){
        console.log('err',err)
    }
}