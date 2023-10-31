const mongoose = require('mongoose')
const conversationSchema = new mongoose.Schema({
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
    },
    // isSeenBySender:{
    //     type: Boolean,
    //     default: false
    // },
    isSeenByRecipient: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})

const Conversation = mongoose.model('Conversation',conversationSchema)
module.exports = Conversation