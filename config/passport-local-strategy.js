const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("../models/users")
passport.use(new LocalStrategy({
    usernameField:'email',
},
function(email,password,done){
    User.findOne({email:email}).then((user)=>{
        console.log("user",user)
        if(!user || user.password!=password){
            console.log('Invalid username/password')
            return done(null,false)
        }
        return done(null,user)
    }).catch((error)=>{
        console.log('error in finding user -> Passport')
        return done(error)
    })
}
))

passport.serializeUser(function(user,done){
    done(null, user.id)
})
passport.deserializeUser(function(id,done){
    User.findById(id).then((user)=>{
        console.log('error in finding user')
        return done(null,user)
    }).catch((error)=>{
        console.log('error in finding user')
        return done(error)
    })
})

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/api/v1/users/sign-in')
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user
    }
    next()
}


module.exports = passport