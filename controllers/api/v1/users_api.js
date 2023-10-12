const User = require("../../../models/users")
const Post = require('../../../models/post')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
module.exports.signIn = function(req,res){
    console.log('im in sign in')
    
    if (req.isAuthenticated()){
        return res.redirect("/")
    }
    return res.render('user_sign_in',{
        title:"Facebook | Signin"
    })
}

module.exports.display_profile_picture_form = async function(req,res){
    let user = req.user
    if (req.isAuthenticated()){
        return res.render('update_profile_pic',{
            title:"Facebook | Update Profile Picture",
            user:user,
        })
    }   
    return res.render('user_sign_in',{
        title:"Facebook | SignIn"
    })

}

module.exports.updateProfilePicture = async function(req,res) {
    try{
        console.log('User',User.uploadedAvatar)
        console.log('im in updateProfilePicture')
        let user = await User.findById(req.user.id)
        console.log('file',req.file)
        User.uploadedAvatar(req,res,function(err){
            if(err){
                console.log('****Multer Error',err)
            }
            console.log(req.file)
            if(req.file){
                console.log('im in file')
                if(user.avatar){
                    console.log('im in avatar')
                    fs.unlinkSync(path.join(__dirname,'../../../',user.avatar))
                }
                user.avatar = User.avatarPath+ "/" + req.file.filename
            }
            user.save()
            req.flash('success','User Updated Succesfully')
            return res.redirect("/api/v1/users/display-profile")
        })
    }catch(error){
        console.log('error',error)
    }
}
module.exports.displayUserProfile = async function(req,res){
    // console.log('im in display user')
    // console.log('user',req.user)
    let user = req.user
    await user.populate({
        path: 'posts',
        populate: [
          { path: 'likes' },
          { path: 'comments' },
          {path: 'user'}
        ],
      });
    // console.log('user',user)
   
    if (req.isAuthenticated()){
        return res.render('user_profile',{
            title:"Facebook | Profile",
            user:user,
            curr_user:req.user.id
        })
    }   
    return res.render('user_sign_in',{
        title:"Facebook | SignIn"
    })
    
}
module.exports.signUp = function(req,res){
    // console.log('im in sign in')
    
    if (req.isAuthenticated()){
        return res.redirect("/")
    }
    return res.render('user_sign_up',{
        title:"Facebook | SignUp"
    })
}



module.exports.displayPost = function(req,res){
    if (req.isAuthenticated()){
        return res.render('create_post',{
            title:"Facebook | CreatePost"
        })
    }
   
    return res.render('user_sign_in',{
        title:"Facebook | Signin"
    }) 
}

module.exports.updateBio = async function(req,res){
    try{
    
            let user = await User.findById(req.user.id)
            user.bio = req.body.bio
            user.save()
            req.flash('success','Bio updated')
            return res.redirect('/api/v1/users/display-profile')
        
    }catch(error){
        console.log('error',error)
    }
}

module.exports.updateUser = async function(req,res){
    try{
        // console.log('body',req.body)
        let {relationshipStatus,dateOfBirth,college,city} = req.body
        let user = await User.findByIdAndUpdate(req.user.id,{
            relationshipStatus,
            dateOfBirth,
            college,
            city
        })
        req.flash('success','User updated')
        return res.redirect('/api/v1/users/display-profile')
    }catch(error){
        console.log('error',error)
    }
}

module.exports.createPost = async  function(req,res) {
   
    let id = req.user.id
    let user = await User.findById(req.user.id)

    let post = await Post.create({
        user:id,
        content:req.body.content
    })
    user.posts.push(post._id)
    user.save()
    if(req.file){
        console.log('im in file')
        post.postImage = Post.avatarPath+ "/" + req.file.filename
    }
    post.save()
  
    
    console.log('post',post)
    if(req.xhr){
        return res.status(200).json({
            data:{
                post:post
            },
            message:'Post created!'
        })
    }
    req.flash('success','Post published')
    // return res.redirect('/')
    
}

module.exports.edit = async function(req,res) {
    let user = await User.findById(req.user.id)
    console.log('user',user)
    return res.render('edit_user',{
        title:"Facebook | edit_user",
        user:user
    })
}

module.exports.addBio = async function(req,res) {
    let user = await User.findById(req.user.id)
    return res.render('bio',{
        title:"Facebook | Bio",
        user:user
    })
}


module.exports.create = async function(req,res){
    try{
    console.log('body',req.body)
    console.log(req.body.password)
    console.log(req.body.confirmPassword)
    const {fullName,email,password,dateOfBirth} = req.body
    if(req.body.password!=req.body.confirmPassword){
        return res.redirect('/api/v1/users/sign-up')
    }   
    const user = await User.findOne({email})
    if(!user){
        const data = await User.create({
            fullName,
            email,
            password,
            dateOfBirth
        })
        console.log('data',data)
        req.flash('success','sign up successfully')
        return res.redirect('/')
    }else{
        req.flash('error','User already present')
        return res.redirect('/api/v1/users/sign-up')
    }
    }catch(error){
        console.log('error',error)
        return res.redirect('/api/v1/users/sign-up')
    }
}



module.exports.createSession = async function(req,res){
    try{
        
        req.flash('success','logged in successfully')
        return res.redirect('/')
       
    }catch(error){
        console.log("*******",error)
        return res.status(401).json({
            message:'Internal Server Error'
        })
    }
}

// module.exports.createSession = async function(req,res){
//     try{
//         let user = await User.findOne({'email':req.body.email})
//         if(!user || user.password!=req.body.password){
//             return res.status(422).json({
//                 message:'Invalid username or password'
//             })
//         }
        
//         let token = jwt.sign(user.toJSON(),'blahsomething',{
//             expiresIn:'100000'
//         })
//         req.flash('success','logged in successfully')
//         localStorage.setItem("token", token);
//         return res.redirect('/')
//     }catch(error){
//         console.log("*******",error)
//         return res.status(401).json({
//             message:'Internal Server Error'
//         })
//     }
// }


module.exports.destroySession = function(req,res){
    console.log('im in destroy sesion')
    req.logout(function() {
        req.flash('success','logged out successfully')
        // Callback function to handle what should happen after logout
        // For example, you can redirect the user to a logout success page
        return res.redirect("/")
    });
}

