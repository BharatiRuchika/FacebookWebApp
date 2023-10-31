const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')
const User = require('../models/users')
const env = require('./environment')
// Configure the Google OAuth2 authentication strategy
passport.use(new googleStrategy({
    clientID:env.google_client_id,  // Google OAuth client ID
    clientSecret:env.google_client_secret,    // Google OAuth client secret
    callbackURL:env.google_call_back_url    // Callback URL after Google authentication
},function(accessToken,refreshToken,profile,done){
    // Callback function when Google authentication is successful
    // Log the user's Google profile
    console.log('profile',profile)
    // Find a user in your application's database by email
    User.findOne({email:profile.emails[0].value}).exec().then((user)=>{
        if(user){
            return done(null,user)
        }else{
            // If the user doesn't exist, create a new user using Google profile data
            User.create({
                fullName:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex'), // Generate a random password
                avatar:profile._json.picture   // Use the Google profile picture as the user's avatar
            }).then((user)=>{
                // Return the newly created user to Passport
                return done(null,user)
            })
        }
    })
}))

// Export the Passport configuration
module.exports = passport