console.log('chat engine loaded')


class ChatEngine{
    constructor(chatBoxId,userId){
        console.log('constructor called')
        console.log('userId',userId)
        // Initialize the chat engine with the given chat box and user ID
        this.chatBox = $(`#${chatBoxId}`)
        this.socket = io.connect('http://localhost:5001')
        this.currUserId = userId

        // Check if the user is logged in
        if(this.currUserId){
            console.log('im in userEmail')
            this.connectionHandler()
        }  
    }
    connectionHandler(){
        let self = this

        // Handle socket connection
        this.socket.on('connect',function(){
            console.log('connection established using sockets') 
        })
        
        // Notify the server about the user's connection
        self.socket.emit('user_connected', { id: self.currUserId });

        // Join the 'facebook' chatroom
        self.socket.emit('join_room',{
            user_email:self.userEmail,
            chatroom:'facebook'
        })

        // Handle user joined event
        self.socket.on('user_joined',function(data){
            console.log('a user joined',data)
        })

        // Handle user sign-out
        $('#sign-out').click(function(){
            console.log('clicked')
            // self.socket.emit('disconnect')
            self.socket.emit('leave_room', { chatroom: 'codeial' });
        })

        // Handle form submission to send a new message
        $("#createMessageForm").submit(async function(e){
            e.preventDefault()
            console.log('im in submit')
            var recipientId = $("#recipientId").val();
            console.log('recipientId',recipientId)
            let formData = $(this).serialize()
            console.log('formData',formData)
            let messageText = $("#inputField").val()
            //  handleMessageSender(formData)
            self.socket.emit('send_message', { formData ,senderId:self.currUserId,recipientId,messageText});
        })

         // Handle received messages from the sender
        self.socket.on('receive_sender_msg',(data)=>{
            console.log('im in receive_sender_msg')
            const existingLi = document.querySelector(`#conversation-${data.conversation._id}`);
            console.log('existingLi',existingLi)
            console.log('receivedata',data)
            if(existingLi){
                console.log('im in existing li')
                const h6Element = existingLi.querySelector('h6');
                h6Element.textContent = `You: ${data.messageText}`;
                const friendMessagesContainer = document.getElementById('friend_messages_container');
                friendMessagesContainer.insertBefore(existingLi, friendMessagesContainer.firstElementChild);
                $(`#message-container-${data.targetUser._id}`).append('<div class="message float-right">' + data.messageText + '</div>');
                var container = $("#message-container");
                container.scrollTop(container[0].scrollHeight);

            }else{
                console.log('im in new li')
                const link = document.createElement('a');
                link.style.color = 'black'
                link.style.textDecoration = 'none'
                link.href = `http://localhost:8000/api/v1/message/display-message/${data.targetUser._id}`;
                const newLi = document.createElement(`li`);
                link.id = `conversation-${data.conversation._id}`;
                link.classList.add('message-noty');
                $(link).attr('data-seen','false')
                new ToggleNoty(link)
                let element = `
                    <div class="row modal-lists">
                        <div class="col-3 modal-profile-images">
                        <img 
                        src="${data.targetUser.avatar ? `${data.targetUser.avatar}` : 'https://i.pinimg.com/736x/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg'}" />
                        </div>
                        <div class="col-9 modal-text">
                            <div class="row">
                                <div class="col-12">
                                    
                                    <h6>You: ${data.messageText}</h6>
                                </div>
                                <div class="col-12">
                                    <span>${data.targetUser.fullName}</span>
                                </div> 
                            </div>
                        </div>
                    </div><hr/>`
            
                newLi.innerHTML = element
                link.appendChild(newLi);
                const friendMessagesContainer = document.getElementById('friend_messages_container');
                friendMessagesContainer.insertBefore(link, friendMessagesContainer.firstElementChild);
                console.log('#message-container',$('#message-container'))
                $(`#message-container-${data.targetUser._id}`).append('<div class="message float-right">' + data.messageText + '</div>');
            }
        })
// Handle received messages from the target user
        self.socket.on('receive_target_msg',(data)=>{
            console.log('im in receive_target_msg')
            const pingSound = new Audio('/Audio/bell.wav');
            pingSound.play()
            console.log('receivedata',data)
            const existingLi = document.querySelector(`#conversation-${data.conversation._id}`);
            console.log('existingLi',existingLi)
            if(existingLi){
                const h6Element = existingLi.querySelector('h6');
                h6Element.textContent = data.messageText;
                const friendMessagesContainer = document.getElementById('friend_messages_container');
                friendMessagesContainer.insertBefore(existingLi, friendMessagesContainer.firstElementChild);
                $(`#message-container-${data.senderUser._id}`).append('<div class="message float-left">' + data.messageText + '</div>');
                let messageCount = parseInt($('.message-counts').attr('data-message-requests'))
                console.log('messageCount',messageCount)
                let dataSeen = $(`#conversation-${data.conversation._id}`).attr('data-seen')
                if(dataSeen=='false'){
                    console.log('messageCount',messageCount)
                    messageCount = messageCount+1
                    $('.message-counts').text(messageCount);
                    $('.message-counts').css('display', 'block');
                    $('.message-counts').attr('data-message-requests',messageCount)
                    $(`#conversation-${data.conversation._id}`).attr('data-seen','true')
                }
                }else{
                    const link = document.createElement('a');
                    link.style.color = 'black'
                    link.style.textDecoration = 'none'
                    link.href = `/api/v1/message/display-message/${data.senderUser._id}`;
                    const newLi = document.createElement(`li`);
                    link.id = `conversation-${data.conversation._id}`;
                    link.classList.add('toggle-noty');
                    $(link).attr('data-seen','false')
                    new ToggleNoty(link)
                let element = `
                <div class="row modal-lists">
                    <div class="col-3 modal-profile-images">
                    <img 
                    src="${data.senderUser.avatar ? `${data.senderUser.avatar}` : 'https://i.pinimg.com/736x/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg'}" />
                    </div>
                    <div class="col-9 modal-text">
                        <div class="row">
                            <div class="col-12">
                                <h6>${data.messageText}</h6>
                            </div>
                            <div class="col-12">
                                <span>${data.senderUser.fullName}</span>
                            </div>
                        </div>
                    </div>
                </div><hr/>`
            
            newLi.innerHTML = element
            link.appendChild(newLi);
            const friendMessagesContainer = document.getElementById('friend_messages_container');
            friendMessagesContainer.insertBefore(link, friendMessagesContainer.firstElementChild);
            $(`#message-container-${data.senderUser._id}`).append('<div class="message float-left">' + data.messageText + '</div>');
            let messageCount = parseInt($('.message-counts').attr('data-message-requests'))
            messageCount = messageCount+1
            $('.message-counts').text(messageCount);
            $('.message-counts').css('display', 'block');
            $('.message-counts').attr('data-message-requests',messageCount)
            $(`#conversation-${data.conversation._id}`).attr('data-seen','true')
            }
        })
        
        // Handle adding a friend
        $('.add-friend-button').click(function(){
            console.log('send friend request')
            let recipientId = $(this).attr('id')
            if($(this).attr('data-click')=='false'){
                $(this).attr('data-click', 'true');
                $(this).text('Pending')
                $(this).attr('disabled',true)
                console.log('recipientId',recipientId)
                console.log('curr_user_id',self.currUserId)
                handleFriendRequest(self.currUserId,recipientId);
                self.socket.emit('send_friend_request',{
                    senderUserId: self.currUserId,
                    targetUserId: recipientId,
                })
            }
        })
    
        // Handle friend requests
        self.socket.on('friend_request', (data) => {
            console.log('im in private_request_sent')
            const { senderUserId,targetUserId,senderUser } = data;
            console.log('senderUserId',senderUserId,'targetUserId',targetUserId)
            console.log(`Message sent to user ${targetUserId}`);
            const pingSound = new Audio('/Audio/bell.wav');
            pingSound.play()
            let newFriendRequest = updateFriendRequestsList(senderUser);
            console.log('newFriendRequest',newFriendRequest)
            $('#friend_requests_container').prepend(newFriendRequest)
            let requestCount = parseInt($('.request-counts').attr('data-requests'))
            requestCount = requestCount+1
            $('.request-counts').css('display', 'block');
            $('.request-counts').text(requestCount);
            $('.request-counts').attr('data-requests',requestCount)
            
        });
        
        // Handle receiving messages
        self.socket.on('receive_message',function(data){
            console.log('message received',data.message)
            let newMessage = $('<li>')
            let messageType = 'other-message'
            if(data.user_email==self.userEmail){
                console.log('im in self')
                messageType = 'self-message'
            }
            newMessage.append($('<span>',{
                'html': data.message
            }))
            newMessage.addClass(messageType)
            $('#chat-messages-list').append(newMessage)
        })
    }
}