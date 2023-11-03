const mongoose = require("mongoose")
const multer = require('multer')
const path = require('path')
const user = require('../models/post')
const AVATAR_PATH = path.join('/uploads/users/avatars')
const bcrypt = require("bcryptjs");
const crypto = require('crypto')
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:Date,
    },
    city:{
        type:String
    },
    bio:{
        type:String
    },
    college:{
        type:String
    },
    relationshipStatus:{
        type:String
    },
    avatar:{
        // type:String
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    friendships:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{
    timestamps:true
})


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hashSync(this.password, 10);
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(this.password);
    console.log(enteredPassword);
    return await bcrypt.compareSync(enteredPassword, this.password);
}

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname,"..",AVATAR_PATH))
//     },
//     filename: function (req, file, cb) {
//     console.log('filename',file.fieldname)
//       cb(null, file.fieldname + '-' + Date.now())
//     }
// })

// userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar')
// userSchema.statics.avatarPath = AVATAR_PATH
const User = mongoose.model('User',userSchema)
module.exports = User