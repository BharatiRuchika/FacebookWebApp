const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: "Conversation" },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    text:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Message = mongoose.model('Message',messageSchema)
module.exports = Message