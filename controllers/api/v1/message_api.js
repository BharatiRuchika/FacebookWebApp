const Conversation = require('../../../models/conversation')
const Message  = require('../../../models/message')
const User = require('../../../models/users')
const Friendship = require('../../../models/friendship')
module.exports.createMessage = async function(req,res){
    try{
    let {messageText,recipientId} = req.body
    const newConversation = await Conversation.findOneAndUpdate(
        {
            recipient:recipientId,
            sender:req.user._id
        },
        {
        recipient: recipientId,
          sender:req.user._id,
          text:messageText
        },
        { new: true, upsert: true }
      );
      const newMessage = new Message({
        conversation: newConversation._id,
        sender: req.user._id,
        recipient:recipientId,
        text:messageText
      });
      await newMessage.save();
      if(req.xhr){
        return res.status(200).json({
            data:{
                success:true,
                conversation:newConversation
            },
            message:'Messsage sent!'
        })
    }
    }catch(error){
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}

module.exports.getConversations =  async function(req, res) {
    try {
        let conversations = await Conversation.find({
            $or: [
              { recipient: req.user._id },
              { sender: req.user._id }
            ]
          })
          .populate('recipient')
          .populate('sender');
    } catch (err) {
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
}


module.exports.getMessages =  async function(req, res) {
    try {
        const messages = await Message.find({
          $or: [
            { sender: req.user._id, recipient: req.params.id },
            { sender: req.params.id, recipient: req.user._id },
          ],
        })
    } catch (err) {
        return res.status(401).json({
            message:'Internal Server Error',
            success:false
        })
    }
};

module.exports.displayMessage = async function(req,res){
  try{
      let id = req.params.id
      let conversation = await Conversation.findOne({sender:id,recipient:req.user.id})
      var isConversationStarted = true
      var alreadySeen = false
      if(conversation==null){
          isConversationStarted = false
      }else{
        if(conversation.isSeenByRecipient==false){
          conversation.isSeenByRecipient = true
          conversation.save().then(()=>{
        })
      }else{
          alreadySeen = true
      }
    }
    if(req.xhr){
      return res.status(200).json({
        data:{
          id:id,
          isConversationStarted:isConversationStarted,
          alreadySeen:alreadySeen
        },
        success: true,
      });
    } 
  }catch(error){
    return res.status(401).json({
      message:'Internal Server Error',
      success:false
  })
  }
}

module.exports.openMessages = async function(req,res) {
  try{
    let id = req.params.id
    let recipientUserInfo = await User.findById(id)
          .populate({
            path: 'posts', // Populate the user's posts
            populate: {
            path: 'comments likes', // For each post, populate comments and likes
            populate: {
            path: 'user', // For each comment/like, populate the user who created it
            },
          },
        }).populate({
          path: 'friendships', // Populate the user's friends (assuming the 'friendships' field contains friend IDs)
        })
        const messages = await Message.find({
          $or: [
            { sender: req.user.id, recipient: req.params.id },
            { sender: req.params.id, recipient: req.user.id },
          ],
        }).populate('recipient')
        .populate('sender'); 
          return res.render('display_message_form', {
            title: "Facebook | Message",
            recipientUserInfo: recipientUserInfo,
            messages: messages,
          })
  }catch(error){
    return res.status(401).json({
      message:'Internal Server Error',
      success:false
  })
  }
}

