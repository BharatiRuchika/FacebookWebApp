const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require('express-session');
const passport = require('passport');
app.use('/uploads',express.static(__dirname + '/uploads'))
const passportLocal = require('./config/passport-local-strategy');
// const passportJWT = require('./config/passport-jwt-strategy') 
// const passportGoogle = require('./config/passport-google-oauth2-strategy')
const flash = require('connect-flash')
const custumMware = require('./config/middleware')
app.use(express.urlencoded())
app.use(cookieParser())
app.use(expressLayouts);
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)
app.use(express.static("./assets"))
app.use('/uploads',express.static(__dirname + '/uploads'))
app.set('view engine','ejs')
app.set('views','./views')
app.use(session({
    name: 'facebook',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)
app.use(flash())
app.use(custumMware.setFlash)
app.use("/",require("./routes"))

app.listen(port,function(err){
    if(err){
        console.log(`Error:${err}`)
    }
    console.log(`server is running on port ${port}`)
})
