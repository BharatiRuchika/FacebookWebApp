const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')
const User = require('../models/users')
passport.use(new googleStrategy({
    clientID:'2152376479-miv8fb91vnos5ljjdntfp9nm8qgiidv7.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:8000/users/auth/google/callback'
},function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec().then((user)=>{
        console.log(profile)
        if(user){
            return done(null,user)
        }else{
            User.create({
                fullName:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            }).then((user)=>{
                return done(null,user)
            })
        }
    })
}))

module.exports = passport