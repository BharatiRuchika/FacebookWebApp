const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/users')
const passport = require('passport')
const crypto = require('crypto')

// Configure the GitHub authentication strategy
passport.use(new GitHubStrategy({
    clientID: 'cee1ba1361c184767359',    // GitHub OAuth client ID
    clientSecret: '6042933e8cc766a729ec071e63df4a218e50bb1c',    // GitHub OAuth client secret
    callbackURL: 'http://localhost:8000/api/v1/users/auth/github/callback',    // Callback URL after GitHub authentication
    scope: ['user:email,displayName'],     // Requested user data scope
},
function(accessToken, refreshToken, profile, done) {
    console.log('profile email',profile)
    // Callback function when GitHub authentication is successful

    // Log the user's GitHub profile email
    User.findOne({email:profile.emails[0].value}).exec().then((user)=>{
        if(user){
             // If the user already exists, return the user to Passport
            return done(null,user)
        }else{
            // If the user doesn't exist, create a new user using GitHub profile data
            User.create({
                fullName:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex'),
                avatar:profile._json.avatar_url
            }).then((user)=>{
                 // Return the newly created user to Passport
                return done(null,user)
            })
        }
    })
    
}));



// This code configures the GitHub authentication strategy using Passport.js.
// It allows users to log in or sign up using their GitHub accounts.










