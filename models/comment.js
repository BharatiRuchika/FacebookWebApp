const mongoose = require('mongoose')
const Like = require('../models/like')
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


commentSchema.pre('deleteOne', { query: true }, async function(next) {
    console.log('im in post remove')
    const query = this.getFilter();
    const commentId = query._id;
    console.log("commentId",commentId)
    await Like.deleteMany({likeable:commentId})
});

const Comment =  mongoose.model('Comment',commentSchema)
module.exports = Comment

