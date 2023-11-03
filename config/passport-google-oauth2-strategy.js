const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')
const User = require('../models/users')
const env = require('./environment')
// Configure the Google OAuth2 authentication strategy
passport.use(new googleStrategy({
    clientID:'486580541656-dfq1bj5j32381apha87b5h533mrs4org.apps.googleusercontent.com',  // Google OAuth client ID
    clientSecret:'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',    // Google OAuth client secret
    callbackURL:'http://localhost:8000/api/v1/users/auth/googlle/callback'    // Callback URL after Google authentication
},function(accessToken,refreshToken,profile,done){
    // Callback function when Google authentication is successful
    // Log the user's Google profile
    console.log('profile',profile)
    // Find a user in your application's database by email
    User.findOne({email:profile.emails[0].value}).exec().then(async(user)=>{
        if(user){
            return done(null,user)
        }else{
            const result = await cloudinary.v2.uploader.upload(profile._json.picture, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            })
            console.log('result',result)        
            // If the user doesn't exist, create a new user using Google profile data
            User.create({
                fullName:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex'), 
                avatar:{
                    public_id:result.public_id,
                    url:result.secure_url
                },
            }).then((user)=>{
                return done(null,user)
            })
        }
    })
}))

// Export the Passport configuration
module.exports = passport