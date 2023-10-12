const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    emojis: [{
        type: {
            type: String, // Store emoji type (e.g., '😍')
        },
        count: {
            type: Number,
            default: 0, // Default value for count is 0
        },
      }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
},
{timestamps:true})

const Comment =  mongoose.model('Comment',commentSchema)
module.exports = Comment

