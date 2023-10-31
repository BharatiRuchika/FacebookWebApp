const User = require("../../../models/users")
const Post = require('../../../models/post')
const Comment = require('../../../models/comment')
const Like = require('../../../models/like')
const Friendship = require('../../../models/friendship')
const Conversation = require("../../../models/conversation")
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

// Sign In Route
module.exports.signIn = function(req,res){    
    // Check if the user is already authenticated and redirect if so
    if (req.isAuthenticated()){
        return res.redirect("/")
    }

    // Render the sign-in page
    return res.render('user_sign_in',{
        title:"Facebook | Signin"
    })
}

// Display Profile Picture Form
module.exports.display_profile_picture_form = async function(req,res){
    try{
        // Check if the user is authenticated
        if (req.isAuthenticated()){
            return res.render('update_profile_pic',{
            title:"Facebook | Update Profile Picture",
        })
    }
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
} 

// Update Profile Picture
module.exports.updateProfilePicture = async function(req,res) {
    try{
        let user = await User.findById(req.user.id)
        // Handle file upload using Multer
        User.uploadedAvatar(req,res,function(err){
            if(err){
                console.log('****Multer Error',err)
            }
            // If a file is uploaded, update the user's avatar
            if(req.file){
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname,'../../../',user.avatar))
                }
                user.avatar = User.avatarPath+ "/" + req.file.filename
            }

            // Save the updated user
            user.save()
            // Redirect with a success message
            req.flash('success','User Updated Succesfully')
            return res.redirect(`/api/v1/users/display-profile/${req.user.id}`)
        })
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}

// Display User Profile
module.exports.displayUserProfile = async function(req,res){
    try{
        if (req.isAuthenticated()){
            let params = req.params.id

            // Populate the user's profile with posts, friends, and other data
            let UserInfo = await User.findById(params).populate({
                path: 'posts',    // Populate the user's posts
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                    path: 'comments likes',   // For each post, populate comments and likes
                    options: { sort: { createdAt: -1 } },
                    populate: {
                    path: 'user',      // For each comment/like, populate the user who created it
                    },
                },
            {
            path: 'user', 
            },
        ],
  }).populate({
      path: 'friendships', // Populate the user's friends (assuming the 'friendships' field contains friend IDs)
      options: { sort: { createdAt: -1 } }, 
    });

    console.log('UserInfo',UserInfo)
    // Check if the user is a friend of the profile owner
    const isFriend = UserInfo.friendships.some(friend => friend.id === req.user.id );

    if (isFriend) {
        console.log("The user is your friend.");
    } else {
        console.log("The user is not in your list of friends.");
    }

    // Retrieve the friendship status
    let friendshipsStatus = await Friendship.findOne({
        from_user:req.user.id,
        to_user:req.params.id
    })
    // Render the user profile page
    return res.render('user_profile',{
        title:"Facebook | Profile",
        curr_user:req.user.id,
        userInfo:UserInfo,
        friendshipsStatus:friendshipsStatus,
        isFriend:isFriend
    })
    }else{
        // Redirect to sign-in page if the user is not authenticated
        return res.render('user_sign_in',{
            title:"Facebook | SignIn"
            })
        }
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }  
}

// Sign Up Route
module.exports.signUp = function(req,res){
    try{
        // Check if the user is already authenticated and redirect if so
        if (req.isAuthenticated()){
            return res.redirect("/")
        }
        // Render the sign-up page
        return res.render('user_sign_up',{
            title:"Facebook | SignUp"
        })
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}


// Display Create Post Page
module.exports.displayPost = async function(req,res){
    try{
        // Check if the user is authenticated and render the create post page
        if (req.isAuthenticated()){
            return res.render('create_post',{
                title:"Facebook | CreatePost",
                
            })
        }
        // Redirect to sign-in page if the user is not authenticated
        return res.render('user_sign_in',{
            title:"Facebook | Signin"
        })
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    } 
}

// Update User Bio
module.exports.updateBio = async function(req,res){
    try{
        let user = await User.findById(req.user.id)
        user.bio = req.body.bio
        user.save()
        // Flash a success message and redirect
        req.flash('success','Bio updated')
        return res.redirect(`/api/v1/users/display-profile/${req.user.id}`)
    }catch(error){
        console.log('error',error)
    }
}

// Update User Information
module.exports.updateUser = async function(req,res){
    try{
        
        let {relationshipStatus,dateOfBirth,college,city} = req.body
        let user = await User.findByIdAndUpdate(req.user.id,{
            relationshipStatus,
            dateOfBirth,
            college,
            city
        })
        // Flash a success message and redirect
        req.flash('success','User updated')
        return res.redirect(`/api/v1/users/display-profile/${req.user.id}`)
    }catch(error){
        console.log('error',error)
    }
}

// Create a New Post
module.exports.createPost = async  function(req,res) {
    let id = req.user.id
    let user = await User.findById(req.user.id)     
    // Create a new post
    let post = await Post.create({
        user:id,
        content:req.body.content
    })
    // Add the post to the user's posts
    user.posts.push(post._id)
    user.save()
    if(req.file){
        post.postImage = Post.avatarPath+ "/" + req.file.filename
    }
    post.save()
    // Check if the request is an AJAX request and respond accordingly
    if(req.xhr){
        return res.status(200).json({
            data:{
                post:post
            },
            message:'Post created!'
        })
    }
    req.flash('success','Post published')
    
    
}

// Edit User Information
module.exports.edit = async function(req,res) {
    let user = await User.findById(req.user.id)
    return res.render('edit_user',{
        title:"Facebook | edit_user",
        user:user,
    })
}

// Add Bio Page
module.exports.addBio = async function(req,res) {
    let user = await User.findById(req.user.id)
    return res.render('bio',{
        title:"Facebook | Bio",
        user:user,
    })
}

// Create a New User (Sign Up)
module.exports.create = async function(req,res){
    try{
    const {fullName,email,password,dateOfBirth} = req.body
    // Check if the password matches the confirmation
    if(req.body.password!=req.body.confirmPassword){
        return res.redirect('/api/v1/users/sign-up')
    }   
    // Check if the user already exists
    const user = await User.findOne({email})
    if(!user){
        // Create a new user
        const data = await User.create({
            fullName,
            email,
            password,
            dateOfBirth
        })
        // Flash a success message and redirect
        req.flash('success','sign up successfully')
        return res.redirect('/')
    }else{
        // Flash an error message and redirect to sign-up page
        req.flash('error','User already present')
        return res.redirect('/api/v1/users/sign-up')
    }
    }catch(error){
        console.log('error',error)
        return res.redirect('/api/v1/users/sign-up')
    }
}


// Create User Session (Log In)
module.exports.createSession = async function(req,res){
    try{
        // Flash a success message and redirect to the homepage
        req.flash('success','logged in successfully')
        return res.redirect('/')
    }catch(error){
        console.log("*******",error)
        return res.status(401).json({
            message:'Internal Server Error'
        })
    }
}

// Send Friend Request
module.exports.sendFriendRequest = async function(req,res){
    try{
        let {senderId,targetId} = req.body
        let targetUser = await User.findById(targetId)
        let senderUser = await User.findById(senderId)
         // Create a new friendship record with "pending" status
        let friendship = await Friendship.create({
            from_user:senderId,
            to_user:targetId,
            status:'pending'
        })
        console.log('friendship',friendship)
        if(req.xhr){
            // If this is an AJAX request, send a JSON response
            return res.status(200).json({
                data:{
                    friendship:friendship,
                    senderUser:senderUser,
                    success:true
                },
                message:'Request Sent!'
            })
        }
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}

// Accept Friend Request
module.exports.acceptFriendRequest = async function(req,res){
    try{
        let {from_user} = req.body
        let to_user = req.user.id
        let friendship = await Friendship.findOne({from_user,to_user})
        if(friendship.status=='pending'){
            // Change the friendship status to "accepted"
            friendship.status='accepted'
            friendship.save()
        }
        let user1 = await User.findById(to_user)
        let user2 = await User.findById(from_user)
        user1.friendships.push(from_user)
        user2.friendships.push(to_user)
        user1.save()
        user2.save()
        if(req.xhr){
            // If this is an AJAX request, send a JSON response
            return res.status(200).json({
                data:{
                    success:true
                },
                message:'Request Accepted!'
            })
        }
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}

// Reject Friend Request
module.exports.rejectFriendRequest = async function(req,res){
    console.log('im in rejectFriendRequest')
    try{
        let {from_user} = req.body
        let to_user = req.user.id
        let friendship = await Friendship.findOne({from_user,to_user})
        if(friendship.status=='pending'){
            friendship.status='rejected'
            friendship.save()
        }
        if(req.xhr){
            // If this is an AJAX request, send a JSON response
            return res.status(200).json({
                data:{
                    success:true
                },
                message:'Request Rejected!'
            })
        }
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}

// Destroy User Session (Log Out)
module.exports.destroySession = function(req,res){
    req.logout(()=>{
    }); 
  res.clearCookie('facebook'); 
return res.redirect("/")
}

// Get All Friends
module.exports.getAllFriends = async function(req,res){
    try{
        // Retrieve and render the user's friends
        let userInfo = await User.findById(req.params.id).populate({
            path: 'friendships', 
            options: { sort: { createdAt: -1 } }, 
          })
          return res.render('friends', {
            title: "Facebook | Friends",
            friends:userInfo.friendships
          })
        
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}

// Get All Users
module.exports.getAllUsers = async function(req,res){
    try{
         // Retrieve and render all users except the current user
        let all_users = await User.find({ _id: { $ne: req.user._id } });
        return res.render('all_users', {
            title: "Facebook | all_users",
            all_users:all_users
          })
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}


// Delete Item (Post or Comment)
module.exports.deleteItem = async function(req,res){
    try{
        let Id = req.query.id
        let type = req.query.type
        if(type=='Post'){
            // Delete a post and remove it from the user's posts
            await Post.deleteOne({ _id: Id });
            let user = await User.findById(req.user._id)
            user.posts.pull(Id)
            user.save().then(() => {
                console.log('user saved');
            })
        }else{
            var postId = req.query.postId
            // Delete a comment and remove it from the post's comments
            await Comment.deleteOne({_id:Id}) 
            let post = await Post.findById(postId)
            post.comments.pull(Id)
            post.save().then(() => {
                console.log('user saved');
            })
        }
        if(req.xhr){
            // If this is an AJAX request, send a JSON response
            if(postId){
                var PostId = postId
            }else{
                var PostId = null
            }

            return res.status(200).json({
                data:{
                    success:true,
                    Id,
                    type,
                    PostId
                },
                message:'Item Deleted!'
            })
        }
        
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}

// Get All Posts for a User
module.exports.getAllPost = async function(req,res){
    try{
        // Find the user by the provided ID and populate their posts with post images
        let user = await User.findById(req.params.id).populate({
            path: 'posts', 
            match: { postImage: { $exists: true } },// Filter posts with images
            options: { sort: { createdAt: -1 } }, // Sort posts by creation date
        })
        return res.render('all_posts', {
            title: "Facebook | all_posts",
            all_posts: user.posts
        })
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}