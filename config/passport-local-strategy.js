const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("../models/users")
const Friendship = require('../models/friendship')
const Conversation = require('../models/conversation')
// Configure the LocalStrategy for username and password authentication
passport.use(new LocalStrategy({
    usernameField:'email',    // The username field is expected to be an email
},
function(email,password,done){
     // Check if a user with the provided email exists and the password matches
    User.findOne({email:email}).then((user)=>{
        if(!user || user.password!=password){
            console.log('Invalid username/password')
            return done(null,false)   
        }
        return done(null,user)    // Authentication successful
    }).catch((error)=>{
        console.log('error in finding user -> Passport')
        return done(error)
    })
}
))

// Serialize user information to the session
passport.serializeUser(function(user,done){
    done(null, user.id)
})

// Deserialize user from the session
passport.deserializeUser(function(id,done){
    User.findById(id).then((user)=>{
        console.log('error in finding user')
        return done(null,user)
    }).catch((error)=>{
        console.log('error in finding user')
        return done(error)
    })
})

// Custom middleware to check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next()       // User is authenticated, proceed to the next middleware
    }
    return res.redirect('/api/v1/users/sign-in')    // Redirect to the sign-in page if not authenticated
}

// Custom middleware to set authenticated user data and additional data for views
passport.setAuthenticatedUser = async function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user    

        // Fetch pending friend requests
        let pendingFriendRequests = await Friendship.find({
            to_user: req.user.id, 
            status: 'pending',
          }).populate('from_user')
        
          // Fetch user's conversations
          let conversations = await Conversation.find({
            $or: [
              { recipient: req.user._id },
              { sender: req.user._id }
            ]
          })
          .populate('recipient')
          .populate('sender');
       
 // Check if there are conversations that are not seen by the recipient
        let isConversationSeen = await Conversation.find({recipient:req.user.id,isSeenByRecipient:false})

        let isConversationSeenCount = isConversationSeen.length
        console.log('isConversationSeen',isConversationSeen)
        res.locals.pendingFriendRequests = pendingFriendRequests;
        res.locals.conversations = conversations
        res.locals.isConversationSeenCount = isConversationSeenCount
    }
    next()    
}

// Export the Passport configuration
module.exports = passport