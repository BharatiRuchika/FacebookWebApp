const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true,
    },
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel',
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment'],
    },
    emojiType:{
        type:String,
        required:true
    },
    emoji:{
        type:String,
        required:true
    }
}, {
    timestamps: true,
})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;











