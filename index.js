const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const env = require('./config/environment')
const app = express();
app.use(cors());
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
app.use('/uploads',express.static(__dirname + '/uploads'))
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy')
const passportGithub = require('./config/passport-github-strategy')
const passportFacebook = require('./config/passport-facebook-strategy')
const chatServer = require('http').Server(app)
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer)
chatServer.listen(5001)
console.log('chat server is listening on port 5001')
const flash = require('connect-flash')
const custumMware = require('./config/middleware')
const Data = require('./config/middleware')
app.use(express.urlencoded())
app.use(cookieParser())
app.use(expressLayouts);
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)
app.use(express.static(env.asset_path))
app.use('/uploads',express.static(__dirname + '/uploads'))
app.set('view engine','ejs')
app.set('views','./views')

const mongoStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'Facebook',
});
app.use(session({
    name: 'facebook',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: mongoStore
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
