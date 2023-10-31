const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users')
const crypto = require('crypto')
passport.use(
    new FacebookStrategy(
      {
        clientID: '1047606343249479',
        clientSecret: 'f9f71ddad59e2220c5e600809878545e',
        callbackURL: 'http://localhost:8000/api/v1/users/auth/facebook/callback',
        scope: ['user:email,displayName'],
      },
      function (accessToken, refreshToken, profile, done) {
        console.log('profile email',profile)
        User.findOne({email:profile.emails[0].value}).exec().then((user)=>{
            // console.log(profile)
            if(user){
                return done(null,user)
            }else{
                User.create({
                    fullName:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                    avatar:profile._json.avatar_url
                }).then((user)=>{
                    return done(null,user)
                })
            }
        })
      }
    )
  );