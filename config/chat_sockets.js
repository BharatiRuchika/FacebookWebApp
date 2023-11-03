// Import required models and modules
const User = require('../models/users')
const Conversation = require('../models/conversation')
const Message = require('../models/message')

// Export a function to handle chat-related socket events
module.exports.chatSockets = function(socketServer){
    const users = {};

    // Initialize the Socket.IO server and configure CORS settings
    let io = require('socket.io')(socketServer,{
        cors: {
            origin: '*', 
            methods: ['GET', 'POST'],
          },
    })

    // Handle new socket connections
    io.sockets.on('connection',function(socket){
        console.log('new connnection received',socket.id)
        // Listen for a "user_connected" event to map users to their sockets
        socket.on('user_connected', (user) => {
            users[user.id] = socket;
        });

         // Handle disconnections and leave chat rooms
        socket.on('disconnect',function(){
            socket.disconnect()
            socket.leave('codeial');
        })

        // Listen for "join_room" events and broadcast to the chatroom
        socket.on('join_room',function(data){
            socket.join(data.chatroom)
            io.in(data.chatroom).emit('user_joined',data)
        })

         // Listen for "send_message" events and broadcast to the chatroom
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data)
        })

        // Handle sending friend requests
        socket.on('send_friend_request', async(data) => {
            const { senderUserId, targetUserId } = data;
            const targetSocket = users[targetUserId];
            let senderUser = await User.findById(senderUserId)
            if (targetSocket) {
                // Emit a 'friend_request' event to the target user's socket
                targetSocket.emit('friend_request', {
                    senderUserId,
                    targetUserId,
                    senderUser
                });
            }
        });
        
        // Handle sending and receiving messages between users
        socket.on('send_message',async(data)=>{
            const targetSocket = users[data.recipientId];
            const senderSocket = users[data.senderId]
            let senderUser = await User.findById(data.senderId)
            let targetUser = await User.findById(data.recipientId)
            // Create a new conversation and message
            const newConversation = await Conversation.findOneAndUpdate(
                {
                    $or: [
                        { sender: data.senderId, recipient: data.recipientId },
                        { sender: data.recipientId, recipient: data.senderId },
                      ],
                },
                {
                recipient: data.recipientId,
                  sender:data.senderId,
                  text:data.messageText,
                  isSeenByRecipient:false
                },
                { new: true, upsert: true }
              );
              const newMessage = new Message({
                conversation: newConversation._id,
                sender: data.senderId,
                recipient:data.recipientId,
                text:data.messageText
              });
              await newMessage.save();

            if(targetSocket){
                // Emit a 'receive_target_msg' event to the target user's socket
                targetSocket.emit('receive_target_msg',{senderUser,messageText:data.messageText,conversation:newConversation})
            }
             // Emit a 'receive_sender_msg' event to the sender's socket
            senderSocket.emit('receive_sender_msg',{targetUser,messageText:data.messageText,conversation:newConversation})
        })
        
         // Handle leaving chat rooms
        socket.on('leave_room', function (data) {
            console.log('im in leave room')
            const { chatroom } = data;
            socket.leave(chatroom);
        });  
    })
}